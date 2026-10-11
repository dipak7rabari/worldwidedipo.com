// lib/payments/payment-config.js

import {
  PLAN_IDS,
  PLAN_NAMES,
  PLAN_PRICES,
  PLAN_DURATION_MONTHS,
  PLAN_IMAGE_LIMITS,
  PLAN_BADGES,
  PLAN_DESCRIPTIONS,
  PLAN_FEATURES,
  PLANS,
  getPlanConfig,
  getPlanPrice,
  getPlanName,
  isValidPlan,
} from '@/config/plans';

export {
  PLAN_IDS,
  PLAN_NAMES,
  PLAN_PRICES,
  PLAN_DURATION_MONTHS,
  PLAN_IMAGE_LIMITS,
  PLAN_BADGES,
  PLAN_DESCRIPTIONS,
  PLAN_FEATURES,
  PLANS,
  getPlanConfig,
  getPlanPrice,
  getPlanName,
  isValidPlan,
};
function toPlanId(plan) {
  return String(plan || '').trim().toLowerCase();
}

/**
 * Compatibility payment-plan map.
 *
 * Payment-related components may use PAYMENT_PLANS directly,
 * while the main application uses config/plans.js.
 *
 * Keep prices server-authoritative through the database/RPC.
 * These values are UI/config compatibility values only.
 */
export const PAYMENT_PLANS = {
  Starter: {
    id: 'Starter',
    name: getPlanName(PLAN_IDS.STARTER),
    amount: getPlanPrice(PLAN_IDS.STARTER),
    price: getPlanPrice(PLAN_IDS.STARTER),
    durationMonths: 6,
    imageLimit: 4,
    badge: PLAN_BADGES[PLAN_IDS.STARTER] ?? null,
    description: PLAN_DESCRIPTIONS[PLAN_IDS.STARTER] ?? '',
    features: PLAN_FEATURES[PLAN_IDS.STARTER] ?? [],
  },

  Pro: {
    id: 'Pro',
    name: getPlanName(PLAN_IDS.PRO),
    amount: getPlanPrice(PLAN_IDS.PRO),
    price: getPlanPrice(PLAN_IDS.PRO),
    durationMonths: 6,
    imageLimit: 12,
    badge: PLAN_BADGES[PLAN_IDS.PRO] ?? null,
    description: PLAN_DESCRIPTIONS[PLAN_IDS.PRO] ?? '',
    features: PLAN_FEATURES[PLAN_IDS.PRO] ?? [],
  },

  Elite: {
    id: 'Elite',
    name: getPlanName(PLAN_IDS.ELITE),
    amount: getPlanPrice(PLAN_IDS.ELITE),
    price: getPlanPrice(PLAN_IDS.ELITE),
    durationMonths: 6,
    imageLimit: 12,
    badge: PLAN_BADGES[PLAN_IDS.ELITE] ?? null,
    description: PLAN_DESCRIPTIONS[PLAN_IDS.ELITE] ?? '',
    features: PLAN_FEATURES[PLAN_IDS.ELITE] ?? [],
  },
};


/**
 * Return payment configuration for a plan.
 *
 * Accepts:
 *   Starter
 *   Pro
 *   Elite
 */
export function getPaymentPlan(plan) {
  if (!plan) return null;

  if (PAYMENT_PLANS[plan]) {
    return PAYMENT_PLANS[plan];
  }

  const normalized = String(plan).trim().toLowerCase();

  const key =
    normalized === 'starter'
      ? 'Starter'
      : normalized === 'pro'
        ? 'Pro'
        : normalized === 'elite'
          ? 'Elite'
          : null;

  return key ? PAYMENT_PLANS[key] : null;
}

/**
 * Build a UPI payment intent URL.
 *
 * This is only a payment-intent helper.
 * It does NOT verify payment.
 *
 * Verification happens server-side using the submitted
 * UTR / Payment Reference and manual admin verification.
 */
export function buildUpiIntent({
  plan,
  amount,
  paymentReference = '',
  reference = '',
} = {}) {
  const configuredAmount = plan ? getPlanPrice(plan) : null;

  const numericAmount = Number(amount);

  const finalAmount =
    Number.isFinite(numericAmount) && numericAmount > 0
      ? numericAmount
      : configuredAmount;

  if (!finalAmount || !Number.isFinite(Number(finalAmount))) {
    return '';
  }

  const upiId = process.env.NEXT_PUBLIC_UPI_ID;
  const payeeName =
    process.env.NEXT_PUBLIC_PAYEE_NAME || 'Worldwide DIPO';

  if (!upiId) {
    return '';
  }

  const cleanReference =
    String(paymentReference || reference || '').trim();

  const planName = plan ? getPlanName(plan) : null;

  const transactionNote =
    cleanReference ||
    (planName
      ? `Worldwide DIPO - ${planName}`
      : 'Worldwide DIPO Payment');

  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: Number(finalAmount).toFixed(2),
    cu: 'INR',
    tn: transactionNote.slice(0, 80),
  });

  return `upi://pay?${params.toString()}`;
}

/**
 * Return the configured official UPI ID.
 */
export function getOfficialUpiId() {
  return process.env.NEXT_PUBLIC_UPI_ID || '';
}

/**
 * Return the configured payee name.
 */
export function getPayeeName() {
  return process.env.NEXT_PUBLIC_PAYEE_NAME || 'Worldwide DIPO';
}
/**
 * Backward-compatible alias used by payment UI.
 */
export function getPaymentUpiId() {
  return getOfficialUpiId();
}