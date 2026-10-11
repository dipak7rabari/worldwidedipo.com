import { createClient } from '@/lib/supabase/server';

/**
 * Verify / approve a payment claim.
 *
 * SECURITY
 * ------------------------------------------------------------
 * Payment approval is an ADMIN operation.
 *
 * This helper intentionally delegates the state transition to
 * the hardened database RPC instead of directly updating the
 * payments table.
 *
 * @param {string} paymentId
 * @param {string} note
 * @returns {Promise<object>}
 */
export async function verifyPayment(
  paymentId,
  note = ''
) {
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

  const normalizedNote =
    typeof note === 'string'
      ? note.trim().slice(0, 1000)
      : '';

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
   * The database function is the authoritative security
   * boundary for approval.
   */
  const { data, error } = await supabase.rpc(
    'approve_payment_claim',
    {
      p_payment_id: normalizedId,
      p_note: normalizedNote || null,
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
        error: 'You are not authorized to verify payments.',
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
      lower.includes('already approved') ||
      lower.includes('already rejected') ||
      lower.includes('not pending')
    ) {
      return {
        success: false,
        status: 409,
        error: 'This payment can no longer be verified.',
      };
    }

    console.error(
      'Payment approval RPC failed:',
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
      error: 'Unable to verify payment.',
    };
  }

  return {
    success: true,
    status: 200,
    payment: data || null,
  };
}

export const approvePayment = verifyPayment;

export default verifyPayment;