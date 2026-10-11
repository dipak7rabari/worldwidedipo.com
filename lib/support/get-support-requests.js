import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getSupportRequests() {
  const supabase = await createServerSupabaseClient();

  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error: 'You must be signed in.',
      status: 401,
      data: [],
    };
  }

  const { data, error } = await supabase
    .from('support_requests')
    .select(
      'id, subject, message, category, status, admin_reply, replied_at, resolved_at, created_at, updated_at'
    )
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error('Support request fetch failed:', error);

    return {
      ok: false,
      error: 'Unable to load support requests.',
      status: 500,
      data: [],
    };
  }

  return {
    ok: true,
    data: data ?? [],
  };
}