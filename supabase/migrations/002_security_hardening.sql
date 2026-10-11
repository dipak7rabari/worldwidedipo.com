alter table public.profiles
enable row level security;

revoke all
on public.profiles
from anon;

revoke all
on public.profiles
from authenticated;

grant select, insert, update
on public.profiles
to authenticated;

create policy "profile owner can read own profile"
on public.profiles
for select
to authenticated
using (
  auth.uid() = owner_id
);

create policy "profile owner can create own profile"
on public.profiles
for insert
to authenticated
with check (
  auth.uid() = owner_id
);

create policy "profile owner can update own profile"
on public.profiles
for update
to authenticated
using (
  auth.uid() = owner_id
)
with check (
  auth.uid() = owner_id
);