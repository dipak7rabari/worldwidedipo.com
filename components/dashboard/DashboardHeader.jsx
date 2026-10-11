export default function DashboardHeader({
  user,
  profile,
}) {
  const firstName =
    profile?.name?.split(' ')[0] ||
    user?.user_metadata?.name?.split(
      ' '
    )[0] ||
    'there';

  return (
    <header className="dashboard-main-header">
      <div>
        <p className="dashboard-eyebrow">
          Worldwide DIPO
        </p>

        <h1>
          Welcome, {firstName}
        </h1>

        <p>
          Manage your digital identity from
          one place.
        </p>
      </div>

      {profile?.status ===
        'active' &&
        profile?.slug && (
          <a
            href={`/p/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="dashboard-action-primary"
          >
            View Public Profile
          </a>
        )}
    </header>
  );
}