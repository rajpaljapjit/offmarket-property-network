import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { token, password } = req.body
  if (!token || !password) return res.status(400).json({ error: 'Token and password required.' })
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' })

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
    if (new Date(member.reset_token_expires) < new Date()) return res.status(400).json({ error: 'Token expired. Please request a new reset link.' })

    const hashedPassword = await bcrypt.hash(password, 10)
    await supabase.from('members').update({
      password: hashedPassword,
      reset_token: null,
      reset_token_expires: null
    }).eq('id', member.id)

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
