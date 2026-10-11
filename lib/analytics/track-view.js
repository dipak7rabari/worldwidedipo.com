'use client';

import {
  ANALYTICS_PATHS,
  ANALYTICS_STORAGE_KEYS,
} from './analytics-events';

import {
  detectDeviceType,
  getCurrentReferrer,
  isValidUuid,
} from './analytics-utils';

const REQUEST_TIMEOUT = 5000;

function getSessionStorage() {
  if (
    typeof window === 'undefined' ||
    !window.sessionStorage
  ) {
    return null;
  }

  return window.sessionStorage;
}

function getSessionId() {
  const storage =
    getSessionStorage();

  if (!storage) {
    return null;
  }

  try {
    let sessionId =
      storage.getItem(
        ANALYTICS_STORAGE_KEYS.SESSION_ID,
      );

    if (!sessionId) {
      if (
        typeof crypto === 'undefined' ||
        typeof crypto.randomUUID !== 'function'
      ) {
        return null;
      }

      sessionId =
        crypto.randomUUID();

      storage.setItem(
        ANALYTICS_STORAGE_KEYS.SESSION_ID,
        sessionId,
      );
    }

    return sessionId;
  } catch {
    return null;
  }
}

async function hashSessionId(
  sessionId,
) {
  if (
    !sessionId ||
    typeof crypto === 'undefined' ||
    !crypto.subtle ||
    typeof TextEncoder === 'undefined'
  ) {
    return null;
  }

  try {
    const encoded =
      new TextEncoder().encode(
        sessionId,
      );

    const digest =
      await crypto.subtle.digest(
        'SHA-256',
        encoded,
      );

    return Array.from(
      new Uint8Array(digest),
    )
      .map((byte) =>
        byte
          .toString(16)
          .padStart(2, '0'),
      )
      .join('');
  } catch {
    return null;
  }
}

function getProfileSessionKey(
  profileId,
) {
  return `${ANALYTICS_STORAGE_KEYS.PROFILE_PREFIX}${profileId}`;
}

function hasTrackedProfile(
  profileId,
) {
  const storage =
    getSessionStorage();

  if (!storage) {
    return false;
  }

  try {
    return (
      storage.getItem(
        getProfileSessionKey(
          profileId,
        ),
      ) === '1'
    );
  } catch {
    return false;
  }
}

function markProfileTracked(
  profileId,
) {
  const storage =
    getSessionStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      getProfileSessionKey(
        profileId,
      ),
      '1',
    );
  } catch {
    /*
     * Analytics must remain best-effort.
     * Storage failures must never affect
     * the public profile.
     */
  }
}

function createAbortSignal(
  timeout = REQUEST_TIMEOUT,
) {
  if (
    typeof AbortController ===
    'undefined'
  ) {
    return {
      signal: undefined,
      cleanup: () => {},
    };
  }

  const controller =
    new AbortController();

  const timer =
    window.setTimeout(() => {
      controller.abort();
    }, timeout);

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timer);
    },
  };
}

/**
 * Tracks one public DIPO profile view.
 *
 * This is intentionally best-effort:
 * analytics must never delay or break the
 * public profile experience.
 */
export async function trackView(
  profileId,
  options = {},
) {
  if (
    typeof window === 'undefined' ||
    !isValidUuid(profileId)
  ) {
    return {
      success: false,
      skipped: true,
      reason: 'invalid_profile_id',
    };
  }

  const {
    force = false,
    deviceType,
    referrer,
    visitorHash,
  } = options;

  if (
    !force &&
    hasTrackedProfile(profileId)
  ) {
    return {
      success: true,
      skipped: true,
      reason: 'already_tracked',
    };
  }

  const sessionId =
    getSessionId();

  const resolvedVisitorHash =
    visitorHash !== undefined
      ? visitorHash
      : await hashSessionId(
          sessionId,
        );

  const payload = {
    profile_id: profileId,

    device_type:
      deviceType ||
      detectDeviceType(),

    referrer:
      referrer !== undefined
        ? referrer
        : getCurrentReferrer(),

    visitor_hash:
      resolvedVisitorHash,
  };

  const {
    signal,
    cleanup,
  } =
    createAbortSignal();

  try {
    const response =
      await fetch(
        ANALYTICS_PATHS.PROFILE_VIEW,
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

          signal,

          body: JSON.stringify(
            payload,
          ),
        },
      );

    if (
      response.ok
    ) {
      markProfileTracked(
        profileId,
      );

      return {
        success: true,
        skipped: false,
      };
    }

    return {
      success: false,
      skipped: false,
      status: response.status,
    };
  } catch {
    return {
      success: false,
      skipped: false,
    };
  } finally {
    cleanup();
  }
}

/**
 * React-friendly helper.
 *
 * Returns a cleanup-safe function so callers can
 * invoke it from useEffect without worrying about
 * unhandled promise rejections.
 */
export function createViewTracker(
  profileId,
  options = {},
) {
  let cancelled = false;

  const run =
    async () => {
      if (cancelled) {
        return {
          success: false,
          skipped: true,
          reason: 'cancelled',
        };
      }

      return trackView(
        profileId,
        options,
      );
    };

  return {
    run,

    cancel() {
      cancelled = true;
    },
  };
}

export async function trackProfileView(
  profileId,
  options = {},
) {
  return trackView(
    profileId,
    options,
  );
}

export default trackView;