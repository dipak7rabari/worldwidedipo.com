import Link from 'next/link';

export const metadata = {
  title: 'About Worldwide DIPO | Your Digital Identity',
  description:
    'Discover Worldwide DIPO — a web-native digital identity platform for students, professionals, creators, freelancers, workers and local businesses.',
  keywords: [
    'Worldwide DIPO',
    'DIPO LABS',
    'digital identity',
    'digital profile',
    'professional identity',
    'creator profile',
    'business profile',
    'personal website',
  ],
  alternates: {
    canonical: 'https://worldwidedipo.com/about',
  },
  openGraph: {
    title: 'About Worldwide DIPO',
    description:
      'Your identity, your rules. A clean, searchable digital home for real people.',
    url: 'https://worldwidedipo.com/about',
    siteName: 'Worldwide DIPO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Worldwide DIPO',
    description:
      'Your identity, your rules. A clean, searchable digital home for real people.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ArrowUpRight = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M7 17L17 7M8 7H17V16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5 12H19M13 6L19 12L13 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GlobeIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M3 12H21M12 3C14.4 5.6 15.5 8.6 15.5 12C15.5 15.4 14.4 18.4 12 21M12 3C9.6 5.6 8.5 8.6 8.5 12C8.5 15.4 9.6 18.4 12 21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ShieldIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 3L19 6V11.5C19 16.1 16.1 19.7 12 21C7.9 19.7 5 16.1 5 11.5V6L12 3Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 12L10.8 14.3L15.7 9.4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="10.8"
      cy="10.8"
      r="6.8"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M16 16L21 21"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const SparkleIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M19 16L19.7 18.3L22 19L19.7 19.7L19 22L18.3 19.7L16 19L18.3 18.3L19 16Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="8"
      r="3.5"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M5 21C5.7 16.9 8 15 12 15C16 15 18.3 16.9 19 21"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const BriefcaseIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="7"
      width="18"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M8 7V5.5C8 4.7 8.7 4 9.5 4H14.5C15.3 4 16 4.7 16 5.5V7M3 12H21"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const CodeIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M9 7L4 12L9 17M15 7L20 12L15 17M13 4L11 20"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LayersIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 3L21 8L12 13L3 8L12 3Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M3 12L12 17L21 12M3 16L12 21L21 16"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5 12.5L9.2 16.5L19 6.8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const audiences = [
  {
    icon: <UserIcon />,
    label: 'INDIVIDUALS',
    title: 'Your name deserves a home.',
    text:
      'Create one clean place for your bio, skills, important links, work and the information you actually want people to discover.',
  },
  {
    icon: <CodeIcon />,
    label: 'CREATORS',
    title: 'Turn scattered links into one identity.',
    text:
      'Bring your social presence, portfolio, content and contact points together behind one memorable web address.',
  },
  {
    icon: <BriefcaseIcon />,
    label: 'PROFESSIONALS',
    title: 'More than a digital card.',
    text:
      'Present experience, services, projects and professional information in a structured public profile.',
  },
  {
    icon: <GlobeIcon />,
    label: 'LOCAL BUSINESS',
    title: 'Put your business on the web.',
    text:
      'Show services, pricing, location, contact information and other useful business details in one shareable destination.',
  },
];

const principles = [
  {
    number: '01',
    icon: <GlobeIcon />,
    title: 'Pure web',
    text:
      'No APK. No app-store dependency. Worldwide DIPO is built around the open web so your identity can be reached from a browser.',
  },
  {
    number: '02',
    icon: <SearchIcon />,
    title: 'Search-ready',
    text:
      'Public profiles are structured for discoverability, with profile information presented in a format that can be understood by search engines.',
  },
  {
    number: '03',
    icon: <ShieldIcon />,
    title: 'Privacy-minded',
    text:
      'Public profile information and private account/payment records are treated as different layers rather than one public data bucket.',
  },
  {
    number: '04',
    icon: <SparkleIcon />,
    title: 'Made for humans',
    text:
      'The product is intentionally simple: create your identity, control what you publish, and share one clean link.',
  },
];

const journey = [
  {
    number: '01',
    title: 'Create',
    text: 'Start with your name, username and the identity you want to put on the web.',
  },
  {
    number: '02',
    title: 'Shape',
    text: 'Add the information, links, work and services that represent you.',
  },
  {
    number: '03',
    title: 'Verify',
    text: 'Complete the platform verification flow when you choose a paid identity plan.',
  },
  {
    number: '04',
    title: 'Share',
    text: 'Use your DIPO address across social profiles, resumes, WhatsApp, cards and conversations.',
  },
];

export default function AboutPage() {
  return (
    <>
      <main className="about-page">
        <div className="about-noise" aria-hidden="true" />

        <div className="about-ambient about-ambient-one" aria-hidden="true" />
        <div className="about-ambient about-ambient-two" aria-hidden="true" />

        {/* BACK / TOP BAR */}
        <div className="about-shell">
          <div className="about-topbar">
            <Link
              href="/"
              className="about-back"
              aria-label="Back to Worldwide DIPO home"
            >
              <span className="about-back-icon">
                <ArrowRight size={16} />
              </span>
              <span>Back to home</span>
            </Link>

            <div className="about-topbar-meta">
              <span className="about-live-dot" />
              <span>WORLDWIDE DIPO</span>
            </div>
          </div>
        </div>

        {/* HERO */}
        <section className="about-hero">
          <div className="about-shell about-hero-grid">
            <div className="about-hero-copy">
              <div className="about-eyebrow">
                <span className="about-eyebrow-line" />
                <span>DIPO LABS × WORLDWIDE DIPO</span>
              </div>

              <h1>
                Your identity.
                <br />
                <span>Your rules.</span>
              </h1>

              <p className="about-hero-lead">
                A clean, professional and search-ready digital home for
                students, freelancers, creators, professionals, workers and
                local businesses.
              </p>

              <p className="about-hero-description">
                The internet gave everyone a place to publish. Worldwide DIPO
                is built around a simpler idea: <strong>everyone should have
                a place to represent themselves.</strong>
              </p>

              <div className="about-hero-actions">
                <Link href="/auth/signup" className="about-primary-button">
                  Create your DIPO
                  <ArrowUpRight size={18} />
                </Link>

                <Link href="/pricing" className="about-secondary-button">
                  Explore plans
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="about-hero-note">
                <span className="about-note-check">
                  <CheckIcon size={14} />
                </span>
                <span>Built for the open web · Made in India</span>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="about-hero-visual" aria-hidden="true">
              <div className="visual-grid" />

              <div className="visual-orbit visual-orbit-one" />
              <div className="visual-orbit visual-orbit-two" />
              <div className="visual-orbit visual-orbit-three" />

              <div className="visual-card visual-card-main">
                <div className="visual-browser-bar">
                  <div className="visual-browser-dots">
                    <i />
                    <i />
                    <i />
                  </div>

                  <div className="visual-url">
                    <span>worldwidedipo.com</span>
                    <span className="visual-url-lock">●</span>
                  </div>

                  <span className="visual-browser-menu">•••</span>
                </div>

                <div className="visual-profile">
                  <div className="visual-profile-top">
                    <div className="visual-avatar">D</div>

                    <div className="visual-profile-title">
                      <strong>Your Name</strong>
                      <span>
                        Digital Identity
                        <b>✓</b>
                      </span>
                    </div>
                  </div>

                  <div className="visual-profile-copy">
                    <span className="visual-line visual-line-long" />
                    <span className="visual-line" />
                    <span className="visual-line visual-line-short" />
                  </div>

                  <div className="visual-pills">
                    <span>Work</span>
                    <span>Skills</span>
                    <span>Links</span>
                  </div>

                  <div className="visual-profile-url">
                    <span>worldwidedipo.com/p/your-name</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>

              <div className="visual-float visual-float-one">
                <span className="visual-float-label">IDENTITY</span>
                <strong>YOURS.</strong>
              </div>

              <div className="visual-float visual-float-two">
                <span className="visual-float-label">ONE ADDRESS</span>
                <strong>YOUR WORLD.</strong>
              </div>

              <div className="visual-signal">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="about-trust-strip">
          <div className="about-shell about-trust-grid">
            <div className="trust-item">
              <span className="trust-icon">
                <GlobeIcon size={19} />
              </span>
              <div>
                <strong>Web-native</strong>
                <span>No app required</span>
              </div>
            </div>

            <div className="trust-divider" />

            <div className="trust-item">
              <span className="trust-icon">
                <SearchIcon size={19} />
              </span>
              <div>
                <strong>Discoverable</strong>
                <span>Built for the web</span>
              </div>
            </div>

            <div className="trust-divider" />

            <div className="trust-item">
              <span className="trust-icon">
                <ShieldIcon size={19} />
              </span>
              <div>
                <strong>Privacy-minded</strong>
                <span>Public ≠ private</span>
              </div>
            </div>

            <div className="trust-divider" />

            <div className="trust-item">
              <span className="trust-icon">
                <SparkleIcon size={19} />
              </span>
              <div>
                <strong>Made in India</strong>
                <span>Built for everyone</span>
              </div>
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="about-section about-manifesto">
          <div className="about-shell">
            <div className="section-kicker">
              <span>01</span>
              WHY DIPO EXISTS
            </div>

            <div className="manifesto-grid">
              <div className="manifesto-heading">
                <h2>
                  The internet is full of
                  <br />
                  <span>people without a home.</span>
                </h2>
              </div>

              <div className="manifesto-copy">
                <p className="large-copy">
                  Aaj ek person ka digital presence Instagram par ho sakta hai,
                  WhatsApp par ho sakta hai, LinkedIn par ho sakta hai, aur
                  portfolio kisi completely different link par.
                </p>

                <p>
                  Information exists everywhere — but identity often feels
                  fragmented.
                </p>

                <p>
                  Worldwide DIPO ka idea isi fragmentation ko simplify karna
                  hai: <strong>one intentional public identity</strong> that
                  can represent the person behind all those platforms.
                </p>
              </div>
            </div>

            <div className="manifesto-statement">
              <span className="statement-mark">“</span>
              <p>
                Your social platforms can change.
                <br />
                <strong>Your identity should still have a home.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* PROBLEM / SOLUTION */}
        <section className="about-section about-problem">
          <div className="about-shell">
            <div className="problem-header">
              <div>
                <div className="section-kicker">
                  <span>02</span>
                  THE PROBLEM
                </div>

                <h2>
                  Too many platforms.
                  <br />
                  <span>Not enough identity.</span>
                </h2>
              </div>

              <p>
                DIPO is designed around the gap between having an online
                presence and having a clear digital identity.
              </p>
            </div>

            <div className="problem-cards">
              <article className="problem-card">
                <div className="problem-number">01</div>
                <div className="problem-card-icon">
                  <LayersIcon />
                </div>
                <h3>Fragmented presence</h3>
                <p>
                  Your work, links, contact information and story are often
                  scattered across multiple services.
                </p>
                <div className="problem-card-footer">
                  <span>SCATTERED</span>
                  <span>→</span>
                </div>
              </article>

              <article className="problem-card problem-card-highlight">
                <div className="problem-number">02</div>
                <div className="problem-card-icon">
                  <SearchIcon />
                </div>
                <h3>Hard to discover</h3>
                <p>
                  A social username is useful, but it does not always tell
                  someone who you are, what you do or where everything belongs.
                </p>
                <div className="problem-card-footer">
                  <span>UNCLEAR</span>
                  <span>→</span>
                </div>
              </article>

              <article className="problem-card">
                <div className="problem-number">03</div>
                <div className="problem-card-icon">
                  <UserIcon />
                </div>
                <h3>No canonical home</h3>
                <p>
                  People need one intentional destination they can share when
                  someone simply asks: “Who are you?”
                </p>
                <div className="problem-card-footer">
                  <span>FRAGMENTED</span>
                  <span>→</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="about-section about-philosophy">
          <div className="about-shell philosophy-grid">
            <div className="philosophy-copy">
              <div className="section-kicker">
                <span>03</span>
                OUR PHILOSOPHY
              </div>

              <h2>
                Your identity.
                <br />
                <span>Your rules.</span>
              </h2>

              <p className="philosophy-lead">
                We believe your digital footprint should work for you — not
                become a reason to collect everything about you.
              </p>

              <p>
                Worldwide DIPO is designed around intentional publishing.
                You decide what belongs on your public profile and what
                remains private to your account.
              </p>

              <div className="philosophy-points">
                <div>
                  <span>
                    <CheckIcon size={15} />
                  </span>
                  <p>Publish information you choose to make public.</p>
                </div>

                <div>
                  <span>
                    <CheckIcon size={15} />
                  </span>
                  <p>Keep account and payment records separate from public projection.</p>
                </div>

                <div>
                  <span>
                    <CheckIcon size={15} />
                  </span>
                  <p>Use one identity address across the open web.</p>
                </div>
              </div>
            </div>

            <div className="philosophy-visual" aria-hidden="true">
              <div className="philosophy-glow" />

              <div className="philosophy-ring philosophy-ring-one" />
              <div className="philosophy-ring philosophy-ring-two" />

              <div className="philosophy-core">
                <span>YOU</span>
                <strong>CONTROL</strong>
              </div>

              <div className="philosophy-node philosophy-node-one">
                PROFILE
              </div>

              <div className="philosophy-node philosophy-node-two">
                LINKS
              </div>

              <div className="philosophy-node philosophy-node-three">
                WORK
              </div>

              <div className="philosophy-node philosophy-node-four">
                CONTACT
              </div>
            </div>
          </div>
        </section>

        {/* CORE PILLARS */}
        <section className="about-section about-pillars">
          <div className="about-shell">
            <div className="pillars-heading">
              <div>
                <div className="section-kicker">
                  <span>04</span>
                  WHAT MAKES DIPO DIFFERENT
                </div>

                <h2>
                  Built like a product.
                  <br />
                  <span>Designed like a home.</span>
                </h2>
              </div>

              <p>
                The goal is not to add another complicated social network. It
                is to create a focused identity layer on the web.
              </p>
            </div>

            <div className="pillar-grid">
              {principles.map((item) => (
                <article className="pillar-card" key={item.number}>
                  <div className="pillar-top">
                    <span className="pillar-number">{item.number}</span>
                    <span className="pillar-icon">{item.icon}</span>
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>

                  <div className="pillar-bottom">
                    <span>WORLDWIDE DIPO</span>
                    <ArrowUpRight size={15} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* IDENTITY JOURNEY */}
        <section className="about-section about-journey">
          <div className="about-shell">
            <div className="journey-heading">
              <div className="section-kicker">
                <span>05</span>
                FROM NAME TO IDENTITY
              </div>

              <h2>
                Four simple steps.
                <br />
                <span>One public destination.</span>
              </h2>

              <p>
                DIPO is designed to stay understandable from the first click
                to the final share.
              </p>
            </div>

            <div className="journey-track">
              <div className="journey-line" />

              {journey.map((item, index) => (
                <article className="journey-step" key={item.number}>
                  <div className="journey-dot">
                    <span>{item.number}</span>
                  </div>

                  <div className="journey-content">
                    <span className="journey-index">
                      STEP {item.number}
                    </span>

                    <h3>{item.title}</h3>

                    <p>{item.text}</p>
                  </div>

                  {index !== journey.length - 1 && (
                    <div className="journey-mobile-arrow">
                      <ArrowRight size={16} />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="about-section about-audience">
          <div className="about-shell">
            <div className="audience-heading">
              <div>
                <div className="section-kicker">
                  <span>06</span>
                  WHO IT IS FOR
                </div>

                <h2>
                  One platform.
                  <br />
                  <span>Many kinds of people.</span>
                </h2>
              </div>

              <p>
                You do not need to be a celebrity, company or full-time
                creator to deserve a professional presence on the web.
              </p>
            </div>

            <div className="audience-grid">
              {audiences.map((item) => (
                <article className="audience-card" key={item.label}>
                  <div className="audience-card-top">
                    <span className="audience-icon">{item.icon}</span>
                    <span className="audience-label">{item.label}</span>
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>

                  <div className="audience-arrow">
                    <ArrowUpRight size={17} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TECH / ENGINEERING */}
        <section className="about-section about-engineering">
          <div className="about-shell">
            <div className="engineering-layout">
              <div className="engineering-copy">
                <div className="section-kicker">
                  <span>07</span>
                  THE ENGINEERING FEEL
                </div>

                <h2>
                  Minimal on the surface.
                  <br />
                  <span>Intentional underneath.</span>
                </h2>

                <p className="engineering-lead">
                  The experience is designed to feel fast and calm, while the
                  underlying product is built around structured profiles,
                  controlled publishing and verification workflows.
                </p>

                <div className="engineering-list">
                  <div>
                    <span>01</span>
                    <strong>Structured profiles</strong>
                    <p>
                      Identity information can be presented consistently
                      rather than as an unstructured collection of links.
                    </p>
                  </div>

                  <div>
                    <span>02</span>
                    <strong>Search-aware pages</strong>
                    <p>
                      Public identity pages can use structured metadata to
                      communicate profile context to search engines.
                    </p>
                  </div>

                  <div>
                    <span>03</span>
                    <strong>Verification workflow</strong>
                    <p>
                      Paid profile activation uses a controlled verification
                      process instead of allowing a browser to directly claim
                      an active status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="engineering-console" aria-hidden="true">
                <div className="console-top">
                  <div className="console-dots">
                    <i />
                    <i />
                    <i />
                  </div>

                  <span>identity.system</span>
                </div>

                <div className="console-body">
                  <div className="console-row">
                    <span className="console-number">01</span>
                    <span className="console-key">profile</span>
                    <span className="console-value">public_projection</span>
                  </div>

                  <div className="console-row">
                    <span className="console-number">02</span>
                    <span className="console-key">visibility</span>
                    <span className="console-value">controlled</span>
                  </div>

                  <div className="console-row">
                    <span className="console-number">03</span>
                    <span className="console-key">identity</span>
                    <span className="console-value">web_native</span>
                  </div>

                  <div className="console-row">
                    <span className="console-number">04</span>
                    <span className="console-key">verification</span>
                    <span className="console-value">admin_review</span>
                  </div>

                  <div className="console-row">
                    <span className="console-number">05</span>
                    <span className="console-key">indexing</span>
                    <span className="console-value">search_ready</span>
                  </div>

                  <div className="console-divider" />

                  <div className="console-status">
                    <span className="console-status-dot" />
                    <span>WORLDWIDE DIPO / SYSTEM READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SNAPSHOT */}
        <section className="about-section about-plans">
          <div className="about-shell">
            <div className="plans-heading">
              <div className="section-kicker">
                <span>08</span>
                SIMPLE ACCESS
              </div>

              <h2>
                Clear plans.
                <br />
                <span>No mystery.</span>
              </h2>

              <p>
                Worldwide DIPO currently offers six-month identity plans with
                manual payment verification.
              </p>
            </div>

            <div className="plan-grid">
              <article className="plan-card">
                <span className="plan-index">01</span>
                <span className="plan-name">STARTER INDEX</span>
                <strong className="plan-price">₹149</strong>
                <span className="plan-duration">6 months</span>
                <p>
                  For individuals and students building their first public
                  digital identity.
                </p>
                <div className="plan-line" />
                <span className="plan-link">
                  Verified profile
                  <ArrowUpRight size={15} />
                </span>
              </article>

              <article className="plan-card plan-card-featured">
                <span className="plan-index">02</span>
                <span className="plan-name">PRO CREATOR</span>
                <strong className="plan-price">₹349</strong>
                <span className="plan-duration">6 months</span>
                <p>
                  For creators, freelancers and professionals who need more
                  space for their work.
                </p>
                <div className="plan-line" />
                <span className="plan-link">
                  Creator identity
                  <ArrowUpRight size={15} />
                </span>
              </article>

              <article className="plan-card">
                <span className="plan-index">03</span>
                <span className="plan-name">AUTHORITY ELITE</span>
                <strong className="plan-price">₹499</strong>
                <span className="plan-duration">6 months</span>
                <p>
                  For local businesses, studios and agencies building a
                  stronger public business presence.
                </p>
                <div className="plan-line" />
                <span className="plan-link">
                  Business identity
                  <ArrowUpRight size={15} />
                </span>
              </article>
            </div>
          </div>
        </section>

        {/* INDIA / DIPO LABS */}
        <section className="about-section about-india">
          <div className="about-shell">
            <div className="india-card">
              <div className="india-glow india-glow-one" />
              <div className="india-glow india-glow-two" />

              <div className="india-mark" aria-hidden="true">
                <span>𝔄</span>
                <span>𝔇𝔐</span>
              </div>

              <div className="india-copy">
                <div className="section-kicker section-kicker-light">
                  <span>09</span>
                  BUILT FROM INDIA · FOR THE WORLD
                </div>

                <h2>
                  Global web standards.
                  <br />
                  <span>Indian ambition.</span>
                </h2>

                <p>
                  Worldwide DIPO is a DIPO LABS product built with a simple
                  belief: Indian creators, professionals, workers, students
                  and local businesses should be able to build a polished
                  digital identity without needing a complicated website
                  project.
                </p>

                <p>
                  The product is web-first, intentionally lightweight and
                  designed to make a person's online presence feel more
                  intentional.
                </p>

                <div className="india-meta">
                  <span>
                    <span className="india-meta-dot" />
                    MADE WITH PURPOSE
                  </span>

                  <span>
                    <span className="india-meta-dot" />
                    MADE IN INDIA
                  </span>

                  <span>
                    <span className="india-meta-dot" />
                    WORLDWIDE WEB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="about-section about-support">
          <div className="about-shell support-grid">
            <div>
              <div className="section-kicker">
                <span>10</span>
                OFFICIAL SUPPORT
              </div>

              <h2>
                Need to talk?
                <br />
                <span>Use the official channels.</span>
              </h2>

              <p>
                We keep support simple. Queries are handled through official
                digital channels rather than personal phone numbers.
              </p>
            </div>

            <div className="support-card">
              <div className="support-card-header">
                <span className="support-status">
                  <span />
                  OFFICIAL
                </span>

                <span className="support-card-brand">DIPO LABS</span>
              </div>

              <a
                href="mailto:dipolabs123@gmail.com"
                className="support-row"
              >
                <span className="support-row-label">EMAIL</span>
                <strong>dipolabs123@gmail.com</strong>
                <ArrowUpRight size={17} />
              </a>

              <a
                href="https://instagram.com/dipolabs.io"
                target="_blank"
                rel="noreferrer"
                className="support-row"
              >
                <span className="support-row-label">INSTAGRAM</span>
                <strong>@dipolabs.io</strong>
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="about-final">
          <div className="about-final-grid" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className="about-shell about-final-inner">
            <span className="final-kicker">WORLDWIDE DIPO</span>

            <h2>
              You already have
              <br />
              <span>a story.</span>
            </h2>

            <p>
              Give it one place on the web.
            </p>

            <div className="final-actions">
              <Link href="/auth/signup" className="about-primary-button">
                Build your identity
                <ArrowUpRight size={18} />
              </Link>

              <Link href="/" className="about-final-link">
                Explore Worldwide DIPO
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="about-footer">
          <div className="about-shell">
            <div className="footer-main">
              <div className="footer-brand">
                <Link href="/" className="footer-logo">
                  WORLDWIDE DIPO
                </Link>

                <p>
                  Har insaan ki apni
                  <br />
                  digital pehchaan.
                </p>
              </div>

              <div className="footer-links">
                <div>
                  <span className="footer-heading">EXPLORE</span>
                  <Link href="/about">About</Link>
                  <Link href="/pricing">Pricing</Link>
                  <Link href="/contact">Contact</Link>
                </div>

                <div>
                  <span className="footer-heading">LEGAL</span>
                  <Link href="/privacy">Privacy</Link>
                  <Link href="/terms">Terms</Link>
                  <Link href="/refund">Refund</Link>
                </div>

                <div>
                  <span className="footer-heading">SUPPORT</span>
                  <a href="mailto:dipolabs123@gmail.com">
                    Email support
                  </a>
                  <a
                    href="https://instagram.com/dipolabs.io"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-divider" />

            <div className="footer-bottom">
              <div className="footer-made">
                <span>Made With ❤️ in India</span>
              </div>

              <div className="footer-product">
                <span>𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱</span>
              </div>

              <div className="footer-copyright">
                <span>
                  All copyrights reserved @ 𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        :root {
          --about-black: #080a0a;
          --about-ink: #101313;
          --about-muted: #68706e;
          --about-soft: #8b9290;
          --about-line: #e8ebe9;
          --about-bg: #ffffff;
          --about-soft-bg: #f7f8f7;
          --about-green: #10b981;
          --about-green-dark: #059669;
          --about-green-soft: #ecfdf5;
          --about-max: 1240px;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .about-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #fff;
          color: var(--about-ink);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .about-page a {
          color: inherit;
          text-decoration: none;
        }

        .about-shell {
          position: relative;
          z-index: 2;
          width: min(
            calc(100% - 40px),
            var(--about-max)
          );
          margin-inline: auto;
        }

        .about-noise {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.025;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
        }

        .about-ambient {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(90px);
          opacity: 0.18;
        }

        .about-ambient-one {
          top: 420px;
          left: -250px;
          width: 500px;
          height: 500px;
          background: #d1fae5;
          animation: ambientFloatOne 14s ease-in-out infinite;
        }

        .about-ambient-two {
          top: 1100px;
          right: -250px;
          width: 520px;
          height: 520px;
          background: #dbeafe;
          animation: ambientFloatTwo 18s ease-in-out infinite;
        }

        .about-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 76px;
          border-bottom: 1px solid rgba(16, 19, 19, 0.07);
        }

        .about-back {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #535b59;
          font-size: 13px;
          font-weight: 650;
          letter-spacing: -0.01em;
          transition:
            color 180ms ease,
            transform 180ms ease;
        }

        .about-back:hover {
          color: #080a0a;
          transform: translateX(-2px);
        }

        .about-back-icon {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border: 1px solid #e5e9e7;
          border-radius: 999px;
          background: #fff;
          transform: rotate(180deg);
          transition:
            border-color 180ms ease,
            background 180ms ease;
        }

        .about-back:hover .about-back-icon {
          border-color: #cbd5d1;
          background: #f8faf9;
        }

        .about-topbar-meta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #8a918f;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: 0.16em;
        }

        .about-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--about-green);
          box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.09);
          animation: livePulse 2.4s ease-in-out infinite;
        }

        .about-hero {
          position: relative;
          padding: clamp(76px, 10vw, 132px) 0 100px;
        }

        .about-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(420px, 0.98fr);
          align-items: center;
          gap: clamp(50px, 7vw, 110px);
        }

        .about-hero-copy {
          position: relative;
          z-index: 3;
          animation: fadeUp 800ms cubic-bezier(.2,.8,.2,1) both;
        }

        .about-eyebrow,
        .section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: #727a77;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .about-eyebrow-line {
          width: 34px;
          height: 1px;
          background: var(--about-green);
        }

        .about-hero h1 {
          max-width: 820px;
          margin: 25px 0 25px;
          color: #080a0a;
          font-size: clamp(54px, 7.1vw, 96px);
          font-weight: 670;
          letter-spacing: -0.075em;
          line-height: 0.93;
        }

        .about-hero h1 span {
          color: #89918e;
        }

        .about-hero-lead {
          max-width: 650px;
          margin: 0;
          color: #202625;
          font-size: clamp(20px, 2.2vw, 27px);
          font-weight: 430;
          letter-spacing: -0.035em;
          line-height: 1.3;
        }

        .about-hero-description {
          max-width: 610px;
          margin: 22px 0 0;
          color: #707875;
          font-size: 16px;
          line-height: 1.75;
        }

        .about-hero-description strong {
          color: #222927;
          font-weight: 650;
        }

        .about-hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 11px;
          margin-top: 34px;
        }

        .about-primary-button,
        .about-secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 0 19px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.01em;
          transition:
            transform 220ms cubic-bezier(.2,.8,.2,1),
            box-shadow 220ms ease,
            border-color 220ms ease,
            background 220ms ease;
        }

        .about-primary-button {
          color: #fff;
          background: #090c0b;
          box-shadow:
            0 10px 30px rgba(0,0,0,.08),
            inset 0 1px rgba(255,255,255,.08);
        }

        .about-primary-button:hover {
          transform: translateY(-2px);
          background: #151918;
          box-shadow: 0 16px 38px rgba(0,0,0,.12);
        }

        .about-secondary-button {
          color: #303735;
          border: 1px solid #e2e7e5;
          background: rgba(255,255,255,.8);
        }

        .about-secondary-button:hover {
          transform: translateY(-2px);
          border-color: #cfd7d4;
          background: #fff;
        }

        .about-hero-note {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 22px;
          color: #8a928f;
          font-size: 11px;
          font-weight: 600;
        }

        .about-note-check {
          display: grid;
          place-items: center;
          width: 21px;
          height: 21px;
          border-radius: 50%;
          color: #059669;
          background: #ecfdf5;
        }

        .about-hero-visual {
          position: relative;
          min-height: 590px;
          isolation: isolate;
          animation: fadeUp 950ms 100ms cubic-bezier(.2,.8,.2,1) both;
        }

        .visual-grid {
          position: absolute;
          inset: 8% 3% 5%;
          opacity: 0.45;
          background-image:
            linear-gradient(#e9eeeb 1px, transparent 1px),
            linear-gradient(90deg, #e9eeeb 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: radial-gradient(circle at center, black 20%, transparent 72%);
          -webkit-mask-image: radial-gradient(circle at center, black 20%, transparent 72%);
        }

        .visual-orbit {
          position: absolute;
          border: 1px solid rgba(16, 185, 129, 0.13);
          border-radius: 999px;
          transform: rotate(-18deg);
          animation: orbitRotate 20s linear infinite;
        }

        .visual-orbit-one {
          inset: 15% 7%;
        }

        .visual-orbit-two {
          inset: 25% 15%;
          transform: rotate(22deg);
          animation-duration: 25s;
          animation-direction: reverse;
        }

        .visual-orbit-three {
          inset: 35% 24%;
          transform: rotate(-8deg);
          animation-duration: 30s;
        }

        .visual-card-main {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(440px, 78%);
          overflow: hidden;
          border: 1px solid #dfe6e2;
          border-radius: 25px;
          background: rgba(255,255,255,.92);
          box-shadow:
            0 40px 90px rgba(15,23,42,.10),
            0 10px 30px rgba(15,23,42,.05),
            inset 0 1px rgba(255,255,255,.9);
          transform: translate(-50%, -50%) rotate(-2deg);
          animation: cardFloat 7s ease-in-out infinite;
          backdrop-filter: blur(12px);
        }

        .visual-browser-bar {
          display: flex;
          align-items: center;
          gap: 13px;
          height: 48px;
          padding: 0 15px;
          border-bottom: 1px solid #edf0ef;
          background: #fbfcfc;
        }

        .visual-browser-dots {
          display: flex;
          gap: 5px;
        }

        .visual-browser-dots i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d8dddb;
        }

        .visual-url {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          min-width: 0;
          height: 26px;
          padding: 0 10px;
          border: 1px solid #e9eceb;
          border-radius: 7px;
          background: #fff;
          color: #858d8a;
          font-size: 9px;
        }

        .visual-url-lock {
          color: #10b981;
          font-size: 7px;
        }

        .visual-browser-menu {
          color: #9ca3a1;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .visual-profile {
          padding: 35px;
        }

        .visual-profile-top {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .visual-avatar {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border: 1px solid #dce5e0;
          border-radius: 17px;
          color: #fff;
          background:
            linear-gradient(145deg, #1d2925, #090d0c);
          font-size: 22px;
          font-weight: 750;
          box-shadow: 0 12px 28px rgba(0,0,0,.12);
        }

        .visual-profile-title {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .visual-profile-title strong {
          color: #151a18;
          font-size: 18px;
          letter-spacing: -0.035em;
        }

        .visual-profile-title span {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #858e8a;
          font-size: 10px;
        }

        .visual-profile-title b {
          display: grid;
          place-items: center;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          color: #fff;
          background: #10b981;
          font-size: 8px;
        }

        .visual-profile-copy {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 31px;
        }

        .visual-line {
          display: block;
          width: 78%;
          height: 7px;
          border-radius: 99px;
          background: #edf1ef;
        }

        .visual-line-long {
          width: 94%;
        }

        .visual-line-short {
          width: 54%;
        }

        .visual-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 25px;
        }

        .visual-pills span {
          padding: 7px 10px;
          border: 1px solid #e5eae8;
          border-radius: 999px;
          color: #69716e;
          background: #fbfcfb;
          font-size: 9px;
          font-weight: 650;
        }

        .visual-profile-url {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 28px;
          padding: 13px 14px;
          border: 1px solid #dfe8e3;
          border-radius: 12px;
          color: #26312d;
          background: #f7fbf9;
          font-size: 9px;
          font-weight: 650;
        }

        .visual-profile-url svg {
          color: #059669;
          flex: 0 0 auto;
        }

        .visual-float {
          position: absolute;
          display: flex;
          flex-direction: column;
          min-width: 130px;
          padding: 15px 17px;
          border: 1px solid #e5eae8;
          border-radius: 15px;
          background: rgba(255,255,255,.9);
          box-shadow: 0 20px 45px rgba(15,23,42,.08);
          backdrop-filter: blur(12px);
        }

        .visual-float-label {
          color: #9aa19f;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .16em;
        }

        .visual-float strong {
          margin-top: 4px;
          color: #111615;
          font-size: 14px;
          letter-spacing: -.025em;
        }

        .visual-float-one {
          top: 17%;
          left: 0;
          animation: floatOne 6s ease-in-out infinite;
        }

        .visual-float-two {
          right: 0;
          bottom: 17%;
          animation: floatTwo 7s ease-in-out infinite;
        }

        .visual-signal {
          position: absolute;
          right: 13%;
          top: 11%;
          display: flex;
          gap: 4px;
        }

        .visual-signal span {
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #10b981;
          animation: signalPulse 1.7s ease-in-out infinite;
        }

        .visual-signal span:nth-child(2) {
          animation-delay: .25s;
        }

        .visual-signal span:nth-child(3) {
          animation-delay: .5s;
        }

        .about-trust-strip {
          position: relative;
          z-index: 3;
          border-top: 1px solid #eef1ef;
          border-bottom: 1px solid #eef1ef;
          background: rgba(250,251,250,.75);
        }

        .about-trust-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          align-items: center;
          min-height: 105px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 15px 20px;
        }

        .trust-icon {
          display: grid;
          place-items: center;
          width: 35px;
          height: 35px;
          border: 1px solid #e5eae8;
          border-radius: 10px;
          color: #59615e;
          background: #fff;
        }

        .trust-item div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .trust-item strong {
          color: #272d2b;
          font-size: 11px;
          font-weight: 750;
        }

        .trust-item div span {
          color: #929a97;
          font-size: 9px;
        }

        .trust-divider {
          width: 1px;
          height: 34px;
          background: #e7ebe9;
        }

        .about-section {
          position: relative;
          padding: clamp(90px, 11vw, 150px) 0;
        }

        .section-kicker span {
          display: inline-grid;
          place-items: center;
          min-width: 28px;
          height: 22px;
          border: 1px solid #dfe5e2;
          border-radius: 999px;
          color: #69716e;
          font-size: 9px;
          letter-spacing: 0;
        }

        .manifesto-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(330px, .9fr);
          gap: clamp(50px, 9vw, 150px);
          margin-top: 52px;
        }

        .manifesto-heading h2,
        .problem-header h2,
        .pillars-heading h2,
        .audience-heading h2,
        .engineering-copy h2,
        .plans-heading h2,
        .journey-heading h2 {
          margin: 0;
          color: #0b0e0d;
          font-size: clamp(40px, 5vw, 67px);
          font-weight: 610;
          letter-spacing: -.065em;
          line-height: .99;
        }

        .manifesto-heading h2 span,
        .problem-header h2 span,
        .pillars-heading h2 span,
        .audience-heading h2 span,
        .engineering-copy h2 span,
        .plans-heading h2 span,
        .journey-heading h2 span {
          color: #929a97;
        }

        .manifesto-copy {
          padding-top: 4px;
        }

        .manifesto-copy p {
          margin: 0 0 22px;
          color: #737b78;
          font-size: 15px;
          line-height: 1.8;
        }

        .manifesto-copy .large-copy {
          color: #343b38;
          font-size: 19px;
          letter-spacing: -.025em;
          line-height: 1.6;
        }

        .manifesto-copy strong {
          color: #161b19;
          font-weight: 700;
        }

        .manifesto-statement {
          display: flex;
          align-items: flex-start;
          gap: 28px;
          margin-top: 95px;
          padding: 40px 0 0;
          border-top: 1px solid #e7ebe9;
        }

        .statement-mark {
          color: #10b981;
          font-family: Georgia, serif;
          font-size: 64px;
          line-height: .7;
        }

        .manifesto-statement p {
          margin: 0;
          color: #454d49;
          font-size: clamp(22px, 3vw, 34px);
          letter-spacing: -.045em;
          line-height: 1.25;
        }

        .manifesto-statement strong {
          color: #111514;
          font-weight: 620;
        }

        .about-problem {
          background: #f7f9f8;
          border-top: 1px solid #edf0ef;
          border-bottom: 1px solid #edf0ef;
        }

        .problem-header,
        .pillars-heading,
        .audience-heading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(260px, .48fr);
          gap: 60px;
          align-items: end;
        }

        .problem-header h2,
        .pillars-heading h2,
        .audience-heading h2 {
          margin-top: 28px;
        }

        .problem-header > p,
        .pillars-heading > p,
        .audience-heading > p {
          margin: 0 0 3px;
          color: #737b78;
          font-size: 14px;
          line-height: 1.75;
        }

        .problem-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 55px;
        }

        .problem-card {
          position: relative;
          min-height: 355px;
          padding: 28px;
          overflow: hidden;
          border: 1px solid #e1e7e4;
          border-radius: 20px;
          background: #fff;
          transition:
            transform 260ms cubic-bezier(.2,.8,.2,1),
            box-shadow 260ms ease,
            border-color 260ms ease;
        }

        .problem-card:hover {
          transform: translateY(-7px);
          border-color: #d4ddd9;
          box-shadow: 0 25px 55px rgba(15,23,42,.07);
        }

        .problem-card-highlight {
          background: linear-gradient(145deg, #fff, #f1faf6);
          border-color: #d5e7de;
        }

        .problem-number {
          position: absolute;
          top: 25px;
          right: 27px;
          color: #b0b7b4;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .12em;
        }

        .problem-card-icon {
          display: grid;
          place-items: center;
          width: 45px;
          height: 45px;
          margin-top: 38px;
          border: 1px solid #e4eae7;
          border-radius: 13px;
          color: #39423e;
          background: #fbfcfb;
        }

        .problem-card h3 {
          margin: 70px 0 11px;
          color: #151a18;
          font-size: 21px;
          letter-spacing: -.04em;
        }

        .problem-card p {
          max-width: 320px;
          margin: 0;
          color: #78817d;
          font-size: 13px;
          line-height: 1.7;
        }

        .problem-card-footer {
          position: absolute;
          right: 28px;
          bottom: 24px;
          left: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #edf0ef;
          color: #9aa19f;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .15em;
        }

        .problem-card-footer span:last-child {
          color: #69736e;
          font-size: 15px;
        }

        .about-philosophy {
          overflow: hidden;
        }

        .philosophy-grid {
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(420px, 1.1fr);
          gap: clamp(50px, 9vw, 130px);
          align-items: center;
        }

        .philosophy-copy h2 {
          margin: 26px 0 27px;
          color: #0a0d0c;
          font-size: clamp(50px, 6vw, 78px);
          font-weight: 620;
          letter-spacing: -.075em;
          line-height: .92;
        }

        .philosophy-copy h2 span {
          color: #929a97;
        }

        .philosophy-lead {
          max-width: 540px;
          color: #343c39;
          font-size: 19px;
          letter-spacing: -.025em;
          line-height: 1.6;
        }

        .philosophy-copy > p:not(.philosophy-lead) {
          max-width: 530px;
          color: #7a827f;
          font-size: 14px;
          line-height: 1.8;
        }

        .philosophy-points {
          display: grid;
          gap: 13px;
          margin-top: 30px;
        }

        .philosophy-points > div {
          display: flex;
          align-items: flex-start;
          gap: 11px;
        }

        .philosophy-points > div > span {
          display: grid;
          place-items: center;
          width: 23px;
          height: 23px;
          flex: 0 0 auto;
          border-radius: 50%;
          color: #059669;
          background: #ecfdf5;
        }

        .philosophy-points p {
          margin: 1px 0 0;
          color: #59625e;
          font-size: 13px;
          line-height: 1.5;
        }

        .philosophy-visual {
          position: relative;
          min-height: 520px;
          border: 1px solid #e8ecea;
          border-radius: 30px;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 50%, rgba(16,185,129,.08), transparent 28%),
            #fafcfb;
        }

        .philosophy-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: rgba(16,185,129,.14);
          filter: blur(45px);
          transform: translate(-50%, -50%);
          animation: glowPulse 4s ease-in-out infinite;
        }

        .philosophy-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px solid rgba(16,185,129,.16);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .philosophy-ring-one {
          width: 240px;
          height: 240px;
          animation: ringPulse 5s ease-in-out infinite;
        }

        .philosophy-ring-two {
          width: 380px;
          height: 380px;
          border-color: rgba(100,116,108,.10);
          animation: ringPulse 7s 1s ease-in-out infinite reverse;
        }

        .philosophy-core {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 122px;
          height: 122px;
          border: 1px solid #dce7e1;
          border-radius: 50%;
          color: #fff;
          background: #0a0f0d;
          box-shadow: 0 25px 55px rgba(0,0,0,.14);
          transform: translate(-50%, -50%);
        }

        .philosophy-core span {
          color: #aab2ae;
          font-size: 9px;
          letter-spacing: .16em;
        }

        .philosophy-core strong {
          margin-top: 5px;
          font-size: 12px;
          letter-spacing: .06em;
        }

        .philosophy-node {
          position: absolute;
          padding: 9px 12px;
          border: 1px solid #e0e7e3;
          border-radius: 999px;
          color: #67706c;
          background: rgba(255,255,255,.88);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .13em;
          box-shadow: 0 12px 28px rgba(15,23,42,.05);
          backdrop-filter: blur(10px);
        }

        .philosophy-node-one {
          top: 18%;
          left: 23%;
        }

        .philosophy-node-two {
          top: 27%;
          right: 15%;
        }

        .philosophy-node-three {
          right: 22%;
          bottom: 18%;
        }

        .philosophy-node-four {
          bottom: 28%;
          left: 14%;
        }

        .about-pillars {
          background: #f7f9f8;
          border-top: 1px solid #edf0ef;
          border-bottom: 1px solid #edf0ef;
        }

        .pillar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-top: 58px;
        }

        .pillar-card {
          min-height: 330px;
          padding: 24px;
          border: 1px solid #e1e7e4;
          border-radius: 19px;
          background: #fff;
          transition:
            transform 240ms ease,
            box-shadow 240ms ease;
        }

        .pillar-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 48px rgba(15,23,42,.06);
        }

        .pillar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pillar-number {
          color: #a0a8a4;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .pillar-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid #e4eae7;
          border-radius: 12px;
          color: #3e4743;
          background: #fafcfb;
        }

        .pillar-card h3 {
          margin: 72px 0 11px;
          color: #161b19;
          font-size: 19px;
          letter-spacing: -.035em;
        }

        .pillar-card p {
          margin: 0;
          color: #7a827f;
          font-size: 12px;
          line-height: 1.75;
        }

        .pillar-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 32px;
          padding-top: 14px;
          border-top: 1px solid #edf0ef;
          color: #a0a7a4;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .13em;
        }

        .pillar-bottom svg {
          color: #10b981;
        }

        .about-journey {
          background: #fff;
        }

        .journey-heading {
          max-width: 800px;
        }

        .journey-heading h2 {
          margin-top: 27px;
        }

        .journey-heading p {
          max-width: 500px;
          margin: 25px 0 0;
          color: #737b78;
          font-size: 14px;
          line-height: 1.75;
        }

        .journey-track {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-top: 78px;
        }

        .journey-line {
          position: absolute;
          top: 21px;
          right: 10%;
          left: 10%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #dfe6e2 12%,
            #dfe6e2 88%,
            transparent
          );
        }

        .journey-step {
          position: relative;
          z-index: 1;
          padding: 0 25px;
          text-align: center;
        }

        .journey-step:first-of-type {
          padding-left: 0;
        }

        .journey-step:last-of-type {
          padding-right: 0;
        }

        .journey-dot {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          margin: 0 auto;
          border: 1px solid #dce5e1;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 7px #fff;
        }

        .journey-dot span {
          color: #059669;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .04em;
        }

        .journey-content {
          padding-top: 30px;
        }

        .journey-index {
          color: #a0a8a4;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .15em;
        }

        .journey-content h3 {
          margin: 12px 0 8px;
          color: #151a18;
          font-size: 20px;
          letter-spacing: -.035em;
        }

        .journey-content p {
          max-width: 220px;
          margin: 0 auto;
          color: #7b8380;
          font-size: 12px;
          line-height: 1.7;
        }

        .journey-mobile-arrow {
          display: none;
        }

        .about-audience {
          background: #f7f9f8;
          border-top: 1px solid #edf0ef;
          border-bottom: 1px solid #edf0ef;
        }

        .audience-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-top: 55px;
        }

        .audience-card {
          position: relative;
          min-height: 340px;
          padding: 24px;
          overflow: hidden;
          border: 1px solid #e0e6e3;
          border-radius: 19px;
          background: #fff;
          transition:
            transform 240ms ease,
            box-shadow 240ms ease;
        }

        .audience-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 55px rgba(15,23,42,.06);
        }

        .audience-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .audience-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid #e2e9e5;
          border-radius: 12px;
          color: #3c4541;
          background: #fbfcfb;
        }

        .audience-label {
          color: #a0a8a4;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .15em;
        }

        .audience-card h3 {
          max-width: 230px;
          margin: 72px 0 11px;
          color: #171c1a;
          font-size: 20px;
          letter-spacing: -.045em;
          line-height: 1.08;
        }

        .audience-card p {
          margin: 0;
          color: #79817e;
          font-size: 12px;
          line-height: 1.75;
        }

        .audience-arrow {
          position: absolute;
          right: 22px;
          bottom: 22px;
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 1px solid #e5eae8;
          border-radius: 50%;
          color: #66706c;
          background: #fafcfb;
          transition:
            transform 180ms ease,
            background 180ms ease;
        }

        .audience-card:hover .audience-arrow {
          transform: translate(2px, -2px);
          background: #ecfdf5;
          color: #059669;
        }

        .about-engineering {
          background: #fff;
        }

        .engineering-layout {
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(420px, 1.1fr);
          gap: clamp(50px, 8vw, 120px);
          align-items: center;
        }

        .engineering-copy h2 {
          margin-top: 27px;
        }

        .engineering-lead {
          max-width: 570px;
          margin: 28px 0 0;
          color: #737b78;
          font-size: 15px;
          line-height: 1.8;
        }

        .engineering-list {
          display: grid;
          gap: 24px;
          margin-top: 38px;
        }

        .engineering-list > div {
          display: grid;
          grid-template-columns: 32px 1fr;
          column-gap: 13px;
        }

        .engineering-list > div > span {
          grid-row: span 2;
          color: #10b981;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .1em;
        }

        .engineering-list strong {
          color: #202623;
          font-size: 14px;
        }

        .engineering-list p {
          margin: 4px 0 0;
          color: #7e8682;
          font-size: 12px;
          line-height: 1.65;
        }

        .engineering-console {
          overflow: hidden;
          border: 1px solid #202725;
          border-radius: 22px;
          background: #0c1110;
          box-shadow: 0 35px 70px rgba(0,0,0,.14);
          transform: rotate(1.2deg);
          transition: transform 300ms ease;
        }

        .engineering-console:hover {
          transform: rotate(0deg) translateY(-5px);
        }

        .console-top {
          display: flex;
          align-items: center;
          gap: 13px;
          height: 47px;
          padding: 0 16px;
          border-bottom: 1px solid #202825;
          color: #78827e;
          font-size: 9px;
        }

        .console-dots {
          display: flex;
          gap: 5px;
        }

        .console-dots i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #39423e;
        }

        .console-body {
          padding: 27px;
        }

        .console-row {
          display: grid;
          grid-template-columns: 30px 110px 1fr;
          gap: 10px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,.045);
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: 10px;
        }

        .console-number {
          color: #46514c;
        }

        .console-key {
          color: #8d9b94;
        }

        .console-value {
          color: #6ee7b7;
          text-align: right;
        }

        .console-divider {
          height: 1px;
          margin: 18px 0;
          background: #202825;
        }

        .console-status {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #66746d;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: 8px;
          letter-spacing: .08em;
        }

        .console-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 5px rgba(16,185,129,.08);
        }

        .about-plans {
          background: #f7f9f8;
          border-top: 1px solid #edf0ef;
          border-bottom: 1px solid #edf0ef;
        }

        .plans-heading {
          max-width: 800px;
        }

        .plans-heading h2 {
          margin-top: 27px;
        }

        .plans-heading p {
          max-width: 500px;
          margin: 24px 0 0;
          color: #737b78;
          font-size: 14px;
          line-height: 1.75;
        }

        .plan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
          margin-top: 55px;
        }

        .plan-card {
          position: relative;
          min-height: 355px;
          padding: 28px;
          border: 1px solid #e0e6e3;
          border-radius: 20px;
          background: #fff;
          transition:
            transform 240ms ease,
            box-shadow 240ms ease;
        }

        .plan-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 55px rgba(15,23,42,.07);
        }

        .plan-card-featured {
          border-color: #cce4d8;
          background:
            radial-gradient(circle at 90% 0%, rgba(16,185,129,.10), transparent 32%),
            #fff;
        }

        .plan-index {
          color: #a2aaa7;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .plan-name {
          display: block;
          margin-top: 50px;
          color: #68716d;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .15em;
        }

        .plan-price {
          display: block;
          margin-top: 9px;
          color: #111615;
          font-size: 43px;
          font-weight: 620;
          letter-spacing: -.07em;
        }

        .plan-duration {
          color: #9aa19e;
          font-size: 10px;
        }

        .plan-card p {
          max-width: 290px;
          margin: 25px 0 0;
          color: #79817e;
          font-size: 12px;
          line-height: 1.7;
        }

        .plan-line {
          position: absolute;
          right: 28px;
          bottom: 62px;
          left: 28px;
          height: 1px;
          background: #edf0ef;
        }

        .plan-link {
          position: absolute;
          right: 28px;
          bottom: 27px;
          left: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #555f5a;
          font-size: 10px;
          font-weight: 700;
        }

        .plan-link svg {
          color: #059669;
        }

        .about-india {
          padding-bottom: 0;
        }

        .india-card {
          position: relative;
          display: grid;
          grid-template-columns: 180px minmax(0, 1fr);
          gap: 70px;
          min-height: 540px;
          padding: clamp(40px, 6vw, 75px);
          overflow: hidden;
          border-radius: 30px 30px 0 0;
          color: #fff;
          background:
            radial-gradient(circle at 15% 10%, rgba(16,185,129,.18), transparent 25%),
            radial-gradient(circle at 90% 90%, rgba(59,130,246,.12), transparent 28%),
            #080c0b;
          box-shadow: 0 30px 80px rgba(0,0,0,.12);
        }

        .india-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          opacity: .45;
        }

        .india-glow-one {
          right: -120px;
          top: -130px;
          width: 300px;
          height: 300px;
          background: #064e3b;
          animation: glowDrift 11s ease-in-out infinite;
        }

        .india-glow-two {
          left: -150px;
          bottom: -170px;
          width: 330px;
          height: 330px;
          background: #0f766e;
          animation: glowDrift 14s 1s ease-in-out infinite reverse;
        }

        .india-mark {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          color: #fff;
          opacity: .92;
        }

        .india-mark span:first-child {
          color: #6ee7b7;
          font-size: 75px;
          line-height: .75;
        }

        .india-mark span:last-child {
          margin-top: 13px;
          color: #a7b5ae;
          font-size: 19px;
          letter-spacing: .16em;
        }

        .india-copy {
          position: relative;
          z-index: 1;
          max-width: 740px;
        }

        .section-kicker-light {
          color: #82918a;
        }

        .section-kicker-light span {
          border-color: #29342f;
          color: #718079;
        }

        .india-copy h2 {
          margin: 30px 0 25px;
          color: #fff;
          font-size: clamp(44px, 5vw, 69px);
          font-weight: 600;
          letter-spacing: -.065em;
          line-height: .98;
        }

        .india-copy h2 span {
          color: #788781;
        }

        .india-copy p {
          max-width: 690px;
          margin: 0 0 18px;
          color: #9ca9a3;
          font-size: 14px;
          line-height: 1.8;
        }

        .india-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 22px;
          margin-top: 35px;
        }

        .india-meta > span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #73817a;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .india-meta-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
        }

        .about-support {
          padding-top: 100px;
        }

        .support-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(370px, .75fr);
          gap: clamp(50px, 9vw, 140px);
          align-items: center;
        }

        .support-grid h2 {
          margin: 28px 0 22px;
          color: #0b0e0d;
          font-size: clamp(42px, 5vw, 65px);
          font-weight: 610;
          letter-spacing: -.065em;
          line-height: .98;
        }

        .support-grid h2 span {
          color: #929a97;
        }

        .support-grid > div:first-child > p {
          max-width: 540px;
          margin: 0;
          color: #737b78;
          font-size: 14px;
          line-height: 1.8;
        }

        .support-card {
          overflow: hidden;
          border: 1px solid #e0e6e3;
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 20px 55px rgba(15,23,42,.05);
        }

        .support-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 21px;
          border-bottom: 1px solid #edf0ef;
        }

        .support-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #059669;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .support-status > span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
        }

        .support-card-brand {
          color: #a1a9a6;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .13em;
        }

        .support-row {
          display: grid;
          grid-template-columns: 90px 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 22px 21px;
          border-bottom: 1px solid #edf0ef;
          transition: background 180ms ease;
        }

        .support-row:last-child {
          border-bottom: 0;
        }

        .support-row:hover {
          background: #f8fbf9;
        }

        .support-row-label {
          color: #a0a8a5;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .support-row strong {
          overflow: hidden;
          color: #2a312e;
          font-size: 12px;
          font-weight: 650;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .support-row svg {
          color: #059669;
        }

        .about-final {
          position: relative;
          min-height: 650px;
          display: flex;
          align-items: center;
          overflow: hidden;
          color: #fff;
          background: #080c0b;
        }

        .about-final-grid {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          opacity: .24;
        }

        .about-final-grid span {
          border-right: 1px solid rgba(255,255,255,.06);
        }

        .about-final-grid::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 50%, rgba(16,185,129,.14), transparent 28%),
            radial-gradient(circle at 20% 20%, rgba(255,255,255,.035), transparent 22%);
        }

        .about-final-inner {
          text-align: center;
        }

        .final-kicker {
          color: #6ee7b7;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .2em;
        }

        .about-final h2 {
          margin: 26px 0 17px;
          color: #fff;
          font-size: clamp(52px, 7vw, 94px);
          font-weight: 600;
          letter-spacing: -.075em;
          line-height: .9;
        }

        .about-final h2 span {
          color: #7b8882;
        }

        .about-final p {
          margin: 0;
          color: #8f9b95;
          font-size: 16px;
        }

        .final-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 35px;
        }

        .about-final .about-primary-button {
          color: #07100c;
          background: #d1fae5;
        }

        .about-final .about-primary-button:hover {
          background: #ecfdf5;
        }

        .about-final-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 48px;
          padding: 0 18px;
          color: #d1d8d4;
          border: 1px solid #2a3430;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 650;
          transition:
            background 180ms ease,
            transform 180ms ease;
        }

        .about-final-link:hover {
          background: rgba(255,255,255,.05);
          transform: translateY(-2px);
        }

        .about-footer {
          position: relative;
          z-index: 4;
          color: #d6ddda;
          background: #080c0b;
          border-top: 1px solid #202825;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 80px;
          padding: 70px 0 60px;
        }

        .footer-logo {
          display: inline-block;
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: .09em;
        }

        .footer-brand p {
          margin: 18px 0 0;
          color: #78847e;
          font-size: 12px;
          line-height: 1.7;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .footer-links > div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .footer-heading {
          margin-bottom: 4px;
          color: #59645f;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .17em;
        }

        .footer-links a {
          color: #89948e;
          font-size: 11px;
          transition: color 180ms ease;
        }

        .footer-links a:hover {
          color: #fff;
        }

        .footer-divider {
          height: 1px;
          background: #202825;
        }

        .footer-bottom {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 20px;
          align-items: center;
          min-height: 88px;
        }

        .footer-bottom > div {
          color: #65716b;
          font-size: 9px;
          line-height: 1.5;
        }

        .footer-product {
          color: #b2bbb6 !important;
          font-size: 13px !important;
          font-weight: 600;
          letter-spacing: .03em;
        }

        .footer-copyright {
          text-align: right;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ambientFloatOne {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(70px, 45px); }
        }

        @keyframes ambientFloatTwo {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-60px, -35px); }
        }

        @keyframes livePulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 5px rgba(16,185,129,.09);
          }
          50% {
            opacity: .55;
            box-shadow: 0 0 0 8px rgba(16,185,129,.025);
          }
        }

        @keyframes cardFloat {
          0%, 100% {
            transform: translate(-50%, -50%) rotate(-2deg);
          }
          50% {
            transform: translate(-50%, calc(-50% - 10px)) rotate(-1deg);
          }
        }

        @keyframes floatOne {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-9px) rotate(-1deg); }
        }

        @keyframes floatTwo {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(9px) rotate(1deg); }
        }

        @keyframes orbitRotate {
          from { transform: rotate(-18deg); }
          to { transform: rotate(342deg); }
        }

        @keyframes signalPulse {
          0%, 100% { opacity: .25; transform: scale(.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: .45; transform: translate(-50%, -50%) scale(.9); }
          50% { opacity: .8; transform: translate(-50%, -50%) scale(1.08); }
        }

        @keyframes ringPulse {
          0%, 100% { opacity: .6; transform: translate(-50%, -50%) scale(.97); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.03); }
        }

        @keyframes glowDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(35px, -25px) scale(1.08); }
        }

        @media (max-width: 1100px) {
          .about-hero-grid,
          .philosophy-grid,
          .engineering-layout,
          .support-grid {
            grid-template-columns: 1fr;
          }

          .about-hero-copy {
            max-width: 800px;
          }

          .about-hero-visual {
            min-height: 560px;
            max-width: 760px;
            width: 100%;
            margin-inline: auto;
          }

          .pillar-grid,
          .audience-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .pillar-card,
          .audience-card {
            min-height: 300px;
          }

          .philosophy-visual {
            max-width: 700px;
            width: 100%;
            margin-inline: auto;
          }

          .engineering-console {
            max-width: 720px;
            width: 100%;
            margin-inline: auto;
          }

          .footer-main {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 800px) {
          .about-shell {
            width: min(
              calc(100% - 30px),
              var(--about-max)
            );
          }

          .about-topbar {
            min-height: 68px;
          }

          .about-topbar-meta {
            display: none;
          }

          .about-hero {
            padding-top: 68px;
          }

          .about-hero-grid {
            gap: 40px;
          }

          .about-hero h1 {
            font-size: clamp(49px, 13vw, 78px);
          }

          .about-hero-lead {
            font-size: 20px;
          }

          .about-hero-visual {
            min-height: 500px;
          }

          .visual-card-main {
            width: min(430px, 84%);
          }

          .visual-float-one {
            left: 2%;
          }

          .visual-float-two {
            right: 1%;
          }

          .about-trust-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 17px 0;
          }

          .trust-divider {
            display: none;
          }

          .trust-item {
            padding: 12px 8px;
          }

          .manifesto-grid,
          .problem-header,
          .pillars-heading,
          .audience-heading {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .problem-cards,
          .plan-grid {
            grid-template-columns: 1fr;
          }

          .problem-card,
          .plan-card {
            min-height: 315px;
          }

          .pillar-grid,
          .audience-grid {
            grid-template-columns: 1fr 1fr;
          }

          .journey-track {
            grid-template-columns: 1fr;
            gap: 34px;
            margin-top: 55px;
          }

          .journey-line {
            top: 0;
            right: auto;
            bottom: 0;
            left: 21px;
            width: 1px;
            height: auto;
          }

          .journey-step,
          .journey-step:first-of-type,
          .journey-step:last-of-type {
            display: grid;
            grid-template-columns: 43px 1fr;
            gap: 22px;
            padding: 0;
            text-align: left;
          }

          .journey-dot {
            margin: 0;
          }

          .journey-content {
            padding-top: 0;
          }

          .journey-content p {
            max-width: none;
            margin: 0;
          }

          .journey-mobile-arrow {
            display: none;
          }

          .engineering-console {
            transform: none;
          }

          .india-card {
            grid-template-columns: 1fr;
            gap: 35px;
            min-height: auto;
          }

          .india-mark {
            justify-content: flex-start;
          }

          .support-grid {
            gap: 40px;
          }

          .footer-bottom {
            grid-template-columns: 1fr;
            gap: 11px;
            padding: 25px 0;
          }

          .footer-copyright {
            text-align: left;
          }

          .footer-product {
            order: -1;
          }
        }

        @media (max-width: 560px) {
          .about-shell {
            width: calc(100% - 28px);
          }

          .about-hero {
            padding: 58px 0 75px;
          }

          .about-eyebrow {
            font-size: 8px;
          }

          .about-hero h1 {
            margin-top: 20px;
            font-size: clamp(45px, 15vw, 66px);
          }

          .about-hero-lead {
            font-size: 18px;
          }

          .about-hero-description {
            font-size: 14px;
          }

          .about-hero-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .about-primary-button,
          .about-secondary-button {
            width: 100%;
          }

          .about-hero-visual {
            min-height: 400px;
          }

          .visual-card-main {
            width: 90%;
            border-radius: 19px;
          }

          .visual-profile {
            padding: 22px;
          }

          .visual-profile-top {
            gap: 10px;
          }

          .visual-avatar {
            width: 48px;
            height: 48px;
            border-radius: 13px;
          }

          .visual-profile-title strong {
            font-size: 15px;
          }

          .visual-float {
            min-width: 100px;
            padding: 11px 12px;
          }

          .visual-float-one {
            top: 8%;
            left: 0;
          }

          .visual-float-two {
            right: 0;
            bottom: 8%;
          }

          .visual-float strong {
            font-size: 11px;
          }

          .about-trust-grid {
            grid-template-columns: 1fr 1fr;
          }

          .trust-item {
            padding: 10px 2px;
          }

          .trust-icon {
            width: 31px;
            height: 31px;
          }

          .trust-item strong {
            font-size: 10px;
          }

          .trust-item div span {
            font-size: 8px;
          }

          .about-section {
            padding: 75px 0;
          }

          .manifesto-heading h2,
          .problem-header h2,
          .pillars-heading h2,
          .audience-heading h2,
          .engineering-copy h2,
          .plans-heading h2,
          .journey-heading h2 {
            font-size: 42px;
          }

          .manifesto-statement {
            gap: 15px;
            margin-top: 65px;
          }

          .statement-mark {
            font-size: 45px;
          }

          .manifesto-statement p {
            font-size: 22px;
          }

          .pillar-grid,
          .audience-grid {
            grid-template-columns: 1fr;
          }

          .pillar-card,
          .audience-card {
            min-height: 280px;
          }

          .philosophy-copy h2 {
            font-size: 55px;
          }

          .philosophy-visual {
            min-height: 390px;
          }

          .philosophy-ring-two {
            width: 300px;
            height: 300px;
          }

          .philosophy-ring-one {
            width: 200px;
            height: 200px;
          }

          .philosophy-node-one {
            left: 10%;
          }

          .philosophy-node-two {
            right: 7%;
          }

          .philosophy-node-three {
            right: 9%;
          }

          .philosophy-node-four {
            left: 7%;
          }

          .console-body {
            padding: 19px 14px;
          }

          .console-row {
            grid-template-columns: 22px 85px 1fr;
            gap: 6px;
            font-size: 8px;
          }

          .console-value {
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .india-card {
            padding: 38px 25px;
            border-radius: 22px 22px 0 0;
          }

          .india-mark span:first-child {
            font-size: 60px;
          }

          .india-copy h2 {
            font-size: 46px;
          }

          .india-meta {
            display: grid;
            gap: 10px;
          }

          .support-card {
            border-radius: 17px;
          }

          .support-row {
            grid-template-columns: 1fr auto;
          }

          .support-row-label {
            display: none;
          }

          .support-row strong {
            min-width: 0;
          }

          .about-final {
            min-height: 560px;
          }

          .about-final h2 {
            font-size: 55px;
          }

          .final-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .about-final .about-primary-button,
          .about-final-link {
            width: 100%;
          }

          .footer-main {
            padding: 55px 0 45px;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            row-gap: 35px;
          }

          .footer-links > div:last-child {
            grid-column: span 2;
          }

          .footer-bottom {
            min-height: 0;
            padding: 25px 0 35px;
          }
        }

        @media (max-width: 360px) {
          .about-shell {
            width: calc(100% - 22px);
          }

          .about-hero h1 {
            font-size: 43px;
          }

          .about-hero-visual {
            min-height: 355px;
          }

          .visual-browser-bar {
            padding: 0 9px;
          }

          .visual-profile-url {
            font-size: 7px;
          }

          .manifesto-heading h2,
          .problem-header h2,
          .pillars-heading h2,
          .audience-heading h2,
          .engineering-copy h2,
          .plans-heading h2,
          .journey-heading h2 {
            font-size: 37px;
          }

          .philosophy-copy h2,
          .about-final h2 {
            font-size: 47px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (forced-colors: active) {
          .about-primary-button,
          .about-secondary-button,
          .problem-card,
          .pillar-card,
          .audience-card,
          .plan-card,
          .support-card {
            border: 1px solid CanvasText;
          }
        }
      `}</style>
    </>
  );
}