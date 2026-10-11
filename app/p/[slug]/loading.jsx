export default function PublicProfileLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading profile"
      className="public-profile-loading"
    >
      <div className="public-profile-loading-container">
        <div className="public-profile-loading-avatar" />

        <div className="public-profile-loading-line public-profile-loading-name" />
        <div className="public-profile-loading-line public-profile-loading-role" />
        <div className="public-profile-loading-line public-profile-loading-short" />

        <div className="public-profile-loading-card">
          <div className="public-profile-loading-line" />
          <div className="public-profile-loading-line" />
          <div className="public-profile-loading-line public-profile-loading-short" />
        </div>

        <div className="public-profile-loading-card">
          <div className="public-profile-loading-line" />
          <div className="public-profile-loading-line" />
        </div>
      </div>
    </main>
  );
}