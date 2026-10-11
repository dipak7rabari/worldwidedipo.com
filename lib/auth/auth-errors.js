const AUTH_ERROR_MESSAGES = {
  invalid_credentials: 'Email ya password details valid nahi hain.',
  email_not_confirmed: 'Please apna email confirm karein.',
  otp_expired: 'OTP ya magic link expire ho gaya hai. Naya link request karein.',
  token_expired: 'Authentication link expire ho gaya hai.',
  access_denied: 'Authentication request deny ho gayi.',
  validation_failed: 'Please entered information check karein.',
  over_email_send_rate_limit:
    'Bahut zyada email requests ho gayi hain. Thodi der baad try karein.',
};

export function getAuthErrorMessage(error) {
  if (!error) {
    return 'Authentication failed. Please try again.';
  }

  const code =
    error.code ||
    error.name ||
    error.error_code ||
    '';

  if (AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }

  const message = String(error.message || '').toLowerCase();

  if (message.includes('expired')) {
    return 'Authentication link expire ho gaya hai. Naya link request karein.';
  }

  if (message.includes('rate limit')) {
    return 'Bahut zyada requests ho gayi hain. Thodi der baad try karein.';
  }

  if (message.includes('not confirmed')) {
    return 'Please apna email confirm karein.';
  }

  return 'Authentication failed. Please try again.';
}

export function isAuthError(error) {
  return Boolean(error);
}