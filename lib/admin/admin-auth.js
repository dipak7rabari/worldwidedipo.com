import { createClient } from '@/lib/supabase/server';
import {
  isAuthorizedAdminEmail,
  isAllowedAdminRole,
  isPaymentAdminRole,
  getSessionAal,
} from '@/lib/security/admin-authorization';

/**
 * WORLDWIDE DIPO
 * Server-side Admin Identity
 *
 * SECURITY RULES
 *
 * - Never trust an admin ID from the browser.
 * - Authentication comes from Supabase Auth.
 * - Only the two approved admin emails are allowed.
 * - admin_users must contain an active record.
 * - The role must be explicitly allowed.
 * - Sensitive operations require AAL2.
 */

/**
 * Get the currently authenticated and authorized
 * Worldwide DIPO administrator.
 *
 * Returns null for:
 * - unauthenticated users
 * - unauthorized emails
 * - inactive admin records
 * - unsupported roles
 * - database lookup failures
 *
 * No internal error details are returned.
 */
export async function getAdminIdentity() {
  let supabase;

  try {
    supabase =
      await createClient();
  } catch {
    return null;
  }

  /*
   * getUser() verifies the authenticated user
   * through Supabase Auth.
   *
   * Do NOT trust a user ID supplied by the client.
   */
  const {
    data: {
      user,
    },
    error: userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !user?.id ||
    !user.email
  ) {
    return null;
  }

  /*
   * Exact two-email allowlist.
   */
  if (
    !isAuthorizedAdminEmail(
      user.email,
    )
  ) {
    return null;
  }

  /*
   * The authenticated user ID is the ONLY ID used
   * for this database lookup.
   */
  const {
    data: admin,
    error: adminError,
  } =
    await supabase
      .from('admin_users')
      .select(
        'user_id,role,display_name,is_active',
      )
      .eq(
        'user_id',
        user.id,
      )
      .eq(
        'is_active',
        true,
      )
      .maybeSingle();

  if (
    adminError ||
    !admin
  ) {
    return null;
  }

  /*
   * Defense in depth:
   * A database row alone is not enough.
   */
  if (
    !isAllowedAdminRole(
      admin.role,
    )
  ) {
    return null;
  }

  /*
   * AAL comes from the authenticated Supabase
   * session/claims, never from request input.
   */
  const aal =
    (await getSessionAal(supabase)) || 'aal1';

  return {
    userId: user.id,

    /*
     * Email is returned only after the exact
     * allowlist check above.
     */
    email:
      user.email
        .trim()
        .toLowerCase(),

    role:
      admin.role,

    displayName:
      admin.display_name,

    isActive:
      admin.is_active === true,

    aal,

    isAAL2:
      aal === 'aal2',
  };
}

/**
 * Check whether the administrator has completed
 * the required MFA/AAL2 authentication.
 *
 * Existing function preserved.
 */
export function isAdminMfaVerified(
  admin,
) {
  return (
    admin?.isActive === true &&
    admin?.isAAL2 === true
  );
}

/**
 * Check whether an administrator may manage
 * payments.
 *
 * Requires:
 * - active admin
 * - AAL2
 * - admin/super_admin role
 */
export function canManagePayments(
  admin,
) {
  return (
    isAdminMfaVerified(admin) &&
    isPaymentAdminRole(
      admin.role,
    )
  );
}

/**
 * Check whether an administrator may view
 * protected admin data.
 *
 * Requires:
 * - active admin
 * - AAL2
 * - supported admin role
 */
export function canViewAdminData(
  admin,
) {
  return (
    isAdminMfaVerified(admin) &&
    isAllowedAdminRole(
      admin.role,
    )
  );
}

/**
 * Check whether an admin can perform a
 * sensitive security operation.
 *
 * Kept separate from payment permissions so
 * future sensitive admin actions don't accidentally
 * inherit payment permissions.
 */
export function canPerformSensitiveAdminAction(
  admin,
) {
  return (
    isAdminMfaVerified(admin) &&
    (
      admin.role ===
        'super_admin' ||
      admin.role ===
        'admin'
    )
  );
}