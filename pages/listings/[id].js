import Nav from '../../components/Nav'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const gold = '#C9A84C'
const black = '#0A0A0A'
const black2 = '#111111'
const black3 = '#1A1A1A'
const white = '#F5F3EE'
const muted = '#7A7A7A'
const border = '#2A2A2A'

export default function ListingDetail() {
  const router = useRouter()
  const { id } = router.query
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [member, setMember] = useState(null)
  const [enquirySent, setEnquirySent] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (stored) setMember(JSON.parse(stored))
    if (id) fetchListing()
  }, [id])

  const fetchListing = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://jmjtcmfjknmdnlgxudfk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
      )
      const { data, error } = await supabase.from('listings').select('*').eq('id', id).single()
      if (!error) setListing(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleEnquiry = async () => {
    if (!member) { router.push('/login'); return }
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://jmjtcmfjknmdnlgxudfk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
      )
      await supabase.from('enquiries').insert([{
        listing_id: listing.id,
        listing_title: listing.title,
        listing_member_id: listing.member_id,
        enquirer_id: member.id,
        enquirer_name: `${member.firstName} ${member.lastName}`,
        enquirer_agency: member.agency,
        enquirer_username: member.username,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      setEnquirySent(true)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div style={{background:black,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{color:muted}}>Loading...</div></div>
  if (!listing) return <div style={{background:black,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{color:muted}}>Listing not found.</div></div>

  return (
    <div style={{background:black,minHeight:'100vh',color:white}}>
      <Nav/>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'40px 20px'}}>
        <Link href="/listings" style={{fontSize:12,color:muted,textDecoration:'none',marginBottom:20,display:'inline-block'}}>← Back to listings</Link>

        <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:32,marginTop:16}}>
          <div>
            {/* Main photo */}
            {listing.images && listing.images.length > 0 ? (
              <div>
                <img src={listing.images[activePhoto]} alt={listing.title} style={{width:'100%',height:400,objectFit:'cover',marginBottom:8}}/>
                {listing.images.length > 1 && (
                  <div style={{display:'flex',gap:8,overflowX:'auto'}}>
                    {listing.images.map((img,i)=>(
                      <img key={i} src={img} alt={`Photo ${i+1}`} onClick={()=>setActivePhoto(i)} style={{width:80,height:56,objectFit:'cover',cursor:'pointer',opacity:activePhoto===i?1:0.5,border:activePhoto===i?`2px solid ${gold}`:'2px solid transparent'}}/>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{height:400,background:black3,display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>🏠</div>
            )}

            {/* Details */}
            <div style={{marginTop:28}}>
              <div style={{fontSize:9,letterSpacing:'0.35em',color:gold,textTransform:'uppercase',marginBottom:8}}>{listing.suburb} · {listing.state} · {listing.postcode}</div>
              <h1 style={{fontSize:'clamp(22px,4vw,32px)',color:white,marginBottom:8,fontWeight:600}}>{listing.title}</h1>
              <div style={{fontSize:13,color:muted,marginBottom:20}}>{listing.street_address}, {listing.suburb} {listing.state} {listing.postcode}</div>

              <div style={{display:'flex',gap:24,marginBottom:24,flexWrap:'wrap'}}>
                {[['🛏', listing.bedrooms, 'Bed'],['🛁', listing.bathrooms, 'Bath'],['🚗', listing.car_spaces, 'Car'],['📐', listing.land_size, '']].map(([icon,val,label])=> val ? (
                  <div key={label} style={{textAlign:'center'}}>
                    <div style={{fontSize:20}}>{icon}</div>
                    <div style={{fontSize:16,color:white,fontWeight:600}}>{val}</div>
                    <div style={{fontSize:10,color:muted,textTransform:'uppercase'}}>{label}</div>
                  </div>
                ) : null)}
              </div>

              {listing.price_guide && (
                <div style={{background:'rgba(201,168,76,0.08)',border:`1px solid rgba(201,168,76,0.2)`,padding:'12px 16px',marginBottom:20}}>
                  <div style={{fontSize:10,letterSpacing:'0.2em',color:muted,textTransform:'uppercase',marginBottom:4}}>Price guide</div>
                  <div style={{fontSize:20,color:gold,fontWeight:600}}>{listing.price_guide}</div>
                </div>
              )}

              {listing.description && (
                <div style={{background:black3,border:`1px solid ${border}`,padding:20}}>
                  <div style={{fontSize:10,letterSpacing:'0.2em',color:gold,textTransform:'uppercase',marginBottom:12}}>About this property</div>
                  <p style={{fontSize:14,color:muted,lineHeight:1.7}}>{listing.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{background:black3,border:`1px solid ${border}`,padding:24,position:'sticky',top:80}}>
              <div style={{fontSize:10,letterSpacing:'0.3em',color:gold,textTransform:'uppercase',marginBottom:16}}>Listed by</div>
              <div style={{fontSize:16,color:white,fontWeight:600,marginBottom:4}}>{listing.first_name} {listing.last_name}</div>
              <div style={{fontSize:13,color:muted,marginBottom:4}}>{listing.agency}</div>
              <div style={{fontSize:10,letterSpacing:'0.1em',color:gold,textTransform:'uppercase',marginBottom:20}}>✓ Verified member</div>

              <div style={{borderTop:`1px solid ${border}`,paddingTop:20,marginBottom:20}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div style={{background:black2,padding:12,textAlign:'center'}}>
                    <div style={{fontSize:18,color:white,fontWeight:600}}>{listing.bedrooms || '—'}</div>
                    <div style={{fontSize:10,color:muted,textTransform:'uppercase'}}>Bed</div>
                  </div>
                  <div style={{background:black2,padding:12,textAlign:'center'}}>
                    <div style={{fontSize:18,color:white,fontWeight:600}}>{listing.bathrooms || '—'}</div>
                    <div style={{fontSize:10,color:muted,textTransform:'uppercase'}}>Bath</div>
                  </div>
                </div>
                <div style={{background:black2,padding:12,textAlign:'center',marginBottom:12}}>
                  <div style={{fontSize:13,color:white}}>{listing.property_type}</div>
                  <div style={{fontSize:10,color:muted,textTransform:'uppercase'}}>Property type</div>
                </div>
              </div>

              {member ? (
                enquirySent ? (
                  <div style={{background:'rgba(201,168,76,0.1)',border:`1px solid rgba(201,168,76,0.3)`,padding:16,textAlign:'center',fontSize:13,color:gold}}>
                    ✓ Enquiry sent! The agent will be in touch.
                  </div>
                ) : (
                  <button onClick={handleEnquiry} style={{background:gold,border:'none',color:'#000',fontSize:14,fontWeight:600,padding:14,cursor:'pointer',width:'100%'}}>
                    Send Enquiry →
                  </button>
                )
              ) : (
                <Link href="/login" style={{display:'block',background:gold,color:'#000',fontSize:14,fontWeight:600,padding:14,textAlign:'center',textDecoration:'none'}}>
                  Sign in to enquire →
                </Link>
              )}
              <p style={{fontSize:11,color:muted,textAlign:'center',marginTop:12}}>Members only · Verified professionals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
