/*
 * ============================================================
 * WORLDWIDE DIPO
 * Lifecycle Rules
 * ============================================================
 *
 * Pure lifecycle policy.
 *
 * IMPORTANT:
 * - No database access.
 * - No auth.
 * - No payment mutation.
 * - Safe to use from server services, cron jobs and tests.
 *
 * The database state-machine remains authoritative for actual
 * persistence. These rules provide one consistent application
 * layer around it.
 * ============================================================
 */

export const PROFILE_STATES = Object.freeze({
  DRAFT: 'draft',
  PENDING: 'pending',
  ACTIVE: 'active',
  EXPIRED: 'expired',
});

export const PAYMENT_STATES = Object.freeze({
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
});

export const PAYMENT_TYPES = Object.freeze({
  INITIAL: 'initial',
  RENEWAL: 'renewal',
});

export const LIFECYCLE_CONFIG = Object.freeze({
  SUBSCRIPTION_MONTHS: 6,
  GRACE_DAYS: 30,
});

const DAY_MS =
  24 *
  60 *
  60 *
  1000;

export function isKnownProfileState(status) {
  return Object.values(PROFILE_STATES).includes(
    status
  );
}

export function isActiveProfile(profile) {
  return Boolean(
    profile &&
      profile.status === PROFILE_STATES.ACTIVE
  );
}

export function isExpiredProfile(profile) {
  return Boolean(
    profile &&
      profile.status === PROFILE_STATES.EXPIRED
  );
}

export function isPendingProfile(profile) {
  return Boolean(
    profile &&
      profile.status === PROFILE_STATES.PENDING
  );
}

export function isDraftProfile(profile) {
  return Boolean(
    profile &&
      profile.status === PROFILE_STATES.DRAFT
  );
}

export function hasValidExpiry(profile, now = new Date()) {
  if (!profile?.expires_at) {
    return false;
  }

  const expiry =
    new Date(profile.expires_at);

  if (!Number.isFinite(expiry.getTime())) {
    return false;
  }

  return expiry.getTime() > now.getTime();
}

export function hasExpired(profile, now = new Date()) {
  if (!profile?.expires_at) {
    return false;
  }

  const expiry =
    new Date(profile.expires_at);

  if (!Number.isFinite(expiry.getTime())) {
    return false;
  }

  return expiry.getTime() <= now.getTime();
}

export function isDeletionScheduled(profile) {
  return Boolean(
    profile?.deletion_scheduled_at
  );
}

export function isDeletionDue(profile, now = new Date()) {
  if (!profile?.deletion_scheduled_at) {
    return false;
  }

  const deletionDate =
    new Date(profile.deletion_scheduled_at);

  if (!Number.isFinite(deletionDate.getTime())) {
    return false;
  }

  return deletionDate.getTime() <= now.getTime();
}

export function isWithinGracePeriod(
  profile,
  now = new Date()
) {
  if (!profile?.deletion_scheduled_at) {
    return false;
  }

  const deletionDate =
    new Date(profile.deletion_scheduled_at);

  if (!Number.isFinite(deletionDate.getTime())) {
    return false;
  }

  return (
    profile.status === PROFILE_STATES.EXPIRED &&
    deletionDate.getTime() > now.getTime()
  );
}

export function canActivateProfile(profile) {
  if (!profile) {
    return false;
  }

  return (
    profile.status === PROFILE_STATES.PENDING ||
    profile.status === PROFILE_STATES.EXPIRED
  );
}

export function canExpireProfile(profile) {
  if (!profile) {
    return false;
  }

  return (
    profile.status === PROFILE_STATES.ACTIVE
  );
}

export function canRenewProfile(profile) {
  if (!profile) {
    return false;
  }

  return (
    profile.status === PROFILE_STATES.ACTIVE ||
    profile.status === PROFILE_STATES.EXPIRED
  );
}

export function canDeleteProfile(profile, now = new Date()) {
  if (!profile) {
    return false;
  }

  return (
    profile.status === PROFILE_STATES.EXPIRED &&
    isDeletionDue(profile, now)
  );
}

export function calculateGraceDeletionDate(
  from = new Date()
) {
  const base =
    from instanceof Date
      ? from
      : new Date(from);

  if (!Number.isFinite(base.getTime())) {
    throw new TypeError(
      'Invalid lifecycle base date.'
    );
  }

  return new Date(
    base.getTime() +
      LIFECYCLE_CONFIG.GRACE_DAYS *
        DAY_MS
  );
}

export function calculateSubscriptionExpiry(
  from = new Date()
) {
  const base =
    from instanceof Date
      ? new Date(from.getTime())
      : new Date(from);

  if (!Number.isFinite(base.getTime())) {
    throw new TypeError(
      'Invalid subscription base date.'
    );
  }

  /*
   * Calendar-month arithmetic is intentional.
   *
   * Six months is a business duration, not a fixed
   * 180-day duration.
   */
  const originalDay =
    base.getUTCDate();

  const targetMonth =
    base.getUTCMonth() + 6;

  base.setUTCDate(1);
  base.setUTCMonth(targetMonth);

  const lastDay =
    new Date(
      Date.UTC(
        base.getUTCFullYear(),
        base.getUTCMonth() + 1,
        0
      )
    ).getUTCDate();

  base.setUTCDate(
    Math.min(
      originalDay,
      lastDay
    )
  );

  return base;
}

export function getRenewalBaseDate(
  profile,
  now = new Date()
) {
  const current =
    now instanceof Date
      ? now
      : new Date(now);

  if (!Number.isFinite(current.getTime())) {
    throw new TypeError(
      'Invalid current date.'
    );
  }

  if (!profile?.expires_at) {
    return current;
  }

  const expiry =
    new Date(profile.expires_at);

  if (!Number.isFinite(expiry.getTime())) {
    return current;
  }

  return expiry > current
    ? expiry
    : current;
}

export function getNextRenewalExpiry(
  profile,
  now = new Date()
) {
  return calculateSubscriptionExpiry(
    getRenewalBaseDate(
      profile,
      now
    )
  );
}

export function getLifecycleState(
  profile,
  {
    hasPendingRenewal = false,
    now = new Date(),
  } = {}
) {
  if (!profile) {
    return 'unavailable';
  }

  if (hasPendingRenewal) {
    return 'renewal-pending';
  }

  if (profile.status === PROFILE_STATES.DRAFT) {
    return 'draft';
  }

  if (profile.status === PROFILE_STATES.PENDING) {
    return 'payment-pending';
  }

  if (
    profile.status === PROFILE_STATES.ACTIVE &&
    hasExpired(profile, now)
  ) {
    return 'expired-pending-lifecycle';
  }

  if (profile.status === PROFILE_STATES.ACTIVE) {
    return 'active';
  }

  if (profile.status === PROFILE_STATES.EXPIRED) {
    if (isDeletionDue(profile, now)) {
      return 'deletion-due';
    }

    return 'expired-grace';
  }

  return 'unknown';
}

export function assertLifecycleProfile(profile) {
  if (!profile) {
    throw new TypeError(
      'Profile is required.'
    );
  }

  if (!profile.id) {
    throw new TypeError(
      'Profile id is required.'
    );
  }

  if (!isKnownProfileState(profile.status)) {
    throw new Error(
      'UNKNOWN_PROFILE_STATUS'
    );
  }

  return profile;
}