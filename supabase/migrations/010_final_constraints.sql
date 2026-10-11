-- ============================================================
-- WORLDWIDE DIPO
-- 010_final_constraints.sql
-- Final database constraints and hardening
--
-- IMPORTANT:
-- This migration is intentionally aligned with the actual
-- Worldwide DIPO schema:
--   profiles.social_links
--   admin_users
--   support_requests
--   profile_view_events
-- ============================================================

begin;


-- ============================================================
-- RESERVED SLUGS
-- ============================================================

create table if not exists public.reserved_slugs (
  slug varchar(30) primary key
);

insert into public.reserved_slugs (slug)
values
  ('admin'),
  ('api'),
  ('auth'),
  ('callback'),
  ('confirm'),
  ('contact'),
  ('dashboard'),
  ('help'),
  ('login'),
  ('logout'),
  ('pricing'),
  ('privacy'),
  ('profile'),
  ('profiles'),
  ('refund'),
  ('settings'),
  ('signin'),
  ('sign-in'),
  ('signup'),
  ('sign-up'),
  ('support'),
  ('terms'),
  ('users'),
  ('worldwidedipo')
on conflict (slug) do nothing;

alter table public.reserved_slugs enable row level security;

revoke all
on public.reserved_slugs
from anon, authenticated;


-- ============================================================
-- RESERVED SLUG VALIDATION
-- ============================================================

create or replace function public.validate_profile_slug()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.slug is null then
    return new;
  end if;

  new.slug := lower(btrim(new.slug));

  if new.slug !~ '^[a-z0-9-]{3,30}$' then
    raise exception 'Invalid DIPO slug format';
  end if;

  if exists (
    select 1
    from public.reserved_slugs
    where slug = new.slug
  ) then
    raise exception 'This DIPO slug is reserved';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_profile_slug_trigger
on public.profiles;

create trigger validate_profile_slug_trigger
before insert or update of slug
on public.profiles
for each row
execute function public.validate_profile_slug();


-- ============================================================
-- JSON STRUCTURE VALIDATION
-- ============================================================

alter table public.profiles
drop constraint if exists profiles_links_object;

alter table public.profiles
add constraint profiles_links_object
check (
  jsonb_typeof(links) = 'object'
);


alter table public.profiles
drop constraint if exists profiles_social_links_object;

alter table public.profiles
add constraint profiles_social_links_object
check (
  jsonb_typeof(social_links) = 'object'
);


alter table public.profiles
drop constraint if exists profiles_education_array;

alter table public.profiles
add constraint profiles_education_array
check (
  jsonb_typeof(education) = 'array'
);


alter table public.profiles
drop constraint if exists profiles_skills_array;

alter table public.profiles
add constraint profiles_skills_array
check (
  jsonb_typeof(skills) = 'array'
);


alter table public.profiles
drop constraint if exists profiles_experience_array;

alter table public.profiles
add constraint profiles_experience_array
check (
  jsonb_typeof(experience) = 'array'
);


alter table public.profiles
drop constraint if exists profiles_projects_array;

alter table public.profiles
add constraint profiles_projects_array
check (
  jsonb_typeof(projects) = 'array'
);


alter table public.profiles
drop constraint if exists profiles_services_array;

alter table public.profiles
add constraint profiles_services_array
check (
  jsonb_typeof(services) = 'array'
);


alter table public.profiles
drop constraint if exists profiles_gallery_array;

alter table public.profiles
add constraint profiles_gallery_array
check (
  jsonb_typeof(gallery) = 'array'
);


alter table public.profiles
drop constraint if exists profiles_business_object;

alter table public.profiles
add constraint profiles_business_object
check (
  jsonb_typeof(business) = 'object'
);


-- ============================================================
-- PROFILE GALLERY LIMIT
-- ============================================================

create or replace function public.validate_profile_gallery()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  gallery_count integer;
  allowed_count integer;
begin
  gallery_count := jsonb_array_length(new.gallery);

  allowed_count :=
    case new.plan
      when 'Starter' then 4
      when 'Pro' then 12
      when 'Elite' then 12
      else 0
    end;

  if gallery_count > allowed_count then
    raise exception
      'Profile image limit exceeded for selected plan';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_profile_gallery_trigger
on public.profiles;

create trigger validate_profile_gallery_trigger
before insert or update of gallery, plan
on public.profiles
for each row
execute function public.validate_profile_gallery();


-- ============================================================
-- PROFILE JSON SIZE PROTECTION
-- ============================================================

alter table public.profiles
drop constraint if exists profiles_links_size;

alter table public.profiles
add constraint profiles_links_size
check (
  octet_length(links::text) <= 20000
);


alter table public.profiles
drop constraint if exists profiles_social_links_size;

alter table public.profiles
add constraint profiles_social_links_size
check (
  octet_length(social_links::text) <= 20000
);


-- ============================================================
-- PAYMENT SNAPSHOT CONSISTENCY
-- ============================================================

alter table public.payments
drop constraint if exists payment_snapshot_amount_valid;

alter table public.payments
add constraint payment_snapshot_amount_valid
check (
  amount_snapshot is null
  or amount_snapshot = amount
);


alter table public.payments
drop constraint if exists payment_snapshot_plan_valid;

alter table public.payments
add constraint payment_snapshot_plan_valid
check (
  plan_snapshot is null
  or plan_snapshot = plan
);


-- ============================================================
-- PROFILE EXPIRY CONSISTENCY
-- ============================================================

alter table public.profiles
drop constraint if exists profile_expiry_status_consistency;

alter table public.profiles
add constraint profile_expiry_status_consistency
check (
  (
    status in ('draft', 'pending')
    and expires_at is null
  )
  or
  status in ('active', 'expired')
);


-- ============================================================
-- FINAL PERFORMANCE INDEXES
-- ============================================================

create index if not exists profiles_active_expiry_idx
on public.profiles (
  status,
  expires_at
)
where status = 'active';


create index if not exists payments_profile_status_idx
on public.payments (
  profile_id,
  status
);


create index if not exists payments_type_status_idx
on public.payments (
  payment_type,
  status
);


-- ============================================================
-- INTERNAL TABLE ACCESS HARDENING
--
-- Correct actual table names from the current schema.
-- ============================================================

revoke all
on public.profiles
from anon;

revoke all
on public.payments
from anon;

revoke all
on public.admin_users
from anon;

revoke all
on public.support_requests
from anon;

revoke all
on public.audit_logs
from anon;

revoke all
on public.profile_view_events
from anon;


-- ============================================================
-- PUBLIC PROFILE PROJECTION
--
-- Public profile access happens through the controlled
-- projection created by migration 003/011.
-- ============================================================

grant select
on public.public_profiles
to anon, authenticated;


commit;