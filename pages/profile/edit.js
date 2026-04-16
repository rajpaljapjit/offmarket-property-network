import toast from 'react-hot-toast'
import Nav from '../../components/Nav'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#B8923A',goldDim:'rgba(184,146,58,0.1)',bg:'#F8F6F1',bg2:'#FFFFFF',bg3:'#F2EFE9',bg4:'#EAE6DE',white:'#1C1A17',cream:'#4A4640',muted:'#8A8178',mid:'#4A4640',border:'rgba(184,146,58,0.2)',borderGold:'rgba(184,146,58,0.35)',error:'#CC3333',silver:'#4A4640'}

export default function EditProfile() {
  const router = useRouter()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', mobile:'', agency:'', role:'Selling Agent', state:'QLD'
  })

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}
  const lab = {fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase',marginBottom:6,display:'block'}


  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (!stored) { router.push('/login'); return }
    const m = JSON.parse(stored)
    setMember(m)
    setForm({
      firstName: m.firstName || '',
      lastName: m.lastName || '',
      email: m.email || '',
      mobile: m.mobile || '',
      agency: m.agency || '',
      role: m.role || 'Selling Agent',
      state: m.state || 'QLD'
    })
  }, [])

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value})

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      const res = await fetch('/api/member', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: member.id, ...form }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'Update failed')
      } else {
        const updated = {...member, firstName:form.firstName, lastName:form.lastName, email:form.email, mobile:form.mobile, agency:form.agency, role:form.role, state:form.state}
        localStorage.setItem('member', JSON.stringify(updated))
        setMember(updated)
        toast.success('Profile updated successfully!')
      }
    } catch { toast.error('Something went wrong.') }
    setLoading(false)
  }

  if (!member) return <div style={{background:s.bg,minHeight:'100vh'}}></div>

  return (
    <div style={{background:s.bg,minHeight:'100vh',color:s.white}}>
      <Nav/>
      <div style={{maxWidth:600,margin:'0 auto',padding:'48px 20px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Account</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
          <h1 style={{fontSize:'clamp(22px,4vw,32px)',color:s.white,fontWeight:600}}>Edit profile</h1>
          <button onClick={()=>router.push('/dashboard')} style={{background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:13,padding:'8px 16px',cursor:'pointer'}}>← Back</button>
        </div>
        {error&&<div style={{background:'rgba(255,149,0,0.08)',border:'1px solid rgba(255,149,0,0.25)',padding:'12px 16px',marginBottom:24,fontSize:13,color:s.error,borderRadius:2}}>{error}</div>}
        {success&&<div style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',padding:'12px 16px',marginBottom:24,fontSize:13,color:s.gold,borderRadius:2}}>{success}</div>}
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:28}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>Personal details</div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div><label style={lab}>First name *</label><input name="firstName" value={form.firstName} onChange={handleChange} type="text" style={input} required/></div>
                <div><label style={lab}>Last name *</label><input name="lastName" value={form.lastName} onChange={handleChange} type="text" style={input} required/></div>
              </div>
              <div><label style={lab}>Email address *</label><input name="email" value={form.email} onChange={handleChange} type="email" style={input} required/></div>
              <div><label style={lab}>Mobile number</label><input name="mobile" value={form.mobile} onChange={handleChange} type="tel" placeholder="04XX XXX XXX" style={input}/></div>
            </div>
          </div>
          <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:28}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>Professional details</div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div><label style={lab}>Agency name *</label><input name="agency" value={form.agency} onChange={handleChange} type="text" style={input} required/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div><label style={lab}>Role</label>
                  <select name="role" value={form.role} onChange={handleChange} style={{...input,padding:'12px 14px'}}>
                    <option>Selling Agent</option><option>Buyers Agent</option><option>Both</option>
                  </select>
                </div>
                <div><label style={lab}>State</label>
                  <select name="state" value={form.state} onChange={handleChange} style={{...input,padding:'12px 14px'}}>
                    <option>QLD</option><option>NSW</option><option>VIC</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:20}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:s.muted,textTransform:'uppercase',marginBottom:12}}>Cannot be changed</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div><div style={{fontSize:11,color:s.muted,marginBottom:4}}>Username</div><div style={{fontSize:14,color:s.white,padding:'10px 12px',background:s.bg4,border:`1px solid ${s.border}`}}>{member.username}</div></div>
              <div><div style={{fontSize:11,color:s.muted,marginBottom:4}}>Plan</div><div style={{fontSize:14,color:s.gold,padding:'10px 12px',background:s.bg4,border:`1px solid ${s.border}`}}>{member.plan}</div></div>
            </div>
          </div>
          <div style={{display:'flex',gap:12}}>
            <button type="button" onClick={()=>router.push('/dashboard')} style={{flex:1,background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:14,padding:14,cursor:'pointer'}}>Cancel</button>
            <button type="submit" disabled={loading} style={{flex:2,background:loading?'rgba(201,169,110,0.5)':s.gold,border:'none',color:'#fff',fontSize:15,fontWeight:600,padding:14,cursor:loading?'not-allowed':'pointer',opacity:loading?0.8:1}}>
              {loading?'Saving...':'Save changes →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
