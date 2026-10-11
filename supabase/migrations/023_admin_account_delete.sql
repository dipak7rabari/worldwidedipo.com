-- Worldwide DIPO: secure account deletion / schema 001-022
-- Run ONLY after creator migration 022 (if Creator is installed).
BEGIN;
CREATE OR REPLACE FUNCTION public.admin_delete_user_account(p_actor_user_id uuid,p_target_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_profile uuid; v_slug text;
BEGIN
 IF p_actor_user_id IS NULL OR p_target_user_id IS NULL THEN RAISE EXCEPTION 'ACCOUNT_ID_REQUIRED'; END IF;
 IF p_actor_user_id=p_target_user_id THEN RAISE EXCEPTION 'SELF_DELETE_NOT_ALLOWED'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.admin_users WHERE user_id=p_actor_user_id AND role='super_admin' AND is_active=true) THEN RAISE EXCEPTION 'SUPER_ADMIN_REQUIRED'; END IF;
 IF EXISTS(SELECT 1 FROM public.admin_users WHERE user_id=p_target_user_id) THEN RAISE EXCEPTION 'ADMIN_ACCOUNT_PROTECTED'; END IF;
 PERFORM 1 FROM auth.users WHERE id=p_target_user_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'ACCOUNT_NOT_FOUND'; END IF;
 SELECT id,slug INTO v_profile,v_slug FROM public.profiles WHERE owner_id=p_target_user_id FOR UPDATE;
 IF v_profile IS NOT NULL AND pg_catalog.to_regclass('public.creator_pages') IS NOT NULL THEN
  EXECUTE 'DELETE FROM public.creator_pages WHERE profile_id = $1' USING v_profile;
 END IF;
 DELETE FROM public.profiles WHERE owner_id=p_target_user_id;
 DELETE FROM auth.users WHERE id=p_target_user_id;
 INSERT INTO public.audit_logs(actor_user_id,action,entity_type,entity_id,metadata)
 VALUES(p_actor_user_id,'user.deleted','auth_user',p_target_user_id,jsonb_build_object('source','admin_user_management','profile_slug',v_slug));
 RETURN jsonb_build_object('user_id',p_target_user_id,'profile_id',v_profile);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_delete_user_account(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user_account(uuid,uuid) TO service_role;
COMMIT;
