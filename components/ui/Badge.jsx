'use client';

import React from 'react';

/**
 * Worldwide DIPO
 * ------------------------------------------------------------
 * Reusable Badge / Status Pill
 *
 * Designed for:
 * - Admin dashboard
 * - Payment status
 * - Profile status
 * - Verification state
 * - Plan labels
 * - Small metadata indicators
 *
 * No external icon dependency.
 * No styled-jsx.
 * Safe to use anywhere in the application.
 * ------------------------------------------------------------
 */

const VARIANTS = {
  default: {
    background: '#f1f5f9',
    color: '#334155',
    border: '#e2e8f0',
    dot: '#64748b',
  },

  neutral: {
    background: '#f8fafc',
    color: '#475569',
    border: '#e2e8f0',
    dot: '#94a3b8',
  },

  success: {
    background: '#ecfdf5',
    color: '#047857',
    border: '#bbf7d0',
    dot: '#10b981',
  },

  active: {
    background: '#ecfdf5',
    color: '#047857',
    border: '#bbf7d0',
    dot: '#10b981',
  },

  verified: {
    background: '#effdf5',
    color: '#047857',
    border: '#a7f3d0',
    dot: '#059669',
  },

  pending: {
    background: '#fffbeb',
    color: '#b45309',
    border: '#fde68a',
    dot: '#f59e0b',
  },

  warning: {
    background: '#fffbeb',
    color: '#a16207',
    border: '#fde68a',
    dot: '#eab308',
  },

  danger: {
    background: '#fef2f2',
    color: '#b91c1c',
    border: '#fecaca',
    dot: '#ef4444',
  },

  error: {
    background: '#fef2f2',
    color: '#b91c1c',
    border: '#fecaca',
    dot: '#ef4444',
  },

  rejected: {
    background: '#fef2f2',
    color: '#b91c1c',
    border: '#fecaca',
    dot: '#ef4444',
  },

  info: {
    background: '#eff6ff',
    color: '#1d4ed8',
    border: '#bfdbfe',
    dot: '#3b82f6',
  },

  premium: {
    background: '#f5f3ff',
    color: '#6d28d9',
    border: '#ddd6fe',
    dot: '#8b5cf6',
  },

  purple: {
    background: '#faf5ff',
    color: '#7e22ce',
    border: '#e9d5ff',
    dot: '#a855f7',
  },

  dark: {
    background: '#0f172a',
    color: '#ffffff',
    border: '#1e293b',
    dot: '#34d399',
  },

  outline: {
    background: 'transparent',
    color: '#475569',
    border: '#cbd5e1',
    dot: '#64748b',
  },
};

const SIZES = {
  xs: {
    minHeight: 20,
    paddingInline: 7,
    fontSize: 9,
    gap: 4,
    radius: 6,
    dot: 4,
  },

  sm: {
    minHeight: 24,
    paddingInline: 8,
    fontSize: 10,
    gap: 5,
    radius: 7,
    dot: 5,
  },

  md: {
    minHeight: 28,
    paddingInline: 10,
    fontSize: 11,
    gap: 6,
    radius: 8,
    dot: 6,
  },

  lg: {
    minHeight: 32,
    paddingInline: 12,
    fontSize: 12,
    gap: 7,
    radius: 9,
    dot: 6,
  },
};

const STATUS_VARIANTS = {
  active: 'active',
  approved: 'success',
  success: 'success',
  completed: 'success',
  paid: 'success',
  verified: 'verified',

  pending: 'pending',
  processing: 'pending',
  reviewing: 'pending',

  rejected: 'rejected',
  failed: 'danger',
  error: 'danger',
  cancelled: 'danger',
  canceled: 'danger',
  expired: 'danger',

  warning: 'warning',
  draft: 'neutral',
  inactive: 'neutral',
  disabled: 'neutral',

  premium: 'premium',
  pro: 'premium',

  info: 'info',
  new: 'info',
};


/**
 * Convert a status string into a safe visual variant.
 *
 * Example:
 *   getStatusVariant('pending') -> 'pending'
 *   getStatusVariant('PAID')    -> 'success'
 */
function getStatusVariant(status) {
  if (
    typeof status !== 'string'
  ) {
    return 'default';
  }

  const normalized =
    status
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');

  return (
    STATUS_VARIANTS[
      normalized
    ] || 'default'
  );
}


/**
 * Human-friendly status label.
 *
 * pending_payment -> Pending Payment
 * super_admin     -> Super Admin
 */
function formatLabel(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  if (
    typeof value !== 'string'
  ) {
    return String(value);
  }

  return value
    .replace(/[_-]+/g, ' ')
    .replace(
      /\s+/g,
      ' ',
    )
    .trim()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}


/**
 * Small status indicator.
 */
function StatusDot({
  color,
  size,
  pulse = false,
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        position: 'relative',
        flexShrink: 0,
        boxShadow: pulse
          ? `0 0 0 3px ${color}20`
          : 'none',
      }}
    />
  );
}


/**
 * Optional check mark.
 *
 * Kept inline so Badge remains dependency-free.
 */
function CheckMark({
  size,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{
        flexShrink: 0,
      }}
    >
      <path
        d="M3.25 8.25 6.4 11.2 12.75 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


/**
 * Optional close / remove icon.
 */
function CloseMark({
  size,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{
        flexShrink: 0,
      }}
    >
      <path
        d="m4.25 4.25 7.5 7.5M11.75 4.25l-7.5 7.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


/**
 * Main Badge component.
 *
 * Supported:
 *
 * <Badge>Active</Badge>
 *
 * <Badge variant="success">
 *   Paid
 * </Badge>
 *
 * <Badge status="pending" />
 *
 * <Badge
 *   variant="verified"
 *   dot
 * >
 *   Verified
 * </Badge>
 *
 * <Badge
 *   variant="success"
 *   icon={<CheckMark />}
 * >
 *   Approved
 * </Badge>
 */
export default function Badge({
  children,

  /*
   * Visual variant.
   */
  variant = 'default',

  /*
   * Convenience status API.
   * If supplied, it automatically determines the variant.
   */
  status,

  /*
   * Label can be used instead of children.
   */
  label,

  /*
   * Optional leading icon.
   */
  icon = null,

  /*
   * Display a status dot.
   */
  dot = false,

  /*
   * Animated status dot.
   */
  pulse = false,

  /*
   * Automatically render a check mark for verified/success.
   */
  verified = false,

  /*
   * Makes the badge removable.
   */
  removable = false,

  /*
   * Called when remove button is pressed.
   */
  onRemove,

  /*
   * Badge size.
   */
  size = 'md',

  /*
   * Pill shape.
   */
  rounded = true,

  /*
   * Whether text should stay on one line.
   */
  nowrap = true,

  /*
   * Native title.
   */
  title,

  /*
   * Accessible label.
   */
  'aria-label': ariaLabel,

  /*
   * Optional custom className.
   */
  className = '',

  /*
   * Optional inline styles.
   */
  style,

  /*
   * Optional HTML id.
   */
  id,

  /*
   * Optional data attributes / DOM props.
   */
  ...rest
}) {
  /*
   * ----------------------------------------------------------
   * Resolve variant
   * ----------------------------------------------------------
   */

  const resolvedVariant =
    status
      ? getStatusVariant(
          status,
        )
      : VARIANTS[variant]
        ? variant
        : 'default';

  const colors =
    VARIANTS[
      resolvedVariant
    ];

  const sizing =
    SIZES[size] ||
    SIZES.md;

  /*
   * ----------------------------------------------------------
   * Resolve label
   * ----------------------------------------------------------
   */

  const resolvedChildren =
    children !==
      undefined &&
    children !== null
      ? children
      : label !==
          undefined &&
        label !== null
        ? label
        : status
          ? formatLabel(
              status,
            )
          : null;

  /*
   * ----------------------------------------------------------
   * Resolve icon
   * ----------------------------------------------------------
   */

  const showVerifiedIcon =
    verified &&
    !icon &&
    !dot;

  /*
   * ----------------------------------------------------------
   * Build styles
   * ----------------------------------------------------------
   */

  const badgeStyle = {
    '--dipo-badge-bg':
      colors.background,

    '--dipo-badge-color':
      colors.color,

    '--dipo-badge-border':
      colors.border,

    '--dipo-badge-dot':
      colors.dot,

    display: 'inline-flex',

    alignItems: 'center',

    justifyContent:
      'center',

    verticalAlign: 'middle',

    minHeight:
      sizing.minHeight,

    paddingLeft:
      sizing.paddingInline,

    paddingRight:
      sizing.paddingInline,

    gap: sizing.gap,

    border:
      `1px solid ${colors.border}`,

    borderRadius:
      rounded
        ? '999px'
        : `${sizing.radius}px`,

    background:
      colors.background,

    color:
      colors.color,

    fontSize:
      sizing.fontSize,

    fontWeight: 800,

    lineHeight: 1,

    letterSpacing:
      '-0.01em',

    whiteSpace:
      nowrap
        ? 'nowrap'
        : 'normal',

    textDecoration:
      'none',

    userSelect:
      'none',

    boxSizing:
      'border-box',

    ...style,
  };

  /*
   * ----------------------------------------------------------
   * Class composition
   * ----------------------------------------------------------
   */

  const classes = [
    'dipo-badge',
    `dipo-badge--${resolvedVariant}`,
    `dipo-badge--${size}`,
    rounded
      ? 'dipo-badge--rounded'
      : '',
    removable
      ? 'dipo-badge--removable'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');


  /*
   * ----------------------------------------------------------
   * Remove handler
   * ----------------------------------------------------------
   *
   * If no onRemove callback exists, the button is not rendered.
   * This avoids presenting a fake interactive control.
   */
  const handleRemove =
    typeof onRemove ===
    'function'
      ? (event) => {
          event.preventDefault();
          event.stopPropagation();

          onRemove(event);
        }
      : null;


  return (
    <span
      id={id}
      className={classes}
      style={badgeStyle}
      title={
        title ||
        (typeof status ===
          'string'
          ? formatLabel(
              status,
            )
          : undefined)
      }
      aria-label={
        ariaLabel ||
        undefined
      }
      {...rest}
    >
      {/*
       * ------------------------------------------------------
       * LEADING STATUS DOT
       * ------------------------------------------------------
       */}

      {dot && (
        <StatusDot
          color={
            colors.dot
          }
          size={
            sizing.dot
          }
          pulse={pulse}
        />
      )}


      {/*
       * ------------------------------------------------------
       * CUSTOM ICON
       * ------------------------------------------------------
       */}

      {!dot &&
        icon && (
          <span
            aria-hidden="true"
            style={{
              display:
                'inline-flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </span>
        )}


      {/*
       * ------------------------------------------------------
       * VERIFIED CHECK
       * ------------------------------------------------------
       */}

      {showVerifiedIcon && (
        <span
          aria-hidden="true"
          style={{
            display:
              'inline-flex',
            alignItems:
              'center',
            justifyContent:
              'center',
            flexShrink: 0,
          }}
        >
          <CheckMark
            size={
              Math.max(
                sizing.fontSize +
                  1,
                10,
              )
            }
          />
        </span>
      )}


      {/*
       * ------------------------------------------------------
       * LABEL
       * ------------------------------------------------------
       */}

      {resolvedChildren !==
        null &&
        resolvedChildren !==
          undefined && (
          <span
            style={{
              display:
                'inline-block',
              minWidth: 0,
              overflow:
                'hidden',
              textOverflow:
                nowrap
                  ? 'ellipsis'
                  : 'clip',
            }}
          >
            {resolvedChildren}
          </span>
        )}


      {/*
       * ------------------------------------------------------
       * REMOVE BUTTON
       * ------------------------------------------------------
       */}

      {removable &&
        handleRemove && (
          <button
            type="button"
            aria-label="Remove"
            title="Remove"
            onClick={
              handleRemove
            }
            style={{
              width:
                Math.max(
                  sizing.fontSize +
                    5,
                  14,
                ),

              height:
                Math.max(
                  sizing.fontSize +
                    5,
                  14,
                ),

              display:
                'inline-flex',

              alignItems:
                'center',

              justifyContent:
                'center',

              padding: 0,

              marginLeft: 1,

              border: 0,

              borderRadius:
                '50%',

              background:
                'transparent',

              color:
                'currentColor',

              cursor:
                'pointer',

              opacity: 0.72,

              flexShrink: 0,
            }}
          >
            <CloseMark
              size={
                Math.max(
                  sizing.fontSize,
                  9,
                )
              }
            />
          </button>
        )}
    </span>
  );
}


/*
 * ============================================================
 * STATIC HELPERS
 * ============================================================
 *
 * Exported for other UI components that need the same status
 * mapping without duplicating logic.
 * ============================================================
 */

export {
  VARIANTS,
  SIZES,
  STATUS_VARIANTS,
  getStatusVariant,
  formatLabel,
};