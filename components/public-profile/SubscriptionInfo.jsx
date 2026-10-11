import Link from 'next/link';

import { getPaymentPlan } from '@/lib/payments/payment-config';

/*
 * ============================================================
 * WORLDWIDE DIPO
 * Public Profile — SubscriptionInfo
 * ============================================================
 *
 * PURPOSE
 * ------------------------------------------------------------
 * Safe public-facing subscription summary for a DIPO profile.
 *
 * SHOWS
 * ------------------------------------------------------------
 * • Current plan
 * • Active status
 * • Valid-until date
 * • Remaining days
 * • Optional owner-only subscription management CTA
 *
 * DOES NOT SHOW
 * ------------------------------------------------------------
 * • Payment reference / UTR
 * • Payment amount actually paid
 * • Admin information
 * • Verification details
 * • User IDs
 * • Internal payment IDs
 * • Renewal payment records
 *
 * SECURITY MODEL
 * ------------------------------------------------------------
 * This component NEVER decides whether someone is an owner.
 *
 * The parent page must calculate `isOwner` server-side.
 *
 * Example:
 *
 * <SubscriptionInfo
 *   profile={profile}
 *   isOwner={isOwner}
 * />
 *
 * The UI is only presentation.
 * Real authorization must remain server-side.
 * ============================================================
 */


/*
 * ------------------------------------------------------------
 * TEXT NORMALIZATION
 * ------------------------------------------------------------
 */

function cleanText(value) {
  return typeof value === 'string'
    ? value.trim()
    : '';
}


/*
 * ------------------------------------------------------------
 * PLAN NORMALIZATION
 * ------------------------------------------------------------
 *
 * Keeps compatibility with:
 * Starter
 * Pro
 * Elite
 *
 * Also tolerates lowercase / whitespace variants.
 * ------------------------------------------------------------
 */

function normalizePlan(value) {
  const plan = cleanText(value);

  if (!plan) {
    return '';
  }

  const normalized =
    plan.toLowerCase();

  if (
    normalized === 'starter'
  ) {
    return 'Starter';
  }

  if (
    normalized === 'pro'
  ) {
    return 'Pro';
  }

  if (
    normalized === 'elite'
  ) {
    return 'Elite';
  }

  return plan;
}


/*
 * ------------------------------------------------------------
 * PLAN DISPLAY
 * ------------------------------------------------------------
 */

function getPlanPresentation(plan) {
  const normalizedPlan =
    normalizePlan(plan);

  const config =
    getPaymentPlan(
      normalizedPlan
    );

  if (!config) {
    return {
      name:
        normalizedPlan ||
        'Worldwide DIPO',
      badge: 'DIPO',
      description:
        'Digital identity profile',
      className:
        'default',
    };
  }

  const name =
    cleanText(config.name) ||
    normalizedPlan;

  const badge =
    cleanText(config.badge);

  const description =
    cleanText(config.description);

  let className =
    'default';

  if (
    normalizedPlan ===
    'Starter'
  ) {
    className =
      'starter';
  }

  if (
    normalizedPlan ===
    'Pro'
  ) {
    className =
      'pro';
  }

  if (
    normalizedPlan ===
    'Elite'
  ) {
    className =
      'elite';
  }

  return {
    name,
    badge:
      badge || name,
    description,
    className,
  };
}


/*
 * ------------------------------------------------------------
 * DATE PARSING
 * ------------------------------------------------------------
 */

function getValidDate(value) {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    !Number.isFinite(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
}


/*
 * ------------------------------------------------------------
 * FORMAT DATE
 * ------------------------------------------------------------
 */

function formatDate(value) {
  const date =
    getValidDate(value);

  if (!date) {
    return '';
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  );
}


/*
 * ------------------------------------------------------------
 * DAYS REMAINING
 * ------------------------------------------------------------
 *
 * Uses calendar-day style rounding.
 *
 * Future:
 *   positive number
 *
 * Expired:
 *   0
 *
 * Invalid / missing:
 *   null
 * ------------------------------------------------------------
 */

function getDaysRemaining(
  expiresAt
) {
  const expiry =
    getValidDate(
      expiresAt
    );

  if (!expiry) {
    return null;
  }

  const difference =
    expiry.getTime() -
    Date.now();

  if (
    difference <= 0
  ) {
    return 0;
  }

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
}


/*
 * ------------------------------------------------------------
 * STATUS
 * ------------------------------------------------------------
 */

function getProfileStatus(
  profile,
  daysRemaining
) {
  const status =
    cleanText(
      profile?.status
    ).toLowerCase();

  /*
   * The public profile projection already only exposes
   * active, unexpired profiles.
   *
   * Still, we fail safely if this component is reused elsewhere.
   */

  if (
    status === 'active' &&
    (
      daysRemaining === null ||
      daysRemaining > 0
    )
  ) {
    return {
      key: 'active',
      label: 'Active',
      description:
        'Your DIPO is live on the web.',
    };
  }

  if (
    status === 'expired' ||
    daysRemaining === 0
  ) {
    return {
      key: 'expired',
      label: 'Expired',
      description:
        'This DIPO subscription has expired.',
    };
  }

  if (
    status === 'pending'
  ) {
    return {
      key: 'pending',
      label: 'Pending',
      description:
        'Subscription verification is in progress.',
    };
  }

  if (
    status === 'draft'
  ) {
    return {
      key: 'draft',
      label: 'Draft',
      description:
        'This DIPO has not been activated yet.',
    };
  }

  /*
   * Safe fallback.
   */
  return {
    key: 'unknown',
    label: 'DIPO',
    description:
      'Worldwide DIPO digital identity.',
  };
}


/*
 * ------------------------------------------------------------
 * INLINE ICONS
 * ------------------------------------------------------------
 *
 * No external icon dependency.
 * ------------------------------------------------------------
 */

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.5 19 6v5.2c0 4.4-2.6 7.7-7 9.3-4.4-1.6-7-4.9-7-9.3V6l7-2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}


function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15.5"
        rx="2.5"
      />
      <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" />
    </svg>
  );
}


function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
      <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    </svg>
  );
}


function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}


/*
 * ============================================================
 * MAIN COMPONENT
 * ============================================================
 */

export default function SubscriptionInfo({
  profile,
  isOwner = false,
  compact = false,
}) {
  /*
   * ----------------------------------------------------------
   * FAIL-SAFE INPUT
   * ----------------------------------------------------------
   */

  if (
    !profile ||
    typeof profile !== 'object'
  ) {
    return null;
  }


  /*
   * ----------------------------------------------------------
   * PUBLIC PROFILE SAFETY
   * ----------------------------------------------------------
   *
   * Public DIPO pages are supposed to be active.
   *
   * We still avoid showing subscription information for
   * obviously non-public states when this component is reused.
   */

  const status =
    cleanText(
      profile.status
    ).toLowerCase();

  if (
    status &&
    status !== 'active' &&
    !isOwner
  ) {
    return null;
  }


  /*
   * ----------------------------------------------------------
   * PLAN
   * ----------------------------------------------------------
   */

  const plan =
    getPlanPresentation(
      profile.plan
    );


  /*
   * ----------------------------------------------------------
   * VALIDITY
   * ----------------------------------------------------------
   */

  const expiresAt =
    profile.expires_at;

  const expiryDate =
    getValidDate(
      expiresAt
    );

  const expiryText =
    formatDate(
      expiresAt
    );

  const daysRemaining =
    getDaysRemaining(
      expiresAt
    );


  /*
   * ----------------------------------------------------------
   * STATUS
   * ----------------------------------------------------------
   */

  const statusInfo =
    getProfileStatus(
      profile,
      daysRemaining
    );


  /*
   * ----------------------------------------------------------
   * URGENCY
   * ----------------------------------------------------------
   *
   * Public profile should remain calm and premium.
   *
   * We only add a subtle urgency state for the owner.
   */

  const isExpiringSoon =
    isOwner &&
    statusInfo.key ===
      'active' &&
    typeof daysRemaining ===
      'number' &&
    daysRemaining > 0 &&
    daysRemaining <= 14;

  const isHealthy =
    statusInfo.key ===
      'active' &&
    (
      daysRemaining === null ||
      daysRemaining > 14
    );


  /*
   * ----------------------------------------------------------
   * ACCESSIBILITY LABELS
   * ----------------------------------------------------------
   */

  const statusLabel =
    isExpiringSoon
      ? `Active. ${daysRemaining} ${
          daysRemaining === 1
            ? 'day'
            : 'days'
        } remaining.`
      : statusInfo.label;


  /*
   * ----------------------------------------------------------
   * COMPACT VERSION
   * ----------------------------------------------------------
   *
   * Useful if the profile layout wants a small subscription
   * indicator rather than the full card.
   */

  if (compact) {
    return (
      <>
        <div
          className={[
            'dipo-subscription-info',
            'dipo-subscription-info--compact',
            `is-${statusInfo.key}`,
          ].join(' ')}
          aria-label={
            `Worldwide DIPO ${plan.name}. ${statusLabel}.`
          }
        >
          <span
            className="dipo-subscription-info__compact-dot"
            aria-hidden="true"
          />

          <span className="dipo-subscription-info__compact-text">
            <strong>
              {plan.name}
            </strong>

            {expiryText && (
              <small>
                Valid until {expiryText}
              </small>
            )}
          </span>

          {isOwner && (
            <Link
              href="/dashboard/subscription"
              className="dipo-subscription-info__compact-action"
              aria-label="Manage DIPO subscription"
            >
              <ArrowIcon />
            </Link>
          )}
        </div>

        <SubscriptionInfoStyles />
      </>
    );
  }


  /*
   * ==========================================================
   * FULL CARD
   * ==========================================================
   */

  return (
    <>
      <section
        className={[
          'dipo-subscription-info',
          `plan-${plan.className}`,
          `is-${statusInfo.key}`,
          isExpiringSoon
            ? 'is-expiring-soon'
            : '',
          isHealthy
            ? 'is-healthy'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-labelledby="dipo-subscription-title"
      >

        {/* ====================================================
            TOP BRAND ROW
        ===================================================== */}

        <div className="dipo-subscription-info__top">

          <div className="dipo-subscription-info__brand">

            <span
              className="dipo-subscription-info__brand-icon"
              aria-hidden="true"
            >
              <SparkIcon />
            </span>

            <div>
              <span className="dipo-subscription-info__eyebrow">
                WORLDWIDE DIPO
              </span>

              <h2
                id="dipo-subscription-title"
              >
                Subscription
              </h2>
            </div>
          </div>


          {/* STATUS PILL */}

          <span
            className="dipo-subscription-info__status"
            aria-label={
              statusLabel
            }
          >
            <span
              className="dipo-subscription-info__status-dot"
              aria-hidden="true"
            />

            {statusInfo.label}
          </span>
        </div>


        {/* ====================================================
            MAIN PLAN
        ===================================================== */}

        <div className="dipo-subscription-info__main">

          <div className="dipo-subscription-info__plan-copy">

            <span className="dipo-subscription-info__label">
              CURRENT PLAN
            </span>

            <div className="dipo-subscription-info__plan-name-row">

              <h3>
                {plan.name}
              </h3>

              {plan.badge && (
                <span
                  className="dipo-subscription-info__plan-badge"
                >
                  {plan.badge}
                </span>
              )}
            </div>

            {plan.description && (
              <p>
                {plan.description}
              </p>
            )}
          </div>


          {/* PLAN MARK */}

          <div
            className="dipo-subscription-info__plan-mark"
            aria-hidden="true"
          >
            <span>
              {plan.name
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>
        </div>


        {/* ====================================================
            DETAILS
        ===================================================== */}

        <div className="dipo-subscription-info__details">

          {/* STATUS */}

          <div className="dipo-subscription-info__detail">

            <span
              className="dipo-subscription-info__detail-icon"
              aria-hidden="true"
            >
              <ShieldIcon />
            </span>

            <span className="dipo-subscription-info__detail-copy">
              <small>
                PROFILE STATUS
              </small>

              <strong>
                {statusInfo.label}
              </strong>
            </span>
          </div>


          {/* VALIDITY */}

          <div className="dipo-subscription-info__detail">

            <span
              className="dipo-subscription-info__detail-icon"
              aria-hidden="true"
            >
              <CalendarIcon />
            </span>

            <span className="dipo-subscription-info__detail-copy">
              <small>
                VALID UNTIL
              </small>

              <strong>
                {expiryText ||
                  'No expiry date'}
              </strong>
            </span>
          </div>


          {/* DAYS */}

          {typeof daysRemaining ===
            'number' && (
            <div className="dipo-subscription-info__detail">

              <span className="dipo-subscription-info__detail-icon dipo-subscription-info__detail-icon--days">
                <span>
                  {daysRemaining}
                </span>
              </span>

              <span className="dipo-subscription-info__detail-copy">
                <small>
                  TIME LEFT
                </small>

                <strong>
                  {daysRemaining ===
                  0
                    ? 'Expired'
                    : `${daysRemaining} ${
                        daysRemaining ===
                        1
                          ? 'day'
                          : 'days'
                      }`}
                </strong>
              </span>
            </div>
          )}
        </div>


        {/* ====================================================
            OWNER EXPIRY NOTICE
        ===================================================== */}

        {isExpiringSoon && (
          <div
            className="dipo-subscription-info__notice"
            role="status"
          >
            <span
              aria-hidden="true"
            >
              !
            </span>

            <p>
              Your DIPO is active, but
              the subscription is nearing
              its expiry date.
            </p>
          </div>
        )}


        {/* ====================================================
            FOOTER
        ===================================================== */}

        <div className="dipo-subscription-info__footer">

          <p>
            {statusInfo.key ===
            'active'
              ? 'Your digital identity is currently live on Worldwide DIPO.'
              : statusInfo.description}
          </p>


          {isOwner && (
            <Link
              href="/dashboard/subscription"
              className="dipo-subscription-info__manage"
            >
              <span>
                Manage subscription
              </span>

              <ArrowIcon />
            </Link>
          )}
        </div>


        {/* ====================================================
            PUBLIC TRUST NOTE
        ===================================================== */}

        <div className="dipo-subscription-info__trust">
          <span
            aria-hidden="true"
          >
            <ShieldIcon />
          </span>

          <span>
            Subscription details shown here
            are limited to public profile
            information.
          </span>
        </div>
      </section>

      <SubscriptionInfoStyles />
    </>
  );
}


/*
 * ============================================================
 * LOCAL STYLES
 * ============================================================
 *
 * Kept inside this component so the new empty file is
 * completely self-contained and does not require another
 * CSS file or global stylesheet changes.
 * ============================================================
 */

function SubscriptionInfoStyles() {
  return (
    <style>{`
      .dipo-subscription-info {
        --dsi-ink: #0a0f18;
        --dsi-text: #172033;
        --dsi-muted: #667085;
        --dsi-subtle: #98a2b3;
        --dsi-line: #e8ecf0;
        --dsi-soft: #f7f9fb;
        --dsi-white: #ffffff;
        --dsi-green: #059669;
        --dsi-green-soft: #ecfdf5;
        --dsi-amber: #b45309;
        --dsi-amber-soft: #fffbeb;
        --dsi-red: #b91c1c;
        --dsi-red-soft: #fef2f2;

        position: relative;
        width: 100%;
        overflow: hidden;
        border: 1px solid var(--dsi-line);
        border-radius: 24px;
        background:
          linear-gradient(
            145deg,
            #ffffff 0%,
            #fbfcfd 100%
          );
        box-shadow:
          0 20px 60px rgba(15,23,42,.055),
          0 2px 8px rgba(15,23,42,.025);
        color: var(--dsi-text);
      }

      .dipo-subscription-info::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background:
          linear-gradient(
            90deg,
            transparent 0%,
            rgba(5,150,105,.18) 20%,
            rgba(5,150,105,.75) 50%,
            rgba(5,150,105,.18) 80%,
            transparent 100%
          );
      }

      .dipo-subscription-info * {
        box-sizing: border-box;
      }

      .dipo-subscription-info__top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 22px 24px 18px;
      }

      .dipo-subscription-info__brand {
        display: flex;
        align-items: center;
        gap: 11px;
        min-width: 0;
      }

      .dipo-subscription-info__brand-icon {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(5,150,105,.12);
        border-radius: 12px;
        background: var(--dsi-green-soft);
        color: var(--dsi-green);
      }

      .dipo-subscription-info__brand-icon svg {
        width: 17px;
        height: 17px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.7;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .dipo-subscription-info__brand > div {
        min-width: 0;
      }

      .dipo-subscription-info__eyebrow {
        display: block;
        margin-bottom: 3px;
        color: var(--dsi-subtle);
        font-size: 7px;
        line-height: 1;
        font-weight: 950;
        letter-spacing: .15em;
      }

      .dipo-subscription-info__brand h2 {
        margin: 0;
        color: var(--dsi-ink);
        font-size: 15px;
        line-height: 1.1;
        font-weight: 900;
        letter-spacing: -.025em;
      }

      .dipo-subscription-info__status {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 28px;
        padding: 0 10px;
        border: 1px solid rgba(5,150,105,.12);
        border-radius: 999px;
        background: var(--dsi-green-soft);
        color: var(--dsi-green);
        font-size: 8px;
        line-height: 1;
        font-weight: 900;
        letter-spacing: .04em;
      }

      .dipo-subscription-info__status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        box-shadow:
          0 0 0 3px rgba(5,150,105,.09);
      }

      .dipo-subscription-info.is-expiring-soon
        .dipo-subscription-info__status {
        border-color: rgba(180,83,9,.14);
        background: var(--dsi-amber-soft);
        color: var(--dsi-amber);
      }

      .dipo-subscription-info.is-expiring-soon
        .dipo-subscription-info__status-dot {
        box-shadow:
          0 0 0 3px rgba(180,83,9,.09);
      }

      .dipo-subscription-info.is-expired
        .dipo-subscription-info__status {
        border-color: rgba(185,28,28,.12);
        background: var(--dsi-red-soft);
        color: var(--dsi-red);
      }

      .dipo-subscription-info.is-expired
        .dipo-subscription-info__status-dot {
        box-shadow:
          0 0 0 3px rgba(185,28,28,.08);
      }

      .dipo-subscription-info__main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin: 0 24px;
        padding: 19px 0;
        border-top: 1px solid var(--dsi-line);
        border-bottom: 1px solid var(--dsi-line);
      }

      .dipo-subscription-info__plan-copy {
        min-width: 0;
      }

      .dipo-subscription-info__label {
        display: block;
        margin-bottom: 6px;
        color: var(--dsi-subtle);
        font-size: 7px;
        line-height: 1;
        font-weight: 950;
        letter-spacing: .13em;
      }

      .dipo-subscription-info__plan-name-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      .dipo-subscription-info__plan-name-row h3 {
        margin: 0;
        color: var(--dsi-ink);
        font-size: clamp(21px, 3vw, 27px);
        line-height: 1;
        font-weight: 950;
        letter-spacing: -.045em;
      }

      .dipo-subscription-info__plan-badge {
        display: inline-flex;
        align-items: center;
        min-height: 21px;
        padding: 0 7px;
        border-radius: 999px;
        background: #f1f5f9;
        color: var(--dsi-muted);
        font-size: 7px;
        line-height: 1;
        font-weight: 950;
        letter-spacing: .06em;
        text-transform: uppercase;
      }

      .dipo-subscription-info.plan-pro
        .dipo-subscription-info__plan-badge {
        background: #eff6ff;
        color: #2563eb;
      }

      .dipo-subscription-info.plan-elite
        .dipo-subscription-info__plan-badge {
        background: #f5f3ff;
        color: #7c3aed;
      }

      .dipo-subscription-info__plan-copy p {
        max-width: 540px;
        margin: 7px 0 0;
        color: var(--dsi-muted);
        font-size: 10px;
        line-height: 1.55;
      }

      .dipo-subscription-info__plan-mark {
        width: 58px;
        height: 58px;
        flex: 0 0 58px;
        display: grid;
        place-items: center;
        border: 1px solid var(--dsi-line);
        border-radius: 18px;
        background:
          linear-gradient(
            145deg,
            #f8fafc,
            #eef2f6
          );
        color: var(--dsi-ink);
      }

      .dipo-subscription-info__plan-mark span {
        font-size: 20px;
        line-height: 1;
        font-weight: 950;
        letter-spacing: -.06em;
      }

      .dipo-subscription-info__details {
        display: grid;
        grid-template-columns:
          repeat(3, minmax(0, 1fr));
        gap: 8px;
        padding: 13px 24px;
      }

      .dipo-subscription-info__detail {
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 9px;
        min-height: 53px;
        padding: 7px 9px;
        border: 1px solid transparent;
        border-radius: 13px;
      }

      .dipo-subscription-info__detail:hover {
        border-color: var(--dsi-line);
        background: var(--dsi-soft);
      }

      .dipo-subscription-info__detail-icon {
        width: 31px;
        height: 31px;
        flex: 0 0 31px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: #f3f5f7;
        color: var(--dsi-muted);
      }

      .dipo-subscription-info__detail-icon svg {
        width: 14px;
        height: 14px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .dipo-subscription-info__detail-icon--days {
        background: var(--dsi-green-soft);
        color: var(--dsi-green);
      }

      .dipo-subscription-info__detail-icon--days span {
        font-size: 8px;
        font-weight: 950;
      }

      .dipo-subscription-info__detail-copy {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .dipo-subscription-info__detail-copy small {
        color: var(--dsi-subtle);
        font-size: 6px;
        line-height: 1;
        font-weight: 950;
        letter-spacing: .11em;
      }

      .dipo-subscription-info__detail-copy strong {
        overflow: hidden;
        color: var(--dsi-text);
        font-size: 9px;
        line-height: 1.25;
        font-weight: 900;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dipo-subscription-info__notice {
        display: flex;
        align-items: flex-start;
        gap: 9px;
        margin: 0 24px 4px;
        padding: 10px 11px;
        border: 1px solid rgba(180,83,9,.12);
        border-radius: 12px;
        background: var(--dsi-amber-soft);
      }

      .dipo-subscription-info__notice > span {
        width: 17px;
        height: 17px;
        flex: 0 0 17px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #fef3c7;
        color: var(--dsi-amber);
        font-size: 9px;
        font-weight: 950;
      }

      .dipo-subscription-info__notice p {
        margin: 1px 0 0;
        color: #92400e;
        font-size: 8px;
        line-height: 1.5;
        font-weight: 700;
      }

      .dipo-subscription-info__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 15px 24px 14px;
        border-top: 1px solid var(--dsi-line);
      }

      .dipo-subscription-info__footer p {
        max-width: 600px;
        margin: 0;
        color: var(--dsi-subtle);
        font-size: 8px;
        line-height: 1.5;
      }

      .dipo-subscription-info__manage {
        min-height: 35px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        flex: 0 0 auto;
        padding: 0 11px;
        border: 1px solid rgba(5,150,105,.16);
        border-radius: 10px;
        background: var(--dsi-green-soft);
        color: var(--dsi-green);
        text-decoration: none;
        font-size: 8px;
        font-weight: 900;
        transition:
          transform 150ms ease,
          background 150ms ease,
          border-color 150ms ease;
      }

      .dipo-subscription-info__manage:hover {
        border-color: rgba(5,150,105,.25);
        background: #dffbef;
        transform: translateY(-1px);
      }

      .dipo-subscription-info__manage:focus-visible,
      .dipo-subscription-info__compact-action:focus-visible {
        outline: 3px solid rgba(5,150,105,.2);
        outline-offset: 3px;
      }

      .dipo-subscription-info__manage svg {
        width: 13px;
        height: 13px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .dipo-subscription-info__trust {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 30px;
        padding: 0 15px;
        border-top: 1px solid rgba(232,236,240,.7);
        background: rgba(248,250,252,.55);
        color: var(--dsi-subtle);
        font-size: 7px;
        line-height: 1.35;
        text-align: center;
      }

      .dipo-subscription-info__trust > span:first-child {
        display: inline-grid;
        place-items: center;
        color: var(--dsi-green);
      }

      .dipo-subscription-info__trust svg {
        width: 11px;
        height: 11px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }


      /* ======================================================
         COMPACT
      ======================================================= */

      .dipo-subscription-info--compact {
        min-height: 52px;
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 8px 9px;
        border-radius: 15px;
        box-shadow: none;
      }

      .dipo-subscription-info--compact::before {
        height: 1px;
      }

      .dipo-subscription-info__compact-dot {
        width: 8px;
        height: 8px;
        flex: 0 0 8px;
        border-radius: 50%;
        background: var(--dsi-green);
        box-shadow:
          0 0 0 4px rgba(5,150,105,.08);
      }

      .dipo-subscription-info--compact.is-expired
        .dipo-subscription-info__compact-dot {
        background: var(--dsi-red);
        box-shadow:
          0 0 0 4px rgba(185,28,28,.08);
      }

      .dipo-subscription-info__compact-text {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .dipo-subscription-info__compact-text strong {
        overflow: hidden;
        color: var(--dsi-text);
        font-size: 9px;
        font-weight: 900;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dipo-subscription-info__compact-text small {
        overflow: hidden;
        color: var(--dsi-subtle);
        font-size: 7px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dipo-subscription-info__compact-action {
        width: 29px;
        height: 29px;
        margin-left: auto;
        display: grid;
        place-items: center;
        flex: 0 0 29px;
        border: 1px solid rgba(5,150,105,.13);
        border-radius: 9px;
        background: var(--dsi-green-soft);
        color: var(--dsi-green);
        text-decoration: none;
      }

      .dipo-subscription-info__compact-action svg {
        width: 12px;
        height: 12px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }


      /* ======================================================
         RESPONSIVE
      ======================================================= */

      @media (max-width: 680px) {
        .dipo-subscription-info {
          border-radius: 20px;
        }

        .dipo-subscription-info__top {
          padding: 18px 17px 15px;
        }

        .dipo-subscription-info__main {
          margin: 0 17px;
          padding: 17px 0;
        }

        .dipo-subscription-info__details {
          grid-template-columns: 1fr;
          gap: 2px;
          padding: 10px 14px;
        }

        .dipo-subscription-info__detail {
          min-height: 48px;
        }

        .dipo-subscription-info__footer {
          align-items: stretch;
          flex-direction: column;
          padding: 13px 17px;
        }

        .dipo-subscription-info__manage {
          width: 100%;
        }

        .dipo-subscription-info__notice {
          margin-left: 17px;
          margin-right: 17px;
        }

        .dipo-subscription-info__trust {
          padding: 8px 14px;
        }
      }

      @media (max-width: 420px) {
        .dipo-subscription-info__top {
          align-items: flex-start;
        }

        .dipo-subscription-info__status {
          min-height: 25px;
          padding: 0 8px;
          font-size: 7px;
        }

        .dipo-subscription-info__brand-icon {
          width: 34px;
          height: 34px;
          flex-basis: 34px;
        }

        .dipo-subscription-info__brand h2 {
          font-size: 14px;
        }

        .dipo-subscription-info__main {
          gap: 12px;
        }

        .dipo-subscription-info__plan-mark {
          width: 46px;
          height: 46px;
          flex-basis: 46px;
          border-radius: 14px;
        }

        .dipo-subscription-info__plan-mark span {
          font-size: 16px;
        }

        .dipo-subscription-info__plan-name-row h3 {
          font-size: 21px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .dipo-subscription-info *,
        .dipo-subscription-info *::before,
        .dipo-subscription-info *::after {
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: .01ms !important;
        }
      }
    `}</style>
  );
}