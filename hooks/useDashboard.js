'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { createClient } from '@/lib/supabase/client';

const PROFILE_TABLE = 'profiles';

function normalizeProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    return null;
  }

  return profile;
}

function isAbortError(error) {
  return (
    error?.name === 'AbortError' ||
    error?.code === 'ABORT_ERR'
  );
}

function createAbortController() {
  if (typeof AbortController === 'undefined') {
    return {
      signal: undefined,
      abort() {},
    };
  }

  return new AbortController();
}

/**
 * Dashboard state hook for Worldwide DIPO.
 *
 * Responsibilities:
 * - load the authenticated user's own profile
 * - expose dashboard loading / refresh state
 * - keep profile state locally in sync after updates
 * - provide safe refresh/update helpers
 *
 * Important:
 * This hook is a client-side state layer only.
 * Server/API/RLS remains the actual authorization
 * boundary for profile ownership and mutations.
 */
export default function useDashboard({
  enabled = true,
  autoLoad = true,
} = {}) {
  const supabaseRef = useRef(null);
  const mountedRef = useRef(false);
  const requestRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(
    Boolean(enabled && autoLoad)
  );

  const [refreshing, setRefreshing] =
    useState(false);

  const [updating, setUpdating] =
    useState(false);

  const [initialized, setInitialized] =
    useState(false);

  const [error, setError] =
    useState(null);

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }

    return supabaseRef.current;
  }, []);

  const loadDashboard = useCallback(
    async ({
      silent = false,
      signal: externalSignal,
    } = {}) => {
      if (!enabled) {
        return {
          profile: null,
          user: null,
          error: null,
          skipped: true,
        };
      }

      if (requestRef.current && !silent) {
        return requestRef.current;
      }

      const controller =
        createAbortController();

      const abortHandler = () => {
        try {
          controller.abort();
        } catch {
          // Ignore abort failures.
        }
      };

      if (externalSignal) {
        if (externalSignal.aborted) {
          abortHandler();
        } else {
          externalSignal.addEventListener(
            'abort',
            abortHandler,
            { once: true }
          );
        }
      }

      if (mountedRef.current) {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);
      }

      const request = (async () => {
        try {
          const supabase =
            getSupabase();

          const {
            data: authData,
            error: authError,
          } =
            await supabase.auth.getUser();

          if (controller.signal?.aborted) {
            return {
              profile: null,
              user: null,
              error: null,
              aborted: true,
            };
          }

          if (authError) {
            throw authError;
          }

          const currentUser =
            authData?.user ?? null;

          if (!currentUser) {
            if (mountedRef.current) {
              setUser(null);
              setProfile(null);
            }

            return {
              profile: null,
              user: null,
              error: null,
            };
          }

          /*
           * owner_id is always constrained to the
           * authenticated Supabase user.
           *
           * Never accept an arbitrary owner_id
           * from dashboard UI.
           */
          const {
            data: profileData,
            error: profileError,
          } =
            await supabase
              .from(PROFILE_TABLE)
              .select('*')
              .eq(
                'owner_id',
                currentUser.id
              )
              .maybeSingle();

          if (
            controller.signal?.aborted
          ) {
            return {
              profile: null,
              user: currentUser,
              error: null,
              aborted: true,
            };
          }

          if (profileError) {
            throw profileError;
          }

          const nextProfile =
            normalizeProfile(
              profileData
            );

          if (mountedRef.current) {
            setUser(currentUser);
            setProfile(nextProfile);
            setError(null);
          }

          return {
            profile: nextProfile,
            user: currentUser,
            error: null,
          };
        } catch (caughtError) {
          if (
            isAbortError(caughtError) ||
            controller.signal?.aborted
          ) {
            return {
              profile: null,
              user: null,
              error: null,
              aborted: true,
            };
          }

          const nextError =
            caughtError instanceof Error
              ? caughtError
              : new Error(
                  'Unable to load dashboard.'
                );

          if (mountedRef.current) {
            setError(nextError);
          }

          return {
            profile: null,
            user: null,
            error: nextError,
          };
        } finally {
          if (externalSignal) {
            try {
              externalSignal.removeEventListener(
                'abort',
                abortHandler
              );
            } catch {
              // Ignore cleanup failures.
            }
          }

          if (requestRef.current === request) {
            requestRef.current = null;
          }

          if (mountedRef.current) {
            setLoading(false);
            setRefreshing(false);
            setInitialized(true);
          }
        }
      })();

      requestRef.current = request;

      return request;
    },
    [enabled, getSupabase]
  );

  const refresh = useCallback(
    async () =>
      loadDashboard({
        silent: true,
      }),
    [loadDashboard]
  );

  const updateLocalProfile = useCallback(
    (updates) => {
      if (
        !updates ||
        typeof updates !== 'object' ||
        Array.isArray(updates)
      ) {
        return null;
      }

      let nextProfile = null;

      setProfile((current) => {
        if (!current) {
          nextProfile = null;
          return current;
        }

        nextProfile = {
          ...current,
          ...updates,
        };

        return nextProfile;
      });

      return nextProfile;
    },
    []
  );

  const updateProfile = useCallback(
    async (updates) => {
      if (
        !updates ||
        typeof updates !== 'object' ||
        Array.isArray(updates)
      ) {
        const validationError =
          new Error(
            'Profile updates must be a valid object.'
          );

        if (mountedRef.current) {
          setError(validationError);
        }

        return {
          success: false,
          profile: null,
          error: validationError,
        };
      }

      if (!user?.id) {
        const authError =
          new Error(
            'You must be signed in to update your profile.'
          );

        if (mountedRef.current) {
          setError(authError);
        }

        return {
          success: false,
          profile: null,
          error: authError,
        };
      }

      if (mountedRef.current) {
        setUpdating(true);
        setError(null);
      }

      try {
        /*
         * Use the existing application API instead
         * of directly mutating protected profile data.
         *
         * The API performs the actual authorization,
         * validation and ownership checks.
         */
        const response =
          await fetch(
            '/api/profile/update',
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
              body: JSON.stringify(
                updates
              ),
            }
          );

        let data = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          const nextError =
            new Error(
              data?.error ||
                data?.message ||
                'Unable to update profile.'
            );

          if (mountedRef.current) {
            setError(nextError);
          }

          return {
            success: false,
            profile: null,
            error: nextError,
            status:
              response.status,
          };
        }

        /*
         * Support both:
         * { profile: {...} }
         * and a directly returned profile object.
         */
        const nextProfile =
          normalizeProfile(
            data?.profile ??
              data?.data?.profile ??
              null
          );

        if (nextProfile && mountedRef.current) {
          setProfile(nextProfile);
        }

        return {
          success: true,
          profile:
            nextProfile ??
            profile,
          error: null,
          data,
        };
      } catch (caughtError) {
        const nextError =
          caughtError instanceof Error
            ? caughtError
            : new Error(
                'Unable to update profile.'
              );

        if (mountedRef.current) {
          setError(nextError);
        }

        return {
          success: false,
          profile: null,
          error: nextError,
        };
      } finally {
        if (mountedRef.current) {
          setUpdating(false);
        }
      }
    },
    [profile, user?.id]
  );

  const clearError = useCallback(() => {
    if (mountedRef.current) {
      setError(null);
    }
  }, []);

  const reset = useCallback(() => {
    if (requestRef.current) {
      try {
        requestRef.current.abort?.();
      } catch {
        // Ignore cleanup failures.
      }
    }

    if (mountedRef.current) {
      setProfile(null);
      setUser(null);
      setError(null);
      setLoading(false);
      setRefreshing(false);
      setUpdating(false);
      setInitialized(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (enabled && autoLoad) {
      loadDashboard();
    } else {
      setLoading(false);
      setInitialized(true);
    }

    return () => {
      mountedRef.current = false;

      try {
        requestRef.current = null;
      } catch {
        // Ignore cleanup failures.
      }
    };
  }, [
    autoLoad,
    enabled,
    loadDashboard,
  ]);

  return {
    /*
     * Main dashboard data
     */
    profile,
    user,

    /*
     * State
     */
    loading,
    refreshing,
    updating,
    initialized,
    error,

    /*
     * Derived state
     */
    isAuthenticated: Boolean(user),
    hasProfile: Boolean(profile),
    profileId: profile?.id ?? null,
    slug: profile?.slug ?? null,
    plan: profile?.plan ?? null,
    status: profile?.status ?? null,

    /*
     * Actions
     */
    loadDashboard,
    refresh,
    updateProfile,
    updateLocalProfile,
    clearError,
    reset,
  };
}

/**
 * Dashboard profile-only helper.
 */
export function useDashboardProfile(
  options = {}
) {
  const {
    profile,
    loading,
    refreshing,
    updating,
    initialized,
    error,
    hasProfile,
    profileId,
    slug,
    plan,
    status,
    refresh,
    updateProfile,
    updateLocalProfile,
    clearError,
  } = useDashboard(options);

  return {
    profile,
    loading,
    refreshing,
    updating,
    initialized,
    error,
    hasProfile,
    profileId,
    slug,
    plan,
    status,
    refresh,
    updateProfile,
    updateLocalProfile,
    clearError,
  };
}