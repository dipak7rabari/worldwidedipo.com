const NAME_MIN = 2;
const NAME_MAX = 60;

const PROFESSION_MIN = 2;
const PROFESSION_MAX = 60;

const HEADLINE_MAX = 120;
const BIO_MAX = 250;
const ABOUT_MAX = 3000;

const SLUG_MIN = 3;
const SLUG_MAX = 30;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'auth',
  'dashboard',
  'login',
  'signup',
  'register',
  'support',
  'contact',
  'about',
  'privacy',
  'terms',
  'pricing',
  'billing',
  'profile',
  'profiles',
  'settings',
  'security',
  'help',
  'sitemap',
  'robots',
  'favicon',
  'www',
]);

function clean(value) {
  return typeof value === 'string'
    ? value.trim()
    : '';
}

export function validateName(value) {
  const name = clean(value);

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return {
      valid: false,
      message: `Name must be between ${NAME_MIN} and ${NAME_MAX} characters.`,
    };
  }

  return {
    valid: true,
    value: name,
  };
}

export function validateProfession(value) {
  const profession = clean(value);

  if (
    profession.length < PROFESSION_MIN ||
    profession.length > PROFESSION_MAX
  ) {
    return {
      valid: false,
      message: `Profession must be between ${PROFESSION_MIN} and ${PROFESSION_MAX} characters.`,
    };
  }

  return {
    valid: true,
    value: profession,
  };
}

export function validateOptionalText(
  value,
  fieldName,
  maxLength
) {
  const text = clean(value);

  if (text.length > maxLength) {
    return {
      valid: false,
      message: `${fieldName} cannot exceed ${maxLength} characters.`,
    };
  }

  return {
    valid: true,
    value: text || null,
  };
}

export function validateSlug(value) {
  const slug = clean(value).toLowerCase();

  if (
    slug.length < SLUG_MIN ||
    slug.length > SLUG_MAX
  ) {
    return {
      valid: false,
      message: `URL slug must be between ${SLUG_MIN} and ${SLUG_MAX} characters.`,
    };
  }

  if (!SLUG_PATTERN.test(slug)) {
    return {
      valid: false,
      message:
        'Use only lowercase letters, numbers, and single hyphens.',
    };
  }

  if (
    slug.startsWith('-') ||
    slug.endsWith('-') ||
    slug.includes('--')
  ) {
    return {
      valid: false,
      message: 'Invalid URL slug format.',
    };
  }

  if (RESERVED_SLUGS.has(slug)) {
    return {
      valid: false,
      message: 'This profile URL is reserved.',
    };
  }

  return {
    valid: true,
    value: slug,
  };
}

export function validateCreateProfileInput(input) {
  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      errors: {
        form: 'Invalid profile data.',
      },
    };
  }

  const errors = {};

  const name = validateName(input.name);

  if (!name.valid) {
    errors.name = name.message;
  }

  const profession = validateProfession(
    input.profession
  );

  if (!profession.valid) {
    errors.profession = profession.message;
  }

  const slug = validateSlug(input.slug);

  if (!slug.valid) {
    errors.slug = slug.message;
  }

  const headline = validateOptionalText(
    input.headline,
    'Headline',
    HEADLINE_MAX
  );

  if (!headline.valid) {
    errors.headline = headline.message;
  }

  const bio = validateOptionalText(
    input.bio,
    'Bio',
    BIO_MAX
  );

  if (!bio.valid) {
    errors.bio = bio.message;
  }

  const location = validateOptionalText(
    input.location,
    'Location',
    120
  );

  if (!location.valid) {
    errors.location = location.message;
  }

  const category = validateOptionalText(
    input.category,
    'Category',
    80
  );

  if (!category.valid) {
    errors.category = category.message;
  }

  const about = validateOptionalText(
    input.about,
    'About',
    ABOUT_MAX
  );

  if (!about.valid) {
    errors.about = about.message;
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    value: {
      name: name.value,
      profession: profession.value,
      slug: slug.value,
      headline: headline.value,
      bio: bio.value,
      location: location.value,
      category: category.value,
      about: about.value,
    },
  };
}