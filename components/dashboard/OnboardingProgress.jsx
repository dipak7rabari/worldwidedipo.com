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

export default function OnboardingProgress({
  profile,
}) {
  const status = profile?.status;

  let currentStep = 1;

  if (profile) {
    currentStep = 2;
  }

  if (
    profile?.plan &&
    profile.plan !== 'Starter'
  ) {
    currentStep = 3;
  }

  if (status === 'pending') {
    currentStep = 4;
  }

  if (status === 'active') {
    currentStep = 5;
  }

  return (
    <section className="dashboard-progress-card">
      <div className="dashboard-progress-heading">
        <div>
          <p className="dashboard-eyebrow">
            Your Journey
          </p>

          <h2>Profile Activation</h2>
        </div>

        <span>
          {currentStep} / {STEPS.length}
        </span>
      </div>

      <div className="dashboard-progress-list">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;

          const completed =
            stepNumber < currentStep;

          const active =
            stepNumber === currentStep;

          return (
            <div
              key={step.key}
              className={[
                'dashboard-progress-step',
                completed
                  ? 'is-complete'
                  : '',
                active
                  ? 'is-active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="dashboard-progress-dot">
                {completed
                  ? '✓'
                  : stepNumber}
              </div>

              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}