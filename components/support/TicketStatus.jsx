'use client';

const STATUS_CONFIG = {
  open: {
    label: 'Open',
    tone: 'open',
    description: 'Waiting for support',
  },

  in_progress: {
    label: 'In Progress',
    tone: 'progress',
    description: 'Support is working on it',
  },

  resolved: {
    label: 'Resolved',
    tone: 'resolved',
    description: 'Issue has been resolved',
  },

  closed: {
    label: 'Closed',
    tone: 'closed',
    description: 'Ticket is closed',
  },
};

function StatusIcon({ status }) {
  if (status === 'open') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="8"
        />
        <path d="M12 8v4l2.5 1.5" />
      </svg>
    );
  }

  if (status === 'in_progress') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 3a9 9 0 1 0 9 9" />
        <path d="M21 3v6h-6" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (
    status === 'resolved' ||
    status === 'closed'
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="m5 12 4.2 4.2L19 6.5" />
        <circle
          cx="12"
          cy="12"
          r="9"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
      />
    </svg>
  );
}

export default function TicketStatus({
  status = 'open',
  showDescription = false,
  size = 'default',
  className = '',
}) {
  const normalizedStatus =
    typeof status === 'string'
      ? status.trim().toLowerCase()
      : 'open';

  const config =
    STATUS_CONFIG[
      normalizedStatus
    ] || {
      label: 'Unknown',
      tone: 'unknown',
      description: 'Status unavailable',
    };

  const classes = [
    'dipo-ticket-status',
    `dipo-ticket-status--${config.tone}`,
    size === 'small'
      ? 'dipo-ticket-status--small'
      : '',
    size === 'large'
      ? 'dipo-ticket-status--large'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      title={config.description}
      aria-label={`Ticket status: ${config.label}`}
    >
      <span
        className="dipo-ticket-status__icon"
        aria-hidden="true"
      >
        <StatusIcon
          status={
            normalizedStatus
          }
        />
      </span>

      <span className="dipo-ticket-status__label">
        {config.label}
      </span>

      {showDescription && (
        <span className="dipo-ticket-status__description">
          {config.description}
        </span>
      )}

      <style>{`
        .dipo-ticket-status {
          --ticket-status-bg: #f8fafc;
          --ticket-status-border: #e2e8f0;
          --ticket-status-text: #475569;
          --ticket-status-icon: #64748b;

          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 29px;
          width: fit-content;
          max-width: 100%;
          padding: 0 9px;
          border: 1px solid var(--ticket-status-border);
          border-radius: 999px;
          background: var(--ticket-status-bg);
          color: var(--ticket-status-text);
          font-size: 9px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: .01em;
          white-space: nowrap;
          vertical-align: middle;
        }

        .dipo-ticket-status__icon {
          width: 13px;
          height: 13px;
          display: grid;
          place-items: center;
          flex: 0 0 13px;
          color: var(--ticket-status-icon);
        }

        .dipo-ticket-status__icon svg {
          width: 13px;
          height: 13px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.9;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .dipo-ticket-status__label {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dipo-ticket-status__description {
          padding-left: 3px;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 700;
        }

        .dipo-ticket-status--small {
          min-height: 25px;
          padding: 0 7px;
          gap: 5px;
          font-size: 8px;
        }

        .dipo-ticket-status--small
          .dipo-ticket-status__icon,
        .dipo-ticket-status--small
          .dipo-ticket-status__icon svg {
          width: 11px;
          height: 11px;
          flex-basis: 11px;
        }

        .dipo-ticket-status--large {
          min-height: 34px;
          padding: 0 11px;
          gap: 7px;
          font-size: 10px;
        }

        .dipo-ticket-status--large
          .dipo-ticket-status__icon,
        .dipo-ticket-status--large
          .dipo-ticket-status__icon svg {
          width: 15px;
          height: 15px;
          flex-basis: 15px;
        }

        .dipo-ticket-status--open {
          --ticket-status-bg: #eff6ff;
          --ticket-status-border: #dbeafe;
          --ticket-status-text: #1d4ed8;
          --ticket-status-icon: #2563eb;
        }

        .dipo-ticket-status--progress {
          --ticket-status-bg: #fff7ed;
          --ticket-status-border: #fed7aa;
          --ticket-status-text: #c2410c;
          --ticket-status-icon: #ea580c;
        }

        .dipo-ticket-status--resolved {
          --ticket-status-bg: #ecfdf5;
          --ticket-status-border: #bbf7d0;
          --ticket-status-text: #047857;
          --ticket-status-icon: #059669;
        }

        .dipo-ticket-status--closed {
          --ticket-status-bg: #f1f5f9;
          --ticket-status-border: #e2e8f0;
          --ticket-status-text: #475569;
          --ticket-status-icon: #64748b;
        }

        .dipo-ticket-status--unknown {
          --ticket-status-bg: #f8fafc;
          --ticket-status-border: #e2e8f0;
          --ticket-status-text: #64748b;
          --ticket-status-icon: #94a3b8;
        }

        @media (max-width: 480px) {
          .dipo-ticket-status__description {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dipo-ticket-status,
          .dipo-ticket-status * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </span>
  );
}