import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'

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
}

const values = [
  { title: 'Verified professionals only', desc: 'Every member is cross-checked against state-based real estate regulatory registers before access is granted. No consumers, no amateurs.' },
  { title: 'Privacy by design', desc: 'Off market means off market. Listings on our platform are never visible to the public — only to verified members who have earned access.' },
  { title: 'Agent to agent', desc: 'We cut out the portals and the middlemen. Deals happen directly between selling agents and buyers agents inside a trusted, closed network.' },
  { title: 'Australia-wide', desc: 'From Brisbane to Perth, our network connects agents across all states and territories — a single platform for the entire country.' },
]

export default function About() {
  return (
    <div style={{ background: s.bg, color: s.white, minHeight: '100vh' }}>
      <Nav />
      <style>{`
        .values-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media(max-width: 768px) { .values-grid { grid-template-columns: 1fr; } }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media(max-width: 600px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      {/* Hero */}
      <div style={{ position: 'relative', minHeight: '55vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/nightnetworking.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,9,15,0.88) 0%, rgba(9,9,15,0.65) 60%, rgba(9,9,15,0.85) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.4em', color: s.gold, textTransform: 'uppercase', marginBottom: 20, fontWeight: 700 }}>About Us</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,58px)', color: '#FFFFFF', fontWeight: 700, lineHeight: 1.1, marginBottom: 24, maxWidth: 700 }}>
            Built for the people who move property quietly
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,0.8)', maxWidth: 560, lineHeight: 1.7 }}>
            Off Market Hub is Australia&apos;s private network for real estate professionals — a closed platform where selling agents and buyers agents connect without the noise of public portals.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.35em', color: s.gold, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Our mission</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', color: s.white, fontWeight: 700, marginBottom: 20, lineHeight: 1.2 }}>
              A private network built on trust
            </h2>
            <p style={{ fontSize: 15, color: s.mid, lineHeight: 1.8, marginBottom: 20 }}>
              Off market property has always existed — but it lived in phone books, text threads and word of mouth. We built Off Market Hub to bring that private market into a single, secure, professional platform.
            </p>
            <p style={{ fontSize: 15, color: s.mid, lineHeight: 1.8, marginBottom: 32 }}>
              Every member is a verified real estate professional. Every listing is invisible to the public. Every connection happens between agents who have earned their place in the network.
            </p>
            <Link href="/signup" style={{ display: 'inline-block', background: s.gold, color: '#fff', fontSize: 14, fontWeight: 600, padding: '14px 32px', textDecoration: 'none' }}>
              Join the network →
            </Link>
          </div>
          <div style={{ background: s.bg3, border: `1px solid ${s.border}`, padding: 48 }}>
            <div className="stats-grid">
              {[
                { stat: '100%', label: 'Verified members' },
                { stat: 'Private', label: 'All listings' },
                { stat: '24–48h', label: 'Verification time' },
                { stat: 'Free', label: '3 months to start' },
                { stat: 'All states', label: 'Australia-wide' },
                { stat: 'Direct', label: 'Agent to agent' },
              ].map(({ stat, label }) => (
                <div key={label} style={{ textAlign: 'center', padding: '20px 12px' }}>
                  <div style={{ fontSize: 24, color: s.gold, fontWeight: 700, marginBottom: 6 }}>{stat}</div>
                  <div style={{ fontSize: 11, color: s.muted, letterSpacing: '0.1em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ background: s.bg3, borderTop: `1px solid ${s.border}`, borderBottom: `1px solid ${s.border}`, padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.35em', color: s.gold, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>What we stand for</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', color: s.white, fontWeight: 700 }}>Our principles</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} style={{ background: s.bg2, border: `1px solid ${s.border}`, padding: 32 }}>
                <div style={{ width: 40, height: 40, background: s.goldDim, border: `1px solid ${s.borderGold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 16, color: s.gold, fontWeight: 700 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 16, color: s.white, fontWeight: 600, marginBottom: 12 }}>{v.title}</div>
                <div style={{ fontSize: 14, color: s.muted, lineHeight: 1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who it's for */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.35em', color: s.gold, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Who it&apos;s for</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', color: s.white, fontWeight: 700, marginBottom: 16 }}>Built for professionals</h2>
          <p style={{ fontSize: 15, color: s.muted, maxWidth: 500, margin: '0 auto' }}>Off Market Hub is exclusively for licensed real estate professionals across Australia.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {[
            {
              role: 'Selling agents',
              desc: 'List properties privately before they hit the public market. Connect directly with buyers agents who have qualified clients ready to move. No days on market. No public exposure.',
              features: ['Private listing management', 'Direct agent connections', 'Off market track record', 'Discreet or detailed listings'],
              href: '/sellers-agent',
            },
            {
              role: 'Buyers agents',
              desc: 'Browse a private feed of off market stock unavailable anywhere else. Save listings, send direct enquiries and build a verified network of selling agents across every state.',
              features: ['Full feed access', 'Save and shortlist listings', 'Direct messaging', 'Australia-wide coverage'],
              href: '/buyers-agent',
            },
          ].map(item => (
            <div key={item.role} style={{ background: s.bg2, border: `1px solid ${s.border}`, padding: 40 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.35em', color: s.gold, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>{item.role}</div>
              <p style={{ fontSize: 14, color: s.mid, lineHeight: 1.8, marginBottom: 24 }}>{item.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                {item.features.map(f => (
                  <div key={f} style={{ fontSize: 13, color: s.muted, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: s.gold, fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Link href={item.href} style={{ fontSize: 13, color: s.gold, textDecoration: 'none', fontWeight: 600 }}>Learn more →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: s.white, padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.35em', color: s.gold, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Get started</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', color: '#FFFFFF', fontWeight: 700, marginBottom: 16 }}>Ready to join the network?</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 32 }}>Apply for membership today. Verification takes 24–48 hours and the first 3 months are free.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: s.gold, color: '#fff', fontSize: 14, fontWeight: 600, padding: '14px 32px', textDecoration: 'none' }}>Apply for membership →</Link>
            <Link href="/contact" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: 14, padding: '14px 32px', textDecoration: 'none' }}>Contact us</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
