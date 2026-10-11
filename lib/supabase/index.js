export { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client';

export {
  createClient as createServerSupabaseClient,
} from '@/lib/supabase/server';

export { createAdminClient } from '@/lib/supabase/admin';

export { updateSession } from '@/lib/supabase/proxy';

export {
  normalizeSupabaseError,
  isUniqueViolation,
  isPermissionError,
} from '@/lib/supabase/query-errors';