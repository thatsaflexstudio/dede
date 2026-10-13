import {mergeSettings,orderSession,orderData,signupEmail,validateSettings,transitions} from './store-model.ts';
export interface StorageLike {getItem(k:string):string|null;setItem(k:string,v:string):void}
const key='dedes-vercel-demo-v1';
export function browserApi(storage:StorageLike,b?:any,query='',headers?:Record<string,string>){
 const state=JSON.parse(storage.getItem(key)||'{"orders":[],"signups":[]}');
 const settings=mergeSettings(state.settings);const action=new URLSearchParams(query).get('action');
 const save=()=>{try{storage.setItem(key,JSON.stringify(state))}catch{throw Error('Device storage is full or unavailable. Your changes were not saved.')}};
 if(!b){
  if(action==='admin')return {settings,orders:state.orders.map(({token,idem,...o}:any)=>o),signups:state.signups,canLive:false,storageMode:'browser'};
  if(action==='track'){const id=new URLSearchParams(query).get('id');const o=state.orders.find((o:any)=>o.id===id&&o.token===headers?.['x-order-token']);if(!o)throw Error('Demo order not found on this device.');const {token,idem,...order}=o;return {order};}
  return {settings,signedIn:true,canLive:false,storageMode:'browser'};
 }
 if(b.action==='order'){
  const {key:idem,token}=orderSession(b);const old=state.orders.find((o:any)=>o.idem===idem);if(old){if(old.token!==token)throw Error('Checkout conflict');return {id:old.id,accessToken:token};}
  const data=orderData(b,settings),id='DEDE-'+crypto.randomUUID().slice(0,8).toUpperCase();state.orders.unshift({...data,id,token,idem,status:'received',driver:'',createdAt:Date.now()});state.orders=state.orders.slice(0,100);save();return {id,accessToken:token};
 }
 if(b.action==='settings'){state.settings=validateSettings(b.settings);save();return {ok:true};}
 if(b.action==='signup'){const email=signupEmail(b);if(!state.signups.some((s:any)=>s.email===email))state.signups.push({email,createdAt:Date.now()});save();return {ok:true};}
 if(b.action==='status'){const o=state.orders.find((o:any)=>o.id===b.id);if(!o||!(b.status===o.status||transitions[o.status]?.includes(b.status)))throw Error('Invalid status transition');o.status=b.status;o.driver=String(b.driver||'').slice(0,100);save();return {ok:true};}
 throw Error('Unknown action');
}
