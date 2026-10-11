'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { createClient } from '@/lib/supabase/client';

const AUTH_TIMEOUT = 15000;

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return user;
}

function createTimeoutSignal(timeout = AUTH_TIMEOUT) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  return {
    controller,
    cleanup() {
      clearTimeout(timer);
    },
  };
}

/**
 * Worldwide DIPO
 * Client-side authentication state hook.
 *
 * Source of truth:
 * - Supabase browser client
 * - Supabase auth state listener
 *
 * Server-side protected routes MUST still use
 * server verification. This hook is UI state only.
 */
export default function useAuth() {
  const supabaseRef = useRef(null);
  const mountedRef = useRef(false);
  const signOutInProgressRef = useRef(false);

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] =
    useState(false);

  const [error, setError] = useState(null);
  const [signingOut, setSigningOut] =
    useState(false);

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }

    return supabaseRef.current;
  }, []);

  const refresh = useCallback(async () => {
    const supabase = getSupabase();

    if (!mountedRef.current) {
      return {
        user: null,
        session: null,
        error: null,
      };
    }

    setLoading(true);
    setError(null);

    const timeout =
      createTimeoutSignal();

    try {
      /*
       * getSession() is used here only to restore
       * the browser-side session state.
       *
       * Authorization for protected resources
       * must remain server-side.
       */
      const {
        data,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!mountedRef.current) {
        return {
          user: data?.session?.user ?? null,
          session: data?.session ?? null,
          error: sessionError ?? null,
        };
      }

      if (sessionError) {
        setSession(null);
        setUser(null);
        setError(sessionError);

        return {
          user: null,
          session: null,
          error: sessionError,
        };
      }

      const nextSession =
        data?.session ?? null;

      const nextUser =
        normalizeUser(
          nextSession?.user
        );

      setSession(nextSession);
      setUser(nextUser);

      return {
        user: nextUser,
        session: nextSession,
        error: null,
      };
    } catch (caughtError) {
      if (!mountedRef.current) {
        return {
          user: null,
          session: null,
          error: caughtError,
        };
      }

      const nextError =
        caughtError instanceof Error
          ? caughtError
          : new Error(
              'Unable to restore authentication session.'
            );

      setUser(null);
      setSession(null);
      setError(nextError);

      return {
        user: null,
        session: null,
        error: nextError,
      };
    } finally {
      timeout.cleanup();

      if (mountedRef.current) {
        setLoading(false);
        setInitialized(true);
      }
    }
  }, [getSupabase]);

  const signOut = useCallback(
    async () => {
      if (signOutInProgressRef.current) {
        return {
          success: false,
          error: new Error(
            'Sign out is already in progress.'
          ),
        };
      }

      const supabase = getSupabase();

      signOutInProgressRef.current = true;

      if (mountedRef.current) {
        setSigningOut(true);
        setError(null);
      }

      try {
        const {
          error: signOutError,
        } = await supabase.auth.signOut();

        if (signOutError) {
          if (mountedRef.current) {
            setError(signOutError);
          }

          return {
            success: false,
            error: signOutError,
          };
        }

        if (mountedRef.current) {
          setUser(null);
          setSession(null);
        }

        return {
          success: true,
          error: null,
        };
      } catch (caughtError) {
        const nextError =
          caughtError instanceof Error
            ? caughtError
            : new Error(
                'Unable to sign out.'
              );

        if (mountedRef.current) {
          setError(nextError);
        }

        return {
          success: false,
          error: nextError,
        };
      } finally {
        signOutInProgressRef.current = false;

        if (mountedRef.current) {
          setSigningOut(false);
        }
      }
    },
    [getSupabase]
  );

  useEffect(() => {
    mountedRef.current = true;

    const supabase = getSupabase();

    let subscription = null;
    let cancelled = false;

    async function initialize() {
      try {
        /*
         * Register the auth listener before the
         * initial session read so a very fast
         * auth change is not missed.
         */
        const {
          data: listenerData,
        } = supabase.auth.onAuthStateChange(
          (event, nextSession) => {
            if (
              !mountedRef.current ||
              cancelled
            ) {
              return;
            }

            const nextUser =
              normalizeUser(
                nextSession?.user
              );

            setSession(nextSession ?? null);
            setUser(nextUser);
            setError(null);

            /*
             * Auth state has now been initialized
             * even when Supabase reports SIGNED_OUT.
             */
            setInitialized(true);
            setLoading(false);

            /*
             * SIGNED_OUT is authoritative.
             * Do not leave stale browser state.
             */
            if (event === 'SIGNED_OUT') {
              setSession(null);
              setUser(null);
            }
          }
        );

        subscription =
          listenerData?.subscription ?? null;

        /*
         * Load the current browser session after
         * registering the listener.
         */
        const {
          data,
          error: sessionError,
        } = await supabase.auth.getSession();

        if (
          cancelled ||
          !mountedRef.current
        ) {
          return;
        }

        if (sessionError) {
          setError(sessionError);
          setSession(null);
          setUser(null);
        } else {
          const nextSession =
            data?.session ?? null;

          setSession(nextSession);
          setUser(
            normalizeUser(
              nextSession?.user
            )
          );
          setError(null);
        }
      } catch (caughtError) {
        if (
          cancelled ||
          !mountedRef.current
        ) {
          return;
        }

        const nextError =
          caughtError instanceof Error
            ? caughtError
            : new Error(
                'Unable to initialize authentication.'
              );

        setError(nextError);
        setSession(null);
        setUser(null);
      } finally {
        if (
          !cancelled &&
          mountedRef.current
        ) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
      mountedRef.current = false;

      try {
        subscription?.unsubscribe?.();
      } catch {
        // Ignore cleanup failures.
      }
    };
  }, [getSupabase]);

  const clearError = useCallback(() => {
    if (mountedRef.current) {
      setError(null);
    }
  }, []);

  return {
    /*
     * Core auth state
     */
    user,
    session,

    /*
     * State flags
     */
    loading,
    initialized,
    signingOut,

    /*
     * Convenient derived state
     */
    isAuthenticated: Boolean(user),

    /*
     * Current user's stable ID.
     */
    userId: user?.id ?? null,

    /*
     * Email is intentionally derived from the
     * authenticated Supabase user object.
     */
    email: user?.email ?? null,

    /*
     * Metadata is read-only UI data.
     * Server authorization must never depend
     * on this value.
     */
    userMetadata:
      user?.user_metadata ?? null,

    /*
     * Actions
     */
    refresh,
    signOut,
    clearError,

    /*
     * Error state
     */
    error,
  };
}

/**
 * Small convenience hook for components that
 * only need the authenticated user.
 */
export function useCurrentUser() {
  const {
    user,
    loading,
    initialized,
    isAuthenticated,
    userId,
    email,
    userMetadata,
    error,
  } = useAuth();

  return {
    user,
    loading,
    initialized,
    isAuthenticated,
    userId,
    email,
    userMetadata,
    error,
  };
}

/**
 * Small convenience hook for logout UI.
 */
export function useSignOut() {
  const {
    signOut,
    signingOut,
    error,
    clearError,
  } = useAuth();

  return {
    signOut,
    signingOut,
    error,
    clearError,
  };
}