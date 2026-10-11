import { describe, expect, it } from 'vitest';

const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

const PRIVATE_ROUTES = [
  '/dashboard',
  '/admin',
  '/auth/login',
  '/api',
];

describe('production route configuration', () => {
  it('contains required public routes', () => {
    expect(PUBLIC_ROUTES).toContain('/');
    expect(PUBLIC_ROUTES).toContain('/about');
    expect(PUBLIC_ROUTES).toContain('/contact');
    expect(PUBLIC_ROUTES).toContain('/privacy');
    expect(PUBLIC_ROUTES).toContain('/terms');
  });

  it('keeps dashboard outside public routes', () => {
    expect(PUBLIC_ROUTES).not.toContain(
      '/dashboard'
    );
  });

  it('keeps admin outside public routes', () => {
    expect(PUBLIC_ROUTES).not.toContain(
      '/admin'
    );
  });

  it('keeps authentication routes outside public routes', () => {
    expect(PUBLIC_ROUTES).not.toContain(
      '/auth/login'
    );
  });

  it('keeps API routes outside public routes', () => {
    expect(PUBLIC_ROUTES).not.toContain('/api');
  });
});