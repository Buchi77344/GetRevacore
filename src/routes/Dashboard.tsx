import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.tsx'
import { supabase } from '../lib/supabase'

const Icons = {
  Leads: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Properties: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Appointments: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Revenue: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
      <path d="M5 19l1-2.5L8.5 15.5 6 15l-1-2.5L4 15l-2.5.5L4 16.5 5 19z"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
}

function formatNumber(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function formatCurrency(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

function timeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

interface DashboardStats {
  activeLeads: number
  activeProperties: number
  upcomingAppointments: number
  totalRevenue: number
  leadsChange: string
  propertiesChange: string
  appointmentsToday: number
  revenueChange: string
}

interface RecentActivity {
  action: string
  detail: string
  time: string
  type: 'lead' | 'appointment' | 'deal' | 'property' | 'ai'
  initials: string
}

export const Dashboard = () => {
  const { profile, agency } = useAuth()
  const [greeting, setGreeting] = useState('')
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    activeLeads: 0,
    activeProperties: 0,
    upcomingAppointments: 0,
    totalRevenue: 0,
    leadsChange: 'Loading...',
    propertiesChange: 'Loading...',
    appointmentsToday: 0,
    revenueChange: 'Loading...',
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
    const timer = setTimeout(() => setVisibleItems([0, 1, 2, 3]), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!agency?.id) return
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      try {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const today = now.toISOString().split('T')[0]

        const { count: totalLeads, error: leadsError } = await supabase
          .from('leads').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id)
        const { count: monthLeads } = await supabase
          .from('leads').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id).gte('created_at', monthStart)
        if (leadsError) throw leadsError

        let totalProperties = 0, monthProperties = 0
        try {
          const { count: pCount, error: pErr } = await supabase
            .from('properties').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('status', 'available')
          if (!pErr) totalProperties = pCount || 0
          const { count: mpCount } = await supabase
            .from('properties').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('status', 'available').gte('created_at', monthStart)
          if (!pErr) monthProperties = mpCount || 0
        } catch (e) { console.warn('Properties unavailable', e) }

        const { data: agencyLeads } = await supabase.from('leads').select('id').eq('agency_id', agency.id)
        const leadIds = agencyLeads?.map(l => l.id) || []
        let totalAppointments = 0, todayAppointments = 0

        if (leadIds.length > 0) {
          const { count: apptCount } = await supabase
            .from('appointments').select('*', { count: 'exact', head: true }).in('lead_id', leadIds).eq('status', 'pending').gte('date', today)
          totalAppointments = apptCount || 0
          const { count: todayCount } = await supabase
            .from('appointments').select('*', { count: 'exact', head: true }).in('lead_id', leadIds).eq('date', today)
          todayAppointments = todayCount || 0
        }

        const { data: closedDeals, error: dealsError } = await supabase
          .from('deals').select('value').eq('agency_id', agency.id).eq('status', 'closed')
        if (dealsError) throw dealsError
        const { data: monthDeals } = await supabase
          .from('deals').select('value').eq('agency_id', agency.id).gte('closed_at', monthStart)

        const totalRevenue = closedDeals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0
        const monthRevenue = monthDeals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0
        const prevMonthRevenue = Math.max(0, totalRevenue - monthRevenue)

        setStats({
          activeLeads: totalLeads || 0,
          activeProperties: totalProperties,
          upcomingAppointments: totalAppointments,
          totalRevenue,
          leadsChange: monthLeads ? `+${monthLeads} this month` : '0 this month',
          propertiesChange: monthProperties ? `+${monthProperties} this month` : '0 this month',
          appointmentsToday: todayAppointments,
          revenueChange: monthRevenue > 0 ? `+${Math.round((monthRevenue / Math.max(1, prevMonthRevenue)) * 100)}% vs last month` : 'No deals yet',
        })

        const { data: recentLeads } = await supabase
          .from('leads').select('name, created_at').eq('agency_id', agency.id).order('created_at', { ascending: false }).limit(3)

        let recentAppts: any[] = []
        if (leadIds.length > 0) {
          const { data: appts } = await supabase
            .from('appointments').select('date, time, created_at, lead_id, leads:lead_id (name)').in('lead_id', leadIds).order('created_at', { ascending: false }).limit(2)
          recentAppts = appts || []
        }

        const { data: recentDeals } = await supabase
          .from('deals').select('value, stage, closed_at, lead_id, leads:lead_id (name)').eq('agency_id', agency.id).order('created_at', { ascending: false }).limit(2)
        const { data: recentProperties } = await supabase
          .from('properties').select('title, created_at').eq('agency_id', agency.id).order('created_at', { ascending: false }).limit(2)

        const activity: RecentActivity[] = []
        recentLeads?.forEach(lead => activity.push({ action: 'New lead captured', detail: lead.name, time: timeAgo(lead.created_at), type: 'lead', initials: getInitials(lead.name) }))
        recentAppts.forEach(appt => {
          const n = (appt.leads as any)?.name || 'Lead'
          activity.push({ action: 'Appointment scheduled', detail: `${new Date(appt.date).toLocaleDateString()} at ${appt.time || 'TBD'} — ${n}`, time: timeAgo(appt.created_at), type: 'appointment', initials: getInitials(n) })
        })
        recentDeals?.forEach(deal => {
          const n = (deal.leads as any)?.name || 'Deal'
          activity.push({ action: deal.closed_at ? 'Deal closed' : `Deal in ${deal.stage}`, detail: `${formatCurrency(deal.value || 0)} — ${n}`, time: deal.closed_at ? timeAgo(deal.closed_at) : 'Active', type: 'deal', initials: getInitials(n) })
        })
        recentProperties?.forEach(prop => activity.push({ action: 'Property listed', detail: prop.title, time: timeAgo(prop.created_at), type: 'property', initials: getInitials(prop.title) }))

        setRecentActivity(activity.slice(0, 5))
      } catch (err) {
        console.error('Dashboard error:', err)
        setError('Failed to load dashboard. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [agency?.id])

  const displayStats = [
    { label: 'Active Leads',  value: formatNumber(stats.activeLeads),         change: stats.leadsChange,        icon: <Icons.Leads />,        accent: 'var(--color-ochre)',     accentBg: 'rgba(180,130,70,0.08)',  borderGlow: 'rgba(180,130,70,0.15)' },
    { label: 'Properties',   value: formatNumber(stats.activeProperties),      change: stats.propertiesChange,   icon: <Icons.Properties />,   accent: 'var(--color-terracotta)', accentBg: 'rgba(195,95,70,0.08)',   borderGlow: 'rgba(195,95,70,0.12)' },
    { label: 'Appointments', value: formatNumber(stats.upcomingAppointments),  change: stats.appointmentsToday > 0 ? `${stats.appointmentsToday} today` : 'None scheduled', icon: <Icons.Appointments />, accent: 'var(--color-sage)', accentBg: 'rgba(110,140,100,0.08)', borderGlow: 'rgba(110,140,100,0.12)' },
    { label: 'Revenue',      value: formatCurrency(stats.totalRevenue),         change: stats.revenueChange,      icon: <Icons.Revenue />,      accent: 'var(--color-cream)',     accentBg: 'var(--color-espresso)',  borderGlow: 'rgba(55,40,30,0.3)', isDark: true },
  ]

  const getActivityStyles = (type: string) => {
    switch (type) {
      case 'lead':        return { dot: 'var(--color-ochre)',     bg: 'rgba(180,130,70,0.06)' }
      case 'appointment': return { dot: 'var(--color-sage)',      bg: 'rgba(110,140,100,0.06)' }
      case 'deal':        return { dot: 'var(--color-terracotta)',bg: 'rgba(195,95,70,0.08)' }
      case 'property':    return { dot: 'var(--color-espresso)',  bg: 'rgba(55,40,30,0.04)' }
      case 'ai':          return { dot: 'var(--color-slate)',     bg: 'rgba(90,85,95,0.05)' }
      default:            return { dot: 'var(--color-slate)',     bg: 'transparent' }
    }
  }

  const quickActions = [
    { label: 'New Lead',      path: '/dashboard/leads',        icon: <Icons.Leads />,        shortcut: 'L' },
    { label: 'List Property', path: '/dashboard/properties',   icon: <Icons.Properties />,   shortcut: 'P' },
    { label: 'Schedule',      path: '/dashboard/appointments', icon: <Icons.Appointments />, shortcut: 'S' },
    { label: 'Analyse Deal',  path: '/dashboard/deals',        icon: <Icons.TrendingUp />,   shortcut: 'D' },
  ]

  const tips = [
    { title: 'Add your first lead',    desc: 'Build your pipeline — import or manually add contacts.' },
    { title: 'Create a listing',       desc: 'Showcase properties with rich media and share anywhere.' },
    { title: 'Set up AI sequences',    desc: 'Automate personalised follow-ups that convert.' },
    { title: 'Invite your team',       desc: 'Collaborate with agents and assign leads seamlessly.' },
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(180,130,70,0.03) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 100% 80%, rgba(195,95,70,0.02) 0%, transparent 70%),
          radial-gradient(ellipse 30% 30% at 0% 50%, rgba(110,140,100,0.02) 0%, transparent 70%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto'}}>

        {/* Error Banner */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 14, marginBottom: 20,
            background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: '#DC2626', flexShrink: 0 }}><Icons.AlertCircle /></span>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0, fontWeight: 500, flex: 1 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(220,38,38,.2)', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#DC2626', flexShrink: 0 }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header style={{ marginBottom: 'var(--section-gap)' }}>
          <div className="header-row">
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
                {agency?.name || 'RevaCore'}
                <span style={{ color: 'var(--color-ochre)', margin: '0 4px' }}>·</span>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 600, lineHeight: 1.1, margin: '8px 0 0', letterSpacing: '-0.02em' }}>
                {greeting},{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--color-ochre)' }}>
                  {profile?.name?.split(' ')[0] || 'Agent'}
                </em>
              </h1>
            </div>
            <div className="plan-badge">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-sage)', animation: 'pulse-glow 2s ease-in-out infinite', flexShrink: 0 }} />
              {agency?.plan_status === 'trial' ? 'Trial · 14 days left' : agency?.plan || 'Professional Plan'}
            </div>
          </div>
        </header>

        {/* ── Stats Grid ────────────────────────────────────────────────────── */}
        <div className="stats-grid" style={{ marginBottom: 'var(--section-gap)' }}>
          {displayStats.map((stat, idx) => (
            <div
              key={idx}
              className="stat-card"
              style={{
                background: stat.isDark ? 'var(--color-espresso)' : 'var(--bg-secondary)',
                border: stat.isDark ? 'none' : '1px solid var(--border-primary)',
                color: stat.isDark ? 'var(--color-cream)' : 'inherit',
                opacity: visibleItems.includes(idx) ? 1 : 0,
                transform: visibleItems.includes(idx) ? 'translateY(0)' : 'translateY(12px)',
                transition: `all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) ${idx * 60}ms`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: stat.accentBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.accent,
                }}>
                  {stat.icon}
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 600,
                  color: stat.isDark ? 'rgba(247,243,236,0.7)' : 'var(--color-sage)',
                  background: stat.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(110,140,100,0.08)',
                  padding: '4px 10px', borderRadius: 100,
                  whiteSpace: 'nowrap', maxWidth: '55%',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  <Icons.TrendingUp /> {stat.change}
                </span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: stat.isDark ? 'rgba(247,243,236,0.6)' : 'var(--text-secondary)', margin: '0 0 6px' }}>
                {stat.label}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>
                {stat.value}
              </p>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 80, height: 80, borderRadius: '0 0 0 100%',
                background: stat.accent, opacity: stat.isDark ? 0.08 : 0.04, pointerEvents: 'none',
              }} />
            </div>
          ))}
        </div>

        {/* ── Quick Actions ─────────────────────────────────────────────────── */}
        <nav className="quick-actions-bar" style={{ marginBottom: 'var(--section-gap)' }}>
          <span className="quick-actions-label">
            Quick Actions
          </span>
          {/* On desktop: single row. On mobile: 2×2 grid */}
          <div className="quick-actions-buttons">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.path}
                className="quick-action-btn"
              >
                <span style={{ color: 'var(--color-ochre)', display: 'flex', flexShrink: 0 }}>{action.icon}</span>
                <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{action.label}</span>
                <span className="shortcut-badge">{action.shortcut}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* ── Two-Column Content ────────────────────────────────────────────── */}
        <div className="content-grid">

          {/* Recent Activity */}
          <section style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 20, padding: 'var(--card-pad)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>Recent Activity</h3>
              <Link to="/dashboard/leads" style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-ochre)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                View all <Icons.ArrowRight />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentActivity.length === 0 && !loading ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>No recent activity yet.</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '4px 0 0' }}>Start by adding leads or properties.</p>
                </div>
              ) : (
                recentActivity.map((activity, idx) => {
                  const styles = getActivityStyles(activity.type)
                  return (
                    <div key={idx} style={{ position: 'relative', paddingLeft: 28, marginBottom: 2 }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16 }}>
                        <div style={{ width: 9, height: 9, borderRadius: '50%', background: styles.dot, flexShrink: 0, zIndex: 1, boxShadow: `0 0 0 3px var(--bg-secondary), 0 0 0 4px ${styles.dot}` }} />
                        {idx < recentActivity.length - 1 && (
                          <div style={{ width: 1, flex: 1, minHeight: 20, marginTop: -1, background: `linear-gradient(to bottom, ${styles.dot}40, transparent)` }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: styles.bg, color: styles.dot, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.02em', flexShrink: 0 }}>
                          {activity.initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{activity.action}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activity.detail}</p>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0, marginLeft: 4 }}>{activity.time}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>

          {/* Getting Started */}
          <section style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 20, padding: 'var(--card-pad)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>Getting Started</h3>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', background: 'var(--bg-hover)', padding: '4px 10px', borderRadius: 100, flexShrink: 0 }}>4 steps</span>
            </div>

            <div style={{
              position: 'relative', display: 'flex', gap: 14, padding: 18,
              background: 'linear-gradient(135deg, rgba(180,130,70,0.04) 0%, var(--bg-tertiary) 100%)',
              border: '1px solid rgba(180,130,70,0.1)', borderRadius: 14, marginBottom: 16, overflow: 'hidden',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-espresso)', color: 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icons.Sparkle />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>AI-Powered CRM</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  RevaCore qualifies leads, scores prospects, and follows up automatically — so you focus on closing.
                </p>
              </div>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: 'radial-gradient(circle, rgba(180,130,70,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            </div>

            <div className="tips-grid">
              {tips.map((tip, idx) => (
                <div key={idx} style={{
                  display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 10,
                  background: 'var(--bg-tertiary)', border: '1px solid transparent', cursor: 'pointer',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-ochre)', opacity: 0.5, lineHeight: 1, paddingTop: 2, flexShrink: 0 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>{tip.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        /* ── CSS custom properties used as responsive tokens ── */
        :root {
          --page-pad: 32px 24px 64px;
          --section-gap: 24px;
          --card-pad: 24px;
        }

        /* ── Stat cards ── */
        .stat-card {
          border-radius: 20px;
          padding: var(--card-pad);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        /* ── Stats grid: 4 cols → 2 → 1 ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        /* ── Quick actions bar ── */
        .quick-actions-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: 20px;
          box-shadow: var(--shadow-md);
          flex-wrap: wrap;
        }
        .quick-actions-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
          padding-right: 16px;
          border-right: 1px solid var(--border-primary);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .quick-actions-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          flex: 1;
        }
        .quick-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--bg-primary);
          border: 1px solid transparent;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .quick-action-btn:hover {
          background: var(--bg-hover);
          border-color: var(--border-secondary);
        }
        .shortcut-badge {
          font-size: 10px;
          color: var(--text-tertiary);
          background: var(--bg-hover);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }

        /* ── Two-column content grid ── */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        /* ── Tips 2×2 grid ── */
        .tips-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        /* ── Header row ── */
        .header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .plan-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--bg-hover);
          border: 1px solid var(--border-secondary);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ────────────────────────────────────────────────────────
           TABLET — ≤1024px
        ──────────────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ────────────────────────────────────────────────────────
           MOBILE — ≤768px
           Key changes:
           • Reduce page padding to use full width
           • Quick actions: 2×2 grid (2 buttons per row)
           • Stats: 2 columns with slightly larger cards
           • Tips: 1 column for readability
           • Remove the divider label from quick actions (too cramped)
        ──────────────────────────────────────────────────────── */
        @media (max-width: 768px) {
          :root {
            --page-pad: 20px 16px 48px;
            --section-gap: 16px;
            --card-pad: 18px;
          }

          /* Stats: 2 columns, bigger cards */
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .stat-card {
            border-radius: 16px;
            padding: 18px;
          }

          /* Quick actions bar: vertical stacking */
          .quick-actions-bar {
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
            gap: 12px;
            border-radius: 16px;
          }
          /* Hide the "Quick Actions" label divider — replaces it with heading */
          .quick-actions-label {
            border-right: none;
            padding-right: 0;
            border-bottom: 1px solid var(--border-primary);
            padding-bottom: 10px;
            width: 100%;
          }
          /* Buttons: 2 per row on mobile */
          .quick-actions-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            width: 100%;
          }
          .quick-action-btn {
            justify-content: flex-start;
            border-radius: 12px;
            padding: 12px 14px;
            border: 1px solid var(--border-secondary);
            font-size: 13px;
          }
          /* Hide shortcut badges on mobile — not useful on touch */
          .shortcut-badge {
            display: none;
          }

          /* Content grid: single column */
          .content-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          /* Tips: single column on mobile for readability */
          .tips-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          /* Header: stack vertically */
          .header-row {
            flex-direction: column;
            gap: 12px;
          }
          .plan-badge {
            align-self: flex-start;
          }
        }

        /* ────────────────────────────────────────────────────────
           SMALL MOBILE — ≤400px (e.g. iPhone SE, small Android)
           • Stats become single column to avoid cramping
           • Even tighter padding
        ──────────────────────────────────────────────────────── */
        @media (max-width: 400px) {
          :root {
            --page-pad: 16px 12px 40px;
            --card-pad: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .stat-card {
            border-radius: 14px;
            padding: 16px;
          }

          /* On very small screens, quick actions also go 1 per row */
          .quick-actions-buttons {
            grid-template-columns: 1fr 1fr;
          }
          .quick-action-btn {
            padding: 10px 12px;
            font-size: 12px;
            gap: 6px;
          }
        }

        /* ────────────────────────────────────────────────────────
           ANIMATIONS
        ──────────────────────────────────────────────────────── */
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(110,140,100,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(110,140,100,0); }
        }
      `}</style>
    </div>
  )
}

export default Dashboard