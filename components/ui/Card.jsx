'use client';

import Link from 'next/link';
import {
  forwardRef,
  useMemo,
} from 'react';

/**
 * Worldwide DIPO
 * ============================================================
 * Reusable Premium Card System
 *
 * Supports:
 * - Card
 * - CardHeader
 * - CardBody
 * - CardFooter
 * - CardTitle
 * - CardDescription
 * - CardMedia
 * - CardAction
 *
 * Features:
 * - premium responsive styling
 * - clickable cards
 * - internal Next.js links
 * - external links
 * - hover / lift interaction
 * - selectable mode
 * - loading state
 * - bordered / elevated / flat variants
 * - compact / normal / spacious padding
 * - semantic HTML
 * - keyboard accessibility
 * - reduced-motion support
 *
 * No external dependencies except Next.js Link.
 * No styled-jsx.
 * ============================================================
 */

const VARIANTS = {
  default: {
    background: '#ffffff',
    border: '#e7ebef',
    shadow:
      '0 1px 2px rgba(15,23,42,.03), 0 10px 30px rgba(15,23,42,.035)',
    hoverShadow:
      '0 12px 35px rgba(15,23,42,.08)',
  },

  elevated: {
    background: '#ffffff',
    border: '#edf0f3',
    shadow:
      '0 10px 35px rgba(15,23,42,.07)',
    hoverShadow:
      '0 18px 50px rgba(15,23,42,.11)',
  },

  flat: {
    background: '#f8fafc',
    border: '#eef2f5',
    shadow: 'none',
    hoverShadow:
      '0 8px 24px rgba(15,23,42,.05)',
  },

  soft: {
    background: '#f7faf9',
    border: '#e3eee9',
    shadow: 'none',
    hoverShadow:
      '0 10px 30px rgba(5,150,105,.08)',
  },

  dark: {
    background: '#0b1220',
    border: '#1c2738',
    shadow:
      '0 14px 45px rgba(2,6,23,.16)',
    hoverShadow:
      '0 20px 55px rgba(2,6,23,.23)',
  },

  success: {
    background: '#f0fdf8',
    border: '#d1fae5',
    shadow: 'none',
    hoverShadow:
      '0 12px 30px rgba(5,150,105,.09)',
  },

  danger: {
    background: '#fffafa',
    border: '#fee2e2',
    shadow: 'none',
    hoverShadow:
      '0 12px 30px rgba(220,38,38,.08)',
  },
};


const PADDINGS = {
  none: {
    padding: 0,
  },

  sm: {
    padding: 14,
  },

  md: {
    padding: 20,
  },

  lg: {
    padding: 28,
  },

  xl: {
    padding: 36,
  },
};


/**
 * Determine whether a URL is external.
 */
function isExternalUrl(href) {
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
 * Loading placeholder.
 */
function CardLoader() {
  return (
    <div
      aria-hidden="true"
      className="dipo-card__loader"
    >
      <span />
      <span />
      <span />
    </div>
  );
}


/**
 * Main Card.
 */
const Card = forwardRef(
  function Card(
    {
      children,

      variant = 'default',

      padding = 'md',

      radius = 'lg',

      href,

      target,

      rel,

      external,

      clickable = false,

      hover = false,

      selected = false,

      disabled = false,

      loading = false,

      fullWidth = false,

      overflow = 'hidden',

      as = 'div',

      className = '',

      style,

      id,

      onClick,

      onMouseEnter,

      onMouseLeave,

      onFocus,

      onBlur,

      onKeyDown,

      role,

      tabIndex,

      'aria-label':
        ariaLabel,

      'aria-current':
        ariaCurrent,

      'aria-selected':
        ariaSelected,

      'aria-disabled':
        ariaDisabled,

      ...rest
    },
    ref,
  ) {
    const resolvedVariant =
      VARIANTS[variant]
        ? variant
        : 'default';

    const resolvedPadding =
      PADDINGS[padding]
        ? padding
        : 'md';

    const colors =
      VARIANTS[
        resolvedVariant
      ];

    const spacing =
      PADDINGS[
        resolvedPadding
      ];

    const isLink =
      typeof href ===
        'string' &&
      href.trim();

    const isExternal =
      external !==
      undefined
        ? Boolean(external)
        : isExternalUrl(
            href,
          );

    const interactive =
      !disabled &&
      (
        clickable ||
        hover ||
        Boolean(isLink)
      );

    const radiusMap = {
      none: 0,
      sm: 10,
      md: 14,
      lg: 18,
      xl: 24,
      '2xl': 30,
      full: 999,
    };

    const borderRadius =
      radiusMap[radius] ??
      radiusMap.lg;


    const cardStyle =
      useMemo(
        () => ({
          '--dipo-card-bg':
            colors.background,

          '--dipo-card-border':
            colors.border,

          '--dipo-card-shadow':
            colors.shadow,

          '--dipo-card-hover-shadow':
            colors.hoverShadow,

          '--dipo-card-radius':
            `${borderRadius}px`,

          '--dipo-card-padding':
            `${spacing.padding}px`,

          width:
            fullWidth
              ? '100%'
              : undefined,

          background:
            colors.background,

          border:
            `1px solid ${colors.border}`,

          borderRadius:
            `${borderRadius}px`,

          boxShadow:
            colors.shadow,

          padding:
            spacing.padding,

          overflow,

          position:
            'relative',

          boxSizing:
            'border-box',

          color:
            resolvedVariant ===
            'dark'
              ? '#ffffff'
              : '#0f172a',

          textDecoration:
            'none',

          cursor:
            disabled
              ? 'not-allowed'
              : interactive
                ? 'pointer'
                : undefined,

          opacity:
            disabled
              ? 0.62
              : 1,

          pointerEvents:
            disabled
              ? 'none'
              : undefined,

          transition:
            interactive
              ? 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease'
              : undefined,

          ...style,
        }),
        [
          colors,
          borderRadius,
          spacing,
          fullWidth,
          overflow,
          resolvedVariant,
          disabled,
          interactive,
          style,
        ],
      );


    const classes = [
      'dipo-card',

      `dipo-card--${resolvedVariant}`,

      `dipo-card--padding-${resolvedPadding}`,

      `dipo-card--radius-${radius}`,

      interactive
        ? 'dipo-card--interactive'
        : '',

      selected
        ? 'dipo-card--selected'
        : '',

      disabled
        ? 'dipo-card--disabled'
        : '',

      loading
        ? 'dipo-card--loading'
        : '',

      className,
    ]
      .filter(Boolean)
      .join(' ');


    const handleClick =
      (event) => {
        if (
          disabled ||
          loading
        ) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      };


    const commonProps = {
      ref,

      id,

      className: classes,

      style: cardStyle,

      role,

      tabIndex:
        disabled
          ? -1
          : tabIndex,

      'aria-label':
        ariaLabel,

      'aria-current':
        ariaCurrent,

      'aria-selected':
        ariaSelected ??
        (selected
          ? 'true'
          : undefined),

      'aria-disabled':
        ariaDisabled ??
        (disabled
          ? 'true'
          : undefined),

      onClick:
        handleClick,

      onMouseEnter,

      onMouseLeave,

      onFocus,

      onBlur,

      onKeyDown,

      ...rest,
    };


    /*
     * ==========================================================
     * LINK CARD
     * ==========================================================
     */

    if (isLink) {
      if (isExternal) {
        return (
          <>
            <a
              {...commonProps}
              href={
                disabled ||
                loading
                  ? undefined
                  : href
              }
              target={
                target
              }
              rel={
                target ===
                  '_blank'
                  ? rel ||
                    'noopener noreferrer'
                  : rel
              }
              aria-disabled={
                disabled
                  ? 'true'
                  : undefined
              }
            >
              {loading ? (
                <CardLoader />
              ) : (
                children
              )}
            </a>

            <style>
              {CARD_STYLES}
            </style>
          </>
        );
      }


      return (
        <>
          <Link
            {...commonProps}
            href={href}
            target={
              target
            }
            rel={rel}
            aria-disabled={
              disabled
                ? 'true'
                : undefined
            }
          >
            {loading ? (
              <CardLoader />
            ) : (
              children
            )}
          </Link>

          <style>
            {CARD_STYLES}
          </style>
        </>
      );
    }


    /*
     * ==========================================================
     * SEMANTIC ARTICLE / SECTION / DIV
     * ==========================================================
     */

    const Element =
      as === 'article'
        ? 'article'
        : as === 'section'
          ? 'section'
          : as === 'li'
            ? 'li'
            : 'div';


    return (
      <>
        <Element
          {...commonProps}
          role={
            interactive
              ? role ||
                'button'
              : role
          }
          tabIndex={
            interactive
              ? (
                disabled
                  ? -1
                  : tabIndex ??
                    0
              )
              : tabIndex
          }
          onKeyDown={(event) => {
            if (
              interactive &&
              !disabled &&
              (
                event.key ===
                  'Enter' ||
                event.key ===
                  ' '
              )
            ) {
              event.preventDefault();

              onClick?.(
                event,
              );
            }

            onKeyDown?.(
              event,
            );
          }}
        >
          {loading ? (
            <CardLoader />
          ) : (
            children
          )}
        </Element>

        <style>
          {CARD_STYLES}
        </style>
      </>
    );
  },
);

Card.displayName =
  'Card';


/**
 * ============================================================
 * CardHeader
 * ============================================================
 */

function CardHeader({
  children,

  title,

  description,

  action,

  align = 'center',

  gap = 8,

  className = '',

  style,

  ...rest
}) {
  return (
    <>
      <div
        className={[
          'dipo-card-header',
          `dipo-card-header--${align}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          gap,
          ...style,
        }}
        {...rest}
      >
        <div
          className="dipo-card-header__content"
        >
          {title !==
            undefined &&
            title !==
              null && (
              <CardTitle>
                {title}
              </CardTitle>
            )}

          {description !==
            undefined &&
            description !==
              null && (
              <CardDescription>
                {
                  description
                }
              </CardDescription>
            )}

          {children}
        </div>

        {action && (
          <div
            className="dipo-card-header__action"
          >
            {action}
          </div>
        )}
      </div>

      <style>
        {CARD_STYLES}
      </style>
    </>
  );
}


/**
 * ============================================================
 * CardBody
 * ============================================================
 */

function CardBody({
  children,

  padding = 0,

  className = '',

  style,

  ...rest
}) {
  return (
    <>
      <div
        className={[
          'dipo-card-body',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          padding,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>

      <style>
        {CARD_STYLES}
      </style>
    </>
  );
}


/**
 * ============================================================
 * CardFooter
 * ============================================================
 */

function CardFooter({
  children,

  align = 'between',

  border = true,

  className = '',

  style,

  ...rest
}) {
  return (
    <>
      <div
        className={[
          'dipo-card-footer',
          `dipo-card-footer--${align}`,
          border
            ? 'dipo-card-footer--border'
            : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
        {...rest}
      >
        {children}
      </div>

      <style>
        {CARD_STYLES}
      </style>
    </>
  );
}


/**
 * ============================================================
 * CardTitle
 * ============================================================
 */

function CardTitle({
  children,

  as = 'h3',

  size = 'md',

  className = '',

  style,

  ...rest
}) {
  const Element =
    as === 'h1'
      ? 'h1'
      : as === 'h2'
        ? 'h2'
        : as === 'h4'
          ? 'h4'
          : 'h3';

  return (
    <>
      <Element
        className={[
          'dipo-card-title',
          `dipo-card-title--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
        {...rest}
      >
        {children}
      </Element>

      <style>
        {CARD_STYLES}
      </style>
    </>
  );
}


/**
 * ============================================================
 * CardDescription
 * ============================================================
 */

function CardDescription({
  children,

  className = '',

  style,

  ...rest
}) {
  return (
    <>
      <p
        className={[
          'dipo-card-description',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
        {...rest}
      >
        {children}
      </p>

      <style>
        {CARD_STYLES}
      </style>
    </>
  );
}


/**
 * ============================================================
 * CardMedia
 * ============================================================
 */

function CardMedia({
  children,

  position = 'top',

  height,

  aspectRatio,

  padding = 0,

  className = '',

  style,

  ...rest
}) {
  return (
    <>
      <div
        className={[
          'dipo-card-media',
          `dipo-card-media--${position}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          height,
          aspectRatio,
          padding,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>

      <style>
        {CARD_STYLES}
      </style>
    </>
  );
}


/**
 * ============================================================
 * CardAction
 * ============================================================
 */

function CardAction({
  children,

  align = 'end',

  className = '',

  style,

  ...rest
}) {
  return (
    <>
      <div
        className={[
          'dipo-card-action',
          `dipo-card-action--${align}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
        {...rest}
      >
        {children}
      </div>

      <style>
        {CARD_STYLES}
      </style>
    </>
  );
}


/**
 * ============================================================
 * Premium card CSS
 * ============================================================
 */

const CARD_STYLES = `
  .dipo-card {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }

  .dipo-card--interactive:hover {
    transform:
      translateY(-3px);

    box-shadow:
      var(
        --dipo-card-hover-shadow
      ) !important;

    border-color:
      color-mix(
        in srgb,
        var(--dipo-card-border) 70%,
        #cbd5e1
      );
  }

  .dipo-card--interactive:focus-visible {
    outline:
      3px solid
      rgba(5,150,105,.20);

    outline-offset:
      3px;
  }

  .dipo-card--selected {
    border-color:
      #6ee7b7 !important;

    box-shadow:
      0 0 0 3px
      rgba(16,185,129,.09),
      var(
        --dipo-card-shadow
      );
  }

  .dipo-card--loading {
    min-height:
      100px;

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;
  }

  .dipo-card__loader {
    width:
      100%;

    display:
      flex;

    flex-direction:
      column;

    gap:
      10px;
  }

  .dipo-card__loader span {
    display:
      block;

    height:
      10px;

    border-radius:
      999px;

    background:
      linear-gradient(
        90deg,
        rgba(148,163,184,.12),
        rgba(148,163,184,.28),
        rgba(148,163,184,.12)
      );

    background-size:
      200% 100%;

    animation:
      dipo-card-skeleton
      1.4s ease-in-out
      infinite;
  }

  .dipo-card__loader span:nth-child(1) {
    width:
      55%;
  }

  .dipo-card__loader span:nth-child(2) {
    width:
      82%;
  }

  .dipo-card__loader span:nth-child(3) {
    width:
      68%;
  }

  .dipo-card-header {
    display:
      flex;

    width:
      100%;

    justify-content:
      space-between;

    gap:
      16px;
  }

  .dipo-card-header--start {
    align-items:
      flex-start;
  }

  .dipo-card-header--center {
    align-items:
      center;
  }

  .dipo-card-header__content {
    min-width:
      0;

    flex:
      1;
  }

  .dipo-card-header__action {
    flex:
      0 0 auto;

    display:
      inline-flex;

    align-items:
      center;
  }

  .dipo-card-title {
    margin:
      0;

    color:
      inherit;

    font-weight:
      850;

    letter-spacing:
      -.025em;

    line-height:
      1.2;
  }

  .dipo-card-title--sm {
    font-size:
      13px;
  }

  .dipo-card-title--md {
    font-size:
      16px;
  }

  .dipo-card-title--lg {
    font-size:
      20px;
  }

  .dipo-card-title--xl {
    font-size:
      clamp(
        21px,
        2vw,
        28px
      );
  }

  .dipo-card-description {
    margin:
      6px 0 0;

    color:
      #64748b;

    font-size:
      13px;

    line-height:
      1.6;

    max-width:
      68ch;
  }

  .dipo-card-body {
    min-width:
      0;
  }

  .dipo-card-footer {
    width:
      100%;

    display:
      flex;

    gap:
      12px;

    padding-top:
      16px;

    margin-top:
      18px;

    flex-wrap:
      wrap;
  }

  .dipo-card-footer--between {
    align-items:
      center;

    justify-content:
      space-between;
  }

  .dipo-card-footer--start {
    align-items:
      center;

    justify-content:
      flex-start;
  }

  .dipo-card-footer--end {
    align-items:
      center;

    justify-content:
      flex-end;
  }

  .dipo-card-footer--center {
    align-items:
      center;

    justify-content:
      center;
  }

  .dipo-card-footer--border {
    border-top:
      1px solid
      rgba(226,232,240,.9);
  }

  .dipo-card-media {
    position:
      relative;

    width:
      100%;

    overflow:
      hidden;

    box-sizing:
      border-box;
  }

  .dipo-card-media--top {
    margin-top:
      calc(
        var(--dipo-card-padding)
        * -1
      );

    margin-left:
      calc(
        var(--dipo-card-padding)
        * -1
      );

    margin-right:
      calc(
        var(--dipo-card-padding)
        * -1
      );

    width:
      calc(
        100% +
        (
          var(--dipo-card-padding)
          * 2
        )
      );
  }

  .dipo-card-media--bottom {
    margin-bottom:
      calc(
        var(--dipo-card-padding)
        * -1
      );

    margin-left:
      calc(
        var(--dipo-card-padding)
        * -1
      );

    margin-right:
      calc(
        var(--dipo-card-padding)
        * -1
      );

    width:
      calc(
        100% +
        (
          var(--dipo-card-padding)
          * 2
        )
      );
  }

  .dipo-card-action {
    display:
      flex;

    align-items:
      center;

    gap:
      8px;

    min-width:
      0;
  }

  .dipo-card-action--start {
    justify-content:
      flex-start;
  }

  .dipo-card-action--center {
    justify-content:
      center;
  }

  .dipo-card-action--end {
    justify-content:
      flex-end;
  }

  @keyframes dipo-card-skeleton {
    0% {
      background-position:
        200% 0;
    }

    100% {
      background-position:
        -200% 0;
    }
  }

  @media (max-width: 640px) {
    .dipo-card-header {
      align-items:
        flex-start;
    }

    .dipo-card-header__action {
      flex-shrink:
        0;
    }

    .dipo-card-footer {
      align-items:
        stretch;
    }

    .dipo-card-footer--between {
      justify-content:
        flex-start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dipo-card,
    .dipo-card::before,
    .dipo-card::after {
      transition:
        none !important;
      animation:
        none !important;
    }
  }
`;


/*
 * ============================================================
 * Exports
 * ============================================================
 */

export {
  VARIANTS,
  PADDINGS,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
  CardMedia,
  CardAction,
};

export default Card;