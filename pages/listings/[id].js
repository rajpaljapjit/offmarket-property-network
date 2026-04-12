import Nav from '../../components/Nav'
import toast from 'react-hot-toast'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
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
  violet:     '#9B6DFF',
  violetDim:  'rgba(155,109,255,0.1)',
  emerald:    '#00E5A0',
  white:      '#FFFFFF',
  cream:      '#D4CFFF',
  muted:      '#8888BB',
  border:     'rgba(155,109,255,0.15)',
  borderGold: 'rgba(255,209,102,0.2)',
}

export default function ListingDetail() {
  const router = useRouter()
  const { id } = router.query
  const [listing, setListing]               = useState(null)
  const [loading, setLoading]               = useState(true)
  const [member, setMember]                 = useState(null)
  const [enquirySent, setEnquirySent]       = useState(false)
  const [enquiryLoading, setEnquiryLoading] = useState(false)
  const [activePhoto, setActivePhoto]       = useState(0)
  const [lightboxOpen, setLightboxOpen]     = useState(false)
  const [lightboxIndex, setLightboxIndex]   = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (stored) setMember(JSON.parse(stored))
    if (id) fetchListing()
  }, [id])

  const fetchListing = async () => {
    const res = await fetch(`/api/listings/${id}`)
    const data = await res.json()
    if (data.listing) setListing(data.listing)
    setLoading(false)
  }

  const handleEnquiry = async () => {
    if (!member) { router.push('/login'); return }
    setEnquiryLoading(true)
    try {
      const memberRes = await fetch(`/api/listings/${listing.id}?withMember=1`)
      const memberData = await memberRes.json()
      const listingMember = memberData.member
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId:           listing.id,
          listingTitle:        listing.title,
          listingMemberId:     listing.member_id,
          listingMemberEmail:  listingMember?.email,
          enquirerId:          member.id,
          enquirerName:        `${member.firstName} ${member.lastName}`,
          enquirerAgency:      member.agency,
          enquirerUsername:    member.username,
          enquirerEmail:       member.email,
          enquirerMobile:      member.mobile,
        })
      })
      if (res.ok) { setEnquirySent(true); toast.success('Enquiry sent! The agent will be in touch.') }
      else toast.error('Failed to send enquiry.')
    } catch (err) { console.error(err) }
    setEnquiryLoading(false)
  }

  if (loading) return (
    <div style={{ background: c.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${c.border}`, borderTopColor: c.violet, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ color: c.muted, fontSize: 14 }}>Loading listing...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!listing) return (
    <div style={{ background: c.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
        <div style={{ color: c.white, fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Listing not found</div>
        <Link href="/listings" style={{ color: c.violet, textDecoration: 'none', fontSize: 14 }}>← Back to listings</Link>
      </div>
    </div>
  )

  const images = listing.images || []
  const stats = [
    { icon: '🛏', value: listing.bedrooms,   label: 'Bed' },
    { icon: '🛁', value: listing.bathrooms,  label: 'Bath' },
    { icon: '🚗', value: listing.car_spaces, label: 'Car' },
    { icon: '📐', value: listing.land_size,  label: 'Land' },
  ].filter(s => s.value)

  return (
    <div style={{ background: c.bg, minHeight: '100vh', color: c.white }}>
      <Nav />
      <style>{`
        .listing-grid { display:grid; grid-template-columns:1fr 360px; gap:32px; }
        .thumb:hover { opacity:1 !important; }
        @keyframes spin { to { transform:rotate(360deg) } }
        @media(max-width:900px) { .listing-grid { grid-template-columns:1fr; } }
      `}</style>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: 13 }}>
          <Link href="/listings" style={{ color: c.muted, textDecoration: 'none' }}>Listings</Link>
          <span style={{ color: c.border }}>›</span>
          <span style={{ color: c.cream }}>{listing.suburb}, {listing.state}</span>
        </div>

        <div className="listing-grid">

          {/* ── LEFT COLUMN ────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Photo gallery */}
            {images.length > 0 ? (
              <div style={{ marginBottom: 28 }}>
                <div style={{ borderRadius: 14, overflow: 'hidden', cursor: 'zoom-in', position: 'relative' }}
                  onClick={() => { setLightboxIndex(activePhoto); setLightboxOpen(true) }}>
                  <img
                    src={images[activePhoto]} alt={listing.title}
                    style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(13,10,26,0.75)', border: `1px solid ${c.border}`, borderRadius: 8, padding: '5px 12px', fontSize: 11, color: c.cream, backdropFilter: 'blur(8px)' }}>
                    🔍 {activePhoto + 1} / {images.length}
                  </div>
                </div>
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto', paddingBottom: 4 }}>
                    {images.map((img, i) => (
                      <img key={i} src={img} alt={`Photo ${i + 1}`} onClick={() => setActivePhoto(i)}
                        className="thumb"
                        style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', flexShrink: 0, opacity: activePhoto === i ? 1 : 0.45, border: `2px solid ${activePhoto === i ? c.gold : 'transparent'}`, transition: 'opacity 0.2s, border-color 0.2s' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ height: 380, background: c.bg3, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 28, border: `1px solid ${c.border}` }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
                <div style={{ fontSize: 12, color: c.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>No photos available</div>
              </div>
            )}

            {/* Title & location */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.3em', color: c.gold, textTransform: 'uppercase', marginBottom: 8 }}>
                {listing.suburb} · {listing.state} {listing.postcode && `· ${listing.postcode}`}
              </div>
              <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', color: c.white, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{listing.title}</h1>
              {listing.street_address && (
                <div style={{ fontSize: 14, color: c.muted }}>{listing.street_address}, {listing.suburb} {listing.state}</div>
              )}
            </div>

            {/* Stats chips */}
            {stats.length > 0 && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                {stats.map(({ icon, value, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 10, padding: '10px 18px' }}>
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: 16, color: c.white, fontWeight: 700, lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: 10, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Price guide */}
            {listing.price_guide && (
              <div style={{ background: c.goldDim, border: `1px solid ${c.borderGold}`, borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.2em', color: c.muted, textTransform: 'uppercase', marginBottom: 4 }}>Price guide</div>
                  <div style={{ fontSize: 26, color: c.gold, fontWeight: 700, letterSpacing: '-0.01em' }}>{listing.price_guide}</div>
                </div>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 12, padding: '22px 24px', marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.25em', color: c.violet, textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>About this property</div>
                <p style={{ fontSize: 14, color: c.cream, lineHeight: 1.8 }}>{listing.description}</p>
              </div>
            )}

            {/* Property details */}
            <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 12, padding: '22px 24px' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.25em', color: c.violet, textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Property details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Type', listing.property_type],
                  ['State', listing.state],
                  ['Bedrooms', listing.bedrooms],
                  ['Bathrooms', listing.bathrooms],
                  ['Car spaces', listing.car_spaces],
                  ['Land size', listing.land_size],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} style={{ background: c.bg3, borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, color: c.white, fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT SIDEBAR ──────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 16, padding: 28, position: 'sticky', top: 80 }}>

              {/* OFF MARKET badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: c.goldDim, border: `1px solid ${c.borderGold}`, borderRadius: 20, padding: '4px 12px', fontSize: 10, color: c.gold, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.gold, display: 'inline-block' }} />
                Off market · Private listing
              </div>

              {/* Listed by */}
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${c.border}` }}>
                <div style={{ fontSize: 10, letterSpacing: '0.25em', color: c.muted, textTransform: 'uppercase', marginBottom: 12 }}>Listed by</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: c.violetDim, border: `1px solid rgba(155,109,255,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: c.violet, flexShrink: 0 }}>
                    {listing.first_name?.[0]}{listing.last_name?.[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, color: c.white, fontWeight: 600 }}>{listing.first_name} {listing.last_name}</div>
                    <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{listing.agency}</div>
                    <div style={{ fontSize: 10, color: c.emerald, marginTop: 4 }}>✓ Verified member</div>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  ['Beds', listing.bedrooms || '—'],
                  ['Baths', listing.bathrooms || '—'],
                  ['Cars', listing.car_spaces || '—'],
                  ['Type', listing.property_type || '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: c.bg3, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, color: c.white, fontWeight: 700, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 10, color: c.muted, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Price in sidebar */}
              {listing.price_guide && (
                <div style={{ background: c.goldDim, border: `1px solid ${c.borderGold}`, borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Price guide</div>
                  <div style={{ fontSize: 22, color: c.gold, fontWeight: 700 }}>{listing.price_guide}</div>
                </div>
              )}

              {/* CTA */}
              {member ? (
                enquirySent ? (
                  <div style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.25)', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, marginBottom: 6 }}>✓</div>
                    <div style={{ fontSize: 14, color: c.emerald, fontWeight: 600 }}>Enquiry sent!</div>
                    <div style={{ fontSize: 12, color: c.muted, marginTop: 4 }}>The agent will be in touch.</div>
                  </div>
                ) : (
                  <button
                    onClick={handleEnquiry}
                    disabled={enquiryLoading}
                    style={{
                      width: '100%', background: enquiryLoading ? 'rgba(155,109,255,0.4)' : `linear-gradient(135deg, ${c.violet}, ${c.gold})`,
                      border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, padding: '14px',
                      borderRadius: 10, cursor: enquiryLoading ? 'not-allowed' : 'pointer',
                      boxShadow: enquiryLoading ? 'none' : '0 0 28px rgba(155,109,255,0.3)',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {enquiryLoading ? 'Sending...' : 'Send Enquiry →'}
                  </button>
                )
              ) : (
                <Link href="/login" style={{ display: 'block', background: `linear-gradient(135deg, ${c.violet}, ${c.gold})`, color: '#fff', fontSize: 15, fontWeight: 700, padding: '14px', textAlign: 'center', textDecoration: 'none', borderRadius: 10, boxShadow: '0 0 28px rgba(155,109,255,0.3)' }}>
                  Sign in to enquire →
                </Link>
              )}
              <p style={{ fontSize: 11, color: c.muted, textAlign: 'center', marginTop: 12 }}>Members only · Verified professionals</p>
            </div>
          </motion.div>
        </div>
      </div>

      {lightboxOpen && images.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images.map(src => ({ src }))}
          styles={{ container: { backgroundColor: 'rgba(0,0,0,0.96)' } }}
        />
      )}
    </div>
  )
}
