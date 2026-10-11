/**
 * lib/security/recaptcha.js
 *
 * Production-grade reCAPTCHA / Turnstile verification helper.
 *
 * Goals:
 * - Fail closed when verification is required but unavailable.
 * - Never trust client-side CAPTCHA claims.
 * - Support Cloudflare Turnstile and Google reCAPTCHA.
 * - Enforce hostname/action/score checks when configured.
 * - Prevent token replay within the current process.
 * - Keep provider secrets server-side only.
 * - Return safe, structured results without leaking provider secrets.
 *
 * Environment variables:
 *
 * Turnstile:
 *   TURNSTILE_SECRET_KEY
 *   TURNSTILE_SITE_KEY
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY
 *
 * Google reCAPTCHA:
 *   RECAPTCHA_SECRET_KEY
 *   NEXT_PUBLIC_RECAPTCHA_SITE_KEY
 *
 * Optional:
 *   CAPTCHA_PROVIDER=turnstile|recaptcha|auto|none
 *   CAPTCHA_REQUIRED=true|false
 *   CAPTCHA_MIN_SCORE=0.5
 *   CAPTCHA_EXPECTED_ACTION=login
 *   CAPTCHA_ALLOWED_HOSTNAMES=worldwidedipo.com,www.worldwidedipo.com
 *   CAPTCHA_TIMEOUT_MS=6000
 *   CAPTCHA_REPLAY_TTL_MS=120000
 */

const DEFAULT_TIMEOUT_MS = 6_000;
const DEFAULT_REPLAY_TTL_MS = 2 * 60 * 1000;
const MAX_TOKEN_LENGTH = 8_192;
const MAX_REPLAY_ENTRIES = 10_000;

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const RECAPTCHA_VERIFY_URL =
  "https://www.google.com/recaptcha/api/siteverify";

const SAFE_PROVIDERS = new Set(["turnstile", "recaptcha", "auto", "none"]);

const replayStore = new Map();

function readEnv(name) {
  const value = process.env[name];

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function parseBoolean(value, fallback = false) {
  if (!value) return fallback;

  const normalized = value.toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function parseScore(value, fallback = 0.5) {
  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(1, Math.max(0, parsed));
}

function getProvider() {
  const configured = readEnv("CAPTCHA_PROVIDER").toLowerCase();

  if (SAFE_PROVIDERS.has(configured)) {
    return configured;
  }

  if (readEnv("TURNSTILE_SECRET_KEY")) {
    return "turnstile";
  }

  if (readEnv("RECAPTCHA_SECRET_KEY")) {
    return "recaptcha";
  }

  return "none";
}

function getTimeoutMs() {
  return Math.min(
    parsePositiveInteger(
      readEnv("CAPTCHA_TIMEOUT_MS"),
      DEFAULT_TIMEOUT_MS,
    ),
    15_000,
  );
}

function getReplayTtlMs() {
  return Math.min(
    parsePositiveInteger(
      readEnv("CAPTCHA_REPLAY_TTL_MS"),
      DEFAULT_REPLAY_TTL_MS,
    ),
    10 * 60 * 1000,
  );
}

function getMinimumScore() {
  return parseScore(readEnv("CAPTCHA_MIN_SCORE"), 0.5);
}

function getAllowedHostnames() {
  return readEnv("CAPTCHA_ALLOWED_HOSTNAMES")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeToken(token) {
  if (typeof token !== "string") {
    return "";
  }

  const normalized = token.trim();

  if (!normalized || normalized.length > MAX_TOKEN_LENGTH) {
    return "";
  }

  return normalized;
}

function normalizeAction(action) {
  if (typeof action !== "string") {
    return "";
  }

  return action.trim().slice(0, 128);
}

function getClientIp(request) {
  if (!request) {
    return "";
  }

  const headers = request.headers;

  if (!headers) {
    return "";
  }

  // Prefer platform-provided client IP headers.
  const candidates = [
    headers.get?.("cf-connecting-ip"),
    headers.get?.("x-real-ip"),
    headers.get?.("x-vercel-forwarded-for"),
    headers.get?.("x-forwarded-for")?.split(",")[0],
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();

    if (value && value.length <= 128) {
      return value;
    }
  }

  return "";
}

function safeErrorCodes(codes) {
  if (!Array.isArray(codes)) {
    return [];
  }

  return codes
    .filter((code) => typeof code === "string")
    .map((code) => code.slice(0, 128))
    .slice(0, 20);
}

function cleanupReplayStore(now = Date.now()) {
  for (const [key, expiresAt] of replayStore) {
    if (expiresAt <= now) {
      replayStore.delete(key);
    }
  }

  if (replayStore.size <= MAX_REPLAY_ENTRIES) {
    return;
  }

  const entries = [...replayStore.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, replayStore.size - MAX_REPLAY_ENTRIES);

  for (const [key] of entries) {
    replayStore.delete(key);
  }
}

function createTokenFingerprint(token) {
  // A deterministic, non-secret identifier used only for replay tracking.
  // Web Crypto is available in modern Node.js runtimes.
  try {
    const crypto = require("node:crypto");

    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  } catch {
    // Fallback for environments where require() is unavailable.
    let hash = 0;

    for (let index = 0; index < token.length; index += 1) {
      hash = (hash << 5) - hash + token.charCodeAt(index);
      hash |= 0;
    }

    return String(hash);
  }
}

function hasReplay(token) {
  const fingerprint = createTokenFingerprint(token);
  const now = Date.now();

  cleanupReplayStore(now);

  const expiresAt = replayStore.get(fingerprint);

  if (!expiresAt) {
    return false;
  }

  if (expiresAt <= now) {
    replayStore.delete(fingerprint);
    return false;
  }

  return true;
}

function rememberToken(token) {
  const fingerprint = createTokenFingerprint(token);

  cleanupReplayStore();

  replayStore.set(
    fingerprint,
    Date.now() + getReplayTtlMs(),
  );
}

function getProviderSecret(provider) {
  if (provider === "turnstile") {
    return readEnv("TURNSTILE_SECRET_KEY");
  }

  if (provider === "recaptcha") {
    return readEnv("RECAPTCHA_SECRET_KEY");
  }

  return "";
}

function buildFailure(code, message, extra = {}) {
  return {
    success: false,
    verified: false,
    provider: extra.provider || getProvider(),
    code,
    message,
    ...extra,
  };
}

function buildSuccess(provider, result = {}) {
  return {
    success: true,
    verified: true,
    provider,
    score:
      typeof result.score === "number"
        ? result.score
        : null,
    action:
      typeof result.action === "string"
        ? result.action
        : null,
    hostname:
      typeof result.hostname === "string"
        ? result.hostname
        : null,
    challengeTs:
      typeof result.challengeTs === "string"
        ? result.challengeTs
        : null,
  };
}

function validateProviderResponse({
  provider,
  response,
  expectedAction,
}) {
  if (!response || typeof response !== "object") {
    return buildFailure(
      "INVALID_PROVIDER_RESPONSE",
      "CAPTCHA provider returned an invalid response.",
      { provider },
    );
  }

  const success = response.success === true;

  if (!success) {
    return buildFailure(
      "VERIFICATION_FAILED",
      "CAPTCHA verification failed.",
      {
        provider,
        errorCodes: safeErrorCodes(response["error-codes"]),
      },
    );
  }

  const hostname =
    typeof response.hostname === "string"
      ? response.hostname.trim().toLowerCase()
      : "";

  const allowedHostnames = getAllowedHostnames();

  if (
    allowedHostnames.length > 0 &&
    (!hostname || !allowedHostnames.includes(hostname))
  ) {
    return buildFailure(
      "HOSTNAME_MISMATCH",
      "CAPTCHA hostname validation failed.",
      {
        provider,
        hostname: hostname || null,
      },
    );
  }

  const action =
    typeof response.action === "string"
      ? response.action.trim()
      : "";

  if (
    expectedAction &&
    provider === "recaptcha" &&
    action !== expectedAction
  ) {
    return buildFailure(
      "ACTION_MISMATCH",
      "CAPTCHA action validation failed.",
      {
        provider,
        action: action || null,
      },
    );
  }

  const score =
    typeof response.score === "number"
      ? response.score
      : null;

  if (provider === "recaptcha" && score !== null) {
    const minimumScore = getMinimumScore();

    if (score < minimumScore) {
      return buildFailure(
        "LOW_SCORE",
        "CAPTCHA risk score is below the configured threshold.",
        {
          provider,
          score,
          action: action || null,
          hostname: hostname || null,
        },
      );
    }
  }

  return buildSuccess(provider, {
    score,
    action,
    hostname,
    challengeTs:
      typeof response.challenge_ts === "string"
        ? response.challenge_ts
        : null,
  });
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function verifyTurnstile({
  token,
  remoteIp,
}) {
  const secret = getProviderSecret("turnstile");

  if (!secret) {
    return buildFailure(
      "PROVIDER_NOT_CONFIGURED",
      "CAPTCHA verification is not configured.",
      { provider: "turnstile" },
    );
  }

  const body = new URLSearchParams();

  body.set("secret", secret);
  body.set("response", token);

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  let response;

  try {
    response = await fetchWithTimeout(
      TURNSTILE_VERIFY_URL,
      {
        method: "POST",
        headers: {
          "content-type":
            "application/x-www-form-urlencoded;charset=UTF-8",
          accept: "application/json",
        },
        body,
      },
      getTimeoutMs(),
    );
  } catch (error) {
    return buildFailure(
      error?.name === "AbortError"
        ? "PROVIDER_TIMEOUT"
        : "PROVIDER_UNAVAILABLE",
      "CAPTCHA verification service is unavailable.",
      {
        provider: "turnstile",
      },
    );
  }

  if (!response.ok) {
    return buildFailure(
      "PROVIDER_HTTP_ERROR",
      "CAPTCHA verification service returned an error.",
      {
        provider: "turnstile",
      },
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    return buildFailure(
      "INVALID_PROVIDER_RESPONSE",
      "CAPTCHA provider returned invalid data.",
      {
        provider: "turnstile",
      },
    );
  }

  return validateProviderResponse({
    provider: "turnstile",
    response: data,
  });
}

async function verifyRecaptcha({
  token,
  remoteIp,
  expectedAction,
}) {
  const secret = getProviderSecret("recaptcha");

  if (!secret) {
    return buildFailure(
      "PROVIDER_NOT_CONFIGURED",
      "CAPTCHA verification is not configured.",
      { provider: "recaptcha" },
    );
  }

  const body = new URLSearchParams();

  body.set("secret", secret);
  body.set("response", token);

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  let response;

  try {
    response = await fetchWithTimeout(
      RECAPTCHA_VERIFY_URL,
      {
        method: "POST",
        headers: {
          "content-type":
            "application/x-www-form-urlencoded;charset=UTF-8",
          accept: "application/json",
        },
        body,
      },
      getTimeoutMs(),
    );
  } catch (error) {
    return buildFailure(
      error?.name === "AbortError"
        ? "PROVIDER_TIMEOUT"
        : "PROVIDER_UNAVAILABLE",
      "CAPTCHA verification service is unavailable.",
      {
        provider: "recaptcha",
      },
    );
  }

  if (!response.ok) {
    return buildFailure(
      "PROVIDER_HTTP_ERROR",
      "CAPTCHA verification service returned an error.",
      {
        provider: "recaptcha",
      },
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    return buildFailure(
      "INVALID_PROVIDER_RESPONSE",
      "CAPTCHA provider returned invalid data.",
      {
        provider: "recaptcha",
      },
    );
  }

  return validateProviderResponse({
    provider: "recaptcha",
    response: data,
    expectedAction,
  });
}

/**
 * Returns whether CAPTCHA verification is required.
 *
 * Production recommendation:
 * CAPTCHA_REQUIRED=true
 */
export function isCaptchaRequired() {
  return parseBoolean(
    readEnv("CAPTCHA_REQUIRED"),
    false,
  );
}

/**
 * Returns the currently configured provider.
 */
export function getCaptchaProvider() {
  return getProvider();
}

/**
 * Returns the public site key for rendering CAPTCHA on the client.
 *
 * Never expose secret keys through this function.
 */
export function getCaptchaSiteKey() {
  const provider = getProvider();

  if (provider === "turnstile") {
    return (
      readEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY") ||
      readEnv("TURNSTILE_SITE_KEY")
    );
  }

  if (provider === "recaptcha") {
    return readEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
  }

  return "";
}

/**
 * Main verification function.
 *
 * Usage:
 *
 * const result = await verifyCaptcha({
 *   token,
 *   request,
 *   action: "login",
 * });
 *
 * if (!result.verified) {
 *   // reject request
 * }
 */
export async function verifyCaptcha({
  token,
  request = null,
  remoteIp = "",
  action = "",
} = {}) {
  const provider = getProvider();

  if (provider === "none") {
    if (isCaptchaRequired()) {
      return buildFailure(
        "PROVIDER_NOT_CONFIGURED",
        "CAPTCHA verification is required but is not configured.",
        { provider: "none" },
      );
    }

    return {
      success: true,
      verified: false,
      skipped: true,
      provider: "none",
      score: null,
      action: null,
      hostname: null,
      challengeTs: null,
    };
  }

  const normalizedToken = normalizeToken(token);

  if (!normalizedToken) {
    return buildFailure(
      "TOKEN_REQUIRED",
      "A valid CAPTCHA token is required.",
      { provider },
    );
  }

  if (hasReplay(normalizedToken)) {
    return buildFailure(
      "TOKEN_REPLAYED",
      "This CAPTCHA token has already been used.",
      { provider },
    );
  }

  const normalizedAction = normalizeAction(action);

  const ip =
    typeof remoteIp === "string" && remoteIp.trim()
      ? remoteIp.trim()
      : getClientIp(request);

  let result;

  if (provider === "turnstile") {
    result = await verifyTurnstile({
      token: normalizedToken,
      remoteIp: ip,
    });
  } else if (provider === "recaptcha") {
    result = await verifyRecaptcha({
      token: normalizedToken,
      remoteIp: ip,
      expectedAction: normalizedAction,
    });
  } else {
    return buildFailure(
      "UNSUPPORTED_PROVIDER",
      "The configured CAPTCHA provider is not supported.",
      { provider },
    );
  }

  if (result?.verified === true) {
    rememberToken(normalizedToken);
  }

  return result;
}

/**
 * Strict helper for protected API routes.
 *
 * Returns null when verification succeeds.
 * Returns a structured failure response when it does not.
 */
export async function requireCaptcha(options = {}) {
  const result = await verifyCaptcha(options);

  if (result.verified === true) {
    return null;
  }

  return result;
}

/**
 * Convenience helper for endpoints where CAPTCHA is optional
 * unless CAPTCHA_REQUIRED=true.
 */
export async function checkCaptcha(options = {}) {
  return verifyCaptcha(options);
}

/**
 * Clears the local replay cache.
 *
 * Useful for tests and controlled operational resets.
 */
export function clearCaptchaReplayStore() {
  replayStore.clear();
}

/**
 * Returns safe operational information.
 *
 * Never returns secrets.
 */
export function getCaptchaStatus() {
  const provider = getProvider();

  return {
    provider,
    required: isCaptchaRequired(),
    configured: Boolean(
      provider !== "none" &&
        getProviderSecret(provider),
    ),
    siteKeyConfigured: Boolean(getCaptchaSiteKey()),
    replayEntries: replayStore.size,
    minimumScore:
      provider === "recaptcha"
        ? getMinimumScore()
        : null,
    expectedAction:
      provider === "recaptcha"
        ? readEnv("CAPTCHA_EXPECTED_ACTION") || null
        : null,
  };
}

/**
 * Optional request-level helper.
 *
 * Reads a token from common body/header conventions.
 * The body should already be parsed by the API route.
 */
export async function verifyCaptchaRequest({
  request,
  body = {},
  action = "",
} = {}) {
  const token =
    body?.captchaToken ||
    body?.captcha_token ||
    body?.turnstileToken ||
    body?.recaptchaToken ||
    request?.headers?.get?.("x-captcha-token") ||
    "";

  const expectedAction =
    normalizeAction(action) ||
    normalizeAction(
      body?.captchaAction ||
        body?.captcha_action ||
        readEnv("CAPTCHA_EXPECTED_ACTION"),
    );

  return verifyCaptcha({
    token,
    request,
    action: expectedAction,
  });
}

export const CAPTCHA_PROVIDERS = Object.freeze({
  TURNSTILE: "turnstile",
  RECAPTCHA: "recaptcha",
  AUTO: "auto",
  NONE: "none",
});

export const CAPTCHA_CODES = Object.freeze({
  TOKEN_REQUIRED: "TOKEN_REQUIRED",
  TOKEN_REPLAYED: "TOKEN_REPLAYED",
  PROVIDER_NOT_CONFIGURED: "PROVIDER_NOT_CONFIGURED",
  PROVIDER_TIMEOUT: "PROVIDER_TIMEOUT",
  PROVIDER_UNAVAILABLE: "PROVIDER_UNAVAILABLE",
  PROVIDER_HTTP_ERROR: "PROVIDER_HTTP_ERROR",
  INVALID_PROVIDER_RESPONSE: "INVALID_PROVIDER_RESPONSE",
  VERIFICATION_FAILED: "VERIFICATION_FAILED",
  HOSTNAME_MISMATCH: "HOSTNAME_MISMATCH",
  ACTION_MISMATCH: "ACTION_MISMATCH",
  LOW_SCORE: "LOW_SCORE",
  UNSUPPORTED_PROVIDER: "UNSUPPORTED_PROVIDER",
});