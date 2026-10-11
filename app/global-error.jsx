'use client';

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              textAlign: 'center',
            }}
          >
            <p>WORLDWIDE DIPO</p>

            <h1>Something went wrong.</h1>

            <p>
              Please try again. If the problem continues, contact
              Worldwide DIPO Support.
            </p>

            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '12px 18px',
                borderRadius: '10px',
                border: '0',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}