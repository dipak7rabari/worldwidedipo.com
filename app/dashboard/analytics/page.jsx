import { redirect } from 'next/navigation';

import {
  getDashboardData,
} from '@/lib/dashboard/get-dashboard-data';

import {
  getProfileAnalytics,
} from '@/lib/analytics/get-profile-analytics';

import AnalyticsOverview from '@/components/analytics/AnalyticsOverview';

import RecentViews from '@/components/analytics/RecentViews';

export const dynamic =
  'force-dynamic';

export default async function AnalyticsPage() {
  const dashboard =
    await getDashboardData();

  if (
    !dashboard.authenticated
  ) {
    redirect(
      '/auth/login?next=/dashboard/analytics'
    );
  }

  if (!dashboard.profile) {
    redirect('/onboarding');
  }

  const result =
    await getProfileAnalytics(
      dashboard.profile.id
    );

  if (!result.authorized) {
    redirect('/dashboard');
  }

  const analytics =
    result.analytics;

  return (
    <main className="analytics-page">
      <div className="analytics-container">
        <header className="analytics-header">
          <div>
            <p className="dashboard-eyebrow">
              Worldwide DIPO
            </p>

            <h1>
              Profile Analytics
            </h1>

            <p>
              See how many times your public
              digital identity has been viewed.
            </p>
          </div>

          {dashboard.profile.status ===
            'active' && (
            <a
              href={`/p/${dashboard.profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="dashboard-action-primary"
            >
              View Profile
            </a>
          )}
        </header>

        {dashboard.profile.status !==
          'active' && (
          <section className="analytics-status-notice">
            <strong>
              Profile is not currently live
            </strong>

            <p>
              Analytics start recording when your
              public profile becomes active.
            </p>
          </section>
        )}

        <AnalyticsOverview
          analytics={analytics}
        />

        <RecentViews
          views={
            analytics.recentViews
          }
        />

        <section className="analytics-privacy-note">
          <strong>
            Privacy-first analytics
          </strong>

          <p>
            Worldwide DIPO does not display raw IP
            addresses or exact visitor locations in
            your dashboard. Analytics are designed
            to provide useful profile-view insights
            without exposing visitor identity.
          </p>
        </section>
      </div>
    </main>
  );
}