import { createClient } from '@/lib/supabase/server';

export async function getOwnProfile(userId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('owner_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function createProfile(
  userId,
  profileData,
) {
  const supabase = await createClient();

  const payload = {
    owner_id: userId,

    name: profileData.name,
    slug: profileData.slug,
    profession: profileData.profession,

    headline:
      profileData.headline || null,

    bio:
      profileData.bio || null,

    location:
      profileData.location || null,

    phone:
      profileData.phone || null,

    whatsapp:
      profileData.whatsapp || null,

    category:
      profileData.category || null,

    about:
      profileData.about || null,

    links: {},
    social_links: {},

    skills: [],
    services: [],
    experience: [],
    education: [],
    projects: [],
    gallery: [],

    business: {},

    plan: 'Starter',
    status: 'draft',
  };

  const { data, error } = await supabase
    .from('profiles')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProfile(
  userId,
  profileId,
  profileData,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', profileId)
    .eq('owner_id', userId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}