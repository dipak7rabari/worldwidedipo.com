import {
  validatePaymentPlan,
  validatePaymentReference,
} from './payment-validation';

export function validateRenewalInput(input) {
  const errors = {};

  const planResult = validatePaymentPlan(
    input?.plan
  );

  if (!planResult.valid) {
    errors.plan = planResult.message;
  }

  const referenceResult =
    validatePaymentReference(
      input?.payment_reference
    );

  if (!referenceResult.valid) {
    errors.payment_reference =
      referenceResult.message;
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    value: {
      plan: planResult.value,
      payment_reference:
        referenceResult.value,
    },
  };
}