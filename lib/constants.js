export const APP_NAME = "Worldwide DIPO";

export const APP_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://worldwidedipo.com";

export const PROFILE_ROUTE_PREFIX = "/p/";

export const PROFILE_SLUG_PATTERN =
  /^[a-z0-9-]{3,30}$/;

export const PROFILE_NAME_PATTERN =
  /^[\p{L}\p{M}0-9 .,'&()\-]+$/u;

export const PROFILE_PROFESSION_PATTERN =
  /^[\p{L}\p{M}0-9 .,'&()\-\/+]+$/u;

export const PAYMENT_REFERENCE_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9._\-\/]{2,99}$/;

export const PROFILE_STATUSES = {
  DRAFT: "draft",
  PENDING: "pending",
  ACTIVE: "active",
  EXPIRED: "expired"
};

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected"
};

export const PAYMENT_TYPES = {
  INITIAL: "initial",
  RENEWAL: "renewal"
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};