import { createClient } from '@/lib/supabase/server';
import {
  validateCreateProfileInput,
} from './profile-validation';

export async function createProfile(input) {
  const validation =
    validateCreateProfileInput(input);

  if (!validation.valid) {
    return {
      success: false,
      status: 400,
      errors: validation.errors,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      status: 401,
      errors: {
        form: 'Authentication required.',
      },
    };
  }

  const { data: existingProfile, error: existingError } =
    await supabase
      .from('profiles')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();

  if (existingError) {
    console.error(
      'Existing profile check failed:',
      existingError.message
    );

    return {
      success: false,
      status: 500,
      errors: {
        form: 'Unable to check your profile.',
      },
    };
  }

  if (existingProfile) {
    return {
      success: false,
      status: 409,
      errors: {
        form:
          'You already have a Worldwide DIPO profile.',
      },
    };
  }

  const profile = validation.value;

  const { data: slugProfile, error: slugError } =
    await supabase
      .from('profiles')
      .select('id')
      .eq('slug', profile.slug)
      .maybeSingle();

  if (slugError) {
    console.error(
      'Slug availability check failed:',
      slugError.message
    );

    return {
      success: false,
      status: 500,
      errors: {
        form: 'Unable to check profile URL.',
      },
    };
  }

  if (slugProfile) {
    return {
      success: false,
      status: 409,
      errors: {
        slug:
          'This profile URL is already taken. Please choose another.',
      },
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      owner_id: user.id,

      name: profile.name,
      slug: profile.slug,
      profession: profile.profession,

      headline: profile.headline,
      bio: profile.bio,

      location: profile.location,
      category: profile.category,
      about: profile.about,

      status: 'draft',

      plan: 'Starter',
    })
    .select(`
      id,
      name,
      slug,
      profession,
      headline,
      bio,
      location,
      category,
      about,
      plan,
      status,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    console.error(
      'Profile creation failed:',
      error.message
    );

    if (error.code === '23505') {
      return {
        success: false,
        status: 409,
        errors: {
          form:
            'Profile already exists or the URL is already taken.',
        },
      };
    }

    return {
      success: false,
      status: 500,
      errors: {
        form: 'Unable to create your profile.',
      },
    };
  }

  return {
    success: true,
    status: 201,
    profile: data,
  };
}