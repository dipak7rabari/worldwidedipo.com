"use client";

import { useCallback, useMemo } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

/**
 * Worldwide DIPO
 * Cloudflare Turnstile Security Widget
 *
 * Used by:
 * - Email authentication
 * - Signup / login security flows
 * - Any future protected auth form
 *
 * IMPORTANT:
 * - Site key is PUBLIC and safe to expose in browser.
 * - Secret key MUST stay server-side.
 * - Server must independently verify the token.
 */

export default function TurnstileWidget({
  onToken,
  onExpire,
  onError,
  className = "",
}) {
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  /**
   * Keep callbacks stable so the Turnstile
   * component does not unnecessarily re-initialize.
   */
  const handleSuccess = useCallback(
    (token) => {
      if (
        typeof token !== "string" ||
        !token.trim()
      ) {
        onToken?.("");
        onError?.();
        return;
      }

      onToken?.(token);
    },
    [onToken, onError],
  );

  const handleExpire = useCallback(() => {
    onToken?.("");
    onExpire?.();
  }, [onToken, onExpire]);

  const handleError = useCallback(() => {
    onToken?.("");
    onError?.();
  }, [onToken, onError]);

  /**
   * Never render Turnstile with an empty site key.
   * This avoids a confusing Cloudflare runtime error.
   */
  const configurationError = useMemo(() => {
    return !siteKey || !siteKey.trim();
  }, [siteKey]);

  if (configurationError) {
    return (
      <div
        className={`w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 ${className}`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600"
            aria-hidden="true"
          >
            !
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-red-800">
              Security verification unavailable
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700">
              Worldwide DIPO security verification is
              not configured correctly. Please try again
              later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-[65px] w-full items-center overflow-hidden rounded-2xl border border-gray-200 bg-white px-2 py-2 transition-colors ${className}`}
      aria-label="Security verification"
    >
      <Turnstile
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onExpire={handleExpire}
        onError={handleError}
        refreshExpired="auto"
        appearance="always"
        fixedSize
      />
    </div>
  );
}