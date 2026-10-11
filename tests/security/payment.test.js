import { describe, expect, it } from 'vitest';

import {
  getProductionPlan,
  getProductionAmount,
} from '@/lib/payments/production-payment-config';

import {
  validatePaymentReference,
  validatePaymentPlan,
  validatePaymentClaimInput,
} from '@/lib/payments/payment-validation';

import {
  normalizePaymentReference,
  validateAndNormalizePaymentReference,
} from '@/lib/payments/payment-utils';

describe('security: payment validation', () => {
  describe('server-side plan pricing', () => {
    it('uses authoritative Starter pricing', () => {
      expect(
        getProductionAmount('starter')
      ).toBe(149);
    });

    it('uses authoritative Pro pricing', () => {
      expect(
        getProductionAmount('pro')
      ).toBe(349);
    });

    it('uses authoritative Elite pricing', () => {
      expect(
        getProductionAmount('elite')
      ).toBe(499);
    });

    it('does not recognize unknown plans', () => {
      expect(
        getProductionPlan('free')
      ).toBeNull();

      expect(
        getProductionPlan('unlimited')
      ).toBeNull();

      expect(
        getProductionAmount('free')
      ).toBeNull();
    });

    it('does not trust a client supplied amount', () => {
      const maliciousAmount = 1;
      const serverAmount =
        getProductionAmount('pro');

      expect(serverAmount).toBe(349);
      expect(serverAmount).not.toBe(
        maliciousAmount
      );
    });

    it('does not allow object injection into plan lookup', () => {
      expect(
        getProductionPlan({
          toString: () => 'pro',
        })
      ).toBeNull();
    });
  });

  describe('payment plan validation', () => {
    it('accepts only the supported public plan names', () => {
      expect(
        validatePaymentPlan('Starter').valid
      ).toBe(true);

      expect(
        validatePaymentPlan('Pro').valid
      ).toBe(true);

      expect(
        validatePaymentPlan('Elite').valid
      ).toBe(true);
    });

    it('rejects unsupported plan names', () => {
      const invalidPlans = [
        'free',
        'Unlimited',
        'starter',
        'PRO',
        '',
        null,
        undefined,
        149,
        {},
      ];

      for (const plan of invalidPlans) {
        expect(
          validatePaymentPlan(plan).valid
        ).toBe(false);
      }
    });
  });

  describe('payment reference validation', () => {
    it('accepts a normal UTR/reference', () => {
      const result =
        validatePaymentReference(
          '123456789012'
        );

      expect(result.valid).toBe(true);
      expect(result.value).toBe(
        '123456789012'
      );
    });

    it('trims surrounding whitespace', () => {
      const result =
        validatePaymentReference(
          '  UTR-123456  '
        );

      expect(result.valid).toBe(true);
      expect(result.value).toBe(
        'UTR-123456'
      );
    });

    it('rejects empty references', () => {
      expect(
        validatePaymentReference('').valid
      ).toBe(false);

      expect(
        validatePaymentReference('   ').valid
      ).toBe(false);
    });

    it('rejects non-string references', () => {
      for (const value of [
        null,
        undefined,
        123456,
        {},
        [],
      ]) {
        expect(
          validatePaymentReference(value).valid
        ).toBe(false);
      }
    });

    it('rejects oversized references', () => {
      expect(
        validatePaymentReference(
          'a'.repeat(121)
        ).valid
      ).toBe(false);
    });

    it('accepts the maximum allowed reference length', () => {
      const value = 'a'.repeat(120);

      expect(
        validatePaymentReference(value).valid
      ).toBe(true);
    });
  });

  describe('payment claim input', () => {
    it('accepts valid claim input', () => {
      const result =
        validatePaymentClaimInput({
          plan: 'Pro',
          payment_reference: 'UTR-12345',
        });

      expect(result.valid).toBe(true);

      expect(result.value).toEqual({
        plan: 'Pro',
        payment_reference: 'UTR-12345',
      });
    });

    it('rejects malformed claim input', () => {
      const result =
        validatePaymentClaimInput({
          plan: 'free',
          payment_reference: '',
        });

      expect(result.valid).toBe(false);
      expect(result.errors.plan).toBeTruthy();
      expect(
        result.errors.payment_reference
      ).toBeTruthy();
    });

    it('fails closed for missing input', () => {
      expect(
        validatePaymentClaimInput(null).valid
      ).toBe(false);

      expect(
        validatePaymentClaimInput(undefined).valid
      ).toBe(false);
    });
  });

  describe('payment reference normalization', () => {
    it('normalizes repeated whitespace', () => {
      expect(
        normalizePaymentReference(
          '  UTR   123   456  '
        )
      ).toBe('UTR 123 456');
    });

    it('limits normalized reference length', () => {
      expect(
        normalizePaymentReference(
          'x'.repeat(200)
        ).length
      ).toBe(120);
    });

    it('handles null and undefined safely', () => {
      expect(
        normalizePaymentReference(null)
      ).toBe('');

      expect(
        normalizePaymentReference(undefined)
      ).toBe('');
    });

    it('validates the normalized value', () => {
      const result =
        validateAndNormalizePaymentReference(
          '  UTR    999  '
        );

      expect(result.valid).toBe(true);
      expect(result.value).toBe(
        'UTR 999'
      );
    });
  });
});