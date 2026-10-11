export default function ProfileSection({
  title,
  children,
  className = '',
}) {
  if (!children) {
    return null;
  }

  return (
    <section
      className={`public-profile-section ${className}`.trim()}
    >
      <h2>{title}</h2>

      <div className="public-profile-section-content">
        {children}
      </div>
    </section>
  );
}