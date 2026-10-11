'use client';

import Link from 'next/link';
import styles from './ExplorePage.module.css';

function getInitials(name = '') {
  const cleanName = String(name).trim();

  if (!cleanName) return 'D';

  const parts = cleanName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function safeProfilePath(slug) {
  if (!slug) return '/explore';

  return `/p/${encodeURIComponent(String(slug).trim())}`;
}

function getCategoryLabel(category) {
  if (!category) return 'Digital Identity';

  return String(category)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getDescription(profile) {
  return (
    profile?.description ||
    profile?.bio ||
    profile?.headline ||
    'Discover this digital identity on Worldwide DIPO.'
  );
}

function getMetaItems(profile) {
  const items = [];

  if (profile?.profession) {
    items.push(profile.profession);
  }

  if (profile?.category) {
    items.push(getCategoryLabel(profile.category));
  }

  if (profile?.location) {
    items.push(profile.location);
  }

  return items.slice(0, 3);
}

export default function ExploreCard({
  profile,
  featured = false,
}) {
  if (!profile) return null;

  const {
    name,
    slug,
    avatar_url: avatarUrl,
    is_demo: isDemo,
    is_owner: isOwner,
    demo_label: demoLabel,
    demo_notice: demoNotice,
    since,
    known_for: knownFor,
    tags,
  } = profile;

  const safeName = name || 'Worldwide DIPO';
  const initials = getInitials(safeName);
  const profilePath = safeProfilePath(slug);
  const metaItems = getMetaItems(profile);

  const description = getDescription(profile);

  const normalizedTags = Array.isArray(tags)
    ? tags.filter(Boolean).slice(0, 4)
    : [];

  return (
    <article
      className={[
        styles.exploreCard,
        isDemo ? styles.demoCard : '',
        isOwner ? styles.ownerCard : '',
        featured ? styles.featuredCard : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-demo={isDemo ? 'true' : 'false'}
      data-owner={isOwner ? 'true' : 'false'}
    >
      {/* Premium top accent */}
      <div
        className={styles.cardAccent}
        aria-hidden="true"
      />

      {/* Card header */}
      <div className={styles.cardTop}>
        <div className={styles.cardIdentity}>
          <Link
            href={profilePath}
            className={styles.avatarLink}
            aria-label={`View ${safeName}'s DIPO`}
          >
            <div className={styles.avatar}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className={styles.avatarImage}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span
                  className={styles.avatarFallback}
                  aria-hidden="true"
                >
                  {initials}
                </span>
              )}
            </div>
          </Link>

          <div className={styles.identityText}>
            <div className={styles.nameRow}>
              <Link
                href={profilePath}
                className={styles.profileName}
                title={safeName}
              >
                {safeName}
              </Link>

              {isDemo ? (
                <span
                  className={styles.demoBadge}
                  title={demoNotice || 'Demo showcase profile'}
                >
                  ✦ DIPO Demo
                </span>
              ) : (
                <span
                  className={styles.liveBadge}
                  title="Active Worldwide DIPO profile"
                  aria-label="Active Worldwide DIPO profile"
                >
                  <span
                    className={styles.liveDot}
                    aria-hidden="true"
                  />
                  DIPO
                </span>
              )}
            </div>

            {profile?.profession && (
              <p className={styles.profileProfession}>
                {profile.profession}
              </p>
            )}
          </div>
        </div>

        {isOwner && (
          <span
            className={styles.ownerBadge}
            title="You own this DIPO"
          >
            You
          </span>
        )}
      </div>

      {/* Category / location metadata */}
      {metaItems.length > 0 && (
        <div
          className={styles.profileMeta}
          aria-label="Profile information"
        >
          {metaItems.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={styles.metaItem}
            >
              {index > 0 && (
                <span
                  className={styles.metaSeparator}
                  aria-hidden="true"
                >
                  ·
                </span>
              )}

              <span>{item}</span>
            </span>
          ))}
        </div>
      )}

      {/* Headline */}
      {profile?.headline && (
        <p className={styles.profileHeadline}>
          {profile.headline}
        </p>
      )}

      {/* Description */}
      <p className={styles.profileDescription}>
        {description}
      </p>

      {/* Demo showcase information */}
      {isDemo && (since || knownFor) && (
        <div className={styles.demoFacts}>
          {since && (
            <div className={styles.demoFact}>
              <span className={styles.demoFactLabel}>
                Since
              </span>
              <span className={styles.demoFactValue}>
                {since}
              </span>
            </div>
          )}

          {knownFor && (
            <div className={styles.demoFact}>
              <span className={styles.demoFactLabel}>
                Known for
              </span>
              <span className={styles.demoFactValue}>
                {knownFor}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {normalizedTags.length > 0 && (
        <div
          className={styles.cardTags}
          aria-label="Profile topics"
        >
          {normalizedTags.map((tag) => (
            <span
              key={String(tag)}
              className={styles.cardTag}
            >
              {String(tag)}
            </span>
          ))}
        </div>
      )}

      {/* Card footer */}
      <div className={styles.cardFooter}>
        <Link
          href={profilePath}
          className={styles.viewDipoButton}
          aria-label={`View ${safeName}'s DIPO`}
        >
          <span>View DIPO</span>

          <span
            className={styles.buttonArrow}
            aria-hidden="true"
          >
            →
          </span>
        </Link>

        {isOwner && (
          <Link
            href="/dashboard/profile/edit"
            className={styles.manageButton}
            aria-label="Manage your DIPO"
          >
            Manage
          </Link>
        )}
      </div>

      {/* Demo disclaimer */}
      {isDemo && (
        <p className={styles.demoDisclaimer}>
          Demo showcase · Not an official Worldwide DIPO profile
        </p>
      )}
    </article>
  );
}