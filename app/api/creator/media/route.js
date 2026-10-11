import { NextResponse } from 'next/server';
import { checkOrigin } from '@/lib/security/origin-check';
import { validateImageFile, validateImageSignature, getSafeImageExtension } from '@/lib/storage/image-validation';
import { getCreatorOwner, isActive } from '@/lib/creator/server';
const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export const dynamic = 'force-dynamic';
export async function POST(request) {
  if (!checkOrigin(request).valid) return json({ error: 'Invalid origin' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 6 * 1024 * 1024) return json({ error: 'Image too large' }, 413);
  const { supabase, user, profile } = await getCreatorOwner();
  if (!user) return json({ error: 'Sign in required' }, 401);
  if (!profile || !isActive(profile)) return json({ error: 'Active subscription required' }, 403);
  const form = await request.formData();
  const slot = Number(form.get('slot')); const file = form.get('file');
  if (![0, 1].includes(slot)) return json({ error: 'Invalid image slot' }, 400);
  const valid = validateImageFile(file);
  if (!valid.valid) return json({ error: valid.error }, 400);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const signature = await validateImageSignature(file);
  if (!signature.valid) return json({ error: signature.error }, 400);
  const path = `${user.id}/creator/${crypto.randomUUID()}.${getSafeImageExtension(file)}`;
  const { error: uploadError } = await supabase.storage.from('creator-media').upload(path, bytes, { contentType: file.type, upsert: false, cacheControl: '31536000' });
  if (uploadError) return json({ error: 'Image upload failed' }, 409);
  const url = supabase.storage.from('creator-media').getPublicUrl(path).data.publicUrl;
  const { data, error } = await supabase.rpc('set_my_creator_image', { p_slot: slot, p_path: path, p_url: url });
  if (error) { await supabase.storage.from('creator-media').remove([path]); return json({ error: 'Image could not be saved' }, 409); }
  if (data?.old_path && data.old_path !== path) await supabase.storage.from('creator-media').remove([data.old_path]);
  return json({ images: data.images });
}
export async function DELETE(request) {
  if (!checkOrigin(request).valid) return json({ error: 'Invalid origin' }, 403);
  const { supabase, user } = await getCreatorOwner();
  if (!user) return json({ error: 'Sign in required' }, 401);
  const body = await request.json().catch(() => ({}));
  if (![0, 1].includes(body.slot)) return json({ error: 'Invalid slot' }, 400);
  const { data, error } = await supabase.rpc('set_my_creator_image', { p_slot: body.slot, p_path: null, p_url: null });
  if (error) return json({ error: 'Unable to remove image' }, 409);
  if (data?.old_path) {
    const { error: removeError } = await supabase.storage.from('creator-media').remove([data.old_path]);
    if (removeError) return json({ error: 'Image unlinked, but storage cleanup failed; contact support', images: data.images }, 500);
  }
  return json({ images: data.images });
}
