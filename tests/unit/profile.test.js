import { describe, expect, it } from 'vitest';

import {
  validateName,
  validateProfession,
  validateOptionalText,
  validateSlug,
  validateCreateProfileInput,
} from '@/lib/profile/profile-validation';

describe('profile validation', () => {
  describe('validateName', () => {
    it('accepts a valid name', () => {
      expect(validateName('  Rahul Sharma  ')).toEqual({
        valid: true,
        value: 'Rahul Sharma',
      });
    });

    it('rejects names shorter than two characters', () => {
      expect(validateName('A')).toMatchObject({
        valid: false,
      });
    });

    it('accepts a two-character name', () => {
      expect(validateName('AB').valid).toBe(true);
    });

    it('accepts a name at the maximum length', () => {
      expect(
        validateName('A'.repeat(60)).valid
      ).toBe(true);
    });

    it('rejects a name above the maximum length', () => {
      expect(
        validateName('A'.repeat(61))
      ).toMatchObject({
        valid: false,
        message:
          'Name must be between 2 and 60 characters.',
      });
    });

    it('rejects non-string values', () => {
      expect(validateName(null).valid).toBe(false);
      expect(validateName(undefined).valid).toBe(false);
      expect(validateName(123).valid).toBe(false);
    });
  });

  describe('validateProfession', () => {
    it('accepts and trims a profession', () => {
      expect(
        validateProfession('  Software Engineer  ')
      ).toEqual({
        valid: true,
        value: 'Software Engineer',
      });
    });

    it('rejects a profession shorter than two characters', () => {
      expect(
        validateProfession('A').valid
      ).toBe(false);
    });

    it('accepts a profession at the maximum length', () => {
      expect(
        validateProfession('A'.repeat(60)).valid
      ).toBe(true);
    });

    it('rejects a profession above the maximum length', () => {
      expect(
        validateProfession('A'.repeat(61))
      ).toMatchObject({
        valid: false,
      });
    });
  });

  describe('validateOptionalText', () => {
    it('returns null for an empty optional value', () => {
      expect(
        validateOptionalText('', 'Bio', 250)
      ).toEqual({
        valid: true,
        value: null,
      });
    });

    it('returns null for whitespace-only text', () => {
      expect(
        validateOptionalText('   ', 'Bio', 250)
      ).toEqual({
        valid: true,
        value: null,
      });
    });

    it('trims valid text', () => {
      expect(
        validateOptionalText(
          '  Hello world  ',
          'Bio',
          250
        )
      ).toEqual({
        valid: true,
        value: 'Hello world',
      });
    });

    it('accepts text at the exact maximum length', () => {
      const value = 'A'.repeat(250);

      expect(
        validateOptionalText(value, 'Bio', 250)
      ).toEqual({
        valid: true,
        value,
      });
    });

    it('rejects text over the maximum length', () => {
      expect(
        validateOptionalText(
          'A'.repeat(251),
          'Bio',
          250
        )
      ).toMatchObject({
        valid: false,
        message: 'Bio cannot exceed 250 characters.',
      });
    });
  });

  describe('validateSlug', () => {
    it('normalizes a valid slug to lowercase', () => {
      expect(
        validateSlug('Rahul-Portfolio')
      ).toEqual({
        valid: true,
        value: 'rahul-portfolio',
      });
    });

    it('accepts lowercase alphanumeric slugs', () => {
      expect(
        validateSlug('rahul123')
      ).toEqual({
        valid: true,
        value: 'rahul123',
      });
    });

    it('accepts single hyphens between words', () => {
      expect(
        validateSlug('rahul-sharma')
      ).toEqual({
        valid: true,
        value: 'rahul-sharma',
      });
    });

    it('rejects slugs shorter than three characters', () => {
      expect(validateSlug('ab').valid).toBe(false);
    });

    it('accepts a slug at the maximum length', () => {
      expect(
        validateSlug('a'.repeat(30)).valid
      ).toBe(true);
    });

    it('rejects a slug above the maximum length', () => {
      expect(
        validateSlug('a'.repeat(31)).valid
      ).toBe(false);
    });

    it('rejects special characters', () => {
      expect(validateSlug('rahul_sharma').valid).toBe(false);
      expect(validateSlug('rahul.sharma').valid).toBe(false);
      expect(validateSlug('rahul@sharma').valid).toBe(false);
    });

    it('rejects leading hyphens', () => {
      expect(validateSlug('-rahul').valid).toBe(false);
    });

    it('rejects trailing hyphens', () => {
      expect(validateSlug('rahul-').valid).toBe(false);
    });

    it('rejects consecutive hyphens', () => {
      expect(
        validateSlug('rahul--sharma').valid
      ).toBe(false);
    });

    it.each([
      'admin',
      'api',
      'auth',
      'dashboard',
      'login',
      'signup',
      'register',
      'support',
      'contact',
      'about',
      'privacy',
      'terms',
      'pricing',
      'billing',
      'profile',
      'profiles',
      'settings',
      'security',
      'help',
      'sitemap',
      'robots',
      'favicon',
      'www',
    ])('rejects reserved slug "%s"', (slug) => {
      expect(validateSlug(slug).valid).toBe(false);
    });
  });

  describe('validateCreateProfileInput', () => {
    const validInput = {
      name: 'Rahul Sharma',
      profession: 'Software Engineer',
      slug: 'rahul-sharma',
      headline: 'Building useful digital products.',
      bio: 'Software engineer focused on modern web experiences.',
      location: 'Bengaluru',
      category: 'Technology',
      about: 'A longer profile description.',
    };

    it('accepts a complete valid profile', () => {
      expect(
        validateCreateProfileInput(validInput)
      ).toEqual({
        valid: true,
        value: {
          name: 'Rahul Sharma',
          profession: 'Software Engineer',
          slug: 'rahul-sharma',
          headline:
            'Building useful digital products.',
          bio:
            'Software engineer focused on modern web experiences.',
          location: 'Bengaluru',
          category: 'Technology',
          about: 'A longer profile description.',
        },
      });
    });

    it('normalizes whitespace in profile fields', () => {
      const result = validateCreateProfileInput({
        ...validInput,
        name: '  Rahul Sharma ',
        profession: ' Software Engineer ',
        slug: ' Rahul-Sharma ',
      });

      expect(result.valid).toBe(true);

      expect(result.value.name).toBe(
        'Rahul Sharma'
      );

      expect(result.value.profession).toBe(
        'Software Engineer'
      );

      expect(result.value.slug).toBe(
        'rahul-sharma'
      );
    });

    it('returns a form error for non-object input', () => {
      expect(
        validateCreateProfileInput(null)
      ).toEqual({
        valid: false,
        errors: {
          form: 'Invalid profile data.',
        },
      });
    });

    it('returns all relevant field errors', () => {
      const result = validateCreateProfileInput({
        name: 'A',
        profession: 'B',
        slug: 'a',
        headline: 'A'.repeat(121),
        bio: 'A'.repeat(251),
        location: 'A'.repeat(121),
        category: 'A'.repeat(81),
        about: 'A'.repeat(3001),
      });

      expect(result.valid).toBe(false);

      expect(result.errors).toHaveProperty('name');
      expect(result.errors).toHaveProperty('profession');
      expect(result.errors).toHaveProperty('slug');
      expect(result.errors).toHaveProperty('headline');
      expect(result.errors).toHaveProperty('bio');
      expect(result.errors).toHaveProperty('location');
      expect(result.errors).toHaveProperty('category');
      expect(result.errors).toHaveProperty('about');
    });

    it('returns null for omitted optional text fields', () => {
      const result = validateCreateProfileInput({
        name: 'Rahul',
        profession: 'Developer',
        slug: 'rahul',
      });

      expect(result.valid).toBe(true);

      expect(result.value.headline).toBeNull();
      expect(result.value.bio).toBeNull();
      expect(result.value.location).toBeNull();
      expect(result.value.category).toBeNull();
      expect(result.value.about).toBeNull();
    });
  });
});