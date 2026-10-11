"use client";

import Link from "next/link";
import siteConfig from "../../config/site";

/**
 * Worldwide DIPO — Public Footer
 *
 * Production goals:
 * - Preserve the existing footer structure and links.
 * - Public support email comes from the single site config.
 * - No admin email is exposed here.
 * - No external icon/dependency required.
 * - Accessible keyboard/focus states.
 * - Safe external Instagram handling.
 * - Responsive and touch-friendly.
 * - Reduced-motion friendly.
 * - No hydration-sensitive browser APIs during render.
 */

const SUPPORT_EMAIL =
  siteConfig?.supportEmail || "dipolabs123@gmail.com";

const INSTAGRAM_URL =
  siteConfig?.instagram ||
  "https://www.instagram.com/dipolabs.io/";

function DipoMark() {
  return (
    <svg
      viewBox="0 0 128 128"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="dipoFooterGradient"
          x1="18"
          y1="18"
          x2="108"
          y2="108"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#111111" />
          <stop offset="1" stopColor="#3a3a3a" />
        </linearGradient>
      </defs>

      <path
        d="M19 18h49c17 0 28 7 37 21l-15 9c-5-9-11-13-22-13H36v31c5-6 11-10 19-12 17-5 30 5 31 20v7c10-8 18-16 24-25l11 8c-11 17-24 28-39 35-11 5-24 8-39 8H19V18Z"
        fill="url(#dipoFooterGradient)"
      />

      <circle
        cx="57"
        cy="49"
        r="7"
        fill="#ffffff"
      />

      <path
        d="M44 66c2-8 8-12 16-12s14 4 16 12H44Z"
        fill="#ffffff"
      />

      <path
        d="M22 77c8-10 18-15 31-15 8 0 14 2 19 6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M22 77c-2 3-2 7 1 10 4 4 9 5 16 5h18"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M46 86h21c15 0 28-5 38-15"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M92 69 105 58v17"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3.25"
        y="3.25"
        width="17.5"
        height="17.5"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="17.4"
        cy="6.7"
        r="1.15"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m4.5 7 7.5 6 7.5-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PublicFooter() {
  return (
    <>
      <footer className="dipo-public-footer">
        <div className="dipo-footer-shell">
          {/* =====================================================
              TOP
          ====================================================== */}

          <div className="dipo-footer-top">
            <div className="dipo-footer-brand-column">
              <Link
                href="/"
                className="dipo-footer-brand"
                aria-label="Worldwide DIPO home"
              >
                <span className="dipo-footer-logo" aria-hidden="true">
                  <DipoMark />
                </span>

                <span className="dipo-footer-brand-copy">
                  <strong>Worldwide DIPO</strong>
                  <small>Your Digital Identity</small>
                </span>
              </Link>

              <p className="dipo-footer-tagline">
                Har insaan ki apni digital pehchaan.
              </p>

              <div className="dipo-footer-contact-row">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="dipo-footer-contact"
                  aria-label={`Email Worldwide DIPO support at ${SUPPORT_EMAIL}`}
                >
                  <span className="dipo-footer-contact-icon">
                    <MailIcon />
                  </span>

                  <span className="dipo-footer-contact-text">
                    {SUPPORT_EMAIL}
                  </span>
                </a>

                <a
                  href={INSTAGRAM_URL}
                  className="dipo-footer-social"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Worldwide DIPO on Instagram"
                >
                  <InstagramIcon />
                  <span>@dipolabs.io</span>
                  <ArrowUpRightIcon />
                </a>
              </div>
            </div>

            {/* =====================================================
                EXPLORE
            ====================================================== */}

            <nav
              className="dipo-footer-links"
              aria-label="Explore links"
            >
              <strong>Explore</strong>

              <Link href="/pricing">
                Pricing
              </Link>

              <Link href="/faq">
                FAQ
              </Link>

              <Link href="/about">
                About
              </Link>

              <Link href="/support">
                Support
              </Link>
            </nav>

            {/* =====================================================
                LEGAL
            ====================================================== */}

            <nav
              className="dipo-footer-links"
              aria-label="Legal links"
            >
              <strong>Legal</strong>

              <Link href="/privacy">
                Privacy
              </Link>

              <Link href="/terms">
                Terms
              </Link>

              <Link href="/contact">
                Contact
              </Link>
            </nav>

            {/* =====================================================
                GET STARTED
            ====================================================== */}

            <nav
              className="dipo-footer-links"
              aria-label="Get started links"
            >
              <strong>Get started</strong>

              <Link href="/explore">
                Explore Worldwide DIPO
              </Link>

              <Link href="/auth/login">
                Login
              </Link>
            </nav>
          </div>

          {/* =====================================================
              DIVIDER
          ====================================================== */}

          <div
            className="dipo-footer-divider"
            aria-hidden="true"
          />

          {/* =====================================================
              BOTTOM
          ====================================================== */}

          <div className="dipo-footer-bottom">
            <div className="dipo-footer-bottom-left">
              <span>Made with ❤️ in India</span>

              <span className="dipo-footer-dot" aria-hidden="true">
                •
              </span>

              <span>Worldwide DIPO</span>
            </div>

            <span className="dipo-footer-copyright">
              © 2026 Worldwide DIPO. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .dipo-public-footer {
          position: relative;
          width: 100%;
          margin-top: 0;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 8% 8%,
              rgba(16, 185, 129, 0.045),
              transparent 30%
            ),
            #ffffff;
          color: #111111;
          border-top: 1px solid rgba(17, 24, 39, 0.08);
        }

        .dipo-footer-shell {
          width: min(100% - 40px, 1240px);
          margin: 0 auto;
          padding: 68px 0 24px;
        }

        .dipo-footer-top {
          display: grid;
          grid-template-columns:
            minmax(260px, 1.7fr)
            repeat(3, minmax(130px, 0.7fr));
          gap: 48px;
          align-items: start;
        }

        .dipo-footer-brand-column {
          min-width: 0;
        }

        .dipo-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
          color: inherit;
          text-decoration: none;
          border-radius: 14px;
          outline: none;
        }

        .dipo-footer-brand:focus-visible {
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, 0.14),
            0 0 0 1px #10b981;
        }

        .dipo-footer-logo {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          width: 44px;
          height: 44px;
          overflow: hidden;
          border-radius: 13px;
          background: #111111;
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        .dipo-footer-logo svg {
          width: 30px;
          height: 30px;
        }

        .dipo-footer-brand-copy {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .dipo-footer-brand-copy strong {
          color: #111111;
          font-size: 16px;
          font-weight: 750;
          line-height: 1.2;
          letter-spacing: -0.025em;
        }

        .dipo-footer-brand-copy small {
          margin-top: 3px;
          color: #737373;
          font-size: 11px;
          font-weight: 550;
          line-height: 1.3;
          letter-spacing: 0.02em;
        }

        .dipo-footer-tagline {
          max-width: 330px;
          margin: 19px 0 0;
          color: #666666;
          font-size: 14px;
          line-height: 1.7;
          letter-spacing: -0.01em;
        }

        .dipo-footer-contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 23px;
        }

        .dipo-footer-contact,
        .dipo-footer-social {
          display: inline-flex;
          align-items: center;
          min-height: 40px;
          border: 1px solid rgba(17, 24, 39, 0.09);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
          color: #444444;
          text-decoration: none;
          transition:
            border-color 180ms ease,
            background 180ms ease,
            color 180ms ease,
            transform 180ms ease,
            box-shadow 180ms ease;
          -webkit-tap-highlight-color: transparent;
        }

        .dipo-footer-contact {
          padding: 0 13px 0 7px;
          gap: 8px;
        }

        .dipo-footer-social {
          gap: 7px;
          padding: 0 12px;
          font-size: 12px;
          font-weight: 650;
        }

        .dipo-footer-contact:hover,
        .dipo-footer-social:hover {
          border-color: rgba(16, 185, 129, 0.25);
          background: #ffffff;
          color: #059669;
          box-shadow: 0 8px 22px rgba(17, 24, 39, 0.06);
          transform: translateY(-1px);
        }

        .dipo-footer-contact:focus-visible,
        .dipo-footer-social:focus-visible {
          outline: none;
          border-color: #10b981;
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, 0.13),
            0 8px 22px rgba(17, 24, 39, 0.06);
        }

        .dipo-footer-contact:active,
        .dipo-footer-social:active {
          transform: translateY(0);
        }

        .dipo-footer-contact-icon {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f3f4f4;
          color: #555555;
        }

        .dipo-footer-contact-text {
          overflow: hidden;
          max-width: 100%;
          color: inherit;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-footer-links {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .dipo-footer-links strong {
          margin-bottom: 5px;
          color: #171717;
          font-size: 12px;
          font-weight: 750;
          letter-spacing: 0.02em;
        }

        .dipo-footer-links a {
          position: relative;
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          color: #666666;
          font-size: 13px;
          font-weight: 520;
          line-height: 1.35;
          text-decoration: none;
          border-radius: 6px;
          outline: none;
          transition:
            color 160ms ease,
            transform 160ms ease;
        }

        .dipo-footer-links a::after {
          position: absolute;
          right: 0;
          bottom: 3px;
          left: 0;
          height: 1px;
          content: "";
          background: currentColor;
          opacity: 0;
          transform: scaleX(0);
          transform-origin: left;
          transition:
            opacity 160ms ease,
            transform 160ms ease;
        }

        .dipo-footer-links a:hover {
          color: #059669;
          transform: translateX(2px);
        }

        .dipo-footer-links a:hover::after {
          opacity: 0.65;
          transform: scaleX(1);
        }

        .dipo-footer-links a:focus-visible {
          color: #059669;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.13);
        }

        .dipo-footer-divider {
          width: 100%;
          height: 1px;
          margin: 52px 0 20px;
          background: linear-gradient(
            90deg,
            rgba(17, 24, 39, 0.09),
            rgba(17, 24, 39, 0.04),
            rgba(17, 24, 39, 0.09)
          );
        }

        .dipo-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          color: #858585;
          font-size: 11px;
          font-weight: 520;
          line-height: 1.5;
        }

        .dipo-footer-bottom-left {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
        }

        .dipo-footer-dot {
          color: #c5c5c5;
        }

        .dipo-footer-copyright {
          text-align: right;
        }

        @media (max-width: 900px) {
          .dipo-footer-shell {
            width: min(100% - 32px, 760px);
            padding-top: 56px;
          }

          .dipo-footer-top {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 40px 34px;
          }

          .dipo-footer-brand-column {
            grid-column: 1 / -1;
          }

          .dipo-footer-tagline {
            max-width: 500px;
          }
        }

        @media (max-width: 600px) {
          .dipo-footer-shell {
            width: min(100% - 28px, 520px);
            padding-top: 48px;
            padding-bottom: 20px;
          }

          .dipo-footer-top {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 34px 24px;
          }

          .dipo-footer-brand-column {
            grid-column: 1 / -1;
          }

          .dipo-footer-contact-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .dipo-footer-contact,
          .dipo-footer-social {
            max-width: 100%;
          }

          .dipo-footer-contact {
            width: fit-content;
          }

          .dipo-footer-divider {
            margin-top: 42px;
          }

          .dipo-footer-bottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }

          .dipo-footer-copyright {
            text-align: left;
          }
        }

        @media (max-width: 390px) {
          .dipo-footer-shell {
            width: min(100% - 24px, 520px);
          }

          .dipo-footer-top {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .dipo-footer-brand-column {
            grid-column: auto;
          }

          .dipo-footer-links {
            gap: 10px;
          }

          .dipo-footer-links strong {
            margin-bottom: 3px;
          }

          .dipo-footer-contact {
            width: 100%;
          }

          .dipo-footer-contact-text {
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-footer-contact,
          .dipo-footer-social,
          .dipo-footer-links a {
            transition: none;
          }

          .dipo-footer-contact:hover,
          .dipo-footer-social:hover,
          .dipo-footer-links a:hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}