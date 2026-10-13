import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {Repository} from '../lib/repository.ts';
import {browserApi} from '../lib/browser-demo.ts';
import {createToken,verifyToken} from '../lib/auth-token.ts';
import {validateSettings} from '../lib/store-model.ts';
import {defaultSettings,quote,menu} from '../app/menu.ts';
const body=()=>({action:'order',demo:true,lines:[{key:'meal',productId:'classic-meal',quantity:2,options:{friesSize:'large',drink:'fanta',cheese:true}}],customer:{name:'Demo Customer',phone:'8095550100',address:'123 Test Street',zone:'Bávaro'},expectedTotal:97500,idempotencyKey:crypto.randomUUID(),accessToken:crypto.randomUUID()+crypto.randomUUID()});
test('meal pricing and invalid modifiers',()=>{
 assert.equal(quote(body().lines,menu,7500).total,97500);
 assert.throws(()=>quote([{...body().lines[0],options:{drink:'unknown'}}],menu,7500));
 assert.throws(()=>quote([{...body().lines[0],options:{combo:true}}],menu,7500));
 assert.throws(()=>validateSettings({...defaultSettings,mode:'live'}));
 assert.throws(()=>validateSettings({...defaultSettings,products:[...menu.slice(1),menu[1]]}));
});
test('signed admin session rejects tampering, expiry and password rotation',()=>{
 const secret='s'.repeat(40),password='a-unique-admin-password',now=Date.now();const token=createToken(secret,password,now);
 assert.equal(verifyToken(token,secret,password,now),true);
 assert.equal(verifyToken(token+'x',secret,password,now),false);
 assert.equal(verifyToken(token,secret,password,now+9*3600000),false);
 assert.equal(verifyToken(token,secret,password+'changed',now),false);
 assert.equal(verifyToken(token,'short',password,now),false);
});
test('on-device demo preserves choices, retries and status changes',()=>{
 const memory=new Map(),storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
 assert.equal(browserApi(storage).storageMode,'browser');
 const b=body(),placed=browserApi(storage,b);assert.equal(browserApi(storage,b).id,placed.id);
 const track=()=>browserApi(storage,undefined,'?action=track&id='+placed.id,{'x-order-token':b.accessToken}).order;
 assert.equal(track().total,97500);assert.equal(track().items[0].options.drink,'fanta');
 assert.throws(()=>browserApi(storage,undefined,'?action=track&id='+placed.id,{'x-order-token':'bad'}));
 assert.throws(()=>browserApi(storage,{...body(),demo:false}));
 assert.throws(()=>browserApi(storage,{action:'status',id:placed.id,status:'delivered'}));
 browserApi(storage,{action:'status',id:placed.id,status:'confirmed'});assert.equal(track().status,'confirmed');
 browserApi(storage,{action:'signup',email:'demo@example.com',consent:true});assert.equal(browserApi(storage,undefined,'?action=admin').signups.length,1);
 const other={getItem:()=>null,setItem:()=>{}};assert.throws(()=>browserApi(other,undefined,'?action=track&id='+placed.id,{'x-order-token':b.accessToken}));
});
test('PostgreSQL schema and complete shared-storage order lifecycle',async()=>{
 const db=new PGlite();try{
  const schema=await fs.readFile(new URL('../database/schema.sql',import.meta.url),'utf8');await db.exec(schema);await db.exec(schema);
  const r=new Repository(async(text,params)=>(await db.query(text,params)).rows);
  assert.equal((await r.settings()).products.length,18);
  const b=body();const [a,c]=await Promise.all([r.order(b),r.order(b)]);assert.equal(a.id,c.id);
  const tracked=(await r.track(a.id,b.accessToken)).order;assert.equal(tracked.total,97500);assert.deepEqual(tracked.items[0].options,b.lines[0].options);
  assert.equal('token_hash' in tracked,false);
  await assert.rejects(()=>r.track(a.id,'x'.repeat(64)),/not found/);
  await assert.rejects(()=>r.order({...b,accessToken:crypto.randomUUID()+crypto.randomUUID()}),/conflict/);
  await assert.rejects(()=>r.order({...body(),expectedTotal:1}),/Prices changed/);
  await assert.rejects(()=>r.order({...body(),demo:false}),/Demo orders only/);
  await assert.rejects(()=>r.status(a.id,'delivered',''),/Invalid/);
  await r.status(a.id,'confirmed','Test Driver');assert.equal((await r.track(a.id,b.accessToken)).order.driver,'Test Driver');
  const sold={...defaultSettings,products:menu.map(p=>p.id==='classic'?{...p,available:false}:p)};await r.saveSettings(validateSettings(sold));await assert.rejects(()=>r.order(body()),/unavailable/);await r.saveSettings(defaultSettings);
  await r.signup('demo@example.com');await r.signup('demo@example.com');const admin=await r.admin();assert.equal(admin.orders.length,1);assert.equal(admin.signups.length,1);assert.equal('token_hash' in admin.orders[0],false);
  const result=await db.query('INSERT INTO dedes_rate_limits(id,count,expires_at) VALUES($1,1,$2) ON CONFLICT(id) DO UPDATE SET count=dedes_rate_limits.count+1 RETURNING count',['sample',Date.now()+1000]);assert.equal(result.rows[0].count,1);
 }finally{await db.close()}
});
