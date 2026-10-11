import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminShell from '@/components/admin/AdminShell';
import AdminMetricCard from '@/components/admin/AdminMetricCard';

import {
  canViewAdminData,
} from '@/lib/admin/admin-auth';

import {
  getSystemSnapshot,
} from '@/lib/admin/admin-system';

export const metadata = {
  title: 'Settings | Worldwide DIPO Admin',
  description: 'Worldwide DIPO system administration and configuration.',
  robots: {
    index: false,
    follow: false,
  },
};

function ConfigItem({
  label,
  configured,
  description,
  sensitive = false,
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '16px 0',
        borderBottom: '1px solid #eef0f3',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 850,
            color: '#111827',
          }}
        >
          {label}
        </div>

        <div
          style={{
            marginTop: 4,
            color: '#6b7280',
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          minHeight: 29,
          padding: '0 10px',
          borderRadius: 999,
          background: configured
            ? '#ecfdf5'
            : '#fef2f2',
          color: configured
            ? '#047857'
            : '#b91c1c',
          fontSize: 10,
          fontWeight: 950,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: configured
              ? '#10b981'
              : '#ef4444',
          }}
        />

        {configured
          ? sensitive
            ? 'CONFIGURED'
            : 'READY'
          : 'MISSING'}
      </div>
    </div>
  );
}

function DatabaseRow({
  label,
  value,
  healthy,
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        padding: '14px 0',
        borderBottom: '1px solid #eef0f3',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: '#6b7280',
            fontWeight: 750,
          }}
        >
          {value}
        </span>

        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: healthy
              ? '#10b981'
              : '#ef4444',
          }}
        />
      </div>
    </div>
  );
}

export default async function AdminSettingsPage() {
  const allowed = await canViewAdminData();

  if (!allowed) {
    redirect('/admin/login?next=/admin/settings');
  }

  let snapshot;

  try {
    snapshot = await getSystemSnapshot();
  } catch {
    snapshot = null;
  }

  if (!snapshot) {
    return (
      <AdminShell
        title="Settings"
        subtitle="SYSTEM CONTROL"
      >
        <section
          style={{
            padding: 30,
            borderRadius: 24,
            background: '#fff',
            border: '1px solid #fecaca',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 900,
            }}
          >
            System configuration unavailable
          </h2>

          <p
            style={{
              color: '#6b7280',
              lineHeight: 1.7,
            }}
          >
            The secure system snapshot could not be
            loaded. Verify the server environment and
            Supabase configuration.
          </p>
        </section>
      </AdminShell>
    );
  }

  const env = snapshot.env;

  const healthyCount = Object.values(
    snapshot.database
  ).filter((item) => item.healthy).length;

  const databaseCount = Object.keys(
    snapshot.database
  ).length;

  return (
    <AdminShell
      title="Settings"
      subtitle="SYSTEM CONTROL"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}
      >
        <AdminMetricCard
          label="System"
          value={snapshot.environmentReady ? 'READY' : 'CHECK'}
          detail="Production environment"
          tone={
            snapshot.environmentReady
              ? 'green'
              : 'amber'
          }
        />

        <AdminMetricCard
          label="Database"
          value={
            snapshot.databaseHealthy
              ? 'ONLINE'
              : 'ISSUE'
          }
          detail={`${healthyCount}/${databaseCount} services healthy`}
          tone={
            snapshot.databaseHealthy
              ? 'green'
              : 'red'
          }
        />

        <AdminMetricCard
          label="Profiles"
          value={
            snapshot.database.profiles.count
          }
          detail="Identity records"
          tone="blue"
        />

        <AdminMetricCard
          label="Payments"
          value={
            snapshot.database.payments.count
          }
          detail="Payment records"
          tone="blue"
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(0, 1.35fr) minmax(300px, .65fr)',
          gap: 20,
          alignItems: 'start',
        }}
      >
        <section
          style={{
            padding: 22,
            borderRadius: 24,
            background: '#fff',
            border: '1px solid #e5e7eb',
            boxShadow:
              '0 16px 45px rgba(17,24,39,.05)',
          }}
        >
          <div
            style={{
              marginBottom: 6,
              fontSize: 18,
              fontWeight: 950,
              letterSpacing: '-.035em',
            }}
          >
            Environment readiness
          </div>

          <div
            style={{
              color: '#6b7280',
              fontSize: 12,
              lineHeight: 1.6,
              marginBottom: 8,
            }}
          >
            Values are checked server-side. Secret
            values are never rendered here.
          </div>

          <ConfigItem
            label="Production base URL"
            configured={env.baseUrl}
            description="Canonical Worldwide DIPO origin."
          />

          <ConfigItem
            label="Supabase URL"
            configured={env.supabaseUrl}
            description="Database and authentication endpoint."
          />

          <ConfigItem
            label="Supabase publishable key"
            configured={env.publishableKey}
            description="Public client authentication key."
          />

          <ConfigItem
            label="Supabase secret key"
            configured={env.secretKey}
            sensitive
            description="Server-only privileged database access."
          />

          <ConfigItem
            label="Official UPI ID"
            configured={env.upiId}
            sensitive
            description="Payment destination configured for checkout."
          />

          <ConfigItem
            label="Payee name"
            configured={env.payeeName}
            description="Payment display name."
          />

          <ConfigItem
            label="Turnstile site key"
            configured={env.turnstileSiteKey}
            description="Client CAPTCHA protection."
          />

          <ConfigItem
            label="Turnstile secret"
            configured={env.turnstileSecret}
            sensitive
            description="Server-side CAPTCHA verification."
          />

          <ConfigItem
            label="Cron secret"
            configured={env.cronSecret}
            sensitive
            description="Protected scheduled maintenance endpoints."
          />
        </section>

        <div
          style={{
            display: 'grid',
            gap: 20,
          }}
        >
          <section
            style={{
              padding: 22,
              borderRadius: 24,
              background: '#111827',
              color: '#fff',
              boxShadow:
                '0 20px 55px rgba(17,24,39,.14)',
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: '#93c5fd',
              }}
            >
              Security posture
            </div>

            <h2
              style={{
                margin: '10px 0 8px',
                fontSize: 25,
                lineHeight: 1.05,
                fontWeight: 950,
                letterSpacing: '-.045em',
              }}
            >
              Private by design.
            </h2>

            <p
              style={{
                margin: 0,
                color: '#9ca3af',
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              Admin configuration is rendered only
              after server-side authorization. Secret
              environment values are never sent to the
              browser.
            </p>
          </section>

          <section
            style={{
              padding: 22,
              borderRadius: 24,
              background: '#fff',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                marginBottom: 8,
              }}
            >
              Database health
            </div>

            <DatabaseRow
              label="Profiles"
              value={
                snapshot.database.profiles.count
              }
              healthy={
                snapshot.database.profiles.healthy
              }
            />

            <DatabaseRow
              label="Payments"
              value={
                snapshot.database.payments.count
              }
              healthy={
                snapshot.database.payments.healthy
              }
            />

            <DatabaseRow
              label="Admin users"
              value={
                snapshot.database.admins.count
              }
              healthy={
                snapshot.database.admins.healthy
              }
            />

            <DatabaseRow
              label="Audit logs"
              value={
                snapshot.database.auditLogs.count
              }
              healthy={
                snapshot.database.auditLogs.healthy
              }
            />
          </section>

          <section
            style={{
              padding: 22,
              borderRadius: 24,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
            }}
          >
            <div
              style={{
                color: '#1d4ed8',
                fontSize: 11,
                fontWeight: 950,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
              }}
            >
              Quick access
            </div>

            <div
              style={{
                display: 'grid',
                gap: 8,
                marginTop: 14,
              }}
            >
              <Link
                href="/admin/security"
                style={{
                  textDecoration: 'none',
                  color: '#1e3a8a',
                  fontWeight: 850,
                  fontSize: 12,
                }}
              >
                Security center →
              </Link>

              <Link
                href="/admin/audit"
                style={{
                  textDecoration: 'none',
                  color: '#1e3a8a',
                  fontWeight: 850,
                  fontSize: 12,
                }}
              >
                Audit trail →
              </Link>

              <Link
                href="/admin/payments"
                style={{
                  textDecoration: 'none',
                  color: '#1e3a8a',
                  fontWeight: 850,
                  fontSize: 12,
                }}
              >
                Payment review →
              </Link>
            </div>
          </section>
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          padding: '14px 16px',
          borderRadius: 15,
          background: '#f9fafb',
          border: '1px solid #eef0f3',
          color: '#6b7280',
          fontSize: 11,
          lineHeight: 1.6,
        }}
      >
        Last server snapshot:{' '}
        {new Date(snapshot.generatedAt).toLocaleString(
          'en-IN',
          {
            dateStyle: 'medium',
            timeStyle: 'short',
          }
        )}
      </div>
    </AdminShell>
  );
}