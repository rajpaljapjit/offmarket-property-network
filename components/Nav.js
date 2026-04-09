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
    <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(27,42,27,0.99)',borderBottom:'1px solid #2D4A2D'}}>
      <style>{`
        @media(max-width:768px){
          .nav-links{display:none !important;}
          .nav-cta{display:none !important;}
          .hamburger{display:block !important;}
        }
        @media(min-width:769px){
          .hamburger{display:none !important;}
        }
      `}</style>

      {/* LOGO ROW */}
      <div style={{width:'100%',padding:'16px 0',display:'flex',alignItems:'center',justifyContent:'center',borderBottom:'1px solid #2D4A2D'}}>
        <Link href="/" style={{textDecoration:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
          <span style={{fontSize:'clamp(28px,4vw,52px)',fontWeight:700,color:'#C9A84C',letterSpacing:'0.12em',fontFamily:'Georgia,serif'}}>OFF MARKET</span>
          <span style={{fontSize:'clamp(9px,1.2vw,13px)',letterSpacing:'0.5em',color:'#C9A84C',textTransform:'uppercase',fontFamily:'Arial,sans-serif'}}>Property Network · Australia</span>
        </Link>
      </div>

      {/* NAV ROW - links + buttons */}
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:44}}>
        <div className="nav-links" style={{display:'flex',gap:4}}>
          {[['/', 'Home'],['/how-it-works','How It Works'],['/pricing','Pricing']].map(([href,label])=>(
            <Link key={href} href={href} style={{color:'#8BA888',fontSize:13,padding:'6px 12px',textDecoration:'none'}}>{label}</Link>
          ))}
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div className="nav-cta" style={{display:'flex',gap:8}}>
            {member ? (
              <>
                <Link href="/dashboard" style={{border:'1px solid #2D4A2D',color:'#E8E8E8',fontSize:13,padding:'6px 14px',textDecoration:'none'}}>Dashboard</Link>
                <button onClick={handleSignOut} style={{background:'#C9A84C',color:'#000',fontSize:13,fontWeight:600,padding:'6px 14px',border:'none',cursor:'pointer'}}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" style={{border:'1px solid #2D4A2D',color:'#E8E8E8',fontSize:13,padding:'6px 14px',textDecoration:'none'}}>Sign In</Link>
                <Link href="/signup" style={{background:'#C9A84C',color:'#000',fontSize:13,fontWeight:600,padding:'6px 14px',textDecoration:'none'}}>Join Free</Link>
              </>
            )}
          </div>
          <button onClick={()=>setOpen(!open)} className="hamburger" style={{background:'none',border:'1px solid #2D4A2D',color:'#C9A84C',padding:'8px 10px',cursor:'pointer',fontSize:16,display:'none'}}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{background:'#162016',borderTop:'1px solid #2D4A2D',padding:'16px 20px',display:'flex',flexDirection:'column',gap:0}}>
          {[['/', 'Home'],['/how-it-works','How It Works'],['/pricing','Pricing']].map(([href,label])=>(
            <Link key={href} href={href} onClick={()=>setOpen(false)} style={{color:'#C9A84C',fontSize:15,padding:'14px 0',textDecoration:'none',borderBottom:'1px solid #2D4A2D'}}>{label}</Link>
          ))}
          {member ? (
            <>
              <Link href="/dashboard" onClick={()=>setOpen(false)} style={{color:'#C9A84C',fontSize:15,padding:'14px 0',textDecoration:'none',borderBottom:'1px solid #2D4A2D'}}>Dashboard</Link>
              <button onClick={()=>{handleSignOut();setOpen(false)}} style={{background:'none',border:'none',color:'#C9A84C',fontSize:15,padding:'14px 0',textAlign:'left',cursor:'pointer'}}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={()=>setOpen(false)} style={{color:'#C9A84C',fontSize:15,padding:'14px 0',textDecoration:'none',borderBottom:'1px solid #2D4A2D'}}>Sign In</Link>
              <Link href="/signup" onClick={()=>setOpen(false)} style={{color:'#C9A84C',fontSize:15,padding:'14px 0',textDecoration:'none'}}>Join Free — 3 Months Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
