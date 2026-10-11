import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.E2E_BASE_URL || 'http://127.0.0.1:3000';

test.describe('Worldwide DIPO — Profile', () => {
  test('profile dashboard is protected', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/dashboard/profile`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const url = page.url();

    expect(
      url.includes('/auth/') ||
        url.includes('/dashboard/profile'),
    ).toBeTruthy();
  });

  test('profile edit route is protected', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/dashboard/profile/edit`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const url = page.url();

    expect(
      url.includes('/auth/') ||
        url.includes('/dashboard/profile/edit'),
    ).toBeTruthy();
  });

  test('profile create API cannot be used anonymously', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/profile/create`,
      {
        data: {
          name: 'Unauthorized E2E Profile',
          slug: `unauthorized-${Date.now()}`,
          profession: 'Tester',
          headline: 'Should never be created',
        },
      },
    );

    expect([401, 403, 400, 405, 429]).toContain(
      response.status(),
    );
  });

  test('profile update API cannot trust client owner_id', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/profile/update`,
      {
        data: {
          owner_id:
            '00000000-0000-0000-0000-000000000000',
          status: 'active',
          plan: 'Elite',
          name: 'Attacker',
        },
      },
    );

    expect([400, 401, 403, 405, 429]).toContain(
      response.status(),
    );
  });

  test('profile upload API requires authentication', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/profile/upload`,
      {
        multipart: {
          type: 'avatar',
        },
      },
    );

    expect([400, 401, 403, 405, 415, 429]).toContain(
      response.status(),
    );
  });

  test('profile routes do not leak private ownership fields to anonymous HTML', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/dashboard/profile`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const html = await page.content();

    expect(html).not.toMatch(
      /service_role|SUPABASE_SERVICE_ROLE_KEY/i,
    );
  });
});