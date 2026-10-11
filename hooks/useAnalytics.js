'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const TRACK_ENDPOINT = '/api/analytics/profile-view';
const SESSION_KEY = 'dipo_analytics_session';

const DEVICE_TYPES = Object.freeze([
  'mobile',
  'tablet',
  'desktop',
  'unknown',
]);

function detectDeviceType() {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const width = window.innerWidth;

  if (!Number.isFinite(width)) {
    return 'unknown';
  }

  if (width < 768) {
    return 'mobile';
  }

  if (width < 1024) {
    return 'tablet';
  }

  return 'desktop';
}

function getSessionId() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    if (!window.sessionStorage) {
      return null;
    }

    let sessionId =
      window.sessionStorage.getItem(SESSION_KEY);

    if (!sessionId) {
      if (
        typeof crypto === 'undefined' ||
        typeof crypto.randomUUID !== 'function'
      ) {
        return null;
      }

      sessionId = crypto.randomUUID();

      window.sessionStorage.setItem(
        SESSION_KEY,
        sessionId
      );
    }

    return sessionId;
  } catch {
    return null;
  }
}

async function createVisitorHash() {
  try {
    const sessionId = getSessionId();

    if (!sessionId) {
      return null;
    }

    if (
      typeof crypto === 'undefined' ||
      !crypto.subtle ||
      typeof TextEncoder === 'undefined'
    ) {
      return null;
    }

    const encoded =
      new TextEncoder().encode(sessionId);

    const digest =
      await crypto.subtle.digest(
        'SHA-256',
        encoded
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

function getReferrer() {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    return document.referrer || null;
  } catch {
    return null;
  }
}

function normalizeDeviceType(value) {
  return DEVICE_TYPES.includes(value)
    ? value
    : 'unknown';
}

function createRequestPayload(profileId) {
  return {
    profile_id: profileId,
    device_type: normalizeDeviceType(
      detectDeviceType()
    ),
    referrer: getReferrer(),
  };
}

function isValidProfileId(profileId) {
  return (
    typeof profileId === 'string' &&
    profileId.trim().length > 0 &&
    profileId.trim().length <= 200
  );
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Tracks a public DIPO profile view.
 *
 * The hook is intentionally resilient:
 * - never throws tracking errors into the UI
 * - prevents duplicate tracking during one mount
 * - uses keepalive where supported
 * - creates a privacy-friendly session hash
 * - works safely during SSR/hydration
 *
 * @param {string|null|undefined} profileId
 * @param {Object} options
 * @param {boolean} options.enabled
 * @param {boolean} options.autoTrack
 * @param {boolean} options.includeVisitorHash
 * @param {boolean} options.retry
 * @returns {{
 *   trackView: Function,
 *   tracking: boolean,
 *   tracked: boolean,
 *   error: Error|null,
 *   reset: Function
 * }}
 */
export default function useAnalytics(
  profileId,
  {
    enabled = true,
    autoTrack = true,
    includeVisitorHash = true,
    retry = false,
  } = {}
) {
  const mountedRef = useRef(false);
  const trackedRef = useRef(false);
  const requestRef = useRef(null);
  const retryRef = useRef(false);

  const [tracking, setTracking] =
    useState(false);

  const [tracked, setTracked] =
    useState(false);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (requestRef.current) {
        try {
          requestRef.current.abort();
        } catch {
          // Ignore abort failures.
        }
      }
    };
  }, []);

  const trackView = useCallback(
    async ({
      force = false,
      signal: externalSignal,
    } = {}) => {
      if (
        !enabled ||
        !isValidProfileId(profileId)
      ) {
        return {
          success: false,
          skipped: true,
          reason:
            !enabled
              ? 'disabled'
              : 'invalid-profile',
        };
      }

      if (
        trackedRef.current &&
        !force
      ) {
        return {
          success: true,
          skipped: true,
          reason: 'already-tracked',
        };
      }

      if (
        requestRef.current &&
        !force
      ) {
        return requestRef.current;
      }

      setTracking(true);
      setError(null);

      const controller =
        new AbortController();

      requestRef.current =
        (async () => {
          try {
            const payload =
              createRequestPayload(
                profileId.trim()
              );

            if (includeVisitorHash) {
              payload.visitor_hash =
                await createVisitorHash();
            }

            if (
              externalSignal?.aborted
            ) {
              controller.abort();
            }

            if (controller.signal.aborted) {
              return {
                success: false,
                aborted: true,
              };
            }

            const response =
              await fetch(
                TRACK_ENDPOINT,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type':
                      'application/json',
                    Accept:
                      'application/json',
                  },
                  credentials:
                    'same-origin',
                  cache: 'no-store',
                  keepalive: true,
                  signal:
                    controller.signal,
                  body: JSON.stringify(
                    payload
                  ),
                }
              );

            const raw =
              await response.text();

            const data =
              raw
                ? safeJsonParse(raw)
                : null;

            /*
             * The analytics endpoint intentionally
             * keeps the public profile resilient.
             * Treat a successful HTTP response as
             * a completed tracking attempt.
             */
            if (response.ok) {
              trackedRef.current = true;

              if (mountedRef.current) {
                setTracked(true);
              }

              return {
                success:
                  data?.success !== false,
                status:
                  response.status,
                data,
              };
            }

            const nextError =
              new Error(
                data?.error ||
                  'Unable to record profile view.'
              );

            if (mountedRef.current) {
              setError(nextError);
            }

            return {
              success: false,
              status:
                response.status,
              error: nextError,
              data,
            };
          } catch (caughtError) {
            if (
              caughtError?.name ===
              'AbortError'
            ) {
              return {
                success: false,
                aborted: true,
              };
            }

            const nextError =
              caughtError instanceof Error
                ? caughtError
                : new Error(
                    'Analytics request failed.'
                  );

            if (mountedRef.current) {
              setError(nextError);
            }

            return {
              success: false,
              error: nextError,
            };
          } finally {
            requestRef.current = null;

            if (mountedRef.current) {
              setTracking(false);
            }
          }
        })();

      return requestRef.current;
    },
    [
      enabled,
      includeVisitorHash,
      profileId,
    ]
  );

  useEffect(() => {
    if (
      !autoTrack ||
      !enabled ||
      !isValidProfileId(profileId) ||
      trackedRef.current
    ) {
      return;
    }

    let cancelled = false;

    async function run() {
      /*
       * Give the browser one paint before sending
       * analytics so public profile rendering is
       * always prioritized.
       */
      if (
        typeof window !== 'undefined' &&
        typeof window.requestIdleCallback ===
          'function'
      ) {
        await new Promise((resolve) => {
          const idleId =
            window.requestIdleCallback(
              () => resolve(),
              {
                timeout: 1200,
              }
            );

          return () => {
            try {
              window.cancelIdleCallback(
                idleId
              );
            } catch {
              // Ignore cleanup failures.
            }
          };
        });
      } else {
        await new Promise((resolve) => {
          window.setTimeout(
            resolve,
            80
          );
        });
      }

      if (cancelled) {
        return;
      }

      const result =
        await trackView();

      /*
       * Optional single retry for transient
       * client-side failures.
       */
      if (
        retry &&
        !result.success &&
        !result.aborted &&
        !retryRef.current &&
        !cancelled
      ) {
        retryRef.current = true;

        await new Promise((resolve) => {
          window.setTimeout(
            resolve,
            700
          );
        });

        if (!cancelled) {
          await trackView();
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [
    autoTrack,
    enabled,
    profileId,
    retry,
    trackView,
  ]);

  const reset = useCallback(() => {
    trackedRef.current = false;
    retryRef.current = false;

    if (mountedRef.current) {
      setTracked(false);
      setError(null);
      setTracking(false);
    }
  }, []);

  return {
    trackView,
    tracking,
    tracked,
    error,
    reset,
  };
}

export function useProfileViewAnalytics(
  profileId,
  options = {}
) {
  return useAnalytics(
    profileId,
    {
      autoTrack: true,
      ...options,
    }
  );
}