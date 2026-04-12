import bcrypt from 'bcryptjs'
import { rateLimit, getIp } from '../../lib/rate-limit'
import { getSupabase } from '../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limit: max 5 attempts per IP per 15 minutes
  const ip = getIp(req)
  if (rateLimit(`changepw:${ip}`, 5)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const { memberId, currentPassword, newPassword } = req.body

  if (!memberId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' })
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ error: 'New password must be different from your current password.' })
  }

  try {
    const supabase = getSupabase()

    const { data: member, error } = await supabase
      .from('members')
      .select('id, password')
      .eq('id', memberId)
      .single()

    if (error || !member) {
      return res.status(401).json({ error: 'Current password is incorrect.' })
    }

    const passwordMatch = await bcrypt.compare(currentPassword, member.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const { error: updateError } = await supabase
      .from('members')
      .update({ password: hashedPassword })
      .eq('id', member.id)

    if (updateError) {
      return res.status(500).json({ error: 'An unexpected error occurred.' })
    }

    return res.status(200).json({ success: true })

  } catch {
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
