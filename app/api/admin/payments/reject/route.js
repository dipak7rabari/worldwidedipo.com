import { NextResponse } from 'next/server';

import {
  rejectPayment,
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

const MAX_BODY_BYTES = 8 * 1024;
const MAX_NOTES_LENGTH = 1000;
const MAX_PAYMENT_ID_LENGTH = 36;

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

function isValidPaymentId(
  value,
) {
  return (
    typeof value === 'string' &&
    value.length <=
      MAX_PAYMENT_ID_LENGTH &&
    PAYMENT_ID_PATTERN.test(value)
  );
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
   * Payment rejection is a sensitive admin operation.
   */
  const rateLimit =
    checkRateLimit(
      getRequestRateLimitKey(
        request,
        'admin-payment-reject',
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
   * requirePaymentAdmin() verifies:
   *
   * - authenticated Supabase user
   * - approved administrator email
   * - active admin_users record
   * - valid admin role
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
    const bodySize =
      Number(contentLength);

    if (
      Number.isFinite(bodySize) &&
      bodySize > MAX_BODY_BYTES
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
   * 5. SAFE JSON PARSING
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
    !isValidPaymentId(
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
   * 7. ADMIN NOTE VALIDATION
   * ---------------------------------------------------------
   *
   * Notes are optional.
   * They are limited to 1000 characters.
   *
   * We do not render these notes as HTML here.
   * The UI must render them as text, never with
   * dangerouslySetInnerHTML.
   */
  const notes =
    typeof body.notes ===
    'string'
      ? body.notes
          .trim()
          .slice(
            0,
            MAX_NOTES_LENGTH,
          )
      : '';

  /*
   * If notes was supplied with the wrong type,
   * reject rather than silently converting it.
   */
  if (
    body.notes !== undefined &&
    body.notes !== null &&
    typeof body.notes !== 'string'
  ) {
    return secureJson(
      {
        error:
          'Invalid rejection note.',
      },
      {
        status: 400,
      },
    );
  }

  /*
   * ---------------------------------------------------------
   * 8. REJECT PAYMENT
   * ---------------------------------------------------------
   *
   * The actual database state transition remains inside
   * rejectPayment(), which uses the protected Supabase RPC.
   */
  try {
    const result =
      await rejectPayment(
        paymentId,
        notes,
      );

    if (
      !result?.success
    ) {
      return secureJson(
        {
          error:
            result?.error ||
            'Payment could not be rejected.',
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
     * -------------------------------------------------------
     * 9. SAFE SUCCESS RESPONSE
     * -------------------------------------------------------
     */
    return secureJson(
      {
        success: true,
        message:
          'Payment rejected successfully.',
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /*
     * Internal details stay server-side.
     */
    console.error(
      'Admin payment rejection error:',
      error,
    );

    return secureJson(
      {
        error:
          'Unable to reject payment.',
      },
      {
        status: 500,
      },
    );
  }
}