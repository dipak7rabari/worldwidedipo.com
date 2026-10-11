'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { mediaUrl, safeUrl, themeFor } from '@/lib/creator/shared';
import styles from './Creator.module.css';
export default function CreatorPublic({ creator, profile }) {
  const theme = themeFor(creator.theme);
  const [showJoin, setShowJoin] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const endRef = useRef(null);
  useEffect(() => {
    if (dismissed || !endRef.current) return;
    const observer = new IntersectionObserver(entries => { if (entries[0]?.isIntersecting) setShowJoin(true); }, { threshold: 0.6 });
    observer.observe(endRef.current); return () => observer.disconnect();
  }, [dismissed]);
  const links = Array.isArray(creator.links) ? creator.links : [];
  const images = Array.isArray(creator.images) ? creator.images.map(mediaUrl).filter(Boolean) : [];
  return <main className={styles.public} style={{ '--creator-bg': theme.background, '--creator-ink': theme.foreground, '--creator-card': theme.card }}><div className={styles.publicInner}>
    <div className={styles.publicAvatar}>{profile.avatar_url ? <img src={profile.avatar_url} alt={`${profile.name} avatar`} /> : <span>{(profile.name || 'D')[0]}</span>}</div><h1>{profile.name}</h1>{creator.instagram && <a className={styles.instagram} href={`https://www.instagram.com/${encodeURIComponent(creator.instagram)}/`} target="_blank" rel="noopener noreferrer">◎ @{creator.instagram} ↗</a>}{profile.bio && <p className={styles.publicBio}>{profile.bio}</p>}
    {images.length > 0 && <div className={styles.publicPhotos} data-count={images.length}>{images.map((url,i) => <img src={url} alt={`${profile.name} featured image ${i+1}`} key={url} loading="lazy" />)}</div>}
    <div className={styles.publicLinks}>{links.map((link,i) => safeUrl(link.url) && <a key={link.id || i} className={`${styles.publicLink} ${link.trending ? styles.hot : ''}`} href={safeUrl(link.url)} target="_blank" rel="noopener noreferrer nofollow">{link.trending && <span className={styles.hotTag}>🔥 TRENDING</span>}<span>{link.title}</span><span aria-hidden="true">↗</span></a>)}</div>
    <footer className={styles.publicFooter}>Made for creators · Worldwide DIPO</footer><div ref={endRef} className={styles.endMarker} aria-hidden="true" /></div>
    {showJoin && !dismissed && <div className={styles.joinOverlay}><section className={styles.joinSheet} aria-label="Join Worldwide DIPO"><button type="button" className={styles.closeJoin} onClick={() => { setDismissed(true); setShowJoin(false); }} aria-label="Dismiss invitation">×</button><span className={styles.joinBrand}>✦ WORLDWIDE DIPO</span><h2>Make your own link in bio.</h2><p>Everything you create, together in one beautiful link.</p><Link href="/auth/signup" className={styles.joinButton}>Join Worldwide DIPO ↗</Link></section></div>}
  </main>;
}
