import {cookies} from 'next/headers';
import {neon} from '@neondatabase/serverless';
import {verifyToken,hash} from './auth-token';
export const configured=()=>!!process.env.DATABASE_URL;
export const adminReady=()=>!!process.env.ADMIN_PASSWORD&&process.env.ADMIN_PASSWORD.length>=16&&!!process.env.ADMIN_SESSION_SECRET&&process.env.ADMIN_SESSION_SECRET.length>=32;
export async function isAdmin(){if(!adminReady())return false;return verifyToken((await cookies()).get('dedes-admin')?.value||'',process.env.ADMIN_SESSION_SECRET!,process.env.ADMIN_PASSWORD!);}
export const sql=()=>neon(process.env.DATABASE_URL!);
export async function rateLimit(req:Request,action:string,max=30,window=60_000){
 const address=req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown';
 const id=hash(action+address+Math.floor(Date.now()/window));const db=sql();
 const rows=await db`INSERT INTO dedes_rate_limits (id,count,expires_at) VALUES (${id},1,${Date.now()+window*2}) ON CONFLICT (id) DO UPDATE SET count=dedes_rate_limits.count+1 RETURNING count`;
 if(Math.random()<0.02)await db`DELETE FROM dedes_rate_limits WHERE expires_at < ${Date.now()}`;
 return Number(rows[0].count)<=max;
}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return !origin||origin===new URL(req.url).origin;}
