import Link from 'next/link';

const ERROR_MESSAGES = {
  missing_code:
    'Authentication link incomplete hai. Please dobara sign in karein.',

  callback_failed:
    'Authentication complete nahi ho saki. Please dobara try karein.',

  access_denied:
    'Authentication request cancel ya deny ho gayi.',

  default:
    'Authentication complete nahi ho saki. Please dobara try karein.',
};

export const metadata = {
  title: 'Authentication Error | Worldwide DIPO',
  description:
    'Authentication error while signing in to your Worldwide DIPO digital identity.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AuthErrorPage({ searchParams }) {
  const params = await searchParams;

  const reason =
    typeof params?.reason === 'string' ? params.reason : 'default';

  const message =
    ERROR_MESSAGES[reason] || ERROR_MESSAGES.default;

  return (
    <main className="min-h-screen box-border grid place-items-center bg-[#f8fafc] px-4 py-8 sm:px-6">
      <section
        className="w-full max-w-[460px] rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center shadow-sm sm:p-8"
        aria-labelledby="auth-error-title"
      >
        <div
          className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-[#fef2f2] text-2xl font-extrabold text-[#b91c1c]"
          aria-hidden="true"
        >
          !
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">
          Worldwide DIPO
        </p>

        <h1
          id="auth-error-title"
          className="m-0 text-2xl font-bold tracking-tight text-[#0f172a] sm:text-[26px]"
        >
          Sign-in issue
        </h1>

        <p className="mx-auto mt-3 mb-6 max-w-[360px] text-sm leading-6 text-[#64748b]">
          {message}
        </p>

        <Link
          href="/auth/sign-in"
          className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[#2563eb] px-5 text-sm font-bold text-white no-underline transition-colors hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
        >
          Back to Sign In
        </Link>

        <p className="mt-6 mb-0 text-xs leading-5 text-[#94a3b8]">
          If the problem continues, please try signing in again after a
          moment.
        </p>
      </section>
    </main>
  );
}