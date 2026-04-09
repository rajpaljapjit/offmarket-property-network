import Nav from '../../components/Nav'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#C9A84C',bg:'#1B2A1B',bg2:'#162016',bg3:'#1F2E1F',bg4:'#243524',white:'#C9A84C',muted:'#8BA888',border:'#2D4A2D',red:'#E24B4A'}

export default function NewListing() {
  const router = useRouter()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title:'',description:'',propertyType:'House',bedrooms:'',bathrooms:'',carSpaces:'',landSize:'',priceGuide:'',streetAddress:'',suburb:'',state:'QLD',postcode:''
  })
  const addressRef = useRef(null)
  const autocompleteRef = useRef(null)

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}
  const lab = {fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase',marginBottom:6,display:'block'}

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (!stored) { router.push('/login'); return }
    setMember(JSON.parse(stored))
    loadGoogleMaps()
  }, [])

  const loadGoogleMaps = () => {
    if (window.google) { initAutocomplete(); return }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}&libraries=places`
    script.async = true
    script.onload = initAutocomplete
    document.head.appendChild(script)
  }

  const initAutocomplete = () => {
    if (!addressRef.current || !window.google) return
    autocompleteRef.current = new window.google.maps.places.Autocomplete(addressRef.current, {
      componentRestrictions: { country: 'au' },
      fields: ['address_components', 'formatted_address'],
      types: ['address']
    })
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace()
      if (!place.address_components) return
      let streetNumber = '', streetName = '', suburb = '', state = '', postcode = ''
      place.address_components.forEach(component => {
        const types = component.types
        if (types.includes('street_number')) streetNumber = component.long_name
        if (types.includes('route')) streetName = component.long_name
        if (types.includes('locality')) suburb = component.long_name
        if (types.includes('administrative_area_level_1')) state = component.short_name
        if (types.includes('postal_code')) postcode = component.long_name
      })
      setForm(prev => ({
        ...prev,
        streetAddress: `${streetNumber} ${streetName}`.trim(),
        suburb,
        state,
        postcode
      }))
    })
  }

  const getSupabase = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SECRET_KEY)
  }

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value})

  const handleImageUpload = async e => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const db = await getSupabase()
      const uploaded = []
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name.replace(/\s/g,'-')}`
        const { error } = await db.storage.from('listing-images').upload(fileName, file)
        if (!error) {
          const { data } = db.storage.from('listing-images').getPublicUrl(fileName)
          uploaded.push(data.publicUrl)
        }
      }
      setImages(prev=>[...prev,...uploaded])
    } catch { setError('Image upload failed.') }
    setUploading(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          memberId: member?.id,
          firstName: member?.firstName,
          lastName: member?.lastName,
          agency: member?.agency,
          ...form,
          images
        })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error||'Something went wrong.') } else { router.push('/dashboard') }
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(false)
  }

  if (!member) return <div style={{background:s.bg,minHeight:'100vh'}}></div>

  return (
    <div style={{background:s.bg,minHeight:'100vh',color:s.white}}>
      <Nav/>
      <style>{`
        .pac-container { background:#1F2E1F !important; border:1px solid #2D4A2D !important; font-family:inherit !important; }
        .pac-item { color:#E8E8E8 !important; padding:8px 12px !important; cursor:pointer !important; border-top:1px solid #2D4A2D !important; }
        .pac-item:hover { background:#243524 !important; }
        .pac-item-query { color:#C9A84C !important; }
        .pac-matched { color:#C9A84C !important; }
      `}</style>
      <div style={{maxWidth:800,margin:'0 auto',padding:'48px 20px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>New listing</div>
        <h1 style={{fontSize:'clamp(24px,4vw,36px)',color:s.white,marginBottom:8,fontWeight:600}}>Upload an off market listing</h1>
        <p style={{color:s.muted,marginBottom:40,fontSize:14}}>This listing will only be visible to verified members.</p>

        {error&&<div style={{background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.3)',padding:'12px 16px',marginBottom:24,fontSize:13,color:s.red,borderRadius:2}}>{error}</div>}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:28}}>
          <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:28}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>Property details</div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div><label style={lab}>Listing title *</label><input name="title" value={form.title} onChange={handleChange} type="text" placeholder="e.g. Prestige waterfront opportunity" style={input} required/></div>
              <div><label style={lab}>Description</label><textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the property..." style={{...input,height:120,resize:'vertical'}}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div><label style={lab}>Property type</label>
                  <select name="propertyType" value={form.propertyType} onChange={handleChange} style={{...input,padding:'12px 14px'}}>
                    <option>House</option><option>Apartment</option><option>Townhouse</option><option>Villa</option><option>Land</option><option>Acreage</option><option>Rural</option><option>Commercial</option><option>Other</option>
                  </select>
                </div>
                <div><label style={lab}>Price guide</label><input name="priceGuide" value={form.priceGuide} onChange={handleChange} type="text" placeholder="e.g. $1.2M - $1.4M" style={input}/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:16}}>
                <div><label style={lab}>Bedrooms</label><input name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number" placeholder="4" style={input} min="0"/></div>
                <div><label style={lab}>Bathrooms</label><input name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number" placeholder="2" style={input} min="0"/></div>
                <div><label style={lab}>Car spaces</label><input name="carSpaces" value={form.carSpaces} onChange={handleChange} type="number" placeholder="2" style={input} min="0"/></div>
                <div><label style={lab}>Land size</label><input name="landSize" value={form.landSize} onChange={handleChange} type="text" placeholder="600m²" style={input}/></div>
              </div>
            </div>
          </div>

          <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:28}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:8}}>Property address</div>
            <p style={{fontSize:12,color:s.muted,marginBottom:20}}>Start typing the address and select from the suggestions.</p>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div>
                <label style={lab}>Search address *</label>
                <input
                  ref={addressRef}
                  type="text"
                  placeholder="Start typing the property address..."
                  style={input}
                />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16}}>
                <div><label style={lab}>Street address *</label><input name="streetAddress" value={form.streetAddress} onChange={handleChange} type="text" placeholder="Will auto-fill" style={input} required/></div>
                <div><label style={lab}>Suburb *</label><input name="suburb" value={form.suburb} onChange={handleChange} type="text" placeholder="Will auto-fill" style={input} required/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div><label style={lab}>State *</label>
                  <select name="state" value={form.state} onChange={handleChange} style={{...input,padding:'12px 14px'}}>
                    <option>QLD</option><option>NSW</option><option>VIC</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option>
                  </select>
                </div>
                <div><label style={lab}>Postcode *</label><input name="postcode" value={form.postcode} onChange={handleChange} type="text" placeholder="Will auto-fill" style={input} required/></div>
              </div>
            </div>
          </div>

          <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:28}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>Photos</div>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{display:'none'}} id="imageUpload"/>
            <label htmlFor="imageUpload" style={{display:'block',border:`2px dashed ${s.border}`,padding:'32px',textAlign:'center',cursor:'pointer',marginBottom:16}}>
              <div style={{fontSize:32,marginBottom:8}}>📷</div>
              <div style={{fontSize:14,color:s.white,marginBottom:4}}>{uploading?'Uploading...':'Click to upload photos'}</div>
              <div style={{fontSize:12,color:s.muted}}>JPG, PNG up to 10MB each. Multiple allowed.</div>
            </label>
            {images.length>0&&(
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                {images.map((img,i)=>(
                  <div key={i} style={{position:'relative'}}>
                    <img src={img} alt={`Photo ${i+1}`} style={{width:'100%',height:100,objectFit:'cover'}}/>
                    <button type="button" onClick={()=>setImages(images.filter((_,idx)=>idx!==i))} style={{position:'absolute',top:4,right:4,background:'rgba(0,0,0,0.7)',border:'none',color:s.white,width:24,height:24,cursor:'pointer',fontSize:12}}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} style={{background:loading?'#8A6A1F':s.gold,border:'none',color:'#000',fontSize:15,fontWeight:600,padding:16,cursor:loading?'not-allowed':'pointer',opacity:loading?0.8:1}}>
            {loading?'Uploading listing...':'Publish Listing →'}
          </button>
        </form>
      </div>
    </div>
  )
}
