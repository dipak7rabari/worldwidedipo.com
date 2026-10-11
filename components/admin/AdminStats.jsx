'use client';

import React from 'react';

const COLORS = {
  ink: '#0b1220',
  text: '#1e293b',
  muted: '#64748b',
  subtle: '#94a3b8',

  white: '#ffffff',
  canvas: '#f7f9fc',
  line: '#e8edf3',
  lineStrong: '#dbe3ec',

  blue: '#2563eb',
  blueSoft: '#eff6ff',

  green: '#047857',
  greenSoft: '#ecfdf5',

  amber: '#b45309',
  amberSoft: '#fffbeb',

  violet: '#6d28d9',
  violetSoft: '#f5f3ff',

  red: '#be123c',
  redSoft: '#fff1f2',
};

const DEFAULT_STATS = {
  users: 0,
  profiles: 0,
  pendingPayments: 0,
  verifiedPayments: 0,
  revenue: 0,
};

const STAT_CONFIG = [
  {
    key: 'users',
    label: 'Total Users',
    description: 'Registered accounts',
    icon: '◎',
    tone: 'blue',
    format: 'number',
  },
  {
    key: 'profiles',
    label: 'DIPO Profiles',
    description: 'Created digital identities',
    icon: '◇',
    tone: 'violet',
    format: 'number',
  },
  {
    key: 'pendingPayments',
    label: 'Pending Payments',
    description: 'Waiting for verification',
    icon: '₹',
    tone: 'amber',
    format: 'number',
  },
  {
    key: 'verifiedPayments',
    label: 'Verified Payments',
    description: 'Successfully approved',
    icon: '✓',
    tone: 'green',
    format: 'number',
  },
  {
    key: 'revenue',
    label: 'Verified Revenue',
    description: 'Confirmed payment amount',
    icon: '↗',
    tone: 'green',
    format: 'currency',
  },
];

const TONES = {
  blue: {
    background: COLORS.blueSoft,
    color: COLORS.blue,
    border: '#dbeafe',
    dot: '#2563eb',
  },

  violet: {
    background: COLORS.violetSoft,
    color: COLORS.violet,
    border: '#ede9fe',
    dot: '#7c3aed',
  },

  amber: {
    background: COLORS.amberSoft,
    color: COLORS.amber,
    border: '#fef3c7',
    dot: '#f59e0b',
  },

  green: {
    background: COLORS.greenSoft,
    color: COLORS.green,
    border: '#d1fae5',
    dot: '#10b981',
  },

  red: {
    background: COLORS.redSoft,
    color: COLORS.red,
    border: '#ffe4e6',
    dot: '#f43f5e',
  },
};

function safeNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(safeNumber(value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safeNumber(value));
}

function formatValue(value, format) {
  if (format === 'currency') {
    return formatCurrency(value);
  }

  return formatNumber(value);
}

function normalizeStats(stats) {
  if (!stats || typeof stats !== 'object') {
    return DEFAULT_STATS;
  }

  return {
    ...DEFAULT_STATS,
    ...stats,
  };
}

function StatCard({
  config,
  value,
  loading = false,
  compact = false,
}) {
  const tone = TONES[config.tone] || TONES.blue;

  return (
    <article
      style={{
        position: 'relative',
        minWidth: 0,
        minHeight: compact ? '132px' : '156px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: compact ? '16px' : '19px',
        borderRadius: compact ? '19px' : '22px',
        border: `1px solid ${COLORS.line}`,
        background: COLORS.white,
        boxShadow:
          '0 12px 40px rgba(15,23,42,0.045)',
        overflow: 'hidden',
        transition:
          'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
      }}
    >
      {/* Decorative glow */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          top: '-55px',
          right: '-45px',
          borderRadius: '999px',
          background: `radial-gradient(circle, ${tone.background}, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              color: COLORS.muted,
              fontSize: '10px',
              lineHeight: 1.3,
              fontWeight: 900,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
            }}
          >
            {config.label}
          </p>
        </div>

        <div
          aria-hidden="true"
          style={{
            width: '36px',
            height: '36px',
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '11px',
            background: tone.background,
            color: tone.color,
            border: `1px solid ${tone.border}`,
            fontSize: '14px',
            fontWeight: 950,
          }}
        >
          {config.icon}
        </div>
      </div>

      {/* Value */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '15px',
        }}
      >
        <p
          aria-live="polite"
          style={{
            margin: 0,
            color: COLORS.ink,
            fontSize: compact
              ? '27px'
              : '31px',
            lineHeight: 1,
            fontWeight: 950,
            letterSpacing: '-0.055em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {loading ? '…' : formatValue(value, config.format)}
        </p>

        <p
          style={{
            margin: '8px 0 0',
            color: COLORS.subtle,
            fontSize: '10px',
            lineHeight: 1.45,
          }}
        >
          {config.description}
        </p>
      </div>

      {/* Bottom status */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          marginTop: '14px',
          paddingTop: '11px',
          borderTop: `1px solid ${COLORS.line}`,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: '6px',
            height: '6px',
            flexShrink: 0,
            borderRadius: '999px',
            background: tone.dot,
            boxShadow: `0 0 0 3px ${tone.background}`,
          }}
        />

        <span
          style={{
            color: COLORS.muted,
            fontSize: '9px',
            fontWeight: 750,
          }}
        >
          {loading
            ? 'Updating data'
            : 'Current overview'}
        </span>
      </div>
    </article>
  );
}

export default function AdminStats({
  stats = DEFAULT_STATS,
  loading = false,
  compact = false,
  showVerifiedPayments = true,
  className = '',
  style = {},
}) {
  const normalizedStats = normalizeStats(stats);

  const visibleStats = showVerifiedPayments
    ? STAT_CONFIG
    : STAT_CONFIG.filter(
        (item) => item.key !== 'verifiedPayments',
      );

  return (
    <section
      className={className}
      aria-label="Admin statistics"
      aria-busy={loading}
      style={{
        width: '100%',
        ...style,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(190px, 1fr))',
          gap: compact ? '10px' : '12px',
          width: '100%',
        }}
      >
        {visibleStats.map((config) => (
          <StatCard
            key={config.key}
            config={config}
            value={normalizedStats[config.key]}
            loading={loading}
            compact={compact}
          />
        ))}
      </div>

      <style jsx>{`
        article:hover {
          transform: translateY(-2px);
          border-color: ${COLORS.lineStrong};
          box-shadow:
            0 18px 50px rgba(15, 23, 42, 0.075);
        }

        @media (max-width: 640px) {
          section > div {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 390px) {
          section > div {
            grid-template-columns: 1fr !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          article {
            transition: none !important;
          }

          article:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export {
  STAT_CONFIG,
  formatNumber,
  formatCurrency,
};