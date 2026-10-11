'use client';

import PaymentReviewModal from './PaymentReviewModal';

export default function PaymentReview({ payment }) {
  if (!payment) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">
          Payment details are unavailable.
        </p>
      </div>
    );
  }

  return <PaymentReviewModal payment={payment} />;
}