import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

import {
  requireAAL2Admin,
} from '@/lib/auth/require-admin';

import {
  checkRateLimit,
  getRequestRateLimitKey,
} from '@/lib/security/rate-limit';

import {
  isSameOrigin,
} from '@/lib/security/origin-check';

import {
  applyApiSecurityHeaders,
} from '@/lib/security/security-headers';

const MAX_LIMIT = 50;
const MAX_SEARCH_LENGTH = 100;
const MAX_PAGE = 10000;

const ALLOWED_ROLES = new Set([
  'super_admin',
  'admin',
  'support',
]);

const ALLOWED_STATUS = new Set([
  'active',
  'inactive',
]);

const ALLOWED_PROVIDERS = new Set([
  'email',
  'google',
  'github',
  'apple',
  'phone',
]);

function secureJson(
  body,
  options = {},
) {
  const response =
    NextResponse.json(
      body,
      {
        ...options,
        headers: {
          'Cache-Control':
            'private, no-store, max-age=0',
          'X-Content-Type-Options':
            'nosniff',
          ...(options.headers || {}),
        },
      },
    );

  applyApiSecurityHeaders(
    response,
  );

  return response;
}

function safeInteger(
  value,
  fallback,
  min,
  max,
) {
  const number =
    Number(value);

  if (
    !Number.isInteger(number) ||
    number < min ||
    number > max
  ) {
    return fallback;
  }

  return number;
}

function cleanSearch(value) {
  if (
    typeof value !== 'string'
  ) {
    return '';
  }

  return value
    .trim()
    .slice(0, MAX_SEARCH_LENGTH);
}

function getProvider(user) {
  const identities =
    Array.isArray(
      user?.identities,
    )
      ? user.identities
      : [];

  const provider =
    identities[0]?.provider;

  if (
    typeof provider === 'string' &&
    provider.length <= 50
  ) {
    return provider;
  }

  return 'email';
}

function getDisplayName(
  user,
) {
  const metadata =
    user?.user_metadata || {};

  const candidates = [
    metadata.full_name,
    metadata.name,
    metadata.display_name,
    metadata.username,
  ];

  for (
    const candidate of candidates
  ) {
    if (
      typeof candidate === 'string' &&
      candidate.trim()
    ) {
      return candidate
        .trim()
        .slice(0, 120);
    }
  }

  return null;
}

function getAccountStatus(
  user,
) {
  if (
    user?.banned_until &&
    new Date(
      user.banned_until,
    ).getTime() >
      Date.now()
  ) {
    return 'inactive';
  }

  if (
    user?.deleted_at
  ) {
    return 'inactive';
  }

  return 'active';
}

function matchesSearch(
  user,
  admin,
  search,
) {
  if (!search) {
    return true;
  }

  const needle =
    search.toLowerCase();

  const values = [
    user?.id,
    user?.email,
    getDisplayName(user),
    admin?.display_name,
    admin?.role,
  ];

  return values.some(
    (value) =>
      typeof value === 'string' &&
      value
        .toLowerCase()
        .includes(needle),
  );
}

export async function GET(
  request,
) {
  /*
   * ---------------------------------------------------------
   * 1. SAME-ORIGIN PROTECTION
   * ---------------------------------------------------------
   */
  if (
    !isSameOrigin(request)
  ) {
    return secureJson(
      {
        error:
          'Invalid request origin.',
      },
      {
        status: 403,
      },
    );
  }

  /*
   * ---------------------------------------------------------
   * 2. RATE LIMIT
   * ---------------------------------------------------------
   */
  const rateLimit =
    checkRateLimit(
      getRequestRateLimitKey(
        request,
        'admin-users-read',
      ),
      {
        maxRequests: 30,
        windowMs:
          60 * 1000,
      },
    );

  if (
    !rateLimit.allowed
  ) {
    const response =
      secureJson(
        {
          error:
            'Too many requests. Please try again later.',
        },
        {
          status: 429,
        },
      );

    if (
      Number.isFinite(
        rateLimit.retryAfter,
      )
    ) {
      response.headers.set(
        'Retry-After',
        String(
          rateLimit.retryAfter,
        ),
      );
    }

    return response;
  }

  /*
   * ---------------------------------------------------------
   * 3. ADMIN + AAL2 AUTHORIZATION
   * ---------------------------------------------------------
   *
   * User identity comes from Supabase Auth.
   * Browser-supplied user IDs are never trusted.
   */
  const authorization =
    await requireAAL2Admin();

  if (
    !authorization?.ok
  ) {
    return secureJson(
      {
        error:
          authorization?.error ||
          'Administrator authorization required.',
      },
      {
        status:
          Number.isInteger(
            authorization?.status,
          )
            ? authorization.status
            : 403,
      },
    );
  }

  /*
   * ---------------------------------------------------------
   * 4. QUERY PARAMETERS
   * ---------------------------------------------------------
   */
  const url =
    new URL(
      request.url,
    );

  const page =
    safeInteger(
      url.searchParams.get(
        'page',
      ),
      1,
      1,
      MAX_PAGE,
    );

  const limit =
    safeInteger(
      url.searchParams.get(
        'limit',
      ),
      25,
      1,
      MAX_LIMIT,
    );

  const search =
    cleanSearch(
      url.searchParams.get(
        'query',
      ),
    );

  const role =
    url.searchParams
      .get('role')
      ?.trim()
      .toLowerCase() || '';

  const status =
    url.searchParams
      .get('status')
      ?.trim()
      .toLowerCase() || '';

  const provider =
    url.searchParams
      .get('provider')
      ?.trim()
      .toLowerCase() || '';

  /*
   * Unknown filters are rejected.
   */
  if (
    role &&
    !ALLOWED_ROLES.has(role)
  ) {
    return secureJson(
      {
        error:
          'Invalid role filter.',
      },
      {
        status: 400,
      },
    );
  }

  if (
    status &&
    !ALLOWED_STATUS.has(status)
  ) {
    return secureJson(
      {
        error:
          'Invalid status filter.',
      },
      {
        status: 400,
      },
    );
  }

  if (
    provider &&
    !ALLOWED_PROVIDERS.has(
      provider,
    )
  ) {
    return secureJson(
      {
        error:
          'Invalid provider filter.',
      },
      {
        status: 400,
      },
    );
  }

  try {
    const supabase =
      await createClient();

    /*
     * -------------------------------------------------------
     * 5. ADMIN ROLE MAP
     * -------------------------------------------------------
     *
     * Only the server reads admin_users.
     */
    const {
      data: adminRows,
      error: adminError,
    } =
      await supabase
        .from('admin_users')
        .select(
          `
            user_id,
            role,
            display_name,
            is_active,
            created_at
          `,
        );

    if (adminError) {
      console.error(
        'Admin users role lookup failed:',
        adminError.message,
      );

      return secureJson(
        {
          error:
            'Unable to load administrator data.',
        },
        {
          status: 500,
        },
      );
    }

    const adminMap =
      new Map(
        (adminRows || []).map(
          (admin) => [
            admin.user_id,
            admin,
          ],
        ),
      );

    /*
     * -------------------------------------------------------
     * 6. SUPABASE AUTH ADMIN API
     * -------------------------------------------------------
     *
     * This runs server-side only.
     *
     * IMPORTANT:
     * Never expose the service-role key to the browser.
     */
    const {
      data,
      error,
    } =
      await supabase.auth.admin.listUsers({
        page,
        perPage: limit,
      });

    if (error) {
      console.error(
        'Admin user listing failed:',
        error.message,
      );

      return secureJson(
        {
          error:
            'Unable to load users.',
        },
        {
          status: 500,
        },
      );
    }

    let users =
      Array.isArray(data?.users)
        ? data.users
        : [];

    /*
     * -------------------------------------------------------
     * 7. FILTER SERVER-SIDE
     * -------------------------------------------------------
     */
    users =
      users.filter(
        (user) => {
          const admin =
            adminMap.get(
              user.id,
            );

          const userRole =
            admin?.role || '';

          const userStatus =
            getAccountStatus(
              user,
            );

          const userProvider =
            getProvider(user);

          if (
            role &&
            userRole !== role
          ) {
            return false;
          }

          if (
            status &&
            userStatus !== status
          ) {
            return false;
          }

          if (
            provider &&
            userProvider !== provider
          ) {
            return false;
          }

          return matchesSearch(
            user,
            admin,
            search,
          );
        },
      );

    /*
     * -------------------------------------------------------
     * 8. SAFE RESPONSE MAPPING
     * -------------------------------------------------------
     *
     * Never return the complete Supabase Auth object.
     */
    const safeUsers =
      users.map(
        (user) => {
          const admin =
            adminMap.get(
              user.id,
            );

          return {
            id: user.id,

            email:
              typeof user.email ===
              'string'
                ? user.email
                : null,

            display_name:
              getDisplayName(
                user,
              ),

            role:
              admin?.role ||
              'user',

            admin:
              Boolean(admin),

            admin_active:
              admin?.is_active === true,

            account_status:
              getAccountStatus(
                user,
              ),

            provider:
              getProvider(user),

            created_at:
              user.created_at ||
              null,

            last_sign_in_at:
              user.last_sign_in_at ||
              null,

            email_confirmed:
              Boolean(
                user.email_confirmed_at,
              ),

            mfa_enabled:
              Array.isArray(
                user.factors,
              ) &&
              user.factors.length >
                0,
          };
        },
      );

    /*
     * -------------------------------------------------------
     * 9. RESPONSE
     * -------------------------------------------------------
     */
    return secureJson(
      {
        success: true,

        users:
          safeUsers,

        pagination: {
          page,
          limit,

          returned:
            safeUsers.length,

          total:
            Number(data?.total) ||
            safeUsers.length,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /*
     * Never expose internal errors.
     */
    console.error(
      'Admin users API error:',
      error,
    );

    return secureJson(
      {
        error:
          'Unable to load users.',
      },
      {
        status: 500,
      },
    );
  }
}