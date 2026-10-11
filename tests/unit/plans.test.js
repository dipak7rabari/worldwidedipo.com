import { describe, expect, it } from 'vitest';

import {
  PLAN_IDS,
  PLAN_NAMES,
  PLAN_PRICES,
  PLAN_DURATION_MONTHS,
  PLAN_IMAGE_LIMITS,
  PLAN_FEATURES,
  PLAN_DESCRIPTIONS,
  PLANS,
  isValidPlan,
  getPlanPrice,
  getPlanName,
  getPlanImageLimit,
  getPlanConfig,
} from '@/config/plans';

import {
  getPlan,
  getAllPlans,
} from '@/lib/payments/plans';

describe('Worldwide DIPO plans', () => {
  it('contains exactly the supported plan identifiers', () => {
    expect(Object.values(PLAN_IDS)).toEqual([
      'starter',
      'pro',
      'elite',
    ]);
  });

  it('has server-defined prices', () => {
    expect(PLAN_PRICES.starter).toBe(149);
    expect(PLAN_PRICES.pro).toBe(349);
    expect(PLAN_PRICES.elite).toBe(499);
  });

  it('has a six-month duration for every plan', () => {
    expect(PLAN_DURATION_MONTHS).toBe(6);

    for (const plan of Object.values(PLAN_IDS)) {
      expect(PLANS[plan].durationMonths).toBe(6);
    }
  });

  it('has the expected image limits', () => {
    expect(PLAN_IMAGE_LIMITS.starter).toBe(4);
    expect(PLAN_IMAGE_LIMITS.pro).toBe(12);
    expect(PLAN_IMAGE_LIMITS.elite).toBe(12);
  });

  it('has a name for every plan', () => {
    for (const plan of Object.values(PLAN_IDS)) {
      expect(typeof PLAN_NAMES[plan]).toBe('string');
      expect(PLAN_NAMES[plan].length).toBeGreaterThan(0);
    }
  });

  it('has a description for every plan', () => {
    for (const plan of Object.values(PLAN_IDS)) {
      expect(typeof PLAN_DESCRIPTIONS[plan]).toBe('string');
      expect(
        PLAN_DESCRIPTIONS[plan].length
      ).toBeGreaterThan(0);
    }
  });

  it('has feature arrays for every plan', () => {
    for (const plan of Object.values(PLAN_IDS)) {
      expect(Array.isArray(PLAN_FEATURES[plan])).toBe(true);
      expect(PLAN_FEATURES[plan].length).toBeGreaterThan(0);
    }
  });

  describe('isValidPlan', () => {
    it.each(['starter', 'pro', 'elite'])(
      'accepts %s',
      (plan) => {
        expect(isValidPlan(plan)).toBe(true);
      }
    );

    it.each([
      undefined,
      null,
      '',
      'free',
      'Starter',
      'unlimited',
      'admin',
    ])('rejects invalid plan %s', (plan) => {
      expect(isValidPlan(plan)).toBe(false);
    });
  });

  describe('plan helpers', () => {
    it('returns the correct price', () => {
      expect(getPlanPrice('starter')).toBe(149);
      expect(getPlanPrice('pro')).toBe(349);
      expect(getPlanPrice('elite')).toBe(499);
    });

    it('returns null for an unknown price plan', () => {
      expect(getPlanPrice('unknown')).toBeNull();
    });

    it('returns the correct plan name', () => {
      expect(getPlanName('starter')).toBe(
        PLAN_NAMES.starter
      );

      expect(getPlanName('pro')).toBe(
        PLAN_NAMES.pro
      );

      expect(getPlanName('elite')).toBe(
        PLAN_NAMES.elite
      );
    });

    it('returns null for an unknown plan name', () => {
      expect(getPlanName('unknown')).toBeNull();
    });

    it('returns the correct image limit', () => {
      expect(getPlanImageLimit('starter')).toBe(4);
      expect(getPlanImageLimit('pro')).toBe(12);
      expect(getPlanImageLimit('elite')).toBe(12);
    });

    it('returns zero for an unknown image-limit plan', () => {
      expect(getPlanImageLimit('unknown')).toBe(0);
    });

    it('returns the complete plan configuration', () => {
      const config = getPlanConfig('pro');

      expect(config).toEqual(PLANS.pro);
      expect(config.id).toBe('pro');
      expect(config.price).toBe(349);
      expect(config.durationMonths).toBe(6);
      expect(config.imageLimit).toBe(12);
      expect(Array.isArray(config.features)).toBe(true);
    });

    it('returns null for an unknown configuration', () => {
      expect(getPlanConfig('unknown')).toBeNull();
    });
  });

  describe('payment plan service', () => {
    it('returns a normalized Starter plan', () => {
      expect(getPlan('starter')).toEqual({
        id: 'starter',
        name: PLAN_NAMES.starter,
        price: 149,
        durationMonths: 6,
        imageLimit: 4,
        features: PLAN_FEATURES.starter,
        description: PLAN_DESCRIPTIONS.starter,
      });
    });

    it('returns a normalized Pro plan', () => {
      const plan = getPlan('pro');

      expect(plan).not.toBeNull();
      expect(plan.id).toBe('pro');
      expect(plan.name).toBe(PLAN_NAMES.pro);
      expect(plan.price).toBe(349);
      expect(plan.durationMonths).toBe(6);
      expect(plan.imageLimit).toBe(12);
    });

    it('returns a normalized Elite plan', () => {
      const plan = getPlan('elite');

      expect(plan).not.toBeNull();
      expect(plan.id).toBe('elite');
      expect(plan.name).toBe(PLAN_NAMES.elite);
      expect(plan.price).toBe(499);
      expect(plan.durationMonths).toBe(6);
      expect(plan.imageLimit).toBe(12);
    });

    it('returns null for an invalid plan', () => {
      expect(getPlan('free')).toBeNull();
      expect(getPlan('unlimited')).toBeNull();
      expect(getPlan(undefined)).toBeNull();
    });

    it('returns all supported plans without invalid entries', () => {
      const plans = getAllPlans();

      expect(plans).toHaveLength(3);

      expect(
        plans.map((plan) => plan.id)
      ).toEqual([
        'starter',
        'pro',
        'elite',
      ]);

      expect(
        plans.every((plan) => isValidPlan(plan.id))
      ).toBe(true);
    });
  });
});