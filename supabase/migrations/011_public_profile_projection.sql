-- Worldwide DIPO
-- Migration 011
-- Secure public profile projection + sitemap projection

create or replace function public.get_public_profile(
  p_slug text
)
returns table (
  id uuid,
  name text,
  slug text,
  profession text,
  headline text,
  bio text,
  avatar_url text,
  location text,
  category text,
  about text,
  links jsonb,
  social_links jsonb,
  skills jsonb,
  services jsonb,
  experience jsonb,
  education jsonb,
  projects jsonb,
  gallery jsonb,
  business jsonb,
  plan text,
  status text,
  expires_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    p.id,
    p.name,
    p.slug,
    p.profession,
    p.headline,
    p.bio,
    p.avatar_url,
    p.location,
    p.category,
    p.about,
    p.links,
    p.social_links,
    p.skills,
    p.services,
    p.experience,
    p.education,
    p.projects,
    p.gallery,
    p.business,
    p.plan,
    p.status,
    p.expires_at,
    p.created_at,
    p.updated_at
  from public.profiles p
  where
    p.slug = lower(trim(p_slug))
    and p.status = 'active'
    and (
      p.expires_at is null
      or p.expires_at > now()
    )
  limit 1;
$$;

revoke all on function public.get_public_profile(text)
from public;

grant execute on function public.get_public_profile(text)
to anon, authenticated;


-- Sitemap only needs safe URL information.
create or replace function public.get_active_profile_slugs(
  p_limit integer default 10000,
  p_offset integer default 0
)
returns table (
  slug text,
  updated_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    p.slug,
    p.updated_at
  from public.profiles p
  where
    p.status = 'active'
    and (
      p.expires_at is null
      or p.expires_at > now()
    )
  order by p.updated_at desc, p.id
  limit least(greatest(coalesce(p_limit, 10000), 1), 10000)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

revoke all on function public.get_active_profile_slugs(integer, integer)
from public;

grant execute on function public.get_active_profile_slugs(integer, integer)
to anon, authenticated;