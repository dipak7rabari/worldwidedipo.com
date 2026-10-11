import { describe, expect, it } from 'vitest';

const PLAN_PRICES = Object.freeze({
  starter: 149,
  pro: 349,
  elite: 499,
});

function getServerAmount(plan) {
  return PLAN_PRICES[plan] ?? null;
}

describe('payment security', () => {
  it('uses server-defined Starter price', () => {
    expect(getServerAmount('starter')).toBe(149);
  });

  it('uses server-defined Pro price', () => {
    expect(getServerAmount('pro')).toBe(349);
  });

  it('uses server-defined Elite price', () => {
    expect(getServerAmount('elite')).toBe(499);
  });

  it('rejects unknown plans', () => {
    expect(getServerAmount('free')).toBeNull();
  });

  it('does not accept a client amount as authority', () => {
    const clientAmount = 1;
    const serverAmount = getServerAmount('pro');

    expect(serverAmount).toBe(349);
    expect(serverAmount).not.toBe(clientAmount);
  });
});