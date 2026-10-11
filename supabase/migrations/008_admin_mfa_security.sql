-- ============================================================
-- Worldwide DIPO
-- Migration 008
-- Admin MFA / AAL2 Security Hardening
-- ============================================================

begin;

-- ============================================================
-- 1. ACTIVE ADMIN CHECK
--
-- This is used only for entering the admin security setup.
-- It does NOT grant payment-management permission.
-- ============================================================

create or replace function public.current_user_is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and is_active = true
      and role in (
        'super_admin',
        'admin',
        'support'
      )
  );
$$;

revoke execute
on function public.current_user_is_active_admin()
from public, anon;

grant execute
on function public.current_user_is_active_admin()
to authenticated;


-- ============================================================
-- 2. ADMIN CHECK
--
-- Sensitive admin data requires AAL2.
-- ============================================================

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and (select auth.jwt() ->> 'aal') = 'aal2'
    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and is_active = true
        and role in (
          'super_admin',
          'admin',
          'support'
        )
    );
$$;


-- ============================================================
-- 3. PAYMENT-MANAGEMENT ADMIN CHECK
--
-- Only super_admin/admin + AAL2.
-- Support cannot approve/reject.
-- ============================================================

create or replace function public.current_user_can_manage_payments()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and (select auth.jwt() ->> 'aal') = 'aal2'
    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and is_active = true
        and role in (
          'super_admin',
          'admin'
        )
    );
$$;


revoke execute
on function public.current_user_is_admin()
from public, anon;

grant execute
on function public.current_user_is_admin()
to authenticated;


revoke execute
on function public.current_user_can_manage_payments()
from public, anon;

grant execute
on function public.current_user_can_manage_payments()
to authenticated;


-- ============================================================
-- 4. DEFENSIVE UNIQUE PAYMENT REFERENCE
--
-- Same UTR/payment reference can NEVER exist twice.
-- This protects against race conditions at DB level.
-- ============================================================

create unique index if not exists idx_payments_reference_unique_final
on public.payments(payment_reference);


-- ============================================================
-- 5. DEFENSIVE PAYMENT STATUS POLICY
--
-- Browser users cannot directly modify payment records.
-- ============================================================

revoke
  insert,
  update,
  delete
on public.payments
from authenticated;

revoke
  insert,
  update,
  delete
on public.payments
from anon;


-- ============================================================
-- 6. ADMIN USERS ARE NOT USER-MANAGED
-- ============================================================

revoke
  insert,
  update,
  delete
on public.admin_users
from authenticated;

revoke
  insert,
  update,
  delete
on public.admin_users
from anon;


-- ============================================================
-- 7. AUDIT LOGS ARE APPEND-ONLY
--
-- No browser user can insert/update/delete logs.
-- Only SECURITY DEFINER backend functions create them.
-- ============================================================

revoke
  insert,
  update,
  delete
on public.audit_logs
from authenticated;

revoke
  insert,
  update,
  delete
on public.audit_logs
from anon;


-- ============================================================
-- 8. PAYMENT APPROVAL RPC — HARDENED
--
-- Even if someone calls RPC directly:
--
-- auth.uid()
-- admin_users
-- active
-- role
-- AAL2
--
-- all checked.
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
  v_base_date timestamptz;
  v_expiry timestamptz;
  v_note text;
begin

  v_admin_id := auth.uid();

  if v_admin_id is null then
    raise exception 'AUTHENTICATION_REQUIRED'
      using errcode = '42501';
  end if;

  if not public.current_user_can_manage_payments() then
    raise exception 'ADMIN_AAL2_PERMISSION_REQUIRED'
      using errcode = '42501';
  end if;

  if p_payment_id is null then
    raise exception 'PAYMENT_REQUIRED'
      using errcode = '22023';
  end if;

  v_note :=
    nullif(
      trim(coalesce(p_admin_note, '')),
      ''
    );

  if v_note is not null
     and length(v_note) > 1000
  then
    raise exception 'ADMIN_NOTE_TOO_LONG'
      using errcode = '22023';
  end if;


  -- ----------------------------------------------------------
  -- Lock payment row.
  -- ----------------------------------------------------------

  select *
  into v_payment
  from public.payments
  where id = p_payment_id
  for update;

  if not found then
    raise exception 'PAYMENT_NOT_FOUND'
      using errcode = 'P0002';
  end if;


  if v_payment.status <> 'pending' then
    raise exception 'PAYMENT_NOT_PENDING'
      using errcode = 'P0001';
  end if;


  if v_payment.profile_id is null then
    raise exception 'PAYMENT_PROFILE_MISSING'
      using errcode = 'P0001';
  end if;


  -- ----------------------------------------------------------
  -- Lock profile.
  -- ----------------------------------------------------------

  select *
  into v_profile
  from public.profiles
  where id = v_payment.profile_id
  for update;

  if not found then
    raise exception 'PROFILE_NOT_FOUND'
      using errcode = 'P0002';
  end if;


  -- ----------------------------------------------------------
  -- INITIAL PAYMENT
  -- ----------------------------------------------------------

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

  end if;


  -- ----------------------------------------------------------
  -- RENEWAL
  -- ----------------------------------------------------------

  if v_payment.payment_type = 'renewal' then

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

  end if;


  -- ----------------------------------------------------------
  -- VERIFY PAYMENT
  -- ----------------------------------------------------------

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


  -- ----------------------------------------------------------
  -- AUDIT
  -- ----------------------------------------------------------

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
      'amount', v_payment.amount
    )
  );

  return v_payment;

end;
$$;


revoke execute
on function public.approve_payment_claim(uuid, text)
from public, anon;

grant execute
on function public.approve_payment_claim(uuid, text)
to authenticated;


-- ============================================================
-- 9. REJECTION RPC — HARDENED
-- ============================================================

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

  v_admin_id := auth.uid();

  if v_admin_id is null then
    raise exception 'AUTHENTICATION_REQUIRED'
      using errcode = '42501';
  end if;

  if not public.current_user_can_manage_payments() then
    raise exception 'ADMIN_AAL2_PERMISSION_REQUIRED'
      using errcode = '42501';
  end if;

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


  select *
  into v_payment
  from public.payments
  where id = p_payment_id
  for update;

  if not found then
    raise exception 'PAYMENT_NOT_FOUND'
      using errcode = 'P0002';
  end if;


  if v_payment.status <> 'pending' then
    raise exception 'PAYMENT_NOT_PENDING'
      using errcode = 'P0001';
  end if;


  if v_payment.profile_id is not null then

    select *
    into v_profile
    from public.profiles
    where id = v_payment.profile_id
    for update;

    if v_payment.payment_type = 'initial'
       and v_profile.status = 'pending'
    then

      update public.profiles
      set
        status = 'draft',
        updated_at = now()
      where id = v_profile.id;

    end if;

  end if;


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

  return v_payment;

end;
$$;


revoke execute
on function public.reject_payment_claim(uuid, text)
from public, anon;

grant execute
on function public.reject_payment_claim(uuid, text)
to authenticated;


commit;