import Nav from '../../components/Nav'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#C9A84C',bg:'#1B2A1B',bg2:'#162016',bg3:'#1F2E1F',bg4:'#243524',white:'#C9A84C',muted:'#8BA888',mid:'#E8E8E8',border:'#2D4A2D'}

export default function ListingDetail() {
  const router = useRouter()
  const { id } = router.query
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [member, setMember] = useState(null)
  const [enquirySent, setEnquirySent] = useState(false)
  const [enquiryLoading, setEnquiryLoading] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (stored) setMember(JSON.parse(stored))
    if (id) fetchListing()
  }, [id])

  const getSupabase = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SECRET_KEY)
  }

  const fetchListing = async () => {
    const db = await getSupabase()
    const { data, error } = await db.from('listings').select('*').eq('id', id).single()
    if (!error) setListing(data)
    setLoading(false)
  }

  const handleEnquiry = async () => {
    if (!member) { router.push('/login'); return }
    setEnquiryLoading(true)
    try {
      // Get listing member email
      const db = await getSupabase()
      const { data: listingMember } = await db.from('members').select('email, mobile').eq('id', listing.member_id).single()

      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          listingId: listing.id,
          listingTitle: listing.title,
          listingMemberId: listing.member_id,
          listingMemberEmail: listingMember?.email,
          enquirerId: member.id,
          enquirerName: `${member.firstName} ${member.lastName}`,
          enquirerAgency: member.agency,
          enquirerUsername: member.username,
          enquirerEmail: member.email,
          enquirerMobile: member.mobile,
        })
      })
      if (res.ok) setEnquirySent(true)
    } catch (err) {
      console.error(err)
    }
    setEnquiryLoading(false)
  }

  if (loading) return <div style={{background:s.bg,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{color:s.muted}}>Loading...</div></div>
  if (!listing) return <div style={{background:s.bg,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{color:s.muted}}>Listing not found.</div></div>

  return (
    <div style={{background:s.bg,minHeight:'100vh',color:s.white}}>
      <Nav/>
      <style>{`.listing-grid{display:grid;grid-template-columns:1fr 340px;gap:32px;}@media(max-width:900px){.listing-grid{grid-template-columns:1fr;}}`}</style>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'40px 20px'}}>
        <Link href="/listings" style={{fontSize:12,color:s.muted,textDecoration:'none',marginBottom:20,display:'inline-block'}}>← Back to listings</Link>
        <div className="listing-grid" style={{marginTop:16}}>
          <div>
            {listing.images&&listing.images.length>0 ? (
              <div>
                <img src={listing.images[activePhoto]} alt={listing.title} style={{width:'100%',height:400,objectFit:'cover',marginBottom:8}}/>
                {listing.images.length>1&&(
                  <div style={{display:'flex',gap:8,overflowX:'auto'}}>
                    {listing.images.map((img,i)=>(
                      <img key={i} src={img} alt={`Photo ${i+1}`} onClick={()=>setActivePhoto(i)} style={{width:80,height:56,objectFit:'cover',cursor:'pointer',opacity:activePhoto===i?1:0.5,border:activePhoto===i?`2px solid ${s.gold}`:'2px solid transparent'}}/>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{height:400,background:s.bg4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>🏠</div>
            )}
            <div style={{marginTop:28}}>
              <div style={{fontSize:9,letterSpacing:'0.35em',color:s.gold,textTransform:'uppercase',marginBottom:8}}>{listing.suburb} · {listing.state} · {listing.postcode}</div>
              <h1 style={{fontSize:'clamp(22px,4vw,32px)',color:s.white,marginBottom:8,fontWeight:600}}>{listing.title}</h1>
              <div style={{fontSize:13,color:s.muted,marginBottom:20}}>{listing.street_address}, {listing.suburb} {listing.state} {listing.postcode}</div>
              <div style={{display:'flex',gap:24,marginBottom:24,flexWrap:'wrap'}}>
                {[['🛏',listing.bedrooms,'Bed'],['🛁',listing.bathrooms,'Bath'],['🚗',listing.car_spaces,'Car'],['📐',listing.land_size,'']].map(([icon,val,label])=>val?(
                  <div key={label} style={{textAlign:'center'}}>
                    <div style={{fontSize:20}}>{icon}</div>
                    <div style={{fontSize:16,color:s.white,fontWeight:600}}>{val}</div>
                    <div style={{fontSize:10,color:s.muted,textTransform:'uppercase'}}>{label}</div>
                  </div>
                ):null)}
              </div>
              {listing.price_guide&&(
                <div style={{background:'rgba(201,168,76,0.08)',border:`1px solid rgba(201,168,76,0.2)`,padding:'12px 16px',marginBottom:20}}>
                  <div style={{fontSize:10,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase',marginBottom:4}}>Price guide</div>
                  <div style={{fontSize:20,color:s.gold,fontWeight:600}}>{listing.price_guide}</div>
                </div>
              )}
              {listing.description&&(
                <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:20}}>
                  <div style={{fontSize:10,letterSpacing:'0.2em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>About this property</div>
                  <p style={{fontSize:14,color:s.muted,lineHeight:1.7}}>{listing.description}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:24,position:'sticky',top:80}}>
              <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>Listed by</div>
              <div style={{fontSize:16,color:s.white,fontWeight:600,marginBottom:4}}>{listing.first_name} {listing.last_name}</div>
              <div style={{fontSize:13,color:s.muted,marginBottom:4}}>{listing.agency}</div>
              <div style={{fontSize:10,letterSpacing:'0.1em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>✓ Verified member</div>
              <div style={{borderTop:`1px solid ${s.border}`,paddingTop:20,marginBottom:20}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div style={{background:s.bg2,padding:12,textAlign:'center'}}>
                    <div style={{fontSize:18,color:s.white,fontWeight:600}}>{listing.bedrooms||'—'}</div>
                    <div style={{fontSize:10,color:s.muted,textTransform:'uppercase'}}>Bed</div>
                  </div>
                  <div style={{background:s.bg2,padding:12,textAlign:'center'}}>
                    <div style={{fontSize:18,color:s.white,fontWeight:600}}>{listing.bathrooms||'—'}</div>
                    <div style={{fontSize:10,color:s.muted,textTransform:'uppercase'}}>Bath</div>
                  </div>
                </div>
                <div style={{background:s.bg2,padding:12,textAlign:'center',marginBottom:12}}>
                  <div style={{fontSize:13,color:s.white}}>{listing.property_type}</div>
                  <div style={{fontSize:10,color:s.muted,textTransform:'uppercase'}}>Property type</div>
                </div>
              </div>
              {member ? (
                enquirySent ? (
                  <div style={{background:'rgba(201,168,76,0.1)',border:`1px solid rgba(201,168,76,0.3)`,padding:16,textAlign:'center',fontSize:13,color:s.gold}}>
                    ✓ Enquiry sent! The agent will be in touch.
                  </div>
                ) : (
                  <button onClick={handleEnquiry} disabled={enquiryLoading} style={{background:enquiryLoading?'#8A6A1F':s.gold,border:'none',color:'#000',fontSize:14,fontWeight:600,padding:14,cursor:enquiryLoading?'not-allowed':'pointer',width:'100%',opacity:enquiryLoading?0.8:1}}>
                    {enquiryLoading?'Sending...':'Send Enquiry →'}
                  </button>
                )
              ) : (
                <Link href="/login" style={{display:'block',background:s.gold,color:'#000',fontSize:14,fontWeight:600,padding:14,textAlign:'center',textDecoration:'none'}}>
                  Sign in to enquire →
                </Link>
              )}
              <p style={{fontSize:11,color:s.muted,textAlign:'center',marginTop:12}}>Members only · Verified professionals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
