export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmjtcmfjknmdnlgxudfk.supabase.co'
  const key = process.env.SUPABASE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Please enter your username and password.' })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, key)

    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()

    if (error || !member) {
      return res.status(401).json({ error: 'Invalid username or password.' })
    }

    return res.status(200).json({ success: true, member: {
      id: member.id,
      firstName: member.first_name,
      lastName: member.last_name,
      email: member.email,
      username: member.username,
      agency: member.agency,
      role: member.role,
      state: member.state,
      plan: member.plan,
      status: member.status,
    }})

  } catch (err) {
    return res.status(500).json({ error: `Unexpected error: ${err.message}` })
  }
}
