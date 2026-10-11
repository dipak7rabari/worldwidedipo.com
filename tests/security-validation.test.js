import { describe, expect, it } from 'vitest';

import {
  checkRateLimit,
} from '@/lib/security/rate-limit';

describe('security validation', () => {
  it('allows requests inside the configured limit', () => {
    const key = `test-${crypto.randomUUID()}`;

    const result = checkRateLimit(key, {
      maxRequests: 2,
      windowMs: 60000,
    });

    expect(result.allowed).toBe(true);
  });

  it('blocks requests after the limit', () => {
    const key = `test-${crypto.randomUUID()}`;

    checkRateLimit(key, {
      maxRequests: 1,
      windowMs: 60000,
    });

    const result = checkRateLimit(key, {
      maxRequests: 1,
      windowMs: 60000,
    });

    expect(result.allowed).toBe(false);
  });
});