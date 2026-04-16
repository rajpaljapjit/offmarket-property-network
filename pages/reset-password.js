import Nav from '../components/Nav'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#B8923A',goldDim:'rgba(184,146,58,0.1)',bg:'#F8F6F1',bg2:'#FFFFFF',bg3:'#F2EFE9',bg4:'#EAE6DE',white:'#1C1A17',cream:'#4A4640',muted:'#8A8178',mid:'#4A4640',border:'rgba(184,146,58,0.2)',borderGold:'rgba(184,146,58,0.35)',error:'#CC3333',silver:'#4A4640'}

export default function ResetPassword() {
  const router = useRouter()
  const { token } = router.query
  const [form, setForm] = useState({password:'',confirmPassword:''})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validToken, setValidToken] = useState(null)

  useEffect(() => {
    if (token) verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      const res = await fetch(`/api/verify-reset-token?token=${token}`)
      const data = await res.json()
      setValidToken(res.ok)
    } catch { setValidToken(false) }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({token, password: form.password})
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error||'Something went wrong.') }
      else { setSuccess(true) }
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(false)
  }

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}
  const lab = {fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase',marginBottom:6,display:'block'}

  return (
    <div style={{background:s.bg,minHeight:'100vh'}}>
      <Nav/>
      <div style={{maxWidth:420,margin:'0 auto',padding:'80px 20px'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <img src="/offmarkethublogo.png" alt="Off Market Property Network" style={{height:62,marginBottom:16}}/>
          <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase'}}>Password reset</div>
        </div>
        <div style={{background:s.bg2,border:`1px solid ${s.border}`,padding:36}}>
          {success ? (
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:48,marginBottom:16}}>✅</div>
              <h2 style={{fontSize:20,color:s.white,fontWeight:600,marginBottom:12}}>Password updated!</h2>
              <p style={{fontSize:13,color:s.muted,lineHeight:1.7,marginBottom:24}}>Your password has been successfully updated. You can now sign in with your new password.</p>
              <Link href="/login" style={{display:'inline-block',background:'#B8923A',color:'#fff',padding:'12px 24px',fontSize:14,fontWeight:600,textDecoration:'none'}}>Sign in now →</Link>
            </div>
          ) : validToken === false ? (
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:48,marginBottom:16}}>❌</div>
              <h2 style={{fontSize:20,color:s.white,fontWeight:600,marginBottom:12}}>Invalid or expired link</h2>
              <p style={{fontSize:13,color:s.muted,lineHeight:1.7,marginBottom:24}}>This password reset link is invalid or has expired. Please request a new one.</p>
              <Link href="/forgot-password" style={{color:s.gold,fontSize:13,textDecoration:'none'}}>Request new link →</Link>
            </div>
          ) : (
            <>
              <h2 style={{fontSize:20,color:s.white,fontWeight:600,marginBottom:4}}>Choose new password</h2>
              <p style={{fontSize:13,color:s.muted,marginBottom:24}}>Enter your new password below.</p>
              {error&&<div style={{background:'rgba(255,149,0,0.08)',border:'1px solid rgba(255,149,0,0.25)',padding:'12px 16px',marginBottom:20,fontSize:13,color:s.error,borderRadius:2}}>{error}</div>}
              <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div>
                  <label style={lab}>New password *</label>
                  <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min. 8 characters" style={input} required/>
                </div>
                <div>
                  <label style={lab}>Confirm new password *</label>
                  <input type="password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} placeholder="Repeat new password" style={input} required/>
                </div>
                <button type="submit" disabled={loading} style={{background:loading?'rgba(201,169,110,0.5)':s.gold,border:'none',color:'#fff',fontSize:14,fontWeight:600,padding:14,cursor:loading?'not-allowed':'pointer',opacity:loading?0.8:1}}>
                  {loading?'Updating...':'Update password →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
