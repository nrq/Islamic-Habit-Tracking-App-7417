import { createClient } from '@supabase/supabase-js'

// Project ID will be auto-injected during deployment
const SUPABASE_URL = 'https://svinuzgenzpxgsyyolqx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aW51emdlbnpweGdzeXlvbHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzA5NzcsImV4cCI6MjA2NzMwNjk3N30.Alhi3oeQ4IY_YPXaL1kjdIB4aGs_td5ZjveP0kTIDTA'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})