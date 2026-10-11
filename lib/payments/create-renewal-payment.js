import { createClient } from '@/lib/supabase/server';

import {
  getPaymentPlan,
} from './payment-config';

import {
  validateRenewalInput,
} from './renewal-validation';

export async function createRenewalPayment(
  input
) {
  const validation =
    validateRenewalInput(input);

  if (!validation.valid) {
    return {
      success: false,
      status: 400,
      errors: validation.errors,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      status: 401,
      errors: {
        form:
          'Authentication required.',
      },
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
      'Renewal profile lookup failed:',
      profileError.message
    );

    return {
      success: false,
      status: 500,
      errors: {
        form:
          'Unable to load your profile.',
      },
    };
  }

  if (!profile) {
    return {
      success: false,
      status: 404,
      errors: {
        form:
          'Profile not found.',
      },
    };
  }

  /*
   * Renewal is not available for draft/pending
   * profiles. Initial payment handles draft.
   *
   * Expired profiles may still be renewed while
   * they are retained by the lifecycle/grace system.
   */
  if (
    profile.status !== 'active' &&
    profile.status !== 'expired'
  ) {
    return {
      success: false,
      status: 409,
      errors: {
        form:
          'This profile is not currently eligible for renewal.',
      },
    };
  }

  if (
    profile.status === 'expired' &&
    profile.deletion_scheduled_at
  ) {
    const deletionDate =
      new Date(
        profile.deletion_scheduled_at
      );

    if (
      Number.isFinite(
        deletionDate.getTime()
      ) &&
      deletionDate.getTime() <= Date.now()
    ) {
      return {
        success: false,
        status: 410,
        errors: {
          form:
            'This profile is scheduled for deletion and can no longer be renewed.',
        },
      };
    }
  }

  /*
   * Database has a unique partial index for:
   * one pending renewal per profile.
   *
   * We still check first for a clean UX.
   */
  const {
    data: pendingRenewal,
    error: pendingError,
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

  if (pendingError) {
    console.error(
      'Pending renewal lookup failed:',
      pendingError.message
    );

    return {
      success: false,
      status: 500,
      errors: {
        form:
          'Unable to check renewal status.',
      },
    };
  }

  if (pendingRenewal) {
    return {
      success: false,
      status: 409,
      errors: {
        form:
          'A renewal payment is already pending for this profile.',
      },
      payment: pendingRenewal,
    };
  }

  const plan =
    getPaymentPlan(
      validation.value.plan
    );

  /*
   * SECURITY:
   * Amount is derived exclusively on the server.
   * No client amount is accepted.
   */
  const amount = plan.amount;

  const { data: payment, error } =
    await supabase
      .from('payments')
      .insert({
        profile_id: profile.id,

        payment_type: 'renewal',

        plan:
          validation.value.plan,

        amount,

        payment_reference:
          validation.value
            .payment_reference,

        status: 'pending',

        user_id: user.id,

        payer_name:
          profile.name,

        slug_snapshot:
          profile.slug,

        plan_snapshot:
          validation.value.plan,
      })
      .select(`
        id,
        profile_id,
        payment_type,
        plan,
        amount,
        payment_reference,
        status,
        created_at
      `)
      .single();

  if (error) {
    console.error(
      'Renewal payment creation failed:',
      error.message
    );

    if (error.code === '23505') {
      return {
        success: false,
        status: 409,
        errors: {
          payment_reference:
            'This payment reference is already in use, or a renewal is already pending.',
        },
      };
    }

    return {
      success: false,
      status: 500,
      errors: {
        form:
          'Unable to submit renewal payment.',
      },
    };
  }

  /*
   * IMPORTANT:
   * We intentionally DO NOT change
   * profile.status here.
   *
   * Active remains active while renewal
   * is under verification.
   */
  return {
    success: true,
    status: 201,
    payment,
  };
}