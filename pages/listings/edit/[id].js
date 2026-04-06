import Nav from '../../../components/Nav'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const gold = '#C9A84C'
const black = '#0A0A0A'
const black3 = '#1A1A1A'
const white = '#F5F3EE'
const muted = '#7A7A7A'
const border = '#2A2A2A'
const red = '#E24B4A'

export default function EditListing() {
  const router = useRouter()
  const { id } = router.query
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [soldVia, setSoldVia] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title:'', description:'', propertyType:'House', bedrooms:'', bathrooms:'', carSpaces:'', landSize:'', priceGuide:'', streetAddress:'', suburb:'', state:'QLD', postcode:''
  })

  const input = {background:black3,border:`1px solid ${border}`,color:white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}
  const lab = {fontSize:11,letterSpacing:'0.2em',color:muted,textTransform:'uppercase',marginBottom:6,display:'block'}

  const getSupabase = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(
      'https://jmjtcmfjknmdnlgxudfk.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'
    )
  }

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (!stored) { router.push('/login'); return }
    setMember(JSON.parse(stored))
    if (id) fetchListing()
  }, [id])

  const fetchListing = async () => {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from('listings').select('*').eq('id', id).single()
    if (!error && data) {
      setForm({
        title: data.title || '',
        description: data.description || '',
        propertyType: data.property_type || 'House',
        bedrooms: data.bedrooms || '',
        bathrooms: data.bathrooms || '',
        carSpaces: data.car_spaces || '',
        landSize: data.land_size || '',
        priceGuide: data.price_guide || '',
        streetAddress: data.street_address || '',
        suburb: data.suburb || '',
        state: data.state || 'QLD',
        postcode: data.postcode || '',
      })
      setImages(data.images || [])
    }
    setLoading(false)
  }

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value})

  const handleImageUpload = async e => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploading(true)
    try {
      const supabase = await getSupabase()
      const uploaded = []
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
        const { error } = await supabase.storage.from('listing-images').upload(fileName, file)
        if (!error) {
          const { data } = supabase.storage.from('listing-images').getPublicUrl(fileName)
          uploaded.push(data.publicUrl)
        }
      }
      setImages(prev => [...prev, ...uploaded])
    } catch (err) {
      setError('Image upload failed.')
    }
    setUploading(false)
  }

  const handleSave = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      const supabase = await getSupabase()
      const { error } = await supabase.from('listings').update({
        title: form.title,
        description: form.description,
        property_type: form.propertyType,
        bedrooms: parseInt(form.bedrooms) || 0,
        bathrooms: parseInt(form.bathrooms) || 0,
        car_spaces: parseInt(form.carSpaces) || 0,
        land_size: form.landSize,
        price_guide: form.priceGuide,
        street_address: form.streetAddress,
        suburb: form.suburb,
        state: form.state,
        postcode: form.postcode,
        images,
      }).eq('id', id)
      if (error) { setError(error.message) } else { setSuccess('Listing updated successfully!') }
    } catch (err) {
      setError('Something went wrong.')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!soldVia) { setError('Please select an option.'); return }
    setDeleting(true)
    try {
      const supabase = await getSupabase()
      if (soldVia === 'not_sold') {
        await supabase.from('listings').update({ status: 'inactive' }).eq('id', id)
      } else {
        await supabase.from('listings').update({
          status: 'sold',
          sold_via: soldVia,
          sold_at: new Date().toISOString()
        }).eq('id', id)
      }
      router.push('/dashboard')
    } catch (err) {
      setError('Something went wrong.')
    }
    setDeleting(false)
  }

  if (loading) return <div style={{background:black,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{color:muted}}>Loading...</div></div>

  return (
    <div style={{background:black,minHeight:'100vh',color:white}}>
      <Nav/>

      {showDeleteModal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.85)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:black3,border:`1px solid ${border}`,padding:40,maxWidth:480,width:'100%'}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:gold,textTransform:'uppercase',marginBottom:16}}>Remove listing</div>
            <h3 style={{fontSize:20,color:white,marginBottom:8,fontWeight:600}}>What happened with this property?</h3>
            <p style={{fontSize:13,color:muted,marginBottom:24,lineHeight:1.6}}>This helps us track off market outcomes and improve the network.</p>
            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
              {[
                {value:'offmarketpropertynetwork',label:'✓ Sold via Off Market Property Network',desc:'Deal closed through our platform'},
                {value:'sold_elsewhere',label:'Sold somewhere else',desc:'Sold through another channel'},
                {value:'prefer_not_to_say',label:'Prefer not to say',desc:''},
                {value:'not_sold',label:'Not being sold anymore',desc:'Remove listing without marking as sold'},
              ].map(opt=>(
                <div key={opt.value} onClick={()=>setSoldVia(opt.value)} style={{background:soldVia===opt.value?'rgba(201,168,76,0.1)':black3,border:`1px solid ${soldVia===opt.value?gold:border}`,padding:'14px 16px',cursor:'pointer'}}>
                  <div style={{fontSize:13,color:soldVia===opt.value?gold:white,fontWeight:soldVia===opt.value?600:400}}>{opt.label}</div>
                  {opt.desc&&<div style={{fontSize:11,color:muted,marginTop:3}}>{opt.desc}</div>}
                </div>
              ))}
            </div>
            {error && <div style={{color:red,fontSize:12,marginBottom:12}}>{error}</div>}
            <div style={{display:'flex',gap:12}}>
              <button onClick={()=>{setShowDeleteModal(false);setSoldVia('');setError('')}} style={{flex:1,background:'none',border:`1px solid ${border}`,color:muted,fontSize:13,padding:12,cursor:'pointer'}}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{flex:1,background:soldVia==='offmarketpropertynetwork'?gold:red,border:'none',color:'#000',fontSize:13,fontWeight:600,padding:12,cursor:deleting?'not-allowed':'pointer',opacity:deleting?0.8:1}}>
                {deleting ? 'Removing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{maxWidth:800,margin:'0 auto',padding:'48px 20px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32,flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{fontSize:10,letterSpacing:'0.4em',color:gold,textTransform:'uppercase',marginBottom:8}}>Edit listing</div>
            <h1 style={{fontSize:'clamp(22px,4vw,32px)',color:white,fontWeight:600}}>Update your listing</h1>
          </div>
          <button onClick={()=>setShowDeleteModal(true)} style={{background:'none',border:`1px solid ${red}`,color:red,fontSize:13,padding:'8px 20px',cursor:'pointer'}}>Remove listing</button>
        </div>

        {error && <div style={{background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.3)',padding:'12px 16px',marginBottom:24,fontSize:13,color:red,borderRadius:2}}>{error}</div>}
        {success && <div style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',padding:'12px 16px',marginBottom:24,fontSize:13,color:gold,borderRadius:2}}>{success}</div>}

        <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:28}}>
          <div style={{background:black3,border:`1px solid ${border}`,padding:28}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:gold,textTransform:'uppercase',marginBottom:20}}>Property details</div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div><label style={lab}>Listing title *</label><input name="title" value={form.title} onChange={handleChange} type="text" style={input} required/></div>
              <div><label style={lab}>Description</label><textarea name="description" value={form.description} onChange={handleChange} style={{...input,height:120,resize:'vertical'}}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div><label style={lab}>Property type</label>
                  <select name="propertyType" value={form.propertyType} onChange={handleChange} style={{...input,padding:'12px 14px'}}>
                    <option>House</option><option>Apartment</option><option>Townhouse</option><option>Villa</option><option>Land</option><option>Acreage</option><option>Rural</option><option>Commercial</option><option>Other</option>
                  </select>
                </div>
                <div><label style={lab}>Price guide</label><input name="priceGuide" value={form.priceGuide} onChange={handleChange} type="text" style={input}/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:16}}>
                <div><label style={lab}>Bedrooms</label><input name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number" style={input} min="0"/></div>
                <div><label style={lab}>Bathrooms</label><input name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number" style={input} min="0"/></div>
                <div><label style={lab}>Car spaces</label><input name="carSpaces" value={form.carSpaces} onChange={handleChange} type="number" style={input} min="0"/></div>
                <div><label style={lab}>Land size</label><input name="landSize" value={form.landSize} onChange={handleChange} type="text" style={input}/></div>
              </div>
            </div>
          </div>

          <div style={{background:black3,border:`1px solid ${border}`,padding:28}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:gold,textTransform:'uppercase',marginBottom:20}}>Property address</div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div><label style={lab}>Street address *</label><input name="streetAddress" value={form.streetAddress} onChange={handleChange} type="text" style={input} required/></div>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:16}}>
                <div><label style={lab}>Suburb *</label><input name="suburb" value={form.suburb} onChange={handleChange} type="text" style={input} required/></div>
                <div><label style={lab}>State *</label>
                  <select name="state" value={form.state} onChange={handleChange} style={{...input,padding:'12px 14px'}}>
                    <option>QLD</option><option>NSW</option><option>VIC</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option>
                  </select>
                </div>
                <div><label style={lab}>Postcode *</label><input name="postcode" value={form.postcode} onChange={handleChange} type="text" style={input} required/></div>
              </div>
            </div>
          </div>

          <div style={{background:black3,border:`1px solid ${border}`,padding:28}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:gold,textTransform:'uppercase',marginBottom:20}}>Photos</div>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{display:'none'}} id="imageUpload"/>
            <label htmlFor="imageUpload" style={{display:'block',border:`2px dashed ${border}`,padding:'24px',textAlign:'center',cursor:'pointer',marginBottom:16}}>
              <div style={{fontSize:14,color:white,marginBottom:4}}>{uploading ? 'Uploading...' : 'Click to add more photos'}</div>
              <div style={{fontSize:12,color:muted}}>JPG, PNG up to 10MB each</div>
            </label>
            {images.length > 0 && (
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                {images.map((img,i)=>(
                  <div key={i} style={{position:'relative'}}>
                    <img src={img} alt={`Photo ${i+1}`} style={{width:'100%',height:100,objectFit:'cover'}}/>
                    <button type="button" onClick={()=>setImages(images.filter((_,idx)=>idx!==i))} style={{position:'absolute',top:4,right:4,background:'rgba(0,0,0,0.7)',border:'none',color:white,width:24,height:24,cursor:'pointer',fontSize:12}}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{display:'flex',gap:12}}>
            <button type="button" onClick={()=>router.push('/dashboard')} style={{flex:1,background:'none',border:`1px solid ${border}`,color:muted,fontSize:14,padding:14,cursor:'pointer'}}>Cancel</button>
            <button type="submit" disabled={saving} style={{flex:2,background:saving?'#8A6A1F':gold,border:'none',color:'#000',fontSize:15,fontWeight:600,padding:14,cursor:saving?'not-allowed':'pointer',opacity:saving?0.8:1}}>
              {saving ? 'Saving...' : 'Save changes →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
