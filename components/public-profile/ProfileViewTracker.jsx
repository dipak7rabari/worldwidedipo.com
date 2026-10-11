'use client';

import { useEffect, useRef } from 'react';

function detectDeviceType() {
  if (
    typeof window ===
    'undefined'
  ) {
    return 'unknown';
  }

  const width =
    window.innerWidth;

  if (width < 768) {
    return 'mobile';
  }

  if (width < 1024) {
    return 'tablet';
  }

  return 'desktop';
}

async function createVisitorHash() {
  /*
   * We use a temporary browser session identifier.
   * It is not an account identifier and is not
   * sent as raw identifying information.
   */
  try {
    const key =
      'dipo_analytics_session';

    let sessionId =
      sessionStorage.getItem(
        key
      );

    if (!sessionId) {
      sessionId =
        crypto.randomUUID();

      sessionStorage.setItem(
        key,
        sessionId
      );
    }

    if (
      !crypto?.subtle
    ) {
      return null;
    }

    const data =
      new TextEncoder().encode(
        sessionId
      );

    const digest =
      await crypto.subtle.digest(
        'SHA-256',
        data
      );

    return Array.from(
      new Uint8Array(digest)
    )
      .map((byte) =>
        byte
          .toString(16)
          .padStart(2, '0')
      )
      .join('');
  } catch {
    return null;
  }
}

export default function ProfileViewTracker({
  profileId,
}) {
  const sent =
    useRef(false);

  useEffect(() => {
    if (
      sent.current ||
      !profileId
    ) {
      return;
    }

    sent.current = true;

    async function track() {
      const visitorHash =
        await createVisitorHash();

      try {
        await fetch(
          '/api/analytics/profile-view',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            credentials:
              'same-origin',
            keepalive: true,
            body: JSON.stringify({
              profile_id:
                profileId,

              device_type:
                detectDeviceType(),

              referrer:
                document.referrer ||
                null,

              visitor_hash:
                visitorHash,
            }),
          }
        );
      } catch {
        /*
         * Analytics must never interfere
         * with public profile rendering.
         */
      }
    }

    track();
  }, [profileId]);

  return null;
}