function normalizeLink(item) {
  if (typeof item === 'string') {
    return {
      label: item,
      url: item,
    };
  }

  if (
    item &&
    typeof item === 'object' &&
    typeof item.url === 'string'
  ) {
    return {
      label:
        typeof item.label === 'string'
          ? item.label
          : typeof item.title === 'string'
            ? item.title
            : item.url,
      url: item.url,
    };
  }

  return null;
}

function isSafeUrl(value) {
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

export default function ProfileLink({
  item,
}) {
  const link = normalizeLink(item);

  if (!link || !isSafeUrl(link.url)) {
    return null;
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="public-profile-link"
    >
      <span>{link.label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}