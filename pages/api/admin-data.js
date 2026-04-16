import { getSupabase } from '../../lib/supabase-server'

export default async function handler(req, res) {
  const adminKey = req.headers['x-admin-key']
  if (!adminKey || adminKey.trim() !== (process.env.ADMIN_SECRET_KEY || '').trim()) {
    return res.status(401).json({ error: 'Unauthorised' })
  }

  const supabase = getSupabase()
  const adminUsername = (process.env.ADMIN_USERNAME || 'omhadminlogin').trim()

  if (req.method === 'GET') {
    try {
      const [mRes, lRes] = await Promise.all([
        supabase.from('members').select('*').neq('username', adminUsername),
        supabase.from('listings').select('*'),
      ])
      if (mRes.error) return res.status(500).json({ error: 'Members query failed', detail: mRes.error.message })
      if (lRes.error) return res.status(500).json({ error: 'Listings query failed', detail: lRes.error.message })
      return res.status(200).json({ members: mRes.data || [], listings: lRes.data || [] })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch data', detail: err.message })
    }
  }

  if (req.method === 'DELETE') {
    const { memberId } = req.body
    if (!memberId) return res.status(400).json({ error: 'memberId required' })
    const { error } = await supabase.from('members').delete().eq('id', memberId)
    if (error) return res.status(500).json({ error: 'Delete failed' })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
