import { redirect } from 'next/navigation';

import {
  getDashboardData,
} from '@/lib/dashboard/get-dashboard-data';

import DashboardHeader from '@/components/dashboard/DashboardHeader';

import ProfileStatusCard from '@/components/dashboard/ProfileStatusCard';

import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';

import PaymentStatusBanner from '@/components/dashboard/PaymentStatusBanner';

import DashboardProgress from '@/components/dashboard/DashboardProgress';

import {
  getDashboardPrimaryAction,
} from '@/lib/dashboard/dashboard-utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const result =
    await getDashboardData();

  if (!result.authenticated) {
    redirect(
      '/auth/login?next=/dashboard'
    );
  }

  if (result.error) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div
            className="dashboard-error-card"
            role="alert"
          >
            {result.error}
          </div>
        </div>
      </main>
    );
  }

  const profile =
    result.profile;

  const primaryAction =
    getDashboardPrimaryAction(
      profile
    );

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <DashboardHeader
          user={result.user}
          profile={profile}
        />

        <DashboardProgress
          profile={profile}
        />

        <PaymentStatusBanner
          profile={profile}
          pendingPayment={
            result.pendingPayment
          }
        />

        <ProfileStatusCard
          profile={profile}
        />

        <div className="dashboard-primary-action">
          <a
            href={primaryAction.href}
            className="dashboard-action-primary"
          >
            {primaryAction.label}
          </a>
        </div>

        <DashboardQuickActions
          profile={profile}
        />
      </div>
    </main>
  );
}