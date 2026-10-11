import Link from 'next/link';

import AdminStatusPill from '@/components/admin/AdminStatusPill';

const DEFAULT_COLUMNS = [
  'identity',
  'profession',
  'plan',
  'status',
  'expiry',
  'created',
  'action',
];

function formatDate(value) {
  if (!value) return '—';

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return '—';
  }
}

function getDaysRemaining(value) {
  if (!value) return null;

  const expiry = new Date(value).getTime();

  if (!Number.isFinite(expiry)) {
    return null;
  }

  const now = Date.now();

  return Math.ceil(
    (expiry - now) / (1000 * 60 * 60 * 24)
  );
}

function safeText(value, fallback = '—') {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ''
  ) {
    return fallback;
  }

  return String(value);
}

function getProfileUrl(profile) {
  if (!profile?.slug) {
    return null;
  }

  return `/p/${encodeURIComponent(profile.slug)}`;
}

function getActionUrl(profile, actionHref) {
  if (typeof actionHref === 'function') {
    return actionHref(profile);
  }

  if (typeof actionHref === 'string') {
    return actionHref;
  }

  return getProfileUrl(profile);
}

function IdentityBlock({ profile }) {
  const name = safeText(profile?.name, 'Unnamed identity');
  const slug = safeText(profile?.slug, '');
  const location = safeText(profile?.location, '');

  return (
    <div className="profileIdentity">
      <div className="identityAvatar" aria-hidden="true">
        {name.charAt(0).toUpperCase()}
      </div>

      <div className="identityContent">
        <div className="identityName">
          {name}
        </div>

        {slug ? (
          <div className="identitySlug">
            /p/{slug}
          </div>
        ) : null}

        {location ? (
          <div className="identityLocation">
            <span aria-hidden="true">⌖</span>
            {location}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ExpiryBlock({ value }) {
  const remaining = getDaysRemaining(value);

  let state = 'normal';

  if (remaining !== null) {
    if (remaining <= 0) {
      state = 'expired';
    } else if (remaining <= 7) {
      state = 'warning';
    }
  }

  return (
    <div className="expiryBlock">
      <div className="dateValue">
        {formatDate(value)}
      </div>

      {remaining !== null ? (
        <div
          className={`remaining remaining-${state}`}
        >
          {remaining > 0
            ? `${remaining} ${
                remaining === 1 ? 'day' : 'days'
              } left`
            : 'Expired'}
        </div>
      ) : null}
    </div>
  );
}

function ProfileAction({
  profile,
  actionHref,
  actionLabel = 'Open',
  openInNewTab = true,
}) {
  const href = getActionUrl(profile, actionHref);

  if (!href) {
    return (
      <span className="actionDisabled">
        Unavailable
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="openButton"
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      aria-label={`${actionLabel} ${
        safeText(profile?.name, 'profile')
      }`}
    >
      <span>{actionLabel}</span>
      <span
        className="openArrow"
        aria-hidden="true"
      >
        ↗
      </span>
    </Link>
  );
}

function EmptyState({
  title = 'No profiles found',
  description = 'There are no profiles to display right now.',
}) {
  return (
    <div className="emptyState">
      <div className="emptyIcon" aria-hidden="true">
        ◌
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}

function MobileProfileCard({
  profile,
  actionHref,
  actionLabel,
  openInNewTab,
}) {
  const remaining = getDaysRemaining(
    profile?.expires_at
  );

  return (
    <article className="mobileCard">
      <div className="mobileCardTop">
        <IdentityBlock profile={profile} />

        <AdminStatusPill
          status={profile?.status}
        />
      </div>

      <div className="mobileMetaGrid">
        <div className="mobileMeta">
          <span>Profession</span>
          <strong>
            {safeText(profile?.profession)}
          </strong>
        </div>

        <div className="mobileMeta">
          <span>Plan</span>
          <strong>
            {safeText(profile?.plan)}
          </strong>
        </div>

        <div className="mobileMeta">
          <span>Expiry</span>
          <strong>
            {formatDate(profile?.expires_at)}
          </strong>

          {remaining !== null ? (
            <small
              className={
                remaining <= 0
                  ? 'mobileDanger'
                  : remaining <= 7
                    ? 'mobileWarning'
                    : ''
              }
            >
              {remaining > 0
                ? `${remaining} days left`
                : 'Expired'}
            </small>
          ) : null}
        </div>

        <div className="mobileMeta">
          <span>Created</span>
          <strong>
            {formatDate(profile?.created_at)}
          </strong>
        </div>
      </div>

      <div className="mobileCardAction">
        <ProfileAction
          profile={profile}
          actionHref={actionHref}
          actionLabel={actionLabel}
          openInNewTab={openInNewTab}
        />
      </div>
    </article>
  );
}

export default function ProfileTable({
  profiles = [],
  columns = DEFAULT_COLUMNS,
  actionHref,
  actionLabel = 'Open',
  openInNewTab = true,
  emptyTitle = 'No profiles found',
  emptyDescription =
    'Try another search term or clear the current filters.',
  className = '',
}) {
  const rows = Array.isArray(profiles)
    ? profiles
    : [];

  const activeColumns = Array.isArray(columns)
    ? columns
    : DEFAULT_COLUMNS;

  const hasColumn = (name) =>
    activeColumns.includes(name);

  return (
    <div
      className={`profileTableRoot ${className}`.trim()}
    >
      {rows.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="desktopTable">
            <div className="tableScroll">
              <table className="profileTable">
                <thead>
                  <tr>
                    {hasColumn('identity') ? (
                      <th>Identity</th>
                    ) : null}

                    {hasColumn('profession') ? (
                      <th>Profession</th>
                    ) : null}

                    {hasColumn('plan') ? (
                      <th>Plan</th>
                    ) : null}

                    {hasColumn('status') ? (
                      <th>Status</th>
                    ) : null}

                    {hasColumn('expiry') ? (
                      <th>Expiry</th>
                    ) : null}

                    {hasColumn('created') ? (
                      <th>Created</th>
                    ) : null}

                    {hasColumn('action') ? (
                      <th className="actionHeader">
                        Action
                      </th>
                    ) : null}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((profile, index) => {
                    const key =
                      profile?.id ||
                      profile?.slug ||
                      `profile-${index}`;

                    return (
                      <tr key={key}>
                        {hasColumn('identity') ? (
                          <td>
                            <IdentityBlock
                              profile={profile}
                            />
                          </td>
                        ) : null}

                        {hasColumn('profession') ? (
                          <td>
                            <span className="profession">
                              {safeText(
                                profile?.profession
                              )}
                            </span>

                            {profile?.category ? (
                              <span className="category">
                                {profile.category}
                              </span>
                            ) : null}
                          </td>
                        ) : null}

                        {hasColumn('plan') ? (
                          <td>
                            <span className="planBadge">
                              {safeText(
                                profile?.plan
                              )}
                            </span>
                          </td>
                        ) : null}

                        {hasColumn('status') ? (
                          <td>
                            <AdminStatusPill
                              status={profile?.status}
                            />
                          </td>
                        ) : null}

                        {hasColumn('expiry') ? (
                          <td>
                            <ExpiryBlock
                              value={
                                profile?.expires_at
                              }
                            />
                          </td>
                        ) : null}

                        {hasColumn('created') ? (
                          <td>
                            <span className="createdDate">
                              {formatDate(
                                profile?.created_at
                              )}
                            </span>
                          </td>
                        ) : null}

                        {hasColumn('action') ? (
                          <td className="actionCell">
                            <ProfileAction
                              profile={profile}
                              actionHref={actionHref}
                              actionLabel={actionLabel}
                              openInNewTab={
                                openInNewTab
                              }
                            />
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="mobileCards">
            {rows.map((profile, index) => {
              const key =
                profile?.id ||
                profile?.slug ||
                `mobile-profile-${index}`;

              return (
                <MobileProfileCard
                  key={key}
                  profile={profile}
                  actionHref={actionHref}
                  actionLabel={actionLabel}
                  openInNewTab={openInNewTab}
                />
              );
            })}
          </div>
        </>
      )}

      <style>{`
        .profileTableRoot {
          width: 100%;
          color: #111827;
          background: #fff;
        }

        .desktopTable {
          width: 100%;
        }

        .tableScroll {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }

        .profileTable {
          width: 100%;
          min-width: 920px;
          border-collapse: separate;
          border-spacing: 0;
        }

        .profileTable thead th {
          padding: 13px 16px;
          background: #fafafa;
          border-bottom: 1px solid #eceff2;
          color: #6b7280;
          text-align: left;
          white-space: nowrap;
          font-size: 10px;
          line-height: 1.2;
          font-weight: 900;
          letter-spacing: .085em;
          text-transform: uppercase;
        }

        .profileTable thead th:first-child {
          padding-left: 20px;
        }

        .profileTable thead th:last-child {
          padding-right: 20px;
        }

        .profileTable tbody tr {
          transition:
            background .18s ease,
            box-shadow .18s ease;
        }

        .profileTable tbody tr:hover {
          background: #fcfdfd;
        }

        .profileTable tbody td {
          padding: 16px;
          border-bottom: 1px solid #f0f1f3;
          vertical-align: middle;
          font-size: 12px;
        }

        .profileTable tbody tr:last-child td {
          border-bottom: 0;
        }

        .profileTable tbody td:first-child {
          padding-left: 20px;
        }

        .profileTable tbody td:last-child {
          padding-right: 20px;
        }

        .profileIdentity {
          display: flex;
          align-items: center;
          min-width: 220px;
          gap: 11px;
        }

        .identityAvatar {
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          display: grid;
          place-items: center;
          border: 1px solid #e5e7eb;
          border-radius: 13px;
          background:
            linear-gradient(
              145deg,
              #f8fafc,
              #eef2f7
            );
          color: #111827;
          font-size: 14px;
          font-weight: 950;
          letter-spacing: -.03em;
        }

        .identityContent {
          min-width: 0;
        }

        .identityName {
          overflow: hidden;
          color: #111827;
          font-size: 13px;
          line-height: 1.3;
          font-weight: 900;
          letter-spacing: -.015em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .identitySlug {
          max-width: 210px;
          margin-top: 4px;
          overflow: hidden;
          color: #6b7280;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: 10px;
          line-height: 1.4;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .identityLocation {
          display: flex;
          align-items: center;
          gap: 4px;
          max-width: 210px;
          margin-top: 4px;
          overflow: hidden;
          color: #9ca3af;
          font-size: 10px;
          line-height: 1.4;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .identityLocation span {
          color: #10b981;
          font-size: 12px;
        }

        .profession {
          display: block;
          color: #374151;
          font-size: 12px;
          font-weight: 700;
        }

        .category {
          display: inline-block;
          margin-top: 4px;
          color: #9ca3af;
          font-size: 10px;
          font-weight: 700;
        }

        .planBadge {
          display: inline-flex;
          min-height: 28px;
          align-items: center;
          padding: 0 9px;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          background: #f9fafb;
          color: #374151;
          font-size: 10px;
          font-weight: 850;
          white-space: nowrap;
        }

        .expiryBlock {
          min-width: 100px;
        }

        .dateValue {
          color: #374151;
          font-size: 11px;
          font-weight: 750;
          white-space: nowrap;
        }

        .remaining {
          margin-top: 4px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .remaining-normal {
          color: #6b7280;
        }

        .remaining-warning {
          color: #d97706;
        }

        .remaining-expired {
          color: #dc2626;
        }

        .createdDate {
          color: #6b7280;
          font-size: 11px;
          white-space: nowrap;
        }

        .actionHeader {
          text-align: right !important;
        }

        .actionCell {
          text-align: right;
        }

        .openButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 34px;
          padding: 0 11px;
          border: 1px solid #dbeafe;
          border-radius: 10px;
          background: #eff6ff;
          color: #1d4ed8;
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
          transition:
            transform .18s ease,
            background .18s ease,
            border-color .18s ease,
            box-shadow .18s ease;
        }

        .openButton:hover {
          border-color: #bfdbfe;
          background: #dbeafe;
          box-shadow:
            0 6px 18px rgba(37, 99, 235, .08);
          transform: translateY(-1px);
        }

        .openButton:focus-visible {
          outline: 3px solid rgba(37, 99, 235, .2);
          outline-offset: 2px;
        }

        .openArrow {
          font-size: 13px;
          line-height: 1;
        }

        .actionDisabled {
          color: #9ca3af;
          font-size: 11px;
          font-weight: 700;
        }

        .emptyState {
          display: flex;
          min-height: 360px;
          padding: 48px 24px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
        }

        .emptyIcon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin-bottom: 14px;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          background: #f9fafb;
          color: #9ca3af;
          font-size: 30px;
          font-weight: 400;
        }

        .emptyState h3 {
          margin: 0;
          color: #111827;
          font-size: 20px;
          line-height: 1.2;
          font-weight: 900;
          letter-spacing: -.035em;
        }

        .emptyState p {
          max-width: 440px;
          margin: 8px 0 0;
          color: #6b7280;
          font-size: 13px;
          line-height: 1.65;
        }

        .mobileCards {
          display: none;
        }

        .mobileCard {
          padding: 16px;
          border-bottom: 1px solid #eef0f3;
          background: #fff;
        }

        .mobileCard:last-child {
          border-bottom: 0;
        }

        .mobileCardTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .mobileCardTop .profileIdentity {
          min-width: 0;
          flex: 1;
        }

        .mobileMetaGrid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .mobileMeta {
          min-width: 0;
          padding: 11px;
          border: 1px solid #eef0f3;
          border-radius: 13px;
          background: #fafafa;
        }

        .mobileMeta span {
          display: block;
          margin-bottom: 5px;
          color: #9ca3af;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .mobileMeta strong {
          display: block;
          overflow: hidden;
          color: #374151;
          font-size: 11px;
          font-weight: 850;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mobileMeta small {
          display: block;
          margin-top: 4px;
          color: #6b7280;
          font-size: 9px;
          font-weight: 800;
        }

        .mobileMeta small.mobileWarning {
          color: #d97706;
        }

        .mobileMeta small.mobileDanger {
          color: #dc2626;
        }

        .mobileCardAction {
          margin-top: 14px;
        }

        .mobileCardAction .openButton {
          width: 100%;
          min-height: 42px;
        }

        @media (max-width: 760px) {
          .desktopTable {
            display: none;
          }

          .mobileCards {
            display: block;
          }

          .emptyState {
            min-height: 300px;
            padding: 40px 20px;
          }
        }

        @media (max-width: 430px) {
          .mobileCard {
            padding: 14px;
          }

          .mobileCardTop {
            align-items: flex-start;
          }

          .mobileCardTop .profileIdentity {
            gap: 9px;
          }

          .mobileCardTop .identityAvatar {
            width: 36px;
            height: 36px;
            flex-basis: 36px;
            border-radius: 11px;
          }

          .mobileCardTop .identityName {
            font-size: 12px;
          }

          .mobileMetaGrid {
            gap: 8px;
          }

          .mobileMeta {
            padding: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profileTable tbody tr,
          .openButton {
            transition: none;
          }

          .openButton:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}