import { NextResponse } from 'next/server';

import { createProfile } from '@/lib/profile/create-profile';

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

/**
 * WORLDWIDE DIPO
 * ------------------------------------------------------------
 * Profile Creation API
 *
 * POST /api/profile/create
 *
 * SECURITY FLOW
 * ------------------------------------------------------------
 *
 * Browser
 *   ↓
 * Origin validation
 *   ↓
 * JSON validation
 *   ↓
 * Body-size protection
 *   ↓
 * Rate limiting
 *   ↓
 * Strict input projection
 *   ↓
 * createProfile()
 *   ↓
 * authenticated Supabase user
 *   ↓
 * owner uniqueness
 *   ↓
 * slug uniqueness
 *   ↓
 * database constraints / RLS
 *
 * IMPORTANT
 * ------------------------------------------------------------
 *
 * The route does NOT decide ownership.
 *
 * createProfile() resolves the authenticated Supabase user
 * server-side and writes owner_id from auth.uid().
 *
 * Client-controlled owner_id is therefore never accepted.
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
   Allowed fields
   ------------------------------------------------------------

   Keep this explicit.

   This prevents mass-assignment if the client sends fields
   that later get added to the profiles table.
   ------------------------------------------------------------ */

const ALLOWED_FIELDS = new Set([
  'name',
  'slug',
  'profession',
  'headline',
  'bio',
  'location',
  'category',
  'about',
]);

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
   Content-Type helper
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
   Strict payload projection
   ------------------------------------------------------------ */

function projectProfileInput(
  body,
) {
  const projected = {};

  for (
    const field of ALLOWED_FIELDS
  ) {
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        field,
      )
    ) {
      projected[field] =
        body[field];
    }
  }

  return projected;
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
       3. JSON-only request
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

       Profile creation should be rare.

       This limits automated account/profile creation attempts
       before the database is touched.
       -------------------------------------------------------- */

    const rateLimitKey =
      getRequestRateLimitKey(
        request,
        'profile-create',
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
            'Too many profile creation attempts. Please try again later.',
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
       6. Validate JSON shape
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
            'Invalid profile data.',
        },
        {
          status: 400,
        },
      );
    }

    /* --------------------------------------------------------
       7. Mass-assignment protection
       --------------------------------------------------------

       Only known profile creation fields are passed into the
       canonical profile service.

       Fields such as:

       owner_id
       user_id
       id
       status
       plan
       expires_at
       verified
       payment_status

       are discarded.
       -------------------------------------------------------- */

    const input =
      projectProfileInput(
        parsed.body,
      );

    /* --------------------------------------------------------
       8. Basic payload presence
       -------------------------------------------------------- */

    if (
      Object.keys(input)
        .length === 0
    ) {
      return secureJson(
        {
          error:
            'Profile data is required.',
        },
        {
          status: 400,
        },
      );
    }

    /* --------------------------------------------------------
       9. Canonical profile creation service
       --------------------------------------------------------

       createProfile() remains authoritative for:

       - field validation
       - authenticated user lookup
       - one-profile-per-owner rule
       - slug availability
       - draft status
       - Starter plan
       - DB insertion
       -------------------------------------------------------- */

    const result =
      await createProfile(
        input,
      );

    /* --------------------------------------------------------
       10. Business validation / conflict
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
                'Unable to create your profile.',
            },
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
      !result.profile ||
      typeof result.profile !==
        'object' ||
      !result.profile.id ||
      !result.profile.slug
    ) {
      console.error(
        'Profile create API received invalid success payload.',
      );

      return secureJson(
        {
          error:
            'Profile could not be confirmed. Please try again.',
        },
        {
          status: 500,
        },
      );
    }

    /* --------------------------------------------------------
       12. Safe profile projection
       --------------------------------------------------------

       Never return owner_id or private/internal fields.
       -------------------------------------------------------- */

    const profile = {
      id:
        result.profile.id,

      name:
        result.profile.name ||
        null,

      slug:
        result.profile.slug ||
        null,

      profession:
        result.profile.profession ||
        null,

      headline:
        result.profile.headline ||
        null,

      bio:
        result.profile.bio ||
        null,

      location:
        result.profile.location ||
        null,

      category:
        result.profile.category ||
        null,

      about:
        result.profile.about ||
        null,

      plan:
        result.profile.plan ||
        'Starter',

      status:
        result.profile.status ||
        'draft',

      created_at:
        result.profile.created_at ||
        null,

      updated_at:
        result.profile.updated_at ||
        null,
    };

    /* --------------------------------------------------------
       13. Successful creation
       -------------------------------------------------------- */

    return secureJson(
      {
        success: true,
        profile,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    /* --------------------------------------------------------
       14. Fail closed
       -------------------------------------------------------- */

    console.error(
      'Create profile API error:',
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
     * Never expose:
     * - database errors
     * - Supabase internals
     * - stack traces
     * - SQL details
     * - environment information
     */

    return secureJson(
      {
        error:
          'Unable to process profile creation.',
      },
      {
        status: 500,
      },
    );
  }
}