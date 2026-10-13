import {redirect} from 'next/navigation';
import {configured,isAdmin} from '@/lib/server';
export const dynamic='force-dynamic';
export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
 if(!configured()||await isAdmin())redirect('/admin');const {error}=await searchParams;
 return <main className="admin-shell" style={{maxWidth:500}}><a href="/" className="brand-name">DEDE’S</a><h1 style={{fontSize:36,margin:'30px 0'}}>Panel del restaurante</h1><p>Restaurant admin sign-in</p><form action="/api/auth/login" method="post" className="checkout-form" style={{marginTop:25}}><label>Contraseña / Password<input name="password" type="password" required maxLength={256} autoComplete="current-password"/></label>{error&&<p role="alert" className="error-text">{error==='limited'?'Demasiados intentos. Intenta en 15 minutos. / Try again in 15 minutes.':'No se pudo iniciar sesión. Revisa tu contraseña y la configuración. / Sign-in failed. Check your password and setup.'}</p>}<button className="btn primary">Entrar / Sign in</button></form></main>;
}
