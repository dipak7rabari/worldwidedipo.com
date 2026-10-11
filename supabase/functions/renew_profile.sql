-- ============================================================
-- WORLDWIDE DIPO
-- Supabase Function
-- renew_profile.sql
--
-- Purpose:
--   Internal, server-authoritative profile renewal primitive.
--
-- IMPORTANT:
--   Normal users MUST NOT be able to call this directly.
--   Payment verification remains the source of truth.
--
-- Intended lifecycle:
--
--   verified renewal
--          ↓
--   internal renewal operation
--          ↓
--   +6 months
--
-- Security:
--   - service_role / postgres only
--   - profile row locked FOR UPDATE
--   - plan allowlisted
--   - no client-controlled expiry
--   - no owner reassignment
--   - no arbitrary status mutation
--   - deletion grace cancelled on successful renewal
--   - audit event recorded
--   - SECURITY DEFINER
--   - locked search_path
-- ============================================================

begin;


create or replace function public.renew_profile(
  p_profile_id uuid,
  p_plan text
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile public.profiles;
  v_base_date timestamptz;
  v_new_expiry timestamptz;
  v_actor uuid;
begin

  -- ==========================================================
  -- 1. REQUIRED INPUT
  -- ==========================================================

  if p_profile_id is null then
    raise exception 'PROFILE_REQUIRED'
      using errcode = '22023';
  end if;


  -- ==========================================================
  -- 2. SERVICE-ONLY AUTHORIZATION
  --
  -- current_user is checked instead of trusting JWT claims.
  --
  -- This prevents:
  --   anon       → blocked
  --   authenticated → blocked
  --   arbitrary JWT role → blocked
  --
  -- Only the trusted backend execution role may invoke this
  -- primitive.
  -- ==========================================================

  if current_user not in ('postgres', 'service_role') then
    raise exception 'SERVICE_ROLE_REQUIRED'
      using errcode = '42501';
  end if;


  -- ==========================================================
  -- 3. PLAN VALIDATION
  -- ==========================================================

  if p_plan not in (
    'Starter',
    'Pro',
    'Elite'
  ) then
    raise exception 'INVALID_PLAN'
      using errcode = '22023';
  end if;


  -- ==========================================================
  -- 4. LOCK PROFILE
  --
  -- Prevent concurrent lifecycle operations from calculating
  -- expiry from stale profile state.
  -- ==========================================================

  select *
  into v_profile
  from public.profiles
  where id = p_profile_id
  for update;


  if not found then
    raise exception 'PROFILE_NOT_FOUND'
      using errcode = 'P0002';
  end if;


  -- ==========================================================
  -- 5. VALID PROFILE STATE
  --
  -- Renewal is only meaningful for:
  --
  --   active
  --   expired
  --
  -- Draft/pending profiles belong to the initial-payment flow.
  -- ==========================================================

  if v_profile.status not in (
    'active',
    'expired'
  ) then
    raise exception 'PROFILE_NOT_ELIGIBLE_FOR_RENEWAL'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 6. DELETION-GRACE PROTECTION
  --
  -- An expired profile may be renewed only while it is still
  -- inside the retention/grace window.
  --
  -- A profile whose deletion deadline has already passed must
  -- not be resurrected.
  -- ==========================================================

  if v_profile.status = 'expired'
     and v_profile.deletion_scheduled_at is not null
     and v_profile.deletion_scheduled_at <= now()
  then
    raise exception 'PROFILE_DELETION_WINDOW_EXPIRED'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 7. CALCULATE NEW EXPIRY
  --
  -- Never trust a client-provided date.
  --
  -- If the existing subscription is still valid:
  --
  --   existing expiry + 6 months
  --
  -- If already expired:
  --
  --   now + 6 months
  --
  -- This prevents lost subscription time for valid renewals.
  -- ==========================================================

  v_base_date :=
    greatest(
      now(),
      coalesce(
        v_profile.expires_at,
        now()
      )
    );


  v_new_expiry :=
    v_base_date + interval '6 months';


  -- ==========================================================
  -- 8. DETERMINE AUDIT ACTOR
  --
  -- Service execution may not have auth.uid().
  -- Keep actor nullable for trusted backend automation.
  -- ==========================================================

  v_actor := auth.uid();


  -- ==========================================================
  -- 9. APPLY RENEWAL
  --
  -- State-machine-compatible transition:
  --
  --   active  → active
  --   expired → active
  --
  -- Ownership remains untouched.
  -- ==========================================================

  update public.profiles
  set
    plan = p_plan,
    status = 'active',
    expires_at = v_new_expiry,
    deletion_scheduled_at = null,
    updated_at = now()
  where id = v_profile.id
  returning *
  into v_profile;


  -- ==========================================================
  -- 10. AUDIT
  --
  -- No payment reference or private payment information is
  -- stored here. Payment verification remains a separate audit
  -- event.
  -- ==========================================================

  insert into public.audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    v_actor,
    'profile.renewed',
    'profile',
    v_profile.id,
    jsonb_build_object(
      'plan', v_profile.plan,
      'previous_status',
        case
          when v_profile.expires_at > now()
            then 'active'
          else 'expired'
        end,
      'expires_at',
        v_profile.expires_at,
      'source',
        'internal_lifecycle'
    )
  );


  -- ==========================================================
  -- 11. RETURN AUTHORITATIVE PROFILE
  -- ==========================================================

  return v_profile;


exception
  when foreign_key_violation then
    raise exception 'PROFILE_RENEWAL_REFERENCE_ERROR'
      using errcode = '23503';

  when check_violation then
    raise exception 'PROFILE_RENEWAL_CONSTRAINT_ERROR'
      using errcode = '23514';

end;
$$;


-- ============================================================
-- 12. HARD DENY CLIENT EXECUTION
-- ============================================================

revoke all
on function public.renew_profile(uuid, text)
from public, anon, authenticated;


-- ============================================================
-- 13. TRUSTED BACKEND ONLY
-- ============================================================

grant execute
on function public.renew_profile(uuid, text)
to service_role;


-- ============================================================
-- 14. DOCUMENTATION
-- ============================================================

comment on function public.renew_profile(
  uuid,
  text
)
is
'Worldwide DIPO internal profile-renewal primitive. Service-role only. Locks the profile, validates lifecycle state and deletion grace, calculates a server-authoritative six-month extension, activates the profile, clears deletion scheduling, preserves ownership, and records an audit event. Payment verification must remain the business authorization boundary.';


commit;


-- ============================================================
-- END
-- ============================================================