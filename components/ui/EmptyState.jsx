'use client';

import {
  forwardRef,
  useMemo,
} from 'react';

/**
 * Worldwide DIPO
 * ============================================================
 * Production-grade EmptyState
 *
 * Designed for:
 * - Empty dashboard sections
 * - No projects
 * - No services
 * - No gallery items
 * - No payments
 * - Search results
 * - Admin tables
 * - Profile sections
 * - First-time user onboarding
 *
 * Features:
 * - Premium responsive UI
 * - Built-in icon options
 * - Custom icon support
 * - Primary + secondary actions
 * - Compact / default / large sizes
 * - Center / left alignment
 * - Optional badge
 * - Optional illustration
 * - Accessible semantics
 * - Reduced motion support
 * - No external dependencies
 * ============================================================
 */


/* ============================================================
   BUILT-IN ICONS
   ============================================================ */

function PlusIcon({
  size = 22,
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
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function SearchIcon({
  size = 22,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function FolderIcon({
  size = 22,
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
        d="M3.5 7.5A2.5 2.5 0 0 1 6 5h4l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function FileIcon({
  size = 22,
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
        d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M14 3.5v4h4M8.5 12h7M8.5 15.5h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function ImageIcon({
  size = 22,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="8.5"
        cy="9"
        r="1.4"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="m5.5 17 4.5-4 3.2 2.6 2.3-2 3 3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function UserIcon({
  size = 22,
}) {
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
        cy="8"
        r="3.3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M5.5 20c.7-3.6 2.8-5.4 6.5-5.4s5.8 1.8 6.5 5.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function LinkIcon({
  size = 22,
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
        d="M10 13.8 8.4 15.4a3.4 3.4 0 0 1-4.8-4.8l3-3a3.4 3.4 0 0 1 4.8 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="m14 10.2 1.6-1.6a3.4 3.4 0 0 1 4.8 4.8l-3 3a3.4 3.4 0 0 1-4.8 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="m9 15 6-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function SparkIcon({
  size = 22,
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
        d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"
        fill="currentColor"
      />
    </svg>
  );
}


function AlertIcon({
  size = 22,
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
  size = 22,
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


const ICONS = {
  plus: PlusIcon,
  search: SearchIcon,
  folder: FolderIcon,
  file: FileIcon,
  image: ImageIcon,
  user: UserIcon,
  link: LinkIcon,
  spark: SparkIcon,
  alert: AlertIcon,
  refresh: RefreshIcon,
};


/* ============================================================
   ARROW
   ============================================================ */

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


/* ============================================================
   EMPTY STATE
   ============================================================ */

const EmptyState = forwardRef(
  function EmptyState(
    {
      /* ------------------------------------------------------
         Content
         ------------------------------------------------------ */

      title = 'Nothing here yet',

      description,

      eyebrow,

      badge,

      /* ------------------------------------------------------
         Icon
         ------------------------------------------------------ */

      icon = 'folder',

      customIcon,

      iconSize = 24,

      /* ------------------------------------------------------
         Actions
         ------------------------------------------------------ */

      action,

      secondaryAction,

      /* ------------------------------------------------------
         Illustration
         ------------------------------------------------------ */

      illustration,

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

      role = 'status',

      'aria-live':
        ariaLive = 'polite',

      /* ------------------------------------------------------
         DOM
         ------------------------------------------------------ */

      as: Component = 'section',

      ...rest
    },
    ref,
  ) {
    const resolvedIcon =
      customIcon ||
      (
        typeof icon ===
          'function'
          ? icon({
              size:
                iconSize,
            })
          : null
      );

    const IconComponent =
      !customIcon &&
      typeof icon ===
        'string'
        ? ICONS[icon] ||
          ICONS.folder
        : null;


    const sizes = {
      sm: {
        padding:
          '28px 18px',
        iconBox:
          48,
        title:
          15,
        description:
          11,
        gap:
          12,
      },

      md: {
        padding:
          '44px 22px',
        iconBox:
          58,
        title:
          17,
        description:
          12,
        gap:
          14,
      },

      lg: {
        padding:
          '64px 28px',
        iconBox:
          70,
        title:
          21,
        description:
          13,
        gap:
          17,
      },
    };


    const resolvedSize =
      sizes[size] ||
      sizes.md;

    const isLeft =
      align === 'left';


    const rootStyle =
      useMemo(
        () => ({
          '--dipo-empty-padding':
            resolvedSize.padding,

          '--dipo-empty-icon-size':
            `${resolvedSize.iconBox}px`,

          '--dipo-empty-title-size':
            `${resolvedSize.title}px`,

          '--dipo-empty-description-size':
            `${resolvedSize.description}px`,

          '--dipo-empty-gap':
            `${resolvedSize.gap}px`,

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
      'dipo-empty-state',
      `dipo-empty-state--${size}`,
      `dipo-empty-state--${align}`,
      illustration
        ? 'dipo-empty-state--illustrated'
        : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');


    const renderIcon =
      () => {
        if (
          illustration
        ) {
          return (
            <div
              className="dipo-empty-state__illustration"
            >
              {illustration}
            </div>
          );
        }


        if (
          resolvedIcon
        ) {
          return (
            <div
              className="dipo-empty-state__icon"
              aria-hidden="true"
            >
              {resolvedIcon}
            </div>
          );
        }


        if (
          IconComponent
        ) {
          return (
            <div
              className="dipo-empty-state__icon"
              aria-hidden="true"
            >
              <IconComponent
                size={
                  iconSize
                }
              />
            </div>
          );
        }


        return null;
      };


    const renderAction =
      (item, primary) => {
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
          ...buttonProps
        } = item;


        const content =
          children ??
          label;


        const className =
          primary
            ? 'dipo-empty-state__primary'
            : 'dipo-empty-state__secondary';


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
                className,
                disabled
                  ? 'dipo-empty-state__action-disabled'
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
              {...buttonProps}
            >
              {loading && (
                <span
                  className="dipo-empty-state__spinner"
                  aria-hidden="true"
                />
              )}

              {!loading &&
                actionIcon && (
                  <span
                    className="dipo-empty-state__action-icon"
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
              className,
              disabled
                ? 'dipo-empty-state__action-disabled'
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
            {...buttonProps}
          >
            {loading && (
              <span
                className="dipo-empty-state__spinner"
                aria-hidden="true"
              />
            )}

            {!loading &&
              actionIcon && (
                <span
                  className="dipo-empty-state__action-icon"
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
          <div className="dipo-empty-state__inner">
            {renderIcon()}


            {eyebrow && (
              <div className="dipo-empty-state__eyebrow">
                {eyebrow}
              </div>
            )}


            {badge && (
              <div className="dipo-empty-state__badge">
                <span className="dipo-empty-state__badge-dot" />
                {badge}
              </div>
            )}


            {title && (
              <h2 className="dipo-empty-state__title">
                {title}
              </h2>
            )}


            {description && (
              <p className="dipo-empty-state__description">
                {description}
              </p>
            )}


            {(action ||
              secondaryAction) && (
              <div className="dipo-empty-state__actions">
                {renderAction(
                  action,
                  true,
                )}

                {renderAction(
                  secondaryAction,
                  false,
                )}
              </div>
            )}
          </div>
        </Component>


        <style>
          {EMPTY_STATE_STYLES}
        </style>
      </>
    );
  },
);


EmptyState.displayName =
  'EmptyState';


/* ============================================================
   PRESET EMPTY STATES
   ============================================================ */

function EmptyProjects(
  props,
) {
  return (
    <EmptyState
      icon="folder"
      title="No projects yet"
      description="Showcase the work that represents your skills, experience and professional identity."
      action={{
        label:
          'Add Project',
        icon: (
          <PlusIcon
            size={16}
          />
        ),
      }}
      {...props}
    />
  );
}


function EmptyGallery(
  props,
) {
  return (
    <EmptyState
      icon="image"
      title="Your gallery is empty"
      description="Add images to give visitors a better visual view of your work."
      action={{
        label:
          'Add Images',
        icon: (
          <PlusIcon
            size={16}
          />
        ),
      }}
      {...props}
    />
  );
}


function EmptySearch(
  props,
) {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description="Try a different name, profession, category or search term."
      {...props}
    />
  );
}


function EmptyProfile(
  props,
) {
  return (
    <EmptyState
      icon="user"
      eyebrow="YOUR DIPO"
      title="Your profile is waiting"
      description="Complete your profile so people can understand who you are and what you do."
      action={{
        label:
          'Complete Profile',
        arrow:
          true,
      }}
      {...props}
    />
  );
}


/* ============================================================
   STYLES
   ============================================================ */

const EMPTY_STATE_STYLES = `
  .dipo-empty-state {
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
      var(--dipo-empty-padding);

    color:
      #0f172a;

    overflow:
      hidden;
  }


  .dipo-empty-state__inner {
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


  .dipo-empty-state--left
  .dipo-empty-state__inner {
    align-items:
      flex-start;

    text-align:
      left;

    margin-right:
      auto;
  }


  .dipo-empty-state__icon {
    width:
      var(--dipo-empty-icon-size);

    height:
      var(--dipo-empty-icon-size);

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    margin-bottom:
      var(--dipo-empty-gap);

    border:
      1px solid
      #d1fae5;

    border-radius:
      18px;

    background:
      linear-gradient(
        145deg,
        #ecfdf5,
        #f8fffc
      );

    color:
      #059669;

    box-shadow:
      0 8px 25px
      rgba(5,150,105,.08);

    animation:
      dipo-empty-float
      3.5s ease-in-out infinite;
  }


  .dipo-empty-state__illustration {
    width:
      min(100%, 260px);

    margin-bottom:
      var(--dipo-empty-gap);

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;
  }


  .dipo-empty-state__eyebrow {
    margin-bottom:
      6px;

    color:
      #059669;

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


  .dipo-empty-state__badge {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      7px;

    margin-bottom:
      10px;

    padding:
      6px 9px;

    border:
      1px solid
      #e2e8f0;

    border-radius:
      999px;

    background:
      rgba(248,250,252,.86);

    color:
      #64748b;

    font-size:
      9px;

    line-height:
      1;

    font-weight:
      800;

    letter-spacing:
      .06em;

    text-transform:
      uppercase;
  }


  .dipo-empty-state__badge-dot {
    width:
      6px;

    height:
      6px;

    border-radius:
      50%;

    background:
      #10b981;

    box-shadow:
      0 0 0 3px
      rgba(16,185,129,.10);
  }


  .dipo-empty-state__title {
    margin:
      0;

    color:
      #0f172a;

    font-size:
      var(--dipo-empty-title-size);

    line-height:
      1.25;

    font-weight:
      850;

    letter-spacing:
      -.025em;
  }


  .dipo-empty-state__description {
    max-width:
      56ch;

    margin:
      8px 0 0;

    color:
      #64748b;

    font-size:
      var(--dipo-empty-description-size);

    line-height:
      1.65;

    font-weight:
      500;
  }


  .dipo-empty-state__actions {
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


  .dipo-empty-state--left
  .dipo-empty-state__actions {
    justify-content:
      flex-start;
  }


  .dipo-empty-state__primary,
  .dipo-empty-state__secondary {
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


  .dipo-empty-state__primary {
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


  .dipo-empty-state__primary:hover {
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


  .dipo-empty-state__secondary {
    border:
      1px solid
      #dbe3ea;

    background:
      #ffffff;

    color:
      #475569;
  }


  .dipo-empty-state__secondary:hover {
    background:
      #f8fafc;

    border-color:
      #cbd5e1;

    color:
      #0f172a;

    transform:
      translateY(-1px);
  }


  .dipo-empty-state__primary:focus-visible,
  .dipo-empty-state__secondary:focus-visible {
    outline:
      3px solid
      rgba(5,150,105,.18);

    outline-offset:
      3px;
  }


  .dipo-empty-state__primary:active,
  .dipo-empty-state__secondary:active {
    transform:
      scale(.985);
  }


  .dipo-empty-state__action-disabled {
    opacity:
      .55;

    pointer-events:
      none;
  }


  .dipo-empty-state__action-icon {
    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    line-height:
      0;
  }


  .dipo-empty-state__spinner {
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
      dipo-empty-spin
      .7s linear infinite;
  }


  .dipo-empty-state__secondary
  .dipo-empty-state__spinner {
    border-color:
      rgba(71,85,105,.18);

    border-top-color:
      #475569;
  }


  @keyframes dipo-empty-spin {
    to {
      transform:
        rotate(360deg);
    }
  }


  @keyframes dipo-empty-float {
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
    .dipo-empty-state {
      padding:
        34px 16px;
    }


    .dipo-empty-state__actions {
      width:
        100%;
    }


    .dipo-empty-state__primary,
    .dipo-empty-state__secondary {
      min-height:
        42px;

      padding-inline:
        15px;
      }
  }


  @media (prefers-reduced-motion: reduce) {
    .dipo-empty-state__icon,
    .dipo-empty-state__spinner,
    .dipo-empty-state__primary,
    .dipo-empty-state__secondary {
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
  ICONS,
  EmptyProjects,
  EmptyGallery,
  EmptySearch,
  EmptyProfile,
};

export default EmptyState;