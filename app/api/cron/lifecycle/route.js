import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

import { getServerEnv } from "@/lib/security/env";

import {
  applyApiSecurityHeaders,
  applyNoStore,
} from "@/lib/security/security-headers";

import {
  checkRateLimit,
  getRequestRateLimitKey,
} from "@/lib/security/rate-limit";

/*
 * ============================================================
 * WORLDWIDE DIPO
 * Profile Lifecycle Cron
 * ============================================================
 *
 * Responsibilities:
 *
 * 1. Authenticate automated lifecycle requests.
 * 2. Protect CRON_SECRET with constant-time comparison.
 * 3. Rate-limit lifecycle execution.
 * 4. Repair legacy expired profiles with pending renewals.
 * 5. Expire active profiles whose subscription has ended.
 * 6. Respect pending renewal payments.
 * 7. Schedule the existing grace period.
 * 8. Permanently delete profiles after the grace period.
 * 9. Write lifecycle audit events.
 * 10. Never expose service/database errors to callers.
 *
 * IMPORTANT:
 * - No user_id/profile_id/status is accepted from the request.
 * - No lifecycle decision is controlled by request input.
 * - No browser Supabase credentials are used.
 * - The server-only admin client is used for lifecycle mutations.
 * - Existing database schema and lifecycle architecture are preserved.
 * ============================================================
 */

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export const revalidate = 0;


/*
 * ============================================================
 * CONFIGURATION
 * ============================================================
 */

const BATCH_SIZE = 100;

const GRACE_DAYS = 30;

const DAY_MS =
  24 *
  60 *
  60 *
  1000;

const GRACE_PERIOD_MS =
  GRACE_DAYS *
  DAY_MS;


/*
 * ============================================================
 * SAFE RESPONSE
 * ============================================================
 */

function json(body, options = {}) {
  const response =
    NextResponse.json(
      body,
      options,
    );

  applyApiSecurityHeaders(
    response,
  );

  applyNoStore(
    response,
  );

  return response;
}


/*
 * ============================================================
 * CRON SECRET EXTRACTION
 * ============================================================
 *
 * Supported:
 *
 * Authorization: Bearer <CRON_SECRET>
 *
 * x-cron-secret: <CRON_SECRET>
 *
 * Secrets in query parameters are intentionally unsupported.
 * ============================================================
 */

function getCronSecret(request) {
  const authorization =
    request.headers.get(
      "authorization",
    );

  if (authorization) {
    const match =
      /^Bearer\s+(.+)$/i.exec(
        authorization.trim(),
      );

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  const headerSecret =
    request.headers.get(
      "x-cron-secret",
    );

  return (
    headerSecret?.trim() ||
    ""
  );
}


/*
 * ============================================================
 * CONSTANT-TIME SECRET COMPARISON
 * ============================================================
 */

function secretsMatch(
  provided,
  expected,
) {
  if (
    typeof provided !== "string" ||
    typeof expected !== "string" ||
    !provided ||
    !expected
  ) {
    return false;
  }

  const providedBuffer =
    Buffer.from(
      provided,
      "utf8",
    );

  const expectedBuffer =
    Buffer.from(
      expected,
      "utf8",
    );

  if (
    providedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    providedBuffer,
    expectedBuffer,
  );
}


/*
 * ============================================================
 * CRON SECRET VALIDATION
 * ============================================================
 */

function isValidCronSecret(secret) {
  return (
    typeof secret === "string" &&
    secret.length >= 32 &&
    secret.length <= 512
  );
}


/*
 * ============================================================
 * AUDIT LOGGER
 * ============================================================
 *
 * Audit failure is intentionally non-fatal.
 * The lifecycle mutation itself remains authoritative.
 * ============================================================
 */

async function writeAudit(
  supabase,
  {
    action,
    profileId,
    metadata = {},
  },
) {
  const {
    error,
  } =
    await supabase
      .from("audit_logs")
      .insert({
        actor_user_id:
          null,

        action,

        entity_type:
          "profile",

        entity_id:
          profileId,

        metadata,
      });

  if (error) {
    console.error(
      "Lifecycle audit insert failed:",
      error.message,
    );
  }
}


/*
 * ============================================================
 * FIND PENDING RENEWALS
 * ============================================================
 */

async function getPendingRenewalProfileIds(
  supabase,
  profileIds,
) {
  if (
    !Array.isArray(profileIds) ||
    profileIds.length === 0
  ) {
    return new Set();
  }

  const {
    data,
    error,
  } =
    await supabase
      .from("payments")
      .select("profile_id")
      .in(
        "profile_id",
        profileIds,
      )
      .eq(
        "payment_type",
        "renewal",
      )
      .eq(
        "status",
        "pending",
      );

  if (error) {
    throw new Error(
      `Pending renewal lookup failed: ${error.message}`,
    );
  }

  return new Set(
    (data || [])
      .map(
        (row) =>
          row.profile_id,
      )
      .filter(Boolean),
  );
}


/*
 * ============================================================
 * REPAIR EXPIRED PROFILES WITH PENDING RENEWALS
 * ============================================================
 */

async function repairExpiredProfilesWithPendingRenewal(
  supabase,
) {
  const {
    data: pendingPayments,
    error: paymentError,
  } =
    await supabase
      .from("payments")
      .select("profile_id")
      .eq(
        "payment_type",
        "renewal",
      )
      .eq(
        "status",
        "pending",
      )
      .not(
        "profile_id",
        "is",
        null,
      )
      .limit(
        BATCH_SIZE,
      );

  if (paymentError) {
    throw new Error(
      `Pending renewal scan failed: ${paymentError.message}`,
    );
  }

  const pendingProfileIds =
    [
      ...new Set(
        (pendingPayments || [])
          .map(
            (payment) =>
              payment.profile_id,
          )
          .filter(Boolean),
      ),
    ];

  if (
    pendingProfileIds.length === 0
  ) {
    return 0;
  }

  const {
    data: expiredProfiles,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select("id, slug")
      .in(
        "id",
        pendingProfileIds,
      )
      .eq(
        "status",
        "expired",
      )
      .limit(
        BATCH_SIZE,
      );

  if (profileError) {
    throw new Error(
      `Expired renewal-repair lookup failed: ${profileError.message}`,
    );
  }

  if (
    !expiredProfiles?.length
  ) {
    return 0;
  }

  const repairIds =
    expiredProfiles.map(
      (profile) =>
        profile.id,
    );

  const {
    data: repaired,
    error: updateError,
  } =
    await supabase
      .from("profiles")
      .update({
        status:
          "active",

        deletion_scheduled_at:
          null,

        updated_at:
          new Date().toISOString(),
      })
      .in(
        "id",
        repairIds,
      )
      .eq(
        "status",
        "expired",
      )
      .select(
        "id, slug",
      );

  if (updateError) {
    throw new Error(
      `Pending-renewal repair failed: ${updateError.message}`,
    );
  }

  for (
    const profile of
      repaired || []
  ) {
    await writeAudit(
      supabase,
      {
        action:
          "profile.lifecycle.renewal_pending_repair",

        profileId:
          profile.id,

        metadata: {
          slug:
            profile.slug,
        },
      },
    );
  }

  return (
    repaired?.length ||
    0
  );
}


/*
 * ============================================================
 * EXPIRE ACTIVE PROFILES
 * ============================================================
 */

async function expireActiveProfiles(
  supabase,
  nowIso,
) {
  const {
    data: candidates,
    error,
  } =
    await supabase
      .from("profiles")
      .select(
        "id, slug, expires_at",
      )
      .eq(
        "status",
        "active",
      )
      .not(
        "expires_at",
        "is",
        null,
      )
      .lte(
        "expires_at",
        nowIso,
      )
      .order(
        "expires_at",
        {
          ascending: true,
        },
      )
      .limit(
        BATCH_SIZE,
      );

  if (error) {
    throw new Error(
      `Expired-profile lookup failed: ${error.message}`,
    );
  }

  if (
    !candidates?.length
  ) {
    return {
      expired: 0,
      deferred: 0,
    };
  }

  const profileIds =
    candidates.map(
      (profile) =>
        profile.id,
    );

  const pendingRenewals =
    await getPendingRenewalProfileIds(
      supabase,
      profileIds,
    );

  const eligible =
    candidates.filter(
      (profile) =>
        !pendingRenewals.has(
          profile.id,
        ),
    );

  if (
    eligible.length === 0
  ) {
    return {
      expired: 0,
      deferred:
        candidates.length,
    };
  }

  const deletionScheduledAt =
    new Date(
      Date.now() +
        GRACE_PERIOD_MS,
    ).toISOString();

  const eligibleIds =
    eligible.map(
      (profile) =>
        profile.id,
    );

  const {
    data: updatedProfiles,
    error: updateError,
  } =
    await supabase
      .from("profiles")
      .update({
        status:
          "expired",

        deletion_scheduled_at:
          deletionScheduledAt,

        updated_at:
          new Date().toISOString(),
      })
      .in(
        "id",
        eligibleIds,
      )
      .eq(
        "status",
        "active",
      )
      .lte(
        "expires_at",
        nowIso,
      )
      .select(
        "id, slug",
      );

  if (updateError) {
    throw new Error(
      `Profile expiry update failed: ${updateError.message}`,
    );
  }

  for (
    const profile of
      updatedProfiles || []
  ) {
    await writeAudit(
      supabase,
      {
        action:
          "profile.lifecycle.expired",

        profileId:
          profile.id,

        metadata: {
          slug:
            profile.slug,

          deletion_scheduled_at:
            deletionScheduledAt,

          grace_days:
            GRACE_DAYS,
        },
      },
    );
  }

  const updatedCount =
    updatedProfiles?.length ||
    0;

  return {
    expired:
      updatedCount,

    deferred:
      candidates.length -
      updatedCount,
  };
}


/*
 * ============================================================
 * LEGACY EXPIRED PROFILE GRACE SCHEDULING
 * ============================================================
 */

async function scheduleLegacyExpiredProfiles(
  supabase,
) {
  const {
    data: candidates,
    error,
  } =
    await supabase
      .from("profiles")
      .select("id, slug")
      .eq(
        "status",
        "expired",
      )
      .is(
        "deletion_scheduled_at",
        null,
      )
      .limit(
        BATCH_SIZE,
      );

  if (error) {
    throw new Error(
      `Legacy expired-profile lookup failed: ${error.message}`,
    );
  }

  if (
    !candidates?.length
  ) {
    return 0;
  }

  const candidateIds =
    candidates.map(
      (profile) =>
        profile.id,
    );

  const pendingRenewals =
    await getPendingRenewalProfileIds(
      supabase,
      candidateIds,
    );

  const eligible =
    candidates.filter(
      (profile) =>
        !pendingRenewals.has(
          profile.id,
        ),
    );

  if (
    eligible.length === 0
  ) {
    return 0;
  }

  const deletionScheduledAt =
    new Date(
      Date.now() +
        GRACE_PERIOD_MS,
    ).toISOString();

  const {
    data: scheduled,
    error: updateError,
  } =
    await supabase
      .from("profiles")
      .update({
        deletion_scheduled_at:
          deletionScheduledAt,

        updated_at:
          new Date().toISOString(),
      })
      .in(
        "id",
        eligible.map(
          (profile) =>
            profile.id,
        ),
      )
      .eq(
        "status",
        "expired",
      )
      .is(
        "deletion_scheduled_at",
        null,
      )
      .select(
        "id, slug",
      );

  if (updateError) {
    throw new Error(
      `Legacy grace scheduling failed: ${updateError.message}`,
    );
  }

  for (
    const profile of
      scheduled || []
  ) {
    await writeAudit(
      supabase,
      {
        action:
          "profile.lifecycle.grace_scheduled",

        profileId:
          profile.id,

        metadata: {
          slug:
            profile.slug,

          deletion_scheduled_at:
            deletionScheduledAt,

          grace_days:
            GRACE_DAYS,
        },
      },
    );
  }

  return (
    scheduled?.length ||
    0
  );
}


/*
 * ============================================================
 * DELETE EXPIRED PROFILES
 * ============================================================
 *
 * IMPORTANT HARDENING:
 *
 * Pending renewal status is checked again immediately before
 * deletion. This reduces the race window where a renewal could
 * become pending after the initial candidate scan.
 * ============================================================
 */

async function deleteExpiredProfiles(
  supabase,
  nowIso,
) {
  const {
    data: candidates,
    error,
  } =
    await supabase
      .from("profiles")
      .select(
        "id, slug, deletion_scheduled_at",
      )
      .eq(
        "status",
        "expired",
      )
      .not(
        "deletion_scheduled_at",
        "is",
        null,
      )
      .lte(
        "deletion_scheduled_at",
        nowIso,
      )
      .order(
        "deletion_scheduled_at",
        {
          ascending: true,
        },
      )
      .limit(
        BATCH_SIZE,
      );

  if (error) {
    throw new Error(
      `Deletion candidate lookup failed: ${error.message}`,
    );
  }

  if (
    !candidates?.length
  ) {
    return {
      deleted: 0,
      deferred: 0,
    };
  }

  let deleted = 0;

  let deferred = 0;

  for (
    const profile of
      candidates
  ) {
    /*
     * --------------------------------------------------------
     * Fresh pending-renewal check
     * --------------------------------------------------------
     */

    const {
      data: pendingRenewals,
      error: renewalError,
    } =
      await supabase
        .from("payments")
        .select("id")
        .eq(
          "profile_id",
          profile.id,
        )
        .eq(
          "payment_type",
          "renewal",
        )
        .eq(
          "status",
          "pending",
        )
        .limit(1);

    if (renewalError) {
      console.error(
        "Lifecycle pending-renewal recheck failed:",
        {
          profileId:
            profile.id,

          message:
            renewalError.message,
        },
      );

      deferred += 1;

      continue;
    }

    if (
      pendingRenewals?.length
    ) {
      deferred += 1;

      continue;
    }

    /*
     * --------------------------------------------------------
     * Guarded deletion
     * --------------------------------------------------------
     *
     * The WHERE conditions are repeated in the DELETE query
     * so a stale candidate cannot delete a profile that has
     * changed state.
     */

    const {
      data: deletedRows,
      error: deleteError,
    } =
      await supabase
        .from("profiles")
        .delete()
        .eq(
          "id",
          profile.id,
        )
        .eq(
          "status",
          "expired",
        )
        .lte(
          "deletion_scheduled_at",
          nowIso,
        )
        .select(
          "id, slug",
        );

    if (deleteError) {
      console.error(
        "Profile lifecycle deletion failed:",
        {
          profileId:
            profile.id,

          message:
            deleteError.message,
        },
      );

      deferred += 1;

      continue;
    }

    if (
      deletedRows?.length
    ) {
      deleted += 1;

      await writeAudit(
        supabase,
        {
          action:
            "profile.lifecycle.deleted",

          profileId:
            profile.id,

          metadata: {
            slug:
              profile.slug,

            reason:
              "subscription_grace_period_ended",
          },
        },
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
 * MAIN LIFECYCLE EXECUTION
 * ============================================================
 */

async function runLifecycle() {
  const supabase =
    createAdminClient();

  const startedAt =
    Date.now();

  const nowIso =
    new Date().toISOString();

  /*
   * Step A:
   *
   * Repair legitimate pending renewals that are stuck in an
   * older expired state.
   */

  const repairedPendingRenewals =
    await repairExpiredProfilesWithPendingRenewal(
      supabase,
    );

  /*
   * Step B:
   *
   * Expire subscriptions that have actually ended.
   */

  const expiredResult =
    await expireActiveProfiles(
      supabase,
      nowIso,
    );

  /*
   * Step C:
   *
   * Give legacy expired records their normal grace period.
   */

  const scheduledLegacy =
    await scheduleLegacyExpiredProfiles(
      supabase,
    );

  /*
   * Step D:
   *
   * Permanently remove profiles whose grace period ended.
   */

  const deletedResult =
    await deleteExpiredProfiles(
      supabase,
      nowIso,
    );

  return {
    processed_at:
      new Date().toISOString(),

    duration_ms:
      Date.now() -
      startedAt,

    lifecycle: {
      grace_days:
        GRACE_DAYS,

      repaired_pending_renewals:
        repairedPendingRenewals,

      newly_expired:
        expiredResult.expired,

      expiry_deferred_for_pending_renewal:
        expiredResult.deferred,

      legacy_grace_scheduled:
        scheduledLegacy,

      deleted:
        deletedResult.deleted,

      deletion_deferred_for_pending_renewal:
        deletedResult.deferred,
    },
  };
}


/*
 * ============================================================
 * AUTHENTICATED CRON HANDLER
 * ============================================================
 */

async function handleCron(request) {
  /*
   * ----------------------------------------------------------
   * 1. RATE LIMIT
   * ----------------------------------------------------------
   */

  const rateLimit =
    checkRateLimit(
      getRequestRateLimitKey(
        request,
        "cron-lifecycle",
      ),
      {
        maxRequests: 10,

        windowMs:
          60 * 1000,
      },
    );

  if (
    !rateLimit.allowed
  ) {
    const response =
      json(
        {
          error:
            "Too many requests.",
        },
        {
          status: 429,
        },
      );

    if (
      Number.isFinite(
        rateLimit.retryAfter,
      )
    ) {
      response.headers.set(
        "Retry-After",
        String(
          rateLimit.retryAfter,
        ),
      );
    }

    return response;
  }

  /*
   * ----------------------------------------------------------
   * 2. SERVER CRON SECRET
   * ----------------------------------------------------------
   */

  let expectedSecret = "";

  try {
    expectedSecret =
      getServerEnv(
        "CRON_SECRET",
      );
  } catch {
    return json(
      {
        error:
          "Lifecycle service is not configured.",
      },
      {
        status: 503,
      },
    );
  }

  /*
   * ----------------------------------------------------------
   * 3. SECRET QUALITY CHECK
   * ----------------------------------------------------------
   */

  if (
    !isValidCronSecret(
      expectedSecret,
    )
  ) {
    console.error(
      "Lifecycle cron rejected because CRON_SECRET is missing or invalid.",
    );

    return json(
      {
        error:
          "Lifecycle service is not configured.",
      },
      {
        status: 503,
      },
    );
  }

  /*
   * ----------------------------------------------------------
   * 4. AUTHENTICATE
   * ----------------------------------------------------------
   */

  const presentedSecret =
    getCronSecret(
      request,
    );

  if (
    !secretsMatch(
      presentedSecret,
      expectedSecret,
    )
  ) {
    return json(
      {
        error:
          "Unauthorized.",
      },
      {
        status: 401,
      },
    );
  }

  /*
   * ----------------------------------------------------------
   * 5. EXECUTE
   * ----------------------------------------------------------
   */

  try {
    const result =
      await runLifecycle();

    return json(
      {
        success: true,

        ...result,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    /*
     * Never expose database/service-role details.
     */

    console.error(
      "Worldwide DIPO lifecycle cron failed:",
      error,
    );

    return json(
      {
        error:
          "Lifecycle processing failed.",
      },
      {
        status: 500,
      },
    );
  }
}


/*
 * ============================================================
 * HTTP METHODS
 * ============================================================
 *
 * GET:
 *   Native Vercel Cron compatible.
 *
 * POST:
 *   Preserved for existing operational tooling.
 *
 * Neither method accepts lifecycle input.
 * ============================================================
 */

export async function GET(request) {
  return handleCron(request);
}

export async function POST(request) {
  return handleCron(request);
}