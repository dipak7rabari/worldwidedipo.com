-- ============================================================
-- WORLDWIDE DIPO
-- Supabase Function
-- execute_lifecycle_janitor.sql
--
-- Authoritative subscription lifecycle worker.
--
-- Handles:
--   1. Expired active profiles
--   2. Pending-renewal protection
--   3. Legacy expired profiles with pending renewals
--   4. 30-day deletion grace period
--   5. Permanent deletion after grace period
--   6. Lifecycle audit events
--
-- SECURITY:
--   - No user/profile IDs accepted from caller
--   - No status/date accepted from caller
--   - Service-role / postgres execution only
--   - All lifecycle mutations happen server-side
--   - Never trusts browser state
--
-- IMPORTANT:
--   The application lifecycle cron may call this RPC through
--   the server-only Supabase client.
-- ============================================================

begin;


-- ============================================================
-- 1. AUTHORITATIVE LIFECYCLE JANITOR
-- ============================================================

create or replace function public.execute_lifecycle_janitor()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := now();

  v_grace_period interval := interval '30 days';

  v_batch_size integer := 100;

  v_repaired integer := 0;
  v_expired integer := 0;
  v_expiry_deferred integer := 0;
  v_scheduled integer := 0;
  v_deleted integer := 0;
  v_deletion_deferred integer := 0;

  v_profile record;
  v_payment record;

  v_has_pending_renewal boolean;
  v_deletion_at timestamptz;
begin

  -- ==========================================================
  -- 2. EXECUTION SECURITY
  --
  -- This function performs destructive lifecycle operations.
  -- Browser/authenticated execution is intentionally forbidden.
  --
  -- Supabase service-role requests arrive with JWT role:
  --   service_role
  --
  -- Internal PostgreSQL execution is also allowed.
  -- ==========================================================

  if current_user <> 'postgres'
     and coalesce(
       current_setting(
         'request.jwt.claims',
         true
       )::jsonb ->> 'role',
       ''
     ) <> 'service_role'
  then
    raise exception 'LIFECYCLE_SERVICE_ROLE_REQUIRED'
      using errcode = '42501';
  end if;


  -- ==========================================================
  -- 3. REPAIR LEGACY EXPIRED PROFILES WITH PENDING RENEWAL
  --
  -- A pending renewal must keep the profile eligible for the
  -- existing renewal approval RPC.
  --
  -- The profile remains publicly hidden if expires_at is already
  -- in the past because public projection checks expiration.
  --
  -- Renewal approval can then safely transition:
  --
  --   active + expired timestamp
  --          ↓
  --   active + extended timestamp
  -- ==========================================================

  for v_profile in
    select
      p.id,
      p.slug
    from public.profiles p
    where p.status = 'expired'
      and exists (
        select 1
        from public.payments pay
        where pay.profile_id = p.id
          and pay.payment_type = 'renewal'
          and pay.status = 'pending'
      )
    order by p.updated_at asc
    limit v_batch_size
    for update of p skip locked
  loop

    update public.profiles
    set
      status = 'active',
      deletion_scheduled_at = null,
      updated_at = v_now
    where id = v_profile.id
      and status = 'expired';

    if found then
      v_repaired := v_repaired + 1;

      insert into public.audit_logs (
        actor_user_id,
        action,
        entity_type,
        entity_id,
        metadata
      )
      values (
        null,
        'profile.lifecycle.renewal_pending_repair',
        'profile',
        v_profile.id,
        jsonb_build_object(
          'slug', v_profile.slug,
          'reason', 'pending_renewal_protected'
        )
      );
    end if;

  end loop;


  -- ==========================================================
  -- 4. EXPIRE ACTIVE PROFILES
  --
  -- Only profiles whose subscription has actually ended are
  -- considered.
  --
  -- Pending renewal is respected:
  --
  --   active + expired + pending renewal
  --        => remain active internally
  --
  -- This keeps renewal approval possible.
  -- ==========================================================

  for v_profile in
    select
      p.id,
      p.slug,
      p.expires_at
    from public.profiles p
    where p.status = 'active'
      and p.expires_at is not null
      and p.expires_at <= v_now
    order by p.expires_at asc
    limit v_batch_size
    for update of p skip locked
  loop

    select exists (
      select 1
      from public.payments pay
      where pay.profile_id = v_profile.id
        and pay.payment_type = 'renewal'
        and pay.status = 'pending'
    )
    into v_has_pending_renewal;


    if v_has_pending_renewal then

      v_expiry_deferred :=
        v_expiry_deferred + 1;

    else

      update public.profiles
      set
        status = 'expired',
        deletion_scheduled_at = null,
        updated_at = v_now
      where id = v_profile.id
        and status = 'active'
        and expires_at is not null
        and expires_at <= v_now;

      if found then
        v_expired := v_expired + 1;

        insert into public.audit_logs (
          actor_user_id,
          action,
          entity_type,
          entity_id,
          metadata
        )
        values (
          null,
          'profile.lifecycle.expired',
          'profile',
          v_profile.id,
          jsonb_build_object(
            'slug', v_profile.slug,
            'expires_at', v_profile.expires_at,
            'reason', 'subscription_expired'
          )
        );
      end if;

    end if;

  end loop;


  -- ==========================================================
  -- 5. SCHEDULE LEGACY EXPIRED PROFILES FOR DELETION
  --
  -- Some older records may already be:
  --
  --   status = expired
  --   deletion_scheduled_at = null
  --
  -- They receive the same 30-day grace period.
  --
  -- Pending renewals are never scheduled for deletion.
  -- ==========================================================

  for v_profile in
    select
      p.id,
      p.slug
    from public.profiles p
    where p.status = 'expired'
      and p.deletion_scheduled_at is null
    order by p.updated_at asc
    limit v_batch_size
    for update of p skip locked
  loop

    select exists (
      select 1
      from public.payments pay
      where pay.profile_id = v_profile.id
        and pay.payment_type = 'renewal'
        and pay.status = 'pending'
    )
    into v_has_pending_renewal;


    if v_has_pending_renewal then

      v_expiry_deferred :=
        v_expiry_deferred + 1;

    else

      v_deletion_at :=
        v_now + v_grace_period;


      update public.profiles
      set
        deletion_scheduled_at = v_deletion_at,
        updated_at = v_now
      where id = v_profile.id
        and status = 'expired'
        and deletion_scheduled_at is null;

      if found then
        v_scheduled := v_scheduled + 1;

        insert into public.audit_logs (
          actor_user_id,
          action,
          entity_type,
          entity_id,
          metadata
        )
        values (
          null,
          'profile.lifecycle.grace_scheduled',
          'profile',
          v_profile.id,
          jsonb_build_object(
            'slug', v_profile.slug,
            'deletion_scheduled_at', v_deletion_at,
            'grace_days', 30
          )
        );
      end if;

    end if;

  end loop;


  -- ==========================================================
  -- 6. PERMANENT DELETION
  --
  -- Delete only profiles where:
  --
  --   status = expired
  --   deletion_scheduled_at <= now()
  --
  -- AND no pending renewal exists.
  --
  -- The actual DELETE statement repeats all guards so that a
  -- stale candidate can never accidentally delete a profile
  -- that changed state earlier in the transaction.
  -- ==========================================================

  for v_profile in
    select
      p.id,
      p.slug,
      p.deletion_scheduled_at
    from public.profiles p
    where p.status = 'expired'
      and p.deletion_scheduled_at is not null
      and p.deletion_scheduled_at <= v_now
    order by p.deletion_scheduled_at asc
    limit v_batch_size
    for update of p skip locked
  loop

    select exists (
      select 1
      from public.payments pay
      where pay.profile_id = v_profile.id
        and pay.payment_type = 'renewal'
        and pay.status = 'pending'
    )
    into v_has_pending_renewal;


    if v_has_pending_renewal then

      v_deletion_deferred :=
        v_deletion_deferred + 1;

    else

      -- ------------------------------------------------------
      -- Delete dependent analytics explicitly.
      --
      -- profile_view_events has ON DELETE CASCADE, but explicit
      -- deletion keeps this function safe even if the schema
      -- evolves later.
      -- ------------------------------------------------------

      delete from public.profile_view_events
      where profile_id = v_profile.id;


      -- ------------------------------------------------------
      -- Old analytics table, if present in an earlier schema.
      --
      -- This statement intentionally targets the current table
      -- only. The hardened analytics table above is the
      -- authoritative one in the latest schema.
      -- ------------------------------------------------------


      -- ------------------------------------------------------
      -- Remove the profile.
      --
      -- payments and support_requests use ON DELETE SET NULL.
      -- ------------------------------------------------------

      delete from public.profiles
      where id = v_profile.id
        and status = 'expired'
        and deletion_scheduled_at is not null
        and deletion_scheduled_at <= v_now;

      if found then
        v_deleted := v_deleted + 1;

        insert into public.audit_logs (
          actor_user_id,
          action,
          entity_type,
          entity_id,
          metadata
        )
        values (
          null,
          'profile.lifecycle.deleted',
          'profile',
          v_profile.id,
          jsonb_build_object(
            'slug', v_profile.slug,
            'reason', 'subscription_grace_period_ended',
            'deletion_scheduled_at',
              v_profile.deletion_scheduled_at
          )
        );
      end if;

    end if;

  end loop;


  -- ==========================================================
  -- 7. RETURN SAFE OPERATIONAL SUMMARY
  --
  -- No profile content, user email, payment reference or secret
  -- is returned.
  -- ==========================================================

  return jsonb_build_object(
    'success', true,
    'processed_at', v_now,
    'grace_days', 30,
    'batch_size', v_batch_size,

    'lifecycle', jsonb_build_object(
      'repaired_pending_renewals',
        v_repaired,

      'newly_expired',
        v_expired,

      'expiry_deferred_for_pending_renewal',
        v_expiry_deferred,

      'legacy_grace_scheduled',
        v_scheduled,

      'deleted',
        v_deleted,

      'deletion_deferred_for_pending_renewal',
        v_deletion_deferred
    )
  );

exception
  when others then

    -- ========================================================
    -- 8. FAIL CLOSED
    --
    -- Never expose SQL/internal details to the caller.
    -- The whole transaction rolls back automatically.
    -- ========================================================

    raise exception 'LIFECYCLE_JANITOR_FAILED'
      using
        errcode = 'P0001',
        detail = sqlstate,
        hint = 'Lifecycle processing failed and was rolled back.';

end;
$$;


-- ============================================================
-- 9. EXECUTION PRIVILEGES
--
-- No browser execution.
-- No authenticated-user execution.
-- Only server-side service_role / internal PostgreSQL execution.
-- ============================================================

revoke execute
on function public.execute_lifecycle_janitor()
from public, anon, authenticated;


grant execute
on function public.execute_lifecycle_janitor()
to service_role;


-- ============================================================
-- 10. DOCUMENTATION
-- ============================================================

comment on function public.execute_lifecycle_janitor()
is
'Worldwide DIPO authoritative subscription lifecycle worker. Service-role/internal execution only. Expires ended active profiles, protects pending renewals, repairs legacy expired profiles, schedules a 30-day deletion grace period, permanently removes expired profiles after grace, cleans analytics dependencies, and records lifecycle audit events.';


commit;


-- ============================================================
-- END
-- ============================================================