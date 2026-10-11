'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { createClient } from '@/lib/supabase/client';

const PROFILE_ENDPOINT =
  '/api/profile/update';

const PROFILE_CREATE_ENDPOINT =
  '/api/profile/create';

const PROFILE_SELECT =
  '*';

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

function normalizeProfile(
  profile
) {
  if (
    !profile ||
    typeof profile !== 'object'
  ) {
    return null;
  }

  return profile;
}

function createApiError(
  response,
  data,
  fallback
) {
  const error = new Error(
    data?.error ||
      data?.message ||
      fallback ||
      `Request failed with status ${response.status}.`
  );

  error.status =
    response.status;

  error.code =
    data?.code ??
    data?.errorCode ??
    null;

  return error;
}

async function parseApiResponse(
  response,
  fallback
) {
  let data = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw createApiError(
      response,
      data,
      fallback
    );
  }

  return data;
}

/**
 * Worldwide DIPO profile hook.
 *
 * Client-side profile state + API orchestration.
 *
 * IMPORTANT:
 * This hook does not decide ownership.
 * The server API + Supabase RLS remain the
 * authoritative security boundary.
 */
export default function useProfile({
  autoLoad = true,
  updateEndpoint =
    PROFILE_ENDPOINT,
  createEndpoint =
    PROFILE_CREATE_ENDPOINT,
} = {}) {
  const mountedRef =
    useRef(false);

  const supabaseRef =
    useRef(null);

  const requestRef =
    useRef(null);

  const mutationAbortRef =
    useRef(null);

  const [profile, setProfile] =
    useState(null);

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(
      Boolean(autoLoad)
    );

  const [refreshing, setRefreshing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [initialized, setInitialized] =
    useState(false);

  const [error, setError] =
    useState(null);

  const getSupabase =
    useCallback(() => {
      if (!supabaseRef.current) {
        supabaseRef.current =
          createClient();
      }

      return supabaseRef.current;
    }, []);

  const getProfile =
    useCallback(
      async ({
        silent = false,
      } = {}) => {
        if (
          requestRef.current
        ) {
          return requestRef.current;
        }

        if (mountedRef.current) {
          if (silent) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);
        }

        const request =
          (async () => {
            try {
              const supabase =
                getSupabase();

              const {
                data:
                  authData,
                error:
                  authError,
              } =
                await supabase.auth.getUser();

              if (authError) {
                throw authError;
              }

              const currentUser =
                authData?.user ??
                null;

              if (
                mountedRef.current
              ) {
                setUser(
                  currentUser
                );
              }

              if (!currentUser) {
                if (
                  mountedRef.current
                ) {
                  setProfile(null);
                }

                return {
                  profile: null,
                  user: null,
                  error: null,
                };
              }

              /*
               * Never accept an owner_id from
               * the browser.
               *
               * The authenticated Supabase user
               * determines ownership.
               */
              const {
                data:
                  profileData,
                error:
                  profileError,
              } =
                await supabase
                  .from('profiles')
                  .select(
                    PROFILE_SELECT
                  )
                  .eq(
                    'owner_id',
                    currentUser.id
                  )
                  .maybeSingle();

              if (profileError) {
                throw profileError;
              }

              const nextProfile =
                normalizeProfile(
                  profileData
                );

              if (
                mountedRef.current
              ) {
                setProfile(
                  nextProfile
                );
                setError(null);
              }

              return {
                profile:
                  nextProfile,
                user:
                  currentUser,
                error: null,
              };
            } catch (caughtError) {
              if (
                mountedRef.current
              ) {
                setError(
                  caughtError
                );
              }

              return {
                profile: null,
                user: null,
                error: caughtError,
              };
            } finally {
              requestRef.current =
                null;

              if (
                mountedRef.current
              ) {
                setLoading(false);
                setRefreshing(false);
                setInitialized(
                  true
                );
              }
            }
          })();

        requestRef.current =
          request;

        return request;
      },
      [getSupabase]
    );

  const refresh =
    useCallback(
      async () =>
        getProfile({
          silent: true,
        }),
      [getProfile]
    );

  const updateProfile =
    useCallback(
      async (updates) => {
        if (
          !isPlainObject(updates) ||
          Object.keys(updates)
            .length === 0
        ) {
          const validationError =
            new Error(
              'Please provide valid profile updates.'
            );

          if (
            mountedRef.current
          ) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            profile: null,
            error:
              validationError,
          };
        }

        if (!user?.id) {
          const authError =
            new Error(
              'You must be signed in to update your profile.'
            );

          if (
            mountedRef.current
          ) {
            setError(
              authError
            );
          }

          return {
            success: false,
            profile: null,
            error: authError,
          };
        }

        if (
          mountedRef.current
        ) {
          setSaving(true);
          setError(null);
        }

        try {
          mutationAbortRef.current?.abort();

          const controller =
            new AbortController();

          mutationAbortRef.current =
            controller;

          const response =
            await fetch(
              updateEndpoint,
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
                  updates
                ),
              }
            );

          const data =
            await parseApiResponse(
              response,
              'Unable to update your profile.'
            );

          if (
            controller.signal.aborted
          ) {
            return {
              success: false,
              profile: null,
              error: null,
              aborted: true,
            };
          }

          const nextProfile =
            normalizeProfile(
              data?.profile ??
                data?.data?.profile ??
                null
            );

          if (
            mountedRef.current
          ) {
            if (nextProfile) {
              setProfile(
                nextProfile
              );
            }

            setError(null);
          }

          return {
            success: true,
            profile:
              nextProfile ??
              profile,
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
              profile: null,
              error: null,
              aborted: true,
            };
          }

          if (
            mountedRef.current
          ) {
            setError(
              caughtError
            );
          }

          return {
            success: false,
            profile: null,
            error: caughtError,
          };
        } finally {
          if (
            mountedRef.current
          ) {
            setSaving(false);
          }
        }
      },
      [
        profile,
        updateEndpoint,
        user?.id,
      ]
    );

  const createProfile =
    useCallback(
      async (input) => {
        if (
          !isPlainObject(input)
        ) {
          const validationError =
            new Error(
              'Profile data must be a valid object.'
            );

          if (
            mountedRef.current
          ) {
            setError(
              validationError
            );
          }

          return {
            success: false,
            profile: null,
            error:
              validationError,
          };
        }

        if (!user?.id) {
          const authError =
            new Error(
              'You must be signed in to create a profile.'
            );

          if (
            mountedRef.current
          ) {
            setError(
              authError
            );
          }

          return {
            success: false,
            profile: null,
            error: authError,
          };
        }

        if (
          mountedRef.current
        ) {
          setCreating(true);
          setError(null);
        }

        try {
          mutationAbortRef.current?.abort();

          const controller =
            new AbortController();

          mutationAbortRef.current =
            controller;

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
                  input
                ),
              }
            );

          const data =
            await parseApiResponse(
              response,
              'Unable to create your profile.'
            );

          if (
            controller.signal.aborted
          ) {
            return {
              success: false,
              profile: null,
              error: null,
              aborted: true,
            };
          }

          const nextProfile =
            normalizeProfile(
              data?.profile ??
                data?.data?.profile ??
                null
            );

          if (
            mountedRef.current
          ) {
            if (nextProfile) {
              setProfile(
                nextProfile
              );
            }

            setError(null);
          }

          return {
            success: true,
            profile:
              nextProfile,
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
              profile: null,
              error: null,
              aborted: true,
            };
          }

          if (
            mountedRef.current
          ) {
            setError(
              caughtError
            );
          }

          return {
            success: false,
            profile: null,
            error: caughtError,
          };
        } finally {
          if (
            mountedRef.current
          ) {
            setCreating(false);
          }
        }
      },
      [
        createEndpoint,
        user?.id,
      ]
    );

  const updateLocalProfile =
    useCallback(
      (updates) => {
        if (
          !isPlainObject(updates)
        ) {
          return null;
        }

        let nextProfile = null;

        setProfile(
          (current) => {
            if (!current) {
              return current;
            }

            nextProfile = {
              ...current,
              ...updates,
            };

            return nextProfile;
          }
        );

        return nextProfile;
      },
      []
    );

  const clearError =
    useCallback(() => {
      if (
        mountedRef.current
      ) {
        setError(null);
      }
    }, []);

  const reset =
    useCallback(() => {
      try {
        requestRef.current = null;
        mutationAbortRef.current?.abort();
      } catch {
        // Ignore cleanup failures.
      }

      if (
        mountedRef.current
      ) {
        setProfile(null);
        setUser(null);
        setError(null);
        setLoading(false);
        setRefreshing(false);
        setSaving(false);
        setCreating(false);
        setInitialized(false);
      }
    }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (autoLoad) {
      getProfile();
    } else {
      setLoading(false);
      setInitialized(true);
    }

    return () => {
      mountedRef.current = false;

      try {
        mutationAbortRef.current?.abort();
      } catch {
        // Ignore cleanup failures.
      }

      requestRef.current = null;
    };
  }, [
    autoLoad,
    getProfile,
  ]);

  return {
    /*
     * Core data
     */
    profile,
    user,

    /*
     * Lifecycle
     */
    loading,
    refreshing,
    saving,
    creating,
    initialized,
    error,

    /*
     * Derived identity
     */
    isAuthenticated:
      Boolean(user),
    hasProfile:
      Boolean(profile),
    profileId:
      profile?.id ?? null,
    ownerId:
      profile?.owner_id ?? null,
    slug:
      profile?.slug ?? null,
    profileStatus:
      profile?.status ?? null,
    plan:
      profile?.plan ?? null,

    /*
     * Actions
     */
    getProfile,
    refresh,
    updateProfile,
    createProfile,
    updateLocalProfile,
    clearError,
    reset,
  };
}

/**
 * Profile-only convenience hook.
 */
export function useMyProfile(
  options = {}
) {
  const {
    profile,
    loading,
    refreshing,
    saving,
    creating,
    initialized,
    error,

    isAuthenticated,
    hasProfile,
    profileId,
    ownerId,
    slug,
    profileStatus,
    plan,

    getProfile,
    refresh,
    updateProfile,
    createProfile,
    updateLocalProfile,
    clearError,
  } = useProfile(options);

  return {
    profile,
    loading,
    refreshing,
    saving,
    creating,
    initialized,
    error,

    isAuthenticated,
    hasProfile,
    profileId,
    ownerId,
    slug,
    profileStatus,
    plan,

    getProfile,
    refresh,
    updateProfile,
    createProfile,
    updateLocalProfile,
    clearError,
  };
}