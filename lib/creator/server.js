import { createClient } from '@/lib/supabase/server';
export async function getCreatorOwner() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { supabase, user: null, profile: null, creator: null };
  const { data: profile } = await supabase.from('profiles').select('id,owner_id,slug,name,avatar_url,bio,plan,status,expires_at').eq('owner_id', user.id).maybeSingle();
  const { data: creator } = profile ? await supabase.from('creator_pages').select('*').eq('profile_id', profile.id).maybeSingle() : { data: null };
  return { supabase, user, profile, creator };
}
export function isActive(profile) { return profile?.status === 'active' && (!profile.expires_at || new Date(profile.expires_at) > new Date()); }
