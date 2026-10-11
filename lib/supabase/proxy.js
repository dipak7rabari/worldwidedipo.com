import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

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
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  /*
   * Important:
   * Do not replace this with getSession().
   *
   * Supabase recommends getClaims() for verifying
   * authenticated requests in server-side protection.
   */
  await supabase.auth.getClaims();

  return response;
}