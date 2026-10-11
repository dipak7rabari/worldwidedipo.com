import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always write cookies.
            // proxy.js handles session refresh.
          }
        },
      },
    },
  );
}
export async function createServerSupabaseClient() {
  return createClient();
}