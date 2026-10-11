const UTR_MAX_LENGTH = 120;

export function validatePaymentReference(value) {
  if (typeof value !== 'string') {
    return {
      valid: false,
      message:
        'UTR / Payment Reference is required.',
    };
  }

  const reference = value.trim();

  if (!reference) {
    return {
      valid: false,
      message:
        'UTR / Payment Reference is required.',
    };
  }

  if (reference.length > UTR_MAX_LENGTH) {
    return {
      valid: false,
      message:
        'Payment reference is too long.',
    };
  }

  /*
   * FIX: UPI UTR hamesha 12 digit ka hota hai.
   * Database bhi ab yehi format enforce karta hai (migration 020).
   */
  const compact = reference.replace(/\s+/g, '');

  if (!/^[0-9]{12}$/.test(compact)) {
    return {
      valid: false,
      message:
        'Please enter the 12-digit UTR number from your payment app.',
    };
  }

  return {
    valid: true,
    value: compact,
  };
}

export function validatePaymentPlan(plan) {
  if (
    plan !== 'Starter' &&
    plan !== 'Pro' &&
    plan !== 'Elite'
  ) {
    return {
      valid: false,
      message: 'Please select a valid plan.',
    };
  }

  return {
    valid: true,
    value: plan,
  };
}

export function validatePaymentClaimInput(input) {
  const errors = {};

  const planResult =
    validatePaymentPlan(input?.plan);

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