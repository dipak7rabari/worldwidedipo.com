"use client";

import Link from "next/link";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import TurnstileWidget from "@/components/auth/TurnstileWidget";

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [captchaToken, setCaptchaToken] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  /* =========================================================
     GOOGLE SIGNUP
  ========================================================= */

  async function handleGoogleSignup() {
    setError("");
    setMessage("");
    setGoogleLoading(true);

    try {
      const callbackUrl =
        `${window.location.origin}/auth/callback?next=%2Fonboarding`;

      const { error: oauthError } =
        await supabase.auth.signInWithOAuth({
          provider: "google",

          options: {
            redirectTo: callbackUrl,

            queryParams: {
              access_type: "offline",
              prompt: "select_account",
            },
          },
        });

      if (oauthError) {
        throw oauthError;
      }

      /*
       * Supabase redirects the browser to Google.
       * No manual redirect is needed here.
       */
    } catch (err) {
      console.error(
        "Google signup failed:",
        err
      );

      setError(
        err?.message ||
          "Google signup could not start. Please try again."
      );

      setGoogleLoading(false);
    }
  }

  /* =========================================================
     EMAIL + PASSWORD SIGNUP
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!captchaToken) {
      setError(
        "Please complete the security verification."
      );
      return;
    }

    setLoading(true);

    try {
      const emailRedirectTo =
        `${window.location.origin}/auth/callback?next=%2Fonboarding`;

      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,

        options: {
          emailRedirectTo,
          captchaToken,
        },
      });

      if (signupError) {
        const errorText =
          signupError.message?.toLowerCase() || "";

        if (
          errorText.includes(
            "already registered"
          ) ||
          errorText.includes(
            "already been registered"
          ) ||
          errorText.includes(
            "user already registered"
          )
        ) {
          throw new Error(
            "An account with this email already exists. Please sign in instead."
          );
        }

        if (
          errorText.includes("rate")
        ) {
          throw new Error(
            "Too many requests. Please wait a little and try again."
          );
        }

        throw signupError;
      }

      /*
       * If email confirmation is disabled,
       * Supabase can return a live session immediately.
       */
      if (data?.session) {
        window.location.href =
          "/onboarding";

        return;
      }

      /*
       * If email confirmation is enabled,
       * user needs to verify email first.
       */
      setMessage(
        "Account created successfully. Please check your email to verify your account."
      );

      setPassword("");
    } catch (err) {
      console.error(
        "Email signup failed:",
        err
      );

      setError(
        err?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
      setCaptchaToken("");
    }
  }

  return (
    <main className="signupPage">
      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      {/* =====================================================
          TOP
      ====================================================== */}

      <header className="topBar">
        <Link
          href="/"
          className="brand"
          aria-label="Worldwide DIPO home"
        >
          <span className="brandMark">
            D
          </span>

          <span className="brandText">
            Worldwide DIPO
          </span>
        </Link>

        <Link
          href="/auth/sign-in"
          className="loginLink"
        >
          Login
        </Link>
      </header>

      {/* =====================================================
          BENEFITS
      ====================================================== */}

      <section className="benefits">
        <div className="benefit">
          <span className="check">
            ✓
          </span>

          <strong>
            Create your own Worldwide DIPO
          </strong>
        </div>

        <div className="benefit">
          <span className="check">
            ✓
          </span>

          <strong>
            Get your personal DIPO URL
          </strong>
        </div>

        <div className="benefit">
          <span className="check">
            ✓
          </span>

          <strong>
            Show your work, services and links
          </strong>
        </div>

        <div className="benefit">
          <span className="check">
            ✓
          </span>

          <strong>
            Build a professional digital identity
          </strong>
        </div>
      </section>

      {/* =====================================================
          SIGNUP CARD
      ====================================================== */}

      <section className="signupCard">
        <div className="cardHeader">
          <div className="miniBrand">
            <span>✦</span>
            WORLDWIDE DIPO
          </div>

          <h1>
            Create your DIPO
          </h1>

          <p>
            Start with your account.
            <br />
            You can build your DIPO profile next.
          </p>
        </div>

        {/* ===================================================
            GOOGLE
        ==================================================== */}

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={
            googleLoading ||
            loading
          }
          className="googleButton"
        >
          <span className="googleIcon">
            G
          </span>

          <span>
            {googleLoading
              ? "Connecting..."
              : "Continue with Google"}
          </span>
        </button>

        <div className="divider">
          <span />
          <strong>OR</strong>
          <span />
        </div>

        {/* ===================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="signupForm"
        >
          <label
            htmlFor="signup-email"
          >
            Email
          </label>

          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(
                event.target.value
              );

              setError("");
              setMessage("");
            }}
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={254}
            required
          />

          <label
            htmlFor="signup-password"
          >
            Password
          </label>

          <div className="passwordField">
            <input
              id="signup-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );

                setError("");
                setMessage("");
              }}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current
                )
              }
              className="showPassword"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          {/* =================================================
              CAPTCHA
          ================================================== */}

          <div className="captchaWrap">
            <TurnstileWidget
              onToken={(token) => {
                setCaptchaToken(
                  token
                );

                setError("");
              }}
              onExpire={() => {
                setCaptchaToken("");
              }}
              onError={() => {
                setCaptchaToken("");

                setError(
                  "Security verification failed. Please try again."
                );
              }}
            />
          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error ? (
            <div
              className="errorBox"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          {/* =================================================
              SUCCESS
          ================================================== */}

          {message ? (
            <div
              className="successBox"
              role="status"
            >
              {message}

              <Link
                href="/auth/sign-in"
              >
                Go to Login →
              </Link>
            </div>
          ) : null}

          {/* =================================================
              CREATE
          ================================================== */}

          <button
            type="submit"
            disabled={
              loading ||
              googleLoading ||
              !captchaToken
            }
            className="createButton"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* ===================================================
            TERMS
        ==================================================== */}

        <p className="termsText">
          By creating an account, you agree to use
          Worldwide DIPO responsibly and follow its
          applicable{" "}
          <Link href="/privacy">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms">
            Terms
          </Link>
          .
        </p>

        <div className="bottomLogin">
          Already have an account?{" "}
          <Link href="/auth/sign-in">
            Login
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="signupFooter">
        <span>
          Made With ❤️ in India
        </span>

        <strong>
          𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
        </strong>

        <span>
          All copyrights reserved @
          {" "}
          𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
        </span>
      </footer>

      {/* =====================================================
          STYLES
      ====================================================== */}

      <style jsx>{`
        .signupPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fbfcfd 100%
            );
          color: #111827;
          padding: 24px 18px 40px;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .backgroundGlow {
          position: fixed;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
          opacity: .35;
        }

        .glowOne {
          top: -180px;
          left: -150px;
          background: #e8f8ef;
        }

        .glowTwo {
          right: -180px;
          bottom: -180px;
          background: #eef1ff;
        }

        .topBar {
          position: relative;
          z-index: 2;
          width: min(100%, 1080px);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #111827;
          text-decoration: none;
          font-weight: 850;
        }

        .brandMark {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #111318;
          color: white;
          font-size: 18px;
          font-weight: 900;
        }

        .brandText {
          font-size: 15px;
          letter-spacing: -.02em;
        }

        .loginLink {
          color: #111827;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
          padding: 11px 15px;
          border: 1px solid #e2e6eb;
          border-radius: 12px;
          background: white;
        }

        .benefits {
          position: relative;
          z-index: 1;
          width: min(100%, 1080px);
          margin: 42px auto 34px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .benefit {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #3c4656;
          font-size: 14px;
          line-height: 1.35;
        }

        .check {
          flex: 0 0 auto;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #effbf4;
          color: #168044;
          font-weight: 900;
          font-size: 18px;
        }

        .signupCard {
          position: relative;
          z-index: 2;
          width: min(100%, 720px);
          margin: 0 auto;
          padding: clamp(28px, 6vw, 58px);
          border: 1px solid #dfe4ea;
          border-radius: 34px;
          background: rgba(255,255,255,.94);
          box-shadow:
            0 30px 90px rgba(17, 24, 39, .08);
          backdrop-filter: blur(20px);
        }

        .cardHeader {
          margin-bottom: 28px;
        }

        .miniBrand {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 12px;
          color: #8b95a5;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .16em;
        }

        .miniBrand span {
          color: #111318;
        }

        .cardHeader h1 {
          margin: 0;
          color: #111827;
          font-size: clamp(36px, 7vw, 54px);
          line-height: .98;
          letter-spacing: -.055em;
        }

        .cardHeader p {
          margin: 17px 0 0;
          color: #6f7a8a;
          font-size: 17px;
          line-height: 1.6;
        }

        .googleButton,
        .createButton {
          width: 100%;
          min-height: 62px;
          border-radius: 17px;
          font-size: 16px;
          font-weight: 850;
          cursor: pointer;
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            opacity .2s ease;
        }

        .googleButton {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          border: 1px solid #dce2e8;
          background: #fff;
          color: #111827;
        }

        .googleButton:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(17,24,39,.07);
        }

        .googleButton:disabled {
          opacity: .6;
          cursor: wait;
        }

        .googleIcon {
          font-size: 22px;
          font-weight: 900;
        }

        .divider {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 14px;
          margin: 28px 0;
          color: #a1aab8;
          font-size: 12px;
        }

        .divider span {
          height: 1px;
          background: #e6e9ed;
        }

        .signupForm {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .signupForm label {
          margin-top: 6px;
          color: #344054;
          font-size: 14px;
          font-weight: 800;
        }

        .signupForm input {
          width: 100%;
          min-height: 62px;
          border: 1px solid #dce2e8;
          border-radius: 17px;
          padding: 0 18px;
          outline: none;
          background: #fff;
          color: #111827;
          font-size: 16px;
          transition:
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .signupForm input::placeholder {
          color: #9aa8bc;
        }

        .signupForm input:focus {
          border-color: #111318;
          box-shadow: 0 0 0 4px rgba(17,19,24,.06);
        }

        .passwordField {
          position: relative;
        }

        .passwordField input {
          padding-right: 90px;
        }

        .showPassword {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          min-height: 42px;
          padding: 0 14px;
          border: 0;
          border-radius: 12px;
          background: #f4f6f8;
          color: #526071;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .captchaWrap {
          margin: 10px 0 2px;
          overflow: hidden;
        }

        .errorBox,
        .successBox {
          margin-top: 5px;
          padding: 14px 16px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.5;
        }

        .errorBox {
          border: 1px solid #fecaca;
          background: #fff5f5;
          color: #a61b1b;
        }

        .successBox {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #166534;
        }

        .successBox a {
          display: block;
          margin-top: 8px;
          color: #111827;
          font-weight: 800;
          text-decoration: none;
        }

        .createButton {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 7px;
          border: 0;
          background: #111318;
          color: #fff;
          box-shadow: 0 15px 35px rgba(17,19,24,.14);
        }

        .createButton:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 42px rgba(17,19,24,.18);
        }

        .createButton:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .termsText {
          margin: 22px 0 0;
          color: #9aa4b2;
          font-size: 12px;
          line-height: 1.65;
          text-align: center;
        }

        .termsText a {
          color: #566171;
          font-weight: 750;
          text-decoration: none;
        }

        .bottomLogin {
          margin-top: 24px;
          padding-top: 21px;
          border-top: 1px solid #edf0f3;
          color: #7c8796;
          font-size: 13px;
          text-align: center;
        }

        .bottomLogin a {
          color: #111827;
          font-weight: 850;
          text-decoration: none;
        }

        .signupFooter {
          position: relative;
          z-index: 2;
          width: min(100%, 1080px);
          margin: 35px auto 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          color: #a0a8b4;
          font-size: 10px;
          text-align: center;
        }

        .signupFooter strong {
          color: #697382;
          font-size: 12px;
        }

        @media (max-width: 800px) {
          .benefits {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 560px) {
          .signupPage {
            padding: 14px 12px 28px;
          }

          .brandText {
            font-size: 13px;
          }

          .benefits {
            grid-template-columns: 1fr;
            gap: 11px;
            margin-top: 30px;
            margin-bottom: 25px;
          }

          .benefit {
            font-size: 14px;
          }

          .signupCard {
            padding: 27px 19px 24px;
            border-radius: 27px;
          }

          .cardHeader h1 {
            font-size: 39px;
          }

          .cardHeader p {
            font-size: 15px;
          }

          .googleButton,
          .createButton,
          .signupForm input {
            min-height: 58px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </main>
  );
}