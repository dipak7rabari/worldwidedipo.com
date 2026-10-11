import { createClient } from '@/lib/supabase/server';
import {
  getAllDemoProfiles,
  filterDemoProfiles,
} from './demo-profiles';

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 60;
const MAX_QUERY_LENGTH = 80;
const MAX_CATEGORY_LENGTH = 60;
const MAX_OFFSET = 100000;

const PUBLIC_PROFILE_FIELDS = [
  'name',
  'slug',
  'profession',
  'headline',
  'bio',
  'avatar_url',
  'location',
  'category',
  'updated_at',
  'plan',
];

const EMPTY_RESULT = {
  profiles: [],
  demoProfiles: [],
  pagination: {
    limit: DEFAULT_LIMIT,
    offset: 0,
    returned: 0,
    hasMore: false,
  },
};

/**
 * Normalize a public text filter.
 * Keeps user-controlled values small and predictable.
 */
function normalizeFilter(value, maxLength) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

  return normalized || null;
}

/**
 * Normalize pagination integers.
 */
function normalizeInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value ?? ''), 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}

/**
 * Keep only the public fields allowed by Explore.
 *
 * IMPORTANT:
 * Never expose:
 * - owner_id
 * - phone
 * - whatsapp
 * - private links
 * - payment information
 * - admin fields
 * - internal status
 * - audit information
 */
function normalizePublicProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    return null;
  }

  const normalized = {};

  for (const field of PUBLIC_PROFILE_FIELDS) {
    normalized[field] = profile[field] ?? null;
  }

  normalized.is_demo = Boolean(profile.is_demo);
  normalized.demo_label = profile.is_demo
    ? profile.demo_label || '✦ DIPO Demo'
    : null;

  normalized.demo_notice = profile.is_demo
    ? profile.demo_notice ||
      'Demo showcase profile — not an official Worldwide DIPO profile.'
    : null;

  /**
   * is_owner is calculated server-side.
   *
   * owner_id is NEVER returned to the browser.
   */
  normalized.is_owner = Boolean(profile.is_owner);

  return normalized;
}

/**
 * Normalize demo profiles so they follow the same public
 * response structure as real Explore profiles.
 */
function normalizeDemoProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    return null;
  }

  return {
    name: profile.name || null,
    slug: profile.slug || null,
    profession: profile.profession || null,
    headline: profile.headline || null,
    bio: profile.bio || null,
    avatar_url: profile.avatar_url || null,
    location: profile.location || null,
    category: profile.category || null,
    updated_at: profile.updated_at || null,

    is_demo: true,
    demo_label: profile.demo_label || '✦ DIPO Demo',
    demo_notice:
      profile.demo_notice ||
      'Demo showcase profile — not an official Worldwide DIPO profile.',

    is_owner: false,

    /**
     * Additional showcase information.
     * These are public demo-only fields and contain no account data.
     */
    since: profile.since || null,
    known_for: profile.known_for || null,
    description: profile.description || null,
    story: profile.story || null,
    tags: Array.isArray(profile.tags) ? profile.tags : [],
    status: 'demo',
  };
}

/**
 * Get the currently authenticated user's own public profile slug.
 *
 * This is intentionally done server-side.
 *
 * We do NOT expose owner_id.
 * We only use the slug to determine:
 *
 * current logged-in user
 *        ↓
 * their profile slug
 *        ↓
 * matching Explore profile
 *        ↓
 * is_owner = true
 */
async function getCurrentOwnerSlug(supabase) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('slug')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (error || !data?.slug) {
      return null;
    }

    return String(data.slug);
  } catch {
    return null;
  }
}

/**
 * Mark only the current user's own profile.
 *
 * No owner_id is returned.
 */
function attachOwnerState(profiles, currentOwnerSlug) {
  if (!Array.isArray(profiles)) {
    return [];
  }

  return profiles.map((profile) => ({
    ...profile,
    is_owner:
      Boolean(currentOwnerSlug) &&
      Boolean(profile?.slug) &&
      profile.slug === currentOwnerSlug,
  }));
}

/**
 * Fetch real active Explore profiles through the secure RPC.
 *
 * The RPC is responsible for:
 * - active status
 * - expiry validation
 * - Explore visibility
 * - search
 * - category filtering
 * - pagination
 *
 * This function never directly exposes private profile columns.
 */
async function getRealExploreProfiles({
  supabase,
  query,
  category,
  limit,
  offset,
}) {
  const { data, error } = await supabase.rpc('get_explore_profiles_v2', {
    p_query: query,
    p_category: category,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error('[Explore] RPC error:', error.message);

    return {
      profiles: [],
      error: new Error('Unable to load Explore profiles.'),
    };
  }

  const profiles = Array.isArray(data)
    ? data
        .map(normalizePublicProfile)
        .filter(Boolean)
        .map((profile) => ({
          ...profile,
          is_demo: false,
          demo_label: null,
          demo_notice: null,
        }))
    : [];

  return {
    profiles,
    error: null,
  };
}

/**
 * Get Worldwide DIPO Explore data.
 *
 * Architecture:
 *
 *                  Explore
 *                     │
 *          ┌──────────┴──────────┐
 *          │                     │
 *     DIPO DEMOS             REAL DIPOs
 *      local data             Supabase RPC
 *          │                     │
 *          └──────────┬──────────┘
 *                     │
 *              Safe public data
 *                     │
 *                  Browser
 *
 * Demo profiles are NOT stored as real users.
 * They are clearly marked as demo showcase profiles.
 */
export async function getExploreProfiles({
  query = null,
  category = null,
  limit = DEFAULT_LIMIT,
  offset = 0,
} = {}) {
  const safeQuery = normalizeFilter(query, MAX_QUERY_LENGTH);
  const safeCategory = normalizeFilter(category, MAX_CATEGORY_LENGTH);

  const safeLimit = normalizeInteger(
    limit,
    DEFAULT_LIMIT,
    1,
    MAX_LIMIT
  );

  const safeOffset = normalizeInteger(
    offset,
    0,
    0,
    MAX_OFFSET
  );

  try {
    const supabase = await createClient();

    /**
     * Get current user's identity only on the server.
     */
    const currentOwnerSlug = await getCurrentOwnerSlug(supabase);

    /**
     * -----------------------------------------
     * 1. DEMO PROFILES
     * -----------------------------------------
     *
     * Demo profiles are always public showcase data.
     *
     * They are filtered separately so pagination of
     * real users is never corrupted by demo cards.
     */
    let demoProfiles = getAllDemoProfiles();

    if (safeQuery || safeCategory) {
      demoProfiles = filterDemoProfiles(demoProfiles, {
        query: safeQuery,
        category: safeCategory,
      });
    }

    demoProfiles = demoProfiles
      .map(normalizeDemoProfile)
      .filter(Boolean);

    /**
     * -----------------------------------------
     * 2. REAL WORLDWIDE DIPO PROFILES
     * -----------------------------------------
     */
    const realResult = await getRealExploreProfiles({
      supabase,
      query: safeQuery,
      category: safeCategory,
      limit: safeLimit,
      offset: safeOffset,
    });

    if (realResult.error) {
      /**
       * Demo content can still render even if the database
       * is temporarily unavailable.
       */
      return {
        profiles: [],
        demoProfiles,
        pagination: {
          limit: safeLimit,
          offset: safeOffset,
          returned: 0,
          hasMore: false,
        },
        error: realResult.error,
      };
    }

    const realProfiles = attachOwnerState(
      realResult.profiles,
      currentOwnerSlug
    );

    /**
     * RPC returns up to `safeLimit`.
     *
     * If it returns exactly the requested limit,
     * there may be another page.
     *
     * The next request decides whether more records exist.
     */
    const hasMore = realProfiles.length === safeLimit;

    return {
      /**
       * `profiles` = REAL Worldwide DIPO profiles only.
       */
      profiles: realProfiles,

      /**
       * `demoProfiles` = showcase/demo profiles.
       */
      demoProfiles,

      pagination: {
        limit: safeLimit,
        offset: safeOffset,
        returned: realProfiles.length,
        hasMore,
      },

      error: null,
    };
  } catch (error) {
    console.error('[Explore] Unexpected error:', error);

    return {
      profiles: [],
      demoProfiles: [],
      pagination: {
        limit: safeLimit,
        offset: safeOffset,
        returned: 0,
        hasMore: false,
      },
      error: new Error('Unable to load Explore profiles.'),
    };
  }
}

/**
 * First Explore page.
 *
 * Useful for:
 * - Server rendering
 * - Initial page load
 * - SEO-friendly Explore shell
 */
export async function getInitialExploreProfiles({
  query = null,
  category = null,
} = {}) {
  return getExploreProfiles({
    query,
    category,
    limit: DEFAULT_LIMIT,
    offset: 0,
  });
}

/**
 * Search Explore.
 */
export async function searchExploreProfiles({
  query,
  category = null,
  limit = DEFAULT_LIMIT,
  offset = 0,
} = {}) {
  return getExploreProfiles({
    query,
    category,
    limit,
    offset,
  });
}

/**
 * Category Explore.
 */
export async function getExploreProfilesByCategory({
  category,
  query = null,
  limit = DEFAULT_LIMIT,
  offset = 0,
} = {}) {
  return getExploreProfiles({
    query,
    category,
    limit,
    offset,
  });
}

/**
 * Small helper for API routes and server components.
 */
export function getExplorePagination({
  limit = DEFAULT_LIMIT,
  offset = 0,
  returned = 0,
} = {}) {
  const safeLimit = normalizeInteger(
    limit,
    DEFAULT_LIMIT,
    1,
    MAX_LIMIT
  );

  const safeOffset = normalizeInteger(
    offset,
    0,
    0,
    MAX_OFFSET
  );

  const safeReturned = normalizeInteger(
    returned,
    0,
    0,
    safeLimit
  );

  return {
    limit: safeLimit,
    offset: safeOffset,
    returned: safeReturned,
    hasMore: safeReturned === safeLimit,
  };
}

export {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  normalizeFilter,
  normalizeInteger,
  normalizePublicProfile,
  normalizeDemoProfile,
};