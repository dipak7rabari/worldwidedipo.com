-- ============================================================
-- Worldwide DIPO
-- Migration 009
-- Secure Profile Media Storage
-- ============================================================

begin;

-- ============================================================
-- 1. PUBLIC PROFILE MEDIA BUCKET
-- ============================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'profile-media',
  'profile-media',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id)
do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ];


-- ============================================================
-- 2. STORAGE INDEX
-- ============================================================

create index if not exists idx_storage_objects_owner_bucket
on storage.objects(owner_id, bucket_id);


-- ============================================================
-- 3. SELECT POLICY
--
-- Public profile media can be downloaded publicly.
--
-- Important:
-- Upload metadata also needs SELECT permission for the
-- authenticated uploader because Supabase Storage can use
-- INSERT + RETURNING internally.
-- ============================================================

drop policy if exists
"Public can view profile media"
on storage.objects;

create policy
"Public can view profile media"
on storage.objects
for select
to public
using (
  bucket_id = 'profile-media'
);


-- ============================================================
-- 4. INSERT POLICY
--
-- Only authenticated users.
--
-- Object path MUST begin with their own auth.uid().
--
-- Example:
--
-- USER_UUID/avatar/file.webp
-- USER_UUID/gallery/file.webp
-- ============================================================

drop policy if exists
"Users can upload own profile media"
on storage.objects;

create policy
"Users can upload own profile media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-media'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1]
      = (select auth.uid()::text)
  and storage.extension(name) in (
    'jpg',
    'jpeg',
    'png',
    'webp'
  )
);


-- ============================================================
-- 5. UPDATE POLICY
--
-- Users can only update their own media.
-- ============================================================

drop policy if exists
"Users can update own profile media"
on storage.objects;

create policy
"Users can update own profile media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-media'
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'profile-media'
  and owner_id = (select auth.uid()::text)
);


-- ============================================================
-- 6. DELETE POLICY
-- ============================================================

drop policy if exists
"Users can delete own profile media"
on storage.objects;

create policy
"Users can delete own profile media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-media'
  and owner_id = (select auth.uid()::text)
);


commit;