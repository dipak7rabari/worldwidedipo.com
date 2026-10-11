'use client';

import { useMemo, useState } from 'react';

import PaymentQR from './PaymentQR';
import {
  buildUpiIntent,
  getPaymentUpiId,
} from '@/lib/payments/payment-config';
import {
  getPlanAmount,
  validatePaymentReference,
} from '@/lib/payments/payment-utils';

export default function PaymentForm({
  profileId,
  plan,
  paymentType = 'initial',
}) {
  const [paymentReference, setPaymentReference] =
    useState('');

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const amount = useMemo(
    () => getPlanAmount(plan),
    [plan],
  );

  const upiId = useMemo(
    () => getPaymentUpiId(),
    [],
  );

  const referenceForQr =
    paymentReference.trim() ||
    `Worldwide-DIPO-${plan}`;

  const upiIntent = useMemo(
    () =>
      buildUpiIntent({
        amount,
        reference: referenceForQr,
      }),
    [amount, referenceForQr],
  );

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setMessage('');

    const validation =
      validatePaymentReference(paymentReference);

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        '/api/payment/submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileId,
            plan,
            paymentType,
            paymentReference:
              validation.value,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            'Payment submission failed.',
        );
      }

      setMessage(
        'Payment reference submitted successfully. Your payment is now pending manual verification.',
      );

      setPaymentReference('');
    } catch (submissionError) {
      setError(
        submissionError?.message ||
          'Payment submission failed.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Selected Plan
            </p>

            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              {plan}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">
              Amount
            </p>

            <p className="text-2xl font-bold text-gray-900">
              ₹{amount}
            </p>
          </div>
        </div>
      </div>

      <PaymentQR
        value={upiIntent}
        amount={amount}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-500">
          Official UPI ID
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900">
            {upiId}
          </code>

          <button
            type="button"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  upiId,
                );
              } catch {
                // Clipboard permission may be unavailable.
              }
            }}
          >
            Copy UPI ID
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          Use the official UPI ID above or scan the QR
          code to complete the payment.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-semibold text-gray-900">
          Payment Reference
        </h3>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          After completing the payment, enter the UTR /
          Payment Reference shown by your UPI app.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-4"
        >
          <div>
            <label
              htmlFor="payment-reference"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              UTR / Payment Reference *
            </label>

            <input
              id="payment-reference"
              name="paymentReference"
              type="text"
              inputMode="text"
              autoComplete="off"
              maxLength={80}
              value={paymentReference}
              onChange={(event) =>
                setPaymentReference(
                  event.target.value,
                )
              }
              placeholder="Enter UTR / Payment Reference"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              required
            />
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          ) : null}

          {message ? (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? 'Submitting...'
              : 'Submit Payment Reference'}
          </button>
        </form>
      </div>

      <div className="rounded-xl bg-gray-50 p-4 text-xs leading-5 text-gray-600">
        <strong className="text-gray-800">
          Important:
        </strong>{' '}
        Submitting a UTR / Payment Reference does not
        automatically verify the payment. Worldwide DIPO
        will manually verify the actual transaction and
        then approve or reject the payment.
      </div>
    </div>
  );
}