import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AddLeadModal } from '../components/leads/AddLeadModal.tsx'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Lead {
  id: string; name: string; email: string; phone: string | null; status: string; source: string
  budget: number | null; currency: string; location: string | null; property_type: string | null
  intent: string | null; score: string; notes: string | null; ai_summary: string | null
  ai_score: string | null; ai_points: number; ai_reason: string | null; ai_scored_at: string | null
  follow_up_step: number; last_follow_up_at: string | null; created_at: string
  agency_id: string; assigned_to: string | null; agent_name?: string | null; initials?: string
}
interface LeadStats {
  total: number; hot: number; warm: number; cold: number; new: number
  qualified: number; totalValue: number; scoredCount: number
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Search:      () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Plus:        () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  ChevronRight:() => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>),
  Mail:        () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
  Phone:       () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>),
  Calendar:    () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  MoreVertical:() => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>),
  Download:    () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  Grid:        () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>),
  List:        () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
  Zap:         () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  TrendingUp:  () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
  CheckCircle: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
  XCircle:     () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>),
  UserPlus:    () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>),
  Loader:      () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'ld-spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>),
  Sparkle:     () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>),
  MapPin:      () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  Home:        () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  Filter:      () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>),
  // Score icons replacing emojis
  Fire:        () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7 7 7 0 01-7-7c0-1.5.5-3 1.5-5L8.5 14.5z"/></svg>),
  Sun:         () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
  Snowflake:   () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 7l-5-5-5 5"/><path d="M17 17l-5 5-5-5"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M7 7l-5 5 5 5"/><path d="M17 7l5 5-5 5"/></svg>),
  Brain:       () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 017 4.5v1A2.5 2.5 0 009.5 8h5A2.5 2.5 0 0017 5.5v-1A2.5 2.5 0 0014.5 2h-5z"/><path d="M9 8v8m6-8v8M5.5 12A2.5 2.5 0 003 14.5v1A2.5 2.5 0 005.5 18h.5m12.5-6a2.5 2.5 0 012.5 2.5v1A2.5 2.5 0 0118.5 18H18M9 16h6m-3 0v4"/></svg>),
  Dollar:      () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>),
  Users:       () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}
function formatCurrency(amount: number | null, _c = 'USD'): string {
  if (!amount) return '—'
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
}
function timeAgo(d: string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`; if (s < 604800) return `${Math.floor(s / 86400)}d ago`
  return new Date(d).toLocaleDateString()
}

// ─── Config ────────────────────────────────────────────────────────────────────
const aiScoreConfig = {
  hot:  { icon: <Icons.Fire />,      label: 'Hot',  bg: 'rgba(220,38,38,0.08)',  text: '#DC2626', border: 'rgba(220,38,38,0.2)',  barColor: '#DC2626' },
  warm: { icon: <Icons.Sun />,       label: 'Warm', bg: 'rgba(217,119,6,0.08)',  text: '#D97706', border: 'rgba(217,119,6,0.2)',  barColor: '#D97706' },
  cold: { icon: <Icons.Snowflake />, label: 'Cold', bg: 'rgba(59,130,246,0.08)', text: '#3B82F6', border: 'rgba(59,130,246,0.2)', barColor: '#3B82F6' },
}
const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string; label: string }> = {
  hot:       { bg: 'rgba(220,38,38,0.06)',   text: '#DC2626',              dot: '#DC2626',              border: 'rgba(220,38,38,0.15)',   label: 'Hot' },
  warm:      { bg: 'rgba(217,175,40,0.06)',  text: '#D9AF28',              dot: '#D9AF28',              border: 'rgba(217,175,40,0.15)',  label: 'Warm' },
  cold:      { bg: 'rgba(59,130,246,0.06)',  text: '#3B82F6',              dot: '#3B82F6',              border: 'rgba(59,130,246,0.15)', label: 'Cold' },
  new:       { bg: 'var(--bg-hover)',        text: 'var(--text-secondary)',dot: 'var(--text-tertiary)', border: 'var(--border-secondary)', label: 'New' },
  qualified: { bg: 'rgba(110,140,100,0.06)', text: 'var(--color-sage)',    dot: 'var(--color-sage)',    border: 'rgba(110,140,100,0.15)', label: 'Qualified' },
  contacted: { bg: 'rgba(147,112,219,0.06)', text: '#9370DB',              dot: '#9370DB',              border: 'rgba(147,112,219,0.15)', label: 'Contacted' },
  closed:    { bg: 'rgba(110,140,100,0.06)', text: 'var(--color-sage)',    dot: 'var(--color-sage)',    border: 'rgba(110,140,100,0.15)', label: 'Closed' },
}
const sourceStyles: Record<string, { bg: string; text: string; border: string }> = {
  website:        { bg: 'rgba(59,130,246,0.06)',   text: '#3B82F6',              border: 'rgba(59,130,246,0.12)' },
  referral:       { bg: 'rgba(110,140,100,0.06)',  text: 'var(--color-sage)',    border: 'rgba(110,140,100,0.12)' },
  social_media:   { bg: 'rgba(236,72,153,0.06)',   text: '#EC4899',              border: 'rgba(236,72,153,0.12)' },
  facebook:       { bg: 'rgba(99,102,241,0.06)',   text: '#6366F1',              border: 'rgba(99,102,241,0.12)' },
  google_ads:     { bg: 'rgba(20,184,166,0.06)',   text: '#14B8A6',              border: 'rgba(20,184,166,0.12)' },
  email_campaign: { bg: 'rgba(139,92,246,0.06)',   text: '#8B5CF6',              border: 'rgba(139,92,246,0.12)' },
  property_finder:{ bg: 'rgba(180,130,70,0.06)',   text: 'var(--color-ochre)',   border: 'rgba(180,130,70,0.12)' },
  bayut:          { bg: 'rgba(180,130,70,0.06)',   text: 'var(--color-ochre)',   border: 'rgba(180,130,70,0.12)' },
  csv_import:     { bg: 'rgba(110,140,100,0.06)',  text: 'var(--color-sage)',    border: 'rgba(110,140,100,0.12)' },
  manual:         { bg: 'var(--bg-hover)',         text: 'var(--text-secondary)',border: 'var(--border-secondary)' },
}
const ITEMS_PER_PAGE = 5

// ─── Sub-components ────────────────────────────────────────────────────────────
function AIScoreBadge({ score, points, reason, size = 'sm' }: { score: string | null; points: number; reason?: string | null; size?: 'sm' | 'md' }) {
  if (!score) return (
    <span className="ld-scoring-badge">
      <span className="ld-scoring-dot" />
      Scoring...
    </span>
  )
  const cfg = aiScoreConfig[score as keyof typeof aiScoreConfig] || aiScoreConfig.cold
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: size === 'md' ? '5px 12px' : '4px 9px', borderRadius: 100, fontSize: size === 'md' ? 12 : 11, fontWeight: 700, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
        {cfg.icon}
        {cfg.label}
        {points > 0 && <span style={{ fontSize: size === 'md' ? 11 : 10, opacity: 0.75, fontWeight: 600 }}>{points}pts</span>}
      </span>
      {reason && size === 'md' && <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.4, maxWidth: 220 }}>{reason}</p>}
    </div>
  )
}
function AIPointsBar({ score, points }: { score: string | null; points: number }) {
  if (!score || !points) return null
  const cfg = aiScoreConfig[score as keyof typeof aiScoreConfig]; if (!cfg) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--border-secondary)', overflow: 'hidden' }}>
        <div className="ld-points-bar" style={{ '--bar-color': cfg.barColor, '--bar-width': `${Math.min(points, 100)}%` } as any} />
      </div>
      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, flexShrink: 0 }}>{points}/100</span>
    </div>
  )
}
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="ld-filter-tag">
      {label}
      <button onClick={onRemove} className="ld-filter-tag-remove"><Icons.XCircle /></button>
    </span>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, loading }: { value: number | string; loading: boolean }) {
  const [display, setDisplay] = useState(loading ? '...' : String(value))
  const prevRef = useRef(display)

  useEffect(() => {
    if (loading) { setDisplay('...'); return }
    const str = String(value)
    if (str === prevRef.current) return
    prevRef.current = str
    setDisplay(str)
  }, [value, loading])

  return <span className="ld-counter">{display}</span>
}

// ─── Main Component ────────────────────────────────────────────────────────────
export const Leads = () => {
  const { agency } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [aiScoreFilter, setAiScoreFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [quickActionOpen, setQuickActionOpen] = useState<string | null>(null)
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [visibleRows, setVisibleRows] = useState<string[]>([])
  const [statsVisible, setStatsVisible] = useState(false)

  const fetchLeads = useCallback(async () => {
    if (!agency?.id) return
    setLoading(true); setError(null)
    try {
      const { data, error: e } = await supabase.from('leads').select('*, agent_profiles:assigned_to (name)').eq('agency_id', agency.id).order('created_at', { ascending: false })
      if (e) throw e
      setLeads((data || []).map((l: any) => ({ ...l, agent_name: l.agent_profiles?.name || 'Unassigned', initials: getInitials(l.name) })))
    } catch (err: any) { setError(err.message); toast.error('Failed to load leads') }
    finally { setLoading(false) }
  }, [agency?.id])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  // Stat cards entrance
  useEffect(() => {
    if (!loading) setTimeout(() => setStatsVisible(true), 60)
  }, [loading])

  const filteredLeads = useMemo(() => {
    let f = [...leads]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      f = f.filter(l => l.name.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone?.includes(q) || l.location?.toLowerCase().includes(q) || l.property_type?.toLowerCase().includes(q) || l.ai_reason?.toLowerCase().includes(q) || (l.agent_name || '').toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') f = f.filter(l => l.status === statusFilter)
    if (sourceFilter !== 'all') f = f.filter(l => l.source === sourceFilter)
    if (aiScoreFilter !== 'all') f = f.filter(l => l.ai_score === aiScoreFilter)
    switch (sortBy) {
      case 'name': f.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'budget_high': f.sort((a, b) => (b.budget || 0) - (a.budget || 0)); break
      case 'budget_low': f.sort((a, b) => (a.budget || 0) - (b.budget || 0)); break
      case 'ai_score': f.sort((a, b) => (b.ai_points || 0) - (a.ai_points || 0)); break
      default: f.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return f
  }, [leads, searchQuery, statusFilter, sourceFilter, aiScoreFilter, sortBy])

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Staggered row entrance
  useEffect(() => {
    setVisibleRows([])
    const ids = paginatedLeads.map(l => l.id)
    ids.forEach((id, i) => setTimeout(() => setVisibleRows(p => [...p, id]), i * 55))
  }, [currentPage, filteredLeads.length, sortBy, statusFilter, sourceFilter, aiScoreFilter, searchQuery])

  useEffect(() => {
    if (!agency?.id) return
    const ch = supabase.channel('ld-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads', filter: `agency_id=eq.${agency.id}` }, (payload) => {
        if (payload.eventType === 'UPDATE') setLeads(prev => prev.map(l => l.id === (payload.new as Lead).id ? { ...l, ...(payload.new as Lead), initials: getInitials((payload.new as Lead).name) } : l))
        else fetchLeads()
      }).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [agency?.id, fetchLeads])

  const handleFilterChange = (setter: (v: string) => void, value: string) => { setter(value); setCurrentPage(1) }
  const toggleLeadSelection = (id: string) => setSelectedLeads(p => p.includes(id) ? p.filter(l => l !== id) : [...p, id])
  const toggleAllLeads = () => setSelectedLeads(selectedLeads.length === paginatedLeads.length ? [] : paginatedLeads.map(l => l.id))

  const stats: LeadStats = useMemo(() => ({
    total: leads.length, hot: leads.filter(l => l.ai_score === 'hot').length,
    warm: leads.filter(l => l.ai_score === 'warm').length, cold: leads.filter(l => l.ai_score === 'cold').length,
    new: leads.filter(l => l.status === 'new').length, qualified: leads.filter(l => l.status === 'qualified').length,
    totalValue: leads.reduce((s, l) => s + (l.budget || 0), 0),
    scoredCount: leads.filter(l => l.ai_score !== null).length,
  }), [leads])

  const handleBulkStatusUpdate = async (newStatus: string) => {
    try {
      const { error } = await supabase.from('leads').update({ status: newStatus }).in('id', selectedLeads)
      if (error) throw error
      toast.success(`${selectedLeads.length} leads updated`)
      setSelectedLeads([]); fetchLeads()
    } catch { toast.error('Failed to update leads') }
  }
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedLeads.length} lead(s)?`)) return
    try {
      const { error } = await supabase.from('leads').delete().in('id', selectedLeads)
      if (error) throw error
      toast.success(`${selectedLeads.length} leads deleted`)
      setSelectedLeads([]); fetchLeads()
    } catch { toast.error('Failed to delete leads') }
  }
  const handleExportCSV = () => {
    const headers = ['Name','Email','Phone','Status','AI Score','AI Points','AI Reason','Source','Budget','Location','Property Type','Agent','Date']
    const rows = filteredLeads.map(l => [l.name,l.email,l.phone||'',l.status,l.ai_score||'',l.ai_points||'',l.ai_reason||'',l.source,l.budget||'',l.location||'',l.property_type||'',l.agent_name||'Unassigned',new Date(l.created_at).toLocaleDateString()])
    const csv = [headers,...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
    Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv],{type:'text/csv'})), download: `leads-${new Date().toISOString().split('T')[0]}.csv` }).click()
    toast.success('Leads exported')
  }

  const statCards = [
    { label: 'Total Leads',    value: stats.total,                     icon: <Icons.Users />,       iconBg: 'var(--color-espresso)', iconColor: 'var(--color-ochre)', accent: 'rgba(55,40,30,0.08)',    delay: 0 },
    { label: 'Hot Leads',      value: stats.hot,                        icon: <Icons.Fire />,        iconBg: 'rgba(220,38,38,0.1)',   iconColor: '#DC2626',            accent: 'rgba(220,38,38,0.04)',   delay: 60 },
    { label: 'Warm Leads',     value: stats.warm,                       icon: <Icons.Sun />,         iconBg: 'rgba(217,119,6,0.1)',   iconColor: '#D97706',            accent: 'rgba(217,119,6,0.04)',   delay: 120 },
    { label: 'Qualified',      value: stats.qualified,                  icon: <Icons.CheckCircle />, iconBg: 'rgba(110,140,100,0.1)', iconColor: 'var(--color-sage)',  accent: 'rgba(110,140,100,0.04)', delay: 180 },
    { label: 'Pipeline Value', value: formatCurrency(stats.totalValue), icon: <Icons.Dollar />,      iconBg: 'rgba(184,134,11,0.1)',  iconColor: '#B8860B',            accent: 'rgba(184,134,11,0.04)',  delay: 240 },
  ]

  const hasActiveFilters = statusFilter !== 'all' || sourceFilter !== 'all' || aiScoreFilter !== 'all' || !!searchQuery

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: `radial-gradient(ellipse 60% 40% at 30% -10%, rgba(180,130,70,0.03) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 90%, rgba(195,95,70,0.02) 0%, transparent 60%)` }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div className="ld-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Leads</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>{loading ? 'Loading...' : `${leads.length} leads`}</p>
              {stats.scoredCount > 0 && (
                <span className="ld-scored-badge">
                  <Icons.Brain /> {stats.scoredCount} AI scored
                </span>
              )}
            </div>
          </div>
          <div className="ld-header-actions">
            <button onClick={handleExportCSV} disabled={filteredLeads.length === 0} className="ld-btn-secondary">
              <Icons.Download /> <span className="ld-btn-label">Export</span>
            </button>
            <button onClick={() => setAddLeadModalOpen(true)} className="ld-btn-primary">
              <Icons.Plus /> Add Lead
            </button>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="ld-stats-grid">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="ld-stat-card"
              style={{
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.4s ease ${stat.delay}ms, transform 0.4s cubic-bezier(0.22,0.61,0.36,1) ${stat.delay}ms`,
              }}
            >
              <div className="ld-stat-accent" style={{ background: stat.accent }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="ld-stat-icon" style={{ background: stat.iconBg, color: stat.iconColor }}>
                  {stat.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 10, color: 'var(--text-tertiary)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{stat.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    <AnimatedNumber value={stat.value} loading={loading} />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="ld-filters-panel">
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex', pointerEvents: 'none' }}><Icons.Search /></span>
            <input type="text" placeholder="Search leads..." value={searchQuery} onChange={e => handleFilterChange(setSearchQuery, e.target.value)} className="ld-search-input" />
          </div>
          <button className="ld-filter-toggle" onClick={() => setFiltersOpen(v => !v)}>
            <Icons.Filter /> Filters {hasActiveFilters && <span className="ld-filter-dot" />}
          </button>
          <div className={`ld-filter-selects${filtersOpen ? ' ld-filters-open' : ''}`}>
            <select value={aiScoreFilter} onChange={e => handleFilterChange(setAiScoreFilter, e.target.value)} className="ld-select">
              <option value="all">All AI Scores</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
            <select value={statusFilter} onChange={e => handleFilterChange(setStatusFilter, e.target.value)} className="ld-select">
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={sourceFilter} onChange={e => handleFilterChange(setSourceFilter, e.target.value)} className="ld-select">
              <option value="all">All Sources</option>
              {['property_finder','bayut','website','referral','social_media','facebook','google_ads','email_campaign','csv_import','manual'].map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="ld-select">
              <option value="date">Most Recent</option>
              <option value="ai_score">AI Score: Highest</option>
              <option value="name">Name A-Z</option>
              <option value="budget_high">Budget: High–Low</option>
              <option value="budget_low">Budget: Low–High</option>
            </select>
          </div>
          <div className="ld-view-toggle">
            <button onClick={() => setViewMode('list')} className={`ld-view-btn${viewMode === 'list' ? ' active' : ''}`}><Icons.List /></button>
            <button onClick={() => setViewMode('grid')} className={`ld-view-btn${viewMode === 'grid' ? ' active' : ''}`}><Icons.Grid /></button>
          </div>
        </div>

        {/* Active filter tags */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: -8, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Filters:</span>
            {aiScoreFilter !== 'all' && <FilterTag label={`AI: ${aiScoreFilter}`} onRemove={() => handleFilterChange(setAiScoreFilter, 'all')} />}
            {statusFilter !== 'all' && <FilterTag label={`Status: ${statusConfig[statusFilter]?.label || statusFilter}`} onRemove={() => handleFilterChange(setStatusFilter, 'all')} />}
            {sourceFilter !== 'all' && <FilterTag label={`Source: ${sourceFilter.replace(/_/g,' ')}`} onRemove={() => handleFilterChange(setSourceFilter, 'all')} />}
            {searchQuery && <FilterTag label={`"${searchQuery}"`} onRemove={() => handleFilterChange(setSearchQuery, '')} />}
            <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); setSourceFilter('all'); setAiScoreFilter('all'); setFiltersOpen(false) }} style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-ochre)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>Clear all</button>
          </div>
        )}

        {/* ── Bulk Actions ── */}
        {selectedLeads.length > 0 && (
          <div className="ld-bulk-bar">
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--color-cream)', flexShrink: 0 }}>{selectedLeads.length} selected</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[{ l: 'Hot', a: () => handleBulkStatusUpdate('hot') }, { l: 'Warm', a: () => handleBulkStatusUpdate('warm') }, { l: 'Qualified', a: () => handleBulkStatusUpdate('qualified') }].map(({ l, a }) => (
                <button key={l} onClick={a} style={{ padding: '7px 12px', fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 10, color: 'var(--color-cream)', cursor: 'pointer' }}>{l}</button>
              ))}
              <button onClick={handleBulkDelete} style={{ padding: '7px 12px', fontSize: 12, fontWeight: 600, background: 'rgba(220,38,38,0.25)', border: 'none', borderRadius: 10, color: '#FCA5A5', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '64px 0', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)' }}>
            <div style={{ color: 'var(--color-ochre)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Icons.Loader /></div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Loading leads...</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)' }}>
            <p style={{ fontSize: 14, color: '#DC2626', fontWeight: 500, marginBottom: 16 }}>{error}</p>
            <button onClick={fetchLeads} style={{ padding: '10px 20px', borderRadius: 12, background: 'var(--color-espresso)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Retry</button>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && leads.length === 0 && (
          <div style={{ textAlign: 'center', padding: '72px 24px', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)' }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--text-tertiary)' }}><Icons.UserPlus /></div>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>No leads yet</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 24px', lineHeight: 1.5 }}>Add your first lead — RevaCore AI will score it automatically.</p>
            <button onClick={() => setAddLeadModalOpen(true)} style={{ padding: '12px 24px', borderRadius: 14, background: 'var(--color-espresso)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Add First Lead</button>
          </div>
        )}

        {/* ── Leads Content ── */}
        {!loading && !error && leads.length > 0 && (
          <>
            {/* LIST VIEW */}
            {viewMode === 'list' && (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                {/* Desktop table header */}
                <div className="ld-table-header">
                  <div><input type="checkbox" checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0} onChange={toggleAllLeads} style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--color-ochre)' }} /></div>
                  <div>Lead</div><div>Contact</div><div>AI Score</div>
                  <div>Status</div><div>Source</div><div>Budget</div><div>Agent</div><div />
                </div>

                {paginatedLeads.map((lead) => {
                  const status = statusConfig[lead.status] || statusConfig.new
                  const source = sourceStyles[lead.source] || sourceStyles.manual
                  const aiCfg = lead.ai_score ? aiScoreConfig[lead.ai_score as keyof typeof aiScoreConfig] : null
                  const vis = visibleRows.includes(lead.id)
                  return (
                    <div key={lead.id}>
                      {/* Desktop row */}
                      <div className="ld-desktop-row" style={{ display: 'grid', gridTemplateColumns: '40px 2.5fr 1.8fr 1.2fr 1fr 1fr 1.2fr 1fr 44px', gap: 12, padding: '14px 20px', alignItems: 'center', borderBottom: '1px solid var(--border-secondary)', opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,0.61,0.36,1)' }}>
                        <div><input type="checkbox" checked={selectedLeads.includes(lead.id)} onChange={() => toggleLeadSelection(lead.id)} style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--color-ochre)' }} /></div>
                        <Link to={`/dashboard/leads/${lead.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minWidth: 0 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: aiCfg ? aiCfg.bg : 'var(--color-espresso)', color: aiCfg ? aiCfg.text : 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, border: aiCfg ? `1px solid ${aiCfg.border}` : 'none' }}>{lead.initials}</div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{timeAgo(lead.created_at)}</p>
                          </div>
                        </Link>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}><Icons.Mail /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{lead.email}</span></div>
                          {lead.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}><Icons.Phone />{lead.phone}</div>}
                        </div>
                        <div>
                          <AIScoreBadge score={lead.ai_score} points={lead.ai_points} />
                          {lead.ai_score && <div style={{ marginTop: 4 }}><AIPointsBar score={lead.ai_score} points={lead.ai_points} /></div>}
                        </div>
                        <div><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: status.bg, color: status.text, border: `1px solid ${status.border}` }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: status.dot }} />{status.label}</span></div>
                        <div><span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: source.bg, color: source.text, border: `1px solid ${source.border}`, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{lead.source.replace(/_/g,' ')}</span></div>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(lead.budget, lead.currency)}</span>
                          {lead.location && <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}><Icons.MapPin />{lead.location}</div>}
                        </div>
                        <div><span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{lead.agent_name || 'Unassigned'}</span></div>
                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
                          <button onClick={() => setQuickActionOpen(quickActionOpen === lead.id ? null : lead.id)} style={{ padding: 6, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}><Icons.MoreVertical /></button>
                          {quickActionOpen === lead.id && (
                            <>
                              <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setQuickActionOpen(null)} />
                              <div style={{ position: 'absolute', right: 0, top: 32, zIndex: 20, width: 190, background: 'var(--bg-secondary)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-primary)', borderRadius: 14, boxShadow: 'var(--shadow-lg)', padding: 4, animation: 'ld-fadeIn 0.15s ease' }}>
                                {[{ icon: <Icons.Mail />, l: 'Send Email' }, { icon: <Icons.Phone />, l: 'Call Lead' }, { icon: <Icons.Calendar />, l: 'Schedule Meeting' }].map(({ icon, l }) => (
                                  <button key={l} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', background: 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>{icon}{l}</button>
                                ))}
                                <div style={{ height: 1, background: 'var(--border-secondary)', margin: 4 }} />
                                <Link to={`/dashboard/leads/${lead.id}`} style={{ width: '100%', padding: '10px 14px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', background: 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }} onClick={() => setQuickActionOpen(null)}>
                                  <Icons.ChevronRight />View Details
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Mobile card */}
                      <Link to={`/dashboard/leads/${lead.id}`} className="ld-mobile-card" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,0.61,0.36,1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: aiCfg ? aiCfg.bg : 'var(--color-espresso)', color: aiCfg ? aiCfg.text : 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, border: aiCfg ? `1px solid ${aiCfg.border}` : 'none' }}>{lead.initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{timeAgo(lead.created_at)}</p>
                          </div>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: status.bg, color: status.text, border: `1px solid ${status.border}`, flexShrink: 0 }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: status.dot }} />{status.label}
                          </span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <AIScoreBadge score={lead.ai_score} points={lead.ai_points} />
                          {lead.ai_score && <div style={{ marginTop: 5 }}><AIPointsBar score={lead.ai_score} points={lead.ai_points} /></div>}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                          {lead.email && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}><Icons.Mail /><span style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</span></span>}
                          {lead.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}><Icons.Phone />{lead.phone}</span>}
                          {lead.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}><Icons.MapPin />{lead.location}</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-secondary)' }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{formatCurrency(lead.budget, lead.currency)}</span>
                          <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 100, fontSize: 10, fontWeight: 600, background: source.bg, color: source.text, border: `1px solid ${source.border}`, textTransform: 'capitalize' }}>{lead.source.replace(/_/g,' ')}</span>
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}

            {/* GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="ld-grid-view">
                {paginatedLeads.map((lead) => {
                  const status = statusConfig[lead.status] || statusConfig.new
                  const aiConf = lead.ai_score ? aiScoreConfig[lead.ai_score as keyof typeof aiScoreConfig] : null
                  const vis = visibleRows.includes(lead.id)
                  return (
                    <Link key={lead.id} to={`/dashboard/leads/${lead.id}`} className="ld-grid-card" style={{ border: `1px solid ${aiConf ? aiConf.border : 'var(--border-primary)'}`, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.32s ease, transform 0.32s cubic-bezier(0.22,0.61,0.36,1)' }}>
                      <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderRadius: '0 0 0 100%', background: aiConf ? aiConf.bg : 'var(--bg-hover)', pointerEvents: 'none' }} />
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: aiConf ? aiConf.bg : 'var(--color-espresso)', color: aiConf ? aiConf.text : 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, border: aiConf ? `1px solid ${aiConf.border}` : 'none' }}>{lead.initials}</div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{lead.name}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{timeAgo(lead.created_at)}</p>
                          </div>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: status.bg, color: status.text, border: `1px solid ${status.border}`, flexShrink: 0 }}>{status.label}</span>
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <AIScoreBadge score={lead.ai_score} points={lead.ai_points} size="md" reason={lead.ai_reason} />
                        {lead.ai_score && <div style={{ marginTop: 6 }}><AIPointsBar score={lead.ai_score} points={lead.ai_points} /></div>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}><Icons.Mail /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</span></div>
                        {lead.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}><Icons.Phone />{lead.phone}</div>}
                        {lead.location && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}><Icons.MapPin />{lead.location}</div>}
                        {lead.property_type && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}><Icons.Home />{lead.property_type}</div>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border-secondary)' }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{formatCurrency(lead.budget, lead.currency)}</span>
                        <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 100, fontSize: 10, fontWeight: 600, background: (sourceStyles[lead.source] || sourceStyles.manual).bg, color: (sourceStyles[lead.source] || sourceStyles.manual).text, border: `1px solid ${(sourceStyles[lead.source] || sourceStyles.manual).border}`, textTransform: 'capitalize' }}>{lead.source.replace(/_/g,' ')}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* ── Pagination ── */}
            {filteredLeads.length > 0 && (
              <div className="ld-pagination">
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredLeads.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)}</span> of <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{filteredLeads.length}</span>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="ld-page-btn" style={{ opacity: currentPage === 1 ? 0.4 : 1 }}>← Prev</button>
                  {(() => {
                    const pages: number[] = []
                    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
                    else {
                      pages.push(1)
                      const s = Math.max(2, currentPage - 2), e = Math.min(totalPages - 1, currentPage + 2)
                      if (s > 2) pages.push(-1)
                      for (let i = s; i <= e; i++) pages.push(i)
                      if (e < totalPages - 1) pages.push(-2)
                      pages.push(totalPages)
                    }
                    return pages.map((page, idx) =>
                      page < 0
                        ? <span key={`e-${idx}`} style={{ fontSize: 13, color: 'var(--text-tertiary)', padding: '0 2px' }}>…</span>
                        : <button key={page} onClick={() => setCurrentPage(page)} className={`ld-page-num${page === currentPage ? ' ld-page-active' : ''}`}>{page}</button>
                    )
                  })()}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="ld-page-btn" style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddLeadModal
        isOpen={addLeadModalOpen}
        onClose={() => setAddLeadModalOpen(false)}
        onSuccess={() => { setAddLeadModalOpen(false); fetchLeads(); toast.success('Lead added — AI scoring in progress...') }}
        agencyId={agency?.id}
      />

      <style>{`
        /* ── Keyframes ── */
        @keyframes ld-spin     { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ld-fadeIn   { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @keyframes ld-slideDown{ from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @keyframes ld-pulse    { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes ld-barIn    { from { width: 0; } to { width: var(--bar-width); } }

        /* ── Points bar ── */
        .ld-points-bar {
          height: 100%; border-radius: 2px;
          width: var(--bar-width);
          background: var(--bar-color);
          animation: ld-barIn 0.7s cubic-bezier(0.22,0.61,0.36,1) both;
        }

        /* ── Scoring badge ── */
        .ld-scoring-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 9px; border-radius: 100px; font-size: 11px; font-weight: 500;
          background: var(--bg-hover); color: var(--text-tertiary);
          border: 1px solid var(--border-secondary);
        }
        .ld-scoring-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--text-tertiary);
          animation: ld-pulse 1.5s ease-in-out infinite;
        }

        /* ── Scored badge ── */
        .ld-scored-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 600;
          background: rgba(110,140,100,0.1); color: var(--color-sage);
          border: 1px solid rgba(110,140,100,0.2);
        }

        /* ── Filter tag ── */
        .ld-filter-tag {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; font-size: 11px; font-weight: 600;
          background: var(--bg-hover); border-radius: 100px;
          color: var(--text-secondary); border: 1px solid var(--border-secondary);
          animation: ld-fadeIn 0.2s ease;
        }
        .ld-filter-tag-remove {
          background: none; border: none; cursor: pointer;
          color: var(--text-tertiary); display: flex; padding: 0; margin-left: 2px;
          transition: color 0.15s;
        }
        .ld-filter-tag-remove:hover { color: #DC2626; }

        /* ── Stat card ── */
        .ld-stat-card {
          background: var(--bg-secondary); border-radius: 20px; padding: 18px;
          border: 1px solid var(--border-primary); box-shadow: var(--shadow-md);
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ld-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .ld-stat-accent {
          position: absolute; top: 0; right: 0;
          width: 56px; height: 56px; border-radius: 0 0 0 100%;
          pointer-events: none;
        }
        .ld-stat-icon {
          width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .ld-counter { display: inline-block; }

        /* ── Stats grid ── */
        .ld-stats-grid {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 12px; margin-bottom: 18px;
        }

        /* ── Header ── */
        .ld-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px; flex-wrap: wrap; gap: 14px;
        }
        .ld-header-actions { display: flex; align-items: center; gap: 8px; }
        .ld-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 18px; font-size: 13px; font-weight: 700;
          color: var(--color-cream); background: var(--color-espresso);
          border: none; border-radius: 14px; cursor: pointer;
          box-shadow: var(--shadow-md); white-space: nowrap;
          transition: filter 0.2s, transform 0.2s;
        }
        .ld-btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .ld-btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 16px; font-size: 13px; font-weight: 600;
          color: var(--text-secondary); background: var(--bg-secondary);
          border: 1px solid var(--border-primary); border-radius: 14px;
          cursor: pointer; box-shadow: var(--shadow-sm); white-space: nowrap;
          transition: background 0.2s;
        }
        .ld-btn-secondary:hover { background: var(--bg-hover); }

        /* ── Filters panel ── */
        .ld-filters-panel {
          display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
          padding: 14px 16px; margin-bottom: 16px;
          background: var(--bg-secondary); border-radius: 20px;
          border: 1px solid var(--border-primary); box-shadow: var(--shadow-md);
        }
        .ld-search-input {
          width: 100%; padding: 10px 14px 10px 36px; font-size: 13px;
          background: var(--bg-tertiary); border: 1px solid var(--border-secondary);
          border-radius: 14px; color: var(--text-primary); outline: none;
          font-weight: 500; box-sizing: border-box; transition: border-color 0.2s;
        }
        .ld-search-input:focus { border-color: var(--color-ochre); }
        .ld-select {
          padding: 10px 14px; font-size: 13px;
          background: var(--bg-tertiary); border: 1px solid var(--border-secondary);
          border-radius: 14px; color: var(--text-primary); outline: none;
          font-weight: 500; cursor: pointer; transition: border-color 0.2s;
        }
        .ld-select:focus { border-color: var(--color-ochre); }
        .ld-filter-selects { display: contents; }
        .ld-filter-toggle { display: none; }
        .ld-filter-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-ochre); flex-shrink: 0; }

        /* ── View toggle ── */
        .ld-view-toggle {
          display: flex; align-items: center;
          background: var(--bg-tertiary); border-radius: 14px;
          border: 1px solid var(--border-secondary); padding: 3px;
        }
        .ld-view-btn { padding: 7px 10px; border-radius: 10px; border: none; background: transparent; color: var(--text-tertiary); cursor: pointer; display: flex; transition: all 0.2s; }
        .ld-view-btn.active { background: var(--bg-secondary); color: var(--text-primary); box-shadow: var(--shadow-sm); }

        /* ── Table header ── */
        .ld-table-header {
          display: grid; grid-template-columns: 40px 2.5fr 1.8fr 1.2fr 1fr 1fr 1.2fr 1fr 44px;
          gap: 12px; padding: 12px 20px;
          background: var(--bg-tertiary); border-bottom: 1px solid var(--border-primary);
          font-size: 10px; font-weight: 700; color: var(--text-tertiary);
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .ld-desktop-row { transition: background 0.15s; }
        .ld-desktop-row:hover { background: var(--bg-hover); }
        .ld-mobile-card { display: none; }

        /* ── Grid view ── */
        .ld-grid-view { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .ld-grid-card {
          background: var(--bg-secondary); border-radius: 20px; padding: 20px;
          text-decoration: none; box-shadow: var(--shadow-md);
          position: relative; overflow: hidden; display: block;
          transition: transform 0.2s cubic-bezier(0.22,0.61,0.36,1), box-shadow 0.2s;
        }
        .ld-grid-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }

        /* ── Bulk bar ── */
        .ld-bulk-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px; margin-bottom: 14px;
          background: var(--color-espresso); border-radius: 16px;
          box-shadow: var(--shadow-lg); flex-wrap: wrap; gap: 8px;
          animation: ld-slideDown 0.2s ease;
        }

        /* ── Pagination ── */
        .ld-pagination {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 16px; padding: 14px 20px;
          background: var(--bg-secondary); border-radius: 20px;
          border: 1px solid var(--border-primary); box-shadow: var(--shadow-md);
          flex-wrap: wrap; gap: 12px;
        }
        .ld-page-btn {
          padding: 8px 14px; font-size: 12px; font-weight: 600;
          color: var(--text-primary); background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary); border-radius: 12px;
          cursor: pointer; transition: all 0.2s;
        }
        .ld-page-btn:hover:not(:disabled) { background: var(--bg-hover); }
        .ld-page-num {
          width: 36px; height: 36px; font-size: 13px; font-weight: 600;
          color: var(--text-secondary); background: transparent;
          border: 1px solid transparent; border-radius: 12px; cursor: pointer;
          transition: all 0.2s;
        }
        .ld-page-num:hover:not(.ld-page-active) { background: var(--bg-hover); }
        .ld-page-num.ld-page-active { color: var(--color-cream); background: var(--color-espresso); }

        /* ════════════════════════════ TABLET ≤1100px ════════════════════════════ */
        @media (max-width: 1100px) {
          .ld-stats-grid { grid-template-columns: repeat(3, 1fr); }
          .ld-table-header { grid-template-columns: 40px 2fr 1.5fr 1.2fr 1fr 1fr 1fr 44px !important; }
          .ld-desktop-row { grid-template-columns: 40px 2fr 1.5fr 1.2fr 1fr 1fr 1fr 44px !important; }
          .ld-grid-view { grid-template-columns: repeat(2, 1fr); }
        }

        /* ════════════════════════════ MOBILE ≤768px ════════════════════════════ */
        @media (max-width: 768px) {
          .ld-header { margin-bottom: 16px; }
          .ld-btn-label { display: none; }
          .ld-btn-secondary { padding: 10px 12px; }

          .ld-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px; }
          .ld-stat-card { border-radius: 14px; padding: 14px; }

          .ld-filters-panel { flex-direction: column; align-items: stretch; gap: 10px; padding: 14px; }
          .ld-filter-toggle {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 10px 14px; font-size: 13px; font-weight: 600;
            color: var(--text-secondary); background: var(--bg-tertiary);
            border: 1px solid var(--border-secondary); border-radius: 14px;
            cursor: pointer; width: 100%; justify-content: center;
          }
          .ld-filter-selects { display: none; flex-direction: column; gap: 8px; }
          .ld-filter-selects.ld-filters-open { display: flex; }
          .ld-select { width: 100%; font-size: 16px !important; }
          .ld-search-input { font-size: 16px !important; }
          .ld-view-toggle { display: none; }

          .ld-table-header { display: none !important; }
          .ld-desktop-row { display: none !important; }
          .ld-mobile-card {
            display: block;
            margin: 0 12px 10px; padding: 14px;
            border: 1px solid var(--border-secondary); border-radius: 16px;
            background: var(--bg-secondary); text-decoration: none; color: inherit;
            transition: background 0.15s, box-shadow 0.15s;
          }
          .ld-mobile-card:last-of-type { margin-bottom: 12px; }
          .ld-mobile-card:active { background: var(--bg-hover); box-shadow: var(--shadow-sm); }

          .ld-grid-view { grid-template-columns: 1fr; gap: 10px; }
          .ld-grid-card { border-radius: 16px; padding: 16px; }
          .ld-bulk-bar { padding: 12px 14px; border-radius: 14px; }
          .ld-pagination { padding: 12px 14px; border-radius: 16px; gap: 8px; }
          .ld-page-btn { padding: 8px 10px; font-size: 12px; }
        }

        /* ════════════════════════════ SMALL ≤400px ════════════════════════════ */
        @media (max-width: 400px) {
          .ld-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .ld-stat-card { border-radius: 12px; padding: 12px; }
        }
      `}</style>
    </div>
  )
}

export default Leads