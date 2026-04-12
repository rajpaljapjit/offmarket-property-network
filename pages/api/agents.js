import { getSupabase } from '../../lib/supabase-server'

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'GET') {
    const { memberId } = req.query
    const [agentsRes, favsRes] = await Promise.all([
      supabase.from('members').select('id,first_name,last_name,agency,role,state,plan,username').eq('status', 'active').neq('username', 'ompnadminlogin'),
      memberId
        ? supabase.from('favourite_agents').select('agent_id').eq('member_id', memberId)
        : Promise.resolve({ data: [] }),
    ])
    return res.status(200).json({
      agents: agentsRes.data || [],
      favourites: (favsRes.data || []).map(f => f.agent_id),
    })
  }

  if (req.method === 'POST') {
    // Add favourite
    const { memberId, agent } = req.body
    if (!memberId || !agent) return res.status(400).json({ error: 'Missing fields' })
    await supabase.from('favourite_agents').insert([{
      member_id: memberId,
      agent_id: agent.id,
      agent_name: `${agent.first_name} ${agent.last_name}`,
      agent_username: agent.username,
      agent_agency: agent.agency,
      agent_role: agent.role,
      agent_state: agent.state,
    }])
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    // Remove favourite
    const { memberId, agentId } = req.body
    if (!memberId || !agentId) return res.status(400).json({ error: 'Missing fields' })
    await supabase.from('favourite_agents').delete().eq('member_id', memberId).eq('agent_id', agentId)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
