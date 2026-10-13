import type { Metadata } from 'next';
import './globals.css';

const origin=process.env.NEXT_PUBLIC_SITE_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?'https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL:'http://localhost:3000');
export const metadata:Metadata={title:'DEDE’S — Cajun Chicken & Burgers · Punta Cana',description:'Sabor atrevido. Fresco cada día. Pollo Cajun y burgers llegan a Punta Cana. Descubre nuestro menú de lanzamiento.',metadataBase:new URL(origin),openGraph:{title:'DEDE’S · Big flavor. Island soul.',description:'Cajun Chicken & Burgers. Coming soon to Punta Cana.',images:['/images/hero-branded.webp']},icons:{icon:'/images/dede-icon-red.webp'},referrer:'no-referrer'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}

