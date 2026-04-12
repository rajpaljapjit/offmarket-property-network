import toast from 'react-hot-toast'
import Nav from '../../components/Nav'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const s={gold:'#FFD166',bg:'#0D0A1A',bg3:'#1A1638',bg4:'#221E46',white:'#FFFFFF',muted:'#8888BB',border:'rgba(155,109,255,0.15)',error:'#FF9500'}

export default function ChangePassword() {
  const router = useRouter()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })

  const input = {background:s.bg3,border:`1px solid ${s.border}`,color:s.white,fontSize:14,padding:'12px 14px',width:'100%',boxSizing:'border-box'}
  const lab = {fontSize:11,letterSpacing:'0.2em',color:s.muted,textTransform:'uppercase',marginBottom:6,display:'block'}

  useEffect(() => {
    const stored = localStorage.getItem('member')
    if (!stored) { router.push('/login'); return }
    setMember(JSON.parse(stored))
  }, [])

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value})

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (form.newPassword.length < 8) { setError('New password must be at least 8 characters.'); return }
    if (form.newPassword !== form.confirmPassword) { setError('New passwords do not match.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          memberId: member.id,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error||'Something went wrong.') }
      else { toast.success('Password changed successfully!'); setForm({currentPassword:'',newPassword:'',confirmPassword:''}) }
    } catch { toast.error('Something went wrong. Please try again.') }
    setLoading(false)
  }

  if (!member) return <div style={{background:s.bg,minHeight:'100vh'}}></div>

  return (
    <div style={{background:s.bg,minHeight:'100vh',color:s.white}}>
      <Nav/>
      <div style={{maxWidth:500,margin:'0 auto',padding:'48px 20px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Account</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
          <h1 style={{fontSize:'clamp(22px,4vw,32px)',color:s.white,fontWeight:600}}>Change password</h1>
          <button onClick={()=>router.push('/dashboard')} style={{background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:13,padding:'8px 16px',cursor:'pointer'}}>← Back</button>
        </div>

        {error&&<div style={{background:'rgba(255,149,0,0.08)',border:'1px solid rgba(255,149,0,0.25)',padding:'12px 16px',marginBottom:24,fontSize:13,color:s.error,borderRadius:2}}>{error}</div>}
        {success&&<div style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',padding:'12px 16px',marginBottom:24,fontSize:13,color:s.gold,borderRadius:2}}>{success}</div>}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:s.bg3,border:`1px solid ${s.border}`,padding:28,display:'flex',flexDirection:'column',gap:16}}>
            <div style={{fontSize:10,letterSpacing:'0.3em',color:s.gold,textTransform:'uppercase',marginBottom:4}}>Update your password</div>
            <div>
              <label style={lab}>Current password *</label>
              <input name="currentPassword" value={form.currentPassword} onChange={handleChange} type="password" placeholder="Your current password" style={input} required/>
            </div>
            <div>
              <label style={lab}>New password *</label>
              <input name="newPassword" value={form.newPassword} onChange={handleChange} type="password" placeholder="Min. 8 characters" style={input} required/>
            </div>
            <div>
              <label style={lab}>Confirm new password *</label>
              <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" placeholder="Repeat new password" style={input} required/>
            </div>
          </div>
          <div style={{display:'flex',gap:12}}>
            <button type="button" onClick={()=>router.push('/dashboard')} style={{flex:1,background:'none',border:`1px solid ${s.border}`,color:s.muted,fontSize:14,padding:14,cursor:'pointer'}}>Cancel</button>
            <button type="submit" disabled={loading} style={{flex:2,background:loading?'rgba(155,109,255,0.5)':s.gold,border:'none',color:'#fff',fontSize:15,fontWeight:600,padding:14,cursor:loading?'not-allowed':'pointer',opacity:loading?0.8:1}}>
              {loading?'Updating...':'Change password →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
