import Nav from '../components/Nav'
import { useState, useEffect } from 'react'
import Footer from '../components/Footer'
import Link from 'next/link'

const s={gold:'#C9A84C',bg:'#0A0F1E',bg2:'#0F1628',bg3:'#151D35',bg4:'#1A2340',white:'#F5F3EE',muted:'#6B7A99',mid:'#A8B4CC',border:'#1E2A45'}

export default function Home() {
  const [realListings, setRealListings] = useState([])

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://jmjtcmfjknmdnlgxudfk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
      )
      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', {ascending: false})
        .limit(3)
      if (data && data.length >= 3) setRealListings(data)
    } catch(err) { console.error(err) }
  }
  return (
    <div style={{background:s.bg,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      {/* Hero logo banner */}
      <div style={{width:'100%',padding:'24px 0',textAlign:'center',borderBottom:'1px solid #1E2A45'}}>
        <img src="/ompnherofilelogo.png" alt="Off Market Property Network" style={{width:'35%',maxWidth:430,height:'auto',objectFit:'contain'}}/>
      </div>

      <style>{`
        .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);}
        .stat-item{padding:0 24px;border-right:1px solid #1E2A45;text-align:center;}
        .stat-item:last-child{border-right:none;}
        .listings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#1E2A45;}
        .who-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#1E2A45;}
        .hero-visual{display:block;}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr;gap:32px;}
          .hero-visual{display:none;}
          .stats-grid{grid-template-columns:repeat(2,1fr);}
          .stat-item{padding:16px;border-right:none;border-bottom:1px solid #1E2A45;}
          .stat-item:nth-child(odd){border-right:1px solid #1E2A45;}
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
                <Link href="/how-it-works" style={{border:'1px solid #A8B4CC',color:'#A8B4CC',padding:'14px 28px',fontSize:14,textDecoration:'none'}}>How It Works</Link>
              </div>
            </div>
            <div className="hero-visual" style={{background:s.bg3,border:`1px solid ${s.border}`,padding:32}}>
              <div style={{fontSize:9,letterSpacing:'0.35em',color:s.gold,textTransform:'uppercase'}}>Hope Island · Gold Coast</div>
              <div style={{fontSize:22,color:s.white,margin:'8px 0',fontWeight:600}}>Prestige waterfront opportunity</div>
              <div style={{fontSize:11,color:s.muted}}>4 bed · 3 bath · Private listing</div>
              <div style={{marginTop:16,display:'inline-block',fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',padding:'3px 8px',background:'rgba(201,168,76,0.12)',color:s.gold,border:'1px solid rgba(201,168,76,0.3)'}}>Members Only</div>
            </div>
          </div>
        </div>
      </section>

      {/* FREE TRIAL BANNER */}
      <div style={{background:'rgba(201,168,76,0.08)',border:`1px solid rgba(201,168,76,0.2)`,padding:'16px 20px',textAlign:'center'}}>
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
            <Link href="/listings" style={{border:`1px solid ${s.border}`,color:'#A8B4CC',padding:'8px 16px',fontSize:13,textDecoration:'none'}}>View all →</Link>
          </div>
          <div className="listings-grid">
            {(realListings.length >= 3 ? realListings : [
              {id:'1',suburb:'Hope Island',state:'QLD',property_type:'House'},
              {id:'2',suburb:'Burleigh Heads',state:'QLD',property_type:'Apartment'},
              {id:'3',suburb:'Main Beach',state:'QLD',property_type:'House'},
            ]).map(l=>(
              <div key={l.id} style={{background:s.bg2,cursor:'default'}}>
                <div style={{height:180,background:s.bg4,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
                  {l.images&&l.images[0]&&<img src={l.images[0]} alt="Property" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.2,filter:'blur(4px)'}}/>}
                  <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
                    <div style={{fontSize:24,marginBottom:8}}>🔒</div>
                    <div style={{fontSize:10,letterSpacing:'0.25em',color:s.muted,textTransform:'uppercase'}}>Members only</div>
                  </div>
                </div>
                <div style={{padding:16}}>
                  <div style={{fontSize:9,letterSpacing:'0.35em',color:s.gold,textTransform:'uppercase',marginBottom:6}}>{l.suburb} · {l.state}</div>
                  <div style={{fontSize:16,color:s.white,marginBottom:8,fontWeight:600}}>Private off market opportunity</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontSize:10,color:s.muted,textTransform:'uppercase'}}>Details hidden · Members only</div>
                    <div style={{fontSize:11,color:s.gold}}>🔒</div>
                  </div>
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
              <div key={w.tag} style={{background:s.bg2,padding:'32px 24px'}}>
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
