import Nav from '../components/Nav'
import Footer from '../components/Footer'

const s={gold:'#FFD166',bg:'#0D0A1A',bg2:'#13102A',bg3:'#1A1638',white:'#FFFFFF',muted:'#8888BB',mid:'#D4CFFF',border:'rgba(155,109,255,0.15)'}

export default function Terms() {
  return (
    <div style={{background:s.bg,color:s.white,minHeight:'100vh'}}>
      <Nav/>
      <div style={{maxWidth:800,margin:'0 auto',padding:'60px 20px'}}>
        <div style={{fontSize:10,letterSpacing:'0.4em',color:s.gold,textTransform:'uppercase',marginBottom:12}}>Legal</div>
        <h1 style={{fontSize:'clamp(28px,5vw,40px)',color:s.white,marginBottom:8,fontWeight:600}}>Terms of use</h1>
        <p style={{color:s.muted,marginBottom:48}}>Last updated: April 2026</p>

        {[
          {title:'1. About Off Market Property Network',body:`Off Market Property Network ("the Platform") is a private, members-only network operated in Australia. It connects licensed real estate selling agents and buyers agents to share and access off market property opportunities. By accessing or using the Platform, you agree to be bound by these Terms of Use.`},
          {title:'2. Eligibility',body:`Membership is exclusively available to licensed real estate professionals. You must hold a current and valid real estate agent or buyers agent license issued by a recognised Australian state or territory regulatory authority. By applying for membership, you confirm that you hold the required license and that all information provided is accurate and truthful.`},
          {title:'3. Membership and verification',body:`All applicants are subject to license verification against state-based regulatory registers. We reserve the right to approve, reject or suspend any membership application or existing membership at our sole discretion. Membership is non-transferable.`},
          {title:'4. Free trial',body:`New members receive a free trial period of 3 months from the date their account is verified. No credit card is required during the trial. After the trial period, continued access requires a paid subscription at the applicable plan rate. We reserve the right to modify or end the free trial offer at any time.`},
          {title:'5. Listings and content',body:`Members are solely responsible for the accuracy, legality and completeness of any listings or content they upload to the Platform. You must not upload false, misleading or fraudulent listings. We reserve the right to remove any listing or content at our sole discretion. By uploading content, you grant Off Market Property Network a non-exclusive licence to display that content on the Platform.`},
          {title:'6. Privacy and confidentiality',body:`All listings on the Platform are private and confidential. Members must not share, reproduce or distribute any listing information outside of the Platform without the express consent of the listing agent. Breach of this obligation may result in immediate suspension or termination of membership.`},
          {title:'7. Prohibited conduct',body:`Members must not use the Platform for any unlawful purpose, to harass or harm other members, to upload false or misleading information, to attempt to gain unauthorised access to the Platform or other members' accounts, or to scrape or copy Platform content without permission.`},
          {title:'8. Limitation of liability',body:`Off Market Property Network is a connection platform only. We are not a party to any property transaction between members. We make no representations or warranties regarding the accuracy of listings or the outcome of any transaction. To the maximum extent permitted by law, we exclude all liability for loss or damage arising from use of the Platform.`},
          {title:'9. Changes to these terms',body:`We may update these Terms of Use at any time. Continued use of the Platform after any changes constitutes your acceptance of the updated terms. We will notify members of material changes via email.`},
          {title:'10. Governing law',body:`These Terms of Use are governed by the laws of Queensland, Australia. Any disputes arising from these terms or your use of the Platform will be subject to the exclusive jurisdiction of the courts of Queensland.`},
          {title:'11. Contact',body:`For any questions regarding these terms, please contact us at legal@offmarketpropertynetwork.com.au`},
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
