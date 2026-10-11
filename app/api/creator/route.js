import { NextResponse } from 'next/server';
import { checkOrigin } from '@/lib/security/origin-check';
import { getCreatorOwner, isActive } from '@/lib/creator/server';
import { safeUrl, THEMES, limitFor } from '@/lib/creator/shared';
export const dynamic = 'force-dynamic';
const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export async function PUT(request) {
  if (!checkOrigin(request).valid) return json({ error: 'Invalid origin' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 30000) return json({ error: 'Request too large' }, 413);
  const { supabase, user, profile } = await getCreatorOwner();
  if (!user) return json({ error: 'Sign in required' }, 401);
  if (!profile || !isActive(profile)) return json({ error: 'Active DIPO subscription required' }, 403);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  if (!body || !Array.isArray(body.links) || body.links.length > limitFor(profile.plan)) return json({ error: 'Link limit exceeded' }, 400);
  if (!THEMES.some(theme => theme.id === body.theme)) return json({ error: 'Invalid theme' }, 400);
  const instagram = String(body.instagram || '').trim().replace(/^@/, '');
  if (instagram.length > 30 || (instagram && !/^[a-zA-Z0-9._]+$/.test(instagram))) return json({ error: 'Invalid Instagram username' }, 400);
  const links = [];
  for (const item of body.links) {
    const title = String(item?.title || '').trim(); const url = safeUrl(item?.url);
    if (!title || title.length > 90 || !url || url.length > 2048) return json({ error: 'Each link needs a valid title and HTTPS/HTTP URL' }, 400);
    links.push({ id: /^[a-f0-9-]{36}$/i.test(item.id || '') ? item.id : crypto.randomUUID(), title, url, trending: item.trending === true });
  }
  const { data, error } = await supabase.rpc('save_my_creator_page', { p_theme: body.theme, p_instagram: instagram, p_links: links });
  if (error) return json({ error: error.message.includes('LINK_LIMIT') ? 'Plan link limit reached' : 'Unable to save creator page' }, 409);
  return json({ creator: data });
}
