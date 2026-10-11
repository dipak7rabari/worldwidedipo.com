'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';


/* ============================================================
   MODAL
   ============================================================ */

const Modal = forwardRef(function Modal(
  {
    /* --------------------------------------------------------
       State
       -------------------------------------------------------- */

    open = false,
    onClose,

    /* --------------------------------------------------------
       Content
       -------------------------------------------------------- */

    title,
    description,

    children,

    header,
    footer,

    /* --------------------------------------------------------
       Behavior
       -------------------------------------------------------- */

    closeOnOverlay = true,
    closeOnEscape = true,

    lockScroll = true,
    restoreFocus = true,

    trapFocus = true,

    /* --------------------------------------------------------
       UI
       -------------------------------------------------------- */

    size = 'md',

    showClose = true,

    closeLabel = 'Close',

    centered = true,

    scrollable = true,

    loading = false,

    /* --------------------------------------------------------
       Styling
       -------------------------------------------------------- */

    className = '',
    overlayClassName = '',
    contentClassName = '',

    style,
    contentStyle,

    /* --------------------------------------------------------
       Accessibility
       -------------------------------------------------------- */

    labelledBy,
    describedBy,

    role = 'dialog',

    /* --------------------------------------------------------
       DOM
       -------------------------------------------------------- */

    childrenOnly = false,

    ...props
  },
  forwardedRef,
) {
  const generatedId = useId();

  const titleId =
    labelledBy ||
    `dipo-modal-title-${generatedId}`;

  const descriptionId =
    describedBy ||
    `dipo-modal-description-${generatedId}`;

  const modalRef = useRef(null);

  const previousFocusRef =
    useRef(null);

  const portalNodeRef =
    useRef(null);


  /* ----------------------------------------------------------
     Combine refs
     ---------------------------------------------------------- */

  const setModalRef =
    useCallback(
      (node) => {
        modalRef.current = node;

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
      [forwardedRef],
    );


  /* ----------------------------------------------------------
     Portal node
     ---------------------------------------------------------- */

  useEffect(() => {
    if (
      typeof document ===
      'undefined'
    ) {
      return;
    }

    const node =
      document.createElement(
        'div',
      );

    node.setAttribute(
      'data-dipo-modal-root',
      '',
    );

    document.body.appendChild(node);

    portalNodeRef.current = node;

    return () => {
      node.remove();

      portalNodeRef.current =
        null;
    };
  }, []);


  /* ----------------------------------------------------------
     Save focus
     ---------------------------------------------------------- */

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusRef.current =
      document.activeElement;
  }, [open]);


  /* ----------------------------------------------------------
     Body scroll lock
     ---------------------------------------------------------- */

  useEffect(() => {
    if (
      !open ||
      !lockScroll ||
      typeof document ===
        'undefined'
    ) {
      return;
    }

    const body =
      document.body;

    const scrollbarWidth =
      window.innerWidth -
      document.documentElement
        .clientWidth;

    const previousOverflow =
      body.style.overflow;

    const previousPadding =
      body.style.paddingRight;

    body.style.overflow =
      'hidden';

    if (
      scrollbarWidth > 0
    ) {
      body.style.paddingRight =
        `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow =
        previousOverflow;

      body.style.paddingRight =
        previousPadding;
    };
  }, [
    open,
    lockScroll,
  ]);


  /* ----------------------------------------------------------
     Focus + keyboard management
     ---------------------------------------------------------- */

  useEffect(() => {
    if (
      !open ||
      typeof document ===
        'undefined'
    ) {
      return;
    }

    const modal =
      modalRef.current;

    if (!modal) {
      return;
    }

    const getFocusable =
      () =>
        Array.from(
          modal.querySelectorAll(
            FOCUSABLE_SELECTOR,
          ),
        ).filter(
          (element) =>
            !element.disabled &&
            element.getAttribute(
              'aria-hidden',
            ) !== 'true' &&
            element.tabIndex !== -1,
        );

    const focusInitial =
      () => {
        const autoFocus =
          modal.querySelector(
            '[data-autofocus]',
          );

        if (
          autoFocus &&
          typeof autoFocus.focus ===
            'function'
        ) {
          autoFocus.focus();
          return;
        }

        const focusables =
          getFocusable();

        if (
          focusables.length > 0
        ) {
          focusables[0].focus();
        } else {
          modal.focus();
        }
      };

    const timer =
      window.setTimeout(
        focusInitial,
        0,
      );

    const handleKeyDown =
      (event) => {
        if (
          event.key ===
          'Escape'
        ) {
          if (
            closeOnEscape &&
            !loading
          ) {
            event.preventDefault();
            onClose?.();
          }

          return;
        }

        if (
          event.key !==
            'Tab' ||
          !trapFocus
        ) {
          return;
        }

        const focusables =
          getFocusable();

        if (
          focusables.length ===
          0
        ) {
          event.preventDefault();
          modal.focus();
          return;
        }

        const first =
          focusables[0];

        const last =
          focusables[
            focusables.length - 1
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
        } else if (
          document.activeElement ===
          last
        ) {
          event.preventDefault();
          first.focus();
        }
      };

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.clearTimeout(
        timer,
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    open,
    closeOnEscape,
    trapFocus,
    loading,
    onClose,
  ]);


  /* ----------------------------------------------------------
     Restore focus
     ---------------------------------------------------------- */

  useEffect(() => {
    if (
      open ||
      !restoreFocus ||
      !previousFocusRef.current
    ) {
      return;
    }

    const element =
      previousFocusRef.current;

    const timer =
      window.setTimeout(
        () => {
          if (
            element &&
            typeof element.focus ===
              'function' &&
            document.contains(
              element,
            )
          ) {
            element.focus();
          }
        },
        0,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [
    open,
    restoreFocus,
  ]);


  /* ----------------------------------------------------------
     Overlay click
     -------------------------------------------------------- */

  const handleOverlayClick =
    useCallback(
      (event) => {
        if (
          !closeOnOverlay ||
          loading
        ) {
          return;
        }

        if (
          event.target ===
          event.currentTarget
        ) {
          onClose?.();
        }
      },
      [
        closeOnOverlay,
        loading,
        onClose,
      ],
    );


  /* ----------------------------------------------------------
     Close button
     -------------------------------------------------------- */

  const handleClose =
    useCallback(() => {
      if (loading) {
        return;
      }

      onClose?.();
    }, [
      loading,
      onClose,
    ]);


  /* ----------------------------------------------------------
     Don't render closed modal
     -------------------------------------------------------- */

  if (
    !open ||
    !portalNodeRef.current
  ) {
    return null;
  }


  /* ----------------------------------------------------------
     Size
     -------------------------------------------------------- */

  const normalizedSize =
    MODAL_SIZES[size]
      ? size
      : 'md';


  /* ----------------------------------------------------------
     Classes
     -------------------------------------------------------- */

  const overlayClasses = [
    'dipo-modal-overlay',
    centered
      ? 'dipo-modal-overlay--center'
      : '',
    scrollable
      ? 'dipo-modal-overlay--scrollable'
      : '',
    overlayClassName,
  ]
    .filter(Boolean)
    .join(' ');


  const modalClasses = [
    'dipo-modal',
    `dipo-modal--${normalizedSize}`,
    scrollable
      ? 'dipo-modal--scrollable'
      : '',
    loading
      ? 'dipo-modal--loading'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');


  /* ----------------------------------------------------------
     Accessibility
     -------------------------------------------------------- */

  const ariaLabelledBy =
    title
      ? titleId
      : labelledBy;

  const ariaDescribedBy =
    description
      ? descriptionId
      : describedBy;


  /* ----------------------------------------------------------
     Header
     -------------------------------------------------------- */

  const renderHeader =
    () => {
      if (header) {
        return (
          <div className="dipo-modal__header">
            {header}

            {showClose && (
              <CloseButton
                label={closeLabel}
                onClick={
                  handleClose
                }
                disabled={loading}
              />
            )}
          </div>
        );
      }

      if (
        !title &&
        !description &&
        !showClose
      ) {
        return null;
      }

      return (
        <div className="dipo-modal__header">
          <div className="dipo-modal__heading">
            {title && (
              <h2
                id={titleId}
                className="dipo-modal__title"
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                id={descriptionId}
                className="dipo-modal__description"
              >
                {description}
              </p>
            )}
          </div>

          {showClose && (
            <CloseButton
              label={closeLabel}
              onClick={
                handleClose
              }
              disabled={loading}
            />
          )}
        </div>
      );
    };


  /* ----------------------------------------------------------
     Content
     -------------------------------------------------------- */

  const modalContent = (
    <div
      className={overlayClasses}
      onMouseDown={
        handleOverlayClick
      }
      role="presentation"
    >
      <section
        ref={setModalRef}
        className={modalClasses}
        style={{
          ...style,
          ...contentStyle,
        }}
        role={role}
        aria-modal="true"
        aria-labelledby={
          ariaLabelledBy ||
          undefined
        }
        aria-describedby={
          ariaDescribedBy ||
          undefined
        }
        tabIndex={-1}
        {...props}
      >
        {loading && (
          <div
            className="dipo-modal__loading-bar"
            aria-hidden="true"
          />
        )}

        {!childrenOnly &&
          renderHeader()}

        <div
          className="dipo-modal__body"
          data-modal-body=""
        >
          {children}
        </div>

        {!childrenOnly &&
          footer && (
            <div className="dipo-modal__footer">
              {footer}
            </div>
          )}

        {loading && (
          <div
            className="dipo-modal__loading-overlay"
            aria-hidden="true"
          >
            <span className="dipo-modal__loading-spinner">
              <svg
                viewBox="0 0 44 44"
                width="24"
                height="24"
                fill="none"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeOpacity=".15"
                />

                <path
                  d="M40 22a18 18 0 0 0-18-18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        )}
      </section>
    </div>
  );


  return createPortal(
    <>
      {modalContent}

      <style>
        {MODAL_STYLES}
      </style>
    </>,
    portalNodeRef.current,
  );
});


Modal.displayName =
  'Modal';


/* ============================================================
   CLOSE BUTTON
   ============================================================ */

function CloseButton({
  label,
  onClick,
  disabled,
}) {
  return (
    <button
      type="button"
      className="dipo-modal__close"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}


/* ============================================================
   MODAL HEADER
   ============================================================ */

function ModalHeader({
  children,
  className = '',
}) {
  return (
    <div
      className={[
        'dipo-modal__header',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="dipo-modal__heading">
        {children}
      </div>
    </div>
  );
}


/* ============================================================
   MODAL TITLE
   ============================================================ */

function ModalTitle({
  children,
  className = '',
  id,
}) {
  return (
    <h2
      id={id}
      className={[
        'dipo-modal__title',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </h2>
  );
}


/* ============================================================
   MODAL DESCRIPTION
   ============================================================ */

function ModalDescription({
  children,
  className = '',
  id,
}) {
  return (
    <p
      id={id}
      className={[
        'dipo-modal__description',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  );
}


/* ============================================================
   MODAL BODY
   ============================================================ */

function ModalBody({
  children,
  className = '',
}) {
  return (
    <div
      className={[
        'dipo-modal__body',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}


/* ============================================================
   MODAL FOOTER
   ============================================================ */

function ModalFooter({
  children,
  className = '',
}) {
  return (
    <div
      className={[
        'dipo-modal__footer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}


/* ============================================================
   CONFIRM MODAL
   ============================================================ */

function ConfirmModal({
  open,
  onClose,
  onConfirm,

  title = 'Are you sure?',
  description,

  confirmText = 'Confirm',
  cancelText = 'Cancel',

  destructive = false,
  loading = false,

  ...props
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      loading={loading}
      footer={
        <div className="dipo-modal__actions">
          <button
            type="button"
            className="dipo-modal__secondary-button"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={[
              'dipo-modal__primary-button',
              destructive
                ? 'dipo-modal__primary-button--danger'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <span className="dipo-modal__button-spinner">
                <svg
                  viewBox="0 0 44 44"
                  width="15"
                  height="15"
                  fill="none"
                >
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeOpacity=".25"
                  />

                  <path
                    d="M40 22a18 18 0 0 0-18-18"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            )}

            {confirmText}
          </button>
        </div>
      }
      {...props}
    />
  );
}


/* ============================================================
   SIZES
   ============================================================ */

const MODAL_SIZES = {
  xs: true,
  sm: true,
  md: true,
  lg: true,
  xl: true,
  full: true,
};


/* ============================================================
   FOCUSABLE SELECTOR
   ============================================================ */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');


/* ============================================================
   STYLES
   ============================================================ */

const MODAL_STYLES = `
  .dipo-modal-overlay {
    position: fixed;

    inset: 0;

    z-index: 9998;

    display: flex;

    align-items: flex-start;
    justify-content: center;

    width: 100%;
    height: 100%;

    padding:
      clamp(16px, 4vw, 48px);

    overflow-y: auto;

    background:
      rgba(15, 23, 42, .42);

    backdrop-filter:
      blur(10px);

    -webkit-backdrop-filter:
      blur(10px);

    overscroll-behavior: contain;

    animation:
      dipo-modal-overlay-in
      180ms
      ease-out;
  }


  .dipo-modal-overlay--center {
    align-items: center;
  }


  .dipo-modal-overlay--scrollable {
    overscroll-behavior-y: contain;
  }


  .dipo-modal {
    position: relative;

    display: flex;

    flex-direction: column;

    width: 100%;

    max-height:
      min(
        860px,
        calc(100dvh - 32px)
      );

    margin: auto;

    overflow: hidden;

    border:
      1px solid
      rgba(15, 23, 42, .09);

    border-radius:
      clamp(18px, 2vw, 26px);

    background:
      rgba(255,255,255,.98);

    color: #0f172a;

    box-shadow:
      0 30px 90px
        rgba(15,23,42,.18),
      0 8px 30px
        rgba(15,23,42,.08);

    animation:
      dipo-modal-in
      220ms
      cubic-bezier(.2,.8,.2,1);
  }


  .dipo-modal--xs {
    max-width: 360px;
  }


  .dipo-modal--sm {
    max-width: 460px;
  }


  .dipo-modal--md {
    max-width: 580px;
  }


  .dipo-modal--lg {
    max-width: 760px;
  }


  .dipo-modal--xl {
    max-width: 980px;
  }


  .dipo-modal--full {
    max-width:
      calc(100vw - 32px);

    max-height:
      calc(100dvh - 32px);
  }


  .dipo-modal__header {
    position: relative;

    display: flex;

    align-items: flex-start;

    justify-content: space-between;

    gap: 20px;

    padding:
      clamp(20px, 3vw, 28px)
      clamp(20px, 3vw, 32px)
      16px;

    flex: 0 0 auto;
  }


  .dipo-modal__heading {
    min-width: 0;

    padding-right: 4px;
  }


  .dipo-modal__title {
    margin: 0;

    color: #0f172a;

    font-size:
      clamp(18px, 2vw, 22px);

    line-height: 1.2;

    font-weight: 780;

    letter-spacing:
      -.035em;

    text-wrap: balance;
  }


  .dipo-modal__description {
    max-width: 600px;

    margin:
      8px 0 0;

    color: #64748b;

    font-size:
      clamp(13px, 1.4vw, 14px);

    line-height: 1.55;

    font-weight: 450;

    text-wrap: pretty;
  }


  .dipo-modal__close {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    flex: 0 0 auto;

    width: 36px;
    height: 36px;

    padding: 0;

    border:
      1px solid
      rgba(15,23,42,.08);

    border-radius: 11px;

    background: #fff;

    color: #64748b;

    cursor: pointer;

    transition:
      color 150ms ease,
      background 150ms ease,
      border-color 150ms ease,
      transform 150ms ease;
  }


  .dipo-modal__close:hover {
    color: #0f172a;

    background: #f8fafc;

    border-color:
      rgba(15,23,42,.14);

    transform:
      translateY(-1px);
  }


  .dipo-modal__close:active {
    transform:
      translateY(0)
      scale(.97);
  }


  .dipo-modal__close:focus-visible {
    outline:
      3px solid
      rgba(16,185,129,.18);

    outline-offset: 2px;

    border-color: #10b981;
  }


  .dipo-modal__close:disabled {
    opacity: .5;

    cursor: not-allowed;

    transform: none;
  }


  .dipo-modal__body {
    position: relative;

    flex: 1 1 auto;

    min-height: 0;

    padding:
      0
      clamp(20px, 3vw, 32px)
      clamp(20px, 3vw, 28px);

    overflow-y: auto;

    overscroll-behavior: contain;

    scrollbar-width: thin;

    scrollbar-color:
      #cbd5e1
      transparent;
  }


  .dipo-modal__body::-webkit-scrollbar {
    width: 7px;
  }


  .dipo-modal__body::-webkit-scrollbar-track {
    background: transparent;
  }


  .dipo-modal__body::-webkit-scrollbar-thumb {
    border-radius: 999px;

    background: #cbd5e1;
  }


  .dipo-modal__footer {
    display: flex;

    align-items: center;

    justify-content: flex-end;

    gap: 10px;

    flex: 0 0 auto;

    padding:
      16px
      clamp(20px, 3vw, 32px)
      clamp(20px, 3vw, 28px);

    border-top:
      1px solid
      rgba(15,23,42,.07);

    background:
      rgba(248,250,252,.62);
  }


  .dipo-modal__actions {
    display: flex;

    align-items: center;
    justify-content: flex-end;

    gap: 9px;

    width: 100%;
  }


  .dipo-modal__secondary-button,
  .dipo-modal__primary-button {
    min-height: 40px;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 8px;

    padding:
      0 15px;

    border-radius: 11px;

    font: inherit;

    font-size: 13px;

    line-height: 1;

    font-weight: 720;

    cursor: pointer;

    transition:
      transform 150ms ease,
      background 150ms ease,
      border-color 150ms ease,
      box-shadow 150ms ease,
      opacity 150ms ease;
  }


  .dipo-modal__secondary-button {
    border:
      1px solid
      rgba(15,23,42,.10);

    background: #fff;

    color: #334155;
  }


  .dipo-modal__secondary-button:hover {
    background: #f8fafc;

    border-color:
      rgba(15,23,42,.16);

    transform:
      translateY(-1px);
  }


  .dipo-modal__primary-button {
    border:
      1px solid
      #059669;

    background: #059669;

    color: #fff;

    box-shadow:
      0 5px 14px
      rgba(5,150,105,.18);
  }


  .dipo-modal__primary-button:hover {
    background: #047857;

    border-color: #047857;

    transform:
      translateY(-1px);

    box-shadow:
      0 7px 18px
      rgba(5,150,105,.22);
  }


  .dipo-modal__primary-button--danger {
    border-color: #dc2626;

    background: #dc2626;

    box-shadow:
      0 5px 14px
      rgba(220,38,38,.15);
  }


  .dipo-modal__primary-button--danger:hover {
    border-color: #b91c1c;

    background: #b91c1c;

    box-shadow:
      0 7px 18px
      rgba(220,38,38,.2);
  }


  .dipo-modal__secondary-button:focus-visible,
  .dipo-modal__primary-button:focus-visible {
    outline:
      3px solid
      rgba(16,185,129,.18);

    outline-offset: 2px;
  }


  .dipo-modal__secondary-button:disabled,
  .dipo-modal__primary-button:disabled {
    opacity: .55;

    cursor: not-allowed;

    transform: none;

    box-shadow: none;
  }


  .dipo-modal__loading-bar {
    position: absolute;

    top: 0;
    left: 0;

    z-index: 4;

    width: 100%;
    height: 2px;

    overflow: hidden;

    background:
      rgba(16,185,129,.12);
  }


  .dipo-modal__loading-bar::after {
    display: block;

    width: 35%;
    height: 100%;

    content: "";

    background:
      #10b981;

    animation:
      dipo-modal-loading
      1.2s
      ease-in-out
      infinite;
  }


  .dipo-modal__loading-overlay {
    position: absolute;

    inset: 0;

    z-index: 3;

    display: flex;

    align-items: center;
    justify-content: center;

    background:
      rgba(255,255,255,.55);

    backdrop-filter:
      blur(2px);

    -webkit-backdrop-filter:
      blur(2px);
  }


  .dipo-modal__loading-spinner {
    display: inline-flex;

    width: 32px;
    height: 32px;

    align-items: center;
    justify-content: center;

    color: #059669;

    border-radius: 50%;

    background:
      rgba(255,255,255,.95);

    box-shadow:
      0 8px 25px
      rgba(15,23,42,.12);
  }


  .dipo-modal__loading-spinner svg {
    animation:
      dipo-modal-spin
      .75s
      linear
      infinite;
  }


  .dipo-modal__button-spinner {
    display: inline-flex;

    width: 15px;
    height: 15px;

    align-items: center;
    justify-content: center;
  }


  .dipo-modal__button-spinner svg {
    animation:
      dipo-modal-spin
      .7s
      linear
      infinite;
  }


  @keyframes dipo-modal-overlay-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }


  @keyframes dipo-modal-in {
    from {
      opacity: 0;

      transform:
        translateY(10px)
        scale(.985);
    }

    to {
      opacity: 1;

      transform:
        translateY(0)
        scale(1);
    }
  }


  @keyframes dipo-modal-spin {
    to {
      transform:
        rotate(360deg);
    }
  }


  @keyframes dipo-modal-loading {
    0% {
      transform:
        translateX(-120%);
    }

    50% {
      transform:
        translateX(190%);
    }

    100% {
      transform:
        translateX(300%);
    }
  }


  @media (max-width: 640px) {
    .dipo-modal-overlay {
      align-items: flex-end;

      padding: 0;
    }


    .dipo-modal-overlay--center {
      align-items: flex-end;
    }


    .dipo-modal {
      max-width: 100%;

      max-height:
        calc(100dvh - 8px);

      border-radius:
        22px 22px 0 0;

      border-bottom: 0;

      animation:
        dipo-modal-mobile-in
        220ms
        cubic-bezier(.2,.8,.2,1);
    }


    .dipo-modal--xs,
    .dipo-modal--sm,
    .dipo-modal--md,
    .dipo-modal--lg,
    .dipo-modal--xl {
      max-width: 100%;
    }


    .dipo-modal--full {
      max-width: 100%;

      max-height: 100dvh;

      min-height: 100dvh;

      border-radius: 0;
    }


    .dipo-modal__header {
      padding:
        20px
        20px
        14px;
    }


    .dipo-modal__body {
      padding:
        0
        20px
        20px;
    }


    .dipo-modal__footer {
      padding:
        14px
        20px
        max(
          20px,
          env(safe-area-inset-bottom)
        );
    }


    .dipo-modal__actions {
      flex-direction: column-reverse;
    }


    .dipo-modal__secondary-button,
    .dipo-modal__primary-button {
      width: 100%;

      min-height: 46px;
    }


    .dipo-modal__close {
      width: 34px;
      height: 34px;
    }
  }


  @keyframes dipo-modal-mobile-in {
    from {
      opacity: 0;

      transform:
        translateY(24px);
    }

    to {
      opacity: 1;

      transform:
        translateY(0);
    }
  }


  @media (prefers-reduced-motion: reduce) {
    .dipo-modal-overlay,
    .dipo-modal {
      animation: none;
    }


    .dipo-modal__loading-bar::after,
    .dipo-modal__loading-spinner svg,
    .dipo-modal__button-spinner svg {
      animation: none;
    }


    .dipo-modal__close,
    .dipo-modal__primary-button,
    .dipo-modal__secondary-button {
      transition: none;
    }
  }
`;


/* ============================================================
   EXPORTS
   ============================================================ */

export {
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ConfirmModal,
};

export default Modal;