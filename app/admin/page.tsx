import {redirect} from 'next/navigation';
import {configured,isAdmin,adminReady} from '@/lib/server';
import Dashboard from './dashboard';
export const dynamic='force-dynamic';
export default async function Admin(){
 if(configured()&&!adminReady())return <main className="admin-shell"><h1>Finish admin setup</h1><p>Set ADMIN_PASSWORD (at least 16 characters) and ADMIN_SESSION_SECRET (at least 32 characters) in Vercel, then redeploy.</p></main>;
 if(configured()&&!await isAdmin())redirect('/admin/login');
 return <>{configured()&&<form action="/api/auth/logout" method="post" style={{textAlign:'right',padding:15}}><button className="btn secondary">Cerrar sesión / Sign out</button></form>}<Dashboard/></>;
}
