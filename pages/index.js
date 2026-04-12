import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

const c = {
  bg:          '#0D0A1A',   // deep violet-dark
  bg2:         '#13102A',   // rich purple-dark
  bg3:         '#1A1638',   // elevated violet
  bg4:         '#221E46',   // lightest violet surface
  gold:        '#FFD166',   // vivid electric gold
  goldLight:   '#FFE599',   // bright gold highlight
  goldDim:     'rgba(255,209,102,0.1)',
  emerald:     '#00E5A0',   // electric emerald
  emeraldDim:  'rgba(0,229,160,0.1)',
  violet:      '#9B6DFF',   // vivid purple accent
  violetDim:   'rgba(155,109,255,0.12)',
  white:       '#FFFFFF',
  cream:       '#D4CFFF',   // light lavender-white
  muted:       '#8888BB',   // muted violet
  border:      'rgba(155,109,255,0.15)',
  borderGold:  'rgba(255,209,102,0.25)',
  teal:        '#00E5A0',
}

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

const Stat = ({ value, suffix = '', prefix = '', label }) => {
  const { ref, inView } = useInView({ triggerOnce: true })
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(30px,4vw,46px)', fontWeight: 700, color: c.white, letterSpacing: '-0.025em', lineHeight: 1 }}>
        {prefix}{inView ? <CountUp end={value} duration={2.2} separator="," decimals={prefix === '$' && value < 10 ? 1 : 0} /> : '0'}{suffix}
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.18em', color: c.muted, textTransform: 'uppercase', marginTop: 10, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  )
}

const DashboardPreview = () => (
  <div style={{
    background: 'transparent',
    border: 'none',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: 'none',
  }}>
    {/* Window chrome */}
    <div style={{ background: 'transparent', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: 'none' }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF9500' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
      <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: c.muted, letterSpacing: '0.04em' }}>Off Market Network — Dashboard</div>
    </div>

    <div style={{ display: 'flex', height: 400 }}>
      {/* Sidebar */}
      <div style={{ width: 52, background: 'transparent', borderRight: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 18 }}>
        {[
          { icon: '⊞', active: true },
          { icon: '♡', active: false },
          { icon: '◎', active: false },
          { icon: '✉', active: false },
          { icon: '⚙', active: false },
        ].map(({ icon, active }, i) => (
          <div key={i} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: active ? c.gold : c.muted, background: active ? c.goldDim : 'transparent', borderRadius: 8, cursor: 'pointer' }}>
            {icon}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '18px 16px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: c.white }}>New Listings</div>
          <div style={{ fontSize: 10, color: c.gold, background: c.goldDim, padding: '3px 10px', borderRadius: 20, border: `1px solid ${c.borderGold}` }}>3 new today</div>
        </div>

        {[
          { suburb: 'Hope Island', state: 'QLD', type: 'Waterfront House', price: '$4.2M', beds: 4, baths: 3 },
          { suburb: 'Toorak', state: 'VIC', type: 'Prestige Estate', price: '$8.8M', beds: 5, baths: 4 },
          { suburb: 'Mosman', state: 'NSW', type: 'Harbour Views', price: '$6.5M', beds: 4, baths: 3 },
        ].map((l, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${c.border}`, borderRadius: 8, padding: '10px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>🔒</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: c.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.suburb}, {l.state}</div>
              <div style={{ fontSize: 10, color: c.muted, marginTop: 2 }}>{l.type} · {l.beds}bd {l.baths}ba</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.gold }}>{l.price}</div>
              <div style={{ fontSize: 10, color: c.teal, cursor: 'pointer', marginTop: 2 }}>Enquire</div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 14, borderTop: `1px solid ${c.border}`, paddingTop: 14 }}>
          <div style={{ fontSize: 10, color: c.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Recent Activity</div>
          {[
            { dot: c.gold, text: 'Agent matched on 3 listings' },
            { dot: c.teal, text: 'New enquiry received · 2m ago' },
            { dot: c.emerald, text: 'License verified · Welcome' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.dot, flexShrink: 0 }} />
              <div style={{ fontSize: 11, color: c.cream }}>{a.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default function Home() {
  const [realListings, setRealListings] = useState([])

  useEffect(() => { fetchListings() }, [])

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings?limit=3')
      const data = await res.json()
      if (data.listings && data.listings.length >= 3) setRealListings(data.listings)
    } catch (err) { console.error(err) }
  }

  const listings = realListings.length >= 3 ? realListings : [
    { id: '1', suburb: 'Hope Island', state: 'QLD', property_type: 'House' },
    { id: '2', suburb: 'Burleigh Heads', state: 'QLD', property_type: 'Apartment' },
    { id: '3', suburb: 'Main Beach', state: 'QLD', property_type: 'House' },
  ]

  return (
    <div style={{ background: c.bg, color: c.white, minHeight: '100vh' }}>
      <Nav />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hero-video { display: block; }
        .hg  { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; }
        .sg  { display:grid; grid-template-columns:repeat(4,1fr); }
        .stg { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .lg  { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .feat{ display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
        @media(max-width:900px){
          .hg  { grid-template-columns:1fr; gap:40px; }
          .dash-hide { display:none !important; }
          .sg  { grid-template-columns:repeat(2,1fr); }
          .stg { grid-template-columns:1fr; }
          .lg  { grid-template-columns:1fr; }
          .feat{ grid-template-columns:1fr; gap:32px; }
          .feat-flip { direction:ltr !important; }
        }
        @media(max-width:480px){
          .sg { grid-template-columns:1fr 1fr; }
        }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '94vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '40px 0 60px', backgroundImage: 'url(/Heroimage.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Video background — hidden on mobile via CSS, fallback to Heroimage.png above */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/Heroimage.png"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
          className="hero-video"
        >
          <source src="/Video.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay to keep text readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,10,26,0.82) 0%, rgba(13,10,26,0.65) 60%, rgba(13,10,26,0.78) 100%)', pointerEvents: 'none' }} />
        {/* Subtle colour tint glows on top of video */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '70%', background: 'radial-gradient(ellipse, rgba(155,109,255,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0%', right: '-5%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(0,229,160,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div className="hg">

            {/* Left — copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: 0 }}
              >
                <img
                  src="/goOffmarketlogo1.png"
                  alt="Off Market Property Network"
                  style={{ height: 300, width: 'auto', objectFit: 'contain', display: 'block', marginBottom: -110, marginLeft: -60 }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${c.borderGold}`, borderRadius: 100, padding: '5px 14px', fontSize: 11, color: c.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28, background: c.goldDim }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.gold, display: 'inline-block', animation: 'pulse 2s infinite' }} />
                Australia's Private Property Network
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{ fontSize: 'clamp(36px, 5.5vw, 60px)', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.03em', color: c.white, marginBottom: 24 }}
              >
                Where elite agents<br />move property{' '}
                <span style={{ background: `linear-gradient(130deg, ${c.violet} 0%, ${c.gold} 45%, ${c.emerald} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  off market
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{ fontSize: 17, color: c.cream, lineHeight: 1.75, marginBottom: 36, maxWidth: 430 }}
              >
                Connect selling agents with buyers agents. Share hidden opportunities quietly. No public portals. Professionals only.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}
              >
                <Link href="/signup" style={{ background: `linear-gradient(135deg, ${c.violet} 0%, ${c.gold} 100%)`, color: c.white, padding: '14px 28px', fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-block', letterSpacing: '0.01em', boxShadow: `0 0 32px rgba(155,109,255,0.4)` }}>
                  Join Free — 3 Months
                </Link>
                <Link href="/how-it-works" style={{ border: `1px solid ${c.border}`, color: c.cream, padding: '14px 28px', fontSize: 14, textDecoration: 'none', borderRadius: 8, background: c.violetDim, display: 'inline-block' }}>
                  See how it works →
                </Link>
              </motion.div>

              {/* Social proof avatars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14 }}
              >
                <div style={{ display: 'flex' }}>
                  {['S', 'J', 'M', 'A', 'R'].map((letter, i) => (
                    <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: `hsl(${260 + i * 18},55%,32%)`, border: `2px solid ${c.bg}`, marginLeft: i > 0 ? -9 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: c.white }}>
                      {letter}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: c.muted }}>
                  <span style={{ color: c.cream }}>2,400+</span> verified agents across Australia
                </div>
              </motion.div>
            </div>

            {/* Right — Dashboard preview */}
            <motion.div
              className="dash-hide"
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ transform: 'scale(1.3)', transformOrigin: 'top center', marginBottom: 130 }}>
                <DashboardPreview />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────── */}
      <FadeUp>
        <div style={{ borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 24px' }}>
            <div className="sg">
              {[
                { value: 2400, suffix: '+', label: 'Verified agents' },
                { prefix: '$', value: 1.8, suffix: 'B', label: 'Off market value' },
                { value: 97, suffix: '%', label: 'Member satisfaction' },
                { value: 48, suffix: 'hrs', label: 'Avg time to enquiry' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '0 28px', borderRight: i < 3 ? `1px solid ${c.border}` : 'none' }}>
                  <Stat {...s} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.3em', color: c.gold, textTransform: 'uppercase', marginBottom: 16 }}>How it works</div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.025em', color: c.white }}>Three steps to off market</h2>
            </div>
          </FadeUp>
          <div className="stg">
            {[
              { num: '01', title: 'Verify your license', desc: 'Submit your real estate license. We verify against state regulatory registers within 24 hours. Professionals only — no exceptions.' },
              { num: '02', title: 'Access the network', desc: 'Browse off market listings hidden from every public portal. Filter by suburb, price, and type. Set instant alerts for new stock.' },
              { num: '03', title: 'Close quietly', desc: "Connect directly with the listing agent. Negotiate off-market. Your client gets the edge no portal can offer." },
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div style={{ position: 'relative', padding: '32px', background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 12, height: '100%', borderTop: `3px solid ${[c.violet, c.gold, c.emerald][i]}` }}>
                  <div style={{ fontSize: 11, color: [c.violet, c.gold, c.emerald][i], letterSpacing: '0.15em', marginBottom: 20, fontWeight: 700 }}>STEP {s.num}</div>
                  <div style={{ position: 'absolute', top: 20, right: 24, fontSize: 56, fontWeight: 800, color: 'rgba(255,255,255,0.03)', letterSpacing: '-0.05em', lineHeight: 1, pointerEvents: 'none' }}>{s.num}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, color: c.white, marginBottom: 12, letterSpacing: '-0.01em' }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: c.muted, lineHeight: 1.8 }}>{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES — SELLING AGENTS ────────────────────── */}
      <section style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 100 }}>

          {/* Selling agents */}
          <FadeUp>
            <div className="feat">
              <div>
                <div style={{ display: 'inline-block', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '4px 12px', border: `1px solid ${c.borderGold}`, color: c.gold, borderRadius: 4, marginBottom: 20 }}>For Selling Agents</div>
                <h2 style={{ fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 700, letterSpacing: '-0.025em', color: c.white, marginBottom: 16, lineHeight: 1.15 }}>List privately.<br />Sell quietly.</h2>
                <p style={{ fontSize: 15, color: c.muted, lineHeight: 1.8, marginBottom: 28, maxWidth: 400 }}>Share off market properties with qualified buyers agents — no public exposure, no price discovery issues, no REA or Domain competition.</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, padding: 0 }}>
                  {[
                    'Upload listings with full control over visibility',
                    'Set your own enquiry terms and access rules',
                    'Build your off-market reputation in the network',
                    'Track every enquiry in your private dashboard',
                  ].map(p => (
                    <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: c.cream }}>
                      <span style={{ color: c.gold, fontSize: 12, marginTop: 3, flexShrink: 0, fontWeight: 700 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: c.gold, textDecoration: 'none', fontWeight: 500 }}>
                  Join as a selling agent →
                </Link>
              </div>

              {/* Mini listings dashboard */}
              <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: 11, color: c.muted, marginBottom: 20, letterSpacing: '0.12em', textTransform: 'uppercase' }}>My Listings</div>
                {[
                  { address: 'Hope Island, QLD', enquiries: 7, status: 'Active' },
                  { address: 'Sanctuary Cove, QLD', enquiries: 3, status: 'Active' },
                  { address: 'Broadbeach, QLD', enquiries: 0, status: 'Draft' },
                ].map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 2 ? `1px solid ${c.border}` : 'none' }}>
                    <div>
                      <div style={{ fontSize: 13, color: c.white, fontWeight: 500 }}>{l.address}</div>
                      <div style={{ fontSize: 11, color: c.muted, marginTop: 3 }}>{l.enquiries} enquiries</div>
                    </div>
                    <div style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: l.status === 'Active' ? 'rgba(0,229,160,0.1)' : 'rgba(255,255,255,0.04)', color: l.status === 'Active' ? c.emerald : c.muted, border: `1px solid ${l.status === 'Active' ? 'rgba(0,229,160,0.25)' : c.border}`, letterSpacing: '0.05em' }}>
                      {l.status}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: '14px 16px', background: c.goldDim, border: `1px solid ${c.borderGold}`, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: c.gold, fontWeight: 600 }}>↑ 7 new enquiries this week</div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>All from verified buyers agents</div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Buyers agents — reversed */}
          <FadeUp>
            <div className="feat feat-flip" style={{ direction: 'rtl' }}>
              <div style={{ direction: 'ltr' }}>
                <div style={{ display: 'inline-block', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '4px 12px', border: `1px solid ${c.borderGold}`, color: c.gold, borderRadius: 4, marginBottom: 20 }}>For Buyers Agents</div>
                <h2 style={{ fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 700, letterSpacing: '-0.025em', color: c.white, marginBottom: 16, lineHeight: 1.15 }}>Access what the<br />public can't see.</h2>
                <p style={{ fontSize: 15, color: c.muted, lineHeight: 1.8, marginBottom: 28, maxWidth: 400 }}>Serve your clients with a competitive edge — exclusive off market stock across Australia's premium markets, before it ever hits a portal.</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, padding: 0 }}>
                  {[
                    'Browse listings hidden from REA, Domain, and all portals',
                    'Save, shortlist, and share directly with your clients',
                    'Connect directly with the listing agent — no gatekeeping',
                    'Set instant alerts when new stock matches your brief',
                  ].map(p => (
                    <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: c.cream }}>
                      <span style={{ color: c.gold, fontSize: 12, marginTop: 3, flexShrink: 0, fontWeight: 700 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: c.gold, textDecoration: 'none', fontWeight: 500 }}>
                  Join as a buyers agent →
                </Link>
              </div>

              {/* Mini alert / search card */}
              <div style={{ direction: 'ltr', background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: 11, color: c.muted, marginBottom: 16, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Alert — New match</div>
                <div style={{ background: c.bg3, border: `1px solid ${c.borderGold}`, borderRadius: 10, padding: 20, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: c.white }}>Hope Island, QLD</div>
                      <div style={{ fontSize: 11, color: c.muted, marginTop: 3 }}>4bd · 3ba · Waterfront House</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.gold }}>$4.2M</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['Members only', 'Off market'].map(t => (
                      <div key={t} style={{ fontSize: 9, letterSpacing: '0.12em', color: c.muted, border: `1px solid ${c.border}`, padding: '3px 8px', borderRadius: 4 }}>{t.toUpperCase()}</div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, textAlign: 'center', padding: '11px', background: `linear-gradient(135deg, ${c.violet}, ${c.gold})`, borderRadius: 8, fontSize: 13, fontWeight: 700, color: c.white, cursor: 'pointer' }}>Enquire now</div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '11px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 13, color: c.cream, cursor: 'pointer' }}>Save listing</div>
                </div>
                <div style={{ marginTop: 14, fontSize: 11, color: c.muted, textAlign: 'center' }}>3 more listings match your brief →</div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── LISTINGS SHOWCASE ────────────────────────────── */}
      <section style={{ background: c.bg2, borderTop: `1px solid ${c.border}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.3em', color: c.gold, textTransform: 'uppercase', marginBottom: 12 }}>Members only showcase</div>
                <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, letterSpacing: '-0.02em', color: c.white }}>Current opportunities</h2>
              </div>
              <Link href="/listings" style={{ border: `1px solid ${c.border}`, color: c.cream, padding: '9px 18px', fontSize: 13, textDecoration: 'none', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>View all →</Link>
            </div>
          </FadeUp>
          <div className="lg">
            {listings.map((l, i) => (
              <FadeUp key={l.id} delay={i * 0.08}>
                <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ height: 180, background: c.bg3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {l.images && l.images[0] && (
                      <img src={l.images[0]} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, filter: 'blur(6px)' }} />
                    )}
                    <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
                      <div style={{ fontSize: 26, marginBottom: 8 }}>🔒</div>
                      <div style={{ fontSize: 9, letterSpacing: '0.25em', color: c.muted, textTransform: 'uppercase' }}>Members only</div>
                    </div>
                    <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 9, letterSpacing: '0.12em', background: c.goldDim, color: c.gold, border: `1px solid ${c.borderGold}`, padding: '3px 8px', borderRadius: 4 }}>OFF MARKET</div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.3em', color: c.gold, textTransform: 'uppercase', marginBottom: 8 }}>{l.suburb} · {l.state}</div>
                    <div style={{ fontSize: 16, color: c.white, fontWeight: 600, marginBottom: 14 }}>Private off market opportunity</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: `1px solid ${c.border}` }}>
                      <div style={{ fontSize: 11, color: c.muted }}>Details hidden · Members only</div>
                      <Link href="/signup" style={{ fontSize: 12, color: c.gold, textDecoration: 'none', fontWeight: 500 }}>Unlock →</Link>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '110px 24px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(155,109,255,0.2) 0%, rgba(0,229,160,0.06) 60%, transparent 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(155,109,255,0.08) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', color: c.gold, textTransform: 'uppercase', marginBottom: 16 }}>Trusted and verified</div>
            <h2 style={{ fontSize: 'clamp(28px,4.5vw,46px)', fontWeight: 700, letterSpacing: '-0.03em', color: c.white, marginBottom: 20, lineHeight: 1.1 }}>
              Every member is a verified<br />real estate professional
            </h2>
            <p style={{ color: c.muted, marginBottom: 36, lineHeight: 1.8, fontSize: 16 }}>
              We verify agent licenses through state-based regulatory registers. Professionals only. Join free for 3 months — no credit card required.
            </p>
            <Link href="/signup" style={{ display: 'inline-block', background: `linear-gradient(135deg, ${c.violet} 0%, ${c.gold} 100%)`, color: c.white, padding: '16px 40px', fontSize: 15, fontWeight: 700, textDecoration: 'none', borderRadius: 8, letterSpacing: '0.01em', boxShadow: `0 0 40px rgba(155,109,255,0.35)` }}>
              Apply for Free Membership
            </Link>
            <div style={{ marginTop: 20, fontSize: 12, color: c.muted, letterSpacing: '0.04em' }}>
              3 months free &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Verified within 24hrs
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  )
}
