const isProduction =
  process.env.NODE_ENV === "production";

function normalizeMeta(meta) {
  if (!meta || typeof meta !== "object") {
    return {};
  }

  const safe = {
    ...meta
  };

  delete safe.password;
  delete safe.otp;
  delete safe.token;
  delete safe.access_token;
  delete safe.refresh_token;
  delete safe.cookie;
  delete safe.authorization;
  delete safe.paymentReference;
  delete safe.utr;

  return safe;
}

function write(level, message, meta = {}) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    meta: normalizeMeta(meta)
  };

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  if (!isProduction) {
    console.log(payload);
  }
}

export const logger = {
  info(message, meta) {
    write("info", message, meta);
  },

  warn(message, meta) {
    write("warn", message, meta);
  },

  error(message, meta) {
    write("error", message, meta);
  }
};

export default logger;