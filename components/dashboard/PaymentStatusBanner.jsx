export default function PaymentStatusBanner({
  profile,
  pendingPayment,
}) {
  if (!pendingPayment) {
    return null;
  }

  const isRenewal =
    pendingPayment.payment_type ===
    'renewal';

  const isInitial =
    pendingPayment.payment_type ===
    'initial';

  if (
    !isRenewal &&
    !isInitial
  ) {
    return null;
  }

  return (
    <section className="dashboard-payment-banner">
      <div>
        <span>
          Payment Verification
        </span>

        <h2>
          {isRenewal
            ? 'Renewal payment pending'
            : 'Initial payment pending'}
        </h2>

        <p>
          ₹{pendingPayment.amount}{' '}
          payment claim is waiting for
          verification.
        </p>
      </div>

      <a
        href="/dashboard/subscription"
        className="dashboard-action-secondary"
      >
        View Status
      </a>
    </section>
  );
}