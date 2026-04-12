import { createClient } from '@supabase/supabase-js'

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmjtcmfjknmdnlgxudfk.supabase.co'
  const key = process.env.SUPABASE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
  return createClient(url, key)
}
