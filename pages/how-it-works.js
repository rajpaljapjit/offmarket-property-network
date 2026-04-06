import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'

const s={gold:'#C9A84C',bg:'#0A0F1E',bg2:'#0F1628',bg3:'#151D35',white:'#F5F3EE',muted:'#6B7A99',mid:'#A8B4CC',border:'#1E2A45'}

const steps=[
  {num:'01',title:'Verify and join',desc:'Apply for membership by submitting your agent license details. We cross-check against state-based regulatory registers within 24 hours.',details:['License number verification via state register','Agency details and ABN confirmation','Profile goes live within 24–48 hours','Professionals only — 3 months free to start']},
  {num:'02',title:'List or browse privately',desc:'Selling agents upload opportunities with full control. Buyers agents browse the live feed, filter by market and save opportunities for their clients.',details:['Set listing as discreet, partial or full detail','Filter by suburb, price range, property type','Save listings and set match alerts','All listings invisible to the public']},
  {num:'03',title:'Connect agent to agent',desc:'When a buyers agent finds a match, they send a direct enquiry. Both agents are verified professionals. Conversations happen privately within your dashboard.',details:['Direct in-platform messaging','Both parties remain verified throughout','Track enquiry history in your dashboard','No third-party portals in the loop']},
  {num:'04',title:'Move to sold. Off market.',desc:'Deals happen between qualified professionals. Mark your listing as sold, build your off market track record and grow your reputation inside the network.',details:['Mark listings as under offer or sold','Build an off market sales history','Earn trust ratings from connected agents','No public days on market count']},
]

export default function HowItWorks() {
  return (
    <div style={{background:s.bg,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        .step-row{display:grid;grid-template-columns:60px 1fr 1fr;gap:32px;align-items:start;padding:40px 0;border-top:1px solid #1E2A45;}
        @media(max-width:768px){.step-row{grid-template-columns:1fr;gap:16px;}.step-num{font-size:36px !important;}}
      `}</style>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'60px 20px 40px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>How it works</div>
        <h1 style={{fontSize:'clamp(28px,5vw,44px)',color:s.white,maxWidth:600,marginBottom:16,fontWeight:600}}>From hidden opportunity to signed contract</h1>
        <p style={{color:s.muted,maxWidth:520,marginBottom:48,lineHeight:1.7}}>A simple, private process built for selling agents and buyers agents who want to move property without the noise of public portals.</p>
        {steps.map(step=>(
          <div key={step.num} className="step-row">
            <div className="step-num" style={{fontSize:48,color:s.border,lineHeight:1,fontWeight:600}}>{step.num}</div>
            <div>
              <h3 style={{fontSize:'clamp(18px,3vw,22px)',color:s.white,marginBottom:10,fontWeight:600}}>{step.title}</h3>
              <p style={{color:s.muted,lineHeight:1.7,fontSize:14}}>{step.desc}</p>
            </div>
            <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:20,display:'flex',flexDirection:'column',gap:12}}>
              {step.details.map(d=>(
                <div key={d} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:s.gold,marginTop:6,flexShrink:0}}/>
                  <span style={{fontSize:13,color:s.mid}}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <section style={{padding:'48px 0',borderTop:`1px solid ${s.border}`,textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto',padding:'0 20px'}}>
          <h2 style={{fontSize:'clamp(22px,4vw,32px)',color:s.white,marginBottom:12,fontWeight:600}}>Ready to join the network?</h2>
          <p style={{color:s.muted,marginBottom:24,lineHeight:1.7}}>3 months completely free for all verified agents. No credit card required.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/signup" style={{background:s.gold,color:'#000',padding:'14px 28px',fontSize:14,fontWeight:500,textDecoration:'none'}}>Join Free</Link>
            <Link href="/pricing" style={{border:'1px solid #A8B4CC',color:'#A8B4CC',padding:'14px 28px',fontSize:14,textDecoration:'none'}}>View Pricing</Link>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}
