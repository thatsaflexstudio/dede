import {configured,adminReady,isAdmin,sql,sameOrigin,rateLimit} from '@/lib/server';
import {Repository} from '@/lib/repository';
import {mergeSettings,validateSettings,signupEmail,StoreError,clean} from '@/lib/store-model';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const reply=(d:unknown,status=200)=>Response.json(d,{status,headers:{'Cache-Control':'no-store'}});
const repo=()=>{const db=sql();return new Repository((q,p)=>db.query(q,p));};
function failure(e:unknown){if(e instanceof StoreError)return reply({error:e.message},e.status);if(e instanceof Error&&/^Invalid|unavailable/.test(e.message))return reply({error:e.message},400);return reply({error:'Storage is unavailable. Check the database connection and run database/schema.sql.'},503);}
export async function GET(req:Request){
 if(!configured())return reply({storageMode:'browser',settings:mergeSettings(),signedIn:true,canLive:false});
 try{
  if(!adminReady())return reply({error:'Set ADMIN_PASSWORD (16+ characters) and ADMIN_SESSION_SECRET (32+ characters) in Vercel, then redeploy.'},503);
  const url=new URL(req.url),action=url.searchParams.get('action');const r=repo();
  if(action==='admin'){if(!await isAdmin())return reply({error:'Admin sign-in required.'},401);return reply(await r.admin());}
  if(action==='track'){if(!await rateLimit(req,'track',60))return reply({error:'Please try again in a minute.'},429);return reply(await r.track(url.searchParams.get('id')||'',req.headers.get('x-order-token')||''));}
  return reply({settings:await r.settings(),signedIn:true,canLive:false,storageMode:'database'});
 }catch(e){return failure(e);}
}
export async function POST(req:Request){
 if(!sameOrigin(req))return reply({error:'Invalid origin'},403);
 if(!configured())return reply({error:'This deployment uses an on-device demo. No server data is stored.'},503);
 if(!adminReady())return reply({error:'Complete the admin environment settings.'},503);
 try{
  if(Number(req.headers.get('content-length')||0)>50000)return reply({error:'Request too large'},413);
  const raw=await req.text();if(raw.length>50000)return reply({error:'Request too large'},413);
  let b:any;try{b=JSON.parse(raw)}catch{return reply({error:'Invalid request'},400)}
  if(!b||typeof b!=='object')return reply({error:'Invalid request'},400);
  const r=repo();
  if(['settings','status'].includes(b.action)&&!await isAdmin())return reply({error:'Admin sign-in required.'},401);
  if(b.action==='settings'){await r.saveSettings(validateSettings(b.settings));return reply({ok:true});}
  if(b.action==='status')return reply(await r.status(clean(b.id),clean(b.status),clean(b.driver,100)));
  if(b.action==='signup'){const email=signupEmail(b);if(!await rateLimit(req,'signup',5))return reply({error:'Please try again in a minute.'},429);return reply(await r.signup(email));}
  if(b.action==='order'){if(!await rateLimit(req,'order',10))return reply({error:'Please try again in a minute.'},429);return reply(await r.order(b));}
  return reply({error:'Unknown action'},400);
 }catch(e){return failure(e);}
}
