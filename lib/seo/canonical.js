const DEFAULT_BASE_URL = 'https://worldwidedipo.com';

export function getBaseUrl() {
  const configured =
    process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;

  try {
    const url = new URL(configured);

    if (url.protocol !== 'https:') {
      return DEFAULT_BASE_URL;
    }

    return url.origin;
  } catch {
    return DEFAULT_BASE_URL;
  }
}

export function getProfileCanonicalUrl(slug) {
  const normalizedSlug =
    typeof slug === 'string' ? slug.trim().toLowerCase() : '';

  if (!normalizedSlug) {
    return getBaseUrl();
  }

  return `${getBaseUrl()}/p/${encodeURIComponent(normalizedSlug)}`;
}