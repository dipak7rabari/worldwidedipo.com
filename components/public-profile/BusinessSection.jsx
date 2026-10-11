export default function BusinessSection({
  profile,
}) {
  const business =
    profile?.business;

  if (
    !business ||
    typeof business !==
      'object'
  ) {
    return null;
  }

  const name =
    typeof business.name ===
    'string'
      ? business.name.trim()
      : '';

  const category =
    typeof profile?.category ===
    'string'
      ? profile.category.trim()
      : '';

  const address =
    typeof business.address ===
    'string'
      ? business.address.trim()
      : '';

  const mapsUrl =
    typeof business.maps_url ===
    'string'
      ? business.maps_url.trim()
      : '';

  if (
    !name &&
    !category &&
    !address &&
    !mapsUrl
  ) {
    return null;
  }

  const safeMaps =
    mapsUrl.startsWith(
      'https://'
    );

  return (
    <section className="public-profile-section">
      <div className="public-profile-section-heading">
        <p>Business</p>

        <h2>
          Business Information
        </h2>
      </div>

      <div className="public-profile-business-card">
        {name && (
          <h3>{name}</h3>
        )}

        {category && (
          <p className="public-profile-business-category">
            {category}
          </p>
        )}

        {address && (
          <p>
            {address}
          </p>
        )}

        {safeMaps && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Open Location ↗
          </a>
        )}
      </div>
    </section>
  );
}