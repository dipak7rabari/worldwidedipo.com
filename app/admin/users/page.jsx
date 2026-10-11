import {redirect} from 'next/navigation';
import {requireAAL2Admin} from '@/lib/auth/require-admin';
import AdminUsersManager from '@/components/admin/AdminUsersManager';
export const dynamic='force-dynamic';
export const metadata={title:'Users | Worldwide DIPO Admin',robots:{index:false,follow:false,nocache:true}};
export default async function AdminUsersPage(){let auth;try{auth=await requireAAL2Admin()}catch{redirect('/admin/login?next=/admin/users')}if(!auth?.ok)redirect('/admin/login?next=/admin/users');return <AdminUsersManager adminRole={auth.admin?.role||'support'}/>;}
