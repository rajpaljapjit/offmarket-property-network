import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import Nav from '../../components/Nav'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#FFD166',bg:'#0D0A1A',bg2:'#13102A',bg3:'#1A1638',bg4:'#221E46',white:'#FFFFFF',cream:'#D4CFFF',muted:'#8888BB',border:'rgba(155,109,255,0.15)',borderGold:'rgba(255,209,102,0.25)',violet:'#9B6DFF',emerald:'#00E5A0',red:'#FF6B6B'}

function DropZoneUploader({ onUpload, uploading }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {'image/*': []},
    multiple: true,
    onDrop: files => {
      const event = { target: { files } }
      onUpload(event)
    }
  })

  return (
    <div {...getRootProps()} style={{
      border:`2px dashed ${isDragActive ? '#FFD166' : 'rgba(155,109,255,0.3)'}`,
      borderRadius: 10,
      padding:'48px 20px',
      textAlign:'center',
      cursor:'pointer',
      background: isDragActive ? 'rgba(255,209,102,0.05)' : 'rgba(155,109,255,0.04)',
      transition:'all 0.2s ease'
    }}>
      <input {...getInputProps()}/>
      <div style={{fontSize:36,marginBottom:12}}>📸</div>
      {isDragActive ? (
        <div style={{fontSize:14,color:'#FFD166',fontWeight:500}}>Drop photos here...</div>
      ) : (
        <>
          <div style={{fontSize:14,color:'#D4CFFF',marginBottom:6,fontWeight:500}}>{uploading ? 'Uploading...' : 'Drag & drop photos here'}</div>
          <div style={{fontSize:12,color:'#8888BB'}}>or click to browse · JPG, PNG up to 10MB each</div>
        </>
      )}
    </div>
  )
}

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

  const input = {background:s.bg3,border:`1px solid ${s.border}`,borderRadius:8,color:s.white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box',outline:'none'}
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY || 'AIzaSyCyHs0C98RsaaMnmsntVxsUUhQJ3FeZl4U'}&libraries=places`
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
      // Map full state names to abbreviations
      const stateMap = {
        'New South Wales': 'NSW',
        'Victoria': 'VIC',
        'Queensland': 'QLD',
        'Western Australia': 'WA',
        'South Australia': 'SA',
        'Tasmania': 'TAS',
        'Australian Capital Territory': 'ACT',
        'Northern Territory': 'NT'
      }
      const stateAbbr = stateMap[state] || state

      setForm(prev => ({
        ...prev,
        streetAddress: `${streetNumber} ${streetName}`.trim(),
        suburb,
        state: stateAbbr,
        postcode
      }))
    })
  }

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value})

  const handleImageUpload = async e => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const uploaded = []
      for (const file of files) {
        const urlRes = await fetch('/api/listings/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name.replace(/\s/g, '-') }),
        })
        const { signedUrl, publicUrl } = await urlRes.json()
        if (!signedUrl) continue
        const uploadRes = await fetch(signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type, 'x-upsert': 'true' },
          body: file,
        })
        if (uploadRes.ok) uploaded.push(publicUrl)
      }
      setImages(prev => [...prev, ...uploaded])
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
        .pac-container { background:#1A1638 !important; border:1px solid rgba(155,109,255,0.25) !important; font-family:inherit !important; border-radius:8px !important; }
        .pac-item { color:#D4CFFF !important; padding:8px 12px !important; cursor:pointer !important; border-top:1px solid rgba(155,109,255,0.1) !important; }
        .pac-item:hover { background:#221E46 !important; }
        .pac-item-query { color:#FFD166 !important; }
        .pac-matched { color:#FFD166 !important; }
        input::placeholder, textarea::placeholder { color:#8888BB; }
        select option { background:#1A1638; }
      `}</style>
      <div style={{maxWidth:800,margin:'0 auto',padding:'48px 20px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>New listing</div>
        <h1 style={{fontSize:'clamp(24px,4vw,36px)',color:s.white,marginBottom:8,fontWeight:600}}>Upload an off market listing</h1>
        <p style={{color:s.muted,marginBottom:40,fontSize:14}}>This listing will only be visible to verified members.</p>

        {error&&<div style={{background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.3)',padding:'12px 16px',marginBottom:24,fontSize:13,color:s.red,borderRadius:2}}>{error}</div>}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:28}}>
          <div style={{background:s.bg2,border:`1px solid ${s.border}`,borderRadius:12,padding:28}}>
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

          <div style={{background:s.bg2,border:`1px solid ${s.border}`,borderRadius:12,padding:28}}>
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

          <div style={{background:s.bg2,border:`1px solid ${s.border}`,borderRadius:12,padding:28}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:20}}>Photos</div>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{display:'none'}} id="imageUpload"/>
            <label htmlFor="imageUpload" style={{display:'block',border:`2px dashed rgba(155,109,255,0.3)`,borderRadius:10,padding:'32px',textAlign:'center',cursor:'pointer',marginBottom:16,background:'rgba(155,109,255,0.04)'}}>
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

          <button type="submit" disabled={loading} style={{background:`linear-gradient(135deg, ${s.violet}, ${s.gold})`,border:'none',color:s.white,fontSize:15,fontWeight:700,padding:16,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,borderRadius:10,boxShadow:'0 0 32px rgba(155,109,255,0.35)'}}>
            {loading?'Uploading listing...':'Publish Listing →'}
          </button>
        </form>
      </div>
    </div>
  )
}
