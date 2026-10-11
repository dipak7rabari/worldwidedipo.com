import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

import { normalizePaymentReference } from '@/lib/payments/payment-utils';

import { checkOrigin } from '@/lib/security/origin-check';

import {
  applyApiSecurityHeaders,
  applyNoStore,
} from '@/lib/security/security-headers';

import {
  checkRateLimitAsync,
  getRequestRateLimitKey,
} from '@/lib/security/rate-limit';

import {
  readJsonBody,
} from '@/lib/security/request-body';

/**
 * WORLDWIDE DIPO
 * ------------------------------------------------------------
 * Payment Submission API
 *
 * POST /api/payment/submit
 *
 * This endpoint is a sensitive authenticated payment endpoint.
 *
 * SECURITY FLOW
 * ------------------------------------------------------------
 *
 * Browser
 *   ↓
 * Same-origin validation
 *   ↓
 * JSON/body validation
 *   ↓
 * IP rate limit
 *   ↓
 * Supabase authenticated session
 *   ↓
 * Server-side input validation
 *   ↓
 * Authoritative submit_payment_claim RPC
 *   ↓
 * Database constraints / ownership / lifecycle validation
 *   ↓
 * Safe payment projection
 *
 * IMPORTANT
 * ------------------------------------------------------------
 *
 * The browser is NEVER trusted for:
 *
 * - user_id
 * - owner_id
 * - payment amount
 * - payment status
 * - verification status
 * - verified_by
 * - verified_at
 * - profile ownership
 *
 * The database RPC remains the final authority.
 */

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------
   Configuration
   ------------------------------------------------------------ */

const MAX_BODY_SIZE = 50 * 1024;

/*
 * Payment submission is a sensitive mutation.
 *
 * A legitimate user normally needs only one submission.
 * Keeping this endpoint restrictive reduces:
 *
 * - UTR brute-force attempts
 * - duplicate submission spam
 * - RPC abuse
 * - database pressure
 */
const RATE_LIMIT_MAX_REQUESTS = 5;

const RATE_LIMIT_WINDOW_MS =
  60 * 1000;

const JSON_CONTENT_TYPE =
  'application/json';

const ALLOWED_PLANS = new Set([
  'Starter',
  'Pro',
  'Elite',
]);

const ALLOWED_PAYMENT_TYPES = new Set([
  'initial',
  'renewal',
]);

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
   Content-Type helper
   ------------------------------------------------------------ */

function getContentType(request) {
  const value =
    request?.headers?.get?.(
      'content-type',
    );

  if (
    typeof value !== 'string'
  ) {
    return '';
  }

  return value
    .split(';', 1)[0]
    .trim()
    .toLowerCase();
}

/* ------------------------------------------------------------
   Safe error classification
   ------------------------------------------------------------ */

function getRpcErrorResponse(
  error,
) {
  const message =
    typeof error?.message === 'string'
      ? error.message
      : '';

  /*
   * Duplicate payment reference.
   *
   * This may come from either:
   * - explicit RPC business error
   * - database unique constraint
   */
  if (
    message.includes(
      'PAYMENT_REFERENCE_ALREADY_USED',
    ) ||
    message.includes(
      'PAYMENT_REFERENCE_OR_PENDING_PAYMENT_ALREADY_EXISTS',
    ) ||
    error?.code === '23505'
  ) {
    return {
      status: 409,
      body: {
        error:
          'This UTR / Payment Reference has already been submitted.',
      },
    };
  }

  if (
    message.includes(
      'INITIAL_PAYMENT_REQUIRES_DRAFT_PROFILE',
    )
  ) {
    return {
      status: 409,
      body: {
        error:
          'Initial payment can only be submitted for a draft profile.',
      },
    };
  }

  if (
    message.includes(
      'RENEWAL_REQUIRES_ACTIVE_PROFILE',
    )
  ) {
    return {
      status: 409,
      body: {
        error:
          'Renewal payment requires an active profile.',
      },
    };
  }

  if (
    message.includes(
      'PROFILE_NOT_FOUND',
    )
  ) {
    return {
      status: 404,
      body: {
        error:
          'The requested DIPO profile could not be found.',
      },
    };
  }

  if (
    message.includes(
      'AUTHENTICATION_REQUIRED',
    )
  ) {
    return {
      status: 401,
      body: {
        error:
          'Authentication required.',
      },
    };
  }

  if (
    message.includes(
      'INVALID_PLAN',
    )
  ) {
    return {
      status: 400,
      body: {
        error:
          'Invalid payment plan.',
      },
    };
  }

  if (
    message.includes(
      'INVALID_PAYMENT_TYPE',
    )
  ) {
    return {
      status: 400,
      body: {
        error:
          'Invalid payment type.',
      },
    };
  }

  if (
    message.includes(
      'INVALID_PAYMENT_REFERENCE',
    ) ||
    message.includes(
      'PAYMENT_REFERENCE_TOO_LONG',
    ) ||
    message.includes(
      'INVALID_PAYMENT_REFERENCE_FORMAT',
    )
  ) {
    return {
      status: 400,
      body: {
        error:
          'Please enter a valid UTR / Payment Reference.',
      },
    };
  }

  return null;
}

/* ------------------------------------------------------------
   POST
   ------------------------------------------------------------ */

export async function POST(
  request,
) {
  try {
    /* --------------------------------------------------------
       1. Basic request validation
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
       
       Authentication alone is not enough for a browser-facing
       mutation endpoint.
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
       3. Content-Type enforcement
       -------------------------------------------------------- */

    const contentType =
      getContentType(request);

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
       -------------------------------------------------------- */

    const rateLimitKey =
      getRequestRateLimitKey(
        request,
        'payment-submit',
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
            'Too many payment submissions. Please try again later.',
        },
        {
          status: 429,
          retryAfter:
            rateLimit.retryAfter,
        },
      );
    }

    /* --------------------------------------------------------
       5. Read JSON safely
       --------------------------------------------------------
       
       Never call request.json() directly here.
       
       readJsonBody():
       - checks Content-Length
       - reads actual bytes
       - rejects oversized bodies
       - safely parses JSON
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
       6. Top-level payload validation
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
            'Invalid payment request.',
        },
        {
          status: 400,
        },
      );
    }

    const body =
      parsed.body;

    /* --------------------------------------------------------
       7. Read only expected fields
       --------------------------------------------------------
       
       Unknown fields are deliberately ignored.
       
       This prevents accidental future trust of client fields
       such as:
       
       amount
       status
       verified
       owner_id
       user_id
       payment_id
       verified_by
       -------------------------------------------------------- */

    const profileId =
      typeof body.profileId ===
      'string'
        ? body.profileId.trim()
        : '';

    const plan =
      typeof body.plan ===
      'string'
        ? body.plan.trim()
        : '';

    const paymentType =
      typeof body.paymentType ===
      'string'
        ? body.paymentType.trim()
        : '';

    const paymentReference =
      normalizePaymentReference(
        body.paymentReference,
      );

    /* --------------------------------------------------------
       8. Profile ID validation
       --------------------------------------------------------
       
       The RPC must still verify ownership.
       
       This validation only prevents malformed input from
       reaching the database.
       -------------------------------------------------------- */

    if (!profileId) {
      return secureJson(
        {
          error:
            'Profile is required.',
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Supabase profile IDs are UUIDs.
     *
     * Validate format before calling the RPC.
     */
    const UUID_PATTERN =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (
      !UUID_PATTERN.test(
        profileId,
      )
    ) {
      return secureJson(
        {
          error:
            'Invalid profile.',
        },
        {
          status: 400,
        },
      );
    }

    /* --------------------------------------------------------
       9. Plan validation
       -------------------------------------------------------- */

    if (
      !ALLOWED_PLANS.has(plan)
    ) {
      return secureJson(
        {
          error:
            'Invalid plan.',
        },
        {
          status: 400,
        },
      );
    }

    /* --------------------------------------------------------
       10. Payment type validation
       -------------------------------------------------------- */

    if (
      !ALLOWED_PAYMENT_TYPES.has(
        paymentType,
      )
    ) {
      return secureJson(
        {
          error:
            'Invalid payment type.',
        },
        {
          status: 400,
        },
      );
    }

    /* --------------------------------------------------------
       11. Payment reference validation
       -------------------------------------------------------- */

    if (
      paymentReference.length <
        6 ||
      paymentReference.length >
        80 ||
      !/^[A-Z0-9][A-Z0-9_./-]*$/.test(
        paymentReference,
      )
    ) {
      return secureJson(
        {
          error:
            'Please enter a valid UTR / Payment Reference.',
        },
        {
          status: 400,
        },
      );
    }

    /* --------------------------------------------------------
       12. Authenticate server-side
       -------------------------------------------------------- */

    const supabase =
      await createClient();

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      return secureJson(
        {
          error:
            'Authentication required.',
        },
        {
          status: 401,
        },
      );
    }

    /* --------------------------------------------------------
       13. Submit through authoritative RPC
       --------------------------------------------------------
       
       IMPORTANT:
       
       profileId comes from the browser, but it does NOT grant
       ownership.
       
       The DB RPC must enforce:
       
       auth.uid()
       -> profile owner
       -> profile lifecycle
       -> payment lifecycle
       -> duplicate UTR protection
       -> amount
       -> transaction integrity
       -------------------------------------------------------- */

    const {
      data,
      error,
    } =
      await supabase.rpc(
        'submit_payment_claim',
        {
          p_profile_id:
            profileId,

          p_payment_type:
            paymentType,

          p_plan:
            plan,

          p_payment_reference:
            paymentReference,
        },
      );

    /* --------------------------------------------------------
       14. Handle RPC/database errors safely
       -------------------------------------------------------- */

    if (error) {
      const known =
        getRpcErrorResponse(
          error,
        );

      if (known) {
        return secureJson(
          known.body,
          {
            status:
              known.status,
          },
        );
      }

      /*
       * Server logs contain enough information for debugging,
       * but browser response remains generic.
       */
      console.error(
        'Payment submission RPC failed:',
        {
          userId:
            user.id,

          profileId,

          paymentType,

          plan,

          code:
            error.code ||
            null,

          message:
            error.message ||
            null,

          details:
            error.details ||
            null,

          hint:
            error.hint ||
            null,
        },
      );

      return secureJson(
        {
          error:
            'Payment submission could not be completed. Please try again.',
        },
        {
          status: 500,
        },
      );
    }

    /* --------------------------------------------------------
       15. Defensive RPC result validation
       -------------------------------------------------------- */

    if (
      !data ||
      typeof data !==
        'object'
    ) {
      console.error(
        'Payment submission RPC returned an invalid result:',
        {
          userId:
            user.id,
          profileId,
        },
      );

      return secureJson(
        {
          error:
            'Payment submission could not be confirmed. Please try again.',
        },
        {
          status: 500,
        },
      );
    }

    /*
     * The RPC should always return an ID for a successful
     * payment claim.
     */
    if (!data.id) {
      console.error(
        'Payment submission RPC returned no payment ID:',
        {
          userId:
            user.id,
          profileId,
        },
      );

      return secureJson(
        {
          error:
            'Payment submission could not be confirmed. Please contact support.',
        },
        {
          status: 500,
        },
      );
    }

    /* --------------------------------------------------------
       16. Safe response projection
       --------------------------------------------------------
       
       Do NOT return the complete database object.
       
       Never expose:
       - user_id
       - verified_by
       - internal snapshots
       - notes
       - private metadata
       -------------------------------------------------------- */

    const payment = {
      id:
        data.id,

      status:
        data.status ||
        'pending',

      paymentType:
        data.payment_type ||
        paymentType,

      plan:
        data.plan ||
        plan,

      amount:
        data.amount ??
        null,

      createdAt:
        data.created_at ||
        null,
    };

    /* --------------------------------------------------------
       17. Successful response
       -------------------------------------------------------- */

    return secureJson(
      {
        success: true,
        payment,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    /* --------------------------------------------------------
       18. Final fail-closed boundary
       -------------------------------------------------------- */

    console.error(
      'Payment submission API error:',
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
          'Something went wrong while submitting the payment.',
      },
      {
        status: 500,
      },
    );
  }
}