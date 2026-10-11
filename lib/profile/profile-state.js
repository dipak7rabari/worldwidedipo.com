export const PROFILE_STATES = Object.freeze({
  DRAFT: 'draft',
  PENDING: 'pending',
  ACTIVE: 'active',
  EXPIRED: 'expired',
});

export function isEditableProfile(profile) {
  if (!profile) {
    return false;
  }

  return (
    profile.status === PROFILE_STATES.DRAFT ||
    profile.status === PROFILE_STATES.ACTIVE ||
    profile.status === PROFILE_STATES.EXPIRED
  );
}

export function canSubmitForPayment(profile) {
  return (
    profile &&
    profile.status === PROFILE_STATES.DRAFT
  );
}

export function canPubliclyView(profile) {
  return (
    profile &&
    profile.status === PROFILE_STATES.ACTIVE &&
    profile.expires_at &&
    new Date(profile.expires_at) > new Date()
  );
}