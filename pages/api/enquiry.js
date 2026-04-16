import { rateLimit, getIp } from '../../lib/rate-limit'
import { getSupabase } from '../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limit: max 10 enquiries per IP per 15 minutes
  const ip = getIp(req)
  if (rateLimit(`enquiry:${ip}`, 10)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const { listingId, listingTitle, listingMemberId, listingMemberEmail, enquirerId, enquirerName, enquirerAgency, enquirerUsername, enquirerEmail, enquirerMobile } = req.body

  if (!listingId || !enquirerId) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  try {
    const supabase = getSupabase()

    // Verify the enquirer is a real, active member — prevents anonymous/spoofed enquiries
    const { data: enquirer, error: enquirerError } = await supabase
      .from('members')
      .select('id, status')
      .eq('id', enquirerId)
      .single()

    if (enquirerError || !enquirer || enquirer.status !== 'active') {
      return res.status(401).json({ error: 'You must be a verified member to enquire.' })
    }

    const { error: dbError } = await supabase.from('enquiries').insert([{
      listing_id: listingId,
      listing_title: listingTitle,
      listing_member_id: listingMemberId,
      enquirer_id: enquirerId,
      enquirer_name: enquirerName,
      enquirer_agency: enquirerAgency,
      enquirer_username: enquirerUsername,
      status: 'pending',
      created_at: new Date().toISOString(),
    }])

    if (dbError) {
      return res.status(500).json({ error: 'Failed to save data.' })
    }

    if (listingMemberEmail) {
      try {
        const resendKey = process.env.RESEND_API_KEY || 're_bmLA4KoW_HFXWiJj5w7yu27hwHkeb5hBd'
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Off Market Hub <notifications@offmarkethub.com.au>',
            to: listingMemberEmail,
            subject: `New enquiry on your listing: ${listingTitle}`,
            html: `
              <!DOCTYPE html>
              <html>
              <body style="margin:0;padding:0;background:#0A0F1E;font-family:Arial,sans-serif;">
                <div style="max-width:600px;margin:0 auto;background:#0F1628;">
                  <div style="padding:32px 40px;border-bottom:1px solid #1E2A45;">
                    <img src="https://offmarkethub.com.au/gooffmarketlogo.png" alt="Off Market Hub" style="height:40px;"/>
                  </div>
                  <div style="padding:40px;">
                    <h1 style="font-size:24px;color:#F5F3EE;margin:0 0 8px;font-weight:600;">New enquiry received</h1>
                    <p style="font-size:11px;color:#C9A84C;margin:0 0 24px;text-transform:uppercase;letter-spacing:0.1em;">Someone is interested in your listing</p>
                    <div style="background:#151D35;border:1px solid #1E2A45;padding:24px;margin:0 0 24px;">
                      <div style="font-size:10px;letter-spacing:0.3em;color:#C9A84C;text-transform:uppercase;margin-bottom:12px;">Listing</div>
                      <div style="font-size:16px;color:#F5F3EE;font-weight:600;">${listingTitle}</div>
                    </div>
                    <div style="background:#151D35;border:1px solid #1E2A45;padding:24px;margin:0 0 32px;">
                      <div style="font-size:10px;letter-spacing:0.3em;color:#C9A84C;text-transform:uppercase;margin-bottom:16px;">Enquiry from</div>
                      <table style="width:100%;font-size:13px;">
                        <tr><td style="color:#6B7A99;padding:4px 0;">Name</td><td style="color:#F5F3EE;text-align:right;">${enquirerName}</td></tr>
                        <tr><td style="color:#6B7A99;padding:4px 0;">Agency</td><td style="color:#F5F3EE;text-align:right;">${enquirerAgency}</td></tr>
                        <tr><td style="color:#6B7A99;padding:4px 0;">Username</td><td style="color:#F5F3EE;text-align:right;">@${enquirerUsername}</td></tr>
                        ${enquirerEmail ? `<tr><td style="color:#6B7A99;padding:4px 0;">Email</td><td style="color:#F5F3EE;text-align:right;">${enquirerEmail}</td></tr>` : ''}
                        ${enquirerMobile ? `<tr><td style="color:#6B7A99;padding:4px 0;">Mobile</td><td style="color:#F5F3EE;text-align:right;">${enquirerMobile}</td></tr>` : ''}
                      </table>
                    </div>
                    <div style="text-align:center;">
                      <a href="https://offmarkethub.com.au/dashboard" style="display:inline-block;background:#C9A84C;color:#000;font-size:14px;font-weight:600;padding:14px 32px;text-decoration:none;">View in dashboard →</a>
                    </div>
                  </div>
                  <div style="padding:24px 40px;border-top:1px solid #1E2A45;">
                    <p style="font-size:11px;color:#6B7A99;margin:0;text-align:center;">Off Market Hub · Australia-wide · Verified professionals only</p>
                  </div>
                </div>
              </body>
              </html>
            `
          })
        })
      } catch (emailError) {
        console.error('Email error:', emailError)
      }
    }

    return res.status(200).json({ success: true })

  } catch {
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
