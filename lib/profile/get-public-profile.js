import { createClient } from '@supabase/supabase-js';

function getPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase public configuration is missing.');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function normalizeSlug(slug) {
  if (typeof slug !== 'string') {
    return '';
  }

  return slug.trim().toLowerCase();
}

export async function getPublicProfile(slug) {
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  const supabase = getPublicSupabaseClient();

  const { data, error } = await supabase.rpc('get_public_profile', {
    p_slug: normalizedSlug,
  });

  if (error) {
    console.error('Public profile lookup failed:', error.message);
    return null;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return { profile: data[0] };
}

export function isPublicProfileActive(profile) {
  if (!profile || profile.status !== 'active') {
    return false;
  }

  if (!profile.expires_at) {
    return true;
  }

  return new Date(profile.expires_at).getTime() > Date.now();
}