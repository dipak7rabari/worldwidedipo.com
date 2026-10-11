'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentReview({
  payment,
}) {
  const router = useRouter();

  const [note, setNote] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  async function approve() {
    if (
      !window.confirm(
        'Confirm that you have manually verified the actual payment, UTR and amount before approving this payment.',
      )
    ) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        '/api/admin/payments/approve',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            paymentId: payment.id,
            note: note.trim(),
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            'Approval failed.',
        );
      }

      setSuccess(
        'Payment approved successfully.',
      );

      router.refresh();

      setTimeout(() => {
        router.push(
          '/admin/payments',
        );
      }, 700);
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Approval failed.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function reject() {
    const reason =
      note.trim();

    if (!reason) {
      setError(
        'Enter a rejection reason before rejecting the payment.',
      );
      return;
    }

    if (
      !window.confirm(
        'Confirm rejection of this payment claim?',
      )
    ) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        '/api/admin/payments/reject',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            paymentId: payment.id,
            reason,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            'Rejection failed.',
        );
      }

      setSuccess(
        'Payment rejected successfully.',
      );

      router.refresh();

      setTimeout(() => {
        router.push(
          '/admin/payments',
        );
      }, 700);
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Rejection failed.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">
              Plan
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              {payment.plan}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Expected Amount
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              ₹{payment.amount}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Payment Type
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {payment.payment_type}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Profile
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {payment.slug_snapshot ||
                '—'}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            UTR / Payment Reference
          </p>

          <p className="mt-1 break-all font-mono text-lg font-semibold text-gray-900">
            {payment.payment_reference}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
        <p className="text-sm font-semibold text-yellow-900">
          Manual verification required
        </p>

        <p className="mt-2 text-sm leading-6 text-yellow-800">
          Admin ko actual GPay/UPI/bank transaction
          check karna hai. UTR match karein aur actual
          credited amount expected amount se match karein.
          Sirf user-submitted screenshot/reference ke
          basis par approval na karein.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <label
          htmlFor="admin-payment-note"
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          Admin Note
        </label>

        <textarea
          id="admin-payment-note"
          value={note}
          onChange={(event) =>
            setNote(
              event.target.value.slice(
                0,
                1000,
              ),
            )
          }
          maxLength={1000}
          rows={5}
          placeholder="Verification note or rejection reason"
          className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
        />

        <p className="mt-1 text-right text-xs text-gray-400">
          {note.length}/1000
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      {success ? (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {success}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={loading}
          onClick={reject}
          className="rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 disabled:opacity-50"
        >
          {loading
            ? 'Processing...'
            : 'Reject Payment'}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={approve}
          className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading
            ? 'Processing...'
            : 'Approve Payment'}
        </button>
      </div>
    </div>
  );
}