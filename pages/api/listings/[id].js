import { getSupabase } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const { id, withMember } = req.query
  const supabase = getSupabase()

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !listing) return res.status(404).json({ error: 'Listing not found' })

  if (withMember === '1') {
    const { data: member } = await supabase
      .from('members')
      .select('email, mobile')
      .eq('id', listing.member_id)
      .single()
    return res.status(200).json({ listing, member: member || null })
  }

  return res.status(200).json({ listing })
}
