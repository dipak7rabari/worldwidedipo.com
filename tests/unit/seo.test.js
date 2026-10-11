import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import {
  getBaseUrl,
  getProfileCanonicalUrl,
} from '@/lib/seo/canonical';

import {
  safeJsonLd,
} from '@/lib/seo/json-ld';

import {
  buildProfileMetadata,
  buildExpiredProfileMetadata,
} from '@/lib/seo/metadata';

import {
  buildProfileSchema,
  buildProfileJsonLd,
} from '@/lib/seo/profile-schema';

import {
  getProductionBaseUrl,
  isProductionDomain,
  getCanonicalUrl,
  getProductionRobots,
} from '@/lib/seo/production-seo';

describe('SEO utilities', () => {
  const originalBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  afterEach(() => {
    if (originalBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_BASE_URL =
        originalBaseUrl;
    }
  });

  describe('canonical URLs', () => {
    it('uses the production default base URL', () => {
      expect(getBaseUrl()).toBe(
        'https://worldwidedipo.com'
      );
    });

    it('accepts a valid HTTPS configured base URL', () => {
      process.env.NEXT_PUBLIC_BASE_URL =
        'https://example.com/';

      expect(getBaseUrl()).toBe(
        'https://example.com'
      );
    });

    it('rejects an HTTP configured base URL', () => {
      process.env.NEXT_PUBLIC_BASE_URL =
        'http://example.com';

      expect(getBaseUrl()).toBe(
        'https://worldwidedipo.com'
      );
    });

    it('falls back safely for an invalid base URL', () => {
      process.env.NEXT_PUBLIC_BASE_URL =
        'not-a-valid-url';

      expect(getBaseUrl()).toBe(
        'https://worldwidedipo.com'
      );
    });

    it('builds a profile canonical URL', () => {
      expect(
        getProfileCanonicalUrl('Rahul-Sharma')
      ).toBe(
        'https://worldwidedipo.com/p/rahul-sharma'
      );
    });

    it('normalizes profile slug casing', () => {
      expect(
        getProfileCanonicalUrl('  Rahul-Sharma  ')
      ).toBe(
        'https://worldwidedipo.com/p/rahul-sharma'
      );
    });

    it('returns the base URL for an empty slug', () => {
      expect(
        getProfileCanonicalUrl('')
      ).toBe(
        'https://worldwidedipo.com'
      );
    });

    it('URL-encodes the profile slug', () => {
      expect(
        getProfileCanonicalUrl('hello world')
      ).toContain('/p/hello%20world');
    });
  });

  describe('safeJsonLd', () => {
    it('returns an empty string for empty data', () => {
      expect(safeJsonLd(null)).toBe('');
      expect(safeJsonLd(undefined)).toBe('');
    });

    it('serializes valid structured data', () => {
      expect(
        safeJsonLd({
          '@context': 'https://schema.org',
          name: 'Rahul',
        })
      ).toBe(
        '{"@context":"https://schema.org","name":"Rahul"}'
      );
    });

    it('escapes dangerous HTML characters', () => {
      const result = safeJsonLd({
        name: '<script>alert(1)</script>',
        html: 'a & b',
      });

      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
      expect(result).toContain('\\u003c');
      expect(result).toContain('\\u003e');
      expect(result).toContain('\\u0026');
    });
  });

  describe('profile metadata', () => {
    const profile = {
      name: 'Rahul Sharma',
      profession: 'Software Engineer',
      slug: 'rahul-sharma',
      headline: 'Building modern digital products.',
      bio: 'A software engineer building useful products.',
      avatar_url:
        'https://cdn.example.com/avatar.jpg',
    };

    it('builds profile title and description', () => {
      const metadata =
        buildProfileMetadata(profile);

      expect(metadata.title).toBe(
        'Rahul Sharma - Software Engineer | Worldwide DIPO'
      );

      expect(metadata.description).toBe(
        'A software engineer building useful products.'
      );
    });

    it('includes canonical metadata', () => {
      const metadata =
        buildProfileMetadata(profile);

      expect(
        metadata.alternates.canonical
      ).toBe(
        'https://worldwidedipo.com/p/rahul-sharma'
      );
    });

    it('includes Open Graph profile data', () => {
      const metadata =
        buildProfileMetadata(profile);

      expect(metadata.openGraph).toMatchObject({
        title: metadata.title,
        description: metadata.description,
        siteName: 'Worldwide DIPO',
        type: 'profile',
        url: 'https://worldwidedipo.com/p/rahul-sharma',
      });

      expect(
        metadata.openGraph.images[0].url
      ).toBe(profile.avatar_url);
    });

    it('allows indexing for a valid public profile', () => {
      const metadata =
        buildProfileMetadata(profile);

      expect(metadata.robots.index).toBe(true);
      expect(metadata.robots.follow).toBe(true);
      expect(
        metadata.robots.googleBot.index
      ).toBe(true);
    });

    it('returns safe metadata for a missing profile', () => {
      const metadata =
        buildProfileMetadata(null);

      expect(metadata.title).toBe(
        'Worldwide DIPO'
      );

      expect(metadata.robots).toEqual({
        index: false,
        follow: false,
      });
    });

    it('builds expired profile metadata as noindex', () => {
      const metadata =
        buildExpiredProfileMetadata();

      expect(metadata.title).toBe(
        'Profile Unavailable | Worldwide DIPO'
      );

      expect(metadata.robots.index).toBe(false);
      expect(metadata.robots.follow).toBe(false);
      expect(
        metadata.robots.googleBot.index
      ).toBe(false);
    });

    it('truncates long descriptions safely', () => {
      const metadata = buildProfileMetadata({
        ...profile,
        bio: 'A'.repeat(500),
      });

      expect(
        metadata.description.length
      ).toBeLessThanOrEqual(160);

      expect(
        metadata.description.endsWith('…')
      ).toBe(true);
    });
  });

  describe('profile schema', () => {
    it('builds a valid Person schema', () => {
      const schema = buildProfileSchema({
        name: 'Rahul Sharma',
        profession: 'Software Engineer',
        slug: 'rahul-sharma',
        headline: 'Building digital products.',
        location: 'Bengaluru',
        avatar_url:
          'https://cdn.example.com/avatar.jpg',
      });

      expect(schema).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Rahul Sharma',
        jobTitle: 'Software Engineer',
        description: 'Building digital products.',
        image:
          'https://cdn.example.com/avatar.jpg',
      });

      expect(schema.url).toBe(
        'https://worldwidedipo.com/p/rahul-sharma'
      );

      expect(schema.address).toEqual({
        '@type': 'PostalAddress',
        addressLocality: 'Bengaluru',
      });
    });

    it('returns null when required profile identity is missing', () => {
      expect(
        buildProfileSchema({
          name: 'Rahul',
          slug: 'rahul',
        })
      ).toBeNull();
    });

    it('rejects non-HTTPS avatar URLs', () => {
      const schema = buildProfileSchema({
        name: 'Rahul Sharma',
        profession: 'Developer',
        slug: 'rahul-sharma',
        avatar_url:
          'http://example.com/avatar.jpg',
      });

      expect(schema.image).toBeUndefined();
    });

    it('includes safe HTTPS social links in sameAs', () => {
      const schema = buildProfileSchema({
        name: 'Rahul Sharma',
        profession: 'Developer',
        slug: 'rahul-sharma',
        social_links: {
          instagram:
            'https://instagram.com/rahul',
          invalid:
            'javascript:alert(1)',
        },
      });

      expect(schema.sameAs).toEqual([
        'https://instagram.com/rahul',
      ]);
    });

    it('deduplicates links across social and normal links', () => {
      const url =
        'https://example.com/rahul';

      const schema = buildProfileSchema({
        name: 'Rahul Sharma',
        profession: 'Developer',
        slug: 'rahul-sharma',
        social_links: {
          website: url,
        },
        links: {
          portfolio: url,
        },
      });

      expect(schema.sameAs).toEqual([url]);
    });

    it('limits sameAs entries to twenty URLs', () => {
      const links = {};

      for (let i = 0; i < 30; i += 1) {
        links[`link${i}`] =
          `https://example.com/${i}`;
      }

      const schema = buildProfileSchema({
        name: 'Rahul Sharma',
        profession: 'Developer',
        slug: 'rahul-sharma',
        links,
      });

      expect(schema.sameAs).toHaveLength(20);
    });

    it('keeps the backward-compatible JSON-LD alias', () => {
      const profile = {
        name: 'Rahul Sharma',
        profession: 'Developer',
        slug: 'rahul-sharma',
      };

      expect(buildProfileJsonLd(profile)).toEqual(
        buildProfileSchema(profile)
      );
    });
  });

  describe('production SEO', () => {
    it('uses the production domain by default', () => {
      expect(getProductionBaseUrl()).toBe(
        'https://worldwidedipo.com'
      );
    });

    it('removes trailing slashes from configured base URLs', () => {
      process.env.NEXT_PUBLIC_BASE_URL =
        'https://example.com///';

      expect(getProductionBaseUrl()).toBe(
        'https://example.com'
      );
    });

    it('recognizes the official production domain', () => {
      process.env.NEXT_PUBLIC_BASE_URL =
        'https://worldwidedipo.com';

      expect(isProductionDomain()).toBe(true);
    });

    it('does not treat another domain as production', () => {
      process.env.NEXT_PUBLIC_BASE_URL =
        'https://example.com';

      expect(isProductionDomain()).toBe(false);
    });

    it('does not treat HTTP as the production domain', () => {
      process.env.NEXT_PUBLIC_BASE_URL =
        'http://worldwidedipo.com';

      expect(isProductionDomain()).toBe(false);
    });

    it('builds canonical URLs with leading slashes', () => {
      process.env.NEXT_PUBLIC_BASE_URL =
        'https://worldwidedipo.com';

      expect(
        getCanonicalUrl('/p/rahul')
      ).toBe(
        'https://worldwidedipo.com/p/rahul'
      );
    });

    it('normalizes canonical paths without leading slashes', () => {
      process.env.NEXT_PUBLIC_BASE_URL =
        'https://worldwidedipo.com';

      expect(
        getCanonicalUrl('p/rahul')
      ).toBe(
        'https://worldwidedipo.com/p/rahul'
      );
    });

    it('only enables production indexing on the official domain', () => {
      process.env.NEXT_PUBLIC_BASE_URL =
        'https://worldwidedipo.com';

      expect(getProductionRobots()).toEqual({
        index: true,
        follow: true,
      });

      process.env.NEXT_PUBLIC_BASE_URL =
        'https://preview.example.com';

      expect(getProductionRobots()).toEqual({
        index: false,
        follow: false,
      });
    });
  });
});