import 'server-only';

import {
  createClient,
} from '@/lib/supabase/server';

import {
  normalizeProfileId,
  normalizeAnalyticsCount,
  sanitizeAnalyticsViews,
  getDeviceBreakdown,
  getTopReferrers,
} from './analytics-utils';

const RECENT_LIMIT = 20;
const REFERRER_SAMPLE_LIMIT = 1000;

function unauthorized() {
  return {
    authorized: false,
    analytics: null,
  };
}

function emptyAnalytics(profile = null) {
  return {
    profile,
    totalViews: 0,

    devices: {
      mobile: 0,
      tablet: 0,
      desktop: 0,
      unknown: 0,
    },

    recentViews: [],
    topReferrers: [],
  };
}

/**
 * Returns analytics for the authenticated owner
 * of the supplied profile.
 *
 * This function intentionally performs the ownership
 * check server-side. A profile ID supplied by a browser
 * is never trusted as proof of ownership.
 */
export async function getAnalytics(
  profileId,
) {
  const normalizedProfileId =
    normalizeProfileId(profileId);

  if (!normalizedProfileId) {
    return unauthorized();
  }

  const supabase =
    await createClient();

  let user = null;

  try {
    const {
      data,
      error,
    } =
      await supabase.auth.getUser();

    if (error || !data?.user) {
      return unauthorized();
    }

    user = data.user;
  } catch (error) {
    console.error(
      'Analytics authentication error:',
      error,
    );

    return unauthorized();
  }

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
        slug,
        status
      `)
      .eq(
        'id',
        normalizedProfileId,
      )
      .eq(
        'owner_id',
        user.id,
      )
      .maybeSingle();

  if (
    profileError ||
    !profile
  ) {
    if (profileError) {
      console.error(
        'Analytics profile lookup error:',
        profileError.message,
      );
    }

    return unauthorized();
  }

  const {
    count: totalViews,
    error: totalError,
  } =
    await supabase
      .from('profile_view_events')
      .select(
        'id',
        {
          count: 'exact',
          head: true,
        },
      )
      .eq(
        'profile_id',
        normalizedProfileId,
      );

  if (totalError) {
    console.error(
      'Analytics total views error:',
      totalError.message,
    );
  }

  const {
    data: recentRows,
    error: recentError,
  } =
    await supabase
      .from('profile_view_events')
      .select(`
        id,
        viewed_at,
        device_type,
        referrer_domain
      `)
      .eq(
        'profile_id',
        normalizedProfileId,
      )
      .order(
        'viewed_at',
        {
          ascending: false,
        },
      )
      .limit(
        RECENT_LIMIT,
      );

  if (recentError) {
    console.error(
      'Analytics recent views error:',
      recentError.message,
    );
  }

  /*
   * Device aggregation is intentionally based on a
   * bounded sample rather than loading every historical
   * event into memory.
   *
   * For the current DIPO analytics volume this keeps the
   * implementation lightweight while avoiding unbounded
   * server-side memory usage.
   */
  const {
    data: sampleRows,
    error: sampleError,
  } =
    await supabase
      .from('profile_view_events')
      .select(`
        device_type,
        referrer_domain
      `)
      .eq(
        'profile_id',
        normalizedProfileId,
      )
      .order(
        'viewed_at',
        {
          ascending: false,
        },
      )
      .limit(
        REFERRER_SAMPLE_LIMIT,
      );

  if (sampleError) {
    console.error(
      'Analytics aggregation error:',
      sampleError.message,
    );
  }

  const devices =
    getDeviceBreakdown(
      sampleRows || [],
    );

  const topReferrers =
    getTopReferrers(
      sampleRows || [],
      10,
    );

  return {
    authorized: true,

    analytics: {
      profile: {
        id: profile.id,
        name: profile.name,
        slug: profile.slug,
        status: profile.status,
      },

      totalViews:
        normalizeAnalyticsCount(
          totalViews,
        ),

      devices,

      recentViews:
        sanitizeAnalyticsViews(
          recentRows || [],
          RECENT_LIMIT,
        ),

      topReferrers,
    },
  };
}

/**
 * Backward-compatible explicit naming for callers
 * that prefer profile-specific terminology.
 */
export async function getAnalyticsForProfile(
  profileId,
) {
  return getAnalytics(profileId);
}

export default getAnalytics;