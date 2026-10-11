import {
  requireActiveAdmin,
} from '@/lib/security/admin-authorization';

/**
 * WORLDWIDE DIPO
 * Server-side Admin Guard
 *
 * IMPORTANT:
 * This helper must only be used from server-side code:
 * - Route handlers
 * - Server actions
 * - Server components
 *
 * Never trust an admin/user ID supplied by the browser.
 */

/**
 * Require an authenticated and authorized admin.
 *
 * Existing usage remains:
 *
 * const admin = await requireAdmin();
 *
 * Additional options:
 *
 * const admin = await requireAdmin({
 *   requireAAL2: true,
 * });
 *
 * const admin = await requireAdmin({
 *   paymentManagement: true,
 * });
 */
export async function requireAdmin(
  options = {},
) {
  const result =
    await requireActiveAdmin(
      options,
    );

  if (!result.ok) {
    const error =
      new Error(
        result.error ||
          'Admin authorization required.',
      );

    /*
     * Keep the HTTP status available to API
     * route handlers without exposing internal
     * authorization details to the client.
     */
    error.status =
      Number.isInteger(result.status)
        ? result.status
        : 403;

    error.code =
      typeof result.code === 'string'
        ? result.code
        : 'ADMIN_NOT_AUTHORIZED';

    throw error;
  }

  return result;
}

/**
 * Require admin + AAL2.
 *
 * Use this for sensitive operations such as:
 * - Payment approval
 * - Payment rejection
 * - Admin security changes
 * - High-risk account actions
 */
export async function requireAAL2Admin() {
  return requireAdmin({
    requireAAL2: true,
  });
}

/**
 * Require an administrator who is allowed to
 * perform payment-management operations.
 *
 * This requires:
 * - authenticated user
 * - one of the two approved emails
 * - active admin_users record
 * - admin/super_admin role
 * - AAL2
 */
export async function requirePaymentAdmin() {
  return requireAdmin({
    requireAAL2: true,
    paymentManagement: true,
  });
}

/**
 * Convert an authorization failure into a safe
 * JSON Response for API routes.
 *
 * Internal database/authentication details are
 * deliberately NOT returned.
 */
export function adminErrorResponse(
  error,
) {
  const status =
    Number.isInteger(error?.status) &&
    error.status >= 400 &&
    error.status <= 499
      ? error.status
      : 403;

  let message =
    'Admin authorization required.';

  if (
    error?.code ===
    'AUTHENTICATION_REQUIRED'
  ) {
    message =
      'Authentication required.';
  }

  if (
    error?.code ===
    'AAL2_REQUIRED'
  ) {
    message =
      'Additional authentication is required.';
  }

  if (
    error?.code ===
    'PAYMENT_PERMISSION_REQUIRED'
  ) {
    message =
      'Payment management permission required.';
  }

  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status,
      headers: {
        'Content-Type':
          'application/json; charset=utf-8',

        'Cache-Control':
          'private, no-store, max-age=0',

        'X-Content-Type-Options':
          'nosniff',
      },
    },
  );
}