import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Worldwide DIPO — Sitemap Utilities
 *
 * Purpose:
 * - Build a clean, crawlable public URL inventory.
 * - Include only genuinely public profile pages.
 * - Exclude expired/private/incomplete profiles.
 * - Keep sitemap generation server-only.
 * - Avoid leaking owner IDs, private fields, payment data, etc.
 * - Keep the implementation safe as the number of profiles grows.
 *
 * IMPORTANT:
 * A sitemap helps search engines discover URLs.
 * It does not guarantee indexing, ranking, AI visibility,
 * rich results, or search position.
 */

const DEFAULT_BASE_URL = 'https://worldwidedipo.com';

const PROFILE_PAGE_PREFIX = '/p/';

const PAGE_SIZE = 1000;

/**
 * Public static routes.
 *
 * These routes are intentionally limited to pages that are useful
 * for public discovery. Private application routes must NEVER enter
 * this list.
 */
export const PUBLIC_STATIC_ROUTES = [
  '/',
  '/about',
  '/explore',
  '/pricing',
  '/faq',
  '/support',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies',
  '/refund',
];

/**
 * Keep sitemap output deterministic.
 */
const STATIC_ROUTE_SET = new Set(PUBLIC_STATIC_ROUTES);

/**
 * Normalize the configured site URL.
 *
 * We deliberately keep this strict:
 * - HTTPS only
 * - worldwidedipo.com only in production
 * - no trailing slash
 * - no query/hash
 */
export function getSitemapBaseUrl() {
  const configured =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    DEFAULT_BASE_URL;

  try {
    const url = new URL(configured);

    if (url.protocol !== 'https:') {
      return DEFAULT_BASE_URL;
    }

    /**
     * Prevent accidental sitemap generation for another host.
     *
     * This protects canonical/public discovery signals from being
     * accidentally generated against staging or an untrusted host.
     */
    if (url.hostname !== 'worldwidedipo.com') {
      return DEFAULT_BASE_URL;
    }

    return url.origin;
  } catch {
    return DEFAULT_BASE_URL;
  }
}

/**
 * Convert a route into an absolute canonical sitemap URL.
 */
export function toSitemapUrl(pathname) {
  const baseUrl = getSitemapBaseUrl();

  const path =
    typeof pathname === 'string' && pathname.startsWith('/')
      ? pathname
      : `/${pathname || ''}`;

  return `${baseUrl}${path}`;
}

/**
 * Normalize and validate a public DIPO slug.
 *
 * The public profile route is:
 *   /p/[slug]
 *
 * We intentionally keep validation conservative so that malformed
 * database values do not generate broken sitemap URLs.
 */
export function normalizePublicSlug(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const slug = value.trim().toLowerCase();

  if (!slug) {
    return null;
  }

  /**
   * DIPO slugs should be URL-friendly.
   *
   * Allow:
   * - lowercase letters
   * - numbers
   * - hyphens
   * - underscores
   *
   * Prevent:
   * - spaces
   * - slashes
   * - query strings
   * - fragments
   * - encoded path traversal
   */
  if (!/^[a-z0-9_-]+$/.test(slug)) {
    return null;
  }

  /**
   * Keep the URL bounded even if a corrupted database value
   * somehow makes it into the sitemap query.
   */
  if (slug.length > 80) {
    return null;
  }

  return slug;
}

/**
 * Build a public profile sitemap URL.
 */
export function getProfileSitemapUrl(slug) {
  const normalizedSlug = normalizePublicSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  return toSitemapUrl(
    `${PROFILE_PAGE_PREFIX}${encodeURIComponent(normalizedSlug)}`
  );
}

/**
 * Convert a database timestamp into a valid Date.
 *
 * Sitemap consumers expect a real date.
 * Bad timestamps are simply omitted instead of generating
 * invalid sitemap metadata.
 */
export function normalizeLastModified(value) {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date
    ? value
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

/**
 * Safely normalize a public image URL.
 *
 * Profile images may live on Supabase Storage or another HTTPS
 * public asset host.
 *
 * We only expose an image URL if it is:
 * - absolute
 * - HTTPS
 */
export function normalizePublicImageUrl(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const raw = value.trim();

  if (!raw) {
    return null;
  }

  try {
    const url = new URL(raw);

    if (url.protocol !== 'https:') {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Build sitemap entries for static public pages.
 *
 * Static pages intentionally do not receive a fake `lastModified`
 * timestamp on every request. A changing timestamp on every sitemap
 * request would incorrectly suggest that the page content changed.
 */
export function getStaticSitemapEntries() {
  return PUBLIC_STATIC_ROUTES.map((pathname) => ({
    url: toSitemapUrl(pathname),
  }));
}

/**
 * Determine whether a profile is publicly eligible.
 *
 * This mirrors the application's public-profile concept:
 *
 * status = active
 * AND
 * expires_at is still in the future
 *
 * A profile that is merely marked active but already expired must
 * not remain discoverable through the sitemap.
 */
export function isPublicProfile(profile, now = Date.now()) {
  if (!profile || typeof profile !== 'object') {
    return false;
  }

  if (profile.status !== 'active') {
    return false;
  }

  const slug = normalizePublicSlug(profile.slug);

  if (!slug) {
    return false;
  }

  if (!profile.expires_at) {
    return false;
  }

  const expiresAt = new Date(profile.expires_at).getTime();

  if (!Number.isFinite(expiresAt)) {
    return false;
  }

  return expiresAt > now;
}

/**
 * Convert a profile database row into a sitemap entry.
 *
 * Keep this projection intentionally small.
 *
 * Never put private profile/payment/admin fields into the sitemap.
 */
export function buildProfileSitemapEntry(profile) {
  if (!isPublicProfile(profile)) {
    return null;
  }

  const url = getProfileSitemapUrl(profile.slug);

  if (!url) {
    return null;
  }

  const entry = {
    url,
  };

  const lastModified = normalizeLastModified(
    profile.updated_at
  );

  if (lastModified) {
    entry.lastModified = lastModified;
  }

  const imageUrl = normalizePublicImageUrl(
    profile.avatar_url
  );

  if (imageUrl) {
    /**
     * Next.js MetadataRoute.Sitemap supports image URLs.
     *
     * This gives search engines an additional discovery signal
     * for public profile imagery.
     */
    entry.images = [imageUrl];
  }

  return entry;
}

/**
 * Fetch all currently public profiles.
 *
 * Important:
 * - Uses the existing secure server-side admin client.
 * - Never uses the browser/anon client.
 * - Never returns private profile columns.
 * - Paginates to avoid a single huge database response.
 * - Filters expiry at the database layer as well as in JS.
 */
export async function getPublicProfileSitemapEntries() {
  const supabase = createAdminClient();

  const entries = [];
  const seenUrls = new Set();

  /**
   * Capture the current instant once so every page in the same
   * sitemap generation uses the same expiry boundary.
   */
  const now = new Date();
  const nowIso = now.toISOString();
  const nowMs = now.getTime();

  for (
    let from = 0;
    ;
    from += PAGE_SIZE
  ) {
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'slug, status, expires_at, updated_at, avatar_url, id'
      )
      .eq('status', 'active')
      .gt('expires_at', nowIso)
      .not('slug', 'is', null)
      .order('id', {
        ascending: true,
      })
      .range(from, to);

    if (error) {
      throw new Error(
        `Sitemap profile query failed: ${error.message}`
      );
    }

    if (!Array.isArray(data) || data.length === 0) {
      break;
    }

    for (const profile of data) {
      /**
       * Re-check eligibility locally.
       *
       * This protects against:
       * - malformed data
       * - invalid timestamps
       * - future query changes
       * - boundary conditions around expiry
       */
      if (!isPublicProfile(profile, nowMs)) {
        continue;
      }

      const entry = buildProfileSitemapEntry(profile);

      if (!entry?.url) {
        continue;
      }

      /**
       * Defensive deduplication.
       *
       * A sitemap should never contain the same public URL multiple
       * times even if database data becomes inconsistent.
       */
      if (seenUrls.has(entry.url)) {
        continue;
      }

      seenUrls.add(entry.url);
      entries.push(entry);
    }

    /**
     * If fewer than PAGE_SIZE rows came back, this was the final
     * database page.
     */
    if (data.length < PAGE_SIZE) {
      break;
    }
  }

  return entries;
}

/**
 * Return the complete public sitemap.
 *
 * This is the primary function consumed by app/sitemap.js.
 */
export async function buildPublicSitemap() {
  const staticEntries = getStaticSitemapEntries();

  const profileEntries =
    await getPublicProfileSitemapEntries();

  /**
   * Final defensive dedupe across both static and dynamic URLs.
   */
  const result = [];
  const seen = new Set();

  for (const entry of [
    ...staticEntries,
    ...profileEntries,
  ]) {
    if (!entry?.url || seen.has(entry.url)) {
      continue;
    }

    seen.add(entry.url);
    result.push(entry);
  }

  return result;
}

/**
 * Default export for convenient server-side usage.
 */
export default buildPublicSitemap;