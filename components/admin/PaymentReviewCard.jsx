'use client';

import { useState } from 'react';

export default function PaymentReviewCard({
  payment,
  onApproved,
  onRejected,
}) {
  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState('');

  const [showReject, setShowReject] =
    useState(false);

  const [notes, setNotes] =
    useState('');

  async function approve() {
    const confirmed =
      window.confirm(
        'Confirm that you have verified the actual payment credit and want to approve this payment?'
      );

    if (!confirmed) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response =
        await fetch(
          '/api/admin/payments/approve',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
              payment_id:
                payment.id,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            'Approval failed.'
        );
        return;
      }

      onApproved?.(payment.id);
    } catch {
      setError(
        'Network error. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  }

  async function reject() {
    if (!notes.trim()) {
      setError(
        'Please provide a rejection reason.'
      );
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response =
        await fetch(
          '/api/admin/payments/reject',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
              payment_id:
                payment.id,
              notes:
                notes.trim(),
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            'Rejection failed.'
        );
        return;
      }

      onRejected?.(payment.id);
    } catch {
      setError(
        'Network error. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <article className="admin-payment-card">
      <div className="admin-payment-card-header">
        <div>
          <span className="admin-payment-type">
            {payment.payment_type}
          </span>

          <h2>
            {payment.payer_name ||
              'Unknown User'}
          </h2>
        </div>

        <strong className="admin-payment-amount">
          ₹{payment.amount}
        </strong>
      </div>

      <div className="admin-payment-grid">
        <div>
          <span>Plan</span>
          <strong>
            {payment.plan}
          </strong>
        </div>

        <div>
          <span>Slug</span>
          <strong>
            /p/{payment.slug_snapshot}
          </strong>
        </div>

        <div>
          <span>Payment Reference</span>
          <strong className="admin-payment-reference">
            {payment.payment_reference}
          </strong>
        </div>

        <div>
          <span>Submitted</span>
          <strong>
            {new Date(
              payment.created_at
            ).toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="admin-payment-verification-note">
        <strong>
          Verify before approval
        </strong>

        <p>
          Actual GPay/UPI/bank credit verify
          karein. Sirf UTR dekhkar payment approve
          na karein.
        </p>
      </div>

      {error && (
        <div
          className="admin-payment-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {showReject && (
        <div className="admin-reject-panel">
          <label>
            Rejection reason *
            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              maxLength={1000}
              rows={4}
              placeholder="Reason for rejecting this payment claim..."
            />
          </label>

          <div className="admin-reject-actions">
            <button
              type="button"
              onClick={() =>
                setShowReject(false)
              }
              disabled={processing}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={reject}
              disabled={processing}
              className="admin-danger-button"
            >
              {processing
                ? 'Rejecting...'
                : 'Confirm Reject'}
            </button>
          </div>
        </div>
      )}

      {!showReject && (
        <div className="admin-payment-actions">
          <button
            type="button"
            className="admin-approve-button"
            onClick={approve}
            disabled={processing}
          >
            {processing
              ? 'Processing...'
              : '✓ Approve Payment'}
          </button>

          <button
            type="button"
            className="admin-reject-button"
            onClick={() =>
              setShowReject(true)
            }
            disabled={processing}
          >
            Reject
          </button>
        </div>
      )}
    </article>
  );
}