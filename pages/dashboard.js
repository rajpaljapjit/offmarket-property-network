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

export default function Dashboard() {
  const router = useRouter()
  const [member, setMember] = useState(null)
  const [listings, setListings] = useState([])
  const [activeSection, setActiveSection] = useState('Overview')

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (!stored) {
      router.push('/login')
      return
    }
    setMember(JSON.parse(stored))
  }, [])

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
      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 64px)'}}>
        <aside style={{background:black2,borderRight:`1px solid ${border}`,padding:'24px 0'}}>
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

        <main style={{padding:32}}>
          {activeSection === 'Overview' && (
            <>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
                <div>
                  <div style={{fontSize:10,letterSpacing:'0.4em',color:gold,textTransform:'uppercase',marginBottom:4}}>Member dashboard</div>
                  <h2 style={{fontSize:22,color:white,fontWeight:600}}>Good morning, {member.firstName}</h2>
                </div>
                <Link href="/listings/new" style={{background:gold,color:'#000',fontSize:13,fontWeight:500,padding:'8px 20px',textDecoration:'none'}}>+ New Listing</Link>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
                {[['Active listings','0',''],['Total enquiries','0',''],['Connections','0',''],['Off market sold','0','']].map(([label,val,sub])=>(
                  <div key={label} style={{background:black3,border:`1px solid ${border}`,padding:20}}>
                    <div style={{fontSize:10,letterSpacing:'0.25em',color:muted,textTransform:'uppercase',marginBottom:8}}>{label}</div>
                    <div style={{fontSize:28,color:white,fontWeight:600}}>{val}</div>
                    <div style={{fontSize:11,color:gold,marginTop:4}}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{background:black3,border:`1px solid ${border}`,padding:24,marginBottom:28}}>
                <div style={{fontSize:10,letterSpacing:'0.3em',color:gold,textTransform:'uppercase',marginBottom:16}}>Account status</div>
                <div style={{display:'flex',gap:32,flexWrap:'wrap'}}>
                  <div><div style={{fontSize:11,color:muted,marginBottom:4}}>Plan</div><div style={{fontSize:14,color:white,fontWeight:600}}>{member.plan}</div></div>
                  <div><div style={{fontSize:11,color:muted,marginBottom:4}}>Status</div><div style={{fontSize:14,color:member.status==='pending'?'#E24B4A':gold,fontWeight:600,textTransform:'capitalize'}}>{member.status}</div></div>
                  <div><div style={{fontSize:11,color:muted,marginBottom:4}}>Role</div><div style={{fontSize:14,color:white,fontWeight:600}}>{member.role}</div></div>
                  <div><div style={{fontSize:11,color:muted,marginBottom:4}}>Agency</div><div style={{fontSize:14,color:white,fontWeight:600}}>{member.agency}</div></div>
                </div>
              </div>
              <div style={{background:black3,border:`1px solid ${border}`,padding:24,textAlign:'center'}}>
                <div style={{fontSize:14,color:white,marginBottom:12,fontWeight:600}}>No listings yet</div>
                <p style={{fontSize:13,color:muted,marginBottom:20}}>Upload your first off market listing to start connecting with buyers agents.</p>
                <Link href="/listings/new" style={{background:gold,color:'#000',padding:'10px 24px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Upload a listing</Link>
              </div>
            </>
          )}

          {activeSection === 'My profile' && (
            <>
              <div style={{marginBottom:28}}>
                <div style={{fontSize:10,letterSpacing:'0.4em',color:gold,textTransform:'uppercase',marginBottom:4}}>Account</div>
                <h2 style={{fontSize:22,color:white,fontWeight:600}}>My profile</h2>
              </div>
              <div style={{background:black3,border:`1px solid ${border}`,padding:32,maxWidth:600}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
                  {[['First name',member.firstName],['Last name',member.lastName],['Email',member.email],['Username',member.username],['Agency',member.agency],['Role',member.role],['State',member.state],['Plan',member.plan]].map(([label,val])=>(
                    <div key={label}>
                      <div style={{fontSize:10,letterSpacing:'0.2em',color:muted,textTransform:'uppercase',marginBottom:6}}>{label}</div>
                      <div style={{fontSize:14,color:white,padding:'10px 12px',background:black4,border:`1px solid ${border}`}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!['Overview','My profile'].includes(activeSection) && (
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
