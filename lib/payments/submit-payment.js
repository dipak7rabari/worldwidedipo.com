import { createInitialPaymentClaim } from './create-payment-claim';

/**
 * Canonical initial-payment submission facade.
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * The actual payment claim creation remains centralized inside
 * create-payment-claim.js.
 *
 * This file exists as a safe compatibility layer for older
 * imports and must not create a second database insertion path.
 */

/**
 * Submit an initial payment claim.
 *
 * @param {object} input
 * @returns {Promise<object>}
 */
export async function submitPayment(input) {
  return createInitialPaymentClaim(input);
}

/**
 * Explicit alias for callers using the newer naming style.
 */
export async function submitPaymentClaim(input) {
  return createInitialPaymentClaim(input);
}

export {
  createInitialPaymentClaim,
};

export default submitPayment;