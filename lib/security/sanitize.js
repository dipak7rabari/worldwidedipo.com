/**
 * lib/security/sanitize.js
 *
 * Production-grade input sanitization helpers.
 *
 * Principles:
 * - Never trust client input.
 * - Normalize without silently changing security-sensitive identifiers.
 * - Remove dangerous control characters.
 * - Prevent prototype-pollution keys.
 * - Provide safe HTML escaping for text contexts.
 * - Provide URL sanitization for public profile/social links.
 * - Preserve legitimate Unicode text.
 * - Keep this module dependency-free and server/client compatible.
 */

const MAX_STRING_LENGTH = 100_000;
const MAX_DEPTH = 8;
const MAX_ARRAY_LENGTH = 1_000;
const MAX_OBJECT_KEYS = 1_000;

const BLOCKED_KEYS = new Set([
  "__proto__",
  "prototype",
  "constructor",
]);

const DANGEROUS_PROTOCOLS = new Set([
  "javascript:",
  "vbscript:",
  "data:",
  "file:",
]);

const ALLOWED_URL_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "tel:",
]);

const HTML_ESCAPE_MAP = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
});

/* -------------------------------------------------------------------------- */
/* Core normalization                                                         */
/* -------------------------------------------------------------------------- */

function isObjectLike(value) {
  return (
    value !== null &&
    typeof value === "object"
  );
}

function stripDangerousControls(value) {
  return value
    .replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      "",
    )
    .replace(/\uFEFF/g, "");
}

function normalizeUnicode(value) {
  try {
    return value.normalize("NFC");
  } catch {
    return value;
  }
}

function normalizeLineBreaks(value) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}

/**
 * General-purpose safe string normalization.
 *
 * Does NOT HTML-escape the value.
 * Escaping should happen at the final output context.
 */
export function sanitizeString(
  value,
  {
    trim = true,
    maxLength = MAX_STRING_LENGTH,
    preserveNewlines = true,
    collapseWhitespace = false,
  } = {},
) {
  if (typeof value !== "string") {
    return "";
  }

  let result = value;

  result = normalizeUnicode(result);
  result = stripDangerousControls(result);

  if (preserveNewlines) {
    result = normalizeLineBreaks(result);
  }

  if (collapseWhitespace) {
    result = result.replace(/\s+/g, " ");
  }

  if (trim) {
    result = result.trim();
  }

  if (
    Number.isFinite(maxLength) &&
    maxLength >= 0 &&
    result.length > maxLength
  ) {
    result = result.slice(0, maxLength);
  }

  return result;
}

/**
 * Text intended for a single-line UI field.
 */
export function sanitizeSingleLine(
  value,
  options = {},
) {
  return sanitizeString(value, {
    ...options,
    preserveNewlines: false,
    collapseWhitespace:
      options.collapseWhitespace ?? true,
  });
}

/**
 * Text intended for a multiline text area.
 */
export function sanitizeMultiline(
  value,
  options = {},
) {
  return sanitizeString(value, {
    ...options,
    preserveNewlines: true,
    collapseWhitespace: false,
  });
}

/* -------------------------------------------------------------------------- */
/* HTML escaping                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Escapes text for safe insertion into HTML text/attribute contexts.
 *
 * Prefer React JSX escaping whenever possible.
 * Use this helper when HTML strings must be generated manually.
 */
export function escapeHtml(value) {
  const input = String(value ?? "");

  return input.replace(
    /[&<>"'`]/g,
    (character) =>
      HTML_ESCAPE_MAP[character] || character,
  );
}

/**
 * Alias for semantic clarity.
 */
export const escapeHtmlText = escapeHtml;

/* -------------------------------------------------------------------------- */
/* URL sanitization                                                           */
/* -------------------------------------------------------------------------- */

function normalizeUrlInput(value) {
  return sanitizeSingleLine(value, {
    trim: true,
    maxLength: 4_096,
    collapseWhitespace: true,
  });
}

function hasDangerousProtocol(value) {
  const normalized = value
    .replace(/[\u0000-\u0020]/g, "")
    .toLowerCase();

  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (normalized.startsWith(protocol)) {
      return true;
    }
  }

  return false;
}

/**
 * Sanitizes public-facing URLs.
 *
 * By default only HTTP(S) URLs are accepted.
 */
export function sanitizeUrl(
  value,
  {
    allowMailto = false,
    allowTel = false,
    requireHttp = true,
  } = {},
) {
  const input = normalizeUrlInput(value);

  if (!input) {
    return "";
  }

  if (hasDangerousProtocol(input)) {
    return "";
  }

  // Reject protocol-relative URLs.
  if (input.startsWith("//")) {
    return "";
  }

  let parsed;

  try {
    parsed = new URL(input);
  } catch {
    // For public links we intentionally do not guess a protocol.
    return "";
  }

  const protocol = parsed.protocol.toLowerCase();

  if (protocol === "http:" || protocol === "https:") {
    if (!parsed.hostname) {
      return "";
    }

    return parsed.toString();
  }

  if (allowMailto && protocol === "mailto:") {
    return parsed.toString();
  }

  if (allowTel && protocol === "tel:") {
    return parsed.toString();
  }

  if (!requireHttp && ALLOWED_URL_PROTOCOLS.has(protocol)) {
    return parsed.toString();
  }

  return "";
}

/**
 * Strict public web URL sanitizer.
 */
export function sanitizeHttpUrl(value) {
  return sanitizeUrl(value, {
    allowMailto: false,
    allowTel: false,
    requireHttp: true,
  });
}

/* -------------------------------------------------------------------------- */
/* Email / phone helpers                                                      */
/* -------------------------------------------------------------------------- */

export function sanitizeEmail(value) {
  const email = sanitizeSingleLine(value, {
    maxLength: 320,
    collapseWhitespace: true,
  }).toLowerCase();

  if (!email) {
    return "";
  }

  // Deliberately conservative. Full email validation belongs to the
  // validation layer; this only rejects obviously malformed input.
  if (
    email.length > 320 ||
    email.includes("<") ||
    email.includes(">") ||
    email.includes('"') ||
    email.includes("'") ||
    email.includes(" ")
  ) {
    return "";
  }

  const atIndex = email.lastIndexOf("@");

  if (
    atIndex <= 0 ||
    atIndex === email.length - 1
  ) {
    return "";
  }

  return email;
}

export function sanitizePhone(value) {
  return sanitizeSingleLine(value, {
    maxLength: 32,
    collapseWhitespace: true,
  }).replace(/[^\d+().\-\s]/g, "");
}

/* -------------------------------------------------------------------------- */
/* Slugs / identifiers                                                        */
/* -------------------------------------------------------------------------- */

export function sanitizeSlug(value) {
  const slug = sanitizeSingleLine(value, {
    maxLength: 120,
    collapseWhitespace: false,
  })
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.slice(0, 120);
}

export function sanitizeUsername(value) {
  return sanitizeSingleLine(value, {
    maxLength: 64,
    collapseWhitespace: false,
  })
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/-{2,}/g, "-")
    .replace(/_{2,}/g, "_")
    .replace(/^[._-]+|[._-]+$/g, "")
    .slice(0, 64);
}

/* -------------------------------------------------------------------------- */
/* Search / query input                                                       */
/* -------------------------------------------------------------------------- */

export function sanitizeSearchQuery(
  value,
  {
    maxLength = 200,
  } = {},
) {
  return sanitizeSingleLine(value, {
    maxLength,
    collapseWhitespace: true,
  });
}

/**
 * Removes common SQL-like punctuation from a search term.
 *
 * This is NOT a substitute for parameterized queries.
 * Database queries must still use bound parameters.
 */
export function sanitizeSearchTerm(value) {
  return sanitizeSearchQuery(value)
    .replace(/[;'"\\]/g, "")
    .trim();
}

/* -------------------------------------------------------------------------- */
/* Object sanitization                                                        */
/* -------------------------------------------------------------------------- */

function sanitizeKey(key) {
  if (typeof key !== "string") {
    return "";
  }

  const normalized = sanitizeSingleLine(key, {
    maxLength: 256,
    collapseWhitespace: false,
  });

  if (!normalized) {
    return "";
  }

  if (BLOCKED_KEYS.has(normalized)) {
    return "";
  }

  return normalized;
}

/**
 * Recursively removes dangerous object keys and normalizes strings.
 *
 * This function intentionally does not mutate the original object.
 */
export function sanitizeObject(
  value,
  {
    maxDepth = MAX_DEPTH,
    maxArrayLength = MAX_ARRAY_LENGTH,
    maxObjectKeys = MAX_OBJECT_KEYS,
    maxStringLength = MAX_STRING_LENGTH,
    preserveNewlines = true,
  } = {},
) {
  function walk(input, depth) {
    if (depth > maxDepth) {
      return null;
    }

    if (typeof input === "string") {
      return sanitizeString(input, {
        maxLength: maxStringLength,
        preserveNewlines,
      });
    }

    if (
      typeof input === "number" ||
      typeof input === "boolean"
    ) {
      if (typeof input === "number" && !Number.isFinite(input)) {
        return null;
      }

      return input;
    }

    if (input === null) {
      return null;
    }

    if (Array.isArray(input)) {
      return input
        .slice(0, maxArrayLength)
        .map((item) => walk(item, depth + 1));
    }

    if (!isObjectLike(input)) {
      return null;
    }

    const output = {};
    const entries = Object.entries(input).slice(
      0,
      maxObjectKeys,
    );

    for (const [rawKey, rawValue] of entries) {
      const key = sanitizeKey(rawKey);

      if (!key) {
        continue;
      }

      output[key] = walk(
        rawValue,
        depth + 1,
      );
    }

    return output;
  }

  return walk(value, 0);
}

/**
 * Sanitizes only plain object records.
 */
export function sanitizeRecord(value, options = {}) {
  if (!value || typeof value !== "object") {
    return {};
  }

  if (Array.isArray(value)) {
    return {};
  }

  const result = sanitizeObject(
    value,
    options,
  );

  return result &&
    typeof result === "object" &&
    !Array.isArray(result)
    ? result
    : {};
}

/* -------------------------------------------------------------------------- */
/* Prototype-pollution protection                                             */
/* -------------------------------------------------------------------------- */

export function hasDangerousKeys(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(hasDangerousKeys);
  }

  for (const [key, child] of Object.entries(value)) {
    if (BLOCKED_KEYS.has(key)) {
      return true;
    }

    if (
      child &&
      typeof child === "object" &&
      hasDangerousKeys(child)
    ) {
      return true;
    }
  }

  return false;
}

export function removeDangerousKeys(value) {
  if (Array.isArray(value)) {
    return value.map(removeDangerousKeys);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const result = {};

  for (const [key, child] of Object.entries(value)) {
    if (BLOCKED_KEYS.has(key)) {
      continue;
    }

    result[key] =
      child &&
      typeof child === "object"
        ? removeDangerousKeys(child)
        : child;
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Profile-oriented sanitization                                              */
/* -------------------------------------------------------------------------- */

const PROFILE_TEXT_LIMITS = Object.freeze({
  name: 160,
  profession: 160,
  headline: 240,
  bio: 5_000,
  location: 240,
  category: 120,
  about: 10_000,
});

export function sanitizeProfileText(
  field,
  value,
) {
  const maxLength =
    PROFILE_TEXT_LIMITS[field] ??
    2_000;

  return sanitizeMultiline(value, {
    maxLength,
  });
}

export function sanitizeProfileFields(
  profile = {},
) {
  if (
    !profile ||
    typeof profile !== "object" ||
    Array.isArray(profile)
  ) {
    return {};
  }

  const output = {};

  for (const field of Object.keys(
    PROFILE_TEXT_LIMITS,
  )) {
    if (!(field in profile)) {
      continue;
    }

    output[field] = sanitizeProfileText(
      field,
      profile[field],
    );
  }

  if ("slug" in profile) {
    output.slug = sanitizeSlug(
      profile.slug,
    );
  }

  if ("email" in profile) {
    output.email = sanitizeEmail(
      profile.email,
    );
  }

  if ("phone" in profile) {
    output.phone = sanitizePhone(
      profile.phone,
    );
  }

  return output;
}

/* -------------------------------------------------------------------------- */
/* HTML / rich-text safety                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Removes HTML tags from untrusted text.
 *
 * This is intentionally not a full HTML sanitizer.
 * For rich HTML, use a dedicated allowlist-based HTML sanitizer.
 */
export function stripHtml(value) {
  return sanitizeString(value, {
    preserveNewlines: true,
  })
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:#\d+|#x[\da-f]+|[a-z][\da-z]+);/gi, "");
}

/**
 * Text-safe version for profile descriptions and bios.
 */
export function sanitizePlainText(
  value,
  options = {},
) {
  return stripHtml(
    sanitizeMultiline(value, options),
  );
}

/* -------------------------------------------------------------------------- */
/* JSON-safe sanitization                                                     */
/* -------------------------------------------------------------------------- */

export function sanitizeJsonValue(
  value,
  options = {},
) {
  return sanitizeObject(value, {
    ...options,
    preserveNewlines:
      options.preserveNewlines ?? true,
  });
}

/**
 * Safely parses and sanitizes JSON text.
 */
export function parseAndSanitizeJson(
  input,
  options = {},
) {
  if (typeof input !== "string") {
    return null;
  }

  const source = input.trim();

  if (!source || source.length > 1_000_000) {
    return null;
  }

  try {
    const parsed = JSON.parse(source);

    return sanitizeJsonValue(
      parsed,
      options,
    );
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Generic helpers                                                            */
/* -------------------------------------------------------------------------- */

export function truncate(
  value,
  maxLength,
  suffix = "…",
) {
  const input = String(value ?? "");

  if (
    !Number.isFinite(maxLength) ||
    maxLength <= 0
  ) {
    return "";
  }

  if (input.length <= maxLength) {
    return input;
  }

  const safeSuffix =
    String(suffix ?? "");

  if (safeSuffix.length >= maxLength) {
    return safeSuffix.slice(0, maxLength);
  }

  return (
    input.slice(
      0,
      maxLength - safeSuffix.length,
    ) + safeSuffix
  );
}

export function isSafeString(
  value,
  {
    maxLength = MAX_STRING_LENGTH,
  } = {},
) {
  return (
    typeof value === "string" &&
    value.length <= maxLength &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(
      value,
    )
  );
}

export function isSafeUrl(value) {
  return Boolean(
    sanitizeHttpUrl(value),
  );
}

export const SANITIZE_LIMITS = Object.freeze({
  MAX_STRING_LENGTH,
  MAX_DEPTH,
  MAX_ARRAY_LENGTH,
  MAX_OBJECT_KEYS,
});

export const BLOCKED_OBJECT_KEYS = Object.freeze([
  ...BLOCKED_KEYS,
]);