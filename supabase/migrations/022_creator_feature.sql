
-- Worldwide DIPO Creator Feature
-- Migration: 022_creator_feature.sql
-- Run once in Supabase SQL Editor.

begin;

create table if not exists public.creator_pages (
  profile_id uuid primary key
    references public.profiles(id) on delete cascade,

  owner_id uuid not null
    references auth.users(id) on delete cascade,

  theme text not null default 'lavender'
    check (theme in (
      'lavender', 'rose', 'midnight', 'cream', 'ocean'
    )),

  instagram text not null default '',

  images jsonb not null default '[null,null]'::jsonb
    check (
      jsonb_typeof(images) = 'array'
      and jsonb_array_length(images) = 2
    ),

  links jsonb not null default '[]'::jsonb
    check (
      jsonb_typeof(links) = 'array'
      and jsonb_array_length(links) <= 15
    ),

  updated_at timestamptz not null default now()
);

create index if not exists creator_pages_owner_idx
on public.creator_pages(owner_id);

alter table public.creator_pages enable row level security;

revoke all on public.creator_pages
from public, anon, authenticated;

grant select on public.creator_pages
to anon, authenticated;

create policy "Creator page public active or owner"
on public.creator_pages
for select to anon, authenticated
using (
  owner_id = (select auth.uid())
  or exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.status = 'active'
      and (
        p.expires_at is null
        or p.expires_at > now()
      )
  )
);

-- Separate public bucket for creator's two images.

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'creator-media',
  'creator-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types =
    array['image/jpeg', 'image/png', 'image/webp'];

create policy "Creator media upload own"
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'creator-media'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] =
      (select auth.uid()::text)
  and (storage.foldername(name))[2] = 'creator'
  and storage.extension(name) in (
    'jpg', 'jpeg', 'png', 'webp'
  )
);

create policy "Creator media delete own"
on storage.objects
for delete to authenticated
using (
  bucket_id = 'creator-media'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] =
      (select auth.uid()::text)
);

create policy "Creator media select"
on storage.objects
for select to anon, authenticated
using (bucket_id = 'creator-media');

-- Save creator links with owner and plan validation.

create or replace function public.save_my_creator_page(
  p_theme text,
  p_instagram text,
  p_links jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_limit int;
  v_item jsonb;
  v_result jsonb;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_profile
  from public.profiles
  where owner_id = v_user
  for update;

  if not found
     or v_profile.status <> 'active'
     or (
       v_profile.expires_at is not null
       and v_profile.expires_at <= now()
     )
  then
    raise exception 'ACTIVE_PLAN_REQUIRED';
  end if;

  v_limit := case lower(v_profile.plan)
    when 'elite' then 15
    when 'pro' then 10
    else 5
  end;

  if p_theme not in (
    'lavender', 'rose', 'midnight', 'cream', 'ocean'
  ) then
    raise exception 'INVALID_THEME';
  end if;

  if length(coalesce(p_instagram, '')) > 30
     or coalesce(p_instagram, '') !~
       '^[A-Za-z0-9._]*$'
  then
    raise exception 'INVALID_INSTAGRAM';
  end if;

  if p_links is null
     or jsonb_typeof(p_links) <> 'array'
     or jsonb_array_length(p_links) > v_limit
  then
    raise exception 'LINK_LIMIT';
  end if;

  for v_item in
    select value from jsonb_array_elements(p_links)
  loop
    if jsonb_typeof(v_item) <> 'object'
       or length(coalesce(v_item->>'title', ''))
          not between 1 and 90
       or length(coalesce(v_item->>'url', ''))
          not between 8 and 2048
       or (v_item->>'url') !~
          '^https?://[^[:space:]]+$'
    then
      raise exception 'INVALID_LINK';
    end if;
  end loop;

  insert into public.creator_pages (
    profile_id, owner_id, theme, instagram, links
  )
  values (
    v_profile.id, v_user,
    p_theme, p_instagram, p_links
  )
  on conflict (profile_id) do update set
    theme = excluded.theme,
    instagram = excluded.instagram,
    links = excluded.links,
    updated_at = now()
  where public.creator_pages.owner_id = v_user;

  select to_jsonb(c)
  into v_result
  from public.creator_pages c
  where c.profile_id = v_profile.id;

  return v_result;
end;
$$;

-- Attach, replace or remove creator images.

create or replace function public.set_my_creator_image(
  p_slot int,
  p_path text,
  p_url text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_page public.creator_pages%rowtype;
  v_old jsonb;
  v_images jsonb;
  v_path text;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_slot not in (0, 1) then
    raise exception 'INVALID_SLOT';
  end if;

  select *
  into v_profile
  from public.profiles
  where owner_id = v_user
  for update;

  if not found
     or v_profile.status <> 'active'
     or (
       v_profile.expires_at is not null
       and v_profile.expires_at <= now()
     )
  then
    raise exception 'ACTIVE_PLAN_REQUIRED';
  end if;

  if p_path is not null then
    if p_path !~ (
      '^' || v_user::text ||
      '/creator/[0-9a-f-]+\.(jpg|jpeg|png|webp)$'
    )
    or p_url is null
    or p_url !~
      '^https://[^/]+/storage/v1/object/public/creator-media/'
    or split_part(
      p_url,
      '/storage/v1/object/public/creator-media/',
      2
    ) <> p_path
    or not exists (
      select 1
      from storage.objects
      where bucket_id = 'creator-media'
        and name = p_path
        and owner_id = v_user::text
    )
    then
      raise exception 'INVALID_MEDIA';
    end if;

  elsif p_url is not null then
    raise exception 'INVALID_MEDIA';
  end if;

  insert into public.creator_pages (
    profile_id, owner_id
  )
  values (
    v_profile.id, v_user
  )
  on conflict (profile_id) do nothing;

  select *
  into v_page
  from public.creator_pages
  where profile_id = v_profile.id
    and owner_id = v_user
  for update;

  v_images := v_page.images;
  v_old := v_images->p_slot;
  v_path := v_old->>'path';

  v_images := jsonb_set(
    v_images,
    array[p_slot::text],
    case
      when p_path is null then 'null'::jsonb
      else jsonb_build_object(
        'path', p_path,
        'url', p_url
      )
    end
  );

  update public.creator_pages
  set
    images = v_images,
    updated_at = now()
  where profile_id = v_profile.id
    and owner_id = v_user;

  return jsonb_build_object(
    'images', v_images,
    'old_path', v_path
  );
end;
$$;

revoke all
on function public.save_my_creator_page(
  text, text, jsonb
)
from public, anon;

revoke all
on function public.set_my_creator_image(
  int, text, text
)
from public, anon;

grant execute
on function public.save_my_creator_page(
  text, text, jsonb
)
to authenticated;

grant execute
on function public.set_my_creator_image(
  int, text, text
)
to authenticated;

commit;
