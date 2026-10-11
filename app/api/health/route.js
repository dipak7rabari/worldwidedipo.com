import { NextResponse } from 'next/server';

import { checkDatabaseHealth } from './database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );

  const hasServerConfiguration =
    Boolean(process.env.SUPABASE_SECRET_KEY) &&
    Boolean(process.env.TURNSTILE_SECRET_KEY);

  const database = hasSupabase
    ? await checkDatabaseHealth()
    : {
        ok: false,
        error: 'Supabase configuration missing.',
      };

  const healthy =
    hasSupabase &&
    hasServerConfiguration &&
    database.ok;

  return NextResponse.json(
    {
      ok: healthy,
      service: 'Worldwide DIPO',
      database: database.ok,
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}