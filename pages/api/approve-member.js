export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { memberId, status } = req.body

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmjtcmfjknmdnlgxudfk.supabase.co',
      process.env.SUPABASE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
    )

    // Get member details
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single()

    if (error || !member) return res.status(404).json({ error: 'Member not found' })

    // Update status
    await supabase.from('members').update({ status }).eq('id', memberId)

    // Send email if approving
    if (status === 'active') {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_bmLA4KoW_HFXWiJj5w7yu27hwHkeb5hBd'}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Off Market Property Network <notifications@offmarketpropertynetwork.com.au>',
          to: [member.email],
          reply_to: 'support@offmarketpropertynetwork.com.au',
          subject: "Your Off Market Property Network account is now active",
          headers: {
            'X-Entity-Ref-ID': member.id,
            'List-Unsubscribe': '<mailto:support@offmarketpropertynetwork.com.au>',
          },
          html: `
            <html>
            <body style="margin:0;padding:0;background:#1B2A1B;font-family:Arial,sans-serif;">
              <div style="max-width:600px;margin:0 auto;background:#162016;padding:40px;">
                <h1 style="color:#C9A84C;font-size:24px;margin:0 0 16px;">You're verified, ${member.first_name}!</h1>
                <p style="color:#E8E8E8;line-height:1.7;margin:0 0 24px;">Your real estate license has been verified and your Off Market Property Network account is now active. You now have full access to the platform.</p>
                <div style="background:#1F2E1F;border:1px solid #2D4A2D;padding:20px;margin:0 0 24px;">
                  <table style="width:100%;font-size:13px;">
                    <tr><td style="color:#8BA888;padding:6px 0;">Name</td><td style="color:#C9A84C;text-align:right;">${member.first_name} ${member.last_name}</td></tr>
                    <tr><td style="color:#8BA888;padding:6px 0;">Username</td><td style="color:#C9A84C;text-align:right;">@${member.username}</td></tr>
                    <tr><td style="color:#8BA888;padding:6px 0;">Plan</td><td style="color:#C9A84C;text-align:right;">${member.plan} — 3 months free</td></tr>
                  </table>
                </div>
                <a href="https://offmarketpropertynetwork.com.au/login" style="display:inline-block;background:#C9A84C;color:#000;font-size:14px;font-weight:600;padding:14px 32px;text-decoration:none;">Sign in to your account →</a>
                <p style="color:#8BA888;font-size:11px;margin:24px 0 0;">Off Market Property Network · Australia-wide · Verified professionals only</p>
              </div>
            </body>
            </html>
          `
        })
      })
      const emailData = await emailRes.json()
      console.log('Approval email result:', emailData)
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
