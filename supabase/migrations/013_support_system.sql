create extension if not exists pgcrypto;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  profile_id uuid
    references public.profiles(id)
    on delete set null,

  subject varchar(120) not null,
  message varchar(5000) not null,

  category varchar(40) not null default 'general'
    check (
      category in (
        'general',
        'profile',
        'payment',
        'renewal',
        'technical',
        'verification',
        'other'
      )
    ),

  status varchar(20) not null default 'open'
    check (
      status in (
        'open',
        'in_progress',
        'resolved',
        'closed'
      )
    ),

  admin_reply varchar(5000),

  replied_at timestamptz,
  resolved_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_support_requests_user
  on public.support_requests(user_id, created_at desc);

create index if not exists idx_support_requests_status
  on public.support_requests(status, created_at desc);

create index if not exists idx_support_requests_profile
  on public.support_requests(profile_id);

create or replace function public.set_support_request_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_support_requests_updated_at
on public.support_requests;

create trigger trg_support_requests_updated_at
before update on public.support_requests
for each row
execute function public.set_support_request_updated_at();

alter table public.support_requests enable row level security;

drop policy if exists "support_requests_select_own"
on public.support_requests;

create policy "support_requests_select_own"
on public.support_requests
for select
to authenticated
using (
  auth.uid() = user_id
);

drop policy if exists "support_requests_insert_own"
on public.support_requests;

create policy "support_requests_insert_own"
on public.support_requests
for insert
to authenticated
with check (
  auth.uid() = user_id
);

drop policy if exists "support_requests_update_own"
on public.support_requests;

create policy "support_requests_update_own"
on public.support_requests
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

revoke delete on public.support_requests from authenticated;