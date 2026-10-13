import {defaultSettings,quote,type Settings,type Line} from '../app/menu.ts';
export class StoreError extends Error {status:number;constructor(message:string,status=400){super(message);this.status=status}}
export const clean=(v:unknown,max=200)=>typeof v==='string'?v.trim().slice(0,max):'';
export const transitions:Record<string,string[]>={received:['confirmed','cancelled'],confirmed:['preparing','cancelled'],preparing:['out-for-delivery','cancelled'],'out-for-delivery':['delivered','cancelled'],delivered:[],cancelled:[]};
export function mergeSettings(saved?:Partial<Settings>):Settings{return {...defaultSettings,...saved,products:defaultSettings.products.map(d=>{const p=saved?.products?.find(p=>p.id===d.id);return {...d,...p,id:d.id,category:d.category,photo:d.photo,mealBase:d.mealBase};})};}
export function validateSettings(s:Settings){
 if(!s||!['coming-soon','demo'].includes(s.mode))throw new StoreError('Live ordering is not activated.',403);
 if(!Number.isInteger(s.deliveryFee)||s.deliveryFee<0||s.deliveryFee>500000||!Number.isInteger(s.minimum)||s.minimum<0||s.minimum>10000000)throw new StoreError('Invalid delivery settings');
 if(!Array.isArray(s.zones)||!s.zones.length||s.zones.length>30||s.zones.some(z=>typeof z!=='string'||!z.trim()||z.length>80))throw new StoreError('Invalid zones');
 if(!Array.isArray(s.products)||s.products.length!==defaultSettings.products.length||new Set(s.products.map(p=>p.id)).size!==s.products.length||s.products.some(p=>!defaultSettings.products.some(d=>d.id===p.id)||!Number.isInteger(p.price)||p.price<100||p.price>10000000||typeof p.available!=='boolean'||typeof p.name!=='string'||!p.name.trim()||p.name.length>80||typeof p.es!=='string'||typeof p.en!=='string'||p.es.length>200||p.en.length>200||(p.image&&!/^https:\/\//.test(p.image))))throw new StoreError('Invalid products');
 if(!Number.isFinite(s.taxPercent)||s.taxPercent<0||s.taxPercent>100||typeof s.taxConfirmed!=='boolean'||typeof s.payOnDelivery!=='boolean')throw new StoreError('Invalid tax settings');
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s.openTime)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(s.closeTime)||s.openTime>=s.closeTime)throw new StoreError('Invalid opening hours');
 for(const k of ['address','phone','instagram','openingDate','eta'] as const)if(typeof s[k]!=='string'||s[k].length>300)throw new StoreError('Invalid restaurant details');
 if(s.instagram&&!/^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/.test(s.instagram))throw new StoreError('Invalid Instagram profile');
 return mergeSettings(s);
}
export function signupEmail(b:any){const email=clean(b.email,254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||b.consent!==true)throw new StoreError('Enter a valid email and accept opening updates.');return email;}
export function orderSession(b:any){if(b.demo!==true)throw new StoreError('Opening soon. Demo orders only.',403);const key=clean(b.idempotencyKey,80),token=clean(b.accessToken,100);if(!/^[\w-]{32,80}$/.test(key)||!/^[\w-]{32,100}$/.test(token))throw new StoreError('Invalid checkout session');return {key,token};}
export function orderData(b:any,s:Settings){
 orderSession(b);const c=b.customer||{};
 const customer={name:clean(c.name,100),phone:clean(c.phone,30),email:clean(c.email,254),address:clean(c.address,300),zone:clean(c.zone,80),hotel:clean(c.hotel,100),unit:clean(c.unit,40),landmark:clean(c.landmark,150),notes:clean(c.notes,400)};
 if(customer.name.length<2||customer.phone.replace(/\D/g,'').length<8||customer.phone.replace(/\D/g,'').length>15||customer.address.length<8||!s.zones.includes(customer.zone)||(customer.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)))throw new StoreError('Check your name, phone, address and delivery zone.');
 const q=quote(b.lines as Line[],s.products,s.deliveryFee);if(q.subtotal<s.minimum)throw new StoreError('Minimum order not reached');
 const tax=s.taxConfirmed?Math.round(q.subtotal*s.taxPercent/100):0,total=q.total+tax;if(b.expectedTotal!==total)throw new StoreError('Prices changed. Refresh your bag.',409);
 return {...q,total,tax,customer,demo:true,payment:'demo — no payment collected',eta:s.eta};
}
