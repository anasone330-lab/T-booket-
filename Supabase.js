import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://nrpanaoxenzmzipbs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycHNhb29hb210cnptendvcGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjUyNTAsImV4cCI6MjEwMzYwMTI1MH0.2c6Vf8vHOKEBCCxFN5lIehpfKT7vZmWQzR4ZDMO7qfI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
