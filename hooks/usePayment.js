'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const DEFAULT_STATUS_ENDPOINT =
  '/api/payment/status';

const DEFAULT_CREATE_ENDPOINT =
  '/api/payment/create';

const DEFAULT_SUBMIT_ENDPOINT =
  '/api/payment/submit';

const DEFAULT_RENEWAL_ENDPOINT =
  '/api/payment/renewal';

const DEFAULT_POLL_INTERVAL = 5000;
const DEFAULT_POLL_TIMEOUT = 120000;

const VALID_PLANS = new Set([
  'basic',
  'pro',
  'premium',
  'business',
  'enterprise',
]);

const VALID_PAYMENT_TYPES = new Set([
  'initial',
  'renewal',
]);

function isPlainObject(value) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function createRequestError(
  response,
  data
) {
  const message =
    data?.error ||
    data?.message ||
    `Payment request failed with status ${response.status}.`;

  const error = new Error(message);

  error.status = response.status;
  error.code =
    data?.code ??
    data?.errorCode ??
    null;

  return error;
}

async function parseResponse(
  response
) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw createRequestError(
      response,
      data
    );
  }

  return data;
}

function normalizePayment(
  payment
) {
  if (
    !payment ||
    typeof payment !== 'object'
  ) {
    return null;
  }

  return payment;
}

function normalizeStatus(
  data
) {
  if (
    !data ||
    typeof data !== 'object'
  ) {
    return null;
  }

  return {
    ...data,

    profile:
      data.profile ?? null,

    pendingRenewal:
      data.pendingRenewal ??
      data.pending_renewal ??
      null,

    payment:
      data.payment ?? null,
  };
}

function normalizePlan(plan) {
  if (
    typeof plan !== 'string'
  ) {
    return null;
  }

  const normalized =
    plan.trim().toLowerCase();

  return VALID_PLANS.has(
    normalized
  )
    ? normalized
    : null;
}

function normalizePaymentType(
  paymentType
) {
  if (
    typeof paymentType !==
    'string'
  ) {
    return null;
  }

  const normalized =
    paymentType
      .trim()
      .toLowerCase();

  return VALID_PAYMENT_TYPES.has(
    normalized
  )
    ? normalized
    : null;
}

/**
 * Worldwide DIPO payment state hook.
 *
 * This hook is intentionally a client-side
 * orchestration layer.
 *
 * Security-sensitive payment authorization,
 * ownership checks, amount validation and
 * database mutations remain server-side.
 */
export default function usePayment({
  autoLoad = true,
  pollInterval =
    DEFAULT_POLL_INTERVAL,
  pollTimeout =
    DEFAULT_POLL_TIMEOUT,
  statusEndpoint =
    DEFAULT_STATUS_ENDPOINT,
  createEndpoint =
    DEFAULT_CREATE_ENDPOINT,
  submitEndpoint =
    DEFAULT_SUBMIT_ENDPOINT,
  renewalEndpoint =
    DEFAULT_RENEWAL_ENDPOINT,
} = {}) {
  const mountedRef =
    useRef(false);

  const statusAbortRef =
    useRef(null);

  const paymentAbortRef =
    useRef(null);

  const pollTimerRef =
    useRef(null);

  const pollStartedAtRef =
    useRef(0);

  const [status, setStatus] =
    useState(null);

  const [payment, setPayment] =
    useState(null);

  const [loading, setLoading] =
    useState(
      Boolean(autoLoad)
    );

  const [refreshing, setRefreshing] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [renewing, setRenewing] =
    useState(false);

  const [polling, setPolling] =
    useState(false);

  const [initialized, setInitialized] =
    useState(false);

  const [error, setError] =
    useState(null);

  const clearPollTimer =
    useCallback(() => {
      if (pollTimerRef.current) {
        clearTimeout(
          pollTimerRef.current
        );

        pollTimerRef.current = null;
      }
    }, []);

  const abortRequests =
    useCallback(() => {
      try {
        statusAbortRef.current?.abort();
      } catch {
        // Ignore abort cleanup errors.
      }

      try {
        paymentAbortRef.current?.abort();
      } catch {
        // Ignore abort cleanup errors.
      }

      statusAbortRef.current = null;
      paymentAbortRef.current = null;
    }, []);

  const getStatus =
    useCallback(
      async ({
        silent = false,
      } = {}) => {
        if (!mountedRef.current) {
          return {
            status: null,
            error: null,
          };
        }

        try {
          statusAbortRef.current?.abort();
        } catch {
          // Ignore.
        }

        const controller =
          new AbortController();

        statusAbortRef.current =
          controller;

        if (mountedRef.current) {
          if (silent) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);
        }

        try {
          const response =
            await fetch(
              statusEndpoint,
              {
                method: 'GET',
                headers: {
                  Accept:
                    'application/json',
                },
                credentials:
                  'same-origin',
                cache: 'no-store',
                signal:
                  controller.signal,
              }
            );

          const data =
            await parseResponse(
              response
            );

          if (
            controller.signal.aborted
          ) {
            return {
              status: null,
              error: null,
              aborted: true,
            };
          }

          const nextStatus =
            normalizeStatus(data);

          if (mountedRef.current) {
            setStatus(
              nextStatus
            );
            setError(null);
          }

          return {
            status: nextStatus,
            error: null,
          };
        } catch (caughtError) {
          if (
            caughtError?.name ===
            'AbortError'
          ) {
            return {
              status: null,
              error: null,
              aborted: true,
            };
          }

          if (mountedRef.current) {
            setError(
              caughtError
            );
          }

          return {
            status: null,
            error: caughtError,
          };
        } finally {
          if (
            statusAbortRef.current ===
            controller
          ) {
            statusAbortRef.current =
              null;
          }

          if (mountedRef.current) {
            setLoading(false);
            setRefreshing(false);
            setInitialized(true);
          }
        }
      },
      [statusEndpoint]
    );

  const createPayment =
    useCallback(
      async ({
        plan,
        paymentType = 'initial',
        paymentReference,
        ...additionalData
      } = {}) => {
        const normalizedPlan =
          normalizePlan(plan);

        const normalizedType =
          normalizePaymentType(
            paymentType
          );

        if (!normalizedPlan) {
          const validationError =
            new Error(
              'Please select a valid payment plan.'
            );

          if (mountedRef.current) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            payment: null,
            error: validationError,
          };
        }

        if (!normalizedType) {
          const validationError =
            new Error(
              'Invalid payment type.'
            );

          if (mountedRef.current) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            payment: null,
            error: validationError,
          };
        }

        if (mountedRef.current) {
          setCreating(true);
          setError(null);
        }

        try {
          paymentAbortRef.current?.abort();

          const controller =
            new AbortController();

          paymentAbortRef.current =
            controller;

          const body = {
            plan: normalizedPlan,
            paymentType:
              normalizedType,
            ...(paymentReference
              ? {
                  paymentReference,
                }
              : {}),
            ...(
              isPlainObject(
                additionalData
              )
                ? additionalData
                : {}
            ),
          };

          const response =
            await fetch(
              createEndpoint,
              {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/json',
                  Accept:
                    'application/json',
                },
                credentials:
                  'same-origin',
                cache: 'no-store',
                signal:
                  controller.signal,
                body: JSON.stringify(
                  body
                ),
              }
            );

          const data =
            await parseResponse(
              response
            );

          const nextPayment =
            normalizePayment(
              data?.payment ??
                data?.data?.payment ??
                null
            );

          if (mountedRef.current) {
            setPayment(
              nextPayment
            );
            setError(null);
          }

          return {
            success: true,
            payment:
              nextPayment,
            data,
            error: null,
          };
        } catch (caughtError) {
          if (
            caughtError?.name ===
            'AbortError'
          ) {
            return {
              success: false,
              payment: null,
              error: null,
              aborted: true,
            };
          }

          if (mountedRef.current) {
            setError(
              caughtError
            );
          }

          return {
            success: false,
            payment: null,
            error: caughtError,
          };
        } finally {
          if (mountedRef.current) {
            setCreating(false);
          }
        }
      },
      [createEndpoint]
    );

  const submitPayment =
    useCallback(
      async ({
        profileId,
        plan,
        paymentType = 'initial',
        paymentReference,
      } = {}) => {
        const normalizedPlan =
          normalizePlan(plan);

        const normalizedType =
          normalizePaymentType(
            paymentType
          );

        if (!profileId) {
          const validationError =
            new Error(
              'Profile ID is required.'
            );

          if (mountedRef.current) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            payment: null,
            error: validationError,
          };
        }

        if (!normalizedPlan) {
          const validationError =
            new Error(
              'Please select a valid payment plan.'
            );

          if (mountedRef.current) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            payment: null,
            error: validationError,
          };
        }

        if (!normalizedType) {
          const validationError =
            new Error(
              'Invalid payment type.'
            );

          if (mountedRef.current) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            payment: null,
            error: validationError,
          };
        }

        if (
          typeof paymentReference !==
            'string' ||
          !paymentReference.trim()
        ) {
          const validationError =
            new Error(
              'Payment reference is required.'
            );

          if (mountedRef.current) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            payment: null,
            error: validationError,
          };
        }

        if (mountedRef.current) {
          setSubmitting(true);
          setError(null);
        }

        try {
          paymentAbortRef.current?.abort();

          const controller =
            new AbortController();

          paymentAbortRef.current =
            controller;

          const response =
            await fetch(
              submitEndpoint,
              {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/json',
                  Accept:
                    'application/json',
                },
                credentials:
                  'same-origin',
                cache: 'no-store',
                signal:
                  controller.signal,
                body: JSON.stringify({
                  profileId,
                  plan: normalizedPlan,
                  paymentType:
                    normalizedType,
                  paymentReference:
                    paymentReference.trim(),
                }),
              }
            );

          const data =
            await parseResponse(
              response
            );

          const nextPayment =
            normalizePayment(
              data?.payment ??
                data?.data?.payment ??
                null
            );

          if (mountedRef.current) {
            if (nextPayment) {
              setPayment(
                nextPayment
              );
            }

            setError(null);
          }

          return {
            success: true,
            payment:
              nextPayment,
            data,
            error: null,
          };
        } catch (caughtError) {
          if (
            caughtError?.name ===
            'AbortError'
          ) {
            return {
              success: false,
              payment: null,
              error: null,
              aborted: true,
            };
          }

          if (mountedRef.current) {
            setError(
              caughtError
            );
          }

          return {
            success: false,
            payment: null,
            error: caughtError,
          };
        } finally {
          if (mountedRef.current) {
            setSubmitting(false);
          }
        }
      },
      [submitEndpoint]
    );

  const createRenewal =
    useCallback(
      async ({
        plan,
        paymentReference,
      } = {}) => {
        const normalizedPlan =
          normalizePlan(plan);

        if (!normalizedPlan) {
          const validationError =
            new Error(
              'Please select a valid renewal plan.'
            );

          if (mountedRef.current) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            payment: null,
            error: validationError,
          };
        }

        if (
          typeof paymentReference !==
            'string' ||
          !paymentReference.trim()
        ) {
          const validationError =
            new Error(
              'Payment reference is required.'
            );

          if (mountedRef.current) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            payment: null,
            error: validationError,
          };
        }

        if (mountedRef.current) {
          setRenewing(true);
          setError(null);
        }

        try {
          paymentAbortRef.current?.abort();

          const controller =
            new AbortController();

          paymentAbortRef.current =
            controller;

          const response =
            await fetch(
              renewalEndpoint,
              {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/json',
                  Accept:
                    'application/json',
                },
                credentials:
                  'same-origin',
                cache: 'no-store',
                signal:
                  controller.signal,
                body: JSON.stringify({
                  plan: normalizedPlan,
                  payment_reference:
                    paymentReference.trim(),
                }),
              }
            );

          const data =
            await parseResponse(
              response
            );

          const nextPayment =
            normalizePayment(
              data?.payment ??
                data?.data?.payment ??
                null
            );

          if (mountedRef.current) {
            if (nextPayment) {
              setPayment(
                nextPayment
              );
            }

            setError(null);
          }

          return {
            success: true,
            payment:
              nextPayment,
            data,
            error: null,
          };
        } catch (caughtError) {
          if (
            caughtError?.name ===
            'AbortError'
          ) {
            return {
              success: false,
              payment: null,
              error: null,
              aborted: true,
            };
          }

          if (mountedRef.current) {
            setError(
              caughtError
            );
          }

          return {
            success: false,
            payment: null,
            error: caughtError,
          };
        } finally {
          if (mountedRef.current) {
            setRenewing(false);
          }
        }
      },
      [renewalEndpoint]
    );

  const pollStatus =
    useCallback(
      async ({
        interval =
          DEFAULT_POLL_INTERVAL,
        timeout =
          DEFAULT_POLL_TIMEOUT,
        onUpdate,
        shouldStop,
      } = {}) => {
        clearPollTimer();

        if (mountedRef.current) {
          setPolling(true);
          setError(null);
        }

        pollStartedAtRef.current =
          Date.now();

        const poll =
          async () => {
            if (
              !mountedRef.current
            ) {
              return;
            }

            const elapsed =
              Date.now() -
              pollStartedAtRef.current;

            if (elapsed >= timeout) {
              if (mountedRef.current) {
                setPolling(false);
              }

              return;
            }

            const result =
              await getStatus({
                silent: true,
              });

            if (
              !mountedRef.current ||
              result?.aborted
            ) {
              return;
            }

            const nextStatus =
              result?.status;

            if (
              typeof onUpdate ===
              'function'
            ) {
              try {
                onUpdate(
                  nextStatus
                );
              } catch {
                // Consumer callback must
                // never break polling.
              }
            }

            let stop = false;

            if (
              typeof shouldStop ===
              'function'
            ) {
              try {
                stop =
                  Boolean(
                    shouldStop(
                      nextStatus
                    )
                  );
              } catch {
                stop = false;
              }
            }

            /*
             * Stop automatically for common
             * terminal payment states.
             */
            const paymentStatus =
              nextStatus
                ?.pendingRenewal
                ?.status ??
              nextStatus
                ?.payment
                ?.status ??
              null;

            if (
              paymentStatus ===
                'approved' ||
              paymentStatus ===
                'rejected' ||
              paymentStatus ===
                'cancelled'
            ) {
              stop = true;
            }

            if (stop) {
              if (
                mountedRef.current
              ) {
                setPolling(false);
              }

              return;
            }

            pollTimerRef.current =
              setTimeout(
                poll,
                Math.max(
                  1000,
                  Number(interval) ||
                    DEFAULT_POLL_INTERVAL
                )
              );
          };

        await poll();

        return {
          success: true,
        };
      },
      [
        clearPollTimer,
        getStatus,
      ]
    );

  const stopPolling =
    useCallback(() => {
      clearPollTimer();

      if (mountedRef.current) {
        setPolling(false);
      }
    }, [clearPollTimer]);

  const clearError =
    useCallback(() => {
      if (mountedRef.current) {
        setError(null);
      }
    }, []);

  const reset =
    useCallback(() => {
      clearPollTimer();
      abortRequests();

      if (mountedRef.current) {
        setStatus(null);
        setPayment(null);
        setError(null);
        setLoading(false);
        setRefreshing(false);
        setCreating(false);
        setSubmitting(false);
        setRenewing(false);
        setPolling(false);
        setInitialized(false);
      }
    }, [
      abortRequests,
      clearPollTimer,
    ]);

  useEffect(() => {
    mountedRef.current = true;

    if (autoLoad) {
      getStatus();
    } else {
      setLoading(false);
      setInitialized(true);
    }

    return () => {
      mountedRef.current = false;

      clearPollTimer();
      abortRequests();
    };
  }, [
    abortRequests,
    autoLoad,
    clearPollTimer,
    getStatus,
  ]);

  const derived = useMemo(() => {
    const profile =
      status?.profile ?? null;

    const pendingRenewal =
      status?.pendingRenewal ??
      null;

    const currentPayment =
      payment ??
      status?.payment ??
      null;

    const profileStatus =
      profile?.status ??
      null;

    const profilePlan =
      profile?.plan ??
      null;

    const expiresAt =
      profile?.expires_at ??
      null;

    let expired = false;

    if (expiresAt) {
      const timestamp =
        new Date(
          expiresAt
        ).getTime();

      expired =
        Number.isFinite(
          timestamp
        ) &&
        timestamp <= Date.now();
    }

    return {
      profile,
      pendingRenewal,
      currentPayment,
      profileStatus,
      profilePlan,
      expiresAt,
      expired,

      hasPendingRenewal:
        Boolean(
          pendingRenewal
        ),

      hasPayment:
        Boolean(
          currentPayment
        ),
    };
  }, [
    payment,
    status,
  ]);

  return {
    /*
     * Raw state
     */
    status,
    payment,
    error,

    /*
     * Loading states
     */
    loading,
    refreshing,
    creating,
    submitting,
    renewing,
    polling,
    initialized,

    /*
     * Derived payment/profile state
     */
    ...derived,

    /*
     * Actions
     */
    getStatus,
    refresh: () =>
      getStatus({
        silent: true,
      }),

    createPayment,
    submitPayment,
    createRenewal,

    pollStatus,
    stopPolling,

    clearError,
    reset,
  };
}

/**
 * Small convenience hook when a screen
 * only needs the current payment status.
 */
export function usePaymentStatus(
  options = {}
) {
  const {
    status,
    loading,
    refreshing,
    initialized,
    error,
    profile,
    pendingRenewal,
    currentPayment,
    profileStatus,
    profilePlan,
    expiresAt,
    expired,
    hasPendingRenewal,
    hasPayment,
    getStatus,
    refresh,
    pollStatus,
    stopPolling,
    clearError,
  } = usePayment(options);

  return {
    status,
    loading,
    refreshing,
    initialized,
    error,

    profile,
    pendingRenewal,
    currentPayment,
    profileStatus,
    profilePlan,
    expiresAt,
    expired,

    hasPendingRenewal,
    hasPayment,

    getStatus,
    refresh,
    pollStatus,
    stopPolling,
    clearError,
  };
}