"use client";

/**
 * Worldwide DIPO
 * ---------------------------------------------------------
 * Toast Hook Adapter
 *
 * The actual toast state/context lives in:
 *   components/ui/Toast.jsx
 *
 * This file exists as the canonical hook import path for
 * application-level code:
 *
 *   import { useToast } from "@/hooks/useToast";
 *
 * Keeping the state in one place prevents duplicate providers,
 * duplicated timers, inconsistent toast queues, and memory leaks.
 * ---------------------------------------------------------
 */

import {
  useToast as useToastContext,
  ToastProvider,
} from "@/components/ui/Toast";

/**
 * Main application toast hook.
 *
 * Exposes the same API as the underlying Toast context while
 * keeping application imports decoupled from the UI component path.
 */
export function useToast() {
  return useToastContext();
}

/**
 * Provider re-export.
 *
 * Use this at the application/root layout level if the existing
 * ToastProvider is not already mounted there.
 */
export { ToastProvider };

/**
 * Convenience helpers.
 *
 * These intentionally resolve the current toast context rather
 * than maintaining their own state.
 */
export function useSuccessToast() {
  const toast = useToast();

  return {
    ...toast,
    success: toast.success,
  };
}

export function useErrorToast() {
  const toast = useToast();

  return {
    ...toast,
    error: toast.error,
  };
}

export function useInfoToast() {
  const toast = useToast();

  return {
    ...toast,
    info: toast.info,
  };
}

export function useWarningToast() {
  const toast = useToast();

  return {
    ...toast,
    warning: toast.warning,
  };
}

export function useLoadingToast() {
  const toast = useToast();

  return {
    ...toast,
    loading: toast.loading,
  };
}

/**
 * Default export.
 *
 * Allows both:
 *
 *   import { useToast } from "@/hooks/useToast";
 *
 * and:
 *
 *   import useToast from "@/hooks/useToast";
 */
export default useToast;