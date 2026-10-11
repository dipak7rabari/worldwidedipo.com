'use client';

import {
  forwardRef,
  useId,
} from 'react';


/* ============================================================
   SELECT
   ============================================================ */

const Select = forwardRef(function Select(
  {
    /* --------------------------------------------------------
       Content
       -------------------------------------------------------- */

    label,
    labelExtra,

    hint,
    error,
    success,
    successMessage,

    placeholder = 'Select an option',

    options = [],

    children,

    /* --------------------------------------------------------
       State
       -------------------------------------------------------- */

    loading = false,

    clearable = false,
    onClear,

    /* --------------------------------------------------------
       Visual
       -------------------------------------------------------- */

    size = 'md',
    variant = 'default',

    startIcon,
    endIcon,

    required = false,

    /* --------------------------------------------------------
       Accessibility
       -------------------------------------------------------- */

    id: providedId,

    /* --------------------------------------------------------
       Styling
       -------------------------------------------------------- */

    className = '',
    wrapperClassName = '',
    labelClassName = '',

    style,

    /* --------------------------------------------------------
       Native Select
       -------------------------------------------------------- */

    disabled = false,

    ...props
  },
  ref,
) {
  const generatedId = useId();

  const id =
    providedId ||
    `dipo-select-${generatedId}`;

  const hintId =
    `${id}-hint`;

  const errorId =
    `${id}-error`;

  const successId =
    `${id}-success`;

  const hasError =
    Boolean(error);

  const hasSuccess =
    Boolean(
      success ||
      successMessage,
    );

  const describedBy = [
    hasError
      ? errorId
      : null,

    !hasError && hint
      ? hintId
      : null,

    !hasError &&
    !hint &&
    hasSuccess
      ? successId
      : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;


  const normalizedSize =
    SELECT_SIZES[size]
      ? size
      : 'md';


  const normalizedVariant =
    SELECT_VARIANTS[variant]
      ? variant
      : 'default';


  const classes = [
    'dipo-select',
    `dipo-select--${normalizedSize}`,
    `dipo-select--${normalizedVariant}`,

    hasError
      ? 'dipo-select--error'
      : '',

    hasSuccess
      ? 'dipo-select--success'
      : '',

    disabled
      ? 'dipo-select--disabled'
      : '',

    loading
      ? 'dipo-select--loading'
      : '',

    startIcon
      ? 'dipo-select--has-start-icon'
      : '',

    className,
  ]
    .filter(Boolean)
    .join(' ');


  const selectedValue =
    props.value ??
    props.defaultValue;


  const hasValue =
    selectedValue !== undefined &&
    selectedValue !== null &&
    selectedValue !== '';


  const handleClear =
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (
        disabled ||
        loading
      ) {
        return;
      }

      onClear?.(event);
    };


  const renderOptions =
    () => {
      if (
        children !== undefined &&
        children !== null
      ) {
        return children;
      }

      return options.map(
        (option, index) => {
          if (
            option === null ||
            option === undefined
          ) {
            return null;
          }

          if (
            typeof option ===
            'string' ||
            typeof option ===
            'number'
          ) {
            return (
              <option
                key={`${option}-${index}`}
                value={option}
              >
                {option}
              </option>
            );
          }

          if (
            option.type ===
            'group'
          ) {
            return (
              <optgroup
                key={
                  option.value ??
                  option.label ??
                  index
                }
                label={
                  option.label
                }
              >
                {(
                  option.options ||
                  []
                ).map(
                  (
                    child,
                    childIndex,
                  ) => (
                    <option
                      key={
                        child.value ??
                        child.label ??
                        childIndex
                      }
                      value={
                        child.value
                      }
                      disabled={
                        child.disabled
                      }
                    >
                      {child.label}
                    </option>
                  ),
                )}
              </optgroup>
            );
          }

          return (
            <option
              key={
                option.value ??
                option.label ??
                index
              }
              value={
                option.value
              }
              disabled={
                option.disabled
              }
            >
              {option.label}
            </option>
          );
        },
      );
    };


  return (
    <div
      className={[
        'dipo-select-field',
        wrapperClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {(label ||
        labelExtra) && (
        <div className="dipo-select__label-row">
          {label && (
            <label
              htmlFor={id}
              className={[
                'dipo-select__label',
                labelClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span>
                {label}
              </span>

              {required && (
                <span
                  className="dipo-select__required"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </label>
          )}

          {labelExtra && (
            <span className="dipo-select__label-extra">
              {labelExtra}
            </span>
          )}
        </div>
      )}

      <div className={classes}>
        {startIcon && (
          <span
            className="dipo-select__start-icon"
            aria-hidden="true"
          >
            {startIcon}
          </span>
        )}

        <select
          ref={ref}
          id={id}
          className="dipo-select__native"
          disabled={
            disabled ||
            loading
          }
          required={required}
          aria-invalid={
            hasError
              ? 'true'
              : 'false'
          }
          aria-describedby={
            describedBy
          }
          {...props}
        >
          {placeholder && (
            <option
              value=""
              disabled={
                !clearable
              }
            >
              {placeholder}
            </option>
          )}

          {renderOptions()}
        </select>

        {loading ? (
          <span
            className="dipo-select__loading"
            aria-hidden="true"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 44 44"
              fill="none"
            >
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                strokeOpacity=".18"
              />

              <path
                d="M40 22a18 18 0 0 0-18-18"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : (
          <>
            {clearable &&
              hasValue &&
              !disabled &&
              onClear && (
                <button
                  type="button"
                  className="dipo-select__clear"
                  onMouseDown={
                    handleClear
                  }
                  onClick={
                    handleClear
                  }
                  tabIndex={-1}
                  aria-label="Clear selection"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}

            <span
              className="dipo-select__chevron"
              aria-hidden="true"
            >
              {endIcon || (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </>
        )}
      </div>

      {hasError ? (
        <p
          id={errorId}
          className="dipo-select__message dipo-select__message--error"
          role="alert"
        >
          <StatusIcon type="error" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p
          id={hintId}
          className="dipo-select__message"
        >
          {hint}
        </p>
      ) : hasSuccess ? (
        <p
          id={successId}
          className="dipo-select__message dipo-select__message--success"
        >
          <StatusIcon type="success" />
          <span>
            {successMessage ||
              success}
          </span>
        </p>
      ) : null}

      <style>
        {SELECT_STYLES}
      </style>
    </div>
  );
});


Select.displayName =
  'Select';


/* ============================================================
   STATUS ICON
   ============================================================ */

function StatusIcon({
  type,
}) {
  if (type === 'success') {
    return (
      <svg
        className="dipo-select__status-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="m8 12 2.5 2.5L16 9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className="dipo-select__status-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 7.5v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="16"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}


/* ============================================================
   PRESET
   ============================================================ */

function NativeSelect(props) {
  return (
    <Select
      variant="default"
      {...props}
    />
  );
}


/* ============================================================
   CONFIG
   ============================================================ */

const SELECT_SIZES = {
  sm: true,
  md: true,
  lg: true,
};


const SELECT_VARIANTS = {
  default: true,
  soft: true,
  ghost: true,
};


/* ============================================================
   STYLES
   ============================================================ */

const SELECT_STYLES = `
  .dipo-select-field {
    --dipo-select-border:
      rgba(15, 23, 42, .11);

    --dipo-select-border-hover:
      rgba(15, 23, 42, .18);

    --dipo-select-text:
      #0f172a;

    --dipo-select-muted:
      #64748b;

    --dipo-select-placeholder:
      #94a3b8;

    --dipo-select-focus:
      rgba(16, 185, 129, .16);

    --dipo-select-accent:
      #059669;

    width: 100%;

    min-width: 0;

    font-family: inherit;
  }


  .dipo-select__label-row {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 12px;

    margin-bottom: 7px;

    min-width: 0;
  }


  .dipo-select__label {
    display: inline-flex;

    align-items: center;

    gap: 4px;

    min-width: 0;

    color: #334155;

    font-size: 13px;

    line-height: 1.35;

    font-weight: 700;

    letter-spacing: -.005em;

    cursor: pointer;
  }


  .dipo-select__required {
    color: #dc2626;

    font-weight: 800;
  }


  .dipo-select__label-extra {
    flex: 0 0 auto;

    color: #94a3b8;

    font-size: 11px;

    line-height: 1.3;

    font-weight: 600;
  }


  .dipo-select {
    position: relative;

    display: flex;

    align-items: center;

    width: 100%;

    min-width: 0;

    border:
      1px solid
      var(--dipo-select-border);

    border-radius: 13px;

    background: #fff;

    color:
      var(--dipo-select-text);

    box-shadow:
      0 1px 2px
      rgba(15,23,42,.025);

    transition:
      border-color 150ms ease,
      box-shadow 150ms ease,
      background 150ms ease;
  }


  .dipo-select:hover {
    border-color:
      var(--dipo-select-border-hover);
  }


  .dipo-select:focus-within {
    border-color:
      #10b981;

    box-shadow:
      0 0 0 4px
      var(--dipo-select-focus);
  }


  .dipo-select--sm {
    min-height: 38px;

    border-radius: 10px;
  }


  .dipo-select--md {
    min-height: 44px;
  }


  .dipo-select--lg {
    min-height: 50px;

    border-radius: 14px;
  }


  .dipo-select--soft {
    background:
      #f8fafc;

    border-color:
      transparent;
  }


  .dipo-select--soft:hover {
    background: #f1f5f9;
  }


  .dipo-select--ghost {
    background:
      transparent;

    border-color:
      rgba(15,23,42,.07);

    box-shadow: none;
  }


  .dipo-select--error {
    border-color:
      rgba(220,38,38,.45);
  }


  .dipo-select--error:hover {
    border-color:
      rgba(220,38,38,.62);
  }


  .dipo-select--error:focus-within {
    border-color:
      #dc2626;

    box-shadow:
      0 0 0 4px
      rgba(220,38,38,.11);
  }


  .dipo-select--success {
    border-color:
      rgba(5,150,105,.34);
  }


  .dipo-select--disabled {
    opacity: .62;

    cursor: not-allowed;

    background:
      #f8fafc;
  }


  .dipo-select__native {
    appearance: none;

    -webkit-appearance: none;

    display: block;

    width: 100%;

    min-width: 0;

    height: 100%;

    padding:
      0 42px
      0 13px;

    border: 0;

    outline: 0;

    background:
      transparent;

    color:
      var(--dipo-select-text);

    font: inherit;

    font-size: 14px;

    line-height: 1.35;

    font-weight: 550;

    cursor: pointer;

    text-overflow: ellipsis;
  }


  .dipo-select--sm
  .dipo-select__native {
    padding-left: 11px;
    padding-right: 38px;

    font-size: 13px;
  }


  .dipo-select--lg
  .dipo-select__native {
    padding-left: 15px;
    padding-right: 46px;

    font-size: 15px;
  }


  .dipo-select--has-start-icon
  .dipo-select__native {
    padding-left: 40px;
  }


  .dipo-select--sm
  .dipo-select--has-start-icon
  .dipo-select__native {
    padding-left: 35px;
  }


  .dipo-select--lg
  .dipo-select--has-start-icon
  .dipo-select__native {
    padding-left: 44px;
  }


  .dipo-select__native:disabled {
    cursor: not-allowed;
  }


  .dipo-select__start-icon {
    position: absolute;

    left: 13px;

    top: 50%;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    width: 18px;
    height: 18px;

    color: #64748b;

    pointer-events: none;

    transform:
      translateY(-50%);
  }


  .dipo-select--sm
  .dipo-select__start-icon {
    left: 11px;

    width: 16px;
    height: 16px;
  }


  .dipo-select--lg
  .dipo-select__start-icon {
    left: 15px;

    width: 20px;
    height: 20px;
  }


  .dipo-select__chevron {
    position: absolute;

    top: 50%;
    right: 12px;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    width: 20px;
    height: 20px;

    color: #64748b;

    pointer-events: none;

    transform:
      translateY(-50%);
  }


  .dipo-select--sm
  .dipo-select__chevron {
    right: 10px;

    width: 18px;
    height: 18px;
  }


  .dipo-select--lg
  .dipo-select__chevron {
    right: 14px;

    width: 21px;
    height: 21px;
  }


  .dipo-select__clear {
    position: absolute;

    top: 50%;
    right: 35px;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    width: 24px;
    height: 24px;

    padding: 0;

    border: 0;

    border-radius: 7px;

    background:
      transparent;

    color: #94a3b8;

    cursor: pointer;

    transform:
      translateY(-50%);

    transition:
      color 140ms ease,
      background 140ms ease;
  }


  .dipo-select__clear:hover {
    color: #334155;

    background:
      #f1f5f9;
  }


  .dipo-select__clear:focus-visible {
    outline:
      2px solid
      #10b981;

    outline-offset: 1px;
  }


  .dipo-select__loading {
    position: absolute;

    top: 50%;
    right: 12px;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    width: 18px;
    height: 18px;

    color: #059669;

    pointer-events: none;

    transform:
      translateY(-50%);
  }


  .dipo-select__loading svg {
    animation:
      dipo-select-spin
      .75s
      linear
      infinite;
  }


  .dipo-select__message {
    display: flex;

    align-items: flex-start;

    gap: 5px;

    margin:
      6px 1px 0;

    color:
      var(--dipo-select-muted);

    font-size: 11px;

    line-height: 1.45;

    font-weight: 500;
  }


  .dipo-select__message--error {
    color: #dc2626;
  }


  .dipo-select__message--success {
    color: #047857;
  }


  .dipo-select__status-icon {
    flex: 0 0 auto;

    margin-top: 1px;
  }


  @keyframes dipo-select-spin {
    to {
      transform:
        rotate(360deg);
    }
  }


  @media (max-width: 640px) {
    .dipo-select__native {
      font-size: 16px;
    }

    .dipo-select--sm
    .dipo-select__native {
      font-size: 16px;
    }

    .dipo-select--lg
    .dipo-select__native {
      font-size: 16px;
    }
  }


  @media (prefers-reduced-motion: reduce) {
    .dipo-select,
    .dipo-select__clear {
      transition: none;
    }

    .dipo-select__loading svg {
      animation: none;
    }
  }
`;


/* ============================================================
   EXPORTS
   ============================================================ */

export {
  NativeSelect,
};

export default Select;