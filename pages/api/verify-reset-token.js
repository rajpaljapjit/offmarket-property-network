export default async function handler(req, res) {
  const { token } = req.query
  if (!token) return res.status(400).json({ error: 'Token required.' })

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY
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
    return res.status(500).json({ error: err.message })
  }
}
