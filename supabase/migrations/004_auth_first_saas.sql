-- ============================================================
-- WORLDWIDE DIPO
-- 004_auth_first_saas.sql
-- Auth-first SaaS ownership rules
-- ============================================================

-- ------------------------------------------------------------
-- Profile owner validation
-- ------------------------------------------------------------

create or replace function public.validate_profile_owner()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.owner_id is null then
    raise exception 'Profile owner is required'
      using errcode = '23502';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_profile_owner_trigger
on public.profiles;

create trigger validate_profile_owner_trigger
before insert or update
on public.profiles
for each row
execute function public.validate_profile_owner();

-- ------------------------------------------------------------
-- Owner cannot be reassigned
-- ------------------------------------------------------------

create or replace function public.prevent_profile_owner_change()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and new.owner_id <> old.owner_id then
    raise exception 'Profile ownership cannot be changed'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_owner_change_trigger
on public.profiles;

create trigger prevent_profile_owner_change_trigger
before update
on public.profiles
for each row
execute function public.prevent_profile_owner_change();

-- ------------------------------------------------------------
-- Public profile creation must start as draft
-- ------------------------------------------------------------

create or replace function public.force_new_profile_draft()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.status := 'draft';

  if new.expires_at is not null then
    raise exception 'New profiles cannot have an expiry date';
  end if;

  if new.deletion_scheduled_at is not null then
    raise exception 'New profiles cannot have deletion schedule';
  end if;

  return new;
end;
$$;

drop trigger if exists force_new_profile_draft_trigger
on public.profiles;

create trigger force_new_profile_draft_trigger
before insert
on public.profiles
for each row
execute function public.force_new_profile_draft();

-- ------------------------------------------------------------
-- Initial plan
-- ------------------------------------------------------------

alter table public.profiles
alter column plan set default 'Starter';

-- ------------------------------------------------------------
-- Helpful account/profile index
-- ------------------------------------------------------------

create unique index if not exists profiles_one_per_owner_idx
on public.profiles(owner_id);