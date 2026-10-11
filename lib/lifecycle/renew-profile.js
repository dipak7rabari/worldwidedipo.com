import {
  PROFILE_STATES,
  calculateSubscriptionExpiry,
  getRenewalBaseDate,
  assertLifecycleProfile,
  canRenewProfile,
} from './lifecycle-rules';

/*
 * ============================================================
 * WORLDWIDE DIPO
 * Renew Profile
 * ============================================================
 *
 * This module performs the PROFILE lifecycle side of renewal.
 *
 * IMPORTANT:
 * Payment verification remains authoritative in the existing
 * secure payment RPC.
 *
 * Therefore this helper is intentionally useful only from a
 * trusted backend path where payment verification has already
 * been established.
 *
 * It does not:
 * - accept a client amount
 * - create payments
 * - verify payments
 * - accept owner_id from the browser
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

const ALLOWED_PLANS = new Set([
  'Starter',
  'Pro',
  'Elite',
]);

function failure(status, message) {
  return {
    success: false,
    status,
    errors: {
      form: message,
    },
  };
}

export async function renewProfile(
  supabase,
  {
    profileId,
    plan,
    baseDate,
    expiresAt,
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
      'Lifecycle renewal lookup failed:',
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

  if (!canRenewProfile(profile)) {
    return failure(
      409,
      'Profile is not eligible for renewal.'
    );
  }

  /*
   * A profile being renewed must not be returned to pending.
   * Active remains active; expired may be restored to active.
   */
  const nextStatus =
    PROFILE_STATES.ACTIVE;

  let nextExpiry;

  if (expiresAt !== undefined) {
    const parsed =
      new Date(expiresAt);

    if (
      !Number.isFinite(
        parsed.getTime()
      )
    ) {
      return failure(
        400,
        'Invalid renewal expiry date.'
      );
    }

    nextExpiry = parsed;
  } else {
    const renewalBase =
      getRenewalBaseDate(
        profile,
        baseDate || new Date()
      );

    nextExpiry =
      calculateSubscriptionExpiry(
        renewalBase
      );
  }

  if (
    nextExpiry.getTime() <=
    Date.now()
  ) {
    return failure(
      400,
      'Renewal expiry must be in the future.'
    );
  }

  const update = {
    status:
      nextStatus,

    expires_at:
      nextExpiry.toISOString(),

    deletion_scheduled_at:
      null,

    updated_at:
      new Date().toISOString(),
  };

  if (plan !== undefined) {
    if (
      typeof plan !== 'string' ||
      !ALLOWED_PLANS.has(
        plan.trim()
      )
    ) {
      return failure(
        400,
        'Invalid subscription plan.'
      );
    }

    update.plan =
      plan.trim();
  }

  /*
   * Guard against accidental lifecycle races.
   *
   * Only active/expired can enter this operation.
   */
  const {
    data: updatedProfile,
    error: updateError,
  } =
    await supabase
      .from('profiles')
      .update(update)
      .eq(
        'id',
        profile.id
      )
      .in('status', [
        PROFILE_STATES.ACTIVE,
        PROFILE_STATES.EXPIRED,
      ])
      .select(PROFILE_SELECT)
      .maybeSingle();

  if (updateError) {
    console.error(
      'Lifecycle renewal update failed:',
      updateError.message
    );

    return failure(
      500,
      'Unable to renew profile.'
    );
  }

  if (!updatedProfile) {
    return failure(
      409,
      'Profile lifecycle changed before renewal could complete.'
    );
  }

  return {
    success: true,
    status: 200,
    profile:
      updatedProfile,
  };
}