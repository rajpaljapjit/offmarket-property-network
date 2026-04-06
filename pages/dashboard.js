import Nav from '../components/Nav'
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
const red = '#E24B4A'

export default function Dashboard() {
  const router = useRouter()
  const [member, setMember] = useState(null)
  const [listings, setListings] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [activeSection, setActiveSection] = useState('Overview')

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (!stored) { router.push('/login'); return }
    const m = JSON.parse(stored)
    setMember(m)
    fetchListings(m.id)
  }, [])

  const fetchListings = async (memberId) => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://jmjtcmfjknmdnlgxudfk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
      )
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false })
      if (!error) setListings(data || [])
    } catch (err) {
      console.error('Error fetching listings:', err)
    }
    setLoadingListings(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('member')
    router.push('/login')
  }

  if (!member) return <div style={{background:black,minHeight:'100vh'}}></div>

  const menuItems = [
    {section:'Dashboard',items:['Overview','My listings','Browse feed','Saved']},
    {section:'Connections',items:['Enquiries','Messages','Agents']},
    {section:'Account',items:['My profile','Subscription','Settings']},
  ]

  return (
    <div style={{background:black,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        @media(max-width:768px){
          .dash-grid{grid-template-columns:1fr !important;}
          .dash-sidebar{display:none !important;}
          .metrics-grid{grid-template-columns:1fr 1fr !important;}
        }
      `}</style>
      <div className="dash-grid" style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 64px)'}}>
        <aside className="dash-sidebar" style={{background:black2,borderRight:`1px solid ${border}`,padding:'24px 0'}}>
          {menuItems.map(g=>(
            <div key={g.section} style={{paddingBottom:24,marginBottom:24,borderBottom:`1px solid ${border}`}}>
              <div style={{fontSize:9,letterSpacing:'0.35em',color:gold,textTransform:'uppercase',padding:'0 20px',marginBottom:10}}>{g.section}</div>
              {g.items.map(item=>{
                const isActive = item === activeSection
                return (
                  <div key={item} onClick={()=>setActiveSection(item)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 20px',fontSize:13,color:isActive?white:muted,cursor:'pointer',background:isActive?'rgba(201,168,76,0.05)':'none',borderLeft:isActive?`2px solid ${gold}`:'2px solid transparent'}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:isActive?gold:border,flexShrink:0}}/>
                    {item}
                  </div>
                )
              })}
            </div>
          ))}
          <div style={{padding:'0 20px'}}>
            <button onClick={handleLogout} style={{background:'none',border:`1px solid ${border}`,color:muted,fontSize:12,padding:'8px 16px',cursor:'pointer',width:'100%'}}>Sign out</button>
          </div>
        </aside>

        <main style={{padding:32,overflowY:'auto'}}>

          {/* OVERVIEW */}
          {activeSection === 'Overview' && (
            <>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12}}>
                <div>
                  <div style={{fontSize:10,letterSpacing:'0.4em',color:gold,textTransform:'uppercase',marginBottom:4}}>Member dashboard</div>
                  <h2 style={{fontSize:22,color:white,fontWeight:600}}>Good morning, {member.firstName}</h2>
                </div>
                <Link href="/listings/new" style={{background:gold,color:'#000',fontSize:13,fontWeight:500,padding:'8px 20px',textDecoration:'none'}}>+ New Listing</Link>
              </div>
              <div className="metrics-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
                {[['Active listings',listings.filter(l=>l.status==='active').length],['Total listings',listings.length],['Connections','0'],['Off market sold','0']].map(([label,val])=>(
                  <div key={label} style={{background:black3,border:`1px solid ${border}`,padding:20}}>
                    <div style={{fontSize:10,letterSpacing:'0.25em',color:muted,textTransform:'uppercase',marginBottom:8}}>{label}</div>
                    <div style={{fontSize:28,color:white,fontWeight:600}}>{val}</div>
                  </div>
                ))}
              </div>
              {listings.length > 0 ? (
                <>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                    <h3 style={{fontSize:16,color:white,fontWeight:600}}>My recent listings</h3>
                    <button onClick={()=>setActiveSection('My listings')} style={{background:'none',border:`1px solid ${border}`,color:'#D4D8DF',fontSize:12,padding:'6px 14px',cursor:'pointer'}}>View all</button>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:1,background:border}}>
                    {listings.slice(0,3).map(l=>(
                      <div key={l.id} style={{background:black2,display:'grid',gridTemplateColumns:'80px 1fr auto',gap:16,alignItems:'center',padding:16}}>
                        {l.images && l.images[0] ? <img src={l.images[0]} alt={l.title} style={{width:80,height:56,objectFit:'cover',opacity:0.8}}/> : <div style={{width:80,height:56,background:black4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:muted}}>No img</div>}
                        <div>
                          <div style={{fontSize:9,letterSpacing:'0.25em',color:gold,textTransform:'uppercase',marginBottom:3}}>{l.suburb} · {l.state}</div>
                          <div style={{fontSize:14,color:white,marginBottom:4}}>{l.title}</div>
                          <div style={{fontSize:11,color:muted}}>{l.bedrooms} bed · {l.bathrooms} bath · {l.property_type}</div>
                        </div>
                        <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',padding:'3px 10px',border:`1px solid`,color:gold,borderColor:'#8A6A1F'}}>{l.status}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{background:black3,border:`1px solid ${border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:white,marginBottom:12,fontWeight:600}}>No listings yet</div>
                  <p style={{fontSize:13,color:muted,marginBottom:20}}>Upload your first off market listing to start connecting with buyers agents.</p>
                  <Link href="/listings/new" style={{background:gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Upload a listing</Link>
                </div>
              )}
            </>
          )}

          {/* MY LISTINGS */}
          {activeSection === 'My listings' && (
            <>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
                <div>
                  <div style={{fontSize:10,letterSpacing:'0.4em',color:gold,textTransform:'uppercase',marginBottom:4}}>My listings</div>
                  <h2 style={{fontSize:22,color:white,fontWeight:600}}>All your listings</h2>
                </div>
                <Link href="/listings/new" style={{background:gold,color:'#000',fontSize:13,fontWeight:500,padding:'8px 20px',textDecoration:'none'}}>+ New Listing</Link>
              </div>
              {loadingListings ? (
                <div style={{color:muted,fontSize:14}}>Loading listings...</div>
              ) : listings.length === 0 ? (
                <div style={{background:black3,border:`1px solid ${border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:white,marginBottom:12,fontWeight:600}}>No listings yet</div>
                  <Link href="/listings/new" style={{background:gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Upload a listing</Link>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:1,background:border}}>
                  {listings.map(l=>(
                    <div key={l.id} style={{background:black2,display:'grid',gridTemplateColumns:'120px 1fr auto',gap:20,alignItems:'center',padding:20}}>
                      {l.images && l.images[0] ? <img src={l.images[0]} alt={l.title} style={{width:120,height:80,objectFit:'cover',opacity:0.8}}/> : <div style={{width:120,height:80,background:black4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:muted}}>No image</div>}
                      <div>
                        <div style={{fontSize:9,letterSpacing:'0.25em',color:gold,textTransform:'uppercase',marginBottom:4}}>{l.suburb} · {l.state} · {l.postcode}</div>
                        <div style={{fontSize:16,color:white,marginBottom:6,fontWeight:600}}>{l.title}</div>
                        <div style={{fontSize:12,color:muted,marginBottom:4}}>{l.street_address}</div>
                        <div style={{fontSize:12,color:muted}}>{l.bedrooms} bed · {l.bathrooms} bath · {l.car_spaces} car · {l.property_type}</div>
                        {l.price_guide && <div style={{fontSize:13,color:gold,marginTop:6}}>{l.price_guide}</div>}
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
                        <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',padding:'3px 10px',border:`1px solid`,color:gold,borderColor:'#8A6A1F'}}>{l.status}</div>
                        <div style={{fontSize:11,color:muted}}>{new Date(l.created_at).toLocaleDateString('en-AU')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* MY PROFILE */}
          {activeSection === 'My profile' && (
            <>
              <div style={{marginBottom:28}}>
                <div style={{fontSize:10,letterSpacing:'0.4em',color:gold,textTransform:'uppercase',marginBottom:4}}>Account</div>
                <h2 style={{fontSize:22,color:white,fontWeight:600}}>My profile</h2>
              </div>
              <div style={{background:black3,border:`1px solid ${border}`,padding:32,maxWidth:600}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                  {[['First name',member.firstName],['Last name',member.lastName],['Email',member.email],['Username',member.username],['Agency',member.agency],['Role',member.role],['State',member.state],['Plan',member.plan],['Status',member.status]].map(([label,val])=>(
                    <div key={label}>
                      <div style={{fontSize:10,letterSpacing:'0.2em',color:muted,textTransform:'uppercase',marginBottom:6}}>{label}</div>
                      <div style={{fontSize:14,color:label==='Status'&&val==='pending'?red:white,padding:'10px 12px',background:black4,border:`1px solid ${border}`,textTransform:label==='Status'?'capitalize':'none'}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* COMING SOON */}
          {!['Overview','My listings','My profile'].includes(activeSection) && (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:300,flexDirection:'column',gap:12}}>
              <div style={{fontSize:32}}>🔒</div>
              <div style={{fontSize:16,color:white,fontWeight:600}}>{activeSection}</div>
              <div style={{fontSize:13,color:muted}}>Coming soon</div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
