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
  updateMyProfile,
} from '@/lib/profile/update-profile';

/**
 * WORLDWIDE DIPO
 * ------------------------------------------------------------
 * Authenticated Profile Update API
 *
 * POST /api/profile/update
 *
 * SECURITY FLOW
 * ------------------------------------------------------------
 *
 * Browser
 *   ↓
 * Origin validation
 *   ↓
 * JSON / body-size validation
 *   ↓
 * Rate limiting
 *   ↓
 * Strict object validation
 *   ↓
 * updateMyProfile()
 *   ↓
 * auth.uid()
 *   ↓
 * owner_id match
 *   ↓
 * profile-edit validation
 *   ↓
 * protected-field filtering
 *   ↓
 * database update
 *
 * IMPORTANT
 * ------------------------------------------------------------
 *
 * This route does NOT trust the browser for ownership.
 *
 * updateMyProfile() resolves the authenticated Supabase user
 * and performs the final:
 *
 *   profile.owner_id === auth.uid()
 *
 * check before updating.
 *
 * This route is therefore only the HTTP security boundary;
 * the profile service remains the authorization boundary.
 */

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------
   Configuration
   ------------------------------------------------------------ */

const MAX_BODY_SIZE =
  50 * 1024;

const RATE_LIMIT_MAX_REQUESTS =
  30;

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
   Payload validation
   ------------------------------------------------------------ */

function isPlainObject(
  value,
) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(
      value,
    );

  return (
    prototype ===
      Object.prototype ||
    prototype === null
  );
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

       Profile updates modify authenticated user data.
       Cross-origin browser mutations must be rejected.
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
       3. JSON-only enforcement
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

       Profile editing is a legitimate repeated action, so
       this is intentionally higher than profile creation.

       It still protects the database from:
       - automated update floods
       - malicious polling/mutation
       - accidental infinite-save loops
       -------------------------------------------------------- */

    const rateLimitKey =
      getRequestRateLimitKey(
        request,
        'profile-update',
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
            'Too many profile update requests. Please try again later.',
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
       --------------------------------------------------------

       Do not use request.json() directly.

       readJsonBody() validates both:
       - advertised Content-Length
       - actual UTF-8 body size
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
       6. Reject arrays / primitives / null
       -------------------------------------------------------- */

    if (
      !isPlainObject(
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

    const input =
      parsed.body;

    /* --------------------------------------------------------
       7. Empty update protection
       -------------------------------------------------------- */

    if (
      Object.keys(input)
        .length === 0
    ) {
      return secureJson(
        {
          errors: {
            form:
              'No profile changes were provided.',
          },
        },
        {
          status: 400,
        },
      );
    }

    /* --------------------------------------------------------
       8. Reject dangerous prototype keys
       --------------------------------------------------------

       updateMyProfile() already uses an explicit protected
       field model, but rejecting prototype-pollution style
       keys at the HTTP boundary gives another defensive layer.
       -------------------------------------------------------- */

    const dangerousKeys =
      new Set([
        '__proto__',
        'prototype',
        'constructor',
      ]);

    for (
      const key of
        Object.keys(input)
    ) {
      if (
        dangerousKeys.has(key)
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
    }

    /* --------------------------------------------------------
       9. Reject client-side authorization fields
       --------------------------------------------------------

       updateMyProfile() already protects these fields, but
       rejecting them here makes the API contract explicit.

       The browser should never even attempt to provide them.
       -------------------------------------------------------- */

    const forbiddenFields =
      new Set([
        'id',
        'owner_id',
        'ownerId',
        'user_id',
        'userId',

        'status',
        'plan',

        'expires_at',
        'expiresAt',

        'deletion_scheduled_at',
        'deletionScheduledAt',

        'verified',
        'verified_by',
        'verifiedBy',
        'verified_at',
        'verifiedAt',

        'payment_status',
        'paymentStatus',

        'created_at',
        'createdAt',

        'updated_at',
        'updatedAt',
      ]);

    for (
      const key of
        Object.keys(input)
    ) {
      if (
        forbiddenFields.has(
          key,
        )
      ) {
        return secureJson(
          {
            errors: {
              form:
                'Protected profile fields cannot be changed here.',
            },
          },
          {
            status: 400,
          },
        );
      }
    }

    /* --------------------------------------------------------
       10. Canonical update service
       --------------------------------------------------------

       Do not duplicate authorization or profile validation
       here.

       updateMyProfile() is responsible for:

       - authentication
       - loading the current owner profile
       - owner_id matching
       - pending-payment identity lock
       - profile edit validation
       - protected field filtering
       - slug protection
       - database update
       -------------------------------------------------------- */

    const result =
      await updateMyProfile(
        input,
      );

    /* --------------------------------------------------------
       11. Business / validation failure
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
                'Unable to save your profile.',
            },
        },
        {
          status,
        },
      );
    }

    /* --------------------------------------------------------
       12. Defensive success validation
       -------------------------------------------------------- */

    if (
      !result.profile ||
      typeof result.profile !==
        'object' ||
      !result.profile.id
    ) {
      console.error(
        'Profile update API received invalid success payload.',
      );

      return secureJson(
        {
          error:
            'Profile update could not be confirmed. Please try again.',
        },
        {
          status: 500,
        },
      );
    }

    /* --------------------------------------------------------
       13. Safe response projection
       --------------------------------------------------------

       Return only fields the profile editor needs.

       Never return:
       - owner_id
       - internal authorization metadata
       - payment verification actor
       - private admin information
       -------------------------------------------------------- */

    const profile =
      projectPublicEditableProfile(
        result.profile,
      );

    /* --------------------------------------------------------
       14. Successful update
       -------------------------------------------------------- */

    return secureJson(
      {
        success: true,
        profile,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /* --------------------------------------------------------
       15. Final fail-closed boundary
       -------------------------------------------------------- */

    console.error(
      'Profile update API error:',
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
     * Never expose raw:
     * - Supabase errors
     * - PostgreSQL errors
     * - SQL details
     * - stack traces
     * - environment information
     */

    return secureJson(
      {
        error:
          'Unable to process profile update.',
      },
      {
        status: 500,
      },
    );
  }
}

/* ------------------------------------------------------------
   Safe profile response projection
   ------------------------------------------------------------ */

function projectPublicEditableProfile(
  profile,
) {
  return {
    id:
      profile.id,

    name:
      profile.name ||
      null,

    slug:
      profile.slug ||
      null,

    profession:
      profile.profession ||
      null,

    headline:
      profile.headline ||
      null,

    bio:
      profile.bio ||
      null,

    avatar_url:
      profile.avatar_url ||
      null,

    location:
      profile.location ||
      null,

    category:
      profile.category ||
      null,

    about:
      profile.about ||
      null,

    links:
      profile.links ||
      null,

    social_links:
      profile.social_links ||
      null,

    skills:
      profile.skills ||
      null,

    services:
      profile.services ||
      null,

    experience:
      profile.experience ||
      null,

    education:
      profile.education ||
      null,

    projects:
      profile.projects ||
      null,

    gallery:
      profile.gallery ||
      null,

    business:
      profile.business ||
      null,

    plan:
      profile.plan ||
      null,

    status:
      profile.status ||
      null,

    expires_at:
      profile.expires_at ||
      null,

    deletion_scheduled_at:
      profile.deletion_scheduled_at ||
      null,

    created_at:
      profile.created_at ||
      null,

    updated_at:
      profile.updated_at ||
      null,
  };
}