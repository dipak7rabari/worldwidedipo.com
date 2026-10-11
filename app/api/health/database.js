import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function checkDatabaseHealth() {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      return {
        ok: false,
        error: error.message,
      };
    }

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
    };
  }
}