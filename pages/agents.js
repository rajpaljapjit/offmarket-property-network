import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const s={gold:'#B8923A',goldDim:'rgba(184,146,58,0.1)',bg:'#F8F6F1',bg2:'#FFFFFF',bg3:'#F2EFE9',bg4:'#EAE6DE',white:'#1C1A17',cream:'#4A4640',muted:'#8A8178',mid:'#4A4640',border:'rgba(184,146,58,0.2)',borderGold:'rgba(184,146,58,0.35)',error:'#CC3333',silver:'#4A4640'}

export default function Agents() {
  const [member, setMember] = useState(null)
  const [agents, setAgents] = useState([])
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterState, setFilterState] = useState('All States')
  const [filterRole, setFilterRole] = useState('All Roles')

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (stored) {
      const m = JSON.parse(stored)
      setMember(m)
      fetchAgents(m.id)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchAgents = async (memberId) => {
    try {
      const res = await fetch(`/api/agents${memberId ? `?memberId=${memberId}` : ''}`)
      const data = await res.json()
      setAgents(data.agents || [])
      setFavourites(data.favourites || [])
    } catch(err) { console.error(err) }
    setLoading(false)
  }

  const toggleFavourite = async (agent) => {
    if (!member) return
    if (favourites.includes(agent.id)) {
      await fetch('/api/agents', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ memberId: member.id, agentId: agent.id }) })
      setFavourites(favourites.filter(id => id !== agent.id))
    } else {
      await fetch('/api/agents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ memberId: member.id, agent }) })
      setFavourites([...favourites, agent.id])
    }
  }

  const filtered = agents.filter(a => {
    if (member && a.id === member.id) return false
    const q = search.toLowerCase()
    const matchSearch = !search ||
      `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
      a.agency?.toLowerCase().includes(q) ||
      a.username?.toLowerCase().includes(q)
    const matchState = filterState === 'All States' || a.state === filterState
    const matchRole = filterRole === 'All Roles' || a.role === filterRole
    return matchSearch && matchState && matchRole
  })

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.white,fontSize:13,padding:'10px 14px'}

  return (
    <div style={{background:s.bg,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        .agents-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(184,146,58,0.1);}
        @media(max-width:900px){.agents-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:600px){.agents-grid{grid-template-columns:1fr;}}
      `}</style>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'48px 20px 60px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Agent directory</div>
        <h1 style={{fontSize:'clamp(28px,5vw,40px)',color:s.white,marginBottom:12,fontWeight:600}}>Verified members</h1>
        <p style={{color:s.muted,marginBottom:32}}>All agents are license-verified real estate professionals. Star an agent to add them to your favourites.</p>

        {!member ? (
          <div style={{textAlign:'center',padding:'60px 20px',background:s.bg2,border:`1px solid ${s.border}`}}>
            <div style={{fontSize:32,marginBottom:16}}>🔒</div>
            <h2 style={{fontSize:22,color:s.white,marginBottom:12,fontWeight:600}}>Members only</h2>
            <p style={{color:s.muted,marginBottom:24,maxWidth:400,margin:'0 auto 24px'}}>The agent directory is exclusively available to verified members.</p>
            <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
              <Link href="/login" style={{background:'#B8923A',color:'#fff',padding:'14px 28px',fontSize:14,fontWeight:600,textDecoration:'none'}}>Sign in to view agents</Link>
              <Link href="/signup" style={{border:`1px solid ${s.silver}`,color:s.silver,padding:'14px 28px',fontSize:14,textDecoration:'none'}}>Join free</Link>
            </div>
          </div>
        ) : loading ? (
          <div style={{textAlign:'center',padding:'60px 0',color:s.muted}}>Loading agents...</div>
        ) : (
          <>
            <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:'16px 20px',marginBottom:32}}>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:12}}>
                <input type="text" placeholder="Search by name, agency or username..." value={search} onChange={e=>setSearch(e.target.value)} style={{...input,width:'100%',boxSizing:'border-box'}}/>
                <select value={filterState} onChange={e=>setFilterState(e.target.value)} style={{...input,padding:'10px 14px'}}>
                  <option>All States</option>
                  <option>QLD</option><option>NSW</option><option>VIC</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option>
                </select>
                <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} style={{...input,padding:'10px 14px'}}>
                  <option>All Roles</option>
                  <option>Selling Agent</option>
                  <option>Buyers Agent</option>
                  <option>Both</option>
                </select>
              </div>
              <div style={{fontSize:12,color:s.muted,marginTop:12}}>{filtered.length} verified agent{filtered.length!==1?'s':''}</div>
            </div>

            {filtered.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 0'}}>
                <div style={{fontSize:32,marginBottom:16}}>🔍</div>
                <div style={{fontSize:16,color:s.white,marginBottom:8}}>No agents found</div>
                <div style={{fontSize:13,color:s.muted}}>Try adjusting your search or filters</div>
              </div>
            ) : (
              <div className="agents-grid">
                {filtered.map(a=>(
                  <div key={a.id} style={{background:s.bg2,padding:24,position:'relative'}}>
                    <button onClick={()=>toggleFavourite(a)} style={{position:'absolute',top:16,right:16,background:'none',border:'none',fontSize:20,cursor:'pointer',color:favourites.includes(a.id)?s.gold:s.border}}>
                      {favourites.includes(a.id)?'★':'☆'}
                    </button>
                    <div style={{width:48,height:48,borderRadius:'50%',background:s.bg4,border:`1px solid ${s.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:s.gold,marginBottom:14,fontWeight:600}}>
                      {a.first_name?.[0]}{a.last_name?.[0]}
                    </div>
                    <div style={{fontSize:17,color:s.white,marginBottom:4,fontWeight:600}}>{a.first_name} {a.last_name}</div>
                    <div style={{fontSize:11,color:s.gold,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:12}}>{a.agency}</div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
                      {[a.role,a.state].map(t=>t&&<span key={t} style={{fontSize:9,letterSpacing:'0.1em',color:s.muted,border:`1px solid ${s.border}`,padding:'2px 6px',textTransform:'uppercase'}}>{t}</span>)}
                    </div>
                    <div style={{fontSize:9,letterSpacing:'0.15em',color:s.gold,textTransform:'uppercase'}}>✓ Verified · {a.plan} plan</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer/>
    </div>
  )
}
