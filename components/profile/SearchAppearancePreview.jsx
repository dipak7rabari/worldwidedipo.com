'use client';

import { useMemo } from 'react';

function cleanText(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  return value.replace(/\s+/g, ' ').trim();
}

function truncate(value, maxLength) {
  const text = cleanText(value);

  if (!text) return '';

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function normalizeSlug(value) {
  const slug = cleanText(value)
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '');

  return slug || 'your-slug';
}

function escapeDisplay(value) {
  return cleanText(value);
}

export default function SearchAppearancePreview({
  profile = {},
  form = {},
  className = '',
  compact = false,
}) {
  const source = useMemo(() => {
    /*
     * Supports both:
     *   <SearchAppearancePreview profile={profile} />
     * and
     *   <SearchAppearancePreview form={form} />
     *
     * This keeps the component reusable across profile creation,
     * editing and preview experiences.
     */
    return {
      name: escapeDisplay(
        profile?.name ?? form?.name
      ),

      profession: escapeDisplay(
        profile?.profession ?? form?.profession
      ),

      headline: escapeDisplay(
        profile?.headline ?? form?.headline
      ),

      bio: escapeDisplay(
        profile?.bio ?? form?.bio
      ),

      slug: normalizeSlug(
        profile?.slug ?? form?.slug
      ),
    };
  }, [profile, form]);

  const name =
    source.name || 'Your Name';

  const profession =
    source.profession;

  const description =
    truncate(
      source.bio ||
        source.headline ||
        'Personal Digital Identity Page on Worldwide DIPO.',
      160
    );

  const title =
    profession
      ? `${name} - ${profession} | Worldwide DIPO`
      : `${name} | Worldwide DIPO`;

  const displayUrl =
    `worldwidedipo.com/p/${source.slug}`;

  return (
    <section
      className={[
        'wd-search-preview',
        compact ? 'wd-search-preview--compact' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Search Appearance Simulation"
    >
      <style>{`
        .wd-search-preview {
          --sap-bg: #ffffff;
          --sap-surface: #f8faf9;
          --sap-border: rgba(15, 23, 42, 0.09);
          --sap-border-strong: rgba(15, 23, 42, 0.13);
          --sap-text: #111827;
          --sap-muted: #64748b;
          --sap-soft: #94a3b8;
          --sap-green: #059669;
          --sap-green-soft: rgba(5, 150, 105, 0.09);

          width: 100%;
          overflow: hidden;
          border: 1px solid var(--sap-border);
          border-radius: 24px;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fbfdfc 100%
            );
          box-shadow:
            0 1px 2px rgba(15, 23, 42, 0.02),
            0 12px 40px rgba(15, 23, 42, 0.055);
          color: var(--sap-text);
          -webkit-font-smoothing: antialiased;
        }

        .wd-search-preview *,
        .wd-search-preview *::before,
        .wd-search-preview *::after {
          box-sizing: border-box;
        }

        .wd-search-preview__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px;
          border-bottom: 1px solid var(--sap-border);
          background:
            linear-gradient(
              180deg,
              rgba(248, 250, 249, 0.9),
              rgba(255, 255, 255, 0.8)
            );
        }

        .wd-search-preview__heading {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .wd-search-preview__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(5, 150, 105, 0.14);
          border-radius: 10px;
          background: var(--sap-green-soft);
          color: var(--sap-green);
        }

        .wd-search-preview__heading-copy {
          min-width: 0;
        }

        .wd-search-preview__eyebrow {
          display: block;
          margin: 0 0 2px;
          color: var(--sap-muted);
          font-size: 10px;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .wd-search-preview__heading-title {
          display: block;
          overflow: hidden;
          color: var(--sap-text);
          font-size: 14px;
          font-weight: 750;
          line-height: 1.3;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wd-search-preview__badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          min-height: 28px;
          padding: 6px 10px;
          border: 1px solid rgba(5, 150, 105, 0.14);
          border-radius: 999px;
          background: rgba(5, 150, 105, 0.07);
          color: #047857;
          font-size: 10px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .wd-search-preview__body {
          padding: 20px;
        }

        .wd-search-preview__intro {
          margin: 0 0 14px;
          color: var(--sap-muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .wd-search-preview__result {
          position: relative;
          overflow: hidden;
          padding: 18px;
          border: 1px solid var(--sap-border);
          border-radius: 18px;
          background: #ffffff;
          box-shadow:
            0 1px 1px rgba(15, 23, 42, 0.015);
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            transform 180ms ease;
        }

        .wd-search-preview__result:hover {
          border-color: var(--sap-border-strong);
          box-shadow:
            0 10px 28px rgba(15, 23, 42, 0.055);
          transform: translateY(-1px);
        }

        .wd-search-preview__result::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background:
            linear-gradient(
              90deg,
              rgba(5, 150, 105, 0),
              rgba(5, 150, 105, 0.45),
              rgba(5, 150, 105, 0)
            );
        }

        .wd-search-preview__url {
          display: block;
          overflow: hidden;
          margin-bottom: 7px;
          color: #475569;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: 11px;
          line-height: 1.5;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wd-search-preview__title {
          margin: 0;
          color: #1a0dab;
          font-size: clamp(16px, 2vw, 19px);
          font-weight: 650;
          line-height: 1.35;
          letter-spacing: -0.015em;
          overflow-wrap: anywhere;
        }

        .wd-search-preview__description {
          display: -webkit-box;
          overflow: hidden;
          margin: 7px 0 0;
          color: #4b5563;
          font-size: 13px;
          line-height: 1.65;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        .wd-search-preview__footer {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 14px;
          padding: 11px 12px;
          border: 1px solid rgba(15, 23, 42, 0.065);
          border-radius: 13px;
          background: var(--sap-surface);
        }

        .wd-search-preview__footer-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          width: 20px;
          height: 20px;
          margin-top: 1px;
          color: var(--sap-muted);
        }

        .wd-search-preview__footer-text {
          margin: 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.6;
        }

        .wd-search-preview__footer-text strong {
          color: #475569;
          font-weight: 700;
        }

        .wd-search-preview--compact {
          border-radius: 18px;
        }

        .wd-search-preview--compact
        .wd-search-preview__top {
          padding: 14px 16px;
        }

        .wd-search-preview--compact
        .wd-search-preview__body {
          padding: 16px;
        }

        .wd-search-preview--compact
        .wd-search-preview__result {
          padding: 15px;
          border-radius: 15px;
        }

        .wd-search-preview--compact
        .wd-search-preview__footer {
          display: none;
        }

        @media (max-width: 520px) {
          .wd-search-preview {
            border-radius: 20px;
          }

          .wd-search-preview__top {
            align-items: flex-start;
            padding: 15px;
          }

          .wd-search-preview__heading {
            gap: 9px;
          }

          .wd-search-preview__icon {
            width: 32px;
            height: 32px;
            border-radius: 9px;
          }

          .wd-search-preview__heading-title {
            font-size: 13px;
          }

          .wd-search-preview__badge {
            padding: 6px 8px;
            font-size: 9px;
          }

          .wd-search-preview__body {
            padding: 15px;
          }

          .wd-search-preview__intro {
            font-size: 12px;
          }

          .wd-search-preview__result {
            padding: 15px;
            border-radius: 16px;
          }

          .wd-search-preview__title {
            font-size: 16px;
          }

          .wd-search-preview__description {
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wd-search-preview__result {
            transition: none;
          }

          .wd-search-preview__result:hover {
            transform: none;
          }
        }
      `}</style>

      <header className="wd-search-preview__top">
        <div className="wd-search-preview__heading">
          <span
            className="wd-search-preview__icon"
            aria-hidden="true"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="11"
                cy="11"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.9"
              />
              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className="wd-search-preview__heading-copy">
            <span className="wd-search-preview__eyebrow">
              Search appearance
            </span>

            <span className="wd-search-preview__heading-title">
              How your DIPO may appear
            </span>
          </span>
        </div>

        <span className="wd-search-preview__badge">
          Preview
        </span>
      </header>

      <div className="wd-search-preview__body">
        <p className="wd-search-preview__intro">
          Aapki digital identity search results mein
          roughly kuch is tarah appear ho sakti hai.
        </p>

        <article className="wd-search-preview__result">
          <div className="wd-search-preview__url">
            {displayUrl}
          </div>

          <h3 className="wd-search-preview__title">
            {title}
          </h3>

          <p className="wd-search-preview__description">
            {description}
          </p>
        </article>

        {!compact && (
          <div className="wd-search-preview__footer">
            <span
              className="wd-search-preview__footer-icon"
              aria-hidden="true"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M12 10.5V16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="7.2"
                  r="1"
                  fill="currentColor"
                />
              </svg>
            </span>

            <p className="wd-search-preview__footer-text">
              <strong>Simulation only.</strong>{' '}
              Search-engine crawling, indexing and
              search appearance are controlled by
              search engines and are not guaranteed.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}