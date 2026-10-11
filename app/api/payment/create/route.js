import { NextResponse } from 'next/server';

import { checkOrigin } from '@/lib/security/origin-check';
import {
  applyApiSecurityHeaders,
  applyNoStore,
} from '@/lib/security/security-headers';
import {
  getRequestRateLimitKey,
  checkRateLimitAsync,
} from '@/lib/security/rate-limit';
import {
  readJsonBody,
} from '@/lib/security/request-body';

import {
  createInitialPaymentClaim,
} from '@/lib/payments/create-payment-claim';

/**
 * WORLDWIDE DIPO
 * ------------------------------------------------------------
 * Initial Payment Creation API
 *
 * Route:
 * POST /api/payment/create
 *
 * SECURITY MODEL
 * ------------------------------------------------------------
 * Browser
 *   -> origin validation
 *   -> request size/content validation
 *   -> IP rate limit
 *   -> authenticated Supabase session
 *   -> authenticated owner's profile
 *   -> server-side plan validation
 *   -> authoritative payment RPC
 *   -> DB constraints / transaction
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * This route NEVER:
 *
 * - accepts profile_id from the client
 * - accepts amount from the client
 * - inserts directly into public.payments
 * - activates a profile
 * - trusts client payment status
 *
 * The database RPC remains the authoritative mutation path.
 */

/* ------------------------------------------------------------
   Hard limits
   ------------------------------------------------------------ */

/*
 * Payment creation is intentionally much stricter than
 * ordinary public APIs because repeated claims are sensitive.
 */
const MAX_BODY_SIZE = 50 * 1024;

/*
 * Per-IP protection.
 *
 * The application-level rate limiter is an additional layer;
 * database uniqueness / lifecycle rules remain authoritative.
 *
 * 5 attempts per minute is intentionally conservative because
 * a legitimate user normally submits this request once.
 */
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

/*
 * Only JSON requests are accepted.
 */
const JSON_CONTENT_TYPE = 'application/json';

/* ------------------------------------------------------------
   Response helpers
   ------------------------------------------------------------ */

function secureJson(
  body,
  {
    status = 200,
    retryAfter = null,
  } = {},
) {
  const response = NextResponse.json(
    body,
    { status },
  );

  applyApiSecurityHeaders(response);
  applyNoStore(response);

  /*
   * Do not expose rate-limit information unless the request
   * actually hit the limit.
   */
  if (
    Number.isInteger(retryAfter) &&
    retryAfter > 0
  ) {
    response.headers.set(
      'Retry-After',
      String(retryAfter),
    );
  }

  return response;
}

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
   POST
   ------------------------------------------------------------ */

export async function POST(request) {
  /*
   * Keep the whole route fail-closed.
   *
   * No internal error details are returned to the browser.
   */
  try {
    /* --------------------------------------------------------
       1. Validate request object
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
       2. Origin protection
       --------------------------------------------------------
       
       Origin/Referer validation is performed before consuming
       the request body or touching the payment service.
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
       3. Content-Type protection
       --------------------------------------------------------
       
       Prevent form/text/multipart payloads from reaching
       payment parsing logic.
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
       --------------------------------------------------------
       
       This protects the endpoint before authentication and
       database work.
       
       IMPORTANT:
       This is not the source of payment authorization.
       The authenticated Supabase user + DB RPC remain the
       authoritative security boundary.
       -------------------------------------------------------- */

    const rateLimitKey =
      getRequestRateLimitKey(
        request,
        'payment-create',
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
            'Too many payment attempts. Please try again later.',
        },
        {
          status: 429,
          retryAfter:
            rateLimit.retryAfter,
        },
      );
    }

    /* --------------------------------------------------------
       5. Body-size protection
       --------------------------------------------------------
       
       Content-Length is checked first and the actual body is
       also measured by readJsonBody(), protecting requests
       where Content-Length is missing or unreliable.
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
       6. Reject malformed top-level JSON shapes
       --------------------------------------------------------
       
       The payment service expects an object:
       
       {
         plan,
         payment_reference
       }
       
       Arrays, null and primitive JSON values should never
       reach business logic.
       -------------------------------------------------------- */

    if (
      !parsed.body ||
      typeof parsed.body !== 'object' ||
      Array.isArray(parsed.body)
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

    /* --------------------------------------------------------
       7. Explicitly ignore client-controlled security fields
       --------------------------------------------------------
       
       Do NOT mutate the input object here.
       
       createInitialPaymentClaim() only consumes:
       - plan
       - payment_reference
       
       It resolves:
       - authenticated user
       - profile
       - amount
       - payment type
       - payment lifecycle
       
       server-side.
       -------------------------------------------------------- */

    const result =
      await createInitialPaymentClaim(
        parsed.body,
      );

    /* --------------------------------------------------------
       8. Business/security result
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
                'Unable to process payment claim.',
            },
        },
        {
          status,
        },
      );
    }

    /* --------------------------------------------------------
       9. Defensive response validation
       --------------------------------------------------------
       
       Never return a successful response if the service
       accidentally returns an incomplete payment object.
       -------------------------------------------------------- */

    if (
      !result.payment ||
      typeof result.payment !==
        'object' ||
      !result.payment.id
    ) {
      console.error(
        'Payment create route received invalid success payload.',
      );

      return secureJson(
        {
          error:
            'Payment claim could not be confirmed. Please try again.',
        },
        {
          status: 500,
        },
      );
    }

    /* --------------------------------------------------------
       10. Successful payment claim
       --------------------------------------------------------
       
       The service already performs a safe projection of the
       payment object. Return only that projection.
       -------------------------------------------------------- */

    return secureJson(
      {
        success: true,
        payment:
          result.payment,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    /* --------------------------------------------------------
       11. Fail closed
       -------------------------------------------------------- */

    console.error(
      'Payment create API error:',
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
     * Never return:
     * - stack traces
     * - Supabase errors
     * - PostgreSQL errors
     * - environment values
     * - internal function names
     * - request contents
     */

    return secureJson(
      {
        error:
          'Unable to process payment claim.',
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * Explicitly declare the runtime so the route remains on the
 * standard Node.js server runtime used by the existing Supabase
 * server client and project architecture.
 */
export const runtime = 'nodejs';

/*
 * Payment creation must never be statically optimized or cached.
 */
export const dynamic = 'force-dynamic';