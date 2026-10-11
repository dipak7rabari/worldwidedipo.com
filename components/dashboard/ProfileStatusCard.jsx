import PlanBadge from '@/components/identity/PlanBadge';
import {
  getDaysRemaining,
  getProfileStatusClass,
  getProfileStatusLabel,
} from '@/lib/dashboard/dashboard-utils';

export default function ProfileStatusCard({
  profile,
}) {
  if (!profile) {
    return (
      <section className="dashboard-status-card">
        <div>
          <span className="dashboard-card-label">
            Profile
          </span>

          <h2>
            No profile yet
          </h2>

          <p>
            Create your Worldwide DIPO profile
            to get started.
          </p>
        </div>

        <a
          href="/onboarding"
          className="dashboard-action-primary"
        >
          Create Profile
        </a>
      </section>
    );
  }

  const daysRemaining =
    getDaysRemaining(
      profile.expires_at
    );

  const statusLabel =
    getProfileStatusLabel(
      profile.status
    );

  const statusClass =
    getProfileStatusClass(
      profile.status
    );

  return (
    <section className="dashboard-status-card">
      <div className="dashboard-profile-summary">
        <div className="dashboard-avatar">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
            />
          ) : (
            <span>
              {profile.name
                ?.charAt(0)
                ?.toUpperCase() || 'D'}
            </span>
          )}
        </div>

        <div>
          <span className="dashboard-card-label">
            Profile Status
          </span>

          <h2>
            {profile.name}
          </h2>

          {profile.profession && (
            <p>
              {profile.profession}
            </p>
          )}
        </div>
      </div>

      <div className="dashboard-status-meta">
       <PlanBadge plan={profile.plan} />

<a
  href="/explore"
  className="profile-back-link"
>
  Explore DIPO ↗
</a>
        <span
          className={`dashboard-status-pill ${statusClass}`}
        >
          {statusLabel}
        </span>

        {profile.status ===
          'active' &&
          daysRemaining !== null && (
            <span>
              {daysRemaining} days remaining
            </span>
          )}
      </div>
    </section>
  );
}