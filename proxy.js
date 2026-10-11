import { NextResponse } from 'next/server';

import { updateSession } from '@/lib/supabase/middleware';

/**
 * WORLDWIDE DIPO
 * Production Security Proxy
 *
 * Responsibilities:
 * - Refresh/verify Supabase session
 * - Protect admin pages from unauthenticated users
 * - Apply security headers consistently
 * - Add HSTS in production
 * - Prevent framing/clickjacking
 * - Prevent MIME sniffing
 * - Restrict browser capabilities
 * - Avoid leaking framework/server information
 *
 * IMPORTANT:
 * Admin authorization MUST ALSO be enforced server-side
 * inside every admin API/database operation.
 */

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',

  'X-Frame-Options': 'DENY',

  'Referrer-Policy':
    'strict-origin-when-cross-origin',

  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=()',

  'Cross-Origin-Opener-Policy':
    'same-origin',

  'Cross-Origin-Resource-Policy':
    'same-origin',

  'Origin-Agent-Cluster':
    '?1',

  'X-DNS-Prefetch-Control':
    'off',

  'X-Permitted-Cross-Domain-Policies':
    'none',
};

/**
 * HSTS should only be enabled when the site is actually
 * being served over HTTPS in production.
 *
 * max-age = 2 years
 * includeSubDomains = protect HTTPS subdomains too
 * preload = suitable only when the entire domain is HTTPS
 */
const HSTS_VALUE =
  'max-age=63072000; includeSubDomains; preload';

/**
 * CSP
 *
 * This is intentionally conservative but compatible with:
 * - Next.js
 * - Supabase
 * - HTTPS resources
 *
 * NOTE:
 * We are NOT using "unsafe-eval" in production.
 * It is added only in development, because React dev mode
 * needs eval() for debugging features (callstack rebuilding).
 *
 * "unsafe-inline" is retained for compatibility with the
 * current Next.js application. Removing it safely requires
 * a nonce/hash based CSP implementation across the app.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",

  "base-uri 'self'",

  "form-action 'self'",

  "frame-ancestors 'none'",

  "object-src 'none'",

  `script-src 'self' 'unsafe-inline'${
    process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"
  } https://challenges.cloudflare.com`,

  "style-src 'self' 'unsafe-inline'",

  "img-src 'self' data: blob: https:",

  "font-src 'self' data: https:",

  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com",

  "frame-src 'self' https://challenges.cloudflare.com",

  "media-src 'self' https:",

  "worker-src 'self' blob:",

  "manifest-src 'self'",

  "upgrade-insecure-requests",
].join('; ');

/**
 * Apply security headers to a response.
 */
function applySecurityHeaders(response, request) {
  Object.entries(SECURITY_HEADERS).forEach(
    ([key, value]) => {
      response.headers.set(key, value);
    },
  );

  response.headers.set(
    'Content-Security-Policy',
    CONTENT_SECURITY_POLICY,
  );

  /*
   * HSTS must not be sent in local development.
   *
   * Vercel production requests normally use HTTPS.
   */
  const isProduction =
    process.env.NODE_ENV === 'production';

  const forwardedProto =
    request.headers.get('x-forwarded-proto');

  const isHttps =
    forwardedProto === 'https' ||
    request.nextUrl.protocol === 'https:';

  if (isProduction && isHttps) {
    response.headers.set(
      'Strict-Transport-Security',
      HSTS_VALUE,
    );
  }

  /*
   * Do not expose the framework/server version.
   */
  response.headers.delete('Server');
  response.headers.delete('X-Powered-By');

  return response;
}

/**
 * Redirect unauthenticated users to admin login.
 */
function redirectToAdminLogin(request) {
  const loginUrl = new URL(
    '/admin/login',
    request.url,
  );

  /*
   * Preserve only the pathname/query needed for a
   * legitimate post-login redirect.
   *
   * Never accept an arbitrary external URL here.
   */
  const requestedPath =
    `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (
    requestedPath.startsWith('/admin/') &&
    !requestedPath.startsWith('/admin/login')
  ) {
    loginUrl.searchParams.set(
      'next',
      requestedPath,
    );
  }

  return NextResponse.redirect(loginUrl);
}

export async function proxy(request) {
  const { response, claims } =
    await updateSession(request);

  const { pathname } =
    request.nextUrl;

  const isAdminArea =
    pathname === '/admin' ||
    pathname.startsWith('/admin/');

  const isAdminLogin =
    pathname === '/admin/login';

  /*
   * IMPORTANT:
   *
   * This only checks whether the user has an
   * authenticated Supabase session.
   *
   * It does NOT decide whether the user is an
   * authorized admin.
   *
   * Actual admin authorization will be enforced
   * server-side using:
   *
   * - admin allowlist
   * - admin role
   * - active status
   * - MFA/AAL2
   * - database/RLS
   *
   * This prevents a normal authenticated user from
   * being treated as an administrator.
   */
  if (
    isAdminArea &&
    !isAdminLogin &&
    !claims
  ) {
    const redirectResponse =
      redirectToAdminLogin(request);

    return applySecurityHeaders(
      redirectResponse,
      request,
    );
  }

  /*
   * Never cache authenticated/admin responses
   * through an intermediary cache.
   *
   * This is especially important for admin pages.
   */
  if (isAdminArea) {
    response.headers.set(
      'Cache-Control',
      'private, no-store, max-age=0',
    );
  }

  return applySecurityHeaders(
    response,
    request,
  );
}

export const config = {
  matcher: [
    /*
     * Run proxy on application routes while avoiding
     * static asset processing.
     *
     * Images are excluded because their response headers
     * are better controlled by Next.js/static handling.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|avif|txt|xml)$).*)',
  ],
};