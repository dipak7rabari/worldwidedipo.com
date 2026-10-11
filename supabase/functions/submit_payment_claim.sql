-- ============================================================
-- WORLDWIDE DIPO
-- Supabase Function
-- submit_payment_claim.sql
--
-- Purpose:
--   Authoritative payment-claim submission RPC.
--
-- Lifecycle:
--
--   Initial:
--     draft → pending → admin approval → active
--
--   Renewal:
--     active → pending renewal → admin approval → active
--
-- Security:
--   - Authenticated users only
--   - Profile ownership verified server-side
--   - Profile row locked FOR UPDATE
--   - Payment amount resolved server-side
--   - Payment reference normalized server-side
--   - Duplicate reference protection
--   - One pending initial / renewal per profile
--   - No direct payments table mutation
--   - SECURITY DEFINER with locked search_path
-- ============================================================

begin;


create or replace function public.submit_payment_claim(
  p_profile_id uuid,
  p_payment_type text,
  p_plan text,
  p_payment_reference text
)
returns public.payments
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_profile public.profiles;
  v_payment public.payments;

  v_amount integer;
  v_reference text;

  v_existing_payment_id uuid;
begin

  -- ==========================================================
  -- 1. AUTHENTICATION
  -- ==========================================================

  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'AUTHENTICATION_REQUIRED'
      using errcode = '42501';
  end if;


  -- ==========================================================
  -- 2. PROFILE INPUT
  -- ==========================================================

  if p_profile_id is null then
    raise exception 'PROFILE_REQUIRED'
      using errcode = '22023';
  end if;


  -- ==========================================================
  -- 3. PAYMENT TYPE VALIDATION
  -- ==========================================================

  if p_payment_type not in (
    'initial',
    'renewal'
  ) then
    raise exception 'INVALID_PAYMENT_TYPE'
      using errcode = '22023';
  end if;


  -- ==========================================================
  -- 4. PLAN VALIDATION
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
  -- 5. SERVER-SIDE PRICE RESOLUTION
  --
  -- NEVER trust amount supplied by browser.
  -- ==========================================================

  v_amount :=
    case p_plan
      when 'Starter' then 149
      when 'Pro' then 349
      when 'Elite' then 499
    end;


  -- ==========================================================
  -- 6. PAYMENT REFERENCE NORMALIZATION
  --
  -- Canonical representation:
  --   trim
  --   remove whitespace
  --   uppercase
  --
  -- The database stores only the normalized value.
  -- ==========================================================

  v_reference :=
    upper(
      regexp_replace(
        trim(
          coalesce(
            p_payment_reference,
            ''
          )
        ),
        '[[:space:]]+',
        '',
        'g'
      )
    );


  if length(v_reference) < 6 then
    raise exception 'INVALID_PAYMENT_REFERENCE'
      using errcode = '22023';
  end if;


  if length(v_reference) > 80 then
    raise exception 'PAYMENT_REFERENCE_TOO_LONG'
      using errcode = '22023';
  end if;


  if v_reference !~
     '^[A-Z0-9][A-Z0-9_./-]*$'
  then
    raise exception 'INVALID_PAYMENT_REFERENCE_FORMAT'
      using errcode = '22023';
  end if;


  -- ==========================================================
  -- 7. LOCK AUTHENTICATED OWNER PROFILE
  --
  -- The browser may provide a profile ID, but ownership is
  -- independently verified against auth.uid().
  --
  -- FOR UPDATE prevents concurrent payment submissions from
  -- observing stale profile state.
  -- ==========================================================

  select *
  into v_profile
  from public.profiles
  where id = p_profile_id
    and owner_id = v_user_id
  for update;


  if not found then
    raise exception 'PROFILE_NOT_FOUND'
      using errcode = 'P0002';
  end if;


  -- ==========================================================
  -- 8. INITIAL PAYMENT
  --
  -- Only draft profiles may enter the initial payment flow.
  --
  -- draft → pending
  -- ==========================================================

  if p_payment_type = 'initial' then

    if v_profile.status <> 'draft' then

      if v_profile.status = 'pending' then
        raise exception 'INITIAL_PAYMENT_ALREADY_PENDING'
          using errcode = 'P0001';
      end if;

      if v_profile.status = 'active' then
        raise exception 'INITIAL_PAYMENT_PROFILE_ALREADY_ACTIVE'
          using errcode = 'P0001';
      end if;

      if v_profile.status = 'expired' then
        raise exception 'EXPIRED_PROFILE_REQUIRES_RENEWAL'
          using errcode = 'P0001';
      end if;

      raise exception 'INITIAL_PAYMENT_REQUIRES_DRAFT_PROFILE'
        using errcode = 'P0001';

    end if;


    -- --------------------------------------------------------
    -- Move profile into payment-verification state.
    -- --------------------------------------------------------

    update public.profiles
    set
      status = 'pending',
      updated_at = now()
    where id = v_profile.id;


    -- Keep local record consistent with the authoritative state.
    v_profile.status := 'pending';

  end if;


  -- ==========================================================
  -- 9. RENEWAL PAYMENT
  --
  -- The profile remains active while payment is pending.
  --
  -- active → active
  -- ==========================================================

  if p_payment_type = 'renewal' then

    if v_profile.status <> 'active' then

      if v_profile.status = 'expired' then
        raise exception 'RENEWAL_REQUIRES_ACTIVE_PROFILE'
          using errcode = 'P0001';
      end if;

      if v_profile.status = 'pending' then
        raise exception 'PROFILE_PAYMENT_ALREADY_PENDING'
          using errcode = 'P0001';
      end if;

      raise exception 'RENEWAL_REQUIRES_ACTIVE_PROFILE'
        using errcode = 'P0001';

    end if;

  end if;


  -- ==========================================================
  -- 10. DUPLICATE PAYMENT REFERENCE
  --
  -- Check before insert for a clean business error.
  -- The unique index remains the final race-condition guard.
  -- ==========================================================

  select id
  into v_existing_payment_id
  from public.payments
  where payment_reference = v_reference
  limit 1;


  if v_existing_payment_id is not null then
    raise exception 'PAYMENT_REFERENCE_ALREADY_USED'
      using errcode = '23505';
  end if;


  -- ==========================================================
  -- 11. CREATE PAYMENT CLAIM
  --
  -- All important values are server-derived:
  --
  -- profile_id    → locked owner profile
  -- user_id       → auth.uid()
  -- amount        → server plan mapping
  -- payer_name    → current profile name
  -- slug_snapshot → current profile slug
  -- snapshots     → server-controlled
  -- status        → pending
  -- ==========================================================

  insert into public.payments (
    profile_id,
    user_id,
    payment_type,
    plan,
    amount,
    payment_reference,
    status,
    payer_name,
    slug_snapshot,
    plan_snapshot,
    amount_snapshot
  )
  values (
    v_profile.id,
    v_user_id,
    p_payment_type,
    p_plan,
    v_amount,
    v_reference,
    'pending',
    v_profile.name,
    v_profile.slug,
    p_plan,
    v_amount
  )
  returning *
  into v_payment;


  -- ==========================================================
  -- 12. RETURN AUTHORITATIVE PAYMENT
  -- ==========================================================

  return v_payment;


exception

  -- ----------------------------------------------------------
  -- Unique constraint race:
  --
  -- Two requests may pass the pre-check simultaneously.
  -- The database unique indexes remain authoritative.
  -- ----------------------------------------------------------

  when unique_violation then

    raise exception
      'PAYMENT_REFERENCE_OR_PENDING_PAYMENT_ALREADY_EXISTS'
      using errcode = '23505';


  -- ----------------------------------------------------------
  -- Constraint failures should not expose internal DB details.
  -- ----------------------------------------------------------

  when check_violation then

    raise exception
      'PAYMENT_CLAIM_CONSTRAINT_ERROR'
      using errcode = '23514';

end;
$$;


-- ============================================================
-- 13. EXECUTION PRIVILEGES
--
-- Payment submission is authenticated-user functionality.
-- Anonymous users cannot submit claims.
-- Direct table INSERT remains disabled.
-- ============================================================

revoke execute
on function public.submit_payment_claim(
  uuid,
  text,
  text,
  text
)
from public, anon;


grant execute
on function public.submit_payment_claim(
  uuid,
  text,
  text,
  text
)
to authenticated;


-- ============================================================
-- 14. DOCUMENTATION
-- ============================================================

comment on function public.submit_payment_claim(
  uuid,
  text,
  text,
  text
)
is
'Worldwide DIPO authoritative authenticated payment-claim RPC. Verifies profile ownership, locks the profile, resolves payment amount server-side, normalizes and validates the payment reference, transitions initial profiles from draft to pending, keeps renewal profiles active while verification is pending, creates immutable payment snapshots, and relies on database uniqueness constraints for final duplicate protection.';


commit;


-- ============================================================
-- END
-- ============================================================