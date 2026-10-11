import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-store',
        },
      },
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email ?? null,
        userMetadata: user.user_metadata ?? {},
      },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-store',
      },
    },
  );
}