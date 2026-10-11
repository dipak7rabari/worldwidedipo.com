'use client';

import { useMemo } from 'react';

/**
 * Worldwide DIPO
 * SocialLinks
 *
 * Reusable social-link presentation component.
 *
 * Supported input:
 * 1. Array
 *    [
 *      { label: 'Instagram', url: 'https://instagram.com/...' },
 *      { label: 'YouTube', url: 'https://youtube.com/...' }
 *    ]
 *
 * 2. Object
 *    {
 *      Instagram: 'https://instagram.com/...',
 *      YouTube: 'https://youtube.com/...'
 *    }
 *
 * Security:
 * - Only http/https URLs are rendered.
 * - javascript:, data:, file:, etc. are rejected.
 * - target="_blank" always uses noopener/noreferrer.
 *
 * UX:
 * - Mobile-first
 * - Keyboard accessible
 * - Premium compact cards
 * - No external icon dependency
 * - Graceful empty state
 */

const PLATFORM_META = {
  instagram: {
    label: 'Instagram',
    short: 'IG',
  },

  youtube: {
    label: 'YouTube',
    short: 'YT',
  },

  linkedin: {
    label: 'LinkedIn',
    short: 'in',
  },

  facebook: {
    label: 'Facebook',
    short: 'f',
  },

  twitter: {
    label: 'X',
    short: 'X',
  },

  x: {
    label: 'X',
    short: 'X',
  },

  github: {
    label: 'GitHub',
    short: 'GH',
  },

  threads: {
    label: 'Threads',
    short: '@',
  },

  telegram: {
    label: 'Telegram',
    short: 'TG',
  },

  whatsapp: {
    label: 'WhatsApp',
    short: 'WA',
  },

  pinterest: {
    label: 'Pinterest',
    short: 'P',
  },

  discord: {
    label: 'Discord',
    short: 'DS',
  },

  tiktok: {
    label: 'TikTok',
    short: 'TT',
  },

  website: {
    label: 'Website',
    short: '↗',
  },
};

function normalizeText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function isSafeHttpUrl(value) {
  if (typeof value !== 'string') {
    return false;
  }

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

function normalizePlatform(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[\s_-]+/g, '');
}

function detectPlatformFromUrl(url) {
  try {
    const hostname = new URL(url)
      .hostname
      .toLowerCase()
      .replace(/^www\./, '');

    if (hostname.includes('instagram.com')) {
      return 'instagram';
    }

    if (
      hostname.includes('youtube.com') ||
      hostname.includes('youtu.be')
    ) {
      return 'youtube';
    }

    if (
      hostname.includes('linkedin.com')
    ) {
      return 'linkedin';
    }

    if (
      hostname.includes('facebook.com') ||
      hostname.includes('fb.com')
    ) {
      return 'facebook';
    }

    if (
      hostname === 'x.com' ||
      hostname.includes('twitter.com')
    ) {
      return 'x';
    }

    if (hostname.includes('github.com')) {
      return 'github';
    }

    if (hostname.includes('threads.net')) {
      return 'threads';
    }

    if (hostname.includes('t.me')) {
      return 'telegram';
    }

    if (
      hostname.includes('whatsapp.com') ||
      hostname.includes('wa.me')
    ) {
      return 'whatsapp';
    }

    if (
      hostname.includes('pinterest.com')
    ) {
      return 'pinterest';
    }

    if (
      hostname.includes('discord.com') ||
      hostname.includes('discord.gg')
    ) {
      return 'discord';
    }

    if (hostname.includes('tiktok.com')) {
      return 'tiktok';
    }

    return 'website';
  } catch {
    return 'website';
  }
}

function normalizeLinks(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') {
          const url = normalizeText(item);

          return {
            label: '',
            url,
          };
        }

        if (
          item &&
          typeof item === 'object'
        ) {
          return {
            label: normalizeText(
              item.label ||
                item.platform ||
                item.name
            ),
            url: normalizeText(item.url),
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  if (
    typeof value === 'object'
  ) {
    return Object.entries(value)
      .map(([platform, url]) => ({
        label: normalizeText(platform),
        url: normalizeText(url),
      }));
  }

  return [];
}

function getDisplayLabel(
  label,
  url,
  platform
) {
  const cleanLabel = normalizeText(label);

  if (cleanLabel) {
    const normalized =
      normalizePlatform(cleanLabel);

    if (
      PLATFORM_META[normalized]
    ) {
      return PLATFORM_META[
        normalized
      ].label;
    }

    return cleanLabel;
  }

  const meta =
    PLATFORM_META[platform];

  return meta?.label || 'Website';
}

function getShortLabel(
  label,
  platform
) {
  const normalized =
    normalizePlatform(label);

  if (
    PLATFORM_META[normalized]
  ) {
    return PLATFORM_META[
      normalized
    ].short;
  }

  return (
    PLATFORM_META[platform]?.short ||
    '↗'
  );
}

function getHostname(url) {
  try {
    return new URL(url)
      .hostname
      .replace(/^www\./, '');
  } catch {
    return '';
  }
}

function ArrowIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 7H17V16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 5H19V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M10 14L19 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M19 14V18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18V6C5 5.44772 5.44772 5 6 5H10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SocialLinks({
  value,
  socialLinks,
  links,
  title = 'Social & Online',
  eyebrow = 'Connect',
  description = '',
  showHostname = true,
  compact = false,
  maxItems = 20,
  className = '',
}) {
  const normalizedValue =
    value ??
    socialLinks ??
    links ??
    [];

  const items = useMemo(() => {
    const normalized =
      normalizeLinks(
        normalizedValue
      );

    const seen = new Set();

    return normalized
      .filter(
        (item) =>
          item &&
          isSafeHttpUrl(item.url)
      )
      .map((item) => {
        const platform =
          normalizePlatform(
            item.label
          ) ||
          detectPlatformFromUrl(
            item.url
          );

        const label =
          getDisplayLabel(
            item.label,
            item.url,
            platform
          );

        const hostname =
          getHostname(item.url);

        return {
          ...item,
          platform,
          label,
          hostname,
        };
      })
      .filter((item) => {
        const key =
          item.url.toLowerCase();

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);

        return true;
      })
      .slice(
        0,
        Math.max(
          0,
          Number(maxItems) || 20
        )
      );
  }, [
    normalizedValue,
    maxItems,
  ]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={[
        'wd-social-links',
        compact
          ? 'wd-social-links--compact'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby="wd-social-links-title"
    >
      <style>{`
        .wd-social-links {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .wd-social-links__heading {
          margin: 0 0 18px;
        }

        .wd-social-links__eyebrow {
          margin: 0 0 7px;
          color: #059669;
          font-size: 11px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .wd-social-links__title {
          margin: 0;
          color: #0a0a0a;
          font-size: clamp(21px, 3vw, 30px);
          font-weight: 780;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .wd-social-links__description {
          max-width: 620px;
          margin: 9px 0 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.65;
        }

        .wd-social-links__grid {
          display: grid;
          grid-template-columns: repeat(
            1,
            minmax(0, 1fr)
          );
          gap: 10px;
        }

        .wd-social-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
          min-height: 68px;
          padding: 12px 13px;
          overflow: hidden;
          color: inherit;
          text-decoration: none;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fafafa 100%
            );
          border: 1px solid #e8e8e8;
          border-radius: 18px;
          box-shadow:
            0 1px 1px rgba(0,0,0,.02),
            0 7px 24px rgba(0,0,0,.025);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .wd-social-link::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              115deg,
              transparent 0%,
              rgba(16,185,129,.055) 48%,
              transparent 75%
            );
          opacity: 0;
          transition: opacity 180ms ease;
        }

        .wd-social-link:hover {
          transform: translateY(-2px);
          border-color: #d6d6d6;
          background: #fff;
          box-shadow:
            0 10px 30px rgba(0,0,0,.06),
            0 2px 5px rgba(0,0,0,.03);
        }

        .wd-social-link:hover::after {
          opacity: 1;
        }

        .wd-social-link:focus-visible {
          outline: none;
          border-color: #10b981;
          box-shadow:
            0 0 0 3px
              rgba(16,185,129,.14),
            0 10px 30px rgba(0,0,0,.06);
        }

        .wd-social-link__badge {
          position: relative;
          z-index: 1;
          display: grid;
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          place-items: center;
          color: #111827;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: -.02em;
          background: #f4f5f5;
          border: 1px solid #e7e7e7;
          border-radius: 13px;
        }

        .wd-social-link__content {
          position: relative;
          z-index: 1;
          min-width: 0;
          flex: 1;
        }

        .wd-social-link__label {
          display: block;
          overflow: hidden;
          color: #111;
          font-size: 14px;
          font-weight: 750;
          line-height: 1.25;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wd-social-link__hostname {
          display: block;
          margin-top: 4px;
          overflow: hidden;
          color: #8a8f98;
          font-size: 12px;
          line-height: 1.25;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wd-social-link__arrow {
          position: relative;
          z-index: 1;
          display: grid;
          flex: 0 0 32px;
          width: 32px;
          height: 32px;
          place-items: center;
          color: #73777d;
          border: 1px solid transparent;
          border-radius: 10px;
          transition:
            color 180ms ease,
            background 180ms ease,
            transform 180ms ease;
        }

        .wd-social-link:hover
          .wd-social-link__arrow {
          color: #059669;
          background: #ecfdf5;
          transform: translate(
            1px,
            -1px
          );
        }

        .wd-social-links--compact
          .wd-social-links__heading {
          margin-bottom: 12px;
        }

        .wd-social-links--compact
          .wd-social-links__grid {
          gap: 8px;
        }

        .wd-social-links--compact
          .wd-social-link {
          min-height: 58px;
          border-radius: 15px;
        }

        .wd-social-links--compact
          .wd-social-link__badge {
          flex-basis: 36px;
          width: 36px;
          height: 36px;
          border-radius: 11px;
          font-size: 11px;
        }

        .wd-social-links--compact
          .wd-social-link__label {
          font-size: 13px;
        }

        .wd-social-links--compact
          .wd-social-link__hostname {
          margin-top: 2px;
          font-size: 11px;
        }

        .wd-social-links--compact
          .wd-social-link__arrow {
          flex-basis: 28px;
          width: 28px;
          height: 28px;
        }

        @media (min-width: 620px) {
          .wd-social-links__grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }
        }

        @media (min-width: 980px) {
          .wd-social-links__grid {
            grid-template-columns:
              repeat(
                3,
                minmax(0, 1fr)
              );
          }
        }

        @media (max-width: 380px) {
          .wd-social-link {
            min-height: 62px;
            padding: 10px;
            gap: 10px;
            border-radius: 15px;
          }

          .wd-social-link__badge {
            flex-basis: 38px;
            width: 38px;
            height: 38px;
            border-radius: 11px;
          }

          .wd-social-link__arrow {
            flex-basis: 28px;
            width: 28px;
            height: 28px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wd-social-link,
          .wd-social-link::after,
          .wd-social-link__arrow {
            transition: none;
          }

          .wd-social-link:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="wd-social-links__heading">
        {eyebrow ? (
          <p className="wd-social-links__eyebrow">
            {eyebrow}
          </p>
        ) : null}

        {title ? (
          <h2
            id="wd-social-links-title"
            className="wd-social-links__title"
          >
            {title}
          </h2>
        ) : null}

        {description ? (
          <p className="wd-social-links__description">
            {description}
          </p>
        ) : null}
      </div>

      <div className="wd-social-links__grid">
        {items.map(
          (item, index) => {
            const shortLabel =
              getShortLabel(
                item.label,
                item.platform
              );

            return (
              <a
                key={`${item.url}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="wd-social-link"
                aria-label={`Open ${item.label}`}
              >
                <span
                  className="wd-social-link__badge"
                  aria-hidden="true"
                >
                  {shortLabel}
                </span>

                <span className="wd-social-link__content">
                  <span className="wd-social-link__label">
                    {item.label}
                  </span>

                  {showHostname &&
                  item.hostname ? (
                    <span className="wd-social-link__hostname">
                      {item.hostname}
                    </span>
                  ) : null}
                </span>

                <span
                  className="wd-social-link__arrow"
                  aria-hidden="true"
                >
                  <ArrowIcon />
                </span>
              </a>
            );
          }
        )}
      </div>
    </section>
  );
}