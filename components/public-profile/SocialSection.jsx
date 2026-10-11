function normalizeSocialLinks(
  socialLinks
) {
  if (!socialLinks) {
    return [];
  }

  if (Array.isArray(socialLinks)) {
    return socialLinks;
  }

  if (
    typeof socialLinks === 'object'
  ) {
    return Object.entries(
      socialLinks
    ).map(
      ([platform, url]) => ({
        platform,
        url,
      })
    );
  }

  return [];
}

function isSafeHttpUrl(value) {
  try {
    const url =
      new URL(value);

    return (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    );
  } catch {
    return false;
  }
}

export default function SocialSection({
  profile,
}) {
  const links =
    normalizeSocialLinks(
      profile?.social_links
    ).filter(
      (item) =>
        item &&
        typeof item.url ===
          'string' &&
        isSafeHttpUrl(
          item.url
        )
    );

  if (links.length === 0) {
    return null;
  }

  return (
    <section className="public-profile-section">
      <div className="public-profile-section-heading">
        <p>Connect</p>

        <h2>
          Social & Online
        </h2>
      </div>

      <div className="public-profile-social-list">
        {links.map(
          (item, index) => (
            <a
              key={`${item.url}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="public-profile-social-link"
            >
              <span>
                {item.platform ||
                  'Website'}
              </span>

              <span aria-hidden="true">
                ↗
              </span>
            </a>
          )
        )}
      </div>
    </section>
  );
}