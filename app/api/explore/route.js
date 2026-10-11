import { NextResponse } from 'next/server';

import {
  getExploreProfiles,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  normalizeFilter,
  normalizeInteger,
} from '@/lib/explore/get-explore-profiles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MAX_QUERY_LENGTH = 80;
const MAX_CATEGORY_LENGTH = 60;
const MAX_OFFSET = 100000;

function securityHeaders() {
  return {
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=()',
  };
}

function jsonResponse(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: securityHeaders(),
  });
}

function methodNotAllowed() {
  return jsonResponse(
    {
      success: false,
      error: 'Method not allowed.',
    },
    405
  );
}

function normalizeRequestValue(value) {
  if (Array.isArray(value)) {
    return value[0] || '';
  }

  return value || '';
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const rawQuery = normalizeRequestValue(
      searchParams.get('q')
    );

    const rawCategory =
      normalizeRequestValue(
        searchParams.get('category')
      );

    const rawLimit =
      normalizeRequestValue(
        searchParams.get('limit')
      );

    const rawOffset =
      normalizeRequestValue(
        searchParams.get('offset')
      );

    const query = normalizeFilter(
      rawQuery,
      MAX_QUERY_LENGTH
    );

    const category = normalizeFilter(
      rawCategory,
      MAX_CATEGORY_LENGTH
    );

    const limit = normalizeInteger(
      rawLimit,
      DEFAULT_LIMIT,
      1,
      MAX_LIMIT
    );

    const offset = normalizeInteger(
      rawOffset,
      0,
      0,
      MAX_OFFSET
    );

    const result =
      await getExploreProfiles({
        query,
        category,
        limit,
        offset,
      });

    if (result.error) {
      return jsonResponse(
        {
          success: false,
          error:
            'Unable to load Explore profiles.',
        },
        500
      );
    }

    return jsonResponse({
      success: true,

      /**
       * REAL Worldwide DIPO profiles.
       */
      profiles: Array.isArray(
        result.profiles
      )
        ? result.profiles
        : [],

      /**
       * SHOWCASE demo profiles.
       *
       * These are intentionally separate from
       * real user profiles.
       */
      demoProfiles: Array.isArray(
        result.demoProfiles
      )
        ? result.demoProfiles
        : [],

      pagination: {
        limit:
          result.pagination?.limit ??
          limit,

        offset:
          result.pagination?.offset ??
          offset,

        returned:
          result.pagination?.returned ??
          0,

        hasMore:
          Boolean(
            result.pagination?.hasMore
          ),
      },
    });
  } catch (error) {
    console.error(
      '[API /api/explore] Unexpected error:',
      error
    );

    return jsonResponse(
      {
        success: false,
        error:
          'Unable to load Explore profiles.',
      },
      500
    );
  }
}

/**
 * Explore is read-only.
 *
 * Profile creation/editing/payment/admin actions
 * must use their dedicated authenticated routes.
 */
export async function POST() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: securityHeaders(),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...securityHeaders(),
      Allow: 'GET, HEAD, OPTIONS',
    },
  });
}