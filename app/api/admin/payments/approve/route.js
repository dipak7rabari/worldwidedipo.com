import { NextResponse } from 'next/server';

import {
  approvePayment,
} from '@/lib/admin/payment-actions';

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

const MAX_BODY_BYTES = 4096;

/*
 * UUID validation.
 *
 * Payment IDs in Worldwide DIPO are UUID values.
 * Keeping validation strict prevents arbitrary strings
 * from reaching the database/RPC layer.
 */
const PAYMENT_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

export async function POST(request) {
  /*
   * ---------------------------------------------------------
   * 1. SAME-ORIGIN PROTECTION
   * ---------------------------------------------------------
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
   * Payment approval is a high-risk operation.
   * Keep the limit intentionally low.
   */
  const rateLimit =
    checkRateLimit(
      getRequestRateLimitKey(
        request,
        'admin-payment-approve',
      ),
      {
        maxRequests: 20,
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
   * 3. ADMIN + PAYMENT AUTHORIZATION
   * ---------------------------------------------------------
   *
   * This verifies:
   *
   * - authenticated Supabase user
   * - approved administrator email
   * - active admin_users record
   * - allowed role
   * - AAL2
   * - payment-management permission
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
   * 4. REQUEST SIZE PROTECTION
   * ---------------------------------------------------------
   */
  const contentLength =
    request.headers.get(
      'content-length',
    );

  if (contentLength) {
    const bytes =
      Number(contentLength);

    if (
      Number.isFinite(bytes) &&
      bytes > MAX_BODY_BYTES
    ) {
      return secureJson(
        {
          error:
            'Request is too large.',
        },
        {
          status: 413,
        },
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * 5. PARSE JSON SAFELY
   * ---------------------------------------------------------
   */
  let body;

  try {
    body =
      await request.json();
  } catch {
    return secureJson(
      {
        error:
          'Invalid request body.',
      },
      {
        status: 400,
      },
    );
  }

  /*
   * Do not accept arrays, strings or arbitrary objects
   * as the request payload.
   */
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body)
  ) {
    return secureJson(
      {
        error:
          'Invalid request body.',
      },
      {
        status: 400,
      },
    );
  }

  /*
   * ---------------------------------------------------------
   * 6. STRICT PAYMENT ID VALIDATION
   * ---------------------------------------------------------
   */
  const paymentId =
    typeof body.payment_id ===
    'string'
      ? body.payment_id.trim()
      : '';

  if (
    !paymentId ||
    paymentId.length > 36 ||
    !PAYMENT_ID_PATTERN.test(
      paymentId,
    )
  ) {
    return secureJson(
      {
        error:
          'Invalid payment ID.',
      },
      {
        status: 400,
      },
    );
  }

  /*
   * ---------------------------------------------------------
   * 7. APPROVE PAYMENT
   * ---------------------------------------------------------
   *
   * The actual state transition is performed by the
   * server-side payment action / database RPC.
   *
   * The browser never gets direct database write access.
   */
  try {
    const result =
      await approvePayment(
        paymentId,
      );

    if (
      !result?.success
    ) {
      return secureJson(
        {
          error:
            result?.error ||
            'Payment could not be approved.',
        },
        {
          status:
            Number.isInteger(
              result?.status,
            )
              ? result.status
              : 400,
        },
      );
    }

    /*
     * Do not expose internal database/RPC details.
     */
    return secureJson(
      {
        success: true,
        message:
          'Payment approved successfully.',
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /*
     * Server-side logging only.
     *
     * Never send stack traces, SQL errors,
     * Supabase details or environment values
     * to the browser.
     */
    console.error(
      'Admin payment approval error:',
      error,
    );

    return secureJson(
      {
        error:
          'Unable to approve payment.',
      },
      {
        status: 500,
      },
    );
  }
}