import { sanitise, sanitiseEmail } from './sanitise'
import { rateLimit, getIp } from '../../lib/rate-limit'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = getIp(req)
  if (rateLimit(`contact:${ip}`, 5)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const { name: _name, email: _email, subject: _subject, message: _message } = req.body
  const name = sanitise(_name)
  const email = sanitiseEmail(_email)
  const subject = sanitise(_subject)
  const message = sanitise(_message)

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Please fill in all fields.' })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return res.status(500).json({ error: 'Email service not configured.' })

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Off Market Hub <notifications@offmarkethub.com.au>',
        to: 'rajpaljapjit@gmail.com',
        reply_to: email,
        subject: `Contact form: ${subject}`,
        html: `
          <html><body style="background:#1B2A1B;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:0 auto;background:#162016;padding:40px;">
              <h1 style="color:#C9A84C;font-size:20px;margin:0 0 20px;">New contact form submission</h1>
              <div style="background:#1F2E1F;border:1px solid #2D4A2D;padding:20px;margin:0 0 20px;">
                <table style="width:100%;font-size:13px;">
                  <tr><td style="color:#6B7A99;padding:6px 0;width:100px;">Name</td><td style="color:#C9A84C;">${name}</td></tr>
                  <tr><td style="color:#6B7A99;padding:6px 0;">Email</td><td style="color:#C9A84C;">${email}</td></tr>
                  <tr><td style="color:#6B7A99;padding:6px 0;">Subject</td><td style="color:#C9A84C;">${subject}</td></tr>
                </table>
              </div>
              <div style="background:#1F2E1F;border:1px solid #2D4A2D;padding:20px;">
                <div style="color:#6B7A99;font-size:11px;margin-bottom:10px;">MESSAGE</div>
                <div style="color:#E8E8E8;font-size:14px;line-height:1.7;">${message.replace(/\n/g, '<br>')}</div>
              </div>
              <p style="color:#6B7A99;font-size:11px;margin-top:20px;">Reply directly to this email to respond to ${name}.</p>
            </div>
          </body></html>
        `
      })
    })

    if (!emailRes.ok) {
      return res.status(500).json({ error: 'Failed to send message.' })
    }

    return res.status(200).json({ success: true })
  } catch {
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
