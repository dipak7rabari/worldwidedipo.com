import { describe, expect, it } from 'vitest';

import {
  slugify,
  createSuggestedSlug,
} from '@/lib/profile/slug';

describe('profile slug utilities', () => {
  describe('slugify', () => {
    it('converts normal text to a URL slug', () => {
      expect(
        slugify('Rahul Sharma')
      ).toBe('rahul-sharma');
    });

    it('lowercases the result', () => {
      expect(
        slugify('RAHUL SHARMA')
      ).toBe('rahul-sharma');
    });

    it('removes punctuation', () => {
      expect(
        slugify('Rahul Sharma!!!')
      ).toBe('rahul-sharma');
    });

    it('converts repeated separators to one hyphen', () => {
      expect(
        slugify('Rahul   Sharma---Developer')
      ).toBe('rahul-sharma-developer');
    });

    it('removes leading separators', () => {
      expect(
        slugify('---rahul')
      ).toBe('rahul');
    });

    it('removes trailing separators', () => {
      expect(
        slugify('rahul---')
      ).toBe('rahul');
    });

    it('removes diacritics', () => {
      expect(
        slugify('José García')
      ).toBe('jose-garcia');
    });

    it('supports unicode input safely', () => {
      expect(
        slugify('Café Développeur')
      ).toBe('cafe-developpeur');
    });

    it('keeps only lowercase ASCII letters, numbers and hyphens', () => {
      const result = slugify(
        'Hello @ World # 2026!'
      );

      expect(result).toBe('hello-world-2026');
      expect(result).toMatch(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      );
    });

    it('limits the slug to thirty characters', () => {
      const result = slugify(
        'this-is-a-very-long-profile-name-for-testing'
      );

      expect(result.length).toBeLessThanOrEqual(30);
    });

    it('does not leave a trailing hyphen after truncation', () => {
      const result = slugify(
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbb'
      );

      expect(result.endsWith('-')).toBe(false);
      expect(result.length).toBeLessThanOrEqual(30);
    });

    it('returns an empty string for non-string input', () => {
      expect(slugify(null)).toBe('');
      expect(slugify(undefined)).toBe('');
      expect(slugify(12345)).toBe('');
      expect(slugify({})).toBe('');
    });

    it('returns an empty string when nothing slugifiable exists', () => {
      expect(slugify('!!!@@@###')).toBe('');
      expect(slugify('---')).toBe('');
    });
  });

  describe('createSuggestedSlug', () => {
    it('creates a slug from a name', () => {
      expect(
        createSuggestedSlug('Rahul Sharma')
      ).toBe('rahul-sharma');
    });

    it('normalizes the generated slug', () => {
      expect(
        createSuggestedSlug('RAHUL   SHARMA')
      ).toBe('rahul-sharma');
    });

    it('uses profile as the safe fallback', () => {
      expect(
        createSuggestedSlug('!!!')
      ).toBe('profile');
    });

    it('uses profile for non-string input', () => {
      expect(
        createSuggestedSlug(null)
      ).toBe('profile');

      expect(
        createSuggestedSlug(undefined)
      ).toBe('profile');
    });
  });
});