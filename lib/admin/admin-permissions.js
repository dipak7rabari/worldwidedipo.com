export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SUPPORT: 'support',
};

export const ADMIN_PERMISSIONS = {
  super_admin: [
    'dashboard.view',
    'payments.view',
    'payments.approve',
    'payments.reject',
    'profiles.view',
    'users.view',
    'audit.view',
    'settings.view',
  ],

  admin: [
    'dashboard.view',
    'payments.view',
    'payments.approve',
    'payments.reject',
    'profiles.view',
    'users.view',
    'audit.view',
  ],

  support: [
    'dashboard.view',
    'payments.view',
    'profiles.view',
    'users.view',
    'audit.view',
  ],
};

export function hasAdminPermission(
  admin,
  permission,
) {
  if (!admin?.isActive) {
    return false;
  }

  const permissions =
    ADMIN_PERMISSIONS[admin.role] ?? [];

  return permissions.includes(permission);
}

export function canViewPayments(admin) {
  return hasAdminPermission(
    admin,
    'payments.view',
  );
}

export function canApprovePayments(admin) {
  return hasAdminPermission(
    admin,
    'payments.approve',
  );
}

export function canRejectPayments(admin) {
  return hasAdminPermission(
    admin,
    'payments.reject',
  );
}