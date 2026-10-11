const STEPS = [
  {
    key: 'account',
    label: 'Account',
  },
  {
    key: 'profile',
    label: 'Profile Setup',
  },
  {
    key: 'plan',
    label: 'Choose Plan',
  },
  {
    key: 'payment',
    label: 'Payment',
  },
  {
    key: 'live',
    label: 'Go Live',
  },
];

function getProgressIndex(
  profile
) {
  if (!profile) {
    return 0;
  }

  if (profile.status === 'draft') {
    return 1;
  }

  if (profile.status === 'pending') {
    return 3;
  }

  if (profile.status === 'active') {
    return 5;
  }

  if (profile.status === 'expired') {
    return 4;
  }

  return 1;
}

export default function DashboardProgress({
  profile,
}) {
  const current =
    getProgressIndex(profile);

  return (
    <section className="dashboard-progress-card">
      <div className="dashboard-section-heading">
        <div>
          <p className="dashboard-eyebrow">
            Setup Progress
          </p>

          <h2>
            Your DIPO journey
          </h2>
        </div>
      </div>

      <div className="dashboard-progress-list">
        {STEPS.map(
          (step, index) => {
            const number =
              index + 1;

            const completed =
              number < current ||
              (profile?.status ===
                'active' &&
                number <= 5);

            const active =
              number === current &&
              profile?.status !==
                'active';

            return (
              <div
                key={step.key}
                className={`dashboard-progress-step ${
                  completed
                    ? 'is-complete'
                    : ''
                } ${
                  active
                    ? 'is-active'
                    : ''
                }`}
              >
                <span className="dashboard-progress-number">
                  {completed
                    ? '✓'
                    : number}
                </span>

                <span>
                  {step.label}
                </span>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}