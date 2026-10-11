'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * Worldwide DIPO
 * PaymentStatus.jsx
 *
 * Production-grade payment status UI.
 *
 * Supported usage examples:
 *
 * <PaymentStatus payment={payment} />
 *
 * <PaymentStatus
 *   payment={pendingPayment}
 *   profile={profile}
 * />
 *
 * <PaymentStatus
 *   status="pending"
 *   amount={499}
 *   plan="Pro"
 *   paymentReference="1234567890"
 * />
 *
 * The component intentionally does not trust client-side
 * values for authorization or payment verification.
 * It is presentation-first; the server/database remains
 * the source of truth.
 */

const STATUS_META = {
  pending: {
    eyebrow: 'PAYMENT REVIEW',
    title: 'Verification in progress',
    description:
      'Your payment reference has been submitted and is waiting for manual verification.',
    badge: 'Pending',
    tone: 'amber',
    icon: 'clock',
  },

  verified: {
    eyebrow: 'PAYMENT VERIFIED',
    title: 'Payment verified',
    description:
      'Your payment has been successfully verified by Worldwide DIPO.',
    badge: 'Verified',
    tone: 'green',
    icon: 'check',
  },

  approved: {
    eyebrow: 'PAYMENT VERIFIED',
    title: 'Payment verified',
    description:
      'Your payment has been successfully verified by Worldwide DIPO.',
    badge: 'Verified',
    tone: 'green',
    icon: 'check',
  },

  rejected: {
    eyebrow: 'PAYMENT NOT VERIFIED',
    title: 'Payment needs attention',
    description:
      'This payment could not be verified. Please review the information and contact support if needed.',
    badge: 'Rejected',
    tone: 'red',
    icon: 'x',
  },

  failed: {
    eyebrow: 'PAYMENT FAILED',
    title: 'Payment could not be verified',
    description:
      'The payment verification process was unsuccessful. Please check your payment details.',
    badge: 'Failed',
    tone: 'red',
    icon: 'x',
  },

  cancelled: {
    eyebrow: 'PAYMENT CANCELLED',
    title: 'Payment was cancelled',
    description:
      'This payment request is no longer active.',
    badge: 'Cancelled',
    tone: 'neutral',
    icon: 'x',
  },

  unknown: {
    eyebrow: 'PAYMENT STATUS',
    title: 'Payment status unavailable',
    description:
      'We could not determine the current payment state. Please refresh and try again.',
    badge: 'Unknown',
    tone: 'neutral',
    icon: 'info',
  },
};

const TONE = {
  green: {
    accent: '#059669',
    accentSoft: '#ecfdf5',
    border: '#a7f3d0',
    text: '#047857',
    glow: 'rgba(16, 185, 129, 0.16)',
  },

  amber: {
    accent: '#d97706',
    accentSoft: '#fffbeb',
    border: '#fde68a',
    text: '#b45309',
    glow: 'rgba(245, 158, 11, 0.15)',
  },

  red: {
    accent: '#dc2626',
    accentSoft: '#fef2f2',
    border: '#fecaca',
    text: '#b91c1c',
    glow: 'rgba(239, 68, 68, 0.14)',
  },

  neutral: {
    accent: '#52525b',
    accentSoft: '#f4f4f5',
    border: '#e4e4e7',
    text: '#3f3f46',
    glow: 'rgba(82, 82, 91, 0.10)',
  },
};

function normalizeStatus(value) {
  if (!value) {
    return 'unknown';
  }

  const normalized = String(value)
    .trim()
    .toLowerCase();

  if (normalized === 'success') {
    return 'verified';
  }

  if (normalized === 'complete') {
    return 'verified';
  }

  if (normalized === 'completed') {
    return 'verified';
  }

  if (normalized === 'approved') {
    return 'approved';
  }

  if (normalized === 'declined') {
    return 'rejected';
  }

  return STATUS_META[normalized]
    ? normalized
    : 'unknown';
}

function formatCurrency(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function formatDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function maskReference(value) {
  if (!value) {
    return null;
  }

  const text = String(value).trim();

  if (text.length <= 8) {
    return text;
  }

  return `${text.slice(0, 4)}••••${text.slice(-4)}`;
}

function getPaymentObject({
  payment,
  pendingPayment,
  data,
}) {
  if (payment && typeof payment === 'object') {
    return payment;
  }

  if (
    pendingPayment &&
    typeof pendingPayment === 'object'
  ) {
    return pendingPayment;
  }

  if (data && typeof data === 'object') {
    if (
      data.payment &&
      typeof data.payment === 'object'
    ) {
      return data.payment;
    }

    return data;
  }

  return {};
}

function getStatusFromObject(payment) {
  return normalizeStatus(
    payment?.status ||
      payment?.payment_status ||
      payment?.paymentStatus ||
      payment?.verification_status ||
      payment?.verificationStatus
  );
}

function Icon({
  name,
  size = 22,
}) {
  if (name === 'check') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="m5 12.5 4.2 4.2L19 7"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === 'clock') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="8.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="M12 7.5v5l3.2 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === 'x') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="m7 7 10 10M17 7 7 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === 'refresh') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 11a8 8 0 0 0-14.7-3.9L4 9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M4 5v4h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M4 13a8 8 0 0 0 14.7 3.9L20 15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M20 19v-4h-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === 'arrow') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 12h13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="m13 6 6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === 'copy') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="8"
          y="8"
          width="11"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <path
          d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 10.5v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="7.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

function Detail({
  label,
  value,
  mono = false,
}) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  return (
    <div style={styles.detail}>
      <span style={styles.detailLabel}>
        {label}
      </span>

      <span
        style={{
          ...styles.detailValue,
          ...(mono
            ? styles.detailMono
            : {}),
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function PaymentStatus({
  payment,
  pendingPayment,
  data,

  status,
  amount,
  plan,
  paymentReference,
  paymentType,
  createdAt,
  verifiedAt,
  rejectedAt,
  notes,

  profile,

  title,
  description,

  showReference = true,
  showDetails = true,
  showRefresh = false,
  refreshInterval = 0,

  onRefresh,
  onContinue,
  continueHref,

  compact = false,
}) {
  const paymentData = useMemo(
    () =>
      getPaymentObject({
        payment,
        pendingPayment,
        data,
      }),
    [payment, pendingPayment, data]
  );

  const resolvedStatus = useMemo(
    () =>
      normalizeStatus(
        status ||
          getStatusFromObject(paymentData)
      ),
    [status, paymentData]
  );

  const meta =
    STATUS_META[resolvedStatus] ||
    STATUS_META.unknown;

  const tone =
    TONE[meta.tone] ||
    TONE.neutral;

  const resolvedAmount =
    amount ??
    paymentData?.amount ??
    paymentData?.amount_snapshot ??
    paymentData?.payment_amount;

  const resolvedPlan =
    plan ??
    paymentData?.plan ??
    paymentData?.plan_snapshot;

  const resolvedReference =
    paymentReference ??
    paymentData?.payment_reference ??
    paymentData?.paymentReference ??
    paymentData?.utr;

  const resolvedType =
    paymentType ??
    paymentData?.payment_type ??
    paymentData?.paymentType;

  const resolvedCreatedAt =
    createdAt ??
    paymentData?.created_at ??
    paymentData?.createdAt;

  const resolvedVerifiedAt =
    verifiedAt ??
    paymentData?.verified_at ??
    paymentData?.verifiedAt;

  const resolvedRejectedAt =
    rejectedAt ??
    paymentData?.rejected_at ??
    paymentData?.rejectedAt;

  const resolvedNotes =
    notes ??
    paymentData?.notes ??
    paymentData?.admin_reply;

  const [copied, setCopied] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [localRefreshTick, setLocalRefreshTick] =
    useState(0);

  const profileName =
    profile?.name ||
    paymentData?.payer_name ||
    paymentData?.name;

  const formattedAmount =
    formatCurrency(resolvedAmount);

  const formattedCreatedAt =
    formatDate(resolvedCreatedAt);

  const formattedVerifiedAt =
    formatDate(resolvedVerifiedAt);

  const formattedRejectedAt =
    formatDate(resolvedRejectedAt);

  const maskedReference =
    maskReference(resolvedReference);

  async function handleCopyReference() {
    if (!resolvedReference) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        String(resolvedReference)
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  }

  async function handleRefresh() {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    try {
      if (typeof onRefresh === 'function') {
        await onRefresh();
      } else {
        setLocalRefreshTick(
          (value) => value + 1
        );

        if (
          typeof window !==
          'undefined'
        ) {
          window.location.reload();
        }
      }
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (
      !refreshInterval ||
      refreshInterval < 5000 ||
      resolvedStatus !== 'pending'
    ) {
      return undefined;
    }

    const timer = window.setInterval(
      () => {
        if (
          typeof onRefresh ===
          'function'
        ) {
          onRefresh();
        } else {
          setLocalRefreshTick(
            (value) => value + 1
          );
        }
      },
      refreshInterval
    );

    return () =>
      window.clearInterval(timer);
  }, [
    refreshInterval,
    resolvedStatus,
    onRefresh,
  ]);

  const showPendingTimeline =
    resolvedStatus === 'pending';

  const showSuccessTimeline =
    resolvedStatus === 'verified' ||
    resolvedStatus === 'approved';

  const showRejectedTimeline =
    resolvedStatus === 'rejected' ||
    resolvedStatus === 'failed' ||
    resolvedStatus === 'cancelled';

  const statusLabel =
    meta.badge;

  return (
    <section
      aria-labelledby="dipo-payment-status-title"
      data-status={resolvedStatus}
      data-refresh-tick={localRefreshTick}
      style={{
        ...styles.wrapper,
        ...(compact
          ? styles.wrapperCompact
          : {}),
      }}
    >
      <div
        style={{
          ...styles.card,
          borderColor: tone.border,
          boxShadow: `0 24px 70px ${tone.glow}`,
        }}
      >
        {/* =====================================================
            TOP STATUS HEADER
        ====================================================== */}

        <div
          style={{
            ...styles.header,
            background: `linear-gradient(135deg, ${tone.accentSoft} 0%, #ffffff 72%)`,
          }}
        >
          <div style={styles.headerTop}>
            <span
              style={{
                ...styles.eyebrow,
                color: tone.text,
              }}
            >
              <span
                style={{
                  ...styles.liveDot,
                  background:
                    tone.accent,
                }}
                aria-hidden="true"
              />

              {meta.eyebrow}
            </span>

            <span
              style={{
                ...styles.statusPill,
                color: tone.text,
                background:
                  tone.accentSoft,
                borderColor:
                  tone.border,
              }}
            >
              <span
                style={{
                  ...styles.statusPillIcon,
                  background:
                    tone.accent,
                }}
                aria-hidden="true"
              />

              {statusLabel}
            </span>
          </div>

          <div style={styles.heroRow}>
            <div
              style={{
                ...styles.statusIcon,
                color: tone.accent,
                background:
                  tone.accentSoft,
                borderColor:
                  tone.border,
              }}
              aria-hidden="true"
            >
              <Icon
                name={meta.icon}
                size={28}
              />
            </div>

            <div style={styles.heroCopy}>
              <h2
                id="dipo-payment-status-title"
                style={styles.title}
              >
                {title || meta.title}
              </h2>

              <p style={styles.description}>
                {description ||
                  meta.description}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            PAYMENT SUMMARY
        ====================================================== */}

        {(formattedAmount ||
          resolvedPlan ||
          resolvedType ||
          profileName) && (
          <div style={styles.summary}>
            {formattedAmount ? (
              <div
                style={styles.amountBlock}
              >
                <span
                  style={
                    styles.amountLabel
                  }
                >
                  PAYMENT AMOUNT
                </span>

                <strong
                  style={styles.amount}
                >
                  {formattedAmount}
                </strong>
              </div>
            ) : null}

            <div
              style={
                styles.summaryDivider
              }
            />

            <div
              style={
                styles.summaryGrid
              }
            >
              {profileName ? (
                <Detail
                  label="Account"
                  value={profileName}
                />
              ) : null}

              {resolvedPlan ? (
                <Detail
                  label="Plan"
                  value={resolvedPlan}
                />
              ) : null}

              {resolvedType ? (
                <Detail
                  label="Payment type"
                  value={
                    String(
                      resolvedType
                    )
                      .charAt(0)
                      .toUpperCase() +
                    String(
                      resolvedType
                    )
                      .slice(1)
                  }
                />
              ) : null}

              {formattedCreatedAt ? (
                <Detail
                  label="Submitted"
                  value={
                    formattedCreatedAt
                  }
                />
              ) : null}
            </div>
          </div>
        )}

        {/* =====================================================
            REFERENCE
        ====================================================== */}

        {showReference &&
        resolvedReference ? (
          <div
            style={styles.referenceSection}
          >
            <div
              style={
                styles.referenceHeading
              }
            >
              <div>
                <span
                  style={
                    styles.referenceLabel
                  }
                >
                  UTR / PAYMENT REFERENCE
                </span>

                <strong
                  style={
                    styles.referenceValue
                  }
                >
                  {maskedReference}
                </strong>
              </div>

              <button
                type="button"
                onClick={
                  handleCopyReference
                }
                style={
                  styles.copyButton
                }
                aria-label={
                  copied
                    ? 'Payment reference copied'
                    : 'Copy payment reference'
                }
              >
                <Icon
                  name="copy"
                  size={16}
                />

                <span>
                  {copied
                    ? 'Copied'
                    : 'Copy'}
                </span>
              </button>
            </div>

            <p
              style={
                styles.referenceHint
              }
            >
              Your reference is securely displayed
              in masked form for privacy.
            </p>
          </div>
        ) : null}

        {/* =====================================================
            VERIFICATION TIMELINE
        ====================================================== */}

        <div
          style={styles.timelineSection}
        >
          <div
            style={
              styles.timelineHeading
            }
          >
            <span
              style={
                styles.timelineKicker
              }
            >
              PAYMENT JOURNEY
            </span>

            <span
              style={
                styles.timelineCount
              }
            >
              {showSuccessTimeline
                ? 'Complete'
                : showRejectedTimeline
                  ? 'Action required'
                  : 'In progress'}
            </span>
          </div>

          <div
            style={styles.timeline}
          >
            <TimelineItem
              number="01"
              title="Payment reference submitted"
              description={
                formattedCreatedAt ||
                'Payment claim received'
              }
              active
              complete={
                Boolean(
                  resolvedReference
                )
              }
              tone={tone}
            />

            <TimelineLine
              active={
                showPendingTimeline ||
                showSuccessTimeline ||
                showRejectedTimeline
              }
              tone={tone}
            />

            <TimelineItem
              number="02"
              title="Manual verification"
              description={
                showPendingTimeline
                  ? 'Our team is reviewing the transaction'
                  : showSuccessTimeline
                    ? formattedVerifiedAt ||
                      'Transaction verified'
                    : showRejectedTimeline
                      ? formattedRejectedAt ||
                        'Verification was not completed'
                      : 'Verification status unavailable'
              }
              active={
                showPendingTimeline ||
                showSuccessTimeline ||
                showRejectedTimeline
              }
              complete={
                showSuccessTimeline
              }
              tone={tone}
            />

            <TimelineLine
              active={
                showSuccessTimeline
              }
              tone={tone}
            />

            <TimelineItem
              number="03"
              title="DIPO activation"
              description={
                showSuccessTimeline
                  ? 'Your payment has been verified'
                  : showPendingTimeline
                    ? 'Activation follows successful verification'
                    : 'Activation is currently unavailable'
              }
              active={
                showSuccessTimeline
              }
              complete={
                showSuccessTimeline
              }
              tone={tone}
            />
          </div>
        </div>

        {/* =====================================================
            EXTRA DETAILS
        ====================================================== */}

        {showDetails &&
        (resolvedVerifiedAt ||
          resolvedRejectedAt ||
          resolvedNotes) ? (
          <div
            style={styles.detailsSection}
          >
            {resolvedVerifiedAt ? (
              <Detail
                label="Verified at"
                value={formatDate(
                  resolvedVerifiedAt
                )}
              />
            ) : null}

            {resolvedRejectedAt ? (
              <Detail
                label="Reviewed at"
                value={formatDate(
                  resolvedRejectedAt
                )}
              />
            ) : null}

            {resolvedNotes ? (
              <div
                style={
                  styles.noteBlock
                }
              >
                <span
                  style={
                    styles.detailLabel
                  }
                >
                  REVIEW NOTE
                </span>

                <p
                  style={
                    styles.noteText
                  }
                >
                  {String(
                    resolvedNotes
                  )}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* =====================================================
            STATUS MESSAGE
        ====================================================== */}

        <div
          style={{
            ...styles.messageBox,
            background:
              tone.accentSoft,
            borderColor:
              tone.border,
          }}
        >
          <div
            style={{
              ...styles.messageIcon,
              color: tone.accent,
            }}
          >
            <Icon
              name={meta.icon}
              size={18}
            />
          </div>

          <div>
            <strong
              style={{
                ...styles.messageTitle,
                color: tone.text,
              }}
            >
              {resolvedStatus ===
              'pending'
                ? 'No action required right now'
                : resolvedStatus ===
                    'verified' ||
                  resolvedStatus ===
                    'approved'
                  ? 'Your payment is verified'
                  : resolvedStatus ===
                      'rejected'
                    ? 'Please review your payment'
                    : 'Payment status update'}
            </strong>

            <p
              style={
                styles.messageText
              }
            >
              {resolvedStatus ===
              'pending'
                ? 'Please wait while our team verifies the transaction. Avoid submitting the same payment reference again.'
                : resolvedStatus ===
                      'verified' ||
                    resolvedStatus ===
                      'approved'
                  ? 'Your payment record has been verified. You can continue with your DIPO journey.'
                  : resolvedStatus ===
                      'rejected'
                    ? 'If you believe this was incorrect, contact Worldwide DIPO support with your payment reference.'
                    : meta.description}
            </p>
          </div>
        </div>

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        {(showRefresh ||
          onContinue ||
          continueHref) && (
          <div
            style={styles.actions}
          >
            {showRefresh ? (
              <button
                type="button"
                onClick={
                  handleRefresh
                }
                disabled={refreshing}
                style={
                  styles.secondaryButton
                }
              >
                <span
                  style={{
                    display:
                      'inline-flex',
                    transform:
                      refreshing
                        ? 'rotate(180deg)'
                        : 'none',
                    transition:
                      'transform 0.5s ease',
                  }}
                >
                  <Icon
                    name="refresh"
                    size={17}
                  />
                </span>

                {refreshing
                  ? 'Refreshing…'
                  : 'Refresh status'}
              </button>
            ) : null}

            {continueHref ? (
              <a
                href={
                  continueHref
                }
                style={{
                  ...styles.primaryButton,
                  background:
                    '#111111',
                }}
              >
                Continue

                <Icon
                  name="arrow"
                  size={17}
                />
              </a>
            ) : null}

            {onContinue ? (
              <button
                type="button"
                onClick={
                  onContinue
                }
                style={
                  styles.primaryButton
                }
              >
                Continue

                <Icon
                  name="arrow"
                  size={17}
                />
              </button>
            ) : null}
          </div>
        )}

        {/* =====================================================
            FOOTER TRUST
        ====================================================== */}

        <div
          style={styles.footer}
        >
          <span
            style={styles.footerDot}
            aria-hidden="true"
          />

          <span>
            Worldwide DIPO payment
            verification
          </span>

          <span
            aria-hidden="true"
            style={
              styles.footerSeparator
            }
          >
            •
          </span>

          <span>
            Manual review
          </span>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .dipo-payment-status-card {
            border-radius: 22px;
          }
        }
      `}</style>
    </section>
  );
}

function TimelineItem({
  number,
  title,
  description,
  active,
  complete,
  tone,
}) {
  return (
    <div
      style={{
        ...styles.timelineItem,
        opacity: active ? 1 : 0.52,
      }}
    >
      <div
        style={{
          ...styles.timelineNode,
          color: complete
            ? '#ffffff'
            : tone.accent,
          background: complete
            ? tone.accent
            : '#ffffff',
          borderColor:
            complete
              ? tone.accent
              : '#d4d4d8',
        }}
      >
        {complete ? (
          <Icon
            name="check"
            size={15}
          />
        ) : (
          number
        )}
      </div>

      <div
        style={
          styles.timelineContent
        }
      >
        <strong
          style={
            styles.timelineTitle
          }
        >
          {title}
        </strong>

        <span
          style={
            styles.timelineDescription
          }
        >
          {description}
        </span>
      </div>
    </div>
  );
}

function TimelineLine({
  active,
  tone,
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        ...styles.timelineLine,
        background: active
          ? tone.border
          : '#e4e4e7',
      }}
    />
  );
}

const styles = {
  wrapper: {
    width: '100%',
    maxWidth: '760px',
    margin: '0 auto',
    padding: '8px 0',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#18181b',
  },

  wrapperCompact: {
    maxWidth: '680px',
  },

  card: {
    overflow: 'hidden',
    background: '#ffffff',
    border: '1px solid #e4e4e7',
    borderRadius: '28px',
    transition:
      'box-shadow 220ms ease, border-color 220ms ease',
  },

  header: {
    padding:
      'clamp(22px, 5vw, 38px)',
    borderBottom:
      '1px solid #f0f0f1',
  },

  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: '14px',
    flexWrap: 'wrap',
    marginBottom: '26px',
  },

  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing:
      '0.12em',
  },

  liveDot: {
    width: '7px',
    height: '7px',
    borderRadius: '999px',
    flex: '0 0 auto',
    boxShadow:
      '0 0 0 4px rgba(16,185,129,.08)',
  },

  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding:
      '8px 11px',
    border:
      '1px solid',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing:
      '0.03em',
  },

  statusPillIcon: {
    width: '6px',
    height: '6px',
    borderRadius: '999px',
  },

  heroRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '18px',
  },

  statusIcon: {
    width: '58px',
    height: '58px',
    minWidth: '58px',
    display: 'grid',
    placeItems: 'center',
    border:
      '1px solid',
    borderRadius: '18px',
  },

  heroCopy: {
    minWidth: 0,
    flex: 1,
  },

  title: {
    margin: 0,
    fontSize:
      'clamp(24px, 5vw, 34px)',
    lineHeight: 1.08,
    fontWeight: 850,
    letterSpacing:
      '-0.035em',
    color: '#09090b',
  },

  description: {
    margin:
      '10px 0 0',
    maxWidth: '620px',
    fontSize:
      'clamp(13px, 2.4vw, 15px)',
    lineHeight: 1.7,
    color: '#52525b',
  },

  summary: {
    padding:
      '22px clamp(20px, 5vw, 34px)',
    borderBottom:
      '1px solid #f0f0f1',
  },

  amountBlock: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent:
      'space-between',
    gap: '20px',
  },

  amountLabel: {
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing:
      '0.12em',
    color: '#71717a',
  },

  amount: {
    fontSize:
      'clamp(25px, 6vw, 36px)',
    lineHeight: 1,
    letterSpacing:
      '-0.04em',
    color: '#09090b',
  },

  summaryDivider: {
    height: '1px',
    background: '#f4f4f5',
    margin:
      '20px 0',
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(2, minmax(0, 1fr))',
    gap:
      '18px 24px',
  },

  detail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    minWidth: 0,
  },

  detailLabel: {
    fontSize: '10px',
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing:
      '0.08em',
    textTransform:
      'uppercase',
    color: '#a1a1aa',
  },

  detailValue: {
    fontSize: '13px',
    lineHeight: 1.45,
    fontWeight: 700,
    color: '#27272a',
    overflowWrap:
      'anywhere',
  },

  detailMono: {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    letterSpacing:
      '0.01em',
  },

  referenceSection: {
    padding:
      '20px clamp(20px, 5vw, 34px)',
    background: '#fafafa',
    borderBottom:
      '1px solid #f0f0f1',
  },

  referenceHeading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: '18px',
  },

  referenceLabel: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing:
      '0.1em',
    color: '#a1a1aa',
  },

  referenceValue: {
    display: 'block',
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '14px',
    color: '#27272a',
    letterSpacing:
      '0.03em',
  },

  copyButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent:
      'center',
    gap: '7px',
    minHeight: '38px',
    padding:
      '0 12px',
    border:
      '1px solid #e4e4e7',
    borderRadius: '11px',
    background: '#ffffff',
    color: '#3f3f46',
    fontSize: '12px',
    fontWeight: 750,
    cursor: 'pointer',
    flexShrink: 0,
  },

  referenceHint: {
    margin:
      '9px 0 0',
    fontSize: '11px',
    lineHeight: 1.55,
    color: '#a1a1aa',
  },

  timelineSection: {
    padding:
      '25px clamp(20px, 5vw, 34px)',
    borderBottom:
      '1px solid #f0f0f1',
  },

  timelineHeading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: '15px',
    marginBottom: '24px',
  },

  timelineKicker: {
    fontSize: '10px',
    fontWeight: 850,
    letterSpacing:
      '0.12em',
    color: '#71717a',
  },

  timelineCount: {
    fontSize: '11px',
    fontWeight: 750,
    color: '#a1a1aa',
  },

  timeline: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },

  timelineItem: {
    flex: '1 1 0',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
    transition:
      'opacity 200ms ease',
  },

  timelineNode: {
    width: '34px',
    height: '34px',
    display: 'grid',
    placeItems: 'center',
    border:
      '1px solid',
    borderRadius: '50%',
    fontSize: '10px',
    fontWeight: 850,
  },

  timelineContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },

  timelineTitle: {
    fontSize: '12px',
    lineHeight: 1.35,
    fontWeight: 800,
    color: '#27272a',
  },

  timelineDescription: {
    fontSize: '11px',
    lineHeight: 1.5,
    color: '#a1a1aa',
  },

  timelineLine: {
    width: '100%',
    height: '2px',
    minWidth: '16px',
    marginTop: '16px',
    borderRadius: '999px',
    transition:
      'background 220ms ease',
  },

  detailsSection: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(2, minmax(0, 1fr))',
    gap:
      '18px 24px',
    padding:
      '22px clamp(20px, 5vw, 34px)',
    borderBottom:
      '1px solid #f0f0f1',
  },

  noteBlock: {
    gridColumn:
      '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },

  noteText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: 1.65,
    color: '#52525b',
  },

  messageBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    margin:
      '20px clamp(20px, 5vw, 34px) 0',
    padding: '14px',
    border:
      '1px solid',
    borderRadius: '15px',
  },

  messageIcon: {
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    paddingTop: '1px',
  },

  messageTitle: {
    display: 'block',
    fontSize: '12px',
    lineHeight: 1.4,
    fontWeight: 800,
  },

  messageText: {
    margin:
      '4px 0 0',
    fontSize: '11px',
    lineHeight: 1.6,
    color: '#71717a',
  },

  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      'flex-end',
    flexWrap: 'wrap',
    gap: '10px',
    padding:
      '20px clamp(20px, 5vw, 34px) 0',
  },

  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent:
      'center',
    gap: '8px',
    minHeight: '42px',
    padding:
      '0 15px',
    border:
      '1px solid #e4e4e7',
    borderRadius: '12px',
    background: '#ffffff',
    color: '#27272a',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
  },

  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent:
      'center',
    gap: '8px',
    minHeight: '42px',
    padding:
      '0 17px',
    border: 0,
    borderRadius: '12px',
    background: '#111111',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      'center',
    flexWrap: 'wrap',
    gap: '7px',
    padding:
      '19px 20px 22px',
    fontSize: '10px',
    fontWeight: 650,
    color: '#a1a1aa',
    textAlign: 'center',
  },

  footerDot: {
    width: '5px',
    height: '5px',
    borderRadius: '999px',
    background: '#10b981',
  },

  footerSeparator: {
    color: '#d4d4d8',
  },
};