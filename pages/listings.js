import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'

const listings=[
  {suburb:'Hope Island',state:'QLD',title:'Prestige waterfront opportunity',img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'},
  {suburb:'Burleigh Heads',state:'QLD',title:'Boutique coastal apartment',img:'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80'},
  {suburb:'Main Beach',state:'QLD',title:'Luxury sky home',img:null},
  {suburb:'Noosa Heads',state:'QLD',title:'Hinterland estate opportunity',img:null},
  {suburb:'Mosman',state:'NSW',title:'Harbourside family home',img:null},
  {suburb:'Brighton',state:'VIC',title:'Period mansion, off market',img:null},
  {suburb:'Cottesloe',state:'WA',title:'Beachside contemporary home',img:null},
  {suburb:'Toorak',state:'VIC',title:'Grand family estate',img:null},
  {suburb:'Paddington',state:'NSW',title:'Renovated Victorian terrace',img:null},
]

export default function Listings() {
  const s={gold:'#C9A84C',black:'#0A0A0A',black2:'#111',black3:'#1A1A1A',black4:'#242424',white:'#F5F3EE',muted:'#7A7A7A',border:'#2A2A2A'}
  return (
    <div style={{background:s.black,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      <style>{`
        .listings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#2A2A2A;}
        .filter-bar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
        @media(max-width:900px){.listings-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:600px){.listings-grid{grid-template-columns:1fr;}}
      `}</style>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'48px 20px 40px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Off market listings</div>
        <h1 style={{fontSize:'clamp(28px,5vw,40px)',color:s.white,marginBottom:12,fontWeight:600}}>Members only feed</h1>
        <p style={{color:s.muted,marginBottom:32}}>All listings are hidden from public portals. Sign in to access full details.</p>
        <div style={{background:s.black3,border:`1px solid ${s.border}`,padding:'16px 20px',marginBottom:32}}>
          <div className="filter-bar">
            <span style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase'}}>Filter</span>
            {['All States','All Types','All Prices'].map(f=>(
              <select key={f} defaultValue={f} style={{background:s.black,border:`1px solid ${s.border}`,color:s.white,fontSize:13,padding:'8px 12px',flex:'1',minWidth:100}}>
                <option>{f}</option>
              </select>
            ))}
          </div>
        </div>
        <div className="listings-grid">
          {listings.map(l=>(
            <div key={l.suburb+l.title} style={{background:s.black2}}>
              {l.img?<img src={l.img} alt={l.title} style={{width:'100%',height:180,objectFit:'cover',opacity:0.75}}/>:<div style={{height:180,background:s.black4,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><div style={{fontSize:20,marginBottom:8}}>🔒</div><div style={{fontSize:10,letterSpacing:'0.25em',color:s.muted,textTransform:'uppercase'}}>Members only</div></div>}
              <div style={{padding:16}}>
                <div style={{fontSize:9,letterSpacing:'0.35em',color:s.gold,textTransform:'uppercase',marginBottom:6}}>{l.suburb} · {l.state}</div>
                <div style={{fontSize:16,color:s.white,marginBottom:8,fontWeight:600}}>{l.title}</div>
                <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:10,color:s.muted,textTransform:'uppercase'}}>Private listing</span><span style={{fontSize:11,color:s.gold}}>🔒</span></div>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',padding:'48px 24px',background:s.black3,border:`1px solid ${s.border}`,marginTop:40}}>
          <h3 style={{fontSize:'clamp(20px,4vw,28px)',color:s.white,marginBottom:12,fontWeight:600}}>Sign in to access full listing details</h3>
          <p style={{color:s.muted,marginBottom:24,maxWidth:500,margin:'0 auto 24px',lineHeight:1.7}}>Members see full address, pricing guidance, property details, photos and direct agent contact.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/login" style={{background:s.gold,color:'#000',padding:'14px 28px',fontSize:14,fontWeight:500,textDecoration:'none'}}>Sign In</Link>
            <Link href="/signup" style={{border:'1px solid #A8AEBB',color:'#D4D8DF',padding:'14px 28px',fontSize:14,textDecoration:'none'}}>Join Free</Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
