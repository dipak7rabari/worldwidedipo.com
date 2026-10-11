export function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

export function cleanString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function normalizeSlug(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

export function escapeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function safeJsonStringify(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
}

export function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://worldwidedipo.com"
  ).replace(/\/+$/, "");
}

export function buildProfileUrl(slug) {
  return `${getBaseUrl()}/p/${encodeURIComponent(slug)}`;
}

export function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

export function formatDate(
  value,
  options = {}
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      ...options
    }
  ).format(date);
}

export function daysRemaining(expiresAt) {
  if (!expiresAt) {
    return 0;
  }

  const expiry =
    new Date(expiresAt).getTime();

  if (!Number.isFinite(expiry)) {
    return 0;
  }

  const difference =
    expiry - Date.now();

  if (difference <= 0) {
    return 0;
  }

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

export function isPlainObject(value) {
  if (
    value === null ||
    typeof value !== "object"
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