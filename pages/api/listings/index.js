import { getSupabase } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const limit = parseInt(req.query.limit) || 200
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return res.status(500).json({ error: 'Failed to fetch listings' })
  return res.status(200).json({ listings: data || [] })
}
