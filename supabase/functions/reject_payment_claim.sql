-- ============================================================
-- WORLDWIDE DIPO
-- Supabase Function
-- reject_payment_claim.sql
--
-- Purpose:
--   Authoritatively reject a pending payment claim.
--
-- Security:
--   - Authenticated admin only
--   - Requires payment-management permission + AAL2
--   - Locks payment and profile rows
--   - Only pending payments can be rejected
--   - Initial rejection returns pending profile to draft
--   - Renewal rejection leaves active profile unchanged
--   - Admin reason is mandatory and bounded
--   - Writes immutable audit event
--   - SECURITY DEFINER with locked search_path
-- ============================================================

begin;


create or replace function public.reject_payment_claim(
  p_payment_id uuid,
  p_admin_note text
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
begin

  -- ==========================================================
  -- 1. AUTHENTICATION
  -- ==========================================================

  v_admin_id := auth.uid();

  if v_admin_id is null then
    raise exception 'AUTHENTICATION_REQUIRED'
      using errcode = '42501';
  end if;


  -- ==========================================================
  -- 2. ADMIN + AAL2 AUTHORIZATION
  --
  -- Use the existing authoritative database permission helper.
  -- Never trust a client-provided admin flag.
  -- ==========================================================

  if not public.current_user_can_manage_payments() then
    raise exception 'ADMIN_AAL2_PERMISSION_REQUIRED'
      using errcode = '42501';
  end if;


  -- ==========================================================
  -- 3. VALIDATE REJECTION REASON
  -- ==========================================================

  v_note :=
    nullif(
      trim(coalesce(p_admin_note, '')),
      ''
    );

  if v_note is null then
    raise exception 'REJECTION_REASON_REQUIRED'
      using errcode = '22023';
  end if;

  if length(v_note) > 1000 then
    raise exception 'ADMIN_NOTE_TOO_LONG'
      using errcode = '22023';
  end if;


  -- ==========================================================
  -- 4. LOCK PAYMENT
  --
  -- Prevent two admins from processing the same payment
  -- concurrently.
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
  -- 5. ONLY PENDING CLAIMS MAY BE REJECTED
  -- ==========================================================

  if v_payment.status <> 'pending' then
    raise exception 'PAYMENT_NOT_PENDING'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 6. LOCK ASSOCIATED PROFILE
  --
  -- The payment row is locked first, then the profile row.
  -- This keeps the lifecycle mutation atomic.
  -- ==========================================================

  if v_payment.profile_id is not null then

    select *
    into v_profile
    from public.profiles
    where id = v_payment.profile_id
    for update;

    -- --------------------------------------------------------
    -- If the profile no longer exists, a pending payment cannot
    -- safely perform an initial-profile state transition.
    -- Renewal rejection can still be recorded if the profile
    -- was removed through an allowed lifecycle.
    -- --------------------------------------------------------

    if not found
       and v_payment.payment_type = 'initial'
    then
      raise exception 'PAYMENT_PROFILE_NOT_FOUND'
        using errcode = 'P0002';
    end if;


    -- ========================================================
    -- 7. INITIAL PAYMENT REJECTION
    --
    -- Initial flow:
    --
    --   draft → payment submitted → pending
    --   pending payment rejected → draft
    --
    -- Never allow this RPC to arbitrarily alter an unrelated
    -- profile state.
    -- ========================================================

    if found
       and v_payment.payment_type = 'initial'
       and v_profile.status = 'pending'
    then

      update public.profiles
      set
        status = 'draft',
        updated_at = now()
      where id = v_profile.id;

    end if;

  end if;


  -- ==========================================================
  -- 8. RENEWAL REJECTION
  --
  -- Renewal claims do NOT change the active profile state.
  --
  -- active → renewal pending → rejected → active
  --
  -- No subscription extension is granted.
  -- ==========================================================


  -- ==========================================================
  -- 9. MARK PAYMENT REJECTED
  -- ==========================================================

  update public.payments
  set
    status = 'rejected',
    verified_by = v_admin_id,
    verified_at = now(),
    notes = v_note,
    updated_at = now()
  where id = v_payment.id
  returning *
  into v_payment;


  -- ==========================================================
  -- 10. AUDIT EVENT
  --
  -- Never store unnecessary sensitive payment information.
  -- Payment reference is intentionally excluded.
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
    'payment.rejected',
    'payment',
    v_payment.id,
    jsonb_build_object(
      'profile_id', v_payment.profile_id,
      'payment_type', v_payment.payment_type,
      'plan', v_payment.plan,
      'amount', v_payment.amount,
      'reason', v_note
    )
  );


  -- ==========================================================
  -- 11. RETURN AUTHORITATIVE PAYMENT ROW
  -- ==========================================================

  return v_payment;


exception
  when unique_violation then
    raise exception 'PAYMENT_REJECTION_CONFLICT'
      using errcode = '23505';

  when foreign_key_violation then
    raise exception 'PAYMENT_REJECTION_REFERENCE_ERROR'
      using errcode = '23503';

end;
$$;


-- ============================================================
-- 12. EXECUTION PRIVILEGES
-- ============================================================

revoke execute
on function public.reject_payment_claim(uuid, text)
from public, anon;


grant execute
on function public.reject_payment_claim(uuid, text)
to authenticated;


-- ============================================================
-- 13. DOCUMENTATION
-- ============================================================

comment on function public.reject_payment_claim(
  uuid,
  text
)
is
'Worldwide DIPO admin-only payment rejection RPC. Requires authenticated payment-management permission with AAL2, locks the payment and associated profile, rejects only pending claims, returns initial pending profiles to draft, leaves renewal profiles unchanged, records the bounded admin reason, and writes an audit event.';


commit;


-- ============================================================
-- END
-- ============================================================