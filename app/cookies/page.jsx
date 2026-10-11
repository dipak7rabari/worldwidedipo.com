import Link from 'next/link';
import LegalLayout from '@/components/legal/LegalLayout';
import PublicFooter from '@/components/legal/PublicFooter';

export const metadata = {
  title: 'Cookie Policy | Worldwide DIPO',
  description:
    'Learn how Worldwide DIPO uses cookies and similar technologies to operate, secure, improve, and measure its digital identity platform.',
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    id: 'what-are-cookies',
    number: '01',
    title: 'What are cookies?',
    content: (
      <>
        <p>
          Cookies are small text files that a website can store on your
          device when you visit or use the website. They help a website
          remember information, maintain sessions, understand usage, and
          provide certain functionality.
        </p>

        <p>
          Worldwide DIPO may also use similar technologies, such as
          session-based storage, local storage, security tokens, and
          analytics identifiers where appropriate.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    number: '02',
    title: 'How Worldwide DIPO uses cookies',
    content: (
      <>
        <p>
          Worldwide DIPO may use cookies and similar technologies for
          legitimate operational purposes, including:
        </p>

        <ul>
          <li>Keeping authentication and security sessions working.</li>
          <li>Protecting accounts and platform functionality.</li>
          <li>Remembering necessary preferences and settings.</li>
          <li>Maintaining reliable website functionality.</li>
          <li>Understanding basic platform usage and performance.</li>
          <li>Detecting abuse, suspicious activity, and security issues.</li>
          <li>Improving the usability and reliability of the platform.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'types',
    number: '03',
    title: 'Types of cookies and technologies',
    content: (
      <>
        <div className="cookie-card">
          <div className="cookie-card-icon">01</div>
          <div>
            <h3>Essential technologies</h3>
            <p>
              These technologies are required for important functionality
              such as authentication, security, session management, and
              core website operation.
            </p>
          </div>
        </div>

        <div className="cookie-card">
          <div className="cookie-card-icon">02</div>
          <div>
            <h3>Preference technologies</h3>
            <p>
              These may help remember choices or settings so that parts of
              the experience can work more conveniently.
            </p>
          </div>
        </div>

        <div className="cookie-card">
          <div className="cookie-card-icon">03</div>
          <div>
            <h3>Analytics technologies</h3>
            <p>
              Where enabled, analytics technologies may help us understand
              aggregate usage, performance, and platform reliability.
            </p>
          </div>
        </div>

        <div className="cookie-card">
          <div className="cookie-card-icon">04</div>
          <div>
            <h3>Security technologies</h3>
            <p>
              Security-related identifiers may be used to help prevent
              abuse, fraud, automated attacks, and unauthorized activity.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'authentication',
    number: '04',
    title: 'Authentication and account sessions',
    content: (
      <>
        <p>
          If you sign in to Worldwide DIPO, session technologies may be
          required to keep you authenticated between requests and pages.
        </p>

        <p>
          Without necessary authentication technologies, features such as
          your dashboard, profile management, subscription management, and
          secure account actions may not function correctly.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    number: '05',
    title: 'Security and abuse prevention',
    content: (
      <>
        <p>
          Worldwide DIPO may use cookies or similar identifiers as part of
          security controls designed to protect users and the platform.
        </p>

        <p>
          These controls may help identify abnormal activity, reduce
          automated abuse, protect authentication flows, enforce rate
          limits, and investigate security incidents.
        </p>
      </>
    ),
  },
  {
    id: 'analytics',
    number: '06',
    title: 'Analytics',
    content: (
      <>
        <p>
          Worldwide DIPO may use privacy-conscious analytics or similar
          technologies to understand how the service is being used.
        </p>

        <p>
          Analytics may include information such as page interactions,
          approximate device characteristics, referral information, or
          aggregated usage patterns.
        </p>

        <p>
          We do not intend to use analytics systems to collect information
          that is unnecessary for the operation or improvement of the
          service.
        </p>
      </>
    ),
  },
  {
    id: 'profile-pages',
    number: '07',
    title: 'Public profile pages',
    content: (
      <>
        <p>
          Worldwide DIPO public profile pages are designed to be accessible
          without visitor login. A public profile may therefore be viewed
          by anyone who has access to its URL.
        </p>

        <p>
          Cookies are not used to make a public profile private. Profile
          visibility is controlled by the profile lifecycle and platform
          rules described in our Terms of Service and Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: 'third-party',
    number: '08',
    title: 'Third-party services',
    content: (
      <>
        <p>
          Some Worldwide DIPO functionality may rely on carefully selected
          third-party infrastructure or services. Those services may use
          their own cookies or similar technologies according to their own
          policies.
        </p>

        <p>
          Examples may include authentication, security, hosting, payment
          infrastructure, analytics, or other technical service providers.
        </p>

        <p>
          Third-party services are subject to their own terms and privacy
          practices. We recommend reviewing the applicable policies when
          you use a third-party service.
        </p>
      </>
    ),
  },
  {
    id: 'browser-controls',
    number: '09',
    title: 'Managing cookies in your browser',
    content: (
      <>
        <p>
          Most modern browsers allow you to control, block, delete, or
          restrict cookies through their settings.
        </p>

        <p>
          You can generally find these controls under privacy, security,
          site settings, or cookie settings in your browser.
        </p>

        <div className="notice">
          <div className="notice-mark">!</div>
          <div>
            <strong>Important</strong>
            <p>
              Blocking or deleting essential cookies may cause parts of
              Worldwide DIPO, especially authentication and account
              functionality, to stop working correctly.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'local-storage',
    number: '10',
    title: 'Local storage and similar technologies',
    content: (
      <>
        <p>
          In addition to cookies, the website may use browser storage
          mechanisms such as local storage or session storage when required
          for specific functionality.
        </p>

        <p>
          These technologies can store small amounts of information inside
          your browser and may be removed through browser settings or by
          clearing site data.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    number: '11',
    title: 'Retention',
    content: (
      <>
        <p>
          The retention period of a cookie or similar identifier depends on
          its purpose. Some technologies may exist only for the duration of
          your browser session, while others may remain until they expire
          or are deleted.
        </p>

        <p>
          Security, authentication, analytics, and other technical data
          may have separate retention periods based on operational,
          security, legal, and business requirements.
        </p>
      </>
    ),
  },
  {
    id: 'updates',
    number: '12',
    title: 'Changes to this Cookie Policy',
    content: (
      <>
        <p>
          We may update this Cookie Policy when our platform, technology,
          security practices, or legal requirements change.
        </p>

        <p>
          When material changes are made, we may update the effective date
          or provide an appropriate notice through the platform.
        </p>
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <>
      <LegalLayout
        title="Cookie Policy"
        description="A clear explanation of how Worldwide DIPO uses cookies and similar browser technologies."
      >
        <main className="cookies-page">
          <section className="cookies-hero">
            <div className="cookies-hero-badge">
              <span className="cookies-hero-dot" />
              Privacy &amp; Security
            </div>

            <h1>
              Cookie
              <span> Policy</span>
            </h1>

            <p className="cookies-hero-description">
              We use cookies and similar technologies to keep Worldwide DIPO
              secure, functional, reliable, and easier to use.
            </p>

            <div className="cookies-meta">
              <div>
                <span>Effective date</span>
                <strong>September 13, 2026</strong>
              </div>

              <div>
                <span>Platform</span>
                <strong>Worldwide DIPO</strong>
              </div>

              <div>
                <span>Product</span>
                <strong>DIPO LABS</strong>
              </div>
            </div>
          </section>

          <section className="cookies-summary">
            <div className="summary-icon">✓</div>

            <div>
              <h2>Privacy-first approach</h2>
              <p>
                Cookies are used for defined platform purposes. We do not
                sell personal information to advertisers, and we do not use
                cookies to turn your Worldwide DIPO profile into a private
                advertising profile.
              </p>
            </div>
          </section>

          <div className="cookies-layout">
            <aside className="cookies-sidebar" aria-label="Cookie Policy navigation">
              <div className="sidebar-label">On this page</div>

              <nav>
                {sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    <span>{section.number}</span>
                    <strong>{section.title}</strong>
                  </a>
                ))}
              </nav>

              <div className="sidebar-links">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </aside>

            <div className="cookies-content">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="cookie-section"
                >
                  <div className="section-number">{section.number}</div>

                  <div className="section-body">
                    <h2>{section.title}</h2>
                    <div className="section-copy">{section.content}</div>
                  </div>
                </section>
              ))}

              <section className="contact-card">
                <div className="contact-card-top">
                  <span className="contact-pill">Need help?</span>
                  <span className="contact-arrow">↗</span>
                </div>

                <h2>Questions about cookies?</h2>

                <p>
                  If you have questions about this Cookie Policy or how
                  Worldwide DIPO handles information, contact our support
                  team.
                </p>

                <div className="contact-actions">
                  <a href="mailto:dipolabs123@gmail.com">
                    dipolabs123@gmail.com
                  </a>

                  <a
                    href="https://instagram.com/dipolabs.io"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @dipolabs.io
                  </a>
                </div>
              </section>

              <div className="cookies-footer-note">
                <span>Worldwide DIPO</span>
                <span>•</span>
                <span>A DIPO LABS product</span>
              </div>
            </div>
          </div>
        </main>
      </LegalLayout>

      <style>{`
        .cookies-page {
          --cookie-blue: #2563eb;
          --cookie-blue-dark: #1d4ed8;
          --cookie-text: #111827;
          --cookie-muted: #64748b;
          --cookie-border: #e5e7eb;
          --cookie-soft: #f8fafc;
          width: 100%;
        }

        .cookies-hero {
          position: relative;
          overflow: hidden;
          padding: 42px 0 38px;
          border-bottom: 1px solid var(--cookie-border);
        }

        .cookies-hero::before {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          right: -100px;
          top: -130px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.07);
          pointer-events: none;
        }

        .cookies-hero-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 11px;
          border: 1px solid #dbeafe;
          border-radius: 999px;
          background: #eff6ff;
          color: var(--cookie-blue-dark);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .cookies-hero-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--cookie-blue);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .cookies-hero h1 {
          position: relative;
          margin: 18px 0 10px;
          color: var(--cookie-text);
          font-size: clamp(42px, 7vw, 76px);
          line-height: 0.98;
          letter-spacing: -0.055em;
          font-weight: 800;
        }

        .cookies-hero h1 span {
          color: var(--cookie-blue);
        }

        .cookies-hero-description {
          position: relative;
          max-width: 720px;
          margin: 0;
          color: var(--cookie-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .cookies-meta {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .cookies-meta > div {
          padding: 15px 16px;
          border: 1px solid var(--cookie-border);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.78);
        }

        .cookies-meta span {
          display: block;
          margin-bottom: 5px;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .cookies-meta strong {
          display: block;
          color: var(--cookie-text);
          font-size: 13px;
          font-weight: 700;
        }

        .cookies-summary {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin: 28px 0 38px;
          padding: 20px;
          border: 1px solid #dbeafe;
          border-radius: 18px;
          background: linear-gradient(
            135deg,
            #f8fbff 0%,
            #eff6ff 100%
          );
        }

        .summary-icon {
          display: grid;
          flex: 0 0 auto;
          width: 38px;
          height: 38px;
          place-items: center;
          border-radius: 12px;
          background: var(--cookie-blue);
          color: #fff;
          font-size: 18px;
          font-weight: 800;
        }

        .cookies-summary h2 {
          margin: 1px 0 5px;
          color: var(--cookie-text);
          font-size: 16px;
          font-weight: 800;
        }

        .cookies-summary p {
          margin: 0;
          color: #475569;
          font-size: 14px;
          line-height: 1.7;
        }

        .cookies-layout {
          display: grid;
          grid-template-columns: 245px minmax(0, 1fr);
          gap: 42px;
          align-items: start;
        }

        .cookies-sidebar {
          position: sticky;
          top: 24px;
        }

        .sidebar-label {
          margin-bottom: 10px;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .cookies-sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cookies-sidebar nav a {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          gap: 7px;
          align-items: center;
          padding: 8px 9px;
          border-radius: 9px;
          color: #64748b;
          text-decoration: none;
          transition:
            background 160ms ease,
            color 160ms ease,
            transform 160ms ease;
        }

        .cookies-sidebar nav a:hover {
          background: #f8fafc;
          color: var(--cookie-blue);
          transform: translateX(2px);
        }

        .cookies-sidebar nav a span {
          color: #94a3b8;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
          font-weight: 700;
        }

        .cookies-sidebar nav a strong {
          font-size: 12px;
          font-weight: 650;
          line-height: 1.35;
        }

        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid var(--cookie-border);
        }

        .sidebar-links a {
          color: #475569;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }

        .sidebar-links a:hover {
          color: var(--cookie-blue);
        }

        .cookies-content {
          min-width: 0;
        }

        .cookie-section {
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr);
          gap: 18px;
          padding: 0 0 42px;
          margin-bottom: 42px;
          border-bottom: 1px solid var(--cookie-border);
          scroll-margin-top: 30px;
        }

        .section-number {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid var(--cookie-border);
          border-radius: 12px;
          background: #fff;
          color: var(--cookie-blue);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px;
          font-weight: 800;
        }

        .section-body h2 {
          margin: 0 0 14px;
          color: var(--cookie-text);
          font-size: 23px;
          line-height: 1.25;
          letter-spacing: -0.025em;
          font-weight: 800;
        }

        .section-copy {
          color: #475569;
          font-size: 14px;
          line-height: 1.8;
        }

        .section-copy p {
          margin: 0 0 15px;
        }

        .section-copy p:last-child {
          margin-bottom: 0;
        }

        .section-copy ul {
          margin: 10px 0 0;
          padding-left: 20px;
        }

        .section-copy li {
          margin: 7px 0;
          padding-left: 4px;
        }

        .cookie-card {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 13px;
          margin: 12px 0;
          padding: 16px;
          border: 1px solid var(--cookie-border);
          border-radius: 15px;
          background: #fff;
        }

        .cookie-card-icon {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border-radius: 11px;
          background: #eff6ff;
          color: var(--cookie-blue);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
          font-weight: 800;
        }

        .cookie-card h3 {
          margin: 0 0 4px;
          color: var(--cookie-text);
          font-size: 14px;
          font-weight: 800;
        }

        .cookie-card p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.65;
        }

        .notice {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #f8fafc;
        }

        .notice-mark {
          display: grid;
          flex: 0 0 auto;
          width: 28px;
          height: 28px;
          place-items: center;
          border-radius: 9px;
          background: #e2e8f0;
          color: #475569;
          font-size: 12px;
          font-weight: 900;
        }

        .notice strong {
          display: block;
          margin-bottom: 3px;
          color: var(--cookie-text);
          font-size: 13px;
        }

        .notice p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        .contact-card {
          position: relative;
          overflow: hidden;
          margin-top: 8px;
          padding: 25px;
          border: 1px solid #dbeafe;
          border-radius: 20px;
          background: #f8fbff;
        }

        .contact-card::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          right: -90px;
          bottom: -100px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.08);
        }

        .contact-card-top {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .contact-pill {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          background: #dbeafe;
          color: var(--cookie-blue-dark);
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .contact-arrow {
          color: var(--cookie-blue);
          font-size: 20px;
        }

        .contact-card h2 {
          position: relative;
          z-index: 1;
          margin: 0 0 7px;
          color: var(--cookie-text);
          font-size: 22px;
          letter-spacing: -0.025em;
        }

        .contact-card p {
          position: relative;
          z-index: 1;
          max-width: 620px;
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .contact-actions {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }

        .contact-actions a {
          display: inline-flex;
          align-items: center;
          padding: 9px 12px;
          border: 1px solid #dbeafe;
          border-radius: 10px;
          background: #fff;
          color: var(--cookie-blue-dark);
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
        }

        .contact-actions a:hover {
          border-color: #bfdbfe;
          background: #eff6ff;
        }

        .cookies-footer-note {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          align-items: center;
          justify-content: center;
          margin-top: 28px;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 650;
        }

        .cookies-footer-note span:first-child {
          color: #64748b;
          font-weight: 800;
        }

        @media (max-width: 900px) {
          .cookies-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .cookies-sidebar {
            position: static;
          }

          .cookies-sidebar nav {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 3px;
          }

          .sidebar-links {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 640px) {
          .cookies-hero {
            padding-top: 26px;
          }

          .cookies-hero h1 {
            font-size: 46px;
          }

          .cookies-meta {
            grid-template-columns: 1fr;
          }

          .cookies-summary {
            padding: 16px;
          }

          .cookies-sidebar nav {
            grid-template-columns: 1fr;
          }

          .cookie-section {
            grid-template-columns: 1fr;
            gap: 12px;
            padding-bottom: 32px;
            margin-bottom: 32px;
          }

          .section-number {
            width: 34px;
            height: 34px;
            border-radius: 10px;
          }

          .section-body h2 {
            font-size: 20px;
          }

          .cookie-card {
            grid-template-columns: 38px minmax(0, 1fr);
            padding: 13px;
          }

          .contact-card {
            padding: 19px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cookies-sidebar nav a {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}