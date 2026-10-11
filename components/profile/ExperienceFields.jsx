'use client';

import { useMemo } from 'react';

const MAX_ITEMS = 12;
const MAX_ROLE = 100;
const MAX_COMPANY = 120;
const MAX_LOCATION = 120;
const MAX_DESCRIPTION = 1200;

const EMPTY_ITEM = {
  role: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
};

function createItem() {
  return {
    ...EMPTY_ITEM,
  };
}

function normalizeItem(item) {
  if (typeof item === 'string') {
    return {
      ...EMPTY_ITEM,
      description: item,
    };
  }

  if (!item || typeof item !== 'object') {
    return createItem();
  }

  return {
    role:
      typeof item.role === 'string'
        ? item.role
        : typeof item.title === 'string'
          ? item.title
          : '',

    company:
      typeof item.company === 'string'
        ? item.company
        : typeof item.organization === 'string'
          ? item.organization
          : '',

    location:
      typeof item.location === 'string'
        ? item.location
        : '',

    startDate:
      typeof item.startDate === 'string'
        ? item.startDate
        : '',

    endDate:
      typeof item.endDate === 'string'
        ? item.endDate
        : '',

    current:
      item.current === true ||
      item.isCurrent === true,

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
    .map(normalizeItem);
}

export default function ExperienceFields({
  value = [],
  onChange,
  disabled = false,
}) {
  const items = useMemo(
    () => normalizeValue(value),
    [value]
  );

  function emit(nextItems) {
    onChange?.(
      nextItems.slice(0, MAX_ITEMS)
    );
  }

  function updateItem(index, field, nextValue) {
    const nextItems = items.map(
      (item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,
          [field]: nextValue,
        };
      }
    );

    emit(nextItems);
  }

  function addItem() {
    if (
      disabled ||
      items.length >= MAX_ITEMS
    ) {
      return;
    }

    emit([
      ...items,
      createItem(),
    ]);
  }

  function removeItem(index) {
    if (disabled) {
      return;
    }

    emit(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  function moveItem(index, direction) {
    if (disabled) {
      return;
    }

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

    nextItems[targetIndex] =
      current;

    emit(nextItems);
  }

  return (
    <section
      className="dipo-experience"
      aria-labelledby="dipo-experience-title"
    >
      <div className="dipo-experience-header">
        <div>
          <span className="dipo-experience-eyebrow">
            Professional timeline
          </span>

          <h2
            id="dipo-experience-title"
            className="dipo-experience-title"
          >
            Experience
          </h2>

          <p className="dipo-experience-description">
            Add the roles, companies, and work
            experience you want people to see
            on your DIPO.
          </p>
        </div>

        <button
          type="button"
          className="dipo-experience-add"
          onClick={addItem}
          disabled={
            disabled ||
            items.length >= MAX_ITEMS
          }
        >
          <span aria-hidden="true">
            +
          </span>

          Add experience
        </button>
      </div>

      {items.length === 0 ? (
        <div className="dipo-experience-empty">
          <div
            className="dipo-experience-empty-icon"
            aria-hidden="true"
          >
            ✦
          </div>

          <div>
            <strong>
              No experience added yet
            </strong>

            <p>
              Show your professional journey,
              from your current role to previous
              positions.
            </p>
          </div>

          <button
            type="button"
            className="dipo-experience-empty-button"
            onClick={addItem}
            disabled={disabled}
          >
            Add your first role
          </button>
        </div>
      ) : (
        <div
          className="dipo-experience-list"
          aria-live="polite"
        >
          {items.map((item, index) => {
            const itemNumber =
              index + 1;

            return (
              <article
                key={index}
                className="dipo-experience-card"
              >
                <div className="dipo-experience-card-top">
                  <div className="dipo-experience-index">
                    <span>
                      {String(
                        itemNumber
                      ).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="dipo-experience-card-heading">
                    <span>
                      Experience {itemNumber}
                    </span>

                    {item.current && (
                      <span className="dipo-experience-current">
                        Current role
                      </span>
                    )}
                  </div>

                  <div className="dipo-experience-controls">
                    <button
                      type="button"
                      className="dipo-experience-icon-button"
                      onClick={() =>
                        moveItem(
                          index,
                          'up'
                        )
                      }
                      disabled={
                        disabled ||
                        index === 0
                      }
                      aria-label={`Move experience ${itemNumber} up`}
                      title="Move up"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      className="dipo-experience-icon-button"
                      onClick={() =>
                        moveItem(
                          index,
                          'down'
                        )
                      }
                      disabled={
                        disabled ||
                        index ===
                          items.length - 1
                      }
                      aria-label={`Move experience ${itemNumber} down`}
                      title="Move down"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      className="dipo-experience-remove"
                      onClick={() =>
                        removeItem(index)
                      }
                      disabled={disabled}
                      aria-label={`Remove experience ${itemNumber}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="dipo-experience-grid">
                  <label className="dipo-experience-field dipo-experience-field-wide">
                    <span>
                      Job title / role
                    </span>

                    <input
                      type="text"
                      value={item.role}
                      maxLength={MAX_ROLE}
                      disabled={disabled}
                      placeholder="e.g. Senior Product Designer"
                      onChange={(event) =>
                        updateItem(
                          index,
                          'role',
                          event.target.value
                        )
                      }
                    />

                    <small>
                      {item.role.length}/
                      {MAX_ROLE}
                    </small>
                  </label>

                  <label className="dipo-experience-field">
                    <span>
                      Company / organization
                    </span>

                    <input
                      type="text"
                      value={item.company}
                      maxLength={MAX_COMPANY}
                      disabled={disabled}
                      placeholder="e.g. ABC Technologies"
                      onChange={(event) =>
                        updateItem(
                          index,
                          'company',
                          event.target.value
                        )
                      }
                    />

                    <small>
                      {item.company.length}/
                      {MAX_COMPANY}
                    </small>
                  </label>

                  <label className="dipo-experience-field">
                    <span>
                      Location
                      <em>
                        Optional
                      </em>
                    </span>

                    <input
                      type="text"
                      value={item.location}
                      maxLength={MAX_LOCATION}
                      disabled={disabled}
                      placeholder="e.g. Bengaluru, India"
                      onChange={(event) =>
                        updateItem(
                          index,
                          'location',
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="dipo-experience-field">
                    <span>
                      Start date
                    </span>

                    <input
                      type="month"
                      value={item.startDate}
                      disabled={disabled}
                      onChange={(event) =>
                        updateItem(
                          index,
                          'startDate',
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label
                    className={`dipo-experience-field ${
                      item.current
                        ? 'dipo-experience-disabled-field'
                        : ''
                    }`}
                  >
                    <span>
                      End date
                    </span>

                    <input
                      type="month"
                      value={
                        item.current
                          ? ''
                          : item.endDate
                      }
                      disabled={
                        disabled ||
                        item.current
                      }
                      onChange={(event) =>
                        updateItem(
                          index,
                          'endDate',
                          event.target.value
                        )
                      }
                    />
                  </label>
                </div>

                <label className="dipo-experience-current-toggle">
                  <input
                    type="checkbox"
                    checked={item.current}
                    disabled={disabled}
                    onChange={(event) => {
                      const isCurrent =
                        event.target.checked;

                      const nextItems =
                        items.map(
                          (
                            experience,
                            itemIndex
                          ) => {
                            if (
                              itemIndex !==
                              index
                            ) {
                              return experience;
                            }

                            return {
                              ...experience,
                              current:
                                isCurrent,
                              endDate:
                                isCurrent
                                  ? ''
                                  : experience.endDate,
                            };
                          }
                        );

                      emit(nextItems);
                    }}
                  />

                  <span className="dipo-experience-checkbox">
                    <span aria-hidden="true">
                      ✓
                    </span>
                  </span>

                  <span>
                    I currently work here
                  </span>
                </label>

                <label className="dipo-experience-field dipo-experience-description-field">
                  <span>
                    Description
                    <em>
                      Optional
                    </em>
                  </span>

                  <textarea
                    value={item.description}
                    maxLength={
                      MAX_DESCRIPTION
                    }
                    disabled={disabled}
                    rows={5}
                    placeholder="Briefly describe what you worked on, your responsibilities, or key achievements."
                    onChange={(event) =>
                      updateItem(
                        index,
                        'description',
                        event.target.value
                      )
                    }
                  />

                  <small>
                    {item.description.length}/
                    {MAX_DESCRIPTION}
                  </small>
                </label>
              </article>
            );
          })}
        </div>
      )}

      <div className="dipo-experience-footer">
        <span>
          {items.length}/{MAX_ITEMS} experiences
        </span>

        <span>
          Keep your timeline clear and concise.
        </span>
      </div>

      <style>{`
        .dipo-experience {
          width: 100%;
          box-sizing: border-box;
          color: #0f172a;
        }

        .dipo-experience-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .dipo-experience-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #059669;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .dipo-experience-eyebrow::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.10);
        }

        .dipo-experience-title {
          margin: 6px 0 0;
          font-size: clamp(21px, 3vw, 27px);
          line-height: 1.15;
          letter-spacing: -0.035em;
          font-weight: 800;
        }

        .dipo-experience-description {
          max-width: 620px;
          margin: 8px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.65;
        }

        .dipo-experience-add,
        .dipo-experience-empty-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 15px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          background: #111827;
          color: #ffffff;
          font: inherit;
          font-size: 13px;
          font-weight: 750;
          white-space: nowrap;
          cursor: pointer;
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease,
            opacity 160ms ease;
        }

        .dipo-experience-add span {
          font-size: 18px;
          line-height: 1;
          font-weight: 400;
        }

        .dipo-experience-add:hover:not(:disabled),
        .dipo-experience-empty-button:hover:not(:disabled) {
          background: #000000;
          transform: translateY(-1px);
          box-shadow:
            0 8px 20px rgba(15, 23, 42, 0.14);
        }

        .dipo-experience-add:focus-visible,
        .dipo-experience-empty-button:focus-visible,
        .dipo-experience-icon-button:focus-visible,
        .dipo-experience-remove:focus-visible,
        .dipo-experience-field input:focus-visible,
        .dipo-experience-field textarea:focus-visible,
        .dipo-experience-current-toggle input:focus-visible + .dipo-experience-checkbox {
          outline: 3px solid rgba(16, 185, 129, 0.22);
          outline-offset: 2px;
        }

        .dipo-experience-add:disabled,
        .dipo-experience-empty-button:disabled,
        .dipo-experience-icon-button:disabled,
        .dipo-experience-remove:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .dipo-experience-empty {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border: 1px dashed #cbd5e1;
          border-radius: 14px;
          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f8fafc
            );
        }

        .dipo-experience-empty-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid #d1fae5;
          border-radius: 12px;
          background: #ecfdf5;
          color: #059669;
          font-size: 18px;
        }

        .dipo-experience-empty strong {
          display: block;
          margin-bottom: 4px;
          color: #111827;
          font-size: 14px;
        }

        .dipo-experience-empty p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.55;
        }

        .dipo-experience-empty-button {
          background: #ffffff;
          color: #111827;
          border-color: #d1d5db;
        }

        .dipo-experience-list {
          display: grid;
          gap: 14px;
        }

        .dipo-experience-card {
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #ffffff;
          box-shadow:
            0 1px 2px rgba(15, 23, 42, 0.035);
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease,
            transform 160ms ease;
        }

        .dipo-experience-card:hover {
          border-color: #d1d5db;
          box-shadow:
            0 12px 32px rgba(15, 23, 42, 0.055);
        }

        .dipo-experience-card-top {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 62px;
          padding: 10px 13px;
          border-bottom: 1px solid #eef2f7;
          background: #fafafa;
        }

        .dipo-experience-index {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #ffffff;
          color: #64748b;
          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;
          font-size: 10px;
          font-weight: 800;
        }

        .dipo-experience-card-heading {
          min-width: 0;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          color: #111827;
          font-size: 13px;
          font-weight: 800;
        }

        .dipo-experience-current {
          display: inline-flex;
          align-items: center;
          min-height: 22px;
          padding: 0 8px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #047857;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .dipo-experience-controls {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-left: auto;
        }

        .dipo-experience-icon-button {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          padding: 0;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          color: #475569;
          font: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .dipo-experience-icon-button:hover:not(:disabled) {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .dipo-experience-remove {
          min-height: 32px;
          padding: 0 9px;
          border: 1px solid #fee2e2;
          border-radius: 8px;
          background: #fffafa;
          color: #b91c1c;
          font: inherit;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        .dipo-experience-remove:hover:not(:disabled) {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .dipo-experience-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 15px;
          padding: 18px 18px 0;
        }

        .dipo-experience-field {
          min-width: 0;
          display: grid;
          gap: 7px;
        }

        .dipo-experience-field-wide {
          grid-column: 1 / -1;
        }

        .dipo-experience-field > span {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #334155;
          font-size: 12px;
          font-weight: 750;
        }

        .dipo-experience-field > span em {
          color: #94a3b8;
          font-size: 10px;
          font-style: normal;
          font-weight: 600;
        }

        .dipo-experience-field input,
        .dipo-experience-field textarea {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          border: 1px solid #d7dee8;
          border-radius: 10px;
          background: #ffffff;
          color: #0f172a;
          font: inherit;
          font-size: 13px;
          outline: none;
          transition:
            border-color 150ms ease,
            box-shadow 150ms ease,
            background 150ms ease;
        }

        .dipo-experience-field input {
          min-height: 43px;
          padding: 0 12px;
        }

        .dipo-experience-field textarea {
          min-height: 112px;
          padding: 11px 12px;
          line-height: 1.6;
          resize: vertical;
        }

        .dipo-experience-field input::placeholder,
        .dipo-experience-field textarea::placeholder {
          color: #94a3b8;
        }

        .dipo-experience-field input:focus,
        .dipo-experience-field textarea:focus {
          border-color: #10b981;
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, 0.10);
        }

        .dipo-experience-field input:disabled,
        .dipo-experience-field textarea:disabled {
          background: #f8fafc;
          color: #64748b;
          cursor: not-allowed;
        }

        .dipo-experience-field small {
          margin-top: -3px;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 600;
          text-align: right;
        }

        .dipo-experience-description-field {
          margin: 18px;
          margin-top: 0;
        }

        .dipo-experience-current-toggle {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          width: fit-content;
          margin: 17px 18px 18px;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .dipo-experience-current-toggle input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .dipo-experience-checkbox {
          display: grid;
          place-items: center;
          width: 18px;
          height: 18px;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          background: #ffffff;
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          transition:
            background 150ms ease,
            border-color 150ms ease,
            box-shadow 150ms ease;
        }

        .dipo-experience-checkbox span {
          opacity: 0;
          transform: scale(0.7);
          transition:
            opacity 120ms ease,
            transform 120ms ease;
        }

        .dipo-experience-current-toggle input:checked + .dipo-experience-checkbox {
          border-color: #059669;
          background: #059669;
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, 0.10);
        }

        .dipo-experience-current-toggle input:checked + .dipo-experience-checkbox span {
          opacity: 1;
          transform: scale(1);
        }

        .dipo-experience-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 12px;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 650;
        }

        @media (max-width: 700px) {
          .dipo-experience-header {
            flex-direction: column;
          }

          .dipo-experience-add {
            width: 100%;
          }

          .dipo-experience-empty {
            grid-template-columns: auto minmax(0, 1fr);
          }

          .dipo-experience-empty-button {
            grid-column: 1 / -1;
            width: 100%;
          }

          .dipo-experience-grid {
            grid-template-columns: 1fr;
            padding: 15px 14px 0;
          }

          .dipo-experience-field-wide {
            grid-column: auto;
          }

          .dipo-experience-card-top {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .dipo-experience-card-heading {
            padding-top: 7px;
          }

          .dipo-experience-controls {
            width: 100%;
            margin-left: 0;
            padding-top: 2px;
          }

          .dipo-experience-icon-button {
            flex: 1;
          }

          .dipo-experience-remove {
            flex: 2;
          }

          .dipo-experience-current-toggle {
            margin: 15px 14px;
          }

          .dipo-experience-description-field {
            margin: 15px 14px 0;
          }

          .dipo-experience-footer {
            flex-direction: column;
            gap: 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-experience-add,
          .dipo-experience-empty-button,
          .dipo-experience-card,
          .dipo-experience-icon-button,
          .dipo-experience-field input,
          .dipo-experience-field textarea,
          .dipo-experience-checkbox,
          .dipo-experience-checkbox span {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}