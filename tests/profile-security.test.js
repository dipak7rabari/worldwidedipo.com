import { describe, expect, it } from 'vitest';

const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'auth',
  'dashboard',
  'login',
  'signup',
  'privacy',
  'terms',
  'contact',
  'about',
  'support',
  'p',
]);

function isValidSlug(slug) {
  return (
    typeof slug === 'string' &&
    slug.length >= 3 &&
    slug.length <= 30 &&
    /^[a-z0-9-]+$/.test(slug) &&
    !RESERVED_SLUGS.has(slug)
  );
}

describe('profile security assumptions', () => {
  it('accepts valid public slugs', () => {
    expect(isValidSlug('dipak-rabari')).toBe(true);
  });

  it('rejects uppercase slugs', () => {
    expect(isValidSlug('Dipak-Rabari')).toBe(false);
  });

  it('rejects path traversal characters', () => {
    expect(isValidSlug('../admin')).toBe(false);
  });

  it('rejects reserved routes', () => {
    expect(isValidSlug('admin')).toBe(false);
  });

  it('rejects oversized slugs', () => {
    expect(isValidSlug('a'.repeat(31))).toBe(false);
  });
});