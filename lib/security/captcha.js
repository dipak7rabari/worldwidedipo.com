const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken({
  token,
  remoteip,
}) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return {
      ok: false,
      error: 'Turnstile server configuration is missing.',
    };
  }

  if (!token || typeof token !== 'string') {
    return {
      ok: false,
      error: 'Captcha verification is required.',
    };
  }

  if (token.length > 4096) {
    return {
      ok: false,
      error: 'Invalid captcha token.',
    };
  }

  const formData = new FormData();

  formData.append('secret', secret);
  formData.append('response', token);

  if (remoteip) {
    formData.append('remoteip', remoteip);
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        ok: false,
        error: 'Captcha verification failed.',
      };
    }

    const result = await response.json();

    if (!result.success) {
      return {
        ok: false,
        error: 'Captcha verification failed.',
        codes: result['error-codes'] || [],
      };
    }

    return {
      ok: true,
    };
  } catch (error) {
    console.error('Turnstile verification error:', error);

    return {
      ok: false,
      error: 'Captcha verification is temporarily unavailable.',
    };
  }
}