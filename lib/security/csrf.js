/**
 * Worldwide DIPO
 * CSRF Protection
 *
 * Defense-in-depth protection for state-changing requests.
 *
 * Strategy:
 * 1. Same-origin requests are validated through Origin/Referer.
 * 2. Cross-origin state-changing requests are rejected by default.
 * 3. A cryptographically strong CSRF token can be used for
 *    cookie-authenticated browser flows when required.
 * 4. Safe methods remain unaffected.
 *
 * This module does NOT replace:
 * - Supabase RLS
 * - authentication
 * - authorization
 * - origin-check.js
 * - SameSite cookie configuration
 */

const SAFE_METHODS = new Set([
  'GET',
  'HEAD',
  'OPTIONS',
]);

const STATE_CHANGING_METHODS = new Set([
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]);

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = 'dipo-csrf-token';

const TOKEN_BYTES = 32;
const MAX_TOKEN_LENGTH = 256;

const ALLOWED_ORIGIN_ENV_KEYS = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_APP_URL',
  'SITE_URL',
  'APP_URL',
];

function getCrypto() {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    return globalThis.crypto;
  }

  return null;
}

function normalizeOrigin(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed.length > 2048) {
    return null;
  }

  try {
    const url = new URL(trimmed);

    if (
      url.protocol !== 'https:' &&
      url.hostname !== 'localhost' &&
      url.hostname !== '127.0.0.1' &&
      url.hostname !== '[::1]'
    ) {
      return null;
    }

    return url.origin.toLowerCase();
  } catch {
    return null;
  }
}

function getConfiguredOrigins() {
  const origins = new Set();

  for (const key of ALLOWED_ORIGIN_ENV_KEYS) {
    const value = process.env[key];

    const origin = normalizeOrigin(value);

    if (origin) {
      origins.add(origin);
    }
  }

  /*
   * Production canonical origin.
   *
   * This is intentionally hard-coded as a defensive fallback so
   * deployments do not accidentally become completely originless
   * because an environment variable was omitted.
   */
  origins.add('https://worldwidedipo.com');

  /*
   * www should be treated as a separate origin only when explicitly
   * configured. Do not automatically trust arbitrary subdomains.
   */

  return origins;
}

function getRequestOrigin(request) {
  if (!request?.headers?.get) {
    return null;
  }

  const origin = normalizeOrigin(
    request.headers.get('origin')
  );

  if (origin) {
    return origin;
  }

  /*
   * Older browsers / navigation contexts may omit Origin.
   * Referer provides a weaker but useful same-origin signal.
   */
  const referer = request.headers.get('referer');

  if (!referer) {
    return null;
  }

  try {
    return normalizeOrigin(
      new URL(referer).origin
    );
  } catch {
    return null;
  }
}

function getExpectedOrigin(request) {
  const configured = getConfiguredOrigins();

  const requestOrigin =
    getRequestOrigin(request);

  if (
    requestOrigin &&
    configured.has(requestOrigin)
  ) {
    return requestOrigin;
  }

  /*
   * Prefer the configured canonical origin.
   */
  if (configured.has('https://worldwidedipo.com')) {
    return 'https://worldwidedipo.com';
  }

  return [...configured][0] || null;
}

function isSameOriginRequest(request) {
  const configured = getConfiguredOrigins();

  const originHeader =
    request?.headers?.get?.('origin');

  if (originHeader) {
    const origin =
      normalizeOrigin(originHeader);

    return Boolean(
      origin && configured.has(origin)
    );
  }

  const referer =
    request?.headers?.get?.('referer');

  if (referer) {
    try {
      const refererOrigin =
        normalizeOrigin(
          new URL(referer).origin
        );

      return Boolean(
        refererOrigin &&
          configured.has(refererOrigin)
      );
    } catch {
      return false;
    }
  }

  /*
   * Missing browser origin metadata on a state-changing request
   * must not be treated as automatically trusted.
   */
  return false;
}

function constantTimeEqual(a, b) {
  if (
    typeof a !== 'string' ||
    typeof b !== 'string'
  ) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (let i = 0; i < a.length; i += 1) {
    result |=
      a.charCodeAt(i) ^
      b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Generate a cryptographically secure CSRF token.
 */
export function generateCsrfToken() {
  const crypto = getCrypto();

  if (!crypto) {
    throw new Error(
      'Secure cryptographic randomness is unavailable.'
    );
  }

  const bytes =
    new Uint8Array(TOKEN_BYTES);

  crypto.getRandomValues(bytes);

  let token = '';

  for (const byte of bytes) {
    token += byte
      .toString(16)
      .padStart(2, '0');
  }

  return token;
}

/**
 * Validate token format before comparing it.
 */
export function isValidCsrfTokenFormat(token) {
  if (
    typeof token !== 'string' ||
    token.length !== TOKEN_BYTES * 2 ||
    token.length > MAX_TOKEN_LENGTH
  ) {
    return false;
  }

  return /^[a-f0-9]+$/i.test(token);
}

/**
 * Constant-time CSRF token comparison.
 */
export function verifyCsrfToken(
  providedToken,
  expectedToken
) {
  if (
    !isValidCsrfTokenFormat(providedToken) ||
    !isValidCsrfTokenFormat(expectedToken)
  ) {
    return false;
  }

  return constantTimeEqual(
    providedToken.toLowerCase(),
    expectedToken.toLowerCase()
  );
}

/**
 * Extract token from request headers.
 */
export function getCsrfTokenFromRequest(
  request
) {
  if (!request?.headers?.get) {
    return null;
  }

  const token =
    request.headers.get(CSRF_HEADER);

  if (!token) {
    return null;
  }

  const normalized =
    token.trim();

  if (
    !isValidCsrfTokenFormat(normalized)
  ) {
    return null;
  }

  return normalized;
}

/**
 * Read a CSRF token from a Cookie header.
 *
 * This helper does not trust the cookie by itself.
 * The server must still compare it against the submitted token.
 */
export function getCsrfCookieFromRequest(
  request
) {
  const cookieHeader =
    request?.headers?.get?.('cookie');

  if (!cookieHeader) {
    return null;
  }

  const cookies =
    cookieHeader.split(';');

  for (const cookie of cookies) {
    const separator =
      cookie.indexOf('=');

    if (separator === -1) {
      continue;
    }

    const name =
      cookie
        .slice(0, separator)
        .trim();

    if (name !== CSRF_COOKIE) {
      continue;
    }

    const value =
      cookie
        .slice(separator + 1)
        .trim();

    try {
      const decoded =
        decodeURIComponent(value);

      return isValidCsrfTokenFormat(decoded)
        ? decoded
        : null;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Validate the double-submit CSRF token pattern.
 *
 * The token must exist in:
 * - request header
 * - CSRF cookie
 *
 * Both values must match.
 */
export function verifyDoubleSubmitCsrf(
  request
) {
  const headerToken =
    getCsrfTokenFromRequest(request);

  const cookieToken =
    getCsrfCookieFromRequest(request);

  if (!headerToken || !cookieToken) {
    return {
      valid: false,
      reason: 'CSRF_TOKEN_MISSING',
    };
  }

  if (
    !verifyCsrfToken(
      headerToken,
      cookieToken
    )
  ) {
    return {
      valid: false,
      reason: 'CSRF_TOKEN_INVALID',
    };
  }

  return {
    valid: true,
    reason: null,
  };
}

/**
 * Main CSRF guard.
 *
 * Safe methods:
 *   GET / HEAD / OPTIONS
 * are allowed without a CSRF token.
 *
 * State-changing methods:
 *   POST / PUT / PATCH / DELETE
 * require trusted same-origin metadata.
 *
 * If requireToken=true, a valid double-submit token
 * is additionally required.
 */
export function checkCsrf(
  request,
  options = {}
) {
  const method =
    String(
      request?.method || 'GET'
    ).toUpperCase();

  const requireToken =
    options.requireToken === true;

  if (SAFE_METHODS.has(method)) {
    return {
      ok: true,
      status: 200,
      reason: null,
    };
  }

  if (
    !STATE_CHANGING_METHODS.has(method)
  ) {
    return {
      ok: true,
      status: 200,
      reason: null,
    };
  }

  /*
   * State-changing browser requests must originate from
   * a configured trusted origin.
   */
  if (!isSameOriginRequest(request)) {
    return {
      ok: false,
      status: 403,
      reason: 'CSRF_ORIGIN_INVALID',
    };
  }

  if (requireToken) {
    const tokenResult =
      verifyDoubleSubmitCsrf(request);

    if (!tokenResult.valid) {
      return {
        ok: false,
        status: 403,
        reason: tokenResult.reason,
      };
    }
  }

  return {
    ok: true,
    status: 200,
    reason: null,
  };
}

/**
 * Strict mode for highly sensitive endpoints.
 *
 * Use this for browser cookie-authenticated operations
 * where a CSRF token should be mandatory in addition to
 * same-origin validation.
 */
export function requireCsrf(
  request
) {
  return checkCsrf(request, {
    requireToken: true,
  });
}

/**
 * Check whether a request method is safe.
 */
export function isSafeMethod(method) {
  return SAFE_METHODS.has(
    String(method || '').toUpperCase()
  );
}

/**
 * Check whether a request changes server state.
 */
export function isStateChangingMethod(
  method
) {
  return STATE_CHANGING_METHODS.has(
    String(method || '').toUpperCase()
  );
}

/**
 * Return the canonical CSRF header name.
 */
export function getCsrfHeaderName() {
  return CSRF_HEADER;
}

/**
 * Return the canonical CSRF cookie name.
 */
export function getCsrfCookieName() {
  return CSRF_COOKIE;
}

/**
 * Create a secure Set-Cookie value for the CSRF token.
 *
 * HttpOnly is intentionally NOT used because the browser client
 * needs to read this non-secret double-submit token and send it
 * through X-CSRF-Token.
 *
 * The token is not an authentication credential.
 */
export function createCsrfCookie(
  token,
  options = {}
) {
  if (
    !isValidCsrfTokenFormat(token)
  ) {
    throw new Error(
      'Invalid CSRF token.'
    );
  }

  const maxAge =
    Number.isInteger(options.maxAge) &&
    options.maxAge >= 0
      ? options.maxAge
      : 60 * 60 * 24;

  const secure =
    options.secure !== false;

  const sameSite =
    options.sameSite || 'Lax';

  const path =
    typeof options.path === 'string' &&
    options.path.startsWith('/')
      ? options.path
      : '/';

  const parts = [
    `${CSRF_COOKIE}=${encodeURIComponent(token)}`,
    `Path=${path}`,
    `Max-Age=${maxAge}`,
    `SameSite=${sameSite}`,
  ];

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

/**
 * Create a fresh CSRF token and corresponding cookie.
 */
export function createCsrfTokenCookie(
  options = {}
) {
  const token =
    generateCsrfToken();

  return {
    token,
    cookie:
      createCsrfCookie(
        token,
        options
      ),
  };
}

/**
 * Return a safe origin value for response headers.
 *
 * This can be used with:
 * Access-Control-Allow-Origin
 *
 * Never reflect an arbitrary Origin header.
 */
export function getAllowedOrigin(
  request
) {
  const origin =
    request?.headers?.get?.(
      'origin'
    );

  const normalized =
    normalizeOrigin(origin);

  if (
    normalized &&
    getConfiguredOrigins().has(
      normalized
    )
  ) {
    return normalized;
  }

  return null;
}

/**
 * Generate recommended security headers for
 * state-changing API responses.
 *
 * This does not replace security-headers.js.
 */
export function getCsrfResponseHeaders(
  request
) {
  const headers = new Headers();

  headers.set(
    'Cache-Control',
    'no-store'
  );

  headers.set(
    'X-Content-Type-Options',
    'nosniff'
  );

  headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );

  const allowedOrigin =
    getAllowedOrigin(request);

  if (allowedOrigin) {
    headers.set(
      'Access-Control-Allow-Origin',
      allowedOrigin
    );

    headers.set(
      'Vary',
      'Origin'
    );
  }

  return headers;
}

/**
 * Helper for API routes:
 *
 * const csrf = enforceCsrf(request);
 * if (!csrf.ok) {
 *   return csrf.response;
 * }
 */
export function enforceCsrf(
  request,
  options = {}
) {
  const result =
    checkCsrf(
      request,
      options
    );

  if (result.ok) {
    return {
      ok: true,
      response: null,
      reason: null,
    };
  }

  const headers =
    getCsrfResponseHeaders(
      request
    );

  headers.set(
    'Retry-After',
    '0'
  );

  return {
    ok: false,
    response: new Response(
      JSON.stringify({
        ok: false,
        error: 'Forbidden',
        code: result.reason,
      }),
      {
        status: result.status,
        headers: {
          ...Object.fromEntries(
            headers.entries()
          ),
          'Content-Type':
            'application/json; charset=utf-8',
        },
      }
    ),
    reason: result.reason,
  };
}

export {
  CSRF_HEADER,
  CSRF_COOKIE,
  SAFE_METHODS,
  STATE_CHANGING_METHODS,
};