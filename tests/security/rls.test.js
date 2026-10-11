import {
  describe,
  expect,
  it,
} from 'vitest';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile =
  fileURLToPath(import.meta.url);

const projectRoot = path.resolve(
  path.dirname(currentFile),
  '../..'
);

const migrationsDirectory = path.join(
  projectRoot,
  'supabase',
  'migrations'
);

function readMigration(filename) {
  return fs.readFileSync(
    path.join(
      migrationsDirectory,
      filename
    ),
    'utf8'
  );
}

function readAllMigrations() {
  const files = fs
    .readdirSync(migrationsDirectory)
    .filter((file) =>
      file.endsWith('.sql')
    )
    .sort();

  return files.map((file) => ({
    file,
    sql: readMigration(file),
  }));
}

describe('security: database RLS and authorization contracts', () => {
  it('contains the admin allowlist hardening migration', () => {
    const sql = readMigration(
      '018_admin_allowlist_security.sql'
    );

    expect(sql).toContain(
      'create table if not exists public.admin_allowlist'
    );

    expect(sql).toContain(
      'enable row level security'
    );

    expect(sql).toContain(
      'revoke all'
    );

    expect(sql).toContain(
      'current_user_email_is_admin_allowed'
    );

    expect(sql).toContain(
      'current_user_is_active_admin'
    );

    expect(sql).toContain(
      'current_user_is_admin'
    );

    expect(sql).toContain(
      'current_user_can_manage_payments'
    );
  });

  it('keeps the admin allowlist inaccessible to browser roles', () => {
    const sql = readMigration(
      '018_admin_allowlist_security.sql'
    );

    expect(sql).toContain(
      'revoke all'
    );

    expect(sql).toMatch(
      /on public\.admin_allowlist\s+from anon, authenticated/i
    );

    expect(sql).toMatch(
      /on public\.admin_allowlist\s+from public/i
    );
  });

  it('does not grant browser write access to admin_users', () => {
    const sql = readMigration(
      '018_admin_allowlist_security.sql'
    );

    expect(sql).toMatch(
      /revoke\s+insert,\s*update,\s*delete\s+on public\.admin_users\s+from anon, authenticated/i
    );
  });

  it('requires authenticated identity through auth.uid()', () => {
    const sql = readMigration(
      '018_admin_allowlist_security.sql'
    );

    expect(
      sql.match(
        /auth\.uid\(\)/g
      )?.length || 0
    ).toBeGreaterThan(0);
  });

  it('requires AAL2 for sensitive admin authorization', () => {
    const sql = readMigration(
      '018_admin_allowlist_security.sql'
    );

    expect(sql).toContain(
      "auth.jwt() ->> 'aal'"
    );

    expect(sql).toContain(
      " = 'aal2'"
    );
  });

  it('excludes support from payment management', () => {
    const sql = readMigration(
      '018_admin_allowlist_security.sql'
    );

    const paymentFunctionStart =
      sql.indexOf(
        'create or replace function public.current_user_can_manage_payments'
      );

    expect(
      paymentFunctionStart
    ).toBeGreaterThanOrEqual(0);

    const paymentFunction =
      sql.slice(
        paymentFunctionStart,
        sql.indexOf(
          '-- ============================================================',
          paymentFunctionStart + 100
        )
      );

    expect(paymentFunction).toContain(
      "'super_admin'"
    );

    expect(paymentFunction).toContain(
      "'admin'"
    );

    expect(paymentFunction).not.toContain(
      "'support'"
    );
  });

  it('uses auth.uid() for admin_users ownership checks', () => {
    const sql = readMigration(
      '018_admin_allowlist_security.sql'
    );

    expect(sql).toMatch(
      /user_id\s*=\s*\(select auth\.uid\(\)\)/i
    );
  });

  it('does not expose the admin allowlist through SELECT policy', () => {
    const sql = readMigration(
      '018_admin_allowlist_security.sql'
    );

    expect(sql).not.toMatch(
      /create policy[\s\S]*on public\.admin_allowlist[\s\S]*for select/i
    );
  });

  it('keeps public profile access behind the intended projection/RPC architecture', () => {
    const migrations =
      readAllMigrations();

    const publicProjection =
      migrations.find(
        ({ file }) =>
          file ===
          '011_public_profile_projection.sql'
      );

    expect(
      publicProjection
    ).toBeTruthy();

    expect(
      publicProjection.sql
    ).toContain(
      'get_public_profile'
    );

    expect(
      publicProjection.sql
    ).toContain(
      'status'
    );

    expect(
      publicProjection.sql
    ).toContain(
      'expires_at'
    );
  });

  it('contains payment security migrations', () => {
    const migrations =
      readAllMigrations();

    const paymentMigrations =
      migrations.filter(
        ({ file }) =>
          file.includes('payment')
      );

    expect(
      paymentMigrations.length
    ).toBeGreaterThan(0);

    const paymentSql =
      paymentMigrations
        .map(({ sql }) => sql)
        .join('\n');

    expect(paymentSql).toContain(
      'payments'
    );
  });

  it('contains storage security migration', () => {
    const sql = readMigration(
      '009_storage.sql'
    );

    expect(sql).toContain(
      'storage'
    );

    expect(
      sql.toLowerCase()
    ).toContain('policy');
  });
});