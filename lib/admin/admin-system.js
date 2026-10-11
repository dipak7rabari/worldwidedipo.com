import { getAdminServiceClient } from './admin-service-client';

function configured(value) {
  return Boolean(value && String(value).trim());
}

async function countRows(supabase, table) {
  const { count, error } = await supabase
    .from(table)
    .select('*', {
      count: 'exact',
      head: true,
    });

  return {
    count: count ?? 0,
    healthy: !error,
    error: error?.message ?? null,
  };
}

export async function getSystemSnapshot() {
  const supabase = getAdminServiceClient();

  const [profiles, payments, admins, auditLogs] = await Promise.all([
    countRows(supabase, 'profiles'),
    countRows(supabase, 'payments'),
    countRows(supabase, 'admin_users'),
    countRows(supabase, 'audit_logs'),
  ]);

  const env = {
    baseUrl: configured(process.env.NEXT_PUBLIC_BASE_URL),
    supabaseUrl: configured(process.env.NEXT_PUBLIC_SUPABASE_URL),
    publishableKey: configured(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ),
    secretKey: configured(process.env.SUPABASE_SECRET_KEY),
    upiId: configured(process.env.NEXT_PUBLIC_UPI_ID),
    payeeName: configured(process.env.NEXT_PUBLIC_PAYEE_NAME),
    turnstileSiteKey: configured(
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    ),
    turnstileSecret: configured(process.env.TURNSTILE_SECRET_KEY),
    cronSecret: configured(process.env.CRON_SECRET),
  };

  const databaseHealthy =
    profiles.healthy &&
    payments.healthy &&
    admins.healthy &&
    auditLogs.healthy;

  const environmentReady = Object.values(env).every(Boolean);

  return {
    generatedAt: new Date().toISOString(),
    databaseHealthy,
    environmentReady,
    env,
    database: {
      profiles,
      payments,
      admins,
      auditLogs,
    },
  };
}