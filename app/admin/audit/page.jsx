import Link from 'next/link';
import { redirect } from 'next/navigation';

import {
  getAuditLogs,
  getAuditActionLabel,
  getAuditEntityLabel,
  formatAuditDate,
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
} from '@/lib/admin/admin-audit';


// ============================================================
// PAGE CONFIG
// ============================================================

export const metadata = {
  title: 'Admin Audit | Worldwide DIPO',
  description:
    'Secure administrative activity audit logs for Worldwide DIPO.',
  robots: {
    index: false,
    follow: false,
  },
};


// ============================================================
// CONSTANTS
// ============================================================

const PAGE_LIMIT = 100;


// ============================================================
// SMALL UI HELPERS
// ============================================================

function normalizeQueryValue(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, 100);
}


function getStatusTone(action) {
  if (action === 'payment.approved') {
    return 'success';
  }

  if (action === 'payment.rejected') {
    return 'danger';
  }

  return 'neutral';
}


function getStatusIcon(action) {
  if (action === 'payment.approved') {
    return '✓';
  }

  if (action === 'payment.rejected') {
    return '!';
  }

  return '•';
}


function getActionDescription(action) {
  switch (action) {
    case 'payment.approved':
      return 'Payment was approved by an authorized admin.';

    case 'payment.rejected':
      return 'Payment was rejected by an authorized admin.';

    default:
      return 'Administrative activity recorded by Worldwide DIPO.';
  }
}


// ============================================================
// INLINE STYLE SYSTEM
//
// Kept inside this server component intentionally.
// No styled-jsx.
// No client-side JavaScript dependency.
// ============================================================

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #f8fafc 100%)',
    color: '#0f172a',
    padding: '28px 18px 72px',
  },

  shell: {
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
  },

  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },

  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },

  logo: {
    width: '46px',
    height: '46px',
    borderRadius: '15px',
    display: 'grid',
    placeItems: 'center',
    background: '#0f172a',
    color: '#ffffff',
    fontSize: '17px',
    fontWeight: 900,
    letterSpacing: '-0.04em',
    boxShadow:
      '0 10px 30px rgba(15, 23, 42, 0.16)',
  },

  eyebrow: {
    margin: 0,
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#64748b',
  },

  title: {
    margin: '4px 0 0',
    fontSize: 'clamp(26px, 4vw, 42px)',
    lineHeight: 1.05,
    letterSpacing: '-0.045em',
    fontWeight: 900,
  },

  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },

  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '42px',
    padding: '0 15px',
    borderRadius: '13px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#0f172a',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 800,
    boxShadow:
      '0 5px 18px rgba(15, 23, 42, 0.05)',
  },

  primaryButton: {
    background: '#0f172a',
    borderColor: '#0f172a',
    color: '#ffffff',
  },

  intro: {
    maxWidth: '760px',
    marginBottom: '28px',
    color: '#64748b',
    fontSize: '15px',
    lineHeight: 1.7,
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '14px',
    marginBottom: '22px',
  },

  statCard: {
    background: '#ffffff',
    border: '1px solid #e8edf3',
    borderRadius: '20px',
    padding: '20px',
    boxShadow:
      '0 12px 40px rgba(15, 23, 42, 0.045)',
  },

  statLabel: {
    margin: 0,
    color: '#64748b',
    fontSize: '12px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.09em',
  },

  statValue: {
    margin: '9px 0 0',
    fontSize: '28px',
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: '-0.04em',
  },

  statMeta: {
    margin: '8px 0 0',
    color: '#94a3b8',
    fontSize: '12px',
  },

  mainCard: {
    background: '#ffffff',
    border: '1px solid #e8edf3',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow:
      '0 18px 60px rgba(15, 23, 42, 0.055)',
  },

  cardHeader: {
    padding: '22px',
    borderBottom: '1px solid #eef2f7',
  },

  headerTitle: {
    margin: 0,
    fontSize: '19px',
    fontWeight: 900,
    letterSpacing: '-0.025em',
  },

  headerText: {
    margin: '6px 0 0',
    color: '#64748b',
    fontSize: '13px',
    lineHeight: 1.6,
  },

  filters: {
    padding: '18px 22px',
    background: '#fbfcfe',
    borderBottom: '1px solid #eef2f7',
  },

  filterGrid: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(200px, 1.6fr) repeat(2, minmax(150px, 0.7fr)) auto',
    gap: '10px',
    alignItems: 'end',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },

  label: {
    fontSize: '11px',
    fontWeight: 800,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  input: {
    width: '100%',
    minHeight: '42px',
    borderRadius: '12px',
    border: '1px solid #dfe6ee',
    background: '#ffffff',
    padding: '0 12px',
    color: '#0f172a',
    outline: 'none',
    fontSize: '13px',
  },

  select: {
    width: '100%',
    minHeight: '42px',
    borderRadius: '12px',
    border: '1px solid #dfe6ee',
    background: '#ffffff',
    padding: '0 12px',
    color: '#0f172a',
    outline: 'none',
    fontSize: '13px',
  },

  submit: {
    minHeight: '42px',
    border: 0,
    borderRadius: '12px',
    padding: '0 17px',
    background: '#0f172a',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 800,
    cursor: 'pointer',
  },

  tableWrap: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    minWidth: '900px',
    borderCollapse: 'collapse',
  },

  th: {
    padding: '14px 20px',
    textAlign: 'left',
    background: '#fafbfc',
    borderBottom: '1px solid #eef2f7',
    color: '#64748b',
    fontSize: '10px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.09em',
    whiteSpace: 'nowrap',
  },

  td: {
    padding: '17px 20px',
    borderBottom: '1px solid #f0f3f7',
    verticalAlign: 'top',
    fontSize: '13px',
  },

  actionCell: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '11px',
  },

  icon: {
    width: '31px',
    height: '31px',
    flexShrink: 0,
    borderRadius: '10px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '13px',
    fontWeight: 900,
  },

  actionName: {
    margin: 0,
    fontWeight: 900,
    color: '#0f172a',
  },

  actionDescription: {
    margin: '4px 0 0',
    color: '#94a3b8',
    fontSize: '11px',
    lineHeight: 1.5,
  },

  mono: {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '11px',
    color: '#475569',
    wordBreak: 'break-all',
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '27px',
    padding: '0 9px',
    borderRadius: '999px',
    fontSize: '10px',
    fontWeight: 900,
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
  },

  metadata: {
    marginTop: '8px',
    padding: '10px',
    borderRadius: '10px',
    background: '#f8fafc',
    border: '1px solid #edf1f5',
    color: '#475569',
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '10px',
    lineHeight: 1.55,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },

  empty: {
    padding: '70px 24px',
    textAlign: 'center',
  },

  emptyIcon: {
    width: '54px',
    height: '54px',
    margin: '0 auto 15px',
    borderRadius: '17px',
    display: 'grid',
    placeItems: 'center',
    background: '#f1f5f9',
    color: '#64748b',
    fontSize: '21px',
    fontWeight: 900,
  },

  emptyTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 900,
  },

  emptyText: {
    maxWidth: '470px',
    margin: '8px auto 0',
    color: '#94a3b8',
    fontSize: '13px',
    lineHeight: 1.6,
  },

  footer: {
    marginTop: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
    color: '#94a3b8',
    fontSize: '11px',
  },

  error: {
    padding: '24px',
    borderRadius: '18px',
    background: '#fff7f7',
    border: '1px solid #fee2e2',
    color: '#991b1b',
  },
};


// ============================================================
// PAGE
// ============================================================

export default async function AdminAuditPage({
  searchParams,
}) {
  const params =
    searchParams
      ? await searchParams
      : {};

  const action =
    normalizeQueryValue(
      params?.action,
    );

  const entityType =
    normalizeQueryValue(
      params?.entityType,
    );

  const search =
    normalizeQueryValue(
      params?.search,
    );

  // ----------------------------------------------------------
  // SECURE SERVER-SIDE QUERY
  // ----------------------------------------------------------

  const result =
    await getAuditLogs({
      action,
      entityType,
      search,
      limit: PAGE_LIMIT,
      sort: 'created_at',
      direction: 'desc',
    });

  // ----------------------------------------------------------
  // AUTH FAILURE
  // ----------------------------------------------------------

  if (
    result.status === 401 ||
    result.error ===
      'ADMIN_AUTHENTICATION_REQUIRED'
  ) {
    redirect('/admin/login');
  }

  // ----------------------------------------------------------
  // MFA / PERMISSION FAILURE
  // ----------------------------------------------------------

  if (
    result.status === 403
  ) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.error}>
            <strong>
              Admin verification required.
            </strong>

            <p style={{ margin: '8px 0 0' }}>
              This area requires an authorized
              admin session with the required
              security level.
            </p>

            <div
              style={{
                marginTop: '15px',
              }}
            >
              <Link
                href="/admin"
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                }}
              >
                Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ----------------------------------------------------------
  // DATABASE / SERVER FAILURE
  // ----------------------------------------------------------

  if (result.status >= 500) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.error}>
            <strong>
              Audit service temporarily unavailable.
            </strong>

            <p style={{ margin: '8px 0 0' }}>
              The audit records could not be loaded.
              No admin data has been modified.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const logs =
    Array.isArray(result.logs)
      ? result.logs
      : [];

  // ----------------------------------------------------------
  // LOCAL SUMMARY
  // ----------------------------------------------------------

  const approvedCount =
    logs.filter(
      (log) =>
        log.action ===
        'payment.approved',
    ).length;

  const rejectedCount =
    logs.filter(
      (log) =>
        log.action ===
        'payment.rejected',
    ).length;

  const uniqueActors =
    new Set(
      logs
        .map(
          (log) =>
            log.actorUserId,
        )
        .filter(Boolean),
    ).size;

  const latestLog =
    logs[0] ?? null;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main style={styles.page}>
      <div style={styles.shell}>

        {/* ====================================================
            HEADER
        ==================================================== */}

        <header style={styles.topBar}>
          <div style={styles.brandRow}>
            <div style={styles.logo}>
              WD
            </div>

            <div>
              <p style={styles.eyebrow}>
                Worldwide DIPO · Secure Admin
              </p>

              <h1 style={styles.title}>
                Audit Center
              </h1>
            </div>
          </div>

          <div style={styles.topActions}>
            <Link
              href="/admin"
              style={styles.button}
            >
              ← Admin Dashboard
            </Link>

            <Link
              href="/admin/payments"
              style={{
                ...styles.button,
                ...styles.primaryButton,
              }}
            >
              Payment Review
            </Link>
          </div>
        </header>


        {/* ====================================================
            INTRO
        ==================================================== */}

        <p style={styles.intro}>
          A secure, read-only timeline of sensitive
          administrative activity across Worldwide DIPO.
          Every record is designed for accountability,
          traceability and operational visibility.
        </p>


        {/* ====================================================
            STAT CARDS
        ==================================================== */}

        <section
          style={styles.statsGrid}
          aria-label="Audit statistics"
        >

          <div style={styles.statCard}>
            <p style={styles.statLabel}>
              Loaded Events
            </p>

            <p style={styles.statValue}>
              {logs.length}
            </p>

            <p style={styles.statMeta}>
              Latest records in this view
            </p>
          </div>


          <div style={styles.statCard}>
            <p style={styles.statLabel}>
              Approved
            </p>

            <p style={styles.statValue}>
              {approvedCount}
            </p>

            <p style={styles.statMeta}>
              Payment approval actions
            </p>
          </div>


          <div style={styles.statCard}>
            <p style={styles.statLabel}>
              Rejected
            </p>

            <p style={styles.statValue}>
              {rejectedCount}
            </p>

            <p style={styles.statMeta}>
              Payment rejection actions
            </p>
          </div>


          <div style={styles.statCard}>
            <p style={styles.statLabel}>
              Admin Actors
            </p>

            <p style={styles.statValue}>
              {uniqueActors}
            </p>

            <p style={styles.statMeta}>
              Unique actors in this view
            </p>
          </div>

        </section>


        {/* ====================================================
            MAIN AUDIT CARD
        ==================================================== */}

        <section style={styles.mainCard}>

          <div style={styles.cardHeader}>
            <h2 style={styles.headerTitle}>
              Administrative Activity
            </h2>

            <p style={styles.headerText}>
              Append-only audit records. This screen
              does not modify, approve or reject anything.
            </p>
          </div>


          {/* ==================================================
              FILTERS
          ================================================== */}

          <form
            method="GET"
            style={styles.filters}
          >
            <div style={styles.filterGrid}>

              <div style={styles.field}>
                <label
                  htmlFor="audit-search"
                  style={styles.label}
                >
                  Search
                </label>

                <input
                  id="audit-search"
                  name="search"
                  type="search"
                  defaultValue={search}
                  placeholder="Search action or entity..."
                  maxLength={100}
                  style={styles.input}
                />
              </div>


              <div style={styles.field}>
                <label
                  htmlFor="audit-action"
                  style={styles.label}
                >
                  Action
                </label>

                <select
                  id="audit-action"
                  name="action"
                  defaultValue={action}
                  style={styles.select}
                >
                  <option value="">
                    All actions
                  </option>

                  {AUDIT_ACTIONS.map(
                    (auditAction) => (
                      <option
                        key={auditAction}
                        value={auditAction}
                      >
                        {getAuditActionLabel(
                          auditAction,
                        )}
                      </option>
                    ),
                  )}
                </select>
              </div>


              <div style={styles.field}>
                <label
                  htmlFor="audit-entity"
                  style={styles.label}
                >
                  Entity
                </label>

                <select
                  id="audit-entity"
                  name="entityType"
                  defaultValue={entityType}
                  style={styles.select}
                >
                  <option value="">
                    All entities
                  </option>

                  {AUDIT_ENTITY_TYPES.map(
                    (entity) => (
                      <option
                        key={entity}
                        value={entity}
                      >
                        {getAuditEntityLabel(
                          entity,
                        )}
                      </option>
                    ),
                  )}
                </select>
              </div>


              <div>
                <button
                  type="submit"
                  style={styles.submit}
                >
                  Apply Filters
                </button>
              </div>

            </div>
          </form>


          {/* ==================================================
              ACTIVE FILTERS
          ================================================== */}

          {(action ||
            entityType ||
            search) && (
            <div
              style={{
                padding:
                  '12px 22px',
                borderBottom:
                  '1px solid #eef2f7',
                background:
                  '#ffffff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems:
                    'center',
                  gap: '8px',
                  flexWrap:
                    'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#64748b',
                  }}
                >
                  Active filters:
                </span>

                {search && (
                  <span
                    style={{
                      ...styles.badge,
                      background:
                        '#f1f5f9',
                      color:
                        '#475569',
                    }}
                  >
                    Search: {search}
                  </span>
                )}

                {action && (
                  <span
                    style={{
                      ...styles.badge,
                      background:
                        '#eef2ff',
                      color:
                        '#3730a3',
                    }}
                  >
                    {getAuditActionLabel(
                      action,
                    )}
                  </span>
                )}

                {entityType && (
                  <span
                    style={{
                      ...styles.badge,
                      background:
                        '#ecfeff',
                      color:
                        '#155e75',
                    }}
                  >
                    {getAuditEntityLabel(
                      entityType,
                    )}
                  </span>
                )}

                <Link
                  href="/admin/audit"
                  style={{
                    ...styles.button,
                    minHeight: '28px',
                    padding: '0 10px',
                    fontSize: '10px',
                    marginLeft: '2px',
                  }}
                >
                  Clear
                </Link>
              </div>
            </div>
          )}


          {/* ==================================================
              TABLE / EMPTY
          ================================================== */}

          {logs.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                ✓
              </div>

              <h3 style={styles.emptyTitle}>
                No audit events found
              </h3>

              <p style={styles.emptyText}>
                There are no audit records matching
                the current filters. Try clearing the
                filters or check again after a
                protected admin action occurs.
              </p>
            </div>
          ) : (
            <div style={styles.tableWrap}>
              <table
                style={styles.table}
              >
                <thead>
                  <tr>
                    <th style={styles.th}>
                      Activity
                    </th>

                    <th style={styles.th}>
                      Entity
                    </th>

                    <th style={styles.th}>
                      Actor
                    </th>

                    <th style={styles.th}>
                      Entity ID
                    </th>

                    <th style={styles.th}>
                      Time
                    </th>

                    <th style={styles.th}>
                      Metadata
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {logs.map(
                    (log) => {
                      const tone =
                        getStatusTone(
                          log.action,
                        );

                      const icon =
                        getStatusIcon(
                          log.action,
                        );

                      const toneStyles =
                        tone === 'success'
                          ? {
                              background:
                                '#ecfdf5',
                              color:
                                '#047857',
                            }
                          : tone === 'danger'
                            ? {
                                background:
                                  '#fff1f2',
                                color:
                                  '#be123c',
                              }
                            : {
                                background:
                                  '#f1f5f9',
                                color:
                                  '#475569',
                              };

                      return (
                        <tr
                          key={log.id}
                        >

                          {/* --------------------------------
                              ACTION
                          --------------------------------- */}

                          <td
                            style={
                              styles.td
                            }
                          >
                            <div
                              style={
                                styles.actionCell
                              }
                            >
                              <span
                                style={{
                                  ...styles.icon,
                                  ...toneStyles,
                                }}
                                aria-hidden="true"
                              >
                                {icon}
                              </span>

                              <div>
                                <p
                                  style={
                                    styles.actionName
                                  }
                                >
                                  {getAuditActionLabel(
                                    log.action,
                                  )}
                                </p>

                                <p
                                  style={
                                    styles.actionDescription
                                  }
                                >
                                  {getActionDescription(
                                    log.action,
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>


                          {/* --------------------------------
                              ENTITY
                          --------------------------------- */}

                          <td
                            style={
                              styles.td
                            }
                          >
                            <span
                              style={{
                                ...styles.badge,
                                ...toneStyles,
                              }}
                            >
                              {getAuditEntityLabel(
                                log.entityType,
                              )}
                            </span>
                          </td>


                          {/* --------------------------------
                              ACTOR
                          --------------------------------- */}

                          <td
                            style={
                              styles.td
                            }
                          >
                            <div
                              style={
                                styles.mono
                              }
                            >
                              {log.actorUserId ||
                                'System'}
                            </div>
                          </td>


                          {/* --------------------------------
                              ENTITY ID
                          --------------------------------- */}

                          <td
                            style={
                              styles.td
                            }
                          >
                            <div
                              style={
                                styles.mono
                              }
                            >
                              {log.entityId ||
                                '—'}
                            </div>
                          </td>


                          {/* --------------------------------
                              TIME
                          --------------------------------- */}

                          <td
                            style={
                              styles.td
                            }
                          >
                            <time
                              dateTime={
                                log.createdAt ||
                                undefined
                              }
                              style={{
                                fontSize:
                                  '12px',
                                fontWeight:
                                  800,
                                color:
                                  '#334155',
                                whiteSpace:
                                  'nowrap',
                              }}
                            >
                              {formatAuditDate(
                                log.createdAt,
                              )}
                            </time>
                          </td>


                          {/* --------------------------------
                              METADATA
                          --------------------------------- */}

                          <td
                            style={
                              styles.td
                            }
                          >
                            <details>
                              <summary
                                style={{
                                  cursor:
                                    'pointer',
                                  fontSize:
                                    '11px',
                                  fontWeight:
                                    800,
                                  color:
                                    '#475569',
                                }}
                              >
                                View details
                              </summary>

                              <pre
                                style={
                                  styles.metadata
                                }
                              >
                                {JSON.stringify(
                                  log.metadata ||
                                    {},
                                  null,
                                  2,
                                )}
                              </pre>
                            </details>
                          </td>

                        </tr>
                      );
                    },
                  )}

                </tbody>
              </table>
            </div>
          )}

        </section>


        {/* ====================================================
            FOOTER STATUS
        ==================================================== */}

        <footer style={styles.footer}>
          <span>
            Worldwide DIPO · DIPO LABS
          </span>

          <span>
            {latestLog
              ? `Latest event: ${formatAuditDate(
                  latestLog.createdAt,
                )}`
              : 'No events loaded'}
          </span>

          <span>
            Read-only audit view · Admin access required
          </span>
        </footer>

      </div>
    </main>
  );
}