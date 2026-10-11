function normalizeImage(item, fallbackAlt) {
  if (typeof item === 'string') {
    return {
      url: item,
      alt: fallbackAlt,
    };
  }

  if (
    item &&
    typeof item === 'object' &&
    typeof item.url === 'string'
  ) {
    return {
      url: item.url,
      alt:
        typeof item.alt === 'string' && item.alt.trim()
          ? item.alt.trim()
          : fallbackAlt,
    };
  }

  return null;
}

function isSafeImageUrl(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    );
  } catch {
    return false;
  }
}

export default function ProfileGallery({
  gallery,
  name,
}) {
  if (!Array.isArray(gallery)) {
    return null;
  }

  const images = gallery
    .map((item) => normalizeImage(item, name))
    .filter(Boolean)
    .filter((item) => isSafeImageUrl(item.url))
    .slice(0, 12);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="public-profile-gallery">
      {images.map((image, index) => (
        <figure
          key={`${image.url}-${index}`}
          className="public-profile-gallery-item"
        >
          <img
            src={image.url}
            alt={image.alt}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}