import { describe, expect, it } from 'vitest';

import {
  getProductionPlan,
  getProductionAmount,
} from '@/lib/payments/production-payment-config';

describe('Worldwide DIPO production configuration', () => {
  it('has correct Starter pricing', () => {
    expect(getProductionAmount('starter')).toBe(149);
  });

  it('has correct Pro pricing', () => {
    expect(getProductionAmount('pro')).toBe(349);
  });

  it('has correct Elite pricing', () => {
    expect(getProductionAmount('elite')).toBe(499);
  });

  it('has six-month Starter duration', () => {
    expect(
      getProductionPlan('starter').durationMonths
    ).toBe(6);
  });

  it('has six-month Pro duration', () => {
    expect(
      getProductionPlan('pro').durationMonths
    ).toBe(6);
  });

  it('has six-month Elite duration', () => {
    expect(
      getProductionPlan('elite').durationMonths
    ).toBe(6);
  });

  it('rejects an unknown plan', () => {
    expect(
      getProductionPlan('unlimited')
    ).toBeNull();
  });
});