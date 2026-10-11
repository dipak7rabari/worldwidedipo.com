'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './AdminUsersManager.module.css';

const PAGE_SIZE = 25;
const initialFilters = { query: '', status: '', role: '', provider: '' };

function initials(name, email) {
  const value = (name || email || 'U').trim();
  return value.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';
}

function date(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed);
}

export default function AdminUsersManager({ adminRole }) {
  const [filters, setFilters] = useState(initialFilters);
  const [draft, setDraft] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ users: [], pagination: { total: 0 } });
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const canDelete = adminRole === 'super_admin';

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
      const response = await fetch(`/api/admin/users/search?${params}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Users could not be loaded.');
      setResult(data);
    } catch (cause) { setError(cause.message || 'Users could not be loaded.'); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  function applyFilters(event) {
    event.preventDefault(); setPage(1); setFilters({ ...draft, query: draft.query.trim() });
  }

  async function performAction(user, action) {
    setWorkingId(user.id); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action === 'delete' ? { confirmationEmail: confirmText.trim() } : { action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Action could not be completed.');
      setNotice(data.message || 'Account updated.'); setConfirm(null); setConfirmText(''); await load();
    } catch (cause) { setError(cause.message || 'Action could not be completed.'); }
    finally { setWorkingId(''); }
  }

  const total = result.pagination?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <div><span className={styles.eyebrow}>CONTROL ROOM · ACCOUNTS</span><h2>Manage every account.</h2><p>Search users, check access status, block or restore access, and permanently remove an account when needed.</p></div>
        <div className={styles.heroStat}><strong>{total.toLocaleString('en-IN')}</strong><span>matching accounts</span></div>
      </section>

      <form className={styles.filters} onSubmit={applyFilters}>
        <label className={styles.search}>Search accounts<input value={draft.query} onChange={(e) => setDraft({ ...draft, query: e.target.value })} placeholder="Name, email or user ID" maxLength={100} /></label>
        <label>Account status<select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Blocked / inactive</option></select></label>
        <label>Role<select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })}><option value="">All roles</option><option value="user">User</option><option value="support">Support</option><option value="admin">Admin</option><option value="super_admin">Super admin</option></select></label>
        <label>Sign-in method<select value={draft.provider} onChange={(e) => setDraft({ ...draft, provider: e.target.value })}><option value="">All methods</option><option value="email">Email</option><option value="google">Google</option><option value="github">GitHub</option><option value="apple">Apple</option><option value="phone">Phone</option></select></label>
        <button className={styles.apply} type="submit">Apply filters</button>
      </form>

      {error && <div className={styles.alert} role="alert">{error}</div>}
      {notice && <div className={styles.notice} role="status">{notice}</div>}

      <section className={styles.tableCard}>
        <div className={styles.tableHead}><div><span className={styles.eyebrow}>ACCOUNT DIRECTORY</span><h3>Users</h3></div><button className={styles.refresh} type="button" onClick={load} disabled={loading}>{loading ? 'Loading…' : '↻ Refresh'}</button></div>
        {loading ? <div className={styles.empty}>Loading accounts…</div> : result.users?.length ? <div className={styles.tableScroll}><table><thead><tr><th>USER</th><th>ACCESS</th><th>ROLE</th><th>JOINED</th><th>LAST ACTIVE</th><th>ACTIONS</th></tr></thead><tbody>{result.users.map((user) => {
          const isAdmin = user.role !== 'user';
          const isInactive = user.account_status === 'inactive';
          const isDeleted = user.is_deleted === true;
          const isSelf = user.is_current_admin === true;
          const locked = isAdmin || isSelf || isDeleted;
          return <tr key={user.id}>
            <td><div className={styles.identity}><span className={styles.avatar}>{initials(user.display_name, user.email)}</span><span className={styles.userText}><strong>{user.display_name || 'Unnamed user'}</strong><small>{user.email || 'No email'}<br /><code>{user.id}</code></small></span></div></td>
            <td><span className={`${styles.status} ${isDeleted ? styles.deleted : isInactive ? styles.blocked : styles.active}`}><i />{isDeleted ? 'Deleted' : isInactive ? 'Blocked' : 'Active'}</span>{!user.email_confirmed && !isDeleted && <small className={styles.unverified}>Email not verified</small>}</td>
            <td><span className={styles.role}>{user.role.replaceAll('_', ' ')}</span><small className={styles.provider}>{user.provider || 'Auth'}</small></td>
            <td>{date(user.created_at)}</td><td>{date(user.last_sign_in_at)}</td>
            <td><div className={styles.actions}>
              {!isDeleted && !isAdmin && !isSelf && <button type="button" className={isInactive ? styles.restore : styles.block} disabled={workingId === user.id} onClick={() => setConfirm({ user, action: isInactive ? 'unblock' : 'block' })}>{isInactive ? 'Unblock' : 'Block'}</button>}
              {canDelete && !locked && <button type="button" className={styles.delete} disabled={workingId === user.id} onClick={() => { setConfirm({ user, action: 'delete' }); setConfirmText(''); }}>Delete</button>}
              {workingId === user.id && <span className={styles.spinner}>Working…</span>}
              {isAdmin && <span className={styles.protected}>Protected admin</span>}
              {isSelf && <span className={styles.protected}>Your account</span>}
            </div></td>
          </tr>;
        })}</tbody></table></div> : <div className={styles.empty}><strong>No accounts found</strong><span>Try a different search or remove one of the filters.</span></div>}
        <div className={styles.pagination}><span>Page {page} of {totalPages} · {total.toLocaleString('en-IN')} accounts</span><div><button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(1, current - 1))}>← Back</button><button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next →</button></div></div>
      </section>

      <p className={styles.securityNote}>Sensitive account actions require an MFA verified admin session. Admin accounts cannot be blocked or deleted here. Permanent deletion is available only to Super Admin.</p>

      {confirm && <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirm(null); }}><section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <button className={styles.close} type="button" aria-label="Close dialog" onClick={() => setConfirm(null)}>×</button>
        <span className={confirm.action === 'delete' ? styles.dangerIcon : styles.actionIcon}>{confirm.action === 'delete' ? '!' : '↗'}</span>
        <h3 id="confirm-title">{confirm.action === 'delete' ? 'Permanently delete account?' : confirm.action === 'block' ? 'Block this account?' : 'Restore account access?'}</h3>
        <p>{confirm.action === 'delete' ? `This removes ${confirm.user.email || 'this account'}, its DIPO profile and profile images. This cannot be undone.` : confirm.action === 'block' ? `${confirm.user.email || 'This user'} will lose the ability to sign in until you unblock the account.` : `${confirm.user.email || 'This user'} will be able to sign in again.`}</p>
        {confirm.action === 'delete' && <label className={styles.confirmField}>Type the account email or ID to confirm<input autoComplete="off" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder={confirm.user.email || confirm.user.id} /></label>}
        <div className={styles.modalActions}><button type="button" className={styles.cancel} onClick={() => setConfirm(null)}>Cancel</button><button type="button" className={confirm.action === 'delete' || confirm.action === 'block' ? styles.confirmDanger : styles.confirmOkay} disabled={workingId === confirm.user.id || (confirm.action === 'delete' && confirmText.trim().toLowerCase() !== String(confirm.user.email || confirm.user.id).toLowerCase())} onClick={() => performAction(confirm.user, confirm.action)}>{confirm.action === 'delete' ? 'Delete account' : confirm.action === 'block' ? 'Block account' : 'Unblock account'}</button></div>
      </section></div>}
    </div>
  );
}
