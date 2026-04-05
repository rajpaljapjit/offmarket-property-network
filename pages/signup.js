import Nav from '../components/Nav'
import Link from 'next/link'

export default function Signup() {
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
            <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>🎉 Limited time offer</div>
            <p style={{fontSize:22,color:s.white,lineHeight:1.4,marginBottom:16,fontWeight:600}}>3 months completely free for all verified agents and buyers agents.</p>
            <p style={{fontSize:14,color:s.muted,lineHeight:1.7}}>No credit card required. No obligation. Join now while we grow the network and get full access to all off market listings.</p>
          </div>
          <div style={{display:'flex',gap:40}}>
            <div><div style={{fontSize:28,color:s.gold,fontWeight:600}}>3 months</div><div style={{fontSize:10,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>Free access</div></div>
            <div><div style={{fontSize:28,color:s.gold,fontWeight:600}}>2,400+</div><div style={{fontSize:10,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>Verified members</div></div>
          </div>
        </div>
        <div style={{padding:'48px 40px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <h2 style={{fontSize:'clamp(22px,4vw,28px)',color:s.white,marginBottom:4,fontWeight:600}}>Apply for free membership</h2>
          <p style={{color:s.muted,marginBottom:24,fontSize:14}}>Verified professionals only. 3 months free. No credit card required.</p>
          <form style={{display:'flex',flexDirection:'column',gap:14,maxWidth:400}} onSubmit={e=>e.preventDefault()}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <label style={{fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>First name</label>
                <input type="text" placeholder="Jane" style={{background:s.black3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%'}}/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <label style={{fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>Last name</label>
                <input type="text" placeholder="Smith" style={{background:s.black3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%'}}/>
              </div>
            </div>
            {[['Email address','email','jane@agency.com.au'],['Agency name','text','Smith Property Group'],['License number','text','e.g. QLD-1234567']].map(([label,type,ph])=>(
              <div key={label} style={{display:'flex',flexDirection:'column',gap:6}}>
                <label style={{fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>{label}</label>
                <input type={type} placeholder={ph} style={{background:s.black3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%'}}/>
              </div>
            ))}
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>I am a</label>
              <select style={{background:s.black3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px'}}>
                <option>Selling Agent</option><option>Buyers Agent</option><option>Both</option>
              </select>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase'}}>State</label>
              <select style={{background:s.black3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px'}}>
                <option>QLD</option><option>NSW</option><option>VIC</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option>
              </select>
            </div>
            <button type="submit" style={{background:s.gold,border:'none',color:'#000',fontSize:15,fontWeight:600,padding:14,cursor:'pointer',marginTop:4}}>Apply for Free Membership →</button>
            <p style={{fontSize:12,color:s.muted,textAlign:'center'}}>3 months free · No credit card · Cancel any time</p>
            <div style={{fontSize:12,color:s.muted,textAlign:'center'}}>Already a member? <Link href="/login" style={{color:s.gold,textDecoration:'none'}}>Sign in</Link></div>
          </form>
        </div>
      </div>
    </div>
  )
}
