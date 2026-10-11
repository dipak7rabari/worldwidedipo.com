'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './PublicProfile.module.css';

const text = value =>
  typeof value === 'string' ? value.trim() : '';

const list = value =>
  Array.isArray(value) ? value : [];

const first = (...values) =>
  values.map(text).find(Boolean) || '';

function webUrl(value) {
  try {
    const url = new URL(text(value));

    return (
      ['https:', 'http:'].includes(url.protocol) &&
      !url.username &&
      !url.password
    )
      ? url.href
      : '';
  } catch {
    return '';
  }
}

function linksFrom(value) {
  const input = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? Object.entries(value).map(([label, item]) =>
          typeof item === 'string'
            ? { label, url: item }
            : {
                ...item,
                label: item?.label || label,
              }
        )
      : [];

  return input
    .map(item =>
      typeof item === 'string'
        ? { url: item }
        : item
    )
    .filter(Boolean)
    .map(item => ({
      url: webUrl(item.url),
      label:
        first(
          item.title,
          item.label,
          item.platform,
          item.name
        ) || 'Visit website',
      description: first(
        item.description,
        item.subtitle
      ),
    }))
    .filter(item => item.url);
}

function uniqueLinks(items) {
  const seen = new Set();

  return items.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

function categoryType(value) {
  const category = text(value).toLowerCase();

  if (/shop|store|retail/.test(category)) {
    return 'shop';
  }

  if (/business|brand|company/.test(category)) {
    return 'business';
  }

  if (/creator|social|influencer/.test(category)) {
    return 'creator';
  }

  if (/student|education/.test(category)) {
    return 'student';
  }

  return 'professional';
}

const COPY = {
  student: {
    gallery: 'A little of my world',
    projects: 'Projects & work',
    services: 'What I can help with',
    contact: 'Get in touch',
  },
  shop: {
    gallery: 'Inside the shop',
    projects: 'Products & highlights',
    services: 'What we offer',
    contact: 'Contact the shop',
  },
  business: {
    gallery: 'Our work, up close',
    projects: 'Work & projects',
    services: 'Our services',
    contact: 'Start a conversation',
  },
  creator: {
    gallery: 'In the spotlight',
    projects: 'Selected work',
    services: 'Work with me',
    contact: 'Let’s collaborate',
  },
  professional: {
    gallery: 'Work & moments',
    projects: 'Selected projects',
    services: 'How I can help',
    contact: 'Let’s work together',
  },
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function OutLink({
  href,
  children,
  className,
}) {
  const external = /^https?:/.test(href);

  return (
    <a
      href={href}
      className={className}
      target={external ? '_blank' : undefined}
      rel={
        external
          ? 'noopener noreferrer nofollow'
          : undefined
      }
    >
      {children}
    </a>
  );
}

function Photo({
  src,
  alt,
  className,
  eager = false,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <span
        className={`${className || ''} ${styles.photoFallback}`}
        role="img"
        aria-label={alt}
      >
        Image unavailable
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function Avatar({ src, name }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className={styles.avatar}>
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}

function LongText({ value }) {
  if (!value) return null;

  if (value.length <= 380) {
    return (
      <p className={styles.prose}>
        {value}
      </p>
    );
  }

  const cut = value.lastIndexOf(' ', 360);
  const end = cut > 200 ? cut : 360;

  return (
    <div className={styles.longText}>
      <p className={styles.prose}>
        {value.slice(0, end)}
      </p>

      <details>
        <summary>
          <span className={styles.more}>
            Read more
          </span>

          <span className={styles.less}>
            Show less
          </span>
        </summary>

        <p className={styles.prose}>
          {value.slice(end).trim()}
        </p>
      </details>
    </div>
  );
}

function Section({
  id,
  title,
  label,
  aside,
  children,
}) {
  return (
    <section
      id={id}
      className={styles.section}
    >
      <div className={styles.sectionHead}>
        <div>
          {label && (
            <p className={styles.eyebrow}>
              {label}
            </p>
          )}

          <h2>{title}</h2>
        </div>

        {aside && (
          <span className={styles.count}>
            {aside}
          </span>
        )}
      </div>

      {children}
    </section>
  );
}

function Gallery({ images, name }) {
  const dialog = useRef(null);
  const touch = useRef(null);
  const [index, setIndex] = useState(null);

  const isOpen = index !== null;
  const selected = isOpen ? images[index] : null;

  const move = step => {
    setIndex(current =>
      current === null
        ? null
        : (
            current +
            step +
            images.length
          ) % images.length
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const element = dialog.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    if (!element.open) {
      element.showModal();
    }

    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus?.();
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={styles.gallery}
        data-count={images.length}
      >
        {images.map((item, i) => (
          <button
            key={`${item.url}-${i}`}
            type="button"
            className={styles.thumbnail}
            onClick={() => setIndex(i)}
            aria-label={`Open photo ${i + 1} of ${images.length}: ${item.alt}`}
          >
            <Photo
              src={item.url}
              alt={item.alt}
              className={styles.thumbImage}
            />

            <span className={styles.photoNumber}>
              {String(i + 1).padStart(2, '0')}
              <Arrow />
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label={`${name} photo gallery`}
        onCancel={() => setIndex(null)}
        onClose={() => setIndex(null)}
        onClick={event => {
          if (event.target === event.currentTarget) {
            setIndex(null);
          }
        }}
        onKeyDown={event => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            move(1);
          }

          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {selected && (
          <div className={styles.viewer}>
            <div className={styles.viewerTop}>
              <span aria-live="polite">
                {index + 1} / {images.length}
              </span>

              <button
                type="button"
                autoFocus
                onClick={() => setIndex(null)}
                aria-label="Close photo"
              >
                ✕
              </button>
            </div>

            <div
              className={styles.viewerImage}
              onTouchStart={event => {
                const point = event.touches[0];

                touch.current = {
                  x: point.clientX,
                  y: point.clientY,
                };
              }}
              onTouchEnd={event => {
                const start = touch.current;
                touch.current = null;

                if (!start) return;

                const end = event.changedTouches[0];
                const dx = end.clientX - start.x;
                const dy = end.clientY - start.y;

                if (
                  Math.abs(dx) > 60 &&
                  Math.abs(dx) > Math.abs(dy) * 1.5
                ) {
                  move(dx < 0 ? 1 : -1);
                }
              }}
            >
              <Photo
                key={selected.url}
                src={selected.url}
                alt={selected.alt}
                className={styles.fullImage}
                eager
              />
            </div>

            {images.length > 1 && (
              <div className={styles.viewerControls}>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous photo"
                >
                  ← Previous
                </button>

                <span>Swipe to explore</span>

                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next photo"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

export default function PublicProfile({
  profile,
  isOwner = false,
}) {
  const [shareStatus, setShareStatus] = useState('');
  const [manualShare, setManualShare] = useState('');

  if (!profile) return null;

  const name = text(profile.name) || 'My profile';

  const tier = ['starter', 'pro', 'elite'].includes(
    profile.plan
  )
    ? profile.plan
    : 'starter';

  const type = categoryType(profile.category);
  const copy = COPY[type];

  const business =
    profile.business &&
    typeof profile.business === 'object'
      ? profile.business
      : {};

  const title = first(
    profile.profession,
    profile.category
  );

  const intro = first(
    profile.headline,
    profile.bio
  );

  const about = first(
    profile.about,
    profile.bio !== intro ? profile.bio : ''
  );

  const extraBio =
    text(profile.bio) &&
    profile.bio !== intro &&
    profile.bio !== about
      ? text(profile.bio)
      : '';

  const location = first(
    profile.location,
    business.address
  );

  const socials = uniqueLinks(
    linksFrom(profile.social_links)
  );

  const links = uniqueLinks(
    linksFrom(profile.links)
  );

  const allLinks = uniqueLinks([
    ...socials,
    ...links,
  ]);

  const images = list(profile.gallery)
    .map((item, i) => ({
      url: webUrl(
        typeof item === 'string'
          ? item
          : item?.url
      ),
      alt:
        first(item?.alt, item?.caption) ||
        `${name} — photo ${i + 1}`,
    }))
    .filter(item => item.url);

  const services = list(profile.services)
    .map(item =>
      typeof item === 'string'
        ? {
            title: text(item),
          }
        : {
            title: first(
              item?.title,
              item?.name,
              item?.service,
              item?.label
            ),
            description: text(item?.description),
          }
    )
    .filter(item => item.title);

  const skills = [
    ...new Set(
      list(profile.skills)
        .map(item =>
          typeof item === 'string'
            ? text(item)
            : first(
                item?.name,
                item?.title,
                item?.skill,
                item?.label
              )
        )
        .filter(Boolean)
    ),
  ];

  const projects = list(profile.projects)
    .filter(
      item =>
        item &&
        typeof item === 'object'
    )
    .map(item => ({
      title: first(item.title, item.name),
      description: first(
        item.description,
        item.summary
      ),
      url: webUrl(item.url),
    }))
    .filter(
      item =>
        item.title ||
        item.description ||
        item.url
    );

  const experience = list(profile.experience)
    .filter(Boolean)
    .map(item => ({
      title: first(
        item.title,
        item.role,
        item.position,
        item.designation
      ),
      subtitle: first(
        item.company,
        item.organization,
        item.company_name
      ),
      period: first(
        item.period,
        item.duration,
        item.date,
        item.dates
      ),
      description: text(item.description),
    }))
    .filter(
      item =>
        item.title ||
        item.subtitle ||
        item.period
    );

  const education = list(profile.education)
    .filter(Boolean)
    .map(item => ({
      title: first(
        item.degree,
        item.title,
        item.course,
        item.qualification
      ),
      subtitle: first(
        item.institution,
        item.school,
        item.college,
        item.university
      ),
      period: first(item.period, item.year),
      description: text(item.description),
    }))
    .filter(item => item.title || item.subtitle);

  const whatsapp = text(profile.whatsapp).replace(
    /\D/g,
    ''
  );

  const phone = text(profile.phone).replace(
    /[^\d+]/g,
    ''
  );

  const maps = webUrl(business.maps_url);

  const contacts = [
    ...(whatsapp
      ? [
          {
            label: 'WhatsApp',
            url: `https://wa.me/${whatsapp}`,
          },
        ]
      : []),
    ...(phone
      ? [
          {
            label: 'Call',
            url: `tel:${phone}`,
          },
        ]
      : []),
    ...(maps
      ? [
          {
            label: 'Get directions',
            url: maps,
          },
        ]
      : []),
  ];

  const primary =
    contacts[0] ||
    (
      type === 'student'
        ? allLinks.find(item =>
            /resume|résumé|cv/i.test(item.label)
          )
        : null
    ) ||
    allLinks[0];

  const second =
    type === 'shop' &&
    maps &&
    primary?.url !== maps
      ? {
          label: 'Get directions',
          url: maps,
        }
      : null;

  const hasContact =
    contacts.length + allLinks.length > 0;

  const navigation = [
    images.length && {
      id: 'photos',
      label: 'Photos',
    },
    projects.length && {
      id: 'work',
      label: type === 'shop' ? 'Highlights' : 'Work',
    },
    services.length && {
      id: 'services',
      label: 'Services',
    },
    (
      about ||
      extraBio ||
      skills.length ||
      experience.length ||
      education.length
    ) && {
      id: 'about',
      label: 'About',
    },
    hasContact && {
      id: 'contact',
      label: 'Contact',
    },
  ].filter(Boolean);

  const businessVisible =
    first(business.name, business.address) ||
    maps;

  async function share() {
    const url =
      `${window.location.origin}/p/${encodeURIComponent(profile.slug)}`;

    setShareStatus('');
    setManualShare('');

    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Explore ${name}'s website`,
          url,
        });

        return;
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('Link copied');
    } catch {
      setManualShare(url);
      setShareStatus('Copy the link below to share.');
    }
  }

  const projectSection = projects.length > 0 && (
    <Section
      id="work"
      label={
        type === 'creator'
          ? 'CREATED BY ME'
          : 'SELECTED WORK'
      }
      title={copy.projects}
      aside={`${projects.length} ${
        projects.length === 1
          ? 'project'
          : 'projects'
      }`}
    >
      <div className={styles.cards}>
        {projects.map((item, i) => (
          <article
            className={styles.project}
            key={`${item.title}-${i}`}
          >
            <span className={styles.itemNumber}>
              {String(i + 1).padStart(2, '0')}
            </span>

            <h3>{item.title || 'Project'}</h3>

            <LongText value={item.description} />

            {item.url && (
              <OutLink
                href={item.url}
                className={styles.textLink}
              >
                View project
                <Arrow />
              </OutLink>
            )}
          </article>
        ))}
      </div>
    </Section>
  );

  return (
    <main
      className={styles.page}
      data-plan={tier}
    >
      <a
        href="#profile-main"
        className={styles.skip}
      >
        Skip to profile
      </a>

      <div className={styles.shell}>
        {isOwner && (
          <div className={styles.owner}>
            <span>Your public website</span>

            <div>
              <Link href="/dashboard/profile/edit">
                Edit profile ↗
              </Link>

              <Link href="/dashboard">
                Dashboard
              </Link>
            </div>
          </div>
        )}

        <header className={styles.header}>
          <a
            href="#profile-main"
            className={styles.brand}
          >
            <span className={styles.brandMark}>
              {initials(name)}
            </span>

            <span>{name}</span>
          </a>

          <button
            type="button"
            className={styles.shareButton}
            onClick={share}
            aria-label={`Share ${name}'s profile`}
          >
            Share
            <Arrow />
          </button>
        </header>

        <div
          id="profile-main"
          className={styles.hero}
        >
          <div className={styles.heroTop}>
            <Avatar
              src={webUrl(profile.avatar_url)}
              name={name}
            />

            <div className={styles.identityMeta}>
              {text(profile.category) && (
                <span className={styles.category}>
                  {profile.category}
                </span>
              )}

              {tier !== 'starter' && (
                <span className={styles.plan}>
                  {tier === 'elite'
                    ? '✦ Elite'
                    : '✧ Pro'}
                </span>
              )}

              {profile.verified === true && (
                <span
                  className={styles.verified}
                  title="Active DIPO membership approved through payment review; this does not verify identity or credentials."
                >
                  ✓ DIPO member
                </span>
              )}
            </div>
          </div>

          <div className={styles.heroBody}>
            <div className={styles.heroCopy}>
              <h1>{name}</h1>

              {title && (
                <p className={styles.profession}>
                  {title}
                </p>
              )}

              {intro && (
                <div className={styles.intro}>
                  <LongText value={intro} />
                </div>
              )}

              {location && (
                <p className={styles.location}>
                  <span aria-hidden="true">⌖</span>
                  {location}
                </p>
              )}
            </div>

            <div className={styles.heroActions}>
              {primary && (
                <OutLink
                  href={primary.url}
                  className={styles.primary}
                >
                  {primary.label}
                  <Arrow />
                </OutLink>
              )}

              {second && (
                <OutLink
                  href={second.url}
                  className={styles.secondary}
                >
                  {second.label}
                  <Arrow />
                </OutLink>
              )}

              {!primary && images.length > 0 && (
                <a
                  href="#photos"
                  className={styles.primary}
                >
                  Explore my photos
                  <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {navigation.length > 1 && (
          <nav
            className={styles.navigation}
            aria-label="Profile sections"
          >
            {navigation.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {type === 'student' && projectSection}

        {images.length > 0 && (
          <Section
            id="photos"
            label={
              type === 'shop'
                ? 'TAKE A LOOK'
                : 'GALLERY'
            }
            title={copy.gallery}
            aside={`${images.length} ${
              images.length === 1
                ? 'photo'
                : 'photos'
            }`}
          >
            <Gallery
              images={images}
              name={name}
            />
          </Section>
        )}

        {type !== 'student' && projectSection}

        {services.length > 0 && (
          <Section
            id="services"
            label="SERVICES"
            title={copy.services}
          >
            <div className={styles.cards}>
              {services.map((item, i) => (
                <article
                  className={styles.service}
                  key={`${item.title}-${i}`}
                >
                  <span
                    className={styles.serviceMark}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <h3>{item.title}</h3>

                  <LongText value={item.description} />
                </article>
              ))}
            </div>
          </Section>
        )}

        {(
          about ||
          extraBio ||
          skills.length > 0 ||
          experience.length > 0 ||
          education.length > 0
        ) && (
          <Section
            id="about"
            label="THE STORY"
            title={
              type === 'business' || type === 'shop'
                ? 'About us'
                : `About ${name.split(/\s+/)[0]}`
            }
          >
            <div className={styles.aboutGrid}>
              <div className={styles.aboutText}>
                <LongText value={about} />

                {extraBio && (
                  <LongText value={extraBio} />
                )}

                {skills.length > 0 && (
                  <div className={styles.skills}>
                    <h3>Skills & expertise</h3>

                    <div>
                      {skills.map(skill => (
                        <span key={skill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {(
                experience.length > 0 ||
                education.length > 0
              ) && (
                <div className={styles.journey}>
                  {[
                    {
                      heading: 'Experience',
                      items: experience,
                    },
                    {
                      heading: 'Education',
                      items: education,
                    },
                  ]
                    .filter(group => group.items.length)
                    .map(group => (
                      <div key={group.heading}>
                        <h3>{group.heading}</h3>

                        {group.items.map((item, i) => (
                          <article
                            className={styles.timeline}
                            key={`${item.title}-${i}`}
                          >
                            {item.period && (
                              <small>{item.period}</small>
                            )}

                            <h4>
                              {item.title || item.subtitle}
                            </h4>

                            {item.subtitle &&
                              item.subtitle !== item.title && (
                                <p>{item.subtitle}</p>
                              )}

                            <LongText
                              value={item.description}
                            />
                          </article>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </Section>
        )}

        {businessVisible && (
          <Section
            id="visit"
            label="BUSINESS DETAILS"
            title={
              type === 'shop'
                ? 'Find the shop'
                : 'Business information'
            }
          >
            <div className={styles.business}>
              <div>
                {text(business.name) && (
                  <h3>{business.name}</h3>
                )}

                {text(business.address) && (
                  <p className={styles.prose}>
                    {business.address}
                  </p>
                )}
              </div>

              {maps && (
                <OutLink
                  href={maps}
                  className={styles.secondary}
                >
                  Get directions
                  <Arrow />
                </OutLink>
              )}
            </div>
          </Section>
        )}

        {hasContact && (
          <Section
            id="contact"
            label="CONTACT & LINKS"
            title={copy.contact}
          >
            <div className={styles.contactPanel}>
              {contacts.length > 0 && (
                <div className={styles.contactActions}>
                  {contacts.map(item => (
                    <OutLink
                      key={item.url}
                      href={item.url}
                      className={styles.secondary}
                    >
                      {item.label}
                      <Arrow />
                    </OutLink>
                  ))}
                </div>
              )}

              {allLinks.length > 0 && (
                <div className={styles.linkGrid}>
                  {allLinks.map(item => (
                    <OutLink
                      key={item.url}
                      href={item.url}
                      className={styles.linkCard}
                    >
                      <div>
                        <strong>{item.label}</strong>

                        {item.description && (
                          <p>{item.description}</p>
                        )}

                        <small>
                          {new URL(item.url)
                            .hostname
                            .replace(/^www\./, '')}
                        </small>
                      </div>

                      <Arrow />
                    </OutLink>
                  ))}
                </div>
              )}
            </div>
          </Section>
        )}

        <div
          className={styles.shareFeedback}
          role="status"
          aria-live="polite"
        >
          {shareStatus}
        </div>

        {manualShare && (
          <label className={styles.manualShare}>
            Profile link
            <input
              value={manualShare}
              readOnly
              onFocus={event => event.target.select()}
            />
          </label>
        )}

        <footer className={styles.footer}>
          <span>{name}</span>

          {tier !== 'elite' && (
            <Link href="/explore">
              Made with Worldwide DIPO ↗
            </Link>
          )}

          {isOwner && (
            <Link href="/explore">
              Explore DIPO ↗
            </Link>
          )}

          <button
            type="button"
            onClick={share}
          >
            Share this page ↗
          </button>
        </footer>
      </div>

      <div className={styles.dock}>
        <span className={styles.dockName}>
          {name}
        </span>

        {primary ? (
          <OutLink
            href={primary.url}
            className={styles.primary}
          >
            {primary.label}
            <Arrow />
          </OutLink>
        ) : (
          <a
            href="#profile-main"
            className={styles.primary}
          >
            Back to top ↑
          </a>
        )}

        <button
          type="button"
          className={styles.dockShare}
          onClick={share}
          aria-label="Share this profile"
        >
          Share ↗
        </button>
      </div>
    </main>
  );
}