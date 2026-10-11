'use client';

import { useState } from 'react';

import PaymentReviewCard from './PaymentReviewCard';

export default function PaymentQueue({
  initialPayments,
}) {
  const [payments, setPayments] =
    useState(
      Array.isArray(initialPayments)
        ? initialPayments
        : []
    );

  function removePayment(id) {
    setPayments((current) =>
      current.filter(
        (payment) =>
          payment.id !== id
      )
    );
  }

  if (payments.length === 0) {
    return (
      <section className="admin-empty-state">
        <div>✓</div>

        <h2>
          No pending payments
        </h2>

        <p>
          Abhi verification ke liye koi payment
          claim pending nahi hai.
        </p>
      </section>
    );
  }

  return (
    <div className="admin-payment-queue">
      <div className="admin-payment-queue-summary">
        <strong>
          {payments.length}
        </strong>

        <span>
          pending payment
          {payments.length === 1
            ? ''
            : 's'}
        </span>
      </div>

      {payments.map((payment) => (
        <PaymentReviewCard
          key={payment.id}
          payment={payment}
          onApproved={removePayment}
          onRejected={removePayment}
        />
      ))}
    </div>
  );
}