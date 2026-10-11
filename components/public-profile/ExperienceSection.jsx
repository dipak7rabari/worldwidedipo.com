import styles from './PublicProfile.module.css';

/* =========================================================
   TEXT SAFETY
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

/* =========================================================
   NORMALIZATION
========================================================= */

function normalizeExperience(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item) =>
      item &&
      typeof item === 'object' &&
      !Array.isArray(item)
  );
}

/* =========================================================
   FIELD HELPERS
========================================================= */

function getExperienceTitle(item) {
  return cleanText(
    item?.title ||
      item?.role ||
      item?.position ||
      item?.designation ||
      item?.job_title ||
      item?.jobTitle
  );
}

function getExperienceCompany(item) {
  return cleanText(
    item?.company ||
      item?.organization ||
      item?.company_name ||
      item?.companyName ||
      item?.employer ||
      item?.workplace
  );
}

function getExperiencePeriod(item) {
  return cleanText(
    item?.period ||
      item?.duration ||
      item?.date ||
      item?.dates ||
      item?.year ||
      item?.years
  );
}

function getExperienceLocation(item) {
  return cleanText(
    item?.location ||
      item?.city ||
      item?.place
  );
}

function getExperienceType(item) {
  return cleanText(
    item?.employment_type ||
      item?.employmentType ||
      item?.type ||
      item?.work_type ||
      item?.workType
  );
}

function getExperienceDescription(item) {
  return cleanText(
    item?.description ||
      item?.details ||
      item?.summary ||
      item?.about
  );
}

function getExperienceAchievements(item) {
  const value =
    item?.achievements ||
    item?.highlights ||
    item?.responsibilities ||
    item?.key_points ||
    item?.keyPoints;

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry === 'string') {
        return cleanText(entry);
      }

      if (
        entry &&
        typeof entry === 'object'
      ) {
        return cleanText(
          entry.text ||
            entry.title ||
            entry.description ||
            entry.label
        );
      }

      return '';
    })
    .filter(Boolean);
}

/* =========================================================
   DATE / CURRENT ROLE HELPERS
========================================================= */

function isCurrentExperience(item) {
  return Boolean(
    item?.current === true ||
      item?.is_current === true ||
      item?.isCurrent === true ||
      item?.present === true
  );
}

function getCurrentLabel(item) {
  if (!isCurrentExperience(item)) {
    return '';
  }

  return 'CURRENT';
}

/* =========================================================
   LOCATION / PERIOD PRESENTATION
========================================================= */

function buildMetaLine(item) {
  const period = getExperiencePeriod(item);
  const location = getExperienceLocation(item);
  const type = getExperienceType(item);

  return {
    period,
    location,
    type,
  };
}

/* =========================================================
   STABLE KEY
========================================================= */

function getExperienceKey(item, index) {
  const id = cleanText(item?.id);

  if (id) {
    return `experience-${id}`;
  }

  const title = getExperienceTitle(item);
  const company = getExperienceCompany(item);
  const period = getExperiencePeriod(item);

  return [
    'experience',
    title,
    company,
    period,
    index,
  ]
    .filter(Boolean)
    .join('-');
}

/* =========================================================
   EXPERIENCE ITEM
========================================================= */

function ExperienceItem({
  item,
  index,
}) {
  const title =
    getExperienceTitle(item);

  const company =
    getExperienceCompany(item);

  const description =
    getExperienceDescription(item);

  const achievements =
    getExperienceAchievements(item);

  const meta =
    buildMetaLine(item);

  const currentLabel =
    getCurrentLabel(item);

  const hasContent =
    title ||
    company ||
    meta.period ||
    meta.location ||
    meta.type ||
    description ||
    achievements.length;

  if (!hasContent) {
    return null;
  }

  return (
    <article
      className={styles.timelineItem}
      aria-label={
        title ||
        company ||
        `Experience ${index + 1}`
      }
    >
      <span
        className={styles.timelineDot}
        aria-hidden="true"
      />

      <div
        className={styles.timelineContent}
      >
        {/* -------------------------------------------------
            META
        ------------------------------------------------- */}

        {(meta.period ||
          meta.location ||
          meta.type ||
          currentLabel) && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '6px 9px',
            }}
          >
            {meta.period && (
              <span>
                {meta.period}
              </span>
            )}

            {meta.location && (
              <>
                {meta.period && (
                  <span
                    aria-hidden="true"
                  >
                    ·
                  </span>
                )}

                <span>
                  {meta.location}
                </span>
              </>
            )}

            {meta.type && (
              <>
                {(meta.period ||
                  meta.location) && (
                  <span
                    aria-hidden="true"
                  >
                    ·
                  </span>
                )}

                <span>
                  {meta.type}
                </span>
              </>
            )}

            {currentLabel && (
              <>
                {(meta.period ||
                  meta.location ||
                  meta.type) && (
                  <span
                    aria-hidden="true"
                  >
                    ·
                  </span>
                )}

                <span
                  style={{
                    color: '#087653',
                  }}
                >
                  {currentLabel}
                </span>
              </>
            )}
          </div>
        )}

        {/* -------------------------------------------------
            TITLE
        ------------------------------------------------- */}

        <h3>
          {title ||
            'Experience'}
        </h3>

        {/* -------------------------------------------------
            COMPANY
        ------------------------------------------------- */}

        {company && (
          <strong>
            {company}
          </strong>
        )}

        {/* -------------------------------------------------
            DESCRIPTION
        ------------------------------------------------- */}

        {description && (
          <p>
            {description}
          </p>
        )}

        {/* -------------------------------------------------
            ACHIEVEMENTS / RESPONSIBILITIES
        ------------------------------------------------- */}

        {achievements.length > 0 && (
          <ul
            aria-label="Experience highlights"
            style={{
              display: 'grid',
              gap: '7px',
              margin:
                '12px 0 0',
              padding: 0,
              listStyle: 'none',
            }}
          >
            {achievements.map(
              (achievement, achievementIndex) => (
                <li
                  key={`${getExperienceKey(
                    item,
                    index
                  )}-highlight-${achievementIndex}`}
                  style={{
                    display: 'flex',
                    alignItems:
                      'flex-start',
                    gap: '9px',
                    color: '#707782',
                    fontSize: '13px',
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '5px',
                      height: '5px',
                      flex: '0 0 5px',
                      marginTop: '8px',
                      borderRadius:
                        '50%',
                      background:
                        '#10b981',
                    }}
                  />

                  <span>
                    {achievement}
                  </span>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   PUBLIC COMPONENT
========================================================= */

export default function ExperienceSection({
  profile,
  experience,
  number = '07',
  label = 'EXPERIENCE',
  title = 'The work behind',
  emphasis = 'the identity.',
}) {
  const source =
    experience ??
    profile?.experience;

  const items =
    normalizeExperience(source);

  const validItems =
    items.filter((item) => {
      return Boolean(
        getExperienceTitle(item) ||
          getExperienceCompany(item) ||
          getExperiencePeriod(item) ||
          getExperienceLocation(item) ||
          getExperienceType(item) ||
          getExperienceDescription(item) ||
          getExperienceAchievements(item)
            .length
      );
    });

  if (!validItems.length) {
    return null;
  }

  return (
    <section
      className={styles.section}
      id="experience"
      aria-labelledby="experience-heading"
    >
      <div
        className={
          styles.sectionHeader
        }
      >
        <div>
          <span>
            {label}
          </span>

          <h2 id="experience-heading">
            {title}
            <br />
            {emphasis}
          </h2>
        </div>

        <span
          className={
            styles.sectionNumber
          }
          aria-hidden="true"
        >
          {number}
        </span>
      </div>

      <div
        className={styles.timeline}
        aria-label="Professional experience"
      >
        {validItems.map(
          (item, index) => (
            <ExperienceItem
              key={getExperienceKey(
                item,
                index
              )}
              item={item}
              index={index}
            />
          )
        )}
      </div>
    </section>
  );
}