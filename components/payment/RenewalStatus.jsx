export default function RenewalStatus({
  pendingRenewal,
}) {
  if (!pendingRenewal) {
    return null;
  }

  return (
    <section className="renewal-pending-card">
      <div>
        <span className="dashboard-eyebrow">
          Renewal Payment
        </span>

        <h2>
          Verification Pending
        </h2>

        <p>
          Aapka ₹{pendingRenewal.amount}{' '}
          renewal payment review ke liye
          submit ho chuka hai.
        </p>
      </div>

      <div className="renewal-pending-meta">
        <div>
          <span>Plan</span>
          <strong>
            {pendingRenewal.plan}
          </strong>
        </div>

        <div>
          <span>Status</span>
          <strong>
            Pending
          </strong>
        </div>
      </div>

      <div className="renewal-pending-message">
        Your current profile remains active while
        the renewal is being verified.
      </div>
    </section>
  );
}