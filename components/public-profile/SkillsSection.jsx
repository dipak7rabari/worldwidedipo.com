/*
 * ============================================================
 * WORLDWIDE DIPO
 * Public Profile — Skills Section
 * ============================================================
 *
 * Purpose:
 * Premium, responsive and defensive rendering of a user's
 * public skills / expertise on their DIPO profile.
 *
 * Supported input:
 *
 *   skills={[
 *     "Web Design",
 *     "React",
 *     "UI/UX Design"
 *   ]}
 *
 * Also supports:
 *
 *   skills={[
 *     { name: "React" },
 *     { title: "Web Design" },
 *     { skill: "UI/UX Design" },
 *     { label: "Brand Strategy" }
 *   ]}
 *
 * Optional object metadata:
 *
 *   {
 *     name: "React",
 *     level: "Advanced",
 *     category: "Development",
 *     years: "4 years"
 *   }
 *
 * Security:
 * - No dangerouslySetInnerHTML
 * - No external HTML rendering
 * - No client-side authorization assumptions
 * - Defensive data normalization
 * - Invalid values are ignored
 * - Duplicate skills are removed
 * - Extremely long strings are bounded
 *
 * Architecture:
 * - Server-component compatible
 * - No external icon dependency
 * - No styled-jsx
 * - No browser-only APIs
 * - No additional package required
 * ============================================================
 */

const MAX_SKILLS = 40;
const MAX_SKILL_LENGTH = 80;
const MAX_META_LENGTH = 40;


/*
 * ============================================================
 * TEXT HELPERS
 * ============================================================
 */

function cleanText(value, maxLength = MAX_SKILL_LENGTH) {
  if (
    typeof value !== 'string'
  ) {
    return '';
  }

  return value
    .replace(/\u0000/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}


/*
 * ============================================================
 * SAFE SKILL LABEL
 * ============================================================
 */

function getSkillLabel(item) {
  if (
    typeof item === 'string'
  ) {
    return cleanText(item);
  }

  if (
    !item ||
    typeof item !== 'object' ||
    Array.isArray(item)
  ) {
    return '';
  }

  return cleanText(
    item.name ||
      item.title ||
      item.skill ||
      item.label ||
      item.value
  );
}


/*
 * ============================================================
 * SAFE SKILL METADATA
 * ============================================================
 */

function getSkillLevel(item) {
  if (
    !item ||
    typeof item !== 'object' ||
    Array.isArray(item)
  ) {
    return '';
  }

  return cleanText(
    item.level ||
      item.proficiency ||
      item.expertise,
    MAX_META_LENGTH
  );
}


function getSkillCategory(item) {
  if (
    !item ||
    typeof item !== 'object' ||
    Array.isArray(item)
  ) {
    return '';
  }

  return cleanText(
    item.category ||
      item.type ||
      item.group,
    MAX_META_LENGTH
  );
}


function getSkillYears(item) {
  if (
    !item ||
    typeof item !== 'object' ||
    Array.isArray(item)
  ) {
    return '';
  }

  return cleanText(
    item.years ||
      item.experience ||
      item.duration,
    MAX_META_LENGTH
  );
}


/*
 * ============================================================
 * NORMALIZE SKILLS
 * ============================================================
 *
 * Keeps the component compatible with the current DIPO
 * profile editor and also future structured skill data.
 * ============================================================
 */

function normalizeSkills(value) {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  const seen = new Set();
  const result = [];

  for (
    const item of value
  ) {
    const label =
      getSkillLabel(item);

    if (!label) {
      continue;
    }

    /*
     * Case-insensitive duplicate prevention.
     *
     * Example:
     * "React"
     * "react"
     *
     * Only one will be displayed.
     */
    const identity =
      label
        .toLocaleLowerCase()
        .trim();

    if (
      seen.has(identity)
    ) {
      continue;
    }

    seen.add(identity);

    result.push({
      label,
      level:
        getSkillLevel(item),
      category:
        getSkillCategory(item),
      years:
        getSkillYears(item),
    });

    if (
      result.length >=
      MAX_SKILLS
    ) {
      break;
    }
  }

  return result;
}


/*
 * ============================================================
 * ICONS
 * ============================================================
 */

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2.8 13.8 9l5.4 2.2-5.4 2.2L12 19.6l-1.8-6.2-5.4-2.2L10.2 9 12 2.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="m19.2 16.2.7 2.1 1.9.8-1.9.8-.7 2.1-.7-2.1-1.9-.8 1.9-.8.7-2.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m5 12 4 4L19 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


/*
 * ============================================================
 * SKILL CARD
 * ============================================================
 */

function SkillCard({
  skill,
  index,
}) {
  const number =
    String(index + 1)
      .padStart(2, '0');

  return (
    <article
      className="dipo-skills-card"
      data-index={number}
    >
      <div className="dipo-skills-card-top">

        <span
          className="dipo-skills-card-number"
          aria-hidden="true"
        >
          {number}
        </span>

        <span
          className="dipo-skills-card-icon"
          aria-hidden="true"
        >
          <CheckIcon />
        </span>
      </div>


      <div className="dipo-skills-card-body">

        <h3>
          {skill.label}
        </h3>

        {skill.category && (
          <span className="dipo-skills-card-category">
            {skill.category}
          </span>
        )}

      </div>


      {(skill.level ||
        skill.years) && (
        <div className="dipo-skills-card-meta">

          {skill.level && (
            <span>
              {skill.level}
            </span>
          )}

          {skill.level &&
            skill.years && (
              <i aria-hidden="true" />
            )}

          {skill.years && (
            <span>
              {skill.years}
            </span>
          )}

        </div>
      )}


      <span
        className="dipo-skills-card-arrow"
        aria-hidden="true"
      >
        <ArrowIcon />
      </span>
    </article>
  );
}


/*
 * ============================================================
 * MAIN COMPONENT
 * ============================================================
 */

export default function SkillsSection({
  skills = [],
  title = 'What they bring to the table.',
  eyebrow = 'SKILLS & EXPERTISE',
  description = '',
  sectionNumber = '06',
}) {
  const normalizedSkills =
    normalizeSkills(
      skills
    );

  /*
   * Do not render an empty section.
   *
   * This keeps public profiles clean when a user has not
   * added skills yet.
   */
  if (
    normalizedSkills.length === 0
  ) {
    return null;
  }

  const safeTitle =
    cleanText(
      title,
      160
    ) ||
    'What they bring to the table.';

  const safeEyebrow =
    cleanText(
      eyebrow,
      80
    ) ||
    'SKILLS & EXPERTISE';

  const safeDescription =
    cleanText(
      description,
      240
    );

  const safeSectionNumber =
    cleanText(
      sectionNumber,
      4
    ) ||
    '06';

  const skillCount =
    normalizedSkills.length;

  return (
    <section
      className="dipo-public-skills"
      id="skills"
      aria-labelledby="dipo-public-skills-title"
    >

      {/* ====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="dipo-public-skills-bg"
        aria-hidden="true"
      >
        <span className="dipo-public-skills-orb dipo-public-skills-orb-one" />
        <span className="dipo-public-skills-orb dipo-public-skills-orb-two" />
        <span className="dipo-public-skills-grid" />
      </div>


      {/* ====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="dipo-public-skills-header">

        <div className="dipo-public-skills-index">
          <span>
            {safeSectionNumber}
          </span>

          <i aria-hidden="true" />
        </div>


        <div className="dipo-public-skills-heading">

          <div className="dipo-public-skills-eyebrow">

            <span
              className="dipo-public-skills-eyebrow-icon"
              aria-hidden="true"
            >
              <SparkIcon />
            </span>

            <span>
              {safeEyebrow}
            </span>

          </div>


          <h2
            id="dipo-public-skills-title"
          >
            {safeTitle}
          </h2>


          {safeDescription && (
            <p>
              {safeDescription}
            </p>
          )}

        </div>


        <div
          className="dipo-public-skills-count"
          aria-label={`${skillCount} skills listed`}
        >
          <strong>
            {String(skillCount)
              .padStart(2, '0')}
          </strong>

          <span>
            {skillCount === 1
              ? 'SKILL'
              : 'SKILLS'}
          </span>
        </div>

      </div>


      {/* ====================================================
          SKILL GRID
      ===================================================== */}

      <div
        className="dipo-public-skills-list"
        role="list"
        aria-label="Skills and expertise"
      >

        {normalizedSkills.map(
          (skill, index) => (
            <div
              key={`${skill.label}-${index}`}
              role="listitem"
            >
              <SkillCard
                skill={skill}
                index={index}
              />
            </div>
          )
        )}

      </div>


      {/* ====================================================
          BOTTOM IDENTITY STRIP
      ===================================================== */}

      <div className="dipo-public-skills-footer">

        <div className="dipo-public-skills-footer-line">
          <span />
          <i aria-hidden="true" />
          <span />
        </div>


        <div className="dipo-public-skills-footer-copy">

          <span>
            <CheckIcon />
          </span>

          <p>
            Skills are part of this
            public DIPO identity.
          </p>

        </div>


        <div
          className="dipo-public-skills-footer-label"
          aria-hidden="true"
        >
          WORLDWIDE DIPO
        </div>

      </div>


      {/* ====================================================
          COMPONENT STYLES
          ====================================================
          
          Kept inside this file so the component is completely
          portable and does not require another stylesheet.
      ===================================================== */}

      <style>{`
        .dipo-public-skills {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          width: 100%;
          margin: 0;
          padding:
            clamp(42px, 6vw, 88px)
            clamp(16px, 4vw, 42px);
          border-top: 1px solid rgba(15, 23, 42, .07);
          border-bottom: 1px solid rgba(15, 23, 42, .07);
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fbfcfd 52%,
              #f8fafb 100%
            );
          color: #0b1220;
        }

        .dipo-public-skills *,
        .dipo-public-skills *::before,
        .dipo-public-skills *::after {
          box-sizing: border-box;
        }

        .dipo-public-skills-bg {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
        }

        .dipo-public-skills-grid {
          position: absolute;
          inset: 0;
          opacity: .34;
          background-image:
            linear-gradient(
              rgba(15,23,42,.028) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(15,23,42,.028) 1px,
              transparent 1px
            );
          background-size:
            42px 42px;
          mask-image:
            linear-gradient(
              to bottom,
              transparent,
              black 18%,
              black 82%,
              transparent
            );
          -webkit-mask-image:
            linear-gradient(
              to bottom,
              transparent,
              black 18%,
              black 82%,
              transparent
            );
        }

        .dipo-public-skills-orb {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          filter: blur(70px);
          opacity: .28;
        }

        .dipo-public-skills-orb-one {
          top: -170px;
          right: -70px;
          background: rgba(16,185,129,.14);
        }

        .dipo-public-skills-orb-two {
          bottom: -190px;
          left: -90px;
          background: rgba(59,130,246,.08);
        }

        .dipo-public-skills-header {
          position: relative;
          width: min(100%, 1180px);
          margin: 0 auto;
          display: grid;
          grid-template-columns:
            auto
            minmax(0, 1fr)
            auto;
          align-items: start;
          gap:
            clamp(18px, 3vw, 38px);
        }

        .dipo-public-skills-index {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding-top: 5px;
        }

        .dipo-public-skills-index span {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border: 1px solid rgba(15,23,42,.1);
          border-radius: 13px;
          background: rgba(255,255,255,.86);
          color: #64748b;
          box-shadow:
            0 8px 25px rgba(15,23,42,.035);
          font-size: 10px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: .04em;
        }

        .dipo-public-skills-index i {
          width: 1px;
          height: 28px;
          background:
            linear-gradient(
              to bottom,
              rgba(15,23,42,.16),
              transparent
            );
        }

        .dipo-public-skills-heading {
          min-width: 0;
        }

        .dipo-public-skills-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 13px;
          color: #059669;
          font-size: 9px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .dipo-public-skills-eyebrow-icon {
          display: grid;
          place-items: center;
          width: 22px;
          height: 22px;
          border: 1px solid rgba(5,150,105,.16);
          border-radius: 7px;
          background: rgba(236,253,245,.8);
        }

        .dipo-public-skills-eyebrow-icon svg {
          width: 12px;
          height: 12px;
        }

        .dipo-public-skills-heading h2 {
          max-width: 720px;
          margin: 0;
          color: #0b1220;
          font-size:
            clamp(29px, 4vw, 58px);
          line-height: .98;
          letter-spacing: -.055em;
          font-weight: 950;
          text-wrap: balance;
        }

        .dipo-public-skills-heading p {
          max-width: 650px;
          margin:
            18px 0 0;
          color: #64748b;
          font-size:
            clamp(14px, 1.5vw, 17px);
          line-height: 1.7;
          font-weight: 500;
        }

        .dipo-public-skills-count {
          min-width: 78px;
          padding-top: 5px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .dipo-public-skills-count strong {
          color: #0b1220;
          font-size: 25px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -.04em;
        }

        .dipo-public-skills-count span {
          color: #94a3b8;
          font-size: 7px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .dipo-public-skills-list {
          width: min(100%, 1180px);
          margin:
            clamp(30px, 4vw, 52px)
            auto
            0;
          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );
          gap: 10px;
        }

        .dipo-public-skills-list > div {
          min-width: 0;
        }

        .dipo-skills-card {
          position: relative;
          min-height: 158px;
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 18px;
          border: 1px solid rgba(15,23,42,.075);
          border-radius: 19px;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.98),
              rgba(249,250,251,.96)
            );
          box-shadow:
            0 7px 24px rgba(15,23,42,.035);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .dipo-skills-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 18px;
          right: 18px;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(5,150,105,.32),
              transparent
            );
          opacity: 0;
          transition: opacity 180ms ease;
        }

        .dipo-skills-card:hover {
          transform: translateY(-3px);
          border-color: rgba(5,150,105,.17);
          background: #ffffff;
          box-shadow:
            0 17px 42px rgba(15,23,42,.07);
        }

        .dipo-skills-card:hover::before {
          opacity: 1;
        }

        .dipo-skills-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .dipo-skills-card-number {
          color: #a1aab6;
          font-size: 8px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .dipo-skills-card-icon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #ecfdf5;
          color: #059669;
        }

        .dipo-skills-card-icon svg {
          width: 14px;
          height: 14px;
        }

        .dipo-skills-card-body {
          min-width: 0;
          margin-top: auto;
          padding-top: 28px;
          padding-right: 20px;
        }

        .dipo-skills-card-body h3 {
          margin: 0;
          overflow-wrap: anywhere;
          color: #111827;
          font-size:
            clamp(15px, 1.45vw, 19px);
          line-height: 1.2;
          letter-spacing: -.025em;
          font-weight: 900;
        }

        .dipo-skills-card-category {
          display: inline-flex;
          max-width: 100%;
          margin-top: 8px;
          padding: 5px 8px;
          border-radius: 7px;
          background: #f1f5f9;
          color: #64748b;
          font-size: 7px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-skills-card-meta {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 13px;
          color: #94a3b8;
          font-size: 8px;
          line-height: 1;
          font-weight: 800;
        }

        .dipo-skills-card-meta i {
          width: 3px;
          height: 3px;
          flex: 0 0 3px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        .dipo-skills-card-arrow {
          position: absolute;
          right: 17px;
          bottom: 16px;
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #cbd5e1;
          transition:
            color 180ms ease,
            transform 180ms ease;
        }

        .dipo-skills-card-arrow svg {
          width: 13px;
          height: 13px;
        }

        .dipo-skills-card:hover
          .dipo-skills-card-arrow {
          color: #059669;
          transform: translateX(2px);
        }

        .dipo-public-skills-footer {
          width: min(100%, 1180px);
          margin:
            clamp(30px, 4vw, 52px)
            auto
            0;
          display: grid;
          grid-template-columns:
            minmax(80px, 1fr)
            auto
            minmax(80px, 1fr);
          align-items: center;
          gap: 16px;
        }

        .dipo-public-skills-footer-line {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dipo-public-skills-footer-line span {
          display: block;
          height: 1px;
          flex: 1;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(15,23,42,.1)
            );
        }

        .dipo-public-skills-footer-line span:last-child {
          background:
            linear-gradient(
              90deg,
              rgba(15,23,42,.1),
              transparent
            );
        }

        .dipo-public-skills-footer-line i {
          width: 4px;
          height: 4px;
          flex: 0 0 4px;
          border-radius: 50%;
          background: #10b981;
          box-shadow:
            0 0 0 4px rgba(16,185,129,.09);
        }

        .dipo-public-skills-footer-copy {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #94a3b8;
        }

        .dipo-public-skills-footer-copy > span {
          width: 19px;
          height: 19px;
          display: grid;
          place-items: center;
          flex: 0 0 19px;
          border-radius: 6px;
          background: #ecfdf5;
          color: #059669;
        }

        .dipo-public-skills-footer-copy svg {
          width: 10px;
          height: 10px;
        }

        .dipo-public-skills-footer-copy p {
          margin: 0;
          font-size: 8px;
          line-height: 1.4;
          font-weight: 800;
          white-space: nowrap;
        }

        .dipo-public-skills-footer-label {
          color: #cbd5e1;
          font-size: 7px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: .16em;
          text-align: right;
        }

        @media (max-width: 900px) {
          .dipo-public-skills {
            padding:
              52px
              20px;
          }

          .dipo-public-skills-list {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .dipo-public-skills-header {
            grid-template-columns:
              auto
              minmax(0, 1fr);
          }

          .dipo-public-skills-count {
            grid-column: 2;
            grid-row: 1;
            justify-self: start;
            flex-direction: row;
            align-items: center;
            gap: 7px;
            padding-top: 0;
          }

          .dipo-public-skills-count strong {
            font-size: 18px;
          }

          .dipo-public-skills-count span {
            font-size: 7px;
          }

          .dipo-public-skills-heading h2 {
            font-size:
              clamp(28px, 6vw, 46px);
          }

          .dipo-public-skills-footer {
            grid-template-columns: 1fr;
            justify-items: center;
          }

          .dipo-public-skills-footer-line {
            width: 100%;
          }

          .dipo-public-skills-footer-label {
            text-align: center;
          }
        }

        @media (max-width: 600px) {
          .dipo-public-skills {
            padding:
              43px
              14px;
          }

          .dipo-public-skills-header {
            grid-template-columns:
              35px
              minmax(0, 1fr);
            gap: 13px;
          }

          .dipo-public-skills-index {
            gap: 7px;
          }

          .dipo-public-skills-index span {
            width: 35px;
            height: 35px;
            border-radius: 10px;
            font-size: 8px;
          }

          .dipo-public-skills-index i {
            height: 20px;
          }

          .dipo-public-skills-heading {
            grid-column: 2;
          }

          .dipo-public-skills-count {
            grid-column: 2;
            grid-row: auto;
          }

          .dipo-public-skills-heading h2 {
            font-size:
              clamp(28px, 9vw, 39px);
            line-height: 1.01;
          }

          .dipo-public-skills-heading p {
            margin-top: 13px;
            font-size: 13px;
            line-height: 1.65;
          }

          .dipo-public-skills-eyebrow {
            margin-bottom: 10px;
            font-size: 8px;
          }

          .dipo-public-skills-list {
            margin-top: 27px;
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .dipo-skills-card {
            min-height: 125px;
            padding: 15px;
            border-radius: 16px;
          }

          .dipo-skills-card-body {
            padding-top: 20px;
          }

          .dipo-skills-card-body h3 {
            font-size: 16px;
          }

          .dipo-public-skills-footer {
            margin-top: 30px;
          }

          .dipo-public-skills-footer-copy p {
            font-size: 7px;
          }
        }

        @media (max-width: 360px) {
          .dipo-public-skills {
            padding-left: 11px;
            padding-right: 11px;
          }

          .dipo-public-skills-header {
            gap: 9px;
            grid-template-columns:
              31px
              minmax(0, 1fr);
          }

          .dipo-public-skills-index span {
            width: 31px;
            height: 31px;
            border-radius: 9px;
          }

          .dipo-public-skills-heading h2 {
            font-size: 27px;
          }

          .dipo-public-skills-card {
            min-height: 118px;
          }

          .dipo-skills-card {
            min-height: 118px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-public-skills *,
          .dipo-public-skills *::before,
          .dipo-public-skills *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}