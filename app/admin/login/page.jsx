import Link from 'next/link';

export const metadata = {
  title: 'Admin Login | Worldwide DIPO',
  description:
    'Secure Worldwide DIPO administrator access.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    noimageindex: true,
  },
};

const SECURITY_NOTICES = [
  {
    title: 'Authorized administrators only',
    description:
      'Admin access is restricted to the two approved Worldwide DIPO administrator accounts.',
    icon: '🔐',
  },
  {
    title: 'MFA / AAL2 protected',
    description:
      'Sensitive administrator operations require strong authentication and MFA/AAL2 verification.',
    icon: '🛡️',
  },
  {
    title: 'Secure session cookies',
    description:
      'Authentication sessions are handled server-side by the authentication provider. Sensitive session cookies are not exposed to client-side JavaScript.',
    icon: '🍪',
  },
  {
    title: 'Every admin action is verified',
    description:
      'Admin authorization is checked server-side. A normal Worldwide DIPO account does not automatically receive admin permissions.',
    icon: '✓',
  },
];

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-[-180px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl" />

        <div className="absolute bottom-[-160px] left-[-100px] h-[320px] w-[320px] rounded-full bg-indigo-500/[0.08] blur-3xl" />

        <div className="absolute right-[-120px] top-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/[0.06] blur-3xl" />
      </div>

      <section className="relative z-10 w-full max-w-lg">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] shadow-2xl backdrop-blur-xl">
            <span
              aria-hidden="true"
              className="text-2xl"
            >
              🛡️
            </span>
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-white/50">
            Worldwide DIPO
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Admin Access
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60">
            Secure administrator access for managing
            Worldwide DIPO operations.
          </p>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <div className="p-5 sm:p-7">
            {/* Security status */}
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                <span
                  aria-hidden="true"
                  className="text-lg"
                >
                  ✓
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-emerald-200">
                  Protected administrator area
                </p>

                <p className="mt-0.5 text-xs leading-5 text-emerald-100/60">
                  Authentication and authorization are
                  verified server-side.
                </p>
              </div>
            </div>

            {/* Authorized account notice */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex gap-3">
                <div className="shrink-0 text-lg">
                  🔑
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Authorized account required
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/55">
                    Only the approved Worldwide DIPO
                    administrator accounts can receive
                    administrator authorization.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                  <p className="break-all text-xs font-medium text-white/70">
                    Authorized administrator
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                  <p className="break-all text-xs font-medium text-white/70">
                    Authorized administrator
                  </p>
                </div>
              </div>
            </div>

            {/* Security notices */}
            <div className="mt-5 space-y-3">
              {SECURITY_NOTICES.map(
                (notice) => (
                  <div
                    key={notice.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-colors hover:bg-white/[0.055]"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-base">
                        <span aria-hidden="true">
                          {notice.icon}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {notice.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-white/50">
                          {notice.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Login CTA */}
            <Link
              href="/auth/sign-in?next=%2Fadmin"
              className="mt-6 flex min-h-12 w-full items-center justify-center rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-black/20 transition-all hover:bg-white/90 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
              aria-label="Continue to secure Worldwide DIPO sign in"
            >
              <span>
                Continue to Secure Sign In
              </span>

              <span
                aria-hidden="true"
                className="ml-2 text-base"
              >
                →
              </span>
            </Link>

            {/* Security warning */}
            <div className="mt-4 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] p-4">
              <div className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="text-base"
                >
                  ⚠️
                </span>

                <p className="text-xs leading-5 text-amber-100/65">
                  Do not share your password, MFA code,
                  recovery code, session information, or
                  authentication credentials with anyone.
                  Worldwide DIPO support will never ask
                  you to disclose a one-time MFA code.
                </p>
              </div>
            </div>

            {/* Create DIPO */}
            <div className="mt-6 border-t border-white/10 pt-5 text-center">
              <p className="text-xs text-white/40">
                Not an administrator?
              </p>

              <Link
                href="/create"
                className="mt-2 inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.05] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                Create Your Worldwide DIPO
                <span
                  aria-hidden="true"
                  className="ml-1.5"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom security strip */}
          <div className="border-t border-white/10 bg-black/20 px-5 py-4 sm:px-7">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium text-white/35">
              <span>Server-side authorization</span>
              <span aria-hidden="true">
                •
              </span>
              <span>MFA / AAL2</span>
              <span aria-hidden="true">
                •
              </span>
              <span>Secure cookies</span>
              <span aria-hidden="true">
                •
              </span>
              <span>Audit protected</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-white/45 transition hover:bg-white/[0.04] hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <span
              aria-hidden="true"
              className="mr-2"
            >
              ←
            </span>
            Back to Worldwide DIPO
          </Link>
        </div>

        <p className="mt-5 text-center text-[10px] leading-5 text-white/25">
          Authorized access only. Unauthorized attempts
          may be recorded for security purposes.
        </p>
      </section>
    </main>
  );
}