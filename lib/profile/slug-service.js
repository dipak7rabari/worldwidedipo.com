import { createClient } from '@/lib/supabase/server';

import {
  RESERVED_SLUGS,
} from '@/config/security';

export async function isSlugAvailable(slug, profileId = null) {
  const normalizedSlug = String(slug ?? '')
    .trim()
    .toLowerCase();

  if (!normalizedSlug) {
    return false;
  }

  if (RESERVED_SLUGS.has(normalizedSlug)) {
    return false;
  }

  const supabase = await createClient();

  let query = supabase
    .from('profiles')
    .select('id')
    .eq('slug', normalizedSlug)
    .limit(1);

  if (profileId) {
    query = query.neq('id', profileId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return !data;
}