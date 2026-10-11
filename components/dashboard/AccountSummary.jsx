function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getRemainingDays(expiresAt) {
  if (!expiresAt) {
    return null;
  }

  const difference =
    new Date(expiresAt).getTime() - Date.now();

  if (difference <= 0) {
    return 0;
  }

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}

export default function AccountSummary({
  user,
  profile,
}) {
  const remainingDays = getRemainingDays(
    profile?.expires_at
  );

  return (
    <section className="dashboard-summary-grid">
      <div className="dashboard-summary-card">
        <span>Account</span>
        <strong>
          {user?.email || 'Authenticated'}
        </strong>
      </div>

      <div className="dashboard-summary-card">
        <span>Plan</span>
        <strong>
          {profile?.plan || 'Not selected'}
        </strong>
      </div>

      <div className="dashboard-summary-card">
        <span>Valid Until</span>
        <strong>
          {formatDate(profile?.expires_at)}
        </strong>
      </div>

      <div className="dashboard-summary-card">
        <span>Days Remaining</span>
        <strong>
          {remainingDays === null
            ? '—'
            : remainingDays}
        </strong>
      </div>
    </section>
  );
}