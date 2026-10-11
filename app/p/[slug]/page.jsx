import { notFound } from 'next/navigation';

import PublicProfile from '@/components/public-profile/PublicProfile';
import ExpiredProfile from '@/components/public-profile/ExpiredProfile';

import {
  getPublicProfile,
} from '@/lib/profile/get-public-profile';

import {
  getMyProfile,
} from '@/lib/profile/get-my-profile';

import {
  buildProfileMetadata,
} from '@/lib/seo/metadata';

import {
  buildProfileJsonLd,
} from '@/lib/seo/profile-schema';

import {
  safeJsonLd,
} from '@/lib/seo/json-ld';

import {
  getProfileCanonicalUrl,
} from '@/lib/seo/canonical';

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const SITE_NAME = 'Worldwide DIPO';

const DEFAULT_DESCRIPTION =
  'Personal Digital Identity Page on Worldwide DIPO.';

const MAX_DESCRIPTION_LENGTH = 160;

const MAX_KEYWORDS = 30;

const MAX_SAME_AS = 20;

/* -------------------------------------------------------------------------- */
/* Small, defensive SEO helpers                                               */
/* -------------------------------------------------------------------------- */

/**
 * Safely convert a value to a trimmed string.
 */
function cleanString(
  value,
  maxLength = 500,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  return String(value)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Create a compact SEO description without cutting a word whenever possible.
 */
function createDescription(
  value,
  fallback = DEFAULT_DESCRIPTION,
) {
  const source =
    cleanString(value, 600) ||
    cleanString(fallback, 600);

  if (
    source.length <=
    MAX_DESCRIPTION_LENGTH
  ) {
    return source;
  }

  const shortened =
    source
      .slice(
        0,
        MAX_DESCRIPTION_LENGTH - 1,
      )
      .trim();

  const lastSpace =
    shortened.lastIndexOf(' ');

  if (lastSpace > 100) {
    return `${shortened.slice(
      0,
      lastSpace,
    )}…`;
  }

  return `${shortened}…`;
}

/**
 * Return a safe absolute HTTPS URL.
 *
 * Structured data must never receive arbitrary javascript:, data:, file:,
 * relative, or malformed URLs from profile content.
 */
function safeHttpsUrl(
  value,
) {
  const raw =
    cleanString(value, 2000);

  if (!raw) {
    return null;
  }

  try {
    const url = new URL(raw);

    if (
      url.protocol !== 'https:'
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Extract URLs from the profile's flexible link structures.
 *
 * Current Worldwide DIPO profiles may contain object-shaped link data.
 * This helper deliberately supports common nested structures too without
 * assuming a future schema.
 */
function collectProfileUrls(
  value,
  output = [],
) {
  if (
    value === null ||
    value === undefined
  ) {
    return output;
  }

  if (
    typeof value === 'string'
  ) {
    const url =
      safeHttpsUrl(value);

    if (
      url &&
      !output.includes(url)
    ) {
      output.push(url);
    }

    return output;
  }

  if (
    Array.isArray(value)
  ) {
    for (
      const item of value
    ) {
      if (
        output.length >=
        MAX_SAME_AS
      ) {
        break;
      }

      collectProfileUrls(
        item,
        output,
      );
    }

    return output;
  }

  if (
    typeof value === 'object'
  ) {
    for (
      const item of Object.values(value)
    ) {
      if (
        output.length >=
        MAX_SAME_AS
      ) {
        break;
      }

      collectProfileUrls(
        item,
        output,
      );
    }
  }

  return output;
}

/**
 * Extract meaningful keyword candidates from a public profile.
 *
 * These are descriptive metadata signals only. They are not a ranking
 * guarantee and are intentionally kept conservative.
 */
function buildProfileKeywords(
  profile,
) {
  if (!profile) {
    return [];
  }

  const candidates = [
    profile.name,
    profile.profession,
    profile.headline,
    profile.category,
    profile.location,
  ];

  if (
    Array.isArray(profile.skills)
  ) {
    for (
      const skill of profile.skills
    ) {
      if (
        typeof skill === 'string'
      ) {
        candidates.push(skill);
      } else if (
        skill &&
        typeof skill === 'object'
      ) {
        candidates.push(
          skill.name,
          skill.title,
          skill.label,
        );
      }
    }
  }

  const seen =
    new Set();

  const keywords = [];

  for (
    const candidate of candidates
  ) {
    const value =
      cleanString(
        candidate,
        100,
      );

    if (!value) {
      continue;
    }

    const key =
      value.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    keywords.push(value);

    if (
      keywords.length >=
      MAX_KEYWORDS
    ) {
      break;
    }
  }

  return keywords;
}

/**
 * Build a robust title for metadata and structured data.
 *
 * Existing buildProfileMetadata remains the primary metadata helper.
 * This is only used to enrich fields that the current helper does not
 * explicitly provide.
 */
function buildProfileSeoTitle(
  profile,
) {
  const name =
    cleanString(
      profile?.name,
      120,
    );

  const profession =
    cleanString(
      profile?.profession,
      120,
    );

  if (
    name &&
    profession
  ) {
    return `${name} - ${profession} | ${SITE_NAME}`;
  }

  if (name) {
    return `${name} | ${SITE_NAME}`;
  }

  return SITE_NAME;
}

/**
 * Return a stable ISO timestamp if available.
 */
function safeIsoDate(
  value,
) {
  if (!value) {
    return null;
  }

  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp)
  ) {
    return null;
  }

  return new Date(
    timestamp,
  ).toISOString();
}

/* -------------------------------------------------------------------------- */
/* Structured data                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Build a rich schema graph for one public DIPO.
 *
 * Existing buildProfileJsonLd() remains the source of the Person schema.
 * We enrich it with:
 *
 * - ProfilePage
 * - WebPage
 * - BreadcrumbList
 * - WebSite relationship
 *
 * This creates a clearer machine-readable relationship:
 *
 * Worldwide DIPO
 *      ↓
 * public profile page
 *      ↓
 * person / professional identity
 */
function buildPublicProfileSchemaGraph(
  profile,
) {
  if (!profile) {
    return null;
  }

  const canonical =
    getProfileCanonicalUrl(
      profile.slug,
    );

  const name =
    cleanString(
      profile.name,
      120,
    );

  if (!name) {
    return null;
  }

  const profession =
    cleanString(
      profile.profession,
      120,
    );

  const headline =
    cleanString(
      profile.headline,
      180,
    );

  const bio =
    cleanString(
      profile.bio,
      600,
    );

  const description =
    createDescription(
      headline ||
        bio ||
        `${name} on ${SITE_NAME}.`,
    );

  const location =
    cleanString(
      profile.location,
      160,
    );

  const category =
    cleanString(
      profile.category,
      120,
    );

  const createdAt =
    safeIsoDate(
      profile.created_at,
    );

  const updatedAt =
    safeIsoDate(
      profile.updated_at,
    );

  /*
   * Keep the existing Person schema implementation.
   *
   * It already validates profile URLs and social links.
   */
  const personSchema =
    buildProfileJsonLd(
      profile,
    );

  /*
   * buildProfileJsonLd() can intentionally return null when the current
   * profile does not contain enough information for its Person schema.
   *
   * We therefore create a conservative fallback Person entity rather
   * than failing the entire page's structured data.
   */
  const person =
    personSchema ||
    {
      '@type': 'Person',
      name,
      url: canonical,
    };

  /*
   * Make the Person entity explicitly identifiable inside the graph.
   */
  person['@id'] =
    `${canonical}#person`;

  person.url =
    canonical;

  if (
    profession &&
    !person.jobTitle
  ) {
    person.jobTitle =
      profession;
  }

  if (
    description &&
    !person.description
  ) {
    person.description =
      description;
  }

  if (
    location &&
    !person.address
  ) {
    person.address = {
      '@type':
        'PostalAddress',
      addressLocality:
        location,
    };
  }

  /*
   * Collect external profile URLs for sameAs.
   *
   * Only absolute HTTPS URLs are allowed.
   */
  const sameAs = [];

  collectProfileUrls(
    profile.social_links,
    sameAs,
  );

  collectProfileUrls(
    profile.links,
    sameAs,
  );

  if (
    sameAs.length > 0
  ) {
    person.sameAs =
      Array.from(
        new Set([
          ...(Array.isArray(
            person.sameAs,
          )
            ? person.sameAs
            : []),
          ...sameAs,
        ]),
      ).slice(
        0,
        MAX_SAME_AS,
      );
  }

  const websiteId =
    `${canonical}#website`;

  const webpageId =
    `${canonical}#webpage`;

  const breadcrumbId =
    `${canonical}#breadcrumb`;

  const graph = [];

  /*
   * Person
   */
  graph.push(
    person,
  );

  /*
   * ProfilePage
   *
   * This is particularly useful because this URL represents an individual
   * identity/profile rather than a generic marketing page.
   */
  const profilePage = {
    '@type':
      'ProfilePage',

    '@id':
      webpageId,

    url:
      canonical,

    name:
      buildProfileSeoTitle(
        profile,
      ),

    description,

    isPartOf: {
      '@id':
        websiteId,
    },

    mainEntity: {
      '@id':
        `${canonical}#person`,
    },
  };

  if (createdAt) {
    profilePage.dateCreated =
      createdAt;
  }

  if (updatedAt) {
    profilePage.dateModified =
      updatedAt;
  }

  graph.push(
    profilePage,
  );

  /*
   * WebPage
   *
   * ProfilePage is already a specialized WebPage type. We intentionally
   * keep the graph simple and do not create a duplicate competing page
   * entity. The ProfilePage itself carries the webpage identity.
   */

  /*
   * WebSite relationship
   *
   * Keep this minimal and factual. No fake aggregate ratings, search
   * actions, verification claims, or other unsupported properties.
   */
  graph.push({
    '@type':
      'WebSite',

    '@id':
      websiteId,

    name:
      SITE_NAME,

    url:
      getProfileCanonicalUrl(
        '',
      ).replace(
        /\/p\/$/,
        '/',
      ),
  });

  /*
   * BreadcrumbList
   *
   * Gives crawlers a simple hierarchy:
   *
   * Worldwide DIPO
   *   → Profile
   *   → Person
   */
  graph.push({
    '@type':
      'BreadcrumbList',

    '@id':
      breadcrumbId,

    itemListElement: [
      {
        '@type':
          'ListItem',

        position: 1,

        name:
          SITE_NAME,

        item:
          getProfileCanonicalUrl(
            '',
          ).replace(
            /\/p\/$/,
            '/',
          ),
      },

      {
        '@type':
          'ListItem',

        position: 2,

        name:
          name,

        item:
          canonical,
      },
    ],
  });

  /*
   * Add descriptive fields to ProfilePage where available.
   */
  if (
    profession
  ) {
    profilePage.about = {
      '@id':
        `${canonical}#person`,
    };
  }

  if (
    category
  ) {
    profilePage.keywords =
      category;
  }

  return {
    '@context':
      'https://schema.org',

    '@graph':
      graph,
  };
}

/* -------------------------------------------------------------------------- */
/* Next.js route configuration                                                */
/* -------------------------------------------------------------------------- */

/**
 * Public DIPO pages are generated dynamically because profiles are stored
 * in Supabase and can change independently of a deployment.
 */
export const dynamic =
  'force-dynamic';

/**
 * Do not allow stale profile HTML/metadata to remain cached indefinitely.
 *
 * The public profile data itself is controlled by the existing Supabase
 * projection/lifecycle system.
 */
export const revalidate =
  0;

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}) {
  const resolvedParams =
    await params;

  const slug =
    typeof resolvedParams?.slug ===
    'string'
      ? resolvedParams.slug.trim()
      : '';

  if (!slug) {
    return {
      title:
        `Profile Not Found | ${SITE_NAME}`,

      description:
        'The requested Worldwide DIPO profile could not be found.',

      robots: {
        index: false,
        follow: false,
      },

      googleBot: {
        index: false,
        follow: false,
      },
    };
  }

  const result =
    await getPublicProfile(
      slug,
    );

  if (
    !result ||
    !result.profile
  ) {
    return {
      title:
        `Profile Not Found | ${SITE_NAME}`,

      description:
        'The requested Worldwide DIPO profile could not be found.',

      robots: {
        index: false,
        follow: false,
      },

      googleBot: {
        index: false,
        follow: false,
      },
    };
  }

  const profile =
    result.profile;

  /*
   * Existing metadata builder remains the primary source so this page
   * stays compatible with the project's SEO architecture.
   */
  const baseMetadata =
    buildProfileMetadata(
      profile,
    );

  const canonical =
    getProfileCanonicalUrl(
      profile.slug,
    );

  const title =
    buildProfileSeoTitle(
      profile,
    );

  const description =
    createDescription(
      profile.bio ||
        profile.headline ||
        `${cleanString(
          profile.name,
          120,
        )} - Personal Digital Identity Page on ${SITE_NAME}.`,
    );

  const keywords =
    buildProfileKeywords(
      profile,
    );

  const avatarUrl =
    safeHttpsUrl(
      profile.avatar_url,
    );

  const metadata = {
    ...baseMetadata,

    title,

    description,

    alternates: {
      ...(baseMetadata?.alternates || {}),
      canonical,
    },

    keywords:
      keywords.length > 0
        ? keywords
        : undefined,

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        'max-image-preview':
          'large',
        'max-snippet':
          -1,
        'max-video-preview':
          -1,
      },
    },

    openGraph: {
      ...(baseMetadata?.openGraph || {}),

      title,

      description,

      url: canonical,

      siteName:
        SITE_NAME,

      type:
        'profile',

      locale:
        'en_IN',

      ...(avatarUrl
        ? {
            images: [
              {
                url:
                  avatarUrl,

                width:
                  1200,

                height:
                  1200,

                alt:
                  `${cleanString(
                    profile.name,
                    120,
                  )} - ${cleanString(
                    profile.profession,
                    120,
                  ) || 'Worldwide DIPO profile'}`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card:
        avatarUrl
          ? 'summary_large_image'
          : 'summary',

      title,

      description,

      ...(avatarUrl
        ? {
            images: [
              avatarUrl,
            ],
          }
        : {}),
    },

    other: {
      ...(baseMetadata?.other || {}),

      'profile:username':
        cleanString(
          profile.slug,
          120,
        ),

      'profile:first_name':
        cleanString(
          profile.name,
          120,
        ),
    },
  };

  return metadata;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function PublicProfilePage({
  params,
}) {
  const resolvedParams =
    await params;

  const slug =
    typeof resolvedParams?.slug ===
    'string'
      ? resolvedParams.slug.trim()
      : '';

  /*
   * Invalid route parameters should never reach the public profile query.
   */
  if (!slug) {
    notFound();
  }

  /*
   * Secure public profile projection.
   *
   * The underlying getPublicProfile() function is responsible for the
   * public-data boundary. We never query private profile columns here.
   */
  const result =
    await getPublicProfile(
      slug,
    );

  if (
    !result ||
    !result.profile
  ) {
    notFound();
  }

  const profile =
    result.profile;

  /*
   * Expired profiles remain handled by the existing lifecycle/grace
   * experience.
   *
   * They are deliberately not rendered as active public identities.
   */
  if (
    profile.status ===
    'expired'
  ) {
    return (
      <ExpiredProfile
        profile={profile}
      />
    );
  }

  /*
   * Only active profiles are public.
   *
   * This is intentionally kept in the route as a second defense layer
   * even though getPublicProfile() already uses the public projection.
   */
  if (
    profile.status !==
    'active'
  ) {
    notFound();
  }

  /*
   * OWNER DETECTION
   *
   * IMPORTANT:
   *
   * The public profile projection does not expose owner_id.
   *
   * Therefore we use the authenticated user's own profile lookup and
   * compare the returned profile ID.
   *
   * Only the boolean is passed to the public UI.
   *
   * This preserves the product rule:
   *
   * Owner:
   *   can see owner-only controls.
   *
   * Everyone else:
   *   can only view the public DIPO.
   *
   * Server-side ownership/security remains enforced by Supabase/RLS and
   * the dashboard APIs. This boolean is not treated as authorization.
   */
  let isOwner = false;

  try {
    const {
      user,
      profile:
        ownedProfile,
    } = await getMyProfile();

    isOwner = Boolean(
      user &&
        ownedProfile &&
        ownedProfile.id ===
          profile.id,
    );
  } catch (error) {
    /*
     * Owner detection is an enhancement to the public page, not a reason
     * to make a public profile unavailable.
     *
     * Fail closed:
     *   isOwner = false
     */
    console.error(
      '[PublicProfilePage] Owner detection failed:',
      error?.message ||
        error,
    );

    isOwner = false;
  }

  /*
   * Build machine-readable identity data only after the profile has passed
   * the public lifecycle checks above.
   *
   * This prevents expired/non-public identities from accidentally emitting
   * active-profile structured data.
   */
  const jsonLd =
    buildPublicProfileSchemaGraph(
      profile,
    );

  return (
    <>
      <PublicProfile
        profile={profile}
        isOwner={isOwner}
      />

      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              safeJsonLd(
                jsonLd,
              ),
          }}
        />
      ) : null}
    </>
  );
}