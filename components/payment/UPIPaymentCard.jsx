'use client';

import { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import {
  getPaymentPlan,
} from '@/lib/payments/payment-config';

import {
  createUpiPaymentUrl,
  createUpiAppUrl,
  getOfficialUpiId,
  getPayeeName,
} from '@/lib/payments/upi';

export default function UPIPaymentCard({
  plan,
}) {
  const [copied, setCopied] = useState(false);

  const config = useMemo(
    () => getPaymentPlan(plan),
    [plan]
  );

  const upiId = getOfficialUpiId();
  const payeeName = getPayeeName();

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

  if (!config) {
    return null;
  }

  const copyUpiId = async () => {
    if (!upiId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(upiId);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  const openUpi = () => {
    if (!upiUrl) {
      return;
    }

    window.location.href = upiUrl;
  };
      const openUpiApp = (app) => {
    try {
      window.location.href = createUpiAppUrl(plan, app);
    } catch {
      /* ignore */
    }
  };

  return (
    <section
      className="dipo-upi-card"
      aria-labelledby="dipo-upi-title"
    >
      <style jsx>{`
        .dipo-upi-card {
          position: relative;
          overflow: hidden;
          width: 100%;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(16, 185, 129, 0.12),
              transparent 34%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fafafa 100%
            );
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.08),
            0 4px 18px rgba(0, 0, 0, 0.04);
        }

        .dipo-upi-glow {
          position: absolute;
          top: -100px;
          right: -80px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.08);
          filter: blur(30px);
          pointer-events: none;
        }

        .dipo-upi-inner {
          position: relative;
          z-index: 1;
          padding: 24px;
        }

        .dipo-upi-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
        }

        .dipo-upi-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 0 0 8px;
          color: #059669;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .dipo-upi-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #10b981;
          box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.1);
        }

        .dipo-upi-title {
          margin: 0;
          color: #111827;
          font-size: clamp(25px, 6vw, 34px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 900;
        }

        .dipo-upi-subtitle {
          margin: 8px 0 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        }

        .dipo-upi-amount {
          flex: 0 0 auto;
          padding: 10px 13px;
          border-radius: 14px;
          background: #111827;
          color: #ffffff;
          font-size: 15px;
          font-weight: 850;
          white-space: nowrap;
        }

        .dipo-upi-main {
          display: grid;
          grid-template-columns: minmax(230px, 290px) minmax(0, 1fr);
          gap: 24px;
          align-items: stretch;
        }

        .dipo-upi-qr-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 310px;
          padding: 22px;
          border: 1px solid rgba(0, 0, 0, 0.07);
          border-radius: 24px;
          background: #f7f7f7;
        }

        .dipo-upi-qr-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .dipo-upi-qr {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 232px;
          height: 232px;
          padding: 10px;
          border-radius: 20px;
          background: #ffffff;
          box-shadow:
            0 14px 35px rgba(0, 0, 0, 0.09),
            inset 0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        .dipo-upi-qr-unavailable {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 14px;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
        }

        .dipo-upi-scan-label {
          margin: 0;
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
        }

        .dipo-upi-details {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }

        .dipo-upi-payee {
          margin-bottom: 18px;
          padding: 17px;
          border-radius: 18px;
          background: #f4f4f5;
        }

        .dipo-upi-label {
          display: block;
          margin-bottom: 6px;
          color: #71717a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dipo-upi-payee-name {
          display: block;
          overflow: hidden;
          color: #18181b;
          font-size: 16px;
          font-weight: 850;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-upi-id-row {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 18px;
          padding: 13px;
          border: 1px solid rgba(0, 0, 0, 0.07);
          border-radius: 17px;
          background: #ffffff;
        }

        .dipo-upi-id {
          min-width: 0;
          flex: 1;
          overflow: hidden;
          color: #111827;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: 13px;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-upi-copy {
          flex: 0 0 auto;
          min-height: 38px;
          padding: 0 12px;
          border: 0;
          border-radius: 11px;
          background: #111827;
          color: #ffffff;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          transition:
            transform 160ms ease,
            opacity 160ms ease;
        }

        .dipo-upi-copy:hover {
          transform: translateY(-1px);
        }

        .dipo-upi-copy:active {
          transform: translateY(0);
        }

        .dipo-upi-copy:focus-visible {
          outline: 3px solid rgba(16, 185, 129, 0.25);
          outline-offset: 2px;
        }

        .dipo-upi-copy.is-copied {
          background: #059669;
        }

        .dipo-upi-price {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 17px;
          padding: 16px 17px;
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 18px;
          background: rgba(16, 185, 129, 0.06);
        }

        .dipo-upi-price span {
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
        }

        .dipo-upi-price strong {
          color: #047857;
          font-size: 25px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .dipo-upi-pay {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          min-height: 54px;
          padding: 0 18px;
          border: 0;
          border-radius: 16px;
          background: #111827;
          color: #ffffff;
          text-decoration: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 850;
          box-shadow: 0 12px 24px rgba(17, 24, 39, 0.15);
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            opacity 160ms ease;
        }

        .dipo-upi-pay:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 30px rgba(17, 24, 39, 0.2);
        }

        .dipo-upi-pay:active {
          transform: translateY(0);
        }

        .dipo-upi-pay:focus-visible {
          outline: 3px solid rgba(16, 185, 129, 0.25);
          outline-offset: 3px;
        }

        .dipo-upi-pay-arrow {
          font-size: 18px;
        }

        .dipo-upi-unavailable {
          padding: 14px;
          border-radius: 14px;
          background: #fff7ed;
          color: #9a3412;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.5;
        }

        .dipo-upi-security {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 12px;
          margin-top: 22px;
          padding: 16px;
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 18px;
          background: #fffbeb;
        }

        .dipo-upi-security-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 11px;
          background: #fef3c7;
          font-size: 16px;
        }

        .dipo-upi-security strong {
          display: block;
          margin-bottom: 4px;
          color: #92400e;
          font-size: 13px;
          font-weight: 900;
        }

        .dipo-upi-security p {
          margin: 0;
          color: #92400e;
          font-size: 12px;
          line-height: 1.55;
        }

        .dipo-upi-after {
          margin-top: 18px;
          padding: 18px;
          border-radius: 20px;
          background: #111827;
          color: #ffffff;
        }

        .dipo-upi-after-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 7px;
          font-size: 14px;
          font-weight: 900;
        }

        .dipo-upi-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #10b981;
          color: #ffffff;
          font-size: 12px;
        }

        .dipo-upi-after p {
          margin: 0;
          color: rgba(255, 255, 255, 0.68);
          font-size: 12px;
          line-height: 1.6;
        }

        .dipo-upi-reference {
          display: inline-flex;
          margin-top: 10px;
          padding: 6px 9px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
        }

        @media (max-width: 760px) {
          .dipo-upi-inner {
            padding: 17px;
          }

          .dipo-upi-top {
            flex-direction: column;
            gap: 12px;
          }

          .dipo-upi-amount {
            align-self: flex-start;
          }

          .dipo-upi-main {
            grid-template-columns: 1fr;
            gap: 17px;
          }

          .dipo-upi-qr-panel {
            min-height: auto;
            padding: 18px;
          }

          .dipo-upi-qr {
            width: min(230px, 72vw);
            height: min(230px, 72vw);
          }

          .dipo-upi-details {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .dipo-upi-card {
            border-radius: 23px;
          }

          .dipo-upi-title {
            font-size: 27px;
          }

          .dipo-upi-id-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .dipo-upi-id {
            width: 100%;
          }

          .dipo-upi-copy {
            width: 100%;
          }

          .dipo-upi-price {
            align-items: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-upi-copy,
          .dipo-upi-pay {
            transition: none;
          }
        }
      `}</style>

      <div className="dipo-upi-glow" />

      <div className="dipo-upi-inner">
        {/* HEADER */}
        <div className="dipo-upi-top">
          <div>
            <p className="dipo-upi-eyebrow">
              <span className="dipo-upi-eyebrow-dot" />
              Secure UPI Payment
            </p>

            <h2
              id="dipo-upi-title"
              className="dipo-upi-title"
            >
              Pay & activate
            </h2>

            <p className="dipo-upi-subtitle">
              {config.name} ·{' '}
              {config.durationMonths || 6} months
            </p>
          </div>

          <div className="dipo-upi-amount">
            ₹{config.amount}
          </div>
        </div>

        {/* MAIN PAYMENT AREA */}
        <div className="dipo-upi-main">
          {/* QR */}
          <div className="dipo-upi-qr-panel">
            <div className="dipo-upi-qr-box">
              <div className="dipo-upi-qr">
                {upiUrl ? (
                  <QRCodeSVG
                    value={upiUrl}
                    size={208}
                    level="M"
                    includeMargin
                    bgColor="#ffffff"
                    fgColor="#111827"
                    aria-label={`UPI payment QR for ${config.name}`}
                  />
                ) : (
                  <div className="dipo-upi-qr-unavailable">
                    QR code is currently unavailable.
                  </div>
                )}
              </div>

              {upiUrl && (
                <p className="dipo-upi-scan-label">
                  Scan with any supported UPI app
                </p>
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div className="dipo-upi-details">
            <div className="dipo-upi-payee">
              <span className="dipo-upi-label">
                Payee
              </span>

              <strong className="dipo-upi-payee-name">
                {payeeName}
              </strong>
            </div>

            <div className="dipo-upi-id-row">
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="dipo-upi-label">
                  Official UPI ID
                </span>

                <strong className="dipo-upi-id">
                  {upiId || 'UPI ID not configured'}
                </strong>
              </div>

              {upiId && (
                <button
                  type="button"
                  className={`dipo-upi-copy ${
                    copied ? 'is-copied' : ''
                  }`}
                  onClick={copyUpiId}
                  aria-label="Copy official UPI ID"
                >
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              )}
            </div>

            <div className="dipo-upi-price">
              <span>
                Exact amount to pay
              </span>

              <strong>
                ₹{config.amount}
              </strong>
            </div>

            {upiUrl ? (
              <button
                type="button"
                className="dipo-upi-pay"
                onClick={openUpi}
              >
                Open UPI App
                <span className="dipo-upi-pay-arrow">
                  ↗
                </span>
              </button>
          


            ) : (
              <div className="dipo-upi-unavailable">
                UPI payment is not configured yet.
                Please contact Worldwide DIPO support
                before sending any payment.
              </div>
            )}
          </div>
                      {upiUrl && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button type="button" className="dipo-upi-copy" onClick={() => openUpiApp('gpay')}>GPay</button>
                <button type="button" className="dipo-upi-copy" onClick={() => openUpiApp('phonepe')}>PhonePe</button>
                <button type="button" className="dipo-upi-copy" onClick={() => openUpiApp('paytm')}>Paytm</button>
              </div>
            )}
          </div>

        {/* SECURITY */}
        <div className="dipo-upi-security">
          <div className="dipo-upi-security-icon">
            🔒
          </div>

          <div>
            <strong>
              Never share sensitive banking details
            </strong>

            <p>
              Worldwide DIPO will never ask for your
              UPI PIN, OTP, bank password, CVV or card
              password. Only submit your payment
              reference / UTR after completing the
              payment.
            </p>
          </div>
        </div>

        {/* AFTER PAYMENT */}
        <div className="dipo-upi-after">
          <h3 className="dipo-upi-after-title">
            <span className="dipo-upi-check">
              ✓
            </span>

            Payment ke baad kya karein?
          </h3>

          <p>
            UPI payment complete hone ke baad
            transaction ka UTR / Payment Reference
            copy karein aur neeche payment claim form
            me submit karein. Admin transaction verify
            karega, uske baad profile activation
            process continue hoga.
          </p>

          <span className="dipo-upi-reference">
            UTR → Payment Verification → Activation
          </span>
        </div>
      </div>
    </section>
  );
}