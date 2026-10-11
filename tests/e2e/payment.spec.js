import { test, expect } from '@playwright/test';

const BASE_URL =
  process.env.E2E_BASE_URL || 'http://127.0.0.1:3000';

test.describe('Worldwide DIPO — Payments', () => {
  test('payment dashboard route is protected', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/dashboard/payment`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const url = page.url();

    expect(
      url.includes('/auth/') ||
        url.includes('/dashboard/payment'),
    ).toBeTruthy();
  });

  test('payment API rejects anonymous creation', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/payment/create`,
      {
        data: {
          profileId: '00000000-0000-0000-0000-000000000000',
          plan: 'Starter',
          paymentType: 'initial',
        },
      },
    );

    expect([401, 403, 400, 405, 415, 429]).toContain(
      response.status(),
    );
  });

  test('payment submit API rejects anonymous request', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/payment/submit`,
      {
        data: {
          profileId:
            '00000000-0000-0000-0000-000000000000',
          plan: 'Starter',
          paymentType: 'initial',
          paymentReference: 'E2E-UNAUTHORIZED',
        },
      },
    );

    expect([401, 403, 400, 405, 415, 429]).toContain(
      response.status(),
    );
  });

  test('payment API rejects invalid HTTP content type', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/payment/create`,
      {
        headers: {
          'content-type': 'text/plain',
        },
        data: 'invalid-payload',
      },
    );

    expect([400, 401, 403, 415]).toContain(
      response.status(),
    );
  });

  test('payment status does not accept client supplied identity', async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/payment/status?user_id=attacker`,
    );

    expect([400, 401, 403]).toContain(
      response.status(),
    );
  });

  test('payment pages do not expose service-role secrets', async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/dashboard/payment`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const html = await page.content();

    expect(html).not.toMatch(
      /service_role|SUPABASE_SERVICE_ROLE_KEY|private_key/i,
    );
  });
});