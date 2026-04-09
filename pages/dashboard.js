import { format, formatDistanceToNow } from 'date-fns'
import Nav from '../components/Nav'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#C9A84C',bg:'#1B2A1B',bg2:'#162016',bg3:'#1F2E1F',bg4:'#243524',white:'#C9A84C',muted:'#8BA888',mid:'#E8E8E8',border:'#2D4A2D',red:'#E24B4A'}

function FavouriteAgents({member, s}) {
  const [favs, setFavs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (member) fetchFavs()
  }, [member])

  const fetchFavs = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient('https://jmjtcmfjknmdnlgxudfk.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo')
      const { data } = await supabase.from('favourite_agents').select('*').eq('member_id', member.id)
      setFavs(data||[])
    } catch(err) { console.error(err) }
    setLoading(false)
  }

  const removeFav = async (agentId) => {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient('https://jmjtcmfjknmdnlgxudfk.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo')
    await supabase.from('favourite_agents').delete().eq('member_id', member.id).eq('agent_id', agentId)
    setFavs(favs.filter(f=>f.agent_id!==agentId))
  }

  if (loading) return <div style={{color:s.muted,padding:40,textAlign:'center'}}>Loading...</div>

  return (
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
        <h2 style={{fontSize:22,color:s.white,fontWeight:600}}>Favourite agents</h2>
        <Link href="/agents" style={{background:s.gold,color:'#000',fontSize:13,fontWeight:500,padding:'8px 20px',textDecoration:'none'}}>Browse agents</Link>
      </div>
      {favs.length === 0 ? (
        <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32,textAlign:'center'}}>
          <div style={{fontSize:32,marginBottom:16}}>⭐</div>
          <div style={{fontSize:14,color:s.white,fontWeight:600,marginBottom:8}}>No favourite agents yet</div>
          <div style={{fontSize:13,color:s.muted,marginBottom:20}}>Browse the agent directory and star agents you work with frequently.</div>
          <Link href="/agents" style={{background:s.gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Browse agents</Link>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:1,background:s.border}}>
          {favs.map(f=>(
            <div key={f.id} style={{background:s.bg2,display:'grid',gridTemplateColumns:'48px 1fr auto',gap:16,alignItems:'center',padding:'16px 20px'}}>
              <div style={{width:48,height:48,borderRadius:'50%',background:s.bg4,border:`1px solid ${s.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:s.gold,fontWeight:600}}>
                {f.agent_name?.[0]}
              </div>
              <div>
                <div style={{fontSize:14,color:s.white,fontWeight:600,marginBottom:2}}>{f.agent_name}</div>
                <div style={{fontSize:12,color:s.gold,marginBottom:2}}>{f.agent_agency}</div>
                <div style={{fontSize:11,color:s.muted}}>@{f.agent_username} · {f.agent_role} · {f.agent_state}</div>
              </div>
              <button onClick={()=>removeFav(f.agent_id)} style={{background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:11,padding:'6px 12px',cursor:'pointer'}}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [member, setMember] = useState(null)
  const [listings, setListings] = useState([])
  const [saved, setSaved] = useState([])
  const [enquiriesSent, setEnquiriesSent] = useState([])
  const [enquiriesReceived, setEnquiriesReceived] = useState([])
  const [messages, setMessages] = useState([])
  const [activeSection, setActiveSection] = useState('Overview')
  const [activeEnquiry, setActiveEnquiry] = useState(null)
  const [messageText, setMessageText] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (!stored) { router.push('/login'); return }
    
    // Session expiry - 8 hours
    const sessionTime = localStorage.getItem('sessionTime')
    const EIGHT_HOURS = 1 * 60 * 60 * 1000
    if (sessionTime && Date.now() - parseInt(sessionTime) > EIGHT_HOURS) {
      localStorage.removeItem('member')
      localStorage.removeItem('sessionTime')
      router.push('/login')
      return
    }
    const m = JSON.parse(stored)
    setMember(m)
    fetchAll(m)
    // Refresh member status from Supabase
    refreshMember(m.id)
  }, [])

  const refreshMember = async (id) => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://jmjtcmfjknmdnlgxudfk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
      )
      const { data } = await supabase.from('members').select('*').eq('id', id).single()
      
      // If member not found or suspended/deleted - kick them out
      if (!data) {
        localStorage.removeItem('member')
        localStorage.removeItem('sessionTime')
        router.push('/login?reason=deleted')
        return
      }
      
      if (data.status === 'suspended' || data.status === 'rejected') {
        localStorage.removeItem('member')
        localStorage.removeItem('sessionTime')
        router.push('/login?reason=suspended')
        return
      }

      const updated = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        username: data.username,
        agency: data.agency,
        role: data.role,
        state: data.state,
        plan: data.plan,
        status: data.status,
        mobile: data.mobile,
      }
      localStorage.setItem('member', JSON.stringify(updated))
      setMember(updated)
    } catch(err) { console.error('Refresh error:', err) }
  }

  const getSupabase = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(
      'https://jmjtcmfjknmdnlgxudfk.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
    )
  }

  const fetchAll = async (m) => {
    const db = await getSupabase()
    const [l, sv, es, er] = await Promise.all([
      db.from('listings').select('*').eq('member_id', m.id).order('created_at', { ascending: false }),
      db.from('saved_listings').select('*, listings(*)').eq('member_id', m.id),
      db.from('enquiries').select('*').eq('enquirer_id', m.id).order('created_at', { ascending: false }),
      db.from('enquiries').select('*').eq('listing_member_id', m.id).order('created_at', { ascending: false }),
    ])
    setListings(l.data || [])
    setSaved(sv.data || [])
    setEnquiriesSent(es.data || [])
    setEnquiriesReceived(er.data || [])
  }

  const fetchMessages = async (enquiryId) => {
    const db = await getSupabase()
    const { data } = await db.from('messages').select('*').eq('enquiry_id', enquiryId).order('created_at', { ascending: true })
    setMessages(data || [])
  }

  const sendMessage = async () => {
    if (!messageText.trim() || !activeEnquiry) return
    const db = await getSupabase()
    await db.from('messages').insert([{
      enquiry_id: activeEnquiry.id,
      sender_id: member.id,
      sender_name: `${member.firstName} ${member.lastName}`,
      sender_username: member.username,
      message: messageText.trim(),
    }])
    setMessageText('')
    fetchMessages(activeEnquiry.id)
  }

  const handleLogout = () => {
    localStorage.removeItem('member')
    router.push('/login')
  }

  if (!member) return <div style={{background:s.bg,minHeight:'100vh'}}></div>

  const menuItems = [
    {section:'Dashboard',items:['Overview','My listings','Browse feed','Saved']},
    {section:'Connections',items:['Enquiries received','Enquiries sent','Messages','Favourite agents']},
    {section:'Account',items:['My profile','Subscription','Settings']},
  ]

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}

  const ListingCard = ({l}) => (
    <div style={{background:s.bg2,display:'grid',gridTemplateColumns:'120px 1fr auto',gap:20,alignItems:'center',padding:20}}>
      <Link href={`/listings/${l.id}`} style={{textDecoration:'none'}}>
        {l.images&&l.images[0]?<img src={l.images[0]} alt={l.title} style={{width:120,height:80,objectFit:'cover',opacity:0.8}}/>:<div style={{width:120,height:80,background:s.bg4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:s.muted}}>No image</div>}
      </Link>
      <div>
        <div style={{fontSize:9,letterSpacing:'0.25em',color:s.gold,textTransform:'uppercase',marginBottom:4}}>{l.suburb} · {l.state} · {l.postcode}</div>
        <Link href={`/listings/${l.id}`} style={{textDecoration:'none'}}><div style={{fontSize:16,color:s.white,marginBottom:6,fontWeight:600}}>{l.title}</div></Link>
        <div style={{fontSize:12,color:s.muted,marginBottom:4}}>{l.street_address}</div>
        <div style={{fontSize:12,color:s.muted}}>{l.bedrooms} bed · {l.bathrooms} bath · {l.property_type}</div>
        {l.price_guide&&<div style={{fontSize:13,color:s.gold,marginTop:6}}>{l.price_guide}</div>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
        <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',padding:'3px 10px',border:`1px solid`,color:l.status==='sold'?s.muted:s.gold,borderColor:l.status==='sold'?s.border:'#8A6A1F'}}>{l.status}</div>
        <div style={{fontSize:11,color:s.muted}}>{l.created_at ? format(new Date(l.created_at), 'dd MMM yyyy') : 'N/A'}</div>
        <Link href={`/listings/edit/${l.id}`} style={{fontSize:11,color:s.gold,textDecoration:'none',border:`1px solid ${s.border}`,padding:'4px 10px'}}>Edit →</Link>
      </div>
    </div>
  )

  return (
    <div style={{background:s.bg,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        @media(max-width:768px){
          .dash-grid{grid-template-columns:1fr !important;}
          .dash-sidebar{display:none !important;}
          .metrics-grid{grid-template-columns:1fr 1fr !important;}
          .listing-card{grid-template-columns:1fr !important;}
          .listing-card img{width:100% !important;height:160px !important;}
        }
      `}</style>
      {/* Mobile bottom nav */}
      <style>{`
        .mobile-nav{display:none;}
        @media(max-width:768px){
          .mobile-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:#162016;border-top:1px solid #2D4A2D;z-index:100;padding:8px 0;}
          .mobile-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;cursor:pointer;border:none;background:none;}
          .main-content{padding-bottom:80px !important;}
        }
      `}</style>
      <div className="dash-grid" style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 64px)'}}>
        <aside className="dash-sidebar" style={{background:s.bg2,borderRight:`1px solid ${s.border}`,padding:'24px 0'}}>
          {menuItems.map(g=>(
            <div key={g.section} style={{paddingBottom:24,marginBottom:24,borderBottom:`1px solid ${s.border}`}}>
              <div style={{fontSize:9,letterSpacing:'0.35em',color:s.gold,textTransform:'uppercase',padding:'0 20px',marginBottom:10}}>{g.section}</div>
              {g.items.map(item=>{
                const isActive = item === activeSection
                return (
                  <div key={item} onClick={()=>setActiveSection(item)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 20px',fontSize:13,color:isActive?s.white:s.muted,cursor:'pointer',background:isActive?'rgba(201,168,76,0.05)':'none',borderLeft:isActive?`2px solid ${s.gold}`:'2px solid transparent'}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:isActive?s.gold:s.border,flexShrink:0}}/>
                    {item}
                  </div>
                )
              })}
            </div>
          ))}
          <div style={{padding:'0 20px'}}>
            <button onClick={handleLogout} style={{background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:12,padding:'8px 16px',cursor:'pointer',width:'100%'}}>Sign out</button>
          </div>
        </aside>

        <main className="main-content" style={{padding:32,overflowY:'auto'}}>

          {activeSection === 'Overview' && (
            <>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12}}>
                <div>
                  <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:4}}>Member dashboard</div>
                  <h2 style={{fontSize:22,color:s.white,fontWeight:600}}>Welcome back, {member.firstName}</h2>
                </div>
                <Link href="/listings/new" style={{background:s.gold,color:'#000',fontSize:13,fontWeight:500,padding:'8px 20px',textDecoration:'none'}}>+ New Listing</Link>
              </div>
              <div className="metrics-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
                {[['My listings',listings.length],['Saved',saved.length],['Enquiries sent',enquiriesSent.length],['Enquiries received',enquiriesReceived.length]].map(([label,val])=>(
                  <div key={label} style={{background:s.bg3,border:`1px solid ${s.border}`,padding:20}}>
                    <div style={{fontSize:10,letterSpacing:'0.25em',color:s.muted,textTransform:'uppercase',marginBottom:8}}>{label}</div>
                    <div style={{fontSize:28,color:s.white,fontWeight:600}}>{val}</div>
                  </div>
                ))}
              </div>
              {listings.length > 0 ? (
                <>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                    <h3 style={{fontSize:16,color:s.white,fontWeight:600}}>My recent listings</h3>
                    <button onClick={()=>setActiveSection('My listings')} style={{background:'none',border:`1px solid ${s.border}`,color:s.mid,fontSize:12,padding:'6px 14px',cursor:'pointer'}}>View all</button>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:1,background:s.border,marginBottom:28}}>
                    {listings.slice(0,3).map(l=><ListingCard key={l.id} l={l}/>)}
                  </div>
                </>
              ) : (
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32,textAlign:'center',marginBottom:28}}>
                  <div style={{fontSize:14,color:s.white,marginBottom:12,fontWeight:600}}>No listings yet</div>
                  <Link href="/listings/new" style={{background:s.gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Upload a listing</Link>
                </div>
              )}
              {enquiriesReceived.length > 0 && (
                <>
                  <h3 style={{fontSize:16,color:s.white,fontWeight:600,marginBottom:16}}>Recent enquiries received</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:1,background:s.border}}>
                    {enquiriesReceived.slice(0,3).map(e=>(
                      <div key={e.id} onClick={()=>{setActiveEnquiry(e);fetchMessages(e.id);setActiveSection('Messages')}} style={{background:s.bg2,display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:16,alignItems:'center',padding:'14px 16px',cursor:'pointer'}}>
                        <div><div style={{fontSize:13,color:s.white}}>{e.enquirer_name}</div><div style={{fontSize:11,color:s.muted}}>{e.enquirer_agency}</div></div>
                        <div style={{fontSize:12,color:s.muted}}>{e.listing_title}</div>
                        <div style={{fontSize:10,color:s.gold}}>{new Date(e.created_at).toLocaleDateString('en-AU')}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {activeSection === 'My listings' && (
            <>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
                <h2 style={{fontSize:22,color:s.white,fontWeight:600}}>My listings</h2>
                <Link href="/listings/new" style={{background:s.gold,color:'#000',fontSize:13,fontWeight:500,padding:'8px 20px',textDecoration:'none'}}>+ New Listing</Link>
              </div>
              {listings.length === 0 ? (
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:s.white,marginBottom:12}}>No listings yet</div>
                  <Link href="/listings/new" style={{background:s.gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Upload a listing</Link>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:1,background:s.border}}>
                  {listings.map(l=><ListingCard key={l.id} l={l}/>)}
                </div>
              )}
            </>
          )}

          {activeSection === 'Browse feed' && (
            <div>
              <h2 style={{fontSize:22,color:s.white,fontWeight:600,marginBottom:16}}>Browse feed</h2>
              <p style={{color:s.muted,marginBottom:24,fontSize:14}}>Search and browse all active off market listings from verified members.</p>
              <Link href="/listings" style={{display:'inline-block',background:s.gold,color:'#000',padding:'12px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Open full browse feed →</Link>
            </div>
          )}

          {activeSection === 'Saved' && (
            <>
              <h2 style={{fontSize:22,color:s.white,fontWeight:600,marginBottom:28}}>Saved listings</h2>
              {saved.length === 0 ? (
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:s.white,marginBottom:12}}>No saved listings yet</div>
                  <Link href="/listings" style={{background:s.gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Browse listings</Link>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:1,background:s.border}}>
                  {saved.map(sv=>sv.listings&&(
                    <Link key={sv.id} href={`/listings/${sv.listing_id}`} style={{textDecoration:'none',background:s.bg2,display:'grid',gridTemplateColumns:'100px 1fr',gap:16,alignItems:'center',padding:16}}>
                      {sv.listings.images&&sv.listings.images[0]?<img src={sv.listings.images[0]} alt={sv.listings.title} style={{width:100,height:68,objectFit:'cover',opacity:0.8}}/>:<div style={{width:100,height:68,background:s.bg4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:s.muted}}>No img</div>}
                      <div>
                        <div style={{fontSize:9,letterSpacing:'0.25em',color:s.gold,textTransform:'uppercase',marginBottom:3}}>{sv.listings.suburb} · {sv.listings.state}</div>
                        <div style={{fontSize:14,color:s.white,marginBottom:4}}>{sv.listings.title}</div>
                        <div style={{fontSize:12,color:s.muted}}>{sv.listings.property_type} · {sv.listings.bedrooms} bed · {sv.listings.price_guide}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSection === 'Enquiries received' && (
            <>
              <h2 style={{fontSize:22,color:s.white,fontWeight:600,marginBottom:28}}>Enquiries received</h2>
              {enquiriesReceived.length === 0 ? (
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:s.white}}>No enquiries received yet</div>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:1,background:s.border}}>
                  {enquiriesReceived.map(e=>(
                    <div key={e.id} onClick={()=>{setActiveEnquiry(e);fetchMessages(e.id);setActiveSection('Messages')}} style={{background:s.bg2,display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:16,alignItems:'center',padding:'16px 20px',cursor:'pointer'}}>
                      <div><div style={{fontSize:14,color:s.white,fontWeight:600}}>{e.enquirer_name}</div><div style={{fontSize:12,color:s.muted}}>{e.enquirer_agency}</div></div>
                      <div style={{fontSize:13,color:s.muted}}>{e.listing_title}</div>
                      <div style={{fontSize:10,color:s.gold}}>{new Date(e.created_at).toLocaleDateString('en-AU')}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSection === 'Enquiries sent' && (
            <>
              <h2 style={{fontSize:22,color:s.white,fontWeight:600,marginBottom:28}}>Enquiries sent</h2>
              {enquiriesSent.length === 0 ? (
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:s.white,marginBottom:12}}>No enquiries sent yet</div>
                  <Link href="/listings" style={{background:s.gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Browse listings</Link>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:1,background:s.border}}>
                  {enquiriesSent.map(e=>(
                    <div key={e.id} onClick={()=>{setActiveEnquiry(e);fetchMessages(e.id);setActiveSection('Messages')}} style={{background:s.bg2,display:'grid',gridTemplateColumns:'1fr auto',gap:16,alignItems:'center',padding:'16px 20px',cursor:'pointer'}}>
                      <div><div style={{fontSize:14,color:s.white,fontWeight:600}}>{e.listing_title}</div><div style={{fontSize:12,color:s.muted}}>Enquiry sent · {new Date(e.created_at).toLocaleDateString('en-AU')}</div></div>
                      <div style={{fontSize:12,color:s.gold}}>Message →</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSection === 'Messages' && (
            <>
              <h2 style={{fontSize:22,color:s.white,fontWeight:600,marginBottom:28}}>Messages</h2>
              {!activeEnquiry ? (
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:s.white,marginBottom:8}}>No conversation selected</div>
                  <div style={{fontSize:13,color:s.muted}}>Click on an enquiry to start a conversation</div>
                </div>
              ) : (
                <div style={{background:s.bg3,border:`1px solid ${s.border}`}}>
                  <div style={{padding:'16px 20px',borderBottom:`1px solid ${s.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:14,color:s.white,fontWeight:600}}>{activeEnquiry.listing_title}</div>
                      <div style={{fontSize:12,color:s.muted}}>with {activeEnquiry.enquirer_id===member.id?'Listing agent':activeEnquiry.enquirer_name}</div>
                    </div>
                    <button onClick={()=>setActiveEnquiry(null)} style={{background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:12,padding:'4px 10px',cursor:'pointer'}}>Close</button>
                  </div>
                  <div style={{padding:20,minHeight:300,maxHeight:400,overflowY:'auto',display:'flex',flexDirection:'column',gap:12}}>
                    {messages.length === 0 ? (
                      <div style={{textAlign:'center',color:s.muted,fontSize:13,paddingTop:40}}>No messages yet. Start the conversation!</div>
                    ) : messages.map(msg=>(
                      <div key={msg.id} style={{display:'flex',flexDirection:msg.sender_id===member.id?'row-reverse':'row',gap:12,alignItems:'flex-start'}}>
                        <div style={{width:32,height:32,borderRadius:'50%',background:s.bg4,border:`1px solid ${s.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:s.gold,flexShrink:0}}>{msg.sender_name[0]}</div>
                        <div style={{background:msg.sender_id===member.id?'rgba(201,168,76,0.1)':s.bg4,border:`1px solid ${msg.sender_id===member.id?'rgba(201,168,76,0.2)':s.border}`,padding:'10px 14px',maxWidth:'70%'}}>
                          <div style={{fontSize:11,color:s.gold,marginBottom:4}}>{msg.sender_name}</div>
                          <div style={{fontSize:13,color:s.white,lineHeight:1.5}}>{msg.message}</div>
                          <div style={{fontSize:10,color:s.muted,marginTop:6}}>{new Date(msg.created_at).toLocaleString('en-AU')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:16,borderTop:`1px solid ${s.border}`,display:'flex',gap:12}}>
                    <input value={messageText} onChange={e=>setMessageText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Type a message..." style={{...input,flex:1}}/>
                    <button onClick={sendMessage} style={{background:s.gold,border:'none',color:'#000',fontSize:13,fontWeight:600,padding:'0 20px',cursor:'pointer'}}>Send</button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeSection === 'Favourite agents' && (
            <FavouriteAgents member={member} s={s} />
          )}

          {activeSection === 'My profile' && (
            <>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}><h2 style={{fontSize:22,color:s.white,fontWeight:600}}>My profile</h2><Link href="/profile/edit" style={{background:s.gold,color:"#000",fontSize:13,fontWeight:500,padding:"8px 20px",textDecoration:"none"}}>Edit profile →</Link></div>
              <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32,maxWidth:600}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                  {[['First name',member.firstName],['Last name',member.lastName],['Email',member.email],['Username',member.username],['Agency',member.agency],['Role',member.role],['State',member.state],['Plan',member.plan],['Status',member.status]].map(([label,val])=>(
                    <div key={label}>
                      <div style={{fontSize:10,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase',marginBottom:6}}>{label}</div>
                      <div style={{fontSize:14,color:label==='Status'&&val==='pending'?s.red:s.white,padding:'10px 12px',background:s.bg4,border:`1px solid ${s.border}`,textTransform:label==='Status'?'capitalize':'none'}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeSection === 'Subscription' && (
            <>
              <h2 style={{fontSize:22,color:s.white,fontWeight:600,marginBottom:28}}>Subscription</h2>
              <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32,maxWidth:600,marginBottom:20}}>
                <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>Current plan</div>
                <div style={{fontSize:28,color:s.gold,fontWeight:700,marginBottom:4}}>{member.plan}</div>
                <div style={{fontSize:13,color:s.muted,marginBottom:24}}>3 months free trial · No credit card required</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                  {[['Bronze','$49'],['Silver','$99'],['Gold','$179'],['Platinum','$349']].map(([p,price])=>(
                    <div key={p} style={{background:p===member.plan?'rgba(201,168,76,0.1)':s.bg4,border:`1px solid ${p===member.plan?s.gold:s.border}`,padding:'16px 12px',textAlign:'center'}}>
                      <div style={{fontSize:14,color:p===member.plan?s.gold:s.white,fontWeight:600,marginBottom:4}}>{p}</div>
                      <div style={{fontSize:11,color:s.muted}}>{price}/mo after trial</div>
                      {p===member.plan&&<div style={{fontSize:10,color:s.gold,marginTop:8}}>✓ Current</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{fontSize:13,color:s.muted}}>To change your plan contact <a href="mailto:support@offmarketpropertynetwork.com.au" style={{color:s.gold,textDecoration:'none'}}>support@offmarketpropertynetwork.com.au</a></div>
            </>
          )}

          {activeSection === 'Settings' && (
            <>
              <h2 style={{fontSize:22,color:s.white,fontWeight:600,marginBottom:28}}>Settings</h2>
              <div style={{display:'flex',flexDirection:'column',gap:16,maxWidth:500}}>
                {[["Change password","Update your login password","/profile/change-password"],["Email notifications","Get alerts for new listings and enquiries",""],["Account visibility","Control who can see your profile",""],["Deactivate account","Temporarily disable your account",""]].map(([title,desc,link])=>(
                  <div key={title} style={{background:s.bg3,border:`1px solid ${s.border}`,padding:20,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div><div style={{fontSize:14,color:s.white,fontWeight:600,marginBottom:4}}>{title}</div><div style={{fontSize:12,color:s.muted}}>{desc}</div></div>
                    {link ? <Link href={link} style={{background:"none",border:`1px solid ${s.border}`,color:s.gold,fontSize:12,padding:"6px 14px",textDecoration:"none"}}>Manage</Link> : <button style={{background:"none",border:`1px solid ${s.border}`,color:s.muted,fontSize:12,padding:"6px 14px",cursor:"pointer"}}>Coming soon</button>}
                  </div>
                ))}
              </div>
            </>
          )}

        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="mobile-nav">
        {[
          {icon:'🏠',label:'Home',section:'Overview'},
          {icon:'📋',label:'Listings',section:'My listings'},
          {icon:'🔍',label:'Browse',section:'Browse feed'},
          {icon:'💬',label:'Messages',section:'Messages'},
          {icon:'👤',label:'Profile',section:'My profile'},
        ].map(item=>(
          <button key={item.section} className="mobile-nav-item" onClick={()=>setActiveSection(item.section)}>
            <span style={{fontSize:20}}>{item.icon}</span>
            <span style={{fontSize:9,color:activeSection===item.section?s.gold:s.muted,letterSpacing:'0.05em'}}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
