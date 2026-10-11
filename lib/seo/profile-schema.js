// lib/seo/profile-schema.js

/**
 * Safely return a trimmed string.
 */
function clean(value, maxLength = 500) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim().slice(0, maxLength);
}

/**
 * Safely return a valid absolute HTTPS URL.
 */
function safeUrl(value) {
  const url = clean(value, 2000);

  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== 'https:') {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Build structured data for a public Worldwide DIPO profile.
 *
 * This schema is descriptive structured data only.
 * It does not imply Google verification, ranking, indexing,
 * Knowledge Panel eligibility, or search-result placement.
 */
export function buildProfileSchema(profile) {
  if (!profile) {
    return null;
  }

  const name = clean(profile.name, 120);
  const profession = clean(profile.profession, 120);
  const headline = clean(profile.headline, 160);
  const bio = clean(profile.bio, 500);
  const location = clean(profile.location, 160);
  const avatarUrl = safeUrl(profile.avatar_url);

  if (!name || !profession) {
    return null;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://worldwidedipo.com';

  const canonicalUrl = `${baseUrl.replace(/\/+$/, '')}/p/${encodeURIComponent(
    clean(profile.slug, 80),
  )}`;

  const sameAs = [];

  if (profile.social_links && typeof profile.social_links === 'object') {
    for (const value of Object.values(profile.social_links)) {
      const url = safeUrl(value);

      if (url && !sameAs.includes(url)) {
        sameAs.push(url);
      }
    }
  }

  if (profile.links && typeof profile.links === 'object') {
    for (const value of Object.values(profile.links)) {
      const url = safeUrl(value);

      if (url && !sameAs.includes(url)) {
        sameAs.push(url);
      }
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: canonicalUrl,
    jobTitle: profession,
  };

  if (headline) {
    schema.description = headline;
  } else if (bio) {
    schema.description = bio;
  }

  if (avatarUrl) {
    schema.image = avatarUrl;
  }

  if (location) {
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: location,
    };
  }

  if (sameAs.length > 0) {
    schema.sameAs = sameAs.slice(0, 20);
  }

  return schema;
}

/**
 * Backward-compatible alias used by the public profile SEO layer.
 *
 * IMPORTANT:
 * Keep only this single export.
 * Do not add another buildProfileJsonLd declaration.
 */
export const buildProfileJsonLd = buildProfileSchema;