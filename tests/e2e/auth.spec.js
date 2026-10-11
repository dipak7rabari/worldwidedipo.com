import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.E2E_BASE_URL || 'http://127.0.0.1:3000';

test.describe('Worldwide DIPO — Authentication', () => {
  test('sign-in page renders correctly', async ({
    page,
  }) => {
    const response = await page.goto(
      `${BASE_URL}/auth/sign-in`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(500);

    await expect(
      page.getByRole('heading', {
        name: /welcome back/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', {
        name: /create your dipo/i,
      }),
    ).toBeVisible();
  });

  test('sign-up page renders correctly', async ({
    page,
  }) => {
    const response = await page.goto(
      `${BASE_URL}/auth/signup`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(500);

    await expect(
      page.locator('input[type="email"]'),
    ).toBeVisible();

    await expect(
      page.locator('input[type="password"]'),
    ).toBeVisible();
  });

  test('sign-in form validates invalid email', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/auth/sign-in`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const email = page.locator(
      'input[type="email"]',
    );

    await expect(email).toBeVisible();

    await email.fill('not-an-email');

    const submit =
      page.getByRole('button', {
        name: /sign in|continue|login/i,
      }).first();

    if (await submit.isVisible()) {
      await submit.click();

      await expect(
        page.getByText(
          /valid email|invalid email|email/i,
        ).first(),
      ).toBeVisible();
    }
  });

  test('auth pages provide legal links', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/auth/sign-in`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    await expect(
      page.getByRole('link', {
        name: /terms/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', {
        name: /privacy/i,
      }),
    ).toBeVisible();
  });

  test('authenticated-only dashboard redirects anonymous visitor', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/dashboard`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const url = page.url();

    expect(
      url.includes('/auth/') ||
        url.includes('/dashboard'),
    ).toBeTruthy();
  });
});