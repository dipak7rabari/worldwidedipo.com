// components/auth/AuthLoading.jsx

export default function AuthLoading() {
  return (
    <div
      className="auth-loading"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="auth-loading-spinner" aria-hidden="true" />

      <div className="auth-loading-content">
        <p className="auth-loading-title">Loading Worldwide DIPO</p>
        <p className="auth-loading-text">
          Please wait a moment…
        </p>
      </div>
    </div>
  );
}