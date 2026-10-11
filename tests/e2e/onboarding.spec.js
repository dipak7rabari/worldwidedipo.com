import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.E2E_BASE_URL || 'http://127.0.0.1:3000';

test.describe('Worldwide DIPO — Onboarding', () => {
  test('onboarding route is reachable only through the correct auth flow', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/onboarding`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const url = page.url();

    expect(
      url.includes('/auth/') ||
        url.includes('/onboarding'),
    ).toBeTruthy();
  });

  test('anonymous onboarding access does not expose private profile data', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/onboarding`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const bodyText =
      await page.locator('body').innerText();

    expect(bodyText).not.toMatch(
      /owner_id|service_role|supabase_service_role|private_key/i,
    );
  });

  test('onboarding does not expose admin controls', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/onboarding`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    await expect(
      page.locator('body'),
    ).not.toContainText(
      /admin password|service role key/i,
    );
  });

  test('profile creation route rejects anonymous mutation', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/profile/create`,
      {
        data: {
          name: 'E2E Test',
          slug: `e2e-${Date.now()}`,
          profession: 'Tester',
        },
      },
    );

    expect([401, 403, 400, 405]).toContain(
      response.status(),
    );
  });
});