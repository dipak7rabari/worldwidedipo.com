import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function POST(request) {
  const supabase = await createClient();

  await supabase.auth.signOut();

  const requestUrl = new URL(request.url);

  return NextResponse.json(
    {
      success: true,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}