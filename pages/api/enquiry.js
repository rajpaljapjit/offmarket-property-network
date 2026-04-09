export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { listingId, listingTitle, listingMemberId, listingMemberEmail, enquirerId, enquirerName, enquirerAgency, enquirerUsername, enquirerEmail, enquirerMobile } = req.body

  if (!listingId || !enquirerId) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmjtcmfjknmdnlgxudfk.supabase.co',
      process.env.SUPABASE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
    )

    // Save enquiry to database
    const { error: dbError } = await supabase.from('enquiries').insert([{
      listing_id: listingId,
      listing_title: listingTitle,
      listing_member_id: listingMemberId,
      enquirer_id: enquirerId,
      enquirer_name: enquirerName,
      enquirer_agency: enquirerAgency,
      enquirer_username: enquirerUsername,
      status: 'pending',
      created_at: new Date().toISOString()
    }])

    if (dbError) {
      return res.status(500).json({ error: dbError.message })
    }

    // Send email notification to listing agent
    if (listingMemberEmail) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_bmLA4KoW_HFXWiJj5w7yu27hwHkeb5hBd'}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Off Market Property Network <notifications@offmarketpropertynetwork.com.au>',
            to: listingMemberEmail,
            subject: `New enquiry on your listing: ${listingTitle}`,
            html: `
              <!DOCTYPE html>
              <html>
              <body style="margin:0;padding:0;background:#0A0F1E;font-family:Arial,sans-serif;">
                <div style="max-width:600px;margin:0 auto;background:#0F1628;">
                  <div style="padding:32px 40px;border-bottom:1px solid #1E2A45;">
                    <img src="https://offmarketpropertynetwork.com.au/Offmarketprop.png" alt="Off Market Property Network" style="height:40px;"/>
                  </div>
                  <div style="padding:40px;">
                    <h1 style="font-size:24px;color:#F5F3EE;margin:0 0 8px;font-weight:600;">New enquiry received</h1>
                    <p style="font-size:15px;color:#C9A84C;margin:0 0 24px;text-transform:uppercase;letter-spacing:0.1em;font-size:11px;">Someone is interested in your listing</p>
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
                      <a href="https://offmarketpropertynetwork.com.au/dashboard" style="display:inline-block;background:#C9A84C;color:#000;font-size:14px;font-weight:600;padding:14px 32px;text-decoration:none;">View in dashboard →</a>
                    </div>
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
      } catch (emailError) {
        console.error('Email error:', emailError)
      }
    }

    return res.status(200).json({ success: true })

  } catch (err) {
    return res.status(500).json({ error: `Unexpected error: ${err.message}` })
  }
}
