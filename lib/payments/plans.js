import {
  PLAN_IDS,
  PLAN_NAMES,
  PLAN_PRICES,
  PLAN_DURATION_MONTHS,
  PLAN_IMAGE_LIMITS,
  PLAN_FEATURES,
  PLAN_DESCRIPTIONS,
  isValidPlan
} from "@/config/plans";

export {
  PLAN_IDS,
  PLAN_NAMES,
  PLAN_PRICES,
  PLAN_DURATION_MONTHS,
  PLAN_IMAGE_LIMITS,
  PLAN_FEATURES,
  PLAN_DESCRIPTIONS
};

export function getPlan(planId) {
  if (!isValidPlan(planId)) {
    return null;
  }

  return {
    id: planId,
    name: PLAN_NAMES[planId],
    price: PLAN_PRICES[planId],
    durationMonths:
      PLAN_DURATION_MONTHS,
    imageLimit:
      PLAN_IMAGE_LIMITS[planId],
    features:
      PLAN_FEATURES[planId],
    description:
      PLAN_DESCRIPTIONS[planId]
  };
}

export function getAllPlans() {
  return Object.values(PLAN_IDS)
    .map(getPlan)
    .filter(Boolean);
}