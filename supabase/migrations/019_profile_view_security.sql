/*
  019_profile_view_security.sql

  Purpose:
  - Prevent direct client-side INSERTs into profile_view_events.
  - Keep analytics recording available through trusted server-side code.
  - Preserve existing profile-view data and table structure.
  - Do not modify unrelated analytics permissions.
*/

begin;

-- ---------------------------------------------------------------------------
-- 1. Remove direct INSERT privileges from browser-facing roles.
-- ---------------------------------------------------------------------------

revoke insert on table public.profile_view_events from anon;
revoke insert on table public.profile_view_events from authenticated;


-- ---------------------------------------------------------------------------
-- 2. Remove any existing INSERT policies that allow browser-side writes.
--
-- We intentionally remove only policies on this table whose command is INSERT.
-- SELECT/UPDATE/DELETE policies, if any, are left untouched.
-- ---------------------------------------------------------------------------

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profile_view_events'
      and cmd = 'INSERT'
  loop
    execute format(
      'drop policy if exists %I on public.profile_view_events',
      policy_record.policyname
    );
  end loop;
end
$$;


-- ---------------------------------------------------------------------------
-- 3. Keep the table protected from browser roles.
--
-- The server-side application can use the privileged server client when
-- recording a validated profile view.
-- ---------------------------------------------------------------------------

revoke all
on table public.profile_view_events
from anon;

revoke all
on table public.profile_view_events
from authenticated;


-- ---------------------------------------------------------------------------
-- 4. Explicitly keep the table available to the server-side service role.
--
-- This does not expose anything to the browser because the service role
-- credentials never belong in NEXT_PUBLIC_* environment variables.
-- ---------------------------------------------------------------------------

grant insert
on table public.profile_view_events
to service_role;


-- ---------------------------------------------------------------------------
-- 5. Documentation
-- ---------------------------------------------------------------------------

comment on table public.profile_view_events is
  'Profile view analytics. Browser clients must not write directly; validated server-side analytics endpoints record views.';


commit;