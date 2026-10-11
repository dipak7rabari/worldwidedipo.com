/**
 * Worldwide DIPO
 * Analytics Events
 *
 * Central source of truth for analytics event names,
 * device categories and analytics-related constants.
 */

export const ANALYTICS_EVENTS = Object.freeze({
  PROFILE_VIEW: 'profile_view',
});

export const DEVICE_TYPES = Object.freeze({
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  UNKNOWN: 'unknown',
});

export const DEVICE_TYPE_LIST = Object.freeze([
  DEVICE_TYPES.MOBILE,
  DEVICE_TYPES.TABLET,
  DEVICE_TYPES.DESKTOP,
  DEVICE_TYPES.UNKNOWN,
]);

export const ANALYTICS_LIMITS = Object.freeze({
  MAX_REFERRER_LENGTH: 120,
  MAX_VISITOR_HASH_LENGTH: 128,
  MAX_RECENT_VIEWS: 100,
  DEFAULT_RECENT_VIEWS: 20,
});

export const ANALYTICS_PATHS = Object.freeze({
  PROFILE_VIEW: '/api/analytics/view/profile-view',
});

export const ANALYTICS_STORAGE_KEYS = Object.freeze({
  SESSION_ID: 'dipo_analytics_session',
  PROFILE_PREFIX: 'dipo_analytics_profile_',
});

export function isAnalyticsEvent(value) {
  return Object.values(ANALYTICS_EVENTS).includes(
    value,
  );
}

export function isDeviceType(value) {
  return DEVICE_TYPE_LIST.includes(value);
}

export function getDeviceLabel(value) {
  switch (value) {
    case DEVICE_TYPES.MOBILE:
      return 'Mobile';

    case DEVICE_TYPES.TABLET:
      return 'Tablet';

    case DEVICE_TYPES.DESKTOP:
      return 'Desktop';

    default:
      return 'Unknown';
  }
}

export default ANALYTICS_EVENTS;