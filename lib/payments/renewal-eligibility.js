export function isRenewalEligible(
  profile
) {
  if (!profile) {
    return false;
  }

  if (
    profile.status !== 'active' &&
    profile.status !== 'expired'
  ) {
    return false;
  }

  if (
    profile.status === 'expired' &&
    profile.deletion_scheduled_at
  ) {
    const deletionTime =
      new Date(
        profile.deletion_scheduled_at
      ).getTime();

    if (
      Number.isFinite(
        deletionTime
      ) &&
      deletionTime <= Date.now()
    ) {
      return false;
    }
  }

  return true;
}

export function getRenewalState(
  profile,
  pendingRenewal
) {
  if (!profile) {
    return 'unavailable';
  }

  if (pendingRenewal) {
    return 'pending';
  }

  if (
    !isRenewalEligible(profile)
  ) {
    return 'unavailable';
  }

  if (profile.status === 'expired') {
    return 'expired-renewable';
  }

  return 'renewable';
}