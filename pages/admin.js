import { format } from 'date-fns'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area, CartesianGrid,
} from 'recharts'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const c = {
  bg:         '#0D0A1A',
  bg2:        '#13102A',
  bg3:        '#1A1638',
  bg4:        '#221E46',
  gold:       '#FFD166',
  goldDim:    'rgba(255,209,102,0.1)',
  violet:     '#9B6DFF',
  violetDim:  'rgba(155,109,255,0.12)',
  emerald:    '#00E5A0',
  emeraldDim: 'rgba(0,229,160,0.1)',
  amber:      '#FF9500',
  white:      '#FFFFFF',
  cream:      '#D4CFFF',
  muted:      '#8888BB',
  border:     'rgba(155,109,255,0.15)',
  borderGold: 'rgba(255,209,102,0.2)',
}

const CHART_TOOLTIP = { background: c.bg3, border: `1px solid ${c.border}`, color: c.gold, borderRadius: 8, fontSize: 12 }
const ADMIN_USERNAME = 'ompnadminlogin'
const SB_URL = 'https://jmjtcmfjknmdnlgxudfk.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanRjbWZqa25tZG5sZ3h1ZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NzAyMSwiZXhwIjoyMDkwOTMzMDIxfQ.EUTszvE0OEN7mD5XvzRIr9NQJhdXVzKGlPNnG__ksuo'

// ── helpers ──────────────────��───────────────────────────
const groupBy = (arr, key) =>
  arr.reduce((acc, item) => { acc[item[key]] = (acc[item[key]] || 0) + 1; return acc }, {})

const toChartData = (obj) => Object.entries(obj).map(([name, value]) => ({ name, value }))

const StatusBadge = ({ status }) => {
  const map = {
    active:    { color: c.emerald, bg: c.emeraldDim, border: 'rgba(0,229,160,0.25)' },
    pending:   { color: c.gold,    bg: c.goldDim,    border: c.borderGold },
    suspended: { color: c.amber,   bg: 'rgba(255,149,0,0.1)', border: 'rgba(255,149,0,0.25)' },
    rejected:  { color: c.muted,   bg: c.violetDim,  border: c.border },
  }
  const st = map[status] || map.rejected
  return (
    <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20, color: st.color, background: st.bg, border: `1px solid ${st.border}`, fontWeight: 600 }}>
      {status}
    </span>
  )
}

const StatCard = ({ label, value, color, sub, icon }) => (
  <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 14, padding: '22px 24px', borderTop: `3px solid ${color}`, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 24, opacity: 0.15 }}>{icon}</div>
    <div style={{ fontSize: 10, letterSpacing: '0.2em', color: c.muted, textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
    <div style={{ fontSize: 38, fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: c.muted, marginTop: 8 }}>{sub}</div>}
  </div>
)

const ChartCard = ({ title, children, span }) => (
  <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 14, padding: '24px', gridColumn: span ? `span ${span}` : undefined }}>
    <div style={{ fontSize: 10, letterSpacing: '0.25em', color: c.gold, textTransform: 'uppercase', marginBottom: 20, fontWeight: 600 }}>{title}</div>
    {children}
  </div>
)

// ── main ───────────────────��─────────────────────────────
export default function Admin() {
  const router = useRouter()
  const [ready, setReady]         = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')
  const [members, setMembers]     = useState([])
  const [listings, setListings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [member, setMember]       = useState(null)
  const [viewMember, setViewMember] = useState(null)
  const [memberSearch, setMemberSearch] = useState('')
  const [listingSearch, setListingSearch] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('member')
    const adminAuth = localStorage.getItem('adminAuth')
    if (!stored || !adminAuth) { router.push('/admin-login'); return }
    const m = JSON.parse(stored)
    if (m.username !== ADMIN_USERNAME) { router.push('/admin-login'); return }
    setMember(m); setReady(true)
  }, [])

  useEffect(() => { if (ready) fetchAll() }, [ready])

  const getSupabase = async () => {
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(SB_URL, SB_KEY)
  }

  const fetchAll = async () => {
    setLoading(true)
    try {
      const db = await getSupabase()
      const [mRes, lRes] = await Promise.all([
        db.from('members').select('*').neq('username', ADMIN_USERNAME),
        db.from('listings').select('*'),
      ])
      setMembers(mRes.data || [])
      setListings(lRes.data || [])
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const updateMemberStatus = async (id, status) => {
    try {
      await fetch('/api/approve-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: id, status }),
      })
    } catch (e) { console.error(e) }
    await fetchAll()
  }

  const deleteMember = async (id) => {
    if (!confirm('Delete this member? This cannot be undone.')) return
    const db = await getSupabase()
    await db.from('members').delete().eq('id', id)
    await fetchAll()
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('member')
    router.push('/admin-login')
  }

  if (!ready) return (
    <div style={{ background: c.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${c.border}`, borderTopColor: c.violet, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // derived stats
  const pending   = members.filter(m => m.status === 'pending')
  const active    = members.filter(m => m.status === 'active')
  const suspended = members.filter(m => m.status === 'suspended')
  const activeListings = listings.filter(l => l.status === 'active')

  const tabs = ['Overview', 'Pending', 'Active', 'All Members', 'Listings', 'Analytics']

  // chart data
  const membersByState  = toChartData(groupBy(members, 'state')).sort((a,b) => b.value - a.value)
  const membersByPlan   = toChartData(groupBy(members, 'plan'))
  const membersByRole   = toChartData(groupBy(members, 'role'))
  const membersByStatus = toChartData(groupBy(members, 'status'))
  const listingsByState = toChartData(groupBy(listings, 'state')).sort((a,b) => b.value - a.value)
  const listingsByType  = toChartData(groupBy(listings, 'property_type')).sort((a,b) => b.value - a.value)

  // member growth (group by month joined)
  const growthMap = members.reduce((acc, m) => {
    if (!m.trial_start) return acc
    const month = format(new Date(m.trial_start), 'MMM yy')
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})
  const memberGrowth = Object.entries(growthMap).map(([name, value]) => ({ name, value }))

  const PIE_COLORS = [c.violet, c.gold, c.emerald, c.amber, '#A78BFA', '#34D399']

  const filteredMembers  = members.filter(m => {
    const q = memberSearch.toLowerCase()
    return !q || `${m.first_name} ${m.last_name} ${m.email} ${m.agency} ${m.username}`.toLowerCase().includes(q)
  })
  const filteredListings = listings.filter(l => {
    const q = listingSearch.toLowerCase()
    return !q || `${l.title} ${l.suburb} ${l.state}`.toLowerCase().includes(q)
  })

  // ── Member row ────────────────────────────
  const MemberRow = ({ m, idx }) => (
    <tr style={{ background: idx % 2 === 0 ? c.bg2 : c.bg3, borderBottom: `1px solid ${c.border}` }}>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.violetDim, border: `1px solid rgba(155,109,255,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: c.violet, flexShrink: 0 }}>
            {m.first_name?.[0]}{m.last_name?.[0]}
          </div>
          <div>
            <div style={{ fontSize: 13, color: c.white, fontWeight: 600 }}>{m.first_name} {m.last_name}</div>
            <div style={{ fontSize: 11, color: c.muted }}>@{m.username}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 12, color: c.cream }}>{m.email}</div>
        {m.mobile && <div style={{ fontSize: 11, color: c.muted }}>{m.mobile}</div>}
      </td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 12, color: c.cream }}>{m.agency}</div>
        <div style={{ fontSize: 11, color: c.muted }}>{m.role} · {m.state}</div>
      </td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>{m.license_number}</div>
        <span style={{ fontSize: 11, color: c.gold, background: c.goldDim, padding: '2px 8px', borderRadius: 4 }}>{m.plan}</span>
      </td>
      <td style={{ padding: '14px 16px' }}><StatusBadge status={m.status} /></td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => setViewMember(m)} style={{ ...btnStyle, background: c.violetDim, color: c.violet, border: `1px solid rgba(155,109,255,0.25)` }}>View</button>
          {m.status === 'pending' && <>
            <button onClick={() => updateMemberStatus(m.id, 'active')}   style={{ ...btnStyle, background: c.emeraldDim, color: c.emerald, border: '1px solid rgba(0,229,160,0.25)' }}>✓ Approve</button>
            <button onClick={() => updateMemberStatus(m.id, 'rejected')} style={{ ...btnStyle, background: 'rgba(255,149,0,0.1)', color: c.amber, border: '1px solid rgba(255,149,0,0.25)' }}>✗ Reject</button>
          </>}
          {m.status === 'active' && <button onClick={() => updateMemberStatus(m.id, 'suspended')} style={{ ...btnStyle, background: 'rgba(255,149,0,0.1)', color: c.amber, border: '1px solid rgba(255,149,0,0.25)' }}>Suspend</button>}
          {m.status === 'suspended' && <button onClick={() => updateMemberStatus(m.id, 'active')} style={{ ...btnStyle, background: c.emeraldDim, color: c.emerald, border: '1px solid rgba(0,229,160,0.25)' }}>Reinstate</button>}
          <button onClick={() => deleteMember(m.id)} style={{ ...btnStyle, background: 'rgba(255,149,0,0.08)', color: c.amber, border: '1px solid rgba(255,149,0,0.15)' }}>Delete</button>
        </div>
      </td>
    </tr>
  )

  const renderMemberTable = (list, emptyMsg) => (
    list.length === 0 ? (
      <div style={{ padding: 60, textAlign: 'center', color: c.muted, fontSize: 14 }}>{emptyMsg}</div>
    ) : (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: c.bg3, borderBottom: `1px solid ${c.border}` }}>
              {['Member', 'Contact', 'Agency', 'License / Plan', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontSize: 10, letterSpacing: '0.15em', color: c.muted, textTransform: 'uppercase', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((m, i) => <MemberRow key={m.id} m={m} idx={i} />)}
          </tbody>
        </table>
      </div>
    )
  )

  return (
    <div style={{ background: c.bg, minHeight: '100vh', color: c.white }}>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        @media(max-width:768px) {
          .stat-grid { grid-template-columns:1fr 1fr !important; }
          .chart-grid { grid-template-columns:1fr !important; }
          .admin-tabs { overflow-x:auto; white-space:nowrap; }
        }
      `}</style>

      {/* ── TOP BAR ──────────────────────────────── */}
      <div style={{ background: c.bg2, borderBottom: `1px solid ${c.border}`, padding: '0 24px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src="/gooffmarketlogo-transparent.png" alt="OMPN" style={{ height: 52 }} />
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.25em', color: c.gold, textTransform: 'uppercase', fontWeight: 600 }}>Admin Panel</div>
              <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>Network management</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: c.muted }}>
              Logged in as <span style={{ color: c.violet }}>@{member?.username}</span>
            </div>
            <button onClick={handleLogout} style={{ ...btnStyle, border: `1px solid ${c.border}`, color: c.muted, background: c.violetDim }}>Sign out</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── PAGE TITLE ───────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, color: c.white, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Network overview</h1>
          <p style={{ fontSize: 13, color: c.muted }}>Manage members, listings and platform analytics</p>
        </div>

        {/* ── STAT CARDS ──────────────��────────────── */}
        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14, marginBottom: 32 }}>
          <StatCard label="Total members"    value={members.length}         color={c.violet}  icon="👥" sub={`${active.length} active`} />
          <StatCard label="Pending approval" value={pending.length}         color={c.gold}    icon="⏳" sub="Awaiting review" />
          <StatCard label="Active members"   value={active.length}          color={c.emerald} icon="✓"  sub="Verified & live" />
          <StatCard label="Suspended"        value={suspended.length}       color={c.amber}   icon="⚠" sub="Restricted access" />
          <StatCard label="Total listings"   value={listings.length}        color={c.violet}  icon="🏠" sub={`${activeListings.length} active`} />
          <StatCard label="Active listings"  value={activeListings.length}  color={c.emerald} icon="📋" sub="Live on network" />
        </div>

        {/* ── TABS ─────────────────────────────────── */}
        <div className="admin-tabs" style={{ display: 'flex', gap: 4, marginBottom: 24, background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 12, padding: 6 }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: tab === activeTab ? `linear-gradient(135deg, ${c.violet}, ${c.gold})` : 'transparent',
                border: 'none',
                color: tab === activeTab ? '#fff' : c.muted,
                fontSize: 13, fontWeight: tab === activeTab ? 700 : 400,
                padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
              {tab === 'Pending' && pending.length > 0 && (
                <span style={{ background: c.amber, color: '#fff', fontSize: 9, borderRadius: 20, padding: '1px 6px', fontWeight: 800 }}>{pending.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ──────────────────────────── */}
        <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 14, overflow: 'hidden' }}>

          {loading ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ width: 32, height: 32, border: `3px solid ${c.border}`, borderTopColor: c.violet, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <div style={{ color: c.muted, fontSize: 13 }}>Loading data...</div>
            </div>
          ) : activeTab === 'Overview' ? (
            <div style={{ padding: 28 }}>
              {/* Quick summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
                {[
                  { label: 'Pending members', items: pending.slice(0,3), emptyMsg: '🎉 No pending approvals', color: c.gold },
                  { label: 'Recent members', items: [...active].sort((a,b) => new Date(b.trial_start||0) - new Date(a.trial_start||0)).slice(0,3), emptyMsg: 'No active members', color: c.emerald },
                  { label: 'Recent listings', items: [...listings].sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0)).slice(0,3), emptyMsg: 'No listings yet', color: c.violet, isListing: true },
                ].map(({ label, items, emptyMsg, color, isListing }) => (
                  <div key={label} style={{ background: c.bg3, border: `1px solid ${c.border}`, borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${c.border}`, fontSize: 11, letterSpacing: '0.15em', color, textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
                    {items.length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', color: c.muted, fontSize: 13 }}>{emptyMsg}</div>
                    ) : items.map((item, i) => (
                      <div key={item.id} style={{ padding: '12px 18px', borderBottom: i < items.length - 1 ? `1px solid ${c.border}` : 'none' }}>
                        {isListing ? (
                          <>
                            <div style={{ fontSize: 13, color: c.white, fontWeight: 500 }}>{item.title}</div>
                            <div style={{ fontSize: 11, color: c.muted }}>{item.suburb} · {item.state}</div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: 13, color: c.white, fontWeight: 500 }}>{item.first_name} {item.last_name}</div>
                            <div style={{ fontSize: 11, color: c.muted }}>{item.agency} · {item.role}</div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Mini charts on overview */}
              <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <ChartCard title="Member growth over time">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={memberGrowth}>
                      <defs>
                        <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={c.violet} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={c.violet} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(155,109,255,0.08)" />
                      <XAxis dataKey="name" tick={{ fill: c.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: c.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CHART_TOOLTIP} />
                      <Area type="monotone" dataKey="value" stroke={c.violet} strokeWidth={2} fill="url(#gv)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Members by status">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={membersByStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                        {membersByStatus.map((_, i) => (
                          <Cell key={i} fill={[c.emerald, c.gold, c.amber, c.muted][i % 4]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={CHART_TOOLTIP} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: c.muted }} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>
          ) : activeTab === 'Pending' ? (
            <div>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: c.cream }}><span style={{ color: c.gold, fontWeight: 700 }}>{pending.length}</span> pending approval</span>
              </div>
              {renderMemberTable(pending, '🎉 No pending members — all clear!')}
            </div>
          ) : activeTab === 'Active' ? (
            <div>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.border}` }}>
                <input type="text" placeholder="Search active members..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                  style={{ background: c.bg3, border: `1px solid ${c.border}`, color: c.white, fontSize: 13, padding: '8px 14px', borderRadius: 8, outline: 'none', width: 280 }} />
              </div>
              {renderMemberTable(filteredMembers.filter(m => m.status === 'active'), 'No active members yet')}
            </div>
          ) : activeTab === 'All Members' ? (
            <div>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.border}`, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Search all members..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                  style={{ background: c.bg3, border: `1px solid ${c.border}`, color: c.white, fontSize: 13, padding: '8px 14px', borderRadius: 8, outline: 'none', width: 280 }} />
                <span style={{ fontSize: 12, color: c.muted }}>{filteredMembers.length} members</span>
              </div>
              {renderMemberTable(filteredMembers, 'No members yet')}
            </div>
          ) : activeTab === 'Listings' ? (
            <div>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.border}`, display: 'flex', gap: 12, alignItems: 'center' }}>
                <input type="text" placeholder="Search listings..." value={listingSearch} onChange={e => setListingSearch(e.target.value)}
                  style={{ background: c.bg3, border: `1px solid ${c.border}`, color: c.white, fontSize: 13, padding: '8px 14px', borderRadius: 8, outline: 'none', width: 280 }} />
                <span style={{ fontSize: 12, color: c.muted }}>{filteredListings.length} listings</span>
              </div>
              {filteredListings.length === 0 ? (
                <div style={{ padding: 60, textAlign: 'center', color: c.muted }}>No listings yet</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: c.bg3, borderBottom: `1px solid ${c.border}` }}>
                        {['Photo', 'Title', 'Location', 'Type / Price', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', fontSize: 10, letterSpacing: '0.15em', color: c.muted, textTransform: 'uppercase', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredListings.map((l, i) => (
                        <tr key={l.id} style={{ background: i % 2 === 0 ? c.bg2 : c.bg3, borderBottom: `1px solid ${c.border}` }}>
                          <td style={{ padding: '12px 16px' }}>
                            {l.images && l.images[0]
                              ? <img src={l.images[0]} alt={l.title} style={{ width: 72, height: 50, objectFit: 'cover', borderRadius: 6, display: 'block' }} />
                              : <div style={{ width: 72, height: 50, background: c.bg4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏠</div>}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontSize: 13, color: c.white, fontWeight: 600, maxWidth: 200 }}>{l.title}</div>
                            <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>{l.created_at ? format(new Date(l.created_at), 'dd MMM yyyy') : '—'}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontSize: 13, color: c.cream }}>{l.suburb}</div>
                            <div style={{ fontSize: 11, color: c.muted }}>{l.state} {l.postcode}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontSize: 12, color: c.violet }}>{l.property_type}</div>
                            {l.price_guide && <div style={{ fontSize: 13, color: c.gold, fontWeight: 700, marginTop: 2 }}>{l.price_guide}</div>}
                          </td>
                          <td style={{ padding: '12px 16px' }}><StatusBadge status={l.status} /></td>
                          <td style={{ padding: '12px 16px' }}>
                            <Link href={`/listings/${l.id}`} style={{ ...btnStyle, background: c.violetDim, color: c.violet, border: `1px solid rgba(155,109,255,0.25)`, textDecoration: 'none', display: 'inline-block' }}>View →</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'Analytics' ? (
            <div style={{ padding: 28 }}>
              <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* Members by State */}
                <ChartCard title="Members by state">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={membersByState} layout="vertical" margin={{ left: 10 }}>
                      <XAxis type="number" tick={{ fill: c.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: c.cream, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                      <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: c.violetDim }} />
                      <Bar dataKey="value" fill={c.violet} radius={[0, 6, 6, 0]} maxBarSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Members by Plan */}
                <ChartCard title="Members by plan">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={membersByPlan} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                        {membersByPlan.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={CHART_TOOLTIP} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: c.muted }} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Members by Role */}
                <ChartCard title="Members by role">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={membersByRole}>
                      <CartesianGrid stroke="rgba(155,109,255,0.06)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: c.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: c.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: c.goldDim }} />
                      <Bar dataKey="value" fill={c.gold} radius={[6, 6, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Listings by State */}
                <ChartCard title="Listings by state">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={listingsByState}>
                      <CartesianGrid stroke="rgba(155,109,255,0.06)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: c.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: c.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: c.emeraldDim }} />
                      <Bar dataKey="value" fill={c.emerald} radius={[6, 6, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Listings by Type */}
                <ChartCard title="Listings by property type">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={listingsByType} layout="vertical" margin={{ left: 10 }}>
                      <XAxis type="number" tick={{ fill: c.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: c.cream, fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: c.violetDim }} />
                      <Bar dataKey="value" fill={c.violet} radius={[0, 6, 6, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Member growth */}
                <ChartCard title="Member signups over time">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={memberGrowth}>
                      <defs>
                        <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={c.emerald} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={c.emerald} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(155,109,255,0.06)" />
                      <XAxis dataKey="name" tick={{ fill: c.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: c.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CHART_TOOLTIP} />
                      <Area type="monotone" dataKey="value" stroke={c.emerald} strokeWidth={2} fill="url(#ge)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── MEMBER DETAIL MODAL ───────────────��──── */}
      {viewMember && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}
          onClick={() => setViewMember(null)}
        >
          <div
            style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 16, padding: 32, maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.25em', color: c.gold, textTransform: 'uppercase', marginBottom: 4 }}>Member profile</div>
                <h2 style={{ fontSize: 22, color: c.white, fontWeight: 700 }}>{viewMember.first_name} {viewMember.last_name}</h2>
                <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>@{viewMember.username}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <button onClick={() => setViewMember(null)} style={{ background: c.violetDim, border: `1px solid ${c.border}`, color: c.muted, fontSize: 16, cursor: 'pointer', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                <StatusBadge status={viewMember.status} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
              {[
                ['Full name', `${viewMember.first_name} ${viewMember.last_name}`],
                ['Email', viewMember.email],
                ['Mobile', viewMember.mobile || 'Not provided'],
                ['Agency', viewMember.agency],
                ['Role', viewMember.role],
                ['State', viewMember.state],
                ['License number', viewMember.license_number],
                ['Plan', viewMember.plan],
                ['Joined', viewMember.trial_start ? format(new Date(viewMember.trial_start), 'dd MMM yyyy') : 'N/A'],
              ].map(([label, value], i) => (
                <div key={label} style={{ background: i % 2 === 0 ? c.bg3 : c.bg4, display: 'flex', justifyContent: 'space-between', padding: '12px 16px', gap: 20 }}>
                  <span style={{ fontSize: 11, color: c.muted, minWidth: 130, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
                  <span style={{ fontSize: 13, color: c.cream, textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {viewMember.status === 'pending' && <>
                <button onClick={() => { updateMemberStatus(viewMember.id, 'active'); setViewMember(null) }}
                  style={{ flex: 1, background: c.emeraldDim, border: '1px solid rgba(0,229,160,0.3)', color: c.emerald, fontSize: 13, fontWeight: 700, padding: 12, cursor: 'pointer', borderRadius: 8 }}>✓ Approve</button>
                <button onClick={() => { updateMemberStatus(viewMember.id, 'rejected'); setViewMember(null) }}
                  style={{ flex: 1, background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.25)', color: c.amber, fontSize: 13, padding: 12, cursor: 'pointer', borderRadius: 8 }}>✗ Reject</button>
              </>}
              {viewMember.status === 'active' && (
                <button onClick={() => { updateMemberStatus(viewMember.id, 'suspended'); setViewMember(null) }}
                  style={{ flex: 1, background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.25)', color: c.amber, fontSize: 13, padding: 12, cursor: 'pointer', borderRadius: 8 }}>Suspend member</button>
              )}
              {viewMember.status === 'suspended' && (
                <button onClick={() => { updateMemberStatus(viewMember.id, 'active'); setViewMember(null) }}
                  style={{ flex: 1, background: c.emeraldDim, border: '1px solid rgba(0,229,160,0.3)', color: c.emerald, fontSize: 13, fontWeight: 700, padding: 12, cursor: 'pointer', borderRadius: 8 }}>Reinstate</button>
              )}
              <button onClick={() => setViewMember(null)}
                style={{ flex: 1, background: c.violetDim, border: `1px solid ${c.border}`, color: c.muted, fontSize: 13, padding: 12, cursor: 'pointer', borderRadius: 8 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const btnStyle = {
  fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 6,
  cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
}
