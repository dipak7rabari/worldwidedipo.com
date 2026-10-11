-- ============================================================
-- Worldwide DIPO
-- Migration 006
-- Payment Security & Payment Claims
-- ============================================================

begin;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),

  profile_id uuid
    references public.profiles(id)
    on delete set null,

  user_id uuid
    references auth.users(id)
    on delete set null,

  payment_type text not null
    check (
      payment_type in ('initial', 'renewal')
    ),

  plan text not null
    check (
      plan in ('Starter', 'Pro', 'Elite')
    ),

  amount integer not null
    check (
      amount in (149, 349, 499)
    ),

  payment_reference text not null,

  status text not null default 'pending'
    check (
      status in ('pending', 'verified', 'rejected')
    ),

  payer_name text,

  slug_snapshot text,

  plan_snapshot text,

  amount_snapshot integer,

  verified_by uuid
    references auth.users(id)
    on delete set null,

  verified_at timestamptz,

  notes text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint payments_reference_not_empty
    check (length(trim(payment_reference)) >= 6),

  constraint payments_reference_length
    check (length(trim(payment_reference)) <= 80),

  constraint payments_amount_snapshot_valid
    check (
      amount_snapshot is null
      or amount_snapshot in (149, 349, 499)
    )
);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------

create index if not exists idx_payments_user_id
on public.payments(user_id);

create index if not exists idx_payments_profile_id
on public.payments(profile_id);

create index if not exists idx_payments_status
on public.payments(status);

create index if not exists idx_payments_created_at
on public.payments(created_at desc);

create unique index if not exists idx_payments_reference_unique
on public.payments(payment_reference);

-- One pending initial payment per profile.
create unique index if not exists idx_one_pending_initial_per_profile
on public.payments(profile_id)
where payment_type = 'initial'
  and status = 'pending';

-- One pending renewal payment per profile.
create unique index if not exists idx_one_pending_renewal_per_profile
on public.payments(profile_id)
where payment_type = 'renewal'
  and status = 'pending';

-- ------------------------------------------------------------
-- Updated timestamp
-- ------------------------------------------------------------

create or replace function public.set_payment_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_payments_updated_at
on public.payments;

create trigger trg_payments_updated_at
before update on public.payments
for each row
execute function public.set_payment_updated_at();

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------

alter table public.payments enable row level security;

revoke all on table public.payments
from anon, authenticated;

grant select on table public.payments
to authenticated;

-- Users can see only their own payment history.
drop policy if exists "Users can view own payments"
on public.payments;

create policy "Users can view own payments"
on public.payments
for select
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

-- ------------------------------------------------------------
-- No direct browser insert/update/delete.
-- Payment creation goes through RPC.
-- Admin operations will be handled in later admin batch.
-- ------------------------------------------------------------

revoke insert, update, delete
on public.payments
from authenticated;

-- ------------------------------------------------------------
-- Payment submission RPC
-- ------------------------------------------------------------

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

  -- ----------------------------------------------------------
  -- Server-side plan price.
  -- Never trust browser amount.
  -- ----------------------------------------------------------

  v_amount :=
    case p_plan
      when 'Starter' then 149
      when 'Pro' then 349
      when 'Elite' then 499
    end;

  -- ----------------------------------------------------------
  -- Normalize payment reference.
  -- ----------------------------------------------------------

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

  -- ----------------------------------------------------------
  -- Lock profile row for this transaction.
  -- ----------------------------------------------------------

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
  -- Initial payment:
  -- only draft profile.
  -- ----------------------------------------------------------

  if p_payment_type = 'initial'
     and v_profile.status <> 'draft'
  then
    raise exception 'INITIAL_PAYMENT_REQUIRES_DRAFT_PROFILE'
      using errcode = 'P0001';
  end if;

  -- ----------------------------------------------------------
  -- Renewal:
  -- active profile only.
  -- Profile remains active while renewal is pending.
  -- ----------------------------------------------------------

  if p_payment_type = 'renewal'
     and v_profile.status <> 'active'
  then
    raise exception 'RENEWAL_REQUIRES_ACTIVE_PROFILE'
      using errcode = 'P0001';
  end if;

  -- ----------------------------------------------------------
  -- Prevent duplicate payment reference.
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
  -- Insert claim.
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
    raise exception 'PAYMENT_REFERENCE_OR_PENDING_PAYMENT_ALREADY_EXISTS'
      using errcode = '23505';
end;
$$;

revoke execute
on function public.submit_payment_claim(uuid, text, text, text)
from public, anon;

grant execute
on function public.submit_payment_claim(uuid, text, text, text)
to authenticated;

commit;