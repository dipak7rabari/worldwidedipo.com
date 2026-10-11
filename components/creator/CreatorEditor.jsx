'use client';
import { useState } from 'react';
import Link from 'next/link';
import { THEMES, limitFor, mediaUrl } from '@/lib/creator/shared';
import styles from './Creator.module.css';

const empty = () => ({ id: crypto.randomUUID(), title: '', url: '', trending: false });
export default function CreatorEditor({ profile, initial }) {
  const [theme, setTheme] = useState(initial?.theme || 'lavender');
  const [instagram, setInstagram] = useState(initial?.instagram || '');
  const [links, setLinks] = useState(Array.isArray(initial?.links) ? initial.links : []);
  const [images, setImages] = useState(Array.isArray(initial?.images) ? initial.images : [null, null]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const limit = limitFor(profile.plan);
  const liveUrl = `/c/${encodeURIComponent(profile.slug)}`;
  const update = (index, patch) => setLinks(old => old.map((item, i) => i === index ? { ...item, ...patch } : item));
  const reorder = (index, delta) => setLinks(old => { const next = [...old], target = index + delta; if (target < 0 || target >= next.length) return old; [next[index], next[target]] = [next[target], next[index]]; return next; });
  async function save() {
    setError(''); setNotice(''); setBusy(true);
    try {
      const res = await fetch('/api/creator', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ theme, instagram, links }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Save failed');
      setLinks(data.creator.links); setNotice('Creator page saved successfully.');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function imageAction(slot, file) {
    setError(''); setNotice(''); setUploading(slot);
    try {
      const opts = file ? { method: 'POST', body: (() => { const form = new FormData(); form.append('slot', String(slot)); form.append('file', file); return form; })() } : { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slot }) };
      const res = await fetch('/api/creator/media', opts); const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Image action failed');
      setImages(data.images); setNotice(file ? 'Image saved.' : 'Image deleted.');
    } catch (e) { setError(e.message); } finally { setUploading(null); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(`${location.origin}${liveUrl}`); setNotice('Creator link copied.'); }
    catch { setNotice(`${location.origin}${liveUrl}`); }
  }
  return <main className={styles.editor}>
    <div className={styles.editorTop}><div><span className={styles.kicker}>WORLDWIDE DIPO / CREATOR STUDIO</span><h1>Your link. Your world.</h1><p>One beautiful destination for everything you share.</p></div><Link href={liveUrl} target="_blank" className={styles.outline}>View live ↗</Link></div>
    <div className={styles.editorGrid}><div className={styles.editColumn}>
      <section className={styles.panel}><div className={styles.panelTitle}><h2>01 / Your identity</h2><span>{profile.plan?.toUpperCase()} PLAN</span></div><div className={styles.identity}><div className={styles.avatar}>{profile.avatar_url ? <img src={profile.avatar_url} alt="Your profile" /> : (profile.name || 'D')[0]}</div><div><strong>{profile.name}</strong><p>@{profile.slug}</p><small>DP and name are managed in <Link href="/dashboard/profile/edit">Edit Profile ↗</Link></small></div></div><label className={styles.field}>Instagram username<input value={instagram} onChange={e => setInstagram(e.target.value.replace(/^@/, ''))} placeholder="your.instagram.id" maxLength={30} /></label></section>
      <section className={styles.panel}><div className={styles.panelTitle}><h2>02 / Choose a vibe</h2><span>5 THEMES</span></div><div className={styles.themes}>{THEMES.map(item => <button type="button" key={item.id} onClick={() => setTheme(item.id)} className={`${styles.themeCard} ${theme === item.id ? styles.selected : ''}`} aria-pressed={theme === item.id}><span style={{ background: item.background, color: item.foreground }}><i style={{ background: item.card }} /><i style={{ background: item.card }} /><i style={{ background: item.card }} /></span><strong>{item.name}</strong></button>)}</div></section>
      <section className={styles.panel}><div className={styles.panelTitle}><h2>03 / Featured photos</h2><span>2 IMAGES</span></div><p className={styles.hint}>Add up to two photos above your links. JPG, PNG, WEBP · 5 MB max.</p><div className={styles.imageSlots}>{[0,1].map(slot => <div className={styles.imageSlot} key={slot}>{mediaUrl(images[slot]) ? <img src={mediaUrl(images[slot])} alt={`Featured ${slot + 1}`} /> : <div className={styles.imageEmpty}>✦<small>Photo {slot + 1}</small></div>}<div className={styles.imageActions}><label className={styles.smallButton}>{uploading === slot ? 'Uploading…' : mediaUrl(images[slot]) ? 'Replace' : 'Upload'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading !== null} onChange={e => { const file = e.target.files?.[0]; if (file) imageAction(slot, file); e.target.value = ''; }} hidden /></label>{mediaUrl(images[slot]) && <button type="button" disabled={uploading !== null} onClick={() => imageAction(slot, null)}>Delete</button>}</div></div>)}</div></section>
      <section className={styles.panel}><div className={styles.panelTitle}><h2>04 / Your links</h2><span>{links.length} / {limit}</span></div><p className={styles.hint}>Add, edit, delete or move links. Highlight a special link as trending.</p><div className={styles.linkEditor}>{links.map((item, index) => <div className={styles.linkEdit} key={item.id || index}><div className={styles.linkEditTop}><strong>Link {index + 1}</strong><div><button aria-label="Move up" type="button" disabled={index === 0} onClick={() => reorder(index, -1)}>↑</button><button aria-label="Move down" type="button" disabled={index === links.length - 1} onClick={() => reorder(index, 1)}>↓</button><button type="button" onClick={() => setLinks(old => old.filter((_, i) => i !== index))}>Delete</button></div></div><label className={styles.field}>Title<input value={item.title} maxLength={90} onChange={e => update(index, { title: e.target.value })} placeholder="Watch my latest video" /></label><label className={styles.field}>Destination URL<input type="url" value={item.url} onChange={e => update(index, { url: e.target.value })} placeholder="https://..." /></label><label className={styles.trending}><input type="checkbox" checked={item.trending === true} onChange={e => update(index, { trending: e.target.checked })} /> 🔥 Highlight as trending</label></div>)}</div><button type="button" className={styles.addButton} disabled={links.length >= limit} onClick={() => setLinks(old => [...old, empty()])}>＋ Add link</button>{links.length >= limit && <p className={styles.hint}>Your {profile.plan} plan allows {limit} links.</p>}</section>
      <div className={styles.stickyActions}><button type="button" className={styles.save} disabled={busy || uploading !== null} onClick={save}>{busy ? 'Saving…' : 'Save creator page ↗'}</button><button type="button" className={styles.outline} onClick={copy}>Copy link</button></div>{error && <p className={styles.error} role="alert">{error}</p>}{notice && <p className={styles.success} role="status">{notice}</p>}
    </div><aside className={styles.preview}><div className={styles.previewHead}>LIVE STYLE PREVIEW</div><div className={styles.previewPage} style={{ background: THEMES.find(t => t.id === theme)?.background, color: THEMES.find(t => t.id === theme)?.foreground }}><div className={styles.previewAvatar}>{profile.avatar_url ? <img src={profile.avatar_url} alt="" /> : (profile.name || 'D')[0]}</div><h3>{profile.name}</h3><p>{instagram ? `@${instagram}` : `@${profile.slug}`}</p><div className={styles.previewImages}>{images.map((item, i) => mediaUrl(item) ? <img key={i} src={mediaUrl(item)} alt="" /> : null)}</div>{links.map((item,i) => <div className={styles.previewLink} key={i}>{item.trending ? '🔥 ' : ''}{item.title || 'Your link'} ↗</div>)}</div></aside></div>
  </main>;
}
