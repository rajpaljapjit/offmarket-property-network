import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'

const s={gold:'#B8923A',goldDim:'rgba(184,146,58,0.1)',bg:'#F8F6F1',bg2:'#FFFFFF',bg3:'#F2EFE9',bg4:'#EAE6DE',white:'#1C1A17',cream:'#4A4640',muted:'#8A8178',mid:'#4A4640',border:'rgba(184,146,58,0.2)',borderGold:'rgba(184,146,58,0.35)',error:'#CC3333',silver:'#4A4640'}

const buyersPlan = {
  name:'Buyers Agent',
  sub:'Browse & connect',
  price:'$69',
  priceNote:'per month · 3 months free trial',
  features:[
    {t:'Browse all off market listings',y:true},
    {t:'Advanced search & filters',y:true},
    {t:'Save unlimited listings',y:true},
    {t:'Send enquiries to listing agents',y:true},
    {t:'Direct messaging',y:true},
    {t:'Favourite agents list',y:true},
    {t:'Email alerts for new listings',y:true},
    {t:'Full agent profile',y:true},
  ],
  cta:'Start Free Trial',
  featured:false
}

const sellerPlans = [
  {
    name:'Silver',
    sub:'1 listing per month',
    price:'$39',
    priceNote:'per month · 3 months free trial',
    features:[
      {t:'1 listing upload per month',y:true},
      {t:'Full listing details & photos',y:true},
      {t:'Receive enquiries from buyers agents',y:true},
      {t:'Direct messaging',y:true},
      {t:'Agent profile page',y:true},
      {t:'Listing dashboard',y:true},
      {t:'Email notifications',y:true},
      {t:'Priority placement',y:false},
    ],
    cta:'Start Free Trial',
    featured:false
  },
  {
    name:'Gold',
    sub:'5 listings per month',
    price:'$79',
    priceNote:'per month · 3 months free trial',
    features:[
      {t:'5 listing uploads per month',y:true},
      {t:'Full listing details & photos',y:true},
      {t:'Receive enquiries from buyers agents',y:true},
      {t:'Direct messaging',y:true},
      {t:'Priority placement in feed',y:true},
      {t:'Agent profile page',y:true},
      {t:'Enquiry analytics',y:true},
      {t:'Email notifications',y:true},
    ],
    cta:'Start Free Trial',
    featured:true
  },
  {
    name:'Platinum',
    sub:'Principal & office teams',
    price:'POA',
    priceNote:'Contact us for team pricing',
    features:[
      {t:'5+ agents under one office',y:true},
      {t:'Unlimited listing uploads',y:true},
      {t:'Office brand profile',y:true},
      {t:'Team management dashboard',y:true},
      {t:'Priority placement',y:true},
      {t:'Dedicated account support',y:true},
      {t:'Custom onboarding',y:true},
      {t:'Volume pricing',y:true},
    ],
    cta:'Get in touch',
    featured:false
  },
]

const faqs=[
  {q:'How long is the free trial?',a:'All plans are completely free for the first 3 months. No credit card required to start. After 3 months you choose whether to continue with a paid plan.'},
  {q:'How do you verify agents?',a:'We cross-check your real estate license number against state-based regulatory registers. Verification typically takes 24–48 hours.'},
  {q:'Can private sellers join?',a:'No. The network is exclusively for licensed real estate professionals — selling agents and buyers agents only.'},
  {q:'Are listings visible to the public?',a:'Never. All listings are hidden from search engines, public portals, and non-members.'},
  {q:'Can I upgrade or downgrade?',a:'Yes. Change your plan at any time from your dashboard. No lock-in contracts.'},
  {q:'What is the Platinum plan?',a:'The Platinum plan is designed for principal agents who have a team of 5 or more agents. Contact us directly and we will tailor a package to suit your office.'},
  {q:'Is there a setup fee?',a:'No setup fees ever. Start free and only pay when you are ready after the 3 month trial.'},
]

export default function Pricing() {
  return (
    <div style={{background:s.bg,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        .seller-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(184,146,58,0.1);}
        .faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
        @media(max-width:900px){.seller-grid{grid-template-columns:1fr;}}
        @media(max-width:600px){.faq-grid{grid-template-columns:1fr;}}
      `}</style>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'60px 20px 40px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Membership plans</div>
        <h1 style={{fontSize:'clamp(28px,5vw,44px)',color:s.white,marginBottom:12,fontWeight:600}}>3 months free for all agents</h1>
        <p style={{color:s.muted,maxWidth:520,marginBottom:48,lineHeight:1.7}}>Every plan is completely free for the first 3 months. No credit card required.</p>

        {/* BUYERS AGENT PLAN */}
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>Buyers agent plan</div>
        <div style={{background:s.bg2,border:`1px solid ${s.border}`,padding:32,marginBottom:48,display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,alignItems:'center'}}>
          <div>
            <div style={{fontSize:24,color:s.mid,fontWeight:600,marginBottom:4}}>Buyers Agent</div>
            <div style={{fontSize:12,color:s.muted,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:20}}>Browse & connect</div>
            <div style={{fontSize:48,color:s.gold,fontWeight:700,marginBottom:4}}>$69<span style={{fontSize:16,fontWeight:400,color:s.muted}}>/mo</span></div>
            <div style={{fontSize:12,color:s.muted,marginBottom:24}}>3 months free trial · No credit card required</div>
            <Link href="/signup" style={{display:'inline-block',padding:'12px 28px',fontSize:13,textDecoration:'none',background:'#B8923A',color:'#fff',fontWeight:600}}>Start Free Trial</Link>
          </div>
          <div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
              {buyersPlan.features.map(f=>(
                <li key={f.t} style={{fontSize:13,color:f.y?s.mid:s.muted,paddingLeft:20,position:'relative'}}>
                  <span style={{position:'absolute',left:0,color:f.y?s.gold:s.border,fontSize:11}}>{f.y?'✓':'–'}</span>{f.t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SELLER PLANS */}
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>Selling agent plans</div>
        <div className="seller-grid" style={{marginBottom:48}}>
          {sellerPlans.map(p=>(
            <div key={p.name} style={{background:p.featured?'#F2EFE9':s.bg2,padding:p.featured?'44px 28px 28px':'28px',position:'relative',display:'flex',flexDirection:'column'}}>
              {p.featured&&<div style={{position:'absolute',top:0,left:0,right:0,background:'#B8923A',color:'#fff',fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase',textAlign:'center',padding:'5px 0',fontWeight:500}}>Most Popular</div>}
              <div style={{fontSize:22,color:p.featured?s.gold:s.silver,marginBottom:4,fontWeight:600}}>{p.name}</div>
              <div style={{fontSize:11,color:s.muted,textTransform:'uppercase',marginBottom:20,letterSpacing:'0.1em'}}>{p.sub}</div>
              <div style={{fontSize:p.price==='POA'?28:40,color:s.gold,fontWeight:700,marginBottom:4}}>{p.price}{p.price!=='POA'&&<span style={{fontSize:14,fontWeight:400,color:s.muted}}>/mo</span>}</div>
              <div style={{fontSize:11,color:s.muted,marginBottom:24,lineHeight:1.5}}>{p.priceNote}</div>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10,marginBottom:24,flex:1}}>
                {p.features.map(f=>(
                  <li key={f.t} style={{fontSize:13,color:f.y?s.mid:s.border,paddingLeft:16,position:'relative'}}>
                    <span style={{position:'absolute',left:0,color:f.y?s.gold:s.border,fontSize:11}}>{f.y?'✓':'–'}</span>{f.t}
                  </li>
                ))}
              </ul>
              {p.name==='Platinum' ? (
                <a href="mailto:support@offmarketpropertynetwork.com.au" style={{display:'block',padding:'12px',fontSize:13,textDecoration:'none',textAlign:'center',background:'#B8923A',color:'#fff',fontWeight:600}}>{p.cta}</a>
              ) : (
                <Link href="/signup" style={{display:'block',padding:'12px',fontSize:13,textDecoration:'none',textAlign:'center',background:p.featured?s.gold:'none',border:p.featured?'none':`1px solid ${s.border}`,color:p.featured?'#F8F6F1':s.silver,fontWeight:p.featured?600:400}}>{p.cta}</Link>
              )}
            </div>
          ))}
        </div>

        {/* Platinum note */}
        <div style={{background:'rgba(201,168,76,0.06)',border:`1px solid rgba(201,168,76,0.2)`,padding:24,marginBottom:48,display:'flex',gap:20,alignItems:'center'}}>
          <div style={{fontSize:28}}>🏢</div>
          <div>
            <div style={{fontSize:14,color:s.gold,fontWeight:600,marginBottom:4}}>Principal agent with a team of 5 or more agents?</div>
            <div style={{fontSize:13,color:s.muted,lineHeight:1.6}}>We offer custom office-wide pricing for principal agents managing multiple agents. Get in touch and we'll tailor a package for your office.</div>
          </div>
          <a href="mailto:support@offmarketpropertynetwork.com.au" style={{flexShrink:0,background:'#B8923A',color:'#fff',padding:'10px 20px',fontSize:13,fontWeight:600,textDecoration:'none'}}>Get in touch</a>
        </div>

        <div style={{padding:'20px 0',borderTop:`1px solid ${s.border}`,textAlign:'center',marginBottom:48}}>
          <p style={{fontSize:13,color:s.muted}}>All plans free for 3 months. No credit card required. Cancel any time. Prices exclude GST.</p>
        </div>

        {/* FAQ */}
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
