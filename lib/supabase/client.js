"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Worldwide DIPO
 * Supabase Browser Client
 *
 * IMPORTANT:
 * NEXT_PUBLIC_* variables are referenced directly so
 * Next.js can expose them to the client bundle correctly.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function validateSupabaseConfig() {
  const missing = [];

  if (!SUPABASE_URL) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!SUPABASE_PUBLISHABLE_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  if (missing.length > 0) {
    throw new Error(
      [
        "Worldwide DIPO Supabase configuration is incomplete.",
        "",
        `Missing: ${missing.join(", ")}`,
        "",
        "Make sure .env.local exists in the project root.",
        "Then restart the Next.js development server.",
        "",
        "Required variables:",
        "NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co",
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx",
      ].join("\n"),
    );
  }

  if (!SUPABASE_URL.startsWith("https://")) {
    throw new Error(
      "Worldwide DIPO: NEXT_PUBLIC_SUPABASE_URL must start with https://",
    );
  }

  return {
    url: SUPABASE_URL,
    publishableKey: SUPABASE_PUBLISHABLE_KEY,
  };
}

let browserClient;

/**
 * Creates/reuses the browser Supabase client.
 */
export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  const { url, publishableKey } = validateSupabaseConfig();

  browserClient = createBrowserClient(url, publishableKey);

  return browserClient;
}

export default createClient;