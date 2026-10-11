import { redirect } from 'next/navigation';

import { getRenewalStatus } from '@/lib/payments/renewal-status';
import { getPaymentPlan } from '@/lib/payments/payment-config';

import RenewalStatus from '@/components/payment/RenewalStatus';
import RenewalPaymentForm from '@/components/payment/RenewalPaymentForm';

export const dynamic = 'force-dynamic';

function getDaysRemaining(expiresAt) {
  if (!expiresAt) return null;

  const expiry = new Date(expiresAt).getTime();

  if (!Number.isFinite(expiry)) return null;

  const difference = expiry - Date.now();

  return Math.max(
    0,
    Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  );
}

function getStatusText(status) {
  switch (status) {
    case 'draft':
      return {
        title: 'Your DIPO is Ready',
        description:
          'Choose a plan and activate your Worldwide DIPO.',
      };

    case 'pending':
      return {
        title: 'Payment Verification Pending',
        description:
          'Your payment has been submitted and is waiting for verification.',
      };

    case 'active':
      return {
        title: 'Your DIPO is Active',
        description:
          'Your Worldwide DIPO is currently live.',
      };

    case 'expired':
      return {
        title: 'Your DIPO Has Expired',
        description:
          'Renew your subscription to continue using your public DIPO.',
      };

    default:
      return {
        title: 'Subscription',
        description:
          'Manage your Worldwide DIPO subscription.',
      };
  }
}

export default async function SubscriptionPage() {
  const result = await getRenewalStatus();

  if (!result.authenticated) {
    redirect(
      '/auth/login?next=/dashboard/subscription'
    );
  }

  if (!result.profile) {
    redirect('/onboarding');
  }

  const profile = result.profile;

  /*
   * NEW PROFILE FLOW
   *
   * Draft profile has not paid yet.
   * Send the user directly to the existing
   * payment claim screen.
   */
  if (profile.status === 'draft') {
    redirect(
      '/dashboard/subscription/payment'
    );
  }

  const plan = getPaymentPlan(profile.plan);

  const daysRemaining = getDaysRemaining(
    profile.expires_at
  );

  const canRenew =
    profile.status === 'active' ||
    profile.status === 'expired';

  const statusInfo = getStatusText(
    profile.status
  );

  return (
    <main className="subscription-page">
      <div className="subscription-container">

        {/* HEADER */}
        <header className="subscription-header">
          <div>
            <p className="dashboard-eyebrow">
              WORLDWIDE DIPO
            </p>

            <h1>
              Subscription
            </h1>

            <p>
              Manage your DIPO plan, validity
              and renewal.
            </p>
          </div>

          <a
            href="/dashboard/profile"
            className="dashboard-action-secondary"
          >
            ← My DIPO
          </a>
        </header>

        {/* CURRENT STATUS */}
        <section className="subscription-overview-card">

          <div className="subscription-overview-main">
            <span>
              Current Plan
            </span>

            <h2>
              {plan?.name ||
                profile.plan ||
                '—'}
            </h2>

            <p>
              Status:{' '}
              <strong>
                {statusInfo.title}
              </strong>
            </p>
          </div>

          <div className="subscription-validity">
            <span>
              {profile.status === 'expired'
                ? 'Expired'
                : 'Validity'}
            </span>

            <strong>
              {daysRemaining === null
                ? '—'
                : `${daysRemaining} days`}
            </strong>

            {profile.expires_at && (
              <small>
                Expires{' '}
                {new Date(
                  profile.expires_at
                ).toLocaleDateString(
                  'en-IN',
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }
                )}
              </small>
            )}
          </div>

        </section>

        {/* ACTIVE / EXPIRED RENEWAL */}
        <section
          className={`subscription-status-card subscription-status-${profile.status}`}
        >
          <div className="subscription-status-icon">
            {profile.status === 'active'
              ? '✓'
              : profile.status === 'expired'
                ? '!'
                : 'i'}
          </div>

          <div>
            <h2>
              {statusInfo.title}
            </h2>

            <p>
              {statusInfo.description}
            </p>
          </div>
        </section>

        {/* PENDING RENEWAL */}
        <RenewalStatus
          pendingRenewal={
            result.pendingRenewal
          }
        />

        {result.pendingRenewal ? (
          <section className="subscription-info-card">

            <div className="subscription-info-icon">
              ⏳
            </div>

            <div>
              <h2>
                Renewal Already Submitted
              </h2>

              <p>
                A renewal payment is already
                waiting for admin verification.
              </p>

              <p>
                One profile can have only one
                pending renewal payment at a time.
              </p>

              <p>
                Once approved, your subscription
                validity will be updated.
              </p>
            </div>

          </section>
        ) : canRenew ? (
          <RenewalPaymentForm
            profile={profile}
          />
        ) : (
          <section className="subscription-info-card">

            <div className="subscription-info-icon">
              i
            </div>

            <div>
              <h2>
                Subscription Unavailable
              </h2>

              <p>
                Renewal is not available for the
                current profile state.
              </p>

              <a
                href="/dashboard/profile"
                className="dashboard-action-secondary"
              >
                Back to My DIPO
              </a>
            </div>

          </section>
        )}

        {/* FOOTER */}
        <footer className="subscription-footer">
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

        .subscription-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(37, 99, 235, 0.07),
              transparent 28%
            ),
            #f8fafc;
          color: #0f172a;
        }

        .subscription-container {
          width: min(
            calc(100% - 24px),
            1080px
          );

          margin-inline: auto;
          padding: 30px 0 70px;
        }

        .subscription-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .subscription-header h1 {
          margin: 5px 0 0;
          font-size: clamp(
            30px,
            5vw,
            42px
          );
          line-height: 1.1;
          letter-spacing: -0.04em;
        }

        .subscription-header p:last-child {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .subscription-overview-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 22px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #ffffff;
          box-shadow:
            0 8px 28px
            rgba(15, 23, 42, 0.04);
        }

        .subscription-overview-main span,
        .subscription-validity span {
          display: block;
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .subscription-overview-main h2 {
          margin: 5px 0 0;
          font-size: 24px;
          letter-spacing: -0.03em;
        }

        .subscription-overview-main p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .subscription-overview-main strong {
          color: #0f172a;
        }

        .subscription-validity {
          min-width: 150px;
          text-align: right;
        }

        .subscription-validity strong {
          display: block;
          margin-top: 5px;
          font-size: 23px;
        }

        .subscription-validity small {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 10px;
        }

        .subscription-status-card {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-top: 18px;
          padding: 18px;
          border-radius: 14px;
          border: 1px solid #dbeafe;
          background: #eff6ff;
        }

        .subscription-status-active {
          border-color: #bbf7d0;
          background: #f0fdf4;
        }

        .subscription-status-expired {
          border-color: #fecaca;
          background: #fef2f2;
        }

        .subscription-status-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #ffffff;
          font-weight: 900;
          color: #2563eb;
        }

        .subscription-status-active
          .subscription-status-icon {
          color: #16a34a;
        }

        .subscription-status-expired
          .subscription-status-icon {
          color: #dc2626;
        }

        .subscription-status-card h2 {
          margin: 0;
          font-size: 16px;
        }

        .subscription-status-card p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .subscription-info-card {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin-top: 18px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #ffffff;
        }

        .subscription-info-icon {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          font-weight: 900;
        }

        .subscription-info-card h2 {
          margin: 0;
          font-size: 17px;
        }

        .subscription-info-card p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        .subscription-info-card
          .dashboard-action-secondary {
          margin-top: 14px;
        }

        .subscription-footer {
          padding: 42px 0 25px;
          text-align: center;
          color: #94a3b8;
        }

        .subscription-footer p {
          margin: 0 0 5px;
          font-size: 10px;
        }

        .subscription-footer strong {
          display: block;
          font-size: 11px;
        }

        .subscription-footer small {
          display: block;
          margin-top: 4px;
          font-size: 8px;
        }

        @media (max-width: 600px) {

          .subscription-container {
            padding-top: 22px;
          }

          .subscription-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .subscription-overview-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .subscription-validity {
            width: 100%;
            text-align: left;
          }

          .subscription-status-card {
            align-items: flex-start;
          }

        }

        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
          }
        }

      `}</style>
    </main>
  );
}