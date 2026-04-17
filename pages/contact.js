import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useState } from 'react'

const s = {
  gold:       '#B8923A',
  goldDim:    'rgba(184,146,58,0.1)',
  bg:         '#F8F6F1',
  bg2:        '#FFFFFF',
  bg3:        '#F2EFE9',
  bg4:        '#EAE6DE',
  white:      '#1C1A17',
  muted:      '#8A8178',
  mid:        '#4A4640',
  border:     'rgba(184,146,58,0.2)',
  borderGold: 'rgba(184,146,58,0.35)',
  error:      '#CC3333',
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const input = { background: s.bg3, border: `1px solid ${s.border}`, color: s.white, fontSize: 14, padding: '12px 14px', width: '100%', boxSizing: 'border-box', outline: 'none' }
  const lab = { fontSize: 11, letterSpacing: '0.2em', color: s.muted, textTransform: 'uppercase', marginBottom: 6, display: 'block' }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.') }
      else { setSent(true) }
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(false)
  }

  return (
    <div style={{ background: s.bg, color: s.white, minHeight: '100vh' }}>
      <Nav />
      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 80px; align-items: start; }
        @media(max-width: 900px) { .contact-grid { grid-template-columns: 1fr; gap: 48px; } }
      `}</style>

      {/* Hero */}
      <div style={{ position: 'relative', minHeight: '40vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/Heroimage2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,9,15,0.88) 0%, rgba(9,9,15,0.65) 60%, rgba(9,9,15,0.85) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.4em', color: s.gold, textTransform: 'uppercase', marginBottom: 20, fontWeight: 700 }}>Contact</div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', color: '#FFFFFF', fontWeight: 700, lineHeight: 1.1, marginBottom: 16, maxWidth: 600 }}>
            Get in touch
          </h1>
          <p style={{ fontSize: 'clamp(14px,1.8vw,17px)', color: 'rgba(255,255,255,0.75)', maxWidth: 480, lineHeight: 1.7 }}>
            Questions about membership, listings, or the platform — we&apos;re here to help.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>
        <div className="contact-grid">

          {/* Left — contact info */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.35em', color: s.gold, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Contact details</div>
            <h2 style={{ fontSize: 28, color: s.white, fontWeight: 700, marginBottom: 20 }}>How to reach us</h2>
            <p style={{ fontSize: 14, color: s.mid, lineHeight: 1.8, marginBottom: 40 }}>
              We typically respond within one business day. For urgent membership or verification enquiries, email us directly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { label: 'General enquiries', value: 'support@offmarkethub.com.au', href: 'mailto:support@offmarkethub.com.au' },
                { label: 'Membership & verification', value: 'support@offmarkethub.com.au', href: 'mailto:support@offmarkethub.com.au' },
                { label: 'Website', value: 'offmarkethub.com.au', href: 'https://offmarkethub.com.au' },
              ].map(item => (
                <div key={item.label} style={{ background: s.bg3, border: `1px solid ${s.border}`, padding: '20px 24px' }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.25em', color: s.muted, textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</div>
                  <a href={item.href} style={{ fontSize: 14, color: s.gold, textDecoration: 'none', fontWeight: 600 }}>{item.value}</a>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, background: s.bg3, border: `1px solid ${s.border}`, padding: '24px' }}>
              <div style={{ fontSize: 13, color: s.white, fontWeight: 600, marginBottom: 8 }}>Response times</div>
              <div style={{ fontSize: 13, color: s.muted, lineHeight: 1.7 }}>
                General enquiries — within 1 business day<br />
                Membership verification — 24 to 48 hours<br />
                Technical issues — within 1 business day
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div style={{ background: s.bg2, border: `1px solid ${s.border}`, padding: 40 }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 40, marginBottom: 20 }}>✓</div>
                <div style={{ fontSize: 20, color: s.white, fontWeight: 600, marginBottom: 12 }}>Message sent</div>
                <div style={{ fontSize: 14, color: s.muted, lineHeight: 1.7 }}>Thanks for getting in touch. We&apos;ll get back to you within one business day.</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 10, letterSpacing: '0.35em', color: s.gold, textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Send a message</div>
                <h3 style={{ fontSize: 20, color: s.white, fontWeight: 600, marginBottom: 24 }}>We&apos;ll get back to you shortly</h3>

                {error && <div style={{ background: 'rgba(204,51,51,0.08)', border: '1px solid rgba(204,51,51,0.25)', padding: '12px 16px', marginBottom: 20, fontSize: 13, color: s.error }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={lab}>Name *</label>
                      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} type="text" placeholder="Jane Smith" style={input} required />
                    </div>
                    <div>
                      <label style={lab}>Email *</label>
                      <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" placeholder="jane@agency.com.au" style={input} required />
                    </div>
                  </div>
                  <div>
                    <label style={lab}>Subject *</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ ...input, padding: '12px 14px' }} required>
                      <option value="">Select a subject</option>
                      <option>Membership enquiry</option>
                      <option>Verification question</option>
                      <option>Technical issue</option>
                      <option>Billing & subscription</option>
                      <option>General question</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={lab}>Message *</label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" style={{ ...input, height: 140, resize: 'vertical' }} required />
                  </div>
                  <button type="submit" disabled={loading} style={{ background: loading ? 'rgba(184,146,58,0.5)' : s.gold, border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, padding: 14, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                    {loading ? 'Sending...' : 'Send message →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
