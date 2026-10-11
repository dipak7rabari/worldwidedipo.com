import Link from 'next/link';

export default function ProfileNotFound() {
  return (
    <main className="public-profile-status-page">
      <div className="public-profile-status-card">
        <div className="public-profile-status-code">404</div>

        <h1>Profile Not Found</h1>

        <p>
          This Worldwide DIPO profile does not exist or is not currently
          available.
        </p>

        <Link
          href="/"
          className="public-profile-primary-button"
        >
          Go to Worldwide DIPO
        </Link>
      </div>
    </main>
  );
}