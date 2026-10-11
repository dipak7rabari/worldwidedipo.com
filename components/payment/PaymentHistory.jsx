'use client';

import {
  useMemo,
  useState,
} from 'react';

/**
 * Worldwide DIPO
 * PaymentHistory
 *
 * Production-grade payment history UI.
 *
 * Expected payment shape:
 * {
 *   id,
 *   payment_type,
 *   plan,
 *   amount,
 *   status,
 *   payment_reference,
 *   created_at,
 *   verified_at,
 *   notes
 * }
 *
 * The component intentionally does NOT fetch payment data itself.
 * Pass already-authorized payment records through `payments`.
 *
 * This keeps authorization/data ownership on the server.
 */

const STATUS_CONFIG = {
  pending: {
    label: 'Pending review',
    tone: 'pending',
    icon: '◷',
  },

  approved: {
    label: 'Verified',
    tone: 'approved',
    icon: '✓',
  },

  verified: {
    label: 'Verified',
    tone: 'approved',
    icon: '✓',
  },

  rejected: {
    label: 'Rejected',
    tone: 'rejected',
    icon: '×',
  },

  failed: {
    label: 'Failed',
    tone: 'rejected',
    icon: '!',
  },

  cancelled: {
    label: 'Cancelled',
    tone: 'neutral',
    icon: '−',
  },
};

const FILTERS = [
  {
    id: 'all',
    label: 'All',
  },
  {
    id: 'pending',
    label: 'Pending',
  },
  {
    id: 'approved',
    label: 'Verified',
  },
  {
    id: 'rejected',
    label: 'Rejected',
  },
];

function normalizeStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase();
}

function getStatusConfig(status) {
  const normalized = normalizeStatus(status);

  return (
    STATUS_CONFIG[normalized] || {
      label:
        normalized
          ? normalized.charAt(0).toUpperCase() +
            normalized.slice(1)
          : 'Unknown',
      tone: 'neutral',
      icon: '•',
    }
  );
}

function formatAmount(amount) {
  if (
    amount === null ||
    amount === undefined ||
    amount === ''
  ) {
    return '—';
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `₹${String(amount)}`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits:
      numericAmount % 1 === 0 ? 0 : 2,
  }).format(numericAmount);
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatPaymentType(type) {
  const normalized = String(type || '')
    .trim()
    .toLowerCase();

  if (normalized === 'renewal') {
    return 'Renewal';
  }

  if (normalized === 'initial') {
    return 'Initial activation';
  }

  if (!normalized) {
    return 'Payment';
  }

  return (
    normalized.charAt(0).toUpperCase() +
    normalized.slice(1)
  );
}

function getPlanLabel(plan) {
  if (!plan) {
    return 'Worldwide DIPO';
  }

  return String(plan);
}

function getInitials(value) {
  const text = String(value || 'DIPO')
    .trim();

  if (!text) {
    return 'D';
  }

  const words = text
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

function normalizeReference(value) {
  return String(value || '').trim();
}

function matchesFilter(payment, filter) {
  if (filter === 'all') {
    return true;
  }

  const status = normalizeStatus(
    payment?.status
  );

  if (filter === 'approved') {
    return (
      status === 'approved' ||
      status === 'verified'
    );
  }

  if (filter === 'rejected') {
    return (
      status === 'rejected' ||
      status === 'failed' ||
      status === 'cancelled'
    );
  }

  return status === filter;
}

function matchesSearch(payment, query) {
  if (!query) {
    return true;
  }

  const searchable = [
    payment?.id,
    payment?.payment_type,
    payment?.plan,
    payment?.status,
    payment?.payment_reference,
    payment?.payer_name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchable.includes(
    query.toLowerCase()
  );
}

function safePayments(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (payment) =>
      payment &&
      typeof payment === 'object'
  );
}

export default function PaymentHistory({
  payments = [],
  title = 'Payment history',
  description = 'Track your Worldwide DIPO payments, verification status and references.',
  showHeader = true,
  compact = false,
}) {
  const [activeFilter, setActiveFilter] =
    useState('all');

  const [search, setSearch] =
    useState('');

  const [copiedId, setCopiedId] =
    useState(null);

  const normalizedPayments = useMemo(
    () => safePayments(payments),
    [payments]
  );

  const filteredPayments = useMemo(() => {
    const query = search.trim();

    return [...normalizedPayments]
      .filter((payment) =>
        matchesFilter(
          payment,
          activeFilter
        )
      )
      .filter((payment) =>
        matchesSearch(
          payment,
          query
        )
      )
      .sort((a, b) => {
        const aTime = new Date(
          a?.created_at || 0
        ).getTime();

        const bTime = new Date(
          b?.created_at || 0
        ).getTime();

        return bTime - aTime;
      });
  }, [
    normalizedPayments,
    activeFilter,
    search,
  ]);

  const stats = useMemo(() => {
    const total = normalizedPayments.length;

    const pending =
      normalizedPayments.filter(
        (payment) =>
          normalizeStatus(
            payment?.status
          ) === 'pending'
      ).length;

    const verified =
      normalizedPayments.filter(
        (payment) => {
          const status =
            normalizeStatus(
              payment?.status
            );

          return (
            status === 'approved' ||
            status === 'verified'
          );
        }
      ).length;

    const totalPaid =
      normalizedPayments.reduce(
        (sum, payment) => {
          const status =
            normalizeStatus(
              payment?.status
            );

          if (
            status !== 'approved' &&
            status !== 'verified'
          ) {
            return sum;
          }

          const amount = Number(
            payment?.amount
          );

          return Number.isFinite(amount)
            ? sum + amount
            : sum;
        },
        0
      );

    return {
      total,
      pending,
      verified,
      totalPaid,
    };
  }, [normalizedPayments]);

  async function handleCopy(
    reference,
    paymentId
  ) {
    const value =
      normalizeReference(reference);

    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopiedId(paymentId);

      window.setTimeout(() => {
        setCopiedId((current) =>
          current === paymentId
            ? null
            : current
        );
      }, 1800);
    } catch {
      // Clipboard may be blocked by browser permissions.
    }
  }

  return (
    <section
      className={[
        'dipo-payment-history',
        compact
          ? 'dipo-payment-history--compact'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby="dipo-payment-history-title"
    >
      <style jsx>{`
        .dipo-payment-history {
          --dipo-black: #09090b;
          --dipo-ink: #18181b;
          --dipo-muted: #71717a;
          --dipo-soft: #a1a1aa;
          --dipo-border: #e4e4e7;
          --dipo-border-soft: #ededf0;
          --dipo-surface: #ffffff;
          --dipo-surface-soft: #fafafa;
          --dipo-green: #059669;
          --dipo-green-soft: #ecfdf5;
          --dipo-yellow: #a16207;
          --dipo-yellow-soft: #fefce8;
          --dipo-red: #dc2626;
          --dipo-red-soft: #fef2f2;

          width: 100%;
          min-width: 0;
          color: var(--dipo-ink);
        }

        .dipo-payment-history *,
        .dipo-payment-history *::before,
        .dipo-payment-history *::after {
          box-sizing: border-box;
        }

        .dipo-payment-history__shell {
          width: 100%;
          overflow: hidden;
          border: 1px solid var(--dipo-border);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(16, 185, 129, 0.06),
              transparent 28%
            ),
            var(--dipo-surface);
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.02),
            0 16px 50px rgba(0, 0, 0, 0.045);
        }

        .dipo-payment-history__header {
          padding: 28px 28px 22px;
          border-bottom: 1px solid var(--dipo-border-soft);
        }

        .dipo-payment-history__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 9px;
          color: var(--dipo-green);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          line-height: 1;
          text-transform: uppercase;
        }

        .dipo-payment-history__eyebrow-dot {
          width: 6px;
          height: 6px;
          flex: 0 0 6px;
          border-radius: 999px;
          background: currentColor;
          box-shadow: 0 0 0 4px
            rgba(5, 150, 105, 0.08);
        }

        .dipo-payment-history__title {
          margin: 0;
          color: var(--dipo-black);
          font-size: clamp(
            1.35rem,
            2vw,
            1.7rem
          );
          font-weight: 760;
          letter-spacing: -0.035em;
          line-height: 1.1;
        }

        .dipo-payment-history__description {
          max-width: 680px;
          margin: 9px 0 0;
          color: var(--dipo-muted);
          font-size: 14px;
          line-height: 1.65;
        }

        .dipo-payment-history__stats {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 10px;
          padding: 18px 28px;
          border-bottom: 1px solid
            var(--dipo-border-soft);
          background: var(--dipo-surface-soft);
        }

        .dipo-payment-stat {
          min-width: 0;
          padding: 14px 15px;
          border: 1px solid
            var(--dipo-border-soft);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.72);
        }

        .dipo-payment-stat__label {
          display: block;
          margin-bottom: 6px;
          color: var(--dipo-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.03em;
        }

        .dipo-payment-stat__value {
          display: block;
          overflow: hidden;
          color: var(--dipo-black);
          font-size: 18px;
          font-weight: 760;
          letter-spacing: -0.025em;
          line-height: 1.15;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-payment-history__toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 18px 28px;
          border-bottom: 1px solid
            var(--dipo-border-soft);
        }

        .dipo-payment-history__filters {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .dipo-payment-history__filters::-webkit-scrollbar {
          display: none;
        }

        .dipo-payment-filter {
          flex: 0 0 auto;
          min-height: 36px;
          padding: 0 13px;
          border: 1px solid transparent;
          border-radius: 999px;
          background: transparent;
          color: var(--dipo-muted);
          cursor: pointer;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          transition:
            background 160ms ease,
            color 160ms ease,
            border-color 160ms ease,
            transform 160ms ease;
        }

        .dipo-payment-filter:hover {
          color: var(--dipo-black);
          background: #f4f4f5;
        }

        .dipo-payment-filter:active {
          transform: scale(0.97);
        }

        .dipo-payment-filter.is-active {
          border-color: #d4d4d8;
          background: var(--dipo-black);
          color: #ffffff;
        }

        .dipo-payment-filter:focus-visible,
        .dipo-payment-search:focus-visible,
        .dipo-payment-copy:focus-visible {
          outline: 3px solid
            rgba(5, 150, 105, 0.18);
          outline-offset: 2px;
        }

        .dipo-payment-history__search {
          position: relative;
          width: min(260px, 100%);
          flex: 0 1 260px;
        }

        .dipo-payment-search-icon {
          position: absolute;
          top: 50%;
          left: 13px;
          width: 15px;
          height: 15px;
          color: #a1a1aa;
          pointer-events: none;
          transform: translateY(-50%);
        }

        .dipo-payment-search {
          width: 100%;
          min-height: 40px;
          padding: 0 13px 0 38px;
          border: 1px solid var(--dipo-border);
          border-radius: 12px;
          outline: none;
          background: #ffffff;
          color: var(--dipo-black);
          font: inherit;
          font-size: 12px;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        .dipo-payment-search::placeholder {
          color: #a1a1aa;
        }

        .dipo-payment-search:focus {
          border-color: #a1a1aa;
          box-shadow:
            0 0 0 4px
            rgba(0, 0, 0, 0.035);
        }

        .dipo-payment-history__content {
          width: 100%;
        }

        .dipo-payment-history__table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .dipo-payment-history__table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
          text-align: left;
        }

        .dipo-payment-history__table th {
          padding: 13px 28px;
          border-bottom: 1px solid
            var(--dipo-border-soft);
          background: #fcfcfc;
          color: #71717a;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .dipo-payment-history__table td {
          padding: 17px 28px;
          border-bottom: 1px solid
            var(--dipo-border-soft);
          vertical-align: middle;
        }

        .dipo-payment-history__table tbody tr {
          transition:
            background 160ms ease;
        }

        .dipo-payment-history__table tbody tr:hover {
          background: #fcfcfc;
        }

        .dipo-payment-history__table tbody tr:last-child td {
          border-bottom: 0;
        }

        .dipo-payment-main {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 180px;
        }

        .dipo-payment-avatar {
          display: grid;
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          place-items: center;
          border: 1px solid
            var(--dipo-border);
          border-radius: 12px;
          background:
            linear-gradient(
              145deg,
              #ffffff,
              #f4f4f5
            );
          color: var(--dipo-black);
          font-size: 12px;
          font-weight: 850;
        }

        .dipo-payment-main__title {
          display: block;
          overflow: hidden;
          max-width: 180px;
          color: var(--dipo-black);
          font-size: 13px;
          font-weight: 750;
          letter-spacing: -0.015em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-payment-main__meta {
          display: block;
          margin-top: 3px;
          color: var(--dipo-muted);
          font-size: 11px;
          line-height: 1.4;
        }

        .dipo-payment-plan {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 0 10px;
          border: 1px solid
            var(--dipo-border);
          border-radius: 999px;
          background: #ffffff;
          color: #3f3f46;
          font-size: 11px;
          font-weight: 750;
        }

        .dipo-payment-amount {
          color: var(--dipo-black);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.015em;
          white-space: nowrap;
        }

        .dipo-payment-date {
          color: #52525b;
          font-size: 12px;
          white-space: nowrap;
        }

        .dipo-payment-date__sub {
          display: block;
          margin-top: 3px;
          color: #a1a1aa;
          font-size: 10px;
        }

        .dipo-payment-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 29px;
          padding: 0 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .dipo-payment-status__icon {
          display: grid;
          width: 15px;
          height: 15px;
          place-items: center;
          border-radius: 50%;
          font-size: 9px;
          line-height: 1;
        }

        .dipo-payment-status--pending {
          background: var(--dipo-yellow-soft);
          color: var(--dipo-yellow);
        }

        .dipo-payment-status--pending
          .dipo-payment-status__icon {
          background: #fef3c7;
        }

        .dipo-payment-status--approved {
          background: var(--dipo-green-soft);
          color: var(--dipo-green);
        }

        .dipo-payment-status--approved
          .dipo-payment-status__icon {
          background: #d1fae5;
        }

        .dipo-payment-status--rejected {
          background: var(--dipo-red-soft);
          color: var(--dipo-red);
        }

        .dipo-payment-status--rejected
          .dipo-payment-status__icon {
          background: #fee2e2;
        }

        .dipo-payment-status--neutral {
          background: #f4f4f5;
          color: #52525b;
        }

        .dipo-payment-status--neutral
          .dipo-payment-status__icon {
          background: #e4e4e7;
        }

        .dipo-payment-reference {
          display: flex;
          align-items: center;
          gap: 7px;
          max-width: 190px;
        }

        .dipo-payment-reference__value {
          overflow: hidden;
          color: #52525b;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dipo-payment-copy {
          display: inline-grid;
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          place-items: center;
          border: 1px solid var(--dipo-border);
          border-radius: 9px;
          background: #ffffff;
          color: #52525b;
          cursor: pointer;
          transition:
            background 160ms ease,
            border-color 160ms ease,
            color 160ms ease,
            transform 160ms ease;
        }

        .dipo-payment-copy:hover {
          border-color: #a1a1aa;
          background: #f4f4f5;
          color: var(--dipo-black);
        }

        .dipo-payment-copy:active {
          transform: scale(0.94);
        }

        .dipo-payment-copy.is-copied {
          border-color: #a7f3d0;
          background: #ecfdf5;
          color: #059669;
        }

        .dipo-payment-empty {
          display: flex;
          min-height: 300px;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          text-align: center;
        }

        .dipo-payment-empty__inner {
          width: min(100%, 420px);
        }

        .dipo-payment-empty__icon {
          display: grid;
          width: 56px;
          height: 56px;
          margin: 0 auto 15px;
          place-items: center;
          border: 1px solid var(--dipo-border);
          border-radius: 18px;
          background: #fafafa;
          color: #52525b;
        }

        .dipo-payment-empty__title {
          margin: 0;
          color: var(--dipo-black);
          font-size: 15px;
          font-weight: 760;
          letter-spacing: -0.02em;
        }

        .dipo-payment-empty__text {
          margin: 7px auto 0;
          color: var(--dipo-muted);
          font-size: 12px;
          line-height: 1.65;
        }

        .dipo-payment-history__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 15px 28px;
          border-top: 1px solid
            var(--dipo-border-soft);
          background: #fcfcfc;
        }

        .dipo-payment-history__result-count {
          color: var(--dipo-muted);
          font-size: 11px;
          font-weight: 650;
        }

        .dipo-payment-history__secure {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #71717a;
          font-size: 10px;
          font-weight: 700;
        }

        .dipo-payment-history__secure-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow:
            0 0 0 4px
            rgba(16, 185, 129, 0.08);
        }

        @media (max-width: 900px) {
          .dipo-payment-history__stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .dipo-payment-history__toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .dipo-payment-history__search {
            width: 100%;
            flex-basis: auto;
          }
        }

        @media (max-width: 640px) {
          .dipo-payment-history__shell {
            border-radius: 22px;
          }

          .dipo-payment-history__header {
            padding: 22px 18px 19px;
          }

          .dipo-payment-history__stats {
            gap: 8px;
            padding: 13px 14px;
          }

          .dipo-payment-stat {
            padding: 12px;
            border-radius: 14px;
          }

          .dipo-payment-stat__value {
            font-size: 16px;
          }

          .dipo-payment-history__toolbar {
            padding: 14px;
          }

          .dipo-payment-history__filters {
            width: 100%;
          }

          .dipo-payment-filter {
            min-height: 34px;
            padding: 0 11px;
          }

          .dipo-payment-history__table-wrap {
            overflow: visible;
          }

          .dipo-payment-history__table {
            min-width: 0;
          }

          .dipo-payment-history__table thead {
            display: none;
          }

          .dipo-payment-history__table,
          .dipo-payment-history__table tbody,
          .dipo-payment-history__table tr,
          .dipo-payment-history__table td {
            display: block;
            width: 100%;
          }

          .dipo-payment-history__table tbody {
            padding: 10px;
          }

          .dipo-payment-history__table tbody tr {
            position: relative;
            margin-bottom: 10px;
            padding: 15px;
            border: 1px solid
              var(--dipo-border-soft);
            border-radius: 18px;
            background: #ffffff;
          }

          .dipo-payment-history__table tbody tr:hover {
            background: #ffffff;
          }

          .dipo-payment-history__table tbody tr:last-child {
            margin-bottom: 0;
          }

          .dipo-payment-history__table td {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding: 8px 0;
            border: 0;
          }

          .dipo-payment-history__table td:first-child {
            padding-top: 0;
          }

          .dipo-payment-history__table td:last-child {
            padding-bottom: 0;
          }

          .dipo-payment-history__table td::before {
            flex: 0 0 auto;
            color: #a1a1aa;
            content: attr(data-label);
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .dipo-payment-main {
            justify-content: flex-end;
          }

          .dipo-payment-main__title {
            max-width: 160px;
          }

          .dipo-payment-reference {
            justify-content: flex-end;
            max-width: 220px;
          }

          .dipo-payment-history__footer {
            padding: 14px 16px;
          }
        }

        @media (max-width: 390px) {
          .dipo-payment-history__stats {
            grid-template-columns: 1fr 1fr;
          }

          .dipo-payment-history__header {
            padding-inline: 15px;
          }

          .dipo-payment-history__title {
            font-size: 1.25rem;
          }

          .dipo-payment-history__description {
            font-size: 12px;
          }

          .dipo-payment-main__title {
            max-width: 125px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-payment-history *,
          .dipo-payment-history *::before,
          .dipo-payment-history *::after {
            scroll-behavior: auto !important;
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <div className="dipo-payment-history__shell">
        {showHeader ? (
          <header className="dipo-payment-history__header">
            <p className="dipo-payment-history__eyebrow">
              <span
                className="dipo-payment-history__eyebrow-dot"
                aria-hidden="true"
              />

              Payments
            </p>

            <h2
              id="dipo-payment-history-title"
              className="dipo-payment-history__title"
            >
              {title}
            </h2>

            <p className="dipo-payment-history__description">
              {description}
            </p>
          </header>
        ) : null}

        <div
          className="dipo-payment-history__stats"
          aria-label="Payment summary"
        >
          <div className="dipo-payment-stat">
            <span className="dipo-payment-stat__label">
              Total payments
            </span>

            <strong className="dipo-payment-stat__value">
              {stats.total}
            </strong>
          </div>

          <div className="dipo-payment-stat">
            <span className="dipo-payment-stat__label">
              Verified
            </span>

            <strong className="dipo-payment-stat__value">
              {stats.verified}
            </strong>
          </div>

          <div className="dipo-payment-stat">
            <span className="dipo-payment-stat__label">
              Pending
            </span>

            <strong className="dipo-payment-stat__value">
              {stats.pending}
            </strong>
          </div>

          <div className="dipo-payment-stat">
            <span className="dipo-payment-stat__label">
              Verified amount
            </span>

            <strong className="dipo-payment-stat__value">
              {formatAmount(
                stats.totalPaid
              )}
            </strong>
          </div>
        </div>

        <div className="dipo-payment-history__toolbar">
          <div
            className="dipo-payment-history__filters"
            role="tablist"
            aria-label="Payment status filters"
          >
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={
                  activeFilter ===
                  filter.id
                }
                className={[
                  'dipo-payment-filter',
                  activeFilter ===
                  filter.id
                    ? 'is-active'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  setActiveFilter(
                    filter.id
                  )
                }
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="dipo-payment-history__search">
            <svg
              className="dipo-payment-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="m16 16 4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <input
              className="dipo-payment-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search payments..."
              aria-label="Search payment history"
            />
          </div>
        </div>

        <div className="dipo-payment-history__content">
          {filteredPayments.length === 0 ? (
            <div
              className="dipo-payment-empty"
              role="status"
            >
              <div className="dipo-payment-empty__inner">
                <div
                  className="dipo-payment-empty__icon"
                  aria-hidden="true"
                >
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M3 9h18"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M7 14h4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3 className="dipo-payment-empty__title">
                  {normalizedPayments.length ===
                  0
                    ? 'No payments yet'
                    : 'No payments found'}
                </h3>

                <p className="dipo-payment-empty__text">
                  {normalizedPayments.length ===
                  0
                    ? 'Your payment activity will appear here after you submit a payment reference.'
                    : 'Try another search term or switch the payment status filter.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="dipo-payment-history__table-wrap">
              <table className="dipo-payment-history__table">
                <thead>
                  <tr>
                    <th scope="col">
                      Payment
                    </th>

                    <th scope="col">
                      Plan
                    </th>

                    <th scope="col">
                      Amount
                    </th>

                    <th scope="col">
                      Status
                    </th>

                    <th scope="col">
                      Reference
                    </th>

                    <th scope="col">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map(
                    (payment, index) => {
                      const paymentId =
                        payment?.id ||
                        `payment-${index}`;

                      const statusConfig =
                        getStatusConfig(
                          payment?.status
                        );

                      const reference =
                        normalizeReference(
                          payment?.payment_reference
                        );

                      return (
                        <tr
                          key={paymentId}
                        >
                          <td data-label="Payment">
                            <div className="dipo-payment-main">
                              <div
                                className="dipo-payment-avatar"
                                aria-hidden="true"
                              >
                                {getInitials(
                                  payment?.plan
                                )}
                              </div>

                              <div>
                                <span className="dipo-payment-main__title">
                                  {formatPaymentType(
                                    payment?.payment_type
                                  )}
                                </span>

                                <span className="dipo-payment-main__meta">
                                  {formatDateTime(
                                    payment?.created_at
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td data-label="Plan">
                            <span className="dipo-payment-plan">
                              {getPlanLabel(
                                payment?.plan
                              )}
                            </span>
                          </td>

                          <td data-label="Amount">
                            <span className="dipo-payment-amount">
                              {formatAmount(
                                payment?.amount
                              )}
                            </span>
                          </td>

                          <td data-label="Status">
                            <span
                              className={[
                                'dipo-payment-status',
                                `dipo-payment-status--${statusConfig.tone}`,
                              ].join(' ')}
                            >
                              <span
                                className="dipo-payment-status__icon"
                                aria-hidden="true"
                              >
                                {
                                  statusConfig.icon
                                }
                              </span>

                              {
                                statusConfig.label
                              }
                            </span>
                          </td>

                          <td data-label="Reference">
                            {reference ? (
                              <div className="dipo-payment-reference">
                                <span
                                  className="dipo-payment-reference__value"
                                  title={
                                    reference
                                  }
                                >
                                  {reference}
                                </span>

                                <button
                                  type="button"
                                  className={[
                                    'dipo-payment-copy',
                                    copiedId ===
                                    paymentId
                                      ? 'is-copied'
                                      : '',
                                  ]
                                    .filter(
                                      Boolean
                                    )
                                    .join(
                                      ' '
                                    )}
                                  aria-label={
                                    copiedId ===
                                    paymentId
                                      ? 'Payment reference copied'
                                      : 'Copy payment reference'
                                  }
                                  title={
                                    copiedId ===
                                    paymentId
                                      ? 'Copied'
                                      : 'Copy reference'
                                  }
                                  onClick={() =>
                                    handleCopy(
                                      reference,
                                      paymentId
                                    )
                                  }
                                >
                                  {copiedId ===
                                  paymentId ? (
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="m5 12 4 4L19 6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      aria-hidden="true"
                                    >
                                      <rect
                                        x="9"
                                        y="9"
                                        width="11"
                                        height="11"
                                        rx="2"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                      />

                                      <path
                                        d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                      />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="dipo-payment-reference__value">
                                —
                              </span>
                            )}
                          </td>

                          <td data-label="Date">
                            <span className="dipo-payment-date">
                              {formatDate(
                                payment?.created_at
                              )}

                              {payment?.verified_at ? (
                                <span className="dipo-payment-date__sub">
                                  Verified{' '}
                                  {formatDate(
                                    payment.verified_at
                                  )}
                                </span>
                              ) : null}
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="dipo-payment-history__footer">
          <span className="dipo-payment-history__result-count">
            Showing{' '}
            <strong>
              {filteredPayments.length}
            </strong>{' '}
            {filteredPayments.length === 1
              ? 'payment'
              : 'payments'}
          </span>

          <span className="dipo-payment-history__secure">
            <span
              className="dipo-payment-history__secure-dot"
              aria-hidden="true"
            />

            Payment records are private
          </span>
        </footer>
      </div>
    </section>
  );
}