import styles from './PublicProfile.module.css';

function cleanText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/\u0000/g, '')
    .trim();
}

function normalizeEducation(value) {
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

function getEducationTitle(item) {
  return cleanText(
    item?.degree ||
      item?.title ||
      item?.course ||
      item?.qualification ||
      item?.program ||
      item?.field
  );
}

function getEducationInstitution(item) {
  return cleanText(
    item?.institution ||
      item?.school ||
      item?.college ||
      item?.university ||
      item?.organization ||
      item?.academy
  );
}

function getEducationPeriod(item) {
  return cleanText(
    item?.period ||
      item?.duration ||
      item?.year ||
      item?.years ||
      item?.date ||
      item?.dates
  );
}

function getEducationLocation(item) {
  return cleanText(
    item?.location ||
      item?.city ||
      item?.place
  );
}

function getEducationDescription(item) {
  return cleanText(
    item?.description ||
      item?.details ||
      item?.summary
  );
}

function getEducationGrade(item) {
  return cleanText(
    item?.grade ||
      item?.score ||
      item?.cgpa ||
      item?.percentage
  );
}

function getEducationKey(item, index) {
  const id = cleanText(item?.id);

  if (id) {
    return `education-${id}`;
  }

  const title = getEducationTitle(item);
  const institution = getEducationInstitution(item);
  const period = getEducationPeriod(item);

  return [
    'education',
    title,
    institution,
    period,
    index,
  ]
    .filter(Boolean)
    .join('-');
}

function EducationMark({ index }) {
  return (
    <span
      aria-hidden="true"
      className={styles.educationIndex}
    >
      {String(index + 1).padStart(2, '0')}
    </span>
  );
}

function EducationCard({ item, index }) {
  const title = getEducationTitle(item);
  const institution =
    getEducationInstitution(item);
  const period =
    getEducationPeriod(item);
  const location =
    getEducationLocation(item);
  const description =
    getEducationDescription(item);
  const grade =
    getEducationGrade(item);

  if (
    !title &&
    !institution &&
    !period &&
    !location &&
    !description &&
    !grade
  ) {
    return null;
  }

  return (
    <article
      className={styles.educationCard}
      aria-label={
        title ||
        institution ||
        `Education ${index + 1}`
      }
    >
      <EducationMark index={index} />

      <h3>
        {title || 'Education'}
      </h3>

      {institution && (
        <p>
          {institution}
        </p>
      )}

      {(period ||
        location ||
        grade) && (
        <small>
          {period && (
            <span>{period}</span>
          )}

          {period && location && (
            <span aria-hidden="true">
              {' '}
              ·{' '}
            </span>
          )}

          {location && (
            <span>{location}</span>
          )}

          {(period || location) &&
            grade && (
              <span aria-hidden="true">
                {' '}
                ·{' '}
              </span>
            )}

          {grade && (
            <span>{grade}</span>
          )}
        </small>
      )}

      {description && (
        <p
          style={{
            gridColumn: '2',
            marginTop: '9px',
            lineHeight: 1.65,
            color: '#6f7680',
          }}
        >
          {description}
        </p>
      )}
    </article>
  );
}

export default function EducationSection({
  profile,
  education,
  number = '08',
  label = 'EDUCATION',
  title = 'Learning is part',
  emphasis = 'of the identity.',
}) {
  const source =
    education ??
    profile?.education;

  const items =
    normalizeEducation(source);

  const validItems = items.filter(
    (item) =>
      getEducationTitle(item) ||
      getEducationInstitution(item) ||
      getEducationPeriod(item) ||
      getEducationLocation(item) ||
      getEducationDescription(item) ||
      getEducationGrade(item)
  );

  if (!validItems.length) {
    return null;
  }

  return (
    <section
      className={styles.educationSection}
      id="education"
      aria-labelledby="education-heading"
    >
      <div>
        <span>
          {number} / {label}
        </span>

        <h2 id="education-heading">
          {title}
          <br />
          {emphasis}
        </h2>
      </div>

      <div
        className={styles.educationGrid}
        aria-label="Education history"
      >
        {validItems.map(
          (item, index) => (
            <EducationCard
              key={getEducationKey(
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