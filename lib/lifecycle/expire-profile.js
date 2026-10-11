import {
  PROFILE_STATES,
  LIFECYCLE_CONFIG,
  calculateGraceDeletionDate,
  assertLifecycleProfile,
  canExpireProfile,
  hasExpired,
} from './lifecycle-rules';

/*
 * ============================================================
 * WORLDWIDE DIPO
 * Expire Profile
 * ============================================================
 *
 * Trusted lifecycle operation.
 *
 * Rules:
 * - Only active profiles can expire.
 * - expires_at must actually be reached.
 * - Pending renewal prevents expiry.
 * - Expiry creates the configured grace-period timestamp.
 * - No payment is created or modified here.
 * ============================================================
 */

const PROFILE_SELECT = `
  id,
  owner_id,
  name,
  slug,
  plan,
  status,
  expires_at,
  deletion_scheduled_at,
  updated_at
`;

function successResult(profile) {
  return {
    success: true,
    status: 200,
    profile,
  };
}

function failure(status, message) {
  return {
    success: false,
    status,
    errors: {
      form: message,
    },
  };
}

async function hasPendingRenewal(
  supabase,
  profileId
) {
  const {
    data,
    error,
  } =
    await supabase
      .from('payments')
      .select('id')
      .eq(
        'profile_id',
        profileId
      )
      .eq(
        'payment_type',
        'renewal'
      )
      .eq(
        'status',
        'pending'
      )
      .limit(1)
      .maybeSingle();

  if (error) {
    console.error(
      'Lifecycle pending-renewal lookup failed:',
      error.message
    );

    throw new Error(
      'PENDING_RENEWAL_LOOKUP_FAILED'
    );
  }

  return Boolean(data);
}

export async function expireProfile(
  supabase,
  {
    profileId,
    now = new Date(),
    graceDays = LIFECYCLE_CONFIG.GRACE_DAYS,
  } = {}
) {
  if (!supabase) {
    return failure(
      500,
      'Lifecycle database client is required.'
    );
  }

  if (
    typeof profileId !== 'string' ||
    !profileId.trim()
  ) {
    return failure(
      400,
      'A valid profile id is required.'
    );
  }

  const currentDate =
    now instanceof Date
      ? now
      : new Date(now);

  if (
    !Number.isFinite(
      currentDate.getTime()
    )
  ) {
    return failure(
      400,
      'Invalid lifecycle date.'
    );
  }

  const normalizedGraceDays =
    Number(graceDays);

  if (
    !Number.isFinite(
      normalizedGraceDays
    ) ||
    normalizedGraceDays < 0 ||
    normalizedGraceDays > 3650
  ) {
    return failure(
      400,
      'Invalid grace period.'
    );
  }

  const {
    data: profile,
    error: lookupError,
  } =
    await supabase
      .from('profiles')
      .select(PROFILE_SELECT)
      .eq('id', profileId)
      .maybeSingle();

  if (lookupError) {
    console.error(
      'Lifecycle expiry lookup failed:',
      lookupError.message
    );

    return failure(
      500,
      'Unable to load profile.'
    );
  }

  if (!profile) {
    return failure(
      404,
      'Profile not found.'
    );
  }

  assertLifecycleProfile(profile);

  if (!canExpireProfile(profile)) {
    return failure(
      409,
      'Only active profiles can be expired.'
    );
  }

  if (!hasExpired(profile, currentDate)) {
    return failure(
      409,
      'Profile subscription has not expired yet.'
    );
  }

  let pendingRenewal = false;

  try {
    pendingRenewal =
      await hasPendingRenewal(
        supabase,
        profile.id
      );
  } catch {
    return failure(
      500,
      'Unable to verify renewal status.'
    );
  }

  /*
   * A legitimate renewal submitted before the lifecycle
   * boundary must not be made impossible to approve.
   */
  if (pendingRenewal) {
    return {
      success: false,
      status: 409,
      deferred: true,
      reason:
        'pending-renewal',
      errors: {
        form:
          'Profile expiry was deferred because a renewal payment is pending.',
      },
    };
  }

  const deletionDate =
    new Date(
      currentDate.getTime() +
        normalizedGraceDays *
          24 *
          60 *
          60 *
          1000
    );

  const {
    data: updatedProfile,
    error: updateError,
  } =
    await supabase
      .from('profiles')
      .update({
        status:
          PROFILE_STATES.EXPIRED,

        deletion_scheduled_at:
          deletionDate.toISOString(),

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        'id',
        profile.id
      )
      .eq(
        'status',
        PROFILE_STATES.ACTIVE
      )
      .lte(
        'expires_at',
        currentDate.toISOString()
      )
      .select(PROFILE_SELECT)
      .maybeSingle();

  if (updateError) {
    console.error(
      'Lifecycle expiry update failed:',
      updateError.message
    );

    return failure(
      500,
      'Unable to expire profile.'
    );
  }

  if (!updatedProfile) {
    return failure(
      409,
      'Profile lifecycle changed before expiry could complete.'
    );
  }

  return successResult(
    updatedProfile
  );
}