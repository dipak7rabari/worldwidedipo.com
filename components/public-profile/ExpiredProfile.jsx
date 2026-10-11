import Link from 'next/link';
export default function ExpiredProfile() {
  return (
    <main className="public-profile-status-page">
      <div className="public-profile-status-card">
        <div className="public-profile-status-icon">○</div>

        <h1>Profile Currently Unavailable</h1>

        <p>
          This Worldwide DIPO profile is currently unavailable.
          The profile may have expired or may no longer be publicly active.
        </p>

        <div className="public-profile-status-actions">
        <Link href="/">Go to Worldwide DIPO</Link>
        </div>
      </div>
    </main>
  );
}