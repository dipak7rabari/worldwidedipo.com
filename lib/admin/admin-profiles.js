import { getAdminServiceClient } from './admin-service-client';

const PAGE_SIZE = 20;

function cleanQuery(value) {
  return String(value ?? '')
    .trim()
    .replace(/[,%()]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 80);
}

function cleanStatus(value) {
  const allowed = ['draft', 'pending', 'active', 'expired'];
  return allowed.includes(value) ? value : '';
}

function cleanPlan(value) {
  const allowed = ['Starter', 'Pro', 'Elite'];
  return allowed.includes(value) ? value : '';
}

export async function getAdminProfiles({
  query = '',
  status = '',
  plan = '',
  page = 1,
} = {}) {
  const supabase = getAdminServiceClient();

  const safeQuery = cleanQuery(query);
  const safeStatus = cleanStatus(status);
  const safePlan = cleanPlan(plan);

  const currentPage = Math.max(1, Number(page) || 1);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let request = supabase
    .from('profiles')
    .select(
      `
        id,
        name,
        slug,
        profession,
        headline,
        location,
        category,
        plan,
        status,
        expires_at,
        created_at,
        updated_at
      `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (safeQuery) {
    request = request.or(
      `name.ilike.%${safeQuery}%,slug.ilike.%${safeQuery}%,profession.ilike.%${safeQuery}%,location.ilike.%${safeQuery}%`
    );
  }

  if (safeStatus) {
    request = request.eq('status', safeStatus);
  }

  if (safePlan) {
    request = request.eq('plan', safePlan);
  }

  const [
    profilesResult,
    totalResult,
    activeResult,
    pendingResult,
    draftResult,
    expiredResult,
    starterResult,
    proResult,
    eliteResult,
  ] = await Promise.all([
    request,

    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),

    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),

    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'draft'),

    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'expired'),

    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('plan', 'Starter'),

    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('plan', 'Pro'),

    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('plan', 'Elite'),
  ]);

  if (profilesResult.error) {
    throw new Error(profilesResult.error.message);
  }

  const total = profilesResult.count ?? 0;

  return {
    profiles: profilesResult.data ?? [],
    total,
    page: currentPage,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),

    stats: {
      total: totalResult.count ?? 0,
      active: activeResult.count ?? 0,
      pending: pendingResult.count ?? 0,
      draft: draftResult.count ?? 0,
      expired: expiredResult.count ?? 0,
      starter: starterResult.count ?? 0,
      pro: proResult.count ?? 0,
      elite: eliteResult.count ?? 0,
    },
  };
}