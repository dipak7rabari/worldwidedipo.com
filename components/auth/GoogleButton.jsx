"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSignIn() {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const origin = window.location.origin;
      const callbackUrl = `${origin}/auth/callback`;

      const { data, error: signInError } =
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

      if (signInError) {
        const message =
          signInError?.message || "";

        const lower =
          message.toLowerCase();

        if (
          lower.includes("provider") &&
          (
            lower.includes("not enabled") ||
            lower.includes("unsupported")
          )
        ) {
          throw new Error(
            "Google login is not enabled in the Worldwide DIPO authentication settings. Please enable Google in Supabase Authentication → Providers."
          );
        }

        throw signInError;
      }

      /*
       * Supabase normally redirects the browser automatically.
       * Keep this fallback only for unusual cases where
       * an OAuth URL is returned without navigation.
       */
      if (data?.url) {
        window.location.assign(data.url);
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error(
        "Worldwide DIPO Google OAuth error:",
        err
      );

      setError(
        err?.message ||
          "Google sign-in start nahi ho saka. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <div className="google-auth-wrapper">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="google-button"
        aria-busy={loading}
        aria-label="Continue with Google"
      >
        <span
          className="google-icon"
          aria-hidden="true"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
              fill="#4285F4"
            />
            <path
              d="M12 21.67c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.67Z"
              fill="#34A853"
            />
            <path
              d="M6.54 13.76a5.85 5.85 0 0 1 0-3.52V7.71H3.3a9.76 9.76 0 0 0 0 8.58l3.24-2.53Z"
              fill="#FBBC05"
            />
            <path
              d="M12 6.21c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.29 14.63 2.33 12 2.33a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 7.93 9.46 6.21 12 6.21Z"
              fill="#EA4335"
            />
          </svg>
        </span>

        <span className="google-button-text">
          {loading
            ? "Connecting..."
            : "Continue with Google"}
        </span>

        {loading && (
          <span
            className="google-spinner"
            aria-hidden="true"
          />
        )}
      </button>

      {error ? (
        <div
          className="google-error"
          role="alert"
          aria-live="polite"
        >
          <span
            className="google-error-icon"
            aria-hidden="true"
          >
            !
          </span>

          <span>
            {error}
          </span>
        </div>
      ) : null}

      <style jsx>{`
        .google-auth-wrapper {
          width: 100%;
        }

        .google-button {
          position: relative;
          width: 100%;
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 20px;
          border: 1px solid #d9dee6;
          border-radius: 16px;
          background: #ffffff;
          color: #111827;
          font-size: 16px;
          font-weight: 750;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .google-button:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: #c5ccd6;
          background: #fbfcfd;
          box-shadow:
            0 10px 28px rgba(15, 23, 42, 0.07);
        }

        .google-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .google-button:focus-visible {
          outline: 3px solid rgba(66, 133, 244, 0.2);
          outline-offset: 3px;
        }

        .google-button:disabled {
          cursor: not-allowed;
          opacity: 0.68;
        }

        .google-icon {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
        }

        .google-button-text {
          min-width: 0;
          white-space: nowrap;
        }

        .google-spinner {
          position: absolute;
          right: 18px;
          width: 17px;
          height: 17px;
          border: 2px solid #dbe2ea;
          border-top-color: #111827;
          border-radius: 50%;
          animation: spin 700ms linear infinite;
        }

        .google-error {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 12px;
          padding: 12px 14px;
          border: 1px solid #fecaca;
          border-radius: 14px;
          background: #fff5f5;
          color: #b42318;
          font-size: 12px;
          line-height: 1.55;
        }

        .google-error-icon {
          display: grid;
          place-items: center;
          width: 19px;
          height: 19px;
          flex: 0 0 19px;
          border-radius: 50%;
          background: #fee2e2;
          color: #b42318;
          font-size: 12px;
          font-weight: 800;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 520px) {
          .google-button {
            min-height: 56px;
            border-radius: 15px;
            font-size: 15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .google-button {
            transition: none;
          }

          .google-spinner {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}