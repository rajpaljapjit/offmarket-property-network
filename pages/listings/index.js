import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'

const c = {
  bg:         '#F8F6F1',
  bg2:        '#FFFFFF',
  bg3:        '#F2EFE9',
  bg4:        '#EAE6DE',
  gold:       '#B8923A',
  goldDim:    'rgba(184,146,58,0.1)',
  violet:     '#B8923A',
  violetDim:  'rgba(184,146,58,0.1)',
  emerald:    '#6B9E82',
  white:      '#FFFFFF',
  cream:      '#4A4640',
  muted:      '#8A8178',
  border:     'rgba(184,146,58,0.2)',
  borderGold: 'rgba(201,169,110,0.2)',
}

export default function Listings() {
  const router = useRouter()
  const [listings, setListings]       = useState([])
  const [filtered, setFiltered]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [member, setMember]           = useState(null)
  const [saved, setSaved]             = useState([])
  const [search, setSearch]           = useState('')
  const [filterState, setFilterState] = useState('All States')
  const [filterType, setFilterType]   = useState('All Types')
  const [filterBeds, setFilterBeds]   = useState('Any beds')

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (stored) { const m = JSON.parse(stored); setMember(m); fetchSaved(m.id) }
    fetchListings()
  }, [])

  useEffect(() => {
    let results = listings
    if (search) {
      const q = search.toLowerCase()
      results = results.filter(l =>
        l.suburb?.toLowerCase().includes(q) ||
        l.title?.toLowerCase().includes(q) ||
        l.street_address?.toLowerCase().includes(q) ||
        l.postcode?.includes(q)
      )
    }
    if (filterState !== 'All States') results = results.filter(l => l.state === filterState)
    if (filterType  !== 'All Types')  results = results.filter(l => l.property_type === filterType)
    if (filterBeds  !== 'Any beds')   results = results.filter(l => l.bedrooms >= parseInt(filterBeds))
    setFiltered(results)
  }, [search, filterState, filterType, filterBeds, listings])

  const fetchListings = async () => {
    const res = await fetch('/api/listings')
    const data = await res.json()
    setListings(data.listings || [])
    setFiltered(data.listings || [])
    setLoading(false)
  }

  const fetchSaved = async (memberId) => {
    const res = await fetch(`/api/saved?memberId=${memberId}`)
    const data = await res.json()
    setSaved(data.saved || [])
  }

  const toggleSave = async (listingId, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!member) { router.push('/login'); return }
    if (saved.includes(listingId)) {
      await fetch('/api/saved', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ memberId: member.id, listingId }) })
      setSaved(saved.filter(id => id !== listingId))
    } else {
      await fetch('/api/saved', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ memberId: member.id, listingId }) })
      setSaved([...saved, listingId])
    }
  }

  const activeFilters = [
    filterState !== 'All States' && filterState,
    filterType  !== 'All Types'  && filterType,
    filterBeds  !== 'Any beds'   && filterBeds + '+ beds',
  ].filter(Boolean)

  const inputStyle = {
    background: c.bg3,
    border: `1px solid ${c.border}`,
    color: c.white,
    fontSize: 13,
    padding: '10px 14px',
    borderRadius: 8,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ background: c.bg, color: c.white, minHeight: '100vh' }}>
      <Nav />
      <style>{`
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .listings-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .filter-bar    { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:12px; }
        .listing-card:hover .card-img { transform:scale(1.04); }
        select option  { background:#F2EFE9; color:#fff; }
        @media(max-width:900px){ .listings-grid{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:600px){ .listings-grid{grid-template-columns:1fr;} .filter-bar{grid-template-columns:1fr;} }
      `}</style>

      {/* ── PAGE HEADER ─────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', color: c.gold, textTransform: 'uppercase', marginBottom: 10 }}>Browse feed</div>
            <h1 style={{ fontSize: 'clamp(26px,4vw,38px)', color: c.white, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Off market listings</h1>
            <p style={{ color: c.muted, fontSize: 14 }}>
              Hidden from public portals. {!member && <Link href="/login" style={{ color: c.violet, textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>} to access full details and enquire.
            </p>
          </div>
          {member && (
            <Link href="/listings/new" style={{ background: `c.gold`, color: '#fff', padding: '10px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none', borderRadius: 8, boxShadow: '0 0 20px rgba(184,146,58,0.3)' }}>
              + New listing
            </Link>
          )}
        </div>

        {/* ── FILTER BAR ───────────────────── */}
        <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 28, backdropFilter: 'blur(12px)' }}>
          <div className="filter-bar" style={{ marginBottom: 14 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: c.muted, fontSize: 14, pointerEvents: 'none' }}>🔍</span>
              <input
                type="text"
                placeholder="Suburb, postcode or title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 36 }}
              />
            </div>
            <select value={filterState} onChange={e => setFilterState(e.target.value)} style={inputStyle}>
              <option>All States</option>
              {['QLD','NSW','VIC','WA','SA','TAS','ACT','NT'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={inputStyle}>
              <option>All Types</option>
              {['House','Apartment','Townhouse','Villa','Land','Acreage','Rural','Commercial'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={filterBeds} onChange={e => setFilterBeds(e.target.value)} style={inputStyle}>
              <option>Any beds</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+ beds</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: c.muted }}>
              <span style={{ color: c.white, fontWeight: 600 }}>{filtered.length}</span> listing{filtered.length !== 1 ? 's' : ''} found
            </span>
            {activeFilters.map(f => (
              <span key={f} style={{ fontSize: 11, color: c.violet, background: c.violetDim, border: `1px solid rgba(184,146,58,0.35)`, padding: '2px 10px', borderRadius: 20 }}>
                {f}
              </span>
            ))}
            {activeFilters.length > 0 && (
              <button onClick={() => { setFilterState('All States'); setFilterType('All Types'); setFilterBeds('Any beds'); setSearch('') }}
                style={{ fontSize: 11, color: c.muted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* ── GRID ─────────────────────────── */}
        {loading ? (
          <div className="listings-grid" style={{ marginBottom: 60 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: c.bg2, borderRadius: 14, overflow: 'hidden', border: `1px solid ${c.border}` }}>
                <div style={{ height: 200, background: `linear-gradient(90deg, ${c.bg3} 0%, ${c.bg4} 50%, ${c.bg3} 100%)`, backgroundSize: '400px 100%', animation: 'shimmer 1.4s infinite' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ height: 10, background: c.bg3, borderRadius: 4, marginBottom: 10, width: '60%' }} />
                  <div style={{ height: 16, background: c.bg3, borderRadius: 4, marginBottom: 10 }} />
                  <div style={{ height: 10, background: c.bg3, borderRadius: 4, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: c.bg2, borderRadius: 16, border: `1px solid ${c.border}`, marginBottom: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 20, color: c.white, fontWeight: 600, marginBottom: 8 }}>No listings found</div>
            <div style={{ fontSize: 14, color: c.muted }}>Try adjusting your search or clearing the filters</div>
          </div>
        ) : (
          <div className="listings-grid" style={{ marginBottom: 60 }}>
            <AnimatePresence>
              {filtered.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                  className="listing-card"
                  style={{ background: c.bg2, borderRadius: 14, overflow: 'hidden', border: `1px solid ${c.border}`, position: 'relative', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                >
                  {/* Save button */}
                  <button
                    onClick={e => toggleSave(l.id, e)}
                    style={{
                      position: 'absolute', top: 12, right: 12, zIndex: 2,
                      width: 34, height: 34, borderRadius: '50%',
                      background: saved.includes(l.id) ? c.goldDim : 'rgba(9,9,15,0.7)',
                      border: `1px solid ${saved.includes(l.id) ? c.gold : 'rgba(255,255,255,0.15)'}`,
                      color: saved.includes(l.id) ? c.gold : c.cream,
                      fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {saved.includes(l.id) ? '★' : '☆'}
                  </button>

                  <Link href={`/listings/${l.id}`} style={{ textDecoration: 'none' }}>
                    {/* Image */}
                    <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                      {l.images && l.images[0] ? (
                        <img
                          src={l.images[0]} alt={l.title}
                          className="card-img"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', display: 'block' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: c.bg3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ fontSize: 32, marginBottom: 8 }}>🏠</div>
                          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: c.muted, textTransform: 'uppercase' }}>No photo</div>
                        </div>
                      )}
                      {/* Badges */}
                      <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: 6 }}>
                        <span style={{ fontSize: 9, letterSpacing: '0.1em', background: c.goldDim, color: c.gold, border: `1px solid ${c.borderGold}`, padding: '3px 8px', borderRadius: 4, backdropFilter: 'blur(8px)' }}>OFF MARKET</span>
                        {l.property_type && (
                          <span style={{ fontSize: 9, letterSpacing: '0.1em', background: 'rgba(9,9,15,0.7)', color: c.cream, border: `1px solid ${c.border}`, padding: '3px 8px', borderRadius: 4, backdropFilter: 'blur(8px)' }}>{l.property_type}</span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '18px 20px 20px' }}>
                      <div style={{ fontSize: 10, letterSpacing: '0.25em', color: c.gold, textTransform: 'uppercase', marginBottom: 6 }}>
                        {l.suburb} · {l.state}
                      </div>
                      <div style={{ fontSize: 16, color: c.white, fontWeight: 600, marginBottom: 10, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{l.title}</div>

                      {/* Stats row */}
                      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                        {l.bedrooms  > 0 && <span style={{ fontSize: 12, color: c.cream }}>🛏 {l.bedrooms}</span>}
                        {l.bathrooms > 0 && <span style={{ fontSize: 12, color: c.cream }}>🛁 {l.bathrooms}</span>}
                        {l.car_spaces > 0 && <span style={{ fontSize: 12, color: c.cream }}>🚗 {l.car_spaces}</span>}
                        {l.land_size  && <span style={{ fontSize: 12, color: c.cream }}>📐 {l.land_size}</span>}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${c.border}` }}>
                        {l.price_guide
                          ? <span style={{ fontSize: 15, color: c.gold, fontWeight: 700 }}>{l.price_guide}</span>
                          : <span style={{ fontSize: 12, color: c.muted }}>Price on enquiry</span>
                        }
                        <span style={{ fontSize: 12, color: c.violet, fontWeight: 500 }}>View →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
