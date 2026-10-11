const STATUS = {
  active: {
    label: 'LIVE',
    background: '#ecfdf5',
    color: '#047857',
    border: '#a7f3d0',
  },

  pending: {
    label: 'PENDING',
    background: '#fffbeb',
    color: '#b45309',
    border: '#fde68a',
  },

  draft: {
    label: 'DRAFT',
    background: '#f3f4f6',
    color: '#4b5563',
    border: '#e5e7eb',
  },

  expired: {
    label: 'EXPIRED',
    background: '#fef2f2',
    color: '#b91c1c',
    border: '#fecaca',
  },
};

export default function AdminStatusPill({
  status,
}) {
  const item = STATUS[status] || {
    label: String(status || 'UNKNOWN').toUpperCase(),
    background: '#f3f4f6',
    color: '#4b5563',
    border: '#e5e7eb',
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 28,
        padding: '0 9px',
        borderRadius: 999,
        background: item.background,
        color: item.color,
        border: `1px solid ${item.border}`,
        fontSize: 10,
        fontWeight: 950,
        letterSpacing: '.08em',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: item.color,
        }}
      />

      {item.label}
    </span>
  );
}