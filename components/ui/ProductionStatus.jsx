export default function ProductionStatus({
  status = 'ready',
}) {
  const states = {
    ready: {
      label: 'Ready',
      text: 'Worldwide DIPO is ready.',
    },

    loading: {
      label: 'Loading',
      text: 'Please wait…',
    },

    pending: {
      label: 'Pending',
      text: 'This request is being processed.',
    },

    error: {
      label: 'Error',
      text: 'Something went wrong.',
    },
  };

  const current = states[status] || states.error;

  return (
    <div
      className={`dipo-production-status status-${status}`}
      role="status"
    >
      <strong>{current.label}</strong>

      <span>{current.text}</span>
    </div>
  );
}