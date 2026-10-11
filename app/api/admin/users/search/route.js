import { NextResponse } from 'next/server';
import { requireAAL2Admin } from '@/lib/auth/require-admin';
import { getAdminServiceClient } from '@/lib/admin/admin-service-client';
import { isSameOrigin } from '@/lib/security/origin-check';
import { checkRateLimit, getRequestRateLimitKey } from '@/lib/security/rate-limit';
import { applyApiSecurityHeaders } from '@/lib/security/security-headers';

const ROLES = new Set(['user', 'support', 'admin', 'super_admin']);
const STATUSES = new Set(['active', 'inactive']);
const PROVIDERS = new Set(['email', 'google', 'github', 'apple', 'phone']);

function json(body, status = 200) {
  const response = NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' } });
  applyApiSecurityHeaders(response);
  return response;
}

function providerOf(user) {
  const identities = Array.isArray(user.identities) ? user.identities : [];
  const names = identities.map((item) => String(item?.provider || '').toLowerCase());
  return ['google', 'github', 'apple', 'phone'].find((name) => names.includes(name)) || 'email';
}

function nameOf(user) {
  const metadata = user.user_metadata || {};
  for (const key of ['full_name', 'name', 'display_name', 'username']) {
    if (typeof metadata[key] === 'string' && metadata[key].trim()) return metadata[key].trim().slice(0, 120);
  }
  return null;
}

function inactive(user) {
  const banned = user.banned_until && new Date(user.banned_until).getTime() > Date.now();
  return Boolean(banned || user.deleted_at);
}

export async function GET(request) {
  if (!isSameOrigin(request)) return json({ error: 'Invalid request origin.' }, 403);
  const rate = checkRateLimit(getRequestRateLimitKey(request, 'admin-users-search'), { maxRequests: 20, windowMs: 60_000 });
  if (!rate.allowed) return json({ error: 'Too many searches. Try again shortly.' }, 429);
  let auth; try { auth = await requireAAL2Admin(); } catch { return json({error:'MFA verified admin access required.'},403); }
  if (!auth?.ok) return json({ error: 'MFA verified admin access required.' }, auth?.status || 403);

  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Math.min(10000, Number.parseInt(params.get('page') || '1', 10) || 1));
  const limit = Math.max(1, Math.min(50, Number.parseInt(params.get('limit') || '25', 10) || 25));
  const query = (params.get('query') || '').trim().slice(0, 100).toLowerCase();
  const role = (params.get('role') || '').trim().toLowerCase();
  const status = (params.get('status') || '').trim().toLowerCase();
  const provider = (params.get('provider') || '').trim().toLowerCase();
  if ((role && !ROLES.has(role)) || (status && !STATUSES.has(status)) || (provider && !PROVIDERS.has(provider))) return json({ error: 'Invalid account filter.' }, 400);

  try {
    const supabase = getAdminServiceClient();
    const { data: adminRows, error: adminError } = await supabase.from('admin_users').select('user_id,role,is_active');
    if (adminError) return json({ error: 'Unable to load account roles.' }, 500);
    const roleMap = new Map((adminRows || []).map((item) => [item.user_id, item]));
    const filtered = [];
    let scanned = 0;
    const hasFilters = Boolean(query || role || status || provider);
    const pageCount = hasFilters ? 40 : 1; // filters scan at most 4000 accounts
    let reportedTotal = 0;
    for (let authPage = 1; authPage <= pageCount; authPage += 1) {
      const { data, error } = await supabase.auth.admin.listUsers({ page: hasFilters ? authPage : page, perPage: hasFilters ? 100 : limit });
      if (error) return json({ error: 'Unable to load accounts.' }, 500);
      const users = data?.users || [];
      reportedTotal = Number(data?.total) || reportedTotal;
      scanned += users.length;
      for (const user of users) {
        const adminRecord = roleMap.get(user.id);
        const userRole = adminRecord?.role || 'user';
        const userProvider = providerOf(user);
        const userInactive = inactive(user);
        const searchable = `${nameOf(user) || ''} ${user.email || ''} ${user.id}`.toLowerCase();
        if (query && !searchable.includes(query)) continue;
        if (role && userRole !== role) continue;
        if (status && (status === 'inactive') !== userInactive) continue;
        if (provider && userProvider !== provider) continue;
        filtered.push({
          id: user.id,
          email: typeof user.email === 'string' ? user.email : null,
          display_name: nameOf(user),
          role: userRole,
          account_status: userInactive ? 'inactive' : 'active',
          is_deleted: Boolean(user.deleted_at),
          provider: userProvider,
          created_at: user.created_at || null,
          last_sign_in_at: user.last_sign_in_at || null,
          email_confirmed: Boolean(user.email_confirmed_at),
          is_current_admin: user.id === auth.user?.id,
        });
      }
      if (users.length < (hasFilters ? 100 : limit)) break;
    }
    const start = hasFilters ? (page - 1) * limit : 0;
    const total = hasFilters ? filtered.length : (reportedTotal || filtered.length);
    return json({ success: true, users: filtered.slice(start, start + limit), pagination: { page, limit, total, scanned, limited: hasFilters && scanned >= 4000 } });
  } catch (error) {
    console.error('Admin account search failed:', error);
    return json({ error: 'Unable to search accounts.' }, 500);
  }
}
