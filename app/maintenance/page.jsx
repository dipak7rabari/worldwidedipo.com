export const metadata = {
  title: 'Maintenance | Worldwide DIPO',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background: '#fff',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '620px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          WORLDWIDE DIPO
        </p>

        <h1>We’ll be back soon.</h1>

        <p
          style={{
            color: '#64748b',
            lineHeight: 1.6,
          }}
        >
          Worldwide DIPO is temporarily unavailable while we work
          on the platform.
        </p>

        <p
          style={{
            color: '#64748b',
          }}
        >
          Please try again shortly.
        </p>
      </section>
    </main>
  );
}