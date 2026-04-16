import { useState } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#B8923A',goldDim:'rgba(184,146,58,0.1)',bg:'#F8F6F1',bg2:'#FFFFFF',bg3:'#F2EFE9',bg4:'#EAE6DE',white:'#1C1A17',cream:'#4A4640',muted:'#8A8178',mid:'#4A4640',border:'rgba(184,146,58,0.2)',borderGold:'rgba(184,146,58,0.35)',error:'#CC3333',silver:'#4A4640'}

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({username:'',password:'',key:''})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const EyeIcon = ({ show }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </>
      )}
    </svg>
  )

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error||'Invalid credentials.') }
      else {
        localStorage.setItem('member', JSON.stringify(data.member))
        localStorage.setItem('adminAuth', 'true')
        sessionStorage.setItem('adminKey', form.key.trim())
        router.push('/admin')
      }
    } catch { setError('Something went wrong.') }
    setLoading(false)
  }

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}
  const lab = {fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase',marginBottom:6,display:'block'}

  return (
    <div style={{background:s.bg,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <img src="/offmarkethublogo.png" alt="Off Market Property Network" style={{height:62,marginBottom:16}}/>
          <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase'}}>Admin access</div>
        </div>
        <div style={{background:s.bg2,border:`1px solid ${s.border}`,padding:36}}>
          <h2 style={{fontSize:20,color:s.white,fontWeight:600,marginBottom:4}}>Admin sign in</h2>
          <p style={{fontSize:13,color:s.muted,marginBottom:24}}>Restricted access. Authorised personnel only.</p>
          {error&&<div style={{background:'rgba(255,149,0,0.08)',border:'1px solid rgba(255,149,0,0.25)',padding:'12px 16px',marginBottom:20,fontSize:13,color:s.error,borderRadius:2}}>{error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <label style={lab}>Admin key *</label>
              <div style={{position:'relative'}}>
                <input name="key" value={form.key} onChange={e=>setForm({...form,key:e.target.value})} type={showKey?'text':'password'} placeholder="Enter admin key" style={{...input,paddingRight:44}} required/>
                <button type="button" onClick={()=>setShowKey(!showKey)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:0,lineHeight:1}}>
                  <EyeIcon show={showKey}/>
                </button>
              </div>
            </div>
            <div>
              <label style={lab}>Username *</label>
              <input name="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} type="text" placeholder="Admin username" style={input} required/>
            </div>
            <div>
              <label style={lab}>Password *</label>
              <div style={{position:'relative'}}>
                <input name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type={showPassword?'text':'password'} placeholder="••••••••" style={{...input,paddingRight:44}} required/>
                <button type="button" onClick={()=>setShowPassword(!showPassword)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:0,lineHeight:1}}>
                  <EyeIcon show={showPassword}/>
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{background:loading?'rgba(201,169,110,0.5)':s.gold,border:'none',color:'#fff',fontSize:14,fontWeight:600,padding:14,cursor:loading?'not-allowed':'pointer',marginTop:4,opacity:loading?0.8:1}}>
              {loading?'Signing in...':'Access admin panel →'}
            </button>
          </form>
        </div>
        <p style={{fontSize:11,color:s.muted,textAlign:'center',marginTop:16}}>Off Market Property Network · Restricted access</p>
      </div>
    </div>
  )
}
