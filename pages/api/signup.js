import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY

  const { firstName, lastName, email, mobile, username, password, agency, role, state, licenseNumber, plan } = req.body

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
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY || process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Off Market Property Network <welcome.no-reply@offmarketpropertynetwork.com.au>',
          to: email,
          subject: 'Welcome to Off Market Property Network',
          html: `<html><body style="background:#0A0A0A;font-family:Arial;"><div style="max-width:600px;margin:0 auto;background:#111;padding:40px;"><h1 style="color:#F5F3EE;">Welcome, ${firstName}!</h1><p style="color:#AAAAAA;">Thank you for applying. We are verifying your license — this takes 24-48 hours. Once verified you will receive full access.</p><a href="https://offmarketpropertynetwork.com.au" style="display:inline-block;background:#C9A84C;color:#000;padding:14px 32px;text-decoration:none;font-weight:600;">Visit the Network</a></div></body></html>`
        })
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
    }

    return res.status(200).json({ success: true })

  } catch (err) {
    return res.status(500).json({ error: `Unexpected error: ${err.message}` })
  }
}
