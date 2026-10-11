'use client';

import {
  forwardRef,
  useId,
  useMemo,
  useState,
} from 'react';


/* ============================================================
   ICONS
   ============================================================ */

function EyeIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}


function EyeOffIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M10.6 6.25A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a15.7 15.7 0 0 1-3.1 3.65M6.1 6.8C3.85 8.6 2.5 12 2.5 12s3.5 6 9.5 6c1.35 0 2.6-.3 3.7-.75"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function XIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function CheckIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
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


function LoaderIcon({ size = 16 }) {
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
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity=".22"
      />
      <path
        d="M20.5 12a8.5 8.5 0 0 0-8.5-8.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


/* ============================================================
   INPUT
   ============================================================ */

const Input = forwardRef(function Input(
  {
    /* --------------------------------------------------------
       Label
       -------------------------------------------------------- */

    label,
    labelExtra,
    required = false,

    /* --------------------------------------------------------
       Help / validation
       -------------------------------------------------------- */

    hint,
    error,
    success,
    successMessage,

    /* --------------------------------------------------------
       Visual
       -------------------------------------------------------- */

    size = 'md',
    variant = 'default',

    prefix,
    suffix,
    startIcon,
    endIcon,

    /* --------------------------------------------------------
       Behaviour
       -------------------------------------------------------- */

    clearable = false,
    onClear,

    passwordToggle = false,

    loading = false,

    /* --------------------------------------------------------
       Character count
       -------------------------------------------------------- */

    showCount = false,
    maxLength,

    /* --------------------------------------------------------
       Native input
       -------------------------------------------------------- */

    type = 'text',
    id,
    name,
    value,
    defaultValue,
    placeholder,

    disabled = false,
    readOnly = false,

    className = '',
    inputClassName = '',
    style,

    wrapperProps = {},

    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,

    onChange,
    onFocus,
    onBlur,

    ...props
  },
  ref,
) {
  const generatedId = useId();

  const inputId =
    id ||
    `dipo-input-${generatedId.replace(/:/g, '')}`;

  const hintId =
    `${inputId}-hint`;

  const errorId =
    `${inputId}-error`;

  const successId =
    `${inputId}-success`;

  const countId =
    `${inputId}-count`;


  const [showPassword, setShowPassword] =
    useState(false);


  const resolvedType =
    passwordToggle && type === 'password'
      ? showPassword
        ? 'text'
        : 'password'
      : type;


  const hasError =
    Boolean(error);

  const hasSuccess =
    Boolean(success || successMessage);


  const describedBy = useMemo(() => {
    const ids = [];

    if (ariaDescribedby) {
      ids.push(ariaDescribedby);
    }

    if (hint) {
      ids.push(hintId);
    }

    if (hasError) {
      ids.push(errorId);
    }

    if (hasSuccess && successMessage) {
      ids.push(successId);
    }

    if (showCount && maxLength) {
      ids.push(countId);
    }

    return ids.length
      ? ids.join(' ')
      : undefined;
  }, [
    ariaDescribedby,
    hint,
    hintId,
    hasError,
    errorId,
    hasSuccess,
    successMessage,
    successId,
    showCount,
    maxLength,
    countId,
  ]);


  const currentValue =
    value ??
    defaultValue ??
    '';


  const characterCount =
    typeof currentValue === 'string'
      ? currentValue.length
      : String(currentValue).length;


  const isNearLimit =
    Boolean(
      maxLength &&
      characterCount >=
        Math.max(
          0,
          maxLength - 10,
        ),
    );


  const sizes = {
    sm: {
      height: 38,
      fontSize: 12,
      radius: 10,
      horizontal: 12,
    },

    md: {
      height: 46,
      fontSize: 13,
      radius: 12,
      horizontal: 14,
    },

    lg: {
      height: 54,
      fontSize: 14,
      radius: 14,
      horizontal: 16,
    },
  };


  const resolvedSize =
    sizes[size] ||
    sizes.md;


  const inputStyle = {
    '--dipo-input-height':
      `${resolvedSize.height}px`,

    '--dipo-input-font':
      `${resolvedSize.fontSize}px`,

    '--dipo-input-radius':
      `${resolvedSize.radius}px`,

    '--dipo-input-horizontal':
      `${resolvedSize.horizontal}px`,

    ...style,
  };


  const wrapperClass = [
    'dipo-input',
    `dipo-input--${size}`,
    `dipo-input--${variant}`,
    hasError
      ? 'dipo-input--error'
      : '',
    hasSuccess
      ? 'dipo-input--success'
      : '',
    disabled
      ? 'dipo-input--disabled'
      : '',
    loading
      ? 'dipo-input--loading'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');


  const fieldClass = [
    'dipo-input__field',
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');


  const handleClear = () => {
    if (disabled || readOnly) {
      return;
    }

    onClear?.();

    if (!onClear && typeof onChange === 'function') {
      onChange({
        target: {
          name,
          value: '',
        },
        currentTarget: {
          name,
          value: '',
        },
      });
    }
  };


  const renderEndControl = () => {
    if (loading) {
      return (
        <span
          className="dipo-input__loading"
          aria-hidden="true"
        >
          <LoaderIcon />
        </span>
      );
    }


    if (
      passwordToggle &&
      type === 'password'
    ) {
      return (
        <button
          type="button"
          className="dipo-input__icon-button"
          onClick={() =>
            setShowPassword(
              (current) =>
                !current,
            )
          }
          disabled={disabled}
          aria-label={
            showPassword
              ? 'Hide password'
              : 'Show password'
          }
          title={
            showPassword
              ? 'Hide password'
              : 'Show password'
          }
        >
          {showPassword ? (
            <EyeOffIcon />
          ) : (
            <EyeIcon />
          )}
        </button>
      );
    }


    if (
      clearable &&
      characterCount > 0
    ) {
      return (
        <button
          type="button"
          className="dipo-input__icon-button"
          onClick={
            handleClear
          }
          disabled={
            disabled ||
            readOnly
          }
          aria-label="Clear input"
          title="Clear"
        >
          <XIcon />
        </button>
      );
    }


    if (endIcon) {
      return (
        <span
          className="dipo-input__end-icon"
          aria-hidden="true"
        >
          {endIcon}
        </span>
      );
    }


    if (success && !successMessage) {
      return (
        <span
          className="dipo-input__success-icon"
          aria-hidden="true"
        >
          <CheckIcon />
        </span>
      );
    }


    return null;
  };


  return (
    <div
      className={wrapperClass}
      style={inputStyle}
      {...wrapperProps}
    >
      {(label || labelExtra) && (
        <div className="dipo-input__label-row">
          {label && (
            <label
              htmlFor={inputId}
              className="dipo-input__label"
            >
              <span>
                {label}
              </span>

              {required && (
                <span
                  className="dipo-input__required"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </label>
          )}

          {labelExtra && (
            <span className="dipo-input__label-extra">
              {labelExtra}
            </span>
          )}
        </div>
      )}


      <div className="dipo-input__control">
        {prefix && (
          <span
            className="dipo-input__prefix"
            aria-hidden="true"
          >
            {prefix}
          </span>
        )}


        {startIcon && (
          <span
            className="dipo-input__start-icon"
            aria-hidden="true"
          >
            {startIcon}
          </span>
        )}


        <input
          ref={ref}
          id={inputId}
          name={name}
          type={resolvedType}
          value={value}
          defaultValue={
            defaultValue
          }
          placeholder={
            placeholder
          }
          disabled={
            disabled
          }
          readOnly={
            readOnly
          }
          required={
            required
          }
          maxLength={
            maxLength
          }
          className={
            fieldClass
          }
          aria-label={
            ariaLabel
          }
          aria-invalid={
            hasError
              ? 'true'
              : 'false'
          }
          aria-describedby={
            describedBy
          }
          aria-busy={
            loading
              ? 'true'
              : undefined
          }
          onChange={
            onChange
          }
          onFocus={
            onFocus
          }
          onBlur={
            onBlur
          }
          {...props}
        />


        {renderEndControl()}
      </div>


      {(hint ||
        error ||
        successMessage ||
        showCount) && (
        <div className="dipo-input__meta">
          <div className="dipo-input__message">
            {error ? (
              <span
                id={errorId}
                className="dipo-input__error"
                role="alert"
              >
                {error}
              </span>
            ) : successMessage ? (
              <span
                id={successId}
                className="dipo-input__success"
              >
                {successMessage}
              </span>
            ) : hint ? (
              <span
                id={hintId}
                className="dipo-input__hint"
              >
                {hint}
              </span>
            ) : null}
          </div>


          {showCount &&
            maxLength && (
              <span
                id={countId}
                className={[
                  'dipo-input__count',
                  isNearLimit
                    ? 'dipo-input__count--near'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {characterCount}/
                {maxLength}
              </span>
            )}
        </div>
      )}


      <style>
        {INPUT_STYLES}
      </style>
    </div>
  );
});


Input.displayName =
  'Input';


/* ============================================================
   STYLES
   ============================================================ */

const INPUT_STYLES = `
  .dipo-input {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }


  .dipo-input *,
  .dipo-input *::before,
  .dipo-input *::after {
    box-sizing: border-box;
  }


  .dipo-input__label-row {
    min-height: 20px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    margin-bottom: 7px;
  }


  .dipo-input__label {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    color: #111827;

    font-size: 11px;
    line-height: 1.35;
    font-weight: 800;

    letter-spacing: -.005em;

    cursor: pointer;
  }


  .dipo-input__required {
    color: #dc2626;
    font-weight: 900;
  }


  .dipo-input__label-extra {
    color: #94a3b8;

    font-size: 10px;
    line-height: 1.3;
    font-weight: 650;

    white-space: nowrap;
  }


  .dipo-input__control {
    position: relative;

    width: 100%;
    min-width: 0;
  }


  .dipo-input__field {
    width: 100%;
    height: var(--dipo-input-height);

    display: block;

    padding:
      0
      var(--dipo-input-horizontal);

    border:
      1px solid #dbe3ea;

    border-radius:
      var(--dipo-input-radius);

    outline: none;

    background:
      rgba(255,255,255,.96);

    color: #0f172a;

    font-family: inherit;
    font-size: var(--dipo-input-font);
    line-height: 1;
    font-weight: 550;

    box-shadow:
      0 1px 2px rgba(15,23,42,.025);

    transition:
      border-color 150ms ease,
      box-shadow 150ms ease,
      background 150ms ease,
      color 150ms ease;
  }


  .dipo-input__field::placeholder {
    color: #a0acba;
    opacity: 1;
  }


  .dipo-input__field:hover:not(:disabled):not(:read-only) {
    border-color: #cbd5e1;
  }


  .dipo-input__field:focus {
    border-color: #10b981;

    background: #ffffff;

    box-shadow:
      0 0 0 3px rgba(16,185,129,.10),
      0 5px 18px rgba(15,23,42,.035);
  }


  .dipo-input--error
  .dipo-input__field {
    border-color: #f1a4a4;
  }


  .dipo-input--error
  .dipo-input__field:focus {
    border-color: #ef4444;

    box-shadow:
      0 0 0 3px rgba(239,68,68,.10),
      0 5px 18px rgba(15,23,42,.035);
  }


  .dipo-input--success
  .dipo-input__field {
    border-color: #9dddc6;
  }


  .dipo-input--success
  .dipo-input__field:focus {
    border-color: #10b981;
  }


  .dipo-input--disabled
  .dipo-input__field {
    cursor: not-allowed;

    background: #f8fafc;

    color: #94a3b8;

    border-color: #e5eaf0;
  }


  .dipo-input--disabled
  .dipo-input__field::placeholder {
    color: #c0c8d2;
  }


  .dipo-input__field:read-only {
    background: #f8fafc;
  }


  .dipo-input__prefix,
  .dipo-input__start-icon,
  .dipo-input__end-icon,
  .dipo-input__success-icon,
  .dipo-input__loading,
  .dipo-input__icon-button {
    position: absolute;

    top: 50%;

    transform:
      translateY(-50%);

    display: inline-flex;

    align-items: center;
    justify-content: center;

    z-index: 2;
  }


  .dipo-input__prefix {
    left: var(--dipo-input-horizontal);

    color: #64748b;

    font-size: var(--dipo-input-font);
    font-weight: 650;

    pointer-events: none;
  }


  .dipo-input__start-icon {
    left: var(--dipo-input-horizontal);

    width: 18px;
    height: 18px;

    color: #94a3b8;

    pointer-events: none;
  }


  .dipo-input__prefix
  ~ .dipo-input__field {
    padding-left:
      calc(
        var(--dipo-input-horizontal) + 26px
      );
  }


  .dipo-input__start-icon
  ~ .dipo-input__field {
    padding-left:
      calc(
        var(--dipo-input-horizontal) + 27px
      );
  }


  .dipo-input__end-icon {
    right: var(--dipo-input-horizontal);

    width: 20px;
    height: 20px;

    color: #94a3b8;

    pointer-events: none;
  }


  .dipo-input__success-icon {
    right: var(--dipo-input-horizontal);

    width: 20px;
    height: 20px;

    color: #059669;

    pointer-events: none;
  }


  .dipo-input__icon-button {
    right:
      calc(
        var(--dipo-input-horizontal) - 4px
      );

    width: 32px;
    height: 32px;

    border: 0;
    border-radius: 9px;

    background: transparent;

    color: #7b8794;

    cursor: pointer;

    transition:
      background 130ms ease,
      color 130ms ease,
      transform 130ms ease;
  }


  .dipo-input__icon-button:hover:not(:disabled) {
    background: #f1f5f9;
    color: #0f172a;
  }


  .dipo-input__icon-button:focus-visible {
    outline:
      2px solid rgba(16,185,129,.30);

    outline-offset: 1px;
  }


  .dipo-input__icon-button:active:not(:disabled) {
    transform:
      translateY(-50%)
      scale(.94);
  }


  .dipo-input__loading {
    right: var(--dipo-input-horizontal);

    width: 18px;
    height: 18px;

    color: #64748b;

    animation:
      dipo-input-spin .75s linear infinite;
  }


  .dipo-input--loading
  .dipo-input__field {
    padding-right:
      calc(
        var(--dipo-input-horizontal) + 28px
      );
  }


  .dipo-input__meta {
    min-height: 16px;

    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 12px;

    margin-top: 6px;
  }


  .dipo-input__message {
    min-width: 0;
  }


  .dipo-input__hint,
  .dipo-input__error,
  .dipo-input__success {
    display: block;

    font-size: 10px;
    line-height: 1.5;
    font-weight: 550;
  }


  .dipo-input__hint {
    color: #94a3b8;
  }


  .dipo-input__error {
    color: #dc2626;
  }


  .dipo-input__success {
    color: #059669;
  }


  .dipo-input__count {
    flex: 0 0 auto;

    color: #94a3b8;

    font-size: 9px;
    line-height: 1.5;
    font-weight: 700;

    font-variant-numeric:
      tabular-nums;
  }


  .dipo-input__count--near {
    color: #d97706;
  }


  .dipo-input--sm
  .dipo-input__label {
    font-size: 10px;
  }


  .dipo-input--lg
  .dipo-input__label {
    font-size: 12px;
  }


  @keyframes dipo-input-spin {
    to {
      transform:
        translateY(-50%)
        rotate(360deg);
    }
  }


  @media (max-width: 480px) {
    .dipo-input__field {
      font-size:
        max(
          var(--dipo-input-font),
          16px
        );
    }

    .dipo-input__label-extra {
      max-width: 42%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }


  @media (prefers-reduced-motion: reduce) {
    .dipo-input__field,
    .dipo-input__icon-button {
      transition: none;
    }

    .dipo-input__loading {
      animation: none;
    }
  }
`;


export default Input;