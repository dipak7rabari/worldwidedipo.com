'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

/*
 * -------------------------------------------------------------
 * SECURITY CONSTANTS
 * -------------------------------------------------------------
 */

const MFA_CODE_LENGTH = 6;

const MAX_NEXT_PATH_LENGTH = 500;

const MFA_ACTION_COOLDOWN_MS = 1500;

/*
 * -------------------------------------------------------------
 * SAFE INTERNAL ADMIN PATH
 * -------------------------------------------------------------
 *
 * Never allow an external URL to become the post-MFA redirect.
 *
 * Allowed:
 *   /admin
 *   /admin/payments
 *   /admin/profiles?id=...
 *
 * Rejected:
 *   https://attacker.example
 *   //attacker.example
 *   javascript:...
 *   /\\attacker.example
 */

function getSafeNextPath(
  value,
) {
  if (
    typeof value !== 'string'
  ) {
    return '/admin';
  }

  const next =
    value.trim();

  if (
    !next ||
    next.length >
      MAX_NEXT_PATH_LENGTH
  ) {
    return '/admin';
  }

  if (
    !next.startsWith('/admin') ||
    next.startsWith('//') ||
    next.includes('\\') ||
    next.includes('\r') ||
    next.includes('\n')
  ) {
    return '/admin';
  }

  try {
    const parsed =
      new URL(
        next,
        'https://worldwide-dipo.local',
      );

    if (
      parsed.origin !==
      'https://worldwide-dipo.local'
    ) {
      return '/admin';
    }

    if (
      !parsed.pathname.startsWith(
        '/admin',
      )
    ) {
      return '/admin';
    }

    return (
      parsed.pathname +
      parsed.search +
      parsed.hash
    );
  } catch {
    return '/admin';
  }
}

/*
 * -------------------------------------------------------------
 * OTP NORMALIZATION
 * -------------------------------------------------------------
 */

function cleanCode(
  value,
) {
  return String(
    value || '',
  )
    .replace(/\D/g, '')
    .slice(
      0,
      MFA_CODE_LENGTH,
    );
}

/*
 * -------------------------------------------------------------
 * SAFE ERROR MESSAGES
 * -------------------------------------------------------------
 *
 * Do not expose raw database/server/internal errors.
 */

function getAuthErrorMessage(
  error,
  fallback,
) {
  const message =
    String(
      error?.message || '',
    )
      .trim()
      .toLowerCase();

  if (
    message.includes(
      'invalid',
    ) ||
    message.includes(
      'incorrect',
    ) ||
    message.includes(
      'expired',
    ) ||
    message.includes(
      'code',
    )
  ) {
    return (
      fallback ||
      'The verification code is invalid or expired.'
    );
  }

  if (
    message.includes(
      'factor',
    )
  ) {
    return (
      fallback ||
      'Your authenticator could not be verified. Please try again.'
    );
  }

  if (
    message.includes(
      'rate',
    ) ||
    message.includes(
      'too many',
    )
  ) {
    return (
      'Too many verification attempts. Please wait and try again.'
    );
  }

  return (
    fallback ||
    'Something went wrong. Please try again.'
  );
}

/*
 * -------------------------------------------------------------
 * COMPONENT
 * -------------------------------------------------------------
 */

export default function AdminMFA({
  nextPath: nextPathProp,
}) {
  const supabase =
    useMemo(
      () => createClient(),
      [],
    );

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  /*
   * Prefer the server-validated nextPath prop.
   *
   * The query parameter is only used as a fallback for
   * compatibility with the existing page.
   */
  const nextPath =
    useMemo(() => {
      if (
        typeof nextPathProp ===
          'string' &&
        nextPathProp
      ) {
        return getSafeNextPath(
          nextPathProp,
        );
      }

      return getSafeNextPath(
        searchParams?.get(
          'next',
        ) || '/admin',
      );
    }, [
      nextPathProp,
      searchParams,
    ]);

  /*
   * -----------------------------------------------------------
   * STATE
   * -----------------------------------------------------------
   */

  const [loading, setLoading] =
    useState(true);

  const [enrolling, setEnrolling] =
    useState(false);

  const [verifying, setVerifying] =
    useState(false);

  const [factorId, setFactorId] =
    useState('');

  const [qrCode, setQrCode] =
    useState('');

  const [secret, setSecret] =
    useState('');

  const [verifyCode, setVerifyCode] =
    useState('');

  const [
    needsChallenge,
    setNeedsChallenge,
  ] = useState(false);

  const [
    challengeFactorId,
    setChallengeFactorId,
  ] = useState('');

  const [
    needsEnrollment,
    setNeedsEnrollment,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [
    lastActionAt,
    setLastActionAt,
  ] = useState(0);

  /*
   * -----------------------------------------------------------
   * CLIENT ACTION COOLDOWN
   * -----------------------------------------------------------
   *
   * This is not the primary rate limiter.
   * Server/auth provider limits remain the real protection.
   * This simply prevents accidental double-clicks.
   */

  const canStartAction =
    useCallback(() => {
      const now =
        Date.now();

      if (
        now - lastActionAt <
        MFA_ACTION_COOLDOWN_MS
      ) {
        return false;
      }

      setLastActionAt(now);

      return true;
    }, [
      lastActionAt,
    ]);

  /*
   * -----------------------------------------------------------
   * REDIRECT
   * -----------------------------------------------------------
   */

  const redirectToAdmin =
    useCallback(() => {
      const safePath =
        getSafeNextPath(
          nextPath,
        );

      router.refresh();

      router.replace(
        safePath,
      );
    }, [
      nextPath,
      router,
    ]);

  /*
   * -----------------------------------------------------------
   * START MFA ENROLLMENT
   * -----------------------------------------------------------
   */

  const startEnrollment =
    useCallback(
      async () => {
        if (
          !canStartAction()
        ) {
          return;
        }

        setError('');
        setMessage('');
        setEnrolling(true);

        /*
         * Never keep old enrollment data around.
         */
        setFactorId('');
        setQrCode('');
        setSecret('');
        setVerifyCode('');

        try {
          /*
           * Get current MFA factors.
           */
          const {
            data: factorsData,
            error: factorsError,
          } =
            await supabase.auth.mfa.listFactors();

          if (
            factorsError
          ) {
            throw factorsError;
          }

          const totpFactors =
            Array.isArray(
              factorsData?.totp,
            )
              ? factorsData.totp
              : [];

          /*
           * If a verified factor already exists,
           * challenge it instead of creating another one.
           */
          const verifiedFactor =
            totpFactors.find(
              (factor) =>
                factor?.status ===
                'verified',
            );

          if (
            verifiedFactor?.id
          ) {
            setChallengeFactorId(
              verifiedFactor.id,
            );

            setNeedsChallenge(
              true,
            );

            setNeedsEnrollment(
              false,
            );

            return;
          }

          /*
           * Remove only incomplete enrollment factors.
           *
           * This prevents abandoned setup attempts from
           * accumulating unusable TOTP factors.
           */
          const unverifiedFactors =
            totpFactors.filter(
              (factor) =>
                factor?.status ===
                'unverified',
            );

          for (
            const factor of
            unverifiedFactors
          ) {
            if (
              !factor?.id
            ) {
              continue;
            }

            const {
              error:
                unenrollError,
            } =
              await supabase.auth.mfa.unenroll(
                {
                  factorId:
                    factor.id,
                },
              );

            if (
              unenrollError
            ) {
              throw unenrollError;
            }
          }

          /*
           * Create a fresh TOTP enrollment.
           */
          const {
            data,
            error:
              enrollError,
          } =
            await supabase.auth.mfa.enroll(
              {
                factorType:
                  'totp',

                friendlyName:
                  'Worldwide DIPO Admin',
              },
            );

          if (
            enrollError
          ) {
            throw enrollError;
          }

          if (
            !data?.id ||
            !data?.totp?.qr_code ||
            !data?.totp?.secret
          ) {
            throw new Error(
              'Incomplete MFA enrollment.',
            );
          }

          setFactorId(
            data.id,
          );

          setQrCode(
            data.totp.qr_code,
          );

          setSecret(
            data.totp.secret,
          );

          setNeedsEnrollment(
            true,
          );

          setNeedsChallenge(
            false,
          );

          setVerifyCode('');
        } catch (
          enrollError
        ) {
          console.error(
            'Admin MFA enrollment error:',
            enrollError,
          );

          setError(
            getAuthErrorMessage(
              enrollError,
              'Unable to start MFA enrollment. Please try again.',
            ),
          );
        } finally {
          setEnrolling(
            false,
          );
        }
      },
      [
        canStartAction,
        supabase,
      ],
    );

  /*
   * -----------------------------------------------------------
   * LOAD CURRENT MFA STATE
   * -----------------------------------------------------------
   */

  const loadMFAState =
    useCallback(
      async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
          /*
           * Ask Supabase for current authentication assurance.
           */
          const {
            data:
              assuranceData,
            error:
              assuranceError,
          } =
            await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

          if (
            assuranceError
          ) {
            throw assuranceError;
          }

          const currentLevel =
            assuranceData?.currentLevel;

          const nextLevel =
            assuranceData?.nextLevel;

          /*
           * Already AAL2.
           *
           * Do not unnecessarily challenge again.
           */
          if (
            currentLevel ===
            'aal2'
          ) {
            redirectToAdmin();

            return;
          }

          /*
           * Load existing factors.
           */
          const {
            data: factorsData,
            error: factorsError,
          } =
            await supabase.auth.mfa.listFactors();

          if (
            factorsError
          ) {
            throw factorsError;
          }

          const totpFactors =
            Array.isArray(
              factorsData?.totp,
            )
              ? factorsData.totp
              : [];

          const verifiedTotp =
            totpFactors.find(
              (factor) =>
                factor?.status ===
                'verified',
            );

          /*
           * Verified factor exists and AAL2 is required:
           * challenge the existing factor.
           */
          if (
            nextLevel ===
              'aal2' &&
            verifiedTotp?.id
          ) {
            setChallengeFactorId(
              verifiedTotp.id,
            );

            setNeedsChallenge(
              true,
            );

            setNeedsEnrollment(
              false,
            );

            setLoading(false);

            return;
          }

          /*
           * No verified factor:
           * show explicit enrollment UI.
           */
          setChallengeFactorId(
            '',
          );

          setNeedsChallenge(
            false,
          );

          setNeedsEnrollment(
            false,
          );

          setLoading(false);
        } catch (
          stateError
        ) {
          console.error(
            'Admin MFA state error:',
            stateError,
          );

          setError(
            getAuthErrorMessage(
              stateError,
              'Unable to check administrator security status.',
            ),
          );

          setLoading(false);
        }
      },
      [
        redirectToAdmin,
        supabase,
      ],
    );

  /*
   * -----------------------------------------------------------
   * VERIFY NEW ENROLLMENT
   * -----------------------------------------------------------
   */

  const verifyEnrollment =
    useCallback(
      async () => {
        if (
          !canStartAction()
        ) {
          return;
        }

        const code =
          cleanCode(
            verifyCode,
          );

        setError('');
        setMessage('');

        if (
          !factorId
        ) {
          setError(
            'MFA enrollment session is missing. Please start again.',
          );

          return;
        }

        if (
          code.length !==
          MFA_CODE_LENGTH
        ) {
          setError(
            'Enter the 6-digit authenticator code.',
          );

          return;
        }

        setVerifying(true);

        try {
          /*
           * Create a challenge for the newly enrolled factor.
           */
          const {
            data:
              challengeData,
            error:
              challengeError,
          } =
            await supabase.auth.mfa.challenge(
              {
                factorId,
              },
            );

          if (
            challengeError
          ) {
            throw challengeError;
          }

          if (
            !challengeData?.id
          ) {
            throw new Error(
              'MFA challenge could not be created.',
            );
          }

          /*
           * Verify the 6-digit TOTP.
           */
          const {
            error:
              verifyError,
          } =
            await supabase.auth.mfa.verify(
              {
                factorId,

                challengeId:
                  challengeData.id,

                code,
              },
            );

          if (
            verifyError
          ) {
            throw verifyError;
          }

          /*
           * Refresh the session so the browser receives
           * the updated authentication assurance state.
           */
          const {
            error:
              refreshError,
          } =
            await supabase.auth.refreshSession();

          if (
            refreshError
          ) {
            throw refreshError;
          }

          /*
           * Confirm the session actually reached AAL2.
           */
          const {
            data:
              finalAssurance,
            error:
              finalAssuranceError,
          } =
            await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

          if (
            finalAssuranceError
          ) {
            throw finalAssuranceError;
          }

          if (
            finalAssurance?.currentLevel !==
            'aal2'
          ) {
            throw new Error(
              'MFA verification did not establish AAL2.',
            );
          }

          /*
           * Clear sensitive enrollment values from React state.
           */
          setVerifyCode('');
          setFactorId('');
          setQrCode('');
          setSecret('');
          setNeedsEnrollment(
            false,
          );

          setMessage(
            'Admin MFA enabled successfully.',
          );

          window.setTimeout(
            () => {
              redirectToAdmin();
            },
            300,
          );
        } catch (
          verifyError
        ) {
          console.error(
            'Admin MFA enrollment verification error:',
            verifyError,
          );

          setError(
            getAuthErrorMessage(
              verifyError,
              'The verification code is invalid or expired.',
            ),
          );
        } finally {
          setVerifying(
            false,
          );
        }
      },
      [
        canStartAction,
        factorId,
        redirectToAdmin,
        supabase,
        verifyCode,
      ],
    );

  /*
   * -----------------------------------------------------------
   * VERIFY EXISTING FACTOR
   * -----------------------------------------------------------
   */

  const verifyChallenge =
    useCallback(
      async () => {
        if (
          !canStartAction()
        ) {
          return;
        }

        const code =
          cleanCode(
            verifyCode,
          );

        setError('');
        setMessage('');

        if (
          !challengeFactorId
        ) {
          setError(
            'Your authenticator factor could not be found. Please try again.',
          );

          return;
        }

        if (
          code.length !==
          MFA_CODE_LENGTH
        ) {
          setError(
            'Enter the 6-digit authenticator code.',
          );

          return;
        }

        setVerifying(true);

        try {
          /*
           * Create a fresh challenge.
           */
          const {
            data:
              challengeData,
            error:
              challengeError,
          } =
            await supabase.auth.mfa.challenge(
              {
                factorId:
                  challengeFactorId,
              },
            );

          if (
            challengeError
          ) {
            throw challengeError;
          }

          if (
            !challengeData?.id
          ) {
            throw new Error(
              'MFA challenge could not be created.',
            );
          }

          /*
           * Verify TOTP.
           */
          const {
            error:
              verifyError,
          } =
            await supabase.auth.mfa.verify(
              {
                factorId:
                  challengeFactorId,

                challengeId:
                  challengeData.id,

                code,
              },
            );

          if (
            verifyError
          ) {
            throw verifyError;
          }

          /*
           * Refresh session after successful AAL2 verification.
           */
          const {
            error:
              refreshError,
          } =
            await supabase.auth.refreshSession();

          if (
            refreshError
          ) {
            throw refreshError;
          }

          /*
           * Confirm AAL2 instead of assuming verification succeeded.
           */
          const {
            data:
              finalAssurance,
            error:
              finalAssuranceError,
          } =
            await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

          if (
            finalAssuranceError
          ) {
            throw finalAssuranceError;
          }

          if (
            finalAssurance?.currentLevel !==
            'aal2'
          ) {
            throw new Error(
              'MFA verification did not establish AAL2.',
            );
          }

          setVerifyCode('');
          setChallengeFactorId(
            '',
          );

          setMessage(
            'Admin verification successful.',
          );

          window.setTimeout(
            () => {
              redirectToAdmin();
            },
            300,
          );
        } catch (
          verifyError
        ) {
          console.error(
            'Admin MFA challenge verification error:',
            verifyError,
          );

          setError(
            getAuthErrorMessage(
              verifyError,
              'The verification code is invalid or expired.',
            ),
          );
        } finally {
          setVerifying(
            false,
          );
        }
      },
      [
        canStartAction,
        challengeFactorId,
        redirectToAdmin,
        supabase,
        verifyCode,
      ],
    );

  /*
   * -----------------------------------------------------------
   * INITIALIZE
   * -----------------------------------------------------------
   */

  useEffect(() => {
    let cancelled =
      false;

    async function initialize() {
      if (
        cancelled
      ) {
        return;
      }

      await loadMFAState();
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [
    loadMFAState,
  ]);

  /*
   * -----------------------------------------------------------
   * LOADING UI
   * -----------------------------------------------------------
   */

  if (
    loading
  ) {
    return (
      <main className="admin-mfa-page">
        <section
          className="admin-mfa-card"
          aria-busy="true"
        >
          <div
            className="admin-mfa-spinner"
            aria-hidden="true"
          />

          <h1>
            Checking admin security...
          </h1>

          <p>
            Worldwide DIPO is checking your
            administrator security requirements.
          </p>
        </section>
      </main>
    );
  }

  /*
   * -----------------------------------------------------------
   * MAIN UI
   * -----------------------------------------------------------
   */

  return (
    <main className="admin-mfa-page">
      <section
        className="admin-mfa-card"
        aria-labelledby="admin-mfa-title"
      >
        <div className="admin-mfa-brand">
          <div
            className="admin-mfa-logo"
            aria-hidden="true"
          >
            D
          </div>

          <div>
            <strong>
              Worldwide DIPO
            </strong>

            <span>
              Admin Security
            </span>
          </div>
        </div>

        <div className="admin-mfa-content">
          {needsChallenge ? (
            <>
              <div
                className="admin-mfa-icon"
                aria-hidden="true"
              >
                🔐
              </div>

              <h1 id="admin-mfa-title">
                Admin Verification
              </h1>

              <p>
                Enter the current 6-digit code
                from your authenticator app to
                continue to the admin panel.
              </p>

              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();

                  if (
                    !verifying
                  ) {
                    verifyChallenge();
                  }
                }}
              >
                <label htmlFor="admin-mfa-code">
                  Authenticator code
                </label>

                <input
                  id="admin-mfa-code"
                  name="admin-mfa-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  minLength={6}
                  value={verifyCode}
                  onChange={(
                    event,
                  ) => {
                    setVerifyCode(
                      cleanCode(
                        event.target.value,
                      ),
                    );
                  }}
                  placeholder="000000"
                  aria-describedby="admin-mfa-code-help"
                  disabled={
                    verifying
                  }
                  autoFocus
                />

                <p
                  id="admin-mfa-code-help"
                  className="admin-mfa-help"
                >
                  Use the code currently
                  shown in your authenticator
                  app.
                </p>

                {error ? (
                  <div
                    className="admin-mfa-error"
                    role="alert"
                  >
                    {error}
                  </div>
                ) : null}

                {message ? (
                  <div
                    className="admin-mfa-success"
                    role="status"
                  >
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={
                    verifying ||
                    verifyCode.length !==
                      MFA_CODE_LENGTH
                  }
                >
                  {verifying
                    ? 'Verifying...'
                    : 'Verify & Continue'}
                </button>
              </form>
            </>
          ) : needsEnrollment ? (
            <>
              <div
                className="admin-mfa-icon"
                aria-hidden="true"
              >
                🛡️
              </div>

              <h1 id="admin-mfa-title">
                Secure Admin Account
              </h1>

              <p>
                Scan this QR code with a
                compatible authenticator app.
              </p>

              {qrCode ? (
                <div className="admin-mfa-qr-wrapper">
                  <img
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(
                      qrCode,
                    )}`}
                    alt="Worldwide DIPO admin MFA QR code"
                    width="240"
                    height="240"
                    draggable="false"
                  />
                </div>
              ) : null}

              {secret ? (
                <div className="admin-mfa-secret">
                  <span>
                    Manual setup key
                  </span>

                  <code>
                    {secret}
                  </code>

                  <small>
                    Keep this key private.
                    Never share it with anyone.
                  </small>
                </div>
              ) : null}

              <form
                noValidate
                onSubmit={(
                  event,
                ) => {
                  event.preventDefault();

                  if (
                    !verifying
                  ) {
                    verifyEnrollment();
                  }
                }}
              >
                <label htmlFor="admin-enrollment-code">
                  Verification code
                </label>

                <input
                  id="admin-enrollment-code"
                  name="admin-enrollment-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  minLength={6}
                  value={verifyCode}
                  onChange={(
                    event,
                  ) => {
                    setVerifyCode(
                      cleanCode(
                        event.target.value,
                      ),
                    );
                  }}
                  placeholder="000000"
                  disabled={
                    verifying
                  }
                  autoFocus
                />

                <p className="admin-mfa-help">
                  Enter the 6-digit code
                  generated by your
                  authenticator app.
                </p>

                {error ? (
                  <div
                    className="admin-mfa-error"
                    role="alert"
                  >
                    {error}
                  </div>
                ) : null}

                {message ? (
                  <div
                    className="admin-mfa-success"
                    role="status"
                  >
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={
                    verifying ||
                    verifyCode.length !==
                      MFA_CODE_LENGTH
                  }
                >
                  {verifying
                    ? 'Verifying...'
                    : 'Verify & Continue'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div
                className="admin-mfa-icon"
                aria-hidden="true"
              >
                🔒
              </div>

              <h1 id="admin-mfa-title">
                Admin MFA Required
              </h1>

              <p>
                Administrator accounts must
                use two-factor authentication
                before accessing sensitive
                Worldwide DIPO controls.
              </p>

              <div className="admin-mfa-notice">
                <strong>
                  Why this is required
                </strong>

                <p>
                  Payment approval, rejection,
                  user-management, and other
                  sensitive administrator
                  actions require an additional
                  authentication factor.
                </p>
              </div>

              {error ? (
                <div
                  className="admin-mfa-error"
                  role="alert"
                >
                  {error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={
                  startEnrollment
                }
                disabled={
                  enrolling
                }
              >
                {enrolling
                  ? 'Preparing MFA...'
                  : 'Enable Authenticator MFA'}
              </button>
            </>
          )}
        </div>

        <footer className="admin-mfa-footer">
          <span>
            Worldwide DIPO
          </span>

          <span aria-hidden="true">
            •
          </span>

          <span>
            Protected Admin Area
          </span>
        </footer>
      </section>
    </main>
  );
}