function statusLabel(status) {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in_progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    case 'closed':
      return 'Closed';
    default:
      return status;
  }
}

export default function SupportRequestList({ requests = [] }) {
  if (!requests.length) {
    return (
      <div className="dipo-support-empty">
        <strong>No support requests yet.</strong>
        <p>
          If you need help with your profile, payment, renewal, or anything
          else, create a support request above.
        </p>
      </div>
    );
  }

  return (
    <div className="dipo-support-list">
      {requests.map((request) => (
        <article className="dipo-support-card" key={request.id}>
          <div className="dipo-support-card-top">
            <div>
              <h3>{request.subject}</h3>

              <small>
                {request.category} ·{' '}
                {new Date(request.created_at).toLocaleDateString()}
              </small>
            </div>

            <span className={`support-status status-${request.status}`}>
              {statusLabel(request.status)}
            </span>
          </div>

          <p className="dipo-support-message">
            {request.message}
          </p>

          {request.admin_reply && (
            <div className="dipo-support-reply">
              <strong>Worldwide DIPO Support</strong>

              <p>{request.admin_reply}</p>

              {request.replied_at && (
                <small>
                  Replied{' '}
                  {new Date(request.replied_at).toLocaleDateString()}
                </small>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}