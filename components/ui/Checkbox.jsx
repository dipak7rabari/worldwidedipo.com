'use client';

import {
  forwardRef,
  useId,
  useMemo,
} from 'react';

/**
 * Worldwide DIPO
 * ============================================================
 * Premium production-grade Checkbox
 *
 * Supports:
 * - controlled / uncontrolled usage
 * - indeterminate state
 * - label + description
 * - error / success state
 * - disabled state
 * - required state
 * - loading state
 * - custom size
 * - custom accent color
 * - full accessible keyboard behavior
 * - native checkbox semantics
 * - forwarded ref
 * - form compatibility
 * - custom content
 *
 * No external icon dependency.
 * No styled-jsx.
 * No dependency on another UI component.
 * ============================================================
 */


/* ============================================================
   CHECK ICON
   ============================================================ */

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 12.5 9.3 17 19 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


/* ============================================================
   MINUS ICON — INDETERMINATE
   ============================================================ */

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 12h12"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}


/* ============================================================
   LOADING SPINNER
   ============================================================ */

function LoadingSpinner({
  size = 14,
}) {
  return (
    <span
      className="dipo-checkbox__spinner"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}


/* ============================================================
   MAIN CHECKBOX
   ============================================================ */

const Checkbox = forwardRef(
  function Checkbox(
    {
      /*
       * --------------------------------------------------------
       * Value / state
       * --------------------------------------------------------
       */

      checked,

      defaultChecked = false,

      indeterminate = false,

      disabled = false,

      required = false,

      loading = false,

      /*
       * --------------------------------------------------------
       * Content
       * --------------------------------------------------------
       */

      label,

      description,

      children,

      error,

      hint,

      success,

      /*
       * --------------------------------------------------------
       * Visual
       * --------------------------------------------------------
       */

      size = 'md',

      accent = '#059669',

      variant = 'default',

      /*
       * --------------------------------------------------------
       * Native input
       * --------------------------------------------------------
       */

      name,

      value,

      id,

      form,

      autoFocus = false,

      tabIndex,

      /*
       * --------------------------------------------------------
       * Accessibility
       * --------------------------------------------------------
       */

      'aria-label':
        ariaLabel,

      'aria-labelledby':
        ariaLabelledBy,

      'aria-describedby':
        ariaDescribedBy,

      'aria-invalid':
        ariaInvalid,

      'aria-errormessage':
        ariaErrorMessage,

      /*
       * --------------------------------------------------------
       * Events
       * --------------------------------------------------------
       */

      onChange,

      onBlur,

      onFocus,

      onKeyDown,

      onKeyUp,

      onClick,

      /*
       * --------------------------------------------------------
       * Styling
       * --------------------------------------------------------
       */

      className = '',

      style,

      labelClassName = '',

      /*
       * --------------------------------------------------------
       * Misc native props
       * --------------------------------------------------------
       */

      title,

      ...rest
    },
    forwardedRef,
  ) {
    const generatedId =
      useId();

    const checkboxId =
      id ||
      `dipo-checkbox-${generatedId.replace(
        /:/g,
        '',
      )}`;

    const descriptionId =
      `${checkboxId}-description`;

    const errorId =
      `${checkboxId}-error`;

    const hintId =
      `${checkboxId}-hint`;


    /*
     * ----------------------------------------------------------
     * Size configuration
     * ----------------------------------------------------------
     */

    const sizes = {
      sm: {
        box: 17,
        icon: 12,
        gap: 9,
        title: 12,
        description: 11,
        radius: 5,
      },

      md: {
        box: 20,
        icon: 14,
        gap: 10,
        title: 13,
        description: 12,
        radius: 6,
      },

      lg: {
        box: 23,
        icon: 16,
        gap: 11,
        title: 14,
        description: 13,
        radius: 7,
      },
    };

    const resolvedSize =
      sizes[size]
        ? size
        : 'md';

    const sizing =
      sizes[
        resolvedSize
      ];


    /*
     * ----------------------------------------------------------
     * Controlled state
     * ----------------------------------------------------------
     *
     * We intentionally don't create our own checked state.
     * Native input handles uncontrolled state.
     */

    const isControlled =
      checked !==
      undefined;

    const isChecked =
      isControlled
        ? Boolean(
            checked,
          )
        : undefined;

    const isDisabled =
      disabled ||
      loading;


    /*
     * ----------------------------------------------------------
     * Validation state
     * ----------------------------------------------------------
     */

    const hasError =
      Boolean(error) ||
      ariaInvalid ===
        true ||
      ariaInvalid ===
        'true';

    const hasSuccess =
      Boolean(success) &&
      !hasError;


    /*
     * ----------------------------------------------------------
     * Description IDs
     * ----------------------------------------------------------
     */

    const describedBy =
      [
        ariaDescribedBy,

        description
          ? descriptionId
          : null,

        error
          ? errorId
          : null,

        hint
          ? hintId
          : null,
      ]
        .filter(Boolean)
        .join(' ') ||
      undefined;


    /*
     * ----------------------------------------------------------
     * Dynamic style
     * ----------------------------------------------------------
     */

    const rootStyle =
      useMemo(
        () => ({
          '--dipo-checkbox-accent':
            accent,

          '--dipo-checkbox-box':
            `${sizing.box}px`,

          '--dipo-checkbox-icon':
            `${sizing.icon}px`,

          '--dipo-checkbox-gap':
            `${sizing.gap}px`,

          '--dipo-checkbox-radius':
            `${sizing.radius}px`,

          ...style,
        }),
        [
          accent,
          sizing,
          style,
        ],
      );


    /*
     * ----------------------------------------------------------
     * Classes
     * ----------------------------------------------------------
     */

    const rootClasses = [
      'dipo-checkbox',

      `dipo-checkbox--${resolvedSize}`,

      `dipo-checkbox--${variant}`,

      hasError
        ? 'dipo-checkbox--error'
        : '',

      hasSuccess
        ? 'dipo-checkbox--success'
        : '',

      isDisabled
        ? 'dipo-checkbox--disabled'
        : '',

      loading
        ? 'dipo-checkbox--loading'
        : '',

      indeterminate
        ? 'dipo-checkbox--indeterminate'
        : '',

      className,
    ]
      .filter(Boolean)
      .join(' ');


    /*
     * ----------------------------------------------------------
     * Ref handler
     * ----------------------------------------------------------
     *
     * Important:
     * Native indeterminate is a DOM property, not an HTML
     * attribute. We set it directly every render.
     */

    const setInputRef =
      (node) => {
        if (node) {
          node.indeterminate =
            Boolean(
              indeterminate,
            );
        }

        if (
          typeof forwardedRef ===
          'function'
        ) {
          forwardedRef(
            node,
          );
        } else if (
          forwardedRef
        ) {
          forwardedRef.current =
            node;
        }
      };


    /*
     * ----------------------------------------------------------
     * Handle change
     * ----------------------------------------------------------
     */

    const handleChange =
      (event) => {
        if (
          isDisabled
        ) {
          event.preventDefault();
          return;
        }

        onChange?.(
          event,
        );
      };


    /*
     * ----------------------------------------------------------
     * Handle click
     * ----------------------------------------------------------
     */

    const handleClick =
      (event) => {
        if (
          isDisabled
        ) {
          event.preventDefault();
          return;
        }

        onClick?.(
          event,
        );
      };


    /*
     * ----------------------------------------------------------
     * Render
     * ----------------------------------------------------------
     */

    return (
      <>
        <div
          className={
            rootClasses
          }
          style={
            rootStyle
          }
        >
          <label
            className={[
              'dipo-checkbox__label',
              labelClassName,
            ]
              .filter(Boolean)
              .join(' ')}
            htmlFor={
              checkboxId
            }
          >
            <span
              className="dipo-checkbox__control"
            >
              <input
                ref={
                  setInputRef
                }
                id={
                  checkboxId
                }
                type="checkbox"
                name={
                  name
                }
                value={
                  value
                }
                form={
                  form
                }
                checked={
                  isChecked
                }
                defaultChecked={
                  isControlled
                    ? undefined
                    : defaultChecked
                }
                disabled={
                  isDisabled
                }
                required={
                  required
                }
                autoFocus={
                  autoFocus
                }
                tabIndex={
                  tabIndex
                }
                title={
                  title
                }
                aria-label={
                  ariaLabel
                }
                aria-labelledby={
                  ariaLabelledBy
                }
                aria-describedby={
                  describedBy
                }
                aria-invalid={
                  hasError
                    ? 'true'
                    : ariaInvalid
                }
                aria-errormessage={
                  ariaErrorMessage ||
                  (
                    error
                      ? errorId
                      : undefined
                  )
                }
                aria-busy={
                  loading
                    ? 'true'
                    : undefined
                }
                onChange={
                  handleChange
                }
                onBlur={
                  onBlur
                }
                onFocus={
                  onFocus
                }
                onKeyDown={
                  onKeyDown
                }
                onKeyUp={
                  onKeyUp
                }
                onClick={
                  handleClick
                }
                {...rest}
              />

              <span
                className="dipo-checkbox__visual"
                aria-hidden="true"
              >
                {loading ? (
                  <LoadingSpinner
                    size={
                      Math.max(
                        sizing.icon -
                          1,
                        11,
                      )
                    }
                  />
                ) : indeterminate ? (
                  <span
                    className="dipo-checkbox__icon"
                  >
                    <MinusIcon />
                  </span>
                ) : (
                  <span
                    className="dipo-checkbox__icon"
                  >
                    <CheckIcon />
                  </span>
                )}
              </span>
            </span>

            {(label !==
              undefined ||
              children !==
                undefined ||
              description ||
              error ||
              hint ||
              success) && (
              <span
                className="dipo-checkbox__content"
              >
                {(label !==
                  undefined ||
                  children !==
                    undefined) && (
                  <span
                    className="dipo-checkbox__title"
                  >
                    {label ??
                      children}

                    {required && (
                      <span
                        className="dipo-checkbox__required"
                        aria-hidden="true"
                      >
                        *
                      </span>
                    )}
                  </span>
                )}

                {description && (
                  <span
                    id={
                      descriptionId
                    }
                    className="dipo-checkbox__description"
                  >
                    {
                      description
                    }
                  </span>
                )}

                {error && (
                  <span
                    id={
                      errorId
                    }
                    className="dipo-checkbox__message dipo-checkbox__message--error"
                    role="alert"
                  >
                    {error}
                  </span>
                )}

                {!error &&
                  success && (
                    <span
                      className="dipo-checkbox__message dipo-checkbox__message--success"
                    >
                      {
                        success
                      }
                    </span>
                  )}

                {!error &&
                  hint && (
                    <span
                      id={
                        hintId
                      }
                      className="dipo-checkbox__hint"
                    >
                      {hint}
                    </span>
                  )}
              </span>
            )}
          </label>
        </div>

        <style>
          {CHECKBOX_STYLES}
        </style>
      </>
    );
  },
);

Checkbox.displayName =
  'Checkbox';


/* ============================================================
   STYLES
   ============================================================ */

const CHECKBOX_STYLES = `
  .dipo-checkbox {
    --dipo-checkbox-accent: #059669;

    display: block;

    width: 100%;

    box-sizing: border-box;

    color: #172033;
  }

  .dipo-checkbox__label {
    display: inline-flex;

    align-items: flex-start;

    gap: var(
      --dipo-checkbox-gap
    );

    width: 100%;

    max-width: 100%;

    cursor: pointer;

    user-select: none;

    -webkit-user-select: none;

    -webkit-tap-highlight-color:
      transparent;
  }

  .dipo-checkbox--disabled
    .dipo-checkbox__label {
    cursor:
      not-allowed;
  }

  .dipo-checkbox__control {
    position: relative;

    width: var(
      --dipo-checkbox-box
    );

    min-width: var(
      --dipo-checkbox-box
    );

    height: var(
      --dipo-checkbox-box
    );

    flex:
      0 0
      var(
        --dipo-checkbox-box
      );

    margin-top:
      1px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;
  }

  .dipo-checkbox__control
    input {
    position:
      absolute;

    inset:
      0;

    width:
      100%;

    height:
      100%;

    margin:
      0;

    opacity:
      0;

    cursor:
      inherit;

    z-index:
      2;
  }

  .dipo-checkbox__visual {
    position:
      relative;

    width:
      var(
        --dipo-checkbox-box
      );

    height:
      var(
        --dipo-checkbox-box
      );

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    border:
      1.5px solid
      #cbd5e1;

    border-radius:
      var(
        --dipo-checkbox-radius
      );

    background:
      #ffffff;

    color:
      #ffffff;

    box-sizing:
      border-box;

    transition:
      background 150ms ease,
      border-color 150ms ease,
      box-shadow 150ms ease,
      transform 120ms ease;
  }

  .dipo-checkbox__visual::after {
    content:
      "";

    position:
      absolute;

    inset:
      -5px;

    border-radius:
      inherit;

    background:
      var(
        --dipo-checkbox-accent
      );

    opacity:
      0;

    transform:
      scale(.75);

    transition:
      opacity 150ms ease,
      transform 150ms ease;

    z-index:
      -1;
  }

  .dipo-checkbox__icon {
    width:
      var(
        --dipo-checkbox-icon
      );

    height:
      var(
        --dipo-checkbox-icon
      );

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    opacity:
      0;

    transform:
      scale(.65);

    transition:
      opacity 130ms ease,
      transform 130ms cubic-bezier(
        .2,
        .8,
        .2,
        1.2
      );
  }

  .dipo-checkbox__icon svg {
    display:
      block;

    width:
      100%;

    height:
      100%;
  }

  .dipo-checkbox__control
    input:checked
    + .dipo-checkbox__visual,

  .dipo-checkbox--indeterminate
    .dipo-checkbox__visual {
    background:
      var(
        --dipo-checkbox-accent
      );

    border-color:
      var(
        --dipo-checkbox-accent
      );

    box-shadow:
      0 2px 7px
      color-mix(
        in srgb,
        var(
          --dipo-checkbox-accent
        ) 22%,
        transparent
      );
  }

  .dipo-checkbox__control
    input:checked
    + .dipo-checkbox__visual
    .dipo-checkbox__icon,

  .dipo-checkbox--indeterminate
    .dipo-checkbox__icon {
    opacity:
      1;

    transform:
      scale(1);
  }

  .dipo-checkbox__control
    input:focus-visible
    + .dipo-checkbox__visual {
    outline:
      3px solid
      color-mix(
        in srgb,
        var(
          --dipo-checkbox-accent
        ) 22%,
        transparent
      );

    outline-offset:
      3px;
  }

  .dipo-checkbox__label:hover
    .dipo-checkbox__visual {
    border-color:
      color-mix(
        in srgb,
        var(
          --dipo-checkbox-accent
        ) 52%,
        #cbd5e1
      );
  }

  .dipo-checkbox__label:active
    .dipo-checkbox__visual {
    transform:
      scale(.95);
  }

  .dipo-checkbox__content {
    min-width:
      0;

    display:
      flex;

    flex-direction:
      column;

    gap:
      4px;

    padding-top:
      0;
  }

  .dipo-checkbox__title {
    display:
      block;

    color:
      #172033;

    font-size:
      var(
        --dipo-checkbox-title-size,
        13px
      );

    font-weight:
      750;

    line-height:
      1.4;

    letter-spacing:
      -.01em;
  }

  .dipo-checkbox--sm
    .dipo-checkbox__title {
    font-size:
      12px;
  }

  .dipo-checkbox--md
    .dipo-checkbox__title {
    font-size:
      13px;
  }

  .dipo-checkbox--lg
    .dipo-checkbox__title {
    font-size:
      14px;
  }

  .dipo-checkbox__required {
    margin-left:
      3px;

    color:
      #dc2626;
  }

  .dipo-checkbox__description,
  .dipo-checkbox__hint,
  .dipo-checkbox__message {
    display:
      block;

    font-size:
      var(
        --dipo-checkbox-description-size,
        12px
      );

    line-height:
      1.55;
  }

  .dipo-checkbox__description {
    color:
      #64748b;
  }

  .dipo-checkbox__hint {
    color:
      #94a3b8;
  }

  .dipo-checkbox__message--error {
    color:
      #dc2626;

    font-weight:
      600;
  }

  .dipo-checkbox__message--success {
    color:
      #059669;

    font-weight:
      600;
  }

  .dipo-checkbox--error
    .dipo-checkbox__visual {
    border-color:
      #ef4444;
  }

  .dipo-checkbox--error
    .dipo-checkbox__label:hover
    .dipo-checkbox__visual {
    border-color:
      #dc2626;
  }

  .dipo-checkbox--success
    .dipo-checkbox__visual {
    border-color:
      #86efac;
  }

  .dipo-checkbox--disabled
    .dipo-checkbox__visual {
    background:
      #f8fafc;

    border-color:
      #e2e8f0;

    box-shadow:
      none;
  }

  .dipo-checkbox--disabled
    .dipo-checkbox__title {
    color:
      #94a3b8;
  }

  .dipo-checkbox--disabled
    .dipo-checkbox__description {
    color:
      #cbd5e1;
  }

  .dipo-checkbox--loading
    .dipo-checkbox__visual {
    background:
      #f8fafc;

    border-color:
      #dbe2e9;
  }

  .dipo-checkbox__spinner {
    display:
      block;

    border:
      2px solid
      #dbe5df;

    border-top-color:
      var(
        --dipo-checkbox-accent
      );

    border-radius:
      50%;

    animation:
      dipo-checkbox-spin
      .7s linear infinite;
  }

  .dipo-checkbox--dark
    .dipo-checkbox__title {
    color:
      #ffffff;
  }

  .dipo-checkbox--dark
    .dipo-checkbox__description {
    color:
      #94a3b8;
  }

  .dipo-checkbox--compact
    .dipo-checkbox__label {
    width:
      auto;
  }

  @keyframes dipo-checkbox-spin {
    from {
      transform:
        rotate(0deg);
    }

    to {
      transform:
        rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    .dipo-checkbox__label {
      gap:
        max(
          8px,
          var(
            --dipo-checkbox-gap
          )
        );
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dipo-checkbox__visual,
    .dipo-checkbox__icon,
    .dipo-checkbox__spinner {
      transition:
        none !important;

      animation:
        none !important;
    }
  }
`;


/* ============================================================
   EXPORT
   ============================================================ */

export default Checkbox;