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
        }
        @media(min-width:769px){
          .hamburger{display:none !important;}
        }
      `}</style>

      {/* LOGO ROW - full width, centered, big */}
      <div style={{width:'100%',padding:'12px 0',display:'flex',alignItems:'center',justifyContent:'center',borderBottom:'1px solid #1E2A45'}}>
        <Link href="/" style={{textDecoration:'none'}}>
          <img src="/logo-new.png" alt="Off Market Property Network" style={{height:120,width:'auto',objectFit:'contain'}}/>
        </Link>
      </div>

      {/* NAV ROW - links + buttons */}
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:44}}>
        <div className="nav-links" style={{display:'flex',gap:4}}>
          {[['/', 'Home'],['/how-it-works','How It Works'],['/listings','Listings'],['/pricing','Pricing']].map(([href,label])=>(
            <Link key={href} href={href} style={{color:'#6B7A99',fontSize:13,padding:'6px 12px',textDecoration:'none'}}>{label}</Link>
          ))}
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div className="nav-cta" style={{display:'flex',gap:8}}>
            {member ? (
              <>
                <Link href="/dashboard" style={{border:'1px solid #1E2A45',color:'#A8B4CC',fontSize:13,padding:'6px 14px',textDecoration:'none'}}>Dashboard</Link>
                <button onClick={handleSignOut} style={{background:'#C9A84C',color:'#000',fontSize:13,fontWeight:600,padding:'6px 14px',border:'none',cursor:'pointer'}}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" style={{border:'1px solid #1E2A45',color:'#A8B4CC',fontSize:13,padding:'6px 14px',textDecoration:'none'}}>Sign In</Link>
                <Link href="/signup" style={{background:'#C9A84C',color:'#000',fontSize:13,fontWeight:600,padding:'6px 14px',textDecoration:'none'}}>Join Free</Link>
              </>
            )}
          </div>
          <button onClick={()=>setOpen(!open)} className="hamburger" style={{background:'none',border:'1px solid #1E2A45',color:'#F5F3EE',padding:'8px 10px',cursor:'pointer',fontSize:16,display:'none'}}>
            {open ? '✕' : '☰'}
          </button>
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
