import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [member, setMember] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (stored) setMember(JSON.parse(stored))
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('member')
    localStorage.removeItem('adminAuth')
    setMember(null)
    router.push('/')
  }

  return (
    <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(10,15,30,0.99)',borderBottom:'1px solid #1E2A45'}}>
      <style>{`
        @media(max-width:768px){
          .nav-links{display:none !important;}
          .nav-cta{display:none !important;}
          .hamburger{display:block !important;}
          .nav-logo{height:70px !important;}
          .nav-top{padding:4px 16px !important;}
          .nav-bottom{display:none !important;}
        }
        @media(min-width:769px){
          .hamburger{display:none !important;}
          .nav-logo{height:110px !important;}
        }
      `}</style>

      {/* TOP ROW - Logo + CTA */}
      <div className="nav-top" style={{maxWidth:1400,margin:'0 auto',padding:'8px 40px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{textDecoration:'none'}}>
          <img src="/logo-new.png" alt="Off Market Property Network" className="nav-logo" style={{height:110,width:'auto',objectFit:'contain',maxWidth:520}}/>
        </Link>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div className="nav-cta" style={{display:'flex',gap:10}}>
            {member ? (
              <>
                <Link href="/dashboard" style={{border:'1px solid #1E2A45',color:'#A8B4CC',fontSize:13,padding:'8px 18px',textDecoration:'none'}}>Dashboard</Link>
                <button onClick={handleSignOut} style={{background:'#C9A84C',color:'#000',fontSize:13,fontWeight:600,padding:'8px 18px',border:'none',cursor:'pointer'}}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" style={{border:'1px solid #1E2A45',color:'#A8B4CC',fontSize:13,padding:'8px 18px',textDecoration:'none'}}>Sign In</Link>
                <Link href="/signup" style={{background:'#C9A84C',color:'#000',fontSize:13,fontWeight:600,padding:'8px 18px',textDecoration:'none'}}>Join Free</Link>
              </>
            )}
          </div>
          <button onClick={()=>setOpen(!open)} className="hamburger" style={{background:'none',border:'1px solid #1E2A45',color:'#F5F3EE',padding:'8px 10px',cursor:'pointer',fontSize:16,display:'none'}}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* BOTTOM ROW - Nav links */}
      <div className="nav-bottom" style={{borderTop:'1px solid #1E2A45',background:'rgba(15,22,40,0.98)'}}>
        <div style={{maxWidth:1400,margin:'0 auto',padding:'0 40px',display:'flex',alignItems:'center',justifyContent:'space-between',height:40}}>
          <div className="nav-links" style={{display:'flex',gap:4}}>
            {[['/', 'Home'],['/how-it-works','How It Works'],['/listings','Listings'],['/pricing','Pricing']].map(([href,label])=>(
              <Link key={href} href={href} style={{color:'#6B7A99',fontSize:13,padding:'6px 12px',textDecoration:'none'}}>{label}</Link>
            ))}
          </div>
          <div style={{fontSize:10,color:'#1E2A45',letterSpacing:'0.15em',textTransform:'uppercase'}}>Australia&apos;s Private Property Network</div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{background:'#0F1628',borderTop:'1px solid #1E2A45',padding:'16px 20px',display:'flex',flexDirection:'column',gap:0}}>
          {[['/', 'Home'],['/how-it-works','How It Works'],['/listings','Listings'],['/pricing','Pricing']].map(([href,label])=>(
            <Link key={href} href={href} onClick={()=>setOpen(false)} style={{color:'#F5F3EE',fontSize:15,padding:'14px 0',textDecoration:'none',borderBottom:'1px solid #1E2A45'}}>{label}</Link>
          ))}
          {member ? (
            <>
              <Link href="/dashboard" onClick={()=>setOpen(false)} style={{color:'#F5F3EE',fontSize:15,padding:'14px 0',textDecoration:'none',borderBottom:'1px solid #1E2A45'}}>Dashboard</Link>
              <button onClick={()=>{handleSignOut();setOpen(false)}} style={{background:'none',border:'none',color:'#C9A84C',fontSize:15,padding:'14px 0',textAlign:'left',cursor:'pointer'}}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={()=>setOpen(false)} style={{color:'#F5F3EE',fontSize:15,padding:'14px 0',textDecoration:'none',borderBottom:'1px solid #1E2A45'}}>Sign In</Link>
              <Link href="/signup" onClick={()=>setOpen(false)} style={{color:'#C9A84C',fontSize:15,padding:'14px 0',textDecoration:'none'}}>Join Free — 3 Months Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
