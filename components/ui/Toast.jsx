'use client';

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

const ToastContext = createContext(null);

const POSITIONS = {
  'top-left': {
    top: 'max(16px, env(safe-area-inset-top))',
    left: 'max(16px, env(safe-area-inset-left))',
  },
  'top-center': {
    top: 'max(16px, env(safe-area-inset-top))',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  'top-right': {
    top: 'max(16px, env(safe-area-inset-top))',
    right: 'max(16px, env(safe-area-inset-right))',
  },
  'bottom-left': {
    bottom: 'max(16px, env(safe-area-inset-bottom))',
    left: 'max(16px, env(safe-area-inset-left))',
  },
  'bottom-center': {
    bottom: 'max(16px, env(safe-area-inset-bottom))',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  'bottom-right': {
    bottom: 'max(16px, env(safe-area-inset-bottom))',
    right: 'max(16px, env(safe-area-inset-right))',
  },
};

const TYPE_CONFIG = {
  default: {
    icon: 'info',
    accent: '#6b7280',
    soft: '#f3f4f6',
    label: 'Notification',
  },
  success: {
    icon: 'check',
    accent: '#059669',
    soft: '#ecfdf5',
    label: 'Success',
  },
  error: {
    icon: 'error',
    accent: '#dc2626',
    soft: '#fef2f2',
    label: 'Error',
  },
  warning: {
    icon: 'warning',
    accent: '#d97706',
    soft: '#fffbeb',
    label: 'Warning',
  },
  info: {
    icon: 'info',
    accent: '#2563eb',
    soft: '#eff6ff',
    label: 'Information',
  },
};

const DURATION_DEFAULT = 4500;

function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function Icon({ type = 'info', size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': 'true',
  };

  if (type === 'check') {
    return (
      <svg {...common}>
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

  if (type === 'error') {
    return (
      <svg {...common}>
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
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (type === 'warning') {
    return (
      <svg {...common}>
        <path
          d="m10.3 4.4-7.5 13a1.8 1.8 0 0 0 1.56 2.7h15.28a1.8 1.8 0 0 0 1.56-2.7l-7.5-13a1.8 1.8 0 0 0-3.12 0Z"
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
        <circle cx="12" cy="16.5" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg {...common}>
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
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function CloseIcon({ size = 16 }) {
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

function LoaderIcon({ size = 15 }) {
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
        strokeOpacity=".22"
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

const ToastItem = forwardRef(function ToastItem(
  {
    toast,
    onClose,
    pauseOnHover = true,
    pauseOnFocus = true,
    position = 'bottom-right',
  },
  ref
) {
  const {
    id,
    type = 'default',
    title,
    message,
    description,
    action,
    duration = DURATION_DEFAULT,
    dismissible = true,
    icon,
    loading = false,
    progress = false,
  } = toast;

  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState(
    typeof duration === 'number' && duration > 0 ? duration : 0
  );

  const startedAtRef = useRef(Date.now());
  const remainingRef = useRef(remaining);

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.default;

  const content = message ?? description;

  const close = useCallback(() => {
    onClose(id);
  }, [id, onClose]);

  useEffect(() => {
    if (
      loading ||
      paused ||
      typeof duration !== 'number' ||
      duration <= 0
    ) {
      return undefined;
    }

    startedAtRef.current = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      const next = Math.max(
        0,
        remainingRef.current - elapsed
      );

      remainingRef.current = next;
      setRemaining(next);

      if (next <= 0) {
        window.clearInterval(interval);
        onClose(id);
      }
    }, 50);

    return () => {
      window.clearInterval(interval);
      const elapsed = Date.now() - startedAtRef.current;

      remainingRef.current = Math.max(
        0,
        remainingRef.current - elapsed
      );
      setRemaining(remainingRef.current);
    };
  }, [duration, id, loading, onClose, paused]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setPaused(false);
    }
  };

  const handleFocus = () => {
    if (pauseOnFocus) {
      setPaused(true);
    }
  };

  const handleBlur = () => {
    if (pauseOnFocus) {
      setPaused(false);
    }
  };

  const progressPercent =
    duration > 0
      ? Math.max(0, Math.min(100, (remaining / duration) * 100))
      : 0;

  return (
    <div
      ref={ref}
      className="dipo-toast__item"
      data-position={position}
      data-type={type}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div
        className="dipo-toast__accent"
        style={{
          background: config.accent,
        }}
      />

      <div
        className="dipo-toast__icon"
        style={{
          color: config.accent,
          background: config.soft,
        }}
      >
        {icon || (
          loading ? <LoaderIcon size={17} /> : <Icon type={config.icon} />
        )}
      </div>

      <div className="dipo-toast__content">
        {title && (
          <div className="dipo-toast__title">
            {title}
          </div>
        )}

        {content && (
          <div className="dipo-toast__message">
            {content}
          </div>
        )}

        {action && (
          <div className="dipo-toast__action-row">
            {typeof action === 'function' ? (
              <button
                type="button"
                className="dipo-toast__action"
                onClick={() => action(close)}
              >
                {action.label || 'Action'}
              </button>
            ) : (
              action
            )}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          className="dipo-toast__close"
          onClick={close}
          aria-label="Dismiss notification"
        >
          <CloseIcon />
        </button>
      )}

      {progress &&
        !loading &&
        typeof duration === 'number' &&
        duration > 0 && (
          <div className="dipo-toast__progress-track">
            <div
              className="dipo-toast__progress"
              style={{
                width: `${progressPercent}%`,
                background: config.accent,
              }}
            />
          </div>
        )}
    </div>
  );
});

ToastItem.displayName = 'ToastItem';

export function ToastProvider({
  children,
  position = 'bottom-right',
  maxToasts = 5,
  duration = DURATION_DEFAULT,
  pauseOnHover = true,
  pauseOnFocus = true,
}) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const show = useCallback(
    (input, options = {}) => {
      const normalized =
        typeof input === 'string'
          ? {
              message: input,
              ...options,
            }
          : {
              ...input,
              ...options,
            };

      const id = normalized.id || createToastId();

      const toast = {
        id,
        type: normalized.type || 'default',
        title: normalized.title,
        message:
          normalized.message ?? normalized.description ?? '',
        description: normalized.description,
        action: normalized.action,
        duration:
          normalized.duration === undefined
            ? duration
            : normalized.duration,
        dismissible:
          normalized.dismissible !== false,
        icon: normalized.icon,
        loading: Boolean(normalized.loading),
        progress:
          normalized.progress === undefined
            ? true
            : Boolean(normalized.progress),
      };

      setToasts((current) => {
        const withoutSameId = current.filter(
          (item) => item.id !== id
        );

        return [
          ...withoutSameId,
          toast,
        ].slice(-maxToasts);
      });

      return id;
    },
    [duration, maxToasts]
  );

  const update = useCallback((id, updates) => {
    setToasts((current) =>
      current.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              ...updates,
            }
          : toast
      )
    );
  }, []);

  const promise = useCallback(
    async (
      promiseValue,
      {
        loading: loadingOptions = {},
        success: successOptions = {},
        error: errorOptions = {},
      } = {}
    ) => {
      const id = show({
        type: 'default',
        loading: true,
        progress: false,
        duration: 0,
        ...loadingOptions,
      });

      try {
        const result = await promiseValue;

        update(id, {
          ...successOptions,
          type: 'success',
          loading: false,
          progress: true,
          duration:
            successOptions.duration ?? duration,
        });

        return result;
      } catch (error) {
        const fallbackMessage =
          error instanceof Error
            ? error.message
            : 'Something went wrong.';

        update(id, {
          ...errorOptions,
          type: 'error',
          loading: false,
          progress: true,
          message:
            errorOptions.message || fallbackMessage,
          duration:
            errorOptions.duration ?? duration,
        });

        throw error;
      }
    },
    [duration, show, update]
  );

  const value = useMemo(
    () => ({
      toasts,
      show,
      toast: show,
      success: (message, options = {}) =>
        show(message, {
          ...options,
          type: 'success',
        }),
      error: (message, options = {}) =>
        show(message, {
          ...options,
          type: 'error',
        }),
      warning: (message, options = {}) =>
        show(message, {
          ...options,
          type: 'warning',
        }),
      info: (message, options = {}) =>
        show(message, {
          ...options,
          type: 'info',
        }),
      dismiss: remove,
      dismissAll,
      update,
      promise,
    }),
    [
      dismissAll,
      promise,
      remove,
      show,
      toasts,
      update,
    ]
  );

  const positionStyle =
    POSITIONS[position] || POSITIONS['bottom-right'];

  return (
    <ToastContext.Provider value={value}>
      {children}

      <style>{`
        .dipo-toast__viewport {
          position: fixed;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: min(420px, calc(100vw - 32px));
          max-width: calc(100vw - 32px);
          pointer-events: none;
          isolation: isolate;
        }

        .dipo-toast__viewport[data-position="top-left"],
        .dipo-toast__viewport[data-position="bottom-left"] {
          align-items: flex-start;
        }

        .dipo-toast__viewport[data-position="top-center"],
        .dipo-toast__viewport[data-position="bottom-center"] {
          align-items: center;
        }

        .dipo-toast__viewport[data-position="top-right"],
        .dipo-toast__viewport[data-position="bottom-right"] {
          align-items: flex-end;
        }

        .dipo-toast__item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 11px;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 13px 42px 13px 13px;
          overflow: hidden;
          border: 1px solid rgba(17, 24, 39, .08);
          border-radius: 15px;
          background: rgba(255, 255, 255, .96);
          box-shadow:
            0 18px 45px rgba(15, 23, 42, .10),
            0 3px 10px rgba(15, 23, 42, .05);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          pointer-events: auto;
          outline: none;
          animation: dipo-toast-enter .28s cubic-bezier(.2,.8,.2,1);
        }

        .dipo-toast__item:focus-visible {
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, .12),
            0 18px 45px rgba(15, 23, 42, .10);
        }

        .dipo-toast__accent {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 3px;
        }

        .dipo-toast__icon {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          margin-top: 1px;
          border-radius: 10px;
        }

        .dipo-toast__content {
          min-width: 0;
          flex: 1;
          padding-top: 1px;
        }

        .dipo-toast__title {
          color: #111827;
          font-size: 13.5px;
          line-height: 1.35;
          font-weight: 700;
          letter-spacing: -.015em;
        }

        .dipo-toast__message {
          margin-top: 3px;
          color: #5f6673;
          font-size: 13px;
          line-height: 1.48;
          overflow-wrap: anywhere;
        }

        .dipo-toast__close {
          position: absolute;
          top: 9px;
          right: 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
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

        .dipo-toast__close:hover {
          color: #374151;
          background: #f3f4f6;
        }

        .dipo-toast__close:active {
          transform: scale(.93);
        }

        .dipo-toast__close:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }

        .dipo-toast__action-row {
          display: flex;
          margin-top: 8px;
        }

        .dipo-toast__action {
          padding: 0;
          border: 0;
          background: transparent;
          color: #059669;
          font: inherit;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
        }

        .dipo-toast__action:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .dipo-toast__progress-track {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 2px;
          background: rgba(15, 23, 42, .05);
        }

        .dipo-toast__progress {
          height: 100%;
          transition: width .08s linear;
        }

        @keyframes dipo-toast-enter {
          from {
            opacity: 0;
            transform: translateY(8px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 640px) {
          .dipo-toast__viewport {
            width: calc(100vw - 20px);
            max-width: calc(100vw - 20px);
          }

          .dipo-toast__item {
            border-radius: 14px;
            padding: 12px 40px 12px 12px;
          }

          .dipo-toast__message {
            font-size: 12.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-toast__item {
            animation: none;
          }

          .dipo-toast__close {
            transition: none;
          }

          .dipo-toast__progress {
            transition: none;
          }
        }
      `}</style>

      <div
        className="dipo-toast__viewport"
        data-position={position}
        style={positionStyle}
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={remove}
            pauseOnHover={pauseOnHover}
            pauseOnFocus={pauseOnFocus}
            position={position}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      'useToast must be used inside <ToastProvider>.'
    );
  }

  return context;
}

export function Toast({
  type = 'default',
  title,
  message,
  description,
  action,
  duration = DURATION_DEFAULT,
  dismissible = true,
  icon,
  loading = false,
  progress = true,
  onClose,
  className = '',
}) {
  const generatedId = useId();

  const toast = {
    id: generatedId,
    type,
    title,
    message: message ?? description,
    description,
    action,
    duration,
    dismissible,
    icon,
    loading,
    progress,
  };

  return (
    <>
      <style>{`
        .dipo-standalone-toast {
          position: relative;
        }
      `}</style>

      <div className={className}>
        <ToastItem
          toast={toast}
          onClose={() => onClose?.()}
        />
      </div>
    </>
  );
}

export function ToastViewport({
  position = 'bottom-right',
  children,
  className = '',
}) {
  const positionStyle =
    POSITIONS[position] || POSITIONS['bottom-right'];

  return (
    <>
      <style>{`
        .dipo-toast-custom-viewport {
          position: fixed;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: min(420px, calc(100vw - 32px));
          pointer-events: none;
        }

        .dipo-toast-custom-viewport > * {
          pointer-events: auto;
        }

        @media (max-width: 640px) {
          .dipo-toast-custom-viewport {
            width: calc(100vw - 20px);
          }
        }
      `}</style>

      <div
        className={`dipo-toast-custom-viewport ${className}`}
        style={positionStyle}
      >
        {children}
      </div>
    </>
  );
}

export const toastTypes = Object.freeze([
  'default',
  'success',
  'error',
  'warning',
  'info',
]);

export const toastPositions = Object.freeze([
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]);

export default Toast;