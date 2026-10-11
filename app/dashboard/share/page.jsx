import Link from 'next/link';

export const metadata = {
  title: 'Share Profile | Worldwide DIPO',
  description: 'Share your Worldwide DIPO digital identity profile.',
  robots: {
    index: false,
    follow: false,
  },
};

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://worldwidedipo.com'
  ).replace(/\/+$/, '');
}

export default function DashboardSharePage() {
  const demoSlug = 'your-slug';
  const profileUrl = `${getBaseUrl()}/p/${demoSlug}`;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1120,
        margin: '0 auto',
        padding: '8px 0 80px',
      }}
    >
      {/* HERO */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 30,
          padding: '38px 30px',
          background: '#111827',
          color: '#fff',
          boxShadow: '0 22px 55px rgba(15,23,42,.15)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -80,
            top: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(59,130,246,.18)',
            filter: 'blur(5px)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '7px 10px',
              borderRadius: 999,
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.1)',
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: '.13em',
            }}
          >
            SHARE YOUR IDENTITY
          </div>

          <h1
            style={{
              margin: '16px 0 0',
              maxWidth: 700,
              fontSize: 'clamp(32px, 5vw, 52px)',
              lineHeight: 1,
              fontWeight: 950,
              letterSpacing: '-.06em',
            }}
          >
            One link.
            <br />
            Your whole identity.
          </h1>

          <p
            style={{
              margin: '17px 0 0',
              maxWidth: 650,
              color: '#cbd5e1',
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Your DIPO URL can become the single destination for your
            professional identity, work, skills, social links and contact
            information.
          </p>
        </div>
      </section>

      {/* URL CARD */}
      <section
        style={{
          marginTop: 22,
          padding: 24,
          borderRadius: 24,
          background: '#fff',
          border: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 950,
            color: '#94a3b8',
            letterSpacing: '.13em',
          }}
        >
          YOUR DIPO URL
        </div>

        <div
          style={{
            marginTop: 12,
            padding: '16px 17px',
            borderRadius: 16,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: '#111827',
            }}
          >
            {profileUrl}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 14,
            flexWrap: 'wrap',
          }}
        >
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 44,
              padding: '0 17px',
              borderRadius: 13,
              background: '#111827',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            Open Profile ↗
          </a>

          <Link
            href="/dashboard/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 44,
              padding: '0 17px',
              borderRadius: 13,
              background: '#f1f5f9',
              color: '#111827',
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            Edit Profile
          </Link>
        </div>

        <p
          style={{
            margin: '13px 0 0',
            fontSize: 10,
            lineHeight: 1.6,
            color: '#94a3b8',
          }}
        >
          Your actual profile URL is generated from your active profile slug.
          This dashboard preview uses a safe placeholder until the account
          profile is resolved.
        </p>
      </section>

      {/* SHARE CHANNELS */}
      <section style={{ marginTop: 28 }}>
        <div
          style={{
            marginBottom: 12,
            fontSize: 10,
            fontWeight: 950,
            color: '#94a3b8',
            letterSpacing: '.13em',
          }}
        >
          WHERE TO SHARE
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 13,
          }}
        >
          {[
            ['Instagram Bio', 'Put your DIPO link where people find you.', '◎'],
            ['WhatsApp', 'Send one clean identity link to contacts.', '◉'],
            ['LinkedIn', 'Add your DIPO profile to your professional presence.', 'in'],
            ['Resume / CV', 'Give recruiters one place to know you better.', 'CV'],
            ['Business Card', 'Turn your physical card into a digital gateway.', '▣'],
            ['Email Signature', 'Make every professional email more useful.', '@'],
          ].map(([title, description, icon]) => (
            <article
              key={title}
              style={{
                padding: 20,
                borderRadius: 20,
                background: '#fff',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 13,
                  background: '#f1f5f9',
                  color: '#111827',
                  fontSize: 12,
                  fontWeight: 950,
                }}
              >
                {icon}
              </div>

              <h2
                style={{
                  margin: '15px 0 0',
                  fontSize: 14,
                  fontWeight: 950,
                  letterSpacing: '-.025em',
                }}
              >
                {title}
              </h2>

              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: 11,
                  lineHeight: 1.65,
                  color: '#64748b',
                }}
              >
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* BRAND MESSAGE */}
      <section
        style={{
          marginTop: 28,
          padding: 25,
          borderRadius: 22,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 950,
            letterSpacing: '.13em',
            color: '#94a3b8',
          }}
        >
          DIPO PHILOSOPHY
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 'clamp(20px, 4vw, 30px)',
            lineHeight: 1.15,
            fontWeight: 950,
            letterSpacing: '-.045em',
            color: '#111827',
          }}
        >
          Naam se pehchaan hoti hai.
          <br />
          Digital identity se duniya tak pahunch hoti hai.
        </div>
      </section>
    </div>
  );
}