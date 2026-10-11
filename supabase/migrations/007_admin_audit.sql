-- ============================================================
-- Worldwide DIPO
-- Migration 007
-- Admin Authorization + Payment Verification + Audit Logs
-- ============================================================

begin;

-- ============================================================
-- 1. ADMIN USERS
-- ============================================================

create table if not exists public.admin_users (
  user_id uuid primary key
    references auth.users(id)
    on delete restrict,

  role text not null default 'admin'
    check (
      role in ('super_admin', 'admin', 'support')
    ),

  display_name text not null default 'Worldwide DIPO Admin',

  is_active boolean not null default true,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create index if not exists idx_admin_users_role
on public.admin_users(role);

create index if not exists idx_admin_users_active
on public.admin_users(is_active);

alter table public.admin_users enable row level security;

revoke all on public.admin_users
from anon, authenticated;

grant select on public.admin_users
to authenticated;


-- ============================================================
-- 2. ADMIN CHECK FUNCTIONS
-- ============================================================

create or replace function public.current_user_is_admin()
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
      and role in ('super_admin', 'admin', 'support')
  );
$$;

create or replace function public.current_user_can_manage_payments()
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
      and role in ('super_admin', 'admin')
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
-- 3. ADMIN USERS POLICY
-- ============================================================

drop policy if exists "Admins can view own admin record"
on public.admin_users;

create policy "Admins can view own admin record"
on public.admin_users
for select
to authenticated
using (
  user_id = (select auth.uid())
  and is_active = true
);


-- ============================================================
-- 4. AUDIT LOGS
-- ============================================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),

  actor_user_id uuid
    references auth.users(id)
    on delete set null,

  action text not null,

  entity_type text not null,

  entity_id uuid,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),

  constraint audit_logs_action_length
    check (length(trim(action)) between 2 and 80),

  constraint audit_logs_entity_type_length
    check (length(trim(entity_type)) between 2 and 80),

  constraint audit_logs_metadata_object
    check (jsonb_typeof(metadata) = 'object')
);

create index if not exists idx_audit_logs_actor
on public.audit_logs(actor_user_id);

create index if not exists idx_audit_logs_entity
on public.audit_logs(entity_type, entity_id);

create index if not exists idx_audit_logs_created
on public.audit_logs(created_at desc);

alter table public.audit_logs enable row level security;

revoke all on public.audit_logs
from anon, authenticated;

grant select on public.audit_logs
to authenticated;


drop policy if exists "Admins can view audit logs"
on public.audit_logs;

create policy "Admins can view audit logs"
on public.audit_logs
for select
to authenticated
using (
  (select public.current_user_is_admin())
);


-- ============================================================
-- 5. PAYMENT ADMIN ACCESS
-- ============================================================

drop policy if exists "Admins can view payments"
on public.payments;

create policy "Admins can view payments"
on public.payments
for select
to authenticated
using (
  (select public.current_user_is_admin())
);


-- ============================================================
-- 6. CORRECT PAYMENT SUBMISSION
--
-- Initial payment:
-- draft -> pending
--
-- Renewal:
-- active stays active
-- ============================================================

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
  v_amount integer;
  v_reference text;
  v_payment public.payments;
begin

  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'AUTHENTICATION_REQUIRED'
      using errcode = '42501';
  end if;

  if p_profile_id is null then
    raise exception 'PROFILE_REQUIRED'
      using errcode = '22023';
  end if;

  if p_payment_type not in ('initial', 'renewal') then
    raise exception 'INVALID_PAYMENT_TYPE'
      using errcode = '22023';
  end if;

  if p_plan not in ('Starter', 'Pro', 'Elite') then
    raise exception 'INVALID_PLAN'
      using errcode = '22023';
  end if;

  v_amount :=
    case p_plan
      when 'Starter' then 149
      when 'Pro' then 349
      when 'Elite' then 499
    end;

  v_reference :=
    upper(
      regexp_replace(
        trim(coalesce(p_payment_reference, '')),
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

  if v_reference !~ '^[A-Z0-9][A-Z0-9_./-]*$' then
    raise exception 'INVALID_PAYMENT_REFERENCE_FORMAT'
      using errcode = '22023';
  end if;

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

  -- ----------------------------------------------------------
  -- INITIAL PAYMENT
  -- ----------------------------------------------------------

  if p_payment_type = 'initial' then

    if v_profile.status <> 'draft' then
      raise exception 'INITIAL_PAYMENT_REQUIRES_DRAFT_PROFILE'
        using errcode = 'P0001';
    end if;

    -- Move profile into pending state.
    update public.profiles
    set
      status = 'pending',
      updated_at = now()
    where id = v_profile.id;

  end if;


  -- ----------------------------------------------------------
  -- RENEWAL PAYMENT
  --
  -- Active profile stays active.
  -- ----------------------------------------------------------

  if p_payment_type = 'renewal' then

    if v_profile.status <> 'active' then
      raise exception 'RENEWAL_REQUIRES_ACTIVE_PROFILE'
        using errcode = 'P0001';
    end if;

  end if;


  -- ----------------------------------------------------------
  -- DUPLICATE UTR / PAYMENT REFERENCE
  -- ----------------------------------------------------------

  if exists (
    select 1
    from public.payments
    where payment_reference = v_reference
  ) then
    raise exception 'PAYMENT_REFERENCE_ALREADY_USED'
      using errcode = '23505';
  end if;


  -- ----------------------------------------------------------
  -- CREATE PAYMENT CLAIM
  -- ----------------------------------------------------------

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

  return v_payment;

exception
  when unique_violation then

    raise exception
      'PAYMENT_REFERENCE_OR_PENDING_PAYMENT_ALREADY_EXISTS'
      using errcode = '23505';

end;
$$;

revoke execute
on function public.submit_payment_claim(uuid, text, text, text)
from public, anon;

grant execute
on function public.submit_payment_claim(uuid, text, text, text)
to authenticated;


-- ============================================================
-- 7. APPROVE PAYMENT
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
    raise exception 'ADMIN_PERMISSION_REQUIRED'
      using errcode = '42501';
  end if;

  if p_payment_id is null then
    raise exception 'PAYMENT_REQUIRED'
      using errcode = '22023';
  end if;

  v_note := nullif(trim(coalesce(p_admin_note, '')), '');

  if v_note is not null and length(v_note) > 1000 then
    raise exception 'ADMIN_NOTE_TOO_LONG'
      using errcode = '22023';
  end if;


  -- ----------------------------------------------------------
  -- Lock payment.
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


  -- ----------------------------------------------------------
  -- Payment must have a profile.
  -- ----------------------------------------------------------

  if v_payment.profile_id is null then
    raise exception 'PAYMENT_PROFILE_MISSING'
      using errcode = 'P0001';
  end if;


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
  -- INITIAL PAYMENT APPROVAL
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
  -- RENEWAL APPROVAL
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
        coalesce(v_profile.expires_at, now())
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
  -- MARK PAYMENT VERIFIED
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
-- 8. REJECT PAYMENT
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
    raise exception 'ADMIN_PERMISSION_REQUIRED'
      using errcode = '42501';
  end if;

  v_note := nullif(trim(coalesce(p_admin_note, '')), '');

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


  -- ----------------------------------------------------------
  -- Initial payment rejection:
  -- pending profile returns to draft.
  --
  -- Renewal rejection:
  -- profile stays active.
  -- ----------------------------------------------------------

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


  -- ----------------------------------------------------------
  -- Reject payment
  -- ----------------------------------------------------------

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


  -- ----------------------------------------------------------
  -- Audit
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


-- ============================================================
-- 9. UPDATED AT FOR ADMIN TABLE
-- ============================================================

create or replace function public.set_admin_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_admin_users_updated_at
on public.admin_users;

create trigger trg_admin_users_updated_at
before update on public.admin_users
for each row
execute function public.set_admin_updated_at();


-- ============================================================
-- 10. AUDIT LOGS ARE APPEND-ONLY
-- ============================================================

revoke insert, update, delete
on public.audit_logs
from anon, authenticated;


-- ============================================================
-- 11. ADMIN TABLE CANNOT BE MODIFIED FROM BROWSER
-- ============================================================

revoke insert, update, delete
on public.admin_users
from anon, authenticated;


commit;