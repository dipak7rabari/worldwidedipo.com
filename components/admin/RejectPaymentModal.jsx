'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

const MAX_REASON_LENGTH = 1000;

function getPaymentLabel(payment) {
  if (!payment) {
    return 'Payment claim';
  }

  if (payment.payment_reference) {
    return payment.payment_reference;
  }

  if (payment.slug_snapshot) {
    return payment.slug_snapshot;
  }

  return payment.id || 'Payment claim';
}

export default function RejectPaymentModal({
  payment,
  open = true,
  onClose,
  onRejected,
}) {
  const textareaRef = useRef(null);

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /*
   * Lock background scrolling while modal is open.
   */
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /*
   * Focus the reason field when the modal opens.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 80);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open]);

  /*
   * Escape closes the modal unless a request
   * is currently being processed.
   */
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (
        event.key === 'Escape' &&
        !loading
      ) {
        onClose?.();
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [open, loading, onClose]);

  if (!open || !payment) {
    return null;
  }

  function closeModal() {
    if (loading) {
      return;
    }

    setError('');
    setSuccess(false);
    setReason('');

    onClose?.();
  }

  function handleOverlayClick(event) {
    if (
      event.target === event.currentTarget &&
      !loading
    ) {
      closeModal();
    }
  }

  function handleReasonChange(event) {
    const value = event.target.value;

    setReason(
      value.slice(
        0,
        MAX_REASON_LENGTH,
      ),
    );

    if (error) {
      setError('');
    }
  }

  async function handleReject() {
    const cleanReason =
      reason.trim();

    if (!cleanReason) {
      setError(
        'Please enter a clear rejection reason.',
      );

      textareaRef.current?.focus();

      return;
    }

    if (cleanReason.length < 5) {
      setError(
        'Rejection reason must be at least 5 characters.',
      );

      textareaRef.current?.focus();

      return;
    }

    if (!payment.id) {
      setError(
        'Payment ID is missing. Please refresh and try again.',
      );

      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(
        '/api/admin/payments/reject',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Accept: 'application/json',
          },
          credentials: 'same-origin',
          cache: 'no-store',
          body: JSON.stringify({
            paymentId: payment.id,
            reason: cleanReason,
          }),
        },
      );

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.error ||
            'Unable to reject this payment.',
        );
      }

      setSuccess(true);

      /*
       * Give the user a short visual confirmation
       * before allowing the parent to remove the
       * processed payment from the queue.
       */
      window.setTimeout(() => {
        onRejected?.(
          payment.id,
          result,
        );

        onClose?.();

        setReason('');
        setSuccess(false);
      }, 550);
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Rejection failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  const reference =
    getPaymentLabel(payment);

  const plan =
    payment.plan ||
    '—';

  const amount =
    payment.amount !== null &&
    payment.amount !== undefined
      ? `₹${payment.amount}`
      : '—';

  return (
    <div
      className="rejectModalLayer"
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="rejectModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-payment-title"
        aria-describedby="reject-payment-description"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="rejectModalTop">
          <div className="rejectIcon">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3 2.7 20h18.6L12 3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          <button
            type="button"
            className="closeButton"
            onClick={closeModal}
            disabled={loading}
            aria-label="Close rejection dialog"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m6 6 12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="rejectModalHeading">
          <div>
            <p className="eyebrow">
              ADMIN ACTION
            </p>

            <h2 id="reject-payment-title">
              Reject payment?
            </h2>

            <p
              id="reject-payment-description"
              className="description"
            >
              This payment claim will be marked as
              rejected. Enter a clear reason so the
              decision is traceable.
            </p>
          </div>
        </div>

        <div className="paymentSummary">
          <div className="summaryMain">
            <span className="summaryLabel">
              PAYMENT REFERENCE
            </span>

            <strong
              className="paymentReference"
              title={reference}
            >
              {reference}
            </strong>
          </div>

          <div className="summaryMeta">
            <div>
              <span>Plan</span>
              <strong>{plan}</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>{amount}</strong>
            </div>
          </div>
        </div>

        <div className="reasonSection">
          <div className="reasonHeader">
            <label
              htmlFor="reject-payment-reason"
            >
              Rejection reason
            </label>

            <span
              className={
                reason.length >=
                MAX_REASON_LENGTH
                  ? 'counterLimit'
                  : ''
              }
            >
              {reason.length}/
              {MAX_REASON_LENGTH}
            </span>
          </div>

          <textarea
            ref={textareaRef}
            id="reject-payment-reason"
            value={reason}
            onChange={handleReasonChange}
            disabled={loading || success}
            maxLength={MAX_REASON_LENGTH}
            rows={5}
            placeholder="Example: UTR could not be verified against the credited transaction."
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? 'reject-payment-error'
                : undefined
            }
          />

          <p className="reasonHint">
            Keep it factual and specific. Avoid
            including sensitive information that is not
            required for the payment decision.
          </p>
        </div>

        {error ? (
          <div
            id="reject-payment-error"
            className="feedback feedbackError"
            role="alert"
          >
            <span className="feedbackIcon">
              !
            </span>

            <span>{error}</span>
          </div>
        ) : null}

        {success ? (
          <div
            className="feedback feedbackSuccess"
            role="status"
          >
            <span className="feedbackIcon">
              ✓
            </span>

            <span>
              Payment rejected successfully.
            </span>
          </div>
        ) : null}

        <div className="warningBox">
          <div className="warningIcon">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <div>
            <strong>
              Review before rejecting
            </strong>

            <p>
              Make sure the payment reference,
              amount and transaction status have been
              checked before confirming this action.
            </p>
          </div>
        </div>

        <div className="modalActions">
          <button
            type="button"
            className="cancelButton"
            onClick={closeModal}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="rejectButton"
            onClick={handleReject}
            disabled={
              loading ||
              success ||
              !reason.trim()
            }
          >
            {loading ? (
              <>
                <span className="spinner" />
                Rejecting...
              </>
            ) : success ? (
              <>
                <span className="buttonCheck">
                  ✓
                </span>
                Rejected
              </>
            ) : (
              <>
                Reject payment
                <span
                  className="buttonArrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .rejectModalLayer {
          position: fixed;
          inset: 0;
          z-index: 1000;

          display: flex;
          align-items: center;
          justify-content: center;

          padding:
            max(18px, env(safe-area-inset-top))
            max(18px, env(safe-area-inset-right))
            max(18px, env(safe-area-inset-bottom))
            max(18px, env(safe-area-inset-left));

          background:
            rgba(15, 23, 42, .46);

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);

          animation:
            rejectOverlayIn
            .18s ease-out both;

          overscroll-behavior: contain;
        }

        .rejectModal {
          width: min(
            100%,
            540px
          );

          max-height:
            calc(100dvh - 36px);

          overflow-y: auto;

          padding: 24px;

          border: 1px solid
            rgba(255, 255, 255, .75);

          border-radius: 24px;

          background:
            rgba(255, 255, 255, .98);

          color: #111827;

          box-shadow:
            0 30px 80px
              rgba(15, 23, 42, .22),
            0 8px 30px
              rgba(15, 23, 42, .10);

          scrollbar-width: thin;

          animation:
            rejectModalIn
            .22s cubic-bezier(.2,.8,.2,1)
            both;
        }

        .rejectModalTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .rejectIcon {
          width: 46px;
          height: 46px;

          display: grid;
          place-items: center;

          border: 1px solid #fecaca;
          border-radius: 14px;

          background: #fef2f2;
          color: #dc2626;
        }

        .rejectIcon svg {
          width: 22px;
          height: 22px;
        }

        .closeButton {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border: 1px solid #e5e7eb;
          border-radius: 11px;

          background: #fff;
          color: #6b7280;

          cursor: pointer;

          transition:
            background .16s ease,
            border-color .16s ease,
            color .16s ease,
            transform .16s ease;
        }

        .closeButton svg {
          width: 17px;
          height: 17px;
        }

        .closeButton:hover:not(:disabled) {
          border-color: #d1d5db;
          background: #f9fafb;
          color: #111827;
          transform: translateY(-1px);
        }

        .closeButton:focus-visible,
        .cancelButton:focus-visible,
        .rejectButton:focus-visible,
        .reasonSection textarea:focus-visible {
          outline: 3px solid
            rgba(16, 185, 129, .18);

          outline-offset: 2px;
        }

        .closeButton:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .rejectModalHeading {
          margin-top: 18px;
        }

        .eyebrow {
          margin: 0 0 6px;

          color: #9ca3af;

          font-size: 9px;
          line-height: 1.2;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .rejectModalHeading h2 {
          margin: 0;

          color: #111827;

          font-size: clamp(
            23px,
            5vw,
            29px
          );

          line-height: 1.1;
          font-weight: 950;
          letter-spacing: -.045em;
        }

        .description {
          max-width: 470px;

          margin: 9px 0 0;

          color: #6b7280;

          font-size: 13px;
          line-height: 1.65;
        }

        .paymentSummary {
          margin-top: 20px;

          padding: 15px;

          border: 1px solid #e5e7eb;
          border-radius: 16px;

          background:
            linear-gradient(
              145deg,
              #fafafa,
              #f7f8fa
            );
        }

        .summaryMain {
          min-width: 0;
        }

        .summaryLabel {
          display: block;

          margin-bottom: 7px;

          color: #9ca3af;

          font-size: 9px;
          line-height: 1.2;
          font-weight: 950;
          letter-spacing: .1em;
        }

        .paymentReference {
          display: block;

          overflow: hidden;

          color: #111827;

          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

          font-size: 12px;
          line-height: 1.5;
          font-weight: 800;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .summaryMeta {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 9px;

          margin-top: 12px;
        }

        .summaryMeta > div {
          min-width: 0;

          padding-top: 10px;

          border-top: 1px solid #e5e7eb;
        }

        .summaryMeta span {
          display: block;

          margin-bottom: 4px;

          color: #9ca3af;

          font-size: 9px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .summaryMeta strong {
          display: block;

          overflow: hidden;

          color: #374151;

          font-size: 12px;
          font-weight: 850;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .reasonSection {
          margin-top: 19px;
        }

        .reasonHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;

          margin-bottom: 8px;
        }

        .reasonHeader label {
          color: #111827;

          font-size: 12px;
          font-weight: 900;
        }

        .reasonHeader span {
          color: #9ca3af;

          font-size: 10px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }

        .reasonHeader span.counterLimit {
          color: #dc2626;
        }

        .reasonSection textarea {
          display: block;

          width: 100%;
          min-height: 122px;

          resize: vertical;

          padding: 13px 14px;

          border: 1px solid #dfe3e8;
          border-radius: 14px;

          background: #fff;
          color: #111827;

          font-family: inherit;
          font-size: 13px;
          line-height: 1.6;

          outline: none;

          transition:
            border-color .16s ease,
            box-shadow .16s ease,
            background .16s ease;
        }

        .reasonSection textarea::placeholder {
          color: #b0b7c3;
        }

        .reasonSection textarea:hover:not(:disabled) {
          border-color: #cbd5e1;
        }

        .reasonSection textarea:focus {
          border-color: #10b981;

          box-shadow:
            0 0 0 4px
              rgba(16, 185, 129, .08);
        }

        .reasonSection textarea:disabled {
          background: #f8fafc;
          cursor: not-allowed;
          opacity: .75;
        }

        .reasonHint {
          margin: 7px 1px 0;

          color: #9ca3af;

          font-size: 10px;
          line-height: 1.55;
        }

        .feedback {
          display: flex;
          align-items: flex-start;
          gap: 9px;

          margin-top: 13px;

          padding: 11px 12px;

          border-radius: 12px;

          font-size: 12px;
          line-height: 1.5;
          font-weight: 700;
        }

        .feedbackIcon {
          width: 20px;
          height: 20px;

          flex: 0 0 20px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          font-size: 11px;
          font-weight: 950;
        }

        .feedbackError {
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #991b1b;
        }

        .feedbackError .feedbackIcon {
          background: #fee2e2;
          color: #dc2626;
        }

        .feedbackSuccess {
          border: 1px solid #a7f3d0;
          background: #ecfdf5;
          color: #047857;
        }

        .feedbackSuccess .feedbackIcon {
          background: #d1fae5;
          color: #059669;
        }

        .warningBox {
          display: flex;
          align-items: flex-start;
          gap: 10px;

          margin-top: 14px;

          padding: 12px;

          border: 1px solid #fde68a;
          border-radius: 13px;

          background: #fffbeb;
        }

        .warningIcon {
          width: 25px;
          height: 25px;

          flex: 0 0 25px;

          display: grid;
          place-items: center;

          border-radius: 8px;

          background: #fef3c7;
          color: #b45309;
        }

        .warningIcon svg {
          width: 15px;
          height: 15px;
        }

        .warningBox strong {
          display: block;

          color: #92400e;

          font-size: 11px;
          font-weight: 900;
        }

        .warningBox p {
          margin: 3px 0 0;

          color: #a16207;

          font-size: 10px;
          line-height: 1.55;
        }

        .modalActions {
          display: grid;

          grid-template-columns:
            minmax(0, .8fr)
            minmax(0, 1.2fr);

          gap: 9px;

          margin-top: 20px;
        }

        .cancelButton,
        .rejectButton {
          min-height: 44px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          padding: 0 15px;

          border-radius: 12px;

          font-family: inherit;

          font-size: 12px;
          font-weight: 900;

          cursor: pointer;

          transition:
            transform .16s ease,
            box-shadow .16s ease,
            background .16s ease,
            border-color .16s ease,
            opacity .16s ease;
        }

        .cancelButton {
          border: 1px solid #dfe3e8;

          background: #fff;
          color: #4b5563;
        }

        .cancelButton:hover:not(:disabled) {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .rejectButton {
          border: 1px solid #dc2626;

          background:
            linear-gradient(
              180deg,
              #ef4444,
              #dc2626
            );

          color: #fff;

          box-shadow:
            0 7px 18px
              rgba(220, 38, 38, .16);
        }

        .rejectButton:hover:not(:disabled) {
          box-shadow:
            0 9px 24px
              rgba(220, 38, 38, .22);

          transform: translateY(-1px);
        }

        .cancelButton:disabled,
        .rejectButton:disabled {
          cursor: not-allowed;
          opacity: .55;
          transform: none;
          box-shadow: none;
        }

        .buttonArrow {
          font-size: 15px;
          line-height: 1;
        }

        .buttonCheck {
          font-size: 14px;
        }

        .spinner {
          width: 14px;
          height: 14px;

          border: 2px solid
            rgba(255, 255, 255, .35);

          border-top-color: #fff;

          border-radius: 50%;

          animation:
            rejectSpin
            .7s linear infinite;
        }

        @keyframes rejectSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rejectOverlayIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes rejectModalIn {
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

        @media (max-width: 560px) {
          .rejectModalLayer {
            align-items: flex-end;

            padding:
              10px
              10px
              max(10px, env(safe-area-inset-bottom))
              10px;
          }

          .rejectModal {
            max-height:
              calc(100dvh - 20px);

            padding: 19px;

            border-radius: 22px;
          }

          .rejectModalHeading {
            margin-top: 15px;
          }

          .description {
            font-size: 12px;
          }

          .modalActions {
            grid-template-columns: 1fr;
          }

          .cancelButton {
            order: 2;
          }

          .rejectButton {
            order: 1;
          }
        }

        @media (max-width: 380px) {
          .rejectModal {
            padding: 16px;
          }

          .paymentSummary {
            padding: 13px;
          }

          .rejectModalHeading h2 {
            font-size: 23px;
          }

          .reasonSection textarea {
            min-height: 108px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rejectModalLayer,
          .rejectModal {
            animation: none;
          }

          .closeButton,
          .cancelButton,
          .rejectButton {
            transition: none;
          }

          .spinner {
            animation-duration: 1.4s;
          }
        }
      `}</style>
    </div>
  );
}