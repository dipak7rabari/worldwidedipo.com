const PRODUCTION_HOST = 'worldwidedipo.com';

export function getProductionBaseUrl() {
  const configured =
    process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (!configured) {
    return `https://${PRODUCTION_HOST}`;
  }

  return configured.replace(/\/+$/, '');
}

export function isProductionDomain() {
  try {
    const url = new URL(getProductionBaseUrl());

    return (
      url.protocol === 'https:' &&
      url.hostname === PRODUCTION_HOST
    );
  } catch {
    return false;
  }
}

export function getCanonicalUrl(pathname = '/') {
  const base = getProductionBaseUrl();

  const path = pathname.startsWith('/')
    ? pathname
    : `/${pathname}`;

  return `${base}${path}`;
}

export function getProductionRobots() {
  if (!isProductionDomain()) {
    return {
      index: false,
      follow: false,
    };
  }

  return {
    index: true,
    follow: true,
  };
}