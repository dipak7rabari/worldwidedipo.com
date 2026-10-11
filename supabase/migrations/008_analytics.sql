-- ============================================================
-- WORLDWIDE DIPO
-- 008_analytics.sql
-- Profile analytics
-- ============================================================

-- ------------------------------------------------------------
-- Record profile view
-- ------------------------------------------------------------

create or replace function public.record_profile_view(
  p_profile_id uuid,
  p_viewer_hash text default null,
  p_referrer text default null,
  p_user_agent text default null,
  p_country_code text default null,
  p_device_type text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_status text;
  target_expiry timestamptz;
begin

  select
    status,
    expires_at
  into
    target_status,
    target_expiry
  from public.profiles
  where id = p_profile_id;

  if not found then
    return;
  end if;

  if target_status <> 'active' then
    return;
  end if;

  if target_expiry is null
     or target_expiry <= timezone('utc', now()) then
    return;
  end if;

  insert into public.profile_views (
    profile_id,
    viewer_user_id,
    viewer_hash,
    referrer,
    user_agent,
    country_code,
    device_type
  )
  values (
    p_profile_id,
    auth.uid(),
    left(p_viewer_hash, 128),
    left(p_referrer, 1000),
    left(p_user_agent, 1000),
    left(p_country_code, 10),
    left(p_device_type, 20)
  );

end;
$$;

revoke all on function public.record_profile_view(
  uuid,
  text,
  text,
  text,
  text,
  text
)
from public;

grant execute on function public.record_profile_view(
  uuid,
  text,
  text,
  text,
  text,
  text
)
to anon, authenticated;

-- ------------------------------------------------------------
-- Profile view summary
-- ------------------------------------------------------------

create or replace function public.get_profile_view_count(
  p_profile_id uuid
)
returns bigint
language sql
security definer
stable
set search_path = public
as $$
  select count(*)
  from public.profile_views
  where profile_id = p_profile_id;
$$;

revoke all on function public.get_profile_view_count(uuid)
from public;

grant execute on function public.get_profile_view_count(uuid)
to authenticated;

-- ------------------------------------------------------------
-- User can only request analytics for own profile
-- ------------------------------------------------------------

create or replace function public.get_my_profile_view_count()
returns bigint
language sql
security definer
stable
set search_path = public
as $$
  select count(*)
  from public.profile_views v
  inner join public.profiles p
    on p.id = v.profile_id
  where p.owner_id = auth.uid();
$$;

revoke all on function public.get_my_profile_view_count()
from public;

grant execute on function public.get_my_profile_view_count()
to authenticated;