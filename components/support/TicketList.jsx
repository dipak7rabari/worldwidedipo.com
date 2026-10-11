'use client';

import { useMemo, useState } from 'react';
import TicketStatus from './TicketStatus';

const CATEGORY_LABELS = {
  general: 'General',
  profile: 'Profile',
  payment: 'Payment',
  renewal: 'Renewal',
  technical: 'Technical',
  verification: 'Verification',
  other: 'Other',
};

const FILTERS = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'open',
    label: 'Open',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
  },
  {
    value: 'resolved',
    label: 'Resolved',
  },
  {
    value: 'closed',
    label: 'Closed',
  },
];

function safeText(value, fallback = '') {
  if (typeof value !== 'string') return fallback;

  return value.trim() || fallback;
}

function getCategoryLabel(category) {
  const normalized = safeText(category, 'general').toLowerCase();

  return CATEGORY_LABELS[normalized] || 'General';
}

function getStatusLabel(status) {
  const normalized = safeText(status, 'open').toLowerCase();

  switch (normalized) {
    case 'in_progress':
      return 'In Progress';

    case 'resolved':
      return 'Resolved';

    case 'closed':
      return 'Closed';

    case 'open':
    default:
      return 'Open';
  }
}

function formatDate(value) {
  if (!value) return 'Date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(value) {
  if (!value) return 'Date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getTicketNumber(id, index) {
  if (typeof id === 'string' && id.length >= 6) {
    return `#${id.slice(0, 8).toUpperCase()}`;
  }

  return `#${String(index + 1).padStart(2, '0')}`;
}

function normalizeTicket(ticket) {
  if (!ticket || typeof ticket !== 'object') {
    return null;
  }

  return {
    id: safeText(ticket.id),
    subject: safeText(ticket.subject, 'Support request'),
    message: safeText(ticket.message),
    category: safeText(ticket.category, 'general').toLowerCase(),
    status: safeText(ticket.status, 'open').toLowerCase(),
    adminReply: safeText(ticket.admin_reply),
    repliedAt: ticket.replied_at || null,
    resolvedAt: ticket.resolved_at || null,
    createdAt: ticket.created_at || null,
    updatedAt: ticket.updated_at || null,
  };
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="dipo-ticket-icon"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`dipo-ticket-chevron ${
        open ? 'dipo-ticket-chevron-open' : ''
      }`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="dipo-ticket-small-icon"
    >
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.5-.7L4 20l1.7-3.7A7.3 7.3 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="dipo-ticket-empty-icon"
    >
      <rect
        x="13"
        y="10"
        width="38"
        height="44"
        rx="7"
      />

      <path d="M22 23h20M22 31h15M22 39h11" />
    </svg>
  );
}

export default function TicketList({
  requests = [],
  tickets,
  loading = false,
  error = '',
  onRefresh,
  emptyTitle = 'No support requests yet',
  emptyDescription = 'When you contact Worldwide DIPO support, your requests will appear here.',
}) {
  const source = Array.isArray(tickets)
    ? tickets
    : Array.isArray(requests)
      ? requests
      : [];

  const normalizedTickets = useMemo(
    () =>
      source
        .map(normalizeTicket)
        .filter(Boolean),
    [source]
  );

  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return normalizedTickets.filter((ticket) => {
      const matchesFilter =
        activeFilter === 'all' ||
        ticket.status === activeFilter;

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        ticket.subject,
        ticket.message,
        ticket.category,
        ticket.status,
        ticket.adminReply,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [
    normalizedTickets,
    activeFilter,
    search,
  ]);

  const counts = useMemo(() => {
    return {
      all: normalizedTickets.length,

      open: normalizedTickets.filter(
        (ticket) => ticket.status === 'open'
      ).length,

      in_progress: normalizedTickets.filter(
        (ticket) => ticket.status === 'in_progress'
      ).length,

      resolved: normalizedTickets.filter(
        (ticket) => ticket.status === 'resolved'
      ).length,

      closed: normalizedTickets.filter(
        (ticket) => ticket.status === 'closed'
      ).length,
    };
  }, [normalizedTickets]);

  function toggleTicket(id) {
    if (!id) return;

    setExpandedId((current) =>
      current === id ? null : id
    );
  }

  function clearSearch() {
    setSearch('');
  }

  if (loading) {
    return (
      <section
        className="dipo-ticket-list"
        aria-label="Loading support requests"
      >
        <div className="dipo-ticket-list-header">
          <div>
            <div className="dipo-ticket-skeleton dipo-ticket-skeleton-title" />
            <div className="dipo-ticket-skeleton dipo-ticket-skeleton-copy" />
          </div>
        </div>

        <div className="dipo-ticket-skeleton-list">
          {[1, 2, 3].map((item) => (
            <div
              className="dipo-ticket-skeleton-card"
              key={item}
            >
              <div className="dipo-ticket-skeleton dipo-ticket-skeleton-line-lg" />
              <div className="dipo-ticket-skeleton dipo-ticket-skeleton-line" />
              <div className="dipo-ticket-skeleton dipo-ticket-skeleton-line-sm" />
            </div>
          ))}
        </div>

        <style jsx>{styles}</style>
      </section>
    );
  }

  return (
    <section
      className="dipo-ticket-list"
      aria-label="Support requests"
    >
      <div className="dipo-ticket-list-header">
        <div className="dipo-ticket-heading">
          <span className="dipo-ticket-eyebrow">
            SUPPORT CENTER
          </span>

          <h2>My support requests</h2>

          <p>
            Track your questions, payment issues and other requests
            from one place.
          </p>
        </div>

        {typeof onRefresh === 'function' && (
          <button
            type="button"
            className="dipo-ticket-refresh"
            onClick={onRefresh}
          >
            Refresh
          </button>
        )}
      </div>

      {error ? (
        <div
          className="dipo-ticket-error"
          role="alert"
        >
          <strong>
            Unable to load support requests.
          </strong>

          <span>
            {safeText(
              error,
              'Please try again in a moment.'
            )}
          </span>

          {typeof onRefresh === 'function' && (
            <button
              type="button"
              onClick={onRefresh}
            >
              Try again
            </button>
          )}
        </div>
      ) : null}

      {normalizedTickets.length > 0 && (
        <>
          <div className="dipo-ticket-toolbar">
            <div
              className="dipo-ticket-filters"
              role="tablist"
              aria-label="Filter support requests"
            >
              {FILTERS.map((filter) => {
                const active =
                  activeFilter === filter.value;

                return (
                  <button
                    type="button"
                    key={filter.value}
                    role="tab"
                    aria-selected={active}
                    className={`dipo-ticket-filter ${
                      active
                        ? 'dipo-ticket-filter-active'
                        : ''
                    }`}
                    onClick={() =>
                      setActiveFilter(filter.value)
                    }
                  >
                    <span>
                      {filter.label}
                    </span>

                    <strong>
                      {counts[filter.value]}
                    </strong>
                  </button>
                );
              })}
            </div>

            <div className="dipo-ticket-search">
              <SearchIcon />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search requests..."
                aria-label="Search support requests"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="dipo-ticket-search-clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="dipo-ticket-result-meta">
            <span>
              {filteredTickets.length}{' '}
              {filteredTickets.length === 1
                ? 'request'
                : 'requests'}
            </span>

            {search && (
              <span>
                matching “{search}”
              </span>
            )}
          </div>
        </>
      )}

      {normalizedTickets.length === 0 && !error ? (
        <div className="dipo-ticket-empty">
          <div className="dipo-ticket-empty-icon-wrap">
            <EmptyIcon />
          </div>

          <span className="dipo-ticket-eyebrow">
            SUPPORT
          </span>

          <h3>{emptyTitle}</h3>

          <p>{emptyDescription}</p>
        </div>
      ) : null}

      {normalizedTickets.length > 0 &&
      filteredTickets.length === 0 ? (
        <div className="dipo-ticket-empty dipo-ticket-empty-search">
          <div className="dipo-ticket-empty-icon-wrap">
            <SearchIcon />
          </div>

          <h3>No matching requests</h3>

          <p>
            Try another search term or change the selected
            status filter.
          </p>

          <button
            type="button"
            className="dipo-ticket-clear-button"
            onClick={() => {
              setSearch('');
              setActiveFilter('all');
            }}
          >
            Clear filters
          </button>
        </div>
      ) : null}

      <div className="dipo-ticket-items">
        {filteredTickets.map((ticket, index) => {
          const expanded =
            expandedId === ticket.id;

          const hasReply =
            Boolean(ticket.adminReply);

          const ticketNumber = getTicketNumber(
            ticket.id,
            index
          );

          return (
            <article
              className={`dipo-ticket-card ${
                expanded
                  ? 'dipo-ticket-card-expanded'
                  : ''
              }`}
              key={
                ticket.id ||
                `${ticket.subject}-${index}`
              }
            >
              <button
                type="button"
                className="dipo-ticket-card-trigger"
                onClick={() =>
                  toggleTicket(ticket.id)
                }
                aria-expanded={expanded}
                aria-controls={
                  ticket.id
                    ? `ticket-panel-${ticket.id}`
                    : undefined
                }
              >
                <div className="dipo-ticket-card-main">
                  <div className="dipo-ticket-ticket-number">
                    {ticketNumber}
                  </div>

                  <div className="dipo-ticket-card-copy">
                    <div className="dipo-ticket-card-meta">
                      <span>
                        {getCategoryLabel(
                          ticket.category
                        )}
                      </span>

                      <i aria-hidden="true">
                        •
                      </i>

                      <span>
                        {formatDate(
                          ticket.createdAt
                        )}
                      </span>
                    </div>

                    <h3>
                      {ticket.subject}
                    </h3>

                    <p>
                      {ticket.message}
                    </p>
                  </div>
                </div>

                <div className="dipo-ticket-card-side">
                  <TicketStatus
                    status={ticket.status}
                    compact
                  />

                  <ChevronIcon
                    open={expanded}
                  />
                </div>
              </button>

              {expanded && (
                <div
                  id={
                    ticket.id
                      ? `ticket-panel-${ticket.id}`
                      : undefined
                  }
                  className="dipo-ticket-expanded"
                >
                  <div className="dipo-ticket-details-grid">
                    <div className="dipo-ticket-detail">
                      <span>
                        Submitted
                      </span>

                      <strong>
                        {formatDateTime(
                          ticket.createdAt
                        )}
                      </strong>
                    </div>

                    <div className="dipo-ticket-detail">
                      <span>
                        Last updated
                      </span>

                      <strong>
                        {formatDateTime(
                          ticket.updatedAt
                        )}
                      </strong>
                    </div>

                    <div className="dipo-ticket-detail">
                      <span>
                        Category
                      </span>

                      <strong>
                        {getCategoryLabel(
                          ticket.category
                        )}
                      </strong>
                    </div>

                    <div className="dipo-ticket-detail">
                      <span>
                        Status
                      </span>

                      <strong>
                        {getStatusLabel(
                          ticket.status
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="dipo-ticket-message-block">
                    <div className="dipo-ticket-message-heading">
                      <MessageIcon />

                      <strong>
                        Your message
                      </strong>
                    </div>

                    <p>
                      {ticket.message ||
                        'No message available.'}
                    </p>
                  </div>

                  {hasReply ? (
                    <div className="dipo-ticket-support-reply">
                      <div className="dipo-ticket-reply-top">
                        <div>
                          <span>
                            WORLDWIDE DIPO
                            SUPPORT
                          </span>

                          <strong>
                            Support response
                          </strong>
                        </div>

                        {ticket.repliedAt && (
                          <time
                            dateTime={
                              ticket.repliedAt
                            }
                          >
                            {formatDateTime(
                              ticket.repliedAt
                            )}
                          </time>
                        )}
                      </div>

                      <p>
                        {ticket.adminReply}
                      </p>
                    </div>
                  ) : (
                    <div className="dipo-ticket-waiting">
                      <span
                        className="dipo-ticket-waiting-dot"
                        aria-hidden="true"
                      />

                      <div>
                        <strong>
                          Waiting for support
                        </strong>

                        <p>
                          Our team will respond here
                          when your request is reviewed.
                        </p>
                      </div>
                    </div>
                  )}

                  {ticket.resolvedAt && (
                    <div className="dipo-ticket-resolved-note">
                      Resolved on{' '}
                      {formatDateTime(
                        ticket.resolvedAt
                      )}
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <style jsx>{styles}</style>
    </section>
  );
}

const styles = `
  .dipo-ticket-list {
    width: 100%;
    color: #111827;
  }

  .dipo-ticket-list-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 24px;
  }

  .dipo-ticket-heading {
    min-width: 0;
  }

  .dipo-ticket-eyebrow {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    color: #6b7280;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.14em;
    line-height: 1;
  }

  .dipo-ticket-heading h2 {
    margin: 7px 0 7px;
    color: #0b0d10;
    font-size: clamp(22px, 3vw, 32px);
    font-weight: 800;
    letter-spacing: -0.045em;
    line-height: 1.05;
  }

  .dipo-ticket-heading p {
    max-width: 650px;
    margin: 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.65;
  }

  .dipo-ticket-refresh {
    flex: 0 0 auto;
    min-height: 40px;
    padding: 0 15px;
    border: 1px solid #e5e7eb;
    border-radius: 11px;
    background: #fff;
    color: #111827;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .dipo-ticket-refresh:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  .dipo-ticket-error {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 14px;
    margin-bottom: 18px;
    padding: 14px 16px;
    border: 1px solid #fecaca;
    border-radius: 14px;
    background: #fff7f7;
    color: #991b1b;
    font-size: 13px;
  }

  .dipo-ticket-error span {
    color: #7f1d1d;
  }

  .dipo-ticket-error button {
    margin-left: auto;
    border: 0;
    background: transparent;
    color: #991b1b;
    font-weight: 800;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .dipo-ticket-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }

  .dipo-ticket-filters {
    display: flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .dipo-ticket-filters::-webkit-scrollbar {
    display: none;
  }

  .dipo-ticket-filter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 36px;
    padding: 0 11px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    color: #6b7280;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
  }

  .dipo-ticket-filter strong {
    min-width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    border-radius: 999px;
    background: #f3f4f6;
    color: #6b7280;
    font-size: 10px;
  }

  .dipo-ticket-filter:hover {
    background: #f9fafb;
    color: #111827;
  }

  .dipo-ticket-filter-active {
    border-color: #e5e7eb;
    background: #fff;
    color: #111827;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.035);
  }

  .dipo-ticket-filter-active strong {
    background: #111827;
    color: #fff;
  }

  .dipo-ticket-search {
    position: relative;
    display: flex;
    align-items: center;
    flex: 0 1 250px;
    min-width: 190px;
  }

  .dipo-ticket-search input {
    width: 100%;
    min-height: 38px;
    padding: 0 35px 0 37px;
    border: 1px solid #e5e7eb;
    border-radius: 11px;
    outline: none;
    background: #fff;
    color: #111827;
    font-size: 12px;
  }

  .dipo-ticket-search input::placeholder {
    color: #9ca3af;
  }

  .dipo-ticket-search input:focus {
    border-color: #9ca3af;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
  }

  .dipo-ticket-icon {
    position: absolute;
    left: 13px;
    width: 16px;
    height: 16px;
    fill: none;
    stroke: #9ca3af;
    stroke-width: 1.8;
    pointer-events: none;
  }

  .dipo-ticket-search-clear {
    position: absolute;
    right: 7px;
    width: 25px;
    height: 25px;
    border: 0;
    border-radius: 7px;
    background: #f3f4f6;
    color: #6b7280;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
  }

  .dipo-ticket-result-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 25px;
    margin-bottom: 8px;
    color: #9ca3af;
    font-size: 11px;
  }

  .dipo-ticket-result-meta span + span::before {
    content: '•';
    margin-right: 8px;
  }

  .dipo-ticket-items {
    display: grid;
    gap: 10px;
  }

  .dipo-ticket-card {
    overflow: hidden;
    border: 1px solid #e8eaed;
    border-radius: 17px;
    background: #fff;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.025);
  }

  .dipo-ticket-card-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    width: 100%;
    padding: 18px;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }

  .dipo-ticket-card-trigger:hover {
    background: #fcfcfc;
  }

  .dipo-ticket-card-main {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    min-width: 0;
  }

  .dipo-ticket-ticket-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    min-width: 48px;
    height: 31px;
    padding: 0 8px;
    border: 1px solid #eef0f2;
    border-radius: 9px;
    background: #f8f9fa;
    color: #6b7280;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .dipo-ticket-card-copy {
    min-width: 0;
  }

  .dipo-ticket-card-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 6px;
    color: #9ca3af;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .dipo-ticket-card-copy h3 {
    overflow: hidden;
    margin: 0 0 5px;
    color: #111827;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dipo-ticket-card-copy p {
    display: -webkit-box;
    overflow: hidden;
    max-width: 720px;
    margin: 0;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.55;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .dipo-ticket-card-side {
    display: flex;
    align-items: center;
    gap: 11px;
    flex: 0 0 auto;
  }

  .dipo-ticket-chevron {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: #9ca3af;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
    transition: transform 180ms ease;
  }

  .dipo-ticket-chevron-open {
    transform: rotate(180deg);
  }

  .dipo-ticket-expanded {
    padding: 0 18px 18px;
    border-top: 1px solid #f0f1f2;
  }

  .dipo-ticket-details-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
    padding: 16px 0;
  }

  .dipo-ticket-detail {
    min-width: 0;
    padding: 11px 12px;
    border: 1px solid #f0f1f2;
    border-radius: 11px;
    background: #fafafa;
  }

  .dipo-ticket-detail span {
    display: block;
    margin-bottom: 5px;
    color: #9ca3af;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .dipo-ticket-detail strong {
    display: block;
    overflow: hidden;
    color: #374151;
    font-size: 11px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dipo-ticket-message-block {
    padding: 15px;
    border: 1px solid #eef0f2;
    border-radius: 13px;
    background: #fafafa;
  }

  .dipo-ticket-message-heading {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 9px;
    color: #374151;
    font-size: 11px;
  }

  .dipo-ticket-small-icon {
    width: 15px;
    height: 15px;
    flex: 0 0 15px;
    fill: none;
    stroke: #6b7280;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.6;
  }

  .dipo-ticket-message-block p {
    margin: 0;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .dipo-ticket-support-reply {
    margin-top: 10px;
    padding: 16px;
    border: 1px solid #d1fae5;
    border-radius: 13px;
    background: #f0fdf4;
  }

  .dipo-ticket-reply-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 10px;
  }

  .dipo-ticket-reply-top > div {
    display: grid;
    gap: 3px;
  }

  .dipo-ticket-reply-top span {
    color: #047857;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.1em;
  }

  .dipo-ticket-reply-top strong {
    color: #064e3b;
    font-size: 12px;
  }

  .dipo-ticket-reply-top time {
    color: #6b7280;
    font-size: 10px;
    white-space: nowrap;
  }

  .dipo-ticket-support-reply p {
    margin: 0;
    color: #374151;
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .dipo-ticket-waiting {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 10px;
    padding: 13px 14px;
    border: 1px solid #f3f4f6;
    border-radius: 12px;
    background: #fafafa;
  }

  .dipo-ticket-waiting-dot {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    margin-top: 5px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
  }

  .dipo-ticket-waiting strong {
    display: block;
    margin-bottom: 3px;
    color: #374151;
    font-size: 12px;
  }

  .dipo-ticket-waiting p {
    margin: 0;
    color: #6b7280;
    font-size: 11px;
    line-height: 1.55;
  }

  .dipo-ticket-resolved-note {
    margin-top: 10px;
    color: #9ca3af;
    font-size: 10px;
  }

  .dipo-ticket-empty {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    min-height: 260px;
    padding: 38px 22px;
    border: 1px dashed #dfe3e7;
    border-radius: 18px;
    background: #fcfcfc;
    text-align: center;
  }

  .dipo-ticket-empty-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    margin-bottom: 16px;
    border: 1px solid #eceff1;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.035);
  }

  .dipo-ticket-empty-icon {
    width: 27px;
    height: 27px;
    fill: none;
    stroke: #9ca3af;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
  }

  .dipo-ticket-empty h3 {
    margin: 7px 0 7px;
    color: #111827;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.025em;
  }

  .dipo-ticket-empty p {
    max-width: 430px;
    margin: 0;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.65;
  }

  .dipo-ticket-empty-search {
    min-height: 220px;
  }

  .dipo-ticket-empty-search .dipo-ticket-empty-icon-wrap {
    color: #6b7280;
  }

  .dipo-ticket-clear-button {
    margin-top: 15px;
    min-height: 36px;
    padding: 0 13px;
    border: 1px solid #e5e7eb;
    border-radius: 9px;
    background: #fff;
    color: #374151;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }

  .dipo-ticket-clear-button:hover {
    background: #f9fafb;
  }

  .dipo-ticket-skeleton-list {
    display: grid;
    gap: 10px;
  }

  .dipo-ticket-skeleton-card {
    padding: 19px;
    border: 1px solid #eef0f2;
    border-radius: 17px;
    background: #fff;
  }

  .dipo-ticket-skeleton {
    position: relative;
    overflow: hidden;
    border-radius: 7px;
    background: #f1f3f5;
  }

  .dipo-ticket-skeleton::after {
    position: absolute;
    inset: 0;
    content: '';
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.7),
      transparent
    );
    animation: dipo-ticket-shimmer 1.35s infinite;
  }

  .dipo-ticket-skeleton-title {
    width: 190px;
    height: 28px;
    margin-bottom: 9px;
  }

  .dipo-ticket-skeleton-copy {
    width: 330px;
    max-width: 80%;
    height: 14px;
  }

  .dipo-ticket-skeleton-line-lg {
    width: 42%;
    height: 17px;
    margin-bottom: 12px;
  }

  .dipo-ticket-skeleton-line {
    width: 78%;
    height: 11px;
    margin-bottom: 8px;
  }

  .dipo-ticket-skeleton-line-sm {
    width: 55%;
    height: 10px;
  }

  @keyframes dipo-ticket-shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dipo-ticket-skeleton::after {
      animation: none;
    }

    .dipo-ticket-chevron {
      transition: none;
    }
  }

  @media (max-width: 760px) {
    .dipo-ticket-list-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .dipo-ticket-refresh {
      width: 100%;
    }

    .dipo-ticket-toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .dipo-ticket-search {
      flex: none;
      width: 100%;
    }

    .dipo-ticket-details-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 560px) {
    .dipo-ticket-card-trigger {
      align-items: flex-start;
      padding: 15px;
    }

    .dipo-ticket-card-main {
      gap: 10px;
    }

    .dipo-ticket-ticket-number {
      display: none;
    }

    .dipo-ticket-card-side {
      gap: 6px;
    }

    .dipo-ticket-card-copy h3 {
      white-space: normal;
    }

    .dipo-ticket-card-copy p {
      -webkit-line-clamp: 3;
    }

    .dipo-ticket-expanded {
      padding: 0 15px 15px;
    }

    .dipo-ticket-details-grid {
      grid-template-columns: 1fr;
    }

    .dipo-ticket-reply-top {
      flex-direction: column;
    }
  }

  @media (max-width: 430px) {
    .dipo-ticket-filters {
      width: 100%;
      padding-bottom: 2px;
    }

    .dipo-ticket-filter {
      flex: 0 0 auto;
    }

    .dipo-ticket-result-meta {
      margin-top: 2px;
    }
  }
`;