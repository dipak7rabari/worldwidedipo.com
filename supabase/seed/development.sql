-- ============================================================
-- WORLDWIDE DIPO
-- Development Seed
-- ============================================================
--
-- Purpose:
--   Safe, deterministic, idempotent development seed data.
--
-- Rules:
--   - Never create fake auth.users records.
--   - Never create fake payments.
--   - Never create fake profiles without a real auth owner.
--   - Never weaken RLS or security policies.
--   - Safe to execute repeatedly.
-- ============================================================

begin;

set local lock_timeout = '5s';
set local statement_timeout = '30s';


-- ============================================================
-- 1. RESERVED DIPO SLUGS
-- ============================================================
--
-- These routes must never be claimed by a public DIPO profile.
--
-- The same values are also protected by migration
-- 010_final_constraints.sql. ON CONFLICT keeps this seed
-- completely idempotent.
-- ============================================================

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


-- ============================================================
-- 2. ADMIN EMAIL ALLOWLIST
-- ============================================================
--
-- The authoritative admin allowlist is intentionally seeded
-- here as well as protected by migration 018.
--
-- This does NOT create an auth account.
-- An actual Supabase Auth user must still exist before the
-- account can authenticate.
--
-- Email normalization matches the database constraints:
--   lowercase
--   trimmed
--   no whitespace
-- ============================================================

insert into public.admin_allowlist (
  email,
  is_active
)
values
  ('dipak7rabari@gmail.com', true),
  ('xdipak63@gmail.com', true)
on conflict (email)
do update
set
  is_active = excluded.is_active,
  updated_at = now();


-- ============================================================
-- 3. DEVELOPMENT DATA POLICY
-- ============================================================
--
-- Profiles, payments, support requests, analytics events and
-- audit records are intentionally NOT seeded here.
--
-- Reason:
--
--   profiles.owner_id -> auth.users(id)
--   payments.profile_id -> profiles(id)
--   support_requests.user_id -> auth.users(id)
--   analytics -> real profiles
--   audit_logs -> real authenticated actors
--
-- Creating synthetic rows would either:
--
--   1. require bypassing the real authentication model,
--   2. create misleading dashboard/payment data, or
--   3. weaken the production security boundary.
--
-- Real development users should be created through Supabase
-- Auth, then their application data should be created through
-- the same application flows used in production.


-- ============================================================
-- 4. FINAL SEED ASSERTIONS
-- ============================================================
--
-- Fail loudly if critical static security data could not be
-- established.
-- ============================================================

do $$
begin

  if not exists (
    select 1
    from public.reserved_slugs
    where slug = 'admin'
  ) then
    raise exception
      'Development seed failed: reserved slug "admin" is missing';
  end if;


  if not exists (
    select 1
    from public.admin_allowlist
    where email = 'dipak7rabari@gmail.com'
      and is_active = true
  ) then
    raise exception
      'Development seed failed: primary admin allowlist entry is missing';
  end if;


  if not exists (
    select 1
    from public.admin_allowlist
    where email = 'xdipak63@gmail.com'
      and is_active = true
  ) then
    raise exception
      'Development seed failed: secondary admin allowlist entry is missing';
  end if;

end;
$$;


commit;

-- ============================================================
-- END OF DEVELOPMENT SEED
-- ============================================================