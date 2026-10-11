import Link from 'next/link';

import { getPaymentPlan } from '@/lib/payments/payment-config';

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getDaysRemaining(expiresAt) {
  if (!expiresAt) return null;

  const expiry = new Date(expiresAt).getTime();

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

function getStatus(profile) {
  if (!profile) {
    return {
      key: 'unavailable',
      label: 'Unavailable',
      title: 'Subscription unavailable',
      description:
        'Your subscription information could not be loaded.',
    };
  }

  switch (profile.status) {
    case 'active':
      return {
        key: 'active',
        label: 'Active',
        title: 'Your DIPO is active',
        description:
          'Your public Worldwide DIPO is currently live.',
      };

    case 'expired':
      return {
        key: 'expired',
        label: 'Expired',
        title: 'Renew your DIPO',
        description:
          'Renew your subscription to continue your DIPO service.',
      };

    case 'pending':
      return {
        key: 'pending',
        label: 'Pending',
        title: 'Payment verification pending',
        description:
          'Your payment is currently waiting for verification.',
      };

    case 'draft':
      return {
        key: 'draft',
        label: 'Draft',
        title: 'Complete your activation',
        description:
          'Choose a plan and complete your initial payment.',
      };

    default:
      return {
        key: 'unknown',
        label: 'Subscription',
        title: 'Manage your subscription',
        description:
          'Review your current plan and subscription status.',
      };
  }
}

function StatusIcon({ status }) {
  if (status === 'active') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="m5 12 4.2 4.2L19 6.5" />
      </svg>
    );
  }

  if (status === 'expired') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 7v5l3 2" />
        <circle cx="12" cy="12" r="8.5" />
      </svg>
    );
  }

  if (status === 'pending') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 7v5l3 2" />
        <circle cx="12" cy="12" r="8.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 16v.01" />
      <path d="M12 8v5" />
      <path d="M10.3 3.8 3.9 15a2 2 0 0 0 1.7 3h12.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 3 19 6v5c0 4.7-2.8 8.1-7 10-4.2-1.9-7-5.3-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function RenewalCard({
  profile,
  pendingRenewal = null,
  compact = false,
  showAction = true,
  children = null,
}) {
  const status = getStatus(profile);

  const plan = getPaymentPlan(
    profile?.plan
  );

  const daysRemaining =
    getDaysRemaining(
      profile?.expires_at
    );

  const expiresDate =
    formatDate(
      profile?.expires_at
    );

  const pendingDate =
    formatDate(
      pendingRenewal?.created_at
    );

  const isActive =
    profile?.status === 'active';

  const isExpired =
    profile?.status === 'expired';

  const hasPendingRenewal =
    Boolean(pendingRenewal);

  const canRenew =
    (isActive || isExpired) &&
    !hasPendingRenewal;

  const actionHref =
    canRenew
      ? '/dashboard/subscription#renewal'
      : '/dashboard/subscription';

  return (
    <section
      className={[
        'dipo-renewal-card',
        compact
          ? 'dipo-renewal-card--compact'
          : '',
        `dipo-renewal-card--${status.key}`,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby="dipo-renewal-card-title"
    >
      <style>{`
        .dipo-renewal-card {
          --renewal-border: #e5e7eb;
          --renewal-text: #111827;
          --renewal-muted: #6b7280;
          --renewal-soft: #f8fafc;
          --renewal-green: #10b981;
          --renewal-green-dark: #047857;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          border: 1px solid var(--renewal-border);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(16, 185, 129, 0.10),
              transparent 34%
            ),
            #ffffff;
          color: var(--renewal-text);
          box-shadow:
            0 16px 45px rgba(15, 23, 42, 0.055);
        }

        .dipo-renewal-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.95),
              rgba(248, 250, 252, 0.5)
            );
        }

        .dipo-renewal-card--compact {
          border-radius: 22px;
        }

        .dipo-renewal-inner {
          padding: clamp(20px, 4vw, 32px);
        }

        .dipo-renewal-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .dipo-renewal-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px;
          color: var(--renewal-green-dark);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.15em;
          line-height: 1;
          text-transform: uppercase;
        }

        .dipo-renewal-kicker-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;
          border-radius: 50%;
          background: var(--renewal-green);
          box-shadow:
            0 0 0 5px
            rgba(16, 185, 129, 0.10);
        }

        .dipo-renewal-title {
          margin: 0;
          max-width: 600px;
          font-size: clamp(
            24px,
            5vw,
            34px
          );
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 900;
        }

        .dipo-renewal-description {
          max-width: 600px;
          margin: 9px 0 0;
          color: var(--renewal-muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .dipo-renewal-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          flex: 0 0 auto;
          min-height: 32px;
          padding: 7px 11px;
          border: 1px solid #bbf7d0;
          border-radius: 999px;
          background: #f0fdf4;
          color: #047857;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .dipo-renewal-status::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .dipo-renewal-card--expired
          .dipo-renewal-status {
          border-color: #fecaca;
          background: #fef2f2;
          color: #b91c1c;
        }

        .dipo-renewal-card--pending
          .dipo-renewal-status {
          border-color: #fde68a;
          background: #fffbeb;
          color: #a16207;
        }

        .dipo-renewal-card--draft
          .dipo-renewal-status {
          border-color: #dbeafe;
          background: #eff6ff;
          color: #2563eb;
        }

        .dipo-renewal-summary {
          display: grid;
          grid-template-columns:
            minmax(0, 1.4fr)
            minmax(150px, 0.6fr);
          gap: 14px;
          margin-top: 24px;
        }

        .dipo-renewal-plan {
          min-width: 0;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.86);
        }

        .dipo-renewal-plan-label {
          display: block;
          margin-bottom: 7px;
          color: #9ca3af;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .dipo-renewal-plan-name {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8px;
        }

        .dipo-renewal-plan-name strong {
          font-size: 22px;
          letter-spacing: -0.035em;
        }

        .dipo-renewal-plan-name span {
          color: #6b7280;
          font-size: 11px;
          font-weight: 700;
        }

        .dipo-renewal-plan-price {
          margin-top: 11px;
          color: #047857;
          font-size: 13px;
          font-weight: 850;
        }

        .dipo-renewal-validity {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          padding: 20px;
          border-radius: 20px;
          background: #111827;
          color: #ffffff;
        }

        .dipo-renewal-validity-label {
          color: rgba(255,255,255,0.55);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .dipo-renewal-days {
          margin-top: 5px;
          font-size: 27px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .dipo-renewal-expiry {
          margin-top: 7px;
          color: rgba(255,255,255,0.58);
          font-size: 10px;
          line-height: 1.45;
        }

        .dipo-renewal-pending {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 13px;
          margin-top: 16px;
          padding: 16px;
          border: 1px solid #fde68a;
          border-radius: 18px;
          background: #fffbeb;
        }

        .dipo-renewal-pending-icon {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 11px;
          background: #fef3c7;
          color: #a16207;
          font-size: 15px;
          font-weight: 900;
        }

        .dipo-renewal-pending h3 {
          margin: 0;
          color: #78350f;
          font-size: 13px;
          font-weight: 900;
        }

        .dipo-renewal-pending p {
          margin: 4px 0 0;
          color: #92400e;
          font-size: 11px;
          line-height: 1.55;
        }

        .dipo-renewal-pending-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px 15px;
          margin-top: 8px;
          color: #a16207;
          font-size: 10px;
          font-weight: 750;
        }

        .dipo-renewal-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eef0f2;
        }

        .dipo-renewal-security {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #9ca3af;
          font-size: 10px;
          line-height: 1.4;
        }

        .dipo-renewal-security svg {
          width: 15px;
          height: 15px;
          flex: 0 0 15px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .dipo-renewal-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 46px;
          padding: 0 17px;
          border-radius: 14px;
          background: #111827;
          color: #ffffff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
          box-shadow:
            0 10px 22px
            rgba(17, 24, 39, 0.14);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .dipo-renewal-button svg {
          width: 16px;
          height: 16px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: transform 180ms ease;
        }

        .dipo-renewal-button:hover {
          transform: translateY(-2px);
          background: #000000;
          box-shadow:
            0 14px 28px
            rgba(17, 24, 39, 0.18);
        }

        .dipo-renewal-button:hover svg {
          transform: translateX(2px);
        }

        .dipo-renewal-button:focus-visible {
          outline: 3px solid
            rgba(16, 185, 129, 0.25);
          outline-offset: 3px;
        }

        .dipo-renewal-extra {
          margin-top: 16px;
        }

        .dipo-renewal-card--compact
          .dipo-renewal-inner {
          padding: 20px;
        }

        .dipo-renewal-card--compact
          .dipo-renewal-summary {
          margin-top: 17px;
        }

        @media (max-width: 720px) {
          .dipo-renewal-top {
            flex-direction: column;
          }

          .dipo-renewal-status {
            align-self: flex-start;
          }

          .dipo-renewal-summary {
            grid-template-columns: 1fr;
          }

          .dipo-renewal-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .dipo-renewal-security {
            width: 100%;
          }

          .dipo-renewal-button {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .dipo-renewal-inner {
            padding: 17px;
          }

          .dipo-renewal-plan,
          .dipo-renewal-validity {
            padding: 17px;
            border-radius: 17px;
          }

          .dipo-renewal-title {
            font-size: 25px;
          }

          .dipo-renewal-pending {
            padding: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-renewal-button,
          .dipo-renewal-button svg {
            transition: none;
          }

          .dipo-renewal-button:hover {
            transform: none;
          }

          .dipo-renewal-button:hover svg {
            transform: none;
          }
        }
      `}</style>

      <div className="dipo-renewal-inner">
        <div className="dipo-renewal-top">
          <div>
            <p className="dipo-renewal-kicker">
              <span
                className="dipo-renewal-kicker-dot"
                aria-hidden="true"
              />
              Worldwide DIPO
            </p>

            <h2
              id="dipo-renewal-card-title"
              className="dipo-renewal-title"
            >
              {status.title}
            </h2>

            <p className="dipo-renewal-description">
              {status.description}
            </p>
          </div>

          <span
            className="dipo-renewal-status"
            aria-label={`Subscription status: ${status.label}`}
          >
            {status.label}
          </span>
        </div>

        <div className="dipo-renewal-summary">
          <div className="dipo-renewal-plan">
            <span className="dipo-renewal-plan-label">
              Current plan
            </span>

            <div className="dipo-renewal-plan-name">
              <strong>
                {plan?.name ||
                  profile?.plan ||
                  'Not selected'}
              </strong>

              {plan?.durationMonths && (
                <span>
                  {plan.durationMonths} months
                </span>
              )}
            </div>

            {plan?.amount && (
              <div className="dipo-renewal-plan-price">
                ₹{plan.amount} / renewal
              </div>
            )}
          </div>

          <div className="dipo-renewal-validity">
            <span className="dipo-renewal-validity-label">
              {isExpired
                ? 'Subscription expired'
                : 'Remaining validity'}
            </span>

            <strong className="dipo-renewal-days">
              {daysRemaining === null
                ? '—'
                : `${daysRemaining}d`}
            </strong>

            {expiresDate && (
              <span className="dipo-renewal-expiry">
                {isExpired
                  ? `Expired ${expiresDate}`
                  : `Expires ${expiresDate}`}
              </span>
            )}
          </div>
        </div>

        {hasPendingRenewal && (
          <div
            className="dipo-renewal-pending"
            role="status"
            aria-live="polite"
          >
            <div
              className="dipo-renewal-pending-icon"
              aria-hidden="true"
            >
              <StatusIcon status="pending" />
            </div>

            <div>
              <h3>
                Renewal verification pending
              </h3>

              <p>
                Your renewal payment has been
                submitted and is waiting for
                admin verification.
              </p>

              <div className="dipo-renewal-pending-meta">
                {pendingRenewal.plan && (
                  <span>
                    Plan: {pendingRenewal.plan}
                  </span>
                )}

                {pendingRenewal.amount && (
                  <span>
                    Amount: ₹
                    {pendingRenewal.amount}
                  </span>
                )}

                {pendingDate && (
                  <span>
                    Submitted: {pendingDate}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {showAction && (
          <div className="dipo-renewal-actions">
            <div className="dipo-renewal-security">
              <ShieldIcon />

              <span>
                Payment is manually verified
                before subscription changes.
              </span>
            </div>

            <Link
              href={actionHref}
              className="dipo-renewal-button"
            >
              {hasPendingRenewal
                ? 'View Renewal Status'
                : isExpired
                  ? 'Renew Subscription'
                  : 'Manage Subscription'}

              <ArrowIcon />
            </Link>
          </div>
        )}

        {children && (
          <div className="dipo-renewal-extra">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}