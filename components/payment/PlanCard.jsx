'use client';

import { useMemo, useState } from 'react';

const DEFAULT_FEATURES = {
  free: [
    'Personal DIPO identity',
    'Public DIPO profile',
    'Shareable DIPO URL',
  ],
  basic: [
    'Professional DIPO profile',
    'Custom digital identity',
    'Projects & work showcase',
    'Social & contact links',
  ],
  pro: [
    'Everything in Basic',
    'Advanced profile sections',
    'Premium presentation',
    'More visibility features',
  ],
  premium: [
    'Everything in Pro',
    'Premium DIPO experience',
    'Priority support',
    'Advanced identity features',
  ],
};

function normalizePlan(plan) {
  return String(plan || '')
    .trim()
    .toLowerCase();
}

function formatPrice(price) {
  if (
    price === null ||
    price === undefined ||
    price === ''
  ) {
    return '₹0';
  }

  const numeric = Number(price);

  if (!Number.isFinite(numeric)) {
    return String(price);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric);
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"
        fill="currentColor"
      />

      <path
        d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m4 7 4.2 4L12 4l3.8 7L20 7l-1.5 11h-13L4 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M6.5 21h11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PlanCard({
  plan,
  name,
  title,
  description,
  price,
  amount,
  currency = 'INR',
  billing,
  billingLabel,
  period,
  features,
  highlighted = false,
  popular = false,
  recommended = false,
  current = false,
  disabled = false,
  loading = false,
  selected = false,
  selectable = false,
  compact = false,

  cta = 'Choose plan',
  buttonLabel,
  href,

  onSelect,
  onChoose,
  onClick,

  badge,
  badgeLabel,
  icon,

  children,
}) {
  const [hovered, setHovered] =
    useState(false);

  const [pressed, setPressed] =
    useState(false);

  const normalizedPlan =
    normalizePlan(plan);

  const resolvedName =
    name ||
    title ||
    plan ||
    'DIPO Plan';

  const resolvedPrice =
    price !== undefined
      ? price
      : amount;

  const resolvedBilling =
    billingLabel ||
    billing ||
    period ||
    '';

  const resolvedFeatures =
    Array.isArray(features) &&
    features.length
      ? features
      : DEFAULT_FEATURES[
          normalizedPlan
        ] || [];

  const isFeatured =
    highlighted ||
    popular ||
    recommended;

  const displayBadge =
    badge ||
    badgeLabel ||
    (popular
      ? 'Most popular'
      : recommended
        ? 'Recommended'
        : null);

  const formattedPrice =
    formatPrice(resolvedPrice);

  const priceSuffix =
    resolvedBilling
      ? `/${String(
          resolvedBilling
        ).replace(/^\/+/, '')}`
      : '';

  const actionLabel =
    buttonLabel ||
    cta;

  const accent = isFeatured
    ? '#059669'
    : '#111111';

  const cardClassName =
    [
      'dipo-plan-card',
      isFeatured
        ? 'dipo-plan-card-featured'
        : '',
      current
        ? 'dipo-plan-card-current'
        : '',
      selected
        ? 'dipo-plan-card-selected'
        : '',
      compact
        ? 'dipo-plan-card-compact'
        : '',
    ]
      .filter(Boolean)
      .join(' ');

  const styleVars =
    useMemo(
      () => ({
        '--dipo-accent':
          accent,
      }),
      [accent]
    );

  function handleAction(event) {
    if (
      disabled ||
      loading ||
      current
    ) {
      return;
    }

    if (typeof onChoose === 'function') {
      onChoose({
        plan,
        amount: resolvedPrice,
      });

      return;
    }

    if (typeof onSelect === 'function') {
      onSelect({
        plan,
        amount: resolvedPrice,
      });

      return;
    }

    if (typeof onClick === 'function') {
      onClick(event);

      return;
    }
  }

  function handleKeyDown(event) {
    if (
      selectable &&
      (event.key === 'Enter' ||
        event.key === ' ')
    ) {
      event.preventDefault();
      handleAction(event);
    }
  }

  const content = (
    <>
      {/* =====================================================
          CARD HEADER
      ====================================================== */}

      <div className="plan-head">
        <div className="plan-head-row">
          <div className="plan-identity">
            {icon ? (
              <div className="plan-icon">
                {icon}
              </div>
            ) : (
              <div
                className={`plan-icon ${
                  isFeatured
                    ? 'plan-icon-featured'
                    : ''
                }`}
              >
                {isFeatured ? (
                  <CrownIcon />
                ) : (
                  <SparkIcon />
                )}
              </div>
            )}

            <div className="plan-name-wrap">
              <div className="plan-name-row">
                <h3 className="plan-name">
                  {resolvedName}
                </h3>

                {current ? (
                  <span className="current-mini">
                    Current
                  </span>
                ) : null}
              </div>

              {description ? (
                <p className="plan-description">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          {displayBadge ? (
            <span className="plan-badge">
              <span className="badge-dot" />
              {displayBadge}
            </span>
          ) : null}
        </div>
      </div>

      {/* =====================================================
          PRICE
      ====================================================== */}

      <div className="price-area">
        <div className="price-row">
          <span className="currency-symbol">
            {currency === 'INR'
              ? '₹'
              : currency}
          </span>

          <span className="price-value">
            {String(formattedPrice)
              .replace(/^₹/, '')
              .replace(/^INR\s?/, '')}
          </span>

          {priceSuffix ? (
            <span className="price-period">
              {priceSuffix}
            </span>
          ) : null}
        </div>

        {resolvedBilling ? (
          <p className="billing-copy">
            {String(
              resolvedBilling
            ).toLowerCase() ===
            'year'
              ? 'Billed annually'
              : String(
                    resolvedBilling
                  ).toLowerCase() ===
                  'month'
                ? 'Billed monthly'
                : `Billed ${String(
                    resolvedBilling
                  ).toLowerCase()}`}
          </p>
        ) : null}
      </div>

      {/* =====================================================
          CTA
      ====================================================== */}

      {href && !disabled && !loading ? (
        <a
          href={href}
          className={`plan-action ${
            isFeatured
              ? 'plan-action-featured'
              : ''
          }`}
          aria-current={
            current
              ? 'page'
              : undefined
          }
          onClick={(event) => {
            if (
              typeof onChoose ===
              'function'
            ) {
              event.preventDefault();
              handleAction(event);
            }
          }}
        >
          <span>
            {current
              ? 'Current plan'
              : actionLabel}
          </span>

          <ArrowIcon />
        </a>
      ) : (
        <button
          type="button"
          className={`plan-action ${
            isFeatured
              ? 'plan-action-featured'
              : ''
          }`}
          disabled={
            disabled ||
            loading ||
            current
          }
          onClick={handleAction}
        >
          <span>
            {loading
              ? 'Please wait…'
              : current
                ? 'Current plan'
                : actionLabel}
          </span>

          {!loading &&
          !current ? (
            <ArrowIcon />
          ) : null}
        </button>
      )}

      {/* =====================================================
          FEATURE LIST
      ====================================================== */}

      <div className="features">
        <div className="features-label">
          What's included
        </div>

        <ul className="feature-list">
          {resolvedFeatures.map(
            (feature, index) => (
              <li
                key={`${String(
                  feature
                )}-${index}`}
                className="feature-item"
              >
                <span className="feature-check">
                  <CheckIcon />
                </span>

                <span>
                  {feature}
                </span>
              </li>
            )
          )}
        </ul>
      </div>

      {children ? (
        <div className="plan-extra">
          {children}
        </div>
      ) : null}

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="plan-footer">
        <span>
          Worldwide DIPO
        </span>

        <span className="footer-separator">
          •
        </span>

        <span>
          Digital identity
        </span>
      </div>
    </>
  );

  if (
    selectable &&
    !href
  ) {
    return (
      <div
        className={cardClassName}
        style={styleVars}
        role="button"
        tabIndex={
          disabled ? -1 : 0
        }
        aria-disabled={
          disabled
            ? 'true'
            : undefined
        }
        aria-pressed={
          selected
            ? 'true'
            : 'false'
        }
        onClick={handleAction}
        onKeyDown={
          handleKeyDown
        }
        onMouseEnter={() =>
          setHovered(true)
        }
        onMouseLeave={() =>
          setHovered(false)
        }
        onMouseDown={() =>
          setPressed(true)
        }
        onMouseUp={() =>
          setPressed(false)
        }
      >
        {isFeatured ? (
          <div className="featured-line" />
        ) : null}

        <div
          className={`card-inner ${
            hovered
              ? 'card-inner-hover'
              : ''
          } ${
            pressed
              ? 'card-inner-pressed'
              : ''
          }`}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <article
      className={cardClassName}
      style={styleVars}
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
    >
      {isFeatured ? (
        <div className="featured-line" />
      ) : null}

      <div
        className={`card-inner ${
          hovered
            ? 'card-inner-hover'
            : ''
        }`}
      >
        {content}
      </div>
    </article>
  );
}