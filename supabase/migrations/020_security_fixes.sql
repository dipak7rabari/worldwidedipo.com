-- ============================================================
-- Worldwide DIPO
-- Migration 020 - Security fixes (additive, safe to re-run)
--
-- FIX 1  profiles: plan / status / expires_at ab user khud
--        nahi badal sakta (trigger ab SECURITY INVOKER hai,
--        isliye current_user asli caller role dikhata hai).
-- FIX 2  New profile hamesha 'Starter' plan se shuru hoga.
-- FIX 3  Storage: ek user ke max 30 objects (bypass se bachav).
-- FIX 4  support_requests: user admin_reply / status edit
--        nahi kar sakta.
-- FIX 5  payments.payment_reference: naye claims par 12 digit UTR
--        (insert trigger; purani rows/updates par asar nahi).
-- ============================================================

begin;

-- ------------------------------------------------------------
-- FIX 1: profile transition guard
--
-- Pehle SECURITY DEFINER tha -> current_user hamesha owner
-- (postgres) hota tha -> guard kabhi kaam nahi karta tha.
--
-- Ab SECURITY INVOKER:
--   * PostgREST se direct user call  -> current_user = authenticated -> BLOCK
--   * approve/submit/reject RPC (definer) -> current_user = postgres -> ALLOW
--   * service_role client            -> current_user = service_role  -> ALLOW
-- ------------------------------------------------------------
create or replace function public.validate_profile_transition()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_is_client boolean;
begin
  v_is_client := current_user in ('authenticated', 'anon');

  if new.owner_id is distinct from old.owner_id then
    raise exception 'PROFILE_OWNER_IMMUTABLE'
      using errcode = '42501';
  end if;

  if v_is_client
     and (
       new.status is distinct from old.status
       or new.plan is distinct from old.plan
       or new.expires_at is distinct from old.expires_at
       or new.deletion_scheduled_at is distinct from old.deletion_scheduled_at
     )
  then
    raise exception 'PROFILE_SUBSCRIPTION_FIELDS_PROTECTED'
      using errcode = '42501';
  end if;

  if old.status = 'draft' then
    if new.status not in ('draft', 'pending') then
      raise exception 'INVALID_PROFILE_TRANSITION' using errcode = 'P0001';
    end if;
  elsif old.status = 'pending' then
    if new.status not in ('pending', 'draft', 'active') then
      raise exception 'INVALID_PROFILE_TRANSITION' using errcode = 'P0001';
    end if;
  elsif old.status = 'active' then
    if new.status not in ('active', 'expired') then
      raise exception 'INVALID_PROFILE_TRANSITION' using errcode = 'P0001';
    end if;
  elsif old.status = 'expired' then
    if new.status not in ('expired', 'active') then
      raise exception 'INVALID_PROFILE_TRANSITION' using errcode = 'P0001';
    end if;
  else
    raise exception 'UNKNOWN_PROFILE_STATUS' using errcode = 'P0001';
  end if;

  if new.status = 'active' and new.expires_at is null then
    raise exception 'ACTIVE_PROFILE_REQUIRES_EXPIRY' using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke execute on function public.validate_profile_transition()
from public, anon, authenticated;


-- ------------------------------------------------------------
-- FIX 2: new profile = Starter plan (insert par plan choose
--        karke bina payment ke bada gallery limit nahi milega)
-- ------------------------------------------------------------
create or replace function public.force_new_profile_draft()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.status := 'draft';
  new.plan := 'Starter';

  if new.expires_at is not null then
    raise exception 'New profiles cannot have an expiry date';
  end if;

  if new.deletion_scheduled_at is not null then
    raise exception 'New profiles cannot have deletion schedule';
  end if;

  return new;
end;
$$;


-- ------------------------------------------------------------
-- FIX 3: storage - ek user ke maximum 30 objects
--        (API route ke limit bypass karke bulk upload se bachav)
-- ------------------------------------------------------------
drop policy if exists "Users can upload own profile media"
on storage.objects;

create policy "Users can upload own profile media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-media'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and storage.extension(name) in ('jpg', 'jpeg', 'png', 'webp')
  and (
    select count(*)
    from storage.objects o
    where o.bucket_id = 'profile-media'
      and o.owner_id = (select auth.uid()::text)
  ) < 30
);


-- ------------------------------------------------------------
-- FIX 4: support_requests - user sirf apna message likh sake,
--        admin_reply / status / timestamps nahi.
-- ------------------------------------------------------------
create or replace function public.protect_support_admin_fields()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if current_user in ('authenticated', 'anon')
     and (
       new.admin_reply is distinct from old.admin_reply
       or new.status is distinct from old.status
       or new.replied_at is distinct from old.replied_at
       or new.resolved_at is distinct from old.resolved_at
       or new.user_id is distinct from old.user_id
     )
  then
    raise exception 'SUPPORT_ADMIN_FIELDS_PROTECTED'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_protect_support_admin_fields
on public.support_requests;

create trigger trg_protect_support_admin_fields
before update on public.support_requests
for each row
execute function public.protect_support_admin_fields();


-- ------------------------------------------------------------
-- FIX 5: UTR sirf 12 digit (UPI UTR format) - sirf NAYE claims par.
--
-- CHECK constraint (NOT VALID bhi) har UPDATE par poori row check
-- karta hai, to purani pending payment approve/reject karte waqt
-- fail ho sakti thi. Isliye BEFORE INSERT trigger use kiya hai.
-- ------------------------------------------------------------
alter table public.payments
  drop constraint if exists payments_reference_utr_12_digits;

create or replace function public.enforce_payment_reference_utr()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.payment_reference is null
     or new.payment_reference !~ '^[0-9]{12}$'
  then
    raise exception 'INVALID_PAYMENT_REFERENCE_FORMAT'
      using errcode = '22023';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_payment_reference_utr
on public.payments;

create trigger trg_enforce_payment_reference_utr
before insert on public.payments
for each row
execute function public.enforce_payment_reference_utr();

commit;
