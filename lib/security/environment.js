const publicRequired = [
  'NEXT_PUBLIC_BASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_UPI_ID',
  'NEXT_PUBLIC_PAYEE_NAME',
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
];

const serverRequired = [
  'SUPABASE_SECRET_KEY',
  'TURNSTILE_SECRET_KEY',
  'CRON_SECRET',
];

function isPlaceholder(value) {
  if (!value) return true;

  const normalized = value.toLowerCase();

  return (
    normalized.includes('your-') ||
    normalized.includes('your_') ||
    normalized.includes('xxx') ||
    normalized.includes('change-me') ||
    normalized.includes('example')
  );
}

export function getEnvironmentStatus() {
  const missingPublic = publicRequired.filter(
    (key) => isPlaceholder(process.env[key])
  );

  const missingServer = serverRequired.filter(
    (key) => isPlaceholder(process.env[key])
  );

  return {
    valid:
      missingPublic.length === 0 &&
      missingServer.length === 0,

    missingPublic,
    missingServer,
  };
}

export function assertServerEnvironment() {
  const result = getEnvironmentStatus();

  if (!result.valid) {
    throw new Error(
      `Production environment is incomplete. Missing: ${[
        ...result.missingPublic,
        ...result.missingServer,
      ].join(', ')}`
    );
  }

  return true;
}