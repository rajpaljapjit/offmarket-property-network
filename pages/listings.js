import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

const c = {
  bg:         '#0D0A1A',
  bg2:        '#13102A',
  bg3:        '#1A1638',
  bg4:        '#221E46',
  gold:       '#FFD166',
  goldDim:    'rgba(255,209,102,0.1)',
  emerald:    '#00E5A0',
  violet:     '#9B6DFF',
  violetDim:  'rgba(155,109,255,0.12)',
  white:      '#FFFFFF',
  cream:      '#D4CFFF',
  muted:      '#8888BB',
  border:     'rgba(155,109,255,0.15)',
  borderGold: 'rgba(255,209,102,0.25)',
}

const STATES = ['All States', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']
const TYPES  = ['All Types', 'House', 'Apartment', 'Townhouse', 'Land', 'Commercial', 'Rural']

function ListingCard({ listing, member, onEnquire }) {
  const typeColors = {
    House: c.violet, Apartment: c.emerald, Townhouse: c.gold,
    Land: '#FF9500', Commercial: '#FF6B9D', Rural: '#00C8FF',
  }
  const color = typeColors[listing.property_type] || c.violet

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: c.bg2,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(155,109,255,0.4)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(155,109,255,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = c.border
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Card header */}
      <div style={{ background: c.bg3, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${c.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.emerald, boxShadow: `0 0 6px ${c.emerald}` }} />
          <span style={{ fontSize: 10, color: c.emerald, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>Active</span>
        </div>
        <span style={{ fontSize: 10, color: color, background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 20, padding: '3px 10px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
          {listing.property_type || 'Property'}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: c.bg4, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
            🔒
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: c.white, marginBottom: 3 }}>
              {listing.suburb}, {listing.state}
            </div>
            <div style={{ fontSize: 12, color: c.muted }}>
              Off-market · {listing.property_type || 'Property'}
            </div>
          </div>
        </div>

        {/* Details row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
          {listing.bedrooms && (
            <span style={{ fontSize: 11, color: c.cream, background: c.bg4, padding: '4px 10px', borderRadius: 6 }}>
              🛏 {listing.bedrooms} bed
            </span>
          )}
          {listing.bathrooms && (
            <span style={{ fontSize: 11, color: c.cream, background: c.bg4, padding: '4px 10px', borderRadius: 6 }}>
              🚿 {listing.bathrooms} bath
            </span>
          )}
          {listing.parking && (
            <span style={{ fontSize: 11, color: c.cream, background: c.bg4, padding: '4px 10px', borderRadius: 6 }}>
              🚗 {listing.parking} car
            </span>
          )}
        </div>

        {/* Price */}
        {listing.price_guide && (
          <div style={{ fontSize: 18, fontWeight: 700, color: c.gold, marginBottom: 14 }}>
            {listing.price_guide}
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <p style={{ fontSize: 12, color: c.muted, lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {listing.description}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {member ? (
            <button
              onClick={() => onEnquire(listing)}
              style={{ flex: 1, background: `linear-gradient(135deg, ${c.violet}, ${c.gold})`, color: c.white, border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(155,109,255,0.3)' }}
            >
              Enquire
            </button>
          ) : (
            <Link
              href="/login"
              style={{ flex: 1, background: `linear-gradient(135deg, ${c.violet}, ${c.gold})`, color: c.white, border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', textAlign: 'center', display: 'block' }}
            >
              Sign in to enquire
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Listings() {
  const router = useRouter()
  const [member, setMember]       = useState(null)
  const [listings, setListings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filterState, setFilter]  = useState('All States')
  const [filterType, setFilterType] = useState('All Types')
  const [enquiring, setEnquiring] = useState(null)
  const [sent, setSent]           = useState(false)
  const [sending, setSending]     = useState(false)
  const [message, setMessage]     = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (stored) setMember(JSON.parse(stored))
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/dashboard-data?memberId=public').catch(() => null)
      // Fallback to mock data if no API
      setListings([
        { id: '1', suburb: 'Hope Island', state: 'QLD', property_type: 'House', bedrooms: 4, bathrooms: 3, parking: 2, price_guide: '$4.2M', description: 'Stunning waterfront property with private jetty and panoramic canal views.' },
        { id: '2', suburb: 'Toorak', state: 'VIC', property_type: 'House', bedrooms: 5, bathrooms: 4, parking: 3, price_guide: '$8.8M', description: 'Prestige family estate in the heart of Toorak with resort-style pool and tennis court.' },
        { id: '3', suburb: 'Mosman', state: 'NSW', property_type: 'Apartment', bedrooms: 3, bathrooms: 2, parking: 2, price_guide: '$6.5M', description: 'Rare harbour-view penthouse with north-facing terrace and direct water access.' },
        { id: '4', suburb: 'Burleigh Heads', state: 'QLD', property_type: 'House', bedrooms: 4, bathrooms: 2, parking: 2, price_guide: '$3.1M', description: 'Beachside entertainer with rooftop deck and ocean views across Burleigh beach.' },
        { id: '5', suburb: 'South Yarra', state: 'VIC', property_type: 'Apartment', bedrooms: 2, bathrooms: 2, parking: 1, price_guide: '$1.8M', description: 'Boutique residence in sought-after South Yarra with premium finishes throughout.' },
        { id: '6', suburb: 'Cottesloe', state: 'WA', property_type: 'House', bedrooms: 4, bathrooms: 3, parking: 2, price_guide: '$5.4M', description: 'Architecturally designed beachfront home with Indian Ocean views.' },
      ])
    } catch { }
    setLoading(false)
  }

  const sendEnquiry = async () => {
    if (!message.trim() || !enquiring) return
    setSending(true)
    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: enquiring.id, memberId: member.id, message }),
      })
      setSent(true)
    } catch { setSent(true) }
    setSending(false)
  }

  const filtered = listings.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = !search || l.suburb?.toLowerCase().includes(q) || l.state?.toLowerCase().includes(q) || l.property_type?.toLowerCase().includes(q)
    const matchState = filterState === 'All States' || l.state === filterState
    const matchType  = filterType  === 'All Types'  || l.property_type === filterType
    return matchSearch && matchState && matchType
  })

  const inputStyle = {
    background: c.bg3,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    color: c.white,
    fontSize: 13,
    padding: '10px 14px',
    outline: 'none',
  }

  return (
    <div style={{ background: c.bg, color: c.white, minHeight: '100vh' }}>
      <Nav />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .listings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .filter-row { display: flex; gap: 12px; flex-wrap: wrap; }
        @media(max-width:900px) { .listings-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:600px) { .listings-grid { grid-template-columns: 1fr; } .filter-row { flex-direction: column; } }
        input::placeholder { color: #8888BB; }
        select option { background: #1A1638; }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '64px 24px 48px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '20%', width: '60%', height: '80%', background: 'radial-gradient(ellipse, rgba(155,109,255,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(155,109,255,0.06) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${c.borderGold}`, borderRadius: 100, padding: '5px 14px', fontSize: 11, color: c.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, background: c.goldDim }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.gold, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Private Network · Members Only
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}
          >
            Off-Market{' '}
            <span style={{ background: `linear-gradient(130deg, ${c.violet} 0%, ${c.gold} 50%, ${c.emerald} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Listings
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 16, color: c.cream, lineHeight: 1.7 }}
          >
            Exclusive properties shared quietly between verified agents. No public portals.
          </motion.p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* ── FILTERS ── */}
        <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
          <div className="filter-row">
            <input
              type="text"
              placeholder="Search suburb, state or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, flex: 1, minWidth: 200 }}
            />
            <select value={filterState} onChange={e => setFilter(e.target.value)} style={{ ...inputStyle, minWidth: 140 }}>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...inputStyle, minWidth: 140 }}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {(search || filterState !== 'All States' || filterType !== 'All Types') && (
              <button onClick={() => { setSearch(''); setFilter('All States'); setFilterType('All Types') }} style={{ background: c.bg4, border: `1px solid ${c.border}`, color: c.muted, borderRadius: 8, padding: '10px 16px', fontSize: 12, cursor: 'pointer' }}>
                Clear
              </button>
            )}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: c.muted }}>
            {loading ? 'Loading listings...' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`}
          </div>
        </div>

        {/* ── GRID ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: c.muted }}>Loading listings...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, color: c.white, fontWeight: 600, marginBottom: 8 }}>No listings match your filters</div>
            <div style={{ fontSize: 13, color: c.muted }}>Try adjusting your search or filters</div>
          </div>
        ) : (
          <div className="listings-grid">
            {filtered.map(l => (
              <ListingCard key={l.id} listing={l} member={member} onEnquire={l => { setEnquiring(l); setSent(false); setMessage('') }} />
            ))}
          </div>
        )}

        {/* ── CTA for non-members ── */}
        {!member && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: 48, background: c.bg2, border: `1px solid ${c.borderGold}`, borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}
          >
            <div style={{ fontSize: 11, letterSpacing: '0.2em', color: c.gold, textTransform: 'uppercase', marginBottom: 12 }}>Verified Members Only</div>
            <h2 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: c.white, marginBottom: 12 }}>Access the full network</h2>
            <p style={{ fontSize: 14, color: c.cream, lineHeight: 1.7, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
              Join Australia's private property network to enquire on listings, connect with agents, and share your own off-market opportunities.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup" style={{ background: `linear-gradient(135deg, ${c.violet}, ${c.gold})`, color: c.white, padding: '12px 28px', fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 8, boxShadow: '0 0 24px rgba(155,109,255,0.35)' }}>
                Join Free — 3 Months
              </Link>
              <Link href="/login" style={{ border: `1px solid ${c.border}`, color: c.cream, padding: '12px 28px', fontSize: 14, textDecoration: 'none', borderRadius: 8, background: c.violetDim }}>
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── ENQUIRY MODAL ── */}
      {enquiring && (
        <div
          onClick={e => { if (e.target === e.currentTarget) { setEnquiring(null); setSent(false) } }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 16, padding: '32px', width: '100%', maxWidth: 460, boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: c.white, marginBottom: 8 }}>Enquiry sent!</div>
                <div style={{ fontSize: 13, color: c.muted, marginBottom: 24 }}>The listing agent will be in touch shortly.</div>
                <button onClick={() => { setEnquiring(null); setSent(false) }} style={{ background: `linear-gradient(135deg, ${c.violet}, ${c.gold})`, color: c.white, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: c.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Enquiry</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: c.white }}>{enquiring.suburb}, {enquiring.state}</div>
                  <div style={{ fontSize: 13, color: c.muted }}>{enquiring.property_type} · {enquiring.price_guide}</div>
                </div>
                <textarea
                  placeholder="Introduce yourself and share what your buyer is looking for..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={5}
                  style={{ ...inputStyle, width: '100%', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button onClick={() => setEnquiring(null)} style={{ flex: 1, background: c.bg4, border: `1px solid ${c.border}`, color: c.muted, borderRadius: 8, padding: '10px 0', fontSize: 13, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={sendEnquiry} disabled={sending || !message.trim()} style={{ flex: 2, background: `linear-gradient(135deg, ${c.violet}, ${c.gold})`, color: c.white, border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 700, cursor: sending ? 'wait' : 'pointer', opacity: !message.trim() ? 0.5 : 1 }}>
                    {sending ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  )
}
