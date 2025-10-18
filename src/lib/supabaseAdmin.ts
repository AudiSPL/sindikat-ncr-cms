import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

// (DEV log – bez odavanja ključa)
if (process.env.NODE_ENV !== 'production') {
  console.log('[ADMIN] Supabase URL:', url);
  console.log('[ADMIN] Service key present:', !!serviceKey, 'len:', serviceKey?.length || 0);
}
