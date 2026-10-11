import ProfileContentPreview from '@/components/identity/ProfileContentPreview';
import PlanBadge from '@/components/identity/PlanBadge';
import { redirect } from 'next/navigation';

import { getMyProfile } from '@/lib/profile/get-my-profile';
import {
  getDaysRemaining,
  getProfileStatusLabel,
  getProfileStatusClass,
} from '@/lib/dashboard/dashboard-utils';

export const dynamic = 'force-dynamic';

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

function getPrimaryAction(profile) {
  switch (profile.status) {
    case 'draft':
      return {
        href: '/dashboard/subscription',
        label: 'Choose Your Plan',
        description:
          'Your DIPO is created. Choose a plan to make it ready for payment verification.',
      };

    case 'pending':
      return {
        href: '/dashboard/subscription',
        label: 'View Payment Status',
        description:
          'Your payment claim is waiting for admin verification.',
      };

    case 'active':
      return {
        href: `/p/${profile.slug}`,
        label: 'View Public DIPO',
        description:
          'Your Worldwide DIPO is live and ready to share.',
      };

    case 'expired':
      return {
        href: '/dashboard/subscription',
        label: 'Renew DIPO',
        description:
          'Your DIPO subscription has expired. Renew it to continue.',
      };

    default:
      return {
        href: '/dashboard',
        label: 'Back to Dashboard',
        description:
          'Return to your Worldwide DIPO dashboard.',
      };
  }
}

function getStatusDescription(status) {
  const descriptions = {
    draft:
      'Your profile is saved. Complete your plan and payment setup to continue.',
    pending:
      'Your payment has been submitted and is currently under verification.',
    active:
      'Your DIPO is live and publicly accessible.',
    expired:
      'Your DIPO is no longer active. Renew your subscription to restore it.',
  };

  return (
    descriptions[status] ||
    'Manage your Worldwide DIPO profile.'
  );
}

export default async function ProfileManagementPage() {
  const {
    user,
    profile,
  } = await getMyProfile();

  if (!user) {
    redirect(
      '/auth/login?next=/dashboard/profile'
    );
  }

  if (!profile) {
    redirect('/onboarding');
  }

  const statusLabel =
    getProfileStatusLabel(
      profile.status
    );

  const statusClass =
    getProfileStatusClass(
      profile.status
    );

  const daysRemaining =
    getDaysRemaining(
      profile.expires_at
    );

  const primaryAction =
    getPrimaryAction(profile);

  const isLive =
    profile.status === 'active';

  const publicUrl =
    profile.slug
      ? `/p/${profile.slug}`
      : null;

  return (
    <main className="profile-management-page">
      <div className="dashboard-container">

        {/* HEADER */}
        <header className="profile-management-header">
          <div>
            <span className="dashboard-eyebrow">
              WORLDWIDE DIPO
            </span>

            <h1>
              Manage Your DIPO
            </h1>

            <p>
              Your personal digital identity,
              all in one place.
            </p>
          </div>

          <a
            href="/dashboard"
            className="profile-back-link"
          >
            ← Dashboard
          </a>
        </header>
<a
  href="/explore"
  className="dashboard-action-secondary"
  style={{ marginBottom: 18 }}
>
  Explore Worldwide DIPO ↗
</a>
        {/* PROFILE HERO */}
        <section className="profile-management-hero">

          <div className="profile-management-avatar">
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

          <div className="profile-management-identity">

            <div className="profile-management-name-row">
              <h2>
                {profile.name}
              </h2>

              <span
                className={`dashboard-status-pill ${statusClass}`}
              >
                {statusLabel}
              </span>
            </div>
      <div style={{ margin: '10px 0' }}>
        <PlanBadge plan={profile.plan} />
      </div>
            {profile.profession && (
              <p className="profile-management-profession">
                {profile.profession}
              </p>
            )}

            {profile.headline && (
              <p className="profile-management-headline">
                {profile.headline}
              </p>
            )}

            {publicUrl && (
              <div className="profile-management-url">
                <span>
                  worldwidedipo.com
                </span>

                <strong>
                  {publicUrl}
                </strong>
              </div>
            )}
          </div>

        </section>

        {/* STATUS MESSAGE */}
        <section className="profile-management-status">

          <div>
            <span className="profile-management-status-label">
              CURRENT STATUS
            </span>

            <h2>
              {statusLabel}
            </h2>

            <p>
              {getStatusDescription(
                profile.status
              )}
            </p>
          </div>

          <div className="profile-management-status-action">
            <a
              href={primaryAction.href}
              className="dashboard-action-primary"
            >
              {primaryAction.label}
            </a>

            <span>
              {primaryAction.description}
            </span>
          </div>

        </section>

        <ProfileContentPreview profile={profile} />

        {/* INFORMATION GRID */}
        <section className="profile-management-section">

          <div className="profile-section-heading">
            <div>
              <span>
                PROFILE INFORMATION
              </span>

              <h2>
                Your DIPO Details
              </h2>
            </div>

            <a
              href="/dashboard/profile/edit"
              className="dashboard-action-secondary"
            >
              Edit Profile
            </a>
          </div>

          <div className="profile-info-grid">

            <div className="profile-info-card">
              <span>
                Full Name
              </span>

              <strong>
                {profile.name || '—'}
              </strong>
            </div>

            <div className="profile-info-card">
              <span>
                Profession
              </span>

              <strong>
                {profile.profession || '—'}
              </strong>
            </div>

            <div className="profile-info-card">
              <span>
                Category
              </span>

              <strong>
                {profile.category || '—'}
              </strong>
            </div>

            <div className="profile-info-card">
              <span>
                Location
              </span>

              <strong>
                {profile.location || '—'}
              </strong>
            </div>

          </div>

        </section>

        {/* SUBSCRIPTION */}
        <section className="profile-management-section">

          <div className="profile-section-heading">
            <div>
              <span>
                SUBSCRIPTION
              </span>

              <h2>
                Plan & Validity
              </h2>
            </div>

            <a
              href="/dashboard/subscription"
              className="dashboard-action-secondary"
            >
              Manage Subscription
            </a>
          </div>

          <div className="profile-subscription-card">

            <div>
              <span>
                Current Plan
              </span>

              <strong>
                {profile.plan || 'Starter'}
              </strong>
            </div>

            <div>
              <span>
                Created
              </span>

              <strong>
                {formatDate(
                  profile.created_at
                )}
              </strong>
            </div>

            <div>
              <span>
                Valid Until
              </span>

              <strong>
                {formatDate(
                  profile.expires_at
                )}
              </strong>
            </div>

            <div>
              <span>
                Remaining
              </span>

              <strong>
                {profile.status === 'active' &&
                daysRemaining !== null
                  ? `${daysRemaining} days`
                  : '—'}
              </strong>
            </div>

          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="profile-management-section">

          <div className="profile-section-heading">
            <div>
              <span>
                QUICK ACTIONS
              </span>

              <h2>
                Manage Your DIPO
              </h2>
            </div>
          </div>

          <div className="profile-management-actions">

            <a
              href="/dashboard/profile/edit"
              className="profile-management-action"
            >
              <span className="action-icon">
                ✎
              </span>

              <strong>
                Edit Profile
              </strong>

              <small>
                Update your public information
              </small>
            </a>

            <a
              href="/dashboard/subscription"
              className="profile-management-action"
            >
              <span className="action-icon">
                ◈
              </span>

              <strong>
                Subscription
              </strong>

              <small>
                Manage plan and payment
              </small>
            </a>

            {isLive && (
              <a
                href={`/p/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-management-action"
              >
                <span className="action-icon">
                  ↗
                </span>

                <strong>
                  Public DIPO
                </strong>

                <small>
                  Open your live profile
                </small>
              </a>
            )}

            <a
              href="/dashboard/support"
              className="profile-management-action"
            >
              <span className="action-icon">
                ?
              </span>

              <strong>
                Support
              </strong>

              <small>
                Get help with your DIPO
              </small>
            </a>

          </div>

        </section>

        {/* FOOTER */}
        <footer className="profile-management-footer">
          <p>
            Made With ❤️ in India
          </p>

          <strong>
            𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
          </strong>

          <small>
            All copyrights reserved @
            {' '}
            𝔄 𝔇𝔐 𝔭𝔯𝔬𝔡𝔲𝔠𝔱
          </small>
        </footer>

      </div>

      <style>{`
        .profile-management-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(37, 99, 235, 0.07),
              transparent 28%
            ),
            #f8fafc;
        }

        .profile-management-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          padding: 28px 0 20px;
        }

        .profile-management-header h1 {
          margin: 6px 0 0;
          font-size: clamp(28px, 5vw, 42px);
          letter-spacing: -0.04em;
        }

        .profile-management-header p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .profile-back-link {
          color: #2563eb;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        .profile-management-hero {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 22px;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: rgba(255,255,255,0.92);
          box-shadow: 0 12px 35px rgba(15,23,42,0.05);
        }

        .profile-management-avatar {
          width: 82px;
          height: 82px;
          flex: 0 0 82px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            #eff6ff,
            #dbeafe
          );
          color: #2563eb;
          font-size: 30px;
          font-weight: 900;
        }

        .profile-management-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-management-identity {
          min-width: 0;
          flex: 1;
        }

        .profile-management-name-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
        }

        .profile-management-name-row h2 {
          margin: 0;
          font-size: 25px;
          letter-spacing: -0.03em;
        }

        .profile-management-profession {
          margin: 4px 0 0;
          color: #475569;
          font-size: 14px;
          font-weight: 700;
        }

        .profile-management-headline {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .profile-management-url {
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 11px;
          padding: 7px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          background: #f8fafc;
          font-size: 11px;
        }

        .profile-management-url span {
          color: #94a3b8;
        }

        .profile-management-url strong {
          color: #2563eb;
        }

        .profile-management-status {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-top: 18px;
          padding: 20px;
          border: 1px solid #dbeafe;
          border-radius: 16px;
          background: #eff6ff;
        }

        .profile-management-status-label,
        .profile-section-heading span,
        .profile-info-card span,
        .profile-subscription-card span {
          display: block;
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .profile-management-status h2 {
          margin: 5px 0 0;
          font-size: 21px;
        }

        .profile-management-status p {
          max-width: 600px;
          margin: 6px 0 0;
          color: #475569;
          font-size: 12px;
          line-height: 1.6;
        }

        .profile-management-status-action {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          gap: 7px;
          min-width: 210px;
        }

        .profile-management-status-action span {
          max-width: 230px;
          color: #64748b;
          font-size: 10px;
          line-height: 1.45;
          text-align: right;
        }

        .profile-live-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 18px;
          padding: 16px 18px;
          border: 1px solid #bbf7d0;
          border-radius: 14px;
          background: #f0fdf4;
        }

        .profile-live-card > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .profile-live-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 5px rgba(34,197,94,0.12);
        }

        .profile-live-card strong {
          color: #166534;
          font-size: 13px;
        }

        .profile-live-card p {
          margin: 3px 0 0;
          color: #64748b;
          font-size: 11px;
        }

        .profile-management-section {
          margin-top: 28px;
        }

        .profile-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }

        .profile-section-heading h2 {
          margin: 4px 0 0;
          font-size: 20px;
        }

        .profile-info-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 13px;
        }

        .profile-info-card,
        .profile-subscription-card {
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          background: #fff;
        }

        .profile-info-card strong {
          display: block;
          margin-top: 7px;
          font-size: 13px;
          line-height: 1.45;
        }

        .profile-subscription-card {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 13px;
        }

        .profile-subscription-card strong {
          display: block;
          margin-top: 7px;
          font-size: 14px;
        }

        .profile-management-actions {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 13px;
        }

        .profile-management-action {
          min-height: 125px;
          display: flex;
          flex-direction: column;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #fff;
          color: #0f172a;
          text-decoration: none;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .profile-management-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(15,23,42,0.07);
        }

        .action-icon {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: #eff6ff;
          color: #2563eb;
          font-weight: 900;
        }

        .profile-management-action strong {
          margin-top: 12px;
          font-size: 13px;
        }

        .profile-management-action small {
          margin-top: 5px;
          color: #64748b;
          font-size: 10px;
          line-height: 1.5;
        }

        .profile-management-footer {
          padding: 42px 0 28px;
          text-align: center;
          color: #94a3b8;
        }

        .profile-management-footer p {
          margin: 0 0 5px;
          font-size: 10px;
        }

        .profile-management-footer strong {
          display: block;
          font-size: 11px;
        }

        .profile-management-footer small {
          display: block;
          margin-top: 4px;
          font-size: 8px;
        }

        @media (max-width: 760px) {
          .profile-management-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .profile-management-hero {
            align-items: flex-start;
          }

          .profile-management-status {
            flex-direction: column;
          }

          .profile-management-status-action {
            align-items: flex-start;
            min-width: 0;
          }

          .profile-management-status-action span {
            text-align: left;
          }

          .profile-info-grid,
          .profile-subscription-card,
          .profile-management-actions {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .profile-live-card {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .profile-management-header {
            padding-top: 22px;
          }

          .profile-management-hero {
            padding: 17px;
          }

          .profile-management-avatar {
            width: 64px;
            height: 64px;
            flex-basis: 64px;
            border-radius: 16px;
            font-size: 23px;
          }

          .profile-management-name-row h2 {
            font-size: 21px;
          }

          .profile-info-grid,
          .profile-subscription-card,
          .profile-management-actions {
            grid-template-columns: 1fr;
          }

          .profile-management-status {
            padding: 17px;
          }

          .profile-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .profile-management-url {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-management-action {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}