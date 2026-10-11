import { createClient } from '@/lib/supabase/server';

export async function getProfileAnalytics(
  profileId
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !profileId) {
    return {
      authorized: false,
      analytics: null,
    };
  }

  /*
   * Ownership is checked through profiles.
   */
  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from('profiles')
      .select(`
        id,
        owner_id,
        name,
        slug
      `)
      .eq('id', profileId)
      .eq('owner_id', user.id)
      .maybeSingle();

  if (
    profileError ||
    !profile
  ) {
    return {
      authorized: false,
      analytics: null,
    };
  }

  const {
    count: totalViews,
    error: totalError,
  } = await supabase
    .from(
      'profile_view_events'
    )
    .select(
      'id',
      {
        count: 'exact',
        head: true,
      }
    )
    .eq(
      'profile_id',
      profileId
    );

  if (totalError) {
    console.error(
      'Analytics total error:',
      totalError.message
    );
  }

  const {
    data: recentViews,
    error: recentError,
  } =
    await supabase
      .from(
        'profile_view_events'
      )
      .select(`
        id,
        viewed_at,
        device_type,
        referrer_domain
      `)
      .eq(
        'profile_id',
        profileId
      )
      .order(
        'viewed_at',
        {
          ascending: false,
        }
      )
      .limit(20);

  if (recentError) {
    console.error(
      'Analytics recent error:',
      recentError.message
    );
  }

  const {
    data: deviceRows,
  } =
    await supabase
      .from(
        'profile_view_events'
      )
      .select(
        'device_type'
      )
      .eq(
        'profile_id',
        profileId
      );

  const devices = {
    mobile: 0,
    tablet: 0,
    desktop: 0,
    unknown: 0,
  };

  for (
    const row of
      deviceRows || []
  ) {
    if (
      Object.prototype.hasOwnProperty.call(
        devices,
        row.device_type
      )
    ) {
      devices[
        row.device_type
      ] += 1;
    }
  }

  return {
    authorized: true,

    analytics: {
      profile,
      totalViews:
        totalViews || 0,
      recentViews:
        recentViews || [],
      devices,
    },
  };
}