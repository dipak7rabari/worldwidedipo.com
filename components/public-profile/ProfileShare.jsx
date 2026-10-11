'use client';

import { useState } from 'react';

export default function ProfileShare({
  name,
  url,
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function handleShare() {
    setError('');

    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.share
      ) {
        await navigator.share({
          title: `${name} | Worldwide DIPO`,
          text: `Check out ${name}'s Worldwide DIPO profile.`,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (shareError) {
      if (shareError?.name === 'AbortError') {
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch {
        setError('Unable to copy the profile link.');
      }
    }
  }

  return (
    <div className="public-profile-share">
      <button
        type="button"
        onClick={handleShare}
        className="public-profile-secondary-button"
        aria-label={`Share ${name}'s Worldwide DIPO profile`}
      >
        {copied ? '✓ Link Copied' : '↗ Share Profile'}
      </button>

      {error && (
        <p
          role="status"
          className="public-profile-share-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}