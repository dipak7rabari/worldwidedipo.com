export default function ProfileCreatePreview({
  form,
}) {
  const name =
    form?.name?.trim() || 'Your Name';

  const profession =
    form?.profession?.trim() ||
    'Your Profession';

  const headline =
    form?.headline?.trim() ||
    'Your professional headline will appear here.';

  const slug =
    form?.slug?.trim() ||
    'your-slug';

  return (
    <section className="profile-create-preview">
      <div className="profile-create-preview-header">
        <span>
          Search Appearance Simulation
        </span>

        <span className="search-appearance-badge">
          Preview
        </span>
      </div>

      <p className="profile-create-preview-intro">
        Aapki digital identity kuch aisi dikhegi.
      </p>

      <div className="profile-create-preview-result">
        <div className="profile-create-preview-url">
          worldwidedipo.com/p/{slug}
        </div>

        <h3>
          {name} - {profession} | Worldwide DIPO
        </h3>

        <p>{headline}</p>
      </div>

      <p className="profile-create-preview-note">
        This is a search appearance simulation,
        not a search-engine result or indexing
        guarantee.
      </p>
    </section>
  );
}