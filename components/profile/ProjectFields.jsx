'use client';

import { useMemo, useState } from 'react';

const MAX_PROJECTS = 12;
const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 600;
const MAX_URL_LENGTH = 500;

function createEmptyProject() {
  return {
    title: '',
    description: '',
    url: '',
  };
}

function normalizeProject(project) {
  if (!project || typeof project !== 'object') {
    if (typeof project === 'string') {
      return {
        title: project,
        description: '',
        url: '',
      };
    }

    return createEmptyProject();
  }

  return {
    id:
      typeof project.id === 'string'
        ? project.id
        : undefined,
    title:
      typeof project.title === 'string'
        ? project.title
        : '',
    description:
      typeof project.description === 'string'
        ? project.description
        : '',
    url:
      typeof project.url === 'string'
        ? project.url
        : '',
  };
}

function normalizeProjects(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(normalizeProject)
    .slice(0, MAX_PROJECTS);
}

function isValidHttpsUrl(value) {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value.trim());

    return (
      url.protocol === 'https:' &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function cleanUrl(value) {
  return value
    .replace(/\s+/g, '')
    .slice(0, MAX_URL_LENGTH);
}

export default function ProjectFields({
  value = [],
  onChange,
}) {
  const projects = useMemo(
    () => normalizeProjects(value),
    [value]
  );

  const [expandedIndex, setExpandedIndex] =
    useState(
      projects.length > 0
        ? projects.length - 1
        : null
    );

  const [urlErrors, setUrlErrors] =
    useState({});

  function updateProjects(nextProjects) {
    onChange?.(
      nextProjects.map(
        ({ id, title, description, url }) => ({
          ...(id ? { id } : {}),
          title,
          description,
          url,
        })
      )
    );
  }

  function addProject() {
    if (projects.length >= MAX_PROJECTS) {
      return;
    }

    const nextProjects = [
      ...projects,
      createEmptyProject(),
    ];

    updateProjects(nextProjects);

    setExpandedIndex(
      nextProjects.length - 1
    );
  }

  function removeProject(index) {
    const nextProjects =
      projects.filter(
        (_, projectIndex) =>
          projectIndex !== index
      );

    updateProjects(nextProjects);

    setUrlErrors((current) => {
      const next = {};

      Object.entries(current).forEach(
        ([key, message]) => {
          const numericKey = Number(key);

          if (
            numericKey < index
          ) {
            next[numericKey] = message;
          } else if (
            numericKey > index
          ) {
            next[numericKey - 1] =
              message;
          }
        }
      );

      return next;
    });

    setExpandedIndex((current) => {
      if (current === null) {
        return null;
      }

      if (current === index) {
        return null;
      }

      if (current > index) {
        return current - 1;
      }

      return current;
    });
  }

  function updateProject(
    index,
    field,
    fieldValue
  ) {
    const nextProjects =
      projects.map(
        (project, projectIndex) => {
          if (
            projectIndex !== index
          ) {
            return project;
          }

          return {
            ...project,
            [field]: fieldValue,
          };
        }
      );

    updateProjects(nextProjects);
  }

  function handleUrlChange(
    index,
    rawValue
  ) {
    const nextValue =
      cleanUrl(rawValue);

    updateProject(
      index,
      'url',
      nextValue
    );

    if (!nextValue.trim()) {
      setUrlErrors((current) => ({
        ...current,
        [index]: undefined,
      }));

      return;
    }

    if (!isValidHttpsUrl(nextValue)) {
      setUrlErrors((current) => ({
        ...current,
        [index]:
          'Use a valid HTTPS link, for example https://example.com',
      }));

      return;
    }

    setUrlErrors((current) => ({
      ...current,
      [index]: undefined,
    }));
  }

  function toggleProject(index) {
    setExpandedIndex((current) =>
      current === index
        ? null
        : index
    );
  }

  return (
    <section className="wd-project-fields">
      <div className="wd-project-header">
        <div>
          <span className="wd-project-eyebrow">
            WORK
          </span>

          <h2>Projects</h2>

          <p>
            Apna best work showcase karo.
            Title, short description aur
            optional project link add karo.
          </p>
        </div>

        <div className="wd-project-count">
          {projects.length}/{MAX_PROJECTS}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="wd-project-empty">
          <div className="wd-project-empty-icon">
            <span />
            <span />
            <span />
          </div>

          <div>
            <strong>
              No projects yet
            </strong>

            <p>
              Add your portfolio,
              website, app, campaign,
              client work or any project
              you want to showcase.
            </p>
          </div>

          <button
            type="button"
            className="wd-project-add wd-project-add-empty"
            onClick={addProject}
          >
            <span>+</span>
            Add your first project
          </button>
        </div>
      ) : (
        <div className="wd-project-list">
          {projects.map(
            (project, index) => {
              const isExpanded =
                expandedIndex ===
                index;

              const hasUrlError =
                Boolean(
                  urlErrors[index]
                );

              const title =
                project.title.trim() ||
                'Untitled project';

              return (
                <article
                  key={
                    project.id ||
                    `project-${index}`
                  }
                  className={`wd-project-card ${
                    isExpanded
                      ? 'is-expanded'
                      : ''
                  }`}
                >
                  <button
                    type="button"
                    className="wd-project-summary"
                    onClick={() =>
                      toggleProject(
                        index
                      )
                    }
                    aria-expanded={
                      isExpanded
                    }
                  >
                    <span className="wd-project-number">
                      {String(
                        index + 1
                      ).padStart(2, '0')}
                    </span>

                    <span className="wd-project-summary-copy">
                      <strong>
                        {title}
                      </strong>

                      <small>
                        {project.url
                          ? 'Project link added'
                          : 'Add project details'}
                      </small>
                    </span>

                    <span
                      className="wd-project-chevron"
                      aria-hidden="true"
                    >
                      {isExpanded
                        ? '−'
                        : '+'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="wd-project-editor">
                      <div className="wd-project-field">
                        <label
                          htmlFor={`project-title-${index}`}
                        >
                          Project title
                        </label>

                        <input
                          id={`project-title-${index}`}
                          type="text"
                          value={
                            project.title
                          }
                          maxLength={
                            MAX_TITLE_LENGTH
                          }
                          placeholder="e.g. DIPO Website"
                          autoComplete="off"
                          onChange={(
                            event
                          ) =>
                            updateProject(
                              index,
                              'title',
                              event.target
                                .value
                            )
                          }
                        />

                        <div className="wd-project-meta">
                          <span>
                            Clear and specific
                            works best.
                          </span>

                          <span>
                            {
                              project.title
                                .length
                            }
                            /
                            {
                              MAX_TITLE_LENGTH
                            }
                          </span>
                        </div>
                      </div>

                      <div className="wd-project-field">
                        <label
                          htmlFor={`project-description-${index}`}
                        >
                          Description
                        </label>

                        <textarea
                          id={`project-description-${index}`}
                          value={
                            project.description
                          }
                          maxLength={
                            MAX_DESCRIPTION_LENGTH
                          }
                          rows={4}
                          placeholder="Briefly explain what you built, what it does, or what your role was."
                          onChange={(
                            event
                          ) =>
                            updateProject(
                              index,
                              'description',
                              event.target
                                .value
                            )
                          }
                        />

                        <div className="wd-project-meta">
                          <span>
                            Keep it short and
                            useful.
                          </span>

                          <span>
                            {
                              project
                                .description
                                .length
                            }
                            /
                            {
                              MAX_DESCRIPTION_LENGTH
                            }
                          </span>
                        </div>
                      </div>

                      <div className="wd-project-field">
                        <label
                          htmlFor={`project-url-${index}`}
                        >
                          Project URL
                          <span>
                            Optional
                          </span>
                        </label>

                        <div
                          className={`wd-project-url-wrap ${
                            hasUrlError
                              ? 'has-error'
                              : ''
                          }`}
                        >
                          <span className="wd-project-url-prefix">
                            https://
                          </span>

                          <input
                            id={`project-url-${index}`}
                            type="url"
                            inputMode="url"
                            value={
                              project.url
                            }
                            maxLength={
                              MAX_URL_LENGTH
                            }
                            placeholder="example.com/project"
                            autoComplete="url"
                            spellCheck="false"
                            onChange={(
                              event
                            ) =>
                              handleUrlChange(
                                index,
                                event
                                  .target
                                  .value
                              )
                            }
                            onBlur={() => {
                              if (
                                project.url.trim() &&
                                !project.url
                                  .trim()
                                  .startsWith(
                                    'https://'
                                  )
                              ) {
                                const value =
                                  project.url.trim();

                                const normalized =
                                  value.startsWith(
                                    'http://'
                                  )
                                    ? value.replace(
                                        /^http:\/\//i,
                                        'https://'
                                      )
                                    : `https://${value}`;

                                handleUrlChange(
                                  index,
                                  normalized
                                );
                              }
                            }}
                          />
                        </div>

                        {hasUrlError ? (
                          <p
                            className="wd-project-error"
                            role="alert"
                          >
                            {
                              urlErrors[
                                index
                              ]
                            }
                          </p>
                        ) : (
                          <p className="wd-project-help">
                            Use a public HTTPS
                            project link.
                          </p>
                        )}
                      </div>

                      <div className="wd-project-actions">
                        <button
                          type="button"
                          className="wd-project-remove"
                          onClick={() =>
                            removeProject(
                              index
                            )
                          }
                        >
                          Remove project
                        </button>

                        <button
                          type="button"
                          className="wd-project-done"
                          onClick={() =>
                            setExpandedIndex(
                              null
                            )
                          }
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            }
          )}
        </div>
      )}

      {projects.length > 0 && (
        <div className="wd-project-footer">
          <button
            type="button"
            className="wd-project-add"
            onClick={addProject}
            disabled={
              projects.length >=
              MAX_PROJECTS
            }
          >
            <span>+</span>
            Add project
          </button>

          <span>
            {projects.length >=
            MAX_PROJECTS
              ? `Maximum ${MAX_PROJECTS} projects`
              : 'You can add multiple projects'}
          </span>
        </div>
      )}

      <style>{`
        .wd-project-fields {
          width: 100%;
          display: grid;
          gap: 18px;
        }

        .wd-project-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .wd-project-eyebrow {
          display: block;
          margin-bottom: 7px;
          color: #059669;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .wd-project-header h2 {
          margin: 0;
          color: #101828;
          font-size: clamp(20px, 3vw, 25px);
          line-height: 1.15;
          letter-spacing: -0.03em;
        }

        .wd-project-header p {
          max-width: 620px;
          margin: 7px 0 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.65;
        }

        .wd-project-count {
          flex: 0 0 auto;
          min-width: 48px;
          padding: 7px 10px;
          border: 1px solid #e4e7ec;
          border-radius: 999px;
          background: #f8fafc;
          color: #475467;
          font-size: 11px;
          font-weight: 800;
          text-align: center;
        }

        .wd-project-empty {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border: 1px dashed #d0d5dd;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #ffffff 0%,
              #f8fafc 100%
            );
        }

        .wd-project-empty-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          gap: 3px;
          grid-template-columns: repeat(3, 5px);
          padding: 0 10px;
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          background: #ffffff;
          box-shadow:
            0 5px 16px
              rgba(16, 24, 40, 0.05);
        }

        .wd-project-empty-icon span {
          width: 5px;
          height: 22px;
          border-radius: 999px;
          background: #d0d5dd;
        }

        .wd-project-empty-icon span:nth-child(2) {
          height: 30px;
          background: #10b981;
        }

        .wd-project-empty strong {
          display: block;
          color: #101828;
          font-size: 14px;
        }

        .wd-project-empty p {
          margin: 4px 0 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.55;
        }

        .wd-project-list {
          display: grid;
          gap: 10px;
        }

        .wd-project-card {
          overflow: hidden;
          border: 1px solid #e4e7ec;
          border-radius: 16px;
          background: #ffffff;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            transform 180ms ease;
        }

        .wd-project-card:hover {
          border-color: #d0d5dd;
          box-shadow:
            0 8px 24px
              rgba(16, 24, 40, 0.055);
        }

        .wd-project-card.is-expanded {
          border-color: #b7ebd5;
          box-shadow:
            0 10px 28px
              rgba(16, 24, 40, 0.07);
        }

        .wd-project-summary {
          width: 100%;
          min-width: 0;
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          border: 0;
          background: #ffffff;
          color: inherit;
          cursor: pointer;
          text-align: left;
          font: inherit;
        }

        .wd-project-summary:focus-visible,
        .wd-project-add:focus-visible,
        .wd-project-remove:focus-visible,
        .wd-project-done:focus-visible {
          outline: 3px solid
            rgba(16, 185, 129, 0.22);
          outline-offset: 2px;
        }

        .wd-project-number {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f2f4f7;
          color: #667085;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .wd-project-card.is-expanded
          .wd-project-number {
          background: #ecfdf3;
          color: #047857;
        }

        .wd-project-summary-copy {
          min-width: 0;
          display: grid;
          gap: 3px;
        }

        .wd-project-summary-copy strong {
          overflow: hidden;
          color: #101828;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.35;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wd-project-summary-copy small {
          overflow: hidden;
          color: #98a2b3;
          font-size: 11px;
          line-height: 1.4;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wd-project-chevron {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #f8fafc;
          color: #667085;
          font-size: 18px;
          line-height: 1;
        }

        .wd-project-editor {
          display: grid;
          gap: 17px;
          padding: 4px 14px 15px;
          animation: wdProjectReveal 180ms ease both;
        }

        .wd-project-field {
          display: grid;
          gap: 7px;
        }

        .wd-project-field label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: #344054;
          font-size: 12px;
          font-weight: 700;
        }

        .wd-project-field label span {
          color: #98a2b3;
          font-size: 10px;
          font-weight: 600;
        }

        .wd-project-field input,
        .wd-project-field textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d0d5dd;
          border-radius: 11px;
          background: #ffffff;
          color: #101828;
          outline: none;
          font: inherit;
          font-size: 13px;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease;
        }

        .wd-project-field input {
          min-height: 46px;
          padding: 11px 13px;
        }

        .wd-project-field textarea {
          min-height: 105px;
          padding: 12px 13px;
          resize: vertical;
          line-height: 1.6;
        }

        .wd-project-field input::placeholder,
        .wd-project-field textarea::placeholder {
          color: #98a2b3;
        }

        .wd-project-field input:hover,
        .wd-project-field textarea:hover {
          border-color: #b8c0cc;
        }

        .wd-project-field input:focus,
        .wd-project-field textarea:focus {
          border-color: #10b981;
          box-shadow:
            0 0 0 3px
              rgba(16, 185, 129, 0.11);
        }

        .wd-project-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #98a2b3;
          font-size: 10px;
          line-height: 1.4;
        }

        .wd-project-url-wrap {
          min-width: 0;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          overflow: hidden;
          border: 1px solid #d0d5dd;
          border-radius: 11px;
          background: #ffffff;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        .wd-project-url-wrap:focus-within {
          border-color: #10b981;
          box-shadow:
            0 0 0 3px
              rgba(16, 185, 129, 0.11);
        }

        .wd-project-url-wrap.has-error {
          border-color: #f04438;
        }

        .wd-project-url-prefix {
          padding-left: 12px;
          color: #98a2b3;
          font-size: 12px;
          white-space: nowrap;
        }

        .wd-project-url-wrap input {
          min-height: 44px;
          border: 0;
          border-radius: 0;
          box-shadow: none !important;
          outline: 0;
        }

        .wd-project-error {
          margin: -1px 0 0;
          color: #b42318;
          font-size: 11px;
          line-height: 1.5;
        }

        .wd-project-help {
          margin: -1px 0 0;
          color: #98a2b3;
          font-size: 11px;
          line-height: 1.5;
        }

        .wd-project-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 1px;
        }

        .wd-project-remove,
        .wd-project-done {
          min-height: 38px;
          padding: 8px 12px;
          border-radius: 9px;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .wd-project-remove {
          border: 1px solid #fee4e2;
          background: #fffafa;
          color: #b42318;
        }

        .wd-project-remove:hover {
          background: #fef3f2;
          border-color: #fecdca;
        }

        .wd-project-done {
          border: 1px solid #10b981;
          background: #10b981;
          color: #ffffff;
          box-shadow:
            0 5px 14px
              rgba(16, 185, 129, 0.16);
        }

        .wd-project-done:hover {
          background: #059669;
          border-color: #059669;
        }

        .wd-project-add {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 13px;
          border: 1px solid #d0d5dd;
          border-radius: 10px;
          background: #ffffff;
          color: #344054;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition:
            border-color 160ms ease,
            background 160ms ease,
            transform 160ms ease;
        }

        .wd-project-add span {
          font-size: 17px;
          line-height: 1;
          font-weight: 400;
        }

        .wd-project-add:hover:not(:disabled) {
          border-color: #98a2b3;
          background: #f9fafb;
          transform: translateY(-1px);
        }

        .wd-project-add:disabled {
          cursor: not-allowed;
          opacity: 0.5;
          transform: none;
        }

        .wd-project-add-empty {
          white-space: nowrap;
        }

        .wd-project-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .wd-project-footer > span {
          color: #98a2b3;
          font-size: 10px;
          text-align: right;
        }

        @keyframes wdProjectReveal {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .wd-project-header {
            align-items: flex-start;
          }

          .wd-project-empty {
            grid-template-columns: auto minmax(0, 1fr);
            padding: 16px;
          }

          .wd-project-add-empty {
            grid-column: 1 / -1;
            width: 100%;
          }

          .wd-project-summary {
            grid-template-columns: 36px minmax(0, 1fr) 30px;
            gap: 10px;
            padding: 12px;
          }

          .wd-project-number {
            width: 32px;
            height: 32px;
          }

          .wd-project-editor {
            padding-inline: 12px;
          }

          .wd-project-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .wd-project-footer > span {
            text-align: left;
          }

          .wd-project-add {
            width: 100%;
          }
        }

        @media (max-width: 390px) {
          .wd-project-header p {
            font-size: 12px;
          }

          .wd-project-summary-copy small {
            font-size: 10px;
          }

          .wd-project-url-prefix {
            padding-left: 9px;
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wd-project-card,
          .wd-project-add,
          .wd-project-field input,
          .wd-project-field textarea {
            transition: none;
          }

          .wd-project-editor {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}