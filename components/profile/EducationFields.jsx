'use client';

import { useMemo } from 'react';

const MAX_ITEMS = 12;

const EMPTY_EDUCATION = {
  degree: '',
  institution: '',
  field: '',
  startYear: '',
  endYear: '',
  description: '',
};

function createEmptyEducation() {
  return {
    ...EMPTY_EDUCATION,
  };
}

function normalizeEducation(item) {
  if (typeof item === 'string') {
    return {
      ...createEmptyEducation(),
      degree: item,
    };
  }

  if (!item || typeof item !== 'object') {
    return createEmptyEducation();
  }

  return {
    degree:
      typeof item.degree === 'string'
        ? item.degree
        : typeof item.title === 'string'
          ? item.title
          : '',
    institution:
      typeof item.institution === 'string'
        ? item.institution
        : typeof item.school === 'string'
          ? item.school
          : typeof item.college === 'string'
            ? item.college
            : '',
    field:
      typeof item.field === 'string'
        ? item.field
        : typeof item.fieldOfStudy === 'string'
          ? item.fieldOfStudy
          : '',
    startYear:
      item.startYear != null
        ? String(item.startYear)
        : '',
    endYear:
      item.endYear != null
        ? String(item.endYear)
        : '',
    description:
      typeof item.description === 'string'
        ? item.description
        : '',
  };
}

function normalizeValue(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .slice(0, MAX_ITEMS)
    .map(normalizeEducation);
}

export default function EducationFields({
  value = [],
  onChange,
}) {
  const items = useMemo(
    () => normalizeValue(value),
    [value],
  );

  function emit(nextItems) {
    onChange?.(
      nextItems.slice(0, MAX_ITEMS),
    );
  }

  function addEducation() {
    if (items.length >= MAX_ITEMS) {
      return;
    }

    emit([
      ...items,
      createEmptyEducation(),
    ]);
  }

  function removeEducation(index) {
    emit(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      ),
    );
  }

  function updateEducation(
    index,
    field,
    nextValue,
  ) {
    emit(
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: nextValue,
            }
          : item,
      ),
    );
  }

  function moveEducation(
    index,
    direction,
  ) {
    const targetIndex =
      direction === 'up'
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= items.length
    ) {
      return;
    }

    const nextItems = [...items];

    const current =
      nextItems[index];

    nextItems[index] =
      nextItems[targetIndex];

    nextItems[targetIndex] = current;

    emit(nextItems);
  }

  return (
    <section
      className="education-fields"
      aria-labelledby="education-fields-title"
    >
      <div className="education-header">
        <div className="education-heading">
          <span className="education-eyebrow">
            PROFESSIONAL JOURNEY
          </span>

          <div className="education-title-row">
            <div className="education-icon">
              <GraduationIcon />
            </div>

            <div>
              <h2 id="education-fields-title">
                Education
              </h2>

              <p>
                Add your academic background,
                degrees and qualifications.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="education-add-button"
          onClick={addEducation}
          disabled={
            items.length >= MAX_ITEMS
          }
          aria-label="Add education"
        >
          <PlusIcon />
          <span>Add education</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="education-empty">
          <div className="education-empty-icon">
            <GraduationIcon />
          </div>

          <div className="education-empty-copy">
            <strong>
              No education added yet
            </strong>

            <p>
              Add your degree, college,
              university or other academic
              qualification.
            </p>
          </div>

          <button
            type="button"
            className="education-empty-action"
            onClick={addEducation}
          >
            <PlusIcon />
            Add your first education
          </button>
        </div>
      ) : (
        <div className="education-list">
          {items.map(
            (education, index) => (
              <article
                className="education-card"
                key={`education-${index}`}
              >
                <div className="education-card-top">
                  <div className="education-card-number">
                    {String(index + 1).padStart(
                      2,
                      '0',
                    )}
                  </div>

                  <div className="education-card-meta">
                    <span>
                      EDUCATION
                    </span>

                    <strong>
                      {education.degree ||
                        'New qualification'}
                    </strong>
                  </div>

                  <div className="education-card-actions">
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() =>
                        moveEducation(
                          index,
                          'up',
                        )
                      }
                      disabled={index === 0}
                      aria-label={`Move education ${index + 1} up`}
                      title="Move up"
                    >
                      <ChevronUpIcon />
                    </button>

                    <button
                      type="button"
                      className="icon-button"
                      onClick={() =>
                        moveEducation(
                          index,
                          'down',
                        )
                      }
                      disabled={
                        index ===
                        items.length - 1
                      }
                      aria-label={`Move education ${index + 1} down`}
                      title="Move down"
                    >
                      <ChevronDownIcon />
                    </button>

                    <button
                      type="button"
                      className="remove-button"
                      onClick={() =>
                        removeEducation(index)
                      }
                      aria-label={`Remove education ${index + 1}`}
                      title="Remove education"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <div className="education-grid">
                  <Field
                    label="Degree / qualification"
                    value={education.degree}
                    onChange={(nextValue) =>
                      updateEducation(
                        index,
                        'degree',
                        nextValue,
                      )
                    }
                    placeholder="B.Tech, B.Com, MBA, Diploma..."
                    maxLength={160}
                    required
                  />

                  <Field
                    label="Institution"
                    value={
                      education.institution
                    }
                    onChange={(nextValue) =>
                      updateEducation(
                        index,
                        'institution',
                        nextValue,
                      )
                    }
                    placeholder="University, college or school"
                    maxLength={180}
                  />

                  <Field
                    label="Field of study"
                    value={education.field}
                    onChange={(nextValue) =>
                      updateEducation(
                        index,
                        'field',
                        nextValue,
                      )
                    }
                    placeholder="Computer Science, Commerce..."
                    maxLength={160}
                  />

                  <div className="education-year-grid">
                    <Field
                      label="Start year"
                      value={
                        education.startYear
                      }
                      onChange={(nextValue) =>
                        updateEducation(
                          index,
                          'startYear',
                          sanitizeYear(
                            nextValue,
                          ),
                        )
                      }
                      placeholder="2020"
                      inputMode="numeric"
                      maxLength={4}
                    />

                    <Field
                      label="End year"
                      value={
                        education.endYear
                      }
                      onChange={(nextValue) =>
                        updateEducation(
                          index,
                          'endYear',
                          sanitizeYear(
                            nextValue,
                          ),
                        )
                      }
                      placeholder="2024"
                      inputMode="numeric"
                      maxLength={4}
                    />
                  </div>

                  <div className="education-description-field">
                    <label>
                      <span>
                        Description
                      </span>

                      <textarea
                        value={
                          education.description
                        }
                        onChange={(event) =>
                          updateEducation(
                            index,
                            'description',
                            event.target.value,
                          )
                        }
                        placeholder="Add a short note about your studies, achievements or specialization..."
                        maxLength={600}
                        rows={4}
                      />

                      <small>
                        {
                          education
                            .description
                            .length
                        }
                        /600
                      </small>
                    </label>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      )}

      <div className="education-footer">
        <span>
          {items.length} of {MAX_ITEMS}{' '}
          entries
        </span>

        <span>
          Keep your education details
          concise and professional.
        </span>
      </div>

      <style>{`
        .education-fields {
          width: 100%;
          box-sizing: border-box;
          display: grid;
          gap: 20px;
          color: #111827;
        }

        .education-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .education-heading {
          min-width: 0;
        }

        .education-eyebrow {
          display: inline-flex;
          margin-bottom: 10px;
          color: #059669;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .education-title-row {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .education-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border: 1px solid #d1fae5;
          border-radius: 13px;
          background: #ecfdf5;
          color: #059669;
        }

        .education-icon svg {
          width: 20px;
          height: 20px;
        }

        h2 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(18px, 2vw, 22px);
          line-height: 1.15;
          letter-spacing: -0.025em;
        }

        .education-title-row p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .education-add-button,
        .education-empty-action {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #d1d5db;
          border-radius: 11px;
          padding: 0 14px;
          background: #111827;
          color: #fff;
          font: inherit;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease,
            opacity 160ms ease;
        }

        .education-add-button svg,
        .education-empty-action svg {
          width: 16px;
          height: 16px;
        }

        .education-add-button:hover:not(:disabled),
        .education-empty-action:hover {
          transform: translateY(-1px);
          box-shadow:
            0 8px 20px
            rgb(15 23 42 / 12%);
          background: #0b1220;
        }

        .education-add-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .education-empty {
          min-height: 210px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 28px;
          border: 1px dashed #cbd5e1;
          border-radius: 18px;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f8fafc 100%
            );
          text-align: center;
        }

        .education-empty-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border: 1px solid #d1fae5;
          border-radius: 16px;
          background: #ecfdf5;
          color: #059669;
        }

        .education-empty-icon svg {
          width: 23px;
          height: 23px;
        }

        .education-empty-copy strong {
          display: block;
          color: #111827;
          font-size: 14px;
        }

        .education-empty-copy p {
          max-width: 430px;
          margin: 5px auto 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.55;
        }

        .education-empty-action {
          margin-top: 4px;
          background: #fff;
          color: #111827;
          border-color: #d1d5db;
        }

        .education-list {
          display: grid;
          gap: 14px;
        }

        .education-card {
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 17px;
          background: #fff;
          box-shadow:
            0 2px 8px
            rgb(15 23 42 / 3%);
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .education-card:focus-within {
          border-color: #a7f3d0;
          box-shadow:
            0 0 0 3px
            rgb(16 185 129 / 8%),
            0 8px 28px
            rgb(15 23 42 / 5%);
        }

        .education-card-top {
          min-height: 64px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-bottom: 1px solid #f1f5f9;
          background: #fcfdfd;
        }

        .education-card-number {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f1f5f9;
          color: #475569;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
        }

        .education-card-meta {
          min-width: 0;
          flex: 1;
          display: grid;
          gap: 3px;
        }

        .education-card-meta span {
          color: #94a3b8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.13em;
        }

        .education-card-meta strong {
          overflow: hidden;
          color: #111827;
          font-size: 13px;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .education-card-actions {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .icon-button,
        .remove-button {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          background: #fff;
          color: #64748b;
          cursor: pointer;
          transition:
            background 150ms ease,
            color 150ms ease,
            border-color 150ms ease;
        }

        .icon-button:hover:not(:disabled) {
          border-color: #cbd5e1;
          background: #f8fafc;
          color: #111827;
        }

        .remove-button:hover {
          border-color: #fecaca;
          background: #fef2f2;
          color: #dc2626;
        }

        .icon-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .icon-button svg,
        .remove-button svg {
          width: 15px;
          height: 15px;
        }

        .education-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 15px;
          padding: 17px;
        }

        .education-grid label {
          display: grid;
          gap: 7px;
        }

        .education-grid label > span {
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .education-grid input,
        .education-grid textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dbe1e8;
          border-radius: 10px;
          outline: none;
          background: #fff;
          color: #0f172a;
          font: inherit;
          font-size: 13px;
          transition:
            border-color 150ms ease,
            box-shadow 150ms ease;
        }

        .education-grid input {
          min-height: 44px;
          padding: 10px 12px;
        }

        .education-grid textarea {
          min-height: 102px;
          padding: 11px 12px;
          resize: vertical;
          line-height: 1.55;
        }

        .education-grid input::placeholder,
        .education-grid textarea::placeholder {
          color: #a1aab7;
        }

        .education-grid input:focus,
        .education-grid textarea:focus {
          border-color: #34d399;
          box-shadow:
            0 0 0 3px
            rgb(16 185 129 / 10%);
        }

        .education-year-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .education-description-field {
          grid-column: 1 / -1;
        }

        .education-description-field small {
          justify-self: end;
          color: #94a3b8;
          font-size: 10px;
        }

        .education-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #94a3b8;
          font-size: 11px;
        }

        .education-footer span:first-child {
          color: #64748b;
          font-weight: 650;
        }

        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }

        @media (max-width: 700px) {
          .education-header {
            align-items: stretch;
            flex-direction: column;
          }

          .education-add-button {
            width: 100%;
          }

          .education-grid {
            grid-template-columns: 1fr;
            padding: 14px;
          }

          .education-description-field {
            grid-column: auto;
          }

          .education-card-top {
            align-items: flex-start;
          }

          .education-card-actions {
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .education-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 430px) {
          .education-title-row {
            align-items: flex-start;
          }

          .education-icon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }

          .education-card-top {
            gap: 9px;
            padding: 10px;
          }

          .education-card-number {
            width: 32px;
            height: 32px;
            flex-basis: 32px;
          }

          .education-card-actions {
            gap: 3px;
          }

          .icon-button,
          .remove-button {
            width: 31px;
            height: 31px;
          }

          .education-year-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .education-add-button,
          .education-empty-action,
          .education-card,
          .icon-button,
          .remove-button,
          .education-grid input,
          .education-grid textarea {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  required = false,
  inputMode,
}) {
  return (
    <label>
      <span>
        {label}
        {required ? ' *' : ''}
      </span>

      <input
        type="text"
        value={value ?? ''}
        required={required}
        maxLength={maxLength}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function sanitizeYear(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 4);
}

function GraduationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z" />
      <path d="M7 11.5V16c2.7 2.1 7.3 2.1 10 0v-4.5" />
      <path d="M21 10v5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 14 6-6 6 6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 10 6 6 6-6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="m9 7 .7-2h4.6l.7 2" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  );
}