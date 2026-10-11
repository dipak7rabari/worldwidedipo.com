import {
  PROFILE_STATES,
  LIFECYCLE_CONFIG,
  calculateGraceDeletionDate,
  isDeletionDue,
} from './lifecycle-rules';

/*
 * ============================================================
 * WORLDWIDE DIPO
 * Lifecycle Janitor
 * ============================================================
 *
 * Trusted server-side lifecycle maintenance.
 *
 * Responsibilities:
 * 1. Repair expired profiles with pending renewals.
 * 2. Establish grace period for legacy expired profiles.
 * 3. Delete expired profiles whose grace period ended.
 *
 * This intentionally mirrors the current lifecycle cron
 * behavior, while keeping the business logic reusable.
 *
 * IMPORTANT:
 * - Pass a service-role/admin Supabase client.
 * - Never expose this module directly to browser code.
 * - Never accept profile IDs or lifecycle dates from users.
 * ============================================================
 */

const DEFAULT_BATCH_SIZE = 100;

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

function safeBatchSize(value) {
  const parsed =
    Number(value);

  if (
    !Number.isFinite(parsed)
  ) {
    return DEFAULT_BATCH_SIZE;
  }

  return Math.min(
    Math.max(
      Math.floor(parsed),
      1
    ),
    500
  );
}

async function writeAudit(
  supabase,
  {
    action,
    profileId,
    metadata = {},
  }
) {
  const {
    error,
  } =
    await supabase
      .from('audit_logs')
      .insert({
        actor_user_id:
          null,

        action,

        entity_type:
          'profile',

        entity_id:
          profileId,

        metadata,
      });

  if (error) {
    /*
     * Lifecycle mutation has already happened.
     * Audit failure should not reverse successful lifecycle work.
     */
    console.error(
      'Lifecycle audit insert failed:',
      error.message
    );
  }
}

async function getPendingRenewalProfileIds(
  supabase,
  profileIds
) {
  if (!profileIds.length) {
    return new Set();
  }

  const {
    data,
    error,
  } =
    await supabase
      .from('payments')
      .select('profile_id')
      .in(
        'profile_id',
        profileIds
      )
      .eq(
        'payment_type',
        'renewal'
      )
      .eq(
        'status',
        'pending'
      );

  if (error) {
    throw new Error(
      'PENDING_RENEWAL_LOOKUP_FAILED'
    );
  }

  return new Set(
    (data || [])
      .map(
        (row) =>
          row.profile_id
      )
      .filter(Boolean)
  );
}

async function repairPendingRenewals(
  supabase,
  batchSize
) {
  const {
    data: pendingPayments,
    error: paymentError,
  } =
    await supabase
      .from('payments')
      .select('profile_id')
      .eq(
        'payment_type',
        'renewal'
      )
      .eq(
        'status',
        'pending'
      )
      .not(
        'profile_id',
        'is',
        null
      )
      .limit(batchSize);

  if (paymentError) {
    throw new Error(
      'PENDING_RENEWAL_SCAN_FAILED'
    );
  }

  const profileIds = [
    ...new Set(
      (pendingPayments || [])
        .map(
          (payment) =>
            payment.profile_id
        )
        .filter(Boolean)
    ),
  ];

  if (!profileIds.length) {
    return 0;
  }

  const {
    data: expiredProfiles,
    error: profileError,
  } =
    await supabase
      .from('profiles')
      .select(
        'id, slug'
      )
      .in(
        'id',
        profileIds
      )
      .eq(
        'status',
        PROFILE_STATES.EXPIRED
      )
      .limit(batchSize);

  if (profileError) {
    throw new Error(
      'EXPIRED_RENEWAL_REPAIR_LOOKUP_FAILED'
    );
  }

  if (!expiredProfiles?.length) {
    return 0;
  }

  const repairIds =
    expiredProfiles.map(
      (profile) =>
        profile.id
    );

  const {
    data: repaired,
    error: repairError,
  } =
    await supabase
      .from('profiles')
      .update({
        status:
          PROFILE_STATES.ACTIVE,

        deletion_scheduled_at:
          null,

        updated_at:
          new Date().toISOString(),
      })
      .in(
        'id',
        repairIds
      )
      .eq(
        'status',
        PROFILE_STATES.EXPIRED
      )
      .select(
        'id, slug'
      );

  if (repairError) {
    throw new Error(
      'PENDING_RENEWAL_REPAIR_FAILED'
    );
  }

  for (const profile of repaired || []) {
    await writeAudit(
      supabase,
      {
        action:
          'profile.lifecycle.renewal_pending_repair',

        profileId:
          profile.id,

        metadata: {
          slug:
            profile.slug,
        },
      }
    );
  }

  return (
    repaired?.length || 0
  );
}

async function scheduleLegacyGrace(
  supabase,
  batchSize,
  now
) {
  const {
    data: candidates,
    error,
  } =
    await supabase
      .from('profiles')
      .select(
        'id, slug'
      )
      .eq(
        'status',
        PROFILE_STATES.EXPIRED
      )
      .is(
        'deletion_scheduled_at',
        null
      )
      .limit(batchSize);

  if (error) {
    throw new Error(
      'LEGACY_GRACE_LOOKUP_FAILED'
    );
  }

  if (!candidates?.length) {
    return 0;
  }

  const pendingRenewals =
    await getPendingRenewalProfileIds(
      supabase,
      candidates.map(
        (profile) =>
          profile.id
      )
    );

  const eligible =
    candidates.filter(
      (profile) =>
        !pendingRenewals.has(
          profile.id
        )
    );

  if (!eligible.length) {
    return 0;
  }

  const deletionDate =
    calculateGraceDeletionDate(
      now
    ).toISOString();

  const {
    data: scheduled,
    error: scheduleError,
  } =
    await supabase
      .from('profiles')
      .update({
        deletion_scheduled_at:
          deletionDate,

        updated_at:
          new Date().toISOString(),
      })
      .in(
        'id',
        eligible.map(
          (profile) =>
            profile.id
        )
      )
      .eq(
        'status',
        PROFILE_STATES.EXPIRED
      )
      .is(
        'deletion_scheduled_at',
        null
      )
      .select(
        'id, slug'
      );

  if (scheduleError) {
    throw new Error(
      'LEGACY_GRACE_SCHEDULE_FAILED'
    );
  }

  for (const profile of scheduled || []) {
    await writeAudit(
      supabase,
      {
        action:
          'profile.lifecycle.grace_scheduled',

        profileId:
          profile.id,

        metadata: {
          slug:
            profile.slug,

          deletion_scheduled_at:
            deletionDate,

          grace_days:
            LIFECYCLE_CONFIG.GRACE_DAYS,
        },
      }
    );
  }

  return (
    scheduled?.length || 0
  );
}

async function deleteDueProfiles(
  supabase,
  batchSize,
  now
) {
  const nowIso =
    now.toISOString();

  const {
    data: candidates,
    error,
  } =
    await supabase
      .from('profiles')
      .select(
        'id, slug, deletion_scheduled_at'
      )
      .eq(
        'status',
        PROFILE_STATES.EXPIRED
      )
      .not(
        'deletion_scheduled_at',
        'is',
        null
      )
      .lte(
        'deletion_scheduled_at',
        nowIso
      )
      .order(
        'deletion_scheduled_at',
        {
          ascending: true,
        }
      )
      .limit(batchSize);

  if (error) {
    throw new Error(
      'DELETION_CANDIDATE_LOOKUP_FAILED'
    );
  }

  if (!candidates?.length) {
    return {
      deleted: 0,
      deferred: 0,
    };
  }

  const pendingRenewals =
    await getPendingRenewalProfileIds(
      supabase,
      candidates.map(
        (profile) =>
          profile.id
      )
    );

  let deleted = 0;
  let deferred = 0;

  for (const profile of candidates) {
    if (
      pendingRenewals.has(
        profile.id
      )
    ) {
      deferred += 1;
      continue;
    }

    if (
      !isDeletionDue(
        profile,
        now
      )
    ) {
      continue;
    }

    /*
     * Re-check the lifecycle conditions directly inside DELETE.
     *
     * This protects against stale candidate data.
     */
    const {
      data: deletedRows,
      error: deleteError,
    } =
      await supabase
        .from('profiles')
        .delete()
        .eq(
          'id',
          profile.id
        )
        .eq(
          'status',
          PROFILE_STATES.EXPIRED
        )
        .lte(
          'deletion_scheduled_at',
          nowIso
        )
        .select(
          'id, slug'
        );

    if (deleteError) {
      console.error(
        'Lifecycle profile deletion failed:',
        {
          profileId:
            profile.id,
          message:
            deleteError.message,
        }
      );

      deferred += 1;
      continue;
    }

    if (deletedRows?.length) {
      deleted += 1;

      await writeAudit(
        supabase,
        {
          action:
            'profile.lifecycle.deleted',

          profileId:
            profile.id,

          metadata: {
            slug:
              profile.slug,

            reason:
              'subscription_grace_period_ended',
          },
        }
      );
    }
  }

  return {
    deleted,
    deferred,
  };
}

/*
 * ============================================================
 * PUBLIC JANITOR
 * ============================================================
 */

export async function runLifecycleJanitor(
  supabase,
  {
    now = new Date(),
    batchSize = DEFAULT_BATCH_SIZE,
  } = {}
) {
  if (!supabase) {
    return {
      success: false,
      status: 500,
      error:
        'Lifecycle database client is required.',
    };
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
    return {
      success: false,
      status: 400,
      error:
        'Invalid lifecycle date.',
    };
  }

  const limit =
    safeBatchSize(batchSize);

  try {
    /*
     * 1. Repair legacy expired profiles that have a legitimate
     * pending renewal.
     */
    const repairedPendingRenewals =
      await repairPendingRenewals(
        supabase,
        limit
      );

    /*
     * 2. Give legacy expired profiles their grace schedule.
     */
    const legacyGraceScheduled =
      await scheduleLegacyGrace(
        supabase,
        limit,
        currentDate
      );

    /*
     * 3. Permanently delete profiles whose grace period ended.
     */
    const deletion =
      await deleteDueProfiles(
        supabase,
        limit,
        currentDate
      );

    return {
      success: true,
      status: 200,

      lifecycle: {
        repaired_pending_renewals:
          repairedPendingRenewals,

        legacy_grace_scheduled:
          legacyGraceScheduled,

        deleted:
          deletion.deleted,

        deletion_deferred_for_pending_renewal:
          deletion.deferred,

        grace_days:
          LIFECYCLE_CONFIG.GRACE_DAYS,

        processed_at:
          new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error(
      'Worldwide DIPO lifecycle janitor failed:',
      error
    );

    return {
      success: false,
      status: 500,
      error:
        'Lifecycle maintenance failed.',
    };
  }
}

export async function scheduleExpiredProfileGrace(
  supabase,
  {
    profileId,
    now = new Date(),
  } = {}
) {
  if (!supabase) {
    return {
      success: false,
      status: 500,
      error:
        'Lifecycle database client is required.',
    };
  }

  if (
    typeof profileId !== 'string' ||
    !profileId.trim()
  ) {
    return {
      success: false,
      status: 400,
      error:
        'A valid profile id is required.',
    };
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
    return {
      success: false,
      status: 400,
      error:
        'Invalid lifecycle date.',
    };
  }

  const {
    data: profile,
    error: lookupError,
  } =
    await supabase
      .from('profiles')
      .select(
        'id, slug, status, deletion_scheduled_at'
      )
      .eq(
        'id',
        profileId
      )
      .maybeSingle();

  if (lookupError) {
    console.error(
      'Grace schedule lookup failed:',
      lookupError.message
    );

    return {
      success: false,
      status: 500,
      error:
        'Unable to load profile.',
    };
  }

  if (!profile) {
    return {
      success: false,
      status: 404,
      error:
        'Profile not found.',
    };
  }

  if (
    profile.status !==
    PROFILE_STATES.EXPIRED
  ) {
    return {
      success: false,
      status: 409,
      error:
        'Only expired profiles can receive a deletion grace schedule.',
    };
  }

  if (profile.deletion_scheduled_at) {
    return {
      success: true,
      status: 200,
      alreadyScheduled: true,
      deletion_scheduled_at:
        profile.deletion_scheduled_at,
    };
  }

  const deletionDate =
    calculateGraceDeletionDate(
      currentDate
    ).toISOString();

  const {
    data: updated,
    error: updateError,
  } =
    await supabase
      .from('profiles')
      .update({
        deletion_scheduled_at:
          deletionDate,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        'id',
        profile.id
      )
      .eq(
        'status',
        PROFILE_STATES.EXPIRED
      )
      .is(
        'deletion_scheduled_at',
        null
      )
      .select(
        'id, slug, deletion_scheduled_at'
      )
      .maybeSingle();

  if (updateError) {
    console.error(
      'Grace schedule update failed:',
      updateError.message
    );

    return {
      success: false,
      status: 500,
      error:
        'Unable to schedule profile deletion.',
    };
  }

  if (!updated) {
    return {
      success: false,
      status: 409,
      error:
        'Profile lifecycle changed before grace period could be scheduled.',
    };
  }

  await writeAudit(
    supabase,
    {
      action:
        'profile.lifecycle.grace_scheduled',

      profileId:
        updated.id,

      metadata: {
        slug:
          updated.slug,

        deletion_scheduled_at:
          updated.deletion_scheduled_at,

        grace_days:
          LIFECYCLE_CONFIG.GRACE_DAYS,
      },
    }
  );

  return {
    success: true,
    status: 200,
    alreadyScheduled: false,
    profile:
      updated,
  };
}