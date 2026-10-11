function normalizeGallery(
  gallery
) {
  if (!Array.isArray(gallery)) {
    return [];
  }

  return gallery.filter(
    (item) => {
      if (
        typeof item ===
        'string'
      ) {
        return item.startsWith(
          'https://'
        );
      }

      return (
        item &&
        typeof item.url ===
          'string' &&
        item.url.startsWith(
          'https://'
        )
      );
    }
  );
}

export default function GallerySection({
  profile,
}) {
  const gallery =
    normalizeGallery(
      profile?.gallery
    );

  if (gallery.length === 0) {
    return null;
  }

  return (
    <section className="public-profile-section">
      <div className="public-profile-section-heading">
        <p>Gallery</p>

        <h2>
          Photos
        </h2>
      </div>

      <div className="public-profile-gallery">
        {gallery.map(
          (item, index) => {
            const src =
              typeof item ===
              'string'
                ? item
                : item.url;

            const alt =
              typeof item ===
              'object' &&
              item.alt
                ? item.alt
                : `Profile image ${
                    index + 1
                  }`;

            return (
              <figure
                key={`${src}-${index}`}
                className="public-profile-gallery-item"
              >
                <img
                  src={src}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            );
          }
        )}
      </div>
    </section>
  );
}