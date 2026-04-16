import crypto from 'crypto'
import { rateLimit, getIp } from '../../lib/rate-limit'
import { getSupabase } from '../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limit: max 3 requests per IP per 15 minutes
  const ip = getIp(req)
  if (rateLimit(`forgot:${ip}`, 3)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required.' })

  try {
    const supabase = getSupabase()

    const { data: member, error } = await supabase
      .from('members')
      .select('id, email, first_name, reset_token_expires')
      .eq('email', email)
      .single()

    // Always return 200 to avoid revealing whether email exists
    if (error || !member) {
      return res.status(200).json({ success: true })
    }

    // DB-level throttle: don't send another email if a token was issued less than 5 minutes ago
    if (member.reset_token_expires) {
      const expiresAt = new Date(member.reset_token_expires)
      const fiveMinutesFromNow = new Date(Date.now() + 55 * 60 * 1000) // token lasts 1hr, throttle after <5min
      if (expiresAt > fiveMinutesFromNow) {
        return res.status(200).json({ success: true }) // silently ignore
      }
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000).toISOString() // 1 hour

    await supabase.from('members').update({
      reset_token: token,
      reset_token_expires: expires,
    }).eq('id', member.id)

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) { console.error('RESEND_API_KEY not set'); }

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Off Market Hub <noreply@offmarkethub.com.au>',
        to: email,
        subject: 'Reset your Off Market Hub password',
        html: `
          <html><body style="margin:0;padding:0;background:#0A0F1E;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:0 auto;background:#0F1628;">
              <div style="padding:32px 40px;border-bottom:1px solid #1E2A45;">
                <img src="https://offmarkethub.com.au/gooffmarketlogo.png" alt="Off Market Hub" style="height:40px;"/>
              </div>
              <div style="padding:40px;">
                <h1 style="font-size:24px;color:#F5F3EE;margin:0 0 16px;font-weight:600;">Reset your password</h1>
                <p style="font-size:15px;color:#A8B4CC;line-height:1.7;margin:0 0 24px;">Hi ${member.first_name}, we received a request to reset your password. Click the button below to choose a new password.</p>
                <div style="text-align:center;margin:0 0 32px;">
                  <a href="https://offmarkethub.com.au/reset-password?token=${token}" style="display:inline-block;background:#C9A84C;color:#000;font-size:14px;font-weight:600;padding:14px 32px;text-decoration:none;">Reset password →</a>
                </div>
                <p style="font-size:13px;color:#6B7A99;line-height:1.7;margin:0;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
              </div>
              <div style="padding:24px 40px;border-top:1px solid #1E2A45;">
                <p style="font-size:11px;color:#6B7A99;margin:0;text-align:center;">Off Market Hub · Australia-wide · Verified professionals only</p>
              </div>
            </div>
          </body></html>
        `
      })
    })

    return res.status(200).json({ success: true })

  } catch {
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
