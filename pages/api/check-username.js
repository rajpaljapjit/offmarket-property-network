import { getSupabase } from '../../lib/supabase-server'
import { sanitise } from './sanitise'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const username = sanitise(req.query.username || '')
  if (!username || username.length < 3) {
    return res.status(400).json({ available: false })
  }

  const supabase = getSupabase()
  const { data } = await supabase
    .from('members')
    .select('id')
    .eq('username', username.toLowerCase())
    .single()

  return res.status(200).json({ available: !data })
}
