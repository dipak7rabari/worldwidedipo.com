import { NextResponse } from 'next/server';

import {
  requireAAL2Admin,
} from '@/lib/auth/require-admin';

import {
  getAdminProfiles,
} from '@/lib/admin/admin-profiles';

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

const MAX_QUERY_LENGTH = 80;
const MAX_PAGE = 10000;

const ALLOWED_STATUS = new Set([
  '',
  'draft',
  'pending',
  'active',
  'expired',
]);

const ALLOWED_PLANS = new Set([
  '',
  'Starter',
  'Pro',
  'Elite',
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

function cleanQuery(
  value,
) {
  if (
    typeof value !== 'string'
  ) {
    return '';
  }

  return value
    .trim()
    .replace(
      /[,%()]/g,
      ' ',
    )
    .replace(
      /\s+/g,
      ' ',
    )
    .slice(
      0,
      MAX_QUERY_LENGTH,
    );
}

function cleanPage(
  value,
) {
  const page =
    Number(value);

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    page > MAX_PAGE
  ) {
    return null;
  }

  return page;
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
        'admin-profiles-read',
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
   * 3. ADMIN + AAL2
   * ---------------------------------------------------------
   *
   * Profile administration is sensitive.
   *
   * This verifies:
   * - authenticated user
   * - approved admin email
   * - active admin_users record
   * - valid admin role
   * - AAL2
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

  const query =
    cleanQuery(
      url.searchParams.get(
        'query',
      ),
    );

  const status =
    (
      url.searchParams
        .get('status') || ''
    )
      .trim()
      .toLowerCase();

  const plan =
    (
      url.searchParams
        .get('plan') || ''
    ).trim();

  const rawPage =
    url.searchParams.get(
      'page',
    );

  /*
   * ---------------------------------------------------------
   * 5. STRICT FILTER VALIDATION
   * ---------------------------------------------------------
   */
  if (
    !ALLOWED_STATUS.has(
      status,
    )
  ) {
    return secureJson(
      {
        error:
          'Invalid profile status.',
      },
      {
        status: 400,
      },
    );
  }

  if (
    !ALLOWED_PLANS.has(
      plan,
    )
  ) {
    return secureJson(
      {
        error:
          'Invalid profile plan.',
      },
      {
        status: 400,
      },
    );
  }

  const page =
    rawPage === null ||
    rawPage === ''
      ? 1
      : cleanPage(rawPage);

  if (page === null) {
    return secureJson(
      {
        error:
          'Invalid page number.',
      },
      {
        status: 400,
      },
    );
  }

  /*
   * ---------------------------------------------------------
   * 6. LOAD PROFILES
   * ---------------------------------------------------------
   *
   * Existing getAdminProfiles() functionality is preserved.
   *
   * The service-role client remains server-only.
   */
  try {
    const result =
      await getAdminProfiles({
        query,
        status,
        plan,
        page,
      });

    /*
     * -------------------------------------------------------
     * 7. SAFE RESPONSE
     * -------------------------------------------------------
     */
    return secureJson(
      {
        success: true,

        profiles:
          Array.isArray(
            result?.profiles,
          )
            ? result.profiles
            : [],

        total:
          Number.isInteger(
            result?.total,
          )
            ? result.total
            : 0,

        page:
          Number.isInteger(
            result?.page,
          )
            ? result.page
            : page,

        pageSize:
          Number.isInteger(
            result?.pageSize,
          )
            ? result.pageSize
            : 20,

        totalPages:
          Number.isInteger(
            result?.totalPages,
          )
            ? result.totalPages
            : 1,

        stats: {
          total:
            Number.isInteger(
              result?.stats?.total,
            )
              ? result.stats.total
              : 0,

          active:
            Number.isInteger(
              result?.stats?.active,
            )
              ? result.stats.active
              : 0,

          pending:
            Number.isInteger(
              result?.stats?.pending,
            )
              ? result.stats.pending
              : 0,

          draft:
            Number.isInteger(
              result?.stats?.draft,
            )
              ? result.stats.draft
              : 0,

          expired:
            Number.isInteger(
              result?.stats?.expired,
            )
              ? result.stats.expired
              : 0,

          starter:
            Number.isInteger(
              result?.stats?.starter,
            )
              ? result.stats.starter
              : 0,

          pro:
            Number.isInteger(
              result?.stats?.pro,
            )
              ? result.stats.pro
              : 0,

          elite:
            Number.isInteger(
              result?.stats?.elite,
            )
              ? result.stats.elite
              : 0,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /*
     * -------------------------------------------------------
     * 8. SAFE ERROR HANDLING
     * -------------------------------------------------------
     *
     * Internal Supabase/database errors are never returned
     * to the browser.
     */
    console.error(
      'Admin profiles API error:',
      error,
    );

    return secureJson(
      {
        error:
          'Unable to load DIPO profiles.',
      },
      {
        status: 500,
      },
    );
  }
}