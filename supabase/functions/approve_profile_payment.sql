-- ============================================================
-- WORLDWIDE DIPO
-- Supabase Function
-- approve_profile_payment.sql
--
-- Purpose:
--   Authoritatively approve a pending payment claim.
--
-- Security model:
--   - Authenticated admin only
--   - Allowlisted admin email
--   - Active admin account
--   - admin/super_admin role only
--   - AAL2 required
--   - Payment row locked FOR UPDATE
--   - Profile row locked FOR UPDATE
--   - Payment ownership/profile consistency verified
--   - Server-side plan + amount remain authoritative
--   - Initial payment: pending -> active
--   - Renewal: active -> active + 6 months
--   - Payment: pending -> verified
--   - Audit event written atomically
--
-- IMPORTANT:
--   This function intentionally does NOT trust any client-side
--   amount, expiry date, profile status, or user identity.
-- ============================================================

begin;


-- ============================================================
-- 1. AUTHORITATIVE PAYMENT APPROVAL RPC
-- ============================================================

create or replace function public.approve_payment_claim(
  p_payment_id uuid,
  p_admin_note text default null
)
returns public.payments
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_id uuid;
  v_payment public.payments;
  v_profile public.profiles;

  v_note text;
  v_expected_amount integer;

  v_base_date timestamptz;
  v_expiry timestamptz;
begin

  -- ==========================================================
  -- 2. AUTHENTICATION
  -- ==========================================================

  v_admin_id := auth.uid();

  if v_admin_id is null then
    raise exception 'AUTHENTICATION_REQUIRED'
      using errcode = '42501';
  end if;


  -- ==========================================================
  -- 3. PAYMENT ADMIN AUTHORIZATION
  --
  -- current_user_can_manage_payments() is the authoritative
  -- database security gate.
  --
  -- It requires:
  --   authenticated user
  --   allowlisted email
  --   active admin_users record
  --   admin/super_admin role
  --   AAL2
  -- ==========================================================

  if not public.current_user_can_manage_payments() then
    raise exception 'ADMIN_AAL2_PERMISSION_REQUIRED'
      using errcode = '42501';
  end if;


  -- ==========================================================
  -- 4. INPUT VALIDATION
  -- ==========================================================

  if p_payment_id is null then
    raise exception 'PAYMENT_REQUIRED'
      using errcode = '22023';
  end if;


  v_note :=
    nullif(
      btrim(coalesce(p_admin_note, '')),
      ''
    );


  if v_note is not null
     and char_length(v_note) > 1000
  then
    raise exception 'ADMIN_NOTE_TOO_LONG'
      using errcode = '22023';
  end if;


  -- ==========================================================
  -- 5. LOCK PAYMENT
  --
  -- FOR UPDATE prevents two admins from approving/rejecting
  -- the same payment concurrently.
  -- ==========================================================

  select *
  into v_payment
  from public.payments
  where id = p_payment_id
  for update;


  if not found then
    raise exception 'PAYMENT_NOT_FOUND'
      using errcode = 'P0002';
  end if;


  -- ==========================================================
  -- 6. PAYMENT MUST STILL BE PENDING
  -- ==========================================================

  if v_payment.status <> 'pending' then
    raise exception 'PAYMENT_NOT_PENDING'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 7. PAYMENT PROFILE MUST EXIST
  -- ==========================================================

  if v_payment.profile_id is null then
    raise exception 'PAYMENT_PROFILE_MISSING'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 8. SERVER-SIDE PLAN VALIDATION
  --
  -- The payment amount is never trusted from the browser.
  -- The database defines the authoritative price mapping.
  -- ==========================================================

  v_expected_amount :=
    case v_payment.plan
      when 'Starter' then 149
      when 'Pro' then 349
      when 'Elite' then 499
      else null
    end;


  if v_expected_amount is null then
    raise exception 'INVALID_PAYMENT_PLAN'
      using errcode = 'P0001';
  end if;


  if v_payment.amount <> v_expected_amount then
    raise exception 'PAYMENT_AMOUNT_MISMATCH'
      using errcode = 'P0001';
  end if;


  if v_payment.plan_snapshot is not null
     and v_payment.plan_snapshot <> v_payment.plan
  then
    raise exception 'PAYMENT_PLAN_SNAPSHOT_MISMATCH'
      using errcode = 'P0001';
  end if;


  if v_payment.amount_snapshot is not null
     and v_payment.amount_snapshot <> v_expected_amount
  then
    raise exception 'PAYMENT_AMOUNT_SNAPSHOT_MISMATCH'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 9. LOCK PROFILE
  --
  -- The profile is locked after the payment lock so the entire
  -- approval operation is serialized.
  -- ==========================================================

  select *
  into v_profile
  from public.profiles
  where id = v_payment.profile_id
  for update;


  if not found then
    raise exception 'PROFILE_NOT_FOUND'
      using errcode = 'P0002';
  end if;


  -- ==========================================================
  -- 10. PAYMENT OWNER / PROFILE OWNER CONSISTENCY
  --
  -- A payment created by one user must never activate another
  -- user's profile, even if database data was corrupted or
  -- manually modified in the past.
  -- ==========================================================

  if v_payment.user_id is null then
    raise exception 'PAYMENT_USER_MISSING'
      using errcode = 'P0001';
  end if;


  if v_profile.owner_id is distinct from v_payment.user_id then
    raise exception 'PAYMENT_PROFILE_OWNER_MISMATCH'
      using errcode = '42501';
  end if;


  -- ==========================================================
  -- 11. INITIAL PAYMENT
  --
  -- Expected lifecycle:
  --
  --   draft
  --      ↓ payment submission
  --   pending
  --      ↓ admin approval
  --   active
  --
  -- First activation always receives exactly six months from
  -- the approval timestamp.
  -- ==========================================================

  if v_payment.payment_type = 'initial' then

    if v_profile.status <> 'pending' then
      raise exception 'PROFILE_NOT_PENDING'
        using errcode = 'P0001';
    end if;


    v_base_date := now();

    v_expiry :=
      v_base_date + interval '6 months';


    update public.profiles
    set
      plan = v_payment.plan,
      status = 'active',
      expires_at = v_expiry,
      deletion_scheduled_at = null,
      updated_at = now()
    where id = v_profile.id;


  -- ==========================================================
  -- 12. RENEWAL PAYMENT
  --
  -- Renewal never moves an active profile to pending.
  --
  -- If the profile still has future subscription time:
  --
  --   existing expiry + 6 months
  --
  -- Otherwise:
  --
  --   now + 6 months
  --
  -- This prevents users from losing already-paid remaining
  -- subscription time.
  -- ==========================================================

  elsif v_payment.payment_type = 'renewal' then

    if v_profile.status <> 'active' then
      raise exception
        'RENEWAL_PROFILE_MUST_REMAIN_ACTIVE'
        using errcode = 'P0001';
    end if;


    v_base_date :=
      greatest(
        now(),
        coalesce(
          v_profile.expires_at,
          now()
        )
      );


    v_expiry :=
      v_base_date + interval '6 months';


    update public.profiles
    set
      plan = v_payment.plan,
      status = 'active',
      expires_at = v_expiry,
      deletion_scheduled_at = null,
      updated_at = now()
    where id = v_profile.id;


  -- ==========================================================
  -- 13. UNKNOWN PAYMENT TYPE
  -- ==========================================================

  else

    raise exception 'INVALID_PAYMENT_TYPE'
      using errcode = 'P0001';

  end if;


  -- ==========================================================
  -- 14. MARK PAYMENT VERIFIED
  --
  -- This happens only after the profile transition succeeds.
  -- PostgreSQL transaction semantics ensure that if any earlier
  -- operation fails, neither the profile activation nor payment
  -- verification is committed.
  -- ==========================================================

  update public.payments
  set
    status = 'verified',
    verified_by = v_admin_id,
    verified_at = now(),
    notes = v_note,
    updated_at = now()
  where id = v_payment.id
  returning *
  into v_payment;


  if not found then
    raise exception 'PAYMENT_VERIFICATION_FAILED'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 15. AUDIT LOG
  --
  -- Never store unnecessary sensitive payment information.
  -- The audit record contains operational metadata required
  -- for administrator accountability.
  -- ==========================================================

  insert into public.audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    v_admin_id,
    'payment.approved',
    'payment',
    v_payment.id,
    jsonb_build_object(
      'profile_id', v_payment.profile_id,
      'payment_type', v_payment.payment_type,
      'plan', v_payment.plan,
      'amount', v_payment.amount,
      'expires_at', v_expiry,
      'admin_note_provided', v_note is not null
    )
  );


  -- ==========================================================
  -- 16. RETURN AUTHORITATIVE PAYMENT RECORD
  -- ==========================================================

  return v_payment;

end;
$$;


-- ============================================================
-- 17. EXECUTION PRIVILEGES
--
-- The function itself is callable by authenticated users because
-- the function performs its own authorization.
--
-- Anonymous/public execution is explicitly denied.
-- ============================================================

revoke execute
on function public.approve_payment_claim(uuid, text)
from public, anon;


grant execute
on function public.approve_payment_claim(uuid, text)
to authenticated;


-- ============================================================
-- 18. SECURITY DOCUMENTATION
-- ============================================================

comment on function public.approve_payment_claim(uuid, text)
is
'Worldwide DIPO authoritative payment approval RPC. Requires authenticated allowlisted AAL2 admin with payment-management privileges. Locks the payment and profile, validates payment/profile ownership and server-side pricing, activates initial profiles for six months, extends active renewals by six months, marks the payment verified, and writes an audit event atomically.';


commit;


-- ============================================================
-- END
-- ============================================================