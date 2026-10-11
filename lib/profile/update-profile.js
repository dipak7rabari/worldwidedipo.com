import { createClient } from '@/lib/supabase/server';

import {
  validateProfileEditInput,
} from './profile-edit-validation';

const PROTECTED_FIELDS = new Set([
  'id',
  'owner_id',
  'status',
  'plan',
  'expires_at',
  'deletion_scheduled_at',
  'created_at',
  'updated_at',
]);

export async function updateMyProfile(input) {
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

  const { data: currentProfile, error: profileError } =
    await supabase
      .from('profiles')
      .select(`
        id,
        owner_id,
        name,
        slug,
        profession,
        status,
        plan
      `)
      .eq('owner_id', user.id)
      .maybeSingle();

  if (profileError) {
    console.error(
      'Profile fetch failed:',
      profileError.message
    );

    return {
      success: false,
      status: 500,
      errors: {
        form: 'Unable to load your profile.',
      },
    };
  }

  if (!currentProfile) {
    return {
      success: false,
      status: 404,
      errors: {
        form: 'Profile not found.',
      },
    };
  }

  if (currentProfile.status === 'pending') {
    /*
     * During payment review, identity-critical fields
     * remain locked.
     */
    input = {
      ...input,
      name: currentProfile.name,
      profession: currentProfile.profession,
      slug: currentProfile.slug,
    };
  }

  const validation = validateProfileEditInput(
    input,
    {
      status: currentProfile.status,
    }
  );

  if (!validation.valid) {
    return {
      success: false,
      status: 400,
      errors: validation.errors,
    };
  }

  const safeData = validation.value;

  /*
   * Explicit whitelist.
   * Protected database fields can never come from
   * the browser.
   */
  const updateData = {};

  for (const [key, value] of Object.entries(
    safeData
  )) {
    if (!PROTECTED_FIELDS.has(key)) {
      updateData[key] =
        value === '' ? null : value;
    }
  }

  /*
   * Slug is intentionally NOT editable through this
   * generic editor.
   *
   * This prevents accidental public URL changes,
   * broken links and SEO instability.
   */

  delete updateData.slug;
  /*
   * Database stores links and social_links as JSON objects,
   * for example { "Instagram": "https://..." }.
   * The editor works with arrays, so convert before saving.
   */
  for (const field of ['links', 'social_links']) {
    if (Array.isArray(updateData[field])) {
      const asObject = {};

      for (const item of updateData[field]) {
        const baseKey =
          String(item?.label || 'Link').trim().slice(0, 100) ||
          'Link';

        let key = baseKey;
        let count = 2;

        while (
          Object.prototype.hasOwnProperty.call(asObject, key)
        ) {
          key = `${baseKey} ${count}`;
          count += 1;
        }

        asObject[key] = item.url;
      }

      updateData[field] = asObject;
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', currentProfile.id)
    .eq('owner_id', user.id)
    .select(`
      id,
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
    .single();

  if (error) {
    console.error(
      'Profile update failed:',
      error.message
    );

    return {
      success: false,
      status: 500,
      errors: {
        form: 'Unable to save your profile.',
      },
    };
  }

  return {
    success: true,
    status: 200,
    profile: data,
  };
}