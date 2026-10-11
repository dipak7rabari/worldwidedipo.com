import Link from 'next/link';

export const metadata = {
  title: {
    default: 'Dashboard | Worldwide DIPO',
    template: '%s | Worldwide DIPO',
  },
  description:
    'Manage your Worldwide DIPO digital identity.',
  robots: {
    index: false,
    follow: false,
  },
};

const navigation = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: '⌂',
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: '✦',
  },
  {
    label: 'Share',
    href: '/dashboard/share',
    icon: '↗',
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: '⌁',
  },
  {
    label: 'Subscription',
    href: '/dashboard/subscription',
    icon: '◈',
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙',
  },
  {
    label: 'Support',
    href: '/dashboard/support',
    icon: '?',
  },
];

function NavItem({ item }) {
  return (
    <Link
      href={item.href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        minHeight: 42,
        padding: '0 12px',
        borderRadius: 12,
        color: '#64748b',
        textDecoration: 'none',
        fontSize: 12,
        fontWeight: 800,
        transition: 'all .18s ease',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 9,
          background: '#f8fafc',
          color: '#475569',
          fontSize: 12,
          fontWeight: 950,
        }}
      >
        {item.icon}
      </span>

      <span>{item.label}</span>
    </Link>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#111827',
      }}
    >
      {/* TOP HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255,255,255,.94)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1440,
            minHeight: 68,
            margin: '0 auto',
            padding: '0 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              color: '#111827',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 12,
                background: '#111827',
                color: '#fff',
                fontSize: 16,
                fontWeight: 950,
              }}
            >
              D
            </span>

            <span>
              <span
                style={{
                  display: 'block',
                  fontSize: 14,
                  lineHeight: 1,
                  fontWeight: 950,
                  letterSpacing: '-.04em',
                }}
              >
                WORLDWIDE DIPO
              </span>

              <span
                style={{
                  display: 'block',
                  marginTop: 4,
                  fontSize: 8,
                  lineHeight: 1,
                  color: '#94a3b8',
                  fontWeight: 900,
                  letterSpacing: '.12em',
                }}
              >
                DIGITAL IDENTITY
              </span>
            </span>
          </Link>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            <Link
              href="/dashboard/share"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 38,
                padding: '0 13px',
                borderRadius: 11,
                background: '#111827',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 10,
                fontWeight: 900,
              }}
            >
              Share Profile ↗
            </Link>
          </div>
        </div>
      </header>

      {/* APP BODY */}
      <div
        style={{
          width: '100%',
          maxWidth: 1440,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '230px minmax(0, 1fr)',
          alignItems: 'start',
        }}
      >
        {/* SIDEBAR */}
        <aside
          style={{
            position: 'sticky',
            top: 68,
            height: 'calc(100vh - 68px)',
            padding: '22px 14px',
            background: '#fff',
            borderRight: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              padding: '0 10px 10px',
              fontSize: 9,
              fontWeight: 950,
              letterSpacing: '.14em',
              color: '#94a3b8',
            }}
          >
            WORKSPACE
          </div>

          <nav
            aria-label="Dashboard navigation"
            style={{
              display: 'grid',
              gap: 3,
            }}
          >
            {navigation.map((item) => (
              <NavItem
                key={item.href}
                item={item}
              />
            ))}
          </nav>

          <div
            style={{
              position: 'absolute',
              left: 14,
              right: 14,
              bottom: 18,
              padding: 15,
              borderRadius: 16,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                color: '#111827',
              }}
            >
              Worldwide DIPO
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 9,
                lineHeight: 1.5,
                color: '#94a3b8',
              }}
            >
              Har insaan ki apni digital pehchaan.
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main
          style={{
            minWidth: 0,
            padding: '28px 22px 70px',
          }}
        >
          {children}
        </main>
      </div>

      {/* MOBILE NAV */}
      <div
        style={{
          display: 'none',
        }}
        className="worldwide-dipo-mobile-dashboard-nav"
      >
        <nav aria-label="Mobile dashboard navigation">
          {navigation.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: '#64748b',
                textDecoration: 'none',
                fontSize: 9,
                fontWeight: 900,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: 15,
                  marginBottom: 3,
                }}
              >
                {item.icon}
              </span>

              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* MOBILE RESPONSIVE OVERRIDE */}
      <style>{`
        @media (max-width: 820px) {
          .worldwide-dipo-mobile-dashboard-nav {
            display: block !important;
            position: fixed;
            left: 12px;
            right: 12px;
            bottom: 12px;
            z-index: 200;
            padding: 10px;
            background: rgba(255,255,255,.96);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            box-shadow: 0 18px 45px rgba(15,23,42,.15);
          }

          .worldwide-dipo-mobile-dashboard-nav nav {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 4px;
          }

          main {
            padding-bottom: 105px !important;
          }
        }

        @media (max-width: 820px) {
          aside {
            display: none !important;
          }

          header + div {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}