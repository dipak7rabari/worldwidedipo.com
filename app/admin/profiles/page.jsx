import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminShell from '@/components/admin/AdminShell';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminStatusPill from '@/components/admin/AdminStatusPill';

import { getAdminProfiles } from '@/lib/admin/admin-profiles';
import {
  canViewAdminData,
} from '@/lib/admin/admin-auth';

export const metadata = {
  title: 'Profiles | Worldwide DIPO Admin',
  description: 'Worldwide DIPO private profile administration.',
  robots: {
    index: false,
    follow: false,
  },
};

function formatDate(value) {
  if (!value) return '—';

  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return '—';
  }
}

function daysRemaining(value) {
  if (!value) return null;

  const end = new Date(value).getTime();
  const now = Date.now();

  return Math.ceil(
    (end - now) / (1000 * 60 * 60 * 24)
  );
}

function createPageUrl({
  query,
  status,
  plan,
  page,
}) {
  const params = new URLSearchParams();

  if (query) params.set('query', query);
  if (status) params.set('status', status);
  if (plan) params.set('plan', plan);
  if (page > 1) params.set('page', String(page));

  const value = params.toString();

  return value
    ? `/admin/profiles?${value}`
    : '/admin/profiles';
}

export default async function AdminProfilesPage({
  searchParams,
}) {
  const allowed = await canViewAdminData();

  if (!allowed) {
    redirect('/admin/login?next=/admin/profiles');
  }

  const params = await searchParams;

  const query =
    typeof params?.query === 'string'
      ? params.query.trim().slice(0, 80)
      : '';

  const status =
    typeof params?.status === 'string'
      ? params.status
      : '';

  const plan =
    typeof params?.plan === 'string'
      ? params.plan
      : '';

  const page = Math.max(
    1,
    Number.parseInt(params?.page || '1', 10) || 1
  );

  let result;

  try {
    result = await getAdminProfiles({
      query,
      status,
      plan,
      page,
    });
  } catch (error) {
    return (
      <AdminShell
        title="Profiles"
        subtitle="DIPO IDENTITY DATABASE"
      >
        <section
          style={{
            padding: 28,
            borderRadius: 24,
            background: '#fff',
            border: '1px solid #fecaca',
            boxShadow: '0 16px 45px rgba(17,24,39,.06)',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              display: 'grid',
              placeItems: 'center',
              background: '#fef2f2',
              color: '#dc2626',
              fontWeight: 950,
              fontSize: 20,
            }}
          >
            !
          </div>

          <h2
            style={{
              margin: '18px 0 8px',
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: '-.04em',
            }}
          >
            Profile database unavailable
          </h2>

          <p
            style={{
              margin: 0,
              maxWidth: 680,
              color: '#6b7280',
              lineHeight: 1.7,
            }}
          >
            The admin profile query could not be completed.
            Check Supabase connectivity, permissions and
            server environment configuration.
          </p>

          {process.env.NODE_ENV !== 'production' ? (
            <pre
              style={{
                marginTop: 18,
                padding: 16,
                overflowX: 'auto',
                borderRadius: 14,
                background: '#111827',
                color: '#e5e7eb',
                fontSize: 12,
              }}
            >
              {error instanceof Error
                ? error.message
                : String(error)}
            </pre>
          ) : null}
        </section>
      </AdminShell>
    );
  }

  const { profiles, stats, total, totalPages } = result;

  return (
    <AdminShell
      title="Profiles"
      subtitle="DIPO IDENTITY DATABASE"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}
      >
        <AdminMetricCard
          label="Total identities"
          value={stats.total}
          detail={`${total} shown by current filter`}
          tone="dark"
        />

        <AdminMetricCard
          label="Live profiles"
          value={stats.active}
          detail="Public + searchable state"
          tone="green"
        />

        <AdminMetricCard
          label="Pending"
          value={stats.pending}
          detail="Awaiting payment verification"
          tone="amber"
        />

        <AdminMetricCard
          label="Expired"
          value={stats.expired}
          detail="Outside active lifecycle"
          tone="red"
        />

        <AdminMetricCard
          label="Pro"
          value={stats.pro}
          detail="Creator / shop tier"
          tone="blue"
        />

        <AdminMetricCard
          label="Elite"
          value={stats.elite}
          detail="Authority tier"
          tone="blue"
        />
      </div>

      <section
        style={{
          padding: 18,
          borderRadius: 24,
          background: '#fff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 16px 45px rgba(17,24,39,.05)',
          marginBottom: 20,
        }}
      >
        <form
          method="GET"
          action="/admin/profiles"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(220px, 1fr) 160px 160px auto',
            gap: 10,
          }}
        >
          <input
            name="query"
            defaultValue={query}
            placeholder="Search name, slug, profession..."
            maxLength={80}
            style={{
              width: '100%',
              minHeight: 46,
              borderRadius: 13,
              border: '1px solid #d1d5db',
              padding: '0 14px',
              outline: 'none',
              fontSize: 13,
              background: '#fafafa',
            }}
          />

          <select
            name="status"
            defaultValue={status}
            style={{
              minHeight: 46,
              borderRadius: 13,
              border: '1px solid #d1d5db',
              padding: '0 12px',
              fontSize: 13,
              background: '#fff',
            }}
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
          </select>

          <select
            name="plan"
            defaultValue={plan}
            style={{
              minHeight: 46,
              borderRadius: 13,
              border: '1px solid #d1d5db',
              padding: '0 12px',
              fontSize: 13,
              background: '#fff',
            }}
          >
            <option value="">All plans</option>
            <option value="Starter">Starter</option>
            <option value="Pro">Pro</option>
            <option value="Elite">Elite</option>
          </select>

          <button
            type="submit"
            style={{
              minHeight: 46,
              border: 0,
              borderRadius: 13,
              padding: '0 20px',
              background: '#111827',
              color: '#fff',
              fontWeight: 850,
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        {(query || status || plan) ? (
          <div style={{ marginTop: 12 }}>
            <Link
              href="/admin/profiles"
              style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Reset all filters →
            </Link>
          </div>
        ) : null}
      </section>

      <section
        style={{
          overflow: 'hidden',
          borderRadius: 24,
          background: '#fff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 16px 45px rgba(17,24,39,.05)',
        }}
      >
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid #eef0f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 16,
                letterSpacing: '-.025em',
              }}
            >
              Identity registry
            </div>

            <div
              style={{
                color: '#6b7280',
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Server-side protected admin view
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#6b7280',
            }}
          >
            Page {page} / {totalPages}
          </div>
        </div>

        {profiles.length === 0 ? (
          <div
            style={{
              padding: '70px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 38,
                marginBottom: 12,
              }}
            >
              ◌
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              No profiles found
            </h3>

            <p
              style={{
                color: '#6b7280',
                margin: '8px auto 0',
                maxWidth: 460,
                lineHeight: 1.6,
                fontSize: 13,
              }}
            >
              Try another search term or clear the
              current filters.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                minWidth: 920,
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: '#fafafa',
                  }}
                >
                  {[
                    'Identity',
                    'Profession',
                    'Plan',
                    'Status',
                    'Expiry',
                    'Created',
                    'Action',
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: 'left',
                        padding: '13px 16px',
                        color: '#6b7280',
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: '.08em',
                        textTransform: 'uppercase',
                        borderBottom:
                          '1px solid #eef0f3',
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {profiles.map((profile) => {
                  const remaining = daysRemaining(
                    profile.expires_at
                  );

                  return (
                    <tr key={profile.id}>
                      <td
                        style={{
                          padding: '16px',
                          borderBottom:
                            '1px solid #f0f1f3',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 900,
                            fontSize: 13,
                          }}
                        >
                          {profile.name || 'Unnamed'}
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            color: '#6b7280',
                            fontSize: 11,
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, monospace',
                          }}
                        >
                          /p/{profile.slug}
                        </div>

                        {profile.location ? (
                          <div
                            style={{
                              marginTop: 5,
                              color: '#9ca3af',
                              fontSize: 11,
                            }}
                          >
                            {profile.location}
                          </div>
                        ) : null}
                      </td>

                      <td
                        style={{
                          padding: '16px',
                          borderBottom:
                            '1px solid #f0f1f3',
                          fontSize: 12,
                          color: '#4b5563',
                        }}
                      >
                        {profile.profession || '—'}
                      </td>

                      <td
                        style={{
                          padding: '16px',
                          borderBottom:
                            '1px solid #f0f1f3',
                          fontSize: 12,
                          fontWeight: 850,
                        }}
                      >
                        {profile.plan || '—'}
                      </td>

                      <td
                        style={{
                          padding: '16px',
                          borderBottom:
                            '1px solid #f0f1f3',
                        }}
                      >
                        <AdminStatusPill
                          status={profile.status}
                        />
                      </td>

                      <td
                        style={{
                          padding: '16px',
                          borderBottom:
                            '1px solid #f0f1f3',
                          fontSize: 12,
                        }}
                      >
                        <div>
                          {formatDate(
                            profile.expires_at
                          )}
                        </div>

                        {remaining !== null ? (
                          <div
                            style={{
                              marginTop: 4,
                              color:
                                remaining <= 7
                                  ? '#dc2626'
                                  : '#6b7280',
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            {remaining > 0
                              ? `${remaining} days left`
                              : 'Expired'}
                          </div>
                        ) : null}
                      </td>

                      <td
                        style={{
                          padding: '16px',
                          borderBottom:
                            '1px solid #f0f1f3',
                          color: '#6b7280',
                          fontSize: 11,
                        }}
                      >
                        {formatDate(
                          profile.created_at
                        )}
                      </td>

                      <td
                        style={{
                          padding: '16px',
                          borderBottom:
                            '1px solid #f0f1f3',
                        }}
                      >
                        <Link
                          href={`/p/${encodeURIComponent(
                            profile.slug
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            minHeight: 34,
                            padding: '0 11px',
                            borderRadius: 10,
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            textDecoration: 'none',
                            fontSize: 11,
                            fontWeight: 900,
                          }}
                        >
                          Open ↗
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 ? (
          <div
            style={{
              padding: 16,
              borderTop: '1px solid #eef0f3',
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {page > 1 ? (
              <Link
                href={createPageUrl({
                  query,
                  status,
                  plan,
                  page: page - 1,
                })}
                style={{
                  padding: '9px 13px',
                  borderRadius: 10,
                  background: '#f3f4f6',
                  color: '#374151',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 850,
                }}
              >
                ← Previous
              </Link>
            ) : null}

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 12px',
                color: '#6b7280',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {page} / {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={createPageUrl({
                  query,
                  status,
                  plan,
                  page: page + 1,
                })}
                style={{
                  padding: '9px 13px',
                  borderRadius: 10,
                  background: '#111827',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 850,
                }}
              >
                Next →
              </Link>
            ) : null}
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}