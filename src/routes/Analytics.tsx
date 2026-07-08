import { useState } from 'react'

const Icons = {
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  TrendingDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Home: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  XCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  Target: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  PieChart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/>
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  ArrowUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
    </svg>
  ),
}

const monthlyRevenue = [
  { month: 'Jan', revenue: 125000, leads: 45, deals: 3 },
  { month: 'Feb', revenue: 148000, leads: 52, deals: 4 },
  { month: 'Mar', revenue: 165000, leads: 58, deals: 5 },
  { month: 'Apr', revenue: 142000, leads: 48, deals: 4 },
  { month: 'May', revenue: 198000, leads: 65, deals: 6 },
  { month: 'Jun', revenue: 245000, leads: 72, deals: 7 },
]

const agentPerformance = [
  { name: 'Sarah Chen', initials: 'SC', deals: 12, revenue: 3450000, leads: 85, conversion: 14.1, avgDealSize: 287500, rank: 1 },
  { name: 'Alex Kumar', initials: 'AK', deals: 9, revenue: 2180000, leads: 72, conversion: 12.5, avgDealSize: 242222, rank: 2 },
  { name: 'Mike Ross', initials: 'MR', deals: 7, revenue: 1520000, leads: 58, conversion: 12.1, avgDealSize: 217143, rank: 3 },
  { name: 'Lisa Wong', initials: 'LW', deals: 5, revenue: 980000, leads: 42, conversion: 11.9, avgDealSize: 196000, rank: 4 },
]

const leadSources = [
  { source: 'Website', leads: 245, percentage: 34, color: 'var(--color-ochre)' },
  { source: 'Referral', leads: 168, percentage: 23, color: 'var(--color-sage)' },
  { source: 'Social Media', leads: 125, percentage: 17, color: '#3B82F6' },
  { source: 'Google Ads', leads: 89, percentage: 12, color: 'var(--color-terracotta)' },
  { source: 'Email Campaign', leads: 56, percentage: 8, color: '#B8860B' },
  { source: 'Other', leads: 42, percentage: 6, color: 'var(--text-tertiary)' },
]

const propertyTypePerformance = [
  { type: 'Villa', deals: 15, revenue: 4250000, avgPrice: 283333, trend: 'up', change: 12 },
  { type: 'Apartment', deals: 22, revenue: 3120000, avgPrice: 141818, trend: 'up', change: 8 },
  { type: 'Penthouse', deals: 8, revenue: 2890000, avgPrice: 361250, trend: 'up', change: 15 },
  { type: 'Townhouse', deals: 10, revenue: 1850000, avgPrice: 185000, trend: 'down', change: 3 },
  { type: 'Commercial', deals: 4, revenue: 1650000, avgPrice: 412500, trend: 'stable', change: 0 },
]

const kpiTargets = {
  revenueTarget: 2500000,
  revenueAchieved: 1980000,
  dealTarget: 8,
  dealsClosed: 6,
  leadTarget: 80,
  leadsGenerated: 72,
  conversionTarget: 15,
  conversionRate: 12.5,
}

const formatPrice = (price: number) => {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
  if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
  return `$${price}`
}

const formatPercent = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`

type TabId = 'overview' | 'agents' | 'properties' | 'sources' | 'kpi'

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [timeRange, setTimeRange] = useState<'6m' | '12m' | 'all'>('6m')

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: <Icons.BarChart /> },
    { id: 'agents', label: 'Agents', icon: <Icons.Users /> },
    { id: 'properties', label: 'Properties', icon: <Icons.Home /> },
    { id: 'sources', label: 'Sources', icon: <Icons.Globe /> },
    { id: 'kpi', label: 'KPI Targets', icon: <Icons.Target /> },
  ]

  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const totalLeads = monthlyRevenue.reduce((s, m) => s + m.leads, 0)
  const totalDeals = monthlyRevenue.reduce((s, m) => s + m.deals, 0)
  const avgConversion = (totalDeals / totalLeads * 100)

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 30% -10%, rgba(180, 130, 70, 0.03) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 90% 90%, rgba(195, 95, 70, 0.02) 0%, transparent 60%),
          radial-gradient(ellipse 30% 30% at 10% 60%, rgba(110, 140, 100, 0.02) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              Analytics
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0', fontWeight: 500 }}>
              Track performance, revenue, and growth metrics
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'var(--bg-tertiary)', borderRadius: 14,
              border: '1px solid var(--border-secondary)', padding: 3,
              backdropFilter: 'blur(8px)',
            }}>
              {(['6m', '12m', 'all'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={{
                    padding: '8px 14px', borderRadius: 10, border: 'none',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: timeRange === range ? 'var(--bg-secondary)' : 'transparent',
                    color: timeRange === range ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    transition: 'all 0.2s ease',
                    boxShadow: timeRange === range ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  {range === '6m' ? '6 Months' : range === '12m' ? '12 Months' : 'All Time'}
                </button>
              ))}
            </div>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', fontSize: 13, fontWeight: 600,
              color: 'var(--text-secondary)', background: 'var(--bg-secondary)',
              backdropFilter: 'blur(12px)', border: '1px solid var(--border-primary)',
              borderRadius: 14, cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
            }}>
              <Icons.Download /> Export Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', fontSize: 13, fontWeight: 600,
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--border-primary)' : '1px solid transparent',
                borderRadius: 14, cursor: 'pointer',
                backdropFilter: activeTab === tab.id ? 'blur(12px)' : 'none',
                boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Top KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { label: 'Total Revenue', value: formatPrice(totalRevenue), change: '+32%', icon: <Icons.DollarSign />, accent: 'var(--color-ochre)', accentBg: 'rgba(180, 130, 70, 0.08)', positive: true },
                { label: 'Leads Generated', value: totalLeads.toString(), change: '+28%', icon: <Icons.Users />, accent: '#3B82F6', accentBg: 'rgba(59, 130, 246, 0.08)', positive: true },
                { label: 'Deals Closed', value: totalDeals.toString(), change: '+15%', icon: <Icons.CheckCircle />, accent: 'var(--color-sage)', accentBg: 'rgba(110, 140, 100, 0.08)', positive: true },
                { label: 'Conversion Rate', value: `${avgConversion.toFixed(1)}%`, change: '+2.3%', icon: <Icons.Target />, accent: 'var(--color-terracotta)', accentBg: 'rgba(195, 95, 70, 0.08)', positive: true },
              ].map((kpi, idx) => (
                <div key={idx} style={{
                  background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                  borderRadius: 20, padding: 18, border: '1px solid var(--border-primary)',
                  boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderRadius: '0 0 0 100%', background: kpi.accentBg, pointerEvents: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{kpi.label}</span>
                    <span style={{ color: kpi.accent, display: 'flex' }}>{kpi.icon}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>{kpi.value}</p>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600, color: kpi.positive ? 'var(--color-sage)' : '#DC2626' }}>
                      {kpi.positive ? <Icons.TrendingUp /> : <Icons.TrendingDown />} {kpi.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                    Revenue Overview
                  </h3>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>Monthly revenue for the last 6 months</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--color-ochre)' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Revenue</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: '#3B82F6' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Leads</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, height: 220, padding: '10px 0' }}>
                {monthlyRevenue.map((month, idx) => {
                  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue))
                  const maxLeads = Math.max(...monthlyRevenue.map(m => m.leads))
                  const revenueHeight = (month.revenue / maxRevenue) * 100
                  const leadsHeight = (month.leads / maxLeads) * 100
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{formatPrice(month.revenue)}</span>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: '100%', width: '100%', justifyContent: 'center' }}>
                        <div style={{
                          width: 20, height: `${revenueHeight}%`, borderRadius: '6px 6px 0 0',
                          background: 'linear-gradient(180deg, var(--color-ochre), rgba(180, 130, 70, 0.3))',
                          minHeight: 8, transition: 'height 0.6s ease',
                        }} />
                        <div style={{
                          width: 20, height: `${leadsHeight}%`, borderRadius: '6px 6px 0 0',
                          background: 'linear-gradient(180deg, #3B82F6, rgba(59, 130, 246, 0.3))',
                          minHeight: 8, transition: 'height 0.6s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' }}>{month.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div style={{
                background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
                boxShadow: 'var(--shadow-md)',
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icons.Star /> Top Performers
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {agentPerformance.slice(0, 3).map((agent, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 14px', borderRadius: 14,
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: idx === 0 ? 'var(--color-ochre)' : 'var(--color-espresso)',
                        color: idx === 0 ? '#fff' : 'var(--color-ochre)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{agent.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '1px 0 0' }}>{agent.deals} deals · {formatPrice(agent.revenue)}</p>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-sage)' }}>{agent.conversion}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
                boxShadow: 'var(--shadow-md)',
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icons.Activity /> Recent Activity
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { text: 'Deal closed: Luxury Villa — $2.4M', time: '2h ago', type: 'deal' },
                    { text: 'New lead: Emily Davis from Google Ads', time: '4h ago', type: 'lead' },
                    { text: 'Sarah Chen hit $3.4M in revenue', time: '1d ago', type: 'milestone' },
                    { text: '12 new leads this week via website', time: '2d ago', type: 'lead' },
                  ].map((activity, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', borderRadius: 12,
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: activity.type === 'deal' ? 'var(--color-sage)' : activity.type === 'lead' ? '#3B82F6' : 'var(--color-ochre)',
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{activity.text}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Leaderboard */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Star /> Agent Leaderboard
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {agentPerformance.map((agent, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px', borderRadius: 16,
                    background: idx === 0 ? 'rgba(180, 130, 70, 0.04)' : 'var(--bg-tertiary)',
                    border: idx === 0 ? '1px solid rgba(180, 130, 70, 0.15)' : '1px solid var(--border-secondary)',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: idx === 0 ? 'var(--color-ochre)' : 'var(--color-espresso)',
                      color: idx === 0 ? '#fff' : 'var(--color-ochre)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, flexShrink: 0,
                    }}>
                      {idx === 0 ? <Icons.Star /> : agent.rank}
                    </div>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: 'var(--color-espresso)', color: 'var(--color-ochre)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {agent.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{agent.name}</p>
                      <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{agent.deals} deals</span>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{agent.leads} leads</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{formatPrice(agent.revenue)}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>Avg: {formatPrice(agent.avgDealSize)}</p>
                    </div>
                    <div style={{ textAlign: 'center', width: 80 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-sage)', margin: 0 }}>{agent.conversion}%</p>
                      <p style={{ fontSize: 10, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>Conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div style={{
            background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
            borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-md)',
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icons.Home /> Property Type Performance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {propertyTypePerformance.map((pt, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px', borderRadius: 16,
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{pt.type}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{pt.deals} deals</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{formatPrice(pt.revenue)}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>Avg: {formatPrice(pt.avgPrice)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 80, justifyContent: 'flex-end' }}>
                    {pt.trend === 'up' ? <Icons.TrendingUp /> : pt.trend === 'down' ? <Icons.TrendingDown /> : null}
                    <span style={{ fontSize: 13, fontWeight: 600, color: pt.trend === 'up' ? 'var(--color-sage)' : pt.trend === 'down' ? '#DC2626' : 'var(--text-tertiary)' }}>
                      {formatPercent(pt.trend === 'up' ? pt.change : -pt.change)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Globe /> Lead Sources
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {leadSources.map((source, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{source.source}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{source.leads} leads ({source.percentage}%)</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 100, background: 'var(--bg-hover)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 100,
                        width: `${source.percentage}%`,
                        background: source.color,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px', letterSpacing: '-0.01em' }}>
                Source Distribution
              </h3>
              <div style={{
                width: 180, height: 180, borderRadius: '50%',
                background: `conic-gradient(
                  var(--color-ochre) 0% ${leadSources[0].percentage}%,
                  var(--color-sage) ${leadSources[0].percentage}% ${leadSources[0].percentage + leadSources[1].percentage}%,
                  #3B82F6 ${leadSources[0].percentage + leadSources[1].percentage}% ${leadSources[0].percentage + leadSources[1].percentage + leadSources[2].percentage}%,
                  var(--color-terracotta) ${leadSources[0].percentage + leadSources[1].percentage + leadSources[2].percentage}% ${leadSources[0].percentage + leadSources[1].percentage + leadSources[2].percentage + leadSources[3].percentage}%,
                  #B8860B ${leadSources[0].percentage + leadSources[1].percentage + leadSources[2].percentage + leadSources[3].percentage}% ${leadSources[0].percentage + leadSources[1].percentage + leadSources[2].percentage + leadSources[3].percentage + leadSources[4].percentage}%,
                  var(--text-tertiary) ${leadSources[0].percentage + leadSources[1].percentage + leadSources[2].percentage + leadSources[3].percentage + leadSources[4].percentage}% 100%
                )`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{totalLeads}</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '12px 0 0' }}>Total Leads</p>
            </div>
          </div>
        )}

        {/* KPI Targets Tab */}
        {activeTab === 'kpi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Revenue Target', current: kpiTargets.revenueAchieved, target: kpiTargets.revenueTarget, format: formatPrice, color: 'var(--color-ochre)', icon: <Icons.DollarSign /> },
              { label: 'Deals Closed', current: kpiTargets.dealsClosed, target: kpiTargets.dealTarget, format: (v: number) => v.toString(), color: 'var(--color-sage)', icon: <Icons.CheckCircle /> },
              { label: 'Leads Generated', current: kpiTargets.leadsGenerated, target: kpiTargets.leadTarget, format: (v: number) => v.toString(), color: '#3B82F6', icon: <Icons.Users /> },
              { label: 'Conversion Rate', current: kpiTargets.conversionRate, target: kpiTargets.conversionTarget, format: (v: number) => `${v}%`, color: 'var(--color-terracotta)', icon: <Icons.Target /> },
            ].map((kpi, idx) => {
              const percentage = Math.round((kpi.current / kpi.target) * 100)
              return (
                <div key={idx} style={{
                  background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                  borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
                  boxShadow: 'var(--shadow-md)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 14, background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
                        {kpi.icon}
                      </div>
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{kpi.label}</h4>
                        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                          {kpi.format(kpi.current)} / {kpi.format(kpi.target)}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 700, color: percentage >= 100 ? 'var(--color-sage)' : kpi.color }}>
                      {percentage}%
                    </span>
                  </div>
                  <div style={{ height: 10, borderRadius: 100, background: 'var(--bg-hover)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 100,
                      width: `${Math.min(100, percentage)}%`,
                      background: percentage >= 100 ? 'var(--color-sage)' : kpi.color,
                      transition: 'width 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)',
                    }} />
                  </div>
                </div>
              )
            })}

            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Icons.Zap />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                  You're on track to hit {Math.round((kpiTargets.revenueAchieved / kpiTargets.revenueTarget) * 100)}% of your revenue target
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                  With current momentum, you'll exceed your deal target by 15% this quarter. Keep pushing!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics