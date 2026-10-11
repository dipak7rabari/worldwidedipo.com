import Link from 'next/link';
import './admin-upgrade.css';
export const metadata = { title: { default: 'Admin | Worldwide DIPO', template: '%s | Worldwide DIPO Admin' }, robots: { index:false, follow:false, nocache:true } };
const routes = [['/admin','Overview'],['/admin/users','Users'],['/admin/profiles','Profiles'],['/admin/payments','Payments'],['/admin/audit','Audit'],['/admin/security','Security'],['/admin/settings','Settings']];
export default function AdminLayout({children}) { return <div className="da-app">
 <header className="da-top"><div className="da-top-inner"><Link className="da-brand" href="/admin"><span className="da-logo">WD</span><span><strong>Worldwide DIPO</strong><small>Secure administration</small></span></Link><Link className="da-back" href="/dashboard">← Back to website</Link></div>
 <nav className="da-nav" aria-label="Admin areas">{routes.map(([url,label])=><Link key={url} href={url}>{label}</Link>)}</nav></header>
 <div className="da-content">{children}</div></div>; }
