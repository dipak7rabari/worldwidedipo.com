'use client';

import {
  forwardRef,
  useMemo,
} from 'react';


/* ============================================================
   LOADER
   ============================================================ */

const Loader = forwardRef(function Loader(
  {
    /* --------------------------------------------------------
       Core
       -------------------------------------------------------- */

    size = 'md',
    variant = 'spinner',

    label = 'Loading',
    showLabel = false,

    /* --------------------------------------------------------
       Progress
       -------------------------------------------------------- */

    progress,
    showProgress = false,

    /* --------------------------------------------------------
       Layout
       -------------------------------------------------------- */

    fullScreen = false,
    overlay = false,

    center = false,
    inline = false,

    minHeight,

    /* --------------------------------------------------------
       Styling
       -------------------------------------------------------- */

    className = '',
    style,

    /* --------------------------------------------------------
       Accessibility
       -------------------------------------------------------- */

    role = 'status',

    'aria-label':
      ariaLabel,

    /* --------------------------------------------------------
       DOM
       -------------------------------------------------------- */

    ...props
  },
  ref,
) {
  const sizes = {
    xs: {
      spinner: 16,
      stroke: 1.8,
      dots: 4,
      bar: 42,
      font: 9,
      gap: 7,
    },

    sm: {
      spinner: 22,
      stroke: 2,
      dots: 5,
      bar: 56,
      font: 10,
      gap: 8,
    },

    md: {
      spinner: 30,
      stroke: 2.2,
      dots: 6,
      bar: 72,
      font: 11,
      gap: 9,
    },

    lg: {
      spinner: 42,
      stroke: 2.4,
      dots: 7,
      bar: 96,
      font: 12,
      gap: 11,
    },

    xl: {
      spinner: 58,
      stroke: 2.6,
      dots: 8,
      bar: 124,
      font: 13,
      gap: 13,
    },
  };


  const resolvedSize =
    sizes[size] ||
    sizes.md;


  const resolvedVariant =
    [
      'spinner',
      'dots',
      'pulse',
      'bars',
      'ring',
    ].includes(
      variant,
    )
      ? variant
      : 'spinner';


  const safeProgress =
    typeof progress === 'number'
      ? Math.min(
          100,
          Math.max(
            0,
            progress,
          ),
        )
      : null;


  const rootStyle = useMemo(
    () => ({
      '--dipo-loader-size':
        `${resolvedSize.spinner}px`,

      '--dipo-loader-stroke':
        `${resolvedSize.stroke}px`,

      '--dipo-loader-bar':
        `${resolvedSize.bar}px`,

      '--dipo-loader-font':
        `${resolvedSize.font}px`,

      '--dipo-loader-gap':
        `${resolvedSize.gap}px`,

      '--dipo-loader-progress':
        `${safeProgress ?? 0}%`,

      minHeight:
        minHeight
          ? typeof minHeight ===
            'number'
            ? `${minHeight}px`
            : minHeight
          : undefined,

      ...style,
    }),
    [
      resolvedSize,
      safeProgress,
      minHeight,
      style,
    ],
  );


  const classes = [
    'dipo-loader',
    `dipo-loader--${size}`,
    `dipo-loader--${resolvedVariant}`,

    fullScreen
      ? 'dipo-loader--fullscreen'
      : '',

    overlay
      ? 'dipo-loader--overlay'
      : '',

    center
      ? 'dipo-loader--center'
      : '',

    inline
      ? 'dipo-loader--inline'
      : '',

    className,
  ]
    .filter(Boolean)
    .join(' ');


  const accessibleLabel =
    ariaLabel ||
    label ||
    'Loading';


  const renderSpinner =
    () => (
      <span
        className="dipo-loader__spinner"
        aria-hidden="true"
      >
        <svg
          width={
            resolvedSize.spinner
          }
          height={
            resolvedSize.spinner
          }
          viewBox="0 0 44 44"
          fill="none"
        >
          <circle
            cx="22"
            cy="22"
            r="18"
            stroke="currentColor"
            strokeWidth={
              resolvedSize.stroke
            }
            strokeOpacity=".14"
          />

          <path
            d="M40 22a18 18 0 0 0-18-18"
            stroke="currentColor"
            strokeWidth={
              resolvedSize.stroke
            }
            strokeLinecap="round"
          />
        </svg>
      </span>
    );


  const renderRing =
    () => (
      <span
        className="dipo-loader__ring"
        aria-hidden="true"
      >
        <svg
          width={
            resolvedSize.spinner
          }
          height={
            resolvedSize.spinner
          }
          viewBox="0 0 44 44"
          fill="none"
        >
          <circle
            cx="22"
            cy="22"
            r="18"
            stroke="currentColor"
            strokeWidth={
              resolvedSize.stroke
            }
            strokeLinecap="round"
            strokeDasharray="78 35"
          />
        </svg>
      </span>
    );


  const renderDots =
    () => (
      <span
        className="dipo-loader__dots"
        aria-hidden="true"
      >
        {[
          0,
          1,
          2,
        ].map((index) => (
          <i
            key={index}
            style={{
              '--dipo-dot-delay':
                `${index * 120}ms`,
            }}
          />
        ))}
      </span>
    );


  const renderPulse =
    () => (
      <span
        className="dipo-loader__pulse"
        aria-hidden="true"
      >
        <i />
      </span>
    );


  const renderBars =
    () => (
      <span
        className="dipo-loader__bars"
        aria-hidden="true"
      >
        {[
          0,
          1,
          2,
          3,
          4,
        ].map((index) => (
          <i
            key={index}
            style={{
              '--dipo-bar-delay':
                `${index * 90}ms`,
            }}
          />
        ))}
      </span>
    );


  const renderVisual =
    () => {
      switch (
        resolvedVariant
      ) {
        case 'dots':
          return renderDots();

        case 'pulse':
          return renderPulse();

        case 'bars':
          return renderBars();

        case 'ring':
          return renderRing();

        case 'spinner':
        default:
          return renderSpinner();
      }
    };


  const showProgressBar =
    showProgress &&
    safeProgress !== null;


  return (
    <div
      ref={ref}
      className={classes}
      style={rootStyle}
      role={role}
      aria-label={
        accessibleLabel
      }
      aria-live="polite"
      aria-busy="true"
      {...props}
    >
      <div className="dipo-loader__content">
        {renderVisual()}

        {showLabel && (
          <span className="dipo-loader__label">
            {label}
            {!showProgressBar && (
              <span
                className="dipo-loader__ellipsis"
                aria-hidden="true"
              >
                ...
              </span>
            )}
          </span>
        )}

        {showProgressBar && (
          <div className="dipo-loader__progress">
            <div className="dipo-loader__progress-track">
              <span />
            </div>

            <div className="dipo-loader__progress-meta">
              <span>
                {label}
              </span>

              <strong>
                {Math.round(
                  safeProgress,
                )}
                %
              </strong>
            </div>
          </div>
        )}
      </div>


      <style>
        {LOADER_STYLES}
      </style>
    </div>
  );
});


Loader.displayName =
  'Loader';


/* ============================================================
   SPECIALIZED LOADERS
   ============================================================ */

function PageLoader({
  label = 'Loading page',
  ...props
}) {
  return (
    <Loader
      size="lg"
      variant="spinner"
      label={label}
      showLabel
      center
      minHeight="60vh"
      {...props}
    />
  );
}


function InlineLoader({
  label = 'Loading',
  ...props
}) {
  return (
    <Loader
      size="sm"
      variant="spinner"
      label={label}
      showLabel
      inline
      {...props}
    />
  );
}


function FullScreenLoader({
  label = 'Loading',
  ...props
}) {
  return (
    <Loader
      size="lg"
      variant="spinner"
      label={label}
      showLabel
      fullScreen
      {...props}
    />
  );
}


function OverlayLoader({
  label = 'Please wait',
  ...props
}) {
  return (
    <Loader
      size="md"
      variant="spinner"
      label={label}
      showLabel
      overlay
      {...props}
    />
  );
}


function ProgressLoader({
  progress = 0,
  label = 'Loading',
  ...props
}) {
  return (
    <Loader
      size="md"
      variant="spinner"
      label={label}
      showProgress
      progress={progress}
      {...props}
    />
  );
}


/* ============================================================
   STYLES
   ============================================================ */

const LOADER_STYLES = `
  .dipo-loader {
    position: relative;

    box-sizing: border-box;

    width: 100%;

    display: flex;

    align-items: center;
    justify-content: center;

    color: #0f172a;

    font-family: inherit;
  }


  .dipo-loader *,
  .dipo-loader *::before,
  .dipo-loader *::after {
    box-sizing: border-box;
  }


  .dipo-loader__content {
    display: flex;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: var(--dipo-loader-gap);

    min-width: 0;
  }


  .dipo-loader--inline {
    width: auto;

    display: inline-flex;

    vertical-align: middle;
  }


  .dipo-loader--center {
    min-height: 160px;
  }


  .dipo-loader--fullscreen {
    position: fixed;

    inset: 0;

    z-index: 9999;

    width: 100vw;
    height: 100dvh;

    min-height: 100dvh;

    background:
      rgba(255,255,255,.96);

    backdrop-filter:
      blur(18px);

    -webkit-backdrop-filter:
      blur(18px);
  }


  .dipo-loader--overlay {
    position: absolute;

    inset: 0;

    z-index: 100;

    width: 100%;
    height: 100%;

    min-height: 100%;

    background:
      rgba(255,255,255,.72);

    backdrop-filter:
      blur(7px);

    -webkit-backdrop-filter:
      blur(7px);
  }


  .dipo-loader__spinner,
  .dipo-loader__ring {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    width:
      var(--dipo-loader-size);

    height:
      var(--dipo-loader-size);

    color: #059669;

    flex: 0 0 auto;
  }


  .dipo-loader__spinner svg {
    display: block;

    animation:
      dipo-loader-spin
      .8s
      linear
      infinite;
  }


  .dipo-loader__ring svg {
    display: block;

    animation:
      dipo-loader-ring
      1.05s
      cubic-bezier(.4,0,.2,1)
      infinite;
  }


  .dipo-loader__dots {
    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 5px;

    min-height:
      var(--dipo-loader-size);
  }


  .dipo-loader__dots i {
    display: block;

    width:
      calc(
        var(--dipo-loader-size) * .24
      );

    height:
      calc(
        var(--dipo-loader-size) * .24
      );

    min-width: 4px;
    min-height: 4px;

    border-radius: 999px;

    background: #059669;

    animation:
      dipo-loader-dot
      1.1s
      ease-in-out
      infinite;

    animation-delay:
      var(--dipo-dot-delay);
  }


  .dipo-loader__pulse {
    position: relative;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    width:
      var(--dipo-loader-size);

    height:
      var(--dipo-loader-size);
  }


  .dipo-loader__pulse::before,
  .dipo-loader__pulse i {
    position: absolute;

    display: block;

    width:
      calc(
        var(--dipo-loader-size) * .34
      );

    height:
      calc(
        var(--dipo-loader-size) * .34
      );

    border-radius: 50%;

    background: #059669;

    content: "";
  }


  .dipo-loader__pulse::before {
    animation:
      dipo-loader-pulse
      1.45s
      ease-out
      infinite;
  }


  .dipo-loader__pulse i {
    opacity: .95;
  }


  .dipo-loader__bars {
    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 4px;

    width:
      var(--dipo-loader-bar);

    height:
      var(--dipo-loader-size);
  }


  .dipo-loader__bars i {
    display: block;

    width:
      max(
        3px,
        calc(
          var(--dipo-loader-size) * .12
        )
      );

    height:
      42%;

    border-radius: 999px;

    background: #059669;

    transform-origin: center;

    animation:
      dipo-loader-bars
      .9s
      ease-in-out
      infinite;

    animation-delay:
      var(--dipo-bar-delay);
  }


  .dipo-loader__label {
    color: #64748b;

    font-size:
      var(--dipo-loader-font);

    line-height: 1.4;

    font-weight: 650;

    letter-spacing: -.005em;

    text-align: center;
  }


  .dipo-loader__ellipsis {
    display: inline-block;

    width: 12px;

    overflow: hidden;

    text-align: left;

    animation:
      dipo-loader-ellipsis
      1.35s
      steps(4,end)
      infinite;
  }


  .dipo-loader__progress {
    width:
      min(
        280px,
        80vw
      );

    margin-top: 2px;
  }


  .dipo-loader__progress-track {
    position: relative;

    width: 100%;

    height: 5px;

    overflow: hidden;

    border-radius: 999px;

    background: #e9eef2;
  }


  .dipo-loader__progress-track span {
    display: block;

    width:
      var(--dipo-loader-progress);

    height: 100%;

    border-radius: inherit;

    background:
      linear-gradient(
        90deg,
        #059669,
        #10b981
      );

    transition:
      width 240ms
      cubic-bezier(.2,.8,.2,1);
  }


  .dipo-loader__progress-meta {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 12px;

    margin-top: 7px;

    color: #94a3b8;

    font-size: 9px;

    line-height: 1.3;

    font-weight: 650;
  }


  .dipo-loader__progress-meta strong {
    color: #475569;

    font-weight: 800;

    font-variant-numeric:
      tabular-nums;
  }


  @keyframes dipo-loader-spin {
    to {
      transform: rotate(360deg);
    }
  }


  @keyframes dipo-loader-ring {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }


  @keyframes dipo-loader-dot {
    0%,
    60%,
    100% {
      transform:
        translateY(0);

      opacity: .35;
    }

    30% {
      transform:
        translateY(-5px);

      opacity: 1;
    }
  }


  @keyframes dipo-loader-pulse {
    0% {
      transform: scale(.65);

      opacity: .55;
    }

    70%,
    100% {
      transform: scale(2.5);

      opacity: 0;
    }
  }


  @keyframes dipo-loader-bars {
    0%,
    100% {
      transform:
        scaleY(.55);

      opacity: .45;
    }

    50% {
      transform:
        scaleY(1);

      opacity: 1;
    }
  }


  @keyframes dipo-loader-ellipsis {
    0% {
      width: 0;
    }

    100% {
      width: 12px;
    }
  }


  @media (max-width: 480px) {
    .dipo-loader--fullscreen {
      min-height: 100dvh;
    }

    .dipo-loader__progress {
      width:
        min(
          240px,
          78vw
        );
    }
  }


  @media (prefers-reduced-motion: reduce) {
    .dipo-loader__spinner svg,
    .dipo-loader__ring svg,
    .dipo-loader__dots i,
    .dipo-loader__pulse::before,
    .dipo-loader__bars i,
    .dipo-loader__ellipsis {
      animation: none;
    }

    .dipo-loader__progress-track span {
      transition: none;
    }
  }
`;


/* ============================================================
   EXPORTS
   ============================================================ */

export {
  PageLoader,
  InlineLoader,
  FullScreenLoader,
  OverlayLoader,
  ProgressLoader,
};

export default Loader;