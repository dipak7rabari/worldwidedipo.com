import Link from "next/link";
import styles from "./marketing.module.css";

export const metadata = {
  title: {
    default: "Worldwide DIPO — Your Digital Identity",
    template: "%s | Worldwide DIPO",
  },
  description:
    "Create your personal digital identity with Worldwide DIPO. One professional place for your work, skills, services, experience and story.",
  applicationName: "Worldwide DIPO",
  keywords: [
    "Worldwide DIPO",
    "digital identity",
    "personal digital identity",
    "professional profile",
    "digital profile",
    "online identity",
    "creator profile",
    "business profile",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

const navigation = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/pricing",
    label: "Pricing",
  },
  {
    href: "/faq",
    label: "FAQ",
  },
  {
    href: "/support",
    label: "Support",
  },
];

const footerLinks = [
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
  {
    href: "/privacy",
    label: "Privacy",
  },
  {
    href: "/terms",
    label: "Terms",
  },
];

function DipoMark({ small = false }) {
  return (
    <span
      className={small ? styles.markSmall : styles.mark}
      aria-hidden="true"
    >
      <span className={styles.markGlow} />
      <span className={styles.markOrbit} />
      <span className={styles.markD}>D</span>
      <span className={styles.markDot} />
    </span>
  );
}

function Arrow() {
  return (
    <span
      className={styles.arrow}
      aria-hidden="true"
    >
      ↗
    </span>
  );
}

export default function MarketingLayout({ children }) {
  return (
    <div className={styles.layout}>
      {/* =====================================================
          AMBIENT BACKGROUND
         ===================================================== */}

      <div
        className={styles.ambient}
        aria-hidden="true"
      >
        <span className={styles.orbOne} />
        <span className={styles.orbTwo} />
        <span className={styles.orbThree} />

        <span className={styles.grid} />

        <span className={styles.noise} />

        <span className={styles.floatingDotOne} />
        <span className={styles.floatingDotTwo} />
        <span className={styles.floatingDotThree} />
      </div>

      {/* =====================================================
          HEADER
         ===================================================== */}

      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* LOGO */}

          <Link
            href="/"
            className={styles.brand}
            aria-label="Worldwide DIPO Home"
          >
            <DipoMark />

            <span className={styles.brandCopy}>
              <strong>Worldwide DIPO</strong>

              <small>
                Your Digital Identity
              </small>
            </span>
          </Link>

          {/* NAVIGATION */}

          <nav
            className={styles.nav}
            aria-label="Main navigation"
          >
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
              >
                <span className={styles.navIndex}>
                  0{index + 1}
                </span>

                <span className={styles.navText}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}

          <div className={styles.headerActions}>
            <Link
              href="/auth/sign-in"
              className={styles.signIn}
            >
              Sign in
            </Link>

            <Link
              href="/onboarding"
              className={styles.createButton}
            >
              <span>
                Create DIPO
              </span>

              <Arrow />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
         ===================================================== */}

      <main className={styles.main}>
        {children}
      </main>

      {/* =====================================================
          FOOTER
         ===================================================== */}

      <footer className={styles.footer}>
        <div
          className={styles.footerTopGlow}
          aria-hidden="true"
        />

        <div
          className={styles.footerGrid}
          aria-hidden="true"
        />

        <div className={styles.footerInner}>
          {/* FOOTER CONTENT */}

          <div className={styles.footerColumns}>
            {/* BRAND */}

            <div className={styles.footerBrand}>
              <Link
                href="/"
                className={styles.footerLogo}
                aria-label="Worldwide DIPO Home"
              >
                <DipoMark small />

                <span className={styles.footerLogoCopy}>
                  <strong>
                    Worldwide DIPO
                  </strong>

                  <small>
                    Personal Digital Identity Page
                  </small>
                </span>
              </Link>

              <p className={styles.footerTagline}>
                Har insaan ki apni digital pehchaan.
              </p>

              <span className={styles.productBadge}>
                A DIPO LABS product.
              </span>
            </div>

            {/* EXPLORE */}

            <div className={styles.footerGroup}>
              <span className={styles.footerHeading}>
                Explore
              </span>

              <nav
                className={styles.footerLinks}
                aria-label="Footer navigation"
              >
                {footerLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.footerLink}
                  >
                    <span>
                      {item.label}
                    </span>

                    <span
                      className={
                        styles.footerArrow
                      }
                    >
                      ↗
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* SUPPORT */}

            <div className={styles.footerGroup}>
              <span className={styles.footerHeading}>
                Official Support
              </span>

              <a
                href="mailto:dipolabs123@gmail.com"
                className={styles.footerLink}
              >
                <span>
                  dipolabs123@gmail.com
                </span>

                <span
                  className={
                    styles.footerArrow
                  }
                >
                  ↗
                </span>
              </a>

              <a
                href="https://instagram.com/dipolabs.io"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                <span>
                  Instagram @dipolabs.io
                </span>

                <span
                  className={
                    styles.footerArrow
                  }
                >
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* DIVIDER */}

          <div className={styles.divider} />

          {/* =================================================
              FINAL COPYRIGHT AREA
             ================================================= */}

          <div className={styles.footerBottom}>
            <div className={styles.madeInIndia}>
              <span>
                Made With
              </span>

              <span
                className={styles.heart}
                aria-label="love"
              >
                ❤️
              </span>

              <span>
                in India
              </span>
            </div>

            <div className={styles.dmProduct}>
              𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
            </div>

            <p className={styles.copyright}>
              <span>
                © {new Date().getFullYear()} 𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
              </span>

              <span className={styles.copyrightDot}>
                •
              </span>

              <span>
                All copyrights reserved
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}