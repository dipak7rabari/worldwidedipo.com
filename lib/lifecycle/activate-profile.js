import {
  PROFILE_STATES,
  calculateSubscriptionExpiry,
  assertLifecycleProfile,
  canActivateProfile,
} from './lifecycle-rules';

/*
 * ============================================================
 * WORLDWIDE DIPO
 * Activate Profile
 * ============================================================
 *
 * Trusted server-side lifecycle operation.
 *
 * This module does NOT approve payments.
 * Payment approval remains authoritative in the existing
 * database payment RPC.
 *
 * Use this when a trusted backend operation has already
 * established that a profile may become active.
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

function result(
  success,
  status,
  extra = {}
) {
  return {
    success,
    status,
    ...extra,
  };
}

export async function activateProfile(
  supabase,
  {
    profileId,
    expiresAt,
    plan,
    baseDate = new Date(),
    clearDeletionSchedule = true,
  } = {}
) {
  if (!supabase) {
    return result(
      false,
      500,
      {
        errors: {
          form:
            'Lifecycle database client is required.',
        },
      }
    );
  }

  if (
    typeof profileId !== 'string' ||
    !profileId.trim()
  ) {
    return result(
      false,
      400,
      {
        errors: {
          profileId:
            'A valid profile id is required.',
        },
      }
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
      'Lifecycle activation lookup failed:',
      lookupError.message
    );

    return result(
      false,
      500,
      {
        errors: {
          form:
            'Unable to load profile.',
        },
      }
    );
  }

  if (!profile) {
    return result(
      false,
      404,
      {
        errors: {
          form:
            'Profile not found.',
        },
      }
    );
  }

  assertLifecycleProfile(profile);

  if (!canActivateProfile(profile)) {
    return result(
      false,
      409,
      {
        errors: {
          form:
            'Profile cannot be activated from its current lifecycle state.',
        },
      }
    );
  }

  let resolvedExpiry = null;

  if (expiresAt !== undefined) {
    if (expiresAt === null) {
      return result(
        false,
        400,
        {
          errors: {
            expiresAt:
              'An activation expiry date is required.',
          },
        }
      );
    }

    const parsed =
      new Date(expiresAt);

    if (
      !Number.isFinite(
        parsed.getTime()
      )
    ) {
      return result(
        false,
        400,
        {
          errors: {
            expiresAt:
              'Invalid expiry date.',
          },
        }
      );
    }

    resolvedExpiry = parsed;
  } else {
    resolvedExpiry =
      calculateSubscriptionExpiry(
        baseDate
      );
  }

  if (
    resolvedExpiry.getTime() <=
    Date.now()
  ) {
    return result(
      false,
      400,
      {
        errors: {
          expiresAt:
            'Activation expiry must be in the future.',
        },
      }
    );
  }

  const update = {
    status:
      PROFILE_STATES.ACTIVE,

    expires_at:
      resolvedExpiry.toISOString(),

    updated_at:
      new Date().toISOString(),
  };

  if (clearDeletionSchedule) {
    update.deletion_scheduled_at = null;
  }

  if (
    typeof plan === 'string' &&
    plan.trim()
  ) {
    update.plan =
      plan.trim();
  }

  const {
    data: updatedProfile,
    error: updateError,
  } =
    await supabase
      .from('profiles')
      .update(update)
      .eq('id', profile.id)
      .in('status', [
        PROFILE_STATES.PENDING,
        PROFILE_STATES.EXPIRED,
      ])
      .select(PROFILE_SELECT)
      .maybeSingle();

  if (updateError) {
    console.error(
      'Lifecycle activation failed:',
      updateError.message
    );

    return result(
      false,
      500,
      {
        errors: {
          form:
            'Unable to activate profile.',
        },
      }
    );
  }

  /*
   * The guarded UPDATE can return no row if another trusted
   * lifecycle operation changed the profile between lookup
   * and mutation.
   */
  if (!updatedProfile) {
    return result(
      false,
      409,
      {
        errors: {
          form:
            'Profile lifecycle changed before activation could complete.',
        },
      }
    );
  }

  return result(
    true,
    200,
    {
      profile:
        updatedProfile,
    }
  );
}