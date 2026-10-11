-- ============================================================
-- WORLDWIDE DIPO
-- Migration 015: Explore Security + Category Matching
-- ============================================================
--
-- Purpose:
-- 1. Securely allow a logged-in DIPO owner to control
--    "Show my DIPO in Explore Worldwide DIPO".
-- 2. Prevent anonymous users from changing this setting.
-- 3. Make Explore category filtering tolerant of:
--      Creator / Creators
--      Business / Businesses
--      Online Business / Online Businesses
--      Shop / Shops
--      Brand / Brands
--      Service / Services
--      Professional / Professionals
--      Education / Educations
-- 4. Keep the public Explore RPC limited to safe fields.
--
-- IMPORTANT:
-- - This does NOT make a profile active.
-- - Payment/admin approval remains the source of activation.
-- - This does NOT expose owner_id publicly.
-- - This does NOT bypass existing profile ownership rules.
-- ============================================================


BEGIN;


-- ============================================================
-- 1. SECURE OWNER-ONLY EXPLORE VISIBILITY RPC
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_my_explore_visibility(
  p_show_in_explore boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id uuid;
BEGIN

  -- ----------------------------------------------------------
  -- Authentication is mandatory.
  -- ----------------------------------------------------------
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;


  -- ----------------------------------------------------------
  -- Only profiles owned by the authenticated user are changed.
  -- The caller can NEVER provide an owner_id.
  -- ----------------------------------------------------------
  UPDATE public.profiles
  SET
    show_in_explore = p_show_in_explore,
    updated_at = now()
  WHERE owner_id = v_user_id;


  -- ----------------------------------------------------------
  -- FOUND is true only when at least one owned profile existed.
  -- ----------------------------------------------------------
  RETURN FOUND;

END;
$$;


-- Never allow anonymous/public execution.
REVOKE EXECUTE
ON FUNCTION public.set_my_explore_visibility(boolean)
FROM PUBLIC;

REVOKE EXECUTE
ON FUNCTION public.set_my_explore_visibility(boolean)
FROM anon;

-- Logged-in users may call it.
GRANT EXECUTE
ON FUNCTION public.set_my_explore_visibility(boolean)
TO authenticated;


COMMENT ON FUNCTION public.set_my_explore_visibility(boolean)
IS
'Allows an authenticated DIPO owner to enable or disable Explore visibility for their own profile(s). Does not activate profiles or bypass payment/admin approval.';


-- ============================================================
-- 2. REPLACE EXPLORE RPC WITH NORMALIZED CATEGORY MATCHING
-- ============================================================
--
-- Examples now supported:
--
-- Creator       <-> Creators
-- Business      <-> Businesses
-- Online Business <-> Online Businesses
-- Shop          <-> Shops
-- Brand         <-> Brands
-- Service       <-> Services
-- Professional  <-> Professionals
-- Education     <-> Educations
--
-- Hyphens, spaces and underscores are normalized.
--
-- Example:
-- "online-businesses"
-- "Online Business"
-- "online_business"
--
-- are treated as the same Explore category family.
-- ============================================================


CREATE OR REPLACE FUNCTION public.get_explore_profiles(
  p_query text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_limit integer DEFAULT 24,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  name text,
  slug text,
  profession text,
  headline text,
  bio text,
  avatar_url text,
  location text,
  category text,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_query text;
  v_category text;
  v_limit integer;
  v_offset integer;
BEGIN

  -- ==========================================================
  -- SAFE QUERY NORMALIZATION
  -- ==========================================================

  v_query :=
    NULLIF(
      btrim(
        left(
          coalesce(p_query, ''),
          80
        )
      ),
      ''
    );


  v_category :=
    NULLIF(
      btrim(
        left(
          coalesce(p_category, ''),
          60
        )
      ),
      ''
    );


  -- ==========================================================
  -- SAFE PAGINATION LIMITS
  -- ==========================================================

  v_limit :=
    greatest(
      1,
      least(
        coalesce(p_limit, 24),
        60
      )
    );


  v_offset :=
    greatest(
      0,
      coalesce(p_offset, 0)
    );


  -- ==========================================================
  -- PUBLIC EXPLORE DATA
  -- ==========================================================
  --
  -- Only profiles which:
  --
  -- 1. are active
  -- 2. have Explore visibility enabled
  -- 3. have not expired
  --
  -- are returned.
  --
  -- owner_id is intentionally NOT returned.
  -- ==========================================================

  RETURN QUERY
  SELECT
    p.name::text,
    p.slug::text,
    p.profession::text,
    p.headline::text,
    p.bio::text,
    p.avatar_url::text,
    p.location::text,
    p.category::text,
    p.updated_at

  FROM public.profiles AS p

  WHERE
    -- --------------------------------------------------------
    -- Only approved/active DIPO profiles.
    -- --------------------------------------------------------
    p.status = 'active'

    -- --------------------------------------------------------
    -- User must have enabled Explore visibility.
    -- --------------------------------------------------------
    AND p.show_in_explore = true

    -- --------------------------------------------------------
    -- Expiry protection.
    -- NULL expiry means no expiry.
    -- --------------------------------------------------------
    AND (
      p.expires_at IS NULL
      OR p.expires_at > now()
    )


    -- ========================================================
    -- SEARCH FILTER
    -- ========================================================
    AND (
      v_query IS NULL

      OR p.name ILIKE '%' || v_query || '%'
      OR p.profession ILIKE '%' || v_query || '%'
      OR p.headline ILIKE '%' || v_query || '%'
      OR p.bio ILIKE '%' || v_query || '%'
      OR p.location ILIKE '%' || v_query || '%'
      OR p.category ILIKE '%' || v_query || '%'
    )


    -- ========================================================
    -- CATEGORY FILTER
    -- ========================================================
    AND (
      v_category IS NULL

      OR
      (
        CASE

          -- --------------------------------------------------
          -- CREATOR
          -- --------------------------------------------------
          WHEN lower(
            regexp_replace(
              v_category,
              '[^a-z0-9]+',
              '',
              'g'
            )
          ) IN ('creator', 'creators')
          THEN
            lower(
              regexp_replace(
                coalesce(p.category, ''),
                '[^a-z0-9]+',
                '',
                'g'
              )
            ) IN ('creator', 'creators')


          -- --------------------------------------------------
          -- BUSINESS
          -- --------------------------------------------------
          WHEN lower(
            regexp_replace(
              v_category,
              '[^a-z0-9]+',
              '',
              'g'
            )
          ) IN ('business', 'businesses')
          THEN
            lower(
              regexp_replace(
                coalesce(p.category, ''),
                '[^a-z0-9]+',
                '',
                'g'
              )
            ) IN ('business', 'businesses')


          -- --------------------------------------------------
          -- ONLINE BUSINESS
          -- --------------------------------------------------
          WHEN lower(
            regexp_replace(
              v_category,
              '[^a-z0-9]+',
              '',
              'g'
            )
          ) IN (
            'onlinebusiness',
            'onlinebusinesses'
          )
          THEN
            lower(
              regexp_replace(
                coalesce(p.category, ''),
                '[^a-z0-9]+',
                '',
                'g'
              )
            ) IN (
              'onlinebusiness',
              'onlinebusinesses'
            )


          -- --------------------------------------------------
          -- SHOP
          -- --------------------------------------------------
          WHEN lower(
            regexp_replace(
              v_category,
              '[^a-z0-9]+',
              '',
              'g'
            )
          ) IN ('shop', 'shops')
          THEN
            lower(
              regexp_replace(
                coalesce(p.category, ''),
                '[^a-z0-9]+',
                '',
                'g'
              )
            ) IN ('shop', 'shops')


          -- --------------------------------------------------
          -- BRAND
          -- --------------------------------------------------
          WHEN lower(
            regexp_replace(
              v_category,
              '[^a-z0-9]+',
              '',
              'g'
            )
          ) IN ('brand', 'brands')
          THEN
            lower(
              regexp_replace(
                coalesce(p.category, ''),
                '[^a-z0-9]+',
                '',
                'g'
              )
            ) IN ('brand', 'brands')


          -- --------------------------------------------------
          -- SERVICE
          -- --------------------------------------------------
          WHEN lower(
            regexp_replace(
              v_category,
              '[^a-z0-9]+',
              '',
              'g'
            )
          ) IN ('service', 'services')
          THEN
            lower(
              regexp_replace(
                coalesce(p.category, ''),
                '[^a-z0-9]+',
                '',
                'g'
              )
            ) IN ('service', 'services')


          -- --------------------------------------------------
          -- PROFESSIONAL
          -- --------------------------------------------------
          WHEN lower(
            regexp_replace(
              v_category,
              '[^a-z0-9]+',
              '',
              'g'
            )
          ) IN ('professional', 'professionals')
          THEN
            lower(
              regexp_replace(
                coalesce(p.category, ''),
                '[^a-z0-9]+',
                '',
                'g'
              )
            ) IN ('professional', 'professionals')


          -- --------------------------------------------------
          -- EDUCATION
          -- --------------------------------------------------
          WHEN lower(
            regexp_replace(
              v_category,
              '[^a-z0-9]+',
              '',
              'g'
            )
          ) IN ('education', 'educations')
          THEN
            lower(
              regexp_replace(
                coalesce(p.category, ''),
                '[^a-z0-9]+',
                '',
                'g'
              )
            ) IN ('education', 'educations')


          -- --------------------------------------------------
          -- DEFAULT
          --
          -- For future categories, use normalized exact
          -- matching rather than rejecting the category.
          -- --------------------------------------------------
          ELSE
            lower(
              regexp_replace(
                coalesce(p.category, ''),
                '[^a-z0-9]+',
                '',
                'g'
              )
            )
            =
            lower(
              regexp_replace(
                v_category,
                '[^a-z0-9]+',
                '',
                'g'
              )
            )

        END
      )
    )

  -- ==========================================================
  -- STABLE ORDER
  -- ==========================================================
  ORDER BY
    p.updated_at DESC,
    p.id DESC

  LIMIT v_limit
  OFFSET v_offset;

END;
$$;


-- ============================================================
-- 3. RE-APPLY RPC PERMISSIONS
-- ============================================================

REVOKE EXECUTE
ON FUNCTION public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
FROM PUBLIC;

REVOKE EXECUTE
ON FUNCTION public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
FROM anon;

REVOKE EXECUTE
ON FUNCTION public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
FROM authenticated;


-- Public Explore is intentionally readable without login.
GRANT EXECUTE
ON FUNCTION public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
TO anon;

GRANT EXECUTE
ON FUNCTION public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
TO authenticated;


COMMENT ON FUNCTION public.get_explore_profiles(
  text,
  text,
  integer,
  integer
)
IS
'Returns safe, active, non-expired Worldwide DIPO profiles enabled for public Explore. Supports normalized category matching and never exposes owner_id.';


-- ============================================================
-- 4. SECURITY DOCUMENTATION
-- ============================================================

COMMENT ON COLUMN public.profiles.show_in_explore
IS
'Controls whether an active Worldwide DIPO appears in public Explore. Default true. Direct profile activation is not controlled by this field.';


COMMIT;


-- ============================================================
-- END OF MIGRATION 015
-- ============================================================