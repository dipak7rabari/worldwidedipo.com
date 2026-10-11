const DEFAULT_MAX_BODY_SIZE = 50 * 1024;

export function getContentLength(request) {
  const value = request.headers.get('content-length');

  if (!value) return 0;

  const length = Number(value);

  if (!Number.isFinite(length) || length < 0) {
    return 0;
  }

  return length;
}

export function isBodyTooLarge(
  request,
  maxBytes = DEFAULT_MAX_BODY_SIZE
) {
  const contentLength = getContentLength(request);

  return contentLength > maxBytes;
}

export async function readJsonBody(
  request,
  maxBytes = DEFAULT_MAX_BODY_SIZE
) {
  if (isBodyTooLarge(request, maxBytes)) {
    return {
      ok: false,
      status: 413,
      error: 'Request body is too large.',
    };
  }

  const text = await request.text();

  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return {
      ok: false,
      status: 413,
      error: 'Request body is too large.',
    };
  }

  try {
    const body = JSON.parse(text);

    return {
      ok: true,
      body,
    };
  } catch {
    return {
      ok: false,
      status: 400,
      error: 'Invalid JSON request.',
    };
  }
}