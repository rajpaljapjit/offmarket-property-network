import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { firstName, lastName, email, agency, role, state, licenseNumber, plan } = req.body

  if (!firstName || !lastName || !email || !agency || !licenseNumber) {
    return res.status(400).json({ error: 'Please fill in all required fields.' })
  }

  // ✅ FIX: was .single() which throws when no row found — crashes every new signup
  // .maybeSingle() returns null when no row exists, which is what we want
  const { data: existing } = await supabase
    .from('members')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' })
  }

  const { error: dbError } = await supabase
    .from('members')
    .insert([{
      first_name: firstName,
      last_name: lastName,
      email,
      agency,
      role,
      state,
      license_number: licenseNumber,
      plan: plan || 'Silver',
      status: 'pending',
      trial_start: new Date().toISOString(),
    }])

  if (dbError) {
    console.error('DB error:', dbError)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }

  // Send welcome email via Resend
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Off Market Property Network <welcome.no-reply@offmarketpropertynetwork.com.au>',
        to: email,
        subject: 'Welcome to Off Market Property Network — Your 3 months free starts now',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:0 auto;background:#111111;">
              <div style="padding:32px 40px;border-bottom:1px solid #2A2A2A;">
                <div style="font-size:20px;font-weight:700;color:#F5F3EE;letter-spacing:0.05em;">OFF MARKET</div>
                <div style="font-size:9px;letter-spacing:0.35em;color:#C9A84C;text-transform:uppercase;">Property Network</div>
              </div>
              <div style="padding:40px;">
                <h1 style="font-size:28px;color:#F5F3EE;margin:0 0 8px;font-weight:600;">Welcome, ${firstName}!</h1>
                <p style="font-size:15px;color:#C9A84C;margin:0 0 32px;letter-spacing:0.1em;text-transform:uppercase;">Your application is received</p>
                <p style="font-size:15px;color:#AAAAAA;line-height:1.7;margin:0 0 24px;">
                  Thank you for applying to join Off Market Property Network — Australia's private network for selling agents and buyers agents.
                </p>
                <div style="background:#1A1A1A;border:1px solid #2A2A2A;padding:24px;margin:0 0 32px;">
                  <div style="font-size:10px;letter-spacing:0.3em;color:#C9A84C;text-transform:uppercase;margin-bottom:16px;">Your application details</div>
                  <table style="width:100%;font-size:13px;">
                    <tr><td style="color:#7A7A7A;padding:4px 0;">Name</td><td style="color:#F5F3EE;text-align:right;">${firstName} ${lastName}</td></tr>
                    <tr><td style="color:#7A7A7A;padding:4px 0;">Agency</td><td style="color:#F5F3EE;text-align:right;">${agency}</td></tr>
                    <tr><td style="color:#7A7A7A;padding:4px 0;">Role</td><td style="color:#F5F3EE;text-align:right;">${role}</td></tr>
                    <tr><td style="color:#7A7A7A;padding:4px 0;">State</td><td style="color:#F5F3EE;text-align:right;">${state}</td></tr>
                    <tr><td style="color:#7A7A7A;padding:4px 0;">Plan</td><td style="color:#F5F3EE;text-align:right;">${plan || 'Silver'} — 3 months free</td></tr>
                  </table>
                </div>
                <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);padding:24px;margin:0 0 32px;">
                  <div style="font-size:14px;color:#C9A84C;font-weight:600;margin-bottom:8px;">What happens next</div>
                  <p style="font-size:13px;color:#AAAAAA;line-height:1.7;margin:0;">
                    We are verifying your real estate license against state-based regulatory registers. 
                    This typically takes <strong style="color:#F5F3EE;">24–48 hours</strong>. 
                    Once verified, you will receive a confirmation email with your login details and full platform access.
                  </p>
                </div>
                <p style="font-size:13px;color:#7A7A7A;line-height:1.7;margin:0 0 32px;">
                  Your 3-month free trial begins from the date your account is verified. No credit card is required and you will not be charged anything during the trial period.
                </p>
                <div style="text-align:center;margin:0 0 32px;">
                  <a href="https://offmarketpropertynetwork.com.au" style="display:inline-block;background:#C9A84C;color:#000;font-size:14px;font-weight:600;padding:14px 32px;text-decoration:none;">Visit the Network</a>
                </div>
              </div>
              <div style="padding:24px 40px;border-top:1px solid #2A2A2A;">
                <p style="font-size:11px;color:#7A7A7A;margin:0;text-align:center;">
                  Off Market Property Network · Australia-wide · Verified professionals only<br>
                  <a href="https://offmarketpropertynetwork.com.au" style="color:#C9A84C;text-decoration:none;">offmarketpropertynetwork.com.au</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    })
  } catch (emailError) {
    console.error('Email error:', emailError)
    // Don't fail the signup if email fails
  }

  return res.status(200).json({ success: true })
}
