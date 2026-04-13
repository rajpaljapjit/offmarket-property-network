import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'
import { motion } from 'framer-motion'

const c = {
  bg:         '#0D0A1A',
  bg2:        '#13102A',
  bg3:        '#1A1638',
  bg4:        '#221E46',
  gold:       '#FFD166',
  goldDim:    'rgba(255,209,102,0.1)',
  emerald:    '#00E5A0',
  emeraldDim: 'rgba(0,229,160,0.1)',
  violet:     '#9B6DFF',
  violetDim:  'rgba(155,109,255,0.12)',
  white:      '#FFFFFF',
  cream:      '#D4CFFF',
  muted:      '#8888BB',
  border:     'rgba(155,109,255,0.15)',
  borderGold: 'rgba(255,209,102,0.25)',
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

const benefits = [
  { icon: '🤫', title: 'Sell without going public', desc: 'Share your listing privately with qualified buyers agents across the country. No public days on market, no price history, no public record.' },
  { icon: '🎯', title: 'Reach qualified buyers only', desc: 'Every enquiry comes from a license-verified buyers agent representing a real, qualified buyer. Zero tyre-kickers, zero wasted inspections.' },
  { icon: '💰', title: 'Protect your vendor\'s price', desc: 'Off-market transactions remove the psychological pressure of days-on-market counters and public price drops. Stronger negotiating position for your vendor.' },
  { icon: '⚡', title: 'Move fast and quietly', desc: 'The right buyer is already in the network. Share your listing and often have a qualified enquiry within 48 hours — before you even think about going to market.' },
  { icon: '🔒', title: 'Full control over your listing', desc: 'You decide what information to share, with whom and when. Set listings as discreet, partial detail or full — all invisible to the general public.' },
  { icon: '🏆', title: 'Build your off-market reputation', desc: 'Every off-market sale you close builds your track record inside the network. Become the listing agent other agents call first.' },
]

const steps = [
  { num: '01', title: 'Join and get verified', desc: 'Submit your real estate license. We verify against state registers within 24 hours and your profile goes live immediately.' },
  { num: '02', title: 'Upload your listing', desc: 'Add property details, set your privacy level and publish. Your listing is instantly visible to verified buyers agents nationwide.' },
  { num: '03', title: 'Receive direct enquiries', desc: 'Buyers agents send you direct messages from their dashboard. All parties remain verified. No public portal in the loop.' },
  { num: '04', title: 'Sell off market', desc: 'Negotiate privately, protect your vendor\'s price and close. Mark as sold and let your off-market track record speak for itself.' },
]

export default function SellersAgent() {
  return (
    <div style={{ background: c.bg, color: c.white, minHeight: '100vh' }}>
      <Nav />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .sa-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .sa-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
        @media(max-width:900px) {
          .sa-grid  { grid-template-columns: repeat(2,1fr); }
          .sa-steps { grid-template-columns: repeat(2,1fr); }
        }
        @media(max-width:600px) {
          .sa-grid  { grid-template-columns: 1fr; }
          .sa-steps { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO — Heroimage.png background ── */}
      <section style={{ position: 'relative', minHeight: '95vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '60px 0' }}>
        <video autoPlay muted loop playsInline poster="/Heroimage.png"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}>
          <source src="/video2.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,10,26,0.92) 0%, rgba(13,10,26,0.72) 55%, rgba(13,10,26,0.88) 100%)' }} />
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '55%', height: '70%', background: 'radial-gradient(ellipse, rgba(255,209,102,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', left: '0', width: '45%', height: '55%', background: 'radial-gradient(ellipse, rgba(155,109,255,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,209,102,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${c.borderGold}`, borderRadius: 100, padding: '5px 14px', fontSize: 11, color: c.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24, background: c.goldDim }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.gold, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            For Real Estate Sellers Agents
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
            style={{ fontSize: 'clamp(36px, 5.5vw, 64px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24, maxWidth: 780 }}>
            Sell your listings quietly<br />before they{' '}
            <span style={{ background: `linear-gradient(130deg, ${c.gold} 0%, ${c.violet} 50%, ${c.emerald} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              hit the market
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            style={{ fontSize: 18, color: c.cream, lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>
            Share off-market opportunities directly with verified buyers agents nationwide. No public portals. No days on market. No noise.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: `linear-gradient(135deg, ${c.gold}, ${c.violet})`, color: c.white, padding: '15px 32px', fontSize: 15, fontWeight: 700, textDecoration: 'none', borderRadius: 8, boxShadow: '0 0 32px rgba(255,209,102,0.35)', display: 'inline-block' }}>
              Sign Up
            </Link>
            <Link href="/" style={{ border: `1px solid ${c.border}`, color: c.cream, padding: '15px 28px', fontSize: 15, textDecoration: 'none', borderRadius: 8, background: c.violetDim, display: 'inline-block' }}>
              Home
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            style={{ display: 'flex', gap: 40, marginTop: 56, flexWrap: 'wrap' }}>
            {[['0', 'Public portal exposure'], ['48hr', 'Average first enquiry'], ['100%', 'Verified buyers agents'], ['3 mo', 'Free to start']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: c.gold, letterSpacing: '-0.02em' }}>{val}</div>
                <div style={{ fontSize: 11, color: c.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ padding: '96px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', color: c.gold, textTransform: 'uppercase', marginBottom: 12 }}>Why sellers agents join</div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>Protect your vendor. Close faster.</h2>
            <p style={{ fontSize: 15, color: c.muted, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Give your vendors a private first look at the market before committing to a full public campaign.</p>
          </div>
        </FadeUp>
        <div className="sa-grid">
          {benefits.map((b, i) => (
            <FadeUp key={b.title} delay={i * 0.07}>
              <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 12, padding: '28px 24px', height: '100%', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,209,102,0.4)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,209,102,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{b.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: c.white, marginBottom: 10 }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: c.bg2, padding: '96px 24px', borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', color: c.gold, textTransform: 'uppercase', marginBottom: 12 }}>The process</div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.02em' }}>List privately in under an hour</h2>
            </div>
          </FadeUp>
          <div className="sa-steps">
            {steps.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.08}>
                <div style={{ textAlign: 'center', padding: '0 12px' }}>
                  <div style={{ fontSize: 48, fontWeight: 700, color: c.gold, letterSpacing: '-0.04em', marginBottom: 16, textShadow: '0 0 24px rgba(255,209,102,0.3)' }}>{step.num}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: c.white, marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '96px 24px', textAlign: 'center' }}>
        <video autoPlay muted loop playsInline poster="/Heroimage.png"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}>
          <source src="/video2.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,10,26,0.88)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,209,102,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${c.borderGold}`, borderRadius: 100, padding: '5px 14px', fontSize: 11, color: c.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, background: c.goldDim }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.gold, display: 'inline-block', animation: 'pulse 2s infinite' }} />
              3 months free · No credit card
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', color: c.white, marginBottom: 16 }}>
              Start selling off market today
            </h2>
            <p style={{ fontSize: 15, color: c.cream, lineHeight: 1.7, marginBottom: 32 }}>
              Join verified selling agents already sharing listings that never make it to the public portals.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup" style={{ background: `linear-gradient(135deg, ${c.gold}, ${c.violet})`, color: c.white, padding: '15px 36px', fontSize: 15, fontWeight: 700, textDecoration: 'none', borderRadius: 8, boxShadow: '0 0 32px rgba(255,209,102,0.35)', display: 'inline-block' }}>
                Sign Up
              </Link>
              <Link href="/" style={{ border: `1px solid ${c.border}`, color: c.cream, padding: '15px 28px', fontSize: 15, textDecoration: 'none', borderRadius: 8, background: c.violetDim, display: 'inline-block' }}>
                Home
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  )
}
