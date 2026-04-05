import Nav from '../components/Nav'
import Link from 'next/link'

export default function Login() {
  const s={gold:'#C9A84C',black:'#0A0A0A',black3:'#1A1A1A',white:'#F5F3EE',muted:'#7A7A7A',border:'#2A2A2A'}
  return (
    <div style={{background:s.black,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        .auth-grid{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 64px);}
        .auth-left{display:flex;}
        @media(max-width:768px){
          .auth-grid{grid-template-columns:1fr;}
          .auth-left{display:none;}
        }
      `}</style>
      <div className="auth-grid">
        <div className="auth-left" style={{background:s.black3,borderRight:`1px solid ${s.border}`,padding:'48px 40px',flexDirection:'column',justifyContent:'space-between'}}>
          <Link href="/" style={{textDecoration:'none'}}>
            <div style={{fontSize:18,fontWeight:700,color:s.white,letterSpacing:'0.05em'}}>OFF MARKET</div>
            <div style={{fontSize:9,letterSpacing:'0.35em',color:s.gold,textTransform:'uppercase'}}>Property Network</div>
          </Link>
          <div>
            <p style={{fontSize:22,color:s.white,lineHeight:1.4,marginBottom:16,fontWeight:600}}>&ldquo;The only platform where I can share a prestige listing and know it&apos;s in front of qualified buyers agents.&rdquo;</p>
            <span style={{fontSize:12,color:s.muted}}>Sarah H. · Selling agent · Gold Coast</span>
          </div>
          <div style={{display:'flex',gap:40}}>
            <div><div style={{fontSize:28,color:s.gold,fontWeight:600}}>2,400+</div><div style={{fontSize:10,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>Verified members</div></div>
            <div><div style={{fontSize:28,color:s.gold,fontWeight:600}}>$1.8B</div><div style={{fontSize:10,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>Off market value</div></div>
          </div>
        </div>
        <div style={{padding:'48px 40px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <h2 style={{fontSize:'clamp(22px,4vw,28px)',color:s.white,marginBottom:8,fontWeight:600}}>Welcome back</h2>
          <p style={{color:s.muted,marginBottom:28,fontSize:14}}>Sign in to access your private member feed.</p>
          <form style={{display:'flex',flexDirection:'column',gap:16,maxWidth:400}} onSubmit={e=>e.preventDefault()}>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>Email address</label>
              <input type="email" placeholder="agent@example.com.au" style={{background:s.black3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px'}}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>Password</label>
              <input type="password" placeholder="••••••••" style={{background:s.black3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px'}}/>
            </div>
            <button type="submit" style={{background:s.gold,border:'none',color:'#000',fontSize:14,fontWeight:600,padding:14,cursor:'pointer',marginTop:4}}>Sign In →</button>
            <div style={{fontSize:12,color:s.muted,textAlign:'center'}}><Link href="#" style={{color:s.gold,textDecoration:'none'}}>Forgot password?</Link></div>
            <div style={{fontSize:12,color:s.muted,textAlign:'center'}}>Not a member? <Link href="/signup" style={{color:s.gold,textDecoration:'none'}}>Join free for 3 months</Link></div>
          </form>
        </div>
      </div>
    </div>
  )
}
