import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="dipo-error-page">
      <div className="dipo-error-card">
        <p className="dipo-eyebrow">404</p>

        <h1>Page not found.</h1>

        <p>
          The page or Worldwide DIPO profile you are looking for
          does not exist or is no longer available.
        </p>

        <div className="dipo-error-actions">
          <Link href="/">
            Go Home
          </Link>

          <Link href="/contact">
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}