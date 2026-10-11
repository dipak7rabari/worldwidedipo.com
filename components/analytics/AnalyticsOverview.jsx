export default function AnalyticsOverview({
  analytics,
}) {
  const total =
    analytics?.totalViews || 0;

  const devices =
    analytics?.devices || {};

  return (
    <section className="analytics-overview">
      <div className="analytics-stat-card analytics-stat-primary">
        <span>
          Total Profile Views
        </span>

        <strong>
          {total.toLocaleString(
            'en-IN'
          )}
        </strong>

        <small>
          All recorded public profile views
        </small>
      </div>

      <div className="analytics-stat-card">
        <span>
          Mobile
        </span>

        <strong>
          {(
            devices.mobile || 0
          ).toLocaleString(
            'en-IN'
          )}
        </strong>

        <small>
          Mobile device views
        </small>
      </div>

      <div className="analytics-stat-card">
        <span>
          Desktop
        </span>

        <strong>
          {(
            devices.desktop || 0
          ).toLocaleString(
            'en-IN'
          )}
        </strong>

        <small>
          Desktop views
        </small>
      </div>

      <div className="analytics-stat-card">
        <span>
          Tablet
        </span>

        <strong>
          {(
            devices.tablet || 0
          ).toLocaleString(
            'en-IN'
          )}
        </strong>

        <small>
          Tablet views
        </small>
      </div>
    </section>
  );
}