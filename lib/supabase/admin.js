import 'server-only';

import { createClient } from '@supabase/supabase-js';

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

let adminClient;

export function createAdminClient() {
  if (adminClient) {
    return adminClient;
  }

  adminClient = createClient(
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredEnv('SUPABASE_SECRET_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );

  return adminClient;
}