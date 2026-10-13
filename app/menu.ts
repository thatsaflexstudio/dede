export type Lang = 'es' | 'en';
export type Product = { id: string; name: string; es: string; en: string; category: string; price: number; photo: number; badge?: string; available: boolean; ingredients?: string; allergens?: string; image?: string; mealBase?: string };
export const menu: Product[] = [
 {id:'crunch',name:'Bayou Crunch Box',es:'3 piezas de pollo crujiente, papas Cajun y salsa de la casa.',en:'3 pieces of crispy chicken, Cajun fries & house dip.',category:'chicken',price:32500,photo:0,badge:'signature',available:true},
 {id:'classic',name:'The Cajun Classic',es:'Carne a la plancha, cheddar, pepinillos y nuestra salsa Cajun.',en:'Smashed beef, cheddar, pickles & our signature Cajun sauce.',category:'burgers',price:27500,photo:1,badge:'favorite',available:true},
 {id:'wings',name:'Voodoo Wings',es:'8 alitas con tu salsa favorita. Prepárate para el sabor.',en:'8 wings tossed in your favorite sauce. Bring on the flavor.',category:'wings',price:39500,photo:2,available:true},
 {id:'tenders',name:'DEDE’S Tender Box',es:'4 tenders, papas, ensalada y una salsa para disfrutar.',en:'4 tenders, fries, slaw & a dip made for dunking.',category:'chicken',price:35000,photo:6,available:true},
 {id:'double',name:'Bayou Double Smash',es:'Doble carne, doble cheddar, cebollas y salsa de la casa.',en:'Double beef, double cheddar, onions & house sauce.',category:'burgers',price:37500,photo:1,available:true},
 {id:'honey',name:'Hot Honey Chicken Burger',es:'Pollo crujiente, miel picante, pepinillos y ensalada.',en:'Crispy chicken, hot honey, pickles & creamy slaw.',category:'burgers',price:32500,photo:7,available:true},
 {id:'family',name:'Sunset Family Feast',es:'8 piezas de pollo, papas grandes, ensalada grande y 4 salsas.',en:'8 chicken pieces, large fries, large slaw & 4 dips.',category:'family',price:99500,photo:0,badge:'share',available:true},
 {id:'fries',name:'Cajun Fries',es:'Doraditas, crujientes y con nuestro toque Cajun.',en:'Golden, crispy & dusted with our Cajun seasoning.',category:'sides',price:9500,photo:3,available:true},
 {id:'mac',name:'Mac & Cheese',es:'Macarrones cremosos con mucho queso.',en:'Rich, creamy macaroni with plenty of cheese.',category:'sides',price:12500,photo:8,available:true},
 {id:'rice',name:'Cajun Dirty Rice',es:'Arroz sazonado con vegetales y especias.',en:'Savory rice with vegetables & Cajun spices.',category:'sides',price:11000,photo:9,available:true},
 {id:'slaw',name:'House Slaw',es:'Repollo y zanahoria con aderezo cremoso.',en:'Crisp cabbage & carrots in a creamy dressing.',category:'sides',price:8500,photo:10,available:true},
 {id:'beignets',name:'Cinnamon Beignet Bites',es:'Bocaditos calientes con canela y azúcar.',en:'Warm, pillowy bites with cinnamon sugar.',category:'desserts',price:15000,photo:5,available:true},
 {id:'lemonade',name:'Passion Fruit Lemonade',es:'Maracuyá, limón y un sorbo de paraíso.',en:'Passion fruit, fresh lemon & a sip of paradise.',category:'drinks',price:10000,photo:4,available:true},
 {id:'soda',name:'Refrescos · Bottled Sodas',es:'Coca-Cola, Coca-Cola Zero, Sprite o Fanta. Botella plástica de 500 ml.',en:'Coca-Cola, Coca-Cola Zero, Sprite or Fanta. 500 ml plastic bottle.',category:'drinks',price:6500,photo:11,available:true},
 {id:'water',name:'Agua · Bottled Water',es:'Agua embotellada fría.',en:'Chilled bottled water.',category:'drinks',price:5000,photo:-1,available:true},
 {id:'classic-meal',name:'Cajun Classic Combo',es:'Tu Classic, papas Cajun regulares y una botella de refresco de 500 ml.',en:'Your Classic, regular Cajun fries & a 500 ml bottled soda.',category:'combos',price:38500,photo:1,mealBase:'classic',badge:'meal',available:true},
 {id:'crunch-meal',name:'Bayou Crunch Combo',es:'3 piezas de pollo, papas regulares, salsa y refresco de 500 ml.',en:'3 chicken pieces, regular fries, a dip & a 500 ml bottled soda.',category:'combos',price:37500,photo:0,mealBase:'crunch',badge:'meal',available:true},
 {id:'tenders-meal',name:'Tender Lovers Combo',es:'4 tenders, papas regulares, ensalada, salsa y refresco de 500 ml.',en:'4 tenders, regular fries, slaw, a dip & a 500 ml bottled soda.',category:'combos',price:40000,photo:6,mealBase:'tenders',badge:'meal',available:true},
];
export const categories = [ ['all','Todo el menú','Full menu'],['combos','Combos','Combos'],['chicken','Pollo Cajun','Cajun chicken'],['burgers','Burgers','Burgers'],['wings','Alitas','Wings'],['family','Para compartir','To share'],['sides','Acompañantes','Sides'],['drinks','Bebidas','Drinks'],['desserts','Algo dulce','Something sweet'] ];
export const money=(n:number)=>'RD$'+new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n/100);
export type Options={heat?:string;dip?:string;flavor?:string;cheese?:boolean;patty?:boolean;combo?:boolean;extraDip?:boolean;friesSize?:string;drink?:string};
export type Line={key:string;productId:string;quantity:number;options:Options};
export const defaultSettings={mode:'coming-soon',deliveryFee:7500,minimum:25000,eta:'35–50',zones:['Bávaro','El Cortecito','Los Corales','Punta Cana Village'],address:'',phone:'',instagram:'',openingDate:'',openTime:'11:00',closeTime:'22:00',taxPercent:0,taxConfirmed:false,payOnDelivery:true,products:menu};
export type Settings=typeof defaultSettings;
export const drinks=[{id:'coke',name:'Coca-Cola',position:'0% 0%'},{id:'zero',name:'Coca-Cola Zero',position:'100% 0%'},{id:'sprite',name:'Sprite',position:'0% 100%'},{id:'fanta',name:'Fanta Orange',position:'100% 100%'}];
export const baseId=(p:Product)=>p.mealBase||p.id;
export const isBurger=(p:Product)=>['classic','double','honey'].includes(baseId(p));
export const hasHeat=(p:Product)=>['crunch','tenders','wings','family','honey'].includes(baseId(p));
export const hasDip=(p:Product)=>['crunch','tenders','family'].includes(baseId(p));
export const isBeef=(p:Product)=>['classic','double'].includes(baseId(p));
export const canCombo=(p:Product)=>!p.mealBase&&(isBurger(p)||['crunch','tenders','wings'].includes(p.id));
export const comboFee=(p:Product)=>['crunch','tenders'].includes(baseId(p))?5000:11000;
export const isMeal=(p:Product,o:Options)=>!!p.mealBase||!!o.combo;
export const hasFries=(p:Product,o:Options)=>isMeal(p,o)||['crunch','tenders','fries'].includes(p.id);
export const needsDrink=(p:Product,o:Options)=>p.id==='soda'||isMeal(p,o);
export function normalizeOptions(p:Product,o:Options={}):Options {return {...o,...(hasFries(p,o)&&o.friesSize===undefined?{friesSize:'regular'}:{}),...(needsDrink(p,o)&&o.drink===undefined?{drink:'coke'}:{})};}
export function optionText(o:Options,lang:Lang){return [o.combo&&(lang==='es'?'Combo':'Meal'),o.friesSize&&(lang==='es'?(o.friesSize==='large'?'Papas grandes':'Papas regulares'):(o.friesSize==='large'?'Large fries':'Regular fries')),o.drink&&drinks.find(d=>d.id===o.drink)?.name+' · 500 ml',o.heat,o.dip,o.flavor,o.cheese&&(lang==='es'?'Queso extra':'Extra cheese'),o.patty&&(lang==='es'?'Carne extra':'Extra patty'),o.extraDip&&(lang==='es'?'Salsa Cajun extra':'Extra Cajun dip')].filter(Boolean).join(' · ');}
export function unitPrice(p:Product,o:Options){return p.price+(o.extraDip?2500:0)+(o.cheese?3000:0)+(o.patty?8000:0)+(o.combo&&!p.mealBase?comboFee(p):0)+(o.friesSize==='large'?3500:0);}
export function validateOptions(p:Product,o:Options){
 const allowed=['heat','dip','flavor','cheese','patty','combo','extraDip','friesSize','drink'];
 if(Object.keys(o).some(k=>!allowed.includes(k)))throw Error('Invalid options');
 for(const k of ['cheese','patty','combo','extraDip'] as const)if(o[k]!==undefined&&typeof o[k]!=='boolean')throw Error('Invalid option');
 for(const k of ['heat','dip','flavor','friesSize','drink'] as const)if(o[k]!==undefined&&(typeof o[k]!=='string'||!o[k]))throw Error('Invalid option');
 if(o.heat&&(!hasHeat(p)||!['Original','Cajun Kick','Fire'].includes(o.heat)))throw Error('Invalid heat');
 if(o.dip&&(!hasDip(p)||!['Cajun','Ranch','Buffalo','Honey mustard'].includes(o.dip)))throw Error('Invalid dip');
 if(o.flavor&&(p.id!=='wings'||!['Cajun dry rub','Buffalo','Honey heat'].includes(o.flavor)))throw Error('Invalid flavor');
 if(o.patty&&!isBeef(p))throw Error('Invalid patty');
 if(o.cheese&&!isBurger(p))throw Error('Invalid cheese option');
 if(o.combo&&!canCombo(p))throw Error('Invalid combo option');
 if(o.extraDip&&!hasHeat(p))throw Error('Invalid dip option');
 if(o.friesSize&&(!hasFries(p,o)||!['regular','large'].includes(o.friesSize)))throw Error('Invalid fries size');
 if(o.drink&&(!needsDrink(p,o)||!drinks.some(d=>d.id===o.drink)))throw Error('Invalid drink');
}
export function quote(lines:Line[],products:Product[],delivery:number){
 if(!Array.isArray(lines)||!lines.length||lines.length>40)throw Error('Invalid cart');
 const items=lines.map(l=>{const p=products.find(p=>p.id===l.productId);if(!p||!p.available||(p.mealBase&&!products.find(b=>b.id===p.mealBase)?.available))throw Error('Item unavailable');if(!Number.isInteger(l.quantity)||l.quantity<1||l.quantity>20)throw Error('Invalid quantity');if(!l.options||typeof l.options!=='object'||Array.isArray(l.options))throw Error('Invalid options');const options=normalizeOptions(p,l.options);validateOptions(p,options);return {...l,options,name:p.name,price:unitPrice(p,options)};});
 const subtotal=items.reduce((s,l)=>s+l.price*l.quantity,0);return {items,subtotal,delivery,total:subtotal+delivery};
}

