/* ═══════════════════════════════════════════════════════════
   CONNEC8 v5 — js/data.js
   Supabase (live) + localStorage (demo) unified layer
   ═══════════════════════════════════════════════════════════ */

import { getClient, IS_DEMO } from './supabase.js';

/* ── localStorage helpers ─────────────────────────────────── */
const LS = {
  get: k  => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } },
  set: (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const K = { proj: 'c8_projects', testi: 'c8_testi', leads: 'c8_leads' };

/* ── Demo seed ────────────────────────────────────────────── */
const SEED_P = [
  { id:1, title:'NovaPay Billing Platform', category:'Billing System', display_type:'website', featured:true,  impact_metric:'8+ hrs/week saved',  year:'2024', sort_order:1, thumbnail_url:'', preview_video_url:'', live_url:'', tags:['Invoicing','Automation'], technologies:['JavaScript','Node.js'], description:'Complete invoicing platform replacing manual WhatsApp billing.', problem:'Manual billing via WhatsApp and spreadsheets — payments were missed.', solution:'Custom billing system with automated invoices, payment tracking, and a client portal.', result:'Zero missed payments. Eight hours saved every week.' },
  { id:2, title:'LogiCore Operations Hub',  category:'Admin Panel',    display_type:'website', featured:true,  impact_metric:'40% faster ops',     year:'2024', sort_order:2, thumbnail_url:'', preview_video_url:'', live_url:'', tags:['Dashboard','Analytics'],  technologies:['HTML','Firebase'],       description:'Centralized ops dashboard replacing 6 spreadsheets.',            problem:'No single source of truth across operations teams.',                   solution:'Role-based admin panel with live data feeds and automated reports.',  result:'Operations 40% faster within the first month.' },
  { id:3, title:'Meridian Brand Website',   category:'Website',        display_type:'website', featured:true,  impact_metric:'3× more enquiries',  year:'2023', sort_order:3, thumbnail_url:'', preview_video_url:'', live_url:'', tags:['Brand','SEO'],            technologies:['HTML','CSS','GSAP'],     description:'Premium brand website for architecture firm.',                    problem:'Zero online presence — clients could not find them.',                  solution:'SEO-ready website with lead capture and project portfolio.',          result:'3× more inbound enquiries in first two weeks.' },
];
const SEED_T = [
  { id:1, name:'Rahul Mehta',    role:'Founder',            company:'NovaPay',  avatar:'RM', metric:'8 hrs saved weekly',   text:"Connec8 replaced our entire manual billing process. What used to take three hours every Friday now runs on its own." },
  { id:2, name:'Sneha Kulkarni', role:'Operations Manager', company:'LogiCore', avatar:'SK', metric:'40% ops improvement',  text:'We were drowning in spreadsheets. Connec8 built us a dashboard that gave our entire team visibility in one place.' },
  { id:3, name:'Arjun Pillai',   role:'Managing Director',  company:'Meridian', avatar:'AP', metric:'3× more leads',         text:'The website they delivered is exactly what we needed — premium, fast, and professional.' },
  { id:4, name:'Priya Sharma',   role:'CEO',                company:'FlowDesk', avatar:'PS', metric:'20 hrs/week automated', text:"The automation system saved us roughly 20 hours per week. It's like having an extra team member who never sleeps." },
];

function seedDemo() {
  if (!LS.get(K.proj))  LS.set(K.proj,  SEED_P);
  if (!LS.get(K.testi)) LS.set(K.testi, SEED_T);
  if (!LS.get(K.leads)) LS.set(K.leads, []);
}

/* ── Projects ─────────────────────────────────────────────── */
export const Projects = {
  async list() {
    if (IS_DEMO) { seedDemo(); return (LS.get(K.proj)||[]).sort((a,b)=>a.sort_order-b.sort_order); }
    const { data, error } = await getClient().from('projects').select('*').order('sort_order');
    if (error) throw error;
    return data;
  },
  async create(p) {
    if (IS_DEMO) {
      const list = LS.get(K.proj)||[]; const e={...p,id:Date.now(),created_at:new Date().toISOString()};
      LS.set(K.proj,[...list,e]); return e;
    }
    const { data,error } = await getClient().from('projects').insert(p).select().single();
    if (error) throw error; return data;
  },
  async update(id,p) {
    if (IS_DEMO) {
      const list=(LS.get(K.proj)||[]).map(x=>x.id===id?{...x,...p}:x);
      LS.set(K.proj,list); return list.find(x=>x.id===id);
    }
    const { data,error } = await getClient().from('projects').update(p).eq('id',id).select().single();
    if (error) throw error; return data;
  },
  async delete(id) {
    if (IS_DEMO) { LS.set(K.proj,(LS.get(K.proj)||[]).filter(x=>x.id!==id)); return; }
    const { error } = await getClient().from('projects').delete().eq('id',id);
    if (error) throw error;
  },
  subscribe(cb) {
    if (IS_DEMO) return ()=>{};
    const ch = getClient().channel('proj').on('postgres_changes',{event:'*',schema:'public',table:'projects'},cb).subscribe();
    return ()=>ch.unsubscribe();
  }
};

/* ── Testimonials ─────────────────────────────────────────── */
export const Testimonials = {
  async list() {
    if (IS_DEMO) { seedDemo(); return LS.get(K.testi)||[]; }
    const { data,error } = await getClient().from('testimonials').select('*').order('sort_order');
    if (error) throw error; return data;
  },
  async create(t) {
    if (IS_DEMO) { const list=LS.get(K.testi)||[]; const e={...t,id:Date.now()}; LS.set(K.testi,[...list,e]); return e; }
    const { data,error } = await getClient().from('testimonials').insert(t).select().single();
    if (error) throw error; return data;
  },
  async update(id,t) {
    if (IS_DEMO) { const list=(LS.get(K.testi)||[]).map(x=>x.id===id?{...x,...t}:x); LS.set(K.testi,list); return list.find(x=>x.id===id); }
    const { data,error } = await getClient().from('testimonials').update(t).eq('id',id).select().single();
    if (error) throw error; return data;
  },
  async delete(id) {
    if (IS_DEMO) { LS.set(K.testi,(LS.get(K.testi)||[]).filter(x=>x.id!==id)); return; }
    const { error } = await getClient().from('testimonials').delete().eq('id',id);
    if (error) throw error;
  }
};

/* ── Leads ────────────────────────────────────────────────── */
export const Leads = {
  async list() {
    if (IS_DEMO) return LS.get(K.leads)||[];
    const { data,error } = await getClient().from('leads').select('*').order('created_at',{ascending:false});
    if (error) throw error; return data;
  },
  async create(l) {
    const e={...l,created_at:new Date().toISOString()};
    if (IS_DEMO) { const list=LS.get(K.leads)||[]; LS.set(K.leads,[...list,e]); return e; }
    const { data,error } = await getClient().from('leads').insert(l).select().single();
    if (error) throw error; return data;
  },
  async clear() {
    if (IS_DEMO) { LS.set(K.leads,[]); return; }
    const { error } = await getClient().from('leads').delete().neq('id',0);
    if (error) throw error;
  }
};

/* ── Storage ──────────────────────────────────────────────── */
export const Storage = {
  async upload(bucket, file, onProgress) {
    if (IS_DEMO) return URL.createObjectURL(file); // blob URL for demo preview
    const ext  = file.name.split('.').pop().toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const sb   = getClient();

    // Supabase JS v2 doesn't support onUploadProgress natively — simulate it
    if (onProgress) { onProgress(10); }
    const { data, error } = await sb.storage.from(bucket).upload(path, file, { upsert: true, cacheControl: '3600' });
    if (onProgress) { onProgress(100); }
    if (error) throw error;

    const { data: pub } = sb.storage.from(bucket).getPublicUrl(data.path);
    return pub.publicUrl;
  }
};
