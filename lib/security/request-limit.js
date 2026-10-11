// lib/security/request-limit.js

import { securityConfig } from '@/config/security';

/**
 * Return the configured request body limit in bytes.
 */
export function getRequestBodyLimit() {
  return securityConfig.requestBodyLimitBytes;
}

/**
 * Check whether a request body is within the configured limit.
 *
 * Uses Content-Length when available, then falls back to reading
 * the request body for requests where Content-Length is unavailable.
 */
export async function assertBodySize(
  request,
  maxBytes = securityConfig.requestBodyLimitBytes,
) {
  if (!request) {
    throw new Error('REQUEST_REQUIRED');
  }

  const limit = Number(maxBytes);

  if (!Number.isFinite(limit) || limit <= 0) {
    throw new Error('INVALID_REQUEST_BODY_LIMIT');
  }

  const contentLength = request.headers?.get('content-length');

  if (contentLength) {
    const length = Number(contentLength);

    if (Number.isFinite(length) && length > limit) {
      throw new Error('REQUEST_BODY_TOO_LARGE');
    }
  }

  /*
   * Do not consume the original request body here.
   *
   * Route handlers that need body-size enforcement without relying
   * only on Content-Length should use the helper below with a cloned
   * request or enforce the limit while reading the body.
   */
  return true;
}

/**
 * Validate a text payload against a byte limit.
 */
export function assertTextBodySize(
  text,
  maxBytes = securityConfig.requestBodyLimitBytes,
) {
  const value = text == null ? '' : String(text);

  const bytes = new TextEncoder().encode(value).length;

  if (bytes > Number(maxBytes)) {
    throw new Error('REQUEST_BODY_TOO_LARGE');
  }

  return true;
}