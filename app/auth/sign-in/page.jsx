
import Link from 'next/link';
import { redirectAuthenticatedUser } from '@/lib/auth/redirect-user';
import SignInForm from '@/components/auth/SignInForm';

export const metadata = {
  title: 'Sign In | Worldwide DIPO',
  description:
    'Welcome back to Worldwide DIPO. Sign in securely to create, manage and grow your digital identity.',
  robots: {
    index: false,
    follow: true,
  },
};

function BrandMark() {
  return (
    <div className="dipo-login-logo" aria-hidden="true">
      <svg width="27" height="27" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 2.5L20 12L29.5 16L20 20L16 29.5L12 20L2.5 16L12 12L16 2.5Z"
          fill="currentColor"
        />
        <circle cx="25.5" cy="6.5" r="2.4" fill="#9FE579" />
      </svg>
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="dipo-preview" aria-hidden="true">
      <div className="dipo-preview__shine" />

      <div className="dipo-preview__top">
        <span className="dipo-preview__mini-logo">✳</span>
        <span>YOUR DIGITAL SPACE</span>
        <span className="dipo-preview__dots">•••</span>
      </div>

      <div className="dipo-preview__profile">
        <div className="dipo-preview__avatar">
          <svg viewBox="0 0 72 72" width="72" height="72" fill="none">
            <circle cx="36" cy="36" r="36" fill="#D5E9C9" />
            <path
              d="M16 68c3-15 12-22 20-22s17 7 20 22"
              fill="#4E7840"
            />
            <circle cx="36" cy="30" r="14" fill="#EABF9D" />
            <path
              d="M22 31c-2-14 5-21 15-21 10 0 16 7 13 21-3-7-6-10-12-11-5 5-10 6-16 11Z"
              fill="#344A2B"
            />
          </svg>
        </div>

        <div className="dipo-preview__verified">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="m5 12 5 5L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2>Your name here.</h2>
        <p>Creator · Professional · You</p>

        <div className="dipo-preview__handle">
          worldwidedipo.com/p/you
        </div>
      </div>

      <div className="dipo-preview__links">
        <div>
          <span className="dipo-preview__link-icon">↗</span>
          <span>My portfolio</span>
          <span>↗</span>
        </div>

        <div>
          <span className="dipo-preview__link-icon">✳</span>
          <span>What I do</span>
          <span>↗</span>
        </div>

        <div>
          <span className="dipo-preview__link-icon">✉</span>
          <span>Get in touch</span>
          <span>↗</span>
        </div>
      </div>

      <div className="dipo-preview__footer">
        Made for your next big thing.
      </div>
    </div>
  );
}

export default async function SignInPage() {
  // Preserve existing session validation and redirect behavior.
  await redirectAuthenticatedUser();

  return (
    <main className="dipo-login-page">
      <div className="dipo-login-layout">
        <header className="dipo-login-header">
          <Link href="/" className="dipo-login-brand">
            <BrandMark />
            <span>Worldwide DIPO</span>
          </Link>

          <Link href="/" className="dipo-login-back">
            <span aria-hidden="true">←</span>
            Back to home
          </Link>
        </header>

        <div className="dipo-login-grid">
          <section
            className="dipo-login-showcase"
            aria-label="Worldwide DIPO introduction"
          >
            <div className="dipo-login-showcase__content">
              <div className="dipo-login-kicker">
                <span className="dipo-login-kicker__dot" />
                ONE IDENTITY. ENDLESS POSSIBILITIES.
              </div>

              <h2>
                Make your
                <br />
                mark on the
                <br />
                <span>internet.</span>
              </h2>

              <p>
                Your story, work, links and identity.
                <br />
                All in one beautiful place.
              </p>

              <div className="dipo-login-highlights">
                <span>✦ Your own space</span>
                <span>✦ Built for everyone</span>
                <span>✦ Share anywhere</span>
              </div>
            </div>

            <div className="dipo-login-preview-wrap">
              <div className="dipo-login-orbit dipo-login-orbit--one" />
              <div className="dipo-login-orbit dipo-login-orbit--two" />

              <div className="dipo-login-floating dipo-login-floating--top">
                <span>✦</span> Your identity, elevated
              </div>

              <PreviewCard />

              <div className="dipo-login-floating dipo-login-floating--bottom">
                <span>↗</span> Made to be discovered
              </div>
            </div>

            <div className="dipo-login-showcase__foot">
              <span>WORLDWIDE DIPO</span>
              <span>MADE WITH ♥ IN INDIA</span>
            </div>
          </section>

          <section
            className="dipo-login-main"
            aria-label="Worldwide DIPO sign in"
          >
            <div className="dipo-login-mobile-intro">
              <span>WELCOME TO WORLDWIDE DIPO</span>
            </div>

            <div className="dipo-login-form-wrap">
              <SignInForm />
            </div>

            <div className="dipo-login-mobile-footer">
              <span>Made with ❤️ in India</span>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .dipo-login-page {
          --dipo-deep: #1b3018;
          --dipo-muted: #84917f;
          --dipo-green: #8dc572;
          min-height: 100vh;
          min-height: 100svh;
          width: 100%;
          overflow-x: clip;
          background: #fafbf8;
          color: #1b3018;
          font-family: inherit;
          box-sizing: border-box;
        }

        .dipo-login-page *,
        .dipo-login-page *::before,
        .dipo-login-page *::after {
          box-sizing: border-box;
        }

        .dipo-login-layout {
          width: 100%;
          max-width: 1600px;
          min-height: 100vh;
          min-height: 100svh;
          margin: 0 auto;
          padding: 22px;
          display: flex;
          flex-direction: column;
        }

        .dipo-login-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 58px;
          padding: 0 10px 20px;
        }

        .dipo-login-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: #1b3018;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -.055em;
        }

        .dipo-login-logo {
          display: grid;
          place-items: center;
          width: 39px;
          height: 39px;
          flex: 0 0 39px;
          border-radius: 13px;
          background: #e3f2d7;
          color: #285625;
          transition: transform .3s ease;
        }

        .dipo-login-brand:hover .dipo-login-logo {
          transform: rotate(35deg);
        }

        .dipo-login-back {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 10px 14px;
          border-radius: 999px;
          color: #667362;
          text-decoration: none;
          font-size: 12px;
          font-weight: 650;
          transition:
            color .2s ease,
            background .2s ease,
            transform .2s ease;
        }

        .dipo-login-back:hover {
          color: #234720;
          background: #eef4e9;
          transform: translateX(-3px);
        }

        .dipo-login-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr);
          flex: 1;
          min-height: 720px;
          border: 1px solid #edf0e8;
          border-radius: 28px;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 18px 75px rgba(34,60,25,.045);
        }

        .dipo-login-showcase {
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
          overflow: hidden;
          padding: clamp(32px, 5vw, 66px);
          background:
            radial-gradient(
              ellipse at 85% 50%,
              rgba(196,233,175,.65),
              transparent 55%
            ),
            linear-gradient(155deg, #f0f6ec 0%, #e7f1df 100%);
        }

        .dipo-login-showcase::before {
          content: "";
          position: absolute;
          width: 600px;
          height: 600px;
          top: -290px;
          right: -220px;
          border: 1px solid rgba(99,146,75,.15);
          border-radius: 50%;
          pointer-events: none;
        }

        .dipo-login-showcase__content {
          position: relative;
          z-index: 2;
        }

        .dipo-login-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #6d9161;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .dipo-login-kicker__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #76b75c;
          box-shadow: 0 0 0 4px rgba(118,183,92,.12);
        }

        .dipo-login-showcase h2 {
          margin: 27px 0 18px;
          font-size: clamp(43px, 5vw, 77px);
          line-height: 1.03;
          letter-spacing: -.075em;
          font-weight: 800;
          color: #20351d;
        }

        .dipo-login-showcase h2 span {
          color: #89b974;
        }

        .dipo-login-showcase__content > p {
          margin: 0;
          color: #7b9171;
          line-height: 1.8;
          font-size: 14px;
        }

        .dipo-login-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 24px;
        }

        .dipo-login-highlights span {
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.62);
          border: 1px solid rgba(255,255,255,.8);
          color: #6e8662;
          font-size: 11px;
          font-weight: 650;
        }

        .dipo-login-preview-wrap {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 390px;
          padding: 27px 0;
        }

        .dipo-login-orbit {
          position: absolute;
          border: 1px solid rgba(112,158,89,.18);
          border-radius: 50%;
          pointer-events: none;
        }

        .dipo-login-orbit--one {
          width: 390px;
          height: 390px;
        }

        .dipo-login-orbit--two {
          width: 520px;
          height: 520px;
          animation: dipoOrbit 24s linear infinite;
        }

        .dipo-preview {
          position: relative;
          z-index: 1;
          width: 282px;
          max-width: 90%;
          padding: 17px;
          border: 1px solid rgba(255,255,255,.95);
          border-radius: 28px;
          background: rgba(255,255,255,.9);
          box-shadow:
            0 28px 80px rgba(54,98,41,.14),
            0 6px 18px rgba(54,98,41,.06);
          transform: rotate(-5deg);
          animation: dipoFloat 7s ease-in-out infinite;
        }

        .dipo-preview__shine {
          position: absolute;
          z-index: -1;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            145deg,
            rgba(255,255,255,.95),
            rgba(246,251,241,.75)
          );
        }

        .dipo-preview__top {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .09em;
          color: #77916d;
        }

        .dipo-preview__mini-logo {
          color: #6ba64e;
          font-size: 17px;
        }

        .dipo-preview__dots {
          margin-left: auto;
          color: #8a9f81;
          letter-spacing: 1px;
        }

        .dipo-preview__profile {
          position: relative;
          padding: 19px 0 15px;
          text-align: center;
        }

        .dipo-preview__avatar {
          width: 72px;
          height: 72px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 50%;
          border: 4px solid #fff;
          box-shadow: 0 6px 20px rgba(40,80,30,.1);
        }

        .dipo-preview__verified {
          position: relative;
          display: grid;
          place-items: center;
          width: 18px;
          height: 18px;
          margin: -15px auto 0;
          transform: translateX(25px);
          border: 2px solid #fff;
          border-radius: 50%;
          background: #6cb153;
        }

        .dipo-preview__profile h2 {
          margin: 12px 0 4px;
          font-size: 20px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -.05em;
          color: #20351d;
        }

        .dipo-preview__profile p {
          margin: 0;
          font-size: 10px;
          color: #899982;
        }

        .dipo-preview__handle {
          display: inline-block;
          margin-top: 13px;
          padding: 7px 12px;
          border-radius: 999px;
          background: #eff5e9;
          font-size: 9px;
          font-weight: 700;
          color: #66875a;
        }

        .dipo-preview__links {
          display: grid;
          gap: 8px;
        }

        .dipo-preview__links > div {
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: 44px;
          padding: 0 13px;
          border: 1px solid #ebf0e6;
          border-radius: 12px;
          background: #f6f9f3;
          color: #344c2e;
          font-size: 11px;
          font-weight: 700;
        }

        .dipo-preview__links > div > span:last-child {
          margin-left: auto;
        }

        .dipo-preview__link-icon {
          display: grid;
          place-items: center;
          width: 23px;
          height: 23px;
          border-radius: 7px;
          background: #e4efda;
          color: #63974d;
        }

        .dipo-preview__footer {
          padding-top: 14px;
          text-align: center;
          font-size: 9px;
          color: #a0ad99;
        }

        .dipo-login-floating {
          position: absolute;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 14px;
          border: 1px solid rgba(255,255,255,.95);
          border-radius: 13px;
          background: rgba(255,255,255,.89);
          box-shadow: 0 12px 32px rgba(60,96,48,.09);
          color: #4e7343;
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
          backdrop-filter: blur(10px);
        }

        .dipo-login-floating span {
          color: #71af53;
          font-size: 14px;
        }

        .dipo-login-floating--top {
          top: 20%;
          right: 1%;
          transform: rotate(5deg);
        }

        .dipo-login-floating--bottom {
          bottom: 16%;
          left: 0%;
          transform: rotate(-4deg);
        }

        .dipo-login-showcase__foot {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: #90a488;
          font-size: 9px;
          font-weight: 750;
          letter-spacing: .11em;
        }

        .dipo-login-main {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          padding: clamp(32px, 5vw, 70px);
          background: #fff;
        }

        .dipo-login-form-wrap {
          width: 100%;
          max-width: 430px;
        }

        .dipo-login-mobile-intro,
        .dipo-login-mobile-footer {
          display: none;
        }

        @keyframes dipoFloat {
          0%, 100% {
            transform: rotate(-5deg) translateY(0);
          }
          50% {
            transform: rotate(-4deg) translateY(-13px);
          }
        }

        @keyframes dipoOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1080px) {
          .dipo-login-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }

          .dipo-login-showcase {
            padding: 34px;
          }

          .dipo-login-main {
            padding: 35px;
          }

          .dipo-login-showcase h2 {
            font-size: 52px;
          }

          .dipo-login-floating {
            display: none;
          }
        }

        @media (max-width: 780px) {
          .dipo-login-layout {
            padding: 0;
          }

          .dipo-login-header {
            padding: 19px 22px;
            min-height: 75px;
            background: #fff;
            border-bottom: 1px solid #f0f2ec;
          }

          .dipo-login-brand {
            font-size: 16px;
          }

          .dipo-login-logo {
            width: 35px;
            height: 35px;
            flex-basis: 35px;
            border-radius: 11px;
          }

          .dipo-login-logo svg {
            width: 24px;
            height: 24px;
          }

          .dipo-login-back {
            padding: 8px;
            font-size: 11px;
          }

          .dipo-login-grid {
            display: block;
            flex: 1;
            min-height: 0;
            overflow: visible;
            border: 0;
            border-radius: 0;
            box-shadow: none;
          }

          .dipo-login-showcase {
            display: none;
          }

          .dipo-login-main {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
            min-height: calc(100svh - 75px);
            padding: 35px 25px 24px;
            background:
              radial-gradient(
                ellipse at 100% 0%,
                rgba(229,244,217,.52),
                transparent 49%
              ),
              #fff;
          }

          .dipo-login-form-wrap {
            margin: 0 auto;
          }

          .dipo-login-mobile-intro {
            display: block;
            width: 100%;
            max-width: 430px;
            margin: 0 auto 20px;
            color: #8d9d87;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .16em;
          }

          .dipo-login-mobile-footer {
            display: block;
            margin: 36px auto 0;
            color: #a1ada0;
            font-size: 11px;
            text-align: center;
          }
        }

        @media (max-width: 380px) {
          .dipo-login-header {
            padding-inline: 16px;
          }

          .dipo-login-main {
            padding-inline: 20px;
          }

          .dipo-login-back {
            gap: 5px;
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-login-page *,
          .dipo-login-page *::before,
          .dipo-login-page *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
