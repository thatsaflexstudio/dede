import {cookies} from 'next/headers';
import {configured,adminReady,sameOrigin,rateLimit} from '@/lib/server';
import {equal,createToken} from '@/lib/auth-token';
export async function POST(req:Request){
 if(!sameOrigin(req))return new Response('Invalid origin',{status:403});
 if(!configured()||!adminReady())return new Response('Admin storage is not configured',{status:503});
 try{
  if(Number(req.headers.get('content-length')||0)>2048)return new Response('Request too large',{status:413});
  if(!await rateLimit(req,'login',5,900_000))return Response.redirect(new URL('/admin/login?error=limited',req.url),303);
  const form=await req.formData(),password=String(form.get('password')||'');
  if(password.length>256||!equal(password,process.env.ADMIN_PASSWORD!))return Response.redirect(new URL('/admin/login?error=password',req.url),303);
  (await cookies()).set('dedes-admin',createToken(process.env.ADMIN_SESSION_SECRET!,process.env.ADMIN_PASSWORD!),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:28800});
  return Response.redirect(new URL('/admin',req.url),303);
 }catch{return Response.redirect(new URL('/admin/login?error=setup',req.url),303)}
}
