-- ============================================================
-- Worldwide DIPO
-- Migration 003
-- Public Profile Projection
-- ============================================================

begin;

drop view if exists public.public_profiles;

create view public.public_profiles
with (security_invoker = false)
as
select
  p.id,
  p.name,
  p.slug,
  p.profession,
  p.headline,
  p.bio,
  p.avatar_url,
  p.location,
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
  p.status = 'active'
  and p.expires_at is not null
  and p.expires_at > now();

revoke all on public.public_profiles from public;
revoke all on public.public_profiles from authenticated;
revoke all on public.public_profiles from anon;

grant select on public.public_profiles to anon;
grant select on public.public_profiles to authenticated;

commit;