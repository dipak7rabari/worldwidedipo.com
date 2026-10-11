export const PLAN_IDS = {
  STARTER: 'starter',
  PRO: 'pro',
  ELITE: 'elite',
};

export const PLAN_NAMES = {
  [PLAN_IDS.STARTER]: 'Starter Index',
  [PLAN_IDS.PRO]: 'Pro Creator',
  [PLAN_IDS.ELITE]: 'Authority Elite',
};

export const PLAN_PRICES = {
  [PLAN_IDS.STARTER]: 149,
  [PLAN_IDS.PRO]: 349,
  [PLAN_IDS.ELITE]: 499,
};

export const PLAN_DURATION_MONTHS = 6;

export const PLAN_IMAGE_LIMITS = {
  [PLAN_IDS.STARTER]: 4,
  [PLAN_IDS.PRO]: 12,
  [PLAN_IDS.ELITE]: 12,
};

export const PLAN_BADGES = {
  [PLAN_IDS.STARTER]: null,
  [PLAN_IDS.PRO]: 'Popular',
  [PLAN_IDS.ELITE]: 'Premium',
};

export const PLAN_DESCRIPTIONS = {
  [PLAN_IDS.STARTER]:
    'For students, beginners, and personal digital identities.',
  [PLAN_IDS.PRO]:
    'For shop owners, creators, freelancers, and growing professionals.',
  [PLAN_IDS.ELITE]:
    'For established businesses and professional creators.',
};

export const PLAN_FEATURES = {
  [PLAN_IDS.STARTER]: [
    'Personal digital profile',
    'Personal DIPO URL',
    'Education & skills',
    'Projects',
    'Social links',
    'Contact information',
    'Search-ready profile',
    'Up to 4 images',
  ],

  [PLAN_IDS.PRO]: [
    'Professional DIPO profile',
    'Custom DIPO URL',
    'DIPO Verified badge',
    'Owner / creator name and photo',
    'Business / creator category',
    'About and services',
    'WhatsApp and call',
    'Google Maps external link',
    'Instagram, YouTube, Facebook and more',
    'Projects / catalogue external links',
    'Search-ready metadata and structured data',
    'Up to 12 images',
  ],

  [PLAN_IDS.ELITE]: [
    'Everything in Pro Creator',
    'DIPO Verified badge',
    'Premium presentation',
    'DIPO branding removal',
    'Enhanced metadata configuration',
    'Business and professional identity',
    'Multiple external links',
    'Priority DIPO support',
    'Up to 12 images',
  ],
};

/*
 * Backward-compatible payment configuration.
 * Existing payment files use PLANS.
 */
export const PLANS = {
  [PLAN_IDS.STARTER]: {
    id: PLAN_IDS.STARTER,
    name: PLAN_NAMES[PLAN_IDS.STARTER],
    price: PLAN_PRICES[PLAN_IDS.STARTER],
    durationMonths: PLAN_DURATION_MONTHS,
    imageLimit: PLAN_IMAGE_LIMITS[PLAN_IDS.STARTER],
    badge: PLAN_BADGES[PLAN_IDS.STARTER],
    description: PLAN_DESCRIPTIONS[PLAN_IDS.STARTER],
    features: PLAN_FEATURES[PLAN_IDS.STARTER],
  },

  [PLAN_IDS.PRO]: {
    id: PLAN_IDS.PRO,
    name: PLAN_NAMES[PLAN_IDS.PRO],
    price: PLAN_PRICES[PLAN_IDS.PRO],
    durationMonths: PLAN_DURATION_MONTHS,
    imageLimit: PLAN_IMAGE_LIMITS[PLAN_IDS.PRO],
    badge: PLAN_BADGES[PLAN_IDS.PRO],
    description: PLAN_DESCRIPTIONS[PLAN_IDS.PRO],
    features: PLAN_FEATURES[PLAN_IDS.PRO],
  },

  [PLAN_IDS.ELITE]: {
    id: PLAN_IDS.ELITE,
    name: PLAN_NAMES[PLAN_IDS.ELITE],
    price: PLAN_PRICES[PLAN_IDS.ELITE],
    durationMonths: PLAN_DURATION_MONTHS,
    imageLimit: PLAN_IMAGE_LIMITS[PLAN_IDS.ELITE],
    badge: PLAN_BADGES[PLAN_IDS.ELITE],
    description: PLAN_DESCRIPTIONS[PLAN_IDS.ELITE],
    features: PLAN_FEATURES[PLAN_IDS.ELITE],
  },
};

export function isValidPlan(plan) {
  return Object.prototype.hasOwnProperty.call(PLANS, plan);
}

export function getPlanPrice(plan) {
  return isValidPlan(plan) ? PLANS[plan].price : null;
}

export function getPlanName(plan) {
  return isValidPlan(plan) ? PLANS[plan].name : null;
}

export function getPlanImageLimit(plan) {
  return isValidPlan(plan) ? PLANS[plan].imageLimit : 0;
}

export function getPlanConfig(plan) {
  return isValidPlan(plan) ? PLANS[plan] : null;
}