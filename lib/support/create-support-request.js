import { createServerSupabaseClient } from '@/lib/supabase/server';
import { validateSupportRequest } from './support-validation';

export async function createSupportRequest(input) {
  const validation = validateSupportRequest(input);

  if (!validation.valid) {
    return {
      ok: false,
      error: validation.error,
    };
  }

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
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from('support_requests')
    .insert({
      user_id: user.id,
      profile_id: profile?.id ?? null,
      subject: validation.data.subject,
      message: validation.data.message,
      category: validation.data.category,
    })
    .select(
      'id, subject, message, category, status, admin_reply, created_at, updated_at'
    )
    .single();

  if (error) {
    console.error('Support request creation failed:', error);

    return {
      ok: false,
      error: 'Unable to create support request.',
      status: 500,
    };
  }

  return {
    ok: true,
    data,
  };
}