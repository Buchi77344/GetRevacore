"use client";

import { useState, useEffect, useCallback, type JSX } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const Icons = {
  Circle: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>),
  Diamond: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l10 10-10 10L2 12z" /></svg>),
  Pentagon: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l9.5 7-3.5 11H6L2.5 9z" /></svg>),
  Hexagon: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l9 5v10l-9 5-9-5V7z" /></svg>),
  Star: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 6.5 1-4.7 4.5 1.1 6.5L12 17l-5.9 3 1.1-6.5L2.5 9l6.5-1z" /></svg>),
  Plus: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>),
  Search: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>),
  Clock: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>),
  Mail: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>),
  Phone: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>),
  Close: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>),
  MoreVertical: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>),
  EmptyBox: () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>),
  Filter: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>),
  Pipeline: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="6" rx="1" /><rect x="2" y="11" width="15" height="6" rx="1" opacity="0.6" /><rect x="2" y="19" width="10" height="2" rx="1" opacity="0.3" /></svg>),
  CheckCircle: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>),
  Target: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>),
  TrendingUp: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>),
  Chart: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>),
  Note: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>),
  Loader: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>),
  Building: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/></svg>),
}

interface Deal {
  id: string
  lead_id: string | null
  property_id: string | null
  agency_id: string
  value: number
  currency: string
  stage: string
  status: string
  closed_at: string | null
  created_at: string
  lead_name?: string
  lead_email?: string
  lead_phone?: string
  property_title?: string
  initials?: string
}

interface Activity {
  id: string
  deal_id: string
  deal_title: string
  action: string
  time: string
  initials: string
  color: string
}

const STAGES = ['new', 'contacted', 'qualified', 'proposal', 'closed']

const STAGE_CONFIG: Record<string, { color: string; accentBg: string; borderGlow: string; icon: JSX.Element; label: string }> = {
  new:       { color: 'var(--color-slate)',      accentBg: 'rgba(90, 85, 95, 0.08)',    borderGlow: 'rgba(90, 85, 95, 0.12)',    icon: <Icons.Circle />,   label: 'New' },
  contacted: { color: 'var(--color-ochre)',      accentBg: 'rgba(180, 130, 70, 0.08)',  borderGlow: 'rgba(180, 130, 70, 0.12)',  icon: <Icons.Diamond />,  label: 'Contacted' },
  qualified: { color: 'var(--color-terracotta)', accentBg: 'rgba(195, 95, 70, 0.08)',   borderGlow: 'rgba(195, 95, 70, 0.1)',    icon: <Icons.Pentagon />, label: 'Qualified' },
  proposal:  { color: '#B8860B',                 accentBg: 'rgba(184, 134, 11, 0.08)',  borderGlow: 'rgba(184, 134, 11, 0.12)',  icon: <Icons.Hexagon />,  label: 'Proposal' },
  closed:    { color: 'var(--color-sage)',       accentBg: 'rgba(110, 140, 100, 0.08)', borderGlow: 'rgba(110, 140, 100, 0.12)', icon: <Icons.Star />,     label: 'Closed' },
}

function fmt(v: number): string {
  return v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`
}

function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function timeAgo(dateString: string): string {
  const now = new Date(), date = new Date(dateString)
  const s = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`
  return date.toLocaleDateString()
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const cfg: Record<string, { bg: string; text: string; dot: string; border: string }> = {
    high:   { bg: 'rgba(220, 38, 38, 0.08)',   text: '#DC2626', dot: '#DC2626', border: 'rgba(220, 38, 38, 0.2)' },
    medium: { bg: 'rgba(217, 175, 40, 0.08)',  text: '#D9AF28', dot: '#D9AF28', border: 'rgba(217, 175, 40, 0.2)' },
    low:    { bg: 'rgba(110, 140, 100, 0.08)', text: 'var(--color-sage)', dot: 'var(--color-sage)', border: 'rgba(110, 140, 100, 0.2)' },
  }
  const c = cfg[priority] || cfg.medium
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} />{priority}
    </span>
  )
}

const WinBar = ({ stage }: { stage: string }) => {
  const prob: Record<string, number> = { new: 10, contacted: 25, qualified: 50, proposal: 75, closed: 100 }
  const p = prob[stage] || 0
  const color = p >= 75 ? 'var(--color-sage)' : p >= 50 ? '#B8860B' : 'var(--color-slate)'
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>Win probability</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{p}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 100, background: 'var(--bg-hover)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 100, width: `${p}%`, background: color, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

const DealModal = ({ deal, onClose, onMove, onUpdate }: { deal: Deal; onClose: () => void; onMove: (id: string, dir: string) => void; onUpdate: (id: string, data: Partial<Deal>) => void }) => {
  const [editMode, setEditMode] = useState(false)
  const [editValue, setEditValue] = useState(deal.value.toString())
  const currentIdx = STAGES.indexOf(deal.stage)

  const handleSave = async () => {
    onUpdate(deal.id, { value: parseFloat(editValue) || deal.value })
    setEditMode(false)
    toast.success('Deal updated')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-secondary)', borderRadius: 24, border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 560, overflow: 'hidden', backdropFilter: 'blur(20px)', animation: 'modalIn 0.25s cubic-bezier(0.22, 0.61, 0.36, 1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ height: 3, width: '100%', background: STAGE_CONFIG[deal.stage].color }} />
        <div style={{ padding: 'clamp(16px, 4vw, 24px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.property_title || 'Deal'}</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{deal.lead_name || 'Unknown Contact'}</p>
            </div>
            <button onClick={onClose} style={{ padding: 8, borderRadius: 10, background: 'var(--bg-hover)', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', flexShrink: 0 }}>
              <Icons.Close />
            </button>
          </div>

          <div className="deal-modal-grid">
            {[
              { label: 'Value', val: editMode ? null : fmt(deal.value) },
              { label: 'Stage', val: STAGE_CONFIG[deal.stage].label },
              { label: 'Status', val: deal.status },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: 'var(--bg-tertiary)', borderRadius: 14, padding: 12, border: '1px solid var(--border-secondary)' }}>
                <p style={{ fontSize: 10, color: 'var(--text-tertiary)', margin: '0 0 2px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                {label === 'Value' && editMode ? (
                  <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} style={{ width: '100%', padding: 4, fontSize: 16, fontWeight: 700, border: '1px solid var(--border-secondary)', borderRadius: 8, background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                ) : (
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{val}</p>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pipeline Stage</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {STAGES.map((s, i) => (
                <div key={s} style={{ flex: 1, height: 6, borderRadius: 100, background: i <= currentIdx ? STAGE_CONFIG[s].color : 'var(--bg-hover)', transition: 'background 0.3s ease' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {STAGES.map(s => <span key={s} style={{ fontSize: 10, fontWeight: 600, color: STAGE_CONFIG[s].color }}>{STAGE_CONFIG[s].label}</span>)}
            </div>
          </div>

          <WinBar stage={deal.stage} />

          {deal.lead_name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0', padding: 12, background: 'var(--bg-tertiary)', borderRadius: 14, border: '1px solid var(--border-secondary)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-espresso)', color: 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{deal.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.lead_name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{deal.lead_email || 'No email'}</p>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {deal.lead_email && <a href={`mailto:${deal.lead_email}`} style={{ padding: 8, borderRadius: 10, background: 'var(--bg-hover)', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}><Icons.Mail /></a>}
                {deal.lead_phone && <a href={`tel:${deal.lead_phone}`} style={{ padding: 8, borderRadius: 10, background: 'var(--bg-hover)', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}><Icons.Phone /></a>}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16, padding: 12, background: 'rgba(180,130,70,0.06)', borderRadius: 14, border: '1px solid rgba(180,130,70,0.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.Clock />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Created {timeAgo(deal.created_at)}</span>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {!editMode ? (
              <>
                {currentIdx > 0 && (
                  <button onClick={() => { onMove(deal.id, 'left'); onClose() }} style={{ flex: 1, minWidth: 100, padding: '12px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)', borderRadius: 14, cursor: 'pointer' }}>← {STAGE_CONFIG[STAGES[currentIdx - 1]].label}</button>
                )}
                <button onClick={() => { setEditMode(true); setEditValue(deal.value.toString()) }} style={{ flex: 1, minWidth: 80, padding: '12px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)', borderRadius: 14, cursor: 'pointer' }}>Edit</button>
                {currentIdx < STAGES.length - 1 && (
                  <button onClick={() => { onMove(deal.id, 'right'); onClose() }} style={{ flex: 1, minWidth: 100, padding: '12px 10px', fontSize: 12, fontWeight: 700, color: 'var(--color-cream)', background: STAGE_CONFIG[STAGES[currentIdx + 1]].color, border: 'none', borderRadius: 14, cursor: 'pointer' }}>→ {STAGE_CONFIG[STAGES[currentIdx + 1]].label}</button>
                )}
              </>
            ) : (
              <>
                <button onClick={() => setEditMode(false)} style={{ flex: 1, padding: '12px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)', borderRadius: 14, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} style={{ flex: 1, padding: '12px', fontSize: 13, fontWeight: 700, color: 'var(--color-cream)', background: 'var(--color-espresso)', border: 'none', borderRadius: 14, cursor: 'pointer' }}>Save Changes</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const AddDealModal = ({ isOpen, onClose, onSuccess, agencyId }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; agencyId: string | undefined }) => {
  const [form, setForm] = useState({ lead_id: '', property_id: '', value: '', stage: 'new', status: 'active' })
  const [leads, setLeads] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && agencyId) {
      const fetchOptions = async () => {
        const { data: leadsData } = await supabase.from('leads').select('id, name').eq('agency_id', agencyId).order('name')
        const { data: propsData } = await supabase.from('properties').select('id, title').eq('agency_id', agencyId).order('title')
        setLeads(leadsData || [])
        setProperties(propsData || [])
      }
      fetchOptions()
    }
  }, [isOpen, agencyId])

  const handleSubmit = async () => {
    if (!form.value || !agencyId) { toast.error('Please fill in all required fields'); return }
    setLoading(true)
    try {
      const { error } = await supabase.from('deals').insert({ agency_id: agencyId, lead_id: form.lead_id || null, property_id: form.property_id || null, value: parseFloat(form.value), stage: form.stage, status: form.status, currency: 'USD' })
      if (error) throw error
      toast.success('Deal added successfully!')
      onSuccess()
      setForm({ lead_id: '', property_id: '', value: '', stage: 'new', status: 'active' })
    } catch (err: any) {
      toast.error(err.message || 'Failed to add deal')
    } finally { setLoading(false) }
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-secondary)', borderRadius: 24, border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 480, padding: 24, animation: 'modalIn 0.25s cubic-bezier(0.22, 0.61, 0.36, 1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Add New Deal</h3>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, background: 'var(--bg-hover)', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}><Icons.Close /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><label style={labelStyle}>Lead (optional)</label><select value={form.lead_id} onChange={e => setForm({ ...form, lead_id: e.target.value })} style={selectStyle}><option value="">Select a lead</option>{leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
          <div><label style={labelStyle}>Property (optional)</label><select value={form.property_id} onChange={e => setForm({ ...form, property_id: e.target.value })} style={selectStyle}><option value="">Select a property</option>{properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
          <div><label style={labelStyle}>Deal Value *</label><input type="number" placeholder="500000" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} style={inputStyle} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><label style={labelStyle}>Stage</label><select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })} style={selectStyle}>{STAGES.map(s => <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>)}</select></div>
            <div><label style={labelStyle}>Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={selectStyle}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button onClick={handleSubmit} disabled={loading} style={{ ...submitBtnStyle, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Adding...' : 'Add Deal'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const DealCard = ({ deal, onMove, onClick }: { deal: Deal; onMove: (id: string, dir: string) => void; onClick: (deal: Deal) => void }) => {
  const [hovered, setHovered] = useState(false)
  const currentIdx = STAGES.indexOf(deal.stage)
  const cfg = STAGE_CONFIG[deal.stage]
  return (
    <div style={{ background: 'var(--bg-primary)', backdropFilter: 'blur(16px)', borderRadius: 16, border: `1px solid ${hovered ? cfg.borderGlow : 'var(--border-secondary)'}`, boxShadow: hovered ? `0 8px 32px ${cfg.borderGlow}, var(--shadow-md)` : 'var(--shadow-sm)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)', position: 'relative' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onClick(deal)}>
      <div style={{ height: 2, width: '100%', background: cfg.color }} />
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <PriorityBadge priority="medium" />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(deal.value)}</span>
        </div>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', lineHeight: 1.3 }}>{deal.property_title || 'Untitled Deal'}</h4>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '0 0 8px' }}>{deal.lead_name || 'No contact'}</p>
        <WinBar stage={deal.stage} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-espresso)', color: 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{deal.initials || '??'}</div>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{deal.lead_name || 'Unknown'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-tertiary)' }}><Icons.Clock />{timeAgo(deal.created_at)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${hovered ? 'var(--border-primary)' : 'transparent'}`, maxHeight: hovered ? 40 : 0, opacity: hovered ? 1 : 0, overflow: 'hidden', transition: 'all 0.25s ease' }}>
          <button onClick={e => { e.stopPropagation(); onMove(deal.id, 'left') }} disabled={currentIdx === 0} style={{ flex: 1, padding: '6px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-hover)', border: 'none', borderRadius: 10, cursor: currentIdx === 0 ? 'not-allowed' : 'pointer', opacity: currentIdx === 0 ? 0.3 : 1 }}>← Prev</button>
          <button onClick={e => { e.stopPropagation(); onClick(deal) }} style={{ flex: 1, padding: '6px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-hover)', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Details</button>
          <button onClick={e => { e.stopPropagation(); onMove(deal.id, 'right') }} disabled={currentIdx === STAGES.length - 1} style={{ flex: 1, padding: '6px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-hover)', border: 'none', borderRadius: 10, cursor: currentIdx === STAGES.length - 1 ? 'not-allowed' : 'pointer', opacity: currentIdx === STAGES.length - 1 ? 0.3 : 1 }}>Next →</button>
        </div>
      </div>
    </div>
  )
}

const PipelineColumn = ({ stageId, deals, onMove, onCardClick, onAddDeal }: { stageId: string; deals: Deal[]; onMove: (id: string, dir: string) => void; onCardClick: (deal: Deal) => void; onAddDeal: (stage: string) => void }) => {
  const cfg = STAGE_CONFIG[stageId]
  const total = deals.reduce((s, d) => s + d.value, 0)
  return (
    <div className="pipeline-column" style={{ flexShrink: 0, width: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: cfg.color, display: 'flex' }}>{cfg.icon}</span>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{cfg.label}</h3>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-hover)', padding: '2px 10px', borderRadius: 100 }}>{deals.length}</span>
        </div>
      </div>
      <div style={{ marginBottom: 8, padding: '0 4px', display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Total</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(total)}</span>
      </div>
      <div style={{ marginBottom: 12, padding: '0 4px' }}>
        <div style={{ height: 3, borderRadius: 100, background: 'var(--bg-hover)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 100, width: `${Math.min(100, (deals.length / 4) * 100)}%`, background: cfg.color, transition: 'width 0.4s ease' }} />
        </div>
      </div>
      <div style={{ minHeight: 400, borderRadius: 16, padding: 8, background: 'var(--bg-tertiary)', backdropFilter: 'blur(12px)', border: '2px solid transparent' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {deals.map(deal => <DealCard key={deal.id} deal={deal} onMove={onMove} onClick={onCardClick} />)}
        </div>
        {deals.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: 'var(--text-tertiary)' }}><Icons.EmptyBox /></div>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', margin: 0 }}>No deals in this stage</p>
          </div>
        )}
      </div>
      <button onClick={() => onAddDeal(stageId)} style={{ marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 16px', background: 'var(--bg-secondary)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-primary)', borderRadius: 16, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: 'var(--shadow-sm)' }}>
        <Icons.Plus /> Add deal
      </button>
    </div>
  )
}

const ForecastPanel = ({ deals }: { deals: Deal[] }) => {
  const weights: Record<string, number> = { new: 0.1, contacted: 0.25, qualified: 0.5, proposal: 0.75, closed: 1 }
  const weightedTotal = deals.reduce((s, d) => s + d.value * (weights[d.stage] || 0), 0)
  const closedValue = deals.filter(d => d.stage === 'closed').reduce((s, d) => s + d.value, 0)
  const pipelineValue = deals.reduce((s, d) => s + d.value, 0)
  const convRate = deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'closed').length / deals.length) * 100) : 0
  const cards = [
    { label: 'Pipeline Value',    val: fmt(pipelineValue),    sub: 'All active deals',           icon: <Icons.Pipeline />,    color: 'var(--color-ochre)',     accentBg: 'rgba(180,130,70,0.06)' },
    { label: 'Weighted Forecast', val: fmt(weightedTotal),    sub: 'Probability-adjusted',       icon: <Icons.Target />,      color: 'var(--color-terracotta)',accentBg: 'rgba(195,95,70,0.06)' },
    { label: 'Closed This Period',val: fmt(closedValue),      sub: `${deals.filter(d=>d.stage==='closed').length} deals won`, icon: <Icons.CheckCircle />, color: 'var(--color-sage)', accentBg: 'rgba(110,140,100,0.06)' },
    { label: 'Conversion Rate',   val: `${convRate}%`,        sub: 'Deals to close',             icon: <Icons.TrendingUp />,  color: '#B8860B',               accentBg: 'rgba(184,134,11,0.06)' },
  ]
  return (
    <div className="pipeline-forecast-grid">
      {cards.map(({ label, val, sub, icon, color, accentBg }) => (
        <div key={label} style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: 18, border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderRadius: '0 0 0 100%', background: accentBg, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
            <span style={{ color, display: 'flex', flexShrink: 0 }}>{icon}</span>
          </div>
          <p style={{ fontSize: 'clamp(18px,3vw,26px)', fontWeight: 700, color, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{val}</p>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0, fontWeight: 500 }}>{sub}</p>
        </div>
      ))}
    </div>
  )
}

const ActivityFeed = ({ deals }: { deals: Deal[] }) => {
  const activities: Activity[] = deals.slice(0, 5).map(d => ({
    id: d.id, deal_id: d.id, deal_title: d.property_title || 'Untitled',
    action: d.stage === 'closed' ? 'Deal closed' : `In ${STAGE_CONFIG[d.stage].label}`,
    time: timeAgo(d.created_at), initials: d.initials || '??',
    color: d.stage === 'closed' ? 'var(--color-sage)' : STAGE_CONFIG[d.stage].color,
  }))
  if (activities.length === 0) return null
  return (
    <div style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)', borderRadius: 20, border: '1px solid var(--border-primary)', padding: 18, marginBottom: 20, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>Recent Activity</h3>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {activities.map(act => (
          <div key={act.id} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-tertiary)', borderRadius: 14, padding: '10px 14px', border: '1px solid var(--border-secondary)', minWidth: 'max-content' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${act.color}15`, color: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{act.initials}</div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>{act.action}</p>
              <p style={{ fontSize: 10, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{act.deal_title} · {act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const StageStatsBar = ({ deals }: { deals: Deal[] }) => (
  <div className="pipeline-stage-stats">
    {STAGES.map(s => {
      const cfg = STAGE_CONFIG[s]
      const stageDeals = deals.filter(d => d.stage === s)
      const val = stageDeals.reduce((a, d) => a + d.value, 0)
      return (
        <div key={s} style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: 14, border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{cfg.label}</span>
          </div>
          <p style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>{stageDeals.length}</p>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '4px 0 0', fontWeight: 500 }}>{fmt(val)}</p>
        </div>
      )
    })}
  </div>
)

export const Pipeline = () => {
  const { agency } = useAuth()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [addDealOpen, setAddDealOpen] = useState(false)
  const [mobileStage, setMobileStage] = useState('new')

  const fetchDeals = useCallback(async () => {
    if (!agency?.id) return
    setLoading(true); setError(null)
    try {
      let data, fetchError: any
      const result = await supabase.from('deals').select(`id, lead_id, property_id, agency_id, value, currency, stage, status, closed_at, created_at, leads(name, email, phone), properties(title)`).eq('agency_id', agency.id).order('created_at', { ascending: false })
      data = result.data; fetchError = result.error

      if (fetchError?.message?.includes('relationship')) {
        const { data: basicData, error: basicError } = await supabase.from('deals').select('id, lead_id, property_id, agency_id, value, currency, stage, status, closed_at, created_at').eq('agency_id', agency.id).order('created_at', { ascending: false })
        if (basicError) throw basicError
        const leadIds = [...new Set(basicData?.filter((d: any) => d.lead_id).map((d: any) => d.lead_id))] as string[]
        const propertyIds = [...new Set(basicData?.filter((d: any) => d.property_id).map((d: any) => d.property_id))] as string[]
        let leadsMap: Record<string, any> = {}, propertiesMap: Record<string, any> = {}
        if (leadIds.length > 0) { const { data: leadsData } = await supabase.from('leads').select('id, name, email, phone').in('id', leadIds); leadsData?.forEach((l: any) => { leadsMap[l.id] = l }) }
        if (propertyIds.length > 0) { const { data: propsData } = await supabase.from('properties').select('id, title').in('id', propertyIds); propsData?.forEach((p: any) => { propertiesMap[p.id] = p }) }
        data = basicData?.map((d: any) => ({ ...d, leads: d.lead_id ? leadsMap[d.lead_id] : null, properties: d.property_id ? propertiesMap[d.property_id] : null }))
      } else if (fetchError) { throw fetchError }

      setDeals((data || []).map((d: any) => ({ ...d, lead_name: d.leads?.name || null, lead_email: d.leads?.email || null, lead_phone: d.leads?.phone || null, property_title: d.properties?.title || null, initials: d.leads?.name ? getInitials(d.leads.name) : '??' })))
    } catch (err: any) {
      setError(err.message); toast.error('Failed to load deals')
    } finally { setLoading(false) }
  }, [agency?.id])

  useEffect(() => { fetchDeals() }, [fetchDeals])

  useEffect(() => {
    if (!agency?.id) return
    const channel = supabase.channel('deals-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'deals', filter: `agency_id=eq.${agency.id}` }, () => fetchDeals()).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [agency?.id, fetchDeals])

  const handleMove = async (dealId: string, direction: string) => {
    const deal = deals.find(d => d.id === dealId)
    if (!deal) return
    const idx = STAGES.indexOf(deal.stage)
    const newIdx = direction === 'left' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= STAGES.length) return
    const newStage = STAGES[newIdx]
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage, closed_at: newStage === 'closed' ? new Date().toISOString() : d.closed_at } : d))
    setSelectedDeal(prev => prev?.id === dealId ? { ...prev, stage: newStage } : prev)
    // On mobile, follow the moved deal to its new stage
    setMobileStage(newStage)
    try {
      const { error } = await supabase.from('deals').update({ stage: newStage, closed_at: newStage === 'closed' ? new Date().toISOString() : null, status: newStage === 'closed' ? 'closed' : 'active' }).eq('id', dealId)
      if (error) throw error
      toast.success(`Moved to ${STAGE_CONFIG[newStage].label}`)
    } catch { toast.error('Failed to move deal'); fetchDeals() }
  }

  const handleUpdateDeal = async (dealId: string, data: Partial<Deal>) => {
    try {
      const { error } = await supabase.from('deals').update({ value: data.value }).eq('id', dealId)
      if (error) throw error
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, ...data } : d))
      toast.success('Deal updated')
    } catch { toast.error('Failed to update deal') }
  }

  const filteredDeals = deals.filter(d => !searchQuery || (d.property_title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (d.lead_name || '').toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: `radial-gradient(ellipse 60% 40% at 30% -10%, rgba(180,130,70,0.03) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 90%, rgba(195,95,70,0.02) 0%, transparent 60%)` }} />

      <div style={{ position: 'relative', zIndex: 1, padding: 'var(--pipeline-pad, 32px 24px 64px)' }}>

        {/* Header */}
        <div className="pipeline-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Pipeline</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0', fontWeight: 500 }}>{loading ? 'Loading...' : `${deals.length} deals in your pipeline`}</p>
          </div>
          <div className="pipeline-header-actions">
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex', pointerEvents: 'none' }}><Icons.Search /></span>
              <input type="text" placeholder="Search deals…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="pipeline-search"
                style={{ padding: '10px 14px 10px 36px', fontSize: 16, background: 'var(--bg-secondary)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-primary)', borderRadius: 14, color: 'var(--text-primary)', outline: 'none', fontWeight: 500, width: '100%' }} />
            </div>
            <button onClick={() => setAddDealOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'var(--color-espresso)', color: 'var(--color-cream)', border: 'none', borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: 'var(--shadow-md)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <Icons.Plus /> Add Deal
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ color: 'var(--color-ochre)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Icons.Loader /></div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading pipeline...</p>
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)' }}>
            <p style={{ fontSize: 14, color: '#DC2626', marginBottom: 16 }}>{error}</p>
            <button onClick={fetchDeals} style={{ padding: '10px 20px', borderRadius: 12, background: 'var(--color-espresso)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
          </div>
        )}

        {!loading && !error && deals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-tertiary)' }}><Icons.Pipeline /></div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>No deals yet</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px' }}>Add your first deal to start tracking your pipeline.</p>
            <button onClick={() => setAddDealOpen(true)} style={{ padding: '10px 24px', borderRadius: 12, background: 'var(--color-espresso)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Add Your First Deal</button>
          </div>
        )}

        {!loading && !error && deals.length > 0 && (
          <>
            <ForecastPanel deals={deals} />
            <ActivityFeed deals={deals} />
            <StageStatsBar deals={filteredDeals} />

            {/* Filter status bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '12px 18px', background: 'var(--bg-secondary)', backdropFilter: 'blur(12px)', borderRadius: 14, border: '1px solid var(--border-primary)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredDeals.length}</strong> deals</span>
              <div style={{ width: 1, height: 16, background: 'var(--border-secondary)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>Total value <strong style={{ color: 'var(--text-primary)' }}>{fmt(filteredDeals.reduce((s, d) => s + d.value, 0))}</strong></span>
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-ochre)', background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>Clear ×</button>}
              <span className="pipeline-hint" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Click a card for details · Hover to move stages</span>
            </div>

            {/* ── Desktop kanban board ── */}
            <div className="pipeline-board-desktop">
              {STAGES.map(stageId => (
                <PipelineColumn key={stageId} stageId={stageId} deals={filteredDeals.filter(d => d.stage === stageId)} onMove={handleMove} onCardClick={setSelectedDeal} onAddDeal={() => setAddDealOpen(true)} />
              ))}
            </div>

            {/* ── Mobile board: stage tabs + single column ── */}
            <div className="pipeline-board-mobile">
              {/* Stage selector tabs */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, marginBottom: 14, scrollbarWidth: 'none' }}>
                {STAGES.map(s => {
                  const cfg = STAGE_CONFIG[s]
                  const count = filteredDeals.filter(d => d.stage === s).length
                  const isActive = mobileStage === s
                  return (
                    <button key={s} onClick={() => setMobileStage(s)} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, border: `1px solid ${isActive ? cfg.color : 'var(--border-secondary)'}`, background: isActive ? `${cfg.color}18` : 'var(--bg-secondary)', color: isActive ? cfg.color : 'var(--text-tertiary)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                      <span style={{ color: cfg.color, display: 'flex' }}>{cfg.icon}</span>
                      {cfg.label}
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: isActive ? cfg.color : 'var(--bg-hover)', color: isActive ? '#fff' : 'var(--text-tertiary)', minWidth: 16, textAlign: 'center' }}>{count}</span>
                    </button>
                  )
                })}
              </div>
              <PipelineColumn key={mobileStage} stageId={mobileStage} deals={filteredDeals.filter(d => d.stage === mobileStage)} onMove={handleMove} onCardClick={setSelectedDeal} onAddDeal={() => setAddDealOpen(true)} />
            </div>
          </>
        )}

        {selectedDeal && <DealModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} onMove={handleMove} onUpdate={handleUpdateDeal} />}
        <AddDealModal isOpen={addDealOpen} onClose={() => setAddDealOpen(false)} onSuccess={() => { setAddDealOpen(false); fetchDeals() }} agencyId={agency?.id} />
      </div>

      <style>{`
        :root { --pipeline-pad: 32px 24px 64px; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        /* ── Forecast grid: 4 cols ── */
        .pipeline-forecast-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }

        /* ── Stage stats: 5 cols ── */
        .pipeline-stage-stats { display: grid; grid-template-columns: repeat(5,1fr); gap: 10px; margin-bottom: 20px; }

        /* ── Header ── */
        .pipeline-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
        .pipeline-header-actions { display: flex; align-items: center; gap: 8px; }
        .pipeline-search { width: 200px !important; }

        /* ── Board ── */
        .pipeline-board-desktop { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 24px; }
        .pipeline-board-mobile { display: none; }
        .pipeline-column { flex-shrink: 0; width: 300px; }

        /* ── Deal modal grid ── */
        .deal-modal-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 16px; }

        /* ════════════════════════════
           TABLET — ≤1024px
        ════════════════════════════ */
        @media (max-width: 1024px) {
          .pipeline-forecast-grid { grid-template-columns: repeat(2,1fr); }
          .pipeline-stage-stats { grid-template-columns: repeat(3,1fr); gap: 8px; }
        }

        /* ════════════════════════════
           MOBILE — ≤768px
        ════════════════════════════ */
        @media (max-width: 768px) {
          :root { --pipeline-pad: 20px 16px 48px; }

          /* Header: stacks vertically, search full-width */
          .pipeline-header { flex-direction: column; align-items: stretch; gap: 12px; margin-bottom: 20px; }
          .pipeline-header-actions { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
          .pipeline-search { width: 100% !important; }

          /* Stats: 2-col */
          .pipeline-forecast-grid { grid-template-columns: repeat(2,1fr); gap: 10px; }
          .pipeline-stage-stats { grid-template-columns: repeat(3,1fr); gap: 8px; }

          /* Board: hide desktop, show mobile tabs */
          .pipeline-board-desktop { display: none !important; }
          .pipeline-board-mobile { display: block; }
          .pipeline-column { width: 100% !important; }

          /* Modal grid: single column */
          .deal-modal-grid { grid-template-columns: 1fr; }

          /* Hide desktop hint text */
          .pipeline-hint { display: none; }
        }

        /* ════════════════════════════
           SMALL MOBILE — ≤400px
        ════════════════════════════ */
        @media (max-width: 400px) {
          .pipeline-forecast-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .pipeline-stage-stats { grid-template-columns: repeat(2,1fr); gap: 6px; }
        }
      `}</style>
    </div>
  )
}

export default Pipeline

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: 4,
  textTransform: 'uppercase', letterSpacing: '0.04em',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', fontSize: 16, fontWeight: 500,
  background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
  borderRadius: 12, color: 'var(--text-primary)', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s ease',
}
const selectStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', fontSize: 16, fontWeight: 500,
  background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
  borderRadius: 12, color: 'var(--text-primary)', outline: 'none',
  boxSizing: 'border-box', cursor: 'pointer',
}
const cancelBtnStyle: React.CSSProperties = {
  flex: 1, padding: '12px', fontSize: 13, fontWeight: 600,
  color: 'var(--text-secondary)', background: 'var(--bg-hover)',
  border: '1px solid var(--border-secondary)', borderRadius: 14, cursor: 'pointer',
}
const submitBtnStyle: React.CSSProperties = {
  flex: 1, padding: '12px', fontSize: 13, fontWeight: 700,
  color: 'var(--color-cream)', background: 'var(--color-espresso)',
  border: 'none', borderRadius: 14, cursor: 'pointer',
}