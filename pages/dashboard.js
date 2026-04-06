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
    const m = JSON.parse(stored)
    setMember(m)
    fetchAll(m)
  }, [])

  const getSupabase = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(
      'https://jmjtcmfjknmdnlgxudfk.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
    )
  }

  const fetchAll = async (m) => {
    const db = await getSupabase()
    const [l, s, es, er] = await Promise.all([
      db.from('listings').select('*').eq('member_id', m.id).order('created_at', { ascending: false }),
      db.from('saved_listings').select('*, listings(*)').eq('member_id', m.id),
      db.from('enquiries').select('*').eq('enquirer_id', m.id).order('created_at', { ascending: false }),
      db.from('enquiries').select('*').eq('listing_member_id', m.id).order('created_at', { ascending: false }),
    ])
    setListings(l.data || [])
    setSaved(s.data || [])
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

  if (!member) return <div style={{background:black,minHeight:'100vh'}}></div>

  const menuItems = [
    {section:'Dashboard',items:['Overview','My listings','Browse feed','Saved']},
    {section:'Connections',items:['Enquiries received','Enquiries sent','Messages','Favourite agents']},
    {section:'Account',items:['My profile','Subscription','Settings']},
  ]

  const input = {background:black3,border:`1px solid ${border}`,color:white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}

  const ListingCard = ({l, showEdit=true}) => (
    <div style={{background:black2,display:'grid',gridTemplateColumns:'120px 1fr auto',gap:20,alignItems:'center',padding:20}}>
      <Link href={`/listings/${l.id}`} style={{textDecoration:'none'}}>
        {l.images&&l.images[0]?<img src={l.images[0]} alt={l.title} style={{width:120,height:80,objectFit:'cover',opacity:0.8}}/>:<div style={{width:120,height:80,background:black4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:muted}}>No image</div>}
      </Link>
      <div>
        <div style={{fontSize:9,letterSpacing:'0.25em',color:gold,textTransform:'uppercase',marginBottom:4}}>{l.suburb} · {l.state} · {l.postcode}</div>
        <Link href={`/listings/${l.id}`} style={{textDecoration:'none'}}><div style={{fontSize:16,color:white,marginBottom:6,fontWeight:600}}>{l.title}</div></Link>
        <div style={{fontSize:12,color:muted,marginBottom:4}}>{l.street_address}</div>
        <div style={{fontSize:12,color:muted}}>{l.bedrooms} bed · {l.bathrooms} bath · {l.property_type}</div>
        {l.price_guide&&<div style={{fontSize:13,color:gold,marginTop:6}}>{l.price_guide}</div>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
        <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',padding:'3px 10px',border:`1px solid`,color:l.status==='sold'?muted:gold,borderColor:l.status==='sold'?border:'#8A6A1F'}}>{l.status}</div>
        <div style={{fontSize:11,color:muted}}>{new Date(l.created_at).toLocaleDateString('en-AU')}</div>
        {showEdit && (
          <Link href={`/listings/edit/${l.id}`} style={{fontSize:11,color:gold,textDecoration:'none',border:`1px solid ${border}`,padding:'4px 10px'}}>Edit →</Link>
        )}
      </div>
    </div>
  )

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
                  <h2 style={{fontSize:22,color:white,fontWeight:600}}>Welcome back, {member.firstName}</h2>
                </div>
                <Link href="/listings/new" style={{background:gold,color:'#000',fontSize:13,fontWeight:500,padding:'8px 20px',textDecoration:'none'}}>+ New Listing</Link>
              </div>
              <div className="metrics-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
                {[['My listings',listings.length],['Saved',saved.length],['Enquiries sent',enquiriesSent.length],['Enquiries received',enquiriesReceived.length]].map(([label,val])=>(
                  <div key={label} style={{background:black3,border:`1px solid ${border}`,padding:20}}>
                    <div style={{fontSize:10,letterSpacing:'0.25em',color:muted,textTransform:'uppercase',marginBottom:8}}>{label}</div>
                    <div style={{fontSize:28,color:white,fontWeight:600}}>{val}</div>
                  </div>
                ))}
              </div>
              {listings.length > 0 ? (
                <>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                    <h3 style={{fontSize:16,color:white,fontWeight:600}}>My recent listings</h3>
                    <button onClick={()=>setActiveSection('My listings')} style={{background:'none',border:`1px solid ${border}`,color:'#D4D8DF',fontSize:12,padding:'6px 14px',cursor:'pointer'}}>View all</button>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:1,background:border,marginBottom:28}}>
                    {listings.slice(0,3).map(l=><ListingCard key={l.id} l={l}/>)}
                  </div>
                </>
              ) : (
                <div style={{background:black3,border:`1px solid ${border}`,padding:32,textAlign:'center',marginBottom:28}}>
                  <div style={{fontSize:14,color:white,marginBottom:12,fontWeight:600}}>No listings yet</div>
                  <Link href="/listings/new" style={{background:gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Upload a listing</Link>
                </div>
              )}
              {enquiriesReceived.length > 0 && (
                <>
                  <h3 style={{fontSize:16,color:white,fontWeight:600,marginBottom:16}}>Recent enquiries received</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:1,background:border}}>
                    {enquiriesReceived.slice(0,3).map(e=>(
                      <div key={e.id} onClick={()=>{setActiveEnquiry(e);fetchMessages(e.id);setActiveSection('Messages')}} style={{background:black2,display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:16,alignItems:'center',padding:'14px 16px',cursor:'pointer'}}>
                        <div><div style={{fontSize:13,color:white}}>{e.enquirer_name}</div><div style={{fontSize:11,color:muted}}>{e.enquirer_agency}</div></div>
                        <div style={{fontSize:12,color:muted}}>{e.listing_title}</div>
                        <div style={{fontSize:10,color:gold}}>{new Date(e.created_at).toLocaleDateString('en-AU')}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* MY LISTINGS */}
          {activeSection === 'My listings' && (
            <>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
                <h2 style={{fontSize:22,color:white,fontWeight:600}}>My listings</h2>
                <Link href="/listings/new" style={{background:gold,color:'#000',fontSize:13,fontWeight:500,padding:'8px 20px',textDecoration:'none'}}>+ New Listing</Link>
              </div>
              {listings.length === 0 ? (
                <div style={{background:black3,border:`1px solid ${border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:white,marginBottom:12}}>No listings yet</div>
                  <Link href="/listings/new" style={{background:gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Upload a listing</Link>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:1,background:border}}>
                  {listings.map(l=><ListingCard key={l.id} l={l}/>)}
                </div>
              )}
            </>
          )}

          {/* BROWSE FEED */}
          {activeSection === 'Browse feed' && (
            <div>
              <h2 style={{fontSize:22,color:white,fontWeight:600,marginBottom:16}}>Browse feed</h2>
              <p style={{color:muted,marginBottom:24,fontSize:14}}>Search and browse all active off market listings from verified members.</p>
              <Link href="/listings" style={{display:'inline-block',background:gold,color:'#000',padding:'12px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Open full browse feed →</Link>
            </div>
          )}

          {/* SAVED */}
          {activeSection === 'Saved' && (
            <>
              <h2 style={{fontSize:22,color:white,fontWeight:600,marginBottom:28}}>Saved listings</h2>
              {saved.length === 0 ? (
                <div style={{background:black3,border:`1px solid ${border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:white,marginBottom:12}}>No saved listings yet</div>
                  <Link href="/listings" style={{background:gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Browse listings</Link>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:1,background:border}}>
                  {saved.map(s=>s.listings&&(
                    <Link key={s.id} href={`/listings/${s.listing_id}`} style={{textDecoration:'none',background:black2,display:'grid',gridTemplateColumns:'100px 1fr',gap:16,alignItems:'center',padding:16}}>
                      {s.listings.images&&s.listings.images[0]?<img src={s.listings.images[0]} alt={s.listings.title} style={{width:100,height:68,objectFit:'cover',opacity:0.8}}/>:<div style={{width:100,height:68,background:black4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:muted}}>No img</div>}
                      <div>
                        <div style={{fontSize:9,letterSpacing:'0.25em',color:gold,textTransform:'uppercase',marginBottom:3}}>{s.listings.suburb} · {s.listings.state}</div>
                        <div style={{fontSize:14,color:white,marginBottom:4}}>{s.listings.title}</div>
                        <div style={{fontSize:12,color:muted}}>{s.listings.property_type} · {s.listings.bedrooms} bed · {s.listings.price_guide}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ENQUIRIES RECEIVED */}
          {activeSection === 'Enquiries received' && (
            <>
              <h2 style={{fontSize:22,color:white,fontWeight:600,marginBottom:28}}>Enquiries received</h2>
              {enquiriesReceived.length === 0 ? (
                <div style={{background:black3,border:`1px solid ${border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:white}}>No enquiries received yet</div>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:1,background:border}}>
                  {enquiriesReceived.map(e=>(
                    <div key={e.id} onClick={()=>{setActiveEnquiry(e);fetchMessages(e.id);setActiveSection('Messages')}} style={{background:black2,display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:16,alignItems:'center',padding:'16px 20px',cursor:'pointer'}}>
                      <div><div style={{fontSize:14,color:white,fontWeight:600}}>{e.enquirer_name}</div><div style={{fontSize:12,color:muted}}>{e.enquirer_agency}</div></div>
                      <div style={{fontSize:13,color:muted}}>{e.listing_title}</div>
                      <div style={{fontSize:10,color:gold}}>{new Date(e.created_at).toLocaleDateString('en-AU')}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ENQUIRIES SENT */}
          {activeSection === 'Enquiries sent' && (
            <>
              <h2 style={{fontSize:22,color:white,fontWeight:600,marginBottom:28}}>Enquiries sent</h2>
              {enquiriesSent.length === 0 ? (
                <div style={{background:black3,border:`1px solid ${border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:white,marginBottom:12}}>No enquiries sent yet</div>
                  <Link href="/listings" style={{background:gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Browse listings</Link>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:1,background:border}}>
                  {enquiriesSent.map(e=>(
                    <div key={e.id} onClick={()=>{setActiveEnquiry(e);fetchMessages(e.id);setActiveSection('Messages')}} style={{background:black2,display:'grid',gridTemplateColumns:'1fr auto',gap:16,alignItems:'center',padding:'16px 20px',cursor:'pointer'}}>
                      <div><div style={{fontSize:14,color:white,fontWeight:600}}>{e.listing_title}</div><div style={{fontSize:12,color:muted}}>Enquiry sent · {new Date(e.created_at).toLocaleDateString('en-AU')}</div></div>
                      <div style={{fontSize:12,color:gold}}>Message →</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* MESSAGES */}
          {activeSection === 'Messages' && (
            <>
              <h2 style={{fontSize:22,color:white,fontWeight:600,marginBottom:28}}>Messages</h2>
              {!activeEnquiry ? (
                <div style={{background:black3,border:`1px solid ${border}`,padding:32,textAlign:'center'}}>
                  <div style={{fontSize:14,color:white,marginBottom:8}}>No conversation selected</div>
                  <div style={{fontSize:13,color:muted}}>Click on an enquiry to start a conversation</div>
                </div>
              ) : (
                <div style={{background:black3,border:`1px solid ${border}`}}>
                  <div style={{padding:'16px 20px',borderBottom:`1px solid ${border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:14,color:white,fontWeight:600}}>{activeEnquiry.listing_title}</div>
                      <div style={{fontSize:12,color:muted}}>with {activeEnquiry.enquirer_id===member.id?'Listing agent':activeEnquiry.enquirer_name}</div>
                    </div>
                    <button onClick={()=>setActiveEnquiry(null)} style={{background:'none',border:`1px solid ${border}`,color:muted,fontSize:12,padding:'4px 10px',cursor:'pointer'}}>Close</button>
                  </div>
                  <div style={{padding:20,minHeight:300,maxHeight:400,overflowY:'auto',display:'flex',flexDirection:'column',gap:12}}>
                    {messages.length === 0 ? (
                      <div style={{textAlign:'center',color:muted,fontSize:13,paddingTop:40}}>No messages yet. Start the conversation!</div>
                    ) : messages.map(msg=>(
                      <div key={msg.id} style={{display:'flex',flexDirection:msg.sender_id===member.id?'row-reverse':'row',gap:12,alignItems:'flex-start'}}>
                        <div style={{width:32,height:32,borderRadius:'50%',background:black4,border:`1px solid ${border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:gold,flexShrink:0}}>{msg.sender_name[0]}</div>
                        <div style={{background:msg.sender_id===member.id?'rgba(201,168,76,0.1)':black4,border:`1px solid ${msg.sender_id===member.id?'rgba(201,168,76,0.2)':border}`,padding:'10px 14px',maxWidth:'70%'}}>
                          <div style={{fontSize:11,color:gold,marginBottom:4}}>{msg.sender_name}</div>
                          <div style={{fontSize:13,color:white,lineHeight:1.5}}>{msg.message}</div>
                          <div style={{fontSize:10,color:muted,marginTop:6}}>{new Date(msg.created_at).toLocaleString('en-AU')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:16,borderTop:`1px solid ${border}`,display:'flex',gap:12}}>
                    <input value={messageText} onChange={e=>setMessageText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Type a message..." style={{...input,flex:1}}/>
                    <button onClick={sendMessage} style={{background:gold,border:'none',color:'#000',fontSize:13,fontWeight:600,padding:'0 20px',cursor:'pointer'}}>Send</button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* FAVOURITE AGENTS */}
          {activeSection === 'Favourite agents' && (
            <div style={{background:black3,border:`1px solid ${border}`,padding:32,textAlign:'center'}}>
              <div style={{fontSize:32,marginBottom:16}}>⭐</div>
              <div style={{fontSize:16,color:white,fontWeight:600,marginBottom:8}}>Favourite agents</div>
              <div style={{fontSize:13,color:muted,marginBottom:20}}>Save agents you work with frequently. Coming soon.</div>
              <Link href="/agents" style={{background:gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Browse agents</Link>
            </div>
          )}

          {/* MY PROFILE */}
          {activeSection === 'My profile' && (
            <>
              <h2 style={{fontSize:22,color:white,fontWeight:600,marginBottom:28}}>My profile</h2>
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

          {/* SUBSCRIPTION */}
          {activeSection === 'Subscription' && (
            <>
              <h2 style={{fontSize:22,color:white,fontWeight:600,marginBottom:28}}>Subscription</h2>
              <div style={{background:black3,border:`1px solid ${border}`,padding:32,maxWidth:600,marginBottom:20}}>
                <div style={{fontSize:10,letterSpacing:'0.3em',color:gold,textTransform:'uppercase',marginBottom:16}}>Current plan</div>
                <div style={{fontSize:28,color:gold,fontWeight:700,marginBottom:4}}>{member.plan}</div>
                <div style={{fontSize:13,color:muted,marginBottom:24}}>3 months free trial · No credit card required</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                  {[['Bronze','$49'],['Silver','$99'],['Gold','$179'],['Platinum','$349']].map(([p,price])=>(
                    <div key={p} style={{background:p===member.plan?'rgba(201,168,76,0.1)':black4,border:`1px solid ${p===member.plan?gold:border}`,padding:'16px 12px',textAlign:'center'}}>
                      <div style={{fontSize:14,color:p===member.plan?gold:white,fontWeight:600,marginBottom:4}}>{p}</div>
                      <div style={{fontSize:11,color:muted}}>{price}/mo after trial</div>
                      {p===member.plan&&<div style={{fontSize:10,color:gold,marginTop:8}}>✓ Current</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{fontSize:13,color:muted}}>To change your plan contact <a href="mailto:support@offmarketpropertynetwork.com.au" style={{color:gold,textDecoration:'none'}}>support@offmarketpropertynetwork.com.au</a></div>
            </>
          )}

          {/* SETTINGS */}
          {activeSection === 'Settings' && (
            <>
              <h2 style={{fontSize:22,color:white,fontWeight:600,marginBottom:28}}>Settings</h2>
              <div style={{display:'flex',flexDirection:'column',gap:16,maxWidth:500}}>
                {[['Change password','Update your login password'],['Email notifications','Get alerts for new listings and enquiries'],['Account visibility','Control who can see your profile'],['Deactivate account','Temporarily disable your account']].map(([title,desc])=>(
                  <div key={title} style={{background:black3,border:`1px solid ${border}`,padding:20,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div><div style={{fontSize:14,color:white,fontWeight:600,marginBottom:4}}>{title}</div><div style={{fontSize:12,color:muted}}>{desc}</div></div>
                    <button style={{background:'none',border:`1px solid ${border}`,color:muted,fontSize:12,padding:'6px 14px',cursor:'pointer'}}>Manage</button>
                  </div>
                ))}
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  )
}
