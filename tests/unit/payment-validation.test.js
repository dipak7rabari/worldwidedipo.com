import { describe, expect, it } from 'vitest';

import {
  validatePaymentReference,
  validatePaymentPlan,
  validatePaymentClaimInput,
} from '@/lib/payments/payment-validation';

describe('payment validation', () => {
  describe('validatePaymentReference', () => {
    it('accepts a valid payment reference', () => {
      expect(
        validatePaymentReference('  UTR123456789  ')
      ).toEqual({
        valid: true,
        value: 'UTR123456789',
      });
    });

    it('rejects non-string values', () => {
      expect(validatePaymentReference(null).valid).toBe(false);
      expect(validatePaymentReference(undefined).valid).toBe(false);
      expect(validatePaymentReference(123456).valid).toBe(false);
      expect(validatePaymentReference({}).valid).toBe(false);
    });

    it('rejects an empty reference', () => {
      expect(
        validatePaymentReference('')
      ).toMatchObject({
        valid: false,
        message: 'UTR / Payment Reference is required.',
      });
    });

    it('rejects whitespace-only references', () => {
      expect(
        validatePaymentReference('   ')
      ).toMatchObject({
        valid: false,
        message: 'UTR / Payment Reference is required.',
      });
    });

    it('trims surrounding whitespace', () => {
      expect(
        validatePaymentReference('\n UTR-123 \t')
      ).toEqual({
        valid: true,
        value: 'UTR-123',
      });
    });

    it('accepts a reference at the maximum length', () => {
      const reference = 'A'.repeat(120);

      expect(
        validatePaymentReference(reference)
      ).toEqual({
        valid: true,
        value: reference,
      });
    });

    it('rejects a reference longer than the maximum length', () => {
      const reference = 'A'.repeat(121);

      expect(
        validatePaymentReference(reference)
      ).toMatchObject({
        valid: false,
        message: 'Payment reference is too long.',
      });
    });
  });

  describe('validatePaymentPlan', () => {
    it.each(['Starter', 'Pro', 'Elite'])(
      'accepts the %s plan',
      (plan) => {
        expect(validatePaymentPlan(plan)).toEqual({
          valid: true,
          value: plan,
        });
      }
    );

    it('rejects unknown plans', () => {
      expect(
        validatePaymentPlan('Free')
      ).toMatchObject({
        valid: false,
        message: 'Please select a valid plan.',
      });
    });

    it('rejects lowercase plan identifiers', () => {
      expect(validatePaymentPlan('starter').valid).toBe(false);
      expect(validatePaymentPlan('pro').valid).toBe(false);
      expect(validatePaymentPlan('elite').valid).toBe(false);
    });

    it('rejects missing plans', () => {
      expect(validatePaymentPlan(undefined).valid).toBe(false);
      expect(validatePaymentPlan(null).valid).toBe(false);
      expect(validatePaymentPlan('').valid).toBe(false);
    });
  });

  describe('validatePaymentClaimInput', () => {
    it('accepts a valid payment claim', () => {
      expect(
        validatePaymentClaimInput({
          plan: 'Pro',
          payment_reference: ' UTR-987654 ',
        })
      ).toEqual({
        valid: true,
        value: {
          plan: 'Pro',
          payment_reference: 'UTR-987654',
        },
      });
    });

    it('returns field-level errors for invalid input', () => {
      const result = validatePaymentClaimInput({
        plan: 'Unknown',
        payment_reference: '',
      });

      expect(result.valid).toBe(false);

      expect(result.errors).toEqual({
        plan: 'Please select a valid plan.',
        payment_reference:
          'UTR / Payment Reference is required.',
      });
    });

    it('rejects missing input', () => {
      const result = validatePaymentClaimInput();

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveProperty('plan');
      expect(result.errors).toHaveProperty(
        'payment_reference'
      );
    });

    it('does not trust unrelated client fields', () => {
      const result = validatePaymentClaimInput({
        plan: 'Starter',
        payment_reference: 'UTR123',
        amount: 1,
        user_id: 'attacker',
        status: 'approved',
        verified_by: 'attacker',
      });

      expect(result).toEqual({
        valid: true,
        value: {
          plan: 'Starter',
          payment_reference: 'UTR123',
        },
      });
    });
  });
});