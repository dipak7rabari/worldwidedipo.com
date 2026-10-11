import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth/get-user';

import {
  validateSlug,
} from '@/lib/profile/profile-validation';

import {
  isSlugAvailable,
} from '@/lib/profile/slug-service';

export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          available: false,
          error: 'Authentication required.',
        },
        { status: 401 },
      );
    }

    const { searchParams } =
      new URL(request.url);

    const slug =
      searchParams
        .get('slug')
        ?.trim()
        .toLowerCase() || '';

    const validation =
  validateSlug(slug);

if (!validation.valid) {
  return NextResponse.json(
    {
      available: false,
      error: validation.message,
    },
    { status: 422 },
  );
}


    const available =
      await isSlugAvailable(slug);

    return NextResponse.json({
      available,
      slug,
    });
  } catch (error) {
    console.error(
      'SLUG_CHECK_ERROR',
      error,
    );

    return NextResponse.json(
      {
        available: false,
        error: 'Unable to check DIPO URL.',
      },
      { status: 500 },
    );
  }
}