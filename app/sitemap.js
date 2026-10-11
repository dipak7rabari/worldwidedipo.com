import 'server-only';

import buildPublicSitemap from '@/lib/seo/sitemap-utils';

/**
 * Worldwide DIPO — Public Sitemap
 *
 * This file intentionally exposes only:
 * - public marketing pages
 * - public, active, non-expired DIPO profiles
 *
 * Never add:
 * - /dashboard/*
 * - /admin/*
 * - /auth/*
 * - /api/*
 * - onboarding/private flows
 * - payment/private flows
 * - internal security pages
 *
 * Sitemap purpose:
 * Help search engines discover the URLs that Worldwide DIPO
 * actually wants publicly crawled.
 *
 * It does NOT guarantee:
 * - indexing
 * - ranking
 * - Google placement
 * - AI citation
 * - Knowledge Panel
 * - rich-result eligibility
 */

export const dynamic = 'force-dynamic';

export const revalidate = 0;

/**
 * Next.js MetadataRoute.Sitemap entrypoint.
 *
 * The sitemap is generated from the current public database state
 * so newly activated profiles can become discoverable without
 * requiring a manual sitemap file update.
 */
export default async function sitemap() {
  return buildPublicSitemap();
}