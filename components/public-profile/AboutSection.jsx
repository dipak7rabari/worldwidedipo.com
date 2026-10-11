import styles from './PublicProfile.module.css';

function cleanText(value) {
  return typeof value === 'string'
    ? value.replace(/\u0000/g, '').trim()
    : '';
}

function getAboutContent(profile, about, bio) {
  const explicitAbout = cleanText(about);
  const profileAbout = cleanText(profile?.about);
  const profileBio = cleanText(profile?.bio);
  const explicitBio = cleanText(bio);

  return {
    about: explicitAbout || profileAbout,
    bio: explicitBio || profileBio,
  };
}

function getWordCount(text) {
  if (!text) {
    return 0;
  }

  return text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;
}

function getReadTime(wordCount) {
  if (!wordCount) {
    return 0;
  }

  return Math.max(1, Math.ceil(wordCount / 180));
}

function splitParagraphs(text) {
  if (!text) {
    return [];
  }

  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function AboutSection({
  profile,
  about,
  bio,
  number = '03',
  title = 'More than a profile.',
  emphasis = 'A story worth knowing.',
  label = 'ABOUT',
}) {
  const content = getAboutContent(
    profile,
    about,
    bio
  );

  const primaryContent =
    content.about || content.bio;

  if (!primaryContent) {
    return null;
  }

  const paragraphs =
    splitParagraphs(primaryContent);

  const wordCount =
    getWordCount(primaryContent);

  const readTime =
    getReadTime(wordCount);

  const isUsingBioFallback =
    !content.about && Boolean(content.bio);

  return (
    <section
      className={styles.editorialSection}
      id="about"
      aria-labelledby="about-heading"
    >
      <div
        className={styles.editorialLabel}
        aria-hidden="true"
      >
        <span>{number}</span>
        <span>{label}</span>
      </div>

      <div className={styles.editorialContent}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <h2 id="about-heading">
            {title}
            <br />
            <em>{emphasis}</em>
          </h2>

          {wordCount > 0 && (
            <div
              aria-label={`${wordCount} words, approximately ${readTime} minute read`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
                padding: '8px 11px',
                border: '1px solid #e7e9ec',
                borderRadius: '999px',
                background: '#fafbfb',
                color: '#858c96',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow:
                    '0 0 0 4px rgba(16,185,129,0.10)',
                }}
              />

              {readTime} min read
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: '35px',
            maxWidth: '760px',
          }}
        >
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p
                key={`about-paragraph-${index}`}
                style={{
                  margin:
                    index === 0
                      ? 0
                      : '22px 0 0',
                }}
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p>{primaryContent}</p>
          )}
        </div>

        {isUsingBioFallback && (
          <div
            role="note"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
              padding: '8px 11px',
              borderRadius: '10px',
              background: '#f6f8f7',
              color: '#858c96',
              fontSize: '11px',
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                width: '18px',
                height: '18px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: '#e9f8f1',
                color: '#059669',
                fontSize: '10px',
                fontWeight: 900,
              }}
            >
              i
            </span>

            About information is currently
            represented from the profile bio.
          </div>
        )}
      </div>
    </section>
  );
}