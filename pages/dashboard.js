import Nav from '../components/Nav'

const metrics=[{label:'Active listings',val:'7',sub:'+2 this month'},{label:'Total enquiries',val:'34',sub:'+6 this week'},{label:'Connections made',val:'18',sub:'↑ from 12 last month'},{label:'Off market sold',val:'24',sub:'Career total'}]
const mylistings=[
  {suburb:'Hope Island · QLD',title:'Prestige waterfront opportunity',status:'Active',enquiries:11,img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=120&q=80'},
  {suburb:'Burleigh Heads · QLD',title:'Boutique coastal apartment',status:'Active',enquiries:7,img:'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=120&q=80'},
  {suburb:'Noosa Heads · QLD',title:'Hinterland estate, discreet listing',status:'Pending',enquiries:3,img:null},
]
const enquiries=[{name:'Marcus Kline',agency:'Kline Buyers Agency · Sydney',re:'Re: Hope Island waterfront',time:'2 hrs ago'},{name:'Lena Nguyen',agency:'Nguyen Buyers Agency · Brisbane',re:'Re: Burleigh coastal apt',time:'Yesterday'}]

const gold = '#C9A84C'
const black = '#0A0A0A'
const black2 = '#111111'
const black3 = '#1A1A1A'
const black4 = '#242424'
const white = '#F5F3EE'
const muted = '#7A7A7A'
const border = '#2A2A2A'
const silver = '#A8AEBB'

export default function Dashboard() {
  return (
    <div style={{background:black,minHeight:'100vh'}}>
      <Nav/>
      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 64px)'}}>
        <aside style={{background:black2,borderRight:'1px solid #2A2A2A',padding:'24px 0'}}>
          {[{section:'Dashboard',items:['Overview','My listings','Browse feed','Saved']},{section:'Connections',items:['Enquiries','Messages','Agents']},{section:'Account',items:['My profile','Subscription','Settings']}].map((g,gi)=>(
            <div key={g.section} style={{paddingBottom:24,marginBottom:24,borderBottom:'1px solid #2A2A2A'}}>
              <div style={{fontSize:9,letterSpacing:'0.35em',color:gold,textTransform:'uppercase',padding:'0 20px',marginBottom:10}}>{g.section}</div>
              {g.items.map((item,i)=>{
                const isActive = gi===0 && i===0
                return (
                  <div key={item} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 20px',fontSize:13,color:isActive?white:muted,cursor:'pointer',background:isActive?'rgba(201,168,76,0.05)':'none',borderLeft:isActive?'2px solid #C9A84C':'2px solid transparent'}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:isActive?gold:border,flexShrink:0}}/>
                    {item}
                  </div>
                )
              })}
            </div>
          ))}
        </aside>
        <main style={{padding:32}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
            <div>
              <div style={{fontSize:10,letterSpacing:'0.4em',color:gold,textTransform:'uppercase',marginBottom:4}}>Member dashboard</div>
              <h2 style={{fontSize:22,color:white,fontWeight:600}}>Good morning, Sarah</h2>
            </div>
            <button style={{background:gold,border:'none',color:'#000',fontSize:13,fontWeight:500,padding:'8px 20px',cursor:'pointer'}}>+ New Listing</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
            {metrics.map(m=>(
              <div key={m.label} style={{background:black3,border:'1px solid #2A2A2A',padding:20}}>
                <div style={{fontSize:10,letterSpacing:'0.25em',color:muted,textTransform:'uppercase',marginBottom:8}}>{m.label}</div>
                <div style={{fontSize:28,color:white,fontWeight:600}}>{m.val}</div>
                <div style={{fontSize:11,color:gold,marginTop:4}}>{m.sub}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <h3 style={{fontSize:16,color:white,fontWeight:600}}>My active listings</h3>
            <button style={{background:'none',border:'1px solid #2A2A2A',color:'#D4D8DF',fontSize:12,padding:'6px 14px',cursor:'pointer'}}>View all</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:1,background:border,marginBottom:28}}>
            {mylistings.map(l=>(
              <div key={l.title} style={{background:black2,display:'grid',gridTemplateColumns:'56px 1fr auto auto',gap:16,alignItems:'center',padding:16}}>
                {l.img?<img src={l.img} alt={l.title} style={{width:56,height:40,objectFit:'cover',opacity:0.7}}/>:<div style={{width:56,height:40,background:black4,border:'1px solid #2A2A2A',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:muted}}>No img</div>}
                <div>
                  <div style={{fontSize:9,letterSpacing:'0.25em',color:gold,textTransform:'uppercase',marginBottom:3}}>{l.suburb}</div>
                  <div style={{fontSize:13,color:white}}>{l.title}</div>
                </div>
                <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',padding:'3px 10px',border:'1px solid',color:l.status==='Active'?gold:silver,borderColor:l.status==='Active'?'#8A6A1F':border}}>{l.status}</div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:18,color:white,fontWeight:600}}>{l.enquiries}</div>
                  <div style={{fontSize:10,color:muted}}>enquiries</div>
                </div>
              </div>
            ))}
          </div>
          <h3 style={{fontSize:16,color:white,fontWeight:600,marginBottom:16}}>Recent enquiries</h3>
          <div style={{display:'flex',flexDirection:'column',gap:1,background:border}}>
            {enquiries.map(e=>(
              <div key={e.name} style={{background:black2,display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:16,alignItems:'center',padding:'14px 16px'}}>
                <div>
                  <div style={{fontSize:13,color:white}}>{e.name}</div>
                  <div style={{fontSize:11,color:muted}}>{e.agency}</div>
                </div>
                <div style={{fontSize:12,color:muted}}>{e.re}</div>
                <div style={{fontSize:10,color:gold}}>{e.time}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
