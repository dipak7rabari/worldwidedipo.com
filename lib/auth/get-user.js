import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user ?? null;
}

export async function getCurrentUserWithClient() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    user: user ?? null,
    error: error ?? null,
    supabase,
  };
}