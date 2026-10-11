/**
 * WORLDWIDE DIPO
 * Central Security Headers
 *
 * This helper is intentionally response-based so it can be
 * safely used by API routes, middleware/proxy helpers and
 * other server-side responses.
 *
 * Do NOT put secrets, tokens or private configuration here.
 */

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',

  'X-Frame-Options': 'DENY',

  'Referrer-Policy':
    'strict-origin-when-cross-origin',

  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=()',

  'Cross-Origin-Opener-Policy':
    'same-origin-allow-popups',

  'Cross-Origin-Resource-Policy':
    'same-site',

  'Origin-Agent-Cluster':
    '?1',

  'X-DNS-Prefetch-Control':
    'off',

  'X-Permitted-Cross-Domain-Policies':
    'none',
};

const HSTS_VALUE =
  'max-age=63072000; includeSubDomains; preload';

/**
 * Apply security headers to a Response.
 *
 * Existing API preserved:
 *
 * applySecurityHeaders(response)
 *
 * Returns the same response object so callers can continue
 * returning it normally.
 */
export function applySecurityHeaders(response) {
  if (
    !response ||
    !response.headers ||
    typeof response.headers.set !== 'function'
  ) {
    throw new TypeError(
      'A valid Response object is required.',
    );
  }

  const headers = response.headers;

  for (const [key, value] of Object.entries(
    SECURITY_HEADERS,
  )) {
    headers.set(key, value);
  }

  /*
   * HSTS is only meaningful in production over HTTPS.
   *
   * In local development we deliberately do not add it,
   * because browsers can cache HSTS for a long period.
   */
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Strict-Transport-Security',
      HSTS_VALUE,
    );
  }

  /*
   * Prevent intermediary/browser caching of responses that
   * may contain authenticated or security-sensitive data.
   *
   * Routes serving intentionally public/cacheable content can
   * override this header after calling this helper if needed.
   */
  headers.set(
    'Cache-Control',
    'no-store',
  );

  /*
   * Do not expose common framework/server fingerprints.
   */
  headers.delete('Server');
  headers.delete('X-Powered-By');

  return response;
}

/**
 * Apply an additional no-store policy.
 *
 * Useful for authentication, admin and payment responses.
 */
export function applyNoStore(response) {
  if (
    !response ||
    !response.headers ||
    typeof response.headers.set !== 'function'
  ) {
    throw new TypeError(
      'A valid Response object is required.',
    );
  }

  response.headers.set(
    'Cache-Control',
    'private, no-store, max-age=0',
  );

  response.headers.set(
    'Pragma',
    'no-cache',
  );

  return response;
}

/**
 * Apply headers specifically intended for JSON API responses.
 *
 * Existing response body/status are not modified.
 */
export function applyApiSecurityHeaders(
  response,
) {
  applySecurityHeaders(response);

  response.headers.set(
    'Content-Type',
    'application/json; charset=utf-8',
  );

  response.headers.set(
    'Cache-Control',
    'no-store',
  );

  return response;
}

/**
 * Return a CSP string for server-side responses that need
 * to set CSP explicitly.
 *
 * The application-level CSP remains configured in
 * next.config.js / proxy.js.
 *
 * unsafe-eval is intentionally NOT allowed.
 *
 * unsafe-inline remains for compatibility with the current
 * Next.js application. Removing it safely requires a nonce/hash
 * migration across the existing UI.
 */
export function getContentSecurityPolicy() {
  return [
    "default-src 'self'",

    "base-uri 'self'",

    "form-action 'self'",

    "frame-ancestors 'none'",

    "object-src 'none'",

    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",

    "style-src 'self' 'unsafe-inline'",

    "img-src 'self' data: blob: https:",

    "font-src 'self' data: https:",

    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com",

    "frame-src 'self' https://challenges.cloudflare.com",

    "media-src 'self' https:",

    "worker-src 'self' blob:",

    "manifest-src 'self'",

    'upgrade-insecure-requests',
  ].join('; ');
}

/**
 * Apply CSP when a route explicitly needs this helper.
 */
export function applyContentSecurityPolicy(
  response,
) {
  if (
    !response ||
    !response.headers ||
    typeof response.headers.set !== 'function'
  ) {
    throw new TypeError(
      'A valid Response object is required.',
    );
  }

  response.headers.set(
    'Content-Security-Policy',
    getContentSecurityPolicy(),
  );

  return response;
}