function formatDate(
  value
) {
  const date =
    new Date(value);

  if (
    !Number.isFinite(
      date.getTime()
    )
  ) {
    return 'Unknown';
  }

  return date.toLocaleString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );
}

export default function RecentViews({
  views,
}) {
  const items =
    Array.isArray(views)
      ? views
      : [];

  return (
    <section className="analytics-recent-card">
      <div className="analytics-section-heading">
        <div>
          <p className="dashboard-eyebrow">
            Activity
          </p>

          <h2>
            Recent Profile Views
          </h2>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="analytics-empty">
          <strong>
            No views yet
          </strong>

          <p>
            Jab koi aapka public DIPO profile
            open karega, activity yahan dikhegi.
          </p>
        </div>
      ) : (
        <div className="analytics-view-list">
          {items.map(
            (view) => (
              <div
                key={view.id}
                className="analytics-view-row"
              >
                <div>
                  <strong>
                    {view.device_type
                      ?.charAt(0)
                      .toUpperCase() +
                      view.device_type?.slice(
                        1
                      ) ||
                      'Unknown'}
                  </strong>

                  <span>
                    {view.referrer_domain ||
                      'Direct'}
                  </span>
                </div>

                <time
                  dateTime={
                    view.viewed_at
                  }
                >
                  {formatDate(
                    view.viewed_at
                  )}
                </time>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}