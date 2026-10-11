begin;

-- Save uploaded media to the authenticated owner's profile.
-- Row locking prevents concurrent gallery uploads from overwriting each other.

create or replace function public.save_my_profile_media(
  p_type text,
  p_path text,
  p_url text
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_gallery jsonb;
  v_avatar text;
  v_limit integer;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED'
      using errcode = '42501';
  end if;

  if p_type is null or p_type not in ('avatar', 'gallery') then
    raise exception 'INVALID_MEDIA_TYPE';
  end if;

  if p_path is null
     or p_path !~ (
       '^' || v_user::text || '/' || p_type ||
       '/[0-9a-f-]+\.(jpg|jpeg|png|webp)$'
     )
  then
    raise exception 'INVALID_MEDIA_PATH'
      using errcode = '42501';
  end if;

  if p_url is null
     or p_url !~ '^https://[^/]+/storage/v1/object/public/profile-media/'
     or split_part(
       p_url,
       '/storage/v1/object/public/profile-media/',
       2
     ) <> p_path
  then
    raise exception 'INVALID_MEDIA_URL';
  end if;

  if not exists (
    select 1
    from storage.objects
    where bucket_id = 'profile-media'
      and name = p_path
  ) then
    raise exception 'MEDIA_NOT_UPLOADED';
  end if;

  select *
  into v_profile
  from public.profiles
  where owner_id = v_user
  for update;

  if not found then
    raise exception 'PROFILE_NOT_FOUND';
  end if;

  if v_profile.status not in ('draft', 'active') then
    raise exception 'PROFILE_MEDIA_LOCKED';
  end if;

  v_gallery := coalesce(v_profile.gallery, '[]'::jsonb);
  v_avatar := v_profile.avatar_url;

  v_limit := case lower(v_profile.plan)
    when 'starter' then 4
    when 'pro' then 12
    when 'elite' then 12
    else 0
  end;

  if p_type = 'gallery' then
    -- Retrying the same object must not append it twice.
    if not exists (
      select 1
      from jsonb_array_elements(v_gallery) item
      where item->>'path' = p_path
         or item->>'url' = p_url
         or item = to_jsonb(p_url)
    ) then
      if jsonb_array_length(v_gallery) >= v_limit then
        raise exception 'GALLERY_LIMIT_REACHED';
      end if;

      v_gallery := v_gallery || jsonb_build_array(
        jsonb_build_object(
          'path', p_path,
          'url', p_url
        )
      );
    end if;
  else
    v_avatar := p_url;
  end if;

  update public.profiles
  set
    avatar_url = v_avatar,
    gallery = v_gallery,
    updated_at = now()
  where id = v_profile.id
    and owner_id = v_user;

  if not found then
    raise exception 'PROFILE_UPDATE_DENIED'
      using errcode = '42501';
  end if;

  return jsonb_build_object(
    'avatar_url', v_avatar,
    'gallery', v_gallery,
    'previous_avatar_url', v_profile.avatar_url
  );
end;
$$;

revoke all
on function public.save_my_profile_media(text, text, text)
from public, anon;

grant execute
on function public.save_my_profile_media(text, text, text)
to authenticated;

-- Normalize existing Explore category names.

create or replace function public.dipo_explore_category(
  p_value text
)
returns text
language sql
immutable
set search_path = ''
as $$
  select case normalized
    when 'all' then ''
    when 'creators' then 'creator'
    when 'businesses' then 'business'
    when 'onlinebusinesses' then 'onlinebusiness'
    when 'shops' then 'shop'
    when 'brands' then 'brand'
    when 'services' then 'service'
    when 'professionals' then 'professional'
    when 'educations' then 'education'
    when 'students' then 'student'
    else normalized
  end
  from (
    select regexp_replace(
      lower(coalesce(p_value, '')),
      '[^a-z0-9]+',
      '',
      'g'
    ) normalized
  ) s;
$$;

-- New RPC preserves existing callers of get_explore_profiles.
-- Plans are ranked before pagination.

create or replace function public.get_explore_profiles_v2(
  p_query text default null,
  p_category text default null,
  p_limit integer default 24,
  p_offset integer default 0
)
returns table (
  name text,
  slug text,
  profession text,
  headline text,
  bio text,
  avatar_url text,
  location text,
  category text,
  updated_at timestamptz,
  plan text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.name::text,
    p.slug::text,
    p.profession::text,
    p.headline::text,
    p.bio::text,
    p.avatar_url::text,
    p.location::text,
    p.category::text,
    p.updated_at,
    p.plan::text
  from public.profiles p
  where p.status = 'active'
    and p.show_in_explore = true
    and (
      p.expires_at is null
      or p.expires_at > now()
    )
    and (
      nullif(btrim(p_query), '') is null
      or concat_ws(
        ' ',
        p.name,
        p.profession,
        p.headline,
        p.bio,
        p.location,
        p.category
      ) ilike '%' || left(btrim(p_query), 80) || '%'
    )
    and (
      public.dipo_explore_category(p_category) = ''
      or public.dipo_explore_category(p.category)
         = public.dipo_explore_category(p_category)
    )
  order by
    case lower(p.plan)
      when 'elite' then 0
      when 'pro' then 1
      else 2
    end,
    p.updated_at desc,
    p.id desc
  limit greatest(
    1,
    least(coalesce(p_limit, 24), 60)
  )
  offset greatest(
    0,
    least(coalesce(p_offset, 0), 100000)
  );
$$;

revoke all
on function public.get_explore_profiles_v2(
  text, text, integer, integer
)
from public;

grant execute
on function public.get_explore_profiles_v2(
  text, text, integer, integer
)
to anon, authenticated;

commit;