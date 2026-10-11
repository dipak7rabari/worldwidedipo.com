import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getMyProfile } from '@/lib/profile/get-my-profile';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Create Your DIPO | Worldwide DIPO',
  description:
    'Build your own web page and digital identity with Worldwide DIPO.',
};

export default async function OnboardingPage() {
  const {
    user,
    profile,
  } = await getMyProfile();

  /*
   * Keep the existing authentication flow.
   */
  if (!user) {
    redirect(
      '/auth/sign-in?next=%2Fonboarding',
    );
  }

  /*
   * A user should have only one DIPO profile.
   */
  if (profile) {
    redirect('/dashboard/profile');
  }

  return (
    <main className="dipo-onboarding">
      {/* =====================================================
          BACKGROUND
         ===================================================== */}

      <div
        className="dipo-bg"
        aria-hidden="true"
      >
        <div className="dipo-bg-grid" />
        <div className="dipo-glow dipo-glow-one" />
        <div className="dipo-glow dipo-glow-two" />
      </div>

      <div className="dipo-shell">
        {/* ===================================================
            TOP BAR
           =================================================== */}

        <header className="dipo-topbar">
          <Link
            href="/dashboard"
            className="dipo-back"
            aria-label="Back to dashboard"
          >
            <span
              className="dipo-back-icon"
              aria-hidden="true"
            >
              ←
            </span>

            <span>Dashboard</span>
          </Link>

          <div className="dipo-brand">
            <span className="dipo-brand-mark">
              D
            </span>

            <span>Worldwide DIPO</span>
          </div>

          <div
            className="dipo-secure"
            title="Your account session is protected"
          >
            <span
              className="dipo-secure-dot"
              aria-hidden="true"
            />

            Secure
          </div>
        </header>

        {/* ===================================================
            HERO
           =================================================== */}

        <section className="dipo-hero">
          <div className="dipo-eyebrow">
            <span className="dipo-live-dot" />
            YOUR SPACE ON THE WEB
          </div>

          <h1>
            Build your own
            <span> web page.</span>
          </h1>

          <p className="dipo-hero-copy">
            Aapko website banwane ke liye complicated
            setup, coding ya developer ka wait nahi.
            <strong>
              {' '}
              Apni digital identity khud build karo.
            </strong>
          </p>

          {/* Rotating-style message strip.
              Server-safe: no client JS required here.
          */}
          <div className="dipo-message" role="note">
            <span className="dipo-message-star">
              ✦
            </span>

            <span>
              Start small. Build your presence.
              Grow worldwide.
            </span>
          </div>
        </section>

        {/* ===================================================
            MAIN CREATION CARD
           =================================================== */}

        <section
          className="dipo-builder-card"
          aria-labelledby="builder-title"
        >
          <div className="dipo-builder-head">
            <div>
              <p className="dipo-mini-label">
                CREATE YOUR DIPO
              </p>

              <h2 id="builder-title">
                Your web page starts here.
              </h2>

              <p>
                Sirf essential information se start
                karo. Baaki details baad mein add
                kar sakte ho.
              </p>
            </div>

            <div
              className="dipo-time-pill"
              aria-label="Quick setup"
            >
              <span>⚡</span>
              Quick setup
            </div>
          </div>

          {/* =================================================
              PROGRESS
             ================================================= */}

          <div
            className="dipo-progress"
            aria-label="DIPO creation journey"
          >
            <div className="dipo-progress-item is-active">
              <span className="dipo-progress-number">
                01
              </span>

              <div>
                <strong>Start</strong>
                <small>
                  Your identity
                </small>
              </div>
            </div>

            <div
              className="dipo-progress-line"
              aria-hidden="true"
            />

            <div className="dipo-progress-item">
              <span className="dipo-progress-number">
                02
              </span>

              <div>
                <strong>Personalize</strong>
                <small>
                  Make it yours
                </small>
              </div>
            </div>

            <div
              className="dipo-progress-line"
              aria-hidden="true"
            />

            <div className="dipo-progress-item">
              <span className="dipo-progress-number">
                03
              </span>

              <div>
                <strong>Go further</strong>
                <small>
                  Add your world
                </small>
              </div>
            </div>
          </div>

          {/* =================================================
              STEP CARDS
             ================================================= */}

          <div className="dipo-step-grid">
            {/* STEP 1 */}

            <article className="dipo-step-card is-primary">
              <div className="dipo-step-top">
                <div className="dipo-step-icon">
                  ✦
                </div>

                <span className="dipo-required">
                  REQUIRED
                </span>
              </div>

              <div className="dipo-step-number">
                STEP 01
              </div>

              <h3>
                Start with you.
              </h3>

              <p>
                Your name, what you do and your unique
                DIPO web address.
              </p>

              <div className="dipo-fields-preview">
                <PreviewField
                  icon="◯"
                  title="Your name"
                  value="Your name"
                />

                <PreviewField
                  icon="✦"
                  title="What you do"
                  value="Creator · Business · Professional"
                />

                <PreviewField
                  icon="↗"
                  title="Your web address"
                  value="worldwidedipo.com/p/yourname"
                />
              </div>

              <div className="dipo-step-tip">
                <span>01</span>
                <p>
                  <strong>
                    The essentials only.
                  </strong>
                  {' '}
                  Bas yahi se aapki web identity
                  start hoti hai.
                </p>
              </div>
            </article>

            {/* STEP 2 */}

            <article className="dipo-step-card">
              <div className="dipo-step-top">
                <div className="dipo-step-icon soft">
                  ✨
                </div>

                <span className="dipo-optional">
                  OPTIONAL
                </span>
              </div>

              <div className="dipo-step-number">
                STEP 02
              </div>

              <h3>
                Make it yours.
              </h3>

              <p>
                Add a photo, headline, bio and location
                when you're ready.
              </p>

              <div className="dipo-chip-row">
                <span>Photo</span>
                <span>Headline</span>
                <span>Bio</span>
                <span>Location</span>
              </div>

              <div className="dipo-step-tip">
                <span>02</span>
                <p>
                  <strong>
                    Time nahi hai?
                  </strong>
                  {' '}
                  Skip kar do. Baad mein complete
                  kar sakte ho.
                </p>
              </div>
            </article>

            {/* STEP 3 */}

            <article className="dipo-step-card">
              <div className="dipo-step-top">
                <div className="dipo-step-icon soft">
                  +
                </div>

                <span className="dipo-optional">
                  OPTIONAL
                </span>
              </div>

              <div className="dipo-step-number">
                STEP 03
              </div>

              <h3>
                Add your world.
              </h3>

              <p>
                Tell people more about what you do,
                what you offer and where to find you.
              </p>

              <div className="dipo-chip-row">
                <span>About</span>
                <span>Services</span>
                <span>Skills</span>
                <span>Links</span>
              </div>

              <div className="dipo-step-tip">
                <span>03</span>
                <p>
                  <strong>
                    Keep it simple.
                  </strong>
                  {' '}
                  Sirf wahi add karo jo useful hai.
                </p>
              </div>
            </article>
          </div>

          {/* =================================================
              VALUE STRIP
             ================================================= */}

          <div className="dipo-value-strip">
            <div className="dipo-value">
              <span className="dipo-value-icon">
                ✓
              </span>

              <div>
                <strong>
                  No coding
                </strong>

                <span>
                  Simple setup
                </span>
              </div>
            </div>

            <div className="dipo-value">
              <span className="dipo-value-icon">
                ↗
              </span>

              <div>
                <strong>
                  Your own link
                </strong>

                <span>
                  Share anywhere
                </span>
              </div>
            </div>

            <div className="dipo-value">
              <span className="dipo-value-icon">
                ◉
              </span>

              <div>
                <strong>
                  Built for the web
                </strong>

                <span>
                  Search-ready structure
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              MAIN CTA
             ================================================= */}

          <div className="dipo-cta-area">
            <div className="dipo-cta-copy">
              <strong>
                Ready to build your space?
              </strong>

              <span>
                Start with the essentials. Perfect it
                whenever you want.
              </span>
            </div>

            <Link
              href="/dashboard/profile/new"
              className="dipo-primary-button"
            >
              <span>
                Start Building My DIPO
              </span>

              <span
                className="dipo-button-arrow"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>

          {/* =================================================
              MOTIVATION
             ================================================= */}

          <div className="dipo-motivation">
            <span
              className="dipo-motivation-line"
              aria-hidden="true"
            />

            <p>
              <span>“</span>
              Aapka naam sirf social media par
              nahi — web par bhi hona chahiye.
              <span>”</span>
            </p>

            <span
              className="dipo-motivation-line"
              aria-hidden="true"
            />
          </div>
        </section>

        {/* ===================================================
            WEB PAGE PREVIEW
           =================================================== */}

        <section
          className="dipo-preview-section"
          aria-labelledby="preview-title"
        >
          <div className="dipo-preview-copy">
            <p className="dipo-mini-label">
              THE END RESULT
            </p>

            <h2 id="preview-title">
              Not just a profile.
              <br />
              <span>Your own web page.</span>
            </h2>

            <p>
              A clean public page with your name,
              identity, story and important links —
              all under one simple web address.
            </p>
          </div>

          <div
            className="dipo-browser"
            aria-label="DIPO web page preview"
          >
            <div className="dipo-browser-bar">
              <div className="dipo-browser-dots">
                <span />
                <span />
                <span />
              </div>

              <div className="dipo-browser-url">
                worldwidedipo.com/p/yourname
              </div>

              <div className="dipo-browser-lock">
                🔒
              </div>
            </div>

            <div className="dipo-web-preview">
              <div className="dipo-preview-avatar">
                D
              </div>

              <div className="dipo-preview-name">
                Your Name
              </div>

              <div className="dipo-preview-profession">
                Creator · Business · Professional
              </div>

              <div className="dipo-preview-headline">
                Your space on the web.
              </div>

              <div className="dipo-preview-links">
                <span>Instagram</span>
                <span>YouTube</span>
                <span>WhatsApp</span>
              </div>

              <div className="dipo-preview-footer">
                Worldwide DIPO
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            SEARCH-READY NOTE
           =================================================== */}

        <section className="dipo-search-note">
          <div className="dipo-search-icon">
            ⌕
          </div>

          <div>
            <strong>
              Built for the open web.
            </strong>

            <p>
              Your public DIPO can use a unique web
              address, page metadata and structured
              information designed to help search
              engines understand the page.
            </p>

            <small>
              Search visibility and indexing are
              controlled by search engines and
              cannot be guaranteed.
            </small>
          </div>
        </section>

        {/* ===================================================
            FOOTER
           =================================================== */}

        <footer className="dipo-footer">
          <div className="dipo-footer-brand">
            <span className="dipo-footer-mark">
              D
            </span>

            <span>
              Worldwide DIPO
            </span>
          </div>

          <div className="dipo-footer-copy">
            <span>
              Made With ❤️ in India
            </span>

            <span>
              𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
            </span>

            <span>
              All copyrights reserved @
              {' '}
              𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
            </span>
          </div>
        </footer>
      </div>

      {/* =====================================================
          LOCAL STYLES
         ===================================================== */}

            <style>{`
        .dipo-onboarding,
        .dipo-onboarding * {
          box-sizing: border-box;
        }

        .dipo-onboarding {
          position: relative;
          min-height: 100dvh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% -10%,
              #f8fafc 0,
              #ffffff 38%,
              #ffffff 100%
            );
          color: #101828;
        }

        /* ================================================
           BACKGROUND
           ================================================ */

        .dipo-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .dipo-bg-grid {
          position: absolute;
          inset: 0;
          opacity: 0.22;
          background-image:
            linear-gradient(
              rgba(15, 23, 42, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(15, 23, 42, 0.035) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 72%
            );
        }

        .dipo-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(2px);
        }

        .dipo-glow-one {
          width: 520px;
          height: 520px;
          top: -360px;
          right: -180px;
          background:
            radial-gradient(
              circle,
              rgba(59, 130, 246, 0.08),
              transparent 68%
            );
        }

        .dipo-glow-two {
          width: 460px;
          height: 460px;
          bottom: -340px;
          left: -240px;
          background:
            radial-gradient(
              circle,
              rgba(16, 185, 129, 0.055),
              transparent 68%
            );
        }

        /* ================================================
           SHELL
           ================================================ */

        .dipo-shell {
          position: relative;
          z-index: 1;
          width: min(
            calc(100% - 32px),
            1080px
          );
          margin: 0 auto;
          padding: 20px 0 42px;
        }

        /* ================================================
           TOP BAR
           ================================================ */

        .dipo-topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          min-height: 44px;
        }

        .dipo-back {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #667085;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition:
            color 180ms ease,
            transform 180ms ease;
        }

        .dipo-back:hover {
          color: #101828;
          transform: translateX(-2px);
        }

        .dipo-back-icon {
          display: grid;
          width: 30px;
          height: 30px;
          place-items: center;
          border: 1px solid #eaecf0;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow:
            0 2px 8px rgba(16, 24, 40, 0.035);
        }

        .dipo-brand {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #101828;
          font-size: 13px;
          font-weight: 850;
          letter-spacing: -0.01em;
        }

        .dipo-brand-mark {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border-radius: 9px;
          background: #101828;
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
          box-shadow:
            0 5px 14px rgba(16, 24, 40, 0.13);
        }

        .dipo-secure {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border: 1px solid #eaecf0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          color: #667085;
          font-size: 11px;
          font-weight: 750;
        }

        .dipo-secure-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #12b76a;
          box-shadow:
            0 0 0 3px rgba(18, 183, 106, 0.09);
        }

        /* ================================================
           HERO
           ================================================ */

        .dipo-hero {
          max-width: 780px;
          margin: 78px auto 42px;
          text-align: center;
        }

        .dipo-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 11px;
          border: 1px solid #eaecf0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
          color: #667085;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.1em;
        }

        .dipo-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #12b76a;
          box-shadow:
            0 0 0 4px rgba(18, 183, 106, 0.08);
        }

        .dipo-hero h1 {
          margin: 20px 0 0;
          color: #101828;
          font-size: clamp(
            42px,
            7vw,
            78px
          );
          line-height: 0.98;
          letter-spacing: -0.065em;
          font-weight: 900;
        }

        .dipo-hero h1 span {
          display: inline-block;
          background:
            linear-gradient(
              120deg,
              #101828 0%,
              #475467 48%,
              #101828 100%
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .dipo-hero-copy {
          max-width: 650px;
          margin: 24px auto 0;
          color: #667085;
          font-size: clamp(
            15px,
            2vw,
            18px
          );
          line-height: 1.7;
          letter-spacing: -0.015em;
        }

        .dipo-hero-copy strong {
          color: #344054;
          font-weight: 750;
        }

        .dipo-message {
          width: fit-content;
          max-width: 100%;
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 22px auto 0;
          padding: 10px 14px;
          border: 1px solid #eaecf0;
          border-radius: 999px;
          background: rgba(
            255,
            255,
            255,
            0.78
          );
          color: #475467;
          font-size: 12px;
          font-weight: 650;
          box-shadow:
            0 8px 30px
              rgba(16, 24, 40, 0.035);
          animation:
            messageFloat 4s ease-in-out
              infinite;
        }

        .dipo-message-star {
          color: #101828;
          font-size: 13px;
        }

        /* ================================================
           BUILDER CARD
           ================================================ */

        .dipo-builder-card {
          overflow: hidden;
          border: 1px solid #eaecf0;
          border-radius: 30px;
          background: rgba(
            255,
            255,
            255,
            0.94
          );
          box-shadow:
            0 24px 70px
              rgba(16, 24, 40, 0.07),
            0 2px 8px
              rgba(16, 24, 40, 0.025);
        }

        .dipo-builder-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          padding: 34px 34px 26px;
        }

        .dipo-mini-label {
          margin: 0 0 8px;
          color: #98a2b3;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.12em;
        }

        .dipo-builder-head h2 {
          margin: 0;
          color: #101828;
          font-size: clamp(
            25px,
            4vw,
            34px
          );
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .dipo-builder-head p:not(.dipo-mini-label) {
          max-width: 650px;
          margin: 10px 0 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.6;
        }

        .dipo-time-pill {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          border: 1px solid #eaecf0;
          border-radius: 999px;
          color: #475467;
          background: #f9fafb;
          font-size: 11px;
          font-weight: 750;
        }

        /* ================================================
           PROGRESS
           ================================================ */

        .dipo-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 34px;
          padding: 15px 16px;
          border: 1px solid #f0f2f5;
          border-radius: 18px;
          background: #fafafa;
        }

        .dipo-progress-item {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 9px;
          opacity: 0.58;
        }

        .dipo-progress-item.is-active {
          opacity: 1;
        }

        .dipo-progress-number {
          display: grid;
          width: 30px;
          height: 30px;
          flex: 0 0 30px;
          place-items: center;
          border: 1px solid #e4e7ec;
          border-radius: 10px;
          background: #ffffff;
          color: #667085;
          font-size: 10px;
          font-weight: 850;
        }

        .is-active .dipo-progress-number {
          border-color: #101828;
          background: #101828;
          color: #ffffff;
        }

        .dipo-progress-item strong {
          display: block;
          color: #344054;
          font-size: 11px;
          font-weight: 800;
        }

        .dipo-progress-item small {
          display: block;
          margin-top: 2px;
          color: #98a2b3;
          font-size: 10px;
        }

        .dipo-progress-line {
          height: 1px;
          flex: 1;
          min-width: 12px;
          background: #e4e7ec;
        }

        /* ================================================
           STEP GRID
           ================================================ */

        .dipo-step-grid {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );
          gap: 12px;
          padding: 20px 34px 26px;
        }

        .dipo-step-card {
          min-width: 0;
          padding: 21px;
          border: 1px solid #eaecf0;
          border-radius: 22px;
          background: #ffffff;
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease;
        }

        .dipo-step-card:hover {
          transform: translateY(-3px);
          border-color: #d0d5dd;
          box-shadow:
            0 16px 36px
              rgba(16, 24, 40, 0.055);
        }

        .dipo-step-card.is-primary {
          border-color: #d0d5dd;
          background:
            linear-gradient(
              145deg,
              #ffffff,
              #fafafa
            );
          box-shadow:
            inset 0 0 0 1px
              rgba(16, 24, 40, 0.015);
        }

        .dipo-step-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .dipo-step-icon {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border-radius: 11px;
          background: #101828;
          color: #ffffff;
          font-size: 14px;
          font-weight: 900;
        }

        .dipo-step-icon.soft {
          background: #f2f4f7;
          color: #344054;
        }

        .dipo-required,
        .dipo-optional {
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.09em;
        }

        .dipo-required {
          background: #101828;
          color: #ffffff;
        }

        .dipo-optional {
          background: #f2f4f7;
          color: #667085;
        }

        .dipo-step-number {
          margin-top: 20px;
          color: #98a2b3;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.11em;
        }

        .dipo-step-card h3 {
          margin: 7px 0 0;
          color: #101828;
          font-size: 19px;
          line-height: 1.15;
          letter-spacing: -0.025em;
        }

        .dipo-step-card > p {
          min-height: 48px;
          margin: 9px 0 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.55;
        }

        .dipo-fields-preview {
          display: grid;
          gap: 7px;
          margin-top: 16px;
        }

        .dipo-preview-field {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
          padding: 9px 10px;
          border: 1px solid #f0f2f5;
          border-radius: 11px;
          background: #fafafa;
        }

        .dipo-preview-field-icon {
          display: grid;
          width: 22px;
          height: 22px;
          flex: 0 0 22px;
          place-items: center;
          border-radius: 7px;
          background: #ffffff;
          color: #667085;
          font-size: 10px;
          box-shadow:
            0 1px 3px
              rgba(16, 24, 40, 0.06);
        }

        .dipo-preview-field-copy {
          min-width: 0;
        }

        .dipo-preview-field-title {
          display: block;
          color: #344054;
          font-size: 9px;
          font-weight: 800;
        }

        .dipo-preview-field-value {
          display: block;
          overflow: hidden;
          margin-top: 2px;
          color: #98a2b3;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            monospace;
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 17px;
        }

        .dipo-chip-row span {
          padding: 7px 9px;
          border: 1px solid #eaecf0;
          border-radius: 9px;
          background: #fafafa;
          color: #667085;
          font-size: 9px;
          font-weight: 700;
        }

        .dipo-step-tip {
          display: flex;
          gap: 9px;
          margin-top: 18px;
          padding-top: 15px;
          border-top: 1px solid #f2f4f7;
        }

        .dipo-step-tip > span {
          display: grid;
          width: 22px;
          height: 22px;
          flex: 0 0 22px;
          place-items: center;
          border-radius: 7px;
          background: #f2f4f7;
          color: #667085;
          font-size: 8px;
          font-weight: 850;
        }

        .dipo-step-tip p {
          margin: 0;
          color: #98a2b3;
          font-size: 9px;
          line-height: 1.5;
        }

        .dipo-step-tip strong {
          color: #667085;
          font-weight: 800;
        }

        /* ================================================
           VALUE STRIP
           ================================================ */

        .dipo-value-strip {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 1px;
          margin: 0 34px;
          overflow: hidden;
          border: 1px solid #eaecf0;
          border-radius: 17px;
          background: #eaecf0;
        }

        .dipo-value {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          background: #fafafa;
        }

        .dipo-value-icon {
          display: grid;
          width: 29px;
          height: 29px;
          flex: 0 0 29px;
          place-items: center;
          border-radius: 9px;
          background: #ffffff;
          color: #344054;
          font-size: 11px;
          font-weight: 900;
          box-shadow:
            0 1px 4px
              rgba(16, 24, 40, 0.055);
        }

        .dipo-value strong {
          display: block;
          color: #344054;
          font-size: 10px;
          font-weight: 800;
        }

        .dipo-value span:not(.dipo-value-icon) {
          display: block;
          margin-top: 2px;
          color: #98a2b3;
          font-size: 9px;
        }

        /* ================================================
           CTA
           ================================================ */

        .dipo-cta-area {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin: 22px 34px 0;
          padding: 18px;
          border: 1px solid #eaecf0;
          border-radius: 20px;
          background:
            linear-gradient(
              135deg,
              #fafafa,
              #ffffff
            );
        }

        .dipo-cta-copy strong {
          display: block;
          color: #101828;
          font-size: 14px;
          font-weight: 850;
          letter-spacing: -0.015em;
        }

        .dipo-cta-copy span {
          display: block;
          margin-top: 4px;
          color: #667085;
          font-size: 11px;
        }

        .dipo-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          min-height: 48px;
          padding: 0 17px 0 19px;
          border-radius: 14px;
          background: #101828;
          color: #ffffff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow:
            0 8px 20px
              rgba(16, 24, 40, 0.15);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .dipo-primary-button:hover {
          transform: translateY(-2px);
          background: #1d2939;
          box-shadow:
            0 12px 26px
              rgba(16, 24, 40, 0.18);
        }

        .dipo-primary-button:active {
          transform: translateY(0);
        }

        .dipo-primary-button:focus-visible,
        .dipo-back:focus-visible {
          outline: 3px solid
            rgba(59, 130, 246, 0.25);
          outline-offset: 3px;
        }

        .dipo-button-arrow {
          display: grid;
          width: 25px;
          height: 25px;
          place-items: center;
          border-radius: 8px;
          background: rgba(
            255,
            255,
            255,
            0.12
          );
          transition:
            transform 180ms ease;
        }

        .dipo-primary-button:hover
          .dipo-button-arrow {
          transform: translateX(3px);
        }

        /* ================================================
           MOTIVATION
           ================================================ */

        .dipo-motivation {
          display: flex;
          align-items: center;
          gap: 13px;
          justify-content: center;
          padding: 22px 24px 26px;
        }

        .dipo-motivation-line {
          width: 48px;
          height: 1px;
          background: #eaecf0;
        }

        .dipo-motivation p {
          margin: 0;
          color: #667085;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }

        .dipo-motivation p span {
          color: #101828;
          font-size: 16px;
          font-weight: 900;
        }

        /* ================================================
           PREVIEW SECTION
           ================================================ */

        .dipo-preview-section {
          display: grid;
          grid-template-columns:
            minmax(0, 0.85fr)
            minmax(360px, 1.15fr);
          align-items: center;
          gap: 54px;
          margin-top: 90px;
          padding: 0 24px;
        }

        .dipo-preview-copy h2 {
          margin: 0;
          color: #101828;
          font-size: clamp(
            31px,
            5vw,
            47px
          );
          line-height: 1.03;
          letter-spacing: -0.055em;
        }

        .dipo-preview-copy h2 span {
          color: #98a2b3;
        }

        .dipo-preview-copy > p:last-child {
          max-width: 460px;
          margin: 18px 0 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.7;
        }

        .dipo-browser {
          overflow: hidden;
          border: 1px solid #d0d5dd;
          border-radius: 24px;
          background: #ffffff;
          box-shadow:
            0 30px 70px
              rgba(16, 24, 40, 0.09);
          transform:
            perspective(1200px)
            rotateY(-2deg);
        }

        .dipo-browser-bar {
          display: grid;
          grid-template-columns: 70px 1fr 70px;
          align-items: center;
          min-height: 43px;
          padding: 0 13px;
          border-bottom: 1px solid #eaecf0;
          background: #f9fafb;
        }

        .dipo-browser-dots {
          display: flex;
          gap: 5px;
        }

        .dipo-browser-dots span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #d0d5dd;
        }

        .dipo-browser-url {
          overflow: hidden;
          padding: 7px 10px;
          border: 1px solid #eaecf0;
          border-radius: 8px;
          background: #ffffff;
          color: #98a2b3;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            monospace;
          font-size: 8px;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-browser-lock {
          justify-self: end;
          font-size: 10px;
        }

        .dipo-web-preview {
          min-height: 390px;
          padding: 35px 25px 20px;
          text-align: center;
          background:
            radial-gradient(
              circle at 50% 0%,
              #f8fafc,
              #ffffff 45%
            );
        }

        .dipo-preview-avatar {
          display: grid;
          width: 74px;
          height: 74px;
          margin: 0 auto;
          place-items: center;
          border: 5px solid #ffffff;
          border-radius: 50%;
          background: #101828;
          color: #ffffff;
          font-size: 24px;
          font-weight: 900;
          box-shadow:
            0 12px 30px
              rgba(16, 24, 40, 0.14);
        }

        .dipo-preview-name {
          margin-top: 15px;
          color: #101828;
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.035em;
        }

        .dipo-preview-profession {
          margin-top: 5px;
          color: #667085;
          font-size: 10px;
          font-weight: 650;
        }

        .dipo-preview-headline {
          max-width: 260px;
          margin: 17px auto 0;
          color: #344054;
          font-size: 12px;
          font-weight: 700;
        }

        .dipo-preview-links {
          display: grid;
          gap: 7px;
          max-width: 270px;
          margin: 20px auto 0;
        }

        .dipo-preview-links span {
          padding: 11px;
          border: 1px solid #eaecf0;
          border-radius: 11px;
          background: #ffffff;
          color: #344054;
          font-size: 9px;
          font-weight: 750;
          box-shadow:
            0 2px 6px
              rgba(16, 24, 40, 0.025);
        }

        .dipo-preview-footer {
          margin-top: 26px;
          color: #98a2b3;
          font-size: 8px;
          font-weight: 700;
        }

        /* ================================================
           SEARCH NOTE
           ================================================ */

        .dipo-search-note {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          max-width: 760px;
          margin: 48px auto 0;
          padding: 18px;
          border: 1px solid #eaecf0;
          border-radius: 19px;
          background: rgba(
            255,
            255,
            255,
            0.76
          );
        }

        .dipo-search-icon {
          display: grid;
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          place-items: center;
          border-radius: 11px;
          background: #f2f4f7;
          color: #344054;
          font-size: 18px;
        }

        .dipo-search-note strong {
          display: block;
          color: #344054;
          font-size: 12px;
          font-weight: 850;
        }

        .dipo-search-note p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 10px;
          line-height: 1.6;
        }

        .dipo-search-note small {
          display: block;
          margin-top: 7px;
          color: #98a2b3;
          font-size: 9px;
          line-height: 1.5;
        }

        /* ================================================
           FOOTER
           ================================================ */

        .dipo-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 65px;
          padding: 22px 4px 0;
          border-top: 1px solid #f0f2f5;
        }

        .dipo-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #667085;
          font-size: 10px;
          font-weight: 800;
        }

        .dipo-footer-mark {
          display: grid;
          width: 22px;
          height: 22px;
          place-items: center;
          border-radius: 7px;
          background: #101828;
          color: #ffffff;
          font-size: 8px;
          font-weight: 900;
        }

        .dipo-footer-copy {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 6px 15px;
          color: #98a2b3;
          font-size: 8px;
          text-align: right;
        }

        /* ================================================
           ANIMATION
           ================================================ */

        @keyframes messageFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-2px);
          }
        }

        /* ================================================
           TABLET
           ================================================ */

        @media (max-width: 900px) {
          .dipo-step-grid {
            grid-template-columns:
              1fr;
          }

          .dipo-step-card > p {
            min-height: 0;
          }

          .dipo-preview-section {
            grid-template-columns:
              1fr;
            gap: 30px;
          }

          .dipo-preview-copy {
            max-width: 650px;
            margin-inline: auto;
            text-align: center;
          }

          .dipo-preview-copy > p:last-child {
            margin-inline: auto;
          }

          .dipo-browser {
            max-width: 650px;
            width: 100%;
            margin-inline: auto;
            transform: none;
          }
        }

        /* ================================================
           MOBILE
           ================================================ */

        @media (max-width: 640px) {
          .dipo-shell {
            width: min(
              calc(100% - 20px),
              1080px
            );
            padding-top: 12px;
          }

          .dipo-topbar {
            grid-template-columns:
              1fr auto;
          }

          .dipo-brand {
            display: none;
          }

          .dipo-secure {
            padding: 6px 9px;
          }

          .dipo-hero {
            margin-top: 55px;
            margin-bottom: 28px;
          }

          .dipo-hero h1 {
            font-size: clamp(
              43px,
              14vw,
              64px
            );
            letter-spacing: -0.07em;
          }

          .dipo-hero-copy {
            margin-top: 18px;
            padding-inline: 7px;
            font-size: 14px;
            line-height: 1.65;
          }

          .dipo-message {
            font-size: 10px;
            line-height: 1.3;
            text-align: left;
          }

          .dipo-builder-card {
            border-radius: 23px;
          }

          .dipo-builder-head {
            display: block;
            padding: 24px 18px 18px;
          }

          .dipo-time-pill {
            width: fit-content;
            margin-top: 14px;
          }

          .dipo-progress {
            display: grid;
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 5px;
            margin: 0 12px;
            padding: 10px;
          }

          .dipo-progress-line {
            display: none;
          }

          .dipo-progress-item {
            justify-content: center;
            padding: 6px 2px;
          }

          .dipo-progress-item > div {
            display: none;
          }

          .dipo-progress-number {
            width: 31px;
            height: 31px;
            flex-basis: 31px;
          }

          .dipo-step-grid {
            gap: 9px;
            padding: 12px;
          }

          .dipo-step-card {
            padding: 17px;
            border-radius: 18px;
          }

          .dipo-value-strip {
            grid-template-columns:
              1fr;
            margin: 0 12px;
          }

          .dipo-value {
            padding: 12px;
          }

          .dipo-cta-area {
            display: block;
            margin: 12px 12px 0;
            padding: 16px;
          }

          .dipo-primary-button {
            width: 100%;
            margin-top: 14px;
          }

          .dipo-motivation {
            padding: 20px 15px 23px;
          }

          .dipo-motivation-line {
            width: 24px;
          }

          .dipo-motivation p {
            font-size: 10px;
          }

          .dipo-preview-section {
            margin-top: 65px;
            padding: 0 8px;
          }

          .dipo-preview-copy {
            text-align: left;
          }

          .dipo-preview-copy h2 {
            font-size: 38px;
          }

          .dipo-browser {
            border-radius: 19px;
          }

          .dipo-browser-bar {
            grid-template-columns:
              45px 1fr 30px;
            min-height: 38px;
          }

          .dipo-web-preview {
            min-height: 350px;
            padding-top: 29px;
          }

          .dipo-search-note {
            margin-top: 34px;
            padding: 15px;
          }

          .dipo-footer {
            display: block;
            margin-top: 48px;
            text-align: center;
          }

          .dipo-footer-brand {
            justify-content: center;
          }

          .dipo-footer-copy {
            justify-content: center;
            margin-top: 12px;
            text-align: center;
          }
        }

        /* ================================================
           SMALL PHONES
           ================================================ */

        @media (max-width: 380px) {
          .dipo-hero h1 {
            font-size: 42px;
          }

          .dipo-hero-copy {
            font-size: 13px;
          }

          .dipo-builder-head h2 {
            font-size: 25px;
          }

          .dipo-preview-copy h2 {
            font-size: 34px;
          }
        }

        /* ================================================
           REDUCED MOTION
           ================================================ */

        @media (prefers-reduced-motion: reduce) {
          .dipo-message {
            animation: none;
          }

          .dipo-step-card,
          .dipo-primary-button,
          .dipo-back,
          .dipo-button-arrow {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   SMALL SERVER COMPONENT
   ========================================================= */

function PreviewField({
  icon,
  title,
  value,
}) {
  return (
    <div className="dipo-preview-field">
      <span
        className="dipo-preview-field-icon"
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className="dipo-preview-field-copy">
        <span className="dipo-preview-field-title">
          {title}
        </span>

        <span className="dipo-preview-field-value">
          {value}
        </span>
      </span>
    </div>
  );
}