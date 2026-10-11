import { createClient } from '@/lib/supabase/server';

/**
 * Reject a payment claim.
 *
 * SECURITY
 * ------------------------------------------------------------
 * This function never performs a direct browser-side mutation.
 * The authenticated admin is resolved from the server session,
 * while the database RPC remains the authoritative authorization
 * and mutation boundary.
 *
 * @param {string} paymentId
 * @param {string} reason
 * @returns {Promise<object>}
 */
export async function rejectPayment(paymentId, reason = '') {
  if (
    typeof paymentId !== 'string' ||
    !paymentId.trim()
  ) {
    return {
      success: false,
      status: 400,
      error: 'Payment ID is required.',
    };
  }

  const normalizedId = paymentId.trim();

  const normalizedReason =
    typeof reason === 'string'
      ? reason.trim().slice(0, 1000)
      : '';

  if (!normalizedReason) {
    return {
      success: false,
      status: 400,
      error: 'A rejection reason is required.',
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      status: 401,
      error: 'Authentication required.',
    };
  }

  /*
   * Do not perform a direct UPDATE here.
   *
   * The approve/reject RPC is the authoritative admin
   * mutation boundary and is responsible for:
   * - admin authorization
   * - payment state transition
   * - audit logging
   * - lifecycle consistency
   */
  const { data, error } = await supabase.rpc(
    'reject_payment_claim',
    {
      p_payment_id: normalizedId,
      p_reason: normalizedReason,
    }
  );

  if (error) {
    const message = error.message || '';
    const lower = message.toLowerCase();

    if (
      lower.includes('authentication') ||
      lower.includes('not authenticated')
    ) {
      return {
        success: false,
        status: 401,
        error: 'Authentication required.',
      };
    }

    if (
      lower.includes('not authorized') ||
      lower.includes('unauthorized') ||
      lower.includes('admin')
    ) {
      return {
        success: false,
        status: 403,
        error: 'You are not authorized to reject payments.',
      };
    }

    if (
      lower.includes('not found') ||
      lower.includes('payment_not_found')
    ) {
      return {
        success: false,
        status: 404,
        error: 'Payment claim not found.',
      };
    }

    if (
      lower.includes('already rejected') ||
      lower.includes('already approved') ||
      lower.includes('not pending')
    ) {
      return {
        success: false,
        status: 409,
        error: 'This payment can no longer be rejected.',
      };
    }

    console.error(
      'Payment rejection RPC failed:',
      {
        paymentId: normalizedId,
        adminId: user.id,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      }
    );

    return {
      success: false,
      status: 500,
      error: 'Unable to reject payment.',
    };
  }

  return {
    success: true,
    status: 200,
    payment: data || null,
  };
}

export default rejectPayment;