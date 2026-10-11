import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * WORLDWIDE DIPO
 * Production Admin Authorization
 *
 * SECURITY MODEL
 *
 * 1. User must be authenticated.
 * 2. User email must belong to the fixed Worldwide DIPO
 *    administrator allowlist.
 * 3. User must have an active record in admin_users.
 * 4. Role must be explicitly allowed.
 * 5. Sensitive operations can require AAL2/MFA.
 * 6. Payment management is restricted to admin/super_admin.
 *
 * IMPORTANT:
 * This is server-side authorization.
 * Frontend visibility is NOT treated as security.
 */

/*
 * FIX: Admin emails ab ADMIN_EMAILS environment variable se aate hain
 * (comma separated). Env set na ho to purani 2 emails fallback hain,
 * taaki aap lock-out na ho. Env set karne ke baad fallback hata dena.
 */
const FALLBACK_ADMIN_EMAILS = [
  'dipak7rabari@gmail.com',
  'xdipak63@gmail.com',
];

function loadAdminEmails() {
  const raw =
    typeof process.env.ADMIN_EMAILS === 'string'
      ? process.env.ADMIN_EMAILS
      : '';

  const fromEnv = raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return new Set(
    fromEnv.length > 0 ? fromEnv : FALLBACK_ADMIN_EMAILS,
  );
}

const AUTHORIZED_ADMIN_EMAILS = loadAdminEmails();

/**
 * FIX: AAL (MFA level) Supabase user object mein nahi hota.
 * Wo verified JWT claims mein hota hai, isliye getClaims() se padhte hain.
 */
export async function getSessionAal(supabase) {
  try {
    const { data } = await supabase.auth.getClaims();
    const aal = data?.claims?.aal;

    return typeof aal === 'string' ? aal : null;
  } catch {
    return null;
  }
}

const ADMIN_ROLES = new Set([
  'super_admin',
  'admin',
  'support',
]);

const PAYMENT_ADMIN_ROLES = new Set([
  'super_admin',
  'admin',
]);

const MAX_EMAIL_LENGTH = 320;

/**
 * Normalize an email address for exact comparison.
 *
 * Email addresses are treated case-insensitively here.
 * We do NOT perform Gmail-specific transformations such as
 * removing dots or plus-addresses.
 */
function normalizeEmail(email) {
  if (
    typeof email !== 'string' ||
    email.length === 0 ||
    email.length > MAX_EMAIL_LENGTH
  ) {
    return null;
  }

  const normalized =
    email.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  /*
   * Basic defensive validation.
   *
   * Supabase Auth remains the authoritative authentication
   * provider. This check only prevents malformed values from
   * being treated as an administrator.
   */
  if (
    normalized.includes(' ') ||
    !normalized.includes('@') ||
    normalized.startsWith('@') ||
    normalized.endsWith('@')
  ) {
    return null;
  }

  return normalized;
}

/**
 * Check whether an email belongs to the two authorized
 * Worldwide DIPO administrators.
 */
export function isAuthorizedAdminEmail(
  email,
) {
  const normalized =
    normalizeEmail(email);

  if (!normalized) {
    return false;
  }

  return AUTHORIZED_ADMIN_EMAILS.has(
    normalized,
  );
}

/**
 * Check whether a role can enter the admin system.
 */
export function isAllowedAdminRole(
  role,
) {
  return (
    typeof role === 'string' &&
    ADMIN_ROLES.has(role)
  );
}

/**
 * Check whether a role can manage payments.
 */
export function isPaymentAdminRole(
  role,
) {
  return (
    typeof role === 'string' &&
    PAYMENT_ADMIN_ROLES.has(role)
  );
}

/**
 * Get the currently authenticated user.
 *
 * getUser() is intentionally used instead of trusting a
 * user ID supplied by the browser.
 */
async function getAuthenticatedUser(
  supabase,
) {
  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (error || !user?.id) {
    return {
      user: null,
      error,
    };
  }

  return {
    user,
    error: null,
  };
}

/**
 * Verify the authenticated user against the admin_users table.
 *
 * IMPORTANT:
 * user_id is taken ONLY from Supabase Auth.
 * It is never accepted from request body/query parameters.
 */
async function getAdminRecord(
  supabase,
  userId,
) {
  if (
    typeof userId !== 'string' ||
    !userId.trim()
  ) {
    return {
      admin: null,
      error: null,
    };
  }

  const {
    data: admin,
    error,
  } = await supabase
    .from('admin_users')
    .select(
      'user_id, role, display_name, is_active',
    )
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !admin) {
    return {
      admin: null,
      error,
    };
  }

  return {
    admin,
    error: null,
  };
}

/**
 * Get and validate the current administrator.
 *
 * Returns:
 *
 * {
 *   ok: true,
 *   user,
 *   admin,
 *   email,
 *   aal
 * }
 *
 * or:
 *
 * {
 *   ok: false,
 *   status,
 *   error,
 *   code
 * }
 */
export async function requireActiveAdmin({
  requireAAL2 = false,
  paymentManagement = false,
} = {}) {
  let supabase;

  try {
    supabase =
      await createServerSupabaseClient();
  } catch {
    /*
     * Never expose internal Supabase/server details.
     */
    return {
      ok: false,
      status: 500,
      error:
        'Security verification failed.',
      code: 'AUTH_SERVICE_ERROR',
    };
  }

  const {
    user,
    error: userError,
  } =
    await getAuthenticatedUser(
      supabase,
    );

  if (
    userError ||
    !user
  ) {
    return {
      ok: false,
      status: 401,
      error:
        'Authentication required.',
      code: 'AUTHENTICATION_REQUIRED',
    };
  }

  /*
   * IMPORTANT:
   *
   * Never trust an email supplied by the browser.
   *
   * This email comes directly from the authenticated
   * Supabase Auth user.
   */
  const email =
    normalizeEmail(user.email);

  /*
   * Exact two-email allowlist.
   *
   * A valid normal user account is NOT enough to become
   * an administrator.
   */
  if (
    !email ||
    !isAuthorizedAdminEmail(email)
  ) {
    return {
      ok: false,
      status: 403,
      error:
        'Admin access required.',
      code: 'ADMIN_NOT_AUTHORIZED',
    };
  }

  /*
   * Database-level admin record.
   *
   * Even one of the two emails still needs an active
   * admin_users record.
   */
  const {
    admin,
    error: adminError,
  } =
    await getAdminRecord(
      supabase,
      user.id,
    );

  if (
    adminError ||
    !admin
  ) {
    return {
      ok: false,
      status: 403,
      error:
        'Admin access required.',
      code: 'ADMIN_NOT_ACTIVE',
    };
  }

  /*
   * Defense in depth:
   *
   * The database record must contain an explicitly
   * supported administrator role.
   */
  if (
    !isAllowedAdminRole(
      admin.role,
    )
  ) {
    return {
      ok: false,
      status: 403,
      error:
        'Admin access required.',
      code: 'ADMIN_ROLE_NOT_ALLOWED',
    };
  }

  /*
   * Supabase Auth AAL claim.
   *
   * Sensitive admin operations can require AAL2.
   */
  const aal = await getSessionAal(supabase);

  if (
    requireAAL2 &&
    aal !== 'aal2'
  ) {
    return {
      ok: false,
      status: 403,
      error:
        'Additional authentication is required.',
      code: 'AAL2_REQUIRED',
    };
  }

  /*
   * Payment management:
   *
   * support is intentionally excluded.
   */
  if (
    paymentManagement &&
    !isPaymentAdminRole(
      admin.role,
    )
  ) {
    return {
      ok: false,
      status: 403,
      error:
        'Payment management permission required.',
      code: 'PAYMENT_PERMISSION_REQUIRED',
    };
  }

  return {
    ok: true,

    user,

    admin,

    email,

    aal,

    isAAL2:
      aal === 'aal2',

    canManagePayments:
      isPaymentAdminRole(
        admin.role,
      ),
  };
}

/**
 * Convenience helper for sensitive admin operations.
 *
 * Does NOT redirect.
 * API routes should use this and return their own HTTP response.
 */
export async function requireAAL2Admin(
  options = {},
) {
  return requireActiveAdmin({
    ...options,
    requireAAL2: true,
  });
}

/**
 * Convenience helper specifically for payment operations.
 *
 * Requires:
 * - authentication
 * - approved email
 * - active admin record
 * - admin/super_admin role
 * - AAL2
 */
export async function requirePaymentAdmin() {
  return requireActiveAdmin({
    requireAAL2: true,
    paymentManagement: true,
  });
}

/**
 * Safe public representation of an admin identity.
 *
 * Never return the complete Supabase user/session object
 * to browser-facing code when it is not needed.
 */
export function getSafeAdminIdentity(
  result,
) {
  if (
    !result ||
    result.ok !== true ||
    !result.admin
  ) {
    return null;
  }

  return {
    userId:
      result.admin.user_id,
    role:
      result.admin.role,
    displayName:
      result.admin.display_name,
    email:
      result.email,
    isActive:
      result.admin.is_active === true,
    isAAL2:
      result.isAAL2 === true,
    canManagePayments:
      result.canManagePayments === true,
  };
}