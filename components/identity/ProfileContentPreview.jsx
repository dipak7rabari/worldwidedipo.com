import MediaGallery from './MediaGallery';
import styles from './Identity.module.css';

import {
  getPlanImageLimit,
} from '@/config/plans';

import { planKey } from './PlanBadge';

function linksFrom(value) {
  const list = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? Object.entries(value).map(
          ([label, url]) => ({
            label,
            url,
          }),
        )
      : [];

  return list
    .map((item) =>
      typeof item === 'string'
        ? {
            url: item,
            label: 'Visit link',
          }
        : item,
    )
    .filter((item) => {
      try {
        return ['https:', 'http:'].includes(
          new URL(item?.url).protocol,
        );
      } catch {
        return false;
      }
    });
}

export default function ProfileContentPreview({
  profile,
}) {
  const links = [
    ...linksFrom(profile.social_links),
    ...linksFrom(profile.links),
  ];

  const gallery = Array.isArray(profile.gallery)
    ? profile.gallery
    : [];

  const limit = getPlanImageLimit(
    planKey(profile.plan),
  );

  return (
    <section className={styles.panel}>
      <div className={styles.heading}>
        <h2>Your profile, at a glance</h2>

        <a href="/dashboard/profile/edit">
          Edit profile ↗
        </a>
      </div>

      {profile.bio && <p>{profile.bio}</p>}
      {profile.about && <p>{profile.about}</p>}

      <div className={styles.links}>
        {links.map((item, index) => (
          <a
            key={`${item.url}-${index}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.label ||
              item.platform ||
              item.title ||
              item.name ||
              'Visit link'}

            <span>↗</span>
          </a>
        ))}
      </div>

      {!links.length && (
        <p>
          Add your social profiles and website links
          in Edit Profile.
        </p>
      )}

      <div
        className={styles.heading}
        style={{ marginTop: 24 }}
      >
        <h2>Gallery</h2>

        <span className={styles.muted}>
          {gallery.length}/{limit} images uploaded
        </span>
      </div>

      <MediaGallery
        gallery={gallery}
        name={profile.name}
      />

      {!gallery.length && (
        <p>Your saved photos will appear here.</p>
      )}
    </section>
  );
}