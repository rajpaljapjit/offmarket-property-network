import { getSupabase } from '../../lib/supabase-server'

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'GET') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    const { data, error } = await supabase.from('members').select('*').eq('id', id).single()
    if (error || !data) return res.status(404).json({ error: 'Member not found' })
    return res.status(200).json({
      member: {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        username: data.username,
        agency: data.agency,
        role: data.role,
        state: data.state,
        plan: data.plan,
        status: data.status,
        mobile: data.mobile,
      },
    })
  }

  if (req.method === 'PUT') {
    const { id, firstName, lastName, email, mobile, agency, role, state } = req.body
    if (!id) return res.status(400).json({ error: 'id required' })
    const { error } = await supabase.from('members').update({
      first_name: firstName,
      last_name: lastName,
      email,
      mobile,
      agency,
      role,
      state,
    }).eq('id', id)
    if (error) return res.status(500).json({ error: 'Update failed' })
    return res.status(200).json({ success: true })
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body
    if (!id || !status) return res.status(400).json({ error: 'id and status required' })
    const { error } = await supabase.from('members').update({ status }).eq('id', id)
    if (error) return res.status(500).json({ error: 'Update failed' })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
