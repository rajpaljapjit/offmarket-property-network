import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(10,10,10,0.97)',borderBottom:'1px solid #2A2A2A'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <Link href="/" style={{textDecoration:'none',display:'flex',flexDirection:'column',lineHeight:1.1}}>
          <span style={{fontSize:16,fontWeight:700,color:'#F5F3EE',letterSpacing:'0.05em'}}>OFF MARKET</span>
          <span style={{fontSize:8,letterSpacing:'0.35em',color:'#C9A84C',textTransform:'uppercase'}}>Property Network</span>
        </Link>

        {/* Desktop nav */}
        <div style={{display:'flex',gap:4,alignItems:'center'}} className="desktop-nav">
          {[['/', 'Home'],['/how-it-works','How It Works'],['/listings','Listings'],['/agents','Agents'],['/pricing','Pricing']].map(([href,label])=>(
            <Link key={href} href={href} style={{color:'#7A7A7A',fontSize:13,padding:'6px 10px',textDecoration:'none'}}>{label}</Link>
          ))}
        </div>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <Link href="/login" style={{border:'1px solid #2A2A2A',color:'#D4D8DF',fontSize:13,padding:'7px 14px',textDecoration:'none',display:'none'}} className="desktop-cta">Sign In</Link>
          <Link href="/signup" style={{background:'#C9A84C',color:'#000',fontSize:13,fontWeight:500,padding:'7px 16px',textDecoration:'none',display:'none'}} className="desktop-cta">Join Free</Link>
          
          {/* Hamburger */}
          <button onClick={()=>setOpen(!open)} style={{background:'none',border:'1px solid #2A2A2A',color:'#F5F3EE',padding:'8px 10px',cursor:'pointer',fontSize:16,display:'none'}} className="hamburger">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{background:'#111',borderTop:'1px solid #2A2A2A',padding:'16px 20px',display:'flex',flexDirection:'column',gap:0}}>
          {[['/', 'Home'],['/how-it-works','How It Works'],['/listings','Listings'],['/agents','Agents'],['/pricing','Pricing'],['/login','Sign In'],['/signup','Join Free — 3 Months Free']].map(([href,label])=>(
            <Link key={href} href={href} onClick={()=>setOpen(false)} style={{color:'#F5F3EE',fontSize:15,padding:'14px 0',textDecoration:'none',borderBottom:'1px solid #2A2A2A'}}>{label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .hamburger { display: block !important; }
        }
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: inline-block !important; }
          .hamburger { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
