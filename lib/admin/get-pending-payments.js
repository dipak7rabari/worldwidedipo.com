import { createClient } from '@/lib/supabase/server';
import { requirePaymentAdmin } from '@/lib/auth/require-admin';

export async function getPendingPayments() {
    let admin;

  try {
    admin = await requirePaymentAdmin();
  } catch (error) {
    return {
      authorized: false,
      status: error?.status || 403,
      payments: [],
    };
  }

  if (!admin?.ok) {
    return {
      authorized: false,
      status: 403,
      payments: [],
    };
  }


  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payments')
    .select(`
      id,
      profile_id,
      payment_type,
      plan,
      amount,
      payment_reference,
      status,
      payer_name,
      slug_snapshot,
      plan_snapshot,
      created_at,
      verified_at,
      notes
    `)
    .eq('status', 'pending')
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    console.error(
      'Pending payments query failed:',
      error.message
    );

    return {
      authorized: true,
      status: 500,
      payments: [],
      error:
        'Unable to load payment claims.',
    };
  }

  return {
    authorized: true,
    status: 200,
    payments: data || [],
  };
}