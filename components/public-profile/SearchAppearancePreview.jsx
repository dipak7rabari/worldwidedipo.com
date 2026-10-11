export default function SearchAppearancePreview({
  profile,
}) {
  const name =
    profile?.name?.trim() || 'Your Name';

  const profession =
    profile?.profession?.trim();

  const slug =
    profile?.slug?.trim() || 'your-slug';

  const description =
    profile?.bio?.trim() ||
    profile?.headline?.trim() ||
    'Personal Digital Identity Page on Worldwide DIPO.';

  const displayUrl =
    `worldwidedipo.com/p/${slug}`;

  return (
    <section
      className="search-appearance-preview"
      aria-label="Search Appearance Simulation"
    >
      <div className="search-appearance-header">
        <span>Search Appearance Simulation</span>
        <span className="search-appearance-badge">
          Preview
        </span>
      </div>

      <p className="search-appearance-intro">
        Aapki online digital identity kuch aisi dikhegi.
      </p>

      <div className="search-result-simulation">
        <div className="search-result-url">
          {displayUrl}
        </div>

        <div className="search-result-title">
          {profession
            ? `${name} - ${profession} | Worldwide DIPO`
            : `${name} | Worldwide DIPO`}
        </div>

        <div className="search-result-description">
          {description}
        </div>
      </div>

      <p className="search-appearance-disclaimer">
        Search engines may discover your profile through
        structured data, public links and sitemap signals.
        Crawling, indexing, and search appearance are
        controlled by search-engine systems and are not
        guaranteed.
      </p>
    </section>
  );
}