import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'

const s={gold:'#C9A84C',bg:'#0A0F1E',bg2:'#0F1628',bg3:'#151D35',bg4:'#1A2340',white:'#F5F3EE',muted:'#6B7A99',mid:'#A8B4CC',border:'#1E2A45',silver:'#A8B4CC'}

const agents=[
  {initials:'SH',name:'Sarah Hartley',agency:'Hartley Property Group · Brisbane',role:'Selling agent',state:'QLD',spec:'Prestige',sales:24,listings:11,plan:'Gold'},
  {initials:'MK',name:'Marcus Kline',agency:'Kline Buyers Agency · Sydney',role:'Buyers agent',state:'NSW',spec:'Waterfront',sales:38,listings:null,plan:'Silver'},
  {initials:'RP',name:'Rachel Pace',agency:'Pace Property Partners · Gold Coast',role:'Selling agent',state:'QLD',spec:'Coastal',sales:41,listings:7,plan:'Platinum'},
  {initials:'JW',name:'James Whitmore',agency:'Whitmore & Co · Melbourne',role:'Selling agent',state:'VIC',spec:'Period homes',sales:19,listings:4,plan:'Gold'},
  {initials:'LN',name:'Lena Nguyen',agency:'Nguyen Buyers Agency · Brisbane',role:'Buyers agent',state:'QLD',spec:'Investment',sales:52,listings:null,plan:'Silver'},
]

export default function Agents() {
  return (
    <div style={{background:s.bg,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        .agents-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#1E2A45;}
        @media(max-width:900px){.agents-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:600px){.agents-grid{grid-template-columns:1fr;}}
      `}</style>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'48px 20px 60px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Agent directory</div>
        <h1 style={{fontSize:'clamp(28px,5vw,40px)',color:s.white,marginBottom:12,fontWeight:600}}>Verified members</h1>
        <p style={{color:s.muted,marginBottom:32}}>All agents are license-verified real estate professionals.</p>
        <div className="agents-grid">
          {agents.map(a=>(
            <div key={a.name} style={{background:s.bg2,padding:24}}>
              <div style={{width:48,height:48,borderRadius:'50%',background:s.bg4,border:`1px solid ${s.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:s.silver,marginBottom:14,fontWeight:600}}>{a.initials}</div>
              <div style={{fontSize:17,color:s.white,marginBottom:4,fontWeight:600}}>{a.name}</div>
              <div style={{fontSize:11,color:s.gold,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:12}}>{a.agency}</div>
              <div style={{display:'flex',gap:20,marginBottom:14}}>
                <div><div style={{fontSize:20,color:s.white,fontWeight:600}}>{a.sales}</div><div style={{fontSize:9,letterSpacing:'0.15em',color:s.muted,textTransform:'uppercase'}}>{a.role==='Buyers agent'?'Deals sourced':'Off market sales'}</div></div>
                <div><div style={{fontSize:20,color:s.white,fontWeight:600}}>{a.listings??'—'}</div><div style={{fontSize:9,letterSpacing:'0.15em',color:s.muted,textTransform:'uppercase'}}>Active listings</div></div>
              </div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
                {[a.role,a.state,a.spec].map(t=><span key={t} style={{fontSize:9,letterSpacing:'0.1em',color:s.muted,border:`1px solid ${s.border}`,padding:'2px 6px',textTransform:'uppercase'}}>{t}</span>)}
              </div>
              <div style={{fontSize:9,letterSpacing:'0.15em',color:s.gold,textTransform:'uppercase'}}>✓ Verified · {a.plan} plan</div>
            </div>
          ))}
          <div style={{background:s.bg2,padding:24,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',minHeight:200}}>
            <div style={{fontSize:11,letterSpacing:'0.15em',color:s.muted,textTransform:'uppercase',marginBottom:10}}>2,400+ members</div>
            <div style={{fontSize:17,color:s.white,marginBottom:16,fontWeight:600}}>Full directory for members</div>
            <Link href="/login" style={{background:s.gold,color:'#000',padding:'8px 18px',fontSize:13,fontWeight:500,textDecoration:'none'}}>Sign in to connect</Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
