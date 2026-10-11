import { NextResponse } from 'next/server';

import { checkOrigin } from '@/lib/security/origin-check';

import {
  checkRateLimitAsync,
  getRequestRateLimitKey,
} from '@/lib/security/rate-limit';

import {
  applyApiSecurityHeaders,
  applyNoStore,
} from '@/lib/security/security-headers';

import {
  readJsonBody,
} from '@/lib/security/request-body';

import {
  createRenewalPayment,
} from '@/lib/payments/create-renewal-payment';

/**
 * WORLDWIDE DIPO
 * ------------------------------------------------------------
 * Renewal Payment API
 *
 * POST /api/payment/renewal
 *
 * SECURITY BOUNDARY
 * ------------------------------------------------------------
 *
 * Request
 *   ↓
 * Origin validation
 *   ↓
 * Content-Type validation
 *   ↓
 * IP rate limit
 *   ↓
 * Bounded JSON body
 *   ↓
 * Strict payload projection
 *   ↓
 * createRenewalPayment()
 *   ↓
 * authenticated owner lookup
 *   ↓
 * server-side plan amount
 *   ↓
 * payment lifecycle checks
 *   ↓
 * database constraints
 *
 * IMPORTANT
 * ------------------------------------------------------------
 *
 * The client NEVER controls:
 *
 * - user_id
 * - owner_id
 * - profile_id
 * - amount
 * - payer_name
 * - slug_snapshot
 * - payment status
 * - verification status
 *
 * Those remain server/database responsibilities.
 */

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------
   Limits
   ------------------------------------------------------------ */

const MAX_BODY_SIZE =
  50 * 1024;

const RATE_LIMIT_MAX_REQUESTS =
  5;

const RATE_LIMIT_WINDOW_MS =
  60 * 1000;

const JSON_CONTENT_TYPE =
  'application/json';

/* ------------------------------------------------------------
   Response helper
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
   Content-Type
   ------------------------------------------------------------ */

function getContentType(
  request,
) {
  const value =
    request?.headers?.get?.(
      'content-type',
    );

  if (
    typeof value !==
    'string'
  ) {
    return '';
  }

  return value
    .split(';', 1)[0]
    .trim()
    .toLowerCase();
}

/* ------------------------------------------------------------
   POST
   ------------------------------------------------------------ */

export async function POST(
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
       2. Same-origin protection
       --------------------------------------------------------
       
       Renewal changes payment state and therefore must not
       accept cross-origin browser requests.
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
       3. JSON-only endpoint
       -------------------------------------------------------- */

    const contentType =
      getContentType(
        request,
      );

    if (
      contentType !==
      JSON_CONTENT_TYPE
    ) {
      return secureJson(
        {
          error:
            'Content-Type must be application/json.',
        },
        {
          status: 415,
        },
      );
    }

    /* --------------------------------------------------------
       4. Rate limiting
       --------------------------------------------------------
       
       Renewal submission is a sensitive mutation.
       Keep the endpoint intentionally restrictive.
       -------------------------------------------------------- */

    const rateLimitKey =
      getRequestRateLimitKey(
        request,
        'payment-renewal',
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
            'Too many renewal attempts. Please try again later.',
        },
        {
          status: 429,
          retryAfter:
            rateLimit.retryAfter,
        },
      );
    }

    /* --------------------------------------------------------
       5. Safely read bounded JSON
       -------------------------------------------------------- */

    const parsed =
      await readJsonBody(
        request,
        MAX_BODY_SIZE,
      );

    if (!parsed.ok) {
      return secureJson(
        {
          error:
            parsed.error ||
            'Invalid request body.',
        },
        {
          status:
            parsed.status || 400,
        },
      );
    }

    /* --------------------------------------------------------
       6. Validate top-level JSON shape
       -------------------------------------------------------- */

    if (
      !parsed.body ||
      typeof parsed.body !==
        'object' ||
      Array.isArray(
        parsed.body,
      )
    ) {
      return secureJson(
        {
          error:
            'Invalid renewal request.',
        },
        {
          status: 400,
        },
      );
    }

    /* --------------------------------------------------------
       7. Strict input projection
       --------------------------------------------------------
       
       Only the two fields understood by the existing renewal
       service are allowed through.
       
       Deliberately DO NOT forward the entire client object.
       
       This protects against future accidental trust of fields
       such as:
       
       amount
       profile_id
       user_id
       status
       payer_name
       expires_at
       verified
       -------------------------------------------------------- */

    const body =
      parsed.body;

    const plan =
      typeof body.plan ===
      'string'
        ? body.plan.trim()
        : '';

    const paymentReference =
      typeof body.payment_reference ===
      'string'
        ? body.payment_reference.trim()
        : '';

    /* --------------------------------------------------------
       8. Basic payload validation
       --------------------------------------------------------
       
       Full plan/reference validation remains inside the
       canonical payment validation layer.
       
       These checks stop obviously malformed requests before
       reaching the database/service layer.
       -------------------------------------------------------- */

    if (!plan) {
      return secureJson(
        {
          errors: {
            plan:
              'Payment plan is required.',
          },
        },
        {
          status: 400,
        },
      );
    }

    if (
      plan.length >
      32
    ) {
      return secureJson(
        {
          errors: {
            plan:
              'Invalid payment plan.',
          },
        },
        {
          status: 400,
        },
      );
    }

    if (
      !paymentReference
    ) {
      return secureJson(
        {
          errors: {
            payment_reference:
              'Payment reference is required.',
          },
        },
        {
          status: 400,
        },
      );
    }

    if (
      paymentReference.length >
      100
    ) {
      return secureJson(
        {
          errors: {
            payment_reference:
              'Payment reference is too long.',
          },
        },
        {
          status: 400,
        },
      );
    }

    /* --------------------------------------------------------
       9. Canonical renewal service
       --------------------------------------------------------
       
       createRenewalPayment() performs:
       
       - authentication
       - authenticated owner's profile lookup
       - profile lifecycle eligibility
       - deletion-state protection
       - pending-renewal detection
       - server-side plan amount resolution
       - payment creation
       - duplicate-reference handling
       
       We intentionally do not duplicate that business logic
       here.
       -------------------------------------------------------- */

    const result =
      await createRenewalPayment(
        {
          plan,
          payment_reference:
            paymentReference,
        },
      );

    /* --------------------------------------------------------
       10. Business failure
       -------------------------------------------------------- */

    if (
      !result ||
      result.success !== true
    ) {
      const status =
        Number.isInteger(
          result?.status,
        )
          ? result.status
          : 400;

      return secureJson(
        {
          errors:
            result?.errors || {
              form:
                'Unable to process renewal payment.',
            },

          /*
           * Existing functionality intentionally preserved:
           * pending-payment information may be returned when
           * the service provides it.
           *
           * It is projected below instead of blindly returning
           * arbitrary service data.
           */
          payment:
            result?.payment
              ? projectPayment(
                  result.payment,
                )
              : null,
        },
        {
          status,
        },
      );
    }

    /* --------------------------------------------------------
       11. Defensive success validation
       -------------------------------------------------------- */

    if (
      !result.payment ||
      typeof result.payment !==
        'object' ||
      !result.payment.id
    ) {
      console.error(
        'Renewal API received invalid success payload.',
      );

      return secureJson(
        {
          error:
            'Renewal payment could not be confirmed. Please try again.',
        },
        {
          status: 500,
        },
      );
    }

    /* --------------------------------------------------------
       12. Safe payment projection
       -------------------------------------------------------- */

    return secureJson(
      {
        success: true,

        payment:
          projectPayment(
            result.payment,
          ),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    /* --------------------------------------------------------
       13. Fail closed
       -------------------------------------------------------- */

    console.error(
      'Renewal API error:',
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

    /*
     * Never expose raw database/Supabase/server exceptions
     * to the browser.
     */

    return secureJson(
      {
        error:
          'Unable to process renewal payment.',
      },
      {
        status: 500,
      },
    );
  }
}

/* ------------------------------------------------------------
   Safe payment projection
   ------------------------------------------------------------
   
   Only return fields needed by the frontend.
   
   Never expose:
   - user_id
   - owner_id
   - internal DB metadata
   - verification actor
   - private admin notes
   - arbitrary database columns
   ------------------------------------------------------------ */

function projectPayment(
  payment,
) {
  if (
    !payment ||
    typeof payment !==
      'object'
  ) {
    return null;
  }

  return {
    id:
      payment.id,

    profile_id:
      payment.profile_id ||
      null,

    payment_type:
      payment.payment_type ||
      'renewal',

    plan:
      payment.plan ||
      null,

    amount:
      payment.amount ??
      null,

    payment_reference:
      payment.payment_reference ||
      null,

    status:
      payment.status ||
      'pending',

    created_at:
      payment.created_at ||
      null,
  };
}