import 'server-only';

/**
 * WORLDWIDE DIPO
 * Abuse Protection
 *
 * Purpose:
 * - Detect repeated suspicious activity.
 * - Apply short-lived progressive cooldowns.
 * - Keep abuse state bounded in memory.
 * - Avoid storing sensitive request contents.
 * - Provide reusable server-side protection primitives.
 *
 * IMPORTANT:
 *
 * This is an application-level, process-local abuse guard.
 *
 * It is NOT a distributed rate limiter.
 *
 * In serverless / horizontally scaled environments each runtime
 * instance may have its own memory.
 *
 * Use this together with:
 * - lib/security/rate-limit.js
 * - authentication
 * - authorization
 * - database/RLS
 * - origin validation
 * - request-size limits
 *
 * Never use this utility as the only authorization mechanism.
 */

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const DEFAULT_WINDOW_MS =
  10 * 60 * 1000;

const DEFAULT_MAX_EVENTS = 12;

const DEFAULT_COOLDOWN_MS =
  60 * 1000;

const DEFAULT_MAX_STRIKES = 5;

const DEFAULT_STRIKE_DECAY_MS =
  30 * 60 * 1000;

const DEFAULT_BLOCK_MS =
  15 * 60 * 1000;

const MAX_RECORDS = 10_000;

const MAX_KEY_LENGTH = 256;

const MAX_REASON_LENGTH = 160;

const MIN_WINDOW_MS =
  1_000;

const MAX_WINDOW_MS =
  24 * 60 * 60 * 1000;

const MIN_COOLDOWN_MS =
  1_000;

const MAX_COOLDOWN_MS =
  24 * 60 * 60 * 1000;

const MIN_STRIKE_DECAY_MS =
  1_000;

const MAX_STRIKE_DECAY_MS =
  7 * 24 * 60 * 60 * 1000;

const MIN_BLOCK_MS =
  1_000;

const MAX_BLOCK_MS =
  7 * 24 * 60 * 60 * 1000;

/*
 * Module-level memory.
 *
 * The Map is deliberately bounded.
 */
const records = new Map();

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                           */
/* -------------------------------------------------------------------------- */

function now() {
  return Date.now();
}

function clampNumber(
  value,
  min,
  max,
  fallback,
) {
  if (
    !Number.isFinite(value)
  ) {
    return fallback;
  }

  return Math.min(
    Math.max(value, min),
    max,
  );
}

function normalizeInteger(
  value,
  min,
  max,
  fallback,
) {
  if (
    !Number.isInteger(value)
  ) {
    return fallback;
  }

  return Math.min(
    Math.max(value, min),
    max,
  );
}

function normalizeKey(
  value,
) {
  if (
    typeof value !== 'string'
  ) {
    return 'unknown';
  }

  const normalized =
    value
      .trim()
      .replace(/\s+/g, ' ')
      .slice(
        0,
        MAX_KEY_LENGTH,
      );

  return (
    normalized ||
    'unknown'
  );
}

function normalizeReason(
  value,
) {
  if (
    typeof value !== 'string'
  ) {
    return 'unspecified';
  }

  const normalized =
    value
      .trim()
      .replace(/\s+/g, ' ')
      .slice(
        0,
        MAX_REASON_LENGTH,
      );

  return (
    normalized ||
    'unspecified'
  );
}

function normalizeOptions(
  options = {},
) {
  return {
    windowMs:
      clampNumber(
        options.windowMs,
        MIN_WINDOW_MS,
        MAX_WINDOW_MS,
        DEFAULT_WINDOW_MS,
      ),

    maxEvents:
      normalizeInteger(
        options.maxEvents,
        1,
        10_000,
        DEFAULT_MAX_EVENTS,
      ),

    cooldownMs:
      clampNumber(
        options.cooldownMs,
        MIN_COOLDOWN_MS,
        MAX_COOLDOWN_MS,
        DEFAULT_COOLDOWN_MS,
      ),

    maxStrikes:
      normalizeInteger(
        options.maxStrikes,
        1,
        100,
        DEFAULT_MAX_STRIKES,
      ),

    strikeDecayMs:
      clampNumber(
        options.strikeDecayMs,
        MIN_STRIKE_DECAY_MS,
        MAX_STRIKE_DECAY_MS,
        DEFAULT_STRIKE_DECAY_MS,
      ),

    blockMs:
      clampNumber(
        options.blockMs,
        MIN_BLOCK_MS,
        MAX_BLOCK_MS,
        DEFAULT_BLOCK_MS,
      ),
  };
}

function createRecord(
  timestamp,
) {
  return {
    windowStartedAt:
      timestamp,

    eventCount: 0,

    strikes: 0,

    lastStrikeAt: 0,

    blockedUntil: 0,

    lastSeenAt: timestamp,
  };
}

function isExpired(
  record,
  timestamp,
  options,
) {
  if (!record) {
    return true;
  }

  if (
    record.blockedUntil >
    timestamp
  ) {
    return false;
  }

  const windowExpired =
    timestamp -
      record.windowStartedAt >=
    options.windowMs;

  const strikeExpired =
    record.strikes > 0 &&
    timestamp -
      record.lastStrikeAt >=
      options.strikeDecayMs;

  const idleExpired =
    timestamp -
      record.lastSeenAt >=
    Math.max(
      options.windowMs,
      options.strikeDecayMs,
    );

  return (
    windowExpired &&
    (strikeExpired ||
      record.strikes === 0) &&
    idleExpired
  );
}

function cleanup(
  timestamp,
  options,
) {
  /*
   * First remove naturally expired entries.
   */
  for (
    const [
      key,
      record,
    ] of records
  ) {
    if (
      isExpired(
        record,
        timestamp,
        options,
      )
    ) {
      records.delete(key);
    }
  }

  /*
   * If the process is still full, remove the
   * oldest entries until we are below capacity.
   */
  if (
    records.size <
    MAX_RECORDS
  ) {
    return;
  }

  const entries =
    Array.from(
      records.entries(),
    );

  entries.sort(
    (
      [, a],
      [, b],
    ) =>
      a.lastSeenAt -
      b.lastSeenAt,
  );

  const removeCount =
    Math.max(
      1,
      Math.ceil(
        entries.length *
          0.1,
      ),
    );

  for (
    let index = 0;
    index <
      removeCount &&
      index <
        entries.length;
    index += 1
  ) {
    records.delete(
      entries[index][0],
    );
  }
}

function ensureCapacity(
  timestamp,
  options,
  key,
) {
  if (
    records.size <
    MAX_RECORDS
  ) {
    return true;
  }

  cleanup(
    timestamp,
    options,
  );

  if (
    records.size <
    MAX_RECORDS
  ) {
    return true;
  }

  /*
   * An existing key is allowed to continue using
   * its own record. New unbounded keys are rejected.
   */
  return records.has(key);
}

function getOrCreateRecord(
  key,
  timestamp,
  options,
) {
  let record =
    records.get(key);

  if (
    record &&
    isExpired(
      record,
      timestamp,
      options,
    )
  ) {
    records.delete(key);
    record = null;
  }

  if (!record) {
    if (
      !ensureCapacity(
        timestamp,
        options,
        key,
      )
    ) {
      return null;
    }

    record =
      createRecord(
        timestamp,
      );

    records.set(
      key,
      record,
    );
  }

  return record;
}

function resetWindowIfNeeded(
  record,
  timestamp,
  options,
) {
  if (
    timestamp -
      record.windowStartedAt >=
    options.windowMs
  ) {
    record.windowStartedAt =
      timestamp;

    record.eventCount = 0;
  }
}

function decayStrikesIfNeeded(
  record,
  timestamp,
  options,
) {
  if (
    record.strikes <= 0
  ) {
    return;
  }

  if (
    timestamp -
      record.lastStrikeAt >=
    options.strikeDecayMs
  ) {
    record.strikes = 0;
    record.lastStrikeAt = 0;
  }
}

/* -------------------------------------------------------------------------- */
/* Public key helpers                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Normalize an externally constructed abuse key.
 */
export function normalizeAbuseKey(
  key,
) {
  return normalizeKey(
    key,
  );
}

/**
 * Create a stable composite key from a few
 * non-sensitive identifiers.
 *
 * Do not pass passwords, tokens, cookies, payment
 * credentials, or raw request bodies here.
 */
export function createAbuseKey(
  ...parts
) {
  const normalized =
    parts
      .filter(
        (part) =>
          part !==
            null &&
          part !==
            undefined,
      )
      .map(
        (part) =>
          normalizeKey(
            String(part),
          ),
      )
      .filter(
        (part) =>
          part !==
          'unknown',
      );

  if (
    normalized.length === 0
  ) {
    return 'unknown';
  }

  return normalizeKey(
    normalized.join(':'),
  );
}

/* -------------------------------------------------------------------------- */
/* Request identity helpers                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Return the first IP from common proxy headers.
 *
 * This value is an abuse-detection signal only.
 *
 * Do not treat it as proof of identity.
 */
export function getRequestIp(
  request,
) {
  const headers =
    request?.headers;

  if (
    !headers ||
    typeof headers.get !==
      'function'
  ) {
    return 'unknown';
  }

  const forwarded =
    headers.get(
      'x-forwarded-for',
    );

  if (
    forwarded
  ) {
    const first =
      forwarded
        .split(',')[0]
        ?.trim();

    if (first) {
      return normalizeKey(
        first,
      );
    }
  }

  const realIp =
    headers.get(
      'x-real-ip',
    );

  if (
    realIp
  ) {
    return normalizeKey(
      realIp,
    );
  }

  return 'unknown';
}

/**
 * Build a request-level abuse key.
 *
 * `identity` may be a user ID or another already-normalized
 * application identity.
 */
export function getRequestAbuseKey(
  request,
  {
    prefix = 'abuse',
    identity = null,
    route = null,
  } = {},
) {
  const ip =
    getRequestIp(
      request,
    );

  return createAbuseKey(
    prefix,
    route,
    identity,
    ip,
  );
}

/* -------------------------------------------------------------------------- */
/* Core protection                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Check whether an action is currently allowed.
 *
 * This does not increment the event count.
 *
 * Use `recordAbuseEvent()` after the action/request has
 * actually been received.
 */
export function checkAbuseProtection(
  key,
  options = {},
) {
  const normalizedKey =
    normalizeKey(key);

  const config =
    normalizeOptions(
      options,
    );

  const timestamp =
    now();

  cleanup(
    timestamp,
    config,
  );

  const record =
    records.get(
      normalizedKey,
    );

  if (!record) {
    return {
      allowed: true,
      blocked: false,
      reason: null,
      remaining:
        config.maxEvents,
      retryAfter: 0,
      strikes: 0,
    };
  }

  if (
    record.blockedUntil >
    timestamp
  ) {
    return {
      allowed: false,
      blocked: true,
      reason:
        'temporary_block',
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil(
          (
            record.blockedUntil -
            timestamp
          ) / 1000,
        ),
      ),
      strikes:
        record.strikes,
    };
  }

  resetWindowIfNeeded(
    record,
    timestamp,
    config,
  );

  decayStrikesIfNeeded(
    record,
    timestamp,
    config,
  );

  if (
    record.eventCount >=
    config.maxEvents
  ) {
    return {
      allowed: false,
      blocked: false,
      reason:
        'abuse_threshold',
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil(
          (
            config.windowMs -
            (
              timestamp -
              record.windowStartedAt
            )
          ) / 1000,
        ),
      ),
      strikes:
        record.strikes,
    };
  }

  return {
    allowed: true,
    blocked: false,
    reason: null,
    remaining: Math.max(
      0,
      config.maxEvents -
        record.eventCount,
    ),
    retryAfter: 0,
    strikes:
      record.strikes,
  };
}

/**
 * Record a normal event.
 *
 * Returns the same protection result shape as
 * `checkAbuseProtection()`.
 */
export function recordAbuseEvent(
  key,
  options = {},
) {
  const normalizedKey =
    normalizeKey(key);

  const config =
    normalizeOptions(
      options,
    );

  const timestamp =
    now();

  const record =
    getOrCreateRecord(
      normalizedKey,
      timestamp,
      config,
    );

  /*
   * If memory capacity cannot safely accommodate
   * this key, fail closed.
   */
  if (!record) {
    return {
      allowed: false,
      blocked: true,
      reason:
        'protection_capacity',
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil(
          config.cooldownMs /
            1000,
        ),
      ),
      strikes:
        config.maxStrikes,
    };
  }

  record.lastSeenAt =
    timestamp;

  resetWindowIfNeeded(
    record,
    timestamp,
    config,
  );

  decayStrikesIfNeeded(
    record,
    timestamp,
    config,
  );

  if (
    record.blockedUntil >
    timestamp
  ) {
    return {
      allowed: false,
      blocked: true,
      reason:
        'temporary_block',
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil(
          (
            record.blockedUntil -
            timestamp
          ) / 1000,
        ),
      ),
      strikes:
        record.strikes,
    };
  }

  record.eventCount += 1;

  /*
   * Soft threshold.
   */
  if (
    record.eventCount >
    config.maxEvents
  ) {
    return {
      allowed: false,
      blocked: false,
      reason:
        'abuse_threshold',
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil(
          (
            record.windowStartedAt +
            config.windowMs -
            timestamp
          ) / 1000,
        ),
      ),
      strikes:
        record.strikes,
    };
  }

  return {
    allowed: true,
    blocked: false,
    reason: null,
    remaining: Math.max(
      0,
      config.maxEvents -
        record.eventCount,
    ),
    retryAfter: 0,
    strikes:
      record.strikes,
  };
}

/**
 * Record a suspicious event.
 *
 * Suspicious events increase a short-lived strike counter.
 * Reaching the configured strike threshold creates a temporary
 * block.
 */
export function recordAbuseSignal(
  key,
  reason = 'unspecified',
  options = {},
) {
  const normalizedKey =
    normalizeKey(key);

  const config =
    normalizeOptions(
      options,
    );

  const timestamp =
    now();

  const record =
    getOrCreateRecord(
      normalizedKey,
      timestamp,
      config,
    );

  if (!record) {
    return {
      allowed: false,
      blocked: true,
      reason:
        'protection_capacity',
      signal:
        normalizeReason(
          reason,
        ),
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil(
          config.blockMs /
            1000,
        ),
      ),
      strikes:
        config.maxStrikes,
    };
  }

  record.lastSeenAt =
    timestamp;

  decayStrikesIfNeeded(
    record,
    timestamp,
    config,
  );

  if (
    record.blockedUntil >
    timestamp
  ) {
    return {
      allowed: false,
      blocked: true,
      reason:
        'temporary_block',
      signal:
        normalizeReason(
          reason,
        ),
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil(
          (
            record.blockedUntil -
            timestamp
          ) / 1000,
        ),
      ),
      strikes:
        record.strikes,
    };
  }

  record.strikes += 1;
  record.lastStrikeAt =
    timestamp;

  if (
    record.strikes >=
    config.maxStrikes
  ) {
    record.blockedUntil =
      timestamp +
      config.blockMs;

    return {
      allowed: false,
      blocked: true,
      reason:
        'temporary_block',
      signal:
        normalizeReason(
          reason,
        ),
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil(
          config.blockMs /
            1000,
        ),
      ),
      strikes:
        record.strikes,
    };
  }

  return {
    allowed: true,
    blocked: false,
    reason:
      'suspicious_activity',
    signal:
      normalizeReason(
        reason,
      ),
    remaining: Math.max(
      0,
      config.maxStrikes -
        record.strikes,
    ),
    retryAfter: 0,
    strikes:
      record.strikes,
  };
}

/* -------------------------------------------------------------------------- */
/* Combined helper                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Run a normal event check and record it only when allowed.
 *
 * This is useful in API routes where a single helper is preferred.
 */
export function protectAgainstAbuse(
  key,
  options = {},
) {
  const checked =
    checkAbuseProtection(
      key,
      options,
    );

  if (!checked.allowed) {
    return checked;
  }

  return recordAbuseEvent(
    key,
    options,
  );
}

/* -------------------------------------------------------------------------- */
/* Administrative / lifecycle helpers                                        */
/* -------------------------------------------------------------------------- */

/**
 * Remove a key from the local protection store.
 *
 * Useful after a trusted administrative action or a completed
 * security workflow.
 */
export function clearAbuseRecord(
  key,
) {
  const normalizedKey =
    normalizeKey(key);

  return records.delete(
    normalizedKey,
  );
}

/**
 * Read a minimal, non-sensitive status snapshot.
 *
 * Does not expose the internal record object.
 */
export function getAbuseStatus(
  key,
  options = {},
) {
  const normalizedKey =
    normalizeKey(key);

  const config =
    normalizeOptions(
      options,
    );

  const timestamp =
    now();

  const record =
    records.get(
      normalizedKey,
    );

  if (!record) {
    return {
      exists: false,
      blocked: false,
      eventCount: 0,
      strikes: 0,
      retryAfter: 0,
    };
  }

  decayStrikesIfNeeded(
    record,
    timestamp,
    config,
  );

  const blocked =
    record.blockedUntil >
    timestamp;

  return {
    exists: true,
    blocked,
    eventCount:
      record.eventCount,
    strikes:
      record.strikes,
    retryAfter: blocked
      ? Math.max(
          1,
          Math.ceil(
            (
              record.blockedUntil -
              timestamp
            ) / 1000,
          ),
        )
      : 0,
  };
}

/**
 * Remove expired entries manually.
 *
 * Normally cleanup happens automatically, but this export can
 * be useful for long-running Node processes.
 */
export function cleanupAbuseProtection(
  options = {},
) {
  const config =
    normalizeOptions(
      options,
    );

  cleanup(
    now(),
    config,
  );

  return {
    size:
      records.size,
    max:
      MAX_RECORDS,
  };
}

/**
 * Return current local store size.
 *
 * Useful for internal diagnostics.
 */
export function getAbuseProtectionStats() {
  return {
    size:
      records.size,
    max:
      MAX_RECORDS,
  };
}

/* -------------------------------------------------------------------------- */
/* Safe response helper                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Convert an abuse result into a safe API response payload.
 *
 * This deliberately does not expose:
 * - internal Map state
 * - IP addresses
 * - user IDs
 * - keys
 * - internal reasons
 * - implementation details
 */
export function toAbuseResponse(
  result,
) {
  if (
    !result ||
    typeof result !==
      'object'
  ) {
    return {
      allowed: false,
      blocked: true,
      retryAfter: 60,
    };
  }

  return {
    allowed:
      result.allowed === true,

    blocked:
      result.blocked === true,

    retryAfter:
      Number.isFinite(
        result.retryAfter,
      )
        ? Math.max(
            0,
            Math.ceil(
              result.retryAfter,
            ),
          )
        : 0,
  };
}