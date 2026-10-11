const PLANS = Object.freeze({
  starter: {
    name: 'Starter Index',
    amount: 149,
    durationMonths: 6,
  },

  pro: {
    name: 'Pro Creator',
    amount: 349,
    durationMonths: 6,
  },

  elite: {
    name: 'Authority Elite',
    amount: 499,
    durationMonths: 6,
  },
});

export function getProductionPlan(plan) {
  if (typeof plan !== 'string') {
    return null;
  }

  return PLANS[plan.toLowerCase()] || null;
}

export function getProductionAmount(plan) {
  const config = getProductionPlan(plan);

  return config?.amount ?? null;
}

export function getProductionPlans() {
  return Object.entries(PLANS).map(
    ([id, config]) => ({
      id,
      ...config,
    })
  );
}

export function buildUpiIntent(plan) {
  const config = getProductionPlan(plan);
  const upiId = process.env.NEXT_PUBLIC_UPI_ID;
  const payee =
    process.env.NEXT_PUBLIC_PAYEE_NAME ||
    'Worldwide DIPO';

  if (!config || !upiId) {
    return null;
  }

  const params = new URLSearchParams({
    pa: upiId,
    pn: payee,
    am: String(config.amount),
    cu: 'INR',
    tn: `DIPO-${plan}-${Date.now()}`,
  });

  return `upi://pay?${params.toString()}`;
}