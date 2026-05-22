/* ═══════════════════════════════════════════════════════════
   CONNEC8 v5 — js/supabase.js
   Edit SUPABASE_URL and SUPABASE_ANON before going live
   ═══════════════════════════════════════════════════════════ */

export const SUPABASE_URL  = 'https://qsxpdfvukfttmeztjstk.supabase.co'; // ← replace
export const SUPABASE_ANON = 'sb_publishable_odBz2EmEe9sMubRXFKMM-A_wRENRxHc';                    // ← replace

export const IS_DEMO = SUPABASE_URL.includes('YOUR_PROJECT') || SUPABASE_ANON === 'YOUR_ANON_KEY';

let _client = null;

export function getClient() {
  if (_client) return _client;
  if (IS_DEMO) return null;
  // Works both with CDN (window.supabase) and npm import
  const factory = typeof window !== 'undefined' && window.supabase
    ? window.supabase.createClient
    : null;
  if (!factory) { console.warn('Supabase SDK not loaded'); return null; }
  _client = factory(SUPABASE_URL, SUPABASE_ANON);
  return _client;
}

export async function signIn(email, password) {
  const sb = getClient();
  if (!sb) throw new Error('Supabase not configured.');
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const sb = getClient();
  if (sb) await sb.auth.signOut();
}

export async function getSession() {
  const sb = getClient();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session;
}
