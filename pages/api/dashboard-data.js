import { getSupabase } from '../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const { memberId } = req.query
  if (!memberId) return res.status(400).json({ error: 'memberId required' })

  const supabase = getSupabase()
  const [l, sv, es, er] = await Promise.all([
    supabase.from('listings').select('*').eq('member_id', memberId).order('created_at', { ascending: false }),
    supabase.from('saved_listings').select('*, listings(*)').eq('member_id', memberId),
    supabase.from('enquiries').select('*').eq('enquirer_id', memberId).order('created_at', { ascending: false }),
    supabase.from('enquiries').select('*').eq('listing_member_id', memberId).order('created_at', { ascending: false }),
  ])

  return res.status(200).json({
    listings: l.data || [],
    saved: sv.data || [],
    enquiriesSent: es.data || [],
    enquiriesReceived: er.data || [],
  })
}
