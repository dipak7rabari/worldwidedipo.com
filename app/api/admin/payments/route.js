import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

import {
  requirePaymentAdmin,
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
const MAX_OFFSET = 100_000;

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

function secureJson(
  body,
  options = {},
) {
  const response =
    NextResponse.json(
      body,
      options,
    );

  applyApiSecurityHeaders(
    response,
  );

  return response;
}

export async function GET(request) {
  /*
   * ---------------------------------------------------------
   * 1. ORIGIN PROTECTION
   * ---------------------------------------------------------
   *
   * Admin payment data must not be casually requested
   * cross-origin from a browser.
   */
  if (!isSameOrigin(request)) {
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
   *
   * This protects the admin payment endpoint from
   * repeated scraping/brute-force requests.
   */
  const rateLimit =
    checkRateLimit(
      getRequestRateLimitKey(
        request,
        'admin-payments-read',
      ),
      {
        maxRequests: 30,
        windowMs:
          60 * 1000,
      },
    );

  if (!rateLimit.allowed) {
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
   * 3. AUTHENTICATION + ADMIN AUTHORIZATION + AAL2
   * ---------------------------------------------------------
   *
   * This function verifies:
   *
   * - authenticated Supabase user
   * - approved administrator email
   * - active admin_users record
   * - allowed admin role
   * - AAL2
   * - payment-management permission
   *
   * Nothing from the browser is trusted for identity.
   */
  const authorization =
    await requirePaymentAdmin();

  if (
    !authorization?.ok
  ) {
    return secureJson(
      {
        error:
          authorization?.error ||
          'Payment management authorization required.',
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
   * 4. SAFE QUERY PARAMETERS
   * ---------------------------------------------------------
   *
   * Pagination prevents returning an unlimited amount
   * of payment information in one response.
   */
  const url =
    new URL(
      request.url,
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

  const offset =
    safeInteger(
      url.searchParams.get(
        'offset',
      ),
      0,
      0,
      MAX_OFFSET,
    );

  const statusParam =
    url.searchParams
      .get('status')
      ?.trim()
      .toLowerCase();

  /*
   * Only these payment statuses are allowed.
   *
   * Unknown values are rejected instead of being passed
   * directly into a database query.
   */
  const allowedStatuses =
    new Set([
      'pending',
      'approved',
      'rejected',
    ]);

  const status =
    statusParam || 'pending';

  if (
    !allowedStatuses.has(
      status,
    )
  ) {
    return secureJson(
      {
        error:
          'Invalid payment status.',
      },
      {
        status: 400,
      },
    );
  }

  try {
    /*
     * -------------------------------------------------------
     * 5. SERVER-SIDE SUPABASE CLIENT
     * -------------------------------------------------------
     */
    const supabase =
      await createClient();

    /*
     * -------------------------------------------------------
     * 6. DATABASE QUERY
     * -------------------------------------------------------
     *
     * RLS remains an additional security boundary.
     *
     * The application authorization above is NOT treated
     * as the only protection.
     */
    const {
      data,
      error,
      count,
    } =
      await supabase
        .from('payments')
        .select(
          `
            id,
            profile_id,
            payment_type,
            plan,
            amount,
            payment_reference,
            status,
            payer_name,
            slug_snapshot,
            plan_snapshot,
            amount_snapshot,
            created_at,
            verified_at,
            notes
          `,
          {
            count: 'exact',
          },
        )
        .eq(
          'status',
          status,
        )
        .order(
          'created_at',
          {
            ascending: true,
          },
        )
        .range(
          offset,
          offset + limit - 1,
        );

    if (error) {
      /*
       * Never expose Supabase/database error details
       * to the browser.
       */
      console.error(
        'Admin payments query failed:',
        error.message,
      );

      return secureJson(
        {
          error:
            'Unable to load payment claims.',
        },
        {
          status: 500,
        },
      );
    }

    /*
     * -------------------------------------------------------
     * 7. SAFE RESPONSE
     * -------------------------------------------------------
     *
     * Only explicitly selected payment fields are returned.
     * No raw Supabase user/session object is exposed.
     */
    return secureJson(
      {
        success: true,

        payments:
          Array.isArray(data)
            ? data
            : [],

        pagination: {
          limit,
          offset,
          total:
            Number.isInteger(count)
              ? count
              : 0,

          hasMore:
            Number.isInteger(count)
              ? offset + limit <
                count
              : false,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /*
     * Log server-side only.
     *
     * Never return stack traces, SQL errors,
     * Supabase errors or environment information.
     */
    console.error(
      'Admin payments API error:',
      error,
    );

    return secureJson(
      {
        error:
          'Unable to load payment claims.',
      },
      {
        status: 500,
      },
    );
  }
}