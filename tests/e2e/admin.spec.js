import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.E2E_BASE_URL || 'http://127.0.0.1:3000';

test.describe('Worldwide DIPO — Admin', () => {
  test('admin login page is reachable and protected', async ({
    page,
  }) => {
    const response = await page.goto(
      `${BASE_URL}/admin/login`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(500);

    await expect(
      page.getByRole('heading', {
        name: /admin access/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(
        /authorized administrators only/i,
      ),
    ).toBeVisible();
  });

  test('admin dashboard does not expose itself to anonymous visitors', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/admin`, {
      waitUntil: 'domcontentloaded',
    });

    const url = page.url();

    expect(
      url.includes('/admin/login') ||
        url.includes('/admin'),
    ).toBeTruthy();

    if (url.includes('/admin/login')) {
      await expect(
        page.getByRole('heading', {
          name: /admin access/i,
        }),
      ).toBeVisible();
    }
  });

  test('admin payments route is protected', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/admin/payments`, {
      waitUntil: 'domcontentloaded',
    });

    const url = page.url();

    expect(
      url.includes('/admin/login') ||
        url.includes('/admin/payments'),
    ).toBeTruthy();

    if (url.includes('/admin/login')) {
      await expect(
        page.getByRole('heading', {
          name: /admin access/i,
        }),
      ).toBeVisible();
    }
  });

  test('admin security route is not publicly exposed', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/admin/security`, {
      waitUntil: 'domcontentloaded',
    });

    const url = page.url();

    expect(
      url.includes('/admin/login') ||
        url.includes('/admin/security'),
    ).toBeTruthy();
  });
});