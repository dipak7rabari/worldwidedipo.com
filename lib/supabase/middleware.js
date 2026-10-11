import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

/**
 * Refreshes the Supabase auth session for the incoming request.
 *
 * Important:
 * - Uses getClaims() for server-side JWT verification.
 * - Never assumes Supabase returned a non-null data object.
 * - Safely handles unauthenticated requests.
 * - Preserves refreshed auth cookies on both request and response.
 */
export async function updateSession(request) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          /*
           * Keep the request cookies synchronized so the current
           * request sees the refreshed session.
           */
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          /*
           * Re-create the response after mutating request cookies.
           */
          response = NextResponse.next({
            request,
          });

          /*
           * Persist Supabase's refreshed cookies in the browser.
           */
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options,
              );
            },
          );
        },
      },
    },
  );

  let claims = null;
  let authError = null;

  try {
    /*
     * Supabase getClaims() verifies the JWT.
     *
     * Do NOT destructure:
     *
     *   const { data: { claims } } = ...
     *
     * because data can be null for an unauthenticated
     * or otherwise unsuccessful response.
     */
    const result = await supabase.auth.getClaims();

    claims = result?.data?.claims ?? null;
    authError = result?.error ?? null;
  } catch (error) {
    /*
     * An auth verification failure should not crash the
     * entire public website.
     *
     * Treat the request as unauthenticated. Protected
     * routes can then redirect appropriately.
     */
    claims = null;
    authError = error;
  }

  return {
    response,
    claims,
    error: authError,
    authenticated: Boolean(claims),
  };
}