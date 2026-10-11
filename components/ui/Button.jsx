'use client';

import Link from 'next/link';
import {
  forwardRef,
  useMemo,
} from 'react';

/**
 * Worldwide DIPO
 * ============================================================
 * Reusable production-grade Button
 *
 * Supports:
 * - button / link mode
 * - primary / secondary / outline / ghost / danger / success
 * - loading state
 * - disabled state
 * - left + right icons
 * - full width
 * - multiple sizes
 * - rounded / square modes
 * - keyboard accessibility
 * - focus-visible accessibility
 * - external links
 * - Next.js internal links
 * - native button attributes
 *
 * No external icon library.
 * No styled-jsx.
 * No dependency on any other UI component.
 * ============================================================
 */

const VARIANTS = {
  primary: {
    background:
      '#0b1220',
    color:
      '#ffffff',
    border:
      '#0b1220',
    hoverBackground:
      '#182235',
    hoverBorder:
      '#182235',
    shadow:
      '0 8px 24px rgba(11,18,32,.13)',
  },

  secondary: {
    background:
      '#f1f5f9',
    color:
      '#172033',
    border:
      '#e2e8f0',
    hoverBackground:
      '#e8edf3',
    hoverBorder:
      '#d7dee7',
    shadow:
      'none',
  },

  outline: {
    background:
      '#ffffff',
    color:
      '#172033',
    border:
      '#dbe2e9',
    hoverBackground:
      '#f8fafc',
    hoverBorder:
      '#cbd5e1',
    shadow:
      'none',
  },

  ghost: {
    background:
      'transparent',
    color:
      '#475569',
    border:
      'transparent',
    hoverBackground:
      '#f1f5f9',
    hoverBorder:
      'transparent',
    shadow:
      'none',
  },

  success: {
    background:
      '#059669',
    color:
      '#ffffff',
    border:
      '#059669',
    hoverBackground:
      '#047857',
    hoverBorder:
      '#047857',
    shadow:
      '0 8px 24px rgba(5,150,105,.16)',
  },

  danger: {
    background:
      '#dc2626',
    color:
      '#ffffff',
    border:
      '#dc2626',
    hoverBackground:
      '#b91c1c',
    hoverBorder:
      '#b91c1c',
    shadow:
      '0 8px 24px rgba(220,38,38,.14)',
  },

  dangerOutline: {
    background:
      '#ffffff',
    color:
      '#b91c1c',
    border:
      '#fecaca',
    hoverBackground:
      '#fef2f2',
    hoverBorder:
      '#fca5a5',
    shadow:
      'none',
  },

  white: {
    background:
      '#ffffff',
    color:
      '#0b1220',
    border:
      'rgba(255,255,255,.9)',
    hoverBackground:
      '#f8fafc',
    hoverBorder:
      '#ffffff',
    shadow:
      '0 8px 25px rgba(0,0,0,.08)',
  },

  link: {
    background:
      'transparent',
    color:
      '#059669',
    border:
      'transparent',
    hoverBackground:
      '#ecfdf5',
    hoverBorder:
      'transparent',
    shadow:
      'none',
  },
};


const SIZES = {
  xs: {
    minHeight: 30,
    paddingInline: 10,
    fontSize: 10,
    gap: 6,
    radius: 8,
    icon: 13,
  },

  sm: {
    minHeight: 36,
    paddingInline: 12,
    fontSize: 11,
    gap: 7,
    radius: 9,
    icon: 14,
  },

  md: {
    minHeight: 42,
    paddingInline: 15,
    fontSize: 12,
    gap: 8,
    radius: 11,
    icon: 15,
  },

  lg: {
    minHeight: 48,
    paddingInline: 18,
    fontSize: 13,
    gap: 9,
    radius: 13,
    icon: 16,
  },

  xl: {
    minHeight: 56,
    paddingInline: 22,
    fontSize: 14,
    gap: 10,
    radius: 15,
    icon: 18,
  },
};


const HEIGHT_BY_SIZE = {
  xs: 30,
  sm: 36,
  md: 42,
  lg: 48,
  xl: 56,
};


/**
 * Internal spinner.
 *
 * Dependency-free so Button can be used everywhere.
 */
function Spinner({
  size = 15,
  color = 'currentColor',
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        border:
          `2px solid ${color}35`,
        borderTopColor:
          color,
        display:
          'inline-block',
        animation:
          'dipo-button-spin .72s linear infinite',
        flexShrink: 0,
      }}
    />
  );
}


/**
 * Default arrow icon.
 */
function ArrowIcon({
  direction = 'right',
}) {
  const rotation =
    direction === 'left'
      ? 'rotate(180deg)'
      : direction === 'up'
        ? 'rotate(-90deg)'
        : direction === 'down'
          ? 'rotate(90deg)'
          : 'none';

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{
        transform:
          rotation,
        flexShrink: 0,
      }}
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


/**
 * Forward-compatible loading label.
 */
function getLoadingLabel(
  loadingText,
  children,
) {
  if (
    typeof loadingText ===
    'string' &&
    loadingText.trim()
  ) {
    return loadingText;
  }

  if (
    typeof children ===
    'string' &&
    children.trim()
  ) {
    return 'Loading…';
  }

  return null;
}


/**
 * Determines whether an href is external.
 */
function isExternalUrl(
  href,
) {
  if (
    typeof href !==
    'string'
  ) {
    return false;
  }

  return (
    /^https?:\/\//i.test(
      href,
    ) ||
    href.startsWith(
      '//',
    ) ||
    href.startsWith(
      'mailto:',
    ) ||
    href.startsWith(
      'tel:',
    )
  );
}


/**
 * Production Button.
 */
const Button = forwardRef(
  function Button(
    {
      children,

      /*
       * --------------------------------------------------------
       * Visual
       * --------------------------------------------------------
       */

      variant = 'primary',

      size = 'md',

      fullWidth = false,

      rounded = true,

      /*
       * --------------------------------------------------------
       * State
       * --------------------------------------------------------
       */

      disabled = false,

      loading = false,

      loadingText,

      /*
       * --------------------------------------------------------
       * Icons
       * --------------------------------------------------------
       */

      icon = null,

      iconRight = null,

      arrow = false,

      arrowDirection = 'right',

      /*
       * --------------------------------------------------------
       * Link support
       * --------------------------------------------------------
       */

      href,

      target,

      rel,

      /*
       * --------------------------------------------------------
       * Native button props
       * --------------------------------------------------------
       */

      type = 'button',

      name,

      value,

      form,

      formAction,

      formMethod,

      formEncType,

      formNoValidate,

      formTarget,

      autoFocus = false,

      tabIndex,

      /*
       * --------------------------------------------------------
       * Accessibility
       * --------------------------------------------------------
       */

      'aria-label': ariaLabel,

      'aria-describedby':
        ariaDescribedBy,

      'aria-controls':
        ariaControls,

      'aria-expanded':
        ariaExpanded,

      /*
       * --------------------------------------------------------
       * Styling
       * --------------------------------------------------------
       */

      className = '',

      style,

      /*
       * --------------------------------------------------------
       * Misc
       * --------------------------------------------------------
       */

      id,

      onClick,

      onMouseEnter,

      onMouseLeave,

      onFocus,

      onBlur,

      onKeyDown,

      onKeyUp,

      ...rest
    },
    ref,
  ) {
    const resolvedVariant =
      VARIANTS[variant]
        ? variant
        : 'primary';

    const resolvedSize =
      SIZES[size]
        ? size
        : 'md';

    const colors =
      VARIANTS[
        resolvedVariant
      ];

    const sizing =
      SIZES[
        resolvedSize
      ];

    const isDisabled =
      disabled ||
      loading;

    const external =
      isExternalUrl(
        href,
      );

    const resolvedRel =
      external &&
      target ===
        '_blank'
        ? rel ||
          'noopener noreferrer'
        : rel;

    const resolvedLoadingText =
      getLoadingLabel(
        loadingText,
        children,
      );


    /*
     * ----------------------------------------------------------
     * Dynamic style variables
     * ----------------------------------------------------------
     */

    const buttonStyle =
      useMemo(
        () => ({
          '--dipo-button-bg':
            colors.background,

          '--dipo-button-color':
            colors.color,

          '--dipo-button-border':
            colors.border,

          '--dipo-button-hover-bg':
            colors.hoverBackground,

          '--dipo-button-hover-border':
            colors.hoverBorder,

          '--dipo-button-shadow':
            colors.shadow,

          '--dipo-button-height':
            `${sizing.minHeight}px`,

          '--dipo-button-radius':
            rounded
              ? '999px'
              : `${sizing.radius}px`,

          display:
            'inline-flex',

          alignItems:
            'center',

          justifyContent:
            'center',

          gap:
            sizing.gap,

          minHeight:
            sizing.minHeight,

          padding:
            `0 ${sizing.paddingInline}px`,

          width:
            fullWidth
              ? '100%'
              : 'auto',

          maxWidth:
            '100%',

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

          fontFamily:
            'inherit',

          fontSize:
            sizing.fontSize,

          fontWeight:
            850,

          lineHeight:
            1,

          letterSpacing:
            '-0.01em',

          textDecoration:
            'none',

          whiteSpace:
            'nowrap',

          userSelect:
            'none',

          WebkitUserSelect:
            'none',

          verticalAlign:
            'middle',

          boxSizing:
            'border-box',

          boxShadow:
            colors.shadow,

          cursor:
            isDisabled
              ? 'not-allowed'
              : 'pointer',

          opacity:
            isDisabled
              ? 0.62
              : 1,

          pointerEvents:
            isDisabled
              ? 'none'
              : undefined,

          transition:
            'background 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease, transform 120ms ease',

          ...style,
        }),
        [
          colors,
          sizing,
          rounded,
          fullWidth,
          isDisabled,
          style,
        ],
      );


    /*
     * ----------------------------------------------------------
     * Common class name
     * ----------------------------------------------------------
     */

    const classes = [
      'dipo-button',
      `dipo-button--${resolvedVariant}`,
      `dipo-button--${resolvedSize}`,
      fullWidth
        ? 'dipo-button--full'
        : '',
      rounded
        ? 'dipo-button--rounded'
        : '',
      isDisabled
        ? 'dipo-button--disabled'
        : '',
      loading
        ? 'dipo-button--loading'
        : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');


    /*
     * ----------------------------------------------------------
     * Common content
     * ----------------------------------------------------------
     */

    const content =
      loading
        ? (
          <>
            <Spinner
              size={
                Math.max(
                  sizing.icon -
                    1,
                  12,
                )
              }
              color={
                colors.color
              }
            />

            {resolvedLoadingText && (
              <span
                className="dipo-button__label"
              >
                {
                  resolvedLoadingText
                }
              </span>
            )}
          </>
        )
        : (
          <>
            {icon && (
              <span
                className="dipo-button__icon"
                aria-hidden="true"
              >
                {icon}
              </span>
            )}

            {children !==
              null &&
              children !==
                undefined && (
                <span
                  className="dipo-button__label"
                >
                  {children}
                </span>
              )}

            {arrow ? (
              <span
                className="dipo-button__icon"
                aria-hidden="true"
              >
                <ArrowIcon
                  direction={
                    arrowDirection
                  }
                />
              </span>
            ) : (
              iconRight && (
                <span
                  className="dipo-button__icon"
                  aria-hidden="true"
                >
                  {iconRight}
                </span>
              )
            )}
          </>
        );


    /*
     * ----------------------------------------------------------
     * Shared accessibility props
     * ----------------------------------------------------------
     */

    const accessibilityProps = {
      id,

      className: classes,

      style: buttonStyle,

      'aria-label':
        ariaLabel,

      'aria-describedby':
        ariaDescribedBy,

      'aria-controls':
        ariaControls,

      'aria-expanded':
        ariaExpanded,

      'aria-busy':
        loading
          ? 'true'
          : undefined,

      title:
        isDisabled &&
        loading
          ? resolvedLoadingText ||
            'Loading…'
          : undefined,

      onMouseEnter,

      onMouseLeave,

      onFocus,

      onBlur,

      onKeyDown,

      onKeyUp,

      ...rest,
    };


    /*
     * ==========================================================
     * LINK MODE
     * ==========================================================
     *
     * href exists -> render navigation.
     */

    if (
      typeof href ===
        'string' &&
      href.trim()
    ) {
      /*
       * External URLs use a normal <a>.
       */
      if (external) {
        return (
          <>
            <a
              ref={ref}
              href={
                isDisabled
                  ? undefined
                  : href
              }
              target={
                target
              }
              rel={
                resolvedRel
              }
              aria-disabled={
                isDisabled
                  ? 'true'
                  : undefined
              }
              tabIndex={
                isDisabled
                  ? -1
                  : tabIndex
              }
              {...accessibilityProps}
              onClick={(event) => {
                if (
                  isDisabled
                ) {
                  event.preventDefault();
                  return;
                }

                onClick?.(
                  event,
                );
              }}
            >
              {content}
            </a>

            <style>{BUTTON_STYLES}</style>
          </>
        );
      }


      /*
       * Internal Next.js route.
       */
      return (
        <>
          <Link
            ref={ref}
            href={href}
            target={
              target
            }
            rel={
              resolvedRel
            }
            aria-disabled={
              isDisabled
                ? 'true'
                : undefined
            }
            tabIndex={
              isDisabled
                ? -1
                : tabIndex
            }
            {...accessibilityProps}
            onClick={(event) => {
              if (
                isDisabled
              ) {
                event.preventDefault();
                return;
              }

              onClick?.(
                event,
              );
            }}
          >
            {content}
          </Link>

          <style>{BUTTON_STYLES}</style>
        </>
      );
    }


    /*
     * ==========================================================
     * BUTTON MODE
     * ==========================================================
     */

    return (
      <>
        <button
          ref={ref}
          type={type}
          name={name}
          value={value}
          form={form}
          formAction={
            formAction
          }
          formMethod={
            formMethod
          }
          formEncType={
            formEncType
          }
          formNoValidate={
            formNoValidate
          }
          formTarget={
            formTarget
          }
          autoFocus={
            autoFocus
          }
          tabIndex={
            tabIndex
          }
          disabled={
            isDisabled
          }
          {...accessibilityProps}
          onClick={(event) => {
            if (
              isDisabled
            ) {
              event.preventDefault();
              return;
            }

            onClick?.(
              event,
            );
          }}
        >
          {content}
        </button>

        <style>{BUTTON_STYLES}</style>
      </>
    );
  },
);


Button.displayName =
  'Button';


/*
 * ============================================================
 * SHARED BUTTON CSS
 * ============================================================
 *
 * Kept inside the component file so the empty UI file remains
 * completely self-contained.
 * ============================================================
 */

const BUTTON_STYLES = `
  @keyframes dipo-button-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .dipo-button {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    overflow: hidden;
  }

  .dipo-button::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,.07),
      transparent 55%
    );
    opacity: 0;
    transition: opacity 150ms ease;
  }

  .dipo-button:hover:not(
    .dipo-button--disabled
  ) {
    background: var(
      --dipo-button-hover-bg
    ) !important;

    border-color: var(
      --dipo-button-hover-border
    ) !important;

    box-shadow:
      var(
        --dipo-button-shadow
      );

    transform:
      translateY(-1px);
  }

  .dipo-button:hover:not(
    .dipo-button--disabled
  )::after {
    opacity: 1;
  }

  .dipo-button:active:not(
    .dipo-button--disabled
  ) {
    transform:
      translateY(0)
      scale(.985);
  }

  .dipo-button:focus-visible {
    outline:
      3px solid
      rgba(5,150,105,.22);

    outline-offset:
      3px;
  }

  .dipo-button:disabled,
  .dipo-button[aria-disabled="true"] {
    transform: none !important;
    box-shadow: none;
  }

  .dipo-button--loading {
    cursor: wait !important;
  }

  .dipo-button__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dipo-button__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    line-height: 0;
  }

  .dipo-button--full {
    display: flex;
    width: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    .dipo-button,
    .dipo-button::after {
      transition:
        none !important;
      animation:
        none !important;
    }
  }
`;


/*
 * ============================================================
 * EXPORTS
 * ============================================================
 */

export {
  VARIANTS,
  SIZES,
};

export default Button;