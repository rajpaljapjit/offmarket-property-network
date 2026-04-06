export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmjtcmfjknmdnlgxudfk.supabase.co'
  const key = process.env.SUPABASE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'

  const { firstName, lastName, email, mobile, username, password, agency, role, state, licenseNumber, plan } = req.body

  if (!firstName || !lastName || !email || !agency || !licenseNumber || !username || !password) {
    return res.status(400).json({ error: 'Please fill in all required fields.' })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, key)

    const { data: existing, error: existingError } = await supabase
      .from('members')
      .select('id')
      .eq('email', email)
      .single()

    if (existingError && existingError.code !== 'PGRST116') {
      return res.status(500).json({ error: `DB check error: ${existingError.message}` })
    }

    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' })
    }

    const { error: dbError } = await supabase
      .from('members')
      .insert([{
        first_name: firstName,
        last_name: lastName,
        email,
        mobile,
        username,
        password,
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
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_bmLA4KoW_HFXWiJj5w7yu27hwHkeb5hBd'}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Off Market Property Network <welcome.no-reply@offmarketpropertynetwork.com.au>',
          to: email,
          subject: 'Welcome to Off Market Property Network',
          html: `<html><body style="background:#0A0A0A;font-family:Arial;"><div style="max-width:600px;margin:0 auto;background:#111;padding:40px;"><h1 style="color:#F5F3EE;">Welcome, ${firstName}!</h1><p style="color:#AAAAAA;">Thank you for applying. We are verifying your license — this takes 24-48 hours.</p><a href="https://offmarketpropertynetwork.com.au" style="display:inline-block;background:#C9A84C;color:#000;padding:14px 32px;text-decoration:none;font-weight:600;">Visit the Network</a></div></body></html>`
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
