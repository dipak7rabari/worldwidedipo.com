const LIMITS = {
  name: 60,
  profession: 60,
  headline: 120,
  bio: 250,
  location: 120,
  category: 80,
  about: 3000,

  skills: 30,
  services: 30,
  experience: 20,
  education: 20,
  projects: 30,
  links: 30,
  social_links: 20,
};

function cleanText(value, max) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, max);
}

function cleanArray(value, maxItems) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

function cleanLinkArray(value, maxItems) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return {
          label: item.trim(),
          url: item.trim(),
        };
      }

      if (
        item &&
        typeof item === 'object' &&
        typeof item.url === 'string'
      ) {
        return {
          label:
            typeof item.label === 'string'
              ? item.label.trim().slice(0, 100)
              : 'Visit Link',
          url: item.url.trim().slice(0, 500),
        };
      }

      return null;
    })
    .filter(Boolean)
    .filter((item) => {
      try {
        const url = new URL(item.url);

        return (
          url.protocol === 'https:' ||
          url.protocol === 'http:'
        );
      } catch {
        return false;
      }
    })
    .slice(0, maxItems);
}

function validateTextField(
  errors,
  field,
  value,
  max
) {
  if (typeof value !== 'string') {
    errors[field] = `${field} must be text.`;
    return '';
  }

  const clean = value.trim();

  if (clean.length > max) {
    errors[field] =
      `${field} cannot exceed ${max} characters.`;
  }

  return clean;
}

export function validateProfileEditInput(
  input,
  options = {}
) {
  const errors = {};

  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      errors: {
        form: 'Invalid profile data.',
      },
    };
  }

  const status = options.status || 'draft';

  const value = {
    name: validateTextField(
      errors,
      'name',
      input.name,
      LIMITS.name
    ),

    profession: validateTextField(
      errors,
      'profession',
      input.profession,
      LIMITS.profession
    ),

    headline: validateTextField(
      errors,
      'headline',
      input.headline || '',
      LIMITS.headline
    ),

    bio: validateTextField(
      errors,
      'bio',
      input.bio || '',
      LIMITS.bio
    ),

    location: validateTextField(
      errors,
      'location',
      input.location || '',
      LIMITS.location
    ),

    category: validateTextField(
      errors,
      'category',
      input.category || '',
      LIMITS.category
    ),

    about: validateTextField(
      errors,
      'about',
      input.about || '',
      LIMITS.about
    ),

    skills: cleanArray(
      input.skills,
      LIMITS.skills
    ),

    services: cleanArray(
      input.services,
      LIMITS.services
    ),

    experience: cleanArray(
      input.experience,
      LIMITS.experience
    ),

    education: cleanArray(
      input.education,
      LIMITS.education
    ),

    projects: cleanArray(
      input.projects,
      LIMITS.projects
    ),

    links: cleanLinkArray(
      input.links,
      LIMITS.links
    ),

    social_links: cleanLinkArray(
      input.social_links,
      LIMITS.social_links
    ),
  };

  if (value.name.length < 2) {
    errors.name = 'Name must contain at least 2 characters.';
  }

  if (value.profession.length < 2) {
    errors.profession =
      'Profession must contain at least 2 characters.';
  }

  /*
   * Pending profiles have identity-critical fields locked.
   * Server-side enforcement happens again in update-profile.js.
   */
  if (status === 'pending') {
    delete errors.name;
    delete errors.profession;
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    value,
  };
}

export {
  LIMITS,
  cleanArray,
  cleanLinkArray,
  cleanText,
};