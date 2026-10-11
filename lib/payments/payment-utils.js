// lib/payments/payment-utils.js

import {
  getPlanConfig,
  getPlanPrice,
  getPlanName,
  isValidPlan,
} from '@/config/plans';

import { validatePaymentReference } from './payment-validation';

/**
 * Normalize a payment reference before validation/submission.
 */
export function normalizePaymentReference(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 120);
}

/**
 * Return the payment amount for a plan.
 *
 * These values are configuration/UI values.
 * Final payment amount is determined server-side.
 */
export function getPlanAmount(plan) {
  const amount = getPlanPrice(plan);

  return Number.isFinite(Number(amount))
    ? Number(amount)
    : 0;
}

/**
 * Return a complete payment plan configuration.
 */
export function getPaymentPlanConfig(plan) {
  return getPlanConfig(plan) || null;
}

/**
 * Validate and normalize a payment reference.
 */
export function validateAndNormalizePaymentReference(value) {
  const normalized = normalizePaymentReference(value);

  return validatePaymentReference(normalized);
}

export {
  getPlanConfig,
  getPlanPrice,
  getPlanName,
  isValidPlan,
  validatePaymentReference,
};