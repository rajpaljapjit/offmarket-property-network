import Nav from '../components/Nav'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', mobile: '', username: '', password: '', agency: '', role: 'Selling Agent', state: 'QLD', licenseNumber: '', plan: 'Silver'
  })
  const s = {gold:'#C9A84C',black:'#0A0A0A',black3:'#1A1A1A',white:'#F5F3EE',muted:'#7A7A7A',border:'#2A2A2A',red:'#E24B4A'}
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value})
  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/signup', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.') } else { router.push(`/welcome?name=${encodeURIComponent(form.firstName)}&email=${encodeURIComponent(form.email)}`) }
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(false)
  }
  const input = {background:s.black3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}
  const lab = {fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}
  return (
    <div style={{background:s.black,minHeight:'100vh'}}>
      <Nav/>
      <style>{`.auth-grid{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 64px);}.auth-left{display:flex;}@media(max-width:768px){.auth-grid{grid-template-columns:1fr;}.auth-left{display:none;}}`}</style>
      <div className="auth-grid">
        <div className="auth-left" style={{background:s.black3,borderRight:`1px solid ${s.border}`,padding:'48px 40px',flexDirection:'column',justifyContent:'space-between'}}>
          <Link href="/" style={{textDecoration:'none'}}><div style={{fontSize:18,fontWeight:700,color:s.white}}>OFF MARKET</div><div style={{fontSize:9,letterSpacing:'0.35em',color:s.gold,textTransform:'uppercase'}}>Property Network</div></Link>
          <div><div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>🎉 Limited time offer</div><p style={{fontSize:22,color:s.white,lineHeight:1.4,marginBottom:16,fontWeight:600}}>3 months completely free for all verified agents and buyers agents.</p><p style={{fontSize:14,color:s.muted,lineHeight:1.7}}>No credit card required. No obligation.</p></div>
          <div style={{display:'flex',gap:40}}><div><div style={{fontSize:28,color:s.gold,fontWeight:600}}>3 months</div><div style={{fontSize:10,color:s.muted,textTransform:'uppercase'}}>Free access</div></div><div><div style={{fontSize:28,color:s.gold,fontWeight:600}}>2,400+</div><div style={{fontSize:10,color:s.muted,textTransform:'uppercase'}}>Verified members</div></div></div>
        </div>
        <div style={{padding:'48px 40px',overflowY:'auto'}}>
          <h2 style={{fontSize:'clamp(22px,4vw,28px)',color:s.white,marginBottom:4,fontWeight:600}}>Apply for free membership</h2>
          <p style={{color:s.muted,marginBottom:24,fontSize:14}}>Verified professionals only. 3 months free. No credit card required.</p>
          {error && <div style={{background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.3)',padding:'12px 16px',marginBottom:20,fontSize:13,color:s.red,borderRadius:2}}>{error}</div>}
          <form style={{display:'flex',flexDirection:'column',gap:14,maxWidth:480}} onSubmit={handleSubmit}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>First name *</label><input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder="Jane" style={input} required/></div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>Last name *</label><input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder="Smith" style={input} required/></div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>Email address *</label><input name="email" value={form.email} onChange={handleChange} type="email" placeholder="jane@agency.com.au" style={input} required/></div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>Mobile number *</label><input name="mobile" value={form.mobile} onChange={handleChange} type="tel" placeholder="04XX XXX XXX" style={input} required/></div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>Agency name *</label><input name="agency" value={form.agency} onChange={handleChange} type="text" placeholder="Smith Property Group" style={input} required/></div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>Real estate license number *</label><input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} type="text" placeholder="e.g. QLD-1234567" style={input} required/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>I am a</label><select name="role" value={form.role} onChange={handleChange} style={{...input,padding:'12px 14px'}}><option>Selling Agent</option><option>Buyers Agent</option><option>Both</option></select></div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>State</label><select name="state" value={form.state} onChange={handleChange} style={{...input,padding:'12px 14px'}}><option>QLD</option><option>NSW</option><option>VIC</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option></select></div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>Membership plan</label><select name="plan" value={form.plan} onChange={handleChange} style={{...input,padding:'12px 14px'}}><option value="Bronze">Bronze — $49/mo after trial</option><option value="Silver">Silver — $99/mo after trial (Most popular)</option><option value="Gold">Gold — $179/mo after trial</option><option value="Platinum">Platinum — $349/mo after trial</option></select></div>
            <div style={{borderTop:`1px solid ${s.border}`,paddingTop:14}}><div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:14}}>Create your login</div></div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>Username *</label><input name="username" value={form.username} onChange={handleChange} type="text" placeholder="e.g. janesmith" style={input} required/></div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={lab}>Password *</label><input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Min. 8 characters" style={input} required/></div>
            <button type="submit" disabled={loading} style={{background:loading?'#8A6A1F':s.gold,border:'none',color:'#000',fontSize:15,fontWeight:600,padding:14,cursor:loading?'not-allowed':'pointer',marginTop:4,opacity:loading?0.8:1}}>{loading ? 'Submitting...' : 'Apply for Free Membership →'}</button>
            <p style={{fontSize:12,color:s.muted,textAlign:'center'}}>3 months free · No credit card · Cancel any time</p>
            <div style={{fontSize:12,color:s.muted,textAlign:'center'}}>Already a member? <Link href="/login" style={{color:s.gold,textDecoration:'none'}}>Sign in</Link></div>
          </form>
        </div>
      </div>
    </div>
  )
}
