'use client';

import { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import {
  getPaymentPlan,
  getOfficialUpiId,
  getPayeeName,
} from '@/lib/payments/payment-config';

/* =========================================================
   SMALL INLINE ICON SYSTEM
   No external icon dependency required.
========================================================= */

function Icon({
  name,
  size = 20,
  strokeWidth = 1.9,
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  switch (name) {
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 20 6v5c0 5.2-3.4 8.8-8 10-4.6-1.2-8-4.8-8-10V6l8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case 'qr':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <path d="M14 14h3v3h-3zM17 17h3v3h-3zM20 14v3" />
        </svg>
      );

    case 'copy':
      return (
        <svg {...common}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
        </svg>
      );

    case 'check':
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case 'external':
      return (
        <svg {...common}>
          <path d="M14 5h5v5" />
          <path d="m19 5-8 8" />
          <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
        </svg>
      );

    case 'info':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
      );

    case 'wallet':
      return (
        <svg {...common}>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
          <path d="M4 8h14" />
          <path d="M16 13h4" />
          <circle cx="16" cy="13" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case 'lock':
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case 'refresh':
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 0 0-14.8-4L4 9" />
          <path d="M4 4v5h5" />
          <path d="M4 13a8 8 0 0 0 14.8 4L20 15" />
          <path d="M20 20v-5h-5" />
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   HELPERS
========================================================= */

function normalizePlan(plan) {
  if (!plan) return null;

  const value = String(plan).trim();

  if (!value) return null;

  if (value.toLowerCase() === 'starter') {
    return 'Starter';
  }

  if (value.toLowerCase() === 'pro') {
    return 'Pro';
  }

  if (value.toLowerCase() === 'elite') {
    return 'Elite';
  }

  return value;
}

function formatAmount(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return '0';
  }

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(amount);
}

function buildUpiUrl({
  upiId,
  payeeName,
  amount,
  note,
}) {
  if (!upiId || !amount) {
    return '';
  }

  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName || 'Worldwide DIPO',
    am: Number(amount).toFixed(2),
    cu: 'INR',
    tn: String(
      note || 'Worldwide DIPO Payment'
    ).slice(0, 80),
  });

  return `upi://pay?${params.toString()}`;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function PaymentInstructions({
  plan,
  amount,
  upiId,
  payeeName,
  paymentReference = '',
  transactionNote,
  showQr = true,
  compact = false,
  className = '',
}) {
  const [copied, setCopied] = useState('');
  const [qrOpen, setQrOpen] = useState(false);

  const normalizedPlan = useMemo(
    () => normalizePlan(plan),
    [plan]
  );

  const planConfig = useMemo(
    () =>
      normalizedPlan
        ? getPaymentPlan(normalizedPlan)
        : null,
    [normalizedPlan]
  );

  /*
   * UI amount is derived from the configured plan unless
   * the parent explicitly provides an amount.
   *
   * Server/database remains the final authority for
   * actual payment verification.
   */
  const finalAmount = useMemo(() => {
    const explicitAmount = Number(amount);

    if (
      Number.isFinite(explicitAmount) &&
      explicitAmount > 0
    ) {
      return explicitAmount;
    }

    const configuredAmount = Number(
      planConfig?.amount
    );

    return Number.isFinite(configuredAmount)
      ? configuredAmount
      : 0;
  }, [amount, planConfig]);

  const officialUpiId =
    String(
      upiId ||
        getOfficialUpiId() ||
        ''
    ).trim();

  const officialPayee =
    String(
      payeeName ||
        getPayeeName() ||
        'Worldwide DIPO'
    ).trim();

  const note =
    transactionNote ||
    paymentReference ||
    (planConfig?.name
      ? `Worldwide DIPO - ${planConfig.name}`
      : 'Worldwide DIPO Payment');

  const upiUrl = useMemo(
    () =>
      buildUpiUrl({
        upiId: officialUpiId,
        payeeName: officialPayee,
        amount: finalAmount,
        note,
      }),
    [
      officialUpiId,
      officialPayee,
      finalAmount,
      note,
    ]
  );

  const amountLabel =
    finalAmount > 0
      ? `₹${formatAmount(finalAmount)}`
      : 'Amount unavailable';

  async function copyText(
    value,
    type
  ) {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopied(type);

      window.setTimeout(() => {
        setCopied('');
      }, 1800);
    } catch {
      setCopied('');
    }
  }

  const rootClass = [
    'dipo-payment-instructions',
    compact
      ? 'dipo-payment-instructions--compact'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      className={rootClass}
      aria-label="Worldwide DIPO payment instructions"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="dipo-payment-instructions__header">
        <div>
          <div className="dipo-payment-instructions__eyebrow">
            <span className="dipo-payment-instructions__eyebrow-dot" />
            SECURE UPI PAYMENT
          </div>

          <h2>
            Complete your payment
          </h2>

          <p>
            Pay using the official UPI details
            below, then submit your UTR /
            payment reference.
          </p>
        </div>

        <div className="dipo-payment-instructions__secure">
          <Icon
            name="shield"
            size={16}
          />
          <span>
            Secure checkout
          </span>
        </div>
      </div>

      {/* =====================================================
          PLAN + AMOUNT
      ====================================================== */}

      <div className="dipo-payment-instructions__summary">
        <div className="dipo-payment-instructions__summary-main">
          <span className="dipo-payment-instructions__label">
            SELECTED PLAN
          </span>

          <strong>
            {planConfig?.name ||
              normalizedPlan ||
              'Worldwide DIPO'}
          </strong>

          {planConfig?.durationMonths && (
            <small>
              Valid for{' '}
              {planConfig.durationMonths}{' '}
              months
            </small>
          )}
        </div>

        <div className="dipo-payment-instructions__amount">
          <span>
            TOTAL
          </span>

          <strong>
            {amountLabel}
          </strong>
        </div>
      </div>

      {/* =====================================================
          PAYMENT BODY
      ====================================================== */}

      <div className="dipo-payment-instructions__body">
        {/* ===================================================
            QR AREA
        ==================================================== */}

        {showQr && (
          <div className="dipo-payment-instructions__qr-column">
            <div className="dipo-payment-instructions__qr-card">
              {upiUrl ? (
                <>
                  <div className="dipo-payment-instructions__qr-wrap">
                    <QRCodeSVG
                      value={upiUrl}
                      size={compact ? 172 : 218}
                      bgColor="#ffffff"
                      fgColor="#09090b"
                      level="M"
                      includeMargin={false}
                      title="Worldwide DIPO UPI payment QR"
                    />
                  </div>

                  <div className="dipo-payment-instructions__qr-caption">
                    <Icon
                      name="qr"
                      size={15}
                    />

                    <span>
                      Scan with any supported
                      UPI app
                    </span>
                  </div>
                </>
              ) : (
                <div className="dipo-payment-instructions__qr-empty">
                  <div>
                    <Icon
                      name="qr"
                      size={30}
                    />
                  </div>

                  <strong>
                    QR unavailable
                  </strong>

                  <span>
                    Official UPI details are
                    not configured yet.
                  </span>
                </div>
              )}
            </div>

            {upiUrl && (
              <button
                type="button"
                className="dipo-payment-instructions__mobile-pay"
                onClick={() =>
                  setQrOpen(true)
                }
              >
                <span>
                  <Icon
                    name="qr"
                    size={17}
                  />
                </span>

                <span>
                  View payment QR
                </span>

                <Icon
                  name="arrow"
                  size={16}
                />
              </button>
            )}
          </div>
        )}

        {/* ===================================================
            DETAILS
        ==================================================== */}

        <div className="dipo-payment-instructions__details">
          <div className="dipo-payment-instructions__step">
            <span className="dipo-payment-instructions__step-number">
              01
            </span>

            <div>
              <span className="dipo-payment-instructions__mini-label">
                CHECK PAYEE
              </span>

              <h3>
                Confirm who you are paying
              </h3>
            </div>
          </div>

          <div className="dipo-payment-instructions__detail-card">
            <div className="dipo-payment-instructions__detail-icon">
              <Icon
                name="wallet"
                size={19}
              />
            </div>

            <div className="dipo-payment-instructions__detail-content">
              <span>
                PAYEE NAME
              </span>

              <strong>
                {officialPayee}
              </strong>
            </div>
          </div>

          <div className="dipo-payment-instructions__detail-card">
            <div className="dipo-payment-instructions__detail-icon">
              <Icon
                name="shield"
                size={19}
              />
            </div>

            <div className="dipo-payment-instructions__detail-content">
              <span>
                OFFICIAL UPI ID
              </span>

              {officialUpiId ? (
                <strong className="dipo-payment-instructions__upi">
                  {officialUpiId}
                </strong>
              ) : (
                <strong className="dipo-payment-instructions__missing">
                  UPI ID not configured
                </strong>
              )}
            </div>

            {officialUpiId && (
              <button
                type="button"
                className="dipo-payment-instructions__copy"
                onClick={() =>
                  copyText(
                    officialUpiId,
                    'upi'
                  )
                }
                aria-label="Copy official UPI ID"
              >
                {copied === 'upi' ? (
                  <Icon
                    name="check"
                    size={17}
                  />
                ) : (
                  <Icon
                    name="copy"
                    size={17}
                  />
                )}

                <span>
                  {copied === 'upi'
                    ? 'Copied'
                    : 'Copy'}
                </span>
              </button>
            )}
          </div>

          <div className="dipo-payment-instructions__detail-card dipo-payment-instructions__detail-card--amount">
            <div className="dipo-payment-instructions__detail-icon">
              <span>₹</span>
            </div>

            <div className="dipo-payment-instructions__detail-content">
              <span>
                PAYMENT AMOUNT
              </span>

              <strong>
                {amountLabel}
              </strong>
            </div>

            {finalAmount > 0 && (
              <button
                type="button"
                className="dipo-payment-instructions__copy"
                onClick={() =>
                  copyText(
                    String(finalAmount),
                    'amount'
                  )
                }
                aria-label="Copy payment amount"
              >
                {copied === 'amount' ? (
                  <Icon
                    name="check"
                    size={17}
                  />
                ) : (
                  <Icon
                    name="copy"
                    size={17}
                  />
                )}

                <span>
                  {copied === 'amount'
                    ? 'Copied'
                    : 'Copy'}
                </span>
              </button>
            )}
          </div>

          {/* =================================================
              OPEN UPI
          ================================================== */}

          {upiUrl && (
            <a
              href={upiUrl}
              className="dipo-payment-instructions__upi-button"
              aria-label="Open payment in UPI app"
            >
              <span className="dipo-payment-instructions__upi-button-icon">
                <Icon
                  name="wallet"
                  size={19}
                />
              </span>

              <span className="dipo-payment-instructions__upi-button-copy">
                <strong>
                  Pay with UPI app
                </strong>

                <small>
                  Opens your installed UPI app
                </small>
              </span>

              <Icon
                name="external"
                size={17}
              />
            </a>
          )}

          {/* =================================================
              TRUST NOTE
          ================================================== */}

          <div className="dipo-payment-instructions__trust">
            <div className="dipo-payment-instructions__trust-icon">
              <Icon
                name="lock"
                size={16}
              />
            </div>

            <div>
              <strong>
                Never share your UPI PIN
              </strong>

              <p>
                Worldwide DIPO will never ask
                for your UPI PIN, OTP, CVV,
                card PIN or banking password.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          3 STEP FLOW
      ====================================================== */}

      <div className="dipo-payment-instructions__flow">
        <div className="dipo-payment-instructions__flow-header">
          <div>
            <span>
              PAYMENT FLOW
            </span>

            <strong>
              Pay → Find UTR → Submit
            </strong>
          </div>

          <span className="dipo-payment-instructions__flow-badge">
            3 steps
          </span>
        </div>

        <div className="dipo-payment-instructions__flow-grid">
          <div className="dipo-payment-instructions__flow-item">
            <span>
              01
            </span>

            <div>
              <strong>
                Complete payment
              </strong>

              <p>
                Pay the exact amount shown
                above using UPI.
              </p>
            </div>
          </div>

          <div className="dipo-payment-instructions__flow-item">
            <span>
              02
            </span>

            <div>
              <strong>
                Find your UTR
              </strong>

              <p>
                Open the successful transaction
                in your UPI app.
              </p>
            </div>
          </div>

          <div className="dipo-payment-instructions__flow-item">
            <span>
              03
            </span>

            <div>
              <strong>
                Submit for verification
              </strong>

              <p>
                Paste the UTR in the payment
                reference field.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          VERIFICATION NOTICE
      ====================================================== */}

      <div className="dipo-payment-instructions__verification">
        <div className="dipo-payment-instructions__verification-icon">
          <Icon
            name="info"
            size={18}
          />
        </div>

        <div>
          <strong>
            Payment verification is manual
          </strong>

          <p>
            Submitting a UTR does not
            automatically activate your DIPO.
            The transaction is checked before
            activation.
          </p>
        </div>
      </div>

      {/* =====================================================
          MOBILE QR MODAL
      ====================================================== */}

      {qrOpen && upiUrl && (
        <div
          className="dipo-payment-instructions__modal"
          role="dialog"
          aria-modal="true"
          aria-label="UPI payment QR"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setQrOpen(false);
            }
          }}
        >
          <div className="dipo-payment-instructions__modal-card">
            <button
              type="button"
              className="dipo-payment-instructions__modal-close"
              onClick={() =>
                setQrOpen(false)
              }
              aria-label="Close QR"
            >
              ×
            </button>

            <span className="dipo-payment-instructions__eyebrow">
              SCAN TO PAY
            </span>

            <h3>
              Pay {amountLabel}
            </h3>

            <div className="dipo-payment-instructions__modal-qr">
              <QRCodeSVG
                value={upiUrl}
                size={250}
                bgColor="#ffffff"
                fgColor="#09090b"
                level="M"
                includeMargin={false}
                title="Worldwide DIPO payment QR"
              />
            </div>

            <strong>
              {officialPayee}
            </strong>

            <span>
              {officialUpiId}
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          COMPONENT STYLES
      ====================================================== */}

      <style>{`
        .dipo-payment-instructions {
          --dipo-black: #09090b;
          --dipo-text: #111113;
          --dipo-muted: #71717a;
          --dipo-soft: #a1a1aa;
          --dipo-border: #e4e4e7;
          --dipo-border-soft: #ededf0;
          --dipo-surface: #ffffff;
          --dipo-surface-soft: #fafafa;
          --dipo-green: #10b981;
          --dipo-green-dark: #059669;
          --dipo-green-soft: #ecfdf5;

          position: relative;
          width: 100%;
          overflow: hidden;

          border: 1px solid var(--dipo-border);
          border-radius: 28px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(16, 185, 129, .075),
              transparent 31%
            ),
            linear-gradient(
              180deg,
              #fff 0%,
              #fcfcfc 100%
            );

          color: var(--dipo-text);

          box-shadow:
            0 1px 2px rgba(0, 0, 0, .025),
            0 18px 55px rgba(0, 0, 0, .045);
        }

        .dipo-payment-instructions *,
        .dipo-payment-instructions *::before,
        .dipo-payment-instructions *::after {
          box-sizing: border-box;
        }

        .dipo-payment-instructions button,
        .dipo-payment-instructions a {
          -webkit-tap-highlight-color: transparent;
        }

        .dipo-payment-instructions__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;

          padding: clamp(22px, 4vw, 36px);
          border-bottom: 1px solid var(--dipo-border-soft);
        }

        .dipo-payment-instructions__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          color: var(--dipo-green-dark);

          font-size: 10px;
          font-weight: 800;
          letter-spacing: .16em;
          line-height: 1;
        }

        .dipo-payment-instructions__eyebrow-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;

          border-radius: 50%;
          background: var(--dipo-green);

          box-shadow:
            0 0 0 4px
            rgba(16, 185, 129, .10);
        }

        .dipo-payment-instructions__header h2 {
          margin: 11px 0 7px;

          color: var(--dipo-black);

          font-size: clamp(23px, 4vw, 34px);
          font-weight: 800;
          letter-spacing: -.045em;
          line-height: 1.04;
        }

        .dipo-payment-instructions__header p {
          max-width: 610px;
          margin: 0;

          color: var(--dipo-muted);

          font-size: 14px;
          line-height: 1.65;
        }

        .dipo-payment-instructions__secure {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          flex: 0 0 auto;

          padding: 9px 12px;

          border: 1px solid #d9f5e9;
          border-radius: 999px;

          background: rgba(236, 253, 245, .72);
          color: var(--dipo-green-dark);

          font-size: 11px;
          font-weight: 750;
          white-space: nowrap;
        }

        .dipo-payment-instructions__summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          margin: 20px clamp(16px, 3vw, 30px) 0;
          padding: 18px 20px;

          border: 1px solid var(--dipo-border-soft);
          border-radius: 19px;

          background: #fff;
        }

        .dipo-payment-instructions__summary-main {
          min-width: 0;
        }

        .dipo-payment-instructions__label,
        .dipo-payment-instructions__amount > span,
        .dipo-payment-instructions__detail-content > span,
        .dipo-payment-instructions__mini-label {
          display: block;

          color: #8a8a93;

          font-size: 9px;
          font-weight: 800;
          letter-spacing: .14em;
          line-height: 1.2;
        }

        .dipo-payment-instructions__summary-main strong {
          display: block;

          margin-top: 5px;

          color: var(--dipo-black);

          font-size: 17px;
          font-weight: 800;
          letter-spacing: -.025em;
        }

        .dipo-payment-instructions__summary-main small {
          display: block;

          margin-top: 4px;

          color: var(--dipo-muted);

          font-size: 11px;
        }

        .dipo-payment-instructions__amount {
          flex: 0 0 auto;
          text-align: right;
        }

        .dipo-payment-instructions__amount strong {
          display: block;

          margin-top: 3px;

          color: var(--dipo-black);

          font-size: clamp(24px, 4vw, 31px);
          font-weight: 850;
          letter-spacing: -.055em;
          line-height: 1;
        }

        .dipo-payment-instructions__body {
          display: grid;
          grid-template-columns:
            minmax(210px, .72fr)
            minmax(0, 1.28fr);

          gap: clamp(20px, 4vw, 38px);

          padding: clamp(20px, 4vw, 32px);
        }

        .dipo-payment-instructions__qr-column {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .dipo-payment-instructions__qr-card {
          width: 100%;
          max-width: 285px;

          padding: 16px;

          border: 1px solid var(--dipo-border);
          border-radius: 24px;

          background: #fff;

          box-shadow:
            0 12px 30px rgba(0, 0, 0, .055);
        }

        .dipo-payment-instructions__qr-wrap {
          display: grid;
          place-items: center;

          width: 100%;
          aspect-ratio: 1;

          padding: 14px;

          border-radius: 17px;

          background: #fff;
          border: 1px solid #f0f0f2;
        }

        .dipo-payment-instructions__qr-wrap svg {
          display: block;
          width: 100%;
          max-width: 218px;
          height: auto;
        }

        .dipo-payment-instructions__qr-caption {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;

          padding-top: 13px;

          color: var(--dipo-muted);

          font-size: 11px;
          font-weight: 650;
          text-align: center;
        }

        .dipo-payment-instructions__qr-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          min-height: 245px;
          padding: 24px;

          text-align: center;
        }

        .dipo-payment-instructions__qr-empty > div {
          display: grid;
          place-items: center;

          width: 58px;
          height: 58px;
          margin-bottom: 14px;

          border-radius: 17px;

          background: #f4f4f5;
          color: #71717a;
        }

        .dipo-payment-instructions__qr-empty strong {
          color: var(--dipo-black);
          font-size: 14px;
        }

        .dipo-payment-instructions__qr-empty span {
          max-width: 190px;
          margin-top: 6px;

          color: var(--dipo-muted);
          font-size: 11px;
          line-height: 1.5;
        }

        .dipo-payment-instructions__mobile-pay {
          display: none;
        }

        .dipo-payment-instructions__details {
          min-width: 0;
        }

        .dipo-payment-instructions__step {
          display: flex;
          align-items: flex-start;
          gap: 12px;

          margin-bottom: 15px;
        }

        .dipo-payment-instructions__step-number {
          display: grid;
          place-items: center;

          width: 30px;
          height: 30px;
          flex: 0 0 30px;

          border-radius: 10px;

          background: var(--dipo-black);
          color: white;

          font-size: 10px;
          font-weight: 800;
          letter-spacing: .03em;
        }

        .dipo-payment-instructions__step h3 {
          margin: 4px 0 0;

          color: var(--dipo-black);

          font-size: 17px;
          font-weight: 800;
          letter-spacing: -.025em;
        }

        .dipo-payment-instructions__detail-card {
          display: flex;
          align-items: center;
          gap: 12px;

          min-width: 0;

          margin-top: 9px;
          padding: 13px 14px;

          border: 1px solid var(--dipo-border-soft);
          border-radius: 16px;

          background: rgba(255,255,255,.82);

          transition:
            border-color .18s ease,
            transform .18s ease,
            box-shadow .18s ease;
        }

        .dipo-payment-instructions__detail-card:hover {
          border-color: #dcdcdf;

          box-shadow:
            0 8px 24px rgba(0,0,0,.035);
        }

        .dipo-payment-instructions__detail-icon {
          display: grid;
          place-items: center;

          width: 39px;
          height: 39px;
          flex: 0 0 39px;

          border-radius: 12px;

          background: #f5f5f6;
          color: #343438;
        }

        .dipo-payment-instructions__detail-card--amount
          .dipo-payment-instructions__detail-icon {
          background: var(--dipo-green-soft);
          color: var(--dipo-green-dark);

          font-size: 18px;
          font-weight: 850;
        }

        .dipo-payment-instructions__detail-content {
          min-width: 0;
          flex: 1;
        }

        .dipo-payment-instructions__detail-content strong {
          display: block;

          max-width: 100%;
          margin-top: 4px;

          overflow: hidden;
          color: var(--dipo-black);

          font-size: 13px;
          font-weight: 750;
          line-height: 1.35;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-payment-instructions__detail-content strong.dipo-payment-instructions__upi {
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

          letter-spacing: -.02em;
        }

        .dipo-payment-instructions__detail-content strong.dipo-payment-instructions__missing {
          color: #a16207;
        }

        .dipo-payment-instructions__copy {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;

          min-width: 70px;
          height: 34px;
          padding: 0 9px;
          flex: 0 0 auto;

          border: 1px solid #e5e5e8;
          border-radius: 10px;

          background: #fff;
          color: #52525b;

          cursor: pointer;

          font: inherit;
          font-size: 10px;
          font-weight: 750;

          transition:
            background .18s ease,
            border-color .18s ease,
            color .18s ease,
            transform .18s ease;
        }

        .dipo-payment-instructions__copy:hover {
          border-color: #d4d4d8;
          background: #fafafa;
          color: var(--dipo-black);
        }

        .dipo-payment-instructions__copy:active {
          transform: scale(.97);
        }

        .dipo-payment-instructions__upi-button {
          display: flex;
          align-items: center;
          gap: 11px;

          min-height: 58px;
          margin-top: 13px;
          padding: 10px 13px;

          border-radius: 15px;

          background: var(--dipo-black);
          color: #fff;

          text-decoration: none;

          box-shadow:
            0 10px 24px rgba(9,9,11,.12);

          transition:
            transform .18s ease,
            box-shadow .18s ease;
        }

        .dipo-payment-instructions__upi-button:hover {
          transform: translateY(-1px);

          box-shadow:
            0 14px 30px rgba(9,9,11,.17);
        }

        .dipo-payment-instructions__upi-button:active {
          transform: translateY(0);
        }

        .dipo-payment-instructions__upi-button-icon {
          display: grid;
          place-items: center;

          width: 37px;
          height: 37px;
          flex: 0 0 37px;

          border-radius: 11px;

          background: rgba(255,255,255,.11);
        }

        .dipo-payment-instructions__upi-button-copy {
          min-width: 0;
          flex: 1;
        }

        .dipo-payment-instructions__upi-button-copy strong {
          display: block;

          font-size: 12px;
          font-weight: 800;
        }

        .dipo-payment-instructions__upi-button-copy small {
          display: block;

          margin-top: 2px;

          color: #a1a1aa;

          font-size: 10px;
        }

        .dipo-payment-instructions__trust {
          display: flex;
          align-items: flex-start;
          gap: 10px;

          margin-top: 13px;
          padding: 13px;

          border: 1px solid #dff7ec;
          border-radius: 15px;

          background: #f5fffa;
        }

        .dipo-payment-instructions__trust-icon {
          display: grid;
          place-items: center;

          width: 29px;
          height: 29px;
          flex: 0 0 29px;

          border-radius: 9px;

          background: #dff9ed;
          color: var(--dipo-green-dark);
        }

        .dipo-payment-instructions__trust strong {
          display: block;

          color: #166534;

          font-size: 11px;
          font-weight: 800;
        }

        .dipo-payment-instructions__trust p {
          margin: 3px 0 0;

          color: #4d7c61;

          font-size: 10px;
          line-height: 1.5;
        }

        .dipo-payment-instructions__flow {
          margin: 0 clamp(16px, 3vw, 30px) 22px;
          padding: 18px;

          border: 1px solid var(--dipo-border-soft);
          border-radius: 20px;

          background: #fff;
        }

        .dipo-payment-instructions__flow-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;

          padding-bottom: 14px;
          border-bottom: 1px solid #f0f0f2;
        }

        .dipo-payment-instructions__flow-header span:first-child {
          display: block;

          color: #96969e;

          font-size: 9px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .dipo-payment-instructions__flow-header strong {
          display: block;

          margin-top: 4px;

          color: var(--dipo-black);

          font-size: 14px;
          font-weight: 800;
          letter-spacing: -.02em;
        }

        .dipo-payment-instructions__flow-badge {
          padding: 6px 9px;

          border-radius: 999px;

          background: #f4f4f5;
          color: #52525b;

          font-size: 9px;
          font-weight: 750;
          white-space: nowrap;
        }

        .dipo-payment-instructions__flow-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .dipo-payment-instructions__flow-item {
          display: flex;
          gap: 10px;

          padding: 17px 13px 3px;
        }

        .dipo-payment-instructions__flow-item
          + .dipo-payment-instructions__flow-item {
          border-left: 1px solid #f0f0f2;
        }

        .dipo-payment-instructions__flow-item > span {
          display: grid;
          place-items: center;

          width: 26px;
          height: 26px;
          flex: 0 0 26px;

          border-radius: 8px;

          background: #f4f4f5;
          color: #52525b;

          font-size: 9px;
          font-weight: 800;
        }

        .dipo-payment-instructions__flow-item strong {
          display: block;

          color: var(--dipo-black);

          font-size: 11px;
          font-weight: 800;
        }

        .dipo-payment-instructions__flow-item p {
          margin: 4px 0 0;

          color: var(--dipo-muted);

          font-size: 10px;
          line-height: 1.5;
        }

        .dipo-payment-instructions__verification {
          display: flex;
          align-items: flex-start;
          gap: 10px;

          margin: 0 clamp(16px, 3vw, 30px) 30px;
          padding: 14px;

          border: 1px solid #e8e8eb;
          border-radius: 16px;

          background: #fafafa;
        }

        .dipo-payment-instructions__verification-icon {
          display: grid;
          place-items: center;

          width: 30px;
          height: 30px;
          flex: 0 0 30px;

          border-radius: 9px;

          background: #ededf0;
          color: #52525b;
        }

        .dipo-payment-instructions__verification strong {
          display: block;

          color: var(--dipo-black);

          font-size: 11px;
          font-weight: 800;
        }

        .dipo-payment-instructions__verification p {
          margin: 3px 0 0;

          color: var(--dipo-muted);

          font-size: 10px;
          line-height: 1.55;
        }

        .dipo-payment-instructions__modal {
          position: fixed;
          inset: 0;
          z-index: 9999;

          display: grid;
          place-items: center;

          padding: 20px;

          background: rgba(0,0,0,.62);

          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .dipo-payment-instructions__modal-card {
          position: relative;

          display: flex;
          flex-direction: column;
          align-items: center;

          width: min(100%, 390px);

          padding: 30px 24px 26px;

          border: 1px solid rgba(255,255,255,.55);
          border-radius: 28px;

          background: #fff;

          box-shadow:
            0 30px 90px rgba(0,0,0,.28);

          text-align: center;
        }

        .dipo-payment-instructions__modal-card h3 {
          margin: 8px 0 20px;

          color: var(--dipo-black);

          font-size: 25px;
          font-weight: 850;
          letter-spacing: -.05em;
        }

        .dipo-payment-instructions__modal-card > strong {
          margin-top: 18px;

          color: var(--dipo-black);

          font-size: 13px;
        }

        .dipo-payment-instructions__modal-card > span:last-child {
          margin-top: 4px;

          color: var(--dipo-muted);

          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

          font-size: 10px;
        }

        .dipo-payment-instructions__modal-qr {
          padding: 15px;

          border: 1px solid #ededee;
          border-radius: 20px;

          background: #fff;
        }

        .dipo-payment-instructions__modal-close {
          position: absolute;
          top: 13px;
          right: 13px;

          display: grid;
          place-items: center;

          width: 34px;
          height: 34px;

          border: 1px solid #e4e4e7;
          border-radius: 50%;

          background: #fafafa;
          color: #52525b;

          cursor: pointer;

          font-size: 22px;
          line-height: 1;
        }

        .dipo-payment-instructions button:focus-visible,
        .dipo-payment-instructions a:focus-visible {
          outline: 3px solid rgba(16,185,129,.28);
          outline-offset: 3px;
        }

        /* =====================================================
           COMPACT
        ====================================================== */

        .dipo-payment-instructions--compact
          .dipo-payment-instructions__header {
          padding: 20px;
        }

        .dipo-payment-instructions--compact
          .dipo-payment-instructions__body {
          padding: 20px;
        }

        .dipo-payment-instructions--compact
          .dipo-payment-instructions__flow,
        .dipo-payment-instructions--compact
          .dipo-payment-instructions__verification {
          margin-left: 20px;
          margin-right: 20px;
        }

        /* =====================================================
           TABLET
        ====================================================== */

        @media (max-width: 820px) {
          .dipo-payment-instructions__body {
            grid-template-columns: 1fr;
          }

          .dipo-payment-instructions__qr-column {
            align-items: stretch;
          }

          .dipo-payment-instructions__qr-card {
            max-width: none;
          }

          .dipo-payment-instructions__qr-wrap {
            aspect-ratio: auto;
            min-height: 270px;
          }

          .dipo-payment-instructions__qr-wrap svg {
            width: min(100%, 230px);
          }

          .dipo-payment-instructions__flow-grid {
            grid-template-columns: 1fr;
          }

          .dipo-payment-instructions__flow-item {
            padding: 13px 0;
          }

          .dipo-payment-instructions__flow-item
            + .dipo-payment-instructions__flow-item {
            border-top: 1px solid #f0f0f2;
            border-left: 0;
          }
        }

        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 560px) {
          .dipo-payment-instructions {
            border-radius: 22px;
          }

          .dipo-payment-instructions__header {
            flex-direction: column;
            gap: 15px;

            padding: 21px 18px;
          }

          .dipo-payment-instructions__secure {
            align-self: flex-start;
          }

          .dipo-payment-instructions__header h2 {
            font-size: 25px;
          }

          .dipo-payment-instructions__header p {
            font-size: 12px;
          }

          .dipo-payment-instructions__summary {
            align-items: flex-start;

            margin: 14px 14px 0;
            padding: 15px;

            border-radius: 16px;
          }

          .dipo-payment-instructions__summary-main strong {
            font-size: 14px;
          }

          .dipo-payment-instructions__amount strong {
            font-size: 23px;
          }

          .dipo-payment-instructions__body {
            gap: 20px;
            padding: 17px 14px;
          }

          .dipo-payment-instructions__qr-card {
            padding: 12px;
            border-radius: 19px;
          }

          .dipo-payment-instructions__qr-wrap {
            min-height: 235px;
            padding: 10px;
          }

          .dipo-payment-instructions__qr-wrap svg {
            width: min(100%, 205px);
          }

          .dipo-payment-instructions__mobile-pay {
            display: flex;
            align-items: center;
            gap: 9px;

            width: 100%;
            min-height: 47px;
            margin-top: 9px;
            padding: 0 12px;

            border: 1px solid var(--dipo-border);
            border-radius: 13px;

            background: #fff;
            color: var(--dipo-black);

            cursor: pointer;

            font: inherit;
            font-size: 11px;
            font-weight: 750;
          }

          .dipo-payment-instructions__mobile-pay > span:nth-child(2) {
            flex: 1;
            text-align: left;
          }

          .dipo-payment-instructions__step h3 {
            font-size: 15px;
          }

          .dipo-payment-instructions__detail-card {
            padding: 11px;
            border-radius: 14px;
          }

          .dipo-payment-instructions__detail-icon {
            width: 36px;
            height: 36px;
            flex-basis: 36px;
          }

          .dipo-payment-instructions__detail-content strong {
            font-size: 11px;
          }

          .dipo-payment-instructions__copy {
            min-width: 34px;
            width: 34px;
            padding: 0;
          }

          .dipo-payment-instructions__copy span {
            display: none;
          }

          .dipo-payment-instructions__upi-button {
            min-height: 54px;
          }

          .dipo-payment-instructions__flow {
            margin: 0 14px 15px;
            padding: 15px;
          }

          .dipo-payment-instructions__verification {
            margin: 0 14px 20px;
          }

          .dipo-payment-instructions__flow-header {
            align-items: flex-start;
          }

          .dipo-payment-instructions__flow-header strong {
            font-size: 12px;
          }

          .dipo-payment-instructions__flow-badge {
            font-size: 8px;
          }
        }

        @media (max-width: 360px) {
          .dipo-payment-instructions__summary {
            flex-direction: column;
            gap: 11px;
          }

          .dipo-payment-instructions__amount {
            text-align: left;
          }

          .dipo-payment-instructions__amount strong {
            font-size: 25px;
          }

          .dipo-payment-instructions__secure {
            font-size: 10px;
          }
        }

        /* =====================================================
           REDUCED MOTION
        ====================================================== */

        @media (prefers-reduced-motion: reduce) {
          .dipo-payment-instructions *,
          .dipo-payment-instructions *::before,
          .dipo-payment-instructions *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}