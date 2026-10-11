import Link from 'next/link';

import styles from './PublicProfile.module.css';

/* =========================================================
   SERVICES SECTION
   Worldwide DIPO — Public Profile

   Responsibilities:
   - Safely normalize public service data
   - Render premium service cards
   - Support multiple service data shapes
   - Never trust/render raw HTML
   - Never expose owner/admin controls
   - Work with the existing PublicProfile CSS system
========================================================= */


/* =========================================================
   HELPERS
========================================================= */

function cleanText(value) {
  if (
    typeof value !== 'string' &&
    typeof value !== 'number'
  ) {
    return '';
  }

  return String(value)
    .replace(/\u0000/g, '')
    .trim();
}


function isHttpUrl(value) {
  if (
    typeof value !== 'string' ||
    !value.trim()
  ) {
    return false;
  }

  try {
    const url = new URL(
      value.trim()
    );

    return (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    );
  } catch {
    return false;
  }
}


function safeUrl(value) {
  const url = cleanText(value);

  return isHttpUrl(url)
    ? url
    : '';
}


function firstNonEmpty(...values) {
  for (const value of values) {
    const result =
      cleanText(value);

    if (result) {
      return result;
    }
  }

  return '';
}


/* =========================================================
   NORMALIZE SERVICE DATA

   Supported examples:

   [
     "Web Design",
     "SEO"
   ]

   [
     {
       title: "Web Design",
       description: "...",
       price: "₹5,000",
       duration: "7 days",
       url: "https://..."
     }
   ]

   {
     "Web Design": "description",
     "SEO": "description"
   }

   Also supports common alternate field names.
========================================================= */

function normalizeServices(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return [];
  }


  /* -------------------------------------------------------
     ARRAY
  ------------------------------------------------------- */

  if (Array.isArray(value)) {
    return value
      .map(
        (item, index) =>
          normalizeServiceItem(
            item,
            index
          )
      )
      .filter(Boolean);
  }


  /* -------------------------------------------------------
     OBJECT
  ------------------------------------------------------- */

  if (
    typeof value === 'object'
  ) {
    return Object.entries(value)
      .map(
        ([key, item], index) =>
          normalizeObjectService(
            key,
            item,
            index
          )
      )
      .filter(Boolean);
  }


  /* -------------------------------------------------------
     SINGLE STRING
  ------------------------------------------------------- */

  if (
    typeof value === 'string'
  ) {
    const text =
      cleanText(value);

    if (!text) {
      return [];
    }

    /*
     * If someone stored:
     * "Web Design, SEO, Branding"
     *
     * render them as individual services.
     */
    const parts =
      text
        .split(/\r?\n|,/)
        .map(cleanText)
        .filter(Boolean);

    if (parts.length > 1) {
      return parts.map(
        (item, index) => ({
          id:
            `service-${index + 1}`,
          title: item,
          description: '',
          price: '',
          duration: '',
          url: '',
          ctaLabel: '',
        })
      );
    }

    return [
      {
        id: 'service-1',
        title: text,
        description: '',
        price: '',
        duration: '',
        url: '',
        ctaLabel: '',
      },
    ];
  }


  return [];
}


/* =========================================================
   ARRAY ITEM NORMALIZER
========================================================= */

function normalizeServiceItem(
  item,
  index
) {
  /* -------------------------------------------------------
     STRING ITEM
  ------------------------------------------------------- */

  if (
    typeof item === 'string'
  ) {
    const title =
      cleanText(item);

    if (!title) {
      return null;
    }

    return {
      id:
        `service-${index + 1}`,
      title,
      description: '',
      price: '',
      duration: '',
      url: '',
      ctaLabel: '',
    };
  }


  /* -------------------------------------------------------
     OBJECT ITEM
  ------------------------------------------------------- */

  if (
    !item ||
    typeof item !== 'object' ||
    Array.isArray(item)
  ) {
    return null;
  }


  const title =
    firstNonEmpty(
      item.title,
      item.name,
      item.service,
      item.label,
      item.heading
    );


  if (!title) {
    return null;
  }


  const description =
    firstNonEmpty(
      item.description,
      item.details,
      item.summary,
      item.about,
      item.subtitle,
      item.caption
    );


  const price =
    firstNonEmpty(
      item.price,
      item.amount,
      item.cost,
      item.rate
    );


  const duration =
    firstNonEmpty(
      item.duration,
      item.time,
      item.timeline,
      item.delivery,
      item.period
    );


  const url =
    safeUrl(
      firstNonEmpty(
        item.url,
        item.link,
        item.href,
        item.website
      )
    );


  const ctaLabel =
    firstNonEmpty(
      item.ctaLabel,
      item.buttonLabel,
      item.actionLabel,
      item.cta
    );


  return {
    id:
      cleanText(
        item.id
      ) ||
      cleanText(
        item.slug
      ) ||
      `${title}-${index + 1}`,

    title,

    description,

    price,

    duration,

    url,

    ctaLabel,
  };
}


/* =========================================================
   OBJECT MAP NORMALIZER

   Example:

   {
     "Web Design": {
       description: "Modern websites"
     },

     "SEO": "Search optimization"
   }

   or:

   {
     "Web Design": "Modern websites",
     "SEO": "Search optimization"
   }
========================================================= */

function normalizeObjectService(
  key,
  value,
  index
) {
  const fallbackTitle =
    cleanText(key);

  if (!fallbackTitle) {
    return null;
  }


  /* -------------------------------------------------------
     SIMPLE VALUE
  ------------------------------------------------------- */

  if (
    typeof value === 'string' ||
    typeof value === 'number'
  ) {
    const text =
      cleanText(value);

    /*
     * If object value is actually a URL,
     * treat it as the service URL.
     */
    if (
      isHttpUrl(text)
    ) {
      return {
        id:
          `service-${index + 1}`,
        title:
          fallbackTitle,
        description: '',
        price: '',
        duration: '',
        url: text,
        ctaLabel: '',
      };
    }


    return {
      id:
        `service-${index + 1}`,
      title:
        fallbackTitle,
      description:
        text,
      price: '',
      duration: '',
      url: '',
      ctaLabel: '',
    };
  }


  /* -------------------------------------------------------
     OBJECT VALUE
  ------------------------------------------------------- */

  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value)
  ) {
    const normalized =
      normalizeServiceItem(
        {
          ...value,
          title:
            firstNonEmpty(
              value.title,
              value.name,
              fallbackTitle
            ),
        },
        index
      );

    if (normalized) {
      return normalized;
    }
  }


  return {
    id:
      `service-${index + 1}`,
    title:
      fallbackTitle,
    description: '',
    price: '',
    duration: '',
    url: '',
    ctaLabel: '',
  };
}


/* =========================================================
   ICONS
========================================================= */

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.icon}
    >
      <path
        d="M5 12h13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="m13 6 6 6-6 6"
        fill="none"
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
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.icon}
    >
      <path
        d="M14 5h5v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="m19 5-8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.icon}
    >
      <path
        d="m12 2 1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ServicesSection({
  services,
  title = 'Services',
  eyebrow = 'WHAT I OFFER',
  description = '',
}) {
  const normalized =
    normalizeServices(
      services
    );


  /* -------------------------------------------------------
     IMPORTANT:
     Don't render an empty section.
  ------------------------------------------------------- */

  if (
    normalized.length === 0
  ) {
    return null;
  }


  /*
   * Keep the public profile visually balanced.
   * There is no artificial maximum here; the CSS grid
   * determines the layout.
   */
  const visibleServices =
    normalized.slice(
      0,
      24
    );


  return (
    <section
      className={styles.section}
      aria-labelledby="dipo-services-title"
    >
      <div className={styles.sectionHeader}>

        <div>
          <span>
            {eyebrow}
          </span>

          <h2
            id="dipo-services-title"
          >
            {cleanText(title) ||
              'Services'}
          </h2>

          {cleanText(
            description
          ) && (
            <p
              style={{
                maxWidth:
                  620,
                marginTop:
                  14,
                color:
                  '#737a84',
                fontSize:
                  14,
                lineHeight:
                  1.7,
              }}
            >
              {cleanText(
                description
              )}
            </p>
          )}
        </div>

        <span
          className={
            styles.sectionNumber
          }
          aria-hidden="true"
        >
          {String(
            visibleServices.length
          ).padStart(2, '0')}
        </span>
      </div>


      <div
        className={
          styles.serviceGrid
        }
      >
        {visibleServices.map(
          (
            service,
            index
          ) => {
            const hasUrl =
              Boolean(
                service.url
              );

            const label =
              service.ctaLabel ||
              (
                hasUrl
                  ? 'Explore service'
                  : ''
              );


            return (
              <article
                key={
                  service.id
                }
                className={
                  styles.serviceCard
                }
              >
                {/* -----------------------------------------
                    SERVICE NUMBER
                ------------------------------------------ */}

                <span
                  aria-hidden="true"
                >
                  {String(
                    index + 1
                  ).padStart(
                    2,
                    '0'
                  )}
                </span>


                {/* -----------------------------------------
                    SERVICE CONTENT
                ------------------------------------------ */}

                <div
                  style={{
                    paddingRight:
                      28,
                  }}
                >
                  <h3>
                    {
                      service.title
                    }
                  </h3>


                  {service.description && (
                    <p
                      style={{
                        maxWidth:
                          560,
                        margin:
                          '13px 0 0',
                        color:
                          '#737a84',
                        fontSize:
                          12,
                        lineHeight:
                          1.65,
                      }}
                    >
                      {
                        service.description
                      }
                    </p>
                  )}


                  {/* ---------------------------------------
                      META
                  ---------------------------------------- */}

                  {(
                    service.price ||
                    service.duration
                  ) && (
                    <div
                      style={{
                        display:
                          'flex',
                        flexWrap:
                          'wrap',
                        alignItems:
                          'center',
                        gap:
                          7,
                        marginTop:
                          15,
                      }}
                    >
                      {service.price && (
                        <span
                          style={{
                            display:
                              'inline-flex',
                            alignItems:
                              'center',
                            minHeight:
                              26,
                            padding:
                              '0 9px',
                            border:
                              '1px solid #e4e8eb',
                            borderRadius:
                              999,
                            background:
                              '#f8fafb',
                            color:
                              '#20242a',
                            fontSize:
                              9,
                            fontWeight:
                              850,
                          }}
                        >
                          {
                            service.price
                          }
                        </span>
                      )}

                      {service.duration && (
                        <span
                          style={{
                            display:
                              'inline-flex',
                            alignItems:
                              'center',
                            minHeight:
                              26,
                            padding:
                              '0 9px',
                            border:
                              '1px solid #e4e8eb',
                            borderRadius:
                              999,
                            background:
                              '#f8fafb',
                            color:
                              '#737a84',
                            fontSize:
                              9,
                            fontWeight:
                              750,
                          }}
                        >
                          {
                            service.duration
                          }
                        </span>
                      )}
                    </div>
                  )}


                  {/* ---------------------------------------
                      SAFE EXTERNAL CTA
                  ---------------------------------------- */}

                  {hasUrl && (
                    <div
                      style={{
                        marginTop:
                          16,
                      }}
                    >
                      <Link
                        href={
                          service.url
                        }
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label={`${label}: ${service.title}`}
                        style={{
                          display:
                            'inline-flex',
                          alignItems:
                            'center',
                          gap:
                            7,
                          minHeight:
                            34,
                          padding:
                            '0 11px',
                          border:
                            '1px solid #dfe5e1',
                          borderRadius:
                            10,
                          background:
                            '#fff',
                          color:
                            '#20242a',
                          textDecoration:
                            'none',
                          fontSize:
                            10,
                          fontWeight:
                            850,
                        }}
                      >
                        <span>
                          {
                            label
                          }
                        </span>

                        <ExternalIcon />
                      </Link>
                    </div>
                  )}
                </div>


                {/* -----------------------------------------
                    DECORATIVE ICON
                ------------------------------------------ */}

                <span
                  className={
                    styles.icon
                  }
                  aria-hidden="true"
                >
                  <SparkIcon />
                </span>
              </article>
            );
          }
        )}
      </div>


      {/* ===================================================
          MORE THAN 24 SERVICES
      ==================================================== */}

      {normalized.length >
        visibleServices.length && (
        <p
          style={{
            margin:
              '18px 0 0',
            color:
              '#8a919b',
            fontSize:
              11,
            lineHeight:
              1.6,
          }}
        >
          Showing{' '}
          {
            visibleServices.length
          }{' '}
          featured services.
        </p>
      )}
    </section>
  );
}