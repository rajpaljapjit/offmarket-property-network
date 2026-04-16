import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'
import { motion } from 'framer-motion'

const s = {
  gold:       '#B8923A',
  goldDim:    'rgba(184,146,58,0.1)',
  bg:         '#F8F6F1',
  bg2:        '#FFFFFF',
  bg3:        '#F2EFE9',
  white:      '#1C1A17',
  muted:      '#8A8178',
  mid:        '#4A4640',
  border:     'rgba(184,146,58,0.2)',
  borderGold: 'rgba(184,146,58,0.35)',
  violet:     '#B8923A',
  violetDim:  'rgba(184,146,58,0.1)',
  emerald:    '#4A7C5A',
}

const steps = [
  { num: '01', title: 'Verify and join', desc: 'Apply for membership by submitting your agent license details. We cross-check against state-based regulatory registers within 24 hours.', details: ['License number verification via state register', 'Agency details and ABN confirmation', 'Profile goes live within 24–48 hours', 'Professionals only — 3 months free to start'] },
  { num: '02', title: 'List or browse privately', desc: 'Selling agents upload opportunities with full control. Buyers agents browse the live feed, filter by market and save opportunities for their clients.', details: ['Set listing as discreet, partial or full detail', 'Filter by suburb, price range, property type', 'Save listings and set match alerts', 'All listings invisible to the public'] },
  { num: '03', title: 'Connect agent to agent', desc: 'When a buyers agent finds a match, they send a direct enquiry. Both agents are verified professionals. Conversations happen privately within your dashboard.', details: ['Direct in-platform messaging', 'Both parties remain verified throughout', 'Track enquiry history in your dashboard', 'No third-party portals in the loop'] },
  { num: '04', title: 'Move to sold. Off market.', desc: 'Deals happen between qualified professionals. Mark your listing as sold, build your off market track record and grow your reputation inside the network.', details: ['Mark listings as under offer or sold', 'Build an off market sales history', 'Earn trust ratings from connected agents', 'No public days on market count'] },
]

export default function HowItWorks() {
  return (
    <div style={{ background: s.bg, color: s.white, minHeight: '100vh' }}>
      <Nav />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .step-row { display: grid; grid-template-columns: 80px 1fr 1fr; gap: 40px; align-items: start; padding: 48px 0; border-top: 1px solid rgba(184,146,58,0.2); }
        @media(max-width:900px) { .step-row { grid-template-columns: 60px 1fr; } .step-detail { display: none !important; } }
        @media(max-width:600px) { .step-row { grid-template-columns: 1fr; gap: 16px; } .step-num { font-size: 36px !important; } }
      `}</style>

      {/* ── HERO WITH BACKGROUND IMAGE ── */}
      <div style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/Heroimage.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,9,15,0.88) 0%, rgba(9,9,15,0.65) 60%, rgba(9,9,15,0.85) 100%)' }} />
        {/* Colour glows */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50%', height: '80%', background: 'radial-gradient(ellipse, rgba(184,146,58,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '0', width: '40%', height: '60%', background: 'radial-gradient(ellipse, rgba(107,158,130,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(184,146,58,0.07) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${s.borderGold}`, borderRadius: 100, padding: '5px 14px', fontSize: 11, color: s.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, background: s.goldDim }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.gold, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            How it works
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 20, maxWidth: 680, color: '#FFFFFF' }}
          >
            From hidden opportunity{' '}
            <span style={{ background: `linear-gradient(130deg, ${s.gold} 0%, ${s.gold} 50%, #6B9E82 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              to signed contract
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, maxWidth: 520, marginBottom: 36 }}
          >
            A simple, private process built for selling agents and buyers agents who want to move property without the noise of public portals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
          >
            <Link href="/signup" style={{ background: s.gold, color: '#1C1A17', padding: '13px 28px', fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-block' }}>
              Join Free — 3 Months
            </Link>
            <Link href="/pricing" style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF', padding: '13px 28px', fontSize: 14, textDecoration: 'none', borderRadius: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)', display: 'inline-block' }}>
              View Pricing →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── STEPS ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className="step-row"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="step-num" style={{ fontSize: 52, color: s.gold, lineHeight: 1, fontWeight: 700, letterSpacing: '-0.04em', textShadow: '0 0 24px rgba(184,146,58,0.3)' }}>
              {step.num}
            </div>
            <div>
              <h3 style={{ fontSize: 'clamp(18px,3vw,22px)', color: s.white, marginBottom: 12, fontWeight: 600 }}>{step.title}</h3>
              <p style={{ color: s.muted, lineHeight: 1.75, fontSize: 14, maxWidth: 420 }}>{step.desc}</p>
            </div>
            <div className="step-detail" style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {step.details.map(d => (
                <div key={d} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.gold, marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: s.mid }}>{d}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px', textAlign: 'center' }}>
        {/* Background image repeat */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/Heroimage.png)', backgroundSize: 'cover', backgroundPosition: 'center bottom' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,15,0.88)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px,4vw,36px)', color: '#FFFFFF', marginBottom: 12, fontWeight: 700, letterSpacing: '-0.02em' }}>Ready to join the network?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 28, lineHeight: 1.7 }}>3 months completely free for all verified agents. No credit card required.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: s.gold, color: '#1C1A17', padding: '14px 32px', fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-block' }}>
              Join Free
            </Link>
            <Link href="/pricing" style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF', padding: '14px 28px', fontSize: 14, textDecoration: 'none', borderRadius: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)', display: 'inline-block' }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
