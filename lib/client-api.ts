'use client';
import {browserApi} from './browser-demo';
let mode:Promise<string>|undefined;
async function request(body?:unknown,query='',headers?:Record<string,string>){const r=await fetch('/api/store'+query,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...headers},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok)throw Error(d.error||'Please try again.');return d;}
export async function api(body?:unknown,query='',headers?:Record<string,string>){
 if(!mode)mode=request().then(d=>d.storageMode).catch(e=>{mode=undefined;throw e});
 return await mode==='browser'?browserApi(localStorage,body,query,headers):request(body,query,headers);
}
