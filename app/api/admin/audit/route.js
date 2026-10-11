import { NextResponse } from 'next/server';

import {
  requireAAL2Admin,
} from '@/lib/auth/require-admin';

import {
  getAuditLogs,
} from '@/lib/admin/admin-audit';

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

const MAX_BODYLESS_QUERY_LENGTH = 100;
const MAX_LIMIT = 100;

const ALLOWED_SORTS = new Set([
  'created_at',
]);

const ALLOWED_DIRECTIONS = new Set([
  'asc',
  'desc',
]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
          'Pragma':
            'no-cache',
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

function cleanText(
  value,
) {
  if (
    typeof value !== 'string'
  ) {
    return '';
  }

  return value
    .trim()
    .slice(
      0,
      MAX_BODYLESS_QUERY_LENGTH,
    );
}

function cleanUuid(
  value,
) {
  const clean =
    typeof value === 'string'
      ? value.trim()
      : '';

  if (
    !clean ||
    clean.length > 36 ||
    !UUID_PATTERN.test(clean)
  ) {
    return '';
  }

  return clean;
}

function cleanLimit(
  value,
) {
  if (
    typeof value !== 'string' ||
    value.trim() === ''
  ) {
    return 50;
  }

  const number =
    Number(value);

  if (
    !Number.isInteger(number) ||
    number < 1 ||
    number > MAX_LIMIT
  ) {
    return null;
  }

  return number;
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
   *
   * Audit logs contain sensitive administrative activity.
   */
  const rateLimit =
    checkRateLimit(
      getRequestRateLimitKey(
        request,
        'admin-audit-read',
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
   * The browser cannot tell this API:
   * "I am admin."
   *
   * Authorization is determined from the authenticated
   * server-side session.
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
   * 4. SAFE QUERY PARAMETERS
   * ---------------------------------------------------------
   */
  const url =
    new URL(
      request.url,
    );

  const action =
    cleanText(
      url.searchParams.get(
        'action',
      ),
    );

  const entityType =
    cleanText(
      url.searchParams.get(
        'entityType',
      ),
    );

  const entityId =
    cleanUuid(
      url.searchParams.get(
        'entityId',
      ),
    );

  const actorUserId =
    cleanUuid(
      url.searchParams.get(
        'actorUserId',
      ),
    );

  const search =
    cleanText(
      url.searchParams.get(
        'search',
      ),
    );

  const limit =
    cleanLimit(
      url.searchParams.get(
        'limit',
      ),
    );

  const sort =
    (
      url.searchParams.get(
        'sort',
      ) || 'created_at'
    )
      .trim()
      .toLowerCase();

  const direction =
    (
      url.searchParams.get(
        'direction',
      ) || 'desc'
    )
      .trim()
      .toLowerCase();

  /*
   * ---------------------------------------------------------
   * 5. REJECT INVALID UUID FILTERS
   * ---------------------------------------------------------
   *
   * Empty is allowed because the filters are optional.
   * A non-empty malformed UUID is rejected.
   */
  const rawEntityId =
    url.searchParams.get(
      'entityId',
    );

  if (
    rawEntityId &&
    !entityId
  ) {
    return secureJson(
      {
        error:
          'Invalid entity ID.',
      },
      {
        status: 400,
      },
    );
  }

  const rawActorUserId =
    url.searchParams.get(
      'actorUserId',
    );

  if (
    rawActorUserId &&
    !actorUserId
  ) {
    return secureJson(
      {
        error:
          'Invalid actor user ID.',
      },
      {
        status: 400,
      },
    );
  }

  /*
   * ---------------------------------------------------------
   * 6. STRICT SORT VALIDATION
   * ---------------------------------------------------------
   *
   * Never pass an arbitrary client-supplied column directly
   * into the database query.
   */
  if (
    !ALLOWED_SORTS.has(sort)
  ) {
    return secureJson(
      {
        error:
          'Invalid sort field.',
      },
      {
        status: 400,
      },
    );
  }

  if (
    !ALLOWED_DIRECTIONS.has(
      direction,
    )
  ) {
    return secureJson(
      {
        error:
          'Invalid sort direction.',
      },
      {
        status: 400,
      },
    );
  }

  if (limit === null) {
    return secureJson(
      {
        error:
          'Invalid limit.',
      },
      {
        status: 400,
      },
    );
  }

  /*
   * ---------------------------------------------------------
   * 7. READ AUDIT LOGS
   * ---------------------------------------------------------
   *
   * Existing lib/admin/admin-audit.js remains the data
   * access layer. This route only exposes it after the
   * stronger API authorization checks above.
   */
  try {
    const result =
      await getAuditLogs({
        action,
        entityType,
        entityId:
          entityId || null,
        actorUserId:
          actorUserId || null,
        search,
        limit,
        sort,
        direction,
      });

    /*
     * The helper has its own authorization check as a
     * second defense layer.
     */
    if (
      !result?.authorized
    ) {
      return secureJson(
        {
          error:
            result?.error ||
            'Administrator authorization required.',
        },
        {
          status:
            Number.isInteger(
              result?.status,
            )
              ? result.status
              : 403,
        },
      );
    }

    if (
      result.status >= 500
    ) {
      return secureJson(
        {
          error:
            'Audit logs are temporarily unavailable.',
        },
        {
          status: 500,
        },
      );
    }

    /*
     * -------------------------------------------------------
     * 8. SAFE RESPONSE
     * -------------------------------------------------------
     *
     * Only normalized audit records are returned.
     * Internal authorization/session objects are never sent.
     */
    const logs =
      Array.isArray(
        result.logs,
      )
        ? result.logs
        : [];

    return secureJson(
      {
        success: true,

        logs,

        count:
          logs.length,

        filters: {
          action,
          entityType,
          entityId:
            entityId || null,
          actorUserId:
            actorUserId || null,
          search,
          limit,
          sort,
          direction,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /*
     * -------------------------------------------------------
     * 9. SAFE ERROR HANDLING
     * -------------------------------------------------------
     *
     * Database errors, stack traces and internal details
     * never reach the browser.
     */
    console.error(
      'Admin audit API error:',
      error,
    );

    return secureJson(
      {
        error:
          'Unable to load audit logs.',
      },
      {
        status: 500,
      },
    );
  }
}