import { createClient } from '@/lib/supabase/server';

export async function getMyProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      profile: null,
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      owner_id,
      name,
      slug,
      profession,
      headline,
      bio,
      avatar_url,
      location,
      category,
      about,
      links,
      social_links,
      skills,
      services,
      experience,
      education,
      projects,
      gallery,
      business,
      plan,
      status,
      expires_at,
      deletion_scheduled_at,
      created_at,
      updated_at
    `)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Profile lookup failed:', error.message);

    return {
      user,
      profile: null,
    };
  }

  return {
    user,
    profile: data || null,
  };
}