import bcrypt from 'bcryptjs'
import { rateLimit, clearLimit, getIp } from '../../lib/rate-limit'
import { getSupabase } from '../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getIp(req)
  if (rateLimit(`login:${ip}`, 5)) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again in 15 minutes.' })
  }

  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Please enter your username and password.' })
  }

  try {
    const supabase = getSupabase()
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !member) {
      return res.status(401).json({ error: 'Invalid username or password.' })
    }

    const passwordMatch = await bcrypt.compare(password, member.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' })
    }

    clearLimit(`login:${ip}`)
    return res.status(200).json({
      success: true,
      member: {
        id: member.id,
        firstName: member.first_name,
        lastName: member.last_name,
        email: member.email,
        username: member.username,
        agency: member.agency,
        role: member.role,
        state: member.state,
        plan: member.plan,
        status: member.status,
      },
    })
  } catch {
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
