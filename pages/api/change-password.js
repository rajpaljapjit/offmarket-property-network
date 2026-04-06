export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { memberId, currentPassword, newPassword } = req.body

  if (!memberId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmjtcmfjknmdnlgxudfk.supabase.co',
      process.env.SUPABASE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
    )

    // Verify current password
    const { data: member, error } = await supabase
      .from('members')
      .select('id, password')
      .eq('id', memberId)
      .eq('password', currentPassword)
      .single()

    if (error || !member) {
      return res.status(401).json({ error: 'Current password is incorrect.' })
    }

    // Update password
    const { error: updateError } = await supabase
      .from('members')
      .update({ password: newPassword })
      .eq('id', memberId)

    if (updateError) {
      return res.status(500).json({ error: updateError.message })
    }

    return res.status(200).json({ success: true })

  } catch (err) {
    return res.status(500).json({ error: `Unexpected error: ${err.message}` })
  }
}
