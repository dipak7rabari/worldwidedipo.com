import { describe, expect, it } from 'vitest';

import {
  validateName,
  validateProfession,
  validateSlug,
  validateCreateProfileInput,
} from '@/lib/profile/profile-validation';

import {
  validatePaymentReference,
  validatePaymentPlan,
  validatePaymentClaimInput,
} from '@/lib/payments/payment-validation';

describe('Worldwide DIPO validation contract', () => {
  describe('profile validation contract', () => {
    it('requires a valid profile name', () => {
      expect(
        validateName('').valid
      ).toBe(false);

      expect(
        validateName('A').valid
      ).toBe(false);

      expect(
        validateName('Rahul Sharma').valid
      ).toBe(true);
    });

    it('requires a valid profession', () => {
      expect(
        validateProfession('').valid
      ).toBe(false);

      expect(
        validateProfession('A').valid
      ).toBe(false);

      expect(
        validateProfession(
          'Software Engineer'
        ).valid
      ).toBe(true);
    });

    it('enforces safe profile slugs', () => {
      expect(
        validateSlug('rahul-sharma').valid
      ).toBe(true);

      expect(
        validateSlug('rahul--sharma').valid
      ).toBe(false);

      expect(
        validateSlug('rahul_sharma').valid
      ).toBe(false);

      expect(
        validateSlug('admin').valid
      ).toBe(false);
    });

    it('validates the complete create-profile contract', () => {
      const result =
        validateCreateProfileInput({
          name: 'Rahul Sharma',
          profession: 'Software Engineer',
          slug: 'rahul-sharma',
          headline: 'Building digital products.',
          bio: 'A software engineer.',
          location: 'Bengaluru',
          category: 'Technology',
          about: 'About Rahul.',
        });

      expect(result.valid).toBe(true);

      expect(result.value).toMatchObject({
        name: 'Rahul Sharma',
        profession: 'Software Engineer',
        slug: 'rahul-sharma',
      });
    });

    it('rejects invalid profile payloads', () => {
      const result =
        validateCreateProfileInput({
          name: 'A',
          profession: 'B',
          slug: 'admin',
        });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveProperty('name');
      expect(result.errors).toHaveProperty(
        'profession'
      );
      expect(result.errors).toHaveProperty('slug');
    });
  });

  describe('payment validation contract', () => {
    it('accepts supported payment plans', () => {
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

    it('rejects unsupported payment plans', () => {
      expect(
        validatePaymentPlan('Free').valid
      ).toBe(false);

      expect(
        validatePaymentPlan('Unlimited').valid
      ).toBe(false);
    });

    it('requires a payment reference', () => {
      expect(
        validatePaymentReference('').valid
      ).toBe(false);

      expect(
        validatePaymentReference('   ').valid
      ).toBe(false);
    });

    it('accepts and trims a payment reference', () => {
      expect(
        validatePaymentReference(
          '  UTR-123456  '
        )
      ).toEqual({
        valid: true,
        value: 'UTR-123456',
      });
    });

    it('validates a complete payment claim', () => {
      const result =
        validatePaymentClaimInput({
          plan: 'Pro',
          payment_reference: 'UTR-123456',
        });

      expect(result).toEqual({
        valid: true,
        value: {
          plan: 'Pro',
          payment_reference: 'UTR-123456',
        },
      });
    });

    it('rejects an invalid payment claim', () => {
      const result =
        validatePaymentClaimInput({
          plan: 'Free',
          payment_reference: '',
        });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveProperty('plan');
      expect(result.errors).toHaveProperty(
        'payment_reference'
      );
    });
  });

  describe('security expectations', () => {
    it('does not accept profile system fields as validation requirements', () => {
      const result =
        validateCreateProfileInput({
          name: 'Rahul Sharma',
          profession: 'Developer',
          slug: 'rahul-sharma',
          owner_id: 'attacker-controlled',
          status: 'active',
          plan: 'elite',
        });

      expect(result.valid).toBe(true);

      expect(result.value).not.toHaveProperty(
        'owner_id'
      );

      expect(result.value).not.toHaveProperty(
        'status'
      );

      expect(result.value).not.toHaveProperty(
        'plan'
      );
    });

    it('does not accept payment system fields as validated output', () => {
      const result =
        validatePaymentClaimInput({
          plan: 'Pro',
          payment_reference: 'UTR-123',
          amount: 1,
          status: 'approved',
          verified_by: 'attacker',
          user_id: 'attacker',
        });

      expect(result.valid).toBe(true);

      expect(result.value).toEqual({
        plan: 'Pro',
        payment_reference: 'UTR-123',
      });
    });
  });
});