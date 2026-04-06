import Nav from '../components/Nav'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#C9A84C',bg:'#0A0F1E',bg2:'#0F1628',bg3:'#151D35',bg4:'#1A2340',white:'#F5F3EE',muted:'#6B7A99',mid:'#A8B4CC',border:'#1E2A45',red:'#E24B4A',green:'#2ECC71'}

const ADMIN_KEY = 'ompn$ecure1609'
const ADMIN_USERNAME = 'ompnadminlogin'

export default function Admin() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [member, setMember] = useState(null)
  const [activeTab, setActiveTab] = useState('Pending')
  const [members, setMembers] = useState([])
  const [listings, setListings] = useState([])
  const [stats, setStats] = useState({total:0, pending:0, active:0, listings:0})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const key = router.query.key
    const stored = localStorage.getItem('member')
    if (!stored) { router.push('/login'); return }
    const m = JSON.parse(stored)
    setMember(m)
    if (key === ADMIN_KEY && m.username === ADMIN_USERNAME) {
      setAuthorized(true)
      fetchAll()
    } else {
      router.push('/')
    }
  }, [router.query])

  const getSupabase = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    return createClient('https://jmjtcmfjknmdnlgxudfk.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo')
  }

  const fetchAll = async () => {
    const db = await getSupabase()
    const [m, l] = await Promise.all([
      db.from('members').select('*').order('created_at', {ascending: false}),
      db.from('listings').select('*').order('created_at', {ascending: false})
    ])
    const allMembers = m.data || []
    const allListings = l.data || []
    setMembers(allMembers)
    setListings(allListings)
    setStats({
      total: allMembers.length,
      pending: allMembers.filter(m=>m.status==='pending').length,
      active: allMembers.filter(m=>m.status==='active').length,
      listings: allListings.length
    })
    setLoading(false)
  }

  const updateMemberStatus = async (id, status) => {
    const db = await getSupabase()
    await db.from('members').update({status}).eq('id', id)
    
    // Send email notification if approving
    if (status === 'active') {
      const member = members.find(m => m.id === id)
      if (member) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer re_bmLA4KoW_HFXWiJj5w7yu27hwHkeb5hBd`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Off Market Property Network <welcome@offmarketpropertynetwork.com.au>',
              to: member.email,
              subject: 'Your Off Market Property Network account is now active!',
              html: `
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background:#0A0F1E;font-family:Arial,sans-serif;">
                  <div style="max-width:600px;margin:0 auto;background:#0F1628;">
                    <div style="padding:32px 40px;border-bottom:1px solid #1E2A45;">
                      <img src="https://offmarketpropertynetwork.com.au/logo.png" alt="Off Market Property Network" style="height:40px;"/>
                    </div>
                    <div style="padding:40px;">
                      <h1 style="font-size:28px;color:#F5F3EE;margin:0 0 8px;font-weight:600;">You're verified, ${member.first_name}!</h1>
                      <p style="font-size:13px;color:#C9A84C;margin:0 0 24px;text-transform:uppercase;letter-spacing:0.1em;">Your account is now active</p>
                      <p style="font-size:15px;color:#A8B4CC;line-height:1.7;margin:0 0 24px;">
                        Your real estate license has been verified and your Off Market Property Network account is now active. You now have full access to the platform.
                      </p>
                      <div style="background:#151D35;border:1px solid #1E2A45;padding:24px;margin:0 0 32px;">
                        <div style="font-size:10px;letter-spacing:0.3em;color:#C9A84C;text-transform:uppercase;margin-bottom:16px;">Your account details</div>
                        <table style="width:100%;font-size:13px;">
                          <tr><td style="color:#6B7A99;padding:4px 0;">Name</td><td style="color:#F5F3EE;text-align:right;">${member.first_name} ${member.last_name}</td></tr>
                          <tr><td style="color:#6B7A99;padding:4px 0;">Username</td><td style="color:#F5F3EE;text-align:right;">@${member.username}</td></tr>
                          <tr><td style="color:#6B7A99;padding:4px 0;">Plan</td><td style="color:#F5F3EE;text-align:right;">${member.plan} — 3 months free</td></tr>
                        </table>
                      </div>
                      <div style="text-align:center;">
                        <a href="https://offmarketpropertynetwork.com.au/login" style="display:inline-block;background:#C9A84C;color:#000;font-size:14px;font-weight:600;padding:14px 32px;text-decoration:none;">Sign in to your account →</a>
                      </div>
                    </div>
                    <div style="padding:24px 40px;border-top:1px solid #1E2A45;">
                      <p style="font-size:11px;color:#6B7A99;margin:0;text-align:center;">Off Market Property Network · Australia-wide · Verified professionals only</p>
                    </div>
                  </div>
                </body>
                </html>
              `
            })
          })
        } catch(e) { console.error('Email error:', e) }
      }
    }
    fetchAll()
  }

  const deleteMember = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return
    const db = await getSupabase()
    await db.from('members').delete().eq('id', id)
    fetchAll()
  }

  if (!authorized) return <div style={{background:s.bg,minHeight:'100vh'}}></div>

  const tabs = ['Pending','Active','All members','Listings','Stats']
  const pendingMembers = members.filter(m=>m.status==='pending')
  const activeMembers = members.filter(m=>m.status==='active')

  const MemberRow = ({m}) => (
    <div style={{background:s.bg2,display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:16,alignItems:'center',padding:'16px 20px'}}>
      <div>
        <div style={{fontSize:14,color:s.white,fontWeight:600}}>{m.first_name} {m.last_name}</div>
        <div style={{fontSize:12,color:s.muted}}>@{m.username}</div>
        <div style={{fontSize:11,color:s.muted}}>{m.email}</div>
      </div>
      <div>
        <div style={{fontSize:13,color:s.mid}}>{m.agency}</div>
        <div style={{fontSize:11,color:s.muted}}>{m.role} · {m.state}</div>
        <div style={{fontSize:11,color:s.gold}}>{m.plan} plan</div>
      </div>
      <div>
        <div style={{fontSize:11,color:s.muted,marginBottom:4}}>{m.license_number}</div>
        <div style={{fontSize:11,color:s.muted}}>{new Date(m.trial_start).toLocaleDateString('en-AU')}</div>
        <div style={{display:'inline-block',fontSize:9,letterSpacing:'0.15em',textTransform:'uppercase',padding:'2px 8px',border:`1px solid`,color:m.status==='active'?s.green:m.status==='pending'?s.gold:s.red,borderColor:m.status==='active'?s.green:m.status==='pending'?s.gold:s.red,marginTop:4}}>{m.status}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {m.status==='pending'&&(
          <button onClick={()=>updateMemberStatus(m.id,'active')} style={{background:s.green,border:'none',color:'#000',fontSize:11,fontWeight:600,padding:'6px 12px',cursor:'pointer'}}>✓ Approve</button>
        )}
        {m.status==='active'&&(
          <button onClick={()=>updateMemberStatus(m.id,'suspended')} style={{background:'none',border:`1px solid ${s.red}`,color:s.red,fontSize:11,padding:'6px 12px',cursor:'pointer'}}>Suspend</button>
        )}
        {m.status==='suspended'&&(
          <button onClick={()=>updateMemberStatus(m.id,'active')} style={{background:'none',border:`1px solid ${s.green}`,color:s.green,fontSize:11,padding:'6px 12px',cursor:'pointer'}}>Reinstate</button>
        )}
        <button onClick={()=>deleteMember(m.id)} style={{background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:11,padding:'6px 12px',cursor:'pointer'}}>Delete</button>
      </div>
    </div>
  )

  return (
    <div style={{background:s.bg,minHeight:'100vh',color:s.white}}>
      <Nav/>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'40px 20px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
          <div>
            <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:8}}>Admin panel</div>
            <h1 style={{fontSize:'clamp(22px,4vw,32px)',color:s.white,fontWeight:600}}>Off Market Property Network</h1>
          </div>
          <button onClick={()=>{localStorage.removeItem('member');router.push('/login')}} style={{background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:12,padding:'8px 16px',cursor:'pointer'}}>Sign out</button>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:32}}>
          {[['Total members',stats.total,s.mid],['Pending approval',stats.pending,s.gold],['Active members',stats.active,s.green],['Total listings',stats.listings,s.gold]].map(([label,val,color])=>(
            <div key={label} style={{background:s.bg3,border:`1px solid ${s.border}`,padding:20}}>
              <div style={{fontSize:10,letterSpacing:'0.25em',color:s.muted,textTransform:'uppercase',marginBottom:8}}>{label}</div>
              <div style={{fontSize:32,color,fontWeight:600}}>{val}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:1,background:s.border,marginBottom:1}}>
          {tabs.map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{background:tab===activeTab?s.bg3:s.bg2,border:'none',color:tab===activeTab?s.gold:s.muted,fontSize:13,padding:'12px 20px',cursor:'pointer',position:'relative'}}>
              {tab}
              {tab==='Pending'&&stats.pending>0&&<span style={{background:s.red,color:s.white,fontSize:9,borderRadius:'50%',width:16,height:16,display:'inline-flex',alignItems:'center',justifyContent:'center',marginLeft:6}}>{stats.pending}</span>}
            </button>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:1,background:s.border}}>
          {loading ? (
            <div style={{background:s.bg2,padding:40,textAlign:'center',color:s.muted}}>Loading...</div>
          ) : activeTab === 'Pending' ? (
            pendingMembers.length === 0 ? (
              <div style={{background:s.bg2,padding:40,textAlign:'center',color:s.muted}}>No pending members</div>
            ) : pendingMembers.map(m=><MemberRow key={m.id} m={m}/>)
          ) : activeTab === 'Active' ? (
            activeMembers.filter(m=>m.username!==ADMIN_USERNAME).map(m=><MemberRow key={m.id} m={m}/>)
          ) : activeTab === 'All members' ? (
            members.filter(m=>m.username!==ADMIN_USERNAME).map(m=><MemberRow key={m.id} m={m}/>)
          ) : activeTab === 'Listings' ? (
            listings.length === 0 ? (
              <div style={{background:s.bg2,padding:40,textAlign:'center',color:s.muted}}>No listings yet</div>
            ) : listings.map(l=>(
              <div key={l.id} style={{background:s.bg2,display:'grid',gridTemplateColumns:'80px 1fr auto',gap:16,alignItems:'center',padding:'16px 20px'}}>
                {l.images&&l.images[0]?<img src={l.images[0]} alt={l.title} style={{width:80,height:56,objectFit:'cover',opacity:0.8}}/>:<div style={{width:80,height:56,background:s.bg4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:s.muted}}>No img</div>}
                <div>
                  <div style={{fontSize:14,color:s.white,fontWeight:600,marginBottom:4}}>{l.title}</div>
                  <div style={{fontSize:12,color:s.muted}}>{l.suburb} · {l.state} · {l.property_type}</div>
                  <div style={{fontSize:11,color:s.gold,marginTop:4}}>{l.price_guide}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
                  <div style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',padding:'2px 8px',border:`1px solid`,color:l.status==='active'?s.green:s.muted,borderColor:l.status==='active'?s.green:s.border}}>{l.status}</div>
                  <div style={{fontSize:11,color:s.muted}}>{new Date(l.created_at).toLocaleDateString('en-AU')}</div>
                  <Link href={`/listings/${l.id}`} style={{fontSize:11,color:s.gold,textDecoration:'none'}}>View →</Link>
                </div>
              </div>
            ))
          ) : activeTab === 'Stats' ? (
            <div style={{background:s.bg2,padding:32}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
                {[
                  ['Members by state', members.reduce((acc,m)=>{acc[m.state]=(acc[m.state]||0)+1;return acc},{})],
                  ['Members by plan', members.reduce((acc,m)=>{acc[m.plan]=(acc[m.plan]||0)+1;return acc},{})],
                  ['Members by role', members.reduce((acc,m)=>{acc[m.role]=(acc[m.role]||0)+1;return acc},{})],
                  ['Listings by state', listings.reduce((acc,l)=>{acc[l.state]=(acc[l.state]||0)+1;return acc},{})],
                ].map(([title, data])=>(
                  <div key={title} style={{background:s.bg3,border:`1px solid ${s.border}`,padding:20}}>
                    <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>{title}</div>
                    {Object.entries(data).map(([key,val])=>(
                      <div key={key} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${s.border}`}}>
                        <span style={{fontSize:13,color:s.mid}}>{key}</span>
                        <span style={{fontSize:13,color:s.white,fontWeight:600}}>{val}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
