import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'

const plans=[
  {name:'Bronze',sub:'Browse only',price:'Free',priceNote:'3 months free · then $49/mo',features:[{t:'View off market listings',y:true},{t:'Search by suburb, price, type',y:true},{t:'Save up to 20 listings',y:true},{t:'Email alerts',y:true},{t:'Listing uploads',y:false},{t:'Agent profile',y:false}],cta:'Join Free',featured:false},
  {name:'Silver',sub:'List + browse',price:'Free',priceNote:'3 months free · then $99/mo',features:[{t:'View off market listings',y:true},{t:'1 listing upload per month',y:true},{t:'Full agent profile',y:true},{t:'Direct enquiry messaging',y:true},{t:'Unlimited saved listings',y:true},{t:'Team access',y:false}],cta:'Join Free',featured:true},
  {name:'Gold',sub:'Full access',price:'Free',priceNote:'3 months free · then $179/mo',features:[{t:'View off market listings',y:true},{t:'Up to 5 listing uploads',y:true},{t:'Priority placement',y:true},{t:'Portfolio dashboard',y:true},{t:'Enquiry analytics',y:true},{t:'Team access',y:false}],cta:'Join Free',featured:false},
  {name:'Platinum',sub:'Team / Office',price:'Free',priceNote:'3 months free · then $349/mo',features:[{t:'Up to 5 agents per office',y:true},{t:'Unlimited listings',y:true},{t:'Office brand profile',y:true},{t:'Team management',y:true},{t:'Dedicated support',y:true},{t:'Priority placement',y:true}],cta:'Join Free',featured:false},
]
const faqs=[
  {q:'How long is the free trial?',a:'All plans are completely free for the first 3 months. No credit card required to start. After 3 months you choose whether to continue with a paid plan.'},
  {q:'How do you verify agents?',a:'We cross-check your real estate license number against state-based regulatory registers. Verification typically takes 24–48 hours.'},
  {q:'Can private sellers join?',a:'No. The network is exclusively for licensed real estate professionals — selling agents and buyers agents only.'},
  {q:'Are listings visible to the public?',a:'Never. All listings are hidden from search engines, public portals, and non-members.'},
  {q:'Can I upgrade or downgrade?',a:'Yes. Change your plan at any time from your dashboard. No lock-in contracts.'},
  {q:'Is there a setup fee?',a:'No setup fees ever. Start free and only pay when you are ready after the 3 month trial.'},
]

export default function Pricing() {
  const s={gold:'#C9A84C',black:'#0A0A0A',black2:'#111',black3:'#1A1A1A',white:'#F5F3EE',muted:'#7A7A7A',mid:'#AAAAAA',border:'#2A2A2A',silver:'#D4D8DF'}
  return (
    <div style={{background:s.black,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        .plans-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#2A2A2A;}
        .faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
        @media(max-width:900px){.plans-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:600px){.plans-grid{grid-template-columns:1fr;}.faq-grid{grid-template-columns:1fr;}}
      `}</style>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'60px 20px 40px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Membership plans</div>
        <h1 style={{fontSize:'clamp(28px,5vw,44px)',color:s.white,marginBottom:12,fontWeight:600}}>3 months free for all agents</h1>
        <p style={{color:s.muted,maxWidth:480,marginBottom:40,lineHeight:1.7}}>Every plan is completely free for the first 3 months. No credit card required. Join now while we grow the network.</p>
        <div className="plans-grid">
          {plans.map(p=>(
            <div key={p.name} style={{background:p.featured?s.black3:s.black2,padding:p.featured?'44px 24px 28px':'28px 24px',position:'relative',display:'flex',flexDirection:'column'}}>
              {p.featured&&<div style={{position:'absolute',top:0,left:0,right:0,background:s.gold,color:'#000',fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase',textAlign:'center',padding:'5px 0',fontWeight:500}}>Most Popular</div>}
              <div style={{fontSize:20,color:p.featured?s.gold:s.silver,marginBottom:4,fontWeight:600}}>{p.name}</div>
              <div style={{fontSize:11,color:s.muted,textTransform:'uppercase',marginBottom:20,letterSpacing:'0.1em'}}>{p.sub}</div>
              <div style={{fontSize:36,color:s.gold,fontWeight:700,marginBottom:4}}>{p.price}</div>
              <div style={{fontSize:11,color:s.muted,marginBottom:24,lineHeight:1.5}}>{p.priceNote}</div>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10,marginBottom:24,flex:1}}>
                {p.features.map(f=><li key={f.t} style={{fontSize:13,color:f.y?s.mid:s.border,paddingLeft:16,position:'relative'}}><span style={{position:'absolute',left:0,color:f.y?s.gold:s.border,fontSize:11}}>{f.y?'✓':'–'}</span>{f.t}</li>)}
              </ul>
              <Link href="/signup" style={{display:'block',padding:'12px',fontSize:13,textDecoration:'none',textAlign:'center',background:p.featured?s.gold:'none',border:p.featured?'none':`1px solid ${s.border}`,color:p.featured?'#000':s.silver,fontWeight:p.featured?600:400}}>{p.cta}</Link>
            </div>
          ))}
        </div>
        <div style={{padding:'20px 0',borderTop:`1px solid ${s.border}`,textAlign:'center',marginTop:1,marginBottom:48}}>
          <p style={{fontSize:13,color:s.muted}}>All plans free for 3 months. No credit card required. Cancel any time. Prices exclude GST.</p>
        </div>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>FAQ</div>
        <h2 style={{fontSize:'clamp(22px,4vw,32px)',color:s.white,marginBottom:32,fontWeight:600}}>Common questions</h2>
        <div className="faq-grid">
          {faqs.map(f=>(
            <div key={f.q} style={{border:`1px solid ${s.border}`,padding:20}}>
              <h4 style={{fontSize:14,color:s.white,marginBottom:8,fontWeight:600}}>{f.q}</h4>
              <p style={{fontSize:13,color:s.muted,lineHeight:1.6}}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  )
}
