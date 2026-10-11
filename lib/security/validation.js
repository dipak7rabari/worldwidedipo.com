/**
 * lib/security/validation.js
 *
 * Production-grade validation helpers for Worldwide DIPO.
 *
 * Principles:
 * - Strict by default.
 * - Never trust client-provided fields.
 * - Validate before database/API operations.
 * - Keep validation deterministic and dependency-free.
 * - Return structured results when needed.
 * - Never mutate caller-owned objects.
 * - Reject prototype-pollution keys.
 */

const MAX_STRING_LENGTH = 100_000;
const MAX_ARRAY_LENGTH = 1_000;
const MAX_OBJECT_KEYS = 1_000;
const MAX_DEPTH = 8;

const BLOCKED_KEYS = new Set([
  "__proto__",
  "prototype",
  "constructor",
]);

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SLUG_REGEX =
  /^[a-z0-9](?:[a-z0-9-]{0,118}[a-z0-9])?$/;

const USERNAME_REGEX =
  /^[a-z0-9](?:[a-z0-9._-]{0,62}[a-z0-9])?$/;

const PHONE_REGEX =
  /^\+?[0-9()\s.-]{7,32}$/;

const HEX_COLOR_REGEX =
  /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const SAFE_TEXT_REGEX =
  /^[\p{L}\p{M}\p{N}\p{P}\p{S}\s]*$/u;

/* -------------------------------------------------------------------------- */
/* Result helpers                                                             */
/* -------------------------------------------------------------------------- */

export function ok(
  value = true,
) {
  return {
    success: true,
    valid: true,
    value,
    errors: [],
  };
}

export function fail(
  errors,
  value = null,
) {
  const normalized = Array.isArray(
    errors,
  )
    ? errors
    : [
        {
          field: null,
          code: "INVALID",
          message: String(
            errors || "Invalid input",
          ),
        },
      ];

  return {
    success: false,
    valid: false,
    value,
    errors: normalized,
  };
}

function error(
  field,
  code,
  message,
) {
  return {
    field,
    code,
    message,
  };
}

/* -------------------------------------------------------------------------- */
/* Primitive validators                                                       */
/* -------------------------------------------------------------------------- */

export function isString(
  value,
) {
  return typeof value === "string";
}

export function isNonEmptyString(
  value,
) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

export function isBoolean(
  value,
) {
  return typeof value === "boolean";
}

export function isNumber(
  value,
) {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

export function isInteger(
  value,
) {
  return (
    typeof value === "number" &&
    Number.isInteger(value)
  );
}

export function isPlainObject(
  value,
) {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

export function isArray(
  value,
) {
  return Array.isArray(value);
}

/* -------------------------------------------------------------------------- */
/* Length / format validators                                                 */
/* -------------------------------------------------------------------------- */

export function validateString(
  value,
  {
    field = null,
    required = false,
    minLength = 0,
    maxLength = MAX_STRING_LENGTH,
    trim = true,
    pattern = null,
    allowEmpty = !required,
  } = {},
) {
  if (
    value === null ||
    value === undefined
  ) {
    return required
      ? fail(
          error(
            field,
            "REQUIRED",
            "This field is required.",
          ),
        )
      : ok(null);
  }

  if (typeof value !== "string") {
    return fail(
      error(
        field,
        "TYPE",
        "Must be a string.",
      ),
    );
  }

  const normalized = trim
    ? value.trim()
    : value;

  if (
    !allowEmpty &&
    normalized.length === 0
  ) {
    return fail(
      error(
        field,
        "EMPTY",
        "This field cannot be empty.",
      ),
    );
  }

  if (
    normalized.length < minLength
  ) {
    return fail(
      error(
        field,
        "MIN_LENGTH",
        `Must be at least ${minLength} characters.`,
      ),
    );
  }

  if (
    normalized.length > maxLength
  ) {
    return fail(
      error(
        field,
        "MAX_LENGTH",
        `Must be at most ${maxLength} characters.`,
      ),
    );
  }

  if (
    pattern &&
    !pattern.test(normalized)
  ) {
    return fail(
      error(
        field,
        "FORMAT",
        "Invalid format.",
      ),
    );
  }

  return ok(normalized);
}

export function validateNumber(
  value,
  {
    field = null,
    required = false,
    min = -Infinity,
    max = Infinity,
    integer = false,
  } = {},
) {
  if (
    value === null ||
    value === undefined
  ) {
    return required
      ? fail(
          error(
            field,
            "REQUIRED",
            "This field is required.",
          ),
        )
      : ok(null);
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return fail(
      error(
        field,
        "TYPE",
        "Must be a valid number.",
      ),
    );
  }

  if (
    integer &&
    !Number.isInteger(value)
  ) {
    return fail(
      error(
        field,
        "INTEGER",
        "Must be an integer.",
      ),
    );
  }

  if (value < min) {
    return fail(
      error(
        field,
        "MIN",
        `Must be at least ${min}.`,
      ),
    );
  }

  if (value > max) {
    return fail(
      error(
        field,
        "MAX",
        `Must be at most ${max}.`,
      ),
    );
  }

  return ok(value);
}

/* -------------------------------------------------------------------------- */
/* Security validation                                                        */
/* -------------------------------------------------------------------------- */

export function hasBlockedKeys(
  value,
  {
    maxDepth = MAX_DEPTH,
  } = {},
) {
  function walk(input, depth) {
    if (
      depth > maxDepth ||
      input === null ||
      typeof input !== "object"
    ) {
      return false;
    }

    if (Array.isArray(input)) {
      return input.some((item) =>
        walk(item, depth + 1),
      );
    }

    for (const [key, child] of Object.entries(
      input,
    )) {
      if (BLOCKED_KEYS.has(key)) {
        return true;
      }

      if (
        child &&
        typeof child === "object" &&
        walk(child, depth + 1)
      ) {
        return true;
      }
    }

    return false;
  }

  return walk(value, 0);
}

export function validateSafeObject(
  value,
  {
    field = null,
    maxDepth = MAX_DEPTH,
    maxKeys = MAX_OBJECT_KEYS,
  } = {},
) {
  if (!isPlainObject(value)) {
    return fail(
      error(
        field,
        "OBJECT_REQUIRED",
        "A plain object is required.",
      ),
    );
  }

  if (hasBlockedKeys(value, {
    maxDepth,
  })) {
    return fail(
      error(
        field,
        "DANGEROUS_KEYS",
        "Request contains prohibited object keys.",
      ),
    );
  }

  if (
    Object.keys(value).length >
    maxKeys
  ) {
    return fail(
      error(
        field,
        "TOO_MANY_KEYS",
        "Request contains too many fields.",
      ),
    );
  }

  return ok(value);
}

/* -------------------------------------------------------------------------- */
/* Common identifiers                                                         */
/* -------------------------------------------------------------------------- */

export function isUuid(
  value,
) {
  return (
    typeof value === "string" &&
    UUID_REGEX.test(value.trim())
  );
}

export function validateUuid(
  value,
  {
    field = "id",
    required = true,
  } = {},
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return required
      ? fail(
          error(
            field,
            "REQUIRED",
            "ID is required.",
          ),
        )
      : ok(null);
  }

  if (!isUuid(value)) {
    return fail(
      error(
        field,
        "INVALID_UUID",
        "Invalid ID.",
      ),
    );
  }

  return ok(value.trim().toLowerCase());
}

export function isSlug(
  value,
) {
  return (
    typeof value === "string" &&
    SLUG_REGEX.test(
      value.trim().toLowerCase(),
    )
  );
}

export function validateSlug(
  value,
  {
    field = "slug",
    required = true,
    minLength = 3,
    maxLength = 120,
  } = {},
) {
  const result =
    validateString(value, {
      field,
      required,
      minLength,
      maxLength,
      trim: true,
      allowEmpty: !required,
    });

  if (!result.valid) {
    return result;
  }

  if (
    result.value === null ||
    result.value === ""
  ) {
    return result;
  }

  const slug =
    result.value.toLowerCase();

  if (!isSlug(slug)) {
    return fail(
      error(
        field,
        "INVALID_SLUG",
        "Slug contains invalid characters.",
      ),
    );
  }

  return ok(slug);
}

export function isUsername(
  value,
) {
  return (
    typeof value === "string" &&
    USERNAME_REGEX.test(
      value.trim().toLowerCase(),
    )
  );
}

export function validateUsername(
  value,
  {
    field = "username",
    required = true,
  } = {},
) {
  const result =
    validateString(value, {
      field,
      required,
      minLength: 3,
      maxLength: 64,
      trim: true,
    });

  if (!result.valid) {
    return result;
  }

  if (
    result.value === null ||
    result.value === ""
  ) {
    return result;
  }

  const username =
    result.value.toLowerCase();

  if (!isUsername(username)) {
    return fail(
      error(
        field,
        "INVALID_USERNAME",
        "Username contains invalid characters.",
      ),
    );
  }

  return ok(username);
}

/* -------------------------------------------------------------------------- */
/* Email / phone                                                              */
/* -------------------------------------------------------------------------- */

export function isEmail(
  value,
) {
  if (
    typeof value !== "string" ||
    value.length > 320
  ) {
    return false;
  }

  return EMAIL_REGEX.test(
    value.trim(),
  );
}

export function validateEmail(
  value,
  {
    field = "email",
    required = true,
  } = {},
) {
  const result =
    validateString(value, {
      field,
      required,
      minLength: 3,
      maxLength: 320,
      trim: true,
    });

  if (!result.valid) {
    return result;
  }

  if (
    result.value === null ||
    result.value === ""
  ) {
    return result;
  }

  const email =
    result.value.toLowerCase();

  if (!isEmail(email)) {
    return fail(
      error(
        field,
        "INVALID_EMAIL",
        "Enter a valid email address.",
      ),
    );
  }

  return ok(email);
}

export function isPhone(
  value,
) {
  return (
    typeof value === "string" &&
    PHONE_REGEX.test(
      value.trim(),
    )
  );
}

export function validatePhone(
  value,
  {
    field = "phone",
    required = false,
  } = {},
) {
  const result =
    validateString(value, {
      field,
      required,
      minLength: 7,
      maxLength: 32,
      trim: true,
    });

  if (!result.valid) {
    return result;
  }

  if (
    result.value === null ||
    result.value === ""
  ) {
    return result;
  }

  if (!isPhone(result.value)) {
    return fail(
      error(
        field,
        "INVALID_PHONE",
        "Enter a valid phone number.",
      ),
    );
  }

  return ok(result.value);
}

/* -------------------------------------------------------------------------- */
/* URL validation                                                             */
/* -------------------------------------------------------------------------- */

export function parseHttpUrl(
  value,
) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  try {
    const url = new URL(
      value.trim(),
    );

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return null;
    }

    if (!url.hostname) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

export function isHttpUrl(
  value,
) {
  return Boolean(
    parseHttpUrl(value),
  );
}

export function validateHttpUrl(
  value,
  {
    field = "url",
    required = false,
    maxLength = 4_096,
  } = {},
) {
  const result =
    validateString(value, {
      field,
      required,
      maxLength,
      trim: true,
    });

  if (!result.valid) {
    return result;
  }

  if (
    result.value === null ||
    result.value === ""
  ) {
    return result;
  }

  const url =
    parseHttpUrl(result.value);

  if (!url) {
    return fail(
      error(
        field,
        "INVALID_URL",
        "Enter a valid HTTP or HTTPS URL.",
      ),
    );
  }

  return ok(url.toString());
}

export function validateUrlList(
  value,
  {
    field = "links",
    maxItems = 50,
  } = {},
) {
  if (value === undefined) {
    return ok([]);
  }

  if (!Array.isArray(value)) {
    return fail(
      error(
        field,
        "ARRAY_REQUIRED",
        "A list of URLs is required.",
      ),
    );
  }

  if (value.length > maxItems) {
    return fail(
      error(
        field,
        "TOO_MANY_ITEMS",
        `Maximum ${maxItems} URLs are allowed.`,
      ),
    );
  }

  const errors = [];
  const urls = [];

  value.forEach(
    (item, index) => {
      const result =
        validateHttpUrl(item, {
          field: `${field}.${index}`,
          required: true,
        });

      if (!result.valid) {
        errors.push(
          ...result.errors,
        );
      } else {
        urls.push(result.value);
      }
    },
  );

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok(urls);
}

/* -------------------------------------------------------------------------- */
/* Text validation                                                            */
/* -------------------------------------------------------------------------- */

export function validatePlainText(
  value,
  {
    field = "text",
    required = false,
    minLength = 0,
    maxLength = 5_000,
    allowNewlines = true,
  } = {},
) {
  const result =
    validateString(value, {
      field,
      required,
      minLength,
      maxLength,
      trim: true,
    });

  if (!result.valid) {
    return result;
  }

  if (
    result.value === null ||
    result.value === ""
  ) {
    return result;
  }

  if (
    !allowNewlines &&
    /[\r\n]/.test(result.value)
  ) {
    return fail(
      error(
        field,
        "NEWLINES_NOT_ALLOWED",
        "Line breaks are not allowed.",
      ),
    );
  }

  if (
    !SAFE_TEXT_REGEX.test(
      result.value,
    )
  ) {
    return fail(
      error(
        field,
        "INVALID_TEXT",
        "Text contains unsupported characters.",
      ),
    );
  }

  return ok(result.value);
}

/* -------------------------------------------------------------------------- */
/* Enum / choice validation                                                   */
/* -------------------------------------------------------------------------- */

export function validateEnum(
  value,
  allowed,
  {
    field = "value",
    required = true,
  } = {},
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return required
      ? fail(
          error(
            field,
            "REQUIRED",
            "A value is required.",
          ),
        )
      : ok(null);
  }

  if (
    !Array.isArray(allowed) ||
    allowed.length === 0
  ) {
    return fail(
      error(
        field,
        "CONFIGURATION",
        "Validation options are invalid.",
      ),
    );
  }

  if (!allowed.includes(value)) {
    return fail(
      error(
        field,
        "INVALID_CHOICE",
        "Selected value is not allowed.",
      ),
    );
  }

  return ok(value);
}

/* -------------------------------------------------------------------------- */
/* Array validation                                                           */
/* -------------------------------------------------------------------------- */

export function validateArray(
  value,
  {
    field = "items",
    required = false,
    minLength = 0,
    maxLength = MAX_ARRAY_LENGTH,
    itemValidator = null,
  } = {},
) {
  if (
    value === null ||
    value === undefined
  ) {
    return required
      ? fail(
          error(
            field,
            "REQUIRED",
            "A list is required.",
          ),
        )
      : ok([]);
  }

  if (!Array.isArray(value)) {
    return fail(
      error(
        field,
        "ARRAY_REQUIRED",
        "Must be a list.",
      ),
    );
  }

  if (value.length < minLength) {
    return fail(
      error(
        field,
        "MIN_ITEMS",
        `At least ${minLength} items are required.`,
      ),
    );
  }

  if (value.length > maxLength) {
    return fail(
      error(
        field,
        "MAX_ITEMS",
        `Maximum ${maxLength} items are allowed.`,
      ),
    );
  }

  if (
    typeof itemValidator !==
    "function"
  ) {
    return ok(value);
  }

  const errors = [];
  const output = [];

  value.forEach(
    (item, index) => {
      let result;

      try {
        result =
          itemValidator(
            item,
            index,
          );
      } catch {
        result = fail(
          error(
            `${field}.${index}`,
            "VALIDATION_ERROR",
            "Item validation failed.",
          ),
        );
      }

      if (!result?.valid) {
        errors.push(
          ...(result?.errors || [
            error(
              `${field}.${index}`,
              "INVALID_ITEM",
              "Invalid item.",
            ),
          ]),
        );
      } else {
        output.push(
          result.value,
        );
      }
    },
  );

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok(output);
}

/* -------------------------------------------------------------------------- */
/* Profile validators                                                         */
/* -------------------------------------------------------------------------- */

export const PROFILE_FIELD_LIMITS =
  Object.freeze({
    name: 160,
    profession: 160,
    headline: 240,
    bio: 5_000,
    location: 240,
    category: 120,
    about: 10_000,
  });

export function validateProfileField(
  field,
  value,
  {
    required = false,
  } = {},
) {
  const maxLength =
    PROFILE_FIELD_LIMITS[field] ??
    2_000;

  return validatePlainText(
    value,
    {
      field,
      required,
      maxLength,
      minLength:
        required ? 1 : 0,
      allowNewlines:
        ![
          "name",
          "profession",
          "location",
          "category",
        ].includes(field),
    },
  );
}

export function validateProfileInput(
  profile,
  {
    partial = true,
  } = {},
) {
  const objectResult =
    validateSafeObject(
      profile,
      {
        field: "profile",
      },
    );

  if (!objectResult.valid) {
    return objectResult;
  }

  const errors = [];
  const output = {};

  const fields =
    Object.keys(
      PROFILE_FIELD_LIMITS,
    );

  for (const field of fields) {
    if (
      partial &&
      !(field in profile)
    ) {
      continue;
    }

    const result =
      validateProfileField(
        field,
        profile[field],
        {
          required:
            !partial &&
            field === "name",
        },
      );

    if (!result.valid) {
      errors.push(
        ...result.errors,
      );
    } else {
      output[field] =
        result.value;
    }
  }

  if ("slug" in profile) {
    const result =
      validateSlug(
        profile.slug,
        {
          field: "slug",
          required: true,
        },
      );

    if (!result.valid) {
      errors.push(
        ...result.errors,
      );
    } else {
      output.slug =
        result.value;
    }
  }

  if ("email" in profile) {
    const result =
      validateEmail(
        profile.email,
        {
          field: "email",
          required: false,
        },
      );

    if (!result.valid) {
      errors.push(
        ...result.errors,
      );
    } else if (
      result.value
    ) {
      output.email =
        result.value;
    }
  }

  if ("phone" in profile) {
    const result =
      validatePhone(
        profile.phone,
        {
          field: "phone",
          required: false,
        },
      );

    if (!result.valid) {
      errors.push(
        ...result.errors,
      );
    } else if (
      result.value
    ) {
      output.phone =
        result.value;
    }
  }

  if ("links" in profile) {
    const result =
      validateUrlList(
        profile.links,
        {
          field: "links",
        },
      );

    if (!result.valid) {
      errors.push(
        ...result.errors,
      );
    } else {
      output.links =
        result.value;
    }
  }

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok(output);
}

/* -------------------------------------------------------------------------- */
/* Payment validators                                                         */
/* -------------------------------------------------------------------------- */

export const PAYMENT_PLANS =
  Object.freeze([
    "free",
    "basic",
    "pro",
    "premium",
    "business",
  ]);

export const PAYMENT_TYPES =
  Object.freeze([
    "initial",
    "renewal",
    "subscription",
    "upgrade",
  ]);

export function validatePaymentPlan(
  value,
) {
  return validateEnum(
    value,
    PAYMENT_PLANS,
    {
      field: "plan",
      required: true,
    },
  );
}

export function validatePaymentType(
  value,
) {
  return validateEnum(
    value,
    PAYMENT_TYPES,
    {
      field: "paymentType",
      required: true,
    },
  );
}

export function validatePaymentReference(
  value,
) {
  const result =
    validateString(value, {
      field: "paymentReference",
      required: true,
      minLength: 4,
      maxLength: 256,
      trim: true,
      allowEmpty: false,
    });

  if (!result.valid) {
    return result;
  }

  // Payment references should never contain control characters.
  if (
    /[\u0000-\u001F\u007F]/.test(
      result.value,
    )
  ) {
    return fail(
      error(
        "paymentReference",
        "INVALID_REFERENCE",
        "Invalid payment reference.",
      ),
    );
  }

  return ok(result.value);
}

/* -------------------------------------------------------------------------- */
/* File validation                                                            */
/* -------------------------------------------------------------------------- */

export const IMAGE_MIME_TYPES =
  Object.freeze([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]);

export function validateImageFile(
  file,
  {
    field = "file",
    maxSize = 6 * 1024 * 1024,
    allowedTypes = IMAGE_MIME_TYPES,
  } = {},
) {
  if (!file) {
    return fail(
      error(
        field,
        "FILE_REQUIRED",
        "A file is required.",
      ),
    );
  }

  if (
    typeof file.size !== "number" ||
    !Number.isFinite(file.size)
  ) {
    return fail(
      error(
        field,
        "INVALID_FILE",
        "Invalid file.",
      ),
    );
  }

  if (file.size <= 0) {
    return fail(
      error(
        field,
        "EMPTY_FILE",
        "File cannot be empty.",
      ),
    );
  }

  if (file.size > maxSize) {
    return fail(
      error(
        field,
        "FILE_TOO_LARGE",
        "File exceeds the maximum allowed size.",
      ),
    );
  }

  if (
    typeof file.type !== "string" ||
    !allowedTypes.includes(
      file.type.toLowerCase(),
    )
  ) {
    return fail(
      error(
        field,
        "INVALID_FILE_TYPE",
        "Unsupported file type.",
      ),
    );
  }

  return ok(file);
}

/* -------------------------------------------------------------------------- */
/* Color validation                                                           */
/* -------------------------------------------------------------------------- */

export function isHexColor(
  value,
) {
  return (
    typeof value === "string" &&
    HEX_COLOR_REGEX.test(
      value.trim(),
    )
  );
}

export function validateHexColor(
  value,
  {
    field = "color",
    required = false,
  } = {},
) {
  const result =
    validateString(value, {
      field,
      required,
      maxLength: 9,
      trim: true,
    });

  if (!result.valid) {
    return result;
  }

  if (
    result.value === null ||
    result.value === ""
  ) {
    return result;
  }

  if (!isHexColor(result.value)) {
    return fail(
      error(
        field,
        "INVALID_COLOR",
        "Invalid color value.",
      ),
    );
  }

  return ok(
    result.value.toLowerCase(),
  );
}

/* -------------------------------------------------------------------------- */
/* Date validation                                                            */
/* -------------------------------------------------------------------------- */

export function validateDate(
  value,
  {
    field = "date",
    required = false,
  } = {},
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return required
      ? fail(
          error(
            field,
            "REQUIRED",
            "Date is required.",
          ),
        )
      : ok(null);
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return fail(
      error(
        field,
        "INVALID_DATE",
        "Invalid date.",
      ),
    );
  }

  return ok(date);
}

/* -------------------------------------------------------------------------- */
/* Query / pagination validation                                              */
/* -------------------------------------------------------------------------- */

export function validatePagination(
  {
    page = 1,
    limit = 20,
  } = {},
  {
    maxLimit = 100,
  } = {},
) {
  const pageResult =
    validateNumber(page, {
      field: "page",
      min: 1,
      max: 1_000_000,
      integer: true,
    });

  const limitResult =
    validateNumber(limit, {
      field: "limit",
      min: 1,
      max: maxLimit,
      integer: true,
    });

  const errors = [
    ...(pageResult.errors || []),
    ...(limitResult.errors || []),
  ];

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok({
    page: pageResult.value,
    limit: limitResult.value,
    offset:
      (pageResult.value - 1) *
      limitResult.value,
  });
}

export function validateSearchQuery(
  value,
) {
  return validateString(value, {
    field: "q",
    required: false,
    minLength: 0,
    maxLength: 200,
    trim: true,
  });
}

/* -------------------------------------------------------------------------- */
/* Generic object schema validation                                           */
/* -------------------------------------------------------------------------- */

export function validateFields(
  input,
  schema,
) {
  if (!isPlainObject(input)) {
    return fail(
      error(
        null,
        "OBJECT_REQUIRED",
        "A plain object is required.",
      ),
    );
  }

  if (
    !schema ||
    typeof schema !== "object"
  ) {
    return fail(
      error(
        null,
        "SCHEMA_REQUIRED",
        "Validation schema is required.",
      ),
    );
  }

  if (hasBlockedKeys(input)) {
    return fail(
      error(
        null,
        "DANGEROUS_KEYS",
        "Request contains prohibited object keys.",
      ),
    );
  }

  const errors = [];
  const output = {};

  for (const [
    field,
    rules,
  ] of Object.entries(schema)) {
    const exists =
      Object.prototype.hasOwnProperty.call(
        input,
        field,
      );

    if (!exists) {
      if (rules?.required) {
        errors.push(
          error(
            field,
            "REQUIRED",
            "This field is required.",
          ),
        );
      }

      continue;
    }

    if (
      typeof rules?.validate !==
      "function"
    ) {
      continue;
    }

    let result;

    try {
      result =
        rules.validate(
          input[field],
        );
    } catch {
      result = fail(
        error(
          field,
          "VALIDATION_ERROR",
          "Field validation failed.",
        ),
      );
    }

    if (!result?.valid) {
      errors.push(
        ...(result?.errors || [
          error(
            field,
            "INVALID",
            "Invalid field.",
          ),
        ]),
      );
    } else {
      output[field] =
        result.value;
    }
  }

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok(output);
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const VALIDATION_LIMITS =
  Object.freeze({
    MAX_STRING_LENGTH,
    MAX_ARRAY_LENGTH,
    MAX_OBJECT_KEYS,
    MAX_DEPTH,
  });

export const VALIDATION_PATTERNS =
  Object.freeze({
    UUID: UUID_REGEX,
    EMAIL: EMAIL_REGEX,
    SLUG: SLUG_REGEX,
    USERNAME: USERNAME_REGEX,
    PHONE: PHONE_REGEX,
    HEX_COLOR: HEX_COLOR_REGEX,
  });

export const SECURITY_VALIDATION_KEYS =
  Object.freeze([
    ...BLOCKED_KEYS,
  ]);