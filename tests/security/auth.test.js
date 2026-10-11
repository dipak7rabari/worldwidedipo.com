import { describe, expect, it } from 'vitest';

import {
  isAdminMfaVerified,
  canManagePayments,
  canViewAdminData,
  canPerformSensitiveAdminAction,
} from '@/lib/admin/admin-auth';

describe('security: admin authentication and MFA', () => {
  const baseAdmin = {
    userId: 'user-123',
    email: 'admin@example.com',
    role: 'admin',
    displayName: 'Admin',
    isActive: true,
    aal: 'aal2',
    isAAL2: true,
  };

  describe('isAdminMfaVerified', () => {
    it('requires an active admin', () => {
      expect(
        isAdminMfaVerified({
          ...baseAdmin,
          isActive: false,
        })
      ).toBe(false);
    });

    it('requires AAL2', () => {
      expect(
        isAdminMfaVerified({
          ...baseAdmin,
          isAAL2: false,
        })
      ).toBe(false);
    });

    it('accepts active AAL2 admin', () => {
      expect(
        isAdminMfaVerified(baseAdmin)
      ).toBe(true);
    });

    it('fails closed for missing identity', () => {
      expect(
        isAdminMfaVerified(null)
      ).toBe(false);

      expect(
        isAdminMfaVerified(undefined)
      ).toBe(false);

      expect(
        isAdminMfaVerified({})
      ).toBe(false);
    });
  });

  describe('payment management authorization', () => {
    it('allows active AAL2 admin', () => {
      expect(
        canManagePayments(baseAdmin)
      ).toBe(true);
    });

    it('allows active AAL2 super_admin', () => {
      expect(
        canManagePayments({
          ...baseAdmin,
          role: 'super_admin',
        })
      ).toBe(true);
    });

    it('rejects support even with AAL2', () => {
      expect(
        canManagePayments({
          ...baseAdmin,
          role: 'support',
        })
      ).toBe(false);
    });

    it('rejects non-AAL2 admin', () => {
      expect(
        canManagePayments({
          ...baseAdmin,
          isAAL2: false,
          aal: 'aal1',
        })
      ).toBe(false);
    });

    it('rejects inactive admin', () => {
      expect(
        canManagePayments({
          ...baseAdmin,
          isActive: false,
        })
      ).toBe(false);
    });
  });

  describe('protected admin data', () => {
    it('allows active AAL2 supported admin roles', () => {
      expect(
        canViewAdminData(baseAdmin)
      ).toBe(true);

      expect(
        canViewAdminData({
          ...baseAdmin,
          role: 'super_admin',
        })
      ).toBe(true);

      expect(
        canViewAdminData({
          ...baseAdmin,
          role: 'support',
        })
      ).toBe(true);
    });

    it('rejects inactive administrators', () => {
      expect(
        canViewAdminData({
          ...baseAdmin,
          isActive: false,
        })
      ).toBe(false);
    });

    it('rejects AAL1 administrators', () => {
      expect(
        canViewAdminData({
          ...baseAdmin,
          isAAL2: false,
          aal: 'aal1',
        })
      ).toBe(false);
    });

    it('rejects unsupported roles', () => {
      expect(
        canViewAdminData({
          ...baseAdmin,
          role: 'owner',
        })
      ).toBe(false);
    });
  });

  describe('sensitive admin actions', () => {
    it('allows active AAL2 admin', () => {
      expect(
        canPerformSensitiveAdminAction(
          baseAdmin
        )
      ).toBe(true);
    });

    it('allows active AAL2 super_admin', () => {
      expect(
        canPerformSensitiveAdminAction({
          ...baseAdmin,
          role: 'super_admin',
        })
      ).toBe(true);
    });

    it('rejects support', () => {
      expect(
        canPerformSensitiveAdminAction({
          ...baseAdmin,
          role: 'support',
        })
      ).toBe(false);
    });

    it('rejects AAL1', () => {
      expect(
        canPerformSensitiveAdminAction({
          ...baseAdmin,
          isAAL2: false,
        })
      ).toBe(false);
    });

    it('rejects inactive admins', () => {
      expect(
        canPerformSensitiveAdminAction({
          ...baseAdmin,
          isActive: false,
        })
      ).toBe(false);
    });
  });
});