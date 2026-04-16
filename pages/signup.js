import Nav from '../components/Nav'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

const s={gold:'#B8923A',goldDim:'rgba(184,146,58,0.1)',bg:'#F8F6F1',bg2:'#FFFFFF',bg3:'#F2EFE9',bg4:'#EAE6DE',white:'#1C1A17',cream:'#4A4640',muted:'#8A8178',mid:'#4A4640',border:'rgba(184,146,58,0.2)',borderGold:'rgba(184,146,58,0.35)',error:'#CC3333',silver:'#4A4640'}

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().min(10, 'Please enter a valid mobile number'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username too long').regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  agency: z.string().min(2, 'Please enter your agency name'),
  licenseNumber: z.string().regex(/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9\-]{4,20}$/, 'License number must contain both letters and numbers (e.g. QLD-1234567)'),
  role: z.string(),
  state: z.string(),
  plan: z.string(),
})

export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(null)

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'Selling Agent',
      state: 'QLD',
      plan: 'Silver'
    }
  })

  const watchRole = watch('role')

  // Auto-select plan when role changes
  const handleRoleChange = (e) => {
    const role = e.target.value
    setValue('role', role)
    if (role === 'Buyers Agent' || role === 'Both') {
      setValue('plan', 'Buyers Agent')
    } else {
      setValue('plan', 'Silver')
    }
  }

  const checkUsername = async (username) => {
    if (username.length < 3) return
    try {
      const res = await fetch(`/api/check-username?username=${username}`)
      const data = await res.json()
      setUsernameAvailable(data.available)
    } catch { setUsernameAvailable(null) }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobile: data.mobile,
          username: data.username,
          password: data.password,
          agency: data.agency,
          licenseNumber: data.licenseNumber,
          role: data.role,
          state: data.state,
          plan: data.plan,
        })
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'Something went wrong.')
      } else {
        router.push(`/welcome?name=${encodeURIComponent(data.firstName)}&email=${encodeURIComponent(data.email)}`)
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.mid,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box',outline:'none'}
  const errorInput = {...input, border:`1px solid ${s.red}`}
  const lab = {fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase',marginBottom:6,display:'block'}
  const errMsg = {fontSize:11,color:s.error,marginTop:4}

  return (
    <div style={{background:s.bg,minHeight:'100vh',color:s.mid}}>
      <Nav/>
      <div style={{maxWidth:640,margin:'0 auto',padding:'48px 20px 80px'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <img src="/offmarkethublogo.png" alt="Off Market Property Network" style={{height:105,width:'auto',objectFit:'contain',marginBottom:16}}/>
          <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase'}}>Join the network</div>
        </div>

        <div style={{background:s.bg2,border:`1px solid ${s.border}`,padding:36}}>
          <h2 style={{fontSize:22,color:s.gold,fontWeight:600,marginBottom:4}}>Apply for membership</h2>
          <p style={{fontSize:13,color:s.muted,marginBottom:28}}>Verified real estate professionals only. Free for 3 months.</p>

          <form onSubmit={handleSubmit(onSubmit)} style={{display:'flex',flexDirection:'column',gap:20}}>
            
            {/* Personal details */}
            <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:24}}>
              <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>Personal details</div>
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                  <div>
                    <label style={lab}>First name *</label>
                    <input {...register('firstName')} type="text" placeholder="Jane" style={errors.firstName?errorInput:input}/>
                    {errors.firstName&&<div style={errMsg}>⚠ {errors.firstName.message}</div>}
                  </div>
                  <div>
                    <label style={lab}>Last name *</label>
                    <input {...register('lastName')} type="text" placeholder="Smith" style={errors.lastName?errorInput:input}/>
                    {errors.lastName&&<div style={errMsg}>⚠ {errors.lastName.message}</div>}
                  </div>
                </div>
                <div>
                  <label style={lab}>Email address *</label>
                  <input {...register('email')} type="email" placeholder="jane@smithproperty.com.au" style={errors.email?errorInput:input}/>
                  {errors.email&&<div style={errMsg}>⚠ {errors.email.message}</div>}
                </div>
                <div>
                  <label style={lab}>Mobile number *</label>
                  <input {...register('mobile')} type="tel" placeholder="04XX XXX XXX" style={errors.mobile?errorInput:input}/>
                  {errors.mobile&&<div style={errMsg}>⚠ {errors.mobile.message}</div>}
                </div>
              </div>
            </div>

            {/* Professional details */}
            <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:24}}>
              <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>Professional details</div>
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                <div>
                  <label style={lab}>Agency name *</label>
                  <input {...register('agency')} type="text" placeholder="Smith Property Group" style={errors.agency?errorInput:input}/>
                  {errors.agency&&<div style={errMsg}>⚠ {errors.agency.message}</div>}
                </div>
                <div>
                  <label style={lab}>Real estate license number *</label>
                  <input {...register('licenseNumber')} type="text" placeholder="e.g. QLD-1234567" autoComplete="off" maxLength={20}
                    onChange={e => setValue('licenseNumber', e.target.value.toUpperCase())}
                    style={errors.licenseNumber?errorInput:input}/>
                  {errors.licenseNumber&&<div style={errMsg}>⚠ {errors.licenseNumber.message}</div>}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                  <div>
                    <label style={lab}>I am a</label>
                    <select {...register('role')} onChange={handleRoleChange} style={{...input,padding:'12px 14px'}}>
                      <option>Selling Agent</option>
                      <option>Buyers Agent</option>
                      <option>Both</option>
                    </select>
                  </div>
                  <div>
                    <label style={lab}>State</label>
                    <select {...register('state')} style={{...input,padding:'12px 14px'}}>
                      <option>QLD</option><option>NSW</option><option>VIC</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan */}
            <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:24}}>
              <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>Choose your plan</div>
              {watchRole === 'Buyers Agent' || watchRole === 'Both' ? (
                <div>
                  <label style={{display:'flex',alignItems:'center',gap:12,padding:'16px',background:s.bg2,border:`1px solid ${s.gold}`,cursor:'pointer'}}>
                    <input type="radio" value="Buyers Agent" {...register('plan')} style={{accentColor:s.gold}} defaultChecked/>
                    <div>
                      <div style={{fontSize:14,color:s.gold,fontWeight:600}}>{watchRole === 'Both' ? 'Buyers & Selling Agent Plan' : 'Buyers Agent Plan'}</div>
                      <div style={{fontSize:12,color:s.muted,marginTop:2}}>$69/month — Browse all listings, save, enquire, message agents{watchRole === 'Both' ? ' + 1 free listing per month' : ''}</div>
                    </div>
                  </label>
                  <div style={{background:'rgba(201,168,76,0.06)',border:`1px solid rgba(201,168,76,0.2)`,padding:'12px 16px',marginTop:8}}>
                    <div style={{fontSize:11,color:s.gold}}>✓ Browse all off market listings</div>
                    <div style={{fontSize:11,color:s.gold,marginTop:4}}>✓ Save listings & favourite agents</div>
                    <div style={{fontSize:11,color:s.gold,marginTop:4}}>✓ Send enquiries & direct messaging</div>
                    {watchRole === 'Both' && <div style={{fontSize:11,color:s.gold,marginTop:4}}>✓ 1 free listing per month included</div>}
                    <div style={{fontSize:11,color:s.gold,marginTop:4}}>✓ 3 months free — no credit card required</div>
                  </div>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <div style={{fontSize:11,color:s.muted,marginBottom:4}}>Select your selling agent plan:</div>
                  {[
                    ['Silver','$39/month','1 listing per month','Silver'],
                    ['Gold','$79/month','5 listings per month — Most popular','Gold'],
                    ['Platinum','POA','Principal agents with 5+ agents','Platinum'],
                  ].map(([label,price,desc,val])=>(
                    <label key={val} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:s.bg2,border:`1px solid ${s.border}`,cursor:'pointer'}}>
                      <input type="radio" value={val} {...register('plan')} style={{accentColor:s.gold}}/>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <div style={{fontSize:13,color:s.gold,fontWeight:600}}>{label}</div>
                          <div style={{fontSize:13,color:s.mid,fontWeight:600}}>{price}</div>
                        </div>
                        <div style={{fontSize:11,color:s.muted,marginTop:2}}>{desc}</div>
                      </div>
                    </label>
                  ))}
                  <div style={{fontSize:11,color:s.muted,marginTop:4}}>✓ All plans include 3 months free — no credit card required</div>
                </div>
              )}
            </div>

            {/* Account */}
            <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:24}}>
              <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:16}}>Account details</div>
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                <div>
                  <label style={lab}>Choose a username *</label>
                  <div style={{position:'relative'}}>
                    <input {...register('username')} type="text" placeholder="janesmith" autoComplete="new-password"
                      onChange={e => { setValue('username', e.target.value.toLowerCase()); checkUsername(e.target.value) }}
                      style={errors.username?errorInput:input}/>
                    {usernameAvailable===true&&<span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'#4CAF50',fontSize:12}}>✓ Available</span>}
                    {usernameAvailable===false&&<span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:s.error,fontSize:12}}>✗ Taken</span>}
                  </div>
                  {errors.username&&<div style={errMsg}>⚠ {errors.username.message}</div>}
                </div>
                <div>
                  <label style={lab}>Password *</label>
                  <input {...register('password')} type="password" placeholder="Min. 8 characters" autoComplete="new-password" style={errors.password?errorInput:input}/>
                  {errors.password&&<div style={errMsg}>⚠ {errors.password.message}</div>}
                </div>
              </div>
            </div>

            <div style={{fontSize:11,color:s.muted,lineHeight:1.6,textAlign:'center'}}>
              By applying you agree to our <Link href="/terms" style={{color:s.gold,textDecoration:'none'}}>Terms of Use</Link> and <Link href="/privacy" style={{color:s.gold,textDecoration:'none'}}>Privacy Policy</Link>. All applications are subject to license verification.
            </div>

            <button type="submit" disabled={loading} style={{background:loading?'#5a4a1f':s.gold,border:'none',color:'#fff',fontSize:15,fontWeight:600,padding:16,cursor:loading?'not-allowed':'pointer',opacity:loading?0.8:1}}>
              {loading?'Submitting application...':'Submit application →'}
            </button>

            <div style={{textAlign:'center',fontSize:13,color:s.muted}}>
              Already a member? <Link href="/login" style={{color:s.gold,textDecoration:'none'}}>Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
