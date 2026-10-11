import { getPublicEnv } from '@/lib/security/env';

/**
 * WORLDWIDE DIPO
 * Same-Origin / CORS Security
 *
 * Purpose:
 * - Allow requests only from the configured Worldwide DIPO origin.
 * - Never trust an arbitrary Origin supplied by the client.
 * - Normalize origins before comparison.
 * - Reject malformed / dangerous origins.
 * - Preserve existing exports used by API routes.
 *
 * IMPORTANT:
 * This is an origin-validation helper.
 * It is NOT a replacement for authentication,
 * authorization, ownership checks, RLS or rate limiting.
 */

const MAX_ORIGIN_LENGTH = 2048;

/**
 * Normalize an origin safely.
 *
 * Only HTTP/HTTPS origins are accepted.
 *
 * Examples:
 *   https://worldwidedipo.com/path
 *      -> https://worldwidedipo.com
 *
 *   https://worldwidedipo.com/
 *      -> https://worldwidedipo.com
 *
 *   javascript:...
 *      -> rejected
 */
function normalizeOrigin(value) {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_ORIGIN_LENGTH
  ) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);

    /*
     * Only normal web origins are accepted.
     *
     * This prevents values such as:
     * javascript:
     * data:
     * file:
     * blob:
     * custom-app:
     */
    if (
      parsed.protocol !== 'https:' &&
      parsed.protocol !== 'http:'
    ) {
      return null;
    }

    /*
     * An Origin has no path/query/hash component.
     *
     * URL.origin intentionally strips those components,
     * so a Referer URL can also be normalized safely.
     */
    return parsed.origin.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Read the application's configured public origin.
 *
 * NEXT_PUBLIC_BASE_URL is configuration, not a secret.
 *
 * Example:
 * NEXT_PUBLIC_BASE_URL=https://worldwidedipo.com
 */
export function getExpectedOrigin() {
  try {
    return normalizeOrigin(
      getPublicEnv(
        'NEXT_PUBLIC_BASE_URL'
      )
    );
  } catch {
    /*
     * Do not expose environment-variable details
     * to API callers.
     *
     * Returning null causes validation to fail closed.
     */
    return null;
  }
}

/**
 * Check whether a request came from our own origin.
 *
 * Rules:
 *
 * 1. Origin header exists:
 *    It MUST match our configured origin.
 *
 * 2. Origin header does not exist but Referer exists:
 *    Referer origin MUST match our configured origin.
 *
 * 3. Neither exists:
 *    Keep the existing application's behavior and allow it.
 *
 * Why allow missing Origin?
 * Some legitimate browser/server requests do not send an
 * Origin header. Existing Worldwide DIPO APIs rely on this
 * behavior for compatibility.
 *
 * Authentication, CSRF protection and authorization must still
 * be enforced separately on sensitive endpoints.
 */
export function isSameOrigin(request) {
  if (
    !request ||
    !request.headers ||
    typeof request.headers.get !==
      'function'
  ) {
    return false;
  }

  const expectedOrigin =
    getExpectedOrigin();

  /*
   * Fail closed if the production origin is not configured.
   */
  if (!expectedOrigin) {
    return false;
  }

  const originHeader =
    request.headers.get('origin');

  /*
   * If Origin is supplied, it is authoritative.
   */
  if (originHeader) {
    const requestOrigin =
      normalizeOrigin(originHeader);

    return (
      requestOrigin !== null &&
      requestOrigin === expectedOrigin
    );
  }

  /*
   * Fall back to Referer when Origin is absent.
   */
  const referer =
    request.headers.get('referer');

  if (referer) {
    const refererOrigin =
      normalizeOrigin(referer);

    return (
      refererOrigin !== null &&
      refererOrigin === expectedOrigin
    );
  }

  /*
   * FIX: Dono headers na hon to sirf safe (read-only) methods allow.
   * Browser ke POST/PUT/PATCH/DELETE hamesha Origin bhejte hain,
   * isliye bina headers wali mutation request reject hoti hai.
   */
  const method = String(request.method || 'GET').toUpperCase();

  return (
    method === 'GET' ||
    method === 'HEAD' ||
    method === 'OPTIONS'
  );
}

/**
 * Throw a controlled same-origin error.
 *
 * Existing API preserved.
 */
export function assertSameOrigin(request) {
  if (!isSameOrigin(request)) {
    const error =
      new Error(
        'Invalid request origin'
      );

    error.code =
      'INVALID_ORIGIN';

    error.status = 403;

    throw error;
  }
}

/**
 * Existing route-compatible helper.
 *
 * Returns:
 * {
 *   valid: boolean,
 *   ok: boolean,
 *   message: string|null
 * }
 */
export function checkOrigin(request) {
  const valid =
    isSameOrigin(request);

  return {
    valid,
    ok: valid,
    message: valid
      ? null
      : 'Invalid request origin.',
  };
}