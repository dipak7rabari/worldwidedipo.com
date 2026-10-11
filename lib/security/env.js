const PUBLIC_ENV = [
  'NEXT_PUBLIC_BASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
];

const SERVER_ENV = [
  'SUPABASE_SECRET_KEY',
  'CRON_SECRET',
];

function readEnv(name) {
  const value = process.env[name];

  if (!value || !value.trim()) {
    return null;
  }

  return value.trim();
}

export function getPublicEnv(name) {
  if (!PUBLIC_ENV.includes(name)) {
    throw new Error(`Unknown public environment variable: ${name}`);
  }

  const value = readEnv(name);

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getServerEnv(name) {
  if (!SERVER_ENV.includes(name)) {
    throw new Error(`Unknown server environment variable: ${name}`);
  }

  const value = readEnv(name);

  if (!value) {
    throw new Error(`Missing server environment variable: ${name}`);
  }

  return value;
}

export function hasEnv(name) {
  return Boolean(readEnv(name));
}