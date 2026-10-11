import { describe, expect, it } from 'vitest';

import {
  isAuthorizedAdminEmail,
  isAllowedAdminRole,
  isPaymentAdminRole,
  getSafeAdminIdentity,
} from '@/lib/security/admin-authorization';

describe('security: admin authorization', () => {
  describe('admin email allowlist', () => {
    it('accepts the first authorized administrator', () => {
      expect(
        isAuthorizedAdminEmail(
          'dipak7rabari@gmail.com'
        )
      ).toBe(true);
    });

    it('accepts the second authorized administrator', () => {
      expect(
        isAuthorizedAdminEmail(
          'xdipak63@gmail.com'
        )
      ).toBe(true);
    });

    it('treats authorized emails case-insensitively', () => {
      expect(
        isAuthorizedAdminEmail(
          'DIPAK7RABARI@GMAIL.COM'
        )
      ).toBe(true);
    });

    it('trims surrounding whitespace before comparison', () => {
      expect(
        isAuthorizedAdminEmail(
          '  dipak7rabari@gmail.com  '
        )
      ).toBe(true);
    });

    it('rejects arbitrary users', () => {
      expect(
        isAuthorizedAdminEmail(
          'attacker@example.com'
        )
      ).toBe(false);
    });

    it('rejects plus-address variants', () => {
      expect(
        isAuthorizedAdminEmail(
          'dipak7rabari+admin@gmail.com'
        )
      ).toBe(false);
    });

    it('rejects malformed email values', () => {
      const invalidValues = [
        '',
        ' ',
        null,
        undefined,
        123,
        '@gmail.com',
        'user@',
        'user gmail.com',
        'user@example.com ',
      ];

      for (const value of invalidValues) {
        expect(
          isAuthorizedAdminEmail(value)
        ).toBe(false);
      }
    });

    it('rejects excessively long email values', () => {
      const email =
        `${'a'.repeat(321)}@example.com`;

      expect(
        isAuthorizedAdminEmail(email)
      ).toBe(false);
    });
  });

  describe('admin roles', () => {
    it('allows super_admin', () => {
      expect(
        isAllowedAdminRole('super_admin')
      ).toBe(true);
    });

    it('allows admin', () => {
      expect(
        isAllowedAdminRole('admin')
      ).toBe(true);
    });

    it('allows support', () => {
      expect(
        isAllowedAdminRole('support')
      ).toBe(true);
    });

    it('rejects unknown roles', () => {
      const roles = [
        'owner',
        'developer',
        'moderator',
        'user',
        'root',
        '',
        null,
        undefined,
      ];

      for (const role of roles) {
        expect(
          isAllowedAdminRole(role)
        ).toBe(false);
      }
    });
  });

  describe('payment roles', () => {
    it('allows super_admin to manage payments', () => {
      expect(
        isPaymentAdminRole('super_admin')
      ).toBe(true);
    });

    it('allows admin to manage payments', () => {
      expect(
        isPaymentAdminRole('admin')
      ).toBe(true);
    });

    it('does not allow support to manage payments', () => {
      expect(
        isPaymentAdminRole('support')
      ).toBe(false);
    });

    it('rejects unknown payment roles', () => {
      expect(
        isPaymentAdminRole('owner')
      ).toBe(false);

      expect(
        isPaymentAdminRole('root')
      ).toBe(false);
    });
  });

  describe('safe admin identity', () => {
    it('returns only the intended safe fields', () => {
      const result = getSafeAdminIdentity({
        ok: true,
        email: 'admin@example.com',
        isAAL2: true,
        canManagePayments: true,
        admin: {
          user_id: 'user-123',
          role: 'admin',
          display_name: 'DIPO Admin',
          is_active: true,

          secret: 'must-not-leak',
          password: 'must-not-leak',
          serviceRoleKey: 'must-not-leak',
        },

        user: {
          id: 'user-123',
          email: 'admin@example.com',
          user_metadata: {
            secret: 'must-not-leak',
          },
        },
      });

      expect(result).toEqual({
        userId: 'user-123',
        role: 'admin',
        displayName: 'DIPO Admin',
        email: 'admin@example.com',
        isActive: true,
        isAAL2: true,
        canManagePayments: true,
      });

      expect(
        result.secret
      ).toBeUndefined();

      expect(
        result.password
      ).toBeUndefined();

      expect(
        result.serviceRoleKey
      ).toBeUndefined();
    });

    it('returns null for unauthorized results', () => {
      expect(
        getSafeAdminIdentity({
          ok: false,
          admin: null,
        })
      ).toBeNull();
    });

    it('returns null when admin data is missing', () => {
      expect(
        getSafeAdminIdentity({
          ok: true,
          admin: null,
        })
      ).toBeNull();
    });

    it('normalizes boolean security flags', () => {
      const result = getSafeAdminIdentity({
        ok: true,
        email: 'admin@example.com',
        isAAL2: false,
        canManagePayments: false,
        admin: {
          user_id: 'user-1',
          role: 'support',
          display_name: null,
          is_active: false,
        },
      });

      expect(result).toEqual({
        userId: 'user-1',
        role: 'support',
        displayName: null,
        email: 'admin@example.com',
        isActive: false,
        isAAL2: false,
        canManagePayments: false,
      });
    });
  });
});