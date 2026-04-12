import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'

const n = {
  bg:         'rgba(13,10,26,0.85)',
  border:     'rgba(155,109,255,0.15)',
  violet:     '#9B6DFF',
  gold:       '#FFD166',
  emerald:    '#00E5A0',
  white:      '#FFFFFF',
  muted:      '#8888BB',
  cream:      '#D4CFFF',
}

export default function Nav() {
  const [open, setOpen]     = useState(false)
  const [member, setMember] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (stored) setMember(JSON.parse(stored))

    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('member')
    localStorage.removeItem('adminAuth')
    setMember(null)
    router.push('/')
  }

  const links = [['/', 'Home'], ['/how-it-works', 'How It Works'], ['/pricing', 'Pricing']]

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: n.bg,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? n.border : 'transparent'}`,
      transition: 'border-color 0.3s',
    }}>
      <style>{`
        .nav-links { display: flex; }
        .nav-cta   { display: flex; }
        .hamburger { display: none !important; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-cta   { display: none !important; }
          .hamburger { display: flex !important; }
        }
        .nav-link {
          color: ${n.muted};
          font-size: 13px;
          padding: 6px 14px;
          text-decoration: none;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: ${n.white}; background: rgba(155,109,255,0.08); }
        .nav-link-active { color: ${n.white} !important; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img
            src="/goOffmarketlogo1.png"
            alt="Off Market Property Network"
            style={{ height: 140, width: 'auto', objectFit: 'contain', display: 'block', marginTop: 25 }}
          />
        </Link>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Desktop links + CTAs grouped on the right */}
        <div className="nav-cta" style={{ alignItems: 'center', gap: 10 }}>
          <div className="nav-links" style={{ gap: 2, marginRight: 8 }}>
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={`nav-link${router.pathname === href ? ' nav-link-active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>
          {member ? (
            <>
              <Link href="/dashboard" style={{ fontSize: 13, color: n.cream, textDecoration: 'none', padding: '7px 16px', border: `1px solid ${n.border}`, borderRadius: 8, background: 'rgba(155,109,255,0.08)' }}>
                Dashboard
              </Link>
              <button onClick={handleSignOut} style={{ background: `linear-gradient(135deg, ${n.violet}, ${n.gold})`, color: n.white, fontSize: 13, fontWeight: 700, padding: '7px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: '0 0 20px rgba(155,109,255,0.3)' }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: 13, color: n.cream, textDecoration: 'none', padding: '7px 16px', border: `1px solid ${n.border}`, borderRadius: 8, background: 'rgba(155,109,255,0.06)' }}>
                Sign In
              </Link>
              <Link href="/signup" style={{ background: `linear-gradient(135deg, ${n.violet}, ${n.gold})`, color: n.white, fontSize: 13, fontWeight: 700, padding: '7px 18px', textDecoration: 'none', borderRadius: 8, boxShadow: '0 0 20px rgba(155,109,255,0.3)', display: 'inline-block' }}>
                Join Free
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="hamburger"
          style={{ background: 'rgba(155,109,255,0.1)', border: `1px solid ${n.border}`, color: n.violet, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 16, alignItems: 'center', justifyContent: 'center' }}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', borderTop: `1px solid ${n.border}`, background: 'rgba(13,10,26,0.97)' }}
          >
            <div style={{ padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {links.map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} style={{ color: router.pathname === href ? n.white : n.muted, fontSize: 15, padding: '12px 0', textDecoration: 'none', borderBottom: `1px solid ${n.border}` }}>
                  {label}
                </Link>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                {member ? (
                  <>
                    <Link href="/dashboard" onClick={() => setOpen(false)} style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: n.cream, textDecoration: 'none', border: `1px solid ${n.border}`, borderRadius: 8, background: 'rgba(155,109,255,0.08)' }}>
                      Dashboard
                    </Link>
                    <button onClick={() => { handleSignOut(); setOpen(false) }} style={{ background: `linear-gradient(135deg, ${n.violet}, ${n.gold})`, color: n.white, fontSize: 14, fontWeight: 700, padding: '12px', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)} style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: n.cream, textDecoration: 'none', border: `1px solid ${n.border}`, borderRadius: 8, background: 'rgba(155,109,255,0.06)' }}>
                      Sign In
                    </Link>
                    <Link href="/signup" onClick={() => setOpen(false)} style={{ textAlign: 'center', background: `linear-gradient(135deg, ${n.violet}, ${n.gold})`, color: n.white, fontSize: 14, fontWeight: 700, padding: '12px', textDecoration: 'none', borderRadius: 8, display: 'block' }}>
                      Join Free — 3 Months Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
