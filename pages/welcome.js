import Nav from '../components/Nav'
import Link from 'next/link'
import { useRouter } from 'next/router'

const s={gold:'#FFD166',bg:'#0D0A1A',bg2:'#13102A',bg3:'#1A1638',white:'#FFFFFF',muted:'#8888BB',border:'rgba(155,109,255,0.15)'}

export default function Welcome() {
  const router = useRouter()
  const { name, email } = router.query
  return (
    <div style={{background:s.bg,minHeight:'100vh',color:s.white}}>
      <Nav/>
      <div style={{maxWidth:600,margin:'0 auto',padding:'80px 20px',textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:24}}>🎉</div>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>Application received</div>
        <h1 style={{fontSize:'clamp(28px,5vw,40px)',color:s.white,marginBottom:16,fontWeight:600}}>Welcome{name ? `, ${name}` : ''}!</h1>
        <p style={{fontSize:16,color:s.muted,lineHeight:1.7,marginBottom:40}}>Your application to join Off Market Property Network has been received.{email ? ` We've sent a confirmation email to ${email}.` : ' Check your inbox for a confirmation email.'}</p>
        <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32,marginBottom:40,textAlign:'left'}}>
          <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>What happens next</div>
          {[
            {step:'1',title:'License verification',desc:'We verify your real estate license against state-based regulatory registers. This takes 24–48 hours.'},
            {step:'2',title:'Account activation email',desc:"Once verified, you'll receive an email with your login details and full platform access."},
            {step:'3',title:'3 months free access',desc:'Your free trial begins from verification date. Browse listings, connect with agents and grow your network.'},
          ].map(item=>(
            <div key={item.step} style={{display:'flex',gap:16,marginBottom:20}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'rgba(201,168,76,0.12)',border:'1px solid rgba(201,168,76,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:s.gold,fontSize:13,fontWeight:600,flexShrink:0}}>{item.step}</div>
              <div>
                <div style={{fontSize:14,color:s.white,fontWeight:600,marginBottom:4}}>{item.title}</div>
                <div style={{fontSize:13,color:s.muted,lineHeight:1.6}}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/" style={{background:'linear-gradient(135deg,#9B6DFF,#FFD166)',color:'#fff',padding:'14px 28px',fontSize:14,fontWeight:600,textDecoration:'none'}}>Back to home</Link>
          <Link href="/listings" style={{border:`1px solid #E8E8E8`,color:'#D4CFFF',padding:'14px 28px',fontSize:14,textDecoration:'none'}}>Browse listings</Link>
        </div>
      </div>
    </div>
  )
}
