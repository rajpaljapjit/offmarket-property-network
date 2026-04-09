import Nav from '../components/Nav'
import Footer from '../components/Footer'

const s={gold:'#C9A84C',bg:'#1B2A1B',bg2:'#162016',bg3:'#1F2E1F',white:'#C9A84C',muted:'#8BA888',mid:'#E8E8E8',border:'#2D4A2D'}

export default function Privacy() {
  return (
    <div style={{background:s.bg,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      <div style={{maxWidth:800,margin:'0 auto',padding:'60px 20px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Legal</div>
        <h1 style={{fontSize:'clamp(28px,5vw,40px)',color:s.white,marginBottom:8,fontWeight:600}}>Privacy policy</h1>
        <p style={{color:s.muted,marginBottom:48}}>Last updated: April 2026</p>

        {[
          {title:'1. Introduction',body:`Off Market Property Network ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store and disclose your personal information when you use our Platform. By using the Platform, you consent to the practices described in this policy.`},
          {title:'2. Information we collect',body:`We collect information you provide when applying for membership, including your name, email address, mobile number, agency name, real estate license number, role and state. We also collect information about your activity on the Platform, including listings you upload, enquiries you make and messages you send.`},
          {title:'3. How we use your information',body:`We use your personal information to verify your identity and license, to provide and improve the Platform, to communicate with you about your account and membership, to send you notifications about enquiries and listings, and to comply with legal obligations.`},
          {title:'4. License verification',body:`As part of the membership process, we verify your real estate license against state-based regulatory registers. This verification process requires us to share limited information with those registers for verification purposes only.`},
          {title:'5. Sharing your information',body:`We do not sell your personal information to third parties. We may share your information with other verified members as part of the normal operation of the Platform (for example, your name and agency are visible to other members when you list a property or make an enquiry). We may also share information with service providers who assist us in operating the Platform, including our database provider and email service provider.`},
          {title:'6. Data storage and security',body:`Your information is stored securely using industry-standard encryption. We use Supabase for database storage, which is hosted on secure cloud infrastructure. We take reasonable steps to protect your personal information from unauthorised access, disclosure or misuse.`},
          {title:'7. Cookies',body:`We may use cookies and similar technologies to improve your experience on the Platform. You can control cookies through your browser settings, but disabling cookies may affect the functionality of the Platform.`},
          {title:'8. Your rights',body:`You have the right to access, correct or delete your personal information. You may also request that we restrict the processing of your information. To exercise these rights, please contact us at privacy@offmarketpropertynetwork.com.au. We will respond to your request within 30 days.`},
          {title:'9. Retention',body:`We retain your personal information for as long as your account is active or as needed to provide you with our services. If you close your account, we may retain certain information as required by law or for legitimate business purposes.`},
          {title:'10. Changes to this policy',body:`We may update this Privacy Policy from time to time. We will notify you of any material changes by email or by posting a notice on the Platform. Your continued use of the Platform after any changes constitutes your acceptance of the updated policy.`},
          {title:'11. Contact us',body:`If you have any questions about this Privacy Policy or how we handle your personal information, please contact us at privacy@offmarketpropertynetwork.com.au`},
        ].map(section=>(
          <div key={section.title} style={{marginBottom:40}}>
            <h2 style={{fontSize:18,color:s.gold,marginBottom:12,fontWeight:600}}>{section.title}</h2>
            <p style={{fontSize:14,color:s.mid,lineHeight:1.8}}>{section.body}</p>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  )
}
