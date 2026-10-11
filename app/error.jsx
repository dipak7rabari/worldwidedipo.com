'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Worldwide DIPO application error:', error);
  }, [error]);

  return (
    <main className="dipo-error-page">
      <div className="dipo-error-card">
        <p className="dipo-eyebrow">WORLDWIDE DIPO</p>

        <h1>Something went wrong.</h1>

        <p>
          We could not complete this request. Please try again.
        </p>

        <div className="dipo-error-actions">
          <button type="button" onClick={() => reset()}>
            Try Again
          </button>

          <Link href="/">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}