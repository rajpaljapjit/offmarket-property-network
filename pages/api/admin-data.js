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
      const [{ data: members }, { data: listings }] = await Promise.all([
        supabase.from('members').select('*').neq('username', adminUsername),
        supabase.from('listings').select('*'),
      ])
      return res.status(200).json({ members: members || [], listings: listings || [] })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to fetch data' })
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
