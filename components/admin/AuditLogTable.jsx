'use client';

import { useMemo, useState } from 'react';

const ACTION_META = {
  'payment.approved': {
    label: 'Payment approved',
    tone: 'success',
    icon: '✓',
  },

  'payment.rejected': {
    label: 'Payment rejected',
    tone: 'danger',
    icon: '!',
  },

  'payment.created': {
    label: 'Payment created',
    tone: 'info',
    icon: '₹',
  },

  'payment.submitted': {
    label: 'Payment submitted',
    tone: 'info',
    icon: '↗',
  },

  'profile.created': {
    label: 'Profile created',
    tone: 'success',
    icon: '+',
  },

  'profile.updated': {
    label: 'Profile updated',
    tone: 'info',
    icon: '✎',
  },

  'profile.deleted': {
    label: 'Profile deleted',
    tone: 'danger',
    icon: '×',
  },

  'admin.login': {
    label: 'Admin login',
    tone: 'success',
    icon: '→',
  },

  'admin.logout': {
    label: 'Admin logout',
    tone: 'neutral',
    icon: '←',
  },

  'admin.mfa_verified': {
    label: 'Admin MFA verified',
    tone: 'success',
    icon: '✓',
  },

  'admin.mfa_failed': {
    label: 'Admin MFA failed',
    tone: 'danger',
    icon: '!',
  },
};

const TONES = {
  success: {
    background: '#ecfdf5',
    border: '#d1fae5',
    color: '#047857',
    dot: '#10b981',
  },

  danger: {
    background: '#fff1f2',
    border: '#ffe4e6',
    color: '#be123c',
    dot: '#f43f5e',
  },

  warning: {
    background: '#fffbeb',
    border: '#fef3c7',
    color: '#b45309',
    dot: '#f59e0b',
  },

  info: {
    background: '#eff6ff',
    border: '#dbeafe',
    color: '#1d4ed8',
    dot: '#3b82f6',
  },

  neutral: {
    background: '#f8fafc',
    border: '#e2e8f0',
    color: '#475569',
    dot: '#94a3b8',
  },
};

function getActionMeta(action) {
  if (
    typeof action === 'string' &&
    ACTION_META[action]
  ) {
    return ACTION_META[action];
  }

  return {
    label: formatReadableText(action || 'Unknown action'),
    tone: 'neutral',
    icon: '•',
  };
}

function formatReadableText(value) {
  if (
    typeof value !== 'string' ||
    !value.trim()
  ) {
    return 'Unknown';
  }

  return value
    .trim()
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(date);
}

function formatRelativeDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  const difference =
    Date.now() -
    date.getTime();

  const seconds =
    Math.floor(
      difference / 1000,
    );

  if (seconds < 60) {
    return 'Just now';
  }

  const minutes =
    Math.floor(
      seconds / 60,
    );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  if (days < 7) {
    return `${days}d ago`;
  }

  return '';
}

function shortenUuid(value) {
  if (
    typeof value !== 'string' ||
    !value
  ) {
    return '—';
  }

  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

function safeMetadata(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  return value;
}

function hasMetadata(value) {
  const metadata =
    safeMetadata(value);

  if (!metadata) {
    return false;
  }

  return (
    Object.keys(metadata).length > 0
  );
}

function formatMetadata(metadata) {
  const safe =
    safeMetadata(metadata);

  if (!safe) {
    return '';
  }

  try {
    return JSON.stringify(
      safe,
      null,
      2,
    );
  } catch {
    return '';
  }
}

function normalizeLogs(logs) {
  if (!Array.isArray(logs)) {
    return [];
  }

  return logs.filter(
    (log) =>
      log &&
      typeof log === 'object',
  );
}

function ActionBadge({
  action,
}) {
  const meta =
    getActionMeta(action);

  const tone =
    TONES[meta.tone] ||
    TONES.neutral;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        minHeight: '30px',
        padding: '0 10px',
        borderRadius: '999px',
        border: `1px solid ${tone.border}`,
        background: tone.background,
        color: tone.color,
        fontSize: '11px',
        fontWeight: 850,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '18px',
          height: '18px',
          display: 'grid',
          placeItems: 'center',
          borderRadius: '999px',
          background: '#ffffff',
          border: `1px solid ${tone.border}`,
          fontSize: '10px',
          fontWeight: 950,
        }}
      >
        {meta.icon}
      </span>

      {meta.label}
    </div>
  );
}

function EntityBadge({
  entityType,
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: '27px',
        padding: '0 9px',
        borderRadius: '9px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        color: '#475569',
        fontSize: '10px',
        fontWeight: 850,
      }}
    >
      {formatReadableText(
        entityType || 'unknown',
      )}
    </span>
  );
}

function EmptyState({
  searchActive,
}) {
  return (
    <div
      style={{
        padding: '72px 24px',
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: '58px',
          height: '58px',
          margin: '0 auto 16px',
          display: 'grid',
          placeItems: 'center',
          borderRadius: '18px',
          background: '#f1f5f9',
          color: '#64748b',
          fontSize: '22px',
          fontWeight: 900,
        }}
      >
        {searchActive ? '⌕' : '◷'}
      </div>

      <h3
        style={{
          margin: 0,
          color: '#0f172a',
          fontSize: '18px',
          lineHeight: 1.2,
          fontWeight: 900,
          letterSpacing: '-0.025em',
        }}
      >
        {searchActive
          ? 'No matching activity'
          : 'No audit activity yet'}
      </h3>

      <p
        style={{
          maxWidth: '440px',
          margin: '9px auto 0',
          color: '#94a3b8',
          fontSize: '13px',
          lineHeight: 1.65,
        }}
      >
        {searchActive
          ? 'Try a different search term or clear the filter to see more administrative activity.'
          : 'Administrative events will appear here when secure platform actions are recorded.'}
      </p>
    </div>
  );
}

function LoadingState({
  rows = 5,
}) {
  return (
    <div
      aria-label="Loading audit logs"
      aria-busy="true"
    >
      {Array.from({
        length: rows,
      }).map(
        (_, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns:
                'minmax(240px, 1.5fr) minmax(120px, .7fr) minmax(180px, 1fr) minmax(150px, .8fr)',
              gap: '20px',
              alignItems: 'center',
              minWidth: '900px',
              padding:
                '18px 20px',
              borderBottom:
                '1px solid #f0f3f7',
            }}
          >
            {[
              '42%',
              '32%',
              '55%',
              '38%',
            ].map(
              (
                width,
                skeletonIndex,
              ) => (
                <span
                  key={
                    skeletonIndex
                  }
                  aria-hidden="true"
                  style={{
                    display:
                      'block',
                    width,
                    height:
                      skeletonIndex ===
                      0
                        ? '34px'
                        : '13px',
                    borderRadius:
                      '8px',
                    background:
                      '#eef2f7',
                    animation:
                      'dipoAuditPulse 1.4s ease-in-out infinite',
                    animationDelay:
                      `${index * 80}ms`,
                  }}
                />
              ),
            )}
          </div>
        ),
      )}

      <style>{`
        @keyframes dipoAuditPulse {
          0%, 100% {
            opacity: 0.5;
          }

          50% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [aria-busy="true"] span {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function MetadataDetails({
  metadata,
}) {
  const [open, setOpen] =
    useState(false);

  const content =
    formatMetadata(
      metadata,
    );

  if (!content) {
    return (
      <span
        style={{
          color: '#cbd5e1',
          fontSize: '11px',
        }}
      >
        —
      </span>
    );
  }

  return (
    <div
      style={{
        marginTop: '9px',
      }}
    >
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          minHeight: '28px',
          padding: '0 9px',
          borderRadius: '9px',
          border: '1px solid #e2e8f0',
          background: '#ffffff',
          color: '#475569',
          fontSize: '10px',
          fontWeight: 800,
          cursor: 'pointer',
        }}
      >
        <span aria-hidden="true">
          {open ? '⌃' : '⌄'}
        </span>

        {open
          ? 'Hide metadata'
          : 'View metadata'}
      </button>

      {open && (
        <pre
          style={{
            maxWidth: '520px',
            maxHeight: '260px',
            margin:
              '9px 0 0',
            padding: '11px',
            overflow: 'auto',
            borderRadius: '11px',
            border:
              '1px solid #e8edf3',
            background:
              '#f8fafc',
            color: '#475569',
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '10px',
            lineHeight: 1.6,
            whiteSpace:
              'pre-wrap',
            wordBreak:
              'break-word',
          }}
        >
          {content}
        </pre>
      )}
    </div>
  );
}

export default function AuditLogTable({
  logs = [],
  loading = false,
  error = '',
  searchable = true,
  showMetadata = true,
  emptyMessage,
  className = '',
  style = {},
  onSelectLog,
}) {
  const [search, setSearch] =
    useState('');

  const normalizedLogs =
    useMemo(
      () =>
        normalizeLogs(
          logs,
        ),
      [logs],
    );

  const filteredLogs =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return normalizedLogs;
      }

      return normalizedLogs.filter(
        (log) => {
          const searchableText =
            [
              log.action,
              log.entityType,
              log.entityId,
              log.actorUserId,
              formatReadableText(
                log.action,
              ),
              formatReadableText(
                log.entityType,
              ),
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

          return searchableText.includes(
            query,
          );
        },
      );
    }, [
      normalizedLogs,
      search,
    ]);

  const searchActive =
    Boolean(
      search.trim(),
    );

  return (
    <section
      className={className}
      aria-label="Administrative audit logs"
      style={{
        width: '100%',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent:
            'space-between',
          gap: '18px',
          flexWrap: 'wrap',
          padding:
            '20px 22px',
          borderBottom:
            '1px solid #eef2f7',
          background:
            '#ffffff',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              gap: '9px',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '8px',
                height: '8px',
                borderRadius:
                  '999px',
                background:
                  '#10b981',
                boxShadow:
                  '0 0 0 4px #ecfdf5',
              }}
            />

            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: '10px',
                fontWeight: 900,
                letterSpacing:
                  '0.12em',
                textTransform:
                  'uppercase',
              }}
            >
              Security trail
            </p>
          </div>

          <h2
            style={{
              margin:
                '7px 0 0',
              color: '#0f172a',
              fontSize:
                'clamp(18px, 2vw, 22px)',
              lineHeight: 1.2,
              fontWeight: 900,
              letterSpacing:
                '-0.035em',
            }}
          >
            Admin Audit Log
          </h2>

          <p
            style={{
              maxWidth:
                '650px',
              margin:
                '6px 0 0',
              color: '#94a3b8',
              fontSize: '12px',
              lineHeight: 1.6,
            }}
          >
            Append-only administrative
            activity recorded by the
            Worldwide DIPO security
            layer.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems:
              'center',
            gap: '8px',
            minHeight: '34px',
            padding:
              '0 10px',
            borderRadius:
              '999px',
            border:
              '1px solid #d1fae5',
            background:
              '#ecfdf5',
            color: '#047857',
            fontSize: '10px',
            fontWeight: 850,
            whiteSpace:
              'nowrap',
          }}
        >
          <span
            aria-hidden="true"
          >
            ●
          </span>

          {loading
            ? 'Loading'
            : `${filteredLogs.length} ${
                filteredLogs.length ===
                1
                  ? 'event'
                  : 'events'
              }`}
        </div>
      </div>

      {/* Search */}
      {searchable && (
        <div
          style={{
            display: 'flex',
            alignItems:
              'center',
            gap: '10px',
            padding:
              '14px 22px',
            background:
              '#fbfcfe',
            borderBottom:
              '1px solid #eef2f7',
          }}
        >
          <div
            style={{
              position:
                'relative',
              flex: 1,
              minWidth: 0,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position:
                  'absolute',
                left: '12px',
                top: '50%',
                transform:
                  'translateY(-50%)',
                color:
                  '#94a3b8',
                fontSize:
                  '14px',
                pointerEvents:
                  'none',
              }}
            >
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value
                    .slice(
                      0,
                      100,
                    ),
                )
              }
              placeholder="Search action, entity or ID..."
              aria-label="Search audit logs"
              style={{
                width: '100%',
                minHeight:
                  '40px',
                boxSizing:
                  'border-box',
                padding:
                  '0 38px',
                border:
                  '1px solid #dfe6ee',
                borderRadius:
                  '12px',
                outline:
                  'none',
                background:
                  '#ffffff',
                color:
                  '#0f172a',
                fontSize:
                  '12px',
              }}
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch(
                    '',
                  )
                }
                aria-label="Clear audit search"
                style={{
                  position:
                    'absolute',
                  right:
                    '8px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  width:
                    '26px',
                  height:
                    '26px',
                  display:
                    'grid',
                  placeItems:
                    'center',
                  border: 0,
                  borderRadius:
                    '8px',
                  background:
                    '#f1f5f9',
                  color:
                    '#64748b',
                  cursor:
                    'pointer',
                  fontSize:
                    '12px',
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error ? (
        <div
          role="alert"
          style={{
            margin:
              '16px 22px',
            padding:
              '13px 14px',
            border:
              '1px solid #fecdd3',
            borderRadius:
              '13px',
            background:
              '#fff1f2',
            color:
              '#9f1239',
            fontSize:
              '12px',
            lineHeight:
              1.5,
            fontWeight:
              700,
          }}
        >
          {error}
        </div>
      ) : null}

      {/* Loading */}
      {loading ? (
        <div
          style={{
            width: '100%',
            overflowX:
              'auto',
          }}
        >
          <LoadingState />
        </div>
      ) : filteredLogs.length ===
        0 ? (
        <EmptyState
          searchActive={
            searchActive
          }
          message={
            emptyMessage
          }
        />
      ) : (
        <div
          style={{
            width: '100%',
            overflowX:
              'auto',
            WebkitOverflowScrolling:
              'touch',
          }}
        >
          <table
            style={{
              width: '100%',
              minWidth:
                '980px',
              borderCollapse:
                'collapse',
            }}
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{
                    padding:
                      '13px 20px',
                    textAlign:
                      'left',
                    background:
                      '#fafbfc',
                    borderBottom:
                      '1px solid #eef2f7',
                    color:
                      '#64748b',
                    fontSize:
                      '10px',
                    fontWeight:
                      900,
                    letterSpacing:
                      '0.08em',
                    textTransform:
                      'uppercase',
                    whiteSpace:
                      'nowrap',
                  }}
                >
                  Action
                </th>

                <th
                  scope="col"
                  style={{
                    padding:
                      '13px 20px',
                    textAlign:
                      'left',
                    background:
                      '#fafbfc',
                    borderBottom:
                      '1px solid #eef2f7',
                    color:
                      '#64748b',
                    fontSize:
                      '10px',
                    fontWeight:
                      900,
                    letterSpacing:
                      '0.08em',
                    textTransform:
                      'uppercase',
                    whiteSpace:
                      'nowrap',
                  }}
                >
                  Entity
                </th>

                <th
                  scope="col"
                  style={{
                    padding:
                      '13px 20px',
                    textAlign:
                      'left',
                    background:
                      '#fafbfc',
                    borderBottom:
                      '1px solid #eef2f7',
                    color:
                      '#64748b',
                    fontSize:
                      '10px',
                    fontWeight:
                      900,
                    letterSpacing:
                      '0.08em',
                    textTransform:
                      'uppercase',
                    whiteSpace:
                      'nowrap',
                  }}
                >
                  Actor
                </th>

                <th
                  scope="col"
                  style={{
                    padding:
                      '13px 20px',
                    textAlign:
                      'left',
                    background:
                      '#fafbfc',
                    borderBottom:
                      '1px solid #eef2f7',
                    color:
                      '#64748b',
                    fontSize:
                      '10px',
                    fontWeight:
                      900,
                    letterSpacing:
                      '0.08em',
                    textTransform:
                      'uppercase',
                    whiteSpace:
                      'nowrap',
                  }}
                >
                  Time
                </th>

                {showMetadata && (
                  <th
                    scope="col"
                    style={{
                      padding:
                        '13px 20px',
                      textAlign:
                        'left',
                      background:
                        '#fafbfc',
                      borderBottom:
                        '1px solid #eef2f7',
                      color:
                        '#64748b',
                      fontSize:
                        '10px',
                      fontWeight:
                        900,
                      letterSpacing:
                        '0.08em',
                      textTransform:
                        'uppercase',
                      whiteSpace:
                        'nowrap',
                    }}
                  >
                    Details
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map(
                (log) => {
                  const actionMeta =
                    getActionMeta(
                      log.action,
                    );

                  const relative =
                    formatRelativeDate(
                      log.createdAt,
                    );

                  const rowClickable =
                    typeof onSelectLog ===
                    'function';

                  return (
                    <tr
                      key={
                        log.id ||
                        `${log.action}-${log.createdAt}-${Math.random()}`
                      }
                      onClick={() => {
                        if (
                          rowClickable
                        ) {
                          onSelectLog(
                            log,
                          );
                        }
                      }}
                      style={{
                        cursor:
                          rowClickable
                            ? 'pointer'
                            : 'default',
                        transition:
                          'background 140ms ease',
                      }}
                    >
                      <td
                        style={{
                          padding:
                            '16px 20px',
                          borderBottom:
                            '1px solid #f0f3f7',
                          verticalAlign:
                            'top',
                        }}
                      >
                        <div
                          style={{
                            display:
                              'flex',
                            alignItems:
                              'flex-start',
                            gap:
                              '10px',
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              width:
                                '30px',
                              height:
                                '30px',
                              flexShrink:
                                0,
                              display:
                                'grid',
                              placeItems:
                                'center',
                              borderRadius:
                                '10px',
                              background:
                                (
                                  TONES[
                                    actionMeta.tone
                                  ] ||
                                  TONES.neutral
                                )
                                  .background,
                              color:
                                (
                                  TONES[
                                    actionMeta.tone
                                  ] ||
                                  TONES.neutral
                                )
                                  .color,
                              fontSize:
                                '12px',
                              fontWeight:
                                950,
                            }}
                          >
                            {
                              actionMeta.icon
                            }
                          </span>

                          <div
                            style={{
                              minWidth:
                                '180px',
                            }}
                          >
                            <p
                              style={{
                                margin:
                                  0,
                                color:
                                  '#0f172a',
                                fontSize:
                                  '12px',
                                fontWeight:
                                  900,
                              }}
                            >
                              {
                                actionMeta.label
                              }
                            </p>

                            <p
                              style={{
                                margin:
                                  '4px 0 0',
                                color:
                                  '#94a3b8',
                                fontSize:
                                  '10px',
                                lineHeight:
                                  1.5,
                                fontFamily:
                                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                              }}
                            >
                              {
                                log.action ||
                                'unknown'
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td
                        style={{
                          padding:
                            '16px 20px',
                          borderBottom:
                            '1px solid #f0f3f7',
                          verticalAlign:
                            'top',
                        }}
                      >
                        <EntityBadge
                          entityType={
                            log.entityType
                          }
                        />

                        {log.entityId && (
                          <p
                            title={
                              log.entityId
                            }
                            style={{
                              margin:
                                '8px 0 0',
                              color:
                                '#64748b',
                              fontSize:
                                '10px',
                              fontFamily:
                                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                            }}
                          >
                            {
                              shortenUuid(
                                log.entityId,
                              )
                            }
                          </p>
                        )}
                      </td>

                      <td
                        style={{
                          padding:
                            '16px 20px',
                          borderBottom:
                            '1px solid #f0f3f7',
                          verticalAlign:
                            'top',
                        }}
                      >
                        <p
                          title={
                            log.actorUserId ||
                            ''
                          }
                          style={{
                            margin:
                              0,
                            color:
                              '#334155',
                            fontSize:
                              '10px',
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                            wordBreak:
                              'break-all',
                          }}
                        >
                          {shortenUuid(
                            log.actorUserId,
                          )}
                        </p>

                        <p
                          style={{
                            margin:
                              '5px 0 0',
                            color:
                              '#94a3b8',
                            fontSize:
                              '10px',
                          }}
                        >
                          Authorized admin
                        </p>
                      </td>

                      <td
                        style={{
                          padding:
                            '16px 20px',
                          borderBottom:
                            '1px solid #f0f3f7',
                          verticalAlign:
                            'top',
                          whiteSpace:
                            'nowrap',
                        }}
                      >
                        <p
                          title={formatDate(
                            log.createdAt,
                          )}
                          style={{
                            margin:
                              0,
                            color:
                              '#334155',
                            fontSize:
                              '11px',
                            fontWeight:
                              750,
                          }}
                        >
                          {formatDate(
                            log.createdAt,
                          )}
                        </p>

                        {relative && (
                          <p
                            style={{
                              margin:
                                '5px 0 0',
                              color:
                                '#94a3b8',
                              fontSize:
                                '10px',
                            }}
                          >
                            {
                              relative
                            }
                          </p>
                        )}
                      </td>

                      {showMetadata && (
                        <td
                          style={{
                            padding:
                              '16px 20px',
                            borderBottom:
                              '1px solid #f0f3f7',
                            verticalAlign:
                              'top',
                          }}
                        >
                          {hasMetadata(
                            log.metadata,
                          ) ? (
                            <MetadataDetails
                              metadata={
                                log.metadata
                              }
                            />
                          ) : (
                            <span
                              style={{
                                color:
                                  '#cbd5e1',
                                fontSize:
                                  '11px',
                              }}
                            >
                              No extra details
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {!loading &&
        filteredLogs.length >
          0 && (
          <div
            style={{
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'space-between',
              gap: '12px',
              flexWrap:
                'wrap',
              padding:
                '13px 20px',
              borderTop:
                '1px solid #eef2f7',
              background:
                '#fbfcfe',
              color:
                '#94a3b8',
              fontSize:
                '10px',
            }}
          >
            <span>
              Showing{' '}
              <strong
                style={{
                  color:
                    '#475569',
                }}
              >
                {
                  filteredLogs.length
                }
              </strong>{' '}
              audit{' '}
              {filteredLogs.length ===
              1
                ? 'event'
                : 'events'}
            </span>

            <span>
              Audit records are
              read-only.
            </span>
          </div>
        )}
    </section>
  );
}