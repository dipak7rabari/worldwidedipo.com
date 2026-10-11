import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next');

  const safeNext =
    nextParam &&
    nextParam.startsWith('/') &&
    !nextParam.startsWith('//')
      ? nextParam
      : '/dashboard';

  if (!code) {
    return NextResponse.redirect(
      new URL(
        '/auth/error?reason=missing_code',
        requestUrl.origin,
      ),
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/auth/error?reason=callback_failed`,
        requestUrl.origin,
      ),
    );
  }

  return NextResponse.redirect(
    new URL(safeNext, requestUrl.origin),
  );
}