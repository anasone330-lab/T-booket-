import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nrpamaoxentrzmzwipbs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tcB2Nnr1gK7BAKYNUndsAg_XP1_3T4t';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
  },
});
