'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

/**
 * Worldwide DIPO
 * ============================================================
 * Production Dialog
 *
 * Use for:
 * - confirmations
 * - small forms
 * - warnings
 * - quick actions
 * - admin actions
 * - profile actions
 * - payment actions
 *
 * For larger/full modal experiences, Modal.jsx can build on
 * the same visual language later.
 *
 * No external dependencies.
 * No styled-jsx.
 * ============================================================
 */

const SIZES = {
  xs: 360,
  sm: 440,
  md: 540,
  lg: 680,
  xl: 820,
};

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(',');


/* ============================================================
   Close Icon
   ============================================================ */

function CloseIcon({
  size = 18,
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
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


/* ============================================================
   Dialog Component
   ============================================================ */

const Dialog = forwardRef(
  function Dialog(
    {
      /* ------------------------------------------------------
         Visibility
         ------------------------------------------------------ */

      open,

      defaultOpen = false,

      onOpenChange,

      /* ------------------------------------------------------
         Content
         ------------------------------------------------------ */

      children,

      title,

      description,

      eyebrow,

      icon,

      footer,

      /* ------------------------------------------------------
         Behavior
         ------------------------------------------------------ */

      closeOnOverlayClick = true,

      closeOnEscape = true,

      showClose = true,

      preventClose = false,

      lockScroll = true,

      autoFocus = true,

      restoreFocus = true,

      /* ------------------------------------------------------
         Size
         ------------------------------------------------------ */

      size = 'md',

      /* ------------------------------------------------------
         Styling
         ------------------------------------------------------ */

      className = '',

      contentClassName = '',

      overlayClassName = '',

      style,

      /* ------------------------------------------------------
         Accessibility
         ------------------------------------------------------ */

      ariaLabel,

      ariaDescribedBy,

      /* ------------------------------------------------------
         DOM
         ------------------------------------------------------ */

      id,

      ...rest
    },
    forwardedRef,
  ) {
    const titleId =
      useId();

    const descriptionId =
      useId();

    const internalRef =
      useRef(null);

    const closeButtonRef =
      useRef(null);

    const previouslyFocusedRef =
      useRef(null);

    const mountedRef =
      useRef(false);

    const [internalOpen, setInternalOpen] =
      useState(
        defaultOpen,
      );

    const [mounted, setMounted] =
      useState(false);


    /* --------------------------------------------------------
       Controlled vs uncontrolled
       -------------------------------------------------------- */

    const isControlled =
      open !== undefined;

    const isOpen =
      isControlled
        ? Boolean(open)
        : internalOpen;


    /* --------------------------------------------------------
       Mount portal safely
       -------------------------------------------------------- */

    useEffect(() => {
      setMounted(true);
      mountedRef.current = true;

      return () => {
        mountedRef.current = false;
      };
    }, []);


    /* --------------------------------------------------------
       Resolve dimensions
       -------------------------------------------------------- */

    const maxWidth =
      SIZES[size] ||
      SIZES.md;


    /* --------------------------------------------------------
       Ref composition
       -------------------------------------------------------- */

    const setDialogRef =
      useCallback(
        (node) => {
          internalRef.current =
            node;

          if (
            typeof forwardedRef ===
            'function'
          ) {
            forwardedRef(node);
          } else if (
            forwardedRef
          ) {
            forwardedRef.current =
              node;
          }
        },
        [
          forwardedRef,
        ],
      );


    /* --------------------------------------------------------
       Change visibility
       -------------------------------------------------------- */

    const setOpen =
      useCallback(
        (nextOpen) => {
          if (
            nextOpen ===
            isOpen
          ) {
            return;
          }

          if (
            !nextOpen &&
            preventClose
          ) {
            return;
          }

          if (
            !isControlled
          ) {
            setInternalOpen(
              nextOpen,
            );
          }

          onOpenChange?.(
            nextOpen,
          );
        },
        [
          isOpen,
          preventClose,
          isControlled,
          onOpenChange,
        ],
      );


    const close =
      useCallback(() => {
        if (
          preventClose
        ) {
          return;
        }

        setOpen(false);
      }, [
        preventClose,
        setOpen,
      ]);


    /* --------------------------------------------------------
       Save focused element when dialog opens
       -------------------------------------------------------- */

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      previouslyFocusedRef.current =
        document.activeElement;

      return undefined;
    }, [isOpen]);


    /* --------------------------------------------------------
       Body scroll lock
       -------------------------------------------------------- */

    useEffect(() => {
      if (
        !isOpen ||
        !lockScroll
      ) {
        return undefined;
      }

      const body =
        document.body;

      const previousOverflow =
        body.style.overflow;

      const previousPaddingRight =
        body.style.paddingRight;

      const scrollbarWidth =
        window.innerWidth -
        document.documentElement
          .clientWidth;

      body.style.overflow =
        'hidden';

      if (
        scrollbarWidth >
        0
      ) {
        body.style.paddingRight =
          `${scrollbarWidth}px`;
      }

      return () => {
        body.style.overflow =
          previousOverflow;

        body.style.paddingRight =
          previousPaddingRight;
      };
    }, [
      isOpen,
      lockScroll,
    ]);


    /* --------------------------------------------------------
       Initial focus
       -------------------------------------------------------- */

    useEffect(() => {
      if (
        !isOpen ||
        !autoFocus
      ) {
        return undefined;
      }

      const frame =
        requestAnimationFrame(
          () => {
            const container =
              internalRef.current;

            if (!container) {
              return;
            }

            if (
              closeButtonRef.current
            ) {
              closeButtonRef.current.focus();
              return;
            }

            const firstFocusable =
              container.querySelector(
                FOCUSABLE_SELECTOR,
              );

            if (
              firstFocusable
            ) {
              firstFocusable.focus();
              return;
            }

            container.focus();
          },
        );

      return () => {
        cancelAnimationFrame(
          frame,
        );
      };
    }, [
      isOpen,
      autoFocus,
    ]);


    /* --------------------------------------------------------
       Restore focus after close
       -------------------------------------------------------- */

    useEffect(() => {
      if (
        isOpen ||
        !restoreFocus
      ) {
        return undefined;
      }

      const element =
        previouslyFocusedRef.current;

      if (
        element &&
        typeof element.focus ===
          'function' &&
        document.contains(
          element,
        )
      ) {
        const frame =
          requestAnimationFrame(
            () => {
              element.focus();
            },
          );

        return () => {
          cancelAnimationFrame(
            frame,
          );
        };
      }

      return undefined;
    }, [
      isOpen,
      restoreFocus,
    ]);


    /* --------------------------------------------------------
       Keyboard handling
       -------------------------------------------------------- */

    const handleKeyDown =
      useCallback(
        (event) => {
          if (
            event.key ===
            'Escape'
          ) {
            if (
              closeOnEscape &&
              !preventClose
            ) {
              event.preventDefault();
              event.stopPropagation();

              close();
            }

            return;
          }

          if (
            event.key !==
            'Tab'
          ) {
            return;
          }

          const container =
            internalRef.current;

          if (!container) {
            return;
          }

          const focusable =
            Array.from(
              container.querySelectorAll(
                FOCUSABLE_SELECTOR,
              ),
            ).filter(
              (element) =>
                element.offsetParent !==
                null,
            );

          if (
            focusable.length ===
            0
          ) {
            event.preventDefault();
            container.focus();
            return;
          }

          const first =
            focusable[0];

          const last =
            focusable[
              focusable.length - 1
            ];

          if (
            event.shiftKey &&
            document.activeElement ===
              first
          ) {
            event.preventDefault();
            last.focus();
            return;
          }

          if (
            !event.shiftKey &&
            document.activeElement ===
              last
          ) {
            event.preventDefault();
            first.focus();
          }
        },
        [
          closeOnEscape,
          preventClose,
          close,
        ],
      );


    useEffect(() => {
      if (!isOpen) {
        return undefined;
      }

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
      isOpen,
      handleKeyDown,
    ]);


    /* --------------------------------------------------------
       Overlay interaction
       -------------------------------------------------------- */

    const handleOverlayMouseDown =
      useCallback(
        (event) => {
          if (
            !closeOnOverlayClick ||
            preventClose
          ) {
            return;
          }

          if (
            event.target ===
            event.currentTarget
          ) {
            close();
          }
        },
        [
          closeOnOverlayClick,
          preventClose,
          close,
        ],
      );


    /* --------------------------------------------------------
       Memoized accessibility
       -------------------------------------------------------- */

    const resolvedTitleId =
      title
        ? titleId
        : undefined;

    const resolvedDescriptionId =
      description
        ? descriptionId
        : undefined;

    const describedBy =
      ariaDescribedBy ||
      resolvedDescriptionId;


    /* --------------------------------------------------------
       Styles
       -------------------------------------------------------- */

    const dialogStyle =
      useMemo(
        () => ({
          '--dipo-dialog-max-width':
            `${maxWidth}px`,

          ...style,
        }),
        [
          maxWidth,
          style,
        ],
      );


    /* --------------------------------------------------------
       Do not render before client mount
       -------------------------------------------------------- */

    if (
      !mounted ||
      !isOpen
    ) {
      return null;
    }


    /* --------------------------------------------------------
       Portal
       -------------------------------------------------------- */

    return createPortal(
      <div
        className={[
          'dipo-dialog-overlay',
          overlayClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        onMouseDown={
          handleOverlayMouseDown
        }
        role="presentation"
      >
        <div
          ref={
            setDialogRef
          }
          id={id}
          className={[
            'dipo-dialog',
            `dipo-dialog--${size}`,
            preventClose
              ? 'dipo-dialog--locked'
              : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={
            dialogStyle
          }
          role="dialog"
          aria-modal="true"
          aria-labelledby={
            ariaLabel
              ? undefined
              : resolvedTitleId
          }
          aria-describedby={
            describedBy
          }
          aria-label={
            ariaLabel
          }
          tabIndex={-1}
          onMouseDown={(event) =>
            event.stopPropagation()
          }
          {...rest}
        >
          {/* -------------------------------------------------
              Header
              ------------------------------------------------- */}

          {(eyebrow ||
            title ||
            description ||
            icon ||
            showClose) && (
            <div className="dipo-dialog__header">
              <div className="dipo-dialog__heading">
                {icon && (
                  <div
                    className="dipo-dialog__icon"
                    aria-hidden="true"
                  >
                    {icon}
                  </div>
                )}

                <div className="dipo-dialog__heading-copy">
                  {eyebrow && (
                    <div className="dipo-dialog__eyebrow">
                      {eyebrow}
                    </div>
                  )}

                  {title && (
                    <h2
                      id={
                        resolvedTitleId
                      }
                      className="dipo-dialog__title"
                    >
                      {title}
                    </h2>
                  )}

                  {description && (
                    <p
                      id={
                        resolvedDescriptionId
                      }
                      className="dipo-dialog__description"
                    >
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {showClose && (
                <button
                  ref={
                    closeButtonRef
                  }
                  type="button"
                  className="dipo-dialog__close"
                  onClick={
                    close
                  }
                  disabled={
                    preventClose
                  }
                  aria-label="Close dialog"
                  title="Close"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          )}


          {/* -------------------------------------------------
              Body
              ------------------------------------------------- */}

          <div
            className={[
              'dipo-dialog__body',
              contentClassName,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {children}
          </div>


          {/* -------------------------------------------------
              Footer
              ------------------------------------------------- */}

          {footer && (
            <div className="dipo-dialog__footer">
              {footer}
            </div>
          )}
        </div>


        <style>
          {DIALOG_STYLES}
        </style>
      </div>,
      document.body,
    );
  },
);


Dialog.displayName =
  'Dialog';


/* ============================================================
   Dialog Trigger
   ============================================================ */

function DialogTrigger({
  children,
  onClick,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      {...props}
    >
      {children}
    </button>
  );
}


/* ============================================================
   Dialog Header
   ============================================================ */

function DialogHeader({
  children,
  className = '',
  style,
  ...props
}) {
  return (
    <div
      className={[
        'dipo-dialog-section-header',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}


/* ============================================================
   Dialog Footer
   ============================================================ */

function DialogFooter({
  children,
  align = 'end',
  className = '',
  style,
  ...props
}) {
  const justify =
    align === 'start'
      ? 'flex-start'
      : align === 'center'
        ? 'center'
        : align === 'between'
          ? 'space-between'
          : 'flex-end';

  return (
    <div
      className={[
        'dipo-dialog-section-footer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        justifyContent:
          justify,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}


/* ============================================================
   Dialog CSS
   ============================================================ */

const DIALOG_STYLES = `
  .dipo-dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;

    display: flex;
    align-items: center;
    justify-content: center;

    padding:
      max(16px, env(safe-area-inset-top))
      max(16px, env(safe-area-inset-right))
      max(16px, env(safe-area-inset-bottom))
      max(16px, env(safe-area-inset-left));

    background:
      rgba(2, 6, 23, .48);

    backdrop-filter:
      blur(10px);

    -webkit-backdrop-filter:
      blur(10px);

    animation:
      dipo-dialog-overlay-in
      160ms ease both;

    box-sizing: border-box;
  }


  .dipo-dialog {
    position: relative;

    width: 100%;
    max-width:
      var(--dipo-dialog-max-width);

    max-height:
      min(
        calc(100dvh - 32px),
        860px
      );

    display: flex;
    flex-direction: column;

    min-width: 0;

    overflow: hidden;

    border:
      1px solid
      rgba(226, 232, 240, .92);

    border-radius:
      22px;

    background:
      #ffffff;

    color:
      #0f172a;

    box-shadow:
      0 30px 90px
      rgba(2, 6, 23, .20),
      0 8px 30px
      rgba(2, 6, 23, .10);

    animation:
      dipo-dialog-in
      180ms cubic-bezier(.22,1,.36,1)
      both;

    box-sizing:
      border-box;
  }


  .dipo-dialog:focus {
    outline:
      none;
  }


  .dipo-dialog__header {
    display:
      flex;

    align-items:
      flex-start;

    justify-content:
      space-between;

    gap:
      18px;

    padding:
      22px 22px 0;

    flex-shrink:
      0;
  }


  .dipo-dialog__heading {
    display:
      flex;

    align-items:
      flex-start;

    gap:
      13px;

    min-width:
      0;

    flex: 1;
  }


  .dipo-dialog__heading-copy {
    min-width:
      0;
  }


  .dipo-dialog__icon {
    width:
      42px;

    height:
      42px;

    min-width:
      42px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    border:
      1px solid
      #d1fae5;

    border-radius:
      13px;

    background:
      #ecfdf5;

    color:
      #059669;

    flex-shrink:
      0;
  }


  .dipo-dialog__eyebrow {
    margin-bottom:
      5px;

    color:
      #059669;

    font-size:
      9px;

    line-height:
      1.2;

    font-weight:
      850;

    letter-spacing:
      .10em;

    text-transform:
      uppercase;
  }


  .dipo-dialog__title {
    margin:
      0;

    color:
      #0f172a;

    font-size:
      clamp(17px, 2vw, 20px);

    line-height:
      1.25;

    font-weight:
      850;

    letter-spacing:
      -.025em;
  }


  .dipo-dialog__description {
    max-width:
      58ch;

    margin:
      6px 0 0;

    color:
      #64748b;

    font-size:
      12px;

    line-height:
      1.6;

    font-weight:
      500;
  }


  .dipo-dialog__close {
    width:
      34px;

    height:
      34px;

    min-width:
      34px;

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

    flex-shrink:
      0;

    transition:
      background 140ms ease,
      border-color 140ms ease,
      color 140ms ease,
      transform 120ms ease;
  }


  .dipo-dialog__close:hover:not(:disabled) {
    background:
      #f8fafc;

    border-color:
      #cbd5e1;

    color:
      #0f172a;
  }


  .dipo-dialog__close:active:not(:disabled) {
    transform:
      scale(.96);
  }


  .dipo-dialog__close:focus-visible {
    outline:
      3px solid
      rgba(5, 150, 105, .18);

    outline-offset:
      2px;
  }


  .dipo-dialog__close:disabled {
    opacity:
      .42;

    cursor:
      not-allowed;
  }


  .dipo-dialog__body {
    min-width:
      0;

    overflow:
      auto;

    overscroll-behavior:
      contain;

    padding:
      20px 22px 22px;

    color:
      #334155;

    font-size:
      13px;

    line-height:
      1.6;

    scrollbar-width:
      thin;

    scrollbar-color:
      #cbd5e1 transparent;
  }


  .dipo-dialog__body::-webkit-scrollbar {
    width:
      7px;
  }


  .dipo-dialog__body::-webkit-scrollbar-track {
    background:
      transparent;
  }


  .dipo-dialog__body::-webkit-scrollbar-thumb {
    background:
      #cbd5e1;

    border-radius:
      999px;
  }


  .dipo-dialog__footer {
    display:
      flex;

    align-items:
      center;

    gap:
      9px;

    flex-wrap:
      wrap;

    padding:
      15px 22px 20px;

    border-top:
      1px solid
      #edf1f5;

    background:
      rgba(248, 250, 252, .72);

    flex-shrink:
      0;
  }


  .dipo-dialog-section-header {
    margin-bottom:
      14px;
  }


  .dipo-dialog-section-footer {
    display:
      flex;

    align-items:
      center;

    gap:
      9px;

    flex-wrap:
      wrap;
  }


  @keyframes dipo-dialog-overlay-in {
    from {
      opacity:
        0;
    }

    to {
      opacity:
        1;
    }
  }


  @keyframes dipo-dialog-in {
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


  @media (max-width: 640px) {
    .dipo-dialog-overlay {
      align-items:
        flex-end;

      padding:
        10px;

      padding-bottom:
        max(
          10px,
          env(safe-area-inset-bottom)
        );
    }


    .dipo-dialog {
      max-height:
        calc(100dvh - 20px);

      border-radius:
        20px;

      animation-name:
        dipo-dialog-mobile-in;
    }


    .dipo-dialog__header {
      padding:
        18px 18px 0;
    }


    .dipo-dialog__body {
      padding:
        17px 18px 18px;
    }


    .dipo-dialog__footer {
      padding:
        13px 18px
        max(16px, env(safe-area-inset-bottom));

      gap:
        8px;
    }


    .dipo-dialog__description {
      font-size:
        11.5px;
    }


    @keyframes dipo-dialog-mobile-in {
      from {
        opacity:
          0;

        transform:
          translateY(18px);
      }

      to {
        opacity:
          1;

        transform:
          translateY(0);
      }
    }
  }


  @media (prefers-reduced-motion: reduce) {
    .dipo-dialog-overlay,
    .dipo-dialog {
      animation:
        none !important;
    }

    .dipo-dialog__close {
      transition:
        none !important;
    }
  }
`;


/* ============================================================
   Exports
   ============================================================ */

export {
  SIZES,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
};

export default Dialog;