import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zmioifpenpsjttovlfyw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptaW9pZnBlbnBzanR0b3ZsZnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjYzMTAsImV4cCI6MjA1MjU0MjMxMH0.sneJJWP8b3ZDxOpLLYKI68J4AQovsA2eqi2b69MqPMc";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
  }
);