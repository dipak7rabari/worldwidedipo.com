import Link from 'next/link';

const styles = {
  shell: {
    minHeight: 'auto',
    background:
      'radial-gradient(circle at 85% 0%, rgba(37,99,235,.08), transparent 28%), #f7f8fa',
    color: '#111827',
    padding: 'clamp(10px, 2vw, 22px)',
  },

  wrap: {
    width: '100%',
    maxWidth: '1480px',
    margin: '0 auto',
  },

  top: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    flexWrap: 'wrap',
    marginBottom: '28px',
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  logo: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    display: 'grid',
    placeItems: 'center',
    background: '#111827',
    color: '#fff',
    fontWeight: 900,
    fontSize: '16px',
    boxShadow: '0 12px 30px rgba(17,24,39,.16)',
  },

  brandTitle: {
    fontSize: '18px',
    fontWeight: 900,
    letterSpacing: '-.04em',
  },

  brandSub: {
    color: '#6b7280',
    fontSize: '12px',
    marginTop: '2px',
  },

  nav: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },

  navLink: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '38px',
    padding: '0 13px',
    borderRadius: '11px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    color: '#374151',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 800,
  },

  content: {
    width: '100%',
  },
};

export default function AdminShell({
  children,
  title,
  subtitle,
}) {
  return (
    <main style={styles.shell}>
      <div style={styles.wrap}>
        <header style={styles.top}>
          <div style={styles.brand}>
            <div style={styles.logo}>D</div>

            <div>
              <div style={styles.brandTitle}>
                WORLDWIDE DIPO
              </div>

              <div style={styles.brandSub}>
                DIPO LABS · PRIVATE ADMIN CONTROL
              </div>
            </div>
          </div>

          <nav style={styles.nav} aria-label="Admin navigation">
            <Link href="/admin" style={styles.navLink}>
              Overview
            </Link>

            <Link href="/admin/profiles" style={styles.navLink}>
              Profiles
            </Link>

            <Link href="/admin/payments" style={styles.navLink}>
              Payments
            </Link>

            <Link href="/admin/users" style={styles.navLink}>
              Users
            </Link>

            <Link href="/admin/audit" style={styles.navLink}>
              Audit
            </Link>

            <Link href="/admin/settings" style={styles.navLink}>
              Settings
            </Link>
          </nav>
        </header>

        <section style={styles.content}>
          <div style={{ marginBottom: 26 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 900,
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '.12em',
                marginBottom: 7,
              }}
            >
              {subtitle || 'DIPO CONTROL CENTER'}
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(30px, 5vw, 48px)',
                lineHeight: 1,
                letterSpacing: '-.055em',
                fontWeight: 950,
              }}
            >
              {title}
            </h1>
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}