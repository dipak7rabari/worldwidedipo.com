-- ============================================================
-- WORLDWIDE DIPO
-- Migration 014
--
-- Purpose:
--   Public Explore discovery for active Worldwide DIPO profiles.
--
-- IMPORTANT:
--   - Real profiles only.
--   - Payment/admin approval remains the source of activation.
--   - Users can control Explore visibility.
--   - Private profile columns are never exposed by this RPC.
--   - Demo profiles are NOT stored in the database.
--     They are handled by lib/explore/demo-profiles.js.
-- ============================================================

begin;

-- ============================================================
-- 1. EXPLORE VISIBILITY
-- ============================================================

alter table public.profiles
  add column if not exists show_in_explore boolean
  not null
  default true;

comment on column public.profiles.show_in_explore is
  'Controls whether an active, non-expired DIPO may appear in public Worldwide DIPO Explore. Direct public DIPO URLs remain independent of this setting.';


-- ============================================================
-- 2. DATA NORMALIZATION
--
-- Existing profiles should be discoverable by default when
-- they are otherwise eligible for Explore.
-- ============================================================

update public.profiles
set show_in_explore = true
where show_in_explore is null;


-- ============================================================
-- 3. INDEXES
--
-- IMPORTANT:
-- Do NOT use NOW() in an index predicate.
-- PostgreSQL requires immutable expressions for index
-- predicates. Expiry is therefore checked at query time.
-- ============================================================

create index if not exists profiles_explore_active_idx
on public.profiles (
  updated_at desc,
  id
)
where
  status = 'active'
  and show_in_explore = true;


create index if not exists profiles_explore_category_idx
on public.profiles (
  category,
  updated_at desc,
  id
)
where
  status = 'active'
  and show_in_explore = true;


-- ============================================================
-- 4. SECURE EXPLORE RPC
--
-- This is the ONLY database interface used by the public
-- Explore server code for real profile discovery.
--
-- SECURITY DEFINER is used intentionally so the public
-- Explore page does not require a broad SELECT policy on
-- the private profiles table.
--
-- Only safe public presentation fields are returned.
-- ============================================================

create or replace function public.get_explore_profiles(
  p_query text default null,
  p_category text default null,
  p_limit integer default 24,
  p_offset integer default 0
)
returns table (
  name text,
  slug text,
  profession text,
  headline text,
  bio text,
  avatar_url text,
  location text,
  category text,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = pg_catalog, public
as $function$

  select
    p.name,
    p.slug,
    p.profession,
    p.headline,
    p.bio,
    p.avatar_url,
    p.location,
    p.category,
    p.updated_at

  from public.profiles as p

  where
    -- --------------------------------------------------------
    -- ONLY ACTIVE PROFILES
    -- --------------------------------------------------------
    p.status = 'active'

    -- --------------------------------------------------------
    -- ONLY PROFILES THAT OPTED INTO EXPLORE
    -- --------------------------------------------------------
    and p.show_in_explore = true

    -- --------------------------------------------------------
    -- EXPIRED PROFILES MUST NOT APPEAR
    -- --------------------------------------------------------
    and (
      p.expires_at is null
      or p.expires_at > now()
    )

    -- --------------------------------------------------------
    -- OPTIONAL CATEGORY FILTER
    -- --------------------------------------------------------
    and (
      nullif(
        btrim(coalesce(p_category, '')),
        ''
      ) is null

      or lower(
        coalesce(p.category, '')
      ) = lower(
        btrim(p_category)
      )
    )

    -- --------------------------------------------------------
    -- OPTIONAL PUBLIC SEARCH
    --
    -- Search is limited to presentation fields.
    -- Private/account/payment fields are never searched.
    -- --------------------------------------------------------
    and (
      nullif(
        btrim(coalesce(p_query, '')),
        ''
      ) is null

      or concat_ws(
        ' ',
        p.name,
        p.profession,
        p.headline,
        p.bio,
        p.location,
        p.category
      ) ilike
        '%' ||
        btrim(p_query) ||
        '%'
    )

  order by
    p.updated_at desc nulls last,
    p.id desc

  limit least(
    greatest(
      coalesce(p_limit, 24),
      1
    ),
    60
  )

  offset greatest(
    coalesce(p_offset, 0),
    0
  );

$function$;


-- ============================================================
-- 5. EXECUTE PRIVILEGES
--
-- Public users need to be able to call the RPC through the
-- Supabase API, but they should NOT receive direct table
-- SELECT access from this migration.
-- ============================================================

revoke all
on function public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
from public;

revoke all
on function public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
from anon;

revoke all
on function public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
from authenticated;


grant execute
on function public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
to anon;

grant execute
on function public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
to authenticated;


-- ============================================================
-- 6. COLUMN DOCUMENTATION
-- ============================================================

comment on function public.get_explore_profiles(
  text,
  text,
  integer,
  integer
) is
  'Returns safe public Worldwide DIPO Explore profiles. Only active, non-expired profiles with show_in_explore=true are returned. Private profile fields and owner_id are never exposed.';


commit;