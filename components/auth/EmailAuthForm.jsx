'use client';

import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import TurnstileWidget from './TurnstileWidget';

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailAuthForm() {
  const supabase = createClient();

  const [email, setEmail] = useState('');

  const [captchaToken, setCaptchaToken] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [sent, setSent] =
    useState(false);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setMessage('');

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError(
        'Please enter a valid email address.',
      );
      return;
    }

    if (!captchaToken) {
      setError(
        'Please complete the security verification.',
      );
      return;
    }

    setLoading(true);

    try {
      const redirectTo =
        `${window.location.origin}/auth/callback`;

      const { error: authError } =
        await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: {
            emailRedirectTo: redirectTo,
            shouldCreateUser: true,
            captchaToken,
          },
        });

      if (authError) {
        if (
          authError.message
            ?.toLowerCase()
            .includes('rate')
        ) {
          throw new Error(
            'Too many requests. Please wait a little before trying again.',
          );
        }

        throw authError;
      }

      setSent(true);

      setMessage(
        'Check your email for the Worldwide DIPO sign-in link or OTP.',
      );
    } catch (authError) {
      console.error(
        'Email authentication failed:',
        authError,
      );

      setError(
        authError?.message ||
          'Unable to send the sign-in email.',
      );
    } finally {
      setLoading(false);
      setCaptchaToken('');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          Email address
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSent(false);
            setMessage('');
            setError('');
          }}
          placeholder="you@example.com"
          autoComplete="email"
          required
          maxLength={254}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
        />
      </div>

      <TurnstileWidget
        onToken={(token) => {
          setCaptchaToken(token);
          setError('');
        }}
        onExpire={() => {
          setCaptchaToken('');
        }}
        onError={() => {
          setCaptchaToken('');
          setError(
            'Security verification failed. Please try again.',
          );
        }}
      />

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      {message ? (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {message}
        </div>
      ) : null}

      {sent ? (
        <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
          If your email template uses an OTP, enter
          that code through the verification screen.
          If it uses a magic link, simply open the link
          from your email.
        </div>
      ) : null}

      <button
        type="submit"
        disabled={
          loading ||
          !captchaToken
        }
        className="w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? 'Sending...'
          : 'Continue with Email'}
      </button>
    </form>
  );
}