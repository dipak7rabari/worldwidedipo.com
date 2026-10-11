-- =========================================================
-- WORLDWIDE DIPO
-- 012 — ANALYTICS HARDENING
-- =========================================================

create extension if not exists pgcrypto;

create table if not exists public.profile_view_events (
  id uuid primary key default gen_random_uuid(),

  profile_id uuid not null
    references public.profiles(id)
    on delete cascade,

  viewed_at timestamptz not null default now(),

  device_type text not null default 'unknown'
    check (
      device_type in (
        'mobile',
        'tablet',
        'desktop',
        'unknown'
      )
    ),

  referrer_domain text null,

  /*
   * Privacy-safe anonymous session hash.
   * No raw IP address is stored.
   */
  visitor_hash text null,

  created_at timestamptz not null default now()
);

create index if not exists
  idx_profile_view_events_profile_time
on public.profile_view_events (
  profile_id,
  viewed_at desc
);

create index if not exists
  idx_profile_view_events_time
on public.profile_view_events (
  viewed_at desc
);

alter table public.profile_view_events
enable row level security;

alter table public.profile_view_events
force row level security;

grant select
on public.profile_view_events
to authenticated;

grant insert
on public.profile_view_events
to anon;

grant insert
on public.profile_view_events
to authenticated;

/*
 * Owners can read analytics belonging to their
 * own profile only.
 */
drop policy if exists
"profile_views_owner_select"
on public.profile_view_events;

create policy
"profile_views_owner_select"
on public.profile_view_events
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_view_events.profile_id
      and p.owner_id = auth.uid()
  )
);

/*
 * Direct browser inserts are restricted.
 * The API route will perform the controlled insert.
 *
 * No public SELECT policy.
 */
drop policy if exists
"profile_views_public_insert"
on public.profile_view_events;

create policy
"profile_views_public_insert"
on public.profile_view_events
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_view_events.profile_id
      and p.status = 'active'
  )
);

/*
 * Nobody gets direct UPDATE/DELETE access.
 */
revoke update, delete
on public.profile_view_events
from anon, authenticated;