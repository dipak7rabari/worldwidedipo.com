/**
 * lib/security/security-log.js
 *
 * Production-grade security event logger.
 *
 * Goals:
 * - Never log passwords, tokens, cookies, secrets, or payment credentials.
 * - Keep security logs structured and machine-readable.
 * - Prevent accidental log injection.
 * - Normalize request metadata safely.
 * - Support development, production, and external log collectors.
 * - Never throw from logging code.
 * - Keep the module dependency-free.
 */

const MAX_MESSAGE_LENGTH = 2_000;
const MAX_METADATA_KEYS = 50;
const MAX_METADATA_DEPTH = 4;
const MAX_ARRAY_LENGTH = 50;
const MAX_STRING_LENGTH = 1_000;

const SECURITY_LEVELS = Object.freeze({
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
});

const SECURITY_EVENTS = Object.freeze({
  AUTH_FAILURE: "auth_failure",
  AUTH_SUCCESS: "auth_success",
  ACCESS_DENIED: "access_denied",
  RATE_LIMITED: "rate_limited",
  ABUSE_DETECTED: "abuse_detected",
  CSRF_FAILURE: "csrf_failure",
  CAPTCHA_FAILURE: "captcha_failure",
  INVALID_INPUT: "invalid_input",
  VALIDATION_FAILURE: "validation_failure",
  ORIGIN_REJECTED: "origin_rejected",
  ADMIN_ACCESS: "admin_access",
  ADMIN_ACCESS_DENIED: "admin_access_denied",
  PAYMENT_FAILURE: "payment_failure",
  PAYMENT_SUSPICIOUS: "payment_suspicious",
  PROFILE_SECURITY: "profile_security",
  FILE_UPLOAD_REJECTED: "file_upload_rejected",
  API_ERROR: "api_error",
  SECURITY_CONFIGURATION: "security_configuration",
  SECURITY_ALERT: "security_alert",
});

const SENSITIVE_KEY_PATTERN =
  /(?:password|passwd|passcode|secret|token|authorization|cookie|session|csrf|captcha|recaptcha|turnstile|api[_-]?key|private[_-]?key|access[_-]?key|refresh[_-]?token|client[_-]?secret|service[_-]?role|supabase[_-]?key|jwt|otp|code|payment[_-]?reference|card|cvv|cvc|iban|bank|account[_-]?number)/i;

const SAFE_REQUEST_HEADERS = new Set([
  "accept",
  "accept-language",
  "content-type",
  "origin",
  "referer",
  "user-agent",
  "x-forwarded-proto",
]);

function readEnv(name) {
  const value = process.env[name];

  return typeof value === "string"
    ? value.trim()
    : "";
}

function parseBoolean(value, fallback = false) {
  if (!value) return fallback;

  const normalized = value.toLowerCase();

  if (
    ["1", "true", "yes", "on"].includes(
      normalized,
    )
  ) {
    return true;
  }

  if (
    ["0", "false", "no", "off"].includes(
      normalized,
    )
  ) {
    return false;
  }

  return fallback;
}

function sanitizeLogString(
  value,
  maxLength = MAX_STRING_LENGTH,
) {
  if (value === null || value === undefined) {
    return "";
  }

  let result = String(value);

  // Prevent terminal/log injection.
  result = result
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (result.length > maxLength) {
    result = result.slice(0, maxLength) + "…";
  }

  return result;
}

function isSensitiveKey(key) {
  return (
    typeof key === "string" &&
    SENSITIVE_KEY_PATTERN.test(key)
  );
}

function redactValue(
  value,
  depth = 0,
) {
  if (depth > MAX_METADATA_DEPTH) {
    return "[MaxDepth]";
  }

  if (
    value === null ||
    value === undefined
  ) {
    return value;
  }

  if (typeof value === "string") {
    return sanitizeLogString(
      value,
      MAX_STRING_LENGTH,
    );
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "bigint") {
    return String(value);
  }

  if (value instanceof Error) {
    return {
      name: sanitizeLogString(
        value.name,
        200,
      ),
      message: sanitizeLogString(
        value.message,
        500,
      ),
      stack: readEnv(
        "NODE_ENV",
      ) === "production"
        ? undefined
        : sanitizeLogString(
            value.stack || "",
            4_000,
          ),
    };
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_ARRAY_LENGTH)
      .map((item) =>
        redactValue(
          item,
          depth + 1,
        ),
      );
  }

  if (typeof value === "object") {
    const result = {};
    let count = 0;

    for (const [key, child] of Object.entries(
      value,
    )) {
      if (count >= MAX_METADATA_KEYS) {
        result._truncated = true;
        break;
      }

      const safeKey = sanitizeLogString(
        key,
        200,
      );

      if (!safeKey) {
        continue;
      }

      if (isSensitiveKey(safeKey)) {
        result[safeKey] = "[REDACTED]";
      } else {
        result[safeKey] = redactValue(
          child,
          depth + 1,
        );
      }

      count += 1;
    }

    return result;
  }

  return sanitizeLogString(value);
}

function normalizeLevel(level) {
  const normalized =
    typeof level === "string"
      ? level.toLowerCase().trim()
      : "";

  if (
    Object.values(
      SECURITY_LEVELS,
    ).includes(normalized)
  ) {
    return normalized;
  }

  return SECURITY_LEVELS.INFO;
}

function normalizeEvent(event) {
  const value =
    typeof event === "string"
      ? event.trim()
      : "";

  if (!value) {
    return "security_event";
  }

  return sanitizeLogString(
    value
      .toLowerCase()
      .replace(/\s+/g, "_"),
    128,
  );
}

function normalizeMessage(message) {
  return sanitizeLogString(
    message || "Security event",
    MAX_MESSAGE_LENGTH,
  );
}

function normalizeUserId(value) {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const normalized =
    value.trim();

  if (
    !normalized ||
    normalized.length > 128
  ) {
    return null;
  }

  return normalized;
}

function normalizeIp(value) {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const normalized =
    value
      .split(",")[0]
      .trim();

  if (
    !normalized ||
    normalized.length > 128
  ) {
    return null;
  }

  return normalized;
}

function getRequestIp(request) {
  if (!request?.headers) {
    return null;
  }

  const candidates = [
    request.headers.get?.(
      "cf-connecting-ip",
    ),
    request.headers.get?.(
      "x-real-ip",
    ),
    request.headers.get?.(
      "x-forwarded-for",
    ),
  ];

  for (const candidate of candidates) {
    const ip =
      normalizeIp(candidate);

    if (ip) {
      return ip;
    }
  }

  return null;
}

function getRequestMetadata(request) {
  if (!request?.headers) {
    return {};
  }

  const metadata = {};

  for (const header of SAFE_REQUEST_HEADERS) {
    const value =
      request.headers.get?.(
        header,
      );

    if (!value) {
      continue;
    }

    metadata[header] =
      sanitizeLogString(
        value,
        500,
      );
  }

  return metadata;
}

function createRequestContext(request) {
  if (!request) {
    return {};
  }

  const url =
    typeof request.url === "string"
      ? request.url
      : "";

  let pathname = null;

  try {
    pathname = url
      ? new URL(url).pathname
      : null;
  } catch {
    pathname = null;
  }

  return {
    method:
      typeof request.method === "string"
        ? request.method
            .toUpperCase()
        : null,

    pathname:
      pathname
        ? sanitizeLogString(
            pathname,
            1_000,
          )
        : null,

    ip: getRequestIp(request),

    headers:
      getRequestMetadata(
        request,
      ),
  };
}

function getEnvironment() {
  return (
    readEnv("NODE_ENV") ||
    "development"
  );
}

function shouldLog(level) {
  const configured =
    readEnv(
      "SECURITY_LOG_LEVEL",
    ).toLowerCase();

  if (!configured) {
    return true;
  }

  const priorities = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
  };

  const current =
    priorities[
      normalizeLevel(
        configured,
      )
    ] ?? 20;

  const incoming =
    priorities[
      normalizeLevel(level)
    ] ?? 20;

  return incoming >= current;
}

function createEventRecord({
  level,
  event,
  message,
  metadata,
  request,
  userId,
}) {
  const requestContext =
    createRequestContext(
      request,
    );

  const record = {
    timestamp:
      new Date().toISOString(),

    level:
      normalizeLevel(level),

    event:
      normalizeEvent(event),

    message:
      normalizeMessage(message),

    environment:
      getEnvironment(),

    service:
      "worldwide-dipo",

    ...requestContext,

    userId:
      normalizeUserId(
        userId ??
          metadata?.userId,
      ),

    metadata:
      redactValue(
        metadata || {},
      ),
  };

  return record;
}

function outputRecord(record) {
  if (!shouldLog(record.level)) {
    return;
  }

  const serialized =
    JSON.stringify(record);

  switch (record.level) {
    case SECURITY_LEVELS.ERROR:
      console.error(
        "[SECURITY]",
        serialized,
      );
      break;

    case SECURITY_LEVELS.WARN:
      console.warn(
        "[SECURITY]",
        serialized,
      );
      break;

    case SECURITY_LEVELS.DEBUG:
      console.debug(
        "[SECURITY]",
        serialized,
      );
      break;

    case SECURITY_LEVELS.INFO:
    default:
      console.info(
        "[SECURITY]",
        serialized,
      );
      break;
  }
}

/**
 * Core security logger.
 *
 * Logging must never break the request lifecycle.
 */
export function securityLog({
  level = SECURITY_LEVELS.INFO,
  event = "security_event",
  message = "Security event",
  metadata = {},
  request = null,
  userId = null,
} = {}) {
  try {
    const record =
      createEventRecord({
        level,
        event,
        message,
        metadata,
        request,
        userId,
      });

    outputRecord(record);

    return record;
  } catch {
    // Security logging must never crash an API route.
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Convenience methods                                                        */
/* -------------------------------------------------------------------------- */

export function securityDebug(
  options = {},
) {
  return securityLog({
    ...options,
    level: SECURITY_LEVELS.DEBUG,
  });
}

export function securityInfo(
  options = {},
) {
  return securityLog({
    ...options,
    level: SECURITY_LEVELS.INFO,
  });
}

export function securityWarn(
  options = {},
) {
  return securityLog({
    ...options,
    level: SECURITY_LEVELS.WARN,
  });
}

export function securityError(
  options = {},
) {
  return securityLog({
    ...options,
    level: SECURITY_LEVELS.ERROR,
  });
}

/* -------------------------------------------------------------------------- */
/* Security event helpers                                                     */
/* -------------------------------------------------------------------------- */

export function logAuthFailure({
  request,
  userId = null,
  reason = "Authentication failed",
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.AUTH_FAILURE,
    message: reason,
    request,
    userId,
    metadata,
  });
}

export function logAuthSuccess({
  request,
  userId = null,
  metadata = {},
} = {}) {
  return securityInfo({
    event:
      SECURITY_EVENTS.AUTH_SUCCESS,
    message:
      "Authentication succeeded",
    request,
    userId,
    metadata,
  });
}

export function logAccessDenied({
  request,
  userId = null,
  resource = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.ACCESS_DENIED,
    message:
      "Access denied",
    request,
    userId,
    metadata: {
      resource,
      ...metadata,
    },
  });
}

export function logAdminAccess({
  request,
  userId = null,
  action = null,
  metadata = {},
} = {}) {
  return securityInfo({
    event:
      SECURITY_EVENTS.ADMIN_ACCESS,
    message:
      "Admin access granted",
    request,
    userId,
    metadata: {
      action,
      ...metadata,
    },
  });
}

export function logAdminAccessDenied({
  request,
  userId = null,
  action = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.ADMIN_ACCESS_DENIED,
    message:
      "Admin access denied",
    request,
    userId,
    metadata: {
      action,
      ...metadata,
    },
  });
}

export function logRateLimited({
  request,
  userId = null,
  keyType = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.RATE_LIMITED,
    message:
      "Request rate limited",
    request,
    userId,
    metadata: {
      keyType,
      ...metadata,
    },
  });
}

export function logAbuseDetected({
  request,
  userId = null,
  reason = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.ABUSE_DETECTED,
    message:
      "Suspicious activity detected",
    request,
    userId,
    metadata: {
      reason,
      ...metadata,
    },
  });
}

export function logCsrfFailure({
  request,
  userId = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.CSRF_FAILURE,
    message:
      "CSRF verification failed",
    request,
    userId,
    metadata,
  });
}

export function logCaptchaFailure({
  request,
  userId = null,
  provider = null,
  reason = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.CAPTCHA_FAILURE,
    message:
      "CAPTCHA verification failed",
    request,
    userId,
    metadata: {
      provider,
      reason,
      ...metadata,
    },
  });
}

export function logOriginRejected({
  request,
  userId = null,
  origin = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.ORIGIN_REJECTED,
    message:
      "Request origin rejected",
    request,
    userId,
    metadata: {
      origin,
      ...metadata,
    },
  });
}

export function logInvalidInput({
  request,
  userId = null,
  field = null,
  reason = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.INVALID_INPUT,
    message:
      "Invalid request input",
    request,
    userId,
    metadata: {
      field,
      reason,
      ...metadata,
    },
  });
}

export function logValidationFailure({
  request,
  userId = null,
  field = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.VALIDATION_FAILURE,
    message:
      "Validation failed",
    request,
    userId,
    metadata: {
      field,
      ...metadata,
    },
  });
}

export function logPaymentFailure({
  request,
  userId = null,
  reason = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.PAYMENT_FAILURE,
    message:
      "Payment operation failed",
    request,
    userId,
    metadata: {
      reason,
      ...metadata,
    },
  });
}

export function logSuspiciousPayment({
  request,
  userId = null,
  reason = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.PAYMENT_SUSPICIOUS,
    message:
      "Suspicious payment activity detected",
    request,
    userId,
    metadata: {
      reason,
      ...metadata,
    },
  });
}

export function logUploadRejected({
  request,
  userId = null,
  reason = null,
  metadata = {},
} = {}) {
  return securityWarn({
    event:
      SECURITY_EVENTS.FILE_UPLOAD_REJECTED,
    message:
      "File upload rejected",
    request,
    userId,
    metadata: {
      reason,
      ...metadata,
    },
  });
}

export function logApiError({
  request,
  userId = null,
  error = null,
  route = null,
  metadata = {},
} = {}) {
  return securityError({
    event:
      SECURITY_EVENTS.API_ERROR,
    message:
      "API security error",
    request,
    userId,
    metadata: {
      route,
      error:
        error instanceof Error
          ? error
          : sanitizeLogString(
              error,
              1_000,
            ),
      ...metadata,
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Request metadata helpers                                                   */
/* -------------------------------------------------------------------------- */

export function getSafeRequestContext(
  request,
) {
  try {
    return createRequestContext(
      request,
    );
  } catch {
    return {};
  }
}

/**
 * Returns a sanitized metadata object suitable for logs.
 */
export function redactSecurityMetadata(
  metadata,
) {
  try {
    return redactValue(
      metadata || {},
    );
  } catch {
    return {
      _redactionError: true,
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Operational configuration                                                  */
/* -------------------------------------------------------------------------- */

export function getSecurityLogConfig() {
  return {
    level:
      normalizeLevel(
        readEnv(
          "SECURITY_LOG_LEVEL",
        ),
      ),

    environment:
      getEnvironment(),

    enabled:
      !parseBoolean(
        readEnv(
          "DISABLE_SECURITY_LOGGING",
        ),
        false,
      ),
  };
}

export {
  SECURITY_LEVELS,
  SECURITY_EVENTS,
};