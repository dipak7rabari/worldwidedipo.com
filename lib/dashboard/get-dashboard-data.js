import { createClient } from '@/lib/supabase/server';

export async function getDashboardData() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authenticated: false,
      user: null,
      profile: null,
      pendingPayment: null,
      error: null,
    };
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select(`
      id,
      owner_id,
      name,
      slug,
      profession,
      headline,
      plan,
      status,
      expires_at,
      deletion_scheduled_at,
      avatar_url,
      location,
      category,
      created_at,
      updated_at
    `)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      'Dashboard profile error:',
      profileError.message
    );

    return {
      authenticated: true,
      user,
      profile: null,
      pendingPayment: null,
      error: 'Unable to load dashboard.',
    };
  }

  if (!profile) {
    return {
      authenticated: true,
      user,
      profile: null,
      pendingPayment: null,
      error: null,
    };
  }

  /*
   * Only the user's own payment information is
   * requested. Never expose admin verification data.
   */
  const {
    data: pendingPayment,
  } = await supabase
    .from('payments')
    .select(`
      id,
      payment_type,
      plan,
      amount,
      status,
      created_at
    `)
    .eq('profile_id', profile.id)
    .eq('status', 'pending')
    .order('created_at', {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  return {
    authenticated: true,
    user,
    profile,
    pendingPayment:
      pendingPayment || null,
    error: null,
  };
}