import { getProfileCanonicalUrl } from './canonical';

const SITE_NAME = 'Worldwide DIPO';

function truncateDescription(value, maxLength = 160) {
  if (!value) {
    return '';
  }

  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

export function buildProfileMetadata(profile) {
  if (!profile) {
    return {
      title: SITE_NAME,
      description: 'Personal Digital Identity Page by Worldwide DIPO.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = getProfileCanonicalUrl(profile.slug);
  const name = profile.name?.trim() || 'Worldwide DIPO Profile';
  const profession = profile.profession?.trim();

  const title = profession
    ? `${name} - ${profession} | ${SITE_NAME}`
    : `${name} | ${SITE_NAME}`;

  const description = truncateDescription(
    profile.bio ||
      profile.headline ||
      `${name} - Personal Digital Identity Page on Worldwide DIPO.`
  );

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'profile',
      ...(profile.avatar_url
        ? {
            images: [
              {
                url: profile.avatar_url,
                alt: `${name} profile image`,
              },
            ],
          }
        : {}),
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export function buildExpiredProfileMetadata() {
  return {
    title: `Profile Unavailable | ${SITE_NAME}`,
    description:
      'This Worldwide DIPO profile is currently unavailable.',

    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}