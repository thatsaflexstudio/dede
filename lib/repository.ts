import {mergeSettings,orderSession,orderData,StoreError,transitions} from './store-model.ts';
import {hash} from './auth-token.ts';
export type Query=(text:string,params?:any[])=>Promise<any[]>;
export class Repository {
 private query:Query;
 constructor(query:Query){this.query=query}
 async settings(){const rows=await this.query('SELECT data FROM dedes_settings WHERE id=$1',['restaurant']);return mergeSettings(rows[0]?.data);}
 async saveSettings(data:any){await this.query('INSERT INTO dedes_settings(id,data) VALUES($1,$2::jsonb) ON CONFLICT(id) DO UPDATE SET data=excluded.data',['restaurant',JSON.stringify(data)]);}
 async admin(){const rows=await this.query('SELECT id,data,status,driver,created_at FROM dedes_orders ORDER BY created_at DESC LIMIT 100');return {orders:rows.map(this.present),settings:await this.settings(),signups:(await this.query('SELECT email,created_at FROM dedes_signups ORDER BY created_at DESC')).map(r=>({email:r.email,createdAt:Number(r.created_at)})),canLive:false,storageMode:'database'};}
 present(r:any){return {...r.data,id:r.id,status:r.status,driver:r.driver,createdAt:Number(r.created_at)};}
 async track(id:string,token:string){if(token.length<32)throw new StoreError('Unauthorized',403);const rows=await this.query('SELECT id,data,status,driver,created_at FROM dedes_orders WHERE id=$1 AND token_hash=$2',[id,hash(token)]);if(!rows[0])throw new StoreError('Order not found',404);return {order:this.present(rows[0])};}
 async signup(email:string){await this.query('INSERT INTO dedes_signups(email,created_at) VALUES($1,$2) ON CONFLICT(email) DO NOTHING',[email,Date.now()]);return {ok:true};}
 async status(id:string,status:string,driver:string){const rows=await this.query('SELECT status FROM dedes_orders WHERE id=$1',[id]);if(!rows[0])throw new StoreError('Not found',404);const current=rows[0].status;if(status!==current&&!transitions[current]?.includes(status))throw new StoreError('Invalid status transition');const changed=await this.query('UPDATE dedes_orders SET status=$1,driver=$2 WHERE id=$3 AND status=$4 RETURNING id',[status,driver,id,current]);if(!changed.length)throw new StoreError('Order changed; refresh and try again.',409);return {ok:true};}
 async order(b:any){
  const {key,token}=orderSession(b);const tokenHash=hash(token);
  const prior=await this.query('SELECT id,token_hash FROM dedes_orders WHERE idempotency_key=$1',[key]);
  if(prior[0]){if(prior[0].token_hash!==tokenHash)throw new StoreError('Checkout conflict',409);return {id:prior[0].id,accessToken:token};}
  const data=orderData(b,await this.settings());const id='DEDE-'+crypto.randomUUID().slice(0,8).toUpperCase();
  await this.query('INSERT INTO dedes_orders(id,token_hash,idempotency_key,data,created_at) VALUES($1,$2,$3,$4::jsonb,$5) ON CONFLICT(idempotency_key) DO NOTHING',[id,tokenHash,key,JSON.stringify(data),Date.now()]);
  const saved=await this.query('SELECT id,token_hash FROM dedes_orders WHERE idempotency_key=$1',[key]);if(saved[0]?.token_hash!==tokenHash)throw new StoreError('Checkout conflict',409);return {id:saved[0].id,accessToken:token};
 }
}
