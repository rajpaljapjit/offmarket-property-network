import { getSupabase } from '../../lib/supabase-server'

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'GET') {
    const { memberId } = req.query
    if (!memberId) return res.status(400).json({ error: 'memberId required' })
    const { data } = await supabase.from('saved_listings').select('listing_id').eq('member_id', memberId)
    return res.status(200).json({ saved: (data || []).map(s => s.listing_id) })
  }

  if (req.method === 'POST') {
    const { memberId, listingId } = req.body
    if (!memberId || !listingId) return res.status(400).json({ error: 'Missing fields' })
    await supabase.from('saved_listings').insert([{ member_id: memberId, listing_id: listingId }])
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    const { memberId, listingId } = req.body
    if (!memberId || !listingId) return res.status(400).json({ error: 'Missing fields' })
    await supabase.from('saved_listings').delete().eq('member_id', memberId).eq('listing_id', listingId)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
