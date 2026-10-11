import Link from 'next/link';

import AccountSummary from './AccountSummary';
import EmptyProfileState from './EmptyProfileState';
import OnboardingProgress from './OnboardingProgress';
import ProfileStatusCard from './ProfileStatusCard';
import QuickActions from './QuickActions';

export default function DashboardShell({
  user,
  profile,
}) {
  if (!profile) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div>
              <p className="dashboard-eyebrow">
                Dashboard
              </p>

              <h1>Welcome to Worldwide DIPO</h1>
            </div>

            <Link
              href="/"
              className="dashboard-home-link"
            >
              Home
            </Link>
          </header>

          <OnboardingProgress profile={null} />

          <EmptyProfileState />
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              Dashboard
            </p>

            <h1>
              Welcome back, {profile.name}
            </h1>
          </div>

          <Link
            href="/"
            className="dashboard-home-link"
          >
            Home
          </Link>
        </header>

        <OnboardingProgress profile={profile} />

        <ProfileStatusCard profile={profile} />

        <AccountSummary
          user={user}
          profile={profile}
        />

        <QuickActions profile={profile} />
      </div>
    </main>
  );
}