-- ============================================================
-- WORLDWIDE DIPO
-- Migration 018
-- Admin Email Allowlist Security Hardening
-- ============================================================
--
-- IMPORTANT
-- ------------------------------------------------------------
-- Migration 017 already exists in this project:
--
--   017_payment_lifecycle_hardening.sql
--
-- Therefore this security migration intentionally uses:
--
--   018_admin_allowlist_security.sql
--
-- DO NOT rename this to 017 or migration ordering will collide.
--
-- SECURITY MODEL
-- ------------------------------------------------------------
-- Admin access requires ALL relevant checks:
--
-- 1. Authenticated Supabase user
-- 2. Exact email exists in the server-controlled allowlist
-- 3. Active admin_users record
-- 4. Allowed admin role
-- 5. AAL2 for sensitive admin access
-- 6. AAL2 + admin/super_admin for payment management
--
-- The browser cannot modify the allowlist.
-- The browser cannot insert/update/delete admin_users.
--
-- ============================================================

begin;


-- ============================================================
-- 1. SERVER-CONTROLLED ADMIN EMAIL ALLOWLIST
-- ============================================================
--
-- This table is intentionally separate from admin_users.
--
-- admin_users answers:
--   "What role does this authenticated user have?"
--
-- admin_allowlist answers:
--   "Is this email even allowed to participate in
--    the Worldwide DIPO admin system?"
--
-- This gives defense-in-depth against accidental or
-- unauthorized admin_users records.
-- ============================================================

create table if not exists public.admin_allowlist (
  email text primary key,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint admin_allowlist_email_length
    check (
      length(trim(email)) between 3 and 320
    ),

  constraint admin_allowlist_email_lowercase
    check (
      email = lower(trim(email))
    ),

  constraint admin_allowlist_email_no_whitespace
    check (
      email !~ '[[:space:]]'
    ),

  constraint admin_allowlist_email_basic_format
    check (
      position('@' in email) > 1
      and position('@' in email) < length(email)
    )
);


-- ============================================================
-- 2. ADMIN ALLOWLIST INDEX
-- ============================================================

create index if not exists idx_admin_allowlist_active
on public.admin_allowlist(is_active);


-- ============================================================
-- 3. ENABLE RLS
-- ============================================================

alter table public.admin_allowlist
enable row level security;


-- ============================================================
-- 4. REMOVE ALL CLIENT ACCESS
-- ============================================================
--
-- No browser user should ever read or modify the allowlist.
--
-- SECURITY DEFINER functions below are the only intended
-- database-side consumers.
-- ============================================================

revoke all
on public.admin_allowlist
from anon, authenticated;


revoke all
on public.admin_allowlist
from public;


-- ============================================================
-- 5. REMOVE POSSIBLE CLIENT POLICIES
-- ============================================================

drop policy if exists "Admins can view allowlist"
on public.admin_allowlist;

drop policy if exists "Admins can manage allowlist"
on public.admin_allowlist;

drop policy if exists "Allowlisted admins can view allowlist"
on public.admin_allowlist;


-- ============================================================
-- 6. SEED THE AUTHORITATIVE ADMIN EMAILS
-- ============================================================
--
-- These values match the existing application-level
-- authorization configuration.
--
-- Email comparison is exact after lowercase normalization.
--
-- Do NOT add arbitrary emails here from client-side code.
-- ============================================================

insert into public.admin_allowlist (
  email,
  is_active
)
values
  (
    'dipak7rabari@gmail.com',
    true
  ),
  (
    'xdipak63@gmail.com',
    true
  )
on conflict (email)
do update
set
  is_active = excluded.is_active,
  updated_at = now();


-- ============================================================
-- 7. AUTHORITATIVE EMAIL CHECK
-- ============================================================
--
-- SECURITY DEFINER:
-- The authenticated browser does not receive direct table
-- access. The function performs the lookup internally.
--
-- auth.uid() is never supplied by the client.
-- ============================================================

create or replace function public.current_user_email_is_admin_allowed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_allowlist aa
    join auth.users u
      on lower(trim(u.email)) = aa.email
    where u.id = (select auth.uid())
      and aa.is_active = true
  );
$$;


-- ============================================================
-- 8. LOCK FUNCTION EXECUTION
-- ============================================================

revoke execute
on function public.current_user_email_is_admin_allowed()
from public, anon;


grant execute
on function public.current_user_email_is_admin_allowed()
to authenticated;


-- ============================================================
-- 9. HARDEN ACTIVE ADMIN CHECK
-- ============================================================
--
-- Active admin requires:
--
-- - authenticated user
-- - allowlisted email
-- - active admin_users record
-- - supported role
--
-- AAL2 is intentionally NOT required here because this
-- function is also used for entering the admin security/MFA
-- setup flow.
-- ============================================================

create or replace function public.current_user_is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and public.current_user_email_is_admin_allowed()
    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and is_active = true
        and role in (
          'super_admin',
          'admin',
          'support'
        )
    );
$$;


-- ============================================================
-- 10. HARDEN GENERAL ADMIN CHECK
-- ============================================================
--
-- Sensitive admin data requires AAL2.
--
-- Requirements:
--   - authenticated
--   - allowlisted email
--   - active admin record
--   - supported role
--   - AAL2
-- ============================================================

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null

    and (select auth.jwt() ->> 'aal') = 'aal2'

    and public.current_user_email_is_admin_allowed()

    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and is_active = true
        and role in (
          'super_admin',
          'admin',
          'support'
        )
    );
$$;


-- ============================================================
-- 11. HARDEN PAYMENT ADMIN CHECK
-- ============================================================
--
-- Payment management requires:
--
--   authenticated
--   allowlisted email
--   active admin
--   AAL2
--   super_admin/admin role
--
-- support is deliberately excluded.
-- ============================================================

create or replace function public.current_user_can_manage_payments()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null

    and (select auth.jwt() ->> 'aal') = 'aal2'

    and public.current_user_email_is_admin_allowed()

    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and is_active = true
        and role in (
          'super_admin',
          'admin'
        )
    );
$$;


-- ============================================================
-- 12. RE-LOCK FUNCTION EXECUTION
-- ============================================================

revoke execute
on function public.current_user_is_active_admin()
from public, anon;

grant execute
on function public.current_user_is_active_admin()
to authenticated;


revoke execute
on function public.current_user_is_admin()
from public, anon;

grant execute
on function public.current_user_is_admin()
to authenticated;


revoke execute
on function public.current_user_can_manage_payments()
from public, anon;

grant execute
on function public.current_user_can_manage_payments()
to authenticated;


-- ============================================================
-- 13. HARDEN ADMIN_USERS
-- ============================================================
--
-- Existing migrations already prevent browser INSERT/UPDATE/
-- DELETE. Repeat the revocation here as defense-in-depth.
-- ============================================================

revoke
  insert,
  update,
  delete
on public.admin_users
from anon, authenticated;


-- ============================================================
-- 14. ADMIN_USERS RLS
-- ============================================================
--
-- An admin may only see their own active admin record.
--
-- The allowlist itself remains completely hidden.
-- ============================================================

drop policy if exists "Admins can view own admin record"
on public.admin_users;


create policy "Admins can view own active admin record"
on public.admin_users
for select
to authenticated
using (
  user_id = (select auth.uid())
  and is_active = true
  and public.current_user_email_is_admin_allowed()
);


-- ============================================================
-- 15. ADMIN ALLOWLIST SECURITY DOCUMENTATION
-- ============================================================

comment on table public.admin_allowlist
is
'Worldwide DIPO server-controlled administrator email allowlist. Client read/write access is disabled. Admin authorization functions use this table as a defense-in-depth identity boundary.';


comment on column public.admin_allowlist.email
is
'Normalized lowercase administrator email. Must exactly match the authenticated Supabase user email.';


comment on column public.admin_allowlist.is_active
is
'Controls whether the email is currently authorized to participate in the admin system.';


-- ============================================================
-- 16. SECURITY FUNCTION DOCUMENTATION
-- ============================================================

comment on function public.current_user_email_is_admin_allowed()
is
'Returns true only when the authenticated Supabase user email exactly matches an active server-controlled Worldwide DIPO admin allowlist entry.';


comment on function public.current_user_is_active_admin()
is
'Returns true only for an authenticated user whose email is allowlisted and who has an active supported admin_users role.';


comment on function public.current_user_is_admin()
is
'Returns true only for an allowlisted active Worldwide DIPO administrator with a supported role and Supabase AAL2 authentication.';


comment on function public.current_user_can_manage_payments()
is
'Returns true only for an allowlisted active Worldwide DIPO super_admin/admin with Supabase AAL2 authentication.';


-- ============================================================
-- 17. FINAL SECURITY ASSERTION
-- ============================================================
--
-- The following authorization layers now work together:
--
-- Application:
--   exact email allowlist
--   admin_users
--   role
--   AAL2
--
-- Database:
--   admin_allowlist
--   auth.uid()
--   auth.jwt() AAL2
--   admin_users
--   role
--   RLS
--   SECURITY DEFINER RPC authorization
--
-- Therefore removing/hiding an admin from the database
-- allowlist immediately invalidates database-level admin
-- authorization even if an old application session or
-- stale admin_users record exists.
-- ============================================================

commit;


-- ============================================================
-- END OF MIGRATION 018
-- ============================================================