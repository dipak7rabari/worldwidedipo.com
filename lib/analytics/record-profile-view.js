/*
 * FIX: Migration 019 ne browser roles se profile_view_events par INSERT
 * hata diya hai, isliye user-session client se insert fail ho raha tha.
 * Server-side analytics ke liye service-role client use hota hai.
 */
import { getAdminServiceClient } from '@/lib/admin/admin-service-client';

import {
  validateAnalyticsInput,
} from './analytics-validation';

export async function recordProfileView({
  profileId,
  deviceType,
  referrer,
  visitorHash,
}) {
  if (
    typeof profileId !==
      'string' ||
    !profileId
  ) {
    return {
      success: false,
      status: 400,
    };
  }

  const analytics =
    validateAnalyticsInput({
      device_type: deviceType,
      referrer,
      visitor_hash:
        visitorHash,
    });

  const supabase = getAdminServiceClient();

  /*
   * Only active profiles should generate
   * public analytics.
   */
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select('id, status, expires_at')
    .eq('id', profileId)
    .eq('status', 'active')
    .maybeSingle();

  if (
    profileError ||
    !profile
  ) {
    return {
      success: false,
      status: 404,
    };
  }

  /*
   * FIX: Expired profile par views record nahi hone chahiye.
   */
  if (
    !profile.expires_at ||
    new Date(profile.expires_at).getTime() <= Date.now()
  ) {
    return {
      success: false,
      status: 404,
    };
  }

  const { error } =
    await supabase
      .from(
        'profile_view_events'
      )
      .insert({
        profile_id:
          profileId,

        device_type:
          analytics.deviceType,

        referrer_domain:
          analytics.referrerDomain,

        visitor_hash:
          analytics.visitorHash,
      });

  if (error) {
    console.error(
      'Profile view recording failed:',
      error.message
    );

    return {
      success: false,
      status: 500,
    };
  }

  return {
    success: true,
    status: 201,
  };
}