"use client";

import { useState, useEffect, useCallback, type JSX } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { MatchPropertiesForLead } from '../components/properties/MatchPropertiesForLead'
import toast from 'react-hot-toast'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  source: string
  budget: number | null
  currency: string
  location: string | null
  property_type: string | null
  intent: string | null
  score: string
  notes: string | null
  ai_score: string | null
  ai_points: number
  ai_confidence: number
  ai_reason: string | null
  ai_summary: string | null
  ai_recommended_action: string | null
  ai_buying_signals: string[]
  ai_missing_info: string[]
  ai_ideal_response_time: string | null
  ai_suggested_tone: string | null
  ai_model_used: string | null
  ai_latency_ms: number
  ai_scored_at: string | null
  ai_email_sent: boolean
  ai_email_sent_at: string | null
  ai_email_subject: string | null
  ai_email_body: string | null
  ai_email_status: string | null
  follow_up_step: number
  last_follow_up_at: string | null
  created_at: string
  agency_id: string
  assigned_to: string | null
  agent_name?: string | null
  initials?: string
}

interface LeadActivity {
  id: string
  lead_id: string
  activity_type: string
  description: string
  metadata: any
  created_at: string
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  ArrowLeft:     () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
  Mail:          () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
  Phone:         () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>),
  MapPin:        () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  Home:          () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  Calendar:      () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  Clock:         () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  Brain:         () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 017 4.5v1A2.5 2.5 0 009.5 8h5A2.5 2.5 0 0017 5.5v-1A2.5 2.5 0 0014.5 2h-5z"/><path d="M9 8v8m6-8v8M5.5 12A2.5 2.5 0 003 14.5v1A2.5 2.5 0 005.5 18h.5m12.5-6a2.5 2.5 0 012.5 2.5v1A2.5 2.5 0 0118.5 18H18M9 16h6m-3 0v4"/></svg>),
  Zap:           () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  Target:        () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
  Star:          () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  AlertCircle:   () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
  CheckCircle:   () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
  MessageSquare: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>),
  Share:         () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>),
  Edit:          () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Loader:        () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>),
  ChevronRight:  () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>),
  ChevronDown:   () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
  ChevronUp:     () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>),
  Copy:          () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>),
  Send:          () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>),
  Info:          () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>),
  TrendingUp:    () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
  Sparkle:       () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>),
  Dollar:        () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>),
}

// ─── Config ───────────────────────────────────────────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string; label: string }> = {
  hot:       { bg: 'rgba(220,38,38,0.06)',   text: '#DC2626',               dot: '#DC2626',               border: 'rgba(220,38,38,0.15)',   label: 'Hot' },
  warm:      { bg: 'rgba(217,175,40,0.06)',  text: '#D9AF28',               dot: '#D9AF28',               border: 'rgba(217,175,40,0.15)',  label: 'Warm' },
  cold:      { bg: 'rgba(59,130,246,0.06)',  text: '#3B82F6',               dot: '#3B82F6',               border: 'rgba(59,130,246,0.15)',  label: 'Cold' },
  new:       { bg: 'var(--bg-hover)',        text: 'var(--text-secondary)', dot: 'var(--text-tertiary)', border: 'var(--border-secondary)', label: 'New' },
  qualified: { bg: 'rgba(110,140,100,0.06)', text: 'var(--color-sage)',    dot: 'var(--color-sage)',    border: 'rgba(110,140,100,0.15)', label: 'Qualified' },
  contacted: { bg: 'rgba(147,112,219,0.06)', text: '#9370DB',               dot: '#9370DB',               border: 'rgba(147,112,219,0.15)', label: 'Contacted' },
  closed:    { bg: 'rgba(110,140,100,0.06)', text: 'var(--color-sage)',    dot: 'var(--color-sage)',    border: 'rgba(110,140,100,0.15)', label: 'Closed' },
}

const aiScoreConfig = {
  hot:     { emoji: '🔥', label: 'Hot',     bg: 'rgba(220,38,38,0.08)',   text: '#DC2626', border: 'rgba(220,38,38,0.2)',  bar: '#DC2626' },
  warm:    { emoji: '☀️', label: 'Warm',    bg: 'rgba(217,119,6,0.08)',   text: '#D97706', border: 'rgba(217,119,6,0.2)',  bar: '#D97706' },
  cold:    { emoji: '❄️', label: 'Cold',    bg: 'rgba(59,130,246,0.08)',  text: '#3B82F6', border: 'rgba(59,130,246,0.2)', bar: '#3B82F6' },
  pending: { emoji: '⏳', label: 'Pending', bg: 'rgba(100,100,100,0.08)', text: 'var(--text-tertiary)', border: 'var(--border-secondary)', bar: 'var(--text-tertiary)' },
}

const emailStatusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  sent:        { label: 'Sent',           color: 'var(--color-sage)', bg: 'rgba(110,140,100,0.08)', border: 'rgba(110,140,100,0.2)', icon: '✅' },
  draft_ready: { label: 'Draft Ready',    color: '#D97706',           bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.2)',   icon: '📝' },
  send_failed: { label: 'Send Failed',    color: '#DC2626',           bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.2)',   icon: '❌' },
  not_sent:    { label: 'Not Sent',       color: '#3B82F6',           bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',  icon: '❄️' },
  pending:     { label: 'Pending',        color: 'var(--text-tertiary)', bg: 'var(--bg-hover)',    border: 'var(--border-secondary)', icon: '⏳' },
  disabled:    { label: 'Auto-reply Off', color: 'var(--text-tertiary)', bg: 'var(--bg-hover)',    border: 'var(--border-secondary)', icon: '🔕' },
  no_agent:    { label: 'No Agent Found', color: '#D97706',           bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.2)',   icon: '⚠️' },
  error:       { label: 'Error',          color: '#DC2626',           bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.2)',   icon: '❌' },
}

const responseTimeConfig: Record<string, { label: string; color: string; bg: string }> = {
  immediately:     { label: 'Call immediately', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  within_1_hour:   { label: 'Within 1 hour',    color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  within_4_hours:  { label: 'Within 4 hours',   color: '#D9AF28', bg: 'rgba(217,175,40,0.08)' },
  within_24_hours: { label: 'Within 24 hours',  color: 'var(--color-sage)', bg: 'rgba(110,140,100,0.08)' },
}

const toneConfig: Record<string, { label: string; desc: string }> = {
  urgent:       { label: 'Urgent',       desc: 'Time-sensitive. Be direct.' },
  professional: { label: 'Professional', desc: 'Formal. Business-focused.' },
  friendly:     { label: 'Friendly',     desc: 'Warm and conversational.' },
  educational:  { label: 'Educational',  desc: 'Lead needs guidance.' },
}

const activityTypeConfig: Record<string, { color: string; icon: JSX.Element }> = {
  ai_scored:            { color: '#7C3AED',              icon: <Icons.Brain /> },
  ai_email_sent:        { color: 'var(--color-sage)',    icon: <Icons.Send /> },
  ai_draft_ready:       { color: '#D97706',              icon: <Icons.Edit /> },
  ai_email_send_failed: { color: '#DC2626',              icon: <Icons.AlertCircle /> },
  email_sent:           { color: 'var(--color-sage)',    icon: <Icons.Mail /> },
  status_changed:       { color: 'var(--color-ochre)',   icon: <Icons.TrendingUp /> },
  note_added:           { color: '#3B82F6',              icon: <Icons.MessageSquare /> },
  default:              { color: 'var(--color-ochre)',   icon: <Icons.Star /> },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function formatCurrency(amount: number | null): string {
  if (!amount) return 'Not specified'
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
}

function timeAgo(dateString: string): string {
  const now = new Date(), date = new Date(dateString)
  const s = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function copyToClipboard(text: string, label = 'Copied!') {
  navigator.clipboard.writeText(text); toast.success(label)
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
// Note: fontSize is 16px min to prevent iOS zoom on focus
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: 5,
  textTransform: 'uppercase', letterSpacing: '0.04em',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  // 16px prevents iOS Safari from zooming on input focus
  fontSize: 16, fontWeight: 500,
  background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
  borderRadius: 10, color: 'var(--text-primary)', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s ease',
}
const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: 'pointer',
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px',
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
      borderRadius: 20, border: '1px solid var(--border-primary)',
      boxShadow: 'var(--shadow-md)', padding: 'var(--ld-card-pad, 24px)',
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionHeader({ icon, title, color = 'var(--color-ochre)', badge, action }: {
  icon: JSX.Element; title: string; color?: string; badge?: string; action?: JSX.Element
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ color }}>{icon}</span>
        {title}
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: 'rgba(124,58,237,0.1)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {badge}
          </span>
        )}
      </h3>
      {action}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const LeadDetail = () => {
  const { id } = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [activities, setActivities] = useState<LeadActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', location: '', property_type: '', budget: '', status: '', source: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [emailExpanded, setEmailExpanded] = useState(false)
  const [approvingSend, setApprovingSend] = useState(false)

  const fetchLead = useCallback(async () => {
    if (!id) return
    setLoading(true); setError(null)
    try {
      const [leadRes, activitiesRes] = await Promise.all([
        supabase.from('leads').select('*, agent_profiles:assigned_to (name)').eq('id', id).single(),
        supabase.from('lead_activities').select('*').eq('lead_id', id).order('created_at', { ascending: false }).limit(20),
      ])
      if (leadRes.error) throw leadRes.error
      if (!leadRes.data) throw new Error('Lead not found')
      const d = leadRes.data
      setLead({ ...d, ai_buying_signals: d.ai_buying_signals || [], ai_missing_info: d.ai_missing_info || [], agent_name: d.agent_profiles?.name || 'Unassigned', initials: getInitials(d.name) })
      setActivities(activitiesRes.data || [])
      setEditForm({ name: d.name || '', email: d.email || '', phone: d.phone || '', location: d.location || '', property_type: d.property_type || '', budget: d.budget?.toString() || '', status: d.status || 'new', source: d.source || 'manual', notes: d.notes || '' })
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }, [id])

  useEffect(() => { fetchLead() }, [fetchLead])

  useEffect(() => {
    if (!id) return
    const channel = supabase.channel(`lead-detail-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads', filter: `id=eq.${id}` }, (payload) => {
        setLead(prev => prev ? { ...prev, ...(payload.new as Lead), ai_buying_signals: (payload.new as any).ai_buying_signals || [], ai_missing_info: (payload.new as any).ai_missing_info || [], initials: getInitials((payload.new as Lead).name) } : prev)
        supabase.from('lead_activities').select('*').eq('lead_id', id).order('created_at', { ascending: false }).limit(20).then(({ data }) => { if (data) setActivities(data) })
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [id])

  const handleSave = async () => {
    if (!lead) return
    setSaving(true)
    try {
      const { error } = await supabase.from('leads').update({
        name: editForm.name.trim(), email: editForm.email.trim().toLowerCase(),
        phone: editForm.phone.trim() || null, location: editForm.location.trim() || null,
        property_type: editForm.property_type || null, budget: editForm.budget ? parseFloat(editForm.budget) : null,
        status: editForm.status, source: editForm.source, notes: editForm.notes.trim() || null,
      }).eq('id', lead.id)
      if (error) throw error
      await supabase.from('lead_activities').insert({ lead_id: lead.id, activity_type: 'note_added', description: 'Lead details updated', metadata: { updated_by: 'agent' } })
      toast.success('Lead updated successfully')
      setEditMode(false); fetchLead()
    } catch (err: any) { toast.error(err.message || 'Failed to update lead') }
    finally { setSaving(false) }
  }

  const handleApproveSend = async () => {
    if (!lead?.ai_email_subject || !lead?.ai_email_body) return
    setApprovingSend(true)
    try {
      const { error } = await supabase.from('leads').update({ ai_email_status: 'approved_pending_send' }).eq('id', lead.id)
      await supabase.from('ai_drafts').update({ status: 'approved' }).eq('lead_id', lead.id).eq('status', 'pending')
      await supabase.from('lead_activities').insert({ lead_id: lead.id, activity_type: 'ai_email_sent', description: `Draft approved for sending to ${lead.email}`, metadata: { subject: lead.ai_email_subject } })
      if (error) throw error
      toast.success('Draft approved — email queued for sending')
      fetchLead()
    } catch { toast.error('Failed to approve draft') }
    finally { setApprovingSend(false) }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--color-ochre)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Icons.Loader /></div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading lead details...</p>
      </div>
    </div>
  )

  if (error || !lead) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Lead not found</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px' }}>{error}</p>
        <button onClick={() => router.push('/dashboard/leads')} style={{ padding: '10px 20px', borderRadius: 12, background: 'var(--color-espresso)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Back to Leads</button>
      </div>
    </div>
  )

  const status      = statusConfig[lead.status] || statusConfig.new
  const aiConf      = lead.ai_score ? aiScoreConfig[lead.ai_score as keyof typeof aiScoreConfig] : null
  const responseTime= lead.ai_ideal_response_time ? responseTimeConfig[lead.ai_ideal_response_time] : null
  const tone        = lead.ai_suggested_tone ? toneConfig[lead.ai_suggested_tone] : null
  const emailStatus = lead.ai_email_status ? emailStatusConfig[lead.ai_email_status] : null
  const hasEmailDraft = !!(lead.ai_email_subject && lead.ai_email_body)
  const isDraftReady  = lead.ai_email_status === 'draft_ready' && !lead.ai_email_sent

  const { agency } = useAuth()
  const agencyId = agency?.id

  const timelineItems = [
    { id: 'created', title: 'Lead Created', description: `${lead.name} entered via ${lead.source?.replace(/_/g, ' ') || 'manual entry'}`, timestamp: lead.created_at, color: 'var(--color-ochre)', icon: <Icons.Star /> },
    ...activities.map(a => ({
      id: a.id,
      title: a.description || a.activity_type.replace(/_/g, ' '),
      description: a.metadata ? Object.entries(a.metadata).filter(([k]) => k !== 'updated_by').map(([k, v]) => `${k}: ${v}`).join(' · ') : '',
      timestamp: a.created_at,
      color: (activityTypeConfig[a.activity_type] || activityTypeConfig.default).color,
      icon: (activityTypeConfig[a.activity_type] || activityTypeConfig.default).icon,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)', maxWidth: 1280, margin: '0 auto', padding: 'var(--ld-page-pad, 0 0 64px)' }}>

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Link href="/dashboard/leads" style={{ fontSize: 13, color: 'var(--text-tertiary)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icons.ArrowLeft /> Leads
        </Link>
        <span style={{ color: 'var(--border-primary)', fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</span>
      </div>

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="ld-page-header">
        {/* Avatar + name + badges */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            background: aiConf ? aiConf.bg : 'var(--color-espresso)',
            color: aiConf ? aiConf.text : 'var(--color-ochre)',
            border: aiConf ? `2px solid ${aiConf.border}` : '2px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700,
          }}>
            {lead.initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,4vw,30px)', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {lead.name}
            </h1>
            {/* Badge row — wraps naturally on mobile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: status.bg, color: status.text, border: `1px solid ${status.border}`, flexShrink: 0 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: status.dot }} />{status.label}
              </span>
              {aiConf && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: aiConf.bg, color: aiConf.text, border: `1px solid ${aiConf.border}`, flexShrink: 0 }}>
                  {aiConf.emoji} {aiConf.label} · {lead.ai_points}pts
                </span>
              )}
              {responseTime && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: responseTime.bg, color: responseTime.color, border: `1px solid ${responseTime.color}25`, flexShrink: 0 }}>
                  <Icons.Clock /> {responseTime.label}
                </span>
              )}
              {emailStatus && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: emailStatus.bg, color: emailStatus.color, border: `1px solid ${emailStatus.border}`, flexShrink: 0 }}>
                  {emailStatus.icon} {emailStatus.label}
                </span>
              )}
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', flexShrink: 0 }}>· {timeAgo(lead.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons — full-width on mobile */}
        <div className="ld-header-actions">
          <button onClick={() => setEditMode(!editMode)} className="ld-btn-secondary">
            <Icons.Edit /> {editMode ? 'Cancel' : 'Edit Lead'}
          </button>
          <button onClick={() => lead.email && window.open(`mailto:${lead.email}`)} disabled={!lead.email} className="ld-btn-primary" style={{ opacity: lead.email ? 1 : 0.5, cursor: lead.email ? 'pointer' : 'not-allowed' }}>
            <Icons.Mail /> Send Email
          </button>
        </div>
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <div className="ld-grid">

        {/* ── LEFT COLUMN ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Lead Information */}
          <Card>
            <SectionHeader icon={<Icons.Target />} title="Lead Information" />
            {editMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* 2-col → 1-col on mobile */}
                <div className="ld-form-2col">
                  <div><label style={labelStyle}>Full Name</label><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Email</label><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={inputStyle} /></div>
                </div>
                {/* 3-col → 1-col on mobile */}
                <div className="ld-form-3col">
                  <div><label style={labelStyle}>Phone</label><input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Location</label><input type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Budget ($)</label><input type="number" value={editForm.budget} onChange={e => setEditForm({ ...editForm, budget: e.target.value })} style={inputStyle} /></div>
                </div>
                <div className="ld-form-3col">
                  <div>
                    <label style={labelStyle}>Property Type</label>
                    <select value={editForm.property_type} onChange={e => setEditForm({ ...editForm, property_type: e.target.value })} style={selectStyle}>
                      <option value="">Select</option>
                      {['apartment','villa','house','condo','commercial','land','townhouse','penthouse'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} style={selectStyle}>
                      {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Source</label>
                    <select value={editForm.source} onChange={e => setEditForm({ ...editForm, source: e.target.value })} style={selectStyle}>
                      {['manual','website','referral','social_media','property_finder','bayut','facebook','google_ads','email_campaign','csv_import'].map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                    </select>
                  </div>
                </div>
                <div><label style={labelStyle}>Notes</label><textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' as const }} /></div>
                <div className="ld-form-2col">
                  <button onClick={() => setEditMode(false)} style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)', borderRadius: 14, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleSave} disabled={saving} style={{ padding: '12px', fontSize: 13, fontWeight: 700, color: '#fff', background: 'var(--color-espresso)', border: 'none', borderRadius: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {saving ? <><Icons.Loader /> Saving...</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="ld-info-2col">
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px' }}>Contact</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <InfoRow icon={<Icons.Mail />} label={lead.email} href={`mailto:${lead.email}`} isLink />
                    {lead.phone && <InfoRow icon={<Icons.Phone />} label={lead.phone} href={`tel:${lead.phone}`} isLink />}
                    {lead.location && <InfoRow icon={<Icons.MapPin />} label={lead.location} />}
                    {lead.property_type && <InfoRow icon={<Icons.Home />} label={lead.property_type} capitalize />}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px' }}>Details</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <DataRow label="Status" value={<span style={{ color: status.text, fontWeight: 600 }}>{status.label}</span>} />
                    <DataRow label="Source" value={lead.source?.replace(/_/g, ' ')} capitalize />
                    <DataRow label="Budget" value={<span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(lead.budget)}</span>} />
                    <DataRow label="Agent" value={lead.agent_name || 'Unassigned'} />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* AI Auto-Reply Card */}
          {hasEmailDraft && (
            <div style={{ background: 'linear-gradient(135deg, rgba(110,140,100,0.04) 0%, var(--bg-secondary) 60%)', backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${emailStatus?.border || 'rgba(110,140,100,0.2)'}`, boxShadow: 'var(--shadow-md)', padding: 'var(--ld-card-pad, 24px)' }}>
              <SectionHeader
                icon={<Icons.Mail />}
                title="AI Auto-Reply"
                color="var(--color-sage)"
                badge={lead.ai_email_sent ? 'Sent' : 'Draft'}
                action={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {emailStatus && <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: emailStatus.bg, color: emailStatus.color, border: `1px solid ${emailStatus.border}` }}>{emailStatus.icon} {emailStatus.label}</span>}
                    {lead.ai_email_sent_at && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{timeAgo(lead.ai_email_sent_at)}</span>}
                  </div>
                }
              />
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>Subject</p>
                  <button onClick={() => copyToClipboard(lead.ai_email_subject!, 'Subject copied!')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)', borderRadius: 8, cursor: 'pointer' }}>
                    <Icons.Copy /> Copy
                  </button>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0, padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 10, border: '1px solid var(--border-secondary)', wordBreak: 'break-word' }}>
                  {lead.ai_email_subject}
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>Email Body</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => copyToClipboard(lead.ai_email_body!, 'Email body copied!')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)', borderRadius: 8, cursor: 'pointer' }}><Icons.Copy /> Copy</button>
                    <button onClick={() => setEmailExpanded(!emailExpanded)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)', borderRadius: 8, cursor: 'pointer' }}>
                      {emailExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />} {emailExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-secondary)', whiteSpace: 'pre-wrap' as const, maxHeight: emailExpanded ? 'none' : 160, overflow: 'hidden', position: 'relative', wordBreak: 'break-word' }}>
                  {lead.ai_email_body}
                  {!emailExpanded && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(to bottom, transparent, var(--bg-tertiary))', borderRadius: '0 0 12px 12px' }} />}
                </div>
              </div>
              {isDraftReady && (
                <div className="ld-approve-bar">
                  <div style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)', minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: '#D97706', fontWeight: 500, margin: 0 }}>📝 Draft ready — review above and approve to send.</p>
                  </div>
                  <button onClick={handleApproveSend} disabled={approvingSend} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: 13, fontWeight: 700, color: '#fff', background: 'var(--color-sage)', border: 'none', borderRadius: 12, cursor: approvingSend ? 'not-allowed' : 'pointer', opacity: approvingSend ? 0.7 : 1, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
                    {approvingSend ? <><Icons.Loader /> Sending...</> : <><Icons.Send /> Approve &amp; Send</>}
                  </button>
                </div>
              )}
              {lead.ai_email_sent && lead.ai_email_sent_at && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(110,140,100,0.12)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: 'var(--color-sage)', flexShrink: 0, marginTop: 1 }}><Icons.CheckCircle /></span>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Sent to <strong>{lead.email}</strong> on {new Date(lead.ai_email_sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AI Analysis */}
          {lead.ai_score && lead.ai_score !== 'pending' && (
            <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.04) 0%, var(--bg-secondary) 60%)', backdropFilter: 'blur(16px)', borderRadius: 20, border: '1px solid rgba(124,58,237,0.15)', boxShadow: 'var(--shadow-md)', padding: 'var(--ld-card-pad, 24px)' }}>
              <SectionHeader icon={<Icons.Brain />} title="AI Analysis" color="#7C3AED" badge="RevaCore AI" />
              {lead.ai_summary && (
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 8px' }}>Lead Summary</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7, padding: '12px 14px', background: 'rgba(124,58,237,0.04)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.08)' }}>{lead.ai_summary}</p>
                </div>
              )}
              {lead.ai_recommended_action && (
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 8px' }}>Recommended Action</p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'rgba(110,140,100,0.06)', borderRadius: 12, border: '1px solid rgba(110,140,100,0.15)' }}>
                    <span style={{ color: 'var(--color-sage)', flexShrink: 0, marginTop: 1 }}><Icons.Target /></span>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{lead.ai_recommended_action}</p>
                  </div>
                </div>
              )}
              <div className="ld-signals-grid" style={{ marginBottom: 18 }}>
                {lead.ai_buying_signals?.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 4 }}><Icons.CheckCircle /> Buying Signals</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {lead.ai_buying_signals.map((signal, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--color-sage)', flexShrink: 0 }}>✓</span>{signal}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {lead.ai_missing_info?.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 4 }}><Icons.AlertCircle /> Missing Info</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {lead.ai_missing_info.map((info, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                          <span style={{ color: '#D97706', flexShrink: 0 }}>!</span>{info}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="ld-tone-grid" style={{ marginBottom: 14 }}>
                {responseTime && (
                  <div style={{ padding: '12px 14px', borderRadius: 12, background: responseTime.bg, border: `1px solid ${responseTime.color}25` }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: responseTime.color, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 3px' }}>Response Time</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: responseTime.color, margin: 0 }}>{responseTime.label}</p>
                  </div>
                )}
                {tone && (
                  <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(99,143,179,0.06)', border: '1px solid rgba(99,143,179,0.15)' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#638fb3', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 3px' }}>Suggested Tone</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#638fb3', margin: '0 0 2px' }}>{tone.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0 }}>{tone.desc}</p>
                  </div>
                )}
              </div>
              {lead.ai_model_used && (
                <div style={{ paddingTop: 12, borderTop: '1px solid rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Scored by <strong>{lead.ai_model_used}</strong></span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{lead.ai_latency_ms}ms · {timeAgo(lead.ai_scored_at || lead.created_at)}</span>
                </div>
              )}
            </div>
          )}

          {/* Pending AI */}
          {lead.ai_score === 'pending' && (
            <Card style={{ background: 'rgba(100,100,100,0.03)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ color: 'var(--color-ochre)' }}><Icons.Loader /></div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>AI Scoring in Progress</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{lead.ai_reason || 'Analyzing lead data...'}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Notes */}
          {!editMode && lead.notes && (
            <Card>
              <SectionHeader icon={<Icons.Edit />} title="Notes" />
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{lead.notes}</p>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card>
            <SectionHeader icon={<Icons.Clock />} title="Activity Timeline" action={<span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{timelineItems.length} events</span>} />
            {timelineItems.length === 0
              ? <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0, textAlign: 'center', padding: '20px 0' }}>No activity yet</p>
              : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {timelineItems.map((item, idx) => (
                    <div key={item.id} style={{ position: 'relative', paddingLeft: 34, marginBottom: idx < timelineItems.length - 1 ? 20 : 0 }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 26, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${item.color}25` }}>
                          {item.icon}
                        </div>
                        {idx < timelineItems.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 12, marginTop: 4, background: `linear-gradient(to bottom, ${item.color}30, transparent)` }} />}
                      </div>
                      <div style={{ paddingTop: 2 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px' }}>{item.title}</p>
                        {item.description && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 4px', lineHeight: 1.4, wordBreak: 'break-word' }}>{item.description}</p>}
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{timeAgo(item.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </Card>
        </div>

        {/* ── RIGHT COLUMN (sidebar) ─────────────────────────────────────── */}
        <div className="ld-sidebar">

          {/* Matching Properties */}
          {agencyId && (
            <MatchPropertiesForLead
              leadId={lead.id}
              agencyId={agencyId}
              leadBudget={lead.budget}
              leadPropertyType={lead.property_type}
              leadLocation={lead.location}
            />
          )}

          {/* AI Score */}
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(124,58,237,0.08)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Icons.Brain />
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Lead Score</p>
              {lead.ai_score && lead.ai_score !== 'pending' && aiConf ? (
                <>
                  <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto 14px' }}>
                    <svg width="110" height="110" viewBox="0 0 110 110">
                      <circle cx="55" cy="55" r="48" fill="none" stroke="var(--bg-hover)" strokeWidth="8" />
                      <circle cx="55" cy="55" r="48" fill="none" stroke={aiConf.bar} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${(lead.ai_points / 100) * 301.59} 301.59`}
                        transform="rotate(-90 55 55)"
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 28, fontWeight: 800, color: aiConf.text, lineHeight: 1, letterSpacing: '-0.02em' }}>{lead.ai_points}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>/ 100</span>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 700, background: aiConf.bg, color: aiConf.text, border: `1px solid ${aiConf.border}` }}>
                    {aiConf.emoji} {aiConf.label} Lead
                  </span>
                  {lead.ai_reason && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '10px 0 0', lineHeight: 1.5 }}>{lead.ai_reason}</p>}
                  {lead.ai_confidence > 0 && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Confidence</span>
                        <span style={{ fontSize: 11, fontWeight: 700 }}>{lead.ai_confidence}%</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 3, background: 'var(--bg-hover)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, width: `${lead.ai_confidence}%`, background: aiConf.bar, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: '20px 0' }}>
                  {lead.ai_score === 'pending' ? 'Scoring in progress...' : 'Not yet scored'}
                </p>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <SectionHeader icon={<Icons.Zap />} title="Quick Actions" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: <Icons.Mail />, label: 'Send Email', onClick: () => window.open(`mailto:${lead.email}`), disabled: !lead.email },
                { icon: <Icons.Phone />, label: 'Call Lead', onClick: () => lead.phone && window.open(`tel:${lead.phone}`), disabled: !lead.phone },
                { icon: <Icons.Calendar />, label: 'Schedule Appointment', onClick: () => router.push('/dashboard/appointments') },
                { icon: <Icons.MessageSquare />, label: 'Add Note', onClick: () => setEditMode(true) },
                { icon: <Icons.Share />, label: 'Copy Lead Link', onClick: () => copyToClipboard(window.location.href, 'Link copied!') },
              ].map((action, idx) => (
                <button key={idx} onClick={action.onClick} disabled={action.disabled} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 14px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: 12, cursor: action.disabled ? 'not-allowed' : 'pointer', opacity: action.disabled ? 0.4 : 1, textAlign: 'left' as const, transition: 'background 0.15s' }}>
                  <span style={{ color: 'var(--text-tertiary)', display: 'flex', flexShrink: 0 }}>{action.icon}</span>
                  {action.label}
                  <span style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}><Icons.ChevronRight /></span>
                </button>
              ))}
            </div>
          </Card>

          {/* Lead Meta */}
          <Card>
            <SectionHeader icon={<Icons.Info />} title="Lead Meta" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <DataRow label="Lead ID" value={lead.id.slice(0, 8) + '...'} mono />
              <DataRow label="Created" value={new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
              <DataRow label="Source" value={lead.source?.replace(/_/g, ' ')} capitalize />
              <DataRow label="Follow-up" value={`Step ${lead.follow_up_step || 0}`} />
              {lead.last_follow_up_at && <DataRow label="Last Follow-up" value={timeAgo(lead.last_follow_up_at)} />}
              {lead.ai_model_used && <DataRow label="AI Model" value={lead.ai_model_used} />}
              {lead.ai_latency_ms > 0 && <DataRow label="Score Speed" value={`${lead.ai_latency_ms}ms`} />}
              {lead.ai_email_status && (
                <DataRow label="Email Status" value={
                  <span style={{ color: emailStatusConfig[lead.ai_email_status]?.color || 'var(--text-secondary)' }}>
                    {emailStatusConfig[lead.ai_email_status]?.icon} {emailStatusConfig[lead.ai_email_status]?.label || lead.ai_email_status}
                  </span>
                } />
              )}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        /* ── Tokens ── */
        :root {
          --ld-page-pad: 0 0 64px;
          --ld-card-pad: 24px;
        }

        /* ── Main 2-col grid ── */
        .ld-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: start;
        }

        /* ── Sidebar: sticky on desktop ── */
        .ld-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 24px;
        }

        /* ── Page header ── */
        .ld-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .ld-header-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .ld-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 18px; font-size: 13px; font-weight: 700;
          color: var(--color-cream); background: var(--color-espresso);
          border: none; border-radius: 14px; cursor: pointer;
          white-space: nowrap;
        }
        .ld-btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 16px; font-size: 13px; font-weight: 600;
          color: var(--text-secondary); background: var(--bg-secondary);
          border: 1px solid var(--border-primary); border-radius: 14px;
          cursor: pointer; white-space: nowrap;
        }

        /* ── Form grids ── */
        .ld-form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ld-form-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

        /* ── Info view 2-col ── */
        .ld-info-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

        /* ── Buying signals / missing info ── */
        .ld-signals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* ── Response time / tone ── */
        .ld-tone-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* ── Approve bar ── */
        .ld-approve-bar {
          display: flex; align-items: center; gap: 10px;
          margin-top: 14px; padding-top: 14px;
          border-top: 1px solid rgba(110,140,100,0.12);
          flex-wrap: wrap;
        }

        /* ── Keyframes ── */
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

        /* ══════════════════════════════════════════════════════════
           TABLET — ≤960px: stack sidebar below main column
        ══════════════════════════════════════════════════════════ */
        @media (max-width: 960px) {
          .ld-grid {
            grid-template-columns: 1fr;
          }
          /* Sidebar loses sticky — just flows in document order */
          .ld-sidebar {
            position: static;
            /* On tablet/mobile the sidebar goes FIRST (AI score visible immediately),
               then content. Use order to reorder visually. */
          }
          /* Reorder: main content first, sidebar second on mobile */
          .ld-sidebar { order: 2; }
          .ld-grid > div:first-child { order: 1; }
        }

        /* ══════════════════════════════════════════════════════════
           MOBILE — ≤768px
        ══════════════════════════════════════════════════════════ */
        @media (max-width: 768px) {
          :root {
            --ld-page-pad: 0 0 48px;
            --ld-card-pad: 16px;
          }

          /* Header: stack avatar+name on top, buttons full-width below */
          .ld-page-header {
            flex-direction: column;
            gap: 14px;
            margin-bottom: 20px;
          }
          .ld-header-actions {
            width: 100%;
            gap: 8px;
          }
          .ld-btn-primary,
          .ld-btn-secondary {
            flex: 1;
            justify-content: center;
            padding: 12px 14px;
            font-size: 14px;
          }

          /* Form grids: all single column on mobile */
          .ld-form-2col,
          .ld-form-3col {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          /* Info view: single column */
          .ld-info-2col {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          /* AI signals / tone grids: single column */
          .ld-signals-grid,
          .ld-tone-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          /* Approve bar: stack vertically */
          .ld-approve-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .ld-approve-bar button {
            width: 100%;
            justify-content: center;
          }

          /* Cards */
          .ld-grid > div:first-child > div,
          .ld-sidebar > div {
            border-radius: 16px;
          }
        }

        /* ══════════════════════════════════════════════════════════
           SMALL MOBILE — ≤400px
        ══════════════════════════════════════════════════════════ */
        @media (max-width: 400px) {
          :root {
            --ld-card-pad: 14px;
          }
        }
      `}</style>
    </div>
  )
}

// ─── Utility Components ───────────────────────────────────────────────────────
function InfoRow({ icon, label, href, isLink, capitalize }: { icon: JSX.Element; label: string; href?: string; isLink?: boolean; capitalize?: boolean }) {
  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
      <span style={{ color: 'var(--text-tertiary)', display: 'flex', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontWeight: 500, color: isLink ? 'var(--color-ochre)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, textTransform: capitalize ? 'capitalize' : 'none' }}>{label}</span>
    </div>
  )
  if (isLink && href) return <a href={href} style={{ textDecoration: 'none' }}>{content}</a>
  return content
}

function DataRow({ label, value, capitalize, mono }: { label: string; value: React.ReactNode; capitalize?: boolean; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: capitalize ? 'capitalize' : 'none', fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right' as const }}>
        {value || '—'}
      </span>
    </div>
  )
}

export default LeadDetail