import Nav from '../components/Nav'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GoldButton, SilverButton, MagneticButton } from '../components/Button'
import CountUp from 'react-countup'
import Typewriter from 'typewriter-effect'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'
import Footer from '../components/Footer'
import Link from 'next/link'

const s={gold:'#C9A84C',bg:'#1B2A1B',bg2:'#162016',bg3:'#1F2E1F',bg4:'#243524',white:'#C9A84C',muted:'#8BA888',mid:'#E8E8E8',border:'#2D4A2D'}

const StatNumber = ({ value, suffix='' }) => {
  const { ref, inView } = useInView({ triggerOnce: true })
  return (
    <span ref={ref}>
      {inView ? <CountUp end={value} duration={2.5} separator="," suffix={suffix}/> : '0'}
    </span>
  )
}

const ParticleBackground = () => {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',zIndex:0}}
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
          color: { value: '#C9A84C' },
          links: { color: '#C9A84C', distance: 150, enable: true, opacity: 0.1, width: 1 },
          move: { enable: true, speed: 0.5, direction: 'none', random: true, outModes: 'bounce' },
          number: { density: { enable: true, area: 800 }, value: 40 },
          opacity: { value: 0.15 },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  )
}

const FadeUp = ({ children, delay=0 }) => (
  <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-50px'}} transition={{duration:0.7,delay,ease:[0.25,0.1,0.25,1]}}>
    {children}
  </motion.div>
)

export default function Home() {
  const [realListings, setRealListings] = useState([])
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -100])

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
      <motion.div style={{width:'100%',textAlign:'center',background:'#1B2A1B',lineHeight:0, y:heroY}}>
        <img src="/Offmarketproplogo5.png" alt="Off Market Property Network" style={{width:'100%',height:'auto',display:'block'}}/>
      </motion.div>


      <style>{`
        .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);}
        .stat-item{padding:0 24px;border-right:1px solid #2D4A2D;text-align:center;}
        .stat-item:last-child{border-right:none;}
        .listings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#2D4A2D;}
        .who-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#2D4A2D;}
        .hero-visual{display:block;}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr;gap:32px;}
          .hero-visual{display:none;}
          .stats-grid{grid-template-columns:repeat(2,1fr);}
          .stat-item{padding:16px;border-right:none;border-bottom:1px solid #2D4A2D;}
          .stat-item:nth-child(odd){border-right:1px solid #2D4A2D;}
          .listings-grid{grid-template-columns:1fr;}
          .who-grid{grid-template-columns:1fr;}
        }
      `}</style>

      {/* HERO */}
      <section style={{padding:'60px 0 40px',position:'relative',overflow:'hidden'}}>
        <ParticleBackground/>
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position:'absolute',
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            objectFit:'cover',
            opacity:0.07,
            zIndex:0,
            pointerEvents:'none',
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-city-buildings-seen-from-above-40028-large.mp4" type="video/mp4"/>
        </video>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',position:'relative',zIndex:1}}>
          <div className="hero-grid">
            <div>
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Australia&apos;s Private Property Network</motion.div>
              <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.1}} style={{fontSize:'clamp(32px, 5vw, 52px)',lineHeight:1.1,color:s.white,marginBottom:20,fontWeight:600}}>Where agents move property <em style={{fontStyle:'italic',background:'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>off market</em></motion.h1>
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.2}} style={{color:s.mid,fontSize:16,marginBottom:32,lineHeight:1.7,minHeight:56}}>
                <Typewriter
                  options={{
                    strings:[
                      'Connect selling agents with buyers agents.',
                      'Share hidden opportunities off market.',
                      'Close quietly. No public portals.',
                      "Australia's private property network.",
                    ],
                    autoStart:true,
                    loop:true,
                    delay:40,
                    deleteSpeed:20,
                  }}
                />
              </motion.div>
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.4}} style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <Link href="/signup" style={{background:s.gold,color:'#000',padding:'14px 28px',fontSize:14,fontWeight:500,textDecoration:'none'}}>Join Free — 3 Months Free</Link>
                <Link href="/how-it-works" style={{border:'1px solid #E8E8E8',color:'#E8E8E8',padding:'14px 28px',fontSize:14,textDecoration:'none'}}>How It Works</Link>
              </motion.div>
            </div>
            <div className="hero-visual" style={{background:'rgba(31,46,31,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(201,168,76,0.2)',padding:32,boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}>
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
            <Link href="/listings" style={{border:`1px solid ${s.border}`,color:'#E8E8E8',padding:'8px 16px',fontSize:13,textDecoration:'none'}}>View all →</Link>
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
