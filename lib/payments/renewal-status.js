import { createClient } from '@/lib/supabase/server';

export async function getRenewalStatus() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      authenticated: false,
      profile: null,
      pendingRenewal: null,
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
      plan,
      status,
      expires_at,
      deletion_scheduled_at
    `)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      'Renewal status profile error:',
      profileError.message
    );

    return {
      authenticated: true,
      profile: null,
      pendingRenewal: null,
      error:
        'Unable to load subscription.',
    };
  }

  if (!profile) {
    return {
      authenticated: true,
      profile: null,
      pendingRenewal: null,
    };
  }

  const {
    data: pendingRenewal,
    error: paymentError,
  } = await supabase
    .from('payments')
    .select(`
      id,
      plan,
      amount,
      payment_reference,
      status,
      created_at
    `)
    .eq('profile_id', profile.id)
    .eq('payment_type', 'renewal')
    .eq('status', 'pending')
    .maybeSingle();

  if (paymentError) {
    console.error(
      'Renewal payment status error:',
      paymentError.message
    );
  }

  return {
    authenticated: true,
    profile,
    pendingRenewal:
      pendingRenewal || null,
  };
}