export default function DashboardQuickActions({
  profile,
}) {
  const actions = [
    {
      title: 'Edit Profile',
      description:
        'Update your public digital identity.',
      href: '/dashboard/profile',
    },
    {
      title: 'Subscription',
      description:
        'View plan, validity and renewal.',
      href: '/dashboard/subscription',
    },
    {
      title: 'Share Profile',
      description:
        'Get your public DIPO profile link.',
      href: '/dashboard/share',
    },
    {
      title: 'Analytics',
      description:
        'View profile traffic and insights.',
      href: '/dashboard/analytics',
    },
    {
      title: 'Support',
      description:
        'Get help from DIPO support.',
      href: '/dashboard/support',
    },
    {
      title: 'Settings',
      description:
        'Manage your account settings.',
      href: '/dashboard/settings',
    },
  ];

  if (profile?.status === 'draft') {
    actions.unshift({
      title: 'Complete Profile',
      description:
        'Finish your profile before payment.',
      href: '/dashboard/profile',
    });
  }

  return (
    <section className="dashboard-quick-actions">
      <div className="dashboard-section-heading">
        <div>
          <p className="dashboard-eyebrow">
            Quick Access
          </p>

          <h2>
            Manage your DIPO
          </h2>
        </div>
      </div>

      <div className="dashboard-action-grid">
        {actions.map((action) => (
          <a
            href={action.href}
            key={action.title}
            className="dashboard-action-card"
          >
            <strong>
              {action.title}
            </strong>

            <span>
              {action.description}
            </span>

            <span className="dashboard-action-arrow">
              →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}