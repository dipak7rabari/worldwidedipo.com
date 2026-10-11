import { NextResponse } from 'next/server';

import {
  createSupportRequest,
} from '@/lib/support/create-support-request';

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

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

const MAX_BODY_SIZE =
  50 * 1024;

const RATE_LIMIT_MAX = 5;

const RATE_LIMIT_WINDOW_MS =
  60 * 1000;

function json(
  data,
  status = 200,
) {
  const response =
    NextResponse.json(
      data,
      { status },
    );

  applyApiSecurityHeaders(
    response,
  );

  applyNoStore(response);

  return response;
}

export async function POST(
  request,
) {
  try {
    /*
     * --------------------------------------------------
     * 1. Same-origin protection
     * --------------------------------------------------
     */

    const originResult =
      checkOrigin(request);

    if (
      !originResult.ok
    ) {
      return json(
        {
          error:
            'Invalid request origin.',
        },
        403,
      );
    }

    /*
     * --------------------------------------------------
     * 2. Content-Type validation
     * --------------------------------------------------
     */

    const contentType =
      request.headers.get(
        'content-type',
      ) || '';

    if (
      !contentType
        .toLowerCase()
        .startsWith(
          'application/json',
        )
    ) {
      return json(
        {
          error:
            'Content-Type must be application/json.',
        },
        415,
      );
    }

    /*
     * --------------------------------------------------
     * 3. Request-size protection
     * --------------------------------------------------
     */

    const contentLength =
      request.headers.get(
        'content-length',
      );

    if (
      contentLength !== null
    ) {
      const length =
        Number(contentLength);

      if (
        !Number.isFinite(length) ||
        length < 0
      ) {
        return json(
          {
            error:
              'Invalid request size.',
          },
          400,
        );
      }

      if (
        length >
        MAX_BODY_SIZE
      ) {
        return json(
          {
            error:
              'Request is too large.',
          },
          413,
        );
      }
    }

    /*
     * --------------------------------------------------
     * 4. Rate limiting
     * --------------------------------------------------
     *
     * Support endpoints are deliberately stricter
     * because they can otherwise be abused for spam.
     */

    const rateLimit =
      await checkRateLimitAsync(
        getRequestRateLimitKey(
          request,
          'support',
        ),
        {
          maxRequests:
            RATE_LIMIT_MAX,
          windowMs:
            RATE_LIMIT_WINDOW_MS,
        },
      );

    if (
      !rateLimit.allowed
    ) {
      const response =
        json(
          {
            error:
              'Too many support requests. Please try again later.',
          },
          429,
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
     * --------------------------------------------------
     * 5. Bounded JSON parsing
     * --------------------------------------------------
     */

    const parsed =
      await readJsonBody(
        request,
        MAX_BODY_SIZE,
      );

    if (
      !parsed.ok
    ) {
      return json(
        {
          error:
            parsed.error ||
            'Invalid request body.',
        },
        parsed.status ||
          400,
      );
    }

    /*
     * --------------------------------------------------
     * 6. Reject non-object payloads
     * --------------------------------------------------
     */

    if (
      !parsed.body ||
      typeof parsed.body !==
        'object' ||
      Array.isArray(
        parsed.body,
      )
    ) {
      return json(
        {
          error:
            'Invalid request body.',
        },
        400,
      );
    }

    /*
     * --------------------------------------------------
     * 7. Reject prototype-pollution keys
     * --------------------------------------------------
     */

    const dangerousKeys =
      new Set([
        '__proto__',
        'prototype',
        'constructor',
      ]);

    for (
      const key of Object.keys(
        parsed.body,
      )
    ) {
      if (
        dangerousKeys.has(
          key,
        )
      ) {
        return json(
          {
            error:
              'Invalid request fields.',
          },
          400,
        );
      }
    }

    /*
     * --------------------------------------------------
     * 8. Strict input projection
     * --------------------------------------------------
     *
     * Never pass arbitrary client fields into the
     * support service.
     *
     * The service performs its own validation as the
     * second security boundary.
     */

    const input = {
      subject:
        parsed.body.subject,
      message:
        parsed.body.message,
      category:
        parsed.body.category,
    };

    /*
     * --------------------------------------------------
     * 9. Create authenticated support request
     * --------------------------------------------------
     *
     * createSupportRequest() independently verifies
     * the Supabase session and associates the ticket
     * with the authenticated user.
     */

    const result =
      await createSupportRequest(
        input,
      );

    if (
      !result.ok
    ) {
      return json(
        {
          error:
            result.error ||
            'Unable to create support request.',
        },
        result.status ||
          400,
      );
    }

    /*
     * --------------------------------------------------
     * 10. Safe response projection
     * --------------------------------------------------
     *
     * Do not blindly return whatever the service
     * happens to return in the future.
     */

    const supportRequest =
      result.data;

    if (
      !supportRequest ||
      typeof supportRequest !==
        'object'
    ) {
      console.error(
        'Invalid support service response.',
      );

      return json(
        {
          error:
            'Unable to create support request.',
        },
        500,
      );
    }

    return json(
      {
        success: true,

        request: {
          id:
            supportRequest.id,

          subject:
            supportRequest.subject,

          message:
            supportRequest.message,

          category:
            supportRequest.category,

          status:
            supportRequest.status,

          admin_reply:
            supportRequest.admin_reply ??
            null,

          created_at:
            supportRequest.created_at,

          updated_at:
            supportRequest.updated_at,
        },
      },
      201,
    );
  } catch (error) {
    /*
     * Never expose database, Supabase,
     * validation or server internals.
     */

    console.error(
      'Support API error:',
      error,
    );

    return json(
      {
        error:
          'Unable to process support request.',
      },
      500,
    );
  }
}