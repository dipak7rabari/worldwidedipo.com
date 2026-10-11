/**
 * lib/support/support-utils.js
 *
 * Production-grade support utilities for Worldwide DIPO.
 *
 * Responsibilities:
 * - Normalize support requests.
 * - Validate support subjects/messages/categories.
 * - Sanitize user-controlled support data.
 * - Prevent header/log injection.
 * - Normalize contact information.
 * - Generate safe support metadata.
 * - Provide consistent support response helpers.
 *
 * This module does NOT send emails or write to the database.
 * Database/email operations should remain in their dedicated services.
 */

import {
  sanitizeEmail,
  sanitizePlainText,
  sanitizeSingleLine,
  sanitizePhone,
  sanitizeRecord,
} from "@/lib/security/sanitize";

const MAX_SUBJECT_LENGTH = 180;
const MAX_MESSAGE_LENGTH = 10_000;
const MAX_CATEGORY_LENGTH = 80;
const MAX_NAME_LENGTH = 160;
const MAX_EMAIL_LENGTH = 320;
const MAX_PHONE_LENGTH = 32;
const MAX_METADATA_KEYS = 30;

const MIN_MESSAGE_LENGTH = 10;

export const SUPPORT_EMAIL =
  "dipolabs123@gmail.com";

export const SUPPORT_CATEGORIES =
  Object.freeze([
    "general",
    "account",
    "profile",
    "payment",
    "technical",
    "security",
    "report",
    "privacy",
    "feedback",
    "other",
  ]);

export const SUPPORT_CATEGORY_LABELS =
  Object.freeze({
    general: "General",
    account: "Account",
    profile: "DIPO Profile",
    payment: "Payment",
    technical: "Technical",
    security: "Security",
    report: "Report",
    privacy: "Privacy",
    feedback: "Feedback",
    other: "Other",
  });

const BLOCKED_KEYS = new Set([
  "__proto__",
  "prototype",
  "constructor",
]);

/* -------------------------------------------------------------------------- */
/* Generic helpers                                                            */
/* -------------------------------------------------------------------------- */

function isPlainObject(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function normalizeCategory(
  value,
) {
  const category =
    sanitizeSingleLine(value, {
      maxLength:
        MAX_CATEGORY_LENGTH,
      collapseWhitespace: true,
    }).toLowerCase();

  if (
    SUPPORT_CATEGORIES.includes(
      category,
    )
  ) {
    return category;
  }

  return "general";
}

function normalizeSubject(
  value,
) {
  return sanitizeSingleLine(value, {
    maxLength:
      MAX_SUBJECT_LENGTH,
    collapseWhitespace: true,
  });
}

function normalizeMessage(
  value,
) {
  return sanitizePlainText(value, {
    maxLength:
      MAX_MESSAGE_LENGTH,
  });
}

function normalizeName(
  value,
) {
  return sanitizeSingleLine(value, {
    maxLength:
      MAX_NAME_LENGTH,
    collapseWhitespace: true,
  });
}

function normalizeEmail(
  value,
) {
  return sanitizeEmail(value)
    .slice(0, MAX_EMAIL_LENGTH);
}

function normalizePhone(
  value,
) {
  return sanitizePhone(value)
    .slice(0, MAX_PHONE_LENGTH);
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

export function validateSupportCategory(
  value,
) {
  const category =
    typeof value === "string"
      ? value.trim().toLowerCase()
      : "";

  return SUPPORT_CATEGORIES.includes(
    category,
  );
}

export function validateSupportSubject(
  value,
) {
  if (
    typeof value !== "string"
  ) {
    return false;
  }

  const subject =
    normalizeSubject(value);

  return (
    subject.length >= 3 &&
    subject.length <=
      MAX_SUBJECT_LENGTH
  );
}

export function validateSupportMessage(
  value,
) {
  if (
    typeof value !== "string"
  ) {
    return false;
  }

  const message =
    normalizeMessage(value);

  return (
    message.length >=
      MIN_MESSAGE_LENGTH &&
    message.length <=
      MAX_MESSAGE_LENGTH
  );
}

export function validateSupportEmail(
  value,
) {
  if (
    typeof value !== "string"
  ) {
    return false;
  }

  return Boolean(
    normalizeEmail(value),
  );
}

export function validateSupportRequest(
  input,
) {
  if (
    !isPlainObject(input)
  ) {
    return {
      valid: false,
      errors: [
        {
          field: null,
          code: "OBJECT_REQUIRED",
          message:
            "A valid support request is required.",
        },
      ],
      value: null,
    };
  }

  const errors = [];

  for (const key of Object.keys(
    input,
  )) {
    if (
      BLOCKED_KEYS.has(key)
    ) {
      errors.push({
        field: key,
        code: "DANGEROUS_KEY",
        message:
          "Invalid request field.",
      });
    }
  }

  const subject =
    normalizeSubject(
      input.subject,
    );

  const message =
    normalizeMessage(
      input.message,
    );

  const category =
    normalizeCategory(
      input.category,
    );

  if (
    subject.length < 3
  ) {
    errors.push({
      field: "subject",
      code: "INVALID_SUBJECT",
      message:
        "Please enter a valid subject.",
    });
  }

  if (
    message.length <
    MIN_MESSAGE_LENGTH
  ) {
    errors.push({
      field: "message",
      code: "INVALID_MESSAGE",
      message:
        "Please provide more details about your request.",
    });
  }

  if (
    message.length >
    MAX_MESSAGE_LENGTH
  ) {
    errors.push({
      field: "message",
      code: "MESSAGE_TOO_LONG",
      message:
        "Your message is too long.",
    });
  }

  if (
    input.category !==
      undefined &&
    !validateSupportCategory(
      input.category,
    )
  ) {
    errors.push({
      field: "category",
      code: "INVALID_CATEGORY",
      message:
        "Invalid support category.",
    });
  }

  const email =
    input.email !==
      undefined &&
    input.email !== null
      ? normalizeEmail(
          input.email,
        )
      : "";

  if (
    input.email &&
    !email
  ) {
    errors.push({
      field: "email",
      code: "INVALID_EMAIL",
      message:
        "Please enter a valid email address.",
    });
  }

  const name =
    input.name !==
      undefined &&
    input.name !== null
      ? normalizeName(
          input.name,
        )
      : "";

  const phone =
    input.phone !==
      undefined &&
    input.phone !== null
      ? normalizePhone(
          input.phone,
        )
      : "";

  if (
    input.phone &&
    !phone
  ) {
    errors.push({
      field: "phone",
      code: "INVALID_PHONE",
      message:
        "Please enter a valid phone number.",
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      value: null,
    };
  }

  return {
    valid: true,
    errors: [],
    value: {
      subject,
      message,
      category,
      ...(name
        ? { name }
        : {}),
      ...(email
        ? { email }
        : {}),
      ...(phone
        ? { phone }
        : {}),
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Request normalization                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Converts raw client input into the canonical support payload.
 *
 * Unknown fields are intentionally ignored.
 */
export function normalizeSupportRequest(
  input,
) {
  const result =
    validateSupportRequest(
      input,
    );

  if (!result.valid) {
    return null;
  }

  return result.value;
}

/**
 * Returns a safe payload suitable for passing to the support service.
 */
export function prepareSupportRequest(
  input,
) {
  return normalizeSupportRequest(
    input,
  );
}

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Sanitizes optional support metadata.
 *
 * Never pass secrets, tokens, cookies, authorization headers,
 * payment credentials, or raw request bodies here.
 */
export function sanitizeSupportMetadata(
  metadata,
) {
  if (
    !isPlainObject(metadata)
  ) {
    return {};
  }

  const result = {};
  let count = 0;

  for (const [
    key,
    value,
  ] of Object.entries(
    metadata,
  )) {
    if (
      count >=
      MAX_METADATA_KEYS
    ) {
      break;
    }

    if (
      BLOCKED_KEYS.has(key)
    ) {
      continue;
    }

    if (
      /password|token|secret|cookie|authorization|api[-_]?key|otp|csrf|captcha|payment/i.test(
        key,
      )
    ) {
      continue;
    }

    if (
      typeof value ===
      "string"
    ) {
      result[key] =
        sanitizeSingleLine(
          value,
          {
            maxLength: 500,
            collapseWhitespace:
              true,
          },
        );
    } else if (
      typeof value ===
        "number" &&
      Number.isFinite(value)
    ) {
      result[key] = value;
    } else if (
      typeof value ===
      "boolean"
    ) {
      result[key] = value;
    }

    count += 1;
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Support ticket helpers                                                     */
/* -------------------------------------------------------------------------- */

export function getSupportCategoryLabel(
  category,
) {
  const normalized =
    normalizeCategory(
      category,
    );

  return (
    SUPPORT_CATEGORY_LABELS[
      normalized
    ] ||
    "General"
  );
}

export function buildSupportSubject(
  {
    category = "general",
    subject = "",
  } = {},
) {
  const label =
    getSupportCategoryLabel(
      category,
    );

  const cleanSubject =
    normalizeSubject(subject);

  if (!cleanSubject) {
    return `[Worldwide DIPO] ${label} Support`;
  }

  return `[Worldwide DIPO] ${label} — ${cleanSubject}`;
}

/**
 * Builds a stable human-readable support reference.
 *
 * This is not a security credential and should not be used
 * as authorization.
 */
export function buildSupportReference(
  id,
) {
  const clean =
    typeof id === "string"
      ? id
          .trim()
          .replace(
            /[^a-zA-Z0-9]/g,
            "",
          )
          .slice(0, 16)
          .toUpperCase()
      : "";

  if (!clean) {
    return null;
  }

  return `DIPO-${clean}`;
}

/* -------------------------------------------------------------------------- */
/* Safe user-facing messages                                                  */
/* -------------------------------------------------------------------------- */

export const SUPPORT_MESSAGES =
  Object.freeze({
    success:
      "Your support request has been received. Our team will get back to you.",
    invalid:
      "Please check your support details and try again.",
    unavailable:
      "Support is temporarily unavailable. Please try again later.",
    rateLimited:
      "Too many support requests. Please wait a moment and try again.",
    unauthorized:
      "You need to be signed in to perform this action.",
    forbidden:
      "You do not have permission to perform this action.",
  });

export function getSupportErrorMessage(
  code,
) {
  switch (
    typeof code === "string"
      ? code
          .trim()
          .toLowerCase()
      : ""
  ) {
    case "rate_limited":
    case "too_many_requests":
      return SUPPORT_MESSAGES.rateLimited;

    case "unauthorized":
    case "not_authenticated":
      return SUPPORT_MESSAGES.unauthorized;

    case "forbidden":
    case "access_denied":
      return SUPPORT_MESSAGES.forbidden;

    case "service_unavailable":
    case "provider_unavailable":
      return SUPPORT_MESSAGES.unavailable;

    default:
      return SUPPORT_MESSAGES.invalid;
  }
}

/* -------------------------------------------------------------------------- */
/* Email helpers                                                              */
/* -------------------------------------------------------------------------- */

export function buildSupportReplyTo(
  email,
) {
  const normalized =
    normalizeEmail(email);

  return normalized || null;
}

export function buildSupportMailOptions(
  {
    request,
    reference = null,
  } = {},
) {
  const normalized =
    normalizeSupportRequest(
      request,
    );

  if (!normalized) {
    return null;
  }

  const supportSubject =
    buildSupportSubject(
      normalized,
    );

  return {
    to: SUPPORT_EMAIL,
    subject:
      reference
        ? `${supportSubject} [${reference}]`
        : supportSubject,
    replyTo:
      buildSupportReplyTo(
        normalized.email,
      ),
    category:
      normalized.category,
    reference,
  };
}

/* -------------------------------------------------------------------------- */
/* Display helpers                                                            */
/* -------------------------------------------------------------------------- */

export function formatSupportRequest(
  request,
) {
  const normalized =
    normalizeSupportRequest(
      request,
    );

  if (!normalized) {
    return "";
  }

  const lines = [
    `Category: ${getSupportCategoryLabel(
      normalized.category,
    )}`,
    `Subject: ${normalized.subject}`,
  ];

  if (normalized.name) {
    lines.push(
      `Name: ${normalized.name}`,
    );
  }

  if (normalized.email) {
    lines.push(
      `Email: ${normalized.email}`,
    );
  }

  if (normalized.phone) {
    lines.push(
      `Phone: ${normalized.phone}`,
    );
  }

  lines.push(
    "",
    "Message:",
    normalized.message,
  );

  return lines.join("\n");
}

/**
 * Produces a safe summary for logs/admin UI.
 * The actual support message is intentionally omitted.
 */
export function summarizeSupportRequest(
  request,
) {
  const normalized =
    normalizeSupportRequest(
      request,
    );

  if (!normalized) {
    return null;
  }

  return {
    category:
      normalized.category,
    subject:
      normalized.subject,
    hasName:
      Boolean(normalized.name),
    hasEmail:
      Boolean(normalized.email),
    hasPhone:
      Boolean(normalized.phone),
    messageLength:
      normalized.message.length,
  };
}

/* -------------------------------------------------------------------------- */
/* Response helpers                                                           */
/* -------------------------------------------------------------------------- */

export function supportSuccessResponse(
  {
    reference = null,
    message =
      SUPPORT_MESSAGES.success,
  } = {},
) {
  return {
    success: true,
    message,
    ...(reference
      ? { reference }
      : {}),
  };
}

export function supportErrorResponse(
  {
    code = "INVALID_REQUEST",
    message = null,
    status = 400,
  } = {},
) {
  return {
    success: false,
    status,
    code,
    message:
      message ||
      getSupportErrorMessage(
        code,
      ),
  };
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const SUPPORT_LIMITS =
  Object.freeze({
    MIN_MESSAGE_LENGTH,
    MAX_SUBJECT_LENGTH,
    MAX_MESSAGE_LENGTH,
    MAX_CATEGORY_LENGTH,
    MAX_NAME_LENGTH,
    MAX_EMAIL_LENGTH,
    MAX_PHONE_LENGTH,
    MAX_METADATA_KEYS,
  });

export const SUPPORT_INFO =
  Object.freeze({
    email: SUPPORT_EMAIL,
    website:
      "https://worldwidedipo.com",
    instagram:
      "@dipolabs.io",
  });