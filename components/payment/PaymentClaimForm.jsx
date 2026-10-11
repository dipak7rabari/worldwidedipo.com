'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import PlanSelector from './PlanSelector';
import UPIPaymentCard from './UPIPaymentCard';

import {
  getPaymentPlan,
} from '@/lib/payments/payment-config';

import {
  validatePaymentClaimInput,
} from '@/lib/payments/payment-validation';

const SUPPORT_EMAIL =
  'dipolabs123@gmail.com';

export default function PaymentClaimForm({
  profile,
}) {
  const router = useRouter();

  const [plan, setPlan] = useState(
    profile?.plan || 'Starter'
  );

  const [reference, setReference] =
    useState('');

  const [errors, setErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const selectedPlan = useMemo(
    () => getPaymentPlan(plan),
    [plan]
  );

  const referenceLength =
    reference.trim().length;

  function handlePlanChange(value) {
    if (submitting) return;

    setPlan(value);

    setErrors({});
  }

  function handleReferenceChange(event) {
    const value = event.target.value;

    setReference(value);

    setErrors((current) => ({
      ...current,
      payment_reference: undefined,
      form: undefined,
    }));
  }

  async function copySupportEmail() {
    try {
      await navigator.clipboard.writeText(
        SUPPORT_EMAIL
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setErrors({});
    setSubmitted(false);

    const validation =
      validatePaymentClaimInput({
        plan,
        payment_reference:
          reference,
      });

    if (!validation.valid) {
      setErrors(validation.errors || {});
      return;
    }

    setSubmitting(true);

    try {
      /*
       * IMPORTANT:
       *
       * The server is the authority for:
       * - plan
       * - amount
       * - profile ownership
       * - payment type
       * - pending status
       *
       * Client-side price is only UI.
       */

      const response =
        await fetch(
          '/api/payment/create',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            credentials:
              'same-origin',

            body: JSON.stringify({
              plan,
              payment_reference:
                validation.value
                  .payment_reference,
            }),
          }
        );

      let result = null;

      try {
        result =
          await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        setErrors(
          result?.errors || {
            form:
              result?.error ||
              'Unable to submit your payment reference. Please try again.',
          }
        );

        return;
      }

      setSubmitted(true);

      setReference('');

      /*
       * Refresh server components so the new
       * profile/payment state is immediately
       * reflected in the dashboard.
       */
      router.refresh();
    } catch (error) {
      console.error(
        'Payment submission error:',
        error
      );

      setErrors({
        form:
          'Network error. Please check your connection and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * ==========================================================
   * SUCCESS STATE
   * ==========================================================
   */

  if (submitted) {
    return (
      <section
        className="dipo-payment-success"
        aria-live="polite"
      >

        <div className="dipo-success-top">

          <div className="dipo-success-icon">
            ✓
          </div>

          <div>
            <span className="dipo-success-kicker">
              PAYMENT RECEIVED
            </span>

            <h2>
              Verification is in progress
            </h2>
          </div>

        </div>


        <p className="dipo-success-message">
          Your payment reference has been
          submitted successfully. Your DIPO is
          now waiting for manual payment
          verification.
        </p>


        <div className="dipo-success-status">

          <div>
            <span>
              STATUS
            </span>

            <strong>
              Pending Verification
            </strong>
          </div>

          <div>
            <span>
              PLAN
            </span>

            <strong>
              {selectedPlan?.name ||
                plan}
            </strong>
          </div>

        </div>


        <div className="dipo-success-next">

          <div className="dipo-success-next-number">
            01
          </div>

          <div>
            <strong>
              Payment verification
            </strong>

            <p>
              Our payment team checks the
              submitted reference against the
              actual transaction.
            </p>
          </div>

        </div>


        <div className="dipo-success-next">

          <div className="dipo-success-next-number">
            02
          </div>

          <div>
            <strong>
              Profile activation
            </strong>

            <p>
              Once the payment is verified,
              your DIPO can be activated
              according to the selected plan.
            </p>
          </div>

        </div>


        <div className="dipo-success-actions">

          <a
            href="/dashboard/profile"
            className="dipo-success-primary"
          >
            Go to My DIPO
          </a>

          <a
            href="mailto:dipolabs123@gmail.com?subject=Worldwide%20DIPO%20Payment%20Verification"
            className="dipo-success-secondary"
          >
            Contact Support
          </a>

        </div>


        <p className="dipo-success-disclaimer">
          Submitting a payment reference does not
          itself activate the profile. Activation
          happens after successful verification.
        </p>

      </section>
    );
  }


  /*
   * ==========================================================
   * PAYMENT FORM
   * ==========================================================
   */

  return (
    <form
      className="dipo-payment-form"
      onSubmit={handleSubmit}
      noValidate
    >

      {/* ====================================================
          PLAN
      ===================================================== */}

      <section className="dipo-payment-section">

        <div className="dipo-payment-section-header">

          <div className="dipo-payment-step">
            01
          </div>

          <div>
            <span>
              CHOOSE YOUR PLAN
            </span>

            <h2>
              Select what fits your DIPO
            </h2>

            <p>
              Every plan is valid for 6 months.
              You can manage your subscription
              from your dashboard.
            </p>
          </div>

        </div>


        <PlanSelector
          value={plan}
          onChange={handlePlanChange}
        />


        {errors.plan && (
          <div
            className="dipo-field-error"
            role="alert"
          >
            {errors.plan}
          </div>
        )}

      </section>


      {/* ====================================================
          SELECTED PLAN SUMMARY
      ===================================================== */}

      {selectedPlan && (
        <section className="dipo-selected-plan">

          <div className="dipo-selected-plan-main">

            <span>
              SELECTED PLAN
            </span>

            <strong>
              {selectedPlan.name}
            </strong>

            <small>
              6 months
            </small>

          </div>


          <div className="dipo-selected-plan-price">

            <strong>
              ₹{selectedPlan.amount}
            </strong>

            <span>
              total
            </span>

          </div>

        </section>
      )}


      {/* ====================================================
          UPI
      ===================================================== */}

      <section className="dipo-payment-section dipo-upi-section">

        <div className="dipo-payment-section-header">

          <div className="dipo-payment-step">
            02
          </div>

          <div>
            <span>
              COMPLETE PAYMENT
            </span>

            <h2>
              Pay securely using UPI
            </h2>

            <p>
              Scan the QR or use the UPI option
              shown below.
            </p>
          </div>

        </div>


        <UPIPaymentCard
          plan={plan}
        />


        <div className="dipo-payment-checklist">

          <div>
            <span>
              ✓
            </span>

            <p>
              Check the payee name before
              completing the payment.
            </p>
          </div>

          <div>
            <span>
              ✓
            </span>

            <p>
              Pay exactly the amount shown for
              your selected plan.
            </p>
          </div>

          <div>
            <span>
              ✓
            </span>

            <p>
              Complete the payment inside your
              trusted UPI app.
            </p>
          </div>

        </div>

      </section>


      {/* ====================================================
          UTR
      ===================================================== */}

      <section className="dipo-payment-section dipo-reference-section">

        <div className="dipo-payment-section-header">

          <div className="dipo-payment-step">
            03
          </div>

          <div>
            <span>
              PAYMENT REFERENCE
            </span>

            <h2>
              Submit your UTR
            </h2>

            <p>
              Payment successful hone ke baad
              apne UPI app se UTR / Transaction
              Reference copy karke yahan paste karein.
            </p>
          </div>

        </div>


        <div className="dipo-utr-explainer">

          <div className="dipo-utr-explainer-icon">
            #
          </div>

          <div>
            <strong>
              UTR kya hota hai?
            </strong>

            <p>
              UTR (Unique Transaction Reference)
              aapke successful payment ka unique
              transaction/reference number hota hai.
              Isse hum aapke payment ko verify karte hain.
            </p>
          </div>

        </div>


        <label
          className="dipo-reference-field"
          htmlFor="dipo-payment-reference"
        >

          <span>
            UTR / Payment Reference
            <b>
              *
            </b>
          </span>


          <div
            className={`dipo-reference-input-wrap ${
              errors.payment_reference
                ? 'has-error'
                : ''
            }`}
          >

            <input
              id="dipo-payment-reference"
              type="text"
              value={reference}
              onChange={
                handleReferenceChange
              }
              maxLength={120}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="Example: 123456789012"
              aria-invalid={
                Boolean(
                  errors.payment_reference
                )
              }
              aria-describedby="dipo-reference-help"
            />

            <span className="dipo-reference-count">
              {referenceLength}/120
            </span>

          </div>


          <small
            id="dipo-reference-help"
            className="dipo-reference-help"
          >
            Usually UPI app ke transaction
            details mein “UTR”, “Transaction ID”,
            “UPI Reference” ya “Reference Number”
            naam se milta hai.
          </small>


          {errors.payment_reference && (
            <span
              className="dipo-inline-error"
              role="alert"
            >
              {errors.payment_reference}
            </span>
          )}

        </label>


        {/* ==================================================
            UTR HOW-TO
        =================================================== */}

        <div className="dipo-how-to-utr">

          <div className="dipo-how-to-header">
            <span>
              HOW TO FIND IT
            </span>

            <strong>
              3 quick steps
            </strong>
          </div>


          <div className="dipo-how-to-grid">

            <div>
              <b>
                1
              </b>

              <p>
                Open your UPI app and open
                the successful transaction.
              </p>
            </div>


            <div>
              <b>
                2
              </b>

              <p>
                Find UTR / Transaction ID /
                Reference Number.
              </p>
            </div>


            <div>
              <b>
                3
              </b>

              <p>
                Copy it and paste it in the
                field above.
              </p>
            </div>

          </div>

        </div>


        {/* ==================================================
            SECURITY
        =================================================== */}

        <div className="dipo-payment-security">

          <div className="dipo-payment-security-icon">
            !
          </div>

          <div>

            <strong>
              Never enter sensitive banking information
            </strong>

            <p>
              Worldwide DIPO will never ask for
              your UPI PIN, OTP, CVV, card PIN,
              bank password or internet-banking
              password here.
            </p>

          </div>

        </div>


        {/* ==================================================
            GENERAL ERROR
        =================================================== */}

        {errors.form && (
          <div
            className="dipo-submit-error"
            role="alert"
          >

            <span>
              !
            </span>

            <div>
              <strong>
                We couldn't submit your payment
              </strong>

              <p>
                {errors.form}
              </p>
            </div>

          </div>
        )}


        {/* ==================================================
            FINAL CONFIRMATION
        =================================================== */}

        <div className="dipo-submit-confirmation">

          <label>
            <input
              type="checkbox"
              required
            />

            <span>
              I have completed the UPI payment
              and I am submitting the transaction
              reference generated by my payment app.
            </span>
          </label>

        </div>


        <button
          type="submit"
          className="dipo-submit-button"
          disabled={
            submitting ||
            !reference.trim()
          }
        >

          {submitting ? (
            <>
              <span className="dipo-button-spinner" />
              Verifying submission...
            </>
          ) : (
            <>
              Submit Payment Reference
              <span aria-hidden="true">
                →
              </span>
            </>
          )}

        </button>


        <p className="dipo-submit-note">
          Your payment is not automatically verified
          from this button. The submitted reference
          is sent for payment review.
        </p>

      </section>


      {/* ====================================================
          SUPPORT
      ===================================================== */}

      <section className="dipo-payment-support">

        <div>

          <span>
            PAYMENT SUPPORT
          </span>

          <h3>
            UTR nahi mil raha?
          </h3>

          <p>
            Don't worry. Apne UPI app ke successful
            transaction details open karein. Agar
            phir bhi help chahiye, support se contact
            karein.
          </p>

        </div>


        <div className="dipo-support-mini-actions">

          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Worldwide%20DIPO%20UTR%20Support`}
          >
            Email Support
          </a>

          <button
            type="button"
            onClick={copySupportEmail}
          >
            {copied
              ? 'Copied ✓'
              : 'Copy Email'}
          </button>

        </div>

      </section>


      {/* ====================================================
          LEGAL / TRUST
      ===================================================== */}

      <p className="dipo-payment-legal">
        By submitting this payment reference,
        you confirm that the reference belongs to
        the payment you made for this Worldwide DIPO
        plan. Payment approval remains subject to
        successful transaction verification.
      </p>


      <style jsx>{`

        .dipo-payment-form {
          display: grid;
          gap: 16px;
        }


        /* ==================================================
           SECTION
        =================================================== */

        .dipo-payment-section {
          padding: 22px;

          border:
            1px solid
            #e2e8f0;

          border-radius: 18px;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          box-shadow:
            0 8px 30px
            rgba(
              15,
              23,
              42,
              0.035
            );
        }


        .dipo-payment-section-header {
          display: flex;
          align-items: flex-start;

          gap: 13px;

          margin-bottom: 20px;
        }


        .dipo-payment-step {
          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #eff6ff;

          color: #2563eb;

          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;

          font-size: 10px;
          font-weight: 900;
        }


        .dipo-payment-section-header
          > div:last-child
          > span {
          color: #2563eb;

          font-size: 9px;
          font-weight: 900;

          letter-spacing:
            0.12em;
        }


        .dipo-payment-section-header h2 {
          margin:
            4px
            0
            0;

          font-size: 21px;

          line-height: 1.2;

          letter-spacing:
            -0.025em;
        }


        .dipo-payment-section-header p {
          margin:
            6px
            0
            0;

          color: #64748b;

          font-size: 12px;

          line-height: 1.6;
        }


        /* ==================================================
           SELECTED PLAN
        =================================================== */

        .dipo-selected-plan {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;

          padding:
            15px
            17px;

          border:
            1px solid
            #bfdbfe;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #ffffff
            );
        }


        .dipo-selected-plan-main span,
        .dipo-selected-plan-price span {
          display: block;

          color: #64748b;

          font-size: 9px;
          font-weight: 900;

          letter-spacing:
            0.1em;

          text-transform:
            uppercase;
        }


        .dipo-selected-plan-main strong {
          display: block;

          margin-top: 4px;

          color: #0f172a;

          font-size: 15px;
        }


        .dipo-selected-plan-main small {
          display: block;

          margin-top: 2px;

          color: #64748b;

          font-size: 10px;
        }


        .dipo-selected-plan-price {
          text-align: right;
        }


        .dipo-selected-plan-price strong {
          display: block;

          font-size: 24px;

          line-height: 1;

          letter-spacing:
            -0.04em;
        }


        /* ==================================================
           CHECKLIST
        =================================================== */

        .dipo-payment-checklist {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 8px;

          margin-top: 12px;
        }


        .dipo-payment-checklist > div {
          display: flex;
          align-items: flex-start;

          gap: 7px;

          padding: 11px;

          border:
            1px solid
            #f1f5f9;

          border-radius: 11px;

          background: #f8fafc;
        }


        .dipo-payment-checklist span {
          color: #16a34a;

          font-size: 11px;
          font-weight: 900;
        }


        .dipo-payment-checklist p {
          margin: 0;

          color: #64748b;

          font-size: 10px;

          line-height: 1.5;
        }


        /* ==================================================
           UTR
        =================================================== */

        .dipo-utr-explainer {
          display: flex;
          align-items: flex-start;

          gap: 11px;

          margin-bottom: 18px;

          padding: 14px;

          border:
            1px solid
            #dbeafe;

          border-radius: 13px;

          background: #eff6ff;
        }


        .dipo-utr-explainer-icon {
          width: 30px;
          height: 30px;

          flex: 0 0 30px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          background: #ffffff;

          color: #2563eb;

          font-weight: 900;
        }


        .dipo-utr-explainer strong {
          display: block;

          font-size: 12px;
        }


        .dipo-utr-explainer p {
          margin:
            4px
            0
            0;

          color: #64748b;

          font-size: 11px;

          line-height: 1.55;
        }


        .dipo-reference-field {
          display: grid;

          gap: 7px;
        }


        .dipo-reference-field
          > span:first-child {
          color: #334155;

          font-size: 12px;
          font-weight: 800;
        }


        .dipo-reference-field
          > span
          b {
          margin-left: 3px;

          color: #dc2626;
        }


        .dipo-reference-input-wrap {
          position: relative;

          display: flex;
          align-items: center;
        }


        .dipo-reference-input-wrap input {
          width: 100%;

          min-height: 52px;

          padding:
            0
            70px
            0
            14px;

          border:
            1px solid
            #cbd5e1;

          border-radius: 12px;

          outline: none;

          background: #ffffff;

          color: #0f172a;

          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;

          font-size: 14px;

          transition:
            border-color 150ms ease,
            box-shadow 150ms ease;
        }


        .dipo-reference-input-wrap input:focus {
          border-color: #60a5fa;

          box-shadow:
            0 0 0 4px
            rgba(
              37,
              99,
              235,
              0.08
            );
        }


        .dipo-reference-input-wrap.has-error
          input {
          border-color: #ef4444;
        }


        .dipo-reference-count {
          position: absolute;

          right: 13px;

          color: #94a3b8;

          font-size: 9px;
          font-weight: 700;

          pointer-events: none;
        }


        .dipo-reference-help {
          color: #64748b;

          font-size: 10px;

          line-height: 1.55;
        }


        .dipo-inline-error {
          color: #dc2626;

          font-size: 10px;
          font-weight: 700;
        }


        /* ==================================================
           HOW TO FIND UTR
        =================================================== */

        .dipo-how-to-utr {
          margin-top: 16px;

          padding: 15px;

          border:
            1px solid
            #e2e8f0;

          border-radius: 13px;

          background: #f8fafc;
        }


        .dipo-how-to-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          margin-bottom: 11px;
        }


        .dipo-how-to-header span {
          color: #64748b;

          font-size: 9px;
          font-weight: 900;

          letter-spacing:
            0.1em;
        }


        .dipo-how-to-header strong {
          color: #334155;

          font-size: 10px;
        }


        .dipo-how-to-grid {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 8px;
        }


        .dipo-how-to-grid > div {
          display: grid;

          grid-template-columns:
            24px
            minmax(0, 1fr);

          gap: 7px;
        }


        .dipo-how-to-grid b {
          width: 24px;
          height: 24px;

          display: grid;
          place-items: center;

          border-radius: 7px;

          background: #ffffff;

          color: #2563eb;

          font-size: 10px;
        }


        .dipo-how-to-grid p {
          margin: 0;

          color: #64748b;

          font-size: 10px;

          line-height: 1.5;
        }


        /* ==================================================
           SECURITY
        =================================================== */

        .dipo-payment-security {
          display: flex;
          align-items: flex-start;

          gap: 10px;

          margin-top: 13px;

          padding: 13px;

          border:
            1px solid
            #fed7aa;

          border-radius: 12px;

          background: #fff7ed;
        }


        .dipo-payment-security-icon {
          width: 28px;
          height: 28px;

          flex: 0 0 28px;

          display: grid;
          place-items: center;

          border-radius: 8px;

          background: #ffffff;

          color: #ea580c;

          font-weight: 900;
        }


        .dipo-payment-security strong {
          display: block;

          color: #9a3412;

          font-size: 11px;
        }


        .dipo-payment-security p {
          margin:
            3px
            0
            0;

          color: #9a3412;

          font-size: 10px;

          line-height: 1.5;
        }


        /* ==================================================
           ERROR
        =================================================== */

        .dipo-field-error {
          margin-top: 10px;

          padding: 9px 11px;

          border:
            1px solid
            #fecaca;

          border-radius: 9px;

          background: #fef2f2;

          color: #b91c1c;

          font-size: 10px;
          font-weight: 700;
        }


        .dipo-submit-error {
          display: flex;
          align-items: flex-start;

          gap: 9px;

          margin-top: 15px;

          padding: 12px;

          border:
            1px solid
            #fecaca;

          border-radius: 11px;

          background: #fef2f2;
        }


        .dipo-submit-error > span {
          width: 22px;
          height: 22px;

          flex: 0 0 22px;

          display: grid;
          place-items: center;

          border-radius: 7px;

          background: #ffffff;

          color: #dc2626;

          font-weight: 900;
        }


        .dipo-submit-error strong {
          display: block;

          color: #991b1b;

          font-size: 11px;
        }


        .dipo-submit-error p {
          margin:
            3px
            0
            0;

          color: #b91c1c;

          font-size: 10px;

          line-height: 1.5;
        }


        /* ==================================================
           CONFIRMATION
        =================================================== */

        .dipo-submit-confirmation {
          margin-top: 17px;
        }


        .dipo-submit-confirmation label {
          display: flex;
          align-items: flex-start;

          gap: 9px;

          cursor: pointer;

          color: #475569;

          font-size: 10px;

          line-height: 1.55;
        }


        .dipo-submit-confirmation input {
          width: 16px;
          height: 16px;

          flex: 0 0 16px;

          margin:
            0.5px
            0
            0;

          accent-color: #2563eb;
        }


        /* ==================================================
           SUBMIT
        =================================================== */

        .dipo-submit-button {
          width: 100%;

          min-height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          margin-top: 16px;

          border:
            1px solid
            #2563eb;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          color: #ffffff;

          font-size: 13px;
          font-weight: 900;

          cursor: pointer;

          box-shadow:
            0 8px 20px
            rgba(
              37,
              99,
              235,
              0.16
            );

          transition:
            transform 150ms ease,
            box-shadow 150ms ease,
            opacity 150ms ease;
        }


        .dipo-submit-button:hover:not(:disabled) {
          transform: translateY(-1px);

          box-shadow:
            0 12px 25px
            rgba(
              37,
              99,
              235,
              0.20
            );
        }


        .dipo-submit-button:disabled {
          cursor: not-allowed;

          opacity: 0.55;

          box-shadow: none;
        }


        .dipo-button-spinner {
          width: 15px;
          height: 15px;

          border:
            2px solid
            rgba(
              255,
              255,
              255,
              0.35
            );

          border-top-color:
            #ffffff;

          border-radius: 50%;

          animation:
            dipo-spin
            700ms linear infinite;
        }


        @keyframes dipo-spin {
          to {
            transform:
              rotate(360deg);
          }
        }


        .dipo-submit-note {
          margin:
            9px
            0
            0;

          color: #94a3b8;

          font-size: 9px;

          line-height: 1.5;

          text-align: center;
        }


        /* ==================================================
           SUPPORT
        =================================================== */

        .dipo-payment-support {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 18px;

          padding: 17px;

          border:
            1px solid
            #e2e8f0;

          border-radius: 15px;

          background: #ffffff;
        }


        .dipo-payment-support > div:first-child
          > span {
          color: #2563eb;

          font-size: 8px;
          font-weight: 900;

          letter-spacing:
            0.1em;
        }


        .dipo-payment-support h3 {
          margin:
            4px
            0
            0;

          font-size: 15px;
        }


        .dipo-payment-support p {
          max-width: 540px;

          margin:
            4px
            0
            0;

          color: #64748b;

          font-size: 10px;

          line-height: 1.5;
        }


        .dipo-support-mini-actions {
          display: flex;

          gap: 7px;

          flex: 0 0 auto;
        }


        .dipo-support-mini-actions a,
        .dipo-support-mini-actions button {
          min-height: 36px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          padding:
            8px
            11px;

          border:
            1px solid
            #e2e8f0;

          border-radius: 8px;

          background: #ffffff;

          color: #334155;

          font-size: 10px;
          font-weight: 800;

          text-decoration: none;

          cursor: pointer;
        }


        .dipo-support-mini-actions a {
          border-color: #2563eb;

          background: #2563eb;

          color: #ffffff;
        }


        /* ==================================================
           SUCCESS
        =================================================== */

        .dipo-payment-success {
          padding: 27px;

          border:
            1px solid
            #bbf7d0;

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              #f0fdf4,
              #ffffff
            );

          box-shadow:
            0 12px 35px
            rgba(
              15,
              23,
              42,
              0.05
            );
        }


        .dipo-success-top {
          display: flex;
          align-items: center;

          gap: 13px;
        }


        .dipo-success-icon {
          width: 48px;
          height: 48px;

          flex: 0 0 48px;

          display: grid;
          place-items: center;

          border-radius: 15px;

          background: #dcfce7;

          color: #16a34a;

          font-size: 22px;
          font-weight: 900;
        }


        .dipo-success-kicker {
          color: #16a34a;

          font-size: 9px;
          font-weight: 900;

          letter-spacing:
            0.1em;
        }


        .dipo-success-top h2 {
          margin:
            4px
            0
            0;

          font-size: 23px;

          letter-spacing:
            -0.03em;
        }


        .dipo-success-message {
          margin:
            18px
            0
            0;

          color: #475569;

          font-size: 12px;

          line-height: 1.65;
        }


        .dipo-success-status {
          display: grid;

          grid-template-columns:
            1fr
            1fr;

          gap: 8px;

          margin-top: 17px;
        }


        .dipo-success-status > div {
          padding:
            12px;

          border:
            1px solid
            #dcfce7;

          border-radius: 10px;

          background:
            rgba(
              255,
              255,
              255,
              0.8
            );
        }


        .dipo-success-status span {
          display: block;

          color: #64748b;

          font-size: 8px;
          font-weight: 900;

          letter-spacing:
            0.08em;
        }


        .dipo-success-status strong {
          display: block;

          margin-top: 4px;

          font-size: 11px;
        }


        .dipo-success-next {
          display: flex;
          align-items: flex-start;

          gap: 10px;

          margin-top: 10px;

          padding:
            12px;

          border:
            1px solid
            #dcfce7;

          border-radius: 10px;

          background:
            rgba(
              255,
              255,
              255,
              0.75
            );
        }


        .dipo-success-next-number {
          color: #16a34a;

          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;

          font-size: 9px;
          font-weight: 900;
        }


        .dipo-success-next strong {
          font-size: 11px;
        }


        .dipo-success-next p {
          margin:
            3px
            0
            0;

          color: #64748b;

          font-size: 10px;

          line-height: 1.5;
        }


        .dipo-success-actions {
          display: flex;

          gap: 8px;

          margin-top: 19px;
        }


        .dipo-success-primary,
        .dipo-success-secondary {
          min-height: 42px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          padding:
            9px
            13px;

          border-radius: 9px;

          font-size: 10px;
          font-weight: 900;

          text-decoration: none;
        }


        .dipo-success-primary {
          background: #2563eb;

          color: #ffffff;
        }


        .dipo-success-secondary {
          border:
            1px solid
            #e2e8f0;

          background: #ffffff;

          color: #334155;
        }


        .dipo-success-disclaimer {
          margin:
            15px
            0
            0;

          color: #64748b;

          font-size: 9px;

          line-height: 1.5;
        }


        /* ==================================================
           RESPONSIVE
        =================================================== */

        @media (max-width: 760px) {

          .dipo-payment-section {
            padding: 18px;
          }


          .dipo-payment-checklist,
          .dipo-how-to-grid {
            grid-template-columns: 1fr;
          }


          .dipo-payment-support {
            align-items: flex-start;

            flex-direction: column;
          }


          .dipo-support-mini-actions {
            width: 100%;
          }


          .dipo-support-mini-actions a,
          .dipo-support-mini-actions button {
            flex: 1;
          }

        }


        @media (max-width: 480px) {

          .dipo-payment-section {
            padding: 15px;
            border-radius: 15px;
          }


          .dipo-payment-section-header h2 {
            font-size: 18px;
          }


          .dipo-payment-section-header p {
            font-size: 11px;
          }


          .dipo-selected-plan-price strong {
            font-size: 21px;
          }


          .dipo-success-status {
            grid-template-columns: 1fr;
          }


          .dipo-success-actions {
            flex-direction: column;
          }


          .dipo-success-primary,
          .dipo-success-secondary {
            width: 100%;
          }

        }


        @media (prefers-reduced-motion: reduce) {

          .dipo-submit-button,
          .dipo-button-spinner {
            animation: none;
            transition: none;
          }

        }

      `}</style>

    </form>
  );
}