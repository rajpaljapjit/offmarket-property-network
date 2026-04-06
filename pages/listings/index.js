import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const gold = '#C9A84C'
const black = '#0A0A0A'
const black2 = '#111111'
const black3 = '#1A1A1A'
const black4 = '#242424'
const white = '#F5F3EE'
const muted = '#7A7A7A'
const border = '#2A2A2A'

export default function Listings() {
  const router = useRouter()
  const [listings, setListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [member, setMember] = useState(null)
  const [saved, setSaved] = useState([])
  const [search, setSearch] = useState('')
  const [filterState, setFilterState] = useState('All States')
  const [filterType, setFilterType] = useState('All Types')
  const [filterBeds, setFilterBeds] = useState('Any beds')

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (stored) {
      const m = JSON.parse(stored)
      setMember(m)
      fetchSaved(m.id)
    }
    fetchListings()
  }, [])

  useEffect(() => {
    let results = listings
    if (search) {
      const s = search.toLowerCase()
      results = results.filter(l =>
        l.suburb?.toLowerCase().includes(s) ||
        l.title?.toLowerCase().includes(s) ||
        l.street_address?.toLowerCase().includes(s) ||
        l.postcode?.includes(s)
      )
    }
    if (filterState !== 'All States') results = results.filter(l => l.state === filterState)
    if (filterType !== 'All Types') results = results.filter(l => l.property_type === filterType)
    if (filterBeds !== 'Any beds') results = results.filter(l => l.bedrooms >= parseInt(filterBeds))
    setFiltered(results)
  }, [search, filterState, filterType, filterBeds, listings])

  const fetchListings = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://jmjtcmfjknmdnlgxudfk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
      )
      const { data } = await supabase.from('listings').select('*').eq('status', 'active').order('created_at', { ascending: false })
      setListings(data || [])
      setFiltered(data || [])
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const fetchSaved = async (memberId) => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://jmjtcmfjknmdnlgxudfk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
      )
      const { data } = await supabase.from('saved_listings').select('listing_id').eq('member_id', memberId)
      setSaved((data || []).map(s => s.listing_id))
    } catch (err) { console.error(err) }
  }

  const toggleSave = async (listingId) => {
    if (!member) { router.push('/login'); return }
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://jmjtcmfjknmdnlgxudfk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
      )
      if (saved.includes(listingId)) {
        await supabase.from('saved_listings').delete().eq('member_id', member.id).eq('listing_id', listingId)
        setSaved(saved.filter(id => id !== listingId))
      } else {
        await supabase.from('saved_listings').insert([{ member_id: member.id, listing_id: listingId }])
        setSaved([...saved, listingId])
      }
    } catch (err) { console.error(err) }
  }

  const input = {background:black3,border:`1px solid ${border}`,color:white,fontSize:13,padding:'10px 14px'}

  return (
    <div style={{background:black,color:white,minHeight:'100vh'}}>
      <Nav/>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'48px 20px 60px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:gold,textTransform:'uppercase',marginBottom:12}}>Browse feed</div>
        <h1 style={{fontSize:'clamp(28px,5vw,40px)',color:white,marginBottom:12,fontWeight:600}}>Off market listings</h1>
        <p style={{color:muted,marginBottom:32}}>All listings are hidden from public portals. {!member && <Link href="/login" style={{color:gold,textDecoration:'none'}}>Sign in</Link>} to access full details and enquire.</p>

        {/* Search & filters */}
        <div style={{background:black3,border:`1px solid ${border}`,padding:'20px 24px',marginBottom:32}}>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:12}}>
            <input
              type="text"
              placeholder="Search by suburb, postcode or title..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
              style={{...input,width:'100%',boxSizing:'border-box'}}
            />
            <select value={filterState} onChange={e=>setFilterState(e.target.value)} style={{...input,padding:'10px 14px'}}>
              <option>All States</option>
              <option>QLD</option><option>NSW</option><option>VIC</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option>
            </select>
            <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{...input,padding:'10px 14px'}}>
              <option>All Types</option>
              <option>House</option><option>Apartment</option><option>Townhouse</option><option>Villa</option><option>Land</option><option>Acreage</option><option>Rural</option><option>Commercial</option>
            </select>
            <select value={filterBeds} onChange={e=>setFilterBeds(e.target.value)} style={{...input,padding:'10px 14px'}}>
              <option>Any beds</option>
              <option value="1">1+ beds</option>
              <option value="2">2+ beds</option>
              <option value="3">3+ beds</option>
              <option value="4">4+ beds</option>
              <option value="5">5+ beds</option>
            </select>
          </div>
          <div style={{fontSize:12,color:muted,marginTop:12}}>{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</div>
        </div>

        {/* Listings grid */}
        {loading ? (
          <div style={{textAlign:'center',padding:'60px 0',color:muted}}>Loading listings...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 0'}}>
            <div style={{fontSize:32,marginBottom:16}}>🔍</div>
            <div style={{fontSize:16,color:white,marginBottom:8}}>No listings found</div>
            <div style={{fontSize:13,color:muted}}>Try adjusting your search or filters</div>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:border}}>
            {filtered.map(l=>(
              <div key={l.id} style={{background:black2,position:'relative'}}>
                <button onClick={()=>toggleSave(l.id)} style={{position:'absolute',top:12,right:12,zIndex:2,background:'rgba(0,0,0,0.7)',border:'none',color:saved.includes(l.id)?gold:white,fontSize:18,cursor:'pointer',width:36,height:36,borderRadius:'50%'}}>
                  {saved.includes(l.id) ? '★' : '☆'}
                </button>
                <Link href={`/listings/${l.id}`} style={{textDecoration:'none'}}>
                  {l.images && l.images[0] ? (
                    <img src={l.images[0]} alt={l.title} style={{width:'100%',height:200,objectFit:'cover',opacity:0.85}}/>
                  ) : (
                    <div style={{height:200,background:black4,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                      <div style={{fontSize:32,marginBottom:8}}>🏠</div>
                      <div style={{fontSize:10,letterSpacing:'0.2em',color:muted,textTransform:'uppercase'}}>No photo</div>
                    </div>
                  )}
                  <div style={{padding:20}}>
                    <div style={{fontSize:9,letterSpacing:'0.35em',color:gold,textTransform:'uppercase',marginBottom:6}}>{l.suburb} · {l.state}</div>
                    <div style={{fontSize:16,color:white,marginBottom:8,fontWeight:600}}>{l.title}</div>
                    <div style={{display:'flex',gap:16,marginBottom:8}}>
                      {l.bedrooms > 0 && <span style={{fontSize:12,color:muted}}>🛏 {l.bedrooms}</span>}
                      {l.bathrooms > 0 && <span style={{fontSize:12,color:muted}}>🛁 {l.bathrooms}</span>}
                      {l.car_spaces > 0 && <span style={{fontSize:12,color:muted}}>🚗 {l.car_spaces}</span>}
                    </div>
                    {l.price_guide && <div style={{fontSize:13,color:gold,marginBottom:8}}>{l.price_guide}</div>}
                    <div style={{fontSize:10,color:muted,textTransform:'uppercase'}}>{l.property_type} · Private listing 🔒</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}
