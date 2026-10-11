/**
 * Worldwide DIPO
 * Admin Audit Service
 *
 * Production-grade read layer for the append-only
 * public.audit_logs table.
 *
 * Security model:
 * - Uses the authenticated Supabase SSR client.
 * - Never uses the Supabase secret/service-role key.
 * - Never allows browser-side writes to audit_logs.
 * - Relies on database RLS for final authorization.
 * - Requires an active admin identity for reads.
 *
 * Migration source:
 * supabase/migrations/007_admin_audit.sql
 */

import { createClient } from '@/lib/supabase/server';

import {
  getAdminIdentity,
  isAdminMfaVerified,
  canViewAdminData,
} from '@/lib/admin/admin-auth';


// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

const MAX_ACTION_LENGTH = 80;
const MAX_ENTITY_TYPE_LENGTH = 80;
const MAX_SEARCH_LENGTH = 100;

const ALLOWED_SORT_COLUMNS = new Set([
  'created_at',
]);

const ALLOWED_SORT_DIRECTIONS = new Set([
  'asc',
  'desc',
]);


// ============================================================
// INTERNAL HELPERS
// ============================================================

function clampLimit(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(
    MAX_LIMIT,
    Math.max(1, Math.floor(numeric)),
  );
}


function cleanText(
  value,
  maxLength,
) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .trim()
    .slice(0, maxLength);
}


function normalizeUuid(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const valueTrimmed = value.trim();

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      valueTrimmed,
    )
  ) {
    return null;
  }

  return valueTrimmed;
}


function normalizeSort(
  sort = 'created_at',
) {
  return ALLOWED_SORT_COLUMNS.has(sort)
    ? sort
    : 'created_at';
}


function normalizeDirection(
  direction = 'desc',
) {
  return ALLOWED_SORT_DIRECTIONS.has(direction)
    ? direction
    : 'desc';
}


function sanitizeMetadata(metadata) {
  if (
    metadata === null ||
    typeof metadata !== 'object' ||
    Array.isArray(metadata)
  ) {
    return {};
  }

  /*
   * Audit metadata comes from the database.
   *
   * We intentionally clone it before returning it so callers
   * cannot accidentally mutate the object reference returned
   * by Supabase.
   */
  try {
    return JSON.parse(
      JSON.stringify(metadata),
    );
  } catch {
    return {};
  }
}


function normalizeAuditLog(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id ?? null,

    actorUserId:
      row.actor_user_id ?? null,

    action:
      typeof row.action === 'string'
        ? row.action
        : '',

    entityType:
      typeof row.entity_type === 'string'
        ? row.entity_type
        : '',

    entityId:
      row.entity_id ?? null,

    metadata:
      sanitizeMetadata(row.metadata),

    createdAt:
      row.created_at ?? null,
  };
}


// ============================================================
// ADMIN AUTHORIZATION
// ============================================================

/**
 * Verify that the current authenticated user is allowed
 * to read admin audit information.
 *
 * Audit viewing requires:
 * 1. authenticated user
 * 2. active admin record
 * 3. AAL2 / MFA
 * 4. audit.view permission through admin role
 */
export async function requireAuditAdmin() {
  const admin = await getAdminIdentity();

  if (!admin) {
    return {
      authorized: false,
      status: 401,
      admin: null,
      error: 'ADMIN_AUTHENTICATION_REQUIRED',
    };
  }

  if (!admin.isActive) {
    return {
      authorized: false,
      status: 403,
      admin: null,
      error: 'ADMIN_ACCOUNT_INACTIVE',
    };
  }

  if (!isAdminMfaVerified(admin)) {
    return {
      authorized: false,
      status: 403,
      admin: null,
      error: 'ADMIN_MFA_REQUIRED',
    };
  }

  if (!canViewAdminData(admin)) {
    return {
      authorized: false,
      status: 403,
      admin: null,
      error: 'ADMIN_AUDIT_PERMISSION_REQUIRED',
    };
  }

  return {
    authorized: true,
    status: 200,
    admin,
    error: null,
  };
}


// ============================================================
// AUDIT LOG SELECT COLUMNS
// ============================================================

const AUDIT_COLUMNS = `
  id,
  actor_user_id,
  action,
  entity_type,
  entity_id,
  metadata,
  created_at
`;


// ============================================================
// GET AUDIT LOGS
// ============================================================

/**
 * Fetch admin audit logs.
 *
 * Supported filters:
 * - action
 * - entityType
 * - entityId
 * - actorUserId
 * - search
 * - limit
 * - sort
 * - direction
 *
 * This function is read-only.
 *
 * Database RLS remains the final security boundary.
 */
export async function getAuditLogs({
  action = '',
  entityType = '',
  entityId = null,
  actorUserId = null,
  search = '',
  limit = DEFAULT_LIMIT,
  sort = 'created_at',
  direction = 'desc',
} = {}) {
  const authorization =
    await requireAuditAdmin();

  if (!authorization.authorized) {
    return {
      authorized: false,
      status: authorization.status,
      logs: [],
      admin: null,
      error: authorization.error,
    };
  }

  const supabase =
    await createClient();

  const safeAction = cleanText(
    action,
    MAX_ACTION_LENGTH,
  );

  const safeEntityType = cleanText(
    entityType,
    MAX_ENTITY_TYPE_LENGTH,
  );

  const safeEntityId =
    normalizeUuid(entityId);

  const safeActorUserId =
    normalizeUuid(actorUserId);

  const safeSearch = cleanText(
    search,
    MAX_SEARCH_LENGTH,
  );

  const safeLimit =
    clampLimit(limit);

  const safeSort =
    normalizeSort(sort);

  const safeDirection =
    normalizeDirection(direction);

  let query = supabase
    .from('audit_logs')
    .select(AUDIT_COLUMNS)
    .limit(safeLimit);

  // ----------------------------------------------------------
  // FILTER: ACTION
  // ----------------------------------------------------------

  if (safeAction) {
    query = query.eq(
      'action',
      safeAction,
    );
  }

  // ----------------------------------------------------------
  // FILTER: ENTITY TYPE
  // ----------------------------------------------------------

  if (safeEntityType) {
    query = query.eq(
      'entity_type',
      safeEntityType,
    );
  }

  // ----------------------------------------------------------
  // FILTER: ENTITY ID
  // ----------------------------------------------------------

  if (safeEntityId) {
    query = query.eq(
      'entity_id',
      safeEntityId,
    );
  }

  // ----------------------------------------------------------
  // FILTER: ACTOR
  // ----------------------------------------------------------

  if (safeActorUserId) {
    query = query.eq(
      'actor_user_id',
      safeActorUserId,
    );
  }

  // ----------------------------------------------------------
  // SEARCH
  //
  // Search only controlled text columns.
  // Metadata is intentionally not searched here because
  // arbitrary JSON searching can become expensive and can
  // accidentally expose implementation details.
  // ----------------------------------------------------------

  if (safeSearch) {
    const escapedSearch =
      safeSearch
        .replace(/\\/g, '\\\\')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')
        .replace(/,/g, '\\,');

    query = query.or(
      [
        `action.ilike.%${escapedSearch}%`,
        `entity_type.ilike.%${escapedSearch}%`,
      ].join(','),
    );
  }

  // ----------------------------------------------------------
  // ORDER
  // ----------------------------------------------------------

  query = query.order(
    safeSort,
    {
      ascending:
        safeDirection === 'asc',
    },
  );

  const {
    data,
    error,
  } = await query;

  if (error) {
    console.error(
      '[Worldwide DIPO] Audit log query failed:',
      error.message,
    );

    return {
      authorized: true,
      status: 500,
      logs: [],
      admin:
        authorization.admin,
      error:
        'AUDIT_LOGS_UNAVAILABLE',
    };
  }

  const logs =
    Array.isArray(data)
      ? data
          .map(normalizeAuditLog)
          .filter(Boolean)
      : [];

  return {
    authorized: true,
    status: 200,
    logs,
    admin:
      authorization.admin,
    error: null,
  };
}


// ============================================================
// GET SINGLE AUDIT LOG
// ============================================================

/**
 * Fetch one audit record by UUID.
 *
 * Useful for a future audit detail page/modal.
 */
export async function getAuditLogById(
  auditLogId,
) {
  const authorization =
    await requireAuditAdmin();

  if (!authorization.authorized) {
    return {
      authorized: false,
      status: authorization.status,
      log: null,
      admin: null,
      error: authorization.error,
    };
  }

  const safeId =
    normalizeUuid(auditLogId);

  if (!safeId) {
    return {
      authorized: true,
      status: 400,
      log: null,
      admin:
        authorization.admin,
      error:
        'INVALID_AUDIT_LOG_ID',
    };
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from('audit_logs')
    .select(AUDIT_COLUMNS)
    .eq('id', safeId)
    .maybeSingle();

  if (error) {
    console.error(
      '[Worldwide DIPO] Audit log lookup failed:',
      error.message,
    );

    return {
      authorized: true,
      status: 500,
      log: null,
      admin:
        authorization.admin,
      error:
        'AUDIT_LOG_UNAVAILABLE',
    };
  }

  if (!data) {
    return {
      authorized: true,
      status: 404,
      log: null,
      admin:
        authorization.admin,
      error:
        'AUDIT_LOG_NOT_FOUND',
    };
  }

  return {
    authorized: true,
    status: 200,
    log:
      normalizeAuditLog(data),
    admin:
      authorization.admin,
    error: null,
  };
}


// ============================================================
// AUDIT SUMMARY
// ============================================================

/**
 * Lightweight summary for the admin dashboard.
 *
 * This intentionally uses the existing audit table and does
 * not create or mutate anything.
 */
export async function getAuditSummary({
  limit = 100,
} = {}) {
  const result =
    await getAuditLogs({
      limit,
      sort: 'created_at',
      direction: 'desc',
    });

  if (!result.authorized) {
    return result;
  }

  const actionCounts = {};
  const entityCounts = {};

  for (const log of result.logs) {
    const action =
      log.action || 'unknown';

    const entity =
      log.entityType || 'unknown';

    actionCounts[action] =
      (actionCounts[action] || 0) + 1;

    entityCounts[entity] =
      (entityCounts[entity] || 0) + 1;
  }

  return {
    authorized: true,
    status: 200,
    admin: result.admin,
    totalLoaded:
      result.logs.length,

    actionCounts,

    entityCounts,

    latest:
      result.logs[0] ?? null,

    logs:
      result.logs,

    error: null,
  };
}


// ============================================================
// COMMON ADMIN AUDIT FILTERS
// ============================================================

export const AUDIT_ACTIONS = Object.freeze([
  'payment.approved',
  'payment.rejected',
]);


export const AUDIT_ENTITY_TYPES =
  Object.freeze([
    'payment',
  ]);


// ============================================================
// SAFE DISPLAY HELPERS
// ============================================================

/**
 * Human-friendly action label.
 *
 * UI-only helper.
 */
export function getAuditActionLabel(
  action,
) {
  switch (action) {
    case 'payment.approved':
      return 'Payment Approved';

    case 'payment.rejected':
      return 'Payment Rejected';

    default:
      return action
        ? action
            .replace(/\./g, ' ')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (char) =>
              char.toUpperCase(),
            )
        : 'Unknown Action';
  }
}


/**
 * Human-friendly entity label.
 *
 * UI-only helper.
 */
export function getAuditEntityLabel(
  entityType,
) {
  if (!entityType) {
    return 'Unknown';
  }

  return entityType
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}


/**
 * Relative-friendly date formatter.
 *
 * Kept server-safe by using Intl only.
 */
export function formatAuditDate(
  value,
) {
  if (!value) {
    return 'Unknown time';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'Unknown time';
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    },
  ).format(date);
}


// ============================================================
// EXPORT DEFAULT
// ============================================================

const adminAudit = {
  requireAuditAdmin,
  getAuditLogs,
  getAuditLogById,
  getAuditSummary,
  getAuditActionLabel,
  getAuditEntityLabel,
  formatAuditDate,
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
};

export default adminAudit;