export default async function handler(req, res) {
  const { token } = req.query
  if (!token) return res.status(400).json({ error: 'Token required.' })

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmjtcmfjknmdnlgxudfk.supabase.co',
      process.env.SUPABASE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
    )

    const { data: member, error } = await supabase
      .from('members')
      .select('id, reset_token_expires')
      .eq('reset_token', token)
      .single()

    if (error || !member) return res.status(400).json({ error: 'Invalid token.' })
    if (new Date(member.reset_token_expires) < new Date()) return res.status(400).json({ error: 'Token expired.' })

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
