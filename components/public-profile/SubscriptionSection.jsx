export default function SubscriptionSection({
  profile,
}) {
  if (
    profile?.status !==
    'active'
  ) {
    return null;
  }

  const plan =
    profile?.plan;

  const expiresAt =
    profile?.expires_at;

  let expiryText = '';

  if (expiresAt) {
    const date =
      new Date(expiresAt);

    if (
      Number.isFinite(
        date.getTime()
      )
    ) {
      expiryText =
        date.toLocaleDateString(
          'en-IN',
          {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }
        );
    }
  }

  return (
    <section className="public-profile-subscription">
      <div>
        <span>
          Worldwide DIPO
        </span>

        <strong>
          {plan || 'Active Profile'}
        </strong>
      </div>

      <div>
        <span>
          Status
        </span>

        <strong>
          Active
        </strong>
      </div>

      {expiryText && (
        <div>
          <span>
            Valid until
          </span>

          <strong>
            {expiryText}
          </strong>
        </div>
      )}
    </section>
  );
}