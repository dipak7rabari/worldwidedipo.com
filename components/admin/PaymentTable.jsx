'use client';

import { useMemo, useState } from 'react';

/**
 * WORLDWIDE DIPO
 * Admin Payment Table
 *
 * Production-grade admin UI:
 * - Responsive desktop table + mobile cards
 * - Search
 * - Status filter
 * - Payment type filter
 * - Safe formatting
 * - No external dependencies
 * - No admin secrets exposed
 * - Callback-based row actions
 * - Works with the existing payment object shape
 *
 * Expected payment object:
 * {
 *   id,
 *   profile_id,
 *   payment_type,
 *   plan,
 *   amount,
 *   payment_reference,
 *   status,
 *   payer_name,
 *   slug_snapshot,
 *   plan_snapshot,
 *   created_at,
 *   verified_at,
 *   notes
 * }
 */

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  'all',
  'pending',
  'approved',
  'rejected',
  'failed',
];

const PAYMENT_TYPE_OPTIONS = [
  'all',
  'new',
  'renewal',
  'upgrade',
];


// ============================================================
// SAFE HELPERS
// ============================================================

function safeString(value, fallback = '') {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value).trim();
}


function normalizeStatus(value) {
  return safeString(
    value,
    'unknown',
  ).toLowerCase();
}


function normalizePaymentType(value) {
  return safeString(
    value,
    'unknown',
  ).toLowerCase();
}


function normalizePlan(value) {
  return safeString(
    value,
    '—',
  );
}


function truncate(value, length = 28) {
  const text = safeString(value);

  if (!text) {
    return '—';
  }

  if (text.length <= length) {
    return text;
  }

  return `${text.slice(0, length)}…`;
}


function formatAmount(value) {
  const amount =
    Number(value);

  if (
    !Number.isFinite(amount)
  ) {
    return '—';
  }

  try {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      },
    ).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
}


function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '—';
  }

  try {
    return new Intl.DateTimeFormat(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    ).format(date);
  } catch {
    return date.toLocaleString();
  }
}


function formatRelativeDate(value) {
  if (!value) {
    return '';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  const diff =
    Date.now() -
    date.getTime();

  const seconds =
    Math.floor(diff / 1000);

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

  if (days < 30) {
    return `${days}d ago`;
  }

  const months =
    Math.floor(
      days / 30,
    );

  if (months < 12) {
    return `${months}mo ago`;
  }

  const years =
    Math.floor(
      months / 12,
    );

  return `${years}y ago`;
}


function getStatusMeta(status) {
  switch (
    normalizeStatus(status)
  ) {
    case 'approved':
      return {
        label: 'Approved',
        tone: 'success',
        icon: '✓',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        tone: 'danger',
        icon: '×',
      };

    case 'pending':
      return {
        label: 'Pending',
        tone: 'warning',
        icon: '•',
      };

    case 'failed':
      return {
        label: 'Failed',
        tone: 'danger',
        icon: '!',
      };

    default:
      return {
        label:
          safeString(
            status,
            'Unknown',
          ),
        tone: 'neutral',
        icon: '—',
      };
  }
}


function getPaymentTypeLabel(
  type,
) {
  switch (
    normalizePaymentType(type)
  ) {
    case 'new':
      return 'New profile';

    case 'renewal':
      return 'Renewal';

    case 'upgrade':
      return 'Upgrade';

    default:
      return safeString(
        type,
        'Payment',
      );
  }
}


function getInitials(
  name,
) {
  const clean =
    safeString(name);

  if (!clean) {
    return 'WD';
  }

  const parts =
    clean
      .split(/\s+/)
      .filter(Boolean);

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`
    .toUpperCase();
}


function isObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}


// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  status,
}) {
  const meta =
    getStatusMeta(status);

  return (
    <span
      className={`payment-table-status payment-table-status-${meta.tone}`}
    >
      <span
        className="payment-table-status-icon"
        aria-hidden="true"
      >
        {meta.icon}
      </span>

      <span>
        {meta.label}
      </span>
    </span>
  );
}


// ============================================================
// PAYMENT TYPE BADGE
// ============================================================

function PaymentTypeBadge({
  type,
}) {
  return (
    <span className="payment-table-type">
      {getPaymentTypeLabel(type)}
    </span>
  );
}


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function PaymentTable({
  payments = [],
  loading = false,
  error = '',
  title = 'Payments',
  subtitle = 'Review and manage payment activity.',
  onSelect,
  onView,
  onRefresh,
  emptyTitle = 'No payments found',
  emptyDescription =
    'There are no payment records matching the current filters.',
  pageSize = DEFAULT_PAGE_SIZE,
}) {
  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('all');

  const [typeFilter, setTypeFilter] =
    useState('all');

  const [page, setPage] =
    useState(1);

  const safePayments =
    useMemo(() => {
      if (
        !Array.isArray(
          payments,
        )
      ) {
        return [];
      }

      return payments.filter(
        isObject,
      );
    }, [payments]);

  // ----------------------------------------------------------
  // FILTER
  // ----------------------------------------------------------

  const filteredPayments =
    useMemo(() => {
      const query =
        safeString(
          search,
        ).toLowerCase();

      return safePayments.filter(
        (payment) => {
          const status =
            normalizeStatus(
              payment.status,
            );

          const type =
            normalizePaymentType(
              payment.payment_type,
            );

          const matchesStatus =
            statusFilter ===
              'all' ||
            status ===
              statusFilter;

          const matchesType =
            typeFilter ===
              'all' ||
            type ===
              typeFilter;

          if (
            !matchesStatus ||
            !matchesType
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          const searchable =
            [
              payment.id,
              payment.profile_id,
              payment.payer_name,
              payment.slug_snapshot,
              payment.plan_snapshot,
              payment.plan,
              payment.payment_reference,
              payment.payment_type,
              payment.status,
            ]
              .map(
                (value) =>
                  safeString(
                    value,
                  ).toLowerCase(),
              )
              .join(' ');

          return searchable.includes(
            query,
          );
        },
      );
    }, [
      safePayments,
      search,
      statusFilter,
      typeFilter,
    ]);

  // ----------------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------------

  const safePageSize =
    Number.isInteger(
      pageSize,
    ) &&
    pageSize > 0
      ? Math.min(
          pageSize,
          100,
        )
      : DEFAULT_PAGE_SIZE;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredPayments.length /
          safePageSize,
      ),
    );

  const safePage =
    Math.min(
      Math.max(
        1,
        page,
      ),
      totalPages,
    );

  const paginatedPayments =
    useMemo(() => {
      const start =
        (safePage - 1) *
        safePageSize;

      return filteredPayments.slice(
        start,
        start + safePageSize,
      );
    }, [
      filteredPayments,
      safePage,
      safePageSize,
    ]);

  // ----------------------------------------------------------
  // COUNTS
  // ----------------------------------------------------------

  const counts =
    useMemo(() => {
      const result = {
        total: safePayments.length,
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      safePayments.forEach(
        (payment) => {
          const status =
            normalizeStatus(
              payment.status,
            );

          if (
            status ===
            'pending'
          ) {
            result.pending += 1;
          }

          if (
            status ===
            'approved'
          ) {
            result.approved += 1;
          }

          if (
            status ===
            'rejected'
          ) {
            result.rejected += 1;
          }
        },
      );

      return result;
    }, [safePayments]);

  // ----------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------

  function handleSearchChange(
    event,
  ) {
    setSearch(
      event.target.value,
    );
    setPage(1);
  }


  function handleStatusChange(
    event,
  ) {
    setStatusFilter(
      event.target.value,
    );
    setPage(1);
  }


  function handleTypeChange(
    event,
  ) {
    setTypeFilter(
      event.target.value,
    );
    setPage(1);
  }


  function handleClearFilters() {
    setSearch('');
    setStatusFilter(
      'all',
    );
    setTypeFilter(
      'all',
    );
    setPage(1);
  }


  function handleRowSelect(
    payment,
  ) {
    if (
      typeof onSelect ===
      'function'
    ) {
      onSelect(payment);
    }
  }


  function handleView(
    payment,
  ) {
    if (
      typeof onView ===
      'function'
    ) {
      onView(payment);
      return;
    }

    if (
      typeof onSelect ===
      'function'
    ) {
      onSelect(payment);
    }
  }


  const hasFilters =
    Boolean(
      search ||
        statusFilter !==
          'all' ||
        typeFilter !==
          'all',
    );

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <section className="payment-table-shell">
      <style>{`
        .payment-table-shell {
          width: 100%;
          color: #0f172a;
        }

        .payment-table-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .payment-table-heading {
          min-width: 0;
        }

        .payment-table-title {
          margin: 0;
          font-size: clamp(20px, 2.4vw, 28px);
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: -0.045em;
        }

        .payment-table-subtitle {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .payment-table-refresh {
          min-height: 40px;
          padding: 0 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          color: #0f172a;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            background 160ms ease;
        }

        .payment-table-refresh:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .payment-table-refresh:focus-visible,
        .payment-table-input:focus-visible,
        .payment-table-select:focus-visible,
        .payment-table-view:focus-visible,
        .payment-table-page-button:focus-visible {
          outline: 3px solid rgba(16, 185, 129, 0.22);
          outline-offset: 2px;
        }

        .payment-table-summary {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }

        .payment-table-stat {
          min-width: 0;
          padding: 15px 16px;
          border: 1px solid #e8edf3;
          border-radius: 16px;
          background: #ffffff;
          box-shadow:
            0 8px 28px rgba(15, 23, 42, 0.035);
        }

        .payment-table-stat-label {
          display: block;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .payment-table-stat-value {
          display: block;
          margin-top: 5px;
          font-size: 21px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.035em;
        }

        .payment-table-toolbar {
          display: grid;
          grid-template-columns:
            minmax(220px, 1fr)
            minmax(150px, 180px)
            minmax(150px, 180px)
            auto;
          gap: 10px;
          align-items: center;
          margin-bottom: 14px;
          padding: 12px;
          border: 1px solid #e8edf3;
          border-radius: 18px;
          background: #f8fafc;
        }

        .payment-table-search {
          position: relative;
          min-width: 0;
        }

        .payment-table-search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          width: 14px;
          height: 14px;
          border: 1.8px solid #94a3b8;
          border-radius: 50%;
          transform: translateY(-58%);
          pointer-events: none;
        }

        .payment-table-search-icon::after {
          content: "";
          position: absolute;
          right: -4px;
          bottom: -3px;
          width: 6px;
          height: 1.8px;
          border-radius: 999px;
          background: #94a3b8;
          transform: rotate(45deg);
          transform-origin: left center;
        }

        .payment-table-input,
        .payment-table-select {
          width: 100%;
          min-height: 42px;
          border: 1px solid #dfe6ee;
          border-radius: 12px;
          background: #ffffff;
          color: #0f172a;
          font: inherit;
          font-size: 12px;
          outline: none;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        .payment-table-input {
          padding: 0 13px 0 38px;
        }

        .payment-table-select {
          padding: 0 12px;
        }

        .payment-table-input:focus,
        .payment-table-select:focus {
          border-color: #94a3b8;
          box-shadow:
            0 0 0 3px rgba(15, 23, 42, 0.045);
        }

        .payment-table-clear {
          min-height: 42px;
          padding: 0 13px;
          border: 1px solid #dfe6ee;
          border-radius: 12px;
          background: #ffffff;
          color: #475569;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .payment-table-clear:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .payment-table-card {
          overflow: hidden;
          border: 1px solid #e8edf3;
          border-radius: 22px;
          background: #ffffff;
          box-shadow:
            0 18px 55px rgba(15, 23, 42, 0.045);
        }

        .payment-table-scroll {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .payment-table {
          width: 100%;
          min-width: 980px;
          border-collapse: collapse;
          border-spacing: 0;
        }

        .payment-table th {
          padding: 13px 17px;
          background: #fafbfc;
          border-bottom: 1px solid #edf1f5;
          color: #64748b;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.09em;
          line-height: 1.2;
          text-align: left;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .payment-table td {
          padding: 15px 17px;
          border-bottom: 1px solid #f1f4f7;
          vertical-align: middle;
          font-size: 12px;
        }

        .payment-table tbody tr {
          transition:
            background 140ms ease;
        }

        .payment-table tbody tr:hover {
          background: #fbfdfc;
        }

        .payment-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .payment-table-person {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 170px;
        }

        .payment-table-avatar {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          border-radius: 12px;
          background: #f1f5f9;
          color: #334155;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .payment-table-person-name {
          min-width: 0;
          color: #0f172a;
          font-size: 12px;
          font-weight: 850;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .payment-table-person-slug {
          margin-top: 3px;
          color: #94a3b8;
          font-size: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .payment-table-reference {
          max-width: 150px;
          color: #475569;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: 10px;
          word-break: break-all;
        }

        .payment-table-amount {
          color: #0f172a;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .payment-table-plan {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 9px;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          background: #f8fafc;
          color: #334155;
          font-size: 10px;
          font-weight: 850;
          white-space: nowrap;
        }

        .payment-table-type {
          display: inline-flex;
          align-items: center;
          min-height: 25px;
          padding: 0 8px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #475569;
          font-size: 9px;
          font-weight: 850;
          white-space: nowrap;
        }

        .payment-table-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 27px;
          padding: 0 9px;
          border: 1px solid transparent;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
          white-space: nowrap;
        }

        .payment-table-status-icon {
          display: grid;
          place-items: center;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          font-size: 9px;
          font-weight: 900;
        }

        .payment-table-status-success {
          border-color: #bbf7d0;
          background: #f0fdf4;
          color: #166534;
        }

        .payment-table-status-success
          .payment-table-status-icon {
          background: #dcfce7;
        }

        .payment-table-status-danger {
          border-color: #fecaca;
          background: #fef2f2;
          color: #991b1b;
        }

        .payment-table-status-danger
          .payment-table-status-icon {
          background: #fee2e2;
        }

        .payment-table-status-warning {
          border-color: #fde68a;
          background: #fffbeb;
          color: #92400e;
        }

        .payment-table-status-warning
          .payment-table-status-icon {
          background: #fef3c7;
        }

        .payment-table-status-neutral {
          border-color: #e2e8f0;
          background: #f8fafc;
          color: #475569;
        }

        .payment-table-date {
          color: #475569;
          white-space: nowrap;
        }

        .payment-table-date-main {
          display: block;
          font-size: 11px;
          font-weight: 700;
        }

        .payment-table-date-relative {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 9px;
        }

        .payment-table-view {
          min-height: 32px;
          padding: 0 10px;
          border: 1px solid #dfe6ee;
          border-radius: 9px;
          background: #ffffff;
          color: #0f172a;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
          white-space: nowrap;
          transition:
            background 140ms ease,
            border-color 140ms ease,
            transform 140ms ease;
        }

        .payment-table-view:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .payment-table-mobile {
          display: none;
        }

        .payment-table-mobile-card {
          padding: 16px;
          border-bottom: 1px solid #eef2f7;
        }

        .payment-table-mobile-card:last-child {
          border-bottom: 0;
        }

        .payment-table-mobile-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .payment-table-mobile-person {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .payment-table-mobile-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 14px;
        }

        .payment-table-mobile-item {
          min-width: 0;
          padding: 10px;
          border: 1px solid #eef2f7;
          border-radius: 12px;
          background: #fafbfc;
        }

        .payment-table-mobile-label {
          display: block;
          margin-bottom: 4px;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .payment-table-mobile-value {
          display: block;
          color: #334155;
          font-size: 11px;
          font-weight: 750;
          overflow-wrap: anywhere;
        }

        .payment-table-mobile-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 12px;
        }

        .payment-table-empty {
          padding: 70px 22px;
          text-align: center;
        }

        .payment-table-empty-icon {
          display: grid;
          place-items: center;
          width: 54px;
          height: 54px;
          margin: 0 auto 14px;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          background: #f8fafc;
          color: #64748b;
          font-size: 20px;
          font-weight: 900;
        }

        .payment-table-empty-title {
          margin: 0;
          color: #0f172a;
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .payment-table-empty-text {
          max-width: 450px;
          margin: 7px auto 0;
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.6;
        }

        .payment-table-error {
          padding: 18px;
          border: 1px solid #fecaca;
          border-radius: 16px;
          background: #fff7f7;
          color: #991b1b;
          font-size: 12px;
          line-height: 1.6;
        }

        .payment-table-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 16px;
          border-top: 1px solid #eef2f7;
          background: #fbfcfd;
        }

        .payment-table-pagination-info {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 700;
        }

        .payment-table-pagination-actions {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .payment-table-page-button {
          display: grid;
          place-items: center;
          min-width: 31px;
          height: 31px;
          padding: 0 8px;
          border: 1px solid #dfe6ee;
          border-radius: 8px;
          background: #ffffff;
          color: #475569;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
        }

        .payment-table-page-button:hover:not(:disabled) {
          background: #f1f5f9;
          color: #0f172a;
        }

        .payment-table-page-button:disabled {
          opacity: 0.42;
          cursor: not-allowed;
        }

        .payment-table-page-current {
          border-color: #0f172a;
          background: #0f172a;
          color: #ffffff;
        }

        .payment-table-skeleton {
          height: 58px;
          margin: 1px 0;
          background:
            linear-gradient(
              90deg,
              #f8fafc 25%,
              #eef2f7 37%,
              #f8fafc 63%
            );
          background-size: 400% 100%;
          animation:
            payment-table-shimmer
            1.4s ease infinite;
        }

        @keyframes payment-table-shimmer {
          0% {
            background-position: 100% 0;
          }

          100% {
            background-position: -100% 0;
          }
        }

        @media (max-width: 900px) {
          .payment-table-summary {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .payment-table-toolbar {
            grid-template-columns:
              1fr 1fr;
          }

          .payment-table-search {
            grid-column: 1 / -1;
          }

          .payment-table-clear {
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .payment-table-head {
            align-items: stretch;
            margin-bottom: 14px;
          }

          .payment-table-refresh {
            width: 100%;
          }

          .payment-table-summary {
            gap: 8px;
          }

          .payment-table-stat {
            padding: 13px;
            border-radius: 14px;
          }

          .payment-table-stat-value {
            font-size: 19px;
          }

          .payment-table-toolbar {
            grid-template-columns: 1fr;
            padding: 10px;
            border-radius: 15px;
          }

          .payment-table-search {
            grid-column: auto;
          }

          .payment-table-card {
            border-radius: 17px;
          }

          .payment-table-scroll {
            display: none;
          }

          .payment-table-mobile {
            display: block;
          }

          .payment-table-pagination {
            align-items: flex-start;
            flex-direction: column;
          }

          .payment-table-pagination-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .payment-table-refresh,
          .payment-table-view,
          .payment-table tbody tr {
            transition: none;
          }

          .payment-table-skeleton {
            animation: none;
          }
        }
      `}</style>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="payment-table-head">
        <div className="payment-table-heading">
          <h2 className="payment-table-title">
            {title}
          </h2>

          <p className="payment-table-subtitle">
            {subtitle}
          </p>
        </div>

        {typeof onRefresh ===
          'function' && (
          <button
            type="button"
            className="payment-table-refresh"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading
              ? 'Refreshing…'
              : '↻ Refresh'}
          </button>
        )}
      </div>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="payment-table-summary">
        <div className="payment-table-stat">
          <span className="payment-table-stat-label">
            Total
          </span>

          <span className="payment-table-stat-value">
            {counts.total}
          </span>
        </div>

        <div className="payment-table-stat">
          <span className="payment-table-stat-label">
            Pending
          </span>

          <span className="payment-table-stat-value">
            {counts.pending}
          </span>
        </div>

        <div className="payment-table-stat">
          <span className="payment-table-stat-label">
            Approved
          </span>

          <span className="payment-table-stat-value">
            {counts.approved}
          </span>
        </div>

        <div className="payment-table-stat">
          <span className="payment-table-stat-label">
            Rejected
          </span>

          <span className="payment-table-stat-value">
            {counts.rejected}
          </span>
        </div>
      </div>

      {/* ======================================================
          FILTER TOOLBAR
      ====================================================== */}

      <div className="payment-table-toolbar">
        <div className="payment-table-search">
          <span
            className="payment-table-search-icon"
            aria-hidden="true"
          />

          <input
            type="search"
            className="payment-table-input"
            value={search}
            onChange={
              handleSearchChange
            }
            placeholder="Search payer, UTR, slug or payment ID…"
            aria-label="Search payments"
            maxLength={120}
          />
        </div>

        <select
          className="payment-table-select"
          value={statusFilter}
          onChange={
            handleStatusChange
          }
          aria-label="Filter by payment status"
        >
          {STATUS_OPTIONS.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status === 'all'
                  ? 'All statuses'
                  : status
                      .charAt(0)
                      .toUpperCase() +
                    status.slice(1)}
              </option>
            ),
          )}
        </select>

        <select
          className="payment-table-select"
          value={typeFilter}
          onChange={
            handleTypeChange
          }
          aria-label="Filter by payment type"
        >
          {PAYMENT_TYPE_OPTIONS.map(
            (type) => (
              <option
                key={type}
                value={type}
              >
                {type === 'all'
                  ? 'All payment types'
                  : getPaymentTypeLabel(
                      type,
                    )}
              </option>
            ),
          )}
        </select>

        <button
          type="button"
          className="payment-table-clear"
          onClick={
            handleClearFilters
          }
          disabled={!hasFilters}
        >
          Clear
        </button>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error ? (
        <div
          className="payment-table-error"
          role="alert"
        >
          {safeString(
            error,
            'Unable to load payments.',
          )}
        </div>
      ) : (
        <div className="payment-table-card">
          {/* ==================================================
              DESKTOP TABLE
          ================================================== */}

          <div className="payment-table-scroll">
            {loading ? (
              <div
                aria-label="Loading payments"
                aria-busy="true"
              >
                {Array.from({
                  length: 6,
                }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="payment-table-skeleton"
                    />
                  ),
                )}
              </div>
            ) : paginatedPayments.length ===
              0 ? (
              <div className="payment-table-empty">
                <div className="payment-table-empty-icon">
                  {hasFilters
                    ? '⌕'
                    : '₹'}
                </div>

                <h3 className="payment-table-empty-title">
                  {hasFilters
                    ? 'No matching payments'
                    : emptyTitle}
                </h3>

                <p className="payment-table-empty-text">
                  {hasFilters
                    ? 'Try changing your search or filters.'
                    : emptyDescription}
                </p>
              </div>
            ) : (
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>
                      Payer
                    </th>

                    <th>
                      Payment
                    </th>

                    <th>
                      Plan
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Reference
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Created
                    </th>

                    <th>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedPayments.map(
                    (
                      payment,
                    ) => {
                      const id =
                        safeString(
                          payment.id,
                        );

                      return (
                        <tr
                          key={
                            id ||
                            `${payment.profile_id}-${payment.created_at}`
                          }
                        >
                          <td>
                            <div className="payment-table-person">
                              <div
                                className="payment-table-avatar"
                                aria-hidden="true"
                              >
                                {getInitials(
                                  payment.payer_name,
                                )}
                              </div>

                              <div
                                style={{
                                  minWidth: 0,
                                }}
                              >
                                <div className="payment-table-person-name">
                                  {safeString(
                                    payment.payer_name,
                                    'Unknown payer',
                                  )}
                                </div>

                                <div className="payment-table-person-slug">
                                  {payment.slug_snapshot
                                    ? `/${truncate(
                                        payment.slug_snapshot,
                                        24,
                                      )}`
                                    : 'No profile slug'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <PaymentTypeBadge
                              type={
                                payment.payment_type
                              }
                            />
                          </td>

                          <td>
                            <span className="payment-table-plan">
                              {normalizePlan(
                                payment.plan_snapshot ||
                                  payment.plan,
                              )}
                            </span>
                          </td>

                          <td>
                            <span className="payment-table-amount">
                              {formatAmount(
                                payment.amount,
                              )}
                            </span>
                          </td>

                          <td>
                            <span
                              className="payment-table-reference"
                              title={safeString(
                                payment.payment_reference,
                              )}
                            >
                              {truncate(
                                payment.payment_reference,
                                25,
                              )}
                            </span>
                          </td>

                          <td>
                            <StatusBadge
                              status={
                                payment.status
                              }
                            />
                          </td>

                          <td>
                            <div className="payment-table-date">
                              <span className="payment-table-date-main">
                                {formatDate(
                                  payment.created_at,
                                )}
                              </span>

                              <span className="payment-table-date-relative">
                                {formatRelativeDate(
                                  payment.created_at,
                                )}
                              </span>
                            </div>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="payment-table-view"
                              onClick={() =>
                                handleView(
                                  payment,
                                )
                              }
                              disabled={
                                typeof onView !==
                                  'function' &&
                                typeof onSelect !==
                                  'function'
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* ==================================================
              MOBILE CARDS
          ================================================== */}

          <div className="payment-table-mobile">
            {loading ? (
              <div
                aria-label="Loading payments"
                aria-busy="true"
              >
                {Array.from({
                  length: 4,
                }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="payment-table-skeleton"
                    />
                  ),
                )}
              </div>
            ) : paginatedPayments.length ===
              0 ? (
              <div className="payment-table-empty">
                <div className="payment-table-empty-icon">
                  {hasFilters
                    ? '⌕'
                    : '₹'}
                </div>

                <h3 className="payment-table-empty-title">
                  {hasFilters
                    ? 'No matching payments'
                    : emptyTitle}
                </h3>

                <p className="payment-table-empty-text">
                  {hasFilters
                    ? 'Try changing your search or filters.'
                    : emptyDescription}
                </p>
              </div>
            ) : (
              paginatedPayments.map(
                (payment) => {
                  const id =
                    safeString(
                      payment.id,
                    );

                  return (
                    <article
                      key={
                        id ||
                        `${payment.profile_id}-${payment.created_at}`
                      }
                      className="payment-table-mobile-card"
                    >
                      <div className="payment-table-mobile-top">
                        <div className="payment-table-mobile-person">
                          <div
                            className="payment-table-avatar"
                            aria-hidden="true"
                          >
                            {getInitials(
                              payment.payer_name,
                            )}
                          </div>

                          <div
                            style={{
                              minWidth: 0,
                            }}
                          >
                            <div className="payment-table-person-name">
                              {safeString(
                                payment.payer_name,
                                'Unknown payer',
                              )}
                            </div>

                            <div className="payment-table-person-slug">
                              {payment.slug_snapshot
                                ? `/${truncate(
                                    payment.slug_snapshot,
                                    24,
                                  )}`
                                : 'No profile slug'}
                            </div>
                          </div>
                        </div>

                        <StatusBadge
                          status={
                            payment.status
                          }
                        />
                      </div>

                      <div className="payment-table-mobile-grid">
                        <div className="payment-table-mobile-item">
                          <span className="payment-table-mobile-label">
                            Amount
                          </span>

                          <span className="payment-table-mobile-value">
                            {formatAmount(
                              payment.amount,
                            )}
                          </span>
                        </div>

                        <div className="payment-table-mobile-item">
                          <span className="payment-table-mobile-label">
                            Plan
                          </span>

                          <span className="payment-table-mobile-value">
                            {normalizePlan(
                              payment.plan_snapshot ||
                                payment.plan,
                            )}
                          </span>
                        </div>

                        <div className="payment-table-mobile-item">
                          <span className="payment-table-mobile-label">
                            Type
                          </span>

                          <span className="payment-table-mobile-value">
                            {getPaymentTypeLabel(
                              payment.payment_type,
                            )}
                          </span>
                        </div>

                        <div className="payment-table-mobile-item">
                          <span className="payment-table-mobile-label">
                            Created
                          </span>

                          <span className="payment-table-mobile-value">
                            {formatRelativeDate(
                              payment.created_at,
                            ) ||
                              formatDate(
                                payment.created_at,
                              )}
                          </span>
                        </div>

                        <div className="payment-table-mobile-item">
                          <span className="payment-table-mobile-label">
                            Reference
                          </span>

                          <span className="payment-table-mobile-value">
                            {safeString(
                              payment.payment_reference,
                              '—',
                            )}
                          </span>
                        </div>

                        <div className="payment-table-mobile-item">
                          <span className="payment-table-mobile-label">
                            Payment ID
                          </span>

                          <span className="payment-table-mobile-value">
                            {truncate(
                              payment.id,
                              24,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="payment-table-mobile-actions">
                        <button
                          type="button"
                          className="payment-table-view"
                          onClick={() =>
                            handleView(
                              payment,
                            )
                          }
                          disabled={
                            typeof onView !==
                              'function' &&
                            typeof onSelect !==
                              'function'
                          }
                        >
                          View payment
                        </button>
                      </div>
                    </article>
                  );
                },
              )
            )}
          </div>

          {/* ==================================================
              PAGINATION
          ================================================== */}

          {!loading &&
            filteredPayments.length >
              0 && (
              <div className="payment-table-pagination">
                <span className="payment-table-pagination-info">
                  Showing{' '}
                  {(
                    (safePage -
                      1) *
                      safePageSize +
                    1
                  )}{' '}
                 –{' '}
                  {Math.min(
                    safePage *
                      safePageSize,
                    filteredPayments.length,
                  )}{' '}
                  of{' '}
                  {
                    filteredPayments.length
                  }
                </span>

                <div className="payment-table-pagination-actions">
                  <button
                    type="button"
                    className="payment-table-page-button"
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current -
                              1,
                          ),
                      )
                    }
                    disabled={
                      safePage <= 1
                    }
                    aria-label="Previous page"
                  >
                    ←
                  </button>

                  {Array.from({
                    length: Math.min(
                      totalPages,
                      5,
                    ),
                  }).map(
                    (_, index) => {
                      let pageNumber =
                        index + 1;

                      if (
                        totalPages >
                          5 &&
                        safePage > 3
                      ) {
                        pageNumber =
                          Math.min(
                            totalPages -
                              4 +
                              index,
                            totalPages,
                          );
                      }

                      return (
                        <button
                          key={
                            pageNumber
                          }
                          type="button"
                          className={`payment-table-page-button ${
                            pageNumber ===
                            safePage
                              ? 'payment-table-page-current'
                              : ''
                          }`}
                          onClick={() =>
                            setPage(
                              pageNumber,
                            )
                          }
                          aria-current={
                            pageNumber ===
                            safePage
                              ? 'page'
                              : undefined
                          }
                        >
                          {
                            pageNumber
                          }
                        </button>
                      );
                    },
                  )}

                  <button
                    type="button"
                    className="payment-table-page-button"
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            totalPages,
                            current +
                              1,
                          ),
                      )
                    }
                    disabled={
                      safePage >=
                      totalPages
                    }
                    aria-label="Next page"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
        </div>
      )}
    </section>
  );
}