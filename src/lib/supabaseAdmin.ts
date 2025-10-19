import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  // Lazy init u runtime-u (ne na top-level-u)
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Supabase admin env missing: check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  }
  _admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _admin;
}
