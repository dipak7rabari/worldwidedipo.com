'use client';

import {
  forwardRef,
  useMemo,
} from 'react';


/* ============================================================
   SKELETON
   ============================================================ */

const Skeleton = forwardRef(function Skeleton(
  {
    /* --------------------------------------------------------
       Shape
       -------------------------------------------------------- */

    variant = 'text',
    width,
    height,

    lines = 1,

    radius = 'md',

    /* --------------------------------------------------------
       Animation
       -------------------------------------------------------- */

    animated = true,

    /* --------------------------------------------------------
       Layout
       -------------------------------------------------------- */

    inline = false,
    fullWidth = false,

    /* --------------------------------------------------------
       Accessibility
       -------------------------------------------------------- */

    label = 'Loading',

    /* --------------------------------------------------------
       Styling
       -------------------------------------------------------- */

    className = '',
    style,

    ...props
  },
  ref,
) {
  const normalizedVariant =
    SKELETON_VARIANTS[
      variant
    ]
      ? variant
      : 'text';

  const normalizedRadius =
    SKELETON_RADII[
      radius
    ]
      ? radius
      : 'md';


  const dimensions =
    useMemo(
      () => ({
        width:
          width !== undefined
            ? normalizeDimension(
                width,
              )
            : undefined,

        height:
          height !== undefined
            ? normalizeDimension(
                height,
              )
            : undefined,
      }),
      [
        width,
        height,
      ],
    );


  const classes = [
    'dipo-skeleton',
    `dipo-skeleton--${normalizedVariant}`,
    `dipo-skeleton--radius-${normalizedRadius}`,

    animated
      ? 'dipo-skeleton--animated'
      : '',

    inline
      ? 'dipo-skeleton--inline'
      : '',

    fullWidth
      ? 'dipo-skeleton--full'
      : '',

    className,
  ]
    .filter(Boolean)
    .join(' ');


  /*
   * Multi-line text skeleton.
   */
  if (
    normalizedVariant ===
      'text' &&
    lines > 1
  ) {
    return (
      <span
        ref={ref}
        className={[
          'dipo-skeleton-lines',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        role="status"
        aria-label={label}
        aria-live="polite"
        {...props}
      >
        {Array.from(
          {
            length: Math.max(
              1,
              lines,
            ),
          },
          (_, index) => (
            <span
              key={index}
              className={[
                'dipo-skeleton',
                'dipo-skeleton--text',
                `dipo-skeleton--radius-${normalizedRadius}`,
                animated
                  ? 'dipo-skeleton--animated'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                ...dimensions,

                width:
                  width === undefined
                    ? index ===
                      lines - 1
                      ? '72%'
                      : '100%'
                    : dimensions.width,
              }}
              aria-hidden="true"
            />
          ),
        )}

        <style>
          {SKELETON_STYLES}
        </style>
      </span>
    );
  }


  return (
    <span
      ref={ref}
      className={classes}
      style={{
        ...dimensions,
        ...getVariantDimensions(
          normalizedVariant,
          width,
          height,
        ),
        ...style,
      }}
      role="status"
      aria-label={label}
      aria-live="polite"
      {...props}
    >
      <style>
        {SKELETON_STYLES}
      </style>
    </span>
  );
});


Skeleton.displayName =
  'Skeleton';


/* ============================================================
   AVATAR SKELETON
   ============================================================ */

function SkeletonAvatar({
  size = 'md',
  animated = true,
  className = '',
  style,
  ...props
}) {
  const sizes = {
    xs: 28,
    sm: 36,
    md: 48,
    lg: 64,
    xl: 88,
  };

  const resolved =
    sizes[size] ||
    sizes.md;

  return (
    <Skeleton
      variant="circle"
      width={resolved}
      height={resolved}
      animated={animated}
      className={className}
      style={style}
      {...props}
    />
  );
}


/* ============================================================
   TEXT SKELETON
   ============================================================ */

function SkeletonText({
  lines = 3,
  animated = true,
  width,
  className = '',
  style,
  ...props
}) {
  return (
    <Skeleton
      variant="text"
      lines={lines}
      width={width}
      animated={animated}
      className={className}
      style={style}
      {...props}
    />
  );
}


/* ============================================================
   BUTTON SKELETON
   ============================================================ */

function SkeletonButton({
  width = 120,
  height = 42,
  animated = true,
  className = '',
  style,
  ...props
}) {
  return (
    <Skeleton
      variant="button"
      width={width}
      height={height}
      animated={animated}
      className={className}
      style={style}
      {...props}
    />
  );
}


/* ============================================================
   CARD SKELETON
   ============================================================ */

function SkeletonCard({
  height = 220,
  animated = true,
  className = '',
  style,
  ...props
}) {
  return (
    <Skeleton
      variant="card"
      width="100%"
      height={height}
      animated={animated}
      className={className}
      style={style}
      {...props}
    />
  );
}


/* ============================================================
   IMAGE SKELETON
   ============================================================ */

function SkeletonImage({
  width = '100%',
  height = 220,
  animated = true,
  className = '',
  style,
  ...props
}) {
  return (
    <Skeleton
      variant="image"
      width={width}
      height={height}
      animated={animated}
      className={className}
      style={style}
      {...props}
    />
  );
}


/* ============================================================
   PROFILE SKELETON
   ============================================================ */

function SkeletonProfile({
  animated = true,
  className = '',
  style,
}) {
  return (
    <div
      className={[
        'dipo-skeleton-profile',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-label="Loading profile"
      role="status"
      aria-live="polite"
    >
      <SkeletonAvatar
        size="lg"
        animated={animated}
      />

      <div className="dipo-skeleton-profile__content">
        <Skeleton
          variant="text"
          width={150}
          height={18}
          animated={animated}
        />

        <Skeleton
          variant="text"
          width={105}
          height={13}
          animated={animated}
        />

        <Skeleton
          variant="text"
          lines={2}
          animated={animated}
        />
      </div>

      <style>
        {SKELETON_STYLES}
      </style>
    </div>
  );
}


/* ============================================================
   PROFILE PAGE SKELETON
   ============================================================ */

function SkeletonProfilePage({
  animated = true,
  className = '',
  style,
}) {
  return (
    <div
      className={[
        'dipo-skeleton-page',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      role="status"
      aria-label="Loading profile"
      aria-live="polite"
    >
      <div className="dipo-skeleton-page__hero">
        <SkeletonAvatar
          size="xl"
          animated={animated}
        />

        <Skeleton
          variant="text"
          width={190}
          height={24}
          animated={animated}
        />

        <Skeleton
          variant="text"
          width={130}
          height={14}
          animated={animated}
        />

        <Skeleton
          variant="text"
          lines={2}
          width={340}
          animated={animated}
        />

        <div className="dipo-skeleton-page__actions">
          <SkeletonButton
            width={110}
            animated={animated}
          />

          <SkeletonButton
            width={92}
            animated={animated}
          />
        </div>
      </div>

      <div className="dipo-skeleton-page__section">
        <Skeleton
          variant="text"
          width={120}
          height={20}
          animated={animated}
        />

        <Skeleton
          variant="card"
          width="100%"
          height={150}
          animated={animated}
        />
      </div>

      <style>
        {SKELETON_STYLES}
      </style>
    </div>
  );
}


/* ============================================================
   GRID SKELETON
   ============================================================ */

function SkeletonGrid({
  count = 6,
  columns = 3,
  animated = true,
  className = '',
  style,
}) {
  const safeCount =
    Math.max(
      1,
      Math.min(
        24,
        Number(count) || 1,
      ),
    );

  const safeColumns =
    Math.max(
      1,
      Math.min(
        6,
        Number(columns) || 1,
      ),
    );

  return (
    <div
      className={[
        'dipo-skeleton-grid',
        `dipo-skeleton-grid--${safeColumns}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      role="status"
      aria-label="Loading content"
      aria-live="polite"
    >
      {Array.from(
        {
          length: safeCount,
        },
        (_, index) => (
          <Skeleton
            key={index}
            variant="card"
            width="100%"
            height={180}
            animated={animated}
          />
        ),
      )}

      <style>
        {SKELETON_STYLES}
      </style>
    </div>
  );
}


/* ============================================================
   NORMALIZE DIMENSION
   ============================================================ */

function normalizeDimension(
  value,
) {
  if (
    typeof value ===
    'number'
  ) {
    return `${value}px`;
  }

  return value;
}


/* ============================================================
   VARIANT DIMENSIONS
   ============================================================ */

function getVariantDimensions(
  variant,
  width,
  height,
) {
  const dimensions = {};

  if (
    width === undefined &&
    variant === 'text'
  ) {
    dimensions.width =
      '100%';
  }

  if (
    height === undefined
  ) {
    if (
      variant === 'text'
    ) {
      dimensions.height =
        '14px';
    }

    if (
      variant === 'avatar'
    ) {
      dimensions.width =
        '48px';

      dimensions.height =
        '48px';
    }

    if (
      variant === 'circle'
    ) {
      dimensions.width =
        '48px';

      dimensions.height =
        '48px';
    }

    if (
      variant === 'button'
    ) {
      dimensions.height =
        '42px';
    }

    if (
      variant === 'image'
    ) {
      dimensions.height =
        '220px';
    }

    if (
      variant === 'card'
    ) {
      dimensions.height =
        '180px';
    }
  }

  if (
    variant === 'circle' &&
    width !== undefined &&
    height === undefined
  ) {
    dimensions.height =
      dimensions.width;
  }

  return dimensions;
}


/* ============================================================
   CONFIG
   ============================================================ */

const SKELETON_VARIANTS = {
  text: true,
  line: true,
  circle: true,
  avatar: true,
  button: true,
  image: true,
  card: true,
  block: true,
};


const SKELETON_RADII = {
  none: true,
  xs: true,
  sm: true,
  md: true,
  lg: true,
  xl: true,
  full: true,
};


/* ============================================================
   STYLES
   ============================================================ */

const SKELETON_STYLES = `
  .dipo-skeleton {
    position: relative;

    display: block;

    flex: 0 0 auto;

    max-width: 100%;

    overflow: hidden;

    background:
      #edf1f3;

    vertical-align: middle;

    color: transparent;

    user-select: none;

    pointer-events: none;
  }


  .dipo-skeleton--animated::after {
    position: absolute;

    inset: 0;

    display: block;

    content: "";

    transform:
      translateX(-100%);

    background:
      linear-gradient(
        90deg,
        transparent 0%,
        rgba(255,255,255,.46) 45%,
        rgba(255,255,255,.72) 50%,
        rgba(255,255,255,.46) 55%,
        transparent 100%
      );

    animation:
      dipo-skeleton-shimmer
      1.55s
      cubic-bezier(.4,0,.2,1)
      infinite;
  }


  .dipo-skeleton--text,
  .dipo-skeleton--line {
    min-height: 10px;

    border-radius: 5px;
  }


  .dipo-skeleton--circle,
  .dipo-skeleton--avatar {
    aspect-ratio: 1 / 1;

    border-radius: 50%;
  }


  .dipo-skeleton--button {
    border-radius: 11px;
  }


  .dipo-skeleton--image {
    border-radius: 15px;
  }


  .dipo-skeleton--card {
    border-radius: 18px;
  }


  .dipo-skeleton--block {
    border-radius: 12px;
  }


  .dipo-skeleton--radius-none {
    border-radius: 0;
  }


  .dipo-skeleton--radius-xs {
    border-radius: 4px;
  }


  .dipo-skeleton--radius-sm {
    border-radius: 7px;
  }


  .dipo-skeleton--radius-md {
    border-radius: 11px;
  }


  .dipo-skeleton--radius-lg {
    border-radius: 16px;
  }


  .dipo-skeleton--radius-xl {
    border-radius: 22px;
  }


  .dipo-skeleton--radius-full {
    border-radius: 999px;
  }


  .dipo-skeleton--inline {
    display: inline-block;
  }


  .dipo-skeleton--full {
    width: 100%;
  }


  .dipo-skeleton-lines {
    display: flex;

    flex-direction: column;

    align-items: stretch;

    gap: 8px;

    width: 100%;
  }


  .dipo-skeleton-lines
  .dipo-skeleton {
    width: 100%;
  }


  .dipo-skeleton-profile {
    display: flex;

    align-items: flex-start;

    gap: 16px;

    width: 100%;

    min-width: 0;
  }


  .dipo-skeleton-profile__content {
    display: flex;

    flex: 1 1 auto;

    flex-direction: column;

    align-items: flex-start;

    gap: 9px;

    min-width: 0;
  }


  .dipo-skeleton-profile__content
  .dipo-skeleton-lines {
    width: 100%;

    margin-top: 3px;
  }


  .dipo-skeleton-page {
    display: flex;

    flex-direction: column;

    align-items: center;

    gap: 18px;

    width: 100%;

    max-width: 760px;

    margin: 0 auto;
  }


  .dipo-skeleton-page__hero {
    display: flex;

    flex-direction: column;

    align-items: center;

    gap: 11px;

    width: 100%;

    padding:
      32px 20px 28px;

    border:
      1px solid
      rgba(15,23,42,.06);

    border-radius: 24px;

    background: #fff;
  }


  .dipo-skeleton-page__actions {
    display: flex;

    align-items: center;

    gap: 9px;

    margin-top: 8px;
  }


  .dipo-skeleton-page__section {
    display: flex;

    flex-direction: column;

    gap: 13px;

    width: 100%;

    padding:
      24px;

    border:
      1px solid
      rgba(15,23,42,.06);

    border-radius: 20px;

    background: #fff;
  }


  .dipo-skeleton-grid {
    display: grid;

    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap: 16px;

    width: 100%;
  }


  .dipo-skeleton-grid--1 {
    grid-template-columns:
      minmax(0, 1fr);
  }


  .dipo-skeleton-grid--2 {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }


  .dipo-skeleton-grid--4 {
    grid-template-columns:
      repeat(4, minmax(0, 1fr));
  }


  .dipo-skeleton-grid--5 {
    grid-template-columns:
      repeat(5, minmax(0, 1fr));
  }


  .dipo-skeleton-grid--6 {
    grid-template-columns:
      repeat(6, minmax(0, 1fr));
  }


  @keyframes dipo-skeleton-shimmer {
    0% {
      transform:
        translateX(-100%);
    }

    100% {
      transform:
        translateX(100%);
    }
  }


  @media (max-width: 1024px) {
    .dipo-skeleton-grid--4,
    .dipo-skeleton-grid--5,
    .dipo-skeleton-grid--6 {
      grid-template-columns:
        repeat(3, minmax(0, 1fr));
    }
  }


  @media (max-width: 768px) {
    .dipo-skeleton-grid--3,
    .dipo-skeleton-grid--4,
    .dipo-skeleton-grid--5,
    .dipo-skeleton-grid--6 {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }
  }


  @media (max-width: 520px) {
    .dipo-skeleton-grid,
    .dipo-skeleton-grid--2,
    .dipo-skeleton-grid--3,
    .dipo-skeleton-grid--4,
    .dipo-skeleton-grid--5,
    .dipo-skeleton-grid--6 {
      grid-template-columns:
        minmax(0, 1fr);
    }


    .dipo-skeleton-profile {
      gap: 12px;
    }


    .dipo-skeleton-page__hero {
      padding:
        24px 16px;
    }


    .dipo-skeleton-page__section {
      padding:
        18px;
    }
  }


  @media (prefers-reduced-motion: reduce) {
    .dipo-skeleton--animated::after {
      animation: none;

      transform: none;

      background:
        rgba(255,255,255,.2);
    }
  }
`;


/* ============================================================
   EXPORTS
   ============================================================ */

export {
  SkeletonAvatar,
  SkeletonText,
  SkeletonButton,
  SkeletonCard,
  SkeletonImage,
  SkeletonProfile,
  SkeletonProfilePage,
  SkeletonGrid,
};

export default Skeleton;