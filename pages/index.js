import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'

const s={gold:'#C9A84C',black:'#0A0A0A',black2:'#111',black3:'#1A1A1A',black4:'#242424',white:'#F5F3EE',muted:'#7A7A7A',mid:'#AAAAAA',border:'#2A2A2A'}

export default function Home() {
  return (
    <div style={{background:s.black,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);}
        .stat-item{padding:0 24px;border-right:1px solid #2A2A2A;text-align:center;}
        .stat-item:last-child{border-right:none;}
        .listings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#2A2A2A;}
        .who-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#2A2A2A;}
        .hero-visual{display:block;}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr;gap:32px;}
          .hero-visual{display:none;}
          .stats-grid{grid-template-columns:repeat(2,1fr);}
          .stat-item{padding:16px;border-right:none;border-bottom:1px solid #2A2A2A;}
          .stat-item:nth-child(odd){border-right:1px solid #2A2A2A;}
          .listings-grid{grid-template-columns:1fr;}
          .who-grid{grid-template-columns:1fr;}
        }
      `}</style>

      {/* HERO */}
      <section style={{padding:'60px 0 40px'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
          <div className="hero-grid">
            <div>
              <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Australia&apos;s Private Property Network</div>
              <h1 style={{fontSize:'clamp(32px, 5vw, 52px)',lineHeight:1.1,color:s.white,marginBottom:20,fontWeight:600}}>Where agents move property <em style={{color:s.gold,fontStyle:'italic'}}>off market</em></h1>
              <p style={{color:s.mid,fontSize:16,marginBottom:32,lineHeight:1.7}}>A members-only network connecting selling agents and buyers agents. Share hidden opportunities. Close quietly. No public portals.</p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <Link href="/signup" style={{background:s.gold,color:'#000',padding:'14px 28px',fontSize:14,fontWeight:500,textDecoration:'none'}}>Join Free — 3 Months Free</Link>
                <Link href="/how-it-works" style={{border:'1px solid #A8AEBB',color:'#D4D8DF',padding:'14px 28px',fontSize:14,textDecoration:'none'}}>How It Works</Link>
              </div>
            </div>
            <div className="hero-visual" style={{background:s.black3,border:`1px solid ${s.border}`,padding:32}}>
              <div style={{fontSize:9,letterSpacing:'0.35em',color:s.gold,textTransform:'uppercase'}}>Hope Island · Gold Coast</div>
              <div style={{fontSize:22,color:s.white,margin:'8px 0',fontWeight:600}}>Prestige waterfront opportunity</div>
              <div style={{fontSize:11,color:s.muted}}>4 bed · 3 bath · Private listing</div>
              <div style={{marginTop:16,display:'inline-block',fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',padding:'3px 8px',background:'rgba(201,168,76,0.12)',color:s.gold,border:'1px solid rgba(201,168,76,0.3)'}}>Members Only</div>
            </div>
          </div>
        </div>
      </section>

      {/* FREE TRIAL BANNER */}
      <div style={{background:'rgba(201,168,76,0.08)',border:`1px solid rgba(201,168,76,0.2)`,padding:'16px 20px',textAlign:'center',margin:'0 0 0 0'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <span style={{color:s.gold,fontSize:14,fontWeight:500}}>🎉 Limited time — 3 months free membership for all verified agents. No credit card required.</span>
        </div>
      </div>

      {/* STATS */}
      <div style={{borderTop:`1px solid ${s.border}`,borderBottom:`1px solid ${s.border}`,padding:'28px 0',margin:'40px 0'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
          <div className="stats-grid">
            {[['2,400+','Verified agents'],['$1.8B','In off market value'],['97%','Member satisfaction'],['48hrs','Avg time to enquiry']].map(([num,label])=>(
              <div key={label} className="stat-item">
                <div style={{fontSize:'clamp(24px,4vw,36px)',color:s.white,fontWeight:600}}>{num}</div>
                <div style={{fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase',marginTop:4}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SHOWCASE */}
      <section style={{padding:'0 0 60px'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12}}>
            <div>
              <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:8}}>Members only showcase</div>
              <h2 style={{fontSize:'clamp(24px,4vw,36px)',color:s.white,fontWeight:600}}>Current opportunities</h2>
            </div>
            <Link href="/listings" style={{border:`1px solid ${s.border}`,color:'#D4D8DF',padding:'8px 16px',fontSize:13,textDecoration:'none'}}>View all →</Link>
          </div>
          <div className="listings-grid">
            {[
              {suburb:'Hope Island',state:'QLD',title:'Prestige waterfront opportunity',img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'},
              {suburb:'Burleigh Heads',state:'QLD',title:'Boutique coastal apartment',img:'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80'},
              {suburb:'Main Beach',state:'QLD',title:'Luxury sky home opportunity',img:null},
            ].map(l=>(
              <div key={l.suburb} style={{background:s.black2}}>
                {l.img?<img src={l.img} alt={l.title} style={{width:'100%',height:180,objectFit:'cover',opacity:0.75}}/>:<div style={{height:180,background:s.black4,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><div style={{fontSize:20,marginBottom:8}}>🔒</div><div style={{fontSize:10,letterSpacing:'0.25em',color:s.muted,textTransform:'uppercase'}}>Members only</div></div>}
                <div style={{padding:16}}>
                  <div style={{fontSize:9,letterSpacing:'0.35em',color:s.gold,textTransform:'uppercase',marginBottom:6}}>{l.suburb} · {l.state}</div>
                  <div style={{fontSize:16,color:s.white,marginBottom:8,fontWeight:600}}>{l.title}</div>
                  <div style={{fontSize:10,color:s.muted,textTransform:'uppercase'}}>Private member listing · 🔒</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO FOR */}
      <section style={{padding:'60px 0',borderTop:`1px solid ${s.border}`}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
          <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Who it&apos;s for</div>
          <h2 style={{fontSize:'clamp(24px,4vw,36px)',color:s.white,marginBottom:32,fontWeight:600}}>Built for both sides of the deal</h2>
          <div className="who-grid">
            {[
              {tag:'Selling Agents',title:'List privately. Sell quietly.',desc:'Share your off market properties with a trusted network of qualified buyers agents without public exposure.',points:['Upload listings with full control','Set your own enquiry terms','Build your off-market reputation','No REA or Domain competition','Track every enquiry in your dashboard']},
              {tag:'Buyers Agents',title:"Access what the public can't see.",desc:"Serve your clients with a competitive edge by accessing exclusive off market stock across Australia's premium markets.",points:['Browse listings hidden from portals','Save and share with your clients','Connect directly with the listing agent','Filter by suburb, price, property type','Set alerts for new stock']},
            ].map(w=>(
              <div key={w.tag} style={{background:s.black2,padding:'32px 24px'}}>
                <div style={{display:'inline-block',fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase',padding:'4px 10px',border:'1px solid #8A6A1F',color:s.gold,marginBottom:16}}>{w.tag}</div>
                <h3 style={{fontSize:'clamp(20px,3vw,26px)',color:s.white,marginBottom:12,fontWeight:600}}>{w.title}</h3>
                <p style={{color:s.muted,marginBottom:20,lineHeight:1.7,fontSize:14}}>{w.desc}</p>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:8}}>
                  {w.points.map(p=><li key={p} style={{fontSize:13,color:s.mid,paddingLeft:18,position:'relative'}}><span style={{position:'absolute',left:0,color:s.gold,fontSize:11}}>—</span>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'60px 0',borderTop:`1px solid ${s.border}`,textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto',padding:'0 20px'}}>
          <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Trusted and verified</div>
          <h2 style={{fontSize:'clamp(22px,4vw,34px)',color:s.white,marginBottom:16,fontWeight:600}}>Every member is a verified real estate professional</h2>
          <p style={{color:s.muted,marginBottom:28,lineHeight:1.7}}>We verify agent licenses through state-based regulatory registers. Professionals only. Join free for 3 months.</p>
          <Link href="/signup" style={{background:s.gold,color:'#000',padding:'14px 32px',fontSize:14,fontWeight:500,textDecoration:'none',display:'inline-block'}}>Apply for Free Membership</Link>
        </div>
      </section>
      <Footer/>
    </div>
  )
}
