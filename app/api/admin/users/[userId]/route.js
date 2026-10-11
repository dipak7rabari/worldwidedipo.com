import { NextResponse } from 'next/server';
import { requireAAL2Admin } from '@/lib/auth/require-admin';
import { getAdminServiceClient } from '@/lib/admin/admin-service-client';
import { isSameOrigin } from '@/lib/security/origin-check';
import { checkRateLimit, getRequestRateLimitKey } from '@/lib/security/rate-limit';
import { applyApiSecurityHeaders } from '@/lib/security/security-headers';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(body, status = 200) {
  const response = NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' } });
  applyApiSecurityHeaders(response);
  return response;
}

async function authorize(request) {
  if (!isSameOrigin(request)) return { response: json({ error: 'Invalid request origin.' }, 403) };
  const limit = checkRateLimit(getRequestRateLimitKey(request, 'admin-user-action'), { maxRequests: 12, windowMs: 60_000 });
  if (!limit.allowed) return { response: json({ error: 'Too many account actions. Try again shortly.' }, 429) };
  let result; try { result = await requireAAL2Admin(); } catch { return { response: json({ error: 'MFA verified admin access required.' }, 403) }; }
  if (!result?.ok) return { response: json({ error: result?.error || 'MFA verified admin access required.' }, result?.status || 403) };
  if (!['admin', 'super_admin'].includes(result.admin?.role)) return { response: json({ error: 'You do not have permission to manage accounts.' }, 403) };
  return { admin: result.admin };
}

async function audit(supabase, actorId, action, targetId) {
  const { error } = await supabase.from('audit_logs').insert({
    actor_user_id: actorId,
    action,
    entity_type: 'auth_user',
    entity_id: targetId,
    metadata: { source: 'admin_user_management' },
  });
  if (error) throw new Error('Audit write failed');
}

export async function PATCH(request, context) {
  const authorization = await authorize(request);
  if (authorization.response) return authorization.response;
  const { userId } = await context.params;
  if (!UUID.test(userId)) return json({ error: 'Invalid account ID.' }, 400);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request body.' }, 400); }
  const action = body?.action;
  if (!['block', 'unblock'].includes(action)) return json({ error: 'Choose block or unblock.' }, 400);
  if (userId === authorization.admin.user_id || userId === authorization.admin.userId) return json({ error: 'You cannot block your own admin account.' }, 403);

  try {
    const supabase = getAdminServiceClient();
    const [{ data: targetResult, error: targetError }, { data: adminRecord, error: adminError }] = await Promise.all([
      supabase.auth.admin.getUserById(userId),
      supabase.from('admin_users').select('user_id').eq('user_id', userId).maybeSingle(),
    ]);
    if (targetError || !targetResult?.user) return json({ error: 'Account not found.' }, 404);
    if (adminError) return json({ error: 'Unable to verify account permissions.' }, 500);
    if (adminRecord) return json({ error: 'Admin accounts are protected from user actions.' }, 403);
    const { error } = await supabase.auth.admin.updateUserById(userId, { ban_duration: action === 'block' ? '876000h' : 'none' });
    if (error) return json({ error: 'Account access could not be updated.' }, 500);
    try { await audit(supabase, authorization.admin.userId || authorization.admin.user_id, action === 'block' ? 'user.blocked' : 'user.unblocked', userId); } catch { console.error('Admin account action succeeded but audit write failed', userId); return json({success:true,audit_pending:true,message:'Account updated; audit logging needs attention.'}); }
    return json({ success: true, message: action === 'block' ? 'Account blocked.' : 'Account access restored.' });
  } catch (error) {
    console.error('Admin account update failed:', error);
    return json({ error: 'Account action could not be completed.' }, 500);
  }
}

async function deleteUserMedia(supabase, userId, profileId) {
  // Only delete paths owned by the selected account; never touch an unrelated public URL.
  const {data:buckets,error:bucketError}=await supabase.storage.listBuckets();
  if(bucketError) return {ok:false,failures:['Bucket discovery failed']};
  const existing=new Set((buckets||[]).map(b=>b.name));
  const failures=[]; let deleted=0;
  for(const bucketName of ['profile-media','creator-media']) {
    if(!existing.has(bucketName))continue;
    const bucket=supabase.storage.from(bucketName);
    for(const prefix of [userId, ...(profileId ? [profileId] : [])]) {
      const queue=[prefix]; let loops=0;
      while(queue.length && loops++<100) {
        const path=queue.shift();
        for(let batch=0;batch<100;batch++) {
          const {data,error}=await bucket.list(path,{limit:100,offset:0});
          if(error){failures.push(`${bucketName}/${path}: list failed`);break;}
          if(!data?.length)break;
          const files=[];
          for(const item of data){const full=`${path}/${item.name}`;if(item.id || item.metadata)files.push(full);else queue.push(full);}
          if(files.length){const {error:removeError}=await bucket.remove(files);if(removeError)failures.push(`${bucketName}/${path}: remove failed`);else deleted+=files.length;}
          if(data.length<100)break;
        }
      }
      if(queue.length)failures.push(`${bucketName}/${prefix}: too many nested folders`);
    }
  }
  return {ok:failures.length===0,deleted,failures};
}

export async function DELETE(request, context) {
  const authorization = await authorize(request);
  if (authorization.response) return authorization.response;
  if (authorization.admin?.role !== 'super_admin') return json({ error: 'Only Super Admin can permanently delete accounts.' }, 403);
  const { userId } = await context.params;
  if (!UUID.test(userId)) return json({ error: 'Invalid account ID.' }, 400);
  if (userId === authorization.admin.userId || userId === authorization.admin.user_id) return json({ error: 'You cannot delete your own admin account.' }, 403);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Email confirmation is required.' }, 400); }
  try {
    const supabase = getAdminServiceClient();
    const [{ data: targetResult, error: targetError }, { data: adminRecord, error: adminError }] = await Promise.all([
      supabase.auth.admin.getUserById(userId),
      supabase.from('admin_users').select('user_id').eq('user_id', userId).maybeSingle(),
    ]);
    const target = targetResult?.user;
    if (targetError || !target) return json({ error: 'Account not found.' }, 404);
    if (adminError) return json({ error: 'Unable to verify account permissions.' }, 500);
    if (adminRecord) return json({ error: 'Admin accounts cannot be deleted from this screen.' }, 403);
    const expectedConfirmation = String(target.email || target.id).toLowerCase();
    if (String(body?.confirmationEmail || '').trim().toLowerCase() !== expectedConfirmation) return json({ error: 'The account email or ID confirmation does not match.' }, 400);

    const { data: deletedInfo, error: deleteError } = await supabase.rpc('admin_delete_user_account', {
      p_actor_user_id: authorization.admin.userId || authorization.admin.user_id,
      p_target_user_id: userId,
    });
    if (deleteError) {
      console.error('Admin account deletion RPC failed:', deleteError.message);
      return json({ error: 'Account could not be deleted. Check that migration 023 is installed and dependencies permit deletion.' }, 500);
    }
    const cleanup=await deleteUserMedia(supabase,userId,deletedInfo?.profile_id);
    if(!cleanup.ok) { console.error('Post-deletion storage cleanup requires follow-up:', cleanup.failures); return json({success:true,cleanup_pending:true,message:'Account deleted; some media cleanup needs manual review.'}); }
    return json({ success: true, message: 'Account deleted and owned media folders cleaned.' });
  } catch (error) {
    console.error('Admin account deletion failed:', error);
    return json({ error: error.message || 'Account deletion could not be completed.' }, 500);
  }
}
