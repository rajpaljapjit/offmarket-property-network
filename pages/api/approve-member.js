import { getSupabase } from '../../lib/supabase-server'

const ALLOWED_STATUSES = ['active', 'pending', 'suspended', 'rejected']

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const adminKey = req.headers['x-admin-key']
  const expectedKey = process.env.ADMIN_SECRET_KEY
  if (!expectedKey) return res.status(500).json({ error: 'Server misconfiguration' })
  if (!adminKey || adminKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorised' })
  }

  const { memberId, status } = req.body
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' })
  }

  try {
    const supabase = getSupabase()

    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single()

    if (error || !member) return res.status(404).json({ error: 'Member not found' })

    await supabase.from('members').update({ status }).eq('id', memberId)

    if (status === 'active') {
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Off Market Hub <notifications@offmarkethub.com.au>',
              to: [member.email],
              reply_to: 'support@offmarkethub.com.au',
              subject: 'Your Off Market Hub account is now active',
              html: `
                <html><body style="margin:0;padding:0;background:#1B2A1B;font-family:Arial,sans-serif;">
                  <div style="max-width:600px;margin:0 auto;background:#162016;padding:40px;">
                    <h1 style="color:#C9A84C;font-size:24px;margin:0 0 16px;">You're verified, ${member.first_name}!</h1>
                    <p style="color:#E8E8E8;line-height:1.7;margin:0 0 24px;">Your real estate license has been verified and your Off Market Hub account is now active.</p>
                    <div style="background:#1F2E1F;border:1px solid #2D4A2D;padding:20px;margin:0 0 24px;">
                      <table style="width:100%;font-size:13px;">
                        <tr><td style="color:#8BA888;padding:6px 0;">Name</td><td style="color:#C9A84C;text-align:right;">${member.first_name} ${member.last_name}</td></tr>
                        <tr><td style="color:#8BA888;padding:6px 0;">Username</td><td style="color:#C9A84C;text-align:right;">@${member.username}</td></tr>
                        <tr><td style="color:#8BA888;padding:6px 0;">Plan</td><td style="color:#C9A84C;text-align:right;">${member.plan} — 3 months free</td></tr>
                      </table>
                    </div>
                    <a href="https://offmarkethub.com.au/login" style="display:inline-block;background:#C9A84C;color:#000;font-size:14px;font-weight:600;padding:14px 32px;text-decoration:none;">Sign in to your account →</a>
                  </div>
                </body></html>
              `
            })
          })
        } catch (emailError) {
          console.error('Approval email error:', emailError)
        }
      }
    }

    return res.status(200).json({ success: true })
  } catch {
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
