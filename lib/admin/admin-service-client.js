import { createClient } from '@supabase/supabase-js';

let adminClient = null;

export function getAdminServiceClient() {
  if (adminClient) return adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured.');
  }

  if (!secretKey) {
    throw new Error('SUPABASE_SECRET_KEY is not configured.');
  }

  adminClient = createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-client-info': 'worldwide-dipo-admin',
      },
    },
  });

  return adminClient;
}