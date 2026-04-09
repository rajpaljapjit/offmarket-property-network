import { format, formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#C9A84C',bg:'#1B2A1B',bg2:'#162016',bg3:'#1F2E1F',bg4:'#243524',white:'#C9A84C',muted:'#E8E8E8',mid:'#E8E8E8',border:'#2D4A2D',red:'#E24B4A',green:'#4CAF50'}
const ADMIN_USERNAME = 'ompnadminlogin'
const SB_URL = 'https://jmjtcmfjknmdnlgxudfk.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'

export default function Admin() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [activeTab, setActiveTab] = useState('Pending')
  const [members, setMembers] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [member, setMember] = useState(null)
  const [viewMember, setViewMember] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('member')
    const adminAuth = localStorage.getItem('adminAuth')
    if (!stored || !adminAuth) { router.push('/admin-login'); return }
    const m = JSON.parse(stored)
    if (m.username !== ADMIN_USERNAME) { router.push('/admin-login'); return }
    setMember(m)
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) fetchAll()
  }, [ready])

  const getSupabase = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(SB_URL, SB_KEY)
  }

  const fetchAll = async () => {
    setLoading(true)
    try {
      const db = await getSupabase()
      const membersRes = await db.from('members').select('*').neq('username', ADMIN_USERNAME)
      const listingsRes = await db.from('listings').select('*')
      console.log('Members:', membersRes)
      console.log('Listings:', listingsRes)
      setMembers(membersRes.data || [])
      setListings(listingsRes.data || [])
    } catch(err) {
      console.error('Error:', err)
    }
    setLoading(false)
  }

  const updateMemberStatus = async (id, status) => {
    try {
      const res = await fetch('/api/approve-member', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ memberId: id, status })
      })
      const data = await res.json()
      console.log('Status update result:', data)
    } catch(e) { console.error('Status update error:', e) }
    await fetchAll()
  }

  const deleteMember = async (id) => {
    if (!confirm('Delete this member? This cannot be undone.')) return
    const db = await getSupabase()
    await db.from('members').delete().eq('id', id)
    await fetchAll()
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('member')
    router.push('/admin-login')
  }

  if (!ready) return <div style={{background:s.bg,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{color:s.muted}}>Loading...</div></div>

  const pendingMembers = members.filter(m=>m.status==='pending')
  const activeMembers = members.filter(m=>m.status==='active')
  const stats = {total:members.length, pending:pendingMembers.length, active:activeMembers.length, listings:listings.length}
  const tabs = ['Pending','Active','All members','Listings','Stats']

  const MemberRow = ({m}) => (
    <div className='member-row' style={{background:s.bg2,display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:16,alignItems:'center',padding:'16px 20px',borderBottom:`1px solid ${s.border}`}}>
      <div>
        <div style={{fontSize:14,color:s.white,fontWeight:600}}>{m.first_name} {m.last_name}</div>
        <div style={{fontSize:12,color:s.gold}}>@{m.username}</div>
        <div style={{fontSize:11,color:s.muted}}>{m.email}</div>
        {m.mobile&&<div style={{fontSize:11,color:s.muted}}>{m.mobile}</div>}
      </div>
      <div>
        <div style={{fontSize:13,color:s.mid}}>{m.agency}</div>
        <div style={{fontSize:11,color:s.muted}}>{m.role} · {m.state}</div>
        <div style={{fontSize:11,color:s.gold,marginTop:4}}>{m.plan} plan</div>
      </div>
      <div>
        <div style={{fontSize:11,color:s.muted,marginBottom:4}}>License: {m.license_number}</div>
        <div style={{fontSize:11,color:s.muted}}>Joined: {m.trial_start?m.trial_start ? format(new Date(m.trial_start), 'dd MMM yyyy') : 'N/A':'N/A'}</div>
        <div style={{display:'inline-block',fontSize:9,letterSpacing:'0.15em',textTransform:'uppercase',padding:'3px 8px',border:`1px solid`,marginTop:6,
          color:m.status==='active'?s.green:m.status==='pending'?s.gold:s.red,
          borderColor:m.status==='active'?s.green:m.status==='pending'?s.gold:s.red
        }}>{m.status}</div>
      </div>
      <div className='member-actions' style={{display:'flex',flexDirection:'column',gap:6,minWidth:110}}>
        <button onClick={()=>setViewMember(m)} style={{background:'none',border:`1px solid ${s.gold}`,color:s.gold,fontSize:12,padding:'7px 12px',cursor:'pointer',marginBottom:4}}>View →</button>
        {m.status==='pending'&&<button onClick={()=>updateMemberStatus(m.id,'active')} style={{background:s.green,border:'none',color:'#000',fontSize:12,fontWeight:600,padding:'7px 12px',cursor:'pointer'}}>✓ Approve</button>}
        {m.status==='pending'&&<button onClick={()=>updateMemberStatus(m.id,'rejected')} style={{background:'none',border:`1px solid ${s.red}`,color:s.red,fontSize:12,padding:'7px 12px',cursor:'pointer'}}>✗ Reject</button>}
        {m.status==='active'&&<button onClick={()=>updateMemberStatus(m.id,'suspended')} style={{background:'none',border:`1px solid ${s.red}`,color:s.red,fontSize:12,padding:'7px 12px',cursor:'pointer'}}>Suspend</button>}
        {m.status==='suspended'&&<button onClick={()=>updateMemberStatus(m.id,'active')} style={{background:'none',border:`1px solid ${s.green}`,color:s.green,fontSize:12,padding:'7px 12px',cursor:'pointer'}}>Reinstate</button>}
        <button onClick={()=>deleteMember(m.id)} style={{background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:12,padding:'7px 12px',cursor:'pointer'}}>Delete</button>
      </div>
    </div>
  )

  return (
    <div style={{background:s.bg,minHeight:'100vh',color:s.white}}>
      <style>{`
        @media(max-width:768px){
          .admin-stats{grid-template-columns:1fr 1fr !important;}
          .admin-tabs{overflow-x:auto;display:flex;white-space:nowrap;}
          .member-row{grid-template-columns:1fr !important;gap:12px !important;}
          .member-actions{display:flex;flex-direction:row !important;flex-wrap:wrap;gap:6px !important;}
          .admin-header{flex-direction:column;gap:12px;align-items:flex-start !important;}
          .listings-row{grid-template-columns:1fr !important;}
        }
      `}</style>
      {/* Member detail modal */}
      {viewMember && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setViewMember(null)}>
          <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:36,maxWidth:560,width:'100%',maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase'}}>Member application</div>
              <button onClick={()=>setViewMember(null)} style={{background:'none',border:'none',color:s.muted,fontSize:20,cursor:'pointer'}}>✕</button>
            </div>
            <h2 style={{fontSize:22,color:s.gold,marginBottom:4,fontWeight:600}}>{viewMember.first_name} {viewMember.last_name}</h2>
            <div style={{fontSize:12,color:s.muted,marginBottom:24}}>@{viewMember.username}</div>
            <div style={{display:'flex',flexDirection:'column',gap:1,background:s.border}}>
              {[
                ['Full name', `${viewMember.first_name} ${viewMember.last_name}`],
                ['Email', viewMember.email],
                ['Mobile', viewMember.mobile || 'Not provided'],
                ['Agency', viewMember.agency],
                ['Role', viewMember.role],
                ['State', viewMember.state],
                ['License number', viewMember.license_number],
                ['Plan selected', viewMember.plan],
                ['Account status', viewMember.status],
                ['Joined', viewMember.trial_start ? new Date(viewMember.trial_start).toLocaleDateString('en-AU') : 'N/A'],
              ].map(([label, value]) => (
                <div key={label} style={{background:s.bg2,display:'flex',justifyContent:'space-between',padding:'12px 16px',gap:20}}>
                  <span style={{fontSize:12,color:s.muted,minWidth:120}}>{label}</span>
                  <span style={{fontSize:13,color:s.mid,textAlign:'right',wordBreak:'break-all'}}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginTop:24}}>
              {viewMember.status==='pending'&&(
                <>
                  <button onClick={()=>{updateMemberStatus(viewMember.id,'active');setViewMember(null)}} style={{flex:1,background:s.green,border:'none',color:'#000',fontSize:13,fontWeight:600,padding:12,cursor:'pointer'}}>✓ Approve</button>
                  <button onClick={()=>{updateMemberStatus(viewMember.id,'rejected');setViewMember(null)}} style={{flex:1,background:'none',border:`1px solid ${s.red}`,color:s.red,fontSize:13,padding:12,cursor:'pointer'}}>✗ Reject</button>
                </>
              )}
              {viewMember.status==='active'&&(
                <button onClick={()=>{updateMemberStatus(viewMember.id,'suspended');setViewMember(null)}} style={{flex:1,background:'none',border:`1px solid ${s.red}`,color:s.red,fontSize:13,padding:12,cursor:'pointer'}}>Suspend</button>
              )}
              <button onClick={()=>setViewMember(null)} style={{flex:1,background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:13,padding:12,cursor:'pointer'}}>Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Member detail modal */}
      {viewMember && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setViewMember(null)}>
          <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:36,maxWidth:560,width:'100%',maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase'}}>Member application</div>
              <button onClick={()=>setViewMember(null)} style={{background:'none',border:'none',color:s.muted,fontSize:20,cursor:'pointer'}}>✕</button>
            </div>
            <h2 style={{fontSize:22,color:s.gold,marginBottom:4,fontWeight:600}}>{viewMember.first_name} {viewMember.last_name}</h2>
            <div style={{fontSize:12,color:s.muted,marginBottom:24}}>@{viewMember.username}</div>
            <div style={{display:'flex',flexDirection:'column',gap:1,background:s.border}}>
              {[
                ['Full name', `${viewMember.first_name} ${viewMember.last_name}`],
                ['Email', viewMember.email],
                ['Mobile', viewMember.mobile || 'Not provided'],
                ['Agency', viewMember.agency],
                ['Role', viewMember.role],
                ['State', viewMember.state],
                ['License number', viewMember.license_number],
                ['Plan selected', viewMember.plan],
                ['Account status', viewMember.status],
                ['Joined', viewMember.trial_start ? new Date(viewMember.trial_start).toLocaleDateString('en-AU') : 'N/A'],
              ].map(([label, value]) => (
                <div key={label} style={{background:s.bg2,display:'flex',justifyContent:'space-between',padding:'12px 16px',gap:20}}>
                  <span style={{fontSize:12,color:s.muted,minWidth:120}}>{label}</span>
                  <span style={{fontSize:13,color:s.mid,textAlign:'right',wordBreak:'break-all'}}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginTop:24}}>
              {viewMember.status==='pending'&&(
                <>
                  <button onClick={()=>{updateMemberStatus(viewMember.id,'active');setViewMember(null)}} style={{flex:1,background:s.green,border:'none',color:'#000',fontSize:13,fontWeight:600,padding:12,cursor:'pointer'}}>✓ Approve</button>
                  <button onClick={()=>{updateMemberStatus(viewMember.id,'rejected');setViewMember(null)}} style={{flex:1,background:'none',border:`1px solid ${s.red}`,color:s.red,fontSize:13,padding:12,cursor:'pointer'}}>✗ Reject</button>
                </>
              )}
              {viewMember.status==='active'&&(
                <button onClick={()=>{updateMemberStatus(viewMember.id,'suspended');setViewMember(null)}} style={{flex:1,background:'none',border:`1px solid ${s.red}`,color:s.red,fontSize:13,padding:12,cursor:'pointer'}}>Suspend</button>
              )}
              <button onClick={()=>setViewMember(null)} style={{flex:1,background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:13,padding:12,cursor:'pointer'}}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div style={{background:s.bg2,borderBottom:`1px solid ${s.border}`,padding:'0 20px'}}>
        <div className='admin-header' style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:64,padding:'12px 20px'}}>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <img src="/Offmarketproplogo5.png" alt="OMPN" style={{height:36}}/>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase'}}>Admin Panel</div>
          </div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <span style={{fontSize:12,color:s.muted}}>Logged in as {member?.username}</span>
            <button onClick={handleLogout} style={{background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:12,padding:'6px 14px',cursor:'pointer'}}>Sign out</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'32px 20px'}}>
        <div style={{marginBottom:32}}>
          <h1 style={{fontSize:24,color:s.white,fontWeight:600,marginBottom:4}}>Network overview</h1>
          <p style={{fontSize:13,color:s.muted}}>Manage members, listings and platform activity</p>
        </div>

        <div className='admin-stats' style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:32}}>
          {[['Total members',stats.total,s.mid],['Pending approval',stats.pending,s.gold],['Active members',stats.active,s.green],['Total listings',stats.listings,s.gold]].map(([label,val,color])=>(
            <div key={label} style={{background:s.bg3,border:`1px solid ${s.border}`,padding:24}}>
              <div style={{fontSize:10,letterSpacing:'0.25em',color:s.muted,textTransform:'uppercase',marginBottom:8}}>{label}</div>
              <div style={{fontSize:36,color,fontWeight:700}}>{val}</div>
            </div>
          ))}
        </div>

        <div className='admin-tabs' style={{display:'flex',gap:1,background:s.border,marginBottom:1}}>
          {tabs.map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{background:tab===activeTab?s.bg3:s.bg2,border:'none',color:tab===activeTab?s.gold:s.muted,fontSize:13,padding:'12px 24px',cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
              {tab}
              {tab==='Pending'&&stats.pending>0&&<span style={{background:s.red,color:s.white,fontSize:9,borderRadius:'50%',width:18,height:18,display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{stats.pending}</span>}
            </button>
          ))}
        </div>

        <div style={{background:s.bg2,border:`1px solid ${s.border}`}}>
          {loading ? (
            <div style={{padding:40,textAlign:'center',color:s.muted}}>Loading...</div>
          ) : activeTab==='Pending' ? (
            pendingMembers.length===0 ?
              <div style={{padding:40,textAlign:'center',color:s.muted}}>🎉 No pending members</div> :
              pendingMembers.map(m=><MemberRow key={m.id} m={m}/>)
          ) : activeTab==='Active' ? (
            activeMembers.length===0 ?
              <div style={{padding:40,textAlign:'center',color:s.muted}}>No active members yet</div> :
              activeMembers.map(m=><MemberRow key={m.id} m={m}/>)
          ) : activeTab==='All members' ? (
            members.length===0 ?
              <div style={{padding:40,textAlign:'center',color:s.muted}}>No members yet</div> :
              members.map(m=><MemberRow key={m.id} m={m}/>)
          ) : activeTab==='Listings' ? (
            listings.length===0 ?
              <div style={{padding:40,textAlign:'center',color:s.muted}}>No listings yet</div> :
              listings.map(l=>(
                <div key={l.id} style={{display:'grid',gridTemplateColumns:'80px 1fr auto',gap:16,alignItems:'center',padding:'16px 20px',borderBottom:`1px solid ${s.border}`}}>
                  {l.images&&l.images[0]?<img src={l.images[0]} alt={l.title} style={{width:80,height:56,objectFit:'cover',opacity:0.8}}/>:<div style={{width:80,height:56,background:s.bg4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:s.muted}}>No img</div>}
                  <div>
                    <div style={{fontSize:14,color:s.white,fontWeight:600,marginBottom:4}}>{l.title}</div>
                    <div style={{fontSize:12,color:s.muted}}>{l.suburb} · {l.state} · {l.property_type}</div>
                    <div style={{fontSize:11,color:s.gold,marginTop:4}}>{l.price_guide}</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
                    <div style={{fontSize:10,textTransform:'uppercase',padding:'2px 8px',border:`1px solid`,color:l.status==='active'?s.green:s.muted,borderColor:l.status==='active'?s.green:s.border}}>{l.status}</div>
                    <Link href={`/listings/${l.id}`} style={{fontSize:11,color:s.gold,textDecoration:'none'}}>View →</Link>
                  </div>
                </div>
              ))
          ) : (
            <div style={{padding:32}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
                {/* Members by State Bar Chart */}
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:24}}>
                  <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>Members by state</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={Object.entries(members.reduce((acc,m)=>{acc[m.state]=(acc[m.state]||0)+1;return acc},{})).map(([k,v])=>({name:k,count:v}))}>
                      <XAxis dataKey="name" tick={{fill:'#A8B4CC',fontSize:11}} axisLine={{stroke:'#2D4A2D'}}/>
                      <YAxis tick={{fill:'#A8B4CC',fontSize:11}} axisLine={{stroke:'#2D4A2D'}}/>
                      <Tooltip contentStyle={{background:'#1F2E1F',border:'1px solid #2D4A2D',color:'#C9A84C'}}/>
                      <Bar dataKey="count" fill="#C9A84C" radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Members by Plan Pie Chart */}
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:24}}>
                  <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>Members by plan</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={Object.entries(members.reduce((acc,m)=>{acc[m.plan]=(acc[m.plan]||0)+1;return acc},{})).map(([k,v])=>({name:k,value:v}))} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,value})=>`${name}: ${value}`}>
                        {Object.entries(members.reduce((acc,m)=>{acc[m.plan]=(acc[m.plan]||0)+1;return acc},{})).map((_,i)=>(
                          <Cell key={i} fill={['#C9A84C','#A8B4CC','#4CAF50','#E24B4A'][i%4]}/>
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{background:'#1F2E1F',border:'1px solid #2D4A2D',color:'#C9A84C'}}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Members by Role Bar Chart */}
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:24}}>
                  <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>Members by role</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={Object.entries(members.reduce((acc,m)=>{acc[m.role]=(acc[m.role]||0)+1;return acc},{})).map(([k,v])=>({name:k,count:v}))}>
                      <XAxis dataKey="name" tick={{fill:'#A8B4CC',fontSize:11}} axisLine={{stroke:'#2D4A2D'}}/>
                      <YAxis tick={{fill:'#A8B4CC',fontSize:11}} axisLine={{stroke:'#2D4A2D'}}/>
                      <Tooltip contentStyle={{background:'#1F2E1F',border:'1px solid #2D4A2D',color:'#C9A84C'}}/>
                      <Bar dataKey="count" fill="#A8B4CC" radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Listings by State Bar Chart */}
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:24}}>
                  <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>Listings by state</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={Object.entries(listings.reduce((acc,l)=>{acc[l.state]=(acc[l.state]||0)+1;return acc},{})).map(([k,v])=>({name:k,count:v}))}>
                      <XAxis dataKey="name" tick={{fill:'#A8B4CC',fontSize:11}} axisLine={{stroke:'#2D4A2D'}}/>
                      <YAxis tick={{fill:'#A8B4CC',fontSize:11}} axisLine={{stroke:'#2D4A2D'}}/>
                      <Tooltip contentStyle={{background:'#1F2E1F',border:'1px solid #2D4A2D',color:'#C9A84C'}}/>
                      <Bar dataKey="count" fill="#4CAF50" radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
