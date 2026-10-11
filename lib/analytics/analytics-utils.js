/**
 * Worldwide DIPO
 * Analytics Utilities
 *
 * Pure, dependency-free helpers used by analytics
 * server and client flows.
 */

import {
  DEVICE_TYPES,
} from './analytics-events';

export function isBrowser() {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

export function isValidUuid(value) {
  if (typeof value !== 'string') {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

export function normalizeProfileId(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();

  return isValidUuid(normalized)
    ? normalized
    : null;
}

export function detectDeviceType(width) {
  const viewportWidth =
    typeof width === 'number'
      ? width
      : isBrowser()
        ? window.innerWidth
        : null;

  if (
    typeof viewportWidth !== 'number' ||
    !Number.isFinite(viewportWidth) ||
    viewportWidth <= 0
  ) {
    return DEVICE_TYPES.UNKNOWN;
  }

  if (viewportWidth < 768) {
    return DEVICE_TYPES.MOBILE;
  }

  if (viewportWidth < 1024) {
    return DEVICE_TYPES.TABLET;
  }

  return DEVICE_TYPES.DESKTOP;
}

export function getCurrentReferrer() {
  if (!isBrowser()) {
    return null;
  }

  const referrer =
    document.referrer?.trim();

  return referrer || null;
}

export function normalizeAnalyticsCount(value) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    return 0;
  }

  return Math.floor(number);
}

export function calculatePercentage(
  value,
  total,
) {
  const normalizedValue =
    normalizeAnalyticsCount(value);

  const normalizedTotal =
    normalizeAnalyticsCount(total);

  if (normalizedTotal <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (normalizedValue / normalizedTotal) * 100,
    ),
  );
}

export function formatAnalyticsNumber(
  value,
  locale = 'en-IN',
) {
  return normalizeAnalyticsCount(
    value,
  ).toLocaleString(locale);
}

export function formatAnalyticsDate(
  value,
  locale = 'en-IN',
  options = {},
) {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    !Number.isFinite(
      date.getTime(),
    )
  ) {
    return 'Unknown';
  }

  return date.toLocaleString(
    locale,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    },
  );
}

export function formatAnalyticsRelativeTime(
  value,
  now = Date.now(),
) {
  const date =
    value instanceof Date
      ? value.getTime()
      : new Date(value).getTime();

  if (!Number.isFinite(date)) {
    return 'Unknown';
  }

  const difference =
    Math.max(
      0,
      now - date,
    );

  const seconds =
    Math.floor(
      difference / 1000,
    );

  if (seconds < 10) {
    return 'Just now';
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes =
    Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks =
    Math.floor(days / 7);

  if (weeks < 5) {
    return `${weeks}w ago`;
  }

  const months =
    Math.floor(days / 30);

  if (months < 12) {
    return `${months}mo ago`;
  }

  const years =
    Math.floor(days / 365);

  return `${years}y ago`;
}

export function getDeviceBreakdown(
  rows,
) {
  const breakdown = {
    mobile: 0,
    tablet: 0,
    desktop: 0,
    unknown: 0,
  };

  if (!Array.isArray(rows)) {
    return breakdown;
  }

  for (const row of rows) {
    const type =
      row?.device_type;

    if (
      Object.prototype.hasOwnProperty.call(
        breakdown,
        type,
      )
    ) {
      breakdown[type] += 1;
    } else {
      breakdown.unknown += 1;
    }
  }

  return breakdown;
}

export function getDevicePercentages(
  devices,
) {
  const normalized = {
    mobile: normalizeAnalyticsCount(
      devices?.mobile,
    ),
    tablet: normalizeAnalyticsCount(
      devices?.tablet,
    ),
    desktop: normalizeAnalyticsCount(
      devices?.desktop,
    ),
    unknown: normalizeAnalyticsCount(
      devices?.unknown,
    ),
  };

  const total =
    normalized.mobile +
    normalized.tablet +
    normalized.desktop +
    normalized.unknown;

  return {
    mobile: calculatePercentage(
      normalized.mobile,
      total,
    ),
    tablet: calculatePercentage(
      normalized.tablet,
      total,
    ),
    desktop: calculatePercentage(
      normalized.desktop,
      total,
    ),
    unknown: calculatePercentage(
      normalized.unknown,
      total,
    ),
  };
}

export function getTopReferrers(
  rows,
  limit = 10,
) {
  if (!Array.isArray(rows)) {
    return [];
  }

  const counts = new Map();

  for (const row of rows) {
    const domain =
      typeof row?.referrer_domain === 'string'
        ? row.referrer_domain.trim().toLowerCase()
        : '';

    const key =
      domain || 'Direct';

    counts.set(
      key,
      (counts.get(key) || 0) + 1,
    );
  }

  return Array.from(
    counts.entries(),
  )
    .sort(
      (a, b) => b[1] - a[1],
    )
    .slice(
      0,
      Math.max(
        0,
        Number(limit) || 10,
      ),
    )
    .map(
      ([domain, views]) => ({
        domain,
        views,
      }),
    );
}

export function sanitizeAnalyticsView(
  view,
) {
  if (!view || typeof view !== 'object') {
    return null;
  }

  return {
    id:
      typeof view.id === 'string'
        ? view.id
        : null,

    viewed_at:
      typeof view.viewed_at === 'string'
        ? view.viewed_at
        : null,

    device_type:
      Object.values(DEVICE_TYPES).includes(
        view.device_type,
      )
        ? view.device_type
        : DEVICE_TYPES.UNKNOWN,

    referrer_domain:
      typeof view.referrer_domain === 'string' &&
      view.referrer_domain.length <= 120
        ? view.referrer_domain
        : null,
  };
}

export function sanitizeAnalyticsViews(
  views,
  limit = 20,
) {
  if (!Array.isArray(views)) {
    return [];
  }

  return views
    .map(sanitizeAnalyticsView)
    .filter(Boolean)
    .slice(
      0,
      Math.max(
        0,
        Number(limit) || 20,
      ),
    );
}

export function buildAnalyticsSummary(
  analytics,
) {
  const totalViews =
    normalizeAnalyticsCount(
      analytics?.totalViews,
    );

  const devices = {
    mobile: normalizeAnalyticsCount(
      analytics?.devices?.mobile,
    ),
    tablet: normalizeAnalyticsCount(
      analytics?.devices?.tablet,
    ),
    desktop: normalizeAnalyticsCount(
      analytics?.devices?.desktop,
    ),
    unknown: normalizeAnalyticsCount(
      analytics?.devices?.unknown,
    ),
  };

  return {
    totalViews,
    devices,
    devicePercentages:
      getDevicePercentages(devices),
    recentViews:
      sanitizeAnalyticsViews(
        analytics?.recentViews,
      ),
  };
}