'use client';
import {useState} from 'react';
import Link from 'next/link';
import AdminUsersManager from './AdminUsersManager';
import styles from './AdminWorkspace.module.css';
const shortcuts=[['Profiles','/admin/profiles','Public identities and subscription status','◈'],['Payments','/admin/payments','Verify transfers and review claims','₹'],['Audit','/admin/audit','Read-only administrator activity','◎'],['Security','/admin/security','MFA and administrative access','✧'],['Settings','/admin/settings','System administration settings','⚙']];
export default function AdminWorkspace({adminRole,mfaVerified}) {
 const [tab,setTab]=useState('overview');
 return <section className={styles.workspace} aria-label="Admin workspace">
 <div className={styles.heading}><div><span className={styles.kicker}>WORLDWIDE DIPO · COMMAND CENTER</span><h2>Manage everything.</h2><p>One workspace for your community, profiles and operations.</p></div><span className={styles.secure}>{mfaVerified?'● MFA verified':'○ MFA required'}</span></div>
 <div className={styles.switch} role="tablist" aria-label="Workspace views"><button type="button" role="tab" aria-selected={tab==='overview'} onClick={()=>setTab('overview')}>Overview</button><button type="button" role="tab" aria-selected={tab==='users'} onClick={()=>setTab('users')}>Users</button></div>
 {tab==='overview'?<div className={styles.tiles}>{shortcuts.map(([title,url,desc,icon])=><Link key={url} href={url} className={styles.tile}><span className={styles.icon}>{icon}</span><strong>{title} <span>↗</span></strong><small>{desc}</small></Link>)}</div>:mfaVerified?<AdminUsersManager adminRole={adminRole}/>:<div className={styles.locked}>Complete MFA verification to manage accounts. <Link href="/admin/security">Open security →</Link></div>}
 </section>;
}
