import { createClient } from '@/lib/supabase/server';

import {
  getPaymentPlan,
} from './payment-config';

import {
  validatePaymentClaimInput,
} from './payment-validation';

/**
 * Worldwide DIPO
 * ------------------------------------------------------------
 * Initial Payment Claim
 *
 * SECURITY MODEL
 * ------------------------------------------------------------
 * Browser -> API -> authenticated Supabase session
 *          -> submit_payment_claim RPC
 *          -> server-side plan price
 *          -> DB constraints / unique indexes
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * Never insert into public.payments directly from the
 * authenticated application client.
 *
 * The database RPC is the authoritative payment creation path.
 */

export async function createInitialPaymentClaim(input) {
  /* ----------------------------------------------------------
     1. Validate request shape
     ---------------------------------------------------------- */

  const validation =
    validatePaymentClaimInput(input);

  if (!validation.valid) {
    return {
      success: false,
      status: 400,
      errors: validation.errors,
    };
  }

  const planKey =
    validation.value.plan;

  const paymentReference =
    validation.value.payment_reference;

  /* ----------------------------------------------------------
     2. Resolve plan from server config
     
     The client never supplies the amount.
     ---------------------------------------------------------- */

  const plan =
    getPaymentPlan(planKey);

  if (!plan) {
    return {
      success: false,
      status: 400,
      errors: {
        plan: 'Invalid payment plan.',
      },
    };
  }

  /*
   * This amount is informational here.
   *
   * The actual payment amount is calculated again
   * inside the database RPC.
   */
  const serverAmount =
    Number(plan.amount);

  if (
    !Number.isInteger(serverAmount) ||
    serverAmount <= 0
  ) {
    console.error(
      'Invalid server payment configuration:',
      {
        plan: planKey,
        amount: plan.amount,
      }
    );

    return {
      success: false,
      status: 500,
      errors: {
        form:
          'Payment configuration is temporarily unavailable.',
      },
    };
  }

  /* ----------------------------------------------------------
     3. Authenticate
     ---------------------------------------------------------- */

  const supabase =
    await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (
    userError ||
    !user
  ) {
    return {
      success: false,
      status: 401,
      errors: {
        form:
          'Authentication required.',
      },
    };
  }

  /* ----------------------------------------------------------
     4. Load the authenticated user's profile
     
     IMPORTANT:
     Never accept profile_id from the browser for this flow.
     The profile is resolved from auth.uid().
     ---------------------------------------------------------- */

  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from('profiles')
      .select(`
        id,
        owner_id,
        name,
        slug,
        plan,
        status
      `)
      .eq(
        'owner_id',
        user.id
      )
      .maybeSingle();

  if (profileError) {
    console.error(
      'Initial payment profile lookup failed:',
      {
        userId: user.id,
        code: profileError.code,
        message:
          profileError.message,
      }
    );

    return {
      success: false,
      status: 500,
      errors: {
        form:
          'Unable to load your DIPO profile.',
      },
    };
  }

  if (!profile) {
    return {
      success: false,
      status: 404,
      errors: {
        form:
          'Create your DIPO profile before making an initial payment.',
      },
    };
  }

  /* ----------------------------------------------------------
     5. Initial payment eligibility
     ---------------------------------------------------------- */

  if (
    profile.status !== 'draft'
  ) {
    if (
      profile.status === 'pending'
    ) {
      return {
        success: false,
        status: 409,
        errors: {
          form:
            'Your payment is already under verification.',
        },
      };
    }

    if (
      profile.status === 'active'
    ) {
      return {
        success: false,
        status: 409,
        errors: {
          form:
            'Your DIPO is already active. Use renewal instead.',
        },
      };
    }

    if (
      profile.status === 'expired'
    ) {
      return {
        success: false,
        status: 409,
        errors: {
          form:
            'This profile is expired. Use the renewal flow.',
        },
      };
    }

    return {
      success: false,
      status: 409,
      errors: {
        form:
          'This profile is not eligible for an initial payment.',
      },
    };
  }

  /* ----------------------------------------------------------
     6. Normalize payment reference
     
     Keep normalization aligned with the DB RPC.
     ---------------------------------------------------------- */

  const normalizedReference =
    paymentReference
      .trim()
      .replace(/\s+/g, '')
      .toUpperCase();

  if (
    normalizedReference.length < 6
  ) {
    return {
      success: false,
      status: 400,
      errors: {
        payment_reference:
          'UTR / Payment Reference must contain at least 6 characters.',
      },
    };
  }

  if (
    normalizedReference.length > 80
  ) {
    return {
      success: false,
      status: 400,
      errors: {
        payment_reference:
          'UTR / Payment Reference is too long.',
      },
    };
  }

  if (
    !/^[A-Z0-9][A-Z0-9_./-]*$/.test(
      normalizedReference
    )
  ) {
    return {
      success: false,
      status: 400,
      errors: {
        payment_reference:
          'Please enter a valid UTR / Payment Reference.',
      },
    };
  }

  /* ----------------------------------------------------------
     7. Use the authoritative DB RPC
     
     This gives us:
     - server-side amount
     - authenticated owner check
     - profile row lock
     - duplicate UTR protection
     - pending payment uniqueness
     - transaction-safe insertion
     ---------------------------------------------------------- */

  const {
    data: payment,
    error: paymentError,
  } =
    await supabase.rpc(
      'submit_payment_claim',
      {
        p_profile_id:
          profile.id,

        p_payment_type:
          'initial',

        p_plan:
          planKey,

        p_payment_reference:
          normalizedReference,
      }
    );

  if (paymentError) {
    const message =
      paymentError.message || '';

    const lowerMessage =
      message.toLowerCase();

    /* --------------------------------------------------------
       Known business conflicts
       -------------------------------------------------------- */

    if (
      message.includes(
        'PAYMENT_REFERENCE_ALREADY_USED'
      ) ||
      message.includes(
        'PAYMENT_REFERENCE_OR_PENDING_PAYMENT_ALREADY_EXISTS'
      ) ||
      paymentError.code ===
        '23505'
    ) {
      return {
        success: false,
        status: 409,
        errors: {
          payment_reference:
            'This UTR / Payment Reference has already been submitted.',
        },
      };
    }

    if (
      message.includes(
        'INITIAL_PAYMENT_REQUIRES_DRAFT_PROFILE'
      )
    ) {
      return {
        success: false,
        status: 409,
        errors: {
          form:
            'Initial payment can only be submitted for a draft profile.',
        },
      };
    }

    if (
      message.includes(
        'PROFILE_NOT_FOUND'
      )
    ) {
      return {
        success: false,
        status: 404,
        errors: {
          form:
            'Your DIPO profile could not be found.',
        },
      };
    }

    if (
      message.includes(
        'AUTHENTICATION_REQUIRED'
      )
    ) {
      return {
        success: false,
        status: 401,
        errors: {
          form:
            'Authentication required.',
        },
      };
    }

    if (
      message.includes(
        'INVALID_PLAN'
      )
    ) {
      return {
        success: false,
        status: 400,
        errors: {
          plan:
            'Please select a valid payment plan.',
        },
      };
    }

    if (
      message.includes(
        'INVALID_PAYMENT_REFERENCE'
      ) ||
      message.includes(
        'PAYMENT_REFERENCE_TOO_LONG'
      ) ||
      message.includes(
        'INVALID_PAYMENT_REFERENCE_FORMAT'
      )
    ) {
      return {
        success: false,
        status: 400,
        errors: {
          payment_reference:
            'Please enter a valid UTR / Payment Reference.',
        },
      };
    }

    /* --------------------------------------------------------
       Unknown DB failure
       -------------------------------------------------------- */

    console.error(
      'Initial payment RPC failed:',
      {
        userId: user.id,
        profileId: profile.id,
        plan: planKey,
        code:
          paymentError.code,
        message:
          paymentError.message,
        details:
          paymentError.details,
        hint:
          paymentError.hint,
      }
    );

    /*
     * Do not expose PostgreSQL/Supabase internals
     * to the browser.
     */
    return {
      success: false,
      status: 500,
      errors: {
        form:
          'Payment claim could not be submitted. Please try again.',
      },
    };
  }

  /* ----------------------------------------------------------
     8. Defensive response validation
     
     The RPC should return a payment row.
     Never blindly trust a malformed response.
     ---------------------------------------------------------- */

  if (
    !payment ||
    !payment.id
  ) {
    console.error(
      'Payment RPC returned an invalid payment:',
      {
        userId: user.id,
        profileId: profile.id,
      }
    );

    return {
      success: false,
      status: 500,
      errors: {
        form:
          'Payment claim could not be confirmed. Please contact support.',
      },
    };
  }

  /* ----------------------------------------------------------
     9. Return only safe client data
     
     Never expose internal DB metadata unnecessarily.
     ---------------------------------------------------------- */

  return {
    success: true,
    status: 201,

    payment: {
      id: payment.id,

      profile_id:
        payment.profile_id ??
        profile.id,

      payment_type:
        payment.payment_type ??
        'initial',

      plan:
        payment.plan ??
        planKey,

      /*
       * Amount comes from DB/RPC.
       * Never from browser input.
       */
      amount:
        payment.amount ??
        serverAmount,

      payment_reference:
        payment.payment_reference ??
        normalizedReference,

      status:
        payment.status ??
        'pending',

      created_at:
        payment.created_at ??
        null,
    },
  };
}