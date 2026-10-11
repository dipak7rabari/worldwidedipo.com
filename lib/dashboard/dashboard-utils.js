export function getDaysRemaining(
  expiresAt
) {
  if (!expiresAt) {
    return null;
  }

  const expiry =
    new Date(expiresAt).getTime();

  if (!Number.isFinite(expiry)) {
    return null;
  }

  return Math.max(
    0,
    Math.ceil(
      (expiry - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );
}

export function getProfileStatusLabel(
  status
) {
  const labels = {
    draft: 'Draft',
    pending: 'Payment Review',
    active: 'Live',
    expired: 'Expired',
  };

  return (
    labels[status] || 'Unknown'
  );
}

export function getProfileStatusClass(
  status
) {
  const classes = {
    draft: 'status-draft',
    pending: 'status-pending',
    active: 'status-active',
    expired: 'status-expired',
  };

  return (
    classes[status] ||
    'status-unknown'
  );
}

export function getDashboardPrimaryAction(
  profile
) {
  if (!profile) {
    return {
      label: 'Create Profile',
      href: '/onboarding',
    };
  }

  if (profile.status === 'draft') {
    return {
      label: 'Complete Profile',
      href: '/dashboard/profile',
    };
  }

  if (profile.status === 'pending') {
    return {
      label: 'View Subscription',
      href: '/dashboard/subscription',
    };
  }

  if (profile.status === 'active') {
    return {
      label: 'View Public Profile',
      href: `/p/${profile.slug}`,
    };
  }

  if (profile.status === 'expired') {
    return {
      label: 'Renew Profile',
      href: '/dashboard/subscription',
    };
  }

  return {
    label: 'Dashboard',
    href: '/dashboard',
  };
}