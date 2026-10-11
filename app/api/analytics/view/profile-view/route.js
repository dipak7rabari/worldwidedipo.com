import { NextResponse } from 'next/server';

import {
  recordProfileView,
} from '@/lib/analytics/record-profile-view';

import {
  checkOrigin,
} from '@/lib/security/origin-check';

import {
  checkRateLimitAsync,
  getRequestRateLimitKey,
} from '@/lib/security/rate-limit';

const MAX_BODY_SIZE =
  10 * 1024;

export async function POST(
  request
) {
  try {
    const contentLength =
      request.headers.get(
        'content-length'
      );

    if (
      contentLength &&
      Number(contentLength) >
        MAX_BODY_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            'Request is too large.',
        },
        {
          status: 413,
        }
      );
    }

    /*
     * Analytics is a public endpoint, but
     * requests must still originate from our
     * application.
     */
    const originResult =
      checkOrigin(request);

    if (
      !originResult.valid
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid request origin.',
        },
        {
          status: 403,
        }
      );
    }

    /*
     * FIX: Fake / spam views rokne ke liye per-IP rate limit.
     * Analytics fail hone par bhi page nahi tootna chahiye,
     * isliye success:false ke saath 200 return hota hai.
     */
    const rateLimit = await checkRateLimitAsync(
      getRequestRateLimitKey(request, 'profile-view'),
      { maxRequests: 30, windowMs: 60 * 1000 },
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false },
        { status: 429 },
      );
    }

    const body =
      await request.json();

    const result =
      await recordProfileView({
        profileId:
          body?.profile_id,

        deviceType:
          body?.device_type,

        referrer:
          body?.referrer,

        visitorHash:
          body?.visitor_hash,
      });

    /*
     * Analytics failure should never break
     * the public profile experience.
     */
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Analytics API error:',
      error
    );

    /*
     * Keep public profile resilient.
     */
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 200,
      }
    );
  }
}