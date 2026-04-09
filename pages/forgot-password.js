import Nav from '../components/Nav'
import Link from 'next/link'
import { useState } from 'react'

const s={gold:'#C9A84C',bg:'#1B2A1B',bg2:'#162016',bg3:'#1F2E1F',white:'#C9A84C',muted:'#8BA888',border:'#2D4A2D',red:'#E24B4A'}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({email})
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error||'Something went wrong.') }
      else { setSuccess(true) }
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(false)
  }

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}

  return (
    <div style={{background:s.bg,minHeight:'100vh'}}>
      <Nav/>
      <div style={{maxWidth:420,margin:'0 auto',padding:'80px 20px'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <img src="/Offmarketproplogo2.png" alt="Off Market Property Network" style={{height:48,marginBottom:16}}/>
          <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase'}}>Password reset</div>
        </div>
        <div style={{background:s.bg2,border:`1px solid ${s.border}`,padding:36}}>
          {success ? (
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:48,marginBottom:16}}>📧</div>
              <h2 style={{fontSize:20,color:s.white,fontWeight:600,marginBottom:12}}>Check your email</h2>
              <p style={{fontSize:13,color:s.muted,lineHeight:1.7,marginBottom:24}}>We've sent a password reset link to <strong style={{color:s.white}}>{email}</strong>. Check your inbox and follow the link to reset your password.</p>
              <Link href="/login" style={{color:s.gold,fontSize:13,textDecoration:'none'}}>← Back to login</Link>
            </div>
          ) : (
            <>
              <h2 style={{fontSize:20,color:s.white,fontWeight:600,marginBottom:4}}>Forgot password?</h2>
              <p style={{fontSize:13,color:s.muted,marginBottom:24}}>Enter your email and we'll send you a reset link.</p>
              {error&&<div style={{background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.3)',padding:'12px 16px',marginBottom:20,fontSize:13,color:s.red,borderRadius:2}}>{error}</div>}
              <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div>
                  <label style={{fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase',marginBottom:6,display:'block'}}>Email address *</label>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jane@agency.com.au" style={input} required/>
                </div>
                <button type="submit" disabled={loading} style={{background:loading?'#8A6A1F':s.gold,border:'none',color:'#000',fontSize:14,fontWeight:600,padding:14,cursor:loading?'not-allowed':'pointer',opacity:loading?0.8:1}}>
                  {loading?'Sending...':'Send reset link →'}
                </button>
                <div style={{textAlign:'center'}}>
                  <Link href="/login" style={{fontSize:12,color:s.muted,textDecoration:'none'}}>← Back to login</Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
