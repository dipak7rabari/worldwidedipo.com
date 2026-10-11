-- ============================================================
-- WORLDWIDE DIPO
-- Supabase Function
-- record_profile_view.sql
--
-- Purpose:
--   Record one privacy-safe public profile view.
--
-- Security:
--   - Publicly callable because profile pages are public
--   - Only active + non-expired profiles accepted
--   - No raw IP address stored
--   - No raw user-agent stored
--   - Visitor hash must be SHA-256 style hex
--   - Referrer reduced to hostname only
--   - Device type allowlisted
--   - Input lengths bounded server-side
--   - No profile ownership information exposed
--   - SECURITY DEFINER with locked search_path
-- ============================================================

begin;


-- ============================================================
-- 1. AUTHORITATIVE PROFILE VIEW FUNCTION
-- ============================================================

create or replace function public.record_profile_view(
  p_profile_id uuid,
  p_viewer_hash text default null,
  p_referrer text default null,
  p_user_agent text default null,
  p_country_code text default null,
  p_device_type text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile_status text;
  v_profile_expiry timestamptz;

  v_device_type text;
  v_referrer_domain text;
  v_visitor_hash text;
begin

  -- ==========================================================
  -- 2. BASIC INPUT GUARD
  -- ==========================================================

  if p_profile_id is null then
    return;
  end if;


  -- ==========================================================
  -- 3. SERVER-SIDE NORMALIZATION
  --
  -- Do not trust the API/client validation layer.
  -- This RPC must remain safe when called directly.
  -- ==========================================================

  v_device_type :=
    case lower(btrim(coalesce(p_device_type, '')))
      when 'mobile' then 'mobile'
      when 'tablet' then 'tablet'
      when 'desktop' then 'desktop'
      else 'unknown'
    end;


  -- ==========================================================
  -- 4. PRIVACY-SAFE VISITOR HASH
  --
  -- Only accept a SHA-256-style hexadecimal identifier.
  -- Raw IP addresses and arbitrary identifiers are rejected.
  -- ==========================================================

  if p_viewer_hash is not null
     and btrim(p_viewer_hash) ~ '^[0-9a-fA-F]{64}$'
  then
    v_visitor_hash :=
      lower(btrim(p_viewer_hash));
  else
    v_visitor_hash := null;
  end if;


  -- ==========================================================
  -- 5. REFERRER NORMALIZATION
  --
  -- Store hostname only.
  --
  -- Example:
  --   https://www.google.com/search?q=test
  --
  -- becomes:
  --   google.com
  --
  -- Query strings, paths and tokens are never persisted.
  -- ==========================================================

  if p_referrer is not null
     and btrim(p_referrer) <> ''
  then
    begin

      v_referrer_domain :=
        lower(
          regexp_replace(
            split_part(
              split_part(
                regexp_replace(
                  btrim(p_referrer),
                  '^[a-zA-Z][a-zA-Z0-9+.-]*://',
                  ''
                ),
                '/',
                1
              ),
              '?',
              1
            ),
            '^www\.',
            ''
          )
        );

      -- ------------------------------------------------------
      -- Reject malformed / oversized / suspicious values.
      -- ------------------------------------------------------

      if length(v_referrer_domain) = 0
         or length(v_referrer_domain) > 120
         or v_referrer_domain !~
            '^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?(?::[0-9]{1,5})?$'
      then
        v_referrer_domain := null;
      end if;

    exception
      when others then
        v_referrer_domain := null;
    end;

  else
    v_referrer_domain := null;
  end if;


  -- ==========================================================
  -- 6. USER AGENT / COUNTRY
  --
  -- These values intentionally are NOT stored in the hardened
  -- analytics table.
  --
  -- This keeps the function compatible with the older RPC
  -- signature without reintroducing unnecessary personal or
  -- fingerprinting data.
  -- ==========================================================

  -- p_user_agent intentionally ignored.
  -- p_country_code intentionally ignored.


  -- ==========================================================
  -- 7. AUTHORITATIVE PROFILE STATE CHECK
  --
  -- A view only counts while the public profile is:
  --
  --   status = active
  --   expires_at > now()
  --
  -- The caller cannot override these values.
  -- ==========================================================

  select
    p.status,
    p.expires_at
  into
    v_profile_status,
    v_profile_expiry
  from public.profiles p
  where p.id = p_profile_id
  limit 1;


  if not found then
    return;
  end if;


  if v_profile_status <> 'active' then
    return;
  end if;


  if v_profile_expiry is null
     or v_profile_expiry <= now()
  then
    return;
  end if;


  -- ==========================================================
  -- 8. RECORD PRIVACY-SAFE EVENT
  -- ==========================================================

  insert into public.profile_view_events (
    profile_id,
    viewed_at,
    device_type,
    referrer_domain,
    visitor_hash,
    created_at
  )
  values (
    p_profile_id,
    now(),
    v_device_type,
    v_referrer_domain,
    v_visitor_hash,
    now()
  );


exception
  when foreign_key_violation then
    -- Profile disappeared between validation and insert.
    -- Analytics must never break the public page.
    return;

  when others then
    -- Analytics is non-critical infrastructure.
    -- Never expose database internals through this public RPC.
    return;

end;
$$;


-- ============================================================
-- 9. FUNCTION PRIVILEGES
--
-- Public profiles need analytics recording, therefore anon and
-- authenticated users may execute the function.
--
-- Direct table access remains governed by RLS.
-- ============================================================

revoke all
on function public.record_profile_view(
  uuid,
  text,
  text,
  text,
  text,
  text
)
from public;


grant execute
on function public.record_profile_view(
  uuid,
  text,
  text,
  text,
  text,
  text
)
to anon;


grant execute
on function public.record_profile_view(
  uuid,
  text,
  text,
  text,
  text,
  text
)
to authenticated;


-- ============================================================
-- 10. DOCUMENTATION
-- ============================================================

comment on function public.record_profile_view(
  uuid,
  text,
  text,
  text,
  text,
  text
)
is
'Worldwide DIPO privacy-safe public profile analytics RPC. Accepts the legacy compatible signature but records only into profile_view_events. Validates active/non-expired profile state server-side, normalizes device/referrer/visitor hash, never stores raw user-agent or country data, and fails silently so analytics can never break public profile rendering.';


commit;


-- ============================================================
-- END
-- ============================================================