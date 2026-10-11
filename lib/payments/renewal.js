import { createRenewalPayment } from './create-renewal-payment';
import { getRenewalStatus } from './renewal-status';
import { isRenewalEligible, getRenewalState } from './renewal-eligibility';

/**
 * Canonical renewal service facade.
 *
 * This file intentionally does not implement a second renewal
 * payment system. Existing production logic remains centralized
 * inside create-renewal-payment.js.
 */

export {
  createRenewalPayment,
  getRenewalStatus,
  isRenewalEligible,
  getRenewalState,
};

/**
 * Backward-compatible renewal submission helper.
 *
 * @param {object} input
 * @returns {Promise<object>}
 */
export async function submitRenewalPayment(input) {
  return createRenewalPayment(input);
}

/**
 * Backward-compatible renewal status helper.
 *
 * @returns {Promise<object>}
 */
export async function getRenewalPaymentStatus() {
  return getRenewalStatus();
}

export default {
  createRenewalPayment,
  submitRenewalPayment,
  getRenewalStatus,
  getRenewalPaymentStatus,
  isRenewalEligible,
  getRenewalState,
};