const buckets = new Map();

const DEFAULT_WINDOW_MS = 60 * 1000;
const DEFAULT_MAX_REQUESTS = 20;

const MAX_BUCKETS = 10_000;
const MAX_KEY_LENGTH = 256;

const MIN_WINDOW_MS = 1_000;
const MAX_WINDOW_MS = 24 * 60 * 60 * 1000;

const MIN_MAX_REQUESTS = 1;
const MAX_MAX_REQUESTS = 10_000;

function cleanup(now) {
  for (const [key, bucket] of buckets.entries()) {
    if (
      !bucket ||
      now - bucket.startedAt >= bucket.windowMs
    ) {
      buckets.delete(key);
    }
  }
}

function normalizeKey(key) {
  if (typeof key !== 'string') {
    return 'unknown';
  }

  const normalized = key
    .trim()
    .slice(0, MAX_KEY_LENGTH);

  return normalized || 'unknown';
}

function normalizeOptions({
  maxRequests = DEFAULT_MAX_REQUESTS,
  windowMs = DEFAULT_WINDOW_MS,
} = {}) {
  const safeMaxRequests =
    Number.isInteger(maxRequests)
      ? Math.min(
          Math.max(
            maxRequests,
            MIN_MAX_REQUESTS
          ),
          MAX_MAX_REQUESTS
        )
      : DEFAULT_MAX_REQUESTS;

  const safeWindowMs =
    Number.isFinite(windowMs)
      ? Math.min(
          Math.max(
            windowMs,
            MIN_WINDOW_MS
          ),
          MAX_WINDOW_MS
        )
      : DEFAULT_WINDOW_MS;

  return {
    maxRequests: safeMaxRequests,
    windowMs: safeWindowMs,
  };
}

export function checkRateLimit(
  key,
  options = {}
) {
  const now = Date.now();

  const normalizedKey =
    normalizeKey(key);

  const {
    maxRequests,
    windowMs,
  } =
    normalizeOptions(options);

  /*
   * Prevent unbounded memory growth.
   */
  if (buckets.size >= MAX_BUCKETS) {
    cleanup(now);
  }

  /*
   * If the process is still at the maximum
   * bucket capacity, fail closed instead of
   * allocating unlimited memory.
   */
  if (
    buckets.size >= MAX_BUCKETS &&
    !buckets.has(normalizedKey)
  ) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil(windowMs / 1000)
      ),
    };
  }

  const existing =
    buckets.get(normalizedKey);

  /*
   * Start a new rate-limit window.
   */
  if (
    !existing ||
    now - existing.startedAt >=
      existing.windowMs
  ) {
    buckets.set(normalizedKey, {
      count: 1,
      startedAt: now,
      windowMs,
    });

    return {
      allowed: true,
      remaining: Math.max(
        0,
        maxRequests - 1
      ),
    };
  }

  /*
   * Rate limit reached.
   */
  if (
    existing.count >=
    maxRequests
  ) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil(
          (
            existing.windowMs -
            (now - existing.startedAt)
          ) / 1000
        )
      ),
    };
  }

  /*
   * Count this request.
   */
  existing.count += 1;

  return {
    allowed: true,
    remaining: Math.max(
      0,
      maxRequests -
        existing.count
    ),
  };
}

export function getRequestRateLimitKey(
  request,
  prefix = 'request'
) {
  const safePrefix =
    typeof prefix === 'string'
      ? prefix
          .trim()
          .replace(
            /[^a-zA-Z0-9:_-]/g,
            ''
          )
          .slice(0, 64) ||
        'request'
      : 'request';

  const forwarded =
    request?.headers?.get?.(
      'x-forwarded-for'
    ) ||
    request?.headers?.get?.(
      'x-real-ip'
    ) ||
    'unknown';

  /*
   * Behind Vercel/proxy, use the first
   * forwarded IP only.
   */
  const firstIp = forwarded
    .split(',')[0]
    .trim()
    .slice(0, 100) || 'unknown';

  return `${safePrefix}:${firstIp}`;
}


/* ------------------------------------------------------------
   FIX: Distributed rate limiting (Upstash Redis REST)

   checkRateLimit() upar memory mein chalta hai, jo Vercel par har
   instance ka alag hota hai. checkRateLimitAsync() Upstash use
   karta hai; UPSTASH_REDIS_REST_URL / TOKEN set na ho ya Upstash
   fail ho to automatically purane memory limiter par girta hai.

   Use:  const rateLimit = await checkRateLimitAsync(key, options);
   ------------------------------------------------------------ */
export async function checkRateLimitAsync(
  key,
  options = {}
) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return checkRateLimit(key, options);
  }

  const { maxRequests, windowMs } = normalizeOptions(options);
  const redisKey = `rl:${normalizeKey(key)}`;

  try {
    const response = await fetch(
      `${url.replace(/\/+$/, '')}/pipeline`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', redisKey],
          ['PEXPIRE', redisKey, String(windowMs), 'NX'],
          ['PTTL', redisKey],
        ]),
        cache: 'no-store',
        signal: AbortSignal.timeout(1500),
      }
    );

    if (!response.ok) {
      return checkRateLimit(key, options);
    }

    const result = await response.json();
    const count = Number(result?.[0]?.result);
    const ttlMs = Number(result?.[2]?.result);

    if (!Number.isFinite(count)) {
      return checkRateLimit(key, options);
    }

    if (count > maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.max(
          1,
          Math.ceil(
            (Number.isFinite(ttlMs) && ttlMs > 0
              ? ttlMs
              : windowMs) / 1000
          )
        ),
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - count),
    };
  } catch {
    return checkRateLimit(key, options);
  }
}