import Nav from '../components/Nav'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#B8923A',goldDim:'rgba(184,146,58,0.1)',bg:'#F8F6F1',bg2:'#FFFFFF',bg3:'#F2EFE9',bg4:'#EAE6DE',white:'#1C1A17',cream:'#4A4640',muted:'#8A8178',mid:'#4A4640',border:'rgba(184,146,58,0.2)',borderGold:'rgba(184,146,58,0.35)',error:'#CC3333',silver:'#4A4640'}

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get('reason')
    if (reason === 'suspended') setError('Your account has been suspended. Please contact support@offmarketpropertynetwork.com.au')
    if (reason === 'deleted') setError('Your account no longer exists. Please contact support@offmarketpropertynetwork.com.au')
  }, [])
  const [form, setForm] = useState({ username: '', password: '' })
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value})

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        if (data.member.status === 'pending') {
          setError('Your account is awaiting verification. We will notify you by email once approved — this usually takes 24-48 hours.')
        } else if (data.member.status === 'suspended') {
          setError('Your account has been suspended. Please contact support@offmarketpropertynetwork.com.au')
        } else if (data.member.status === 'rejected') {
          setError('Your application was not approved. Please contact support@offmarketpropertynetwork.com.au')
        } else {
          localStorage.setItem('member', JSON.stringify(data.member))
        localStorage.setItem('sessionTime', Date.now().toString())
          router.push('/dashboard')
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}
  const lab = {fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}

  return (
    <div style={{background:s.bg,minHeight:'100vh'}}>
      <Nav/>
      <style>{`.auth-grid{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 64px);}.auth-left{display:flex;}@media(max-width:768px){.auth-grid{grid-template-columns:1fr;}.auth-left{display:none;}}`}</style>
      <div className="auth-grid">
        <div className="auth-left" style={{position:'relative',overflow:'hidden',flexDirection:'column',justifyContent:'space-between'}}>
          {/* Video background */}
          <video autoPlay muted loop playsInline poster="/Heroimage.png"
            style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',pointerEvents:'none'}}>
            <source src="/video3.mp4" type="video/mp4"/>
          </video>
          {/* Dark overlay */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(160deg,rgba(9,9,15,0.85) 0%,rgba(9,9,15,0.60) 50%,rgba(9,9,15,0.80) 100%)'}}/>
          {/* Colour glow */}
          <div style={{position:'absolute',top:'-10%',left:'-10%',width:'70%',height:'60%',background:'radial-gradient(ellipse,rgba(201,169,110,0.18) 0%,transparent 65%)',pointerEvents:'none'}}/>
          {/* Content overlaid on video */}
          <div style={{position:'relative',zIndex:1,padding:'48px 40px',display:'flex',flexDirection:'column',justifyContent:'space-between',height:'100%'}}>
            <Link href="/" style={{textDecoration:'none'}}>
              <img src="/offmarkethublogo.png" alt="Off Market Property Network" style={{height:86,width:'auto',objectFit:'contain'}}/>
            </Link>
            <div>
              <div style={{fontSize:11,letterSpacing:'0.15em',color:s.gold,textTransform:'uppercase',marginBottom:14,opacity:0.9}}>Member review</div>
              <p style={{fontSize:22,color:'#FFFFFF',lineHeight:1.5,marginBottom:16,fontWeight:600}}>&ldquo;The only platform where I can share a prestige listing and know it&apos;s in front of qualified buyers agents.&rdquo;</p>
              <span style={{fontSize:12,color:'rgba(255,255,255,0.65)'}}>Sarah H. · Selling agent · Gold Coast</span>
            </div>
            <div style={{display:'flex',gap:40}}>
              <div>
                <div style={{fontSize:28,color:s.gold,fontWeight:700}}>2,400+</div>
                <div style={{fontSize:10,letterSpacing:'0.2em',color:'rgba(255,255,255,0.55)',textTransform:'uppercase',marginTop:4}}>Verified members</div>
              </div>
              <div>
                <div style={{fontSize:28,color:s.gold,fontWeight:700}}>$1.8B</div>
                <div style={{fontSize:10,letterSpacing:'0.2em',color:'rgba(255,255,255,0.55)',textTransform:'uppercase',marginTop:4}}>Off market value</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{padding:'48px 40px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <h2 style={{fontSize:'clamp(22px,4vw,28px)',color:s.white,marginBottom:8,fontWeight:600}}>Welcome back</h2>
          <p style={{color:s.muted,marginBottom:28,fontSize:14}}>Sign in with your username and password.</p>
          {error && (
            <div style={{background:'rgba(255,149,0,0.08)',border:'1px solid rgba(255,149,0,0.25)',padding:'12px 16px',marginBottom:20,fontSize:13,color:s.error,borderRadius:2}}>
              {error}
            </div>
          )}
          <form style={{display:'flex',flexDirection:'column',gap:16,maxWidth:400}} onSubmit={handleSubmit}>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={lab}>Username</label>
              <input name="username" value={form.username} onChange={handleChange} type="text" placeholder="your username" style={input} required/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={lab}>Password</label>
              <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="••••••••" style={input} required/>
            </div>
            <button type="submit" disabled={loading} style={{background:loading?'rgba(201,169,110,0.5)':s.gold,border:'none',color:'#F8F6F1',fontSize:14,fontWeight:600,padding:14,cursor:loading?'not-allowed':'pointer',marginTop:4,opacity:loading?0.8:1}}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
            <div style={{fontSize:12,color:s.muted,textAlign:'center'}}><Link href="/forgot-password" style={{color:s.gold,textDecoration:'none'}}>Forgot password?</Link></div>
            <div style={{fontSize:12,color:s.muted,textAlign:'center'}}>Not a member? <Link href="/signup" style={{color:s.gold,textDecoration:'none'}}>Join free for 3 months</Link></div>
          </form>
        </div>
      </div>
    </div>
  )
}
