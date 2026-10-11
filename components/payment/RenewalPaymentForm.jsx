'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import PlanSelector from './PlanSelector';
import UPIPaymentCard from './UPIPaymentCard';

import {
  getPaymentPlan,
} from '@/lib/payments/payment-config';

export default function RenewalPaymentForm({
  profile,
}) {
  const router = useRouter();

  const [plan, setPlan] =
    useState(
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

  const selectedPlan =
    getPaymentPlan(plan);

  async function submitRenewal(
    event
  ) {
    event.preventDefault();

    setErrors({});

    if (!reference.trim()) {
      setErrors({
        payment_reference:
          'UTR / Payment Reference is required.',
      });

      return;
    }

    setSubmitting(true);

    try {
      const response =
        await fetch(
          '/api/payments/renew',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
              plan,
              payment_reference:
                reference.trim(),
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setErrors(
          result.errors || {
            form:
              result.error ||
              'Unable to submit renewal.',
          }
        );

        return;
      }

      setSubmitted(true);

      setReference('');

      router.refresh();
    } catch {
      setErrors({
        form:
          'Network error. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="renewal-success-card">
        <div className="renewal-success-icon">
          ✓
        </div>

        <h2>
          Renewal Submitted
        </h2>

        <p>
          Aapka renewal payment verification
          ke liye submit ho gaya hai.
        </p>

        <div className="renewal-status-box">
          <strong>
            Payment Status
          </strong>

          <span>
            Pending Verification
          </span>
        </div>

        <p className="renewal-important">
          Aapka active profile verification ke
          dauran active hi rahega. Approved hone
          par subscription validity update hogi.
        </p>

        <a
          href="/dashboard/subscription"
          className="dashboard-action-primary"
        >
          Back to Subscription
        </a>
      </section>
    );
  }

  return (
    <form
      onSubmit={submitRenewal}
      className="renewal-payment-form"
    >
      <section className="payment-section-card">
        <div className="payment-section-heading">
          <p className="dashboard-eyebrow">
            Renewal
          </p>

          <h2>
            Choose Plan
          </h2>

          <p>
            Renewal ke liye plan select karein.
            Har subscription 6 months ke liye hai.
          </p>
        </div>

        <PlanSelector
          value={plan}
          onChange={(value) => {
            setPlan(value);
            setErrors({});
          }}
        />
      </section>

      <UPIPaymentCard
        plan={plan}
      />

      <section className="payment-section-card">
        <div className="payment-section-heading">
          <p className="dashboard-eyebrow">
            Payment Reference
          </p>

          <h2>
            Submit UTR / Payment Reference
          </h2>

          <p>
            Payment complete karne ke baad
            reference number enter karein.
          </p>
        </div>

        <label className="payment-reference-field">
          <span>
            UTR / Payment Reference *
          </span>

          <input
            type="text"
            value={reference}
            onChange={(event) => {
              setReference(
                event.target.value
              );

              setErrors((current) => ({
                ...current,
                payment_reference:
                  undefined,
                form: undefined,
              }));
            }}
            maxLength={120}
            autoComplete="off"
            placeholder="Enter payment reference"
            required
          />

          {errors.payment_reference && (
            <small>
              {errors.payment_reference}
            </small>
          )}
        </label>

        <div className="renewal-verification-note">
          <strong>
            Renewal verification
          </strong>

          <p>
            UTR submit karne se subscription
            automatically renew nahi hoti. Actual
            payment verify hone ke baad hi renewal
            approve hogi.
          </p>
        </div>

        {errors.form && (
          <div
            className="profile-form-error"
            role="alert"
          >
            {errors.form}
          </div>
        )}

        <button
          type="submit"
          className="dashboard-action-primary payment-submit-button"
          disabled={submitting}
        >
          {submitting
            ? 'Submitting...'
            : `Submit ₹${
                selectedPlan?.amount || ''
              } Renewal`}
        </button>
      </section>
    </form>
  );
}