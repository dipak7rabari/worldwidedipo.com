-- ============================================================
-- WORLDWIDE DIPO
-- Migration 016: Explore Visibility RLS Hardening
-- ============================================================

BEGIN;

-- ============================================================
-- 1. ENABLE RLS
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 2. OWNER UPDATE POLICY
-- ============================================================
--
-- Owners may update their own profile rows.
-- Server-side validation/RPC remains responsible for protected
-- fields such as status, plan, expires_at, etc.
--
-- If an equivalent owner update policy already exists, this
-- block safely replaces only the specifically named policy.
-- ============================================================

DROP POLICY IF EXISTS "profiles_owner_update"
ON public.profiles;

CREATE POLICY "profiles_owner_update"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  owner_id = auth.uid()
)
WITH CHECK (
  owner_id = auth.uid()
);


-- ============================================================
-- 3. OWNER SELECT POLICY
-- ============================================================
--
-- Logged-in owners can read their own DIPO.
-- Public Explore does NOT depend on direct table SELECT;
-- it uses the controlled get_explore_profiles() RPC.
-- ============================================================

DROP POLICY IF EXISTS "profiles_owner_select"
ON public.profiles;

CREATE POLICY "profiles_owner_select"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid()
);


-- ============================================================
-- 4. PUBLIC PROFILE READ POLICY
-- ============================================================
--
-- Public visitors may directly read only active,
-- non-expired, Explore-enabled profiles.
--
-- This makes direct public profile access safer if any
-- application route performs a normal Supabase SELECT.
--
-- IMPORTANT:
-- If your existing public profile route intentionally supports
-- active profiles hidden from Explore, this policy should NOT
-- be used for that route. In that case the public profile route
-- should use its own secure RPC instead.
--
-- Therefore this policy is intentionally NOT created here.
-- Public profile access remains controlled by the existing
-- application/RPC architecture.
-- ============================================================


-- ============================================================
-- 5. DOCUMENT SECURITY MODEL
-- ============================================================

COMMENT ON POLICY "profiles_owner_update"
ON public.profiles
IS
'Authenticated users may update only profiles they own. Protected lifecycle/payment fields must still be enforced by application validation and database controls.';

COMMENT ON POLICY "profiles_owner_select"
ON public.profiles
IS
'Authenticated users may directly read only their own profile. Public Explore uses the controlled get_explore_profiles RPC.';


-- ============================================================
-- 6. VERIFY EXPLORE VISIBILITY COLUMN
-- ============================================================

ALTER TABLE public.profiles
ALTER COLUMN show_in_explore
SET DEFAULT true;


-- Existing NULL values should never disable visibility accidentally.
UPDATE public.profiles
SET show_in_explore = true
WHERE show_in_explore IS NULL;


ALTER TABLE public.profiles
ALTER COLUMN show_in_explore
SET NOT NULL;


-- ============================================================
-- END
-- ============================================================

COMMIT;