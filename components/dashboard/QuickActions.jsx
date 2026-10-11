import Link from 'next/link';

export default function QuickActions({
  profile,
}) {
  const hasProfile = Boolean(profile?.id);
  const isActive = profile?.status === 'active';
  const isExpired = profile?.status === 'expired';

  return (
    <section className="dashboard-actions-card">
      <div className="dashboard-section-heading">
        <div>
          <p className="dashboard-eyebrow">
            Quick Actions
          </p>

          <h2>Manage your DIPO</h2>
        </div>
      </div>

      <div className="dashboard-action-grid">
        {!hasProfile && (
          <Link
            href="/onboarding"
            className="dashboard-action-primary"
          >
            Create Profile
          </Link>
        )}

        {hasProfile && (
          <Link
            href="/dashboard/profile"
            className="dashboard-action-primary"
          >
            Edit Profile
          </Link>
        )}

        {isActive && profile.slug && (
          <Link
            href={`/p/${profile.slug}`}
            target="_blank"
            className="dashboard-action-secondary"
          >
            View Public Profile
          </Link>
        )}

        {hasProfile && !isActive && (
          <Link
            href="/dashboard/billing"
            className="dashboard-action-secondary"
          >
            {isExpired
              ? 'Renew Profile'
              : 'Continue'}
          </Link>
        )}

        {isActive && (
          <Link
            href="/dashboard/analytics"
            className="dashboard-action-secondary"
          >
            Analytics
          </Link>
        )}

        <Link
          href="/dashboard/support"
          className="dashboard-action-secondary"
        >
          Support
        </Link>
      </div>
    </section>
  );
}