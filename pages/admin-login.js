import { useState } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#C9A84C',bg:'#0A0F1E',bg2:'#0F1628',bg3:'#151D35',white:'#F5F3EE',muted:'#6B7A99',border:'#1E2A45',red:'#E24B4A'}

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({username:'',password:'',key:''})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
          <img src="/ompnherofilelogo.png" alt="Off Market Property Network" style={{height:48,marginBottom:16}}/>
          <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase'}}>Admin access</div>
        </div>
        <div style={{background:s.bg2,border:`1px solid ${s.border}`,padding:36}}>
          <h2 style={{fontSize:20,color:s.white,fontWeight:600,marginBottom:4}}>Admin sign in</h2>
          <p style={{fontSize:13,color:s.muted,marginBottom:24}}>Restricted access. Authorised personnel only.</p>
          {error&&<div style={{background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.3)',padding:'12px 16px',marginBottom:20,fontSize:13,color:s.red,borderRadius:2}}>{error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <label style={lab}>Admin key *</label>
              <input name="key" value={form.key} onChange={e=>setForm({...form,key:e.target.value})} type="password" placeholder="Enter admin key" style={input} required/>
            </div>
            <div>
              <label style={lab}>Username *</label>
              <input name="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} type="text" placeholder="Admin username" style={input} required/>
            </div>
            <div>
              <label style={lab}>Password *</label>
              <input name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="••••••••" style={input} required/>
            </div>
            <button type="submit" disabled={loading} style={{background:loading?'#8A6A1F':s.gold,border:'none',color:'#000',fontSize:14,fontWeight:600,padding:14,cursor:loading?'not-allowed':'pointer',marginTop:4,opacity:loading?0.8:1}}>
              {loading?'Signing in...':'Access admin panel →'}
            </button>
          </form>
        </div>
        <p style={{fontSize:11,color:s.muted,textAlign:'center',marginTop:16}}>Off Market Property Network · Restricted access</p>
      </div>
    </div>
  )
}
