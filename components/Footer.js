import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(184,146,58,0.2)', background: '#F2EFE9', padding: '48px 0 32px', marginTop: 60 }}>
      <style>{`
        .footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; margin-bottom:40px; }
        @media(max-width:768px) { .footer-grid { grid-template-columns:1fr 1fr; gap:32px; } }
        @media(max-width:480px) { .footer-grid { grid-template-columns:1fr; } }
      `}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div className="footer-grid">
          <div>
            <img src="/offmarkethublogo.png" alt="Off Market Hub" style={{ height: 98, width: 'auto', objectFit: 'contain', marginBottom: -24, marginLeft: 20, maxWidth: 420 }} />
            <p style={{ fontSize: 13, color: '#8A8178', lineHeight: 1.7 }}>Australia&apos;s private network for selling agents and buyers agents to connect, share, and move off market property.</p>
          </div>
          {[
            { title: 'Network', links: [['/', 'Home'], ['/how-it-works', 'How it works'], ['/listings', 'Listings'], ['/agents', 'Agents'], ['/pricing', 'Pricing']] },
            { title: 'Account', links: [['/login', 'Sign in'], ['/signup', 'Join free'], ['/dashboard', 'Dashboard']] },
            { title: 'Legal', links: [['/privacy', 'Privacy policy'], ['/terms', 'Terms of use']] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.35em', color: '#B8923A', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(([href, label]) => (
                  <Link key={href} href={href} style={{ fontSize: 13, color: '#8A8178', textDecoration: 'none' }}>{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(184,146,58,0.2)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 11, color: '#8A8178' }}>© {new Date().getFullYear()} Off Market Property Network. All rights reserved.</p>
          <p style={{ fontSize: 11, color: '#8A8178' }}>Verified professionals only · Australia-wide</p>
        </div>
      </div>
    </footer>
  )
}
