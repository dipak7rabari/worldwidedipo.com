import { redirect } from 'next/navigation';

import AdminMFA from '@/components/admin/AdminMFA';

import {
  requireAdmin,
} from '@/lib/auth/require-admin';

export const dynamic = 'force-dynamic';

export const revalidate = 0;

export const metadata = {
  title: 'Admin Security | Worldwide DIPO',

  description:
    'Secure administrator authentication and MFA controls for Worldwide DIPO.',

  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};

/**
 * Only internal /admin paths are accepted.
 *
 * This prevents an attacker from supplying an external
 * redirect such as:
 *
 * https://attacker.example
 * //attacker.example
 * javascript:...
 */
function getSafeNextPath(
  value,
) {
  if (
    typeof value !== 'string'
  ) {
    return '/admin';
  }

  const trimmed =
    value.trim();

  if (
    !trimmed ||
    !trimmed.startsWith('/admin') ||
    trimmed.startsWith('//') ||
    trimmed.includes('\\')
  ) {
    return '/admin';
  }

  try {
    const parsed =
      new URL(
        trimmed,
        'https://worldwide-dipo.local',
      );

    /*
     * The URL must remain relative to the
     * application's own origin.
     */
    if (
      parsed.origin !==
      'https://worldwide-dipo.local'
    ) {
      return '/admin';
    }

    /*
     * Only /admin paths are allowed.
     */
    if (
      !parsed.pathname.startsWith(
        '/admin',
      )
    ) {
      return '/admin';
    }

    return (
      parsed.pathname +
      parsed.search +
      parsed.hash
    );
  } catch {
    return '/admin';
  }
}

export default async function AdminSecurityPage({
  searchParams,
}) {
  /*
   * ---------------------------------------------------------
   * 1. AUTHENTICATION
   * ---------------------------------------------------------
   *
   * We intentionally DO NOT require MFA here.
   *
   * Reason:
   * This page is the MFA enrollment/challenge gateway.
   * An approved admin without a registered TOTP factor
   * must be able to reach this page and enroll it.
   *
   * Sensitive admin pages themselves still require AAL2.
   */
  await requireAdmin({
    requireMfa: false,
    nextPath: '/admin',
  });

  /*
   * ---------------------------------------------------------
   * 2. SAFE RETURN PATH
   * ---------------------------------------------------------
   *
   * Next.js 16 provides searchParams as an async value
   * for App Router pages.
   */
  const params =
    await searchParams;

  const requestedNext =
    Array.isArray(
      params?.next,
    )
      ? params.next[0]
      : params?.next;

  const nextPath =
    getSafeNextPath(
      requestedNext,
    );

  /*
   * ---------------------------------------------------------
   * 3. SECURITY PAGE
   * ---------------------------------------------------------
   */
  return (
    <main
      style={{
        minHeight:
          '100svh',

        width: '100%',

        display: 'flex',

        alignItems:
          'flex-start',

        justifyContent:
          'center',

        padding:
          'clamp(16px, 4vw, 48px)',

        background:
          'linear-gradient(180deg, #f8fafc 0%, #ffffff 55%, #f8fafc 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
        }}
      >
        <AdminMFA
          nextPath={
            nextPath
          }
        />
      </div>
    </main>
  );
}