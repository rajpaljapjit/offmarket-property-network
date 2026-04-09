import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#C9A84C',bg:'#1B2A1B',bg2:'#162016',bg3:'#1F2E1F',bg4:'#243524',white:'#C9A84C',muted:'#8BA888',mid:'#E8E8E8',border:'#2D4A2D'}

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
    if (stored) { const m = JSON.parse(stored); setMember(m); fetchSaved(m.id) }
    fetchListings()
  }, [])

  useEffect(() => {
    let results = listings
    if (search) { const q = search.toLowerCase(); results = results.filter(l => l.suburb?.toLowerCase().includes(q) || l.title?.toLowerCase().includes(q) || l.street_address?.toLowerCase().includes(q) || l.postcode?.includes(q)) }
    if (filterState !== 'All States') results = results.filter(l => l.state === filterState)
    if (filterType !== 'All Types') results = results.filter(l => l.property_type === filterType)
    if (filterBeds !== 'Any beds') results = results.filter(l => l.bedrooms >= parseInt(filterBeds))
    setFiltered(results)
  }, [search, filterState, filterType, filterBeds, listings])

  const getSupabase = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    return createClient('https://jmjtcmfjknmdnlgxudfk.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo')
  }

  const fetchListings = async () => {
    const db = await getSupabase()
    const { data } = await db.from('listings').select('*').eq('status','active').order('created_at',{ascending:false})
    setListings(data||[]); setFiltered(data||[])
    setLoading(false)
  }

  const fetchSaved = async (memberId) => {
    const db = await getSupabase()
    const { data } = await db.from('saved_listings').select('listing_id').eq('member_id',memberId)
    setSaved((data||[]).map(s=>s.listing_id))
  }

  const toggleSave = async (listingId) => {
    if (!member) { router.push('/login'); return }
    const db = await getSupabase()
    if (saved.includes(listingId)) {
      await db.from('saved_listings').delete().eq('member_id',member.id).eq('listing_id',listingId)
      setSaved(saved.filter(id=>id!==listingId))
    } else {
      await db.from('saved_listings').insert([{member_id:member.id,listing_id:listingId}])
      setSaved([...saved,listingId])
    }
  }

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.white,fontSize:13,padding:'10px 14px'}

  return (
    <div style={{background:s.bg,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        .listings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#2D4A2D;}
        .filter-bar{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:12px;}
        @media(max-width:900px){.listings-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:600px){.listings-grid{grid-template-columns:1fr;}.filter-bar{grid-template-columns:1fr;}}
      `}</style>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'48px 20px 60px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Browse feed</div>
        <h1 style={{fontSize:'clamp(28px,5vw,40px)',color:s.white,marginBottom:12,fontWeight:600}}>Off market listings</h1>
        <p style={{color:s.muted,marginBottom:32}}>All listings are hidden from public portals. {!member&&<Link href="/login" style={{color:s.gold,textDecoration:'none'}}>Sign in</Link>} to access full details and enquire.</p>

        <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:'20px 24px',marginBottom:32}}>
          <div className="filter-bar">
            <input type="text" placeholder="Search by suburb, postcode or title..." value={search} onChange={e=>setSearch(e.target.value)} style={{...input,width:'100%',boxSizing:'border-box'}}/>
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
              <option value="1">1+ beds</option><option value="2">2+ beds</option><option value="3">3+ beds</option><option value="4">4+ beds</option><option value="5">5+ beds</option>
            </select>
          </div>
          <div style={{fontSize:12,color:s.muted,marginTop:12}}>{filtered.length} listing{filtered.length!==1?'s':''} found</div>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'60px 0',color:s.muted}}>Loading listings...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 0'}}>
            <div style={{fontSize:32,marginBottom:16}}>🔍</div>
            <div style={{fontSize:16,color:s.white,marginBottom:8}}>No listings found</div>
            <div style={{fontSize:13,color:s.muted}}>Try adjusting your search or filters</div>
          </div>
        ) : (
          <div className="listings-grid">
            {filtered.map(l=>(
              <div key={l.id} style={{background:s.bg2,position:'relative'}}>
                <button onClick={()=>toggleSave(l.id)} style={{position:'absolute',top:12,right:12,zIndex:2,background:'rgba(10,15,30,0.8)',border:'none',color:saved.includes(l.id)?s.gold:s.white,fontSize:18,cursor:'pointer',width:36,height:36,borderRadius:'50%'}}>
                  {saved.includes(l.id)?'★':'☆'}
                </button>
                <Link href={`/listings/${l.id}`} style={{textDecoration:'none'}}>
                  {l.images&&l.images[0]?(
                    <img src={l.images[0]} alt={l.title} style={{width:'100%',height:200,objectFit:'cover',opacity:0.85}}/>
                  ):(
                    <div style={{height:200,background:s.bg4,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                      <div style={{fontSize:32,marginBottom:8}}>🏠</div>
                      <div style={{fontSize:10,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>No photo</div>
                    </div>
                  )}
                  <div style={{padding:20}}>
                    <div style={{fontSize:9,letterSpacing:'0.35em',color:s.gold,textTransform:'uppercase',marginBottom:6}}>{l.suburb} · {l.state}</div>
                    <div style={{fontSize:16,color:s.white,marginBottom:8,fontWeight:600}}>{l.title}</div>
                    <div style={{display:'flex',gap:16,marginBottom:8}}>
                      {l.bedrooms>0&&<span style={{fontSize:12,color:s.muted}}>🛏 {l.bedrooms}</span>}
                      {l.bathrooms>0&&<span style={{fontSize:12,color:s.muted}}>🛁 {l.bathrooms}</span>}
                      {l.car_spaces>0&&<span style={{fontSize:12,color:s.muted}}>🚗 {l.car_spaces}</span>}
                    </div>
                    {l.price_guide&&<div style={{fontSize:13,color:s.gold,marginBottom:8}}>{l.price_guide}</div>}
                    <div style={{fontSize:10,color:s.muted,textTransform:'uppercase'}}>{l.property_type} · Private listing 🔒</div>
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
