import { describe, expect, it } from 'vitest';

import {
  checkRateLimit,
  getRequestRateLimitKey,
} from '@/lib/security/rate-limit';

function uniqueKey(prefix = 'security-test') {
  return `${prefix}:${crypto.randomUUID()}`;
}

function createRequest(headers = {}) {
  return {
    headers: {
      get(name) {
        return headers[name] ?? null;
      },
    },
  };
}

describe('security: rate limiting', () => {
  it('allows the first request', () => {
    const result = checkRateLimit(
      uniqueKey(),
      {
        maxRequests: 1,
        windowMs: 60000,
      }
    );

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('blocks requests after the configured limit', () => {
    const key = uniqueKey();

    const first = checkRateLimit(key, {
      maxRequests: 1,
      windowMs: 60000,
    });

    const second = checkRateLimit(key, {
      maxRequests: 1,
      windowMs: 60000,
    });

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(false);
    expect(second.remaining).toBe(0);
    expect(second.retryAfter).toBeGreaterThan(0);
  });

  it('allows requests up to the configured maximum', () => {
    const key = uniqueKey();

    const first = checkRateLimit(key, {
      maxRequests: 3,
      windowMs: 60000,
    });

    const second = checkRateLimit(key, {
      maxRequests: 3,
      windowMs: 60000,
    });

    const third = checkRateLimit(key, {
      maxRequests: 3,
      windowMs: 60000,
    });

    const fourth = checkRateLimit(key, {
      maxRequests: 3,
      windowMs: 60000,
    });

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(true);

    expect(first.remaining).toBe(2);
    expect(second.remaining).toBe(1);
    expect(third.remaining).toBe(0);

    expect(fourth.allowed).toBe(false);
  });

  it('keeps separate keys isolated', () => {
    const keyA = uniqueKey('a');
    const keyB = uniqueKey('b');

    expect(
      checkRateLimit(keyA, {
        maxRequests: 1,
        windowMs: 60000,
      }).allowed
    ).toBe(true);

    expect(
      checkRateLimit(keyA, {
        maxRequests: 1,
        windowMs: 60000,
      }).allowed
    ).toBe(false);

    expect(
      checkRateLimit(keyB, {
        maxRequests: 1,
        windowMs: 60000,
      }).allowed
    ).toBe(true);
  });

  it('normalizes empty keys safely', () => {
    const result = checkRateLimit('', {
      maxRequests: 1,
      windowMs: 60000,
    });

    expect(result.allowed).toBe(true);
  });

  it('does not allow invalid maxRequests to create unlimited capacity', () => {
    const key = uniqueKey();

    const first = checkRateLimit(key, {
      maxRequests: 0,
      windowMs: 60000,
    });

    expect(first.allowed).toBe(true);

    const second = checkRateLimit(key, {
      maxRequests: 0,
      windowMs: 60000,
    });

    expect(second.allowed).toBe(false);
  });

  it('clamps negative request limits safely', () => {
    const key = uniqueKey();

    const first = checkRateLimit(key, {
      maxRequests: -100,
      windowMs: 60000,
    });

    expect(first.allowed).toBe(true);

    const second = checkRateLimit(key, {
      maxRequests: -100,
      windowMs: 60000,
    });

    expect(second.allowed).toBe(false);
  });

  it('creates a stable IP-based request key', () => {
    const request = createRequest({
      'x-forwarded-for':
        '203.0.113.10, 10.0.0.1',
    });

    expect(
      getRequestRateLimitKey(
        request,
        'payment'
      )
    ).toBe(
      'payment:203.0.113.10'
    );
  });

  it('prefers x-forwarded-for over x-real-ip', () => {
    const request = createRequest({
      'x-forwarded-for':
        '198.51.100.22',
      'x-real-ip':
        '192.0.2.10',
    });

    expect(
      getRequestRateLimitKey(request)
    ).toBe(
      'request:198.51.100.22'
    );
  });

  it('falls back to x-real-ip', () => {
    const request = createRequest({
      'x-real-ip':
        '192.0.2.10',
    });

    expect(
      getRequestRateLimitKey(request)
    ).toBe(
      'request:192.0.2.10'
    );
  });

  it('uses unknown when no IP headers exist', () => {
    const request = createRequest();

    expect(
      getRequestRateLimitKey(request)
    ).toBe(
      'request:unknown'
    );
  });

  it('sanitizes dangerous rate-limit prefixes', () => {
    const request = createRequest({
      'x-real-ip':
        '203.0.113.20',
    });

    expect(
      getRequestRateLimitKey(
        request,
        '<script>payment</script>'
      )
    ).toBe(
      'scriptpaymentscript:203.0.113.20'
    );
  });
});