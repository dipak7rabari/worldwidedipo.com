'use client';

import {
  useEffect,
  useId,
  useRef,
} from 'react';

/**
 * Worldwide DIPO
 * ============================================================
 * Production-grade ConfirmDialog
 *
 * Designed for:
 * - delete confirmations
 * - payment rejection
 * - profile removal
 * - destructive admin actions
 * - important irreversible actions
 *
 * Features:
 * - accessible dialog semantics
 * - Escape key
 * - backdrop click control
 * - loading state
 * - destructive / warning / neutral variants
 * - auto focus
 * - focus restoration
 * - body scroll lock
 * - keyboard support
 * - responsive mobile layout
 * - reduced motion
 *
 * No external dependencies.
 * No styled-jsx.
 * ============================================================
 */


/* ============================================================
   ICONS
   ============================================================ */

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10.3 4.8 2.9 18a2 2 0 0 0 1.75 3h14.7a2 2 0 0 0 1.75-3L13.7 4.8a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M12 9v4.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="17"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}


function DangerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 7h16M9 7V4h6v3M7 7l.8 12.2c.07 1.02.92 1.8 1.94 1.8h4.52c1.02 0 1.87-.78 1.94-1.8L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 10.5v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="7.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}


function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
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
      focusable="false"
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


function Spinner() {
  return (
    <span
      className="dipo-confirm__spinner"
      aria-hidden="true"
    />
  );
}


/* ============================================================
   VARIANT CONFIG
   ============================================================ */

const VARIANTS = {
  danger: {
    icon: DangerIcon,
    iconBackground: '#fef2f2',
    iconColor: '#dc2626',
    confirmBackground: '#dc2626',
    confirmHover: '#b91c1c',
    confirmShadow:
      '0 8px 22px rgba(220,38,38,.18)',
  },

  warning: {
    icon: WarningIcon,
    iconBackground: '#fffbeb',
    iconColor: '#d97706',
    confirmBackground: '#d97706',
    confirmHover: '#b45309',
    confirmShadow:
      '0 8px 22px rgba(217,119,6,.16)',
  },

  neutral: {
    icon: InfoIcon,
    iconBackground: '#eff6ff',
    iconColor: '#2563eb',
    confirmBackground: '#0f172a',
    confirmHover: '#1e293b',
    confirmShadow:
      '0 8px 22px rgba(15,23,42,.14)',
  },

  success: {
    icon: CheckIcon,
    iconBackground: '#ecfdf5',
    iconColor: '#059669',
    confirmBackground: '#059669',
    confirmHover: '#047857',
    confirmShadow:
      '0 8px 22px rgba(5,150,105,.16)',
  },
};


/* ============================================================
   FOCUSABLE ELEMENTS
   ============================================================ */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');


/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function ConfirmDialog({
  /*
   * ----------------------------------------------------------
   * Visibility
   * ----------------------------------------------------------
   */

  open = false,

  onOpenChange,

  /*
   * ----------------------------------------------------------
   * Content
   * ----------------------------------------------------------
   */

  title = 'Are you sure?',

  description,

  children,

  /*
   * ----------------------------------------------------------
   * Buttons
   * ----------------------------------------------------------
   */

  confirmText = 'Confirm',

  cancelText = 'Cancel',

  onConfirm,

  onCancel,

  /*
   * ----------------------------------------------------------
   * State
   * ----------------------------------------------------------
   */

  loading = false,

  disabled = false,

  /*
   * ----------------------------------------------------------
   * Visual
   * ----------------------------------------------------------
   */

  variant = 'danger',

  icon,

  /*
   * ----------------------------------------------------------
   * Behavior
   * ----------------------------------------------------------
   */

  closeOnBackdrop = true,

  closeOnEscape = true,

  showClose = true,

  preventCloseWhileLoading = true,

  autoFocus = 'cancel',

  /*
   * ----------------------------------------------------------
   * Accessibility
   * ----------------------------------------------------------
   */

  ariaLabel,

  /*
   * ----------------------------------------------------------
   * Styling
   * ----------------------------------------------------------
   */

  className = '',

  style,
}) {
  const titleId =
    useId();

  const descriptionId =
    useId();

  const dialogRef =
    useRef(null);

  const previousActiveElement =
    useRef(null);

  const cancelButtonRef =
    useRef(null);

  const confirmButtonRef =
    useRef(null);

  const resolvedVariant =
    VARIANTS[variant]
      ? variant
      : VARIANTS.danger;

  const Icon =
    resolvedVariant.icon;


  /*
   * ----------------------------------------------------------
   * Body scroll lock + focus restoration
   * ----------------------------------------------------------
   */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    previousActiveElement.current =
      document.activeElement;

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      'hidden';


    /*
     * Initial focus.
     */

    const timer =
      window.setTimeout(() => {
        if (
          autoFocus ===
          'confirm'
        ) {
          confirmButtonRef.current?.focus();
        } else {
          cancelButtonRef.current?.focus();
        }
      }, 20);


    return () => {
      window.clearTimeout(
        timer,
      );

      document.body.style.overflow =
        previousOverflow;

      if (
        previousActiveElement
          .current &&
        typeof previousActiveElement
          .current.focus ===
          'function'
      ) {
        try {
          previousActiveElement
            .current
            .focus();
        } catch {
          /*
           * Focus restoration is
           * best-effort only.
           */
        }
      }
    };
  }, [
    open,
    autoFocus,
  ]);


  /*
   * ----------------------------------------------------------
   * Escape + focus trap
   * ----------------------------------------------------------
   */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown =
      (event) => {
        /*
         * Escape
         */

        if (
          event.key ===
          'Escape'
        ) {
          if (
            !closeOnEscape ||
            (
              loading &&
              preventCloseWhileLoading
            )
          ) {
            return;
          }

          event.preventDefault();

          onOpenChange?.(
            false,
          );

          onCancel?.(
            event,
          );

          return;
        }


        /*
         * Focus trap
         */

        if (
          event.key !==
          'Tab'
        ) {
          return;
        }

        const dialog =
          dialogRef.current;

        if (!dialog) {
          return;
        }

        const focusable =
          Array.from(
            dialog.querySelectorAll(
              FOCUSABLE_SELECTOR,
            ),
          ).filter(
            (element) =>
              element.offsetParent !==
                null &&
              !element.hasAttribute(
                'disabled',
              ),
          );

        if (
          focusable.length ===
          0
        ) {
          event.preventDefault();
          return;
        }

        const first =
          focusable[0];

        const last =
          focusable[
            focusable.length - 1
          ];

        if (
          event.shiftKey
        ) {
          if (
            document.activeElement ===
            first
          ) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (
            document.activeElement ===
            last
          ) {
            event.preventDefault();
            first.focus();
          }
        }
      };


    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    open,
    closeOnEscape,
    loading,
    preventCloseWhileLoading,
    onOpenChange,
    onCancel,
  ]);


  /*
   * ----------------------------------------------------------
   * Don't render when closed.
   * ----------------------------------------------------------
   */

  if (!open) {
    return null;
  }


  /*
   * ----------------------------------------------------------
   * Handlers
   * ----------------------------------------------------------
   */

  const handleCancel =
    (event) => {
      if (
        loading &&
        preventCloseWhileLoading
      ) {
        return;
      }

      onCancel?.(
        event,
      );

      onOpenChange?.(
        false,
      );
    };


  const handleConfirm =
    async (event) => {
      if (
        disabled ||
        loading
      ) {
        return;
      }

      if (
        typeof onConfirm !==
        'function'
      ) {
        onOpenChange?.(
          false,
        );

        return;
      }

      /*
       * Supports both sync and async
       * confirm handlers.
       */
      await onConfirm(
        event,
      );
    };


  const handleBackdropClick =
    (event) => {
      if (
        event.target !==
        event.currentTarget
      ) {
        return;
      }

      if (
        !closeOnBackdrop ||
        (
          loading &&
          preventCloseWhileLoading
        )
      ) {
        return;
      }

      handleCancel(
        event,
      );
    };


  const classes = [
    'dipo-confirm',
    `dipo-confirm--${variant}`,
    loading
      ? 'dipo-confirm--loading'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');


  return (
    <>
      <div
        className="dipo-confirm__backdrop"
        role="presentation"
        onMouseDown={
          handleBackdropClick
        }
      >
        <div
          ref={dialogRef}
          className={classes}
          style={{
            '--dipo-confirm-icon-bg':
              resolvedVariant.iconBackground,

            '--dipo-confirm-icon-color':
              resolvedVariant.iconColor,

            '--dipo-confirm-button-bg':
              resolvedVariant.confirmBackground,

            '--dipo-confirm-button-hover':
              resolvedVariant.confirmHover,

            '--dipo-confirm-button-shadow':
              resolvedVariant.confirmShadow,

            ...style,
          }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={
            ariaLabel
              ? undefined
              : titleId
          }
          aria-describedby={
            description
              ? descriptionId
              : undefined
          }
          aria-label={
            ariaLabel
          }
        >
          <div
            className="dipo-confirm__top"
          >
            <div
              className="dipo-confirm__icon"
            >
              {icon !==
              undefined
                ? icon
                : (
                  <Icon />
                )}
            </div>

            {showClose && (
              <button
                type="button"
                className="dipo-confirm__close"
                aria-label="Close dialog"
                title="Close"
                disabled={
                  loading &&
                  preventCloseWhileLoading
                }
                onClick={
                  handleCancel
                }
              >
                <CloseIcon />
              </button>
            )}
          </div>


          <div
            className="dipo-confirm__content"
          >
            <h2
              id={titleId}
              className="dipo-confirm__title"
            >
              {title}
            </h2>

            {description && (
              <p
                id={descriptionId}
                className="dipo-confirm__description"
              >
                {description}
              </p>
            )}

            {children && (
              <div
                className="dipo-confirm__children"
              >
                {children}
              </div>
            )}
          </div>


          <div
            className="dipo-confirm__actions"
          >
            <button
              ref={
                cancelButtonRef
              }
              type="button"
              className="dipo-confirm__cancel"
              disabled={
                loading &&
                preventCloseWhileLoading
              }
              onClick={
                handleCancel
              }
            >
              {cancelText}
            </button>

            <button
              ref={
                confirmButtonRef
              }
              type="button"
              className="dipo-confirm__confirm"
              disabled={
                disabled ||
                loading
              }
              onClick={
                handleConfirm
              }
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>
                    Processing…
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {confirmText}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>
        {CONFIRM_DIALOG_STYLES}
      </style>
    </>
  );
}


/* ============================================================
   STYLES
   ============================================================ */

const CONFIRM_DIALOG_STYLES = `
  .dipo-confirm__backdrop {
    position: fixed;

    inset: 0;

    z-index: 1000;

    display: flex;

    align-items: center;

    justify-content: center;

    padding:
      20px;

    background:
      rgba(15, 23, 42, .42);

    backdrop-filter:
      blur(9px);

    -webkit-backdrop-filter:
      blur(9px);

    animation:
      dipo-confirm-backdrop
      160ms ease-out;
  }

  .dipo-confirm {
    position: relative;

    width: min(
      100%,
      440px
    );

    max-height:
      min(
        calc(100vh - 40px),
        720px
      );

    overflow:
      auto;

    background:
      #ffffff;

    color:
      #172033;

    border:
      1px solid
      rgba(226, 232, 240, .92);

    border-radius:
      24px;

    box-shadow:
      0 25px 80px
      rgba(15, 23, 42, .20),
      0 5px 18px
      rgba(15, 23, 42, .08);

    padding:
      24px;

    box-sizing:
      border-box;

    animation:
      dipo-confirm-enter
      180ms cubic-bezier(
        .2,
        .8,
        .2,
        1
      );
  }

  .dipo-confirm__top {
    display:
      flex;

    align-items:
      flex-start;

    justify-content:
      space-between;

    gap:
      14px;
  }

  .dipo-confirm__icon {
    width:
      48px;

    height:
      48px;

    min-width:
      48px;

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    border-radius:
      15px;

    background:
      var(
        --dipo-confirm-icon-bg
      );

    color:
      var(
        --dipo-confirm-icon-color
      );
  }

  .dipo-confirm__close {
    width:
      36px;

    height:
      36px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    padding:
      0;

    border:
      1px solid
      #e2e8f0;

    border-radius:
      10px;

    background:
      #ffffff;

    color:
      #64748b;

    cursor:
      pointer;

    transition:
      background 140ms ease,
      border-color 140ms ease,
      color 140ms ease,
      transform 120ms ease;
  }

  .dipo-confirm__close:hover:not(:disabled) {
    background:
      #f8fafc;

    border-color:
      #cbd5e1;

    color:
      #172033;
  }

  .dipo-confirm__close:active:not(:disabled) {
    transform:
      scale(.95);
  }

  .dipo-confirm__close:focus-visible,
  .dipo-confirm__cancel:focus-visible,
  .dipo-confirm__confirm:focus-visible {
    outline:
      3px solid
      rgba(5, 150, 105, .20);

    outline-offset:
      3px;
  }

  .dipo-confirm__close:disabled {
    opacity:
      .45;

    cursor:
      not-allowed;
  }

  .dipo-confirm__content {
    margin-top:
      18px;
  }

  .dipo-confirm__title {
    margin:
      0;

    color:
      #0f172a;

    font-size:
      clamp(
        19px,
        3vw,
        23px
      );

    font-weight:
      850;

    letter-spacing:
      -.035em;

    line-height:
      1.2;
  }

  .dipo-confirm__description {
    margin:
      9px 0 0;

    color:
      #64748b;

    font-size:
      13px;

    line-height:
      1.65;
  }

  .dipo-confirm__children {
    margin-top:
      14px;

    color:
      #475569;

    font-size:
      13px;

    line-height:
      1.6;
  }

  .dipo-confirm__actions {
    display:
      grid;

    grid-template-columns:
      1fr 1fr;

    gap:
      10px;

    margin-top:
      24px;
  }

  .dipo-confirm__cancel,
  .dipo-confirm__confirm {
    min-height:
      44px;

    padding:
      0 16px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      8px;

    border-radius:
      12px;

    font-family:
      inherit;

    font-size:
      12px;

    font-weight:
      800;

    letter-spacing:
      -.01em;

    cursor:
      pointer;

    box-sizing:
      border-box;

    transition:
      background 140ms ease,
      border-color 140ms ease,
      color 140ms ease,
      box-shadow 140ms ease,
      transform 120ms ease;
  }

  .dipo-confirm__cancel {
    border:
      1px solid
      #e2e8f0;

    background:
      #ffffff;

    color:
      #475569;
  }

  .dipo-confirm__cancel:hover:not(:disabled) {
    background:
      #f8fafc;

    border-color:
      #cbd5e1;

    color:
      #172033;
  }

  .dipo-confirm__confirm {
    border:
      1px solid
      var(
        --dipo-confirm-button-bg
      );

    background:
      var(
        --dipo-confirm-button-bg
      );

    color:
      #ffffff;

    box-shadow:
      var(
        --dipo-confirm-button-shadow
      );
  }

  .dipo-confirm__confirm:hover:not(:disabled) {
    background:
      var(
        --dipo-confirm-button-hover
      );

    border-color:
      var(
        --dipo-confirm-button-hover
      );

    transform:
      translateY(-1px);
  }

  .dipo-confirm__confirm:active:not(:disabled),
  .dipo-confirm__cancel:active:not(:disabled) {
    transform:
      scale(.985);
  }

  .dipo-confirm__cancel:disabled,
  .dipo-confirm__confirm:disabled {
    opacity:
      .55;

    cursor:
      not-allowed;

    box-shadow:
      none;
  }

  .dipo-confirm__spinner {
    width:
      15px;

    height:
      15px;

    border:
      2px solid
      rgba(255,255,255,.30);

    border-top-color:
      #ffffff;

    border-radius:
      50%;

    animation:
      dipo-confirm-spin
      .7s linear infinite;
  }

  .dipo-confirm--loading {
    user-select:
      none;
  }

  @keyframes dipo-confirm-enter {
    from {
      opacity:
        0;

      transform:
        translateY(10px)
        scale(.985);
    }

    to {
      opacity:
        1;

      transform:
        translateY(0)
        scale(1);
    }
  }

  @keyframes dipo-confirm-backdrop {
    from {
      opacity:
        0;
    }

    to {
      opacity:
        1;
    }
  }

  @keyframes dipo-confirm-spin {
    from {
      transform:
        rotate(0deg);
    }

    to {
      transform:
        rotate(360deg);
    }
  }

  @media (max-width: 520px) {
    .dipo-confirm__backdrop {
      align-items:
        flex-end;

      padding:
        10px;
    }

    .dipo-confirm {
      width:
        100%;

      max-height:
        calc(100vh - 20px);

      border-radius:
        22px;

      padding:
        20px;
    }

    .dipo-confirm__actions {
      grid-template-columns:
        1fr;
    }

    .dipo-confirm__confirm {
      order:
        1;
    }

    .dipo-confirm__cancel {
      order:
        2;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dipo-confirm,
    .dipo-confirm__backdrop,
    .dipo-confirm__spinner {
      animation:
        none !important;
    }

    .dipo-confirm__close,
    .dipo-confirm__cancel,
    .dipo-confirm__confirm {
      transition:
        none !important;
    }
  }
`;