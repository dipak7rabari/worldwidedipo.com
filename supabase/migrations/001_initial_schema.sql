create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),

  owner_id uuid not null
    references auth.users(id)
    on delete restrict,

  name text not null,
  slug text not null unique,
  profession text not null,

  headline text,
  bio text,

  avatar_url text,

  location text,

  phone text,
  whatsapp text,

  category text,

  about text,

  links jsonb not null default '{}'::jsonb,
  social_links jsonb not null default '{}'::jsonb,

  skills jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,

  business jsonb not null default '{}'::jsonb,

  plan text not null default 'Starter'
    check (
      plan in ('Starter', 'Pro', 'Elite')
    ),

  status text not null default 'draft'
    check (
      status in (
        'draft',
        'pending',
        'active',
        'expired'
      )
    ),

  expires_at timestamptz,

  deletion_scheduled_at timestamptz,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint profiles_owner_unique
    unique (owner_id),

  constraint profiles_name_length
    check (char_length(btrim(name)) between 2 and 60),

  constraint profiles_slug_format
    check (
      slug ~ '^[a-z0-9-]{3,30}$'
    ),

  constraint profiles_profession_length
    check (
      char_length(btrim(profession)) between 2 and 60
    ),

  constraint profiles_headline_length
    check (
      headline is null
      or char_length(headline) <= 120
    ),

  constraint profiles_bio_length
    check (
      bio is null
      or char_length(bio) <= 250
    ),

  constraint profiles_about_length
    check (
      about is null
      or char_length(about) <= 3000
    ),

  constraint profiles_avatar_https
    check (
      avatar_url is null
      or avatar_url ~ '^https://'
    ),

  constraint profiles_links_object
    check (
      jsonb_typeof(links) = 'object'
    ),

  constraint profiles_social_links_object
    check (
      jsonb_typeof(social_links) = 'object'
    ),

  constraint profiles_skills_array
    check (
      jsonb_typeof(skills) = 'array'
    ),

  constraint profiles_services_array
    check (
      jsonb_typeof(services) = 'array'
    ),

  constraint profiles_experience_array
    check (
      jsonb_typeof(experience) = 'array'
    ),

  constraint profiles_education_array
    check (
      jsonb_typeof(education) = 'array'
    ),

  constraint profiles_projects_array
    check (
      jsonb_typeof(projects) = 'array'
    ),

  constraint profiles_gallery_array
    check (
      jsonb_typeof(gallery) = 'array'
    ),

  constraint profiles_business_object
    check (
      jsonb_typeof(business) = 'object'
    )
);

create index if not exists idx_profiles_status
  on public.profiles(status);

create index if not exists idx_profiles_expires_at
  on public.profiles(expires_at);

create index if not exists idx_profiles_created_at
  on public.profiles(created_at desc);

create index if not exists idx_profiles_slug
  on public.profiles(slug);