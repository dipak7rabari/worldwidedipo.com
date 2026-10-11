import Link from "next/link";

const SECTIONS = [
  {
    id: "what-are-cookies",
    number: "01",
    title: "What are cookies?",
    label: "FOUNDATION",
  },
  {
    id: "how-we-use",
    number: "02",
    title: "How we use cookies",
    label: "USAGE",
  },
  {
    id: "types",
    number: "03",
    title: "Types of technologies",
    label: "TECHNOLOGY",
  },
  {
    id: "authentication",
    number: "04",
    title: "Authentication & sessions",
    label: "ACCOUNT",
  },
  {
    id: "security",
    number: "05",
    title: "Security & abuse prevention",
    label: "SECURITY",
  },
  {
    id: "analytics",
    number: "06",
    title: "Analytics",
    label: "INSIGHTS",
  },
  {
    id: "profile-pages",
    number: "07",
    title: "Public profile pages",
    label: "PUBLIC",
  },
  {
    id: "third-party",
    number: "08",
    title: "Third-party services",
    label: "SERVICES",
  },
  {
    id: "browser-controls",
    number: "09",
    title: "Managing cookies",
    label: "CONTROL",
  },
  {
    id: "local-storage",
    number: "10",
    title: "Local storage",
    label: "BROWSER",
  },
  {
    id: "retention",
    number: "11",
    title: "Retention",
    label: "RETENTION",
  },
  {
    id: "updates",
    number: "12",
    title: "Policy updates",
    label: "UPDATES",
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path
        d="M12 3 20 6v5.5c0 4.8-3.1 8.2-8 9.5-4.9-1.3-8-4.7-8-9.5V6l8-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m8.5 12 2.2 2.2 4.8-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CookieIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
    >
      <path
        d="M19.5 13.2A7.8 7.8 0 0 1 10.8 4.5 7.8 7.8 0 1 0 19.5 13.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="7.5" cy="14" r="1" fill="currentColor" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 10.5v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function SectionHeader({ number, title, label }) {
  return (
    <div className="cookie-section-heading">
      <div className="cookie-section-index">
        <span>{number}</span>
      </div>

      <div className="cookie-section-heading-copy">
        <span className="cookie-section-label">
          {label}
        </span>

        <h2>{title}</h2>
      </div>
    </div>
  );
}

function TechnologyCard({
  number,
  title,
  description,
  icon,
}) {
  return (
    <article className="cookie-tech-card">
      <div className="cookie-tech-top">
        <div className="cookie-tech-icon">
          {icon}
        </div>

        <span className="cookie-tech-number">
          {number}
        </span>
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </article>
  );
}

export default function CookiesContent() {
  return (
    <>
      <div className="cookie-policy-shell">
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="cookie-hero">
          <div className="cookie-hero-glow cookie-hero-glow-one" />
          <div className="cookie-hero-glow cookie-hero-glow-two" />

          <div className="cookie-hero-inner">
            <div className="cookie-eyebrow">
              <span className="cookie-eyebrow-icon">
                <CookieIcon />
              </span>

              <span>PRIVACY &amp; SECURITY</span>

              <span className="cookie-eyebrow-line" />

              <span>WORLDWIDE DIPO</span>
            </div>

            <h1>
              Cookie
              <span> Policy.</span>
            </h1>

            <p className="cookie-hero-description">
              A clear look at how Worldwide DIPO uses cookies and
              similar browser technologies to keep the platform
              functional, secure, reliable, and easier to use.
            </p>

            <div className="cookie-hero-meta">
              <div className="cookie-meta-card">
                <span className="cookie-meta-label">
                  EFFECTIVE DATE
                </span>

                <strong>
                  28 September 2026
                </strong>
              </div>

              <div className="cookie-meta-card">
                <span className="cookie-meta-label">
                  DOCUMENT
                </span>

                <strong>
                  Cookie Policy
                </strong>
              </div>

              <div className="cookie-meta-card">
                <span className="cookie-meta-label">
                  PLATFORM
                </span>

                <strong>
                  worldwidedipo.com
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TRUST SUMMARY
        ====================================================== */}

        <section className="cookie-trust-strip">
          <div className="cookie-trust-icon">
            <ShieldIcon />
          </div>

          <div className="cookie-trust-copy">
            <span>THE SHORT VERSION</span>

            <h2>
              Cookies should make the experience work —
              not make your data work against you.
            </h2>

            <p>
              Worldwide DIPO may use essential cookies and similar
              technologies for authentication, security, preferences,
              platform reliability, and — where enabled — privacy-conscious
              analytics.
            </p>
          </div>

          <div className="cookie-trust-badge">
            <span className="cookie-live-dot" />
            <span>PLATFORM SECURITY</span>
          </div>
        </section>

        {/* =====================================================
            MAIN DOCUMENT
        ====================================================== */}

        <div className="cookie-document-layout">
          {/* ===================================================
              SIDEBAR
          ==================================================== */}

          <aside className="cookie-sidebar">
            <div className="cookie-sidebar-inner">
              <div className="cookie-sidebar-heading">
                <span>ON THIS PAGE</span>

                <strong>
                  Cookie Policy
                </strong>
              </div>

              <nav
                className="cookie-sidebar-nav"
                aria-label="Cookie Policy sections"
              >
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="cookie-sidebar-link"
                  >
                    <span className="cookie-sidebar-number">
                      {section.number}
                    </span>

                    <span className="cookie-sidebar-title">
                      {section.title}
                    </span>

                    <span
                      className="cookie-sidebar-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </nav>

              <div className="cookie-sidebar-divider" />

              <div className="cookie-sidebar-links">
                <Link href="/privacy">
                  Privacy Policy
                  <ArrowIcon />
                </Link>

                <Link href="/terms">
                  Terms of Service
                  <ArrowIcon />
                </Link>

                <Link href="/contact">
                  Contact
                  <ArrowIcon />
                </Link>
              </div>

              <div className="cookie-sidebar-status">
                <span className="cookie-sidebar-status-icon">
                  <LockIcon />
                </span>

                <div>
                  <strong>
                    Security first
                  </strong>

                  <span>
                    Essential technologies may be
                    required for account security.
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* ===================================================
              CONTENT
          ==================================================== */}

          <main className="cookie-document">
            {/* 01 */}

            <section
              id="what-are-cookies"
              className="cookie-document-section"
            >
              <SectionHeader
                number="01"
                title="What are cookies?"
                label="FOUNDATION"
              />

              <div className="cookie-prose">
                <p>
                  Cookies are small text files that a website may
                  store on your device when you visit or use the
                  website. They can help a website remember
                  information, maintain sessions, understand
                  basic usage, and provide required functionality.
                </p>

                <p>
                  Worldwide DIPO may also use technologies that
                  work similarly to cookies, including session
                  storage, local storage, security tokens, and
                  analytics identifiers where appropriate.
                </p>

                <div className="cookie-highlight">
                  <div className="cookie-highlight-icon">
                    <InfoIcon />
                  </div>

                  <div>
                    <strong>
                      Cookies are one part of the browser
                      experience.
                    </strong>

                    <p>
                      Not every technology used by a modern
                      website is technically a cookie. This policy
                      therefore also covers similar browser
                      technologies where relevant.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 02 */}

            <section
              id="how-we-use"
              className="cookie-document-section"
            >
              <SectionHeader
                number="02"
                title="How Worldwide DIPO uses cookies"
                label="USAGE"
              />

              <div className="cookie-prose">
                <p>
                  Worldwide DIPO may use cookies and similar
                  technologies for legitimate operational purposes,
                  including:
                </p>

                <div className="cookie-check-grid">
                  {[
                    "Keeping authentication and security sessions working.",
                    "Protecting accounts and platform functionality.",
                    "Remembering necessary preferences and settings.",
                    "Maintaining reliable website functionality.",
                    "Understanding basic platform usage and performance.",
                    "Detecting abuse, suspicious activity, and security issues.",
                    "Improving usability, reliability, and platform performance.",
                    "Supporting secure account and profile-management flows.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="cookie-check-item"
                    >
                      <span>
                        <CheckIcon />
                      </span>

                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 03 */}

            <section
              id="types"
              className="cookie-document-section"
            >
              <SectionHeader
                number="03"
                title="Types of cookies and technologies"
                label="TECHNOLOGY"
              />

              <div className="cookie-prose">
                <p>
                  Different technologies can serve different
                  purposes. The exact technologies used by
                  Worldwide DIPO may change as the platform evolves.
                </p>
              </div>

              <div className="cookie-tech-grid">
                <TechnologyCard
                  number="01"
                  title="Essential technologies"
                  icon={<LockIcon />}
                  description="Required for important functionality such as authentication, security, session management, and core website operation."
                />

                <TechnologyCard
                  number="02"
                  title="Preference technologies"
                  icon={<CookieIcon />}
                  description="May remember choices or settings so that parts of the experience can work more conveniently."
                />

                <TechnologyCard
                  number="03"
                  title="Analytics technologies"
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      width="21"
                      height="21"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 19V9M12 19V5M19 19v-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                  description="Where enabled, analytics technologies may help us understand aggregate usage, performance, and reliability."
                />

                <TechnologyCard
                  number="04"
                  title="Security technologies"
                  icon={<ShieldIcon />}
                  description="Security-related identifiers may help prevent abuse, automated attacks, fraud, and unauthorized activity."
                />
              </div>
            </section>

            {/* 04 */}

            <section
              id="authentication"
              className="cookie-document-section"
            >
              <SectionHeader
                number="04"
                title="Authentication and account sessions"
                label="ACCOUNT"
              />

              <div className="cookie-prose">
                <p>
                  If you sign in to Worldwide DIPO, session
                  technologies may be required to keep you
                  authenticated between requests and pages.
                </p>

                <p>
                  These technologies can be important for features
                  such as your dashboard, profile management,
                  subscription-related actions, and other secure
                  account functionality.
                </p>

                <div className="cookie-security-panel">
                  <div className="cookie-security-icon">
                    <LockIcon />
                  </div>

                  <div>
                    <span>
                      AUTHENTICATED EXPERIENCE
                    </span>

                    <h3>
                      Some essential session technologies
                      cannot simply be switched off.
                    </h3>

                    <p>
                      Disabling required authentication or
                      security technologies may prevent certain
                      account features from functioning correctly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 05 */}

            <section
              id="security"
              className="cookie-document-section"
            >
              <SectionHeader
                number="05"
                title="Security and abuse prevention"
                label="SECURITY"
              />

              <div className="cookie-prose">
                <p>
                  Worldwide DIPO may use cookies or similar
                  identifiers as part of security controls designed
                  to protect users, accounts, profiles, and the
                  platform.
                </p>

                <p>
                  These controls may help identify abnormal
                  activity, reduce automated abuse, protect
                  authentication flows, enforce rate limits, and
                  investigate security incidents.
                </p>

                <div className="cookie-security-grid">
                  <div>
                    <span>01</span>
                    <strong>Account protection</strong>
                    <p>
                      Help maintain secure authenticated sessions.
                    </p>
                  </div>

                  <div>
                    <span>02</span>
                    <strong>Abuse detection</strong>
                    <p>
                      Help identify unusual or automated activity.
                    </p>
                  </div>

                  <div>
                    <span>03</span>
                    <strong>Platform integrity</strong>
                    <p>
                      Help protect important platform flows.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 06 */}

            <section
              id="analytics"
              className="cookie-document-section"
            >
              <SectionHeader
                number="06"
                title="Analytics"
                label="INSIGHTS"
              />

              <div className="cookie-prose">
                <p>
                  Worldwide DIPO may use privacy-conscious
                  analytics or similar technologies to understand
                  how the service is being used.
                </p>

                <p>
                  Depending on the tools enabled at a particular
                  time, analytics may include information such as
                  page interactions, approximate device
                  characteristics, referral information, or
                  aggregated usage patterns.
                </p>

                <p>
                  We do not intend to use analytics systems to
                  collect information that is unnecessary for the
                  operation or improvement of the service.
                </p>

                <div className="cookie-note">
                  <span className="cookie-note-mark">
                    i
                  </span>

                  <p>
                    Analytics providers, if used, may have their
                    own privacy policies and technical practices.
                    Applicable third-party practices are governed
                    by the relevant provider's documentation.
                  </p>
                </div>
              </div>
            </section>

            {/* 07 */}

            <section
              id="profile-pages"
              className="cookie-document-section"
            >
              <SectionHeader
                number="07"
                title="Public profile pages"
                label="PUBLIC"
              />

              <div className="cookie-prose">
                <p>
                  Worldwide DIPO public profile pages are designed
                  to be accessible without visitor login. A public
                  profile may therefore be viewed by anyone who
                  has access to its URL.
                </p>

                <p>
                  Cookies are not used to make a public profile
                  private. Profile visibility is controlled by the
                  profile lifecycle and platform rules described in
                  our Terms of Service and Privacy Policy.
                </p>

                <div className="cookie-public-card">
                  <div className="cookie-public-card-top">
                    <span className="cookie-public-dot" />

                    <span>
                      PUBLIC DIPO PROFILE
                    </span>

                    <span className="cookie-public-url">
                      worldwidedipo.com/p/username
                    </span>
                  </div>

                  <div className="cookie-public-card-body">
                    <strong>
                      One identity. One URL.
                    </strong>

                    <p>
                      Public profile visibility is separate from
                      cookie preferences and visitor authentication.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 08 */}

            <section
              id="third-party"
              className="cookie-document-section"
            >
              <SectionHeader
                number="08"
                title="Third-party services"
                label="SERVICES"
              />

              <div className="cookie-prose">
                <p>
                  Some Worldwide DIPO functionality may rely on
                  carefully selected third-party infrastructure or
                  services. Those services may use their own
                  cookies or similar technologies according to
                  their own policies.
                </p>

                <div className="cookie-third-party-list">
                  {[
                    "Authentication infrastructure",
                    "Security and abuse-prevention services",
                    "Hosting and technical infrastructure",
                    "Payment-related infrastructure",
                    "Analytics or measurement services where enabled",
                    "Other technical service providers required to operate the platform",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="cookie-third-party-item"
                    >
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>

                <p>
                  Third-party services are subject to their own
                  terms and privacy practices. We recommend
                  reviewing the applicable policies when you use a
                  third-party service.
                </p>
              </div>
            </section>

            {/* 09 */}

            <section
              id="browser-controls"
              className="cookie-document-section"
            >
              <SectionHeader
                number="09"
                title="Managing cookies in your browser"
                label="CONTROL"
              />

              <div className="cookie-prose">
                <p>
                  Most modern browsers allow you to control,
                  block, delete, or restrict cookies through their
                  settings.
                </p>

                <p>
                  You can generally find these controls under
                  privacy, security, site settings, or cookie
                  settings in your browser.
                </p>

                <div className="cookie-browser-card">
                  <div className="cookie-browser-header">
                    <span className="cookie-browser-window-dot" />
                    <span className="cookie-browser-window-dot" />
                    <span className="cookie-browser-window-dot" />
                  </div>

                  <div className="cookie-browser-body">
                    <div className="cookie-browser-row">
                      <span>Essential cookies</span>
                      <strong>Required</strong>
                    </div>

                    <div className="cookie-browser-row">
                      <span>Optional technologies</span>
                      <strong>Browser controlled</strong>
                    </div>

                    <div className="cookie-browser-row">
                      <span>Site data</span>
                      <strong>Browser settings</strong>
                    </div>
                  </div>
                </div>

                <div className="cookie-warning">
                  <div className="cookie-warning-icon">
                    !
                  </div>

                  <div>
                    <strong>
                      Important
                    </strong>

                    <p>
                      Blocking or deleting essential cookies may
                      cause parts of Worldwide DIPO, especially
                      authentication and account functionality, to
                      stop working correctly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 10 */}

            <section
              id="local-storage"
              className="cookie-document-section"
            >
              <SectionHeader
                number="10"
                title="Local storage and similar technologies"
                label="BROWSER"
              />

              <div className="cookie-prose">
                <p>
                  In addition to cookies, the website may use
                  browser storage mechanisms such as local storage
                  or session storage when required for specific
                  functionality.
                </p>

                <p>
                  These technologies can store small amounts of
                  information inside your browser and may be
                  removed through browser settings or by clearing
                  site data.
                </p>

                <div className="cookie-storage-grid">
                  <div>
                    <span>LOCAL STORAGE</span>
                    <strong>
                      Browser-persisted data
                    </strong>
                  </div>

                  <div>
                    <span>SESSION STORAGE</span>
                    <strong>
                      Session-scoped data
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* 11 */}

            <section
              id="retention"
              className="cookie-document-section"
            >
              <SectionHeader
                number="11"
                title="Retention"
                label="RETENTION"
              />

              <div className="cookie-prose">
                <p>
                  The retention period of a cookie or similar
                  identifier depends on its purpose.
                </p>

                <div className="cookie-retention-timeline">
                  <div className="cookie-retention-step">
                    <span>01</span>

                    <div>
                      <strong>
                        Session-based
                      </strong>

                      <p>
                        Some technologies may exist only while
                        your browser session is active.
                      </p>
                    </div>
                  </div>

                  <div className="cookie-retention-line" />

                  <div className="cookie-retention-step">
                    <span>02</span>

                    <div>
                      <strong>
                        Expiring
                      </strong>

                      <p>
                        Other technologies may remain until their
                        configured expiration period.
                      </p>
                    </div>
                  </div>

                  <div className="cookie-retention-line" />

                  <div className="cookie-retention-step">
                    <span>03</span>

                    <div>
                      <strong>
                        User controlled
                      </strong>

                      <p>
                        Some browser data can be removed by
                        clearing site data or browser storage.
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  Security, authentication, analytics, and other
                  technical data may have separate retention
                  periods based on operational, security, legal,
                  and business requirements.
                </p>
              </div>
            </section>

            {/* 12 */}

            <section
              id="updates"
              className="cookie-document-section cookie-document-section-last"
            >
              <SectionHeader
                number="12"
                title="Changes to this Cookie Policy"
                label="UPDATES"
              />

              <div className="cookie-prose">
                <p>
                  We may update this Cookie Policy when our
                  platform, technology, security practices, or
                  legal requirements change.
                </p>

                <p>
                  When material changes are made, we may update
                  the effective date or provide an appropriate
                  notice through the platform.
                </p>

                <div className="cookie-update-card">
                  <div className="cookie-update-icon">
                    ↻
                  </div>

                  <div>
                    <span>
                      POLICY VERSION
                    </span>

                    <strong>
                      Current version · September 2026
                    </strong>

                    <p>
                      Please review this page periodically for
                      updates that may affect how browser
                      technologies are used on Worldwide DIPO.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                CONTACT
            ================================================== */}

            <section className="cookie-contact-card">
              <div className="cookie-contact-glow" />

              <div className="cookie-contact-content">
                <span className="cookie-contact-eyebrow">
                  QUESTIONS?
                </span>

                <h2>
                  Need clarity about
                  <span> cookies or privacy?</span>
                </h2>

                <p>
                  If you have a question about this Cookie Policy,
                  our privacy practices, or how Worldwide DIPO
                  handles browser technologies, contact the
                  official support team.
                </p>

                <div className="cookie-contact-actions">
                  <a
                    href="mailto:dipolabs123@gmail.com?subject=Worldwide%20DIPO%20Cookie%20Policy"
                    className="cookie-contact-primary"
                  >
                    <span>
                      Contact support
                    </span>

                    <ArrowIcon />
                  </a>

                  <Link
                    href="/privacy"
                    className="cookie-contact-secondary"
                  >
                    Privacy Policy
                    <ArrowIcon />
                  </Link>
                </div>
              </div>

              <div className="cookie-contact-mark">
                <ShieldIcon />
              </div>
            </section>

            {/* =================================================
                FOOT NOTE
            ================================================== */}

            <div className="cookie-final-note">
              <span>
                WORLDWIDE DIPO
              </span>

              <i />

              <span>
                YOUR DIGITAL IDENTITY
              </span>

              <i />

              <span>
                PRIVACY &amp; SECURITY
              </span>
            </div>
          </main>
        </div>
      </div>

      {/* =====================================================
          SELF-CONTAINED PREMIUM STYLES
      ====================================================== */}

      <style>{`
        .cookie-policy-shell {
          --cookie-black: #0a0a0a;
          --cookie-text: #111827;
          --cookie-muted: #64748b;
          --cookie-soft: #f8fafc;
          --cookie-border: #e7eaf0;
          --cookie-border-strong: #d9dee7;
          --cookie-green: #10b981;
          --cookie-green-dark: #047857;
          --cookie-green-soft: #ecfdf5;
          --cookie-blue: #2563eb;
          --cookie-blue-soft: #eff6ff;

          width: 100%;
          min-width: 0;
          color: var(--cookie-text);
        }

        .cookie-policy-shell,
        .cookie-policy-shell * {
          box-sizing: border-box;
        }

        .cookie-hero {
          position: relative;
          overflow: hidden;
          margin: 0 0 28px;
          padding: clamp(34px, 6vw, 78px);
          border: 1px solid var(--cookie-border);
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 82% 16%,
              rgba(16, 185, 129, 0.13),
              transparent 29%
            ),
            radial-gradient(
              circle at 8% 100%,
              rgba(37, 99, 235, 0.07),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #ffffff 0%,
              #fbfcfd 52%,
              #f7faf9 100%
            );
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.055),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .cookie-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.42;
          background-image:
            linear-gradient(
              rgba(15, 23, 42, 0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(15, 23, 42, 0.025) 1px,
              transparent 1px
            );
          background-size: 32px 32px;
          mask-image: linear-gradient(
            to bottom right,
            black,
            transparent 78%
          );
        }

        .cookie-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 900px;
        }

        .cookie-hero-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(2px);
        }

        .cookie-hero-glow-one {
          top: -190px;
          right: -90px;
          background: rgba(16, 185, 129, 0.09);
        }

        .cookie-hero-glow-two {
          bottom: -220px;
          left: 20%;
          background: rgba(37, 99, 235, 0.055);
        }

        .cookie-eyebrow {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 22px;
          color: #64748b;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.12em;
        }

        .cookie-eyebrow-icon {
          display: grid;
          width: 31px;
          height: 31px;
          place-items: center;
          border: 1px solid #d1fae5;
          border-radius: 10px;
          background: #ecfdf5;
          color: var(--cookie-green-dark);
        }

        .cookie-eyebrow-line {
          width: 28px;
          height: 1px;
          background: #cbd5e1;
        }

        .cookie-hero h1 {
          max-width: 760px;
          margin: 0;
          color: var(--cookie-black);
          font-size: clamp(52px, 8vw, 94px);
          line-height: 0.94;
          letter-spacing: -0.065em;
          font-weight: 850;
        }

        .cookie-hero h1 span {
          color: var(--cookie-green-dark);
        }

        .cookie-hero-description {
          max-width: 720px;
          margin: 26px 0 0;
          color: #526174;
          font-size: clamp(16px, 1.7vw, 20px);
          line-height: 1.7;
          letter-spacing: -0.012em;
        }

        .cookie-hero-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 34px;
          max-width: 760px;
        }

        .cookie-meta-card {
          min-width: 0;
          padding: 14px 16px;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.76);
          backdrop-filter: blur(14px);
        }

        .cookie-meta-label {
          display: block;
          margin-bottom: 6px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.11em;
        }

        .cookie-meta-card strong {
          display: block;
          overflow-wrap: anywhere;
          color: #1e293b;
          font-size: 12px;
          line-height: 1.4;
          font-weight: 750;
        }

        .cookie-trust-strip {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 18px;
          margin-bottom: 48px;
          padding: 21px;
          border: 1px solid #d1fae5;
          border-radius: 21px;
          background:
            linear-gradient(
              135deg,
              #f0fdf4,
              #ffffff 55%,
              #f8fafc
            );
        }

        .cookie-trust-icon {
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border-radius: 15px;
          background: #dcfce7;
          color: #047857;
        }

        .cookie-trust-copy {
          min-width: 0;
        }

        .cookie-trust-copy > span {
          display: block;
          margin-bottom: 5px;
          color: #059669;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.11em;
        }

        .cookie-trust-copy h2 {
          max-width: 780px;
          margin: 0;
          color: #111827;
          font-size: clamp(15px, 1.8vw, 19px);
          line-height: 1.35;
          letter-spacing: -0.025em;
        }

        .cookie-trust-copy p {
          max-width: 800px;
          margin: 6px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.65;
        }

        .cookie-trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
          padding: 8px 10px;
          border: 1px solid #d1fae5;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          color: #047857;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.06em;
        }

        .cookie-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
        }

        .cookie-document-layout {
          display: grid;
          grid-template-columns: 245px minmax(0, 1fr);
          gap: clamp(28px, 5vw, 62px);
          align-items: start;
        }

        .cookie-sidebar {
          min-width: 0;
        }

        .cookie-sidebar-inner {
          position: sticky;
          top: 24px;
        }

        .cookie-sidebar-heading {
          margin-bottom: 12px;
        }

        .cookie-sidebar-heading span {
          display: block;
          margin-bottom: 5px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .cookie-sidebar-heading strong {
          color: #111827;
          font-size: 15px;
          font-weight: 800;
        }

        .cookie-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cookie-sidebar-link {
          display: grid;
          grid-template-columns: 25px minmax(0, 1fr) 15px;
          gap: 7px;
          align-items: center;
          min-width: 0;
          padding: 8px 8px;
          border-radius: 10px;
          color: #64748b;
          text-decoration: none;
          transition:
            background 160ms ease,
            color 160ms ease,
            transform 160ms ease;
        }

        .cookie-sidebar-link:hover {
          background: #f8fafc;
          color: #047857;
          transform: translateX(2px);
        }

        .cookie-sidebar-number {
          color: #a1aab8;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          font-weight: 800;
        }

        .cookie-sidebar-title {
          min-width: 0;
          font-size: 11px;
          line-height: 1.35;
          font-weight: 700;
        }

        .cookie-sidebar-arrow {
          color: #cbd5e1;
          font-size: 12px;
        }

        .cookie-sidebar-link:hover .cookie-sidebar-arrow {
          color: #10b981;
        }

        .cookie-sidebar-divider {
          height: 1px;
          margin: 18px 0;
          background: var(--cookie-border);
        }

        .cookie-sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cookie-sidebar-links a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 8px 9px;
          border-radius: 9px;
          color: #64748b;
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
        }

        .cookie-sidebar-links a:hover {
          background: #f8fafc;
          color: #047857;
        }

        .cookie-sidebar-links svg {
          width: 14px;
          height: 14px;
        }

        .cookie-sidebar-status {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 18px;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          background: #fafafa;
        }

        .cookie-sidebar-status-icon {
          display: grid;
          flex: 0 0 auto;
          width: 29px;
          height: 29px;
          place-items: center;
          border-radius: 9px;
          background: #ecfdf5;
          color: #047857;
        }

        .cookie-sidebar-status strong,
        .cookie-sidebar-status span {
          display: block;
        }

        .cookie-sidebar-status strong {
          margin-bottom: 2px;
          color: #334155;
          font-size: 10px;
          font-weight: 800;
        }

        .cookie-sidebar-status div > span {
          color: #94a3b8;
          font-size: 9px;
          line-height: 1.5;
        }

        .cookie-document {
          min-width: 0;
        }

        .cookie-document-section {
          scroll-margin-top: 28px;
          margin-bottom: 58px;
          padding-bottom: 58px;
          border-bottom: 1px solid var(--cookie-border);
        }

        .cookie-document-section-last {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: 0;
        }

        .cookie-section-heading {
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr);
          gap: 15px;
          align-items: start;
          margin-bottom: 22px;
        }

        .cookie-section-index {
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border: 1px solid #d1fae5;
          border-radius: 13px;
          background: #f0fdf4;
          color: #047857;
        }

        .cookie-section-index span {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
          font-weight: 900;
        }

        .cookie-section-heading-copy {
          min-width: 0;
        }

        .cookie-section-label {
          display: block;
          margin-bottom: 5px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.11em;
        }

        .cookie-section-heading h2 {
          margin: 0;
          color: #111827;
          font-size: clamp(22px, 3vw, 30px);
          line-height: 1.2;
          letter-spacing: -0.035em;
          font-weight: 850;
        }

        .cookie-prose {
          color: #475569;
          font-size: 14px;
          line-height: 1.85;
        }

        .cookie-prose p {
          margin: 0 0 16px;
        }

        .cookie-prose p:last-child {
          margin-bottom: 0;
        }

        .cookie-highlight {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin-top: 22px;
          padding: 17px;
          border: 1px solid #dbeafe;
          border-radius: 16px;
          background: #f8fbff;
        }

        .cookie-highlight-icon {
          display: grid;
          flex: 0 0 auto;
          width: 34px;
          height: 34px;
          place-items: center;
          border-radius: 10px;
          background: #dbeafe;
          color: #2563eb;
        }

        .cookie-highlight strong {
          display: block;
          margin-bottom: 4px;
          color: #1e293b;
          font-size: 12px;
          font-weight: 850;
        }

        .cookie-highlight p {
          color: #64748b;
          font-size: 12px;
          line-height: 1.65;
        }

        .cookie-check-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 21px;
        }

        .cookie-check-item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          min-width: 0;
          padding: 13px;
          border: 1px solid #e8edf2;
          border-radius: 13px;
          background: #fff;
        }

        .cookie-check-item > span {
          display: grid;
          flex: 0 0 auto;
          width: 25px;
          height: 25px;
          place-items: center;
          border-radius: 8px;
          background: #ecfdf5;
          color: #059669;
        }

        .cookie-check-item p {
          margin: 2px 0 0;
          color: #475569;
          font-size: 11px;
          line-height: 1.55;
        }

        .cookie-tech-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 22px;
        }

        .cookie-tech-card {
          min-width: 0;
          padding: 18px;
          border: 1px solid var(--cookie-border);
          border-radius: 17px;
          background: #fff;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.025);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .cookie-tech-card:hover {
          transform: translateY(-2px);
          border-color: #d1fae5;
          box-shadow: 0 14px 35px rgba(15, 23, 42, 0.055);
        }

        .cookie-tech-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .cookie-tech-icon {
          display: grid;
          width: 37px;
          height: 37px;
          place-items: center;
          border-radius: 11px;
          background: #f0fdf4;
          color: #047857;
        }

        .cookie-tech-number {
          color: #cbd5e1;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          font-weight: 900;
        }

        .cookie-tech-card h3 {
          margin: 15px 0 5px;
          color: #1e293b;
          font-size: 14px;
          font-weight: 850;
        }

        .cookie-tech-card p {
          margin: 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.65;
        }

        .cookie-security-panel {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 14px;
          margin-top: 22px;
          padding: 19px;
          border: 1px solid #d1fae5;
          border-radius: 17px;
          background:
            linear-gradient(
              135deg,
              #f0fdf4,
              #ffffff
            );
        }

        .cookie-security-icon {
          display: grid;
          width: 40px;
          height: 40px;
          place-items: center;
          border-radius: 12px;
          background: #dcfce7;
          color: #047857;
        }

        .cookie-security-panel span {
          display: block;
          margin-bottom: 4px;
          color: #059669;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.11em;
        }

        .cookie-security-panel h3 {
          margin: 0 0 5px;
          color: #1e293b;
          font-size: 14px;
          line-height: 1.4;
          font-weight: 850;
        }

        .cookie-security-panel p {
          color: #64748b;
          font-size: 11px;
          line-height: 1.65;
        }

        .cookie-security-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
          margin-top: 22px;
        }

        .cookie-security-grid > div {
          min-width: 0;
          padding: 14px;
          border: 1px solid var(--cookie-border);
          border-radius: 14px;
          background: #fff;
        }

        .cookie-security-grid span {
          display: block;
          margin-bottom: 9px;
          color: #10b981;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          font-weight: 900;
        }

        .cookie-security-grid strong {
          display: block;
          margin-bottom: 4px;
          color: #334155;
          font-size: 11px;
          font-weight: 850;
        }

        .cookie-security-grid p {
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.55;
        }

        .cookie-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 21px;
          padding: 14px;
          border-radius: 13px;
          background: #f8fafc;
        }

        .cookie-note-mark {
          display: grid;
          flex: 0 0 auto;
          width: 24px;
          height: 24px;
          place-items: center;
          border-radius: 8px;
          background: #e2e8f0;
          color: #475569;
          font-size: 11px;
          font-weight: 900;
        }

        .cookie-note p {
          color: #64748b;
          font-size: 11px;
          line-height: 1.65;
        }

        .cookie-public-card {
          overflow: hidden;
          margin-top: 22px;
          border: 1px solid #d1fae5;
          border-radius: 18px;
          background: #ffffff;
        }

        .cookie-public-card-top {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 13px;
          border-bottom: 1px solid #e5e7eb;
          background: #fafafa;
          color: #64748b;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .cookie-public-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 4px #ecfdf5;
        }

        .cookie-public-url {
          margin-left: auto;
          overflow: hidden;
          max-width: 230px;
          color: #94a3b8;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cookie-public-card-body {
          padding: 19px;
        }

        .cookie-public-card-body strong {
          display: block;
          margin-bottom: 5px;
          color: #111827;
          font-size: 17px;
          letter-spacing: -0.025em;
        }

        .cookie-public-card-body p {
          color: #64748b;
          font-size: 11px;
          line-height: 1.65;
        }

        .cookie-third-party-list {
          margin: 20px 0;
          border-top: 1px solid var(--cookie-border);
        }

        .cookie-third-party-item {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          padding: 11px 0;
          border-bottom: 1px solid var(--cookie-border);
        }

        .cookie-third-party-item span {
          color: #10b981;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          font-weight: 900;
        }

        .cookie-third-party-item strong {
          color: #475569;
          font-size: 11px;
          font-weight: 700;
        }

        .cookie-browser-card {
          overflow: hidden;
          margin: 22px 0;
          border: 1px solid #dbe3ea;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.035);
        }

        .cookie-browser-header {
          display: flex;
          gap: 5px;
          padding: 9px 12px;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .cookie-browser-window-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        .cookie-browser-body {
          padding: 5px 15px;
        }

        .cookie-browser-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .cookie-browser-row:last-child {
          border-bottom: 0;
        }

        .cookie-browser-row span {
          color: #64748b;
          font-size: 11px;
        }

        .cookie-browser-row strong {
          color: #334155;
          font-size: 10px;
          font-weight: 800;
        }

        .cookie-warning {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          padding: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #f8fafc;
        }

        .cookie-warning-icon {
          display: grid;
          flex: 0 0 auto;
          width: 27px;
          height: 27px;
          place-items: center;
          border-radius: 9px;
          background: #e2e8f0;
          color: #475569;
          font-size: 12px;
          font-weight: 900;
        }

        .cookie-warning strong {
          display: block;
          margin-bottom: 3px;
          color: #334155;
          font-size: 11px;
          font-weight: 850;
        }

        .cookie-warning p {
          color: #64748b;
          font-size: 10px;
          line-height: 1.6;
        }

        .cookie-storage-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin: 22px 0;
        }

        .cookie-storage-grid > div {
          padding: 16px;
          border: 1px solid var(--cookie-border);
          border-radius: 14px;
          background: #fff;
        }

        .cookie-storage-grid span {
          display: block;
          margin-bottom: 7px;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .cookie-storage-grid strong {
          color: #475569;
          font-size: 11px;
          font-weight: 750;
        }

        .cookie-retention-timeline {
          margin: 22px 0;
          padding: 18px;
          border: 1px solid var(--cookie-border);
          border-radius: 17px;
          background: #fafafa;
        }

        .cookie-retention-step {
          display: grid;
          grid-template-columns: 32px minmax(0, 1fr);
          gap: 11px;
        }

        .cookie-retention-step > span {
          display: grid;
          width: 30px;
          height: 30px;
          place-items: center;
          border-radius: 9px;
          background: #ecfdf5;
          color: #047857;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 8px;
          font-weight: 900;
        }

        .cookie-retention-step strong {
          display: block;
          margin: 2px 0 3px;
          color: #334155;
          font-size: 11px;
          font-weight: 850;
        }

        .cookie-retention-step p {
          color: #64748b;
          font-size: 10px;
          line-height: 1.55;
        }

        .cookie-retention-line {
          width: 1px;
          height: 20px;
          margin: 3px 0 3px 15px;
          background: #d1fae5;
        }

        .cookie-update-card {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 13px;
          margin-top: 22px;
          padding: 18px;
          border: 1px solid #dbeafe;
          border-radius: 17px;
          background: #f8fbff;
        }

        .cookie-update-icon {
          display: grid;
          width: 39px;
          height: 39px;
          place-items: center;
          border-radius: 12px;
          background: #dbeafe;
          color: #2563eb;
          font-size: 19px;
          font-weight: 600;
        }

        .cookie-update-card span {
          display: block;
          margin-bottom: 4px;
          color: #64748b;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .cookie-update-card strong {
          display: block;
          margin-bottom: 5px;
          color: #1e293b;
          font-size: 12px;
          font-weight: 850;
        }

        .cookie-update-card p {
          color: #64748b;
          font-size: 10px;
          line-height: 1.6;
        }

        .cookie-contact-card {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 25px;
          overflow: hidden;
          margin-top: 64px;
          padding: clamp(22px, 4vw, 34px);
          border: 1px solid #d1fae5;
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(16, 185, 129, 0.12),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #f0fdf4,
              #ffffff 65%
            );
        }

        .cookie-contact-glow {
          position: absolute;
          right: -120px;
          bottom: -140px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.07);
          filter: blur(4px);
        }

        .cookie-contact-content {
          position: relative;
          z-index: 1;
        }

        .cookie-contact-eyebrow {
          display: block;
          margin-bottom: 8px;
          color: #059669;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .cookie-contact-card h2 {
          max-width: 650px;
          margin: 0;
          color: #111827;
          font-size: clamp(24px, 4vw, 38px);
          line-height: 1.1;
          letter-spacing: -0.045em;
          font-weight: 850;
        }

        .cookie-contact-card h2 span {
          color: #047857;
        }

        .cookie-contact-card p {
          max-width: 650px;
          margin: 12px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .cookie-contact-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
        }

        .cookie-contact-primary,
        .cookie-contact-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 11px;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease;
        }

        .cookie-contact-primary {
          background: #111827;
          color: #fff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
        }

        .cookie-contact-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.16);
        }

        .cookie-contact-secondary {
          border: 1px solid #d1fae5;
          background: rgba(255, 255, 255, 0.78);
          color: #047857;
        }

        .cookie-contact-secondary:hover {
          transform: translateY(-1px);
          background: #fff;
        }

        .cookie-contact-mark {
          position: relative;
          z-index: 1;
          display: grid;
          width: 76px;
          height: 76px;
          place-items: center;
          align-self: center;
          border: 1px solid #d1fae5;
          border-radius: 23px;
          background: rgba(255, 255, 255, 0.75);
          color: #059669;
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.05);
        }

        .cookie-final-note {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 9px;
          margin: 27px 0 4px;
          color: #a1aab8;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.11em;
          text-align: center;
        }

        .cookie-final-note i {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        @media (max-width: 980px) {
          .cookie-document-layout {
            grid-template-columns: 1fr;
          }

          .cookie-sidebar-inner {
            position: static;
          }

          .cookie-sidebar-nav {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 3px;
          }

          .cookie-sidebar-status {
            max-width: 420px;
          }

          .cookie-document {
            min-width: 0;
          }
        }

        @media (max-width: 720px) {
          .cookie-hero {
            border-radius: 24px;
            padding: 28px 20px;
          }

          .cookie-hero h1 {
            font-size: clamp(47px, 15vw, 72px);
          }

          .cookie-hero-description {
            font-size: 15px;
          }

          .cookie-hero-meta {
            grid-template-columns: 1fr;
          }

          .cookie-trust-strip {
            grid-template-columns: auto minmax(0, 1fr);
            align-items: start;
            padding: 16px;
          }

          .cookie-trust-badge {
            grid-column: 1 / -1;
            justify-self: start;
            margin-left: 66px;
          }

          .cookie-sidebar-nav {
            grid-template-columns: 1fr;
          }

          .cookie-check-grid,
          .cookie-tech-grid,
          .cookie-security-grid,
          .cookie-storage-grid {
            grid-template-columns: 1fr;
          }

          .cookie-document-section {
            margin-bottom: 43px;
            padding-bottom: 43px;
          }

          .cookie-contact-card {
            grid-template-columns: 1fr;
            margin-top: 46px;
          }

          .cookie-contact-mark {
            display: none;
          }

          .cookie-public-url {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .cookie-eyebrow {
            font-size: 8px;
          }

          .cookie-hero {
            padding: 24px 16px;
          }

          .cookie-section-heading {
            grid-template-columns: 39px minmax(0, 1fr);
            gap: 11px;
          }

          .cookie-section-index {
            width: 36px;
            height: 36px;
            border-radius: 10px;
          }

          .cookie-section-heading h2 {
            font-size: 21px;
          }

          .cookie-prose {
            font-size: 13px;
          }

          .cookie-security-panel {
            grid-template-columns: 1fr;
          }

          .cookie-security-icon {
            width: 35px;
            height: 35px;
          }

          .cookie-contact-actions {
            flex-direction: column;
          }

          .cookie-contact-primary,
          .cookie-contact-secondary {
            width: 100%;
          }

          .cookie-final-note {
            line-height: 1.8;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cookie-sidebar-link,
          .cookie-tech-card,
          .cookie-contact-primary,
          .cookie-contact-secondary {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}