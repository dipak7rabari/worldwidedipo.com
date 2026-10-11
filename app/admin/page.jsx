import AdminWorkspace from '@/components/admin/AdminWorkspace';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import {
  getAdminIdentity,
  isAdminMfaVerified,
  canManagePayments,
  canViewAdminData,
} from '@/lib/admin/admin-auth';

import { getPendingPayments } from '@/lib/admin/get-pending-payments';


// ============================================================
// WORLDWIDE DIPO — ADMIN COMMAND CENTER
// Server Component
// Read-only dashboard
// No styled-jsx
// No client JavaScript dependency
// ============================================================


// ============================================================
// METADATA
// ============================================================

export const metadata = {
  title: 'Admin Command Center | Worldwide DIPO',
  description:
    'Secure Worldwide DIPO administration command center.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


// ============================================================
// DESIGN TOKENS
// ============================================================

const colors = {
  ink: '#0b1220',
  inkSoft: '#172033',
  text: '#1e293b',
  muted: '#64748b',
  subtle: '#94a3b8',

  white: '#ffffff',
  canvas: '#f7f9fc',
  canvasSoft: '#fbfcfe',

  line: '#e8edf3',
  lineStrong: '#dbe3ec',

  blue: '#2563eb',
  blueDark: '#1d4ed8',
  blueSoft: '#eff6ff',

  green: '#047857',
  greenSoft: '#ecfdf5',

  amber: '#b45309',
  amberSoft: '#fffbeb',

  red: '#be123c',
  redSoft: '#fff1f2',

  violet: '#6d28d9',
  violetSoft: '#f5f3ff',
};


// ============================================================
// INLINE STYLE SYSTEM
// ============================================================

const styles = {
  page: {
    minHeight: '100vh',
    background: colors.canvas,
    color: colors.text,
    padding: '24px 16px 70px',
  },

  shell: {
    width: '100%',
    maxWidth: '1480px',
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    flexWrap: 'wrap',
    marginBottom: '28px',
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
  },

  logo: {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    display: 'grid',
    placeItems: 'center',
    background:
      'linear-gradient(145deg, #0b1220 0%, #172033 100%)',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 950,
    letterSpacing: '-0.05em',
    boxShadow:
      '0 12px 30px rgba(11,18,32,0.16)',
  },

  eyebrow: {
    margin: 0,
    color: colors.muted,
    fontSize: '10px',
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },

  title: {
    margin: '6px 0 0',
    color: colors.ink,
    fontSize: 'clamp(27px, 4vw, 42px)',
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: '-0.055em',
  },

  subtitle: {
    margin: '9px 0 0',
    maxWidth: '680px',
    color: colors.muted,
    fontSize: '13px',
    lineHeight: 1.65,
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    flexWrap: 'wrap',
  },

  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '42px',
    padding: '0 14px',
    borderRadius: '13px',
    border: `1px solid ${colors.lineStrong}`,
    background: colors.white,
    color: colors.text,
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 850,
    boxShadow:
      '0 5px 18px rgba(15,23,42,0.045)',
  },

  primaryButton: {
    background: colors.ink,
    borderColor: colors.ink,
    color: colors.white,
  },

  blueButton: {
    background: colors.blue,
    borderColor: colors.blue,
    color: colors.white,
  },

  hero: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '28px',
    border: `1px solid ${colors.line}`,
    background: colors.white,
    boxShadow:
      '0 22px 70px rgba(15,23,42,0.065)',
    padding: '28px',
    marginBottom: '18px',
  },

  heroGlowOne: {
    position: 'absolute',
    width: '220px',
    height: '220px',
    right: '-80px',
    top: '-100px',
    borderRadius: '999px',
    background:
      'radial-gradient(circle, rgba(37,99,235,0.11), rgba(37,99,235,0) 70%)',
    pointerEvents: 'none',
  },

  heroGlowTwo: {
    position: 'absolute',
    width: '190px',
    height: '190px',
    left: '-90px',
    bottom: '-120px',
    borderRadius: '999px',
    background:
      'radial-gradient(circle, rgba(109,40,217,0.07), rgba(109,40,217,0) 70%)',
    pointerEvents: 'none',
  },

  heroContent: {
    position: 'relative',
    zIndex: 1,
  },

  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '18px',
  },

  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    minHeight: '29px',
    padding: '0 10px',
    borderRadius: '999px',
    fontSize: '10px',
    fontWeight: 900,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },

  liveDot: {
    width: '7px',
    height: '7px',
    borderRadius: '999px',
    background: '#10b981',
    boxShadow: '0 0 0 4px rgba(16,185,129,0.10)',
  },

  heroTitle: {
    margin: 0,
    color: colors.ink,
    fontSize: 'clamp(23px, 3vw, 34px)',
    lineHeight: 1.1,
    fontWeight: 950,
    letterSpacing: '-0.045em',
  },

  heroText: {
    margin: '9px 0 0',
    maxWidth: '720px',
    color: colors.muted,
    fontSize: '13px',
    lineHeight: 1.7,
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '12px',
    marginBottom: '18px',
  },

  stat: {
    minHeight: '148px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: `1px solid ${colors.line}`,
    borderRadius: '22px',
    background: colors.white,
    padding: '18px',
    boxShadow:
      '0 12px 40px rgba(15,23,42,0.045)',
  },

  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },

  statIcon: {
    width: '34px',
    height: '34px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '11px',
    fontSize: '14px',
    fontWeight: 950,
  },

  statLabel: {
    margin: 0,
    color: colors.muted,
    fontSize: '10px',
    fontWeight: 900,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },

  statValue: {
    margin: '13px 0 0',
    color: colors.ink,
    fontSize: '31px',
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: '-0.055em',
  },

  statMeta: {
    margin: '7px 0 0',
    color: colors.subtle,
    fontSize: '11px',
    lineHeight: 1.45,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(0, 1.45fr) minmax(300px, 0.75fr)',
    gap: '18px',
    alignItems: 'start',
  },

  card: {
    border: `1px solid ${colors.line}`,
    borderRadius: '24px',
    background: colors.white,
    boxShadow:
      '0 15px 50px rgba(15,23,42,0.045)',
    overflow: 'hidden',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '21px 22px',
    borderBottom: `1px solid ${colors.line}`,
  },

  cardTitle: {
    margin: 0,
    color: colors.ink,
    fontSize: '17px',
    fontWeight: 950,
    letterSpacing: '-0.025em',
  },

  cardText: {
    margin: '5px 0 0',
    color: colors.muted,
    fontSize: '11px',
    lineHeight: 1.55,
  },

  cardBody: {
    padding: '20px 22px',
  },

  queue: {
    display: 'flex',
    flexDirection: 'column',
  },

  queueItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
    padding: '15px 0',
    borderBottom: `1px solid #f0f3f7`,
  },

  queueItemLast: {
    borderBottom: 0,
  },

  queueLeft: {
    minWidth: 0,
  },

  queueTitle: {
    margin: 0,
    color: colors.ink,
    fontSize: '13px',
    fontWeight: 850,
  },

  queueMeta: {
    margin: '4px 0 0',
    color: colors.subtle,
    fontSize: '10px',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },

  amount: {
    flexShrink: 0,
    color: colors.ink,
    fontSize: '14px',
    fontWeight: 950,
  },

  sectionGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(2, minmax(0, 1fr))',
    gap: '10px',
  },

  action: {
    minHeight: '105px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px',
    borderRadius: '17px',
    border: `1px solid ${colors.line}`,
    background: colors.canvasSoft,
    color: colors.text,
    textDecoration: 'none',
    transition: 'transform 160ms ease',
  },

  actionIcon: {
    width: '32px',
    height: '32px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '10px',
    background: colors.white,
    border: `1px solid ${colors.line}`,
    fontSize: '13px',
    fontWeight: 950,
  },

  actionTitle: {
    margin: '13px 0 0',
    color: colors.ink,
    fontSize: '12px',
    fontWeight: 900,
  },

  actionText: {
    margin: '4px 0 0',
    color: colors.muted,
    fontSize: '10px',
    lineHeight: 1.45,
  },

  security: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  securityItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '12px 13px',
    borderRadius: '14px',
    background: colors.canvasSoft,
    border: `1px solid ${colors.line}`,
  },

  securityLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    minWidth: 0,
  },

  securityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '999px',
    flexShrink: 0,
  },

  securityName: {
    color: colors.text,
    fontSize: '11px',
    fontWeight: 800,
  },

  securityState: {
    flexShrink: 0,
    fontSize: '9px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  roleCard: {
    padding: '16px',
    borderRadius: '17px',
    background:
      'linear-gradient(135deg, #0b1220 0%, #18243a 100%)',
    color: colors.white,
  },

  roleLabel: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '9px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },

  roleName: {
    margin: '7px 0 0',
    fontSize: '20px',
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: '-0.04em',
  },

  roleMeta: {
    margin: '8px 0 0',
    color: '#cbd5e1',
    fontSize: '10px',
    lineHeight: 1.5,
  },

  notice: {
    padding: '15px',
    borderRadius: '16px',
    border: `1px solid ${colors.line}`,
    background: colors.canvasSoft,
    color: colors.muted,
    fontSize: '11px',
    lineHeight: 1.65,
  },

  noticeStrong: {
    color: colors.text,
    fontWeight: 900,
  },

  empty: {
    padding: '35px 15px',
    textAlign: 'center',
  },

  emptyIcon: {
    width: '44px',
    height: '44px',
    margin: '0 auto 11px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '14px',
    background: colors.greenSoft,
    color: colors.green,
    fontSize: '17px',
    fontWeight: 950,
  },

  emptyTitle: {
    margin: 0,
    color: colors.ink,
    fontSize: '14px',
    fontWeight: 900,
  },

  emptyText: {
    maxWidth: '370px',
    margin: '6px auto 0',
    color: colors.subtle,
    fontSize: '10px',
    lineHeight: 1.55,
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '18px',
    padding: '4px 2px',
    color: colors.subtle,
    fontSize: '10px',
  },
};


// ============================================================
// HELPERS
// ============================================================

function humanizeRole(role) {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';

    case 'admin':
      return 'Admin';

    case 'support':
      return 'Support';

    default:
      return 'Admin';
  }
}


function formatPlan(plan) {
  if (!plan) {
    return 'Plan';
  }

  return String(plan)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}


function formatMoney(amount) {
  const numeric = Number(amount);

  if (!Number.isFinite(numeric)) {
    return '₹—';
  }

  return `₹${numeric.toLocaleString('en-IN')}`;
}


function formatDate(value) {
  if (!value) {
    return '—';
  }

  try {
    return new Intl.DateTimeFormat(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    ).format(new Date(value));
  } catch {
    return '—';
  }
}


// ============================================================
// PAGE
// ============================================================

export default async function AdminPage() {
  // ----------------------------------------------------------
  // SECURE ADMIN IDENTITY
  // ----------------------------------------------------------

  const admin = await getAdminIdentity();

  if (!admin) {
    redirect('/admin/login');
  }


  // ----------------------------------------------------------
  // SECURITY STATE
  // ----------------------------------------------------------

  const mfaVerified =
    isAdminMfaVerified(admin);

  const paymentAccess =
    canManagePayments(admin);

  const adminDataAccess =
    canViewAdminData(admin);


  // ----------------------------------------------------------
  // PAYMENT QUEUE
  //
  // Only payment-capable admins can query
  // pending payment claims.
  // ----------------------------------------------------------

  let pendingPayments = [];
  let paymentStatus = 200;

  if (paymentAccess) {
    const result =
      await getPendingPayments();

    pendingPayments =
      Array.isArray(result?.payments)
        ? result.payments
        : [];

    paymentStatus =
      result?.status || 200;
  }


  // ----------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------

  const pendingCount =
    pendingPayments.length;

  const pendingAmount =
    pendingPayments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0,
    );

  const initialCount =
    pendingPayments.filter(
      (payment) =>
        payment.payment_type === 'initial',
    ).length;

  const renewalCount =
    pendingPayments.filter(
      (payment) =>
        payment.payment_type === 'renewal',
    ).length;

  const recentPayments =
    pendingPayments.slice(0, 5);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="dipo-admin-main" style={styles.page}>
      <AdminWorkspace adminRole={admin.role} mfaVerified={mfaVerified} />
      <div style={styles.shell}>

        {/* ====================================================
            HEADER
        ==================================================== */}

        <header style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logo}>
              WD
            </div>

            <div>
              <p style={styles.eyebrow}>
                Worldwide DIPO · DIPO LABS
              </p>

              <h1 style={styles.title}>
                Command Center
              </h1>

              <p style={styles.subtitle}>
                Secure operational control for profiles,
                payments, users, verification and
                administrative activity.
              </p>
            </div>
          </div>

          <div style={styles.headerActions}>
            <Link
              href="/dashboard"
              style={styles.button}
            >
              User Dashboard
            </Link>

            <Link
              href="/admin/audit"
              style={styles.button}
            >
              Audit Center
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
            HERO
        ==================================================== */}

        <section style={styles.hero}>
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div style={styles.heroContent}>

            <div style={styles.statusRow}>
              <span
                style={{
                  ...styles.statusBadge,
                  background: colors.greenSoft,
                  color: colors.green,
                }}
              >
                <span style={styles.liveDot} />
                Admin session active
              </span>

              <span
                style={{
                  ...styles.statusBadge,
                  background: mfaVerified
                    ? colors.blueSoft
                    : colors.amberSoft,
                  color: mfaVerified
                    ? colors.blueDark
                    : colors.amber,
                }}
              >
                {mfaVerified
                  ? 'AAL2 verified'
                  : 'AAL2 required'}
              </span>
            </div>

            <h2 style={styles.heroTitle}>
              Welcome back
              {admin.displayName
                ? `, ${admin.displayName}`
                : ''}
              .
            </h2>

            <p style={styles.heroText}>
              This is the protected Worldwide DIPO
              administration layer. Sensitive actions
              remain server-authorized and payment
              approvals are performed through the
              protected database workflow.
            </p>

          </div>
        </section>


        {/* ====================================================
            STAT CARDS
        ==================================================== */}

        <section
          style={styles.statsGrid}
          aria-label="Admin statistics"
        >

          <div style={styles.stat}>
            <div style={styles.statTop}>
              <p style={styles.statLabel}>
                Pending Payments
              </p>

              <span
                style={{
                  ...styles.statIcon,
                  background: colors.amberSoft,
                  color: colors.amber,
                }}
              >
                ₹
              </span>
            </div>

            <div>
              <p style={styles.statValue}>
                {pendingCount}
              </p>

              <p style={styles.statMeta}>
                Claims waiting for verification
              </p>
            </div>
          </div>


          <div style={styles.stat}>
            <div style={styles.statTop}>
              <p style={styles.statLabel}>
                Pending Value
              </p>

              <span
                style={{
                  ...styles.statIcon,
                  background: colors.greenSoft,
                  color: colors.green,
                }}
              >
                ↗
              </span>
            </div>

            <div>
              <p style={styles.statValue}>
                {formatMoney(pendingAmount)}
              </p>

              <p style={styles.statMeta}>
                Total claimed amount in queue
              </p>
            </div>
          </div>


          <div style={styles.stat}>
            <div style={styles.statTop}>
              <p style={styles.statLabel}>
                New Profiles
              </p>

              <span
                style={{
                  ...styles.statIcon,
                  background: colors.blueSoft,
                  color: colors.blue,
                }}
              >
                +
              </span>
            </div>

            <div>
              <p style={styles.statValue}>
                {initialCount}
              </p>

              <p style={styles.statMeta}>
                Initial subscription claims
              </p>
            </div>
          </div>


          <div style={styles.stat}>
            <div style={styles.statTop}>
              <p style={styles.statLabel}>
                Renewals
              </p>

              <span
                style={{
                  ...styles.statIcon,
                  background: colors.violetSoft,
                  color: colors.violet,
                }}
              >
                ↻
              </span>
            </div>

            <div>
              <p style={styles.statValue}>
                {renewalCount}
              </p>

              <p style={styles.statMeta}>
                Renewal claims awaiting review
              </p>
            </div>
          </div>

        </section>


        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div style={styles.grid}>

          {/* ==================================================
              LEFT COLUMN
          ================================================== */}

          <div>

            {/* -----------------------------------------------
                PAYMENT QUEUE
            ------------------------------------------------ */}

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Payment Verification Queue
                  </h2>

                  <p style={styles.cardText}>
                    Claims currently awaiting authorized
                    verification.
                  </p>
                </div>

                <Link
                  href="/admin/payments"
                  style={{
                    ...styles.button,
                    ...styles.blueButton,
                    minHeight: '36px',
                    fontSize: '10px',
                  }}
                >
                  Open Queue
                </Link>
              </div>

              {!paymentAccess ? (
                <div style={styles.cardBody}>
                  <div style={styles.notice}>
                    <span style={styles.noticeStrong}>
                      Payment management is locked.
                    </span>{' '}
                    Your current role or authentication
                    assurance level does not allow payment
                    verification.
                  </div>
                </div>
              ) : paymentStatus >= 500 ? (
                <div style={styles.cardBody}>
                  <div style={styles.notice}>
                    <span style={styles.noticeStrong}>
                      Queue temporarily unavailable.
                    </span>{' '}
                    Payment claims could not be loaded.
                    No payment state was changed.
                  </div>
                </div>
              ) : recentPayments.length === 0 ? (
                <div style={styles.empty}>
                  <div style={styles.emptyIcon}>
                    ✓
                  </div>

                  <h3 style={styles.emptyTitle}>
                    Queue is clear
                  </h3>

                  <p style={styles.emptyText}>
                    There are currently no pending payment
                    claims requiring verification.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    ...styles.cardBody,
                    paddingTop: '5px',
                    paddingBottom: '8px',
                  }}
                >
                  <div style={styles.queue}>

                    {recentPayments.map(
                      (payment, index) => (
                        <div
                          key={payment.id}
                          style={{
                            ...styles.queueItem,
                            ...(index ===
                            recentPayments.length - 1
                              ? styles.queueItemLast
                              : {}),
                          }}
                        >

                          <div
                            style={styles.queueLeft}
                          >
                            <p
                              style={
                                styles.queueTitle
                              }
                            >
                              {payment.payer_name ||
                                'Payment claimant'}
                            </p>

                            <p
                              style={
                                styles.queueMeta
                              }
                            >
                              {formatPlan(
                                payment.plan,
                              )}
                              {' · '}
                              {payment.payment_type ===
                              'renewal'
                                ? 'Renewal'
                                : 'Initial'}
                              {' · '}
                              {payment.payment_reference ||
                                'Reference unavailable'}
                              {' · '}
                              {formatDate(
                                payment.created_at,
                              )}
                            </p>
                          </div>

                          <div
                            style={styles.amount}
                          >
                            {formatMoney(
                              payment.amount,
                            )}
                          </div>

                        </div>
                      ),
                    )}

                  </div>

                  {pendingCount > 5 && (
                    <div
                      style={{
                        paddingTop: '9px',
                        paddingBottom: '9px',
                      }}
                    >
                      <Link
                        href="/admin/payments"
                        style={{
                          ...styles.button,
                          width: '100%',
                          minHeight: '39px',
                        }}
                      >
                        View all {pendingCount} pending
                        claims
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </section>


            {/* -----------------------------------------------
                QUICK ACTIONS
            ------------------------------------------------ */}

            <section
              style={{
                ...styles.card,
                marginTop: '18px',
              }}
            >
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Admin Workspace
                  </h2>

                  <p style={styles.cardText}>
                    Fast access to protected operational
                    areas.
                  </p>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.sectionGrid}>

                  <Link
                    href="/admin/payments"
                    style={styles.action}
                  >
                    <span
                      style={styles.actionIcon}
                    >
                      ₹
                    </span>

                    <div>
                      <p style={styles.actionTitle}>
                        Payment Review
                      </p>

                      <p style={styles.actionText}>
                        Verify UTR/payment claims.
                      </p>
                    </div>
                  </Link>


                  <Link
                    href="/admin/profiles"
                    style={styles.action}
                  >
                    <span
                      style={styles.actionIcon}
                    >
                      ◉
                    </span>

                    <div>
                      <p style={styles.actionTitle}>
                        Profiles
                      </p>

                      <p style={styles.actionText}>
                        Review profile operations.
                      </p>
                    </div>
                  </Link>


                  <Link
                    href="/admin/users"
                    style={styles.action}
                  >
                    <span
                      style={styles.actionIcon}
                    >
                      ◎
                    </span>

                    <div>
                      <p style={styles.actionTitle}>
                        Users
                      </p>

                      <p style={styles.actionText}>
                        View authorized account data.
                      </p>
                    </div>
                  </Link>


                  <Link
                    href="/admin/audit"
                    style={styles.action}
                  >
                    <span
                      style={styles.actionIcon}
                    >
                      ≡
                    </span>

                    <div>
                      <p style={styles.actionTitle}>
                        Audit Center
                      </p>

                      <p style={styles.actionText}>
                        Inspect protected admin activity.
                      </p>
                    </div>
                  </Link>


                  {admin.role === 'super_admin' && (
                    <Link
                      href="/admin/settings"
                      style={styles.action}
                    >
                      <span
                        style={styles.actionIcon}
                      >
                        ⚙
                      </span>

                      <div>
                        <p
                          style={
                            styles.actionTitle
                          }
                        >
                          Settings
                        </p>

                        <p
                          style={
                            styles.actionText
                          }
                        >
                          Super-admin configuration.
                        </p>
                      </div>
                    </Link>
                  )}

                </div>
              </div>
            </section>

          </div>


          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}

          <aside>

            {/* -----------------------------------------------
                ADMIN ROLE
            ------------------------------------------------ */}

            <section style={styles.card}>
              <div style={styles.cardBody}>

                <div style={styles.roleCard}>
                  <p style={styles.roleLabel}>
                    Current authorization
                  </p>

                  <p style={styles.roleName}>
                    {humanizeRole(
                      admin.role,
                    )}
                  </p>

                  <p style={styles.roleMeta}>
                    {admin.displayName ||
                      'Authorized administrator'}
                    {' · '}
                    {mfaVerified
                      ? 'AAL2 verified'
                      : 'AAL1 session'}
                  </p>
                </div>

              </div>
            </section>


            {/* -----------------------------------------------
                SECURITY
            ------------------------------------------------ */}

            <section
              style={{
                ...styles.card,
                marginTop: '18px',
              }}
            >
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Security Posture
                  </h2>

                  <p style={styles.cardText}>
                    Current authorization state.
                  </p>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.security}>

                  <div
                    style={styles.securityItem}
                  >
                    <div
                      style={styles.securityLabel}
                    >
                      <span
                        style={{
                          ...styles.securityDot,
                          background:
                            '#10b981',
                        }}
                      />

                      <span
                        style={
                          styles.securityName
                        }
                      >
                        Active admin account
                      </span>
                    </div>

                    <span
                      style={{
                        ...styles.securityState,
                        color: colors.green,
                      }}
                    >
                      Active
                    </span>
                  </div>


                  <div
                    style={styles.securityItem}
                  >
                    <div
                      style={styles.securityLabel}
                    >
                      <span
                        style={{
                          ...styles.securityDot,
                          background:
                            mfaVerified
                              ? '#10b981'
                              : '#f59e0b',
                        }}
                      />

                      <span
                        style={
                          styles.securityName
                        }
                      >
                        MFA / AAL2
                      </span>
                    </div>

                    <span
                      style={{
                        ...styles.securityState,
                        color: mfaVerified
                          ? colors.green
                          : colors.amber,
                      }}
                    >
                      {mfaVerified
                        ? 'Verified'
                        : 'Required'}
                    </span>
                  </div>


                  <div
                    style={styles.securityItem}
                  >
                    <div
                      style={styles.securityLabel}
                    >
                      <span
                        style={{
                          ...styles.securityDot,
                          background:
                            adminDataAccess
                              ? '#10b981'
                              : '#ef4444',
                        }}
                      />

                      <span
                        style={
                          styles.securityName
                        }
                      >
                        Admin data access
                      </span>
                    </div>

                    <span
                      style={{
                        ...styles.securityState,
                        color:
                          adminDataAccess
                            ? colors.green
                            : colors.red,
                      }}
                    >
                      {adminDataAccess
                        ? 'Allowed'
                        : 'Blocked'}
                    </span>
                  </div>


                  <div
                    style={styles.securityItem}
                  >
                    <div
                      style={styles.securityLabel}
                    >
                      <span
                        style={{
                          ...styles.securityDot,
                          background:
                            paymentAccess
                              ? '#10b981'
                              : '#94a3b8',
                        }}
                      />

                      <span
                        style={
                          styles.securityName
                        }
                      >
                        Payment controls
                      </span>
                    </div>

                    <span
                      style={{
                        ...styles.securityState,
                        color:
                          paymentAccess
                            ? colors.green
                            : colors.muted,
                      }}
                    >
                      {paymentAccess
                        ? 'Enabled'
                        : 'Locked'}
                    </span>
                  </div>

                </div>
              </div>
            </section>


            {/* -----------------------------------------------
                SECURITY NOTICE
            ------------------------------------------------ */}

            <section
              style={{
                ...styles.card,
                marginTop: '18px',
              }}
            >
              <div style={styles.cardBody}>
                <div style={styles.notice}>
                  <span style={styles.noticeStrong}>
                    Production rule:
                  </span>{' '}
                  never approve a payment only because a
                  user supplied a UTR/reference. Verify the
                  actual payment in the official payment
                  account before approving.
                </div>
              </div>
            </section>

          </aside>

        </div>


        {/* ====================================================
            FOOTER
        ==================================================== */}

        <footer style={styles.footer}>
          <span>
            Worldwide DIPO · DIPO LABS
          </span>

          <span>
            Protected administration surface
          </span>

          <span>
            Role: {humanizeRole(admin.role)}
          </span>
        </footer>

      </div>
    </main>
  );
}