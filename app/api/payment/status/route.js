import { NextResponse } from 'next/server';

import { getRenewalStatus } from '@/lib/payments/renewal-status';

import { checkOrigin } from '@/lib/security/origin-check';

import {
  checkRateLimitAsync,
  getRequestRateLimitKey,
} from '@/lib/security/rate-limit';

import {
  applyApiSecurityHeaders,
  applyNoStore,
} from '@/lib/security/security-headers';

/**
 * WORLDWIDE DIPO
 * ------------------------------------------------------------
 * Authenticated Payment / Subscription Status API
 *
 * GET /api/payment/status
 *
 * SECURITY MODEL
 * ------------------------------------------------------------
 *
 * Browser
 *   ↓
 * Origin validation
 *   ↓
 * Rate limiting
 *   ↓
 * Authenticated Supabase session
 *   ↓
 * Owner-only renewal status service
 *   ↓
 * Safe response projection
 *
 * IMPORTANT
 * ------------------------------------------------------------
 *
 * This endpoint exposes ONLY the currently authenticated
 * user's own subscription/payment status.
 *
 * The client cannot provide:
 *
 * - user_id
 * - owner_id
 * - profile_id
 * - payment_id
 *
 * to choose another user's data.
 *
 * Ownership is resolved server-side through getRenewalStatus().
 */

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------
   Configuration
   ------------------------------------------------------------ */

/*
 * Status is read-only, so it can be slightly less restrictive
 * than payment creation/submission.
 *
 * Still keep it protected because it exposes authenticated
 * subscription/payment information.
 */
const RATE_LIMIT_MAX_REQUESTS =
  30;

const RATE_LIMIT_WINDOW_MS =
  60 * 1000;

/* ------------------------------------------------------------
   Secure response helper
   ------------------------------------------------------------ */

function secureJson(
  body,
  {
    status = 200,
    retryAfter = null,
  } = {},
) {
  const response =
    NextResponse.json(
      body,
      {
        status,
      },
    );

  applyApiSecurityHeaders(
    response,
  );

  applyNoStore(response);

  if (
    Number.isInteger(
      retryAfter,
    ) &&
    retryAfter > 0
  ) {
    response.headers.set(
      'Retry-After',
      String(retryAfter),
    );
  }

  return response;
}

/* ------------------------------------------------------------
   GET
   ------------------------------------------------------------ */

export async function GET(
  request,
) {
  try {
    /* --------------------------------------------------------
       1. Request sanity
       -------------------------------------------------------- */

    if (!request) {
      return secureJson(
        {
          error:
            'Invalid request.',
        },
        {
          status: 400,
        },
      );
    }

    /* --------------------------------------------------------
       2. Same-origin validation
       --------------------------------------------------------
       
       Although this endpoint is read-only, it returns
       authenticated private subscription/payment information.
       
       Do not allow arbitrary cross-origin browser access.
       -------------------------------------------------------- */

    const originResult =
      checkOrigin(request);

    if (
      !originResult.valid
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

    /* --------------------------------------------------------
       3. Rate limiting
       --------------------------------------------------------
       
       Prevent:
       - polling abuse
       - account-state enumeration attempts
       - unnecessary database pressure
       -------------------------------------------------------- */

    const rateLimitKey =
      getRequestRateLimitKey(
        request,
        'payment-status',
      );

    const rateLimit =
      await checkRateLimitAsync(
        rateLimitKey,
        {
          maxRequests:
            RATE_LIMIT_MAX_REQUESTS,
          windowMs:
            RATE_LIMIT_WINDOW_MS,
        },
      );

    if (
      !rateLimit.allowed
    ) {
      return secureJson(
        {
          error:
            'Too many status requests. Please try again later.',
        },
        {
          status: 429,
          retryAfter:
            rateLimit.retryAfter,
        },
      );
    }

    /* --------------------------------------------------------
       4. Explicitly reject query-based identity selection
       --------------------------------------------------------
       
       A status endpoint should never become:
       
       /api/payment/status?user_id=...
       /api/payment/status?profile_id=...
       
       even accidentally.
       
       The authenticated session is the only identity source.
       -------------------------------------------------------- */

    const url =
      new URL(
        request.url,
      );

    const forbiddenIdentityParams = [
      'user',
      'user_id',
      'userid',
      'owner_id',
      'owner',
      'profile',
      'profile_id',
      'payment_id',
      'payment',
      'id',
    ];

    for (
      const parameter of
        forbiddenIdentityParams
    ) {
      if (
        url.searchParams.has(
          parameter,
        )
      ) {
        return secureJson(
          {
            error:
              'Identity parameters are not accepted.',
          },
          {
            status: 400,
          },
        );
      }
    }

    /* --------------------------------------------------------
       5. Resolve authenticated user's status
       --------------------------------------------------------
       
       getRenewalStatus() is intentionally reused as the
       canonical owner-scoped data layer.
       
       It:
       - obtains auth.uid()
       - finds profile by owner_id
       - loads only that profile's pending renewal
       -------------------------------------------------------- */

    const result =
      await getRenewalStatus();

    /* --------------------------------------------------------
       6. Authentication boundary
       -------------------------------------------------------- */

    if (
      !result ||
      result.authenticated !==
        true
    ) {
      return secureJson(
        {
          authenticated: false,
          profile: null,
          pendingRenewal: null,
        },
        {
          status: 401,
        },
      );
    }

    /* --------------------------------------------------------
       7. Safe response projection
       --------------------------------------------------------
       
       Never blindly return the complete service object.
       
       In particular, owner_id is not useful to the browser
       and should not be unnecessarily exposed.
       -------------------------------------------------------- */

    const profile =
      result.profile
        ? {
            id:
              result.profile.id,

            name:
              result.profile.name ||
              null,

            slug:
              result.profile.slug ||
              null,

            plan:
              result.profile.plan ||
              null,

            status:
              result.profile.status ||
              null,

            expires_at:
              result.profile
                .expires_at ||
              null,

            deletion_scheduled_at:
              result.profile
                .deletion_scheduled_at ||
              null,
          }
        : null;

    const pendingRenewal =
      result.pendingRenewal
        ? {
            id:
              result.pendingRenewal.id,

            plan:
              result.pendingRenewal.plan ||
              null,

            amount:
              result.pendingRenewal.amount ??
              null,

            payment_reference:
              result.pendingRenewal
                .payment_reference ||
              null,

            status:
              result.pendingRenewal.status ||
              'pending',

            created_at:
              result.pendingRenewal
                .created_at ||
              null,
          }
        : null;

    /* --------------------------------------------------------
       8. Profile not found
       -------------------------------------------------------- */

    if (!profile) {
      return secureJson(
        {
          authenticated: true,
          profile: null,
          pendingRenewal: null,
        },
        {
          status: 200,
        },
      );
    }

    /* --------------------------------------------------------
       9. Return authenticated owner status
       -------------------------------------------------------- */

    return secureJson(
      {
        authenticated: true,

        profile,

        pendingRenewal,

        /*
         * Useful for frontend consumers without exposing
         * additional database fields.
         */
        hasPendingRenewal:
          Boolean(
            pendingRenewal,
          ),
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /* --------------------------------------------------------
       10. Fail closed
       -------------------------------------------------------- */

    console.error(
      'Payment status API error:',
      {
        name:
          error?.name ||
          'UnknownError',

        message:
          error?.message ||
          'Unknown error',

        code:
          error?.code ||
          null,
      },
    );

    return secureJson(
      {
        error:
          'Unable to load payment status.',
      },
      {
        status: 500,
      },
    );
  }
}