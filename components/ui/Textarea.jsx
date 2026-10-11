'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const SIZE_CONFIG = {
  sm: {
    minHeight: 92,
    padding: '11px 13px',
    fontSize: 14,
    lineHeight: 1.5,
    radius: 11,
  },
  md: {
    minHeight: 112,
    padding: '13px 14px',
    fontSize: 15,
    lineHeight: 1.55,
    radius: 13,
  },
  lg: {
    minHeight: 136,
    padding: '15px 16px',
    fontSize: 16,
    lineHeight: 1.6,
    radius: 15,
  },
};

const VARIANT_CONFIG = {
  default: {
    background: '#ffffff',
    border: '#e5e7eb',
    hoverBorder: '#d1d5db',
    focusBorder: '#10b981',
  },
  soft: {
    background: '#f7f8f8',
    border: '#eef0f0',
    hoverBorder: '#dfe3e1',
    focusBorder: '#10b981',
  },
  ghost: {
    background: 'transparent',
    border: 'transparent',
    hoverBorder: '#e5e7eb',
    focusBorder: '#10b981',
  },
};

function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    });
  };
}

function normalizeRows(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function getInitialValue(value, defaultValue) {
  if (value !== undefined && value !== null) return String(value);
  if (defaultValue !== undefined && defaultValue !== null) {
    return String(defaultValue);
  }
  return '';
}

function ClearIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 7l10 10M17 7L7 17"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Spinner({ size = 15 }) {
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
        strokeOpacity=".2"
        strokeWidth="3"
      />
      <path
        d="M20.5 12a8.5 8.5 0 0 0-8.5-8.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Textarea = forwardRef(function Textarea(
  {
    id,
    name,
    label,
    labelExtra,
    hint,
    error,
    success = false,
    successMessage,

    size = 'md',
    variant = 'default',

    required = false,
    disabled = false,
    readOnly = false,

    value,
    defaultValue = '',
    onChange,
    onFocus,
    onBlur,

    autoResize = false,
    minRows = 4,
    maxRows,

    showCount = false,
    maxLength,

    clearable = false,
    onClear,

    loading = false,

    startIcon,

    className = '',
    style,
    textareaStyle,

    rows,

    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,

    ...props
  },
  forwardedRef
) {
  const generatedId = useId();
  const textareaId = id || `textarea-${generatedId.replace(/:/g, '')}`;

  const hintId = `${textareaId}-hint`;
  const errorId = `${textareaId}-error`;
  const successId = `${textareaId}-success`;
  const countId = `${textareaId}-count`;

  const textareaRef = useRef(null);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    getInitialValue(value, defaultValue)
  );

  const currentValue = isControlled ? String(value ?? '') : internalValue;

  const resolvedSize = SIZE_CONFIG[size] || SIZE_CONFIG.md;
  const resolvedVariant =
    VARIANT_CONFIG[variant] || VARIANT_CONFIG.default;

  const normalizedMinRows = normalizeRows(minRows, 4);
  const normalizedMaxRows = maxRows
    ? Math.max(normalizeRows(maxRows, normalizedMinRows), normalizedMinRows)
    : null;

  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const hasHint = Boolean(hint) && !hasError && !hasSuccess;

  const canClear =
    clearable &&
    !disabled &&
    !readOnly &&
    currentValue.length > 0 &&
    (typeof onClear === 'function' || !isControlled);

  const describedBy = useMemo(() => {
    const ids = [];

    if (ariaDescribedBy) ids.push(ariaDescribedBy);
    if (hasError) ids.push(errorId);
    else if (hasSuccess && successMessage) ids.push(successId);
    else if (hasHint) ids.push(hintId);

    if (showCount) ids.push(countId);

    return ids.length ? ids.join(' ') : undefined;
  }, [
    ariaDescribedBy,
    hasError,
    hasSuccess,
    successMessage,
    hasHint,
    showCount,
    errorId,
    successId,
    hintId,
    countId,
  ]);

  const resizeTextarea = useCallback(() => {
    const element = textareaRef.current;

    if (!element || !autoResize) return;

    const computed = window.getComputedStyle(element);

    const lineHeight = parseFloat(computed.lineHeight);
    const paddingTop = parseFloat(computed.paddingTop) || 0;
    const paddingBottom = parseFloat(computed.paddingBottom) || 0;
    const borderTop = parseFloat(computed.borderTopWidth) || 0;
    const borderBottom = parseFloat(computed.borderBottomWidth) || 0;

    const fallbackLineHeight =
      resolvedSize.fontSize * resolvedSize.lineHeight;

    const actualLineHeight =
      Number.isFinite(lineHeight) && lineHeight > 0
        ? lineHeight
        : fallbackLineHeight;

    const minHeight =
      actualLineHeight * normalizedMinRows +
      paddingTop +
      paddingBottom +
      borderTop +
      borderBottom;

    const maxHeight = normalizedMaxRows
      ? actualLineHeight * normalizedMaxRows +
        paddingTop +
        paddingBottom +
        borderTop +
        borderBottom
      : null;

    element.style.height = 'auto';

    const contentHeight = Math.max(element.scrollHeight, minHeight);

    if (maxHeight) {
      const nextHeight = Math.min(contentHeight, maxHeight);

      element.style.height = `${nextHeight}px`;
      element.style.overflowY =
        contentHeight > maxHeight ? 'auto' : 'hidden';
    } else {
      element.style.height = `${contentHeight}px`;
      element.style.overflowY = 'hidden';
    }
  }, [
    autoResize,
    normalizedMinRows,
    normalizedMaxRows,
    resolvedSize.fontSize,
    resolvedSize.lineHeight,
  ]);

  useLayoutEffect(() => {
    if (!autoResize) return;

    resizeTextarea();
  }, [autoResize, currentValue, resizeTextarea]);

  useEffect(() => {
    if (!autoResize) return undefined;

    const element = textareaRef.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      resizeTextarea();
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [autoResize, resizeTextarea]);

  const handleChange = (event) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(event);
  };

  const handleClear = () => {
    if (disabled || readOnly) return;

    if (!isControlled) {
      setInternalValue('');
    }

    onClear?.();

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      resizeTextarea();
    });
  };

  const handleKeyDown = (event) => {
    if (
      event.key === 'Escape' &&
      canClear &&
      currentValue.length > 0
    ) {
      event.preventDefault();
      handleClear();
    }

    props.onKeyDown?.(event);
  };

  const fieldState = hasError
    ? 'error'
    : hasSuccess
      ? 'success'
      : 'default';

  const paddingLeft = startIcon
    ? Math.max(resolvedSize.padding.split(' ')[1]?.replace('px', '') || 14, 14) + 28
    : undefined;

  const paddingRight =
    canClear || loading || hasSuccess
      ? 44
      : undefined;

  const textareaClassName = [
    'dipo-textarea__control',
    `dipo-textarea__control--${size}`,
    `dipo-textarea__control--${variant}`,
    `dipo-textarea__control--${fieldState}`,
    autoResize ? 'dipo-textarea__control--auto' : '',
    disabled ? 'dipo-textarea__control--disabled' : '',
    readOnly ? 'dipo-textarea__control--readonly' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <style>{`
        .dipo-textarea {
          width: 100%;
          min-width: 0;
          font-family: inherit;
        }

        .dipo-textarea__label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 7px;
        }

        .dipo-textarea__label {
          min-width: 0;
          color: #111827;
          font-size: 13px;
          line-height: 1.4;
          font-weight: 650;
          letter-spacing: -0.01em;
        }

        .dipo-textarea__required {
          color: #ef4444;
          margin-left: 3px;
        }

        .dipo-textarea__label-extra {
          flex: 0 0 auto;
          color: #6b7280;
          font-size: 12px;
          line-height: 1.4;
        }

        .dipo-textarea__field {
          position: relative;
          width: 100%;
        }

        .dipo-textarea__control {
          display: block;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          border: 1px solid;
          outline: none;
          resize: vertical;
          color: #111827;
          caret-color: #059669;
          font-family: inherit;
          font-weight: 450;
          letter-spacing: -0.01em;
          box-shadow: 0 1px 1px rgba(15, 23, 42, .02);
          transition:
            border-color .16s ease,
            background-color .16s ease,
            box-shadow .16s ease,
            color .16s ease;
        }

        .dipo-textarea__control--sm {
          min-height: 92px;
          padding: 11px 13px;
          border-radius: 11px;
          font-size: 14px;
          line-height: 1.5;
        }

        .dipo-textarea__control--md {
          min-height: 112px;
          padding: 13px 14px;
          border-radius: 13px;
          font-size: 15px;
          line-height: 1.55;
        }

        .dipo-textarea__control--lg {
          min-height: 136px;
          padding: 15px 16px;
          border-radius: 15px;
          font-size: 16px;
          line-height: 1.6;
        }

        .dipo-textarea__control--default {
          background: #ffffff;
          border-color: #e5e7eb;
        }

        .dipo-textarea__control--soft {
          background: #f7f8f8;
          border-color: #eef0f0;
        }

        .dipo-textarea__control--ghost {
          background: transparent;
          border-color: transparent;
        }

        .dipo-textarea__control:hover:not(:disabled):not(:focus) {
          border-color: #d1d5db;
        }

        .dipo-textarea__control--soft:hover:not(:disabled):not(:focus) {
          border-color: #dfe3e1;
        }

        .dipo-textarea__control--ghost:hover:not(:disabled):not(:focus) {
          background: #fafafa;
          border-color: #e5e7eb;
        }

        .dipo-textarea__control:focus {
          border-color: #10b981;
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, .10),
            0 1px 2px rgba(15, 23, 42, .03);
        }

        .dipo-textarea__control--error {
          border-color: #f87171;
        }

        .dipo-textarea__control--error:focus {
          border-color: #ef4444;
          box-shadow:
            0 0 0 3px rgba(239, 68, 68, .10),
            0 1px 2px rgba(15, 23, 42, .03);
        }

        .dipo-textarea__control--success {
          border-color: #6ee7b7;
        }

        .dipo-textarea__control--success:focus {
          border-color: #10b981;
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, .10),
            0 1px 2px rgba(15, 23, 42, .03);
        }

        .dipo-textarea__control::placeholder {
          color: #9ca3af;
          opacity: 1;
        }

        .dipo-textarea__control--disabled {
          cursor: not-allowed;
          opacity: .62;
          background: #f3f4f6;
          color: #6b7280;
          resize: none;
        }

        .dipo-textarea__control--readonly {
          background: #f9fafb;
        }

        .dipo-textarea__control--auto {
          resize: none;
          overflow-y: hidden;
        }

        .dipo-textarea__start-icon {
          position: absolute;
          top: 15px;
          left: 13px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: #9ca3af;
          pointer-events: none;
        }

        .dipo-textarea__control:focus ~ .dipo-textarea__start-icon {
          color: #059669;
        }

        .dipo-textarea__actions {
          position: absolute;
          right: 9px;
          bottom: 9px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dipo-textarea__action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          padding: 0;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          transition:
            color .15s ease,
            background-color .15s ease,
            transform .15s ease;
        }

        .dipo-textarea__action:hover {
          color: #374151;
          background: #f3f4f6;
        }

        .dipo-textarea__action:active {
          transform: scale(.94);
        }

        .dipo-textarea__action:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }

        .dipo-textarea__success-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          color: #059669;
        }

        .dipo-textarea__spinner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          color: #059669;
          animation: dipo-textarea-spin .8s linear infinite;
        }

        .dipo-textarea__meta {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-top: 7px;
          min-height: 18px;
        }

        .dipo-textarea__message {
          min-width: 0;
          font-size: 12px;
          line-height: 1.45;
          letter-spacing: -0.005em;
        }

        .dipo-textarea__message--hint {
          color: #6b7280;
        }

        .dipo-textarea__message--error {
          color: #dc2626;
        }

        .dipo-textarea__message--success {
          color: #059669;
        }

        .dipo-textarea__count {
          flex: 0 0 auto;
          color: #9ca3af;
          font-size: 11px;
          line-height: 1.5;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .dipo-textarea__count--limit {
          color: #dc2626;
          font-weight: 600;
        }

        @keyframes dipo-textarea-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .dipo-textarea__control {
            font-size: 16px !important;
          }

          .dipo-textarea__meta {
            gap: 8px;
          }

          .dipo-textarea__label {
            font-size: 12.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-textarea__control,
          .dipo-textarea__action {
            transition: none;
          }

          .dipo-textarea__spinner {
            animation-duration: 1.5s;
          }
        }
      `}</style>

      <div
        className={`dipo-textarea ${className}`}
        style={style}
      >
        {(label || labelExtra) && (
          <div className="dipo-textarea__label-row">
            {label ? (
              <label
                className="dipo-textarea__label"
                htmlFor={textareaId}
              >
                {label}
                {required && (
                  <span
                    className="dipo-textarea__required"
                    aria-hidden="true"
                  >
                    *
                  </span>
                )}
              </label>
            ) : (
              <span />
            )}

            {labelExtra && (
              <div className="dipo-textarea__label-extra">
                {labelExtra}
              </div>
            )}
          </div>
        )}

        <div className="dipo-textarea__field">
          <textarea
            {...props}
            ref={mergeRefs(textareaRef, forwardedRef)}
            id={textareaId}
            name={name}
            value={value}
            defaultValue={isControlled ? undefined : defaultValue}
            rows={autoResize ? normalizedMinRows : rows}
            maxLength={maxLength}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            aria-label={ariaLabel}
            aria-describedby={describedBy}
            aria-invalid={
              ariaInvalid !== undefined
                ? ariaInvalid
                : hasError
            }
            className={textareaClassName}
            style={{
              ...textareaStyle,
              ...(startIcon ? { paddingLeft } : {}),
              ...(paddingRight ? { paddingRight } : {}),
            }}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
          />

          {startIcon && (
            <span className="dipo-textarea__start-icon">
              {startIcon}
            </span>
          )}

          {(canClear || loading || hasSuccess) && (
            <div className="dipo-textarea__actions">
              {loading && (
                <span
                  className="dipo-textarea__spinner"
                  aria-label="Loading"
                  role="status"
                >
                  <Spinner />
                </span>
              )}

              {!loading && hasSuccess && (
                <span
                  className="dipo-textarea__success-icon"
                  aria-hidden="true"
                >
                  <CheckIcon />
                </span>
              )}

              {!loading && canClear && (
                <button
                  type="button"
                  className="dipo-textarea__action"
                  onClick={handleClear}
                  aria-label="Clear text"
                  title="Clear"
                >
                  <ClearIcon />
                </button>
              )}
            </div>
          )}
        </div>

        {(hasHint ||
          hasError ||
          (hasSuccess && successMessage) ||
          showCount) && (
          <div className="dipo-textarea__meta">
            <div
              className={`dipo-textarea__message ${
                hasError
                  ? 'dipo-textarea__message--error'
                  : hasSuccess
                    ? 'dipo-textarea__message--success'
                    : 'dipo-textarea__message--hint'
              }`}
              id={
                hasError
                  ? errorId
                  : hasSuccess && successMessage
                    ? successId
                    : hintId
              }
              role={hasError ? 'alert' : undefined}
              aria-live={hasError ? 'polite' : undefined}
            >
              {hasError || successMessage || hint}
            </div>

            {showCount && (
              <div
                id={countId}
                className={`dipo-textarea__count ${
                  maxLength && currentValue.length >= maxLength
                    ? 'dipo-textarea__count--limit'
                    : ''
                }`}
                aria-label={
                  maxLength
                    ? `${currentValue.length} of ${maxLength} characters`
                    : `${currentValue.length} characters`
                }
              >
                {currentValue.length}
                {maxLength ? ` / ${maxLength}` : ''}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
});

Textarea.displayName = 'Textarea';

export function TextareaCounter(props) {
  return (
    <Textarea
      {...props}
      showCount
    />
  );
}

export function AutoResizeTextarea(props) {
  return (
    <Textarea
      {...props}
      autoResize
    />
  );
}

export function MessageTextarea(props) {
  return (
    <Textarea
      {...props}
      autoResize
      showCount
      minRows={5}
      maxRows={10}
    />
  );
}

export default Textarea;