import { createClient } from '@/lib/supabase/server';

import {
  requirePaymentAdmin,
} from '@/lib/auth/require-admin';

/**
 * WORLDWIDE DIPO
 * Secure Payment Actions
 *
 * IMPORTANT:
 * - Never trust payment ownership from the browser.
 * - Never accept admin/user identity from request input.
 * - Authorization is verified server-side.
 * - Actual payment state transition happens through
 *   protected Supabase RPC functions.
 */

const MAX_PAYMENT_ID_LENGTH = 36;
const MAX_ADMIN_NOTE_LENGTH = 1000;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validate payment UUID.
 */
function isValidPaymentId(
  paymentId,
) {
  return (
    typeof paymentId === 'string' &&
    paymentId.length <=
      MAX_PAYMENT_ID_LENGTH &&
    UUID_PATTERN.test(
      paymentId,
    )
  );
}

/**
 * Get a server-side Supabase client only after
 * payment-admin authorization has succeeded.
 */
async function getPaymentAdminClient() {
  const authorization =
    await requirePaymentAdmin();

  if (
    !authorization?.ok
  ) {
    return {
      authorized: false,

      status:
        Number.isInteger(
          authorization?.status,
        )
          ? authorization.status
          : 403,

      supabase: null,

      authorization,
    };
  }

  const supabase =
    await createClient();

  return {
    authorized: true,

    status: 200,

    supabase,

    authorization,
  };
}

/**
 * Approve a payment claim.
 *
 * Security:
 * - authenticated admin required
 * - approved administrator email required
 * - active admin_users record required
 * - admin/super_admin payment permission required
 * - AAL2 required
 * - payment ID strictly validated
 * - actual mutation performed by protected RPC
 */
export async function approvePayment(
  paymentId,
) {
  const cleanPaymentId =
    typeof paymentId === 'string'
      ? paymentId.trim()
      : '';

  if (
    !isValidPaymentId(
      cleanPaymentId,
    )
  ) {
    return {
      success: false,
      status: 400,
      error:
        'Invalid payment ID.',
    };
  }

  const {
    authorized,
    status,
    supabase,
  } =
    await getPaymentAdminClient();

  if (
    !authorized ||
    !supabase
  ) {
    return {
      success: false,

      status:
        Number.isInteger(status)
          ? status
          : 403,

      error:
        'Payment management authorization required.',
    };
  }

  try {
    const {
      data,
      error,
    } =
      await supabase.rpc(
        'approve_payment_claim',
        {
          p_payment_id:
            cleanPaymentId,
        },
      );

    if (error) {
      /*
       * Log only the server-side database message.
       * Never expose it to the browser.
       */
      console.error(
        'Payment approval RPC failed:',
        error.message,
      );

      return {
        success: false,
        status: 400,
        error:
          'Payment could not be approved.',
      };
    }

    return {
      success: true,
      status: 200,
      result: data,
    };
  } catch (error) {
    console.error(
      'Payment approval action failed:',
      error,
    );

    return {
      success: false,
      status: 500,
      error:
        'Unable to approve payment.',
    };
  }
}

/**
 * Reject a payment claim.
 *
 * The admin note is deliberately limited in length.
 */
export async function rejectPayment(
  paymentId,
  notes = '',
) {
  const cleanPaymentId =
    typeof paymentId === 'string'
      ? paymentId.trim()
      : '';

  if (
    !isValidPaymentId(
      cleanPaymentId,
    )
  ) {
    return {
      success: false,
      status: 400,
      error:
        'Invalid payment ID.',
    };
  }

  const cleanNotes =
    typeof notes === 'string'
      ? notes
          .trim()
          .slice(
            0,
            MAX_ADMIN_NOTE_LENGTH,
          )
      : '';

  const {
    authorized,
    status,
    supabase,
  } =
    await getPaymentAdminClient();

  if (
    !authorized ||
    !supabase
  ) {
    return {
      success: false,

      status:
        Number.isInteger(status)
          ? status
          : 403,

      error:
        'Payment management authorization required.',
    };
  }

  try {
    const {
      data,
      error,
    } =
      await supabase.rpc(
        'reject_payment_claim',
        {
          p_payment_id:
            cleanPaymentId,

          p_admin_note:
            cleanNotes || null,
        },
      );

    if (error) {
      console.error(
        'Payment rejection RPC failed:',
        error.message,
      );

      return {
        success: false,
        status: 400,
        error:
          'Payment could not be rejected.',
      };
    }

    return {
      success: true,
      status: 200,
      result: data,
    };
  } catch (error) {
    console.error(
      'Payment rejection action failed:',
      error,
    );

    return {
      success: false,
      status: 500,
      error:
        'Unable to reject payment.',
    };
  }
}