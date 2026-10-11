'use client';

import { useMemo, useState } from 'react';

import {
  createUpiPaymentUrl,
  getOfficialUpiId,
  getPayeeName,
} from '@/lib/payments/upi';

import {
  getPaymentPlan,
} from '@/lib/payments/payment-config';

const DEFAULT_LABEL = 'Pay via UPI';

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UpiIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M7 9h6M7 12h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="m15 10-2 3h3l-2 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      className="dipo-upi-button-spinner"
      aria-hidden="true"
    />
  );
}

export default function UPIButton({
  plan,
  children,
  label = DEFAULT_LABEL,
  className = '',
  disabled = false,
  fullWidth = true,
  showArrow = true,
  showUpiIcon = true,
  onBeforeOpen,
  onOpen,
  onError,
}) {
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState('');

  const config = useMemo(() => {
    if (!plan) {
      return null;
    }

    try {
      return getPaymentPlan(plan);
    } catch {
      return null;
    }
  }, [plan]);

  const upiId = useMemo(
    () => getOfficialUpiId(),
    []
  );

  const payeeName = useMemo(
    () => getPayeeName(),
    []
  );

  const upiUrl = useMemo(() => {
    if (!config || !upiId) {
      return '';
    }

    try {
      return createUpiPaymentUrl(plan);
    } catch {
      return '';
    }
  }, [config, plan, upiId]);

  const unavailableReason = useMemo(() => {
    if (!plan) {
      return 'Payment plan is not selected.';
    }

    if (!config) {
      return 'This payment plan is unavailable.';
    }

    if (!upiId) {
      return 'UPI payment is temporarily unavailable.';
    }

    if (!upiUrl) {
      return 'UPI payment link could not be created.';
    }

    return '';
  }, [plan, config, upiId, upiUrl]);

  const handleClick = async (event) => {
    event.preventDefault();

    if (
      disabled ||
      opening ||
      unavailableReason
    ) {
      return;
    }

    setError('');
    setOpening(true);

    try {
      if (typeof onBeforeOpen === 'function') {
        await onBeforeOpen({
          plan,
          config,
          upiId,
          payeeName,
          upiUrl,
        });
      }

      window.location.assign(upiUrl);

      if (typeof onOpen === 'function') {
        onOpen({
          plan,
          config,
          upiId,
          payeeName,
          upiUrl,
        });
      }
    } catch (err) {
      console.error(
        '[UPIButton] Failed to open UPI payment:',
        err
      );

      const message =
        err?.message ||
        'Unable to open UPI payment. Please try again.';

      setError(message);

      if (typeof onError === 'function') {
        onError(err);
      }

      setOpening(false);
    }
  };

  const isDisabled =
    disabled ||
    opening ||
    Boolean(unavailableReason);

  const buttonLabel =
    children ||
    (opening ? 'Opening UPI…' : label);

  return (
    <div
      className={[
        'dipo-upi-button-wrap',
        fullWidth
          ? 'dipo-upi-button-wrap-full'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className="dipo-upi-button"
        onClick={handleClick}
        disabled={isDisabled}
        aria-busy={opening}
        aria-disabled={isDisabled}
        title={
          unavailableReason ||
          `Pay ${payeeName} via UPI`
        }
      >
        <span className="dipo-upi-button-content">
          {opening ? (
            <Spinner />
          ) : showUpiIcon ? (
            <span className="dipo-upi-button-icon">
              <UpiIcon />
            </span>
          ) : null}

          <span className="dipo-upi-button-label">
            {buttonLabel}
          </span>

          {!opening && showArrow ? (
            <span className="dipo-upi-button-arrow">
              <ArrowIcon />
            </span>
          ) : null}
        </span>
      </button>

      {unavailableReason ? (
        <p
          className="dipo-upi-button-message"
          role="status"
        >
          {unavailableReason}
        </p>
      ) : null}

      {error ? (
        <p
          className="dipo-upi-button-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <style>{`
        .dipo-upi-button-wrap {
          position: relative;
          width: max-content;
          max-width: 100%;
        }

        .dipo-upi-button-wrap-full {
          width: 100%;
        }

        .dipo-upi-button {
          position: relative;
          isolation: isolate;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          width: 100%;
          min-height: 54px;

          padding: 0 18px;

          border: 1px solid #111827;
          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              #111827 0%,
              #18181b 100%
            );

          color: #ffffff;

          font-family: inherit;
          font-size: 14px;
          font-weight: 850;
          line-height: 1;

          cursor: pointer;

          box-shadow:
            0 12px 28px rgba(17, 24, 39, 0.16);

          overflow: hidden;

          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            opacity 160ms ease,
            border-color 160ms ease;
        }

        .dipo-upi-button::before {
          content: "";

          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              120deg,
              transparent 0%,
              rgba(255, 255, 255, 0.12) 45%,
              transparent 70%
            );

          transform:
            translateX(-120%);

          transition:
            transform 500ms ease;

          pointer-events: none;
        }

        .dipo-upi-button:hover:not(:disabled) {
          transform: translateY(-2px);

          border-color: #059669;

          box-shadow:
            0 17px 34px rgba(17, 24, 39, 0.2);
        }

        .dipo-upi-button:hover:not(:disabled)::before {
          transform:
            translateX(120%);
        }

        .dipo-upi-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .dipo-upi-button:focus-visible {
          outline: 3px solid rgba(16, 185, 129, 0.28);
          outline-offset: 3px;
        }

        .dipo-upi-button:disabled {
          cursor: not-allowed;
          opacity: 0.58;
          box-shadow: none;
        }

        .dipo-upi-button-content {
          position: relative;
          z-index: 1;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          width: 100%;

          gap: 9px;
        }

        .dipo-upi-button-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          width: 30px;
          height: 30px;

          flex: 0 0 30px;

          border-radius: 9px;

          background:
            rgba(255, 255, 255, 0.1);

          color: #ffffff;
        }

        .dipo-upi-button-label {
          min-width: 0;

          overflow: hidden;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-upi-button-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          flex: 0 0 auto;

          margin-left: 2px;

          transition:
            transform 160ms ease;
        }

        .dipo-upi-button:hover:not(:disabled)
          .dipo-upi-button-arrow {
          transform: translateX(3px);
        }

        .dipo-upi-button-spinner {
          width: 17px;
          height: 17px;

          flex: 0 0 17px;

          border:
            2px solid
            rgba(255, 255, 255, 0.3);

          border-top-color: #ffffff;

          border-radius: 50%;

          animation:
            dipo-upi-spin
            700ms linear infinite;
        }

        .dipo-upi-button-message,
        .dipo-upi-button-error {
          margin: 8px 2px 0;

          font-size: 11px;
          line-height: 1.45;
        }

        .dipo-upi-button-message {
          color: #9a3412;
        }

        .dipo-upi-button-error {
          color: #dc2626;
        }

        @keyframes dipo-upi-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 480px) {
          .dipo-upi-button {
            min-height: 52px;
            padding: 0 15px;
            border-radius: 15px;
          }

          .dipo-upi-button-icon {
            width: 28px;
            height: 28px;
            flex-basis: 28px;
          }

          .dipo-upi-button-label {
            font-size: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-upi-button,
          .dipo-upi-button::before,
          .dipo-upi-button-arrow {
            transition: none;
          }

          .dipo-upi-button-spinner {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}