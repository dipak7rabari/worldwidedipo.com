'use client';

import { useEffect, useMemo, useState } from 'react';

const SITE_ORIGIN =
  'https://worldwidedipo.com';

function buildPublicUrl(slug) {
  const cleanSlug =
    typeof slug === 'string'
      ? slug.trim()
      : '';

  if (!cleanSlug) {
    return '';
  }

  return `${SITE_ORIGIN}/p/${encodeURIComponent(
    cleanSlug
  )}`;
}

async function copyText(value) {
  if (
    typeof navigator === 'undefined' ||
    !value
  ) {
    return false;
  }

  try {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText ===
        'function'
    ) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Continue with the legacy fallback.
  }

  try {
    const textarea =
      document.createElement('textarea');

    textarea.value = value;
    textarea.setAttribute(
      'readonly',
      ''
    );

    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const copied =
      document.execCommand('copy');

    document.body.removeChild(textarea);

    return copied;
  } catch {
    return false;
  }
}

export default function ProfileActions({
  profile,
}) {
  const slug = profile?.slug;

  const publicUrl = useMemo(
    () => buildPublicUrl(slug),
    [slug]
  );

  const profileName =
    typeof profile?.name === 'string' &&
    profile.name.trim()
      ? profile.name.trim()
      : 'Worldwide DIPO';

  const [copied, setCopied] =
    useState(false);

  const [shared, setShared] =
    useState(false);

  const [error, setError] =
    useState('');

  const [busy, setBusy] =
    useState(false);

  useEffect(() => {
    if (!copied && !shared) {
      return undefined;
    }

    const timer =
      window.setTimeout(() => {
        setCopied(false);
        setShared(false);
      }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copied, shared]);

  if (!publicUrl) {
    return null;
  }

  async function handleCopy() {
    if (busy) {
      return;
    }

    setError('');
    setBusy(true);

    try {
      const success =
        await copyText(publicUrl);

      if (!success) {
        setError(
          'Link copy nahi ho paya. Please try again.'
        );
        return;
      }

      setCopied(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    if (busy) {
      return;
    }

    setError('');
    setBusy(true);

    try {
      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function'
      ) {
        try {
          await navigator.share({
            title:
              `${profileName} | Worldwide DIPO`,
            text:
              `Check out ${profileName}'s Worldwide DIPO profile.`,
            url: publicUrl,
          });

          setShared(true);

          return;
        } catch (shareError) {
          /*
           * User pressed Cancel/Close.
           * Do not show an error.
           */
          if (
            shareError?.name ===
            'AbortError'
          ) {
            return;
          }

          /*
           * Native share failed.
           * Fall through to copy.
           */
        }
      }

      const success =
        await copyText(publicUrl);

      if (!success) {
        setError(
          'Share unavailable. Please copy the DIPO link manually.'
        );

        return;
      }

      setCopied(true);
    } finally {
      setBusy(false);
    }
  }

  function handleOpenProfile() {
    if (
      typeof window === 'undefined'
    ) {
      return;
    }

    window.open(
      publicUrl,
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <div
      className="public-profile-actions dipo-profile-actions"
      data-profile-actions
    >
      {/* ==================================================
          PRIMARY ACTION
          ================================================== */}

      <button
        type="button"
        className="public-profile-share-button dipo-action-primary"
        onClick={handleShare}
        disabled={busy}
        aria-label={`Share ${profileName}'s Worldwide DIPO profile`}
      >
        <span
          className="dipo-action-icon"
          aria-hidden="true"
        >
          {shared ? '✓' : '↗'}
        </span>

        <span className="dipo-action-text">
          {shared
            ? 'Shared'
            : busy
            ? 'Opening…'
            : 'Share DIPO'}
        </span>
      </button>

      {/* ==================================================
          COPY ACTION
          ================================================== */}

      <button
        type="button"
        className="public-profile-copy-button dipo-action-secondary"
        onClick={handleCopy}
        disabled={busy}
        aria-label={`Copy ${profileName}'s Worldwide DIPO link`}
      >
        <span
          className="dipo-action-icon"
          aria-hidden="true"
        >
          {copied ? '✓' : '⧉'}
        </span>

        <span className="dipo-action-text">
          {copied
            ? 'Link Copied'
            : 'Copy Link'}
        </span>
      </button>

      {/* ==================================================
          OPEN ACTION
          ================================================== */}

      <button
        type="button"
        className="public-profile-open-button dipo-action-tertiary"
        onClick={handleOpenProfile}
        disabled={busy}
        aria-label="Open this DIPO profile in a new tab"
      >
        <span
          className="dipo-action-icon"
          aria-hidden="true"
        >
          ⤴
        </span>

        <span className="dipo-action-text">
          Open
        </span>
      </button>

      {/* ==================================================
          URL PREVIEW
          ================================================== */}

      <div
        className="public-profile-url dipo-profile-url"
        title={publicUrl}
      >
        <span
          className="dipo-url-status"
          aria-hidden="true"
        />

        <span className="dipo-url-text">
          worldwidedipo.com/p/
          {slug}
        </span>

        <button
          type="button"
          className="dipo-url-copy-mini"
          onClick={handleCopy}
          disabled={busy}
          aria-label="Copy DIPO URL"
        >
          {copied ? '✓' : 'Copy'}
        </button>
      </div>

      {/* ==================================================
          STATUS / ERROR
          ================================================== */}

      {(error || copied || shared) && (
        <div
          className={`dipo-action-status ${
            error
              ? 'is-error'
              : 'is-success'
          }`}
          role="status"
          aria-live="polite"
        >
          {error ||
            (shared
              ? 'DIPO share sheet opened.'
              : copied
              ? 'Your DIPO link is ready to share.'
              : '')}
        </div>
      )}
    </div>
  );
}