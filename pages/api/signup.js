import bcrypt from 'bcryptjs'
import { sanitise, sanitiseEmail, sanitiseNumber } from './sanitise'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmjtcmfjknmdnlgxudfk.supabase.co'
  const key = process.env.SUPABASE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'

  const { firstName: _fn, lastName: _ln, email: _em, mobile: _mob, username: _un, password, agency: _ag, role: _role, state: _state, licenseNumber: _lic, plan: _plan } = req.body
  const firstName = sanitise(_fn)
  const lastName = sanitise(_ln)
  const email = sanitiseEmail(_em)
  const mobile = sanitiseNumber(_mob)
  const username = sanitise(_un)
  const agency = sanitise(_ag)
  const role = sanitise(_role)
  const state = sanitise(_state)
  const licenseNumber = sanitise(_lic)
  const plan = sanitise(_plan)

  if (!firstName || !lastName || !email || !agency || !licenseNumber || !username || !password) {
    return res.status(400).json({ error: 'Please fill in all required fields.' })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, key)

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('members')
      .select('id')
      .eq('email', email)
      .single()

    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' })
    }

    // Check if username already exists
    const { data: existingUsername } = await supabase
      .from('members')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUsername) {
      return res.status(400).json({ error: 'This username is already taken. Please choose another.' })
    }

    const { error: dbError } = await supabase
      .from('members')
      .insert([{
        first_name: firstName,
        last_name: lastName,
        email,
        mobile,
        username,
        password: hashedPassword,
        agency,
        role,
        state,
        license_number: licenseNumber,
        plan: plan || 'Silver',
        status: 'pending',
        trial_start: new Date().toISOString(),
      }])

    if (dbError) {
      return res.status(500).json({ error: `DB insert error: ${dbError.message}` })
    }

    try {
      const welcomePayload = {
        from: 'Off Market Property Network <notifications@offmarketpropertynetwork.com.au>',
        to: [email],
        subject: 'Welcome to Off Market Property Network',
        html: '<html><body style="background:#1B2A1B;font-family:Arial;"><div style="max-width:600px;margin:0 auto;background:#162016;padding:40px;"><h1 style="color:#C9A84C;">Welcome, ' + firstName + '!</h1><p style="color:#A8B4CC;">Thank you for applying to Off Market Property Network. We are verifying your real estate license — this typically takes 24-48 hours. Once approved you will receive an email with full access to the platform.</p><a href="https://offmarketpropertynetwork.com.au" style="display:inline-block;background:#C9A84C;color:#000;padding:14px 32px;text-decoration:none;font-weight:600;margin-top:24px;">Visit the Network</a></div></body></html>'
      }
      const welcomeRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + (process.env.RESEND_API_KEY || 're_bmLA4KoW_HFXWiJj5w7yu27hwHkeb5hBd'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(welcomePayload)
      })
      const welcomeData = await welcomeRes.json()
      console.log('Welcome email result:', welcomeData)
    } catch (emailError) {
      console.error('Welcome email error:', emailError)
    }

    // Notify admin of new signup
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_bmLA4KoW_HFXWiJj5w7yu27hwHkeb5hBd'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Off Market Property Network <notifications@offmarketpropertynetwork.com.au>',
          to: 'rajpaljapjit@gmail.com',
          subject: `New member signup: ${firstName} ${lastName}`,
          html: `
            <html>
            <body style="background:#1B2A1B;font-family:Arial,sans-serif;">
              <div style="max-width:600px;margin:0 auto;background:#162016;padding:40px;">
                <h1 style="color:#C9A84C;font-size:22px;">New member signup</h1>
                <p style="color:#A8B4CC;">A new agent has signed up and is awaiting approval.</p>
                <div style="background:#1F2E1F;border:1px solid #2D4A2D;padding:20px;margin:20px 0;">
                  <table style="width:100%;font-size:13px;">
                    <tr><td style="color:#6B7A99;padding:6px 0;">Name</td><td style="color:#C9A84C;text-align:right;">${firstName} ${lastName}</td></tr>
                    <tr><td style="color:#6B7A99;padding:6px 0;">Email</td><td style="color:#C9A84C;text-align:right;">${email}</td></tr>
                    <tr><td style="color:#6B7A99;padding:6px 0;">Mobile</td><td style="color:#C9A84C;text-align:right;">${mobile}</td></tr>
                    <tr><td style="color:#6B7A99;padding:6px 0;">Agency</td><td style="color:#C9A84C;text-align:right;">${agency}</td></tr>
                    <tr><td style="color:#6B7A99;padding:6px 0;">Role</td><td style="color:#C9A84C;text-align:right;">${role}</td></tr>
                    <tr><td style="color:#6B7A99;padding:6px 0;">State</td><td style="color:#C9A84C;text-align:right;">${state}</td></tr>
                    <tr><td style="color:#6B7A99;padding:6px 0;">License</td><td style="color:#C9A84C;text-align:right;">${licenseNumber}</td></tr>
                    <tr><td style="color:#6B7A99;padding:6px 0;">Plan</td><td style="color:#C9A84C;text-align:right;">${plan}</td></tr>
                  </table>
                </div>
                <a href="https://offmarketpropertynetwork.com.au/admin-login" style="display:inline-block;background:#C9A84C;color:#000;padding:12px 24px;text-decoration:none;font-weight:600;font-size:13px;">Review in admin panel →</a>
              </div>
            </body>
            </html>
          `
        })
      })
    } catch(e) { console.error('Admin notify error:', e) }

    return res.status(200).json({ success: true })

  } catch (err) {
    return res.status(500).json({ error: `Unexpected error: ${err.message}` })
  }
}
