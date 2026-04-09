import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required.' })

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY
    )

    // Check if member exists
    const { data: member, error } = await supabase
      .from('members')
      .select('id, email, first_name')
      .eq('email', email)
      .single()

    if (error || !member) {
      // Don't reveal if email exists or not
      return res.status(200).json({ success: true })
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000).toISOString() // 1 hour

    // Save token to database
    await supabase.from('members').update({
      reset_token: token,
      reset_token_expires: expires
    }).eq('id', member.id)

    // Send reset email
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY || process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Off Market Property Network <noreply@offmarketpropertynetwork.com.au>',
        to: email,
        subject: 'Reset your Off Market Property Network password',
        html: `
          <html>
          <body style="margin:0;padding:0;background:#0A0F1E;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:0 auto;background:#0F1628;">
              <div style="padding:32px 40px;border-bottom:1px solid #1E2A45;">
                <img src="https://offmarketpropertynetwork.com.au/Offmarketproplogo4.png" alt="Off Market Property Network" style="height:40px;"/>
              </div>
              <div style="padding:40px;">
                <h1 style="font-size:24px;color:#F5F3EE;margin:0 0 16px;font-weight:600;">Reset your password</h1>
                <p style="font-size:15px;color:#A8B4CC;line-height:1.7;margin:0 0 24px;">Hi ${member.first_name}, we received a request to reset your password. Click the button below to choose a new password.</p>
                <div style="text-align:center;margin:0 0 32px;">
                  <a href="https://offmarketpropertynetwork.com.au/reset-password?token=${token}" style="display:inline-block;background:#C9A84C;color:#000;font-size:14px;font-weight:600;padding:14px 32px;text-decoration:none;">Reset password →</a>
                </div>
                <p style="font-size:13px;color:#6B7A99;line-height:1.7;margin:0;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
              </div>
              <div style="padding:24px 40px;border-top:1px solid #1E2A45;">
                <p style="font-size:11px;color:#6B7A99;margin:0;text-align:center;">Off Market Property Network · Australia-wide · Verified professionals only</p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    })

    return res.status(200).json({ success: true })

  } catch (err) {
    return res.status(500).json({ error: `Unexpected error: ${err.message}` })
  }
}
