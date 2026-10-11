import { PROFILE_STATES } from './profile-state';

/**
 * Worldwide DIPO — Profile Permissions
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * These helpers are authorization helpers, not a replacement
 * for Supabase RLS / server-side authorization.
 *
 * They provide one consistent permission model across:
 * - dashboard
 * - profile editor
 * - public profile
 * - server actions
 * - API handlers
 *
 * The database remains the final security boundary.
 */

export const PROFILE_PERMISSION = Object.freeze({
  VIEW_PUBLIC: 'view_public',
  VIEW_OWNER: 'view_owner',

  EDIT: 'edit',
  EDIT_IDENTITY: 'edit_identity',

  MANAGE_CONTENT: 'manage_content',
  MANAGE_MEDIA: 'manage_media',
  MANAGE_SOCIAL: 'manage_social',
  MANAGE_BUSINESS: 'manage_business',

  SUBMIT_PAYMENT: 'submit_payment',
  MANAGE_PAYMENT: 'manage_payment',

  MANAGE_PROFILE: 'manage_profile',
  DELETE_PROFILE: 'delete_profile',
});

function normalizeId(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();

  return normalized || null;
}

function getUserId(userOrId) {
  if (typeof userOrId === 'string') {
    return normalizeId(userOrId);
  }

  if (
    userOrId &&
    typeof userOrId === 'object'
  ) {
    return normalizeId(
      userOrId.id ||
      userOrId.user_id ||
      userOrId.owner_id
    );
  }

  return null;
}

function getOwnerId(profile) {
  if (!profile || typeof profile !== 'object') {
    return null;
  }

  return normalizeId(
    profile.owner_id ||
    profile.ownerId
  );
}

function getProfileStatus(profile) {
  if (!profile || typeof profile !== 'object') {
    return null;
  }

  return profile.status || null;
}

/**
 * Strict owner check.
 *
 * Only the authenticated user whose ID matches the profile's
 * owner_id is considered the profile owner.
 */
export function isProfileOwner(
  profile,
  userOrId
) {
  const ownerId = getOwnerId(profile);
  const userId = getUserId(userOrId);

  if (!ownerId || !userId) {
    return false;
  }

  return ownerId === userId;
}

/**
 * Returns a normalized permission context.
 *
 * This makes permission decisions predictable and prevents
 * scattered owner/status checks throughout the application.
 */
export function getProfilePermissionContext(
  profile,
  userOrId
) {
  const userId = getUserId(userOrId);
  const ownerId = getOwnerId(profile);
  const status = getProfileStatus(profile);

  const authenticated = Boolean(userId);
  const owner = Boolean(
    authenticated &&
    ownerId &&
    userId === ownerId
  );

  return {
    authenticated,
    owner,
    userId,
    ownerId,
    status,
    exists: Boolean(profile),
  };
}

/**
 * Public profile visibility.
 *
 * This intentionally checks the same public-state rules used
 * by the profile-state layer.
 */
export function canViewPublicProfile(profile) {
  if (!profile) {
    return false;
  }

  if (profile.status !== PROFILE_STATES.ACTIVE) {
    return false;
  }

  if (!profile.expires_at) {
    return false;
  }

  const expiresAt = new Date(
    profile.expires_at
  );

  if (Number.isNaN(expiresAt.getTime())) {
    return false;
  }

  return expiresAt.getTime() > Date.now();
}

/**
 * Owner can view their own profile regardless of whether
 * the public profile is currently active.
 *
 * This is useful for dashboard/editor flows.
 */
export function canViewOwnProfile(
  profile,
  userOrId
) {
  return isProfileOwner(
    profile,
    userOrId
  );
}

/**
 * Profile editing permission.
 *
 * Owners may edit draft, active and expired profiles.
 * Pending profiles have restricted identity editing.
 */
export function canEditProfile(
  profile,
  userOrId
) {
  if (!isProfileOwner(profile, userOrId)) {
    return false;
  }

  const status = getProfileStatus(profile);

  return (
    status === PROFILE_STATES.DRAFT ||
    status === PROFILE_STATES.ACTIVE ||
    status === PROFILE_STATES.EXPIRED ||
    status === PROFILE_STATES.PENDING
  );
}

/**
 * Identity fields are intentionally more restricted.
 *
 * During payment review, identity-critical fields are locked
 * by update-profile.js as well. This helper mirrors that rule.
 */
export function canEditIdentity(
  profile,
  userOrId
) {
  if (!isProfileOwner(profile, userOrId)) {
    return false;
  }

  return (
    getProfileStatus(profile) !==
    PROFILE_STATES.PENDING
  );
}

/**
 * General profile/content management.
 */
export function canManageProfile(
  profile,
  userOrId
) {
  return canEditProfile(
    profile,
    userOrId
  );
}

export function canManageContent(
  profile,
  userOrId
) {
  return canEditProfile(
    profile,
    userOrId
  );
}

export function canManageMedia(
  profile,
  userOrId
) {
  return canEditProfile(
    profile,
    userOrId
  );
}

export function canManageSocial(
  profile,
  userOrId
) {
  return canEditProfile(
    profile,
    userOrId
  );
}

export function canManageBusiness(
  profile,
  userOrId
) {
  return canEditProfile(
    profile,
    userOrId
  );
}

/**
 * Initial payment submission.
 *
 * Payment submission belongs to the profile owner only.
 */
export function canSubmitPayment(
  profile,
  userOrId
) {
  if (!isProfileOwner(profile, userOrId)) {
    return false;
  }

  return (
    getProfileStatus(profile) ===
    PROFILE_STATES.DRAFT
  );
}

/**
 * Payment management is deliberately NOT granted to
 * ordinary profile owners.
 *
 * Admin payment authorization belongs to the dedicated
 * admin authorization system.
 */
export function canManagePayment() {
  return false;
}

/**
 * Profile deletion.
 *
 * Only the owner can request deletion, and a pending profile
 * is intentionally excluded from this generic permission.
 */
export function canDeleteProfile(
  profile,
  userOrId
) {
  if (!isProfileOwner(profile, userOrId)) {
    return false;
  }

  return (
    getProfileStatus(profile) !==
    PROFILE_STATES.PENDING
  );
}

/**
 * Resolve a named permission.
 *
 * Useful when UI/server code wants one centralized check
 * instead of duplicating conditionals.
 */
export function hasProfilePermission(
  permission,
  profile,
  userOrId
) {
  switch (permission) {
    case PROFILE_PERMISSION.VIEW_PUBLIC:
      return canViewPublicProfile(profile);

    case PROFILE_PERMISSION.VIEW_OWNER:
      return canViewOwnProfile(
        profile,
        userOrId
      );

    case PROFILE_PERMISSION.EDIT:
      return canEditProfile(
        profile,
        userOrId
      );

    case PROFILE_PERMISSION.EDIT_IDENTITY:
      return canEditIdentity(
        profile,
        userOrId
      );

    case PROFILE_PERMISSION.MANAGE_PROFILE:
      return canManageProfile(
        profile,
        userOrId
      );

    case PROFILE_PERMISSION.MANAGE_CONTENT:
      return canManageContent(
        profile,
        userOrId
      );

    case PROFILE_PERMISSION.MANAGE_MEDIA:
      return canManageMedia(
        profile,
        userOrId
      );

    case PROFILE_PERMISSION.MANAGE_SOCIAL:
      return canManageSocial(
        profile,
        userOrId
      );

    case PROFILE_PERMISSION.MANAGE_BUSINESS:
      return canManageBusiness(
        profile,
        userOrId
      );

    case PROFILE_PERMISSION.SUBMIT_PAYMENT:
      return canSubmitPayment(
        profile,
        userOrId
      );

    case PROFILE_PERMISSION.MANAGE_PAYMENT:
      return canManagePayment(
        profile,
        userOrId
      );

    case PROFILE_PERMISSION.DELETE_PROFILE:
      return canDeleteProfile(
        profile,
        userOrId
      );

    default:
      return false;
  }
}

/**
 * Return all permissions for the current context.
 *
 * Useful for dashboard/UI capability maps.
 */
export function getProfilePermissions(
  profile,
  userOrId
) {
  return {
    isOwner: isProfileOwner(
      profile,
      userOrId
    ),

    canViewPublic:
      canViewPublicProfile(profile),

    canViewOwner:
      canViewOwnProfile(
        profile,
        userOrId
      ),

    canEdit:
      canEditProfile(
        profile,
        userOrId
      ),

    canEditIdentity:
      canEditIdentity(
        profile,
        userOrId
      ),

    canManageProfile:
      canManageProfile(
        profile,
        userOrId
      ),

    canManageContent:
      canManageContent(
        profile,
        userOrId
      ),

    canManageMedia:
      canManageMedia(
        profile,
        userOrId
      ),

    canManageSocial:
      canManageSocial(
        profile,
        userOrId
      ),

    canManageBusiness:
      canManageBusiness(
        profile,
        userOrId
      ),

    canSubmitPayment:
      canSubmitPayment(
        profile,
        userOrId
      ),

    canManagePayment:
      canManagePayment(
        profile,
        userOrId
      ),

    canDelete:
      canDeleteProfile(
        profile,
        userOrId
      ),
  };
}

/**
 * Owner-only guard for server-side callers.
 *
 * Returns a normalized result instead of throwing, allowing
 * API/service layers to decide the appropriate HTTP response.
 */
export function requireProfileOwner(
  profile,
  userOrId
) {
  const context =
    getProfilePermissionContext(
      profile,
      userOrId
    );

  if (!context.authenticated) {
    return {
      allowed: false,
      status: 401,
      error: 'Authentication required.',
      context,
    };
  }

  if (!context.owner) {
    return {
      allowed: false,
      status: 403,
      error: 'You are not authorized to manage this profile.',
      context,
    };
  }

  return {
    allowed: true,
    status: 200,
    error: null,
    context,
  };
}

export default {
  PROFILE_PERMISSION,
  isProfileOwner,
  getProfilePermissionContext,
  canViewPublicProfile,
  canViewOwnProfile,
  canEditProfile,
  canEditIdentity,
  canManageProfile,
  canManageContent,
  canManageMedia,
  canManageSocial,
  canManageBusiness,
  canSubmitPayment,
  canManagePayment,
  canDeleteProfile,
  hasProfilePermission,
  getProfilePermissions,
  requireProfileOwner,
};