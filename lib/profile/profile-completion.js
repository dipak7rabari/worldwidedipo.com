/**
 * Profile Completion Utilities
 *
 * Keeps profile-completion logic centralized and reusable
 * across dashboard, onboarding and profile editing flows.
 */

const COMPLETION_FIELDS = Object.freeze([
  {
    key: 'name',
    label: 'Name',
    weight: 15,
    required: true,
  },
  {
    key: 'profession',
    label: 'Profession',
    weight: 10,
    required: true,
  },
  {
    key: 'headline',
    label: 'Headline',
    weight: 10,
  },
  {
    key: 'bio',
    label: 'Bio',
    weight: 10,
  },
  {
    key: 'avatar_url',
    label: 'Profile photo',
    weight: 10,
  },
  {
    key: 'location',
    label: 'Location',
    weight: 5,
  },
  {
    key: 'category',
    label: 'Category',
    weight: 5,
  },
  {
    key: 'about',
    label: 'About',
    weight: 10,
  },
  {
    key: 'links',
    label: 'Links',
    weight: 5,
  },
  {
    key: 'social_links',
    label: 'Social profiles',
    weight: 5,
  },
  {
    key: 'skills',
    label: 'Skills',
    weight: 5,
  },
  {
    key: 'services',
    label: 'Services',
    weight: 5,
  },
]);

function isFilled(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return Boolean(value);
}

function getFieldValue(profile, key) {
  if (!profile || typeof profile !== 'object') {
    return null;
  }

  return profile[key];
}

export function getProfileCompletionDetails(profile = {}) {
  let completedWeight = 0;
  let totalWeight = 0;

  const fields = COMPLETION_FIELDS.map((field) => {
    const value = getFieldValue(profile, field.key);
    const completed = isFilled(value);

    totalWeight += field.weight;

    if (completed) {
      completedWeight += field.weight;
    }

    return {
      key: field.key,
      label: field.label,
      weight: field.weight,
      required: Boolean(field.required),
      completed,
    };
  });

  const percentage =
    totalWeight > 0
      ? Math.round((completedWeight / totalWeight) * 100)
      : 0;

  return {
    percentage: Math.min(100, Math.max(0, percentage)),
    completedWeight,
    totalWeight,
    completedCount: fields.filter((field) => field.completed).length,
    totalCount: fields.length,
    fields,
  };
}

export function getProfileCompletion(profile = {}) {
  return getProfileCompletionDetails(profile).percentage;
}

export function getProfileCompletionPercentage(profile = {}) {
  return getProfileCompletion(profile);
}

export function getMissingProfileFields(profile = {}) {
  return getProfileCompletionDetails(profile)
    .fields
    .filter((field) => !field.completed)
    .map((field) => field.key);
}

export function getNextProfileFields(profile = {}, limit = 3) {
  const safeLimit = Math.max(1, Number(limit) || 3);

  return getProfileCompletionDetails(profile)
    .fields
    .filter((field) => !field.completed)
    .sort((a, b) => {
      if (Boolean(b.required) !== Boolean(a.required)) {
        return Number(b.required) - Number(a.required);
      }

      return b.weight - a.weight;
    })
    .slice(0, safeLimit)
    .map((field) => ({
      key: field.key,
      label: field.label,
      required: field.required,
      weight: field.weight,
    }));
}

export function isProfileComplete(profile = {}) {
  const details = getProfileCompletionDetails(profile);

  return details.fields.every((field) => field.completed);
}

export function getProfileCompletionMessage(profile = {}) {
  const percentage = getProfileCompletion(profile);

  if (percentage >= 100) {
    return 'Your DIPO profile is complete.';
  }

  if (percentage >= 80) {
    return 'Almost there. Add a few more details to complete your profile.';
  }

  if (percentage >= 50) {
    return 'Good progress. Complete a few more sections to strengthen your DIPO.';
  }

  if (percentage > 0) {
    return 'Keep building your DIPO. Add more details to make your profile stronger.';
  }

  return 'Start completing your DIPO profile.';
}

export function getProfileCompletionFields() {
  return COMPLETION_FIELDS.map((field) => ({
    ...field,
  }));
}

export default getProfileCompletion;