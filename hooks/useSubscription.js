'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const STATUS_ENDPOINT =
  '/api/payment/status';

const RENEWAL_ENDPOINT =
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

function normalizePlan(plan) {
  if (typeof plan !== 'string') {
    return null;
  }

  const value = plan
    .trim()
    .toLowerCase();

  return VALID_PLANS.has(value)
    ? value
    : null;
}

function createError(
  response,
  data
) {
  const error = new Error(
    data?.error ||
      data?.message ||
      `Subscription request failed with status ${response.status}.`
  );

  error.status =
    response.status;

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
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw createError(
      response,
      data
    );
  }

  return data;
}

function normalizeStatus(data) {
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

/**
 * Worldwide DIPO subscription state.
 *
 * This hook manages subscription UI state only.
 * Actual authorization, plan validation, expiry
 * calculation and payment mutation remain server-side.
 */
export default function useSubscription({
  autoLoad = true,
  pollInterval =
    DEFAULT_POLL_INTERVAL,
  pollTimeout =
    DEFAULT_POLL_TIMEOUT,
  statusEndpoint =
    STATUS_ENDPOINT,
  renewalEndpoint =
    RENEWAL_ENDPOINT,
} = {}) {
  const mountedRef =
    useRef(false);

  const statusAbortRef =
    useRef(null);

  const renewalAbortRef =
    useRef(null);

  const pollTimerRef =
    useRef(null);

  const pollStartedAtRef =
    useRef(0);

  const [status, setStatus] =
    useState(null);

  const [loading, setLoading] =
    useState(Boolean(autoLoad));

  const [refreshing, setRefreshing] =
    useState(false);

  const [renewing, setRenewing] =
    useState(false);

  const [polling, setPolling] =
    useState(false);

  const [initialized, setInitialized] =
    useState(false);

  const [error, setError] =
    useState(null);

  const clearTimer =
    useCallback(() => {
      if (pollTimerRef.current) {
        clearTimeout(
          pollTimerRef.current
        );

        pollTimerRef.current =
          null;
      }
    }, []);

  const abortRequests =
    useCallback(() => {
      try {
        statusAbortRef.current?.abort();
      } catch {
        // Ignore cleanup errors.
      }

      try {
        renewalAbortRef.current?.abort();
      } catch {
        // Ignore cleanup errors.
      }

      statusAbortRef.current =
        null;

      renewalAbortRef.current =
        null;
    }, []);

  const getStatus =
    useCallback(
      async ({
        silent = false,
      } = {}) => {
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

  const renew =
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
              'Please select a valid subscription plan.'
            );

          if (mountedRef.current) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            subscription: null,
            payment: null,
            error:
              validationError,
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
            subscription: null,
            payment: null,
            error:
              validationError,
          };
        }

        if (mountedRef.current) {
          setRenewing(true);
          setError(null);
        }

        try {
          renewalAbortRef.current?.abort();

          const controller =
            new AbortController();

          renewalAbortRef.current =
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

          if (
            controller.signal.aborted
          ) {
            return {
              success: false,
              subscription: null,
              payment: null,
              error: null,
              aborted: true,
            };
          }

          const nextPayment =
            data?.payment ??
            data?.data?.payment ??
            null;

          if (mountedRef.current) {
            setError(null);
          }

          /*
           * Refresh immediately so the UI gets
           * the authoritative server state.
           */
          const refreshed =
            await getStatus({
              silent: true,
            });

          return {
            success: true,
            subscription:
              refreshed?.status ??
              null,
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
              subscription: null,
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
            subscription: null,
            payment: null,
            error: caughtError,
          };
        } finally {
          if (mountedRef.current) {
            setRenewing(false);
          }
        }
      },
      [
        getStatus,
        renewalEndpoint,
      ]
    );

  const startPolling =
    useCallback(
      async ({
        interval =
          pollInterval,
        timeout =
          pollTimeout,
        onUpdate,
        shouldStop,
      } = {}) => {
        clearTimer();

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
                // Consumer callbacks must not
                // break the polling lifecycle.
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

            const renewalStatus =
              nextStatus
                ?.pendingRenewal
                ?.status ??
              null;

            if (
              renewalStatus ===
                'approved' ||
              renewalStatus ===
                'rejected' ||
              renewalStatus ===
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
        clearTimer,
        getStatus,
        pollInterval,
        pollTimeout,
      ]
    );

  const stopPolling =
    useCallback(() => {
      clearTimer();

      if (mountedRef.current) {
        setPolling(false);
      }
    }, [clearTimer]);

  const clearError =
    useCallback(() => {
      if (mountedRef.current) {
        setError(null);
      }
    }, []);

  const reset =
    useCallback(() => {
      clearTimer();
      abortRequests();

      if (mountedRef.current) {
        setStatus(null);
        setError(null);
        setLoading(false);
        setRefreshing(false);
        setRenewing(false);
        setPolling(false);
        setInitialized(false);
      }
    }, [
      abortRequests,
      clearTimer,
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

      clearTimer();
      abortRequests();
    };
  }, [
    abortRequests,
    autoLoad,
    clearTimer,
    getStatus,
  ]);

  const derived = useMemo(() => {
    const profile =
      status?.profile ?? null;

    const pendingRenewal =
      status?.pendingRenewal ??
      null;

    const currentPlan =
      profile?.plan ??
      null;

    const profileStatus =
      profile?.status ??
      null;

    const expiresAt =
      profile?.expires_at ??
      null;

    let expiresTimestamp =
      null;

    if (expiresAt) {
      const parsed =
        new Date(
          expiresAt
        ).getTime();

      if (
        Number.isFinite(parsed)
      ) {
        expiresTimestamp =
          parsed;
      }
    }

    const expired =
      expiresTimestamp !== null &&
      expiresTimestamp <=
        Date.now();

    const active =
      profileStatus === 'active' &&
      !expired;

    const daysRemaining =
      expiresTimestamp === null
        ? null
        : Math.max(
            0,
            Math.ceil(
              (expiresTimestamp -
                Date.now()) /
                86400000
            )
          );

    const renewalPending =
      Boolean(
        pendingRenewal
      );

    return {
      profile,
      currentPlan,
      profileStatus,
      expiresAt,
      expiresTimestamp,

      active,
      expired,

      daysRemaining,

      pendingRenewal,
      renewalPending,

      hasSubscription:
        Boolean(
          profile
        ),

      hasActiveSubscription:
        active,
    };
  }, [status]);

  return {
    /*
     * Raw subscription state
     */
    status,
    error,

    /*
     * Lifecycle state
     */
    loading,
    refreshing,
    renewing,
    polling,
    initialized,

    /*
     * Derived subscription state
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

    renew,

    startPolling,
    stopPolling,

    clearError,
    reset,
  };
}

/**
 * Lightweight helper for pages that only need
 * subscription information.
 */
export function useSubscriptionStatus(
  options = {}
) {
  const {
    status,
    loading,
    refreshing,
    error,
    initialized,

    profile,
    currentPlan,
    profileStatus,
    expiresAt,
    expiresTimestamp,

    active,
    expired,
    daysRemaining,

    pendingRenewal,
    renewalPending,

    hasSubscription,
    hasActiveSubscription,

    getStatus,
    refresh,
    startPolling,
    stopPolling,
    clearError,
  } = useSubscription(options);

  return {
    status,
    loading,
    refreshing,
    error,
    initialized,

    profile,
    currentPlan,
    profileStatus,
    expiresAt,
    expiresTimestamp,

    active,
    expired,
    daysRemaining,

    pendingRenewal,
    renewalPending,

    hasSubscription,
    hasActiveSubscription,

    getStatus,
    refresh,
    startPolling,
    stopPolling,
    clearError,
  };
}