'use client';

import {
  forwardRef,
  useMemo,
} from 'react';

/**
 * Worldwide DIPO
 * ============================================================
 * Production-grade ErrorState
 *
 * Designed for:
 * - API failures
 * - Failed dashboard requests
 * - Profile loading errors
 * - Admin errors
 * - Permission errors
 * - Network errors
 * - Retry actions
 *
 * Features:
 * - Premium responsive UI
 * - Error / warning / offline variants
 * - Retry action
 * - Secondary action
 * - Custom icon
 * - Compact / default / large sizes
 * - Left / center alignment
 * - Accessible status semantics
 * - Reduced motion
 * - No external dependencies
 * ============================================================
 */


/* ============================================================
   ICONS
   ============================================================ */

function AlertIcon({
  size = 26,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 4 21 19H3L12 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="16.5"
        r=".9"
        fill="currentColor"
      />
    </svg>
  );
}


function RefreshIcon({
  size = 20,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 11a8 8 0 0 0-14.8-4L3 10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M3 5v5h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 13a8 8 0 0 0 14.8 4L21 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M21 19v-5h-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function WifiOffIcon({
  size = 26,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m3 3 18 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M6.5 9.2A12.5 12.5 0 0 1 12 8c2 0 3.9.5 5.5 1.4M9.2 13.1c.85-.45 1.8-.7 2.8-.7 1 0 1.95.25 2.8.7M11 17.1c.3-.1.65-.15 1-.15s.7.05 1 .15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function LockIcon({
  size = 26,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="15"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}


function ServerIcon({
  size = 26,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <rect
        x="4"
        y="14"
        width="16"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 7h.01M8 17h.01"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <path
        d="M11 7h5M11 17h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}


function ArrowIcon({
  size = 16,
}) {
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


const VARIANT_ICONS = {
  error: AlertIcon,
  warning: AlertIcon,
  offline: WifiOffIcon,
  permission: LockIcon,
  server: ServerIcon,
};


/* ============================================================
   ERROR STATE
   ============================================================ */

const ErrorState = forwardRef(
  function ErrorState(
    {
      /* ------------------------------------------------------
         Content
         ------------------------------------------------------ */

      title = 'Something went wrong',

      description =
        'We could not complete this request. Please try again.',

      eyebrow,

      code,

      /* ------------------------------------------------------
         Variant
         ------------------------------------------------------ */

      variant = 'error',

      /* ------------------------------------------------------
         Icon
         ------------------------------------------------------ */

      icon,

      iconSize = 26,

      /* ------------------------------------------------------
         Actions
         ------------------------------------------------------ */

      retry,

      action,

      secondaryAction,

      /* ------------------------------------------------------
         Layout
         ------------------------------------------------------ */

      size = 'md',

      align = 'center',

      fullWidth = true,

      minHeight,

      /* ------------------------------------------------------
         Styling
         ------------------------------------------------------ */

      className = '',

      style,

      /* ------------------------------------------------------
         Accessibility
         ------------------------------------------------------ */

      role = 'alert',

      'aria-live':
        ariaLive = 'assertive',

      /* ------------------------------------------------------
         DOM
         ------------------------------------------------------ */

      as: Component = 'section',

      ...rest
    },
    ref,
  ) {
    const resolvedVariant =
      [
        'error',
        'warning',
        'offline',
        'permission',
        'server',
      ].includes(
        variant,
      )
        ? variant
        : 'error';


    const resolvedIcon =
      typeof icon ===
      'function'
        ? icon({
            size:
              iconSize,
          })
        : icon;


    const IconComponent =
      VARIANT_ICONS[
        resolvedVariant
      ] || AlertIcon;


    const sizes = {
      sm: {
        padding:
          '28px 18px',
        iconBox:
          50,
        title:
          15,
        description:
          11,
      },

      md: {
        padding:
          '46px 22px',
        iconBox:
          60,
        title:
          18,
        description:
          12,
      },

      lg: {
        padding:
          '68px 28px',
        iconBox:
          72,
        title:
          21,
        description:
          13,
      },
    };


    const resolvedSize =
      sizes[size] ||
      sizes.md;


    const rootStyle =
      useMemo(
        () => ({
          '--dipo-error-padding':
            resolvedSize.padding,

          '--dipo-error-icon-size':
            `${resolvedSize.iconBox}px`,

          '--dipo-error-title-size':
            `${resolvedSize.title}px`,

          '--dipo-error-description-size':
            `${resolvedSize.description}px`,

          minHeight:
            minHeight
              ? (
                  typeof minHeight ===
                  'number'
                    ? `${minHeight}px`
                    : minHeight
                )
              : undefined,

          width:
            fullWidth
              ? '100%'
              : undefined,

          ...style,
        }),
        [
          resolvedSize,
          minHeight,
          fullWidth,
          style,
        ],
      );


    const classes = [
      'dipo-error-state',
      `dipo-error-state--${resolvedVariant}`,
      `dipo-error-state--${size}`,
      `dipo-error-state--${align}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');


    const renderAction =
      (
        item,
        primary = true,
      ) => {
        if (
          !item
        ) {
          return null;
        }


        if (
          typeof item ===
          'function'
        ) {
          return item();
        }


        const {
          label,
          children,
          onClick,
          href,
          disabled,
          loading,
          icon: actionIcon,
          arrow,
          type = 'button',
          target,
          rel,
          ...props
        } = item;


        const content =
          children ??
          label;


        const actionClass =
          primary
            ? 'dipo-error-state__primary'
            : 'dipo-error-state__secondary';


        if (
          href
        ) {
          return (
            <a
              href={
                disabled
                  ? undefined
                  : href
              }
              className={[
                actionClass,
                disabled
                  ? 'dipo-error-state__disabled'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              target={
                target
              }
              rel={
                rel ||
                (
                  target ===
                  '_blank'
                    ? 'noopener noreferrer'
                    : undefined
                )
              }
              aria-disabled={
                disabled
                  ? 'true'
                  : undefined
              }
              onClick={(event) => {
                if (
                  disabled ||
                  loading
                ) {
                  event.preventDefault();
                  return;
                }

                onClick?.(
                  event,
                );
              }}
              {...props}
            >
              {loading && (
                <span
                  className="dipo-error-state__spinner"
                  aria-hidden="true"
                />
              )}

              {!loading &&
                actionIcon && (
                  <span
                    className="dipo-error-state__action-icon"
                    aria-hidden="true"
                  >
                    {actionIcon}
                  </span>
                )}

              <span>
                {content}
              </span>

              {arrow && (
                <ArrowIcon />
              )}
            </a>
          );
        }


        return (
          <button
            type={
              type
            }
            className={[
              actionClass,
              disabled
                ? 'dipo-error-state__disabled'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={
              disabled ||
              loading
            }
            onClick={
              onClick
            }
            {...props}
          >
            {loading && (
              <span
                className="dipo-error-state__spinner"
                aria-hidden="true"
              />
            )}

            {!loading &&
              actionIcon && (
                <span
                  className="dipo-error-state__action-icon"
                  aria-hidden="true"
                >
                  {actionIcon}
                </span>
              )}

            <span>
              {content}
            </span>

            {arrow && (
              <ArrowIcon />
            )}
          </button>
        );
      };


    return (
      <>
        <Component
          ref={ref}
          className={
            classes
          }
          style={
            rootStyle
          }
          role={
            role
          }
          aria-live={
            ariaLive
          }
          {...rest}
        >
          <div className="dipo-error-state__inner">
            <div
              className="dipo-error-state__icon"
              aria-hidden="true"
            >
              {resolvedIcon ||
                (
                  <IconComponent
                    size={
                      iconSize
                    }
                  />
                )}
            </div>


            {eyebrow && (
              <div className="dipo-error-state__eyebrow">
                {eyebrow}
              </div>
            )}


            {code && (
              <div className="dipo-error-state__code">
                {code}
              </div>
            )}


            <h2 className="dipo-error-state__title">
              {title}
            </h2>


            {description && (
              <p className="dipo-error-state__description">
                {description}
              </p>
            )}


            {(retry ||
              action ||
              secondaryAction) && (
              <div className="dipo-error-state__actions">
                {retry &&
                  renderAction(
                    {
                      label:
                        retry.label ||
                        'Try Again',

                      onClick:
                        retry.onClick,

                      loading:
                        retry.loading,

                      disabled:
                        retry.disabled,

                      icon:
                        retry.icon ||
                        <RefreshIcon
                          size={15}
                        />,
                    },
                    true,
                  )}

                {action &&
                  renderAction(
                    action,
                    true,
                  )}

                {secondaryAction &&
                  renderAction(
                    secondaryAction,
                    false,
                  )}
              </div>
            )}
          </div>
        </Component>


        <style>
          {ERROR_STATE_STYLES}
        </style>
      </>
    );
  },
);


ErrorState.displayName =
  'ErrorState';


/* ============================================================
   PRESET COMPONENTS
   ============================================================ */

function NetworkError(
  props,
) {
  return (
    <ErrorState
      variant="offline"
      title="You're offline"
      description="Check your internet connection and try again."
      retry={{
        label:
          'Retry',
        onClick:
          props.onRetry,
      }}
      {...props}
    />
  );
}


function PermissionError(
  props,
) {
  return (
    <ErrorState
      variant="permission"
      title="Access restricted"
      description="You do not have permission to view or perform this action."
      {...props}
    />
  );
}


function ServerError(
  props,
) {
  return (
    <ErrorState
      variant="server"
      title="Service temporarily unavailable"
      description="Something went wrong on our side. Please try again in a moment."
      retry={{
        label:
          'Try Again',
        onClick:
          props.onRetry,
      }}
      {...props}
    />
  );
}


/* ============================================================
   STYLES
   ============================================================ */

const ERROR_STATE_STYLES = `
  .dipo-error-state {
    position:
      relative;

    box-sizing:
      border-box;

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    padding:
      var(--dipo-error-padding);

    overflow:
      hidden;

    color:
      #0f172a;
  }


  .dipo-error-state__inner {
    position:
      relative;

    z-index:
      1;

    width:
      100%;

    max-width:
      620px;

    display:
      flex;

    flex-direction:
      column;

    align-items:
      center;

    text-align:
      center;
  }


  .dipo-error-state--left
  .dipo-error-state__inner {
    align-items:
      flex-start;

    text-align:
      left;

    margin-right:
      auto;
  }


  .dipo-error-state__icon {
    width:
      var(--dipo-error-icon-size);

    height:
      var(--dipo-error-icon-size);

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    margin-bottom:
      15px;

    border:
      1px solid
      #fecaca;

    border-radius:
      18px;

    background:
      #fff7f7;

    color:
      #dc2626;

    box-shadow:
      0 9px 28px
      rgba(220,38,38,.08);

    animation:
      dipo-error-float
      3.5s ease-in-out infinite;
  }


  .dipo-error-state--warning
  .dipo-error-state__icon {
    border-color:
      #fde68a;

    background:
      #fffbeb;

    color:
      #d97706;

    box-shadow:
      0 9px 28px
      rgba(217,119,6,.08);
  }


  .dipo-error-state--offline
  .dipo-error-state__icon {
    border-color:
      #dbeafe;

    background:
      #eff6ff;

    color:
      #2563eb;

    box-shadow:
      0 9px 28px
      rgba(37,99,235,.08);
  }


  .dipo-error-state--permission
  .dipo-error-state__icon {
    border-color:
      #e2e8f0;

    background:
      #f8fafc;

    color:
      #475569;

    box-shadow:
      0 9px 28px
      rgba(71,85,105,.07);
  }


  .dipo-error-state--server
  .dipo-error-state__icon {
    border-color:
      #d1fae5;

    background:
      #ecfdf5;

    color:
      #059669;

    box-shadow:
      0 9px 28px
      rgba(5,150,105,.08);
  }


  .dipo-error-state__eyebrow {
    margin-bottom:
      7px;

    color:
      #64748b;

    font-size:
      9px;

    line-height:
      1.2;

    font-weight:
      850;

    letter-spacing:
      .12em;

    text-transform:
      uppercase;
  }


  .dipo-error-state__code {
    display:
      inline-flex;

    align-items:
      center;

    min-height:
      24px;

    margin-bottom:
      8px;

    padding:
      0 9px;

    border:
      1px solid
      #e2e8f0;

    border-radius:
      7px;

    background:
      #f8fafc;

    color:
      #64748b;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size:
      9px;

    font-weight:
      700;

    letter-spacing:
      .03em;
  }


  .dipo-error-state__title {
    margin:
      0;

    color:
      #0f172a;

    font-size:
      var(--dipo-error-title-size);

    line-height:
      1.25;

    font-weight:
      850;

    letter-spacing:
      -.025em;
  }


  .dipo-error-state__description {
    max-width:
      56ch;

    margin:
      8px 0 0;

    color:
      #64748b;

    font-size:
      var(--dipo-error-description-size);

    line-height:
      1.65;

    font-weight:
      500;
  }


  .dipo-error-state__actions {
    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      8px;

    flex-wrap:
      wrap;

    margin-top:
      20px;
  }


  .dipo-error-state--left
  .dipo-error-state__actions {
    justify-content:
      flex-start;
  }


  .dipo-error-state__primary,
  .dipo-error-state__secondary {
    min-height:
      40px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      8px;

    padding:
      0 14px;

    border-radius:
      999px;

    font-family:
      inherit;

    font-size:
      11px;

    line-height:
      1;

    font-weight:
      850;

    text-decoration:
      none;

    white-space:
      nowrap;

    box-sizing:
      border-box;

    cursor:
      pointer;

    transition:
      transform 130ms ease,
      background 150ms ease,
      border-color 150ms ease,
      box-shadow 150ms ease;
  }


  .dipo-error-state__primary {
    border:
      1px solid
      #0b1220;

    background:
      #0b1220;

    color:
      #ffffff;

    box-shadow:
      0 7px 20px
      rgba(11,18,32,.11);
  }


  .dipo-error-state__primary:hover {
    background:
      #182235;

    border-color:
      #182235;

    transform:
      translateY(-1px);

    box-shadow:
      0 10px 25px
      rgba(11,18,32,.15);
  }


  .dipo-error-state__secondary {
    border:
      1px solid
      #dbe3ea;

    background:
      #ffffff;

    color:
      #475569;
  }


  .dipo-error-state__secondary:hover {
    background:
      #f8fafc;

    border-color:
      #cbd5e1;

    color:
      #0f172a;

    transform:
      translateY(-1px);
  }


  .dipo-error-state__primary:focus-visible,
  .dipo-error-state__secondary:focus-visible {
    outline:
      3px solid
      rgba(5,150,105,.18);

    outline-offset:
      3px;
  }


  .dipo-error-state__primary:active,
  .dipo-error-state__secondary:active {
    transform:
      scale(.985);
  }


  .dipo-error-state__disabled {
    opacity:
      .55;

    pointer-events:
      none;
  }


  .dipo-error-state__action-icon {
    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    line-height:
      0;
  }


  .dipo-error-state__spinner {
    width:
      14px;

    height:
      14px;

    border:
      2px solid
      rgba(255,255,255,.30);

    border-top-color:
      currentColor;

    border-radius:
      50%;

    animation:
      dipo-error-spin
      .7s linear infinite;
  }


  .dipo-error-state__secondary
  .dipo-error-state__spinner {
    border-color:
      rgba(71,85,105,.18);

    border-top-color:
      #475569;
  }


  @keyframes dipo-error-spin {
    to {
      transform:
        rotate(360deg);
    }
  }


  @keyframes dipo-error-float {
    0%,
    100% {
      transform:
        translateY(0);
    }

    50% {
      transform:
        translateY(-3px);
    }
  }


  @media (max-width: 640px) {
    .dipo-error-state {
      padding:
        34px 16px;
    }


    .dipo-error-state__actions {
      width:
        100%;
    }


    .dipo-error-state__primary,
    .dipo-error-state__secondary {
      min-height:
        42px;

      padding-inline:
        15px;
    }
  }


  @media (prefers-reduced-motion: reduce) {
    .dipo-error-state__icon,
    .dipo-error-state__spinner,
    .dipo-error-state__primary,
    .dipo-error-state__secondary {
      animation:
        none !important;

      transition:
        none !important;
    }
  }
`;


/* ============================================================
   EXPORTS
   ============================================================ */

export {
  NetworkError,
  PermissionError,
  ServerError,
  VARIANT_ICONS,
};

export default ErrorState;