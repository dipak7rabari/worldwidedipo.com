import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.E2E_BASE_URL || 'http://127.0.0.1:3000';

const PUBLIC_SLUG =
  process.env.E2E_PUBLIC_SLUG || '';

test.describe('Worldwide DIPO — Public Profile', () => {
  test('public profile route handles an invalid slug safely', async ({
    page,
  }) => {
    const response = await page.goto(
      `${BASE_URL}/p/this-profile-definitely-does-not-exist-${Date.now()}`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response).not.toBeNull();

    expect([200, 404]).toContain(
      response.status(),
    );

    const bodyText =
      await page.locator('body').innerText();

    expect(bodyText).not.toMatch(
      /service_role|SUPABASE_SERVICE_ROLE_KEY|owner_id/i,
    );
  });

  test('valid public profile is accessible when E2E_PUBLIC_SLUG is configured', async ({
    page,
  }) => {
    test.skip(
      !PUBLIC_SLUG,
      'Set E2E_PUBLIC_SLUG to test a real active public DIPO.',
    );

    const response = await page.goto(
      `${BASE_URL}/p/${encodeURIComponent(
        PUBLIC_SLUG,
      )}`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response).not.toBeNull();
    expect(response.status()).toBe(200);

    await expect(
      page.locator('body'),
    ).toBeVisible();

    const html = await page.content();

    expect(html).not.toMatch(
      /service_role|SUPABASE_SERVICE_ROLE_KEY/i,
    );
  });

  test('public profile does not expose private dashboard controls to visitors', async ({
    page,
  }) => {
    test.skip(
      !PUBLIC_SLUG,
      'Set E2E_PUBLIC_SLUG to test a real active public DIPO.',
    );

    await page.goto(
      `${BASE_URL}/p/${encodeURIComponent(
        PUBLIC_SLUG,
      )}`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const bodyText =
      await page.locator('body').innerText();

    expect(bodyText).not.toMatch(
      /payment admin|service role|admin dashboard/i,
    );
  });

  test('public profile page has usable SEO metadata', async ({
    page,
  }) => {
    test.skip(
      !PUBLIC_SLUG,
      'Set E2E_PUBLIC_SLUG to test a real active public DIPO.',
    );

    await page.goto(
      `${BASE_URL}/p/${encodeURIComponent(
        PUBLIC_SLUG,
      )}`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    await expect(
      page.locator('head title'),
    ).toHaveCount(1);

    await expect(
      page.locator(
        'meta[name="description"]',
      ),
    ).toHaveCount(1);
  });
});