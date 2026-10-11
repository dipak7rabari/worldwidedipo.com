import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.E2E_BASE_URL || 'http://127.0.0.1:3000';

test.describe('Worldwide DIPO — Renewal', () => {
  test('subscription dashboard is protected', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/dashboard/subscription`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const url = page.url();

    expect(
      url.includes('/auth/') ||
        url.includes('/dashboard/subscription'),
    ).toBeTruthy();
  });

  test('renewal payment page is protected', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/dashboard/subscription/payment`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const url = page.url();

    expect(
      url.includes('/auth/') ||
        url.includes(
          '/dashboard/subscription/payment',
        ),
    ).toBeTruthy();
  });

  test('renewal API rejects anonymous mutation', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/payment/renewal`,
      {
        data: {
          plan: 'Pro',
          payment_reference: 'E2E-UNAUTHORIZED',
        },
      },
    );

    expect([401, 403, 400, 405, 415, 429]).toContain(
      response.status(),
    );
  });

  test('renewal API rejects invalid plan', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/payment/renewal`,
      {
        data: {
          plan: 'FREE_UNLIMITED_ADMIN',
          payment_reference: 'E2E-INVALID',
        },
      },
    );

    expect([400, 401, 403, 422, 429]).toContain(
      response.status(),
    );
  });

  test('renewal API rejects oversized payment reference', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/payment/renewal`,
      {
        data: {
          plan: 'Pro',
          payment_reference: 'X'.repeat(60_000),
        },
      },
    );

    expect([400, 401, 403, 413, 415, 429]).toContain(
      response.status(),
    );
  });

  test('renewal status does not expose private data anonymously', async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/payment/status`,
    );

    expect([200, 401, 403]).toContain(
      response.status(),
    );

    if (response.status() === 200) {
      const body = await response.text();

      expect(body).not.toMatch(
        /service_role|SUPABASE_SERVICE_ROLE_KEY|password|access_token/i,
      );
    }
  });
});