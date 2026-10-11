
'use client';

import Link from 'next/link';
import GoogleButton from '@/components/auth/GoogleButton';
import EmailAuthForm from '@/components/auth/EmailAuthForm';

function ArrowIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function SignInForm() {
  return (
    <section className="dipo-signin" aria-labelledby="signin-heading">
      <div className="dipo-signin__badge">
        <span className="dipo-signin__badge-dot" />
        YOUR SPACE ON THE INTERNET
      </div>

      <div className="dipo-signin__heading">
        <h1 id="signin-heading">
          Welcome
          <span> back<span className="dipo-signin__period">.</span></span>
        </h1>

        <p>
          Everything that makes you, you.
          <br />
          One beautiful digital identity.
        </p>
      </div>

      <div className="dipo-signin__form">
        <div className="dipo-signin__google">
          <GoogleButton />
        </div>

        <div className="dipo-signin__divider" aria-hidden="true">
          <span>OR CONTINUE WITH EMAIL</span>
        </div>

        <div className="dipo-signin__email">
          <EmailAuthForm />
        </div>
      </div>

      <div className="dipo-signin__join">
        <span>New around here?</span>

        <Link href="/auth/signup">
          Create your DIPO
          <ArrowIcon size={15} />
        </Link>
      </div>

      <div className="dipo-signin__bottom">
        <div className="dipo-signin__secure">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          Secure authentication
        </div>

        <p className="dipo-signin__legal">
          By continuing, you agree to our{' '}
          <Link href="/terms">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </div>

      <style jsx global>{`
        .dipo-signin {
          width: 100%;
          max-width: 430px;
          margin-inline: auto;
          color: #172216;
          font-family: inherit;
          -webkit-font-smoothing: antialiased;
          animation: dipoSignInEnter .7s cubic-bezier(.22,1,.36,1) both;
        }

        .dipo-signin *,
        .dipo-signin *::before,
        .dipo-signin *::after {
          box-sizing: border-box;
        }

        .dipo-signin__badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 13px;
          border-radius: 999px;
          background: #eef5e8;
          border: 1px solid #e3efd8;
          color: #577749;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          line-height: 1;
        }

        .dipo-signin__badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #78ba60;
          box-shadow: 0 0 0 4px rgba(120,186,96,.13);
        }

        .dipo-signin__heading {
          margin: 24px 0 32px;
        }

        .dipo-signin__heading h1 {
          margin: 0;
          color: #162416;
          font-size: clamp(43px, 5vw, 64px);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: -.065em;
        }

        .dipo-signin__heading h1 > span {
          display: block;
        }

        .dipo-signin__period {
          color: #80b85e;
        }

        .dipo-signin__heading p {
          margin: 17px 0 0;
          color: #899187;
          font-size: 15px;
          line-height: 1.85;
          letter-spacing: -.015em;
        }

        .dipo-signin__form {
          width: 100%;
        }

        .dipo-signin__google,
        .dipo-signin__email {
          width: 100%;
          min-width: 0;
        }

        /* Override visual styles only.
           GoogleButton authentication logic stays untouched. */

        .dipo-signin .google-button {
          min-height: 55px !important;
          border-radius: 15px !important;
          border: 1px solid #dfe7da !important;
          background: #f3f7f0 !important;
          color: #22321d !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          box-shadow: none !important;
          transition:
            background .25s ease,
            border-color .25s ease,
            transform .25s ease,
            box-shadow .25s ease !important;
        }

        .dipo-signin .google-button:hover:not(:disabled) {
          background: #eaf2e5 !important;
          border-color: #c9dec0 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(46,77,37,.07) !important;
        }

        .dipo-signin .google-button:focus-visible {
          outline: 3px solid #acd89c;
          outline-offset: 3px;
        }

        .dipo-signin__divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0 25px;
          color: #a1a99d;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
          white-space: nowrap;
        }

        .dipo-signin__divider::before,
        .dipo-signin__divider::after {
          content: "";
          flex: 1;
          min-width: 0;
          height: 1px;
          background: #e8ece5;
        }

        /* Keep EmailAuthForm state, validation and CAPTCHA intact. */

        .dipo-signin__email form {
          width: 100%;
        }

        .dipo-signin__email label {
          color: #354531;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -.01em;
        }

        .dipo-signin__email input[type="email"] {
          display: block;
          width: 100%;
          min-height: 55px;
          padding: 0 17px;
          background: #fff;
          border: 1px solid #e0e6dd;
          border-radius: 15px;
          color: #23321f;
          font-size: 15px;
          outline: none;
          transition:
            border-color .22s ease,
            box-shadow .22s ease,
            background .22s ease;
        }

        .dipo-signin__email input[type="email"]::placeholder {
          color: #b0b8ad;
        }

        .dipo-signin__email input[type="email"]:focus {
          border-color: #9fc58d;
          box-shadow: 0 0 0 4px rgba(130,181,106,.13);
        }

        .dipo-signin__email button[type="submit"] {
          width: 100%;
          min-height: 54px;
          border: 1px solid #163513;
          border-radius: 15px;
          background: #193a17;
          color: #fff;
          font-size: 14px;
          font-weight: 750;
          letter-spacing: -.01em;
          cursor: pointer;
          transition:
            background .22s ease,
            transform .22s ease,
            box-shadow .22s ease;
        }

        .dipo-signin__email button[type="submit"]:hover:not(:disabled) {
          background: #285627;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(25,58,23,.12);
        }

        .dipo-signin__email button[type="submit"]:active:not(:disabled) {
          transform: translateY(0);
        }

        .dipo-signin__email button[type="submit"]:focus-visible {
          outline: 3px solid #acd89c;
          outline-offset: 3px;
        }

        .dipo-signin__email button[type="submit"]:disabled {
          opacity: .48;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .dipo-signin__join {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 29px;
          text-align: center;
          color: #91998e;
          font-size: 12px;
        }

        .dipo-signin__join a {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #294f21;
          font-weight: 800;
          text-decoration: none;
          transition: gap .2s ease, color .2s ease;
        }

        .dipo-signin__join a:hover {
          gap: 8px;
          color: #4d8d36;
        }

        .dipo-signin__bottom {
          margin-top: 37px;
          padding-top: 21px;
          border-top: 1px solid #edf0ea;
        }

        .dipo-signin__secure {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          color: #83947c;
          font-size: 11px;
          font-weight: 600;
        }

        .dipo-signin__legal {
          margin: 12px auto 0;
          max-width: 340px;
          text-align: center;
          color: #a8afa5;
          font-size: 11px;
          line-height: 1.85;
        }

        .dipo-signin__legal a {
          color: #687c60;
          text-decoration: underline;
          text-decoration-color: #cad9c4;
          text-underline-offset: 3px;
        }

        @keyframes dipoSignInEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @media (max-width: 640px) {
          .dipo-signin {
            max-width: 440px;
          }

          .dipo-signin__heading {
            margin-top: 23px;
            margin-bottom: 29px;
          }

          .dipo-signin__heading h1 {
            font-size: clamp(42px, 11vw, 55px);
          }

          .dipo-signin__heading p {
            font-size: 14px;
          }

          .dipo-signin__bottom {
            margin-top: 31px;
          }
        }

        @media (max-width: 360px) {
          .dipo-signin__heading h1 {
            font-size: 39px;
          }

          .dipo-signin__badge {
            font-size: 9px;
            letter-spacing: .08em;
          }

          .dipo-signin__divider {
            font-size: 9px;
            gap: 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-signin {
            animation: none;
          }

          .dipo-signin *,
          .dipo-signin *::before,
          .dipo-signin *::after {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
