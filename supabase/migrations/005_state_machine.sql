-- ============================================================
-- Worldwide DIPO
-- Migration 005
-- Profile State Machine
-- ============================================================

begin;

create or replace function public.validate_profile_transition()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_role text;
begin

  request_role :=
    coalesce(
      current_setting('request.jwt.claims', true)::jsonb ->> 'role',
      ''
    );

  -- ----------------------------------------------------------
  -- Owner identity can NEVER change.
  -- ----------------------------------------------------------
  if new.owner_id is distinct from old.owner_id then
    raise exception 'PROFILE_OWNER_IMMUTABLE'
      using errcode = '42501';
  end if;

  -- ----------------------------------------------------------
  -- Protected subscription fields.
  --
  -- Normal authenticated users cannot modify:
  -- status
  -- plan
  -- expires_at
  -- deletion_scheduled_at
  --
  -- Only trusted backend/service/admin RPC paths can do so.
  -- ----------------------------------------------------------
  if
    (
      new.status is distinct from old.status
      or new.plan is distinct from old.plan
      or new.expires_at is distinct from old.expires_at
      or new.deletion_scheduled_at is distinct from old.deletion_scheduled_at
    )
    and request_role not in ('service_role')
    and current_user <> 'postgres'
  then
    raise exception 'PROFILE_SUBSCRIPTION_FIELDS_PROTECTED'
      using errcode = '42501';
  end if;

  -- ----------------------------------------------------------
  -- Lifecycle transitions.
  -- ----------------------------------------------------------

  if old.status = 'draft' then

    if new.status not in ('draft', 'pending') then
      raise exception 'INVALID_PROFILE_TRANSITION'
        using errcode = 'P0001';
    end if;

  elsif old.status = 'pending' then

    if new.status not in ('pending', 'draft', 'active') then
      raise exception 'INVALID_PROFILE_TRANSITION'
        using errcode = 'P0001';
    end if;

  elsif old.status = 'active' then

    if new.status not in ('active', 'expired') then
      raise exception 'INVALID_PROFILE_TRANSITION'
        using errcode = 'P0001';
    end if;

  elsif old.status = 'expired' then

    if new.status not in ('expired', 'active') then
      raise exception 'INVALID_PROFILE_TRANSITION'
        using errcode = 'P0001';
    end if;

  else

    raise exception 'UNKNOWN_PROFILE_STATUS'
      using errcode = 'P0001';

  end if;

  -- ----------------------------------------------------------
  -- Active profile must always have an expiry date.
  -- ----------------------------------------------------------

  if new.status = 'active' and new.expires_at is null then
    raise exception 'ACTIVE_PROFILE_REQUIRES_EXPIRY'
      using errcode = '23514';
  end if;

  -- ----------------------------------------------------------
  -- Expired profile cannot remain without deletion schedule
  -- once lifecycle processing handles it.
  -- This is intentionally not forced immediately so the
  -- janitor can establish the grace-period timestamp.
  -- ----------------------------------------------------------

  return new;
end;
$$;

drop trigger if exists trg_validate_profile_transition
on public.profiles;

create trigger trg_validate_profile_transition
before update on public.profiles
for each row
execute function public.validate_profile_transition();

revoke execute
on function public.validate_profile_transition()
from public, anon, authenticated;

commit;