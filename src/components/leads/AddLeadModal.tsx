// components/leads/AddLeadModal.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { notifyNewLead } from '../../lib/notifications'

type ViewType = 'options' | 'manual' | 'share' | 'embed' | 'csv' | 'email' | 'api'

const Icons = {
  Close: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Link: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>),
  Copy: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>),
  Check: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  Globe: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>),
  Mail: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
  Phone: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>),
  ArrowLeft: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
  Loader: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'alm-spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>),
  Sparkle: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>),
  Upload: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>),
  Code: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>),
  Zap: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  Eye: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  EyeOff: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>),
  ChevronRight: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>),
}

// ── Styles — fontSize 16 prevents iOS Safari zoom ───────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', fontSize: 16, fontWeight: 500,
  background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
  borderRadius: 12, color: 'var(--text-primary)', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s ease',
  WebkitAppearance: 'none',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: 'pointer',
  appearance: 'none' as const,
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: 6,
  textTransform: 'uppercase' as const, letterSpacing: '0.04em',
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split(/\r?\n/)
  const parseRow = (line: string): string[] => {
    const result: string[] = []; let current = '', inQuotes = false
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { if (inQuotes && line[i + 1] === '"') { current += '"'; i++ } else inQuotes = !inQuotes }
      else if (line[i] === ',' && !inQuotes) { result.push(current.trim()); current = '' }
      else current += line[i]
    }
    result.push(current.trim()); return result
  }
  const headers = parseRow(lines[0]).map(h => h.replace(/^"|"$/g, ''))
  const rows = lines.slice(1).filter(l => l.trim()).map(line => {
    const values = parseRow(line)
    return headers.reduce((obj, h, i) => { obj[h] = (values[i] || '').replace(/^"|"$/g, ''); return obj }, {} as Record<string, string>)
  })
  return { headers, rows }
}

function generateApiKey(agencyId: string): string { return `rvc_live_${agencyId.replace(/-/g, '').slice(0, 24)}` }
function generateLeadEmail(agencyId: string): string { return `leads+${agencyId.slice(0, 8)}@getrevacore.com` }

// ── Animated Back Button ─────────────────────────────────────────────────────
function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="alm-back-btn">
      <Icons.ArrowLeft /> Back
    </button>
  )
}

// ── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000) }
    catch { toast.error('Failed to copy') }
  }
  return (
    <button onClick={handleCopy} className={`alm-copy-btn${copied ? ' alm-copied' : ''}`}>
      {copied ? <Icons.Check /> : <Icons.Copy />} {copied ? 'Copied!' : label}
    </button>
  )
}

// ── Code Block ───────────────────────────────────────────────────────────────
function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ background: 'var(--bg-tertiary)', borderRadius: 14, border: '1px solid var(--border-secondary)', padding: 14, position: 'relative' }}>
        <pre style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' as const, wordBreak: 'break-all' as const, lineHeight: 1.6, maxHeight: 120, overflow: 'auto', paddingRight: 60 }}>
          {code}
        </pre>
        <div style={{ position: 'absolute', top: 8, right: 8 }}><CopyButton text={code} /></div>
      </div>
    </div>
  )
}

// ── Info Banner ──────────────────────────────────────────────────────────────
function InfoBanner({ icon, title, body, color = 'ochre' }: { icon?: React.ReactNode; title: string; body: string; color?: string }) {
  const map: Record<string, { bg: string; border: string; text: string }> = {
    ochre:    { bg: 'rgba(180,130,70,0.04)',  border: 'rgba(180,130,70,0.12)',  text: 'var(--color-ochre)' },
    sage:     { bg: 'rgba(110,140,100,0.05)', border: 'rgba(110,140,100,0.15)', text: 'var(--color-sage)' },
    espresso: { bg: 'rgba(55,40,30,0.05)',    border: 'rgba(55,40,30,0.12)',    text: 'var(--color-espresso)' },
  }
  const c = map[color] || map.ochre
  return (
    <div style={{ padding: 14, borderRadius: 14, marginBottom: 16, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      {icon && <span style={{ color: c.text, flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px' }}>{title}</p>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{body}</p>
      </div>
    </div>
  )
}

// ── View header ──────────────────────────────────────────────────────────────
function ViewHeader({ icon, iconBg, iconColor, title, subtitle }: { icon: React.ReactNode; iconBg: string; iconColor: string; title: string; subtitle: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 24, animation: 'alm-fadeUp 0.3s ease' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: iconColor }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
    </div>
  )
}

// ── URL Row (copy-able) ──────────────────────────────────────────────────────
function URLRow({ label, value, copyLabel }: { label: string; value: string; copyLabel?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: 8, background: 'var(--bg-tertiary)', borderRadius: 14, border: '1px solid var(--border-secondary)', padding: 6 }}>
        <div style={{ flex: 1, padding: '10px 12px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border-secondary)', minWidth: 0 }}>
          {value}
        </div>
        <CopyButton text={value} label={copyLabel || 'Copy'} />
      </div>
    </div>
  )
}

// ─── 1. Share Form View ───────────────────────────────────────────────────────
function ShareFormView({ agencyId, onBack }: { agencyId: string; onBack: () => void }) {
  const formUrl = `${window.location.origin}/form/${agencyId}`
  const shareButtons = [
    { label: 'Email', color: '#4a90d9', bg: 'rgba(74,144,217,0.08)', border: 'rgba(74,144,217,0.2)', icon: <Icons.Mail />, onClick: () => { const s = encodeURIComponent('Submit Your Interest'); const b = encodeURIComponent(`Please fill out this form:\n\n${formUrl}`); window.open(`mailto:?subject=${s}&body=${b}`, '_blank') } },
    { label: 'WhatsApp', color: '#25D366', bg: 'rgba(37,211,102,0.08)', border: 'rgba(37,211,102,0.2)', icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>), onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Please fill out this form: ${formUrl}`)}`, '_blank') },
    { label: 'Twitter/X', color: '#1DA1F2', bg: 'rgba(29,161,242,0.08)', border: 'rgba(29,161,242,0.2)', icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.254 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>), onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Interested in a property? Fill out this form: ${formUrl}`)}`, '_blank') },
  ]
  return (
    <div className="alm-view-enter">
      <BackButton onBack={onBack} />
      <ViewHeader icon={<Icons.Link />} iconBg="rgba(180,130,70,0.08)" iconColor="var(--color-ochre)" title="Shareable Lead Form" subtitle="Share this link anywhere — leads appear in your dashboard automatically" />
      <URLRow label="Your Form URL" value={formUrl} copyLabel="Copy Link" />
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Share Via</label>
        <div className="alm-share-grid">
          {shareButtons.map((btn, i) => (
            <button key={btn.label} onClick={btn.onClick} className="alm-share-btn" style={{ '--share-color': btn.color, '--share-bg': btn.bg, '--share-border': btn.border, animationDelay: `${i * 60}ms` } as any}>
              <span style={{ color: btn.color }}>{btn.icon}</span>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      <InfoBanner icon={<Icons.Sparkle />} title="Auto-capture enabled" body="Every submission instantly appears in your Leads dashboard with AI scoring applied automatically." />
    </div>
  )
}

// ─── 2. Embed Form View ───────────────────────────────────────────────────────
function EmbedFormView({ agencyId, onBack }: { agencyId: string; onBack: () => void }) {
  const [tab, setTab] = useState<'iframe' | 'script'>('iframe')
  const formUrl = `${window.location.origin}/form/${agencyId}`
  const iframeCode = `<iframe\n  src="${formUrl}"\n  width="100%"\n  height="600"\n  frameborder="0"\n  style="border-radius:12px;border:none;box-shadow:0 4px 24px rgba(0,0,0,0.08)"\n></iframe>`
  const scriptCode = `<div id="revacore-form"></div>\n<script>\n  (function() {\n    var f = document.createElement('iframe');\n    f.src = '${formUrl}';\n    f.width = '100%';\n    f.height = '600';\n    f.frameBorder = '0';\n    f.style.borderRadius = '12px';\n    f.style.border = 'none';\n    document.getElementById('revacore-form').appendChild(f);\n  })();\n</script>`
  return (
    <div className="alm-view-enter">
      <BackButton onBack={onBack} />
      <ViewHeader icon={<Icons.Code />} iconBg="rgba(110,140,100,0.08)" iconColor="var(--color-sage)" title="Embed on Your Website" subtitle="Paste this code into any page — the form renders natively on your site" />
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, background: 'var(--bg-tertiary)', padding: 5, borderRadius: 12, width: 'fit-content' }}>
        {(['iframe', 'script'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 18px', borderRadius: 9, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: tab === t ? 'var(--bg-primary)' : 'transparent', color: tab === t ? 'var(--text-primary)' : 'var(--text-tertiary)', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
            {t === 'iframe' ? 'iFrame' : 'Script Tag'}
          </button>
        ))}
      </div>
      <CodeBlock code={tab === 'iframe' ? iframeCode : scriptCode} label={tab === 'iframe' ? 'iFrame Embed Code' : 'Script Embed Code'} />
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>How to install</label>
        {['Copy the code above', 'Open your website editor (WordPress, Wix, Webflow, etc.)', 'Paste it into any page where you want the form to appear', 'Leads submitted on your site will appear in your dashboard instantly'].map((text, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, animation: `alm-fadeUp 0.3s ease ${i * 60}ms both` }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1, background: 'rgba(110,140,100,0.12)', color: 'var(--color-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{text}</p>
          </div>
        ))}
      </div>
      <InfoBanner icon={<Icons.Sparkle />} color="sage" title="Works everywhere" body="Compatible with WordPress, Webflow, Wix, Squarespace, Framer, and any custom HTML site." />
    </div>
  )
}

// ─── 3. CSV Import View ───────────────────────────────────────────────────────
function CSVImportView({ agencyId, onBack, onSuccess }: { agencyId: string; onBack: () => void; onSuccess: () => void }) {
  const [dragging, setDragging] = useState(false)
  const [parsed, setParsed] = useState<{ headers: string[]; rows: Record<string, string>[] } | null>(null)
  const [mapping, setMapping] = useState<Record<string, string>>({ name: '', email: '', phone: '', location: '', budget: '', property_type: '' })
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const REVACORE_FIELDS = [
    { key: 'name', label: 'Full Name *' }, { key: 'email', label: 'Email *' },
    { key: 'phone', label: 'Phone' }, { key: 'location', label: 'Location' },
    { key: 'budget', label: 'Budget' }, { key: 'property_type', label: 'Property Type' },
  ]

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) { toast.error('Please upload a CSV file'); return }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = parseCSV(e.target?.result as string)
        if (result.headers.length === 0) { toast.error('CSV file appears to be empty'); return }
        setParsed(result)
        const autoMap: Record<string, string> = { name: '', email: '', phone: '', location: '', budget: '', property_type: '' }
        result.headers.forEach(h => {
          const l = h.toLowerCase()
          if (l.includes('name') && !autoMap.name) autoMap.name = h
          else if (l.includes('email') && !autoMap.email) autoMap.email = h
          else if ((l.includes('phone') || l.includes('mobile') || l.includes('tel')) && !autoMap.phone) autoMap.phone = h
          else if ((l.includes('location') || l.includes('city') || l.includes('area')) && !autoMap.location) autoMap.location = h
          else if ((l.includes('budget') || l.includes('price')) && !autoMap.budget) autoMap.budget = h
          else if ((l.includes('property') || l.includes('type')) && !autoMap.property_type) autoMap.property_type = h
        })
        setMapping(autoMap)
        toast.success(`Loaded ${result.rows.length} rows`)
      } catch { toast.error('Failed to parse CSV') }
    }
    reader.readAsText(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]; if (file) processFile(file)
  }, [])

  const handleImport = async () => {
    if (!parsed) return
    if (!mapping.name) { toast.error('Please map the Name column'); return }
    if (!mapping.email) { toast.error('Please map the Email column'); return }
    const leads = parsed.rows.filter(row => row[mapping.name]?.trim() && row[mapping.email]?.trim()).map(row => ({
      agency_id: agencyId, name: row[mapping.name]?.trim(), email: row[mapping.email]?.trim().toLowerCase(),
      phone: mapping.phone ? row[mapping.phone]?.trim() || null : null,
      location: mapping.location ? row[mapping.location]?.trim() || null : null,
      budget: mapping.budget && row[mapping.budget] ? parseFloat(row[mapping.budget].replace(/[^0-9.]/g, '')) || null : null,
      property_type: mapping.property_type ? row[mapping.property_type]?.trim() || null : null,
      source: 'csv_import', status: 'new', currency: 'USD',
    }))
    if (leads.length === 0) { toast.error('No valid leads found'); return }
    setLoading(true)
    try {
      const { error } = await supabase.from('leads').insert(leads)
      if (error) throw error
      toast.success(`Imported ${leads.length} leads!`)
      onSuccess(); onBack()
    } catch (err: any) { toast.error(err.message || 'Import failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="alm-view-enter">
      <BackButton onBack={onBack} />
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Bulk CSV Import</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Upload a spreadsheet — map columns — import all leads at once</p>
      </div>
      {!parsed ? (
        <>
          <div onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} onClick={() => fileRef.current?.click()} className={`alm-dropzone${dragging ? ' alm-dragging' : ''}`}>
            <div style={{ color: dragging ? 'var(--color-sage)' : 'var(--text-tertiary)', marginBottom: 10, transition: 'color 0.2s' }}><Icons.Upload /></div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>{dragging ? 'Drop your CSV here' : 'Drag & drop your CSV file'}</p>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>or click to browse — .csv files only</p>
            <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && processFile(e.target.files[0])} />
          </div>
          <InfoBanner icon={<Icons.Sparkle />} title="CSV format tip" body="Your CSV should have headers in the first row. Required: Name, Email. Optional: Phone, Location, Budget, Property Type." />
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, marginBottom: 16, background: 'rgba(110,140,100,0.06)', border: '1px solid rgba(110,140,100,0.15)', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📄</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{fileName}</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>{parsed.rows.length} rows · {parsed.headers.length} columns</p>
              </div>
            </div>
            <button onClick={() => { setParsed(null); setFileName('') }} style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>Change file</button>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Map your columns</label>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
              {REVACORE_FIELDS.map(field => (
                <div key={field.key} className="alm-map-row">
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>{field.label}</p>
                  <select value={mapping[field.key]} onChange={e => setMapping(prev => ({ ...prev, [field.key]: e.target.value }))} style={{ ...selectStyle, padding: '10px 32px 10px 12px', fontSize: 14 }}>
                    <option value="">— Skip —</option>
                    {parsed.headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Preview (first 3 rows)</label>
            <div style={{ overflowX: 'auto' as const, borderRadius: 12, border: '1px solid var(--border-secondary)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 11 }}>
                <thead><tr style={{ background: 'var(--bg-tertiary)' }}>
                  {['Name', 'Email', 'Phone', 'Location'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left' as const, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-secondary)', whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {parsed.rows.slice(0, 3).map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < 2 ? '1px solid var(--border-secondary)' : 'none' }}>
                      {[mapping.name, mapping.email, mapping.phone, mapping.location].map((col, ci) => (
                        <td key={ci} style={{ padding: '8px 12px', color: col && row[col] ? 'var(--text-primary)' : 'var(--text-tertiary)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                          {col && row[col] ? row[col] : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button onClick={handleImport} disabled={loading} className="alm-submit-btn" style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? <><Icons.Loader /> Importing...</> : `Import ${parsed.rows.length} Leads`}
          </button>
        </>
      )}
    </div>
  )
}

// ─── 4. Email Capture View ────────────────────────────────────────────────────
function EmailCaptureView({ agencyId, onBack }: { agencyId: string; onBack: () => void }) {
  const leadEmail = generateLeadEmail(agencyId)
  const methods = [
    { emoji: '📨', title: 'Forward emails', desc: `Receive a lead inquiry? Forward it to your address — RevaCore extracts contact details automatically.` },
    { emoji: '📋', title: 'CC on reply', desc: `When replying to a new lead, CC your address — the lead is created at the same time you respond.` },
    { emoji: '🔗', title: 'Set as contact email', desc: 'Add this address to your website or property portal so inquiries flow directly into RevaCore.' },
  ]
  return (
    <div className="alm-view-enter">
      <BackButton onBack={onBack} />
      <ViewHeader icon={<Icons.Mail />} iconBg="rgba(74,144,217,0.08)" iconColor="#4a90d9" title="Email Lead Capture" subtitle="Forward or CC any lead email — it becomes a lead instantly" />
      <URLRow label="Your Unique Lead Email" value={leadEmail} copyLabel="Copy" />
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>3 ways to use it</label>
        {methods.map((item, i) => (
          <div key={item.title} style={{ display: 'flex', gap: 12, padding: 14, marginBottom: 8, background: 'var(--bg-tertiary)', borderRadius: 14, border: '1px solid var(--border-secondary)', animation: `alm-fadeUp 0.3s ease ${i * 60}ms both` }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.emoji}</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px' }}>{item.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <InfoBanner icon={<Icons.Sparkle />} title="AI-powered extraction" body="RevaCore reads the email content and automatically extracts the lead's name, contact, budget, and property interest." />
    </div>
  )
}

// ─── 5. API & Webhooks View ───────────────────────────────────────────────────
function APIWebhookView({ agencyId, onBack }: { agencyId: string; onBack: () => void }) {
  const [showKey, setShowKey] = useState(false)
  const apiKey = generateApiKey(agencyId)
  const webhookUrl = `https://api.getrevacore.com/v1/leads/webhook/${agencyId}`
  const curlExample = `curl -X POST "${webhookUrl}" \\\n  -H "Content-Type: application/json" \\\n  -H "x-api-key: ${apiKey}" \\\n  -d '{"name":"Ahmed Al Rashid","email":"ahmed@example.com","phone":"+971501234567","source":"property_finder","budget":2500000,"property_type":"villa","location":"Dubai Hills"}'`
  const payloadExample = `{\n  "name": "string (required)",\n  "email": "string (required)",\n  "phone": "string",\n  "source": "string",\n  "budget": "number",\n  "property_type": "apartment | villa | house | condo | commercial | land",\n  "location": "string",\n  "notes": "string"\n}`
  return (
    <div className="alm-view-enter">
      <BackButton onBack={onBack} />
      <ViewHeader icon={<Icons.Zap />} iconBg="rgba(180,130,70,0.08)" iconColor="var(--color-ochre)" title="API & Webhooks" subtitle="Connect Property Finder, Bayut, or any portal — leads flow directly into RevaCore" />
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Your API Key</label>
        <div style={{ display: 'flex', gap: 8, background: 'var(--bg-tertiary)', borderRadius: 14, border: '1px solid var(--border-secondary)', padding: 6 }}>
          <div style={{ flex: 1, padding: '10px 14px', fontSize: 12, fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-primary)', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, minWidth: 0 }}>
            {showKey ? apiKey : apiKey.slice(0, 10) + '•'.repeat(20)}
          </div>
          <button onClick={() => setShowKey(v => !v)} style={{ padding: '10px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: 10, cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {showKey ? <Icons.EyeOff /> : <Icons.Eye />}
          </button>
          <CopyButton text={apiKey} label="Copy Key" />
        </div>
      </div>
      <URLRow label="Webhook Endpoint (POST)" value={webhookUrl} />
      <CodeBlock code={payloadExample} label="Request Payload (JSON)" />
      <CodeBlock code={curlExample} label="Example cURL Request" />
      <InfoBanner icon={<Icons.Zap />} color="ochre" title="Compatible with Property Finder & Bayut" body="Add your webhook URL in your portal account settings under Lead Notifications. Leads from both portals appear in RevaCore instantly." />
    </div>
  )
}

// ─── Manual Lead Form ─────────────────────────────────────────────────────────
function ManualLeadForm({ agencyId, onBack, onClose, onSuccess }: { agencyId: string; onBack: () => void; onClose: () => void; onSuccess: () => void }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const submittingRef = useRef(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', property_type: '', budget: '', source: 'manual', status: 'new', notes: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Guard against duplicate submissions (double-click / slow network)
    if (submittingRef.current) return
    submittingRef.current = true
    if (!form.name.trim()) { toast.error('Name is required'); submittingRef.current = false; return }
    if (!form.email.trim()) { toast.error('Email is required'); submittingRef.current = false; return }
    setLoading(true)
    try {
      const { data: insertedLead, error } = await supabase.from('leads').insert({
        agency_id: agencyId, name: form.name.trim(), email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null, location: form.location.trim() || null,
        property_type: form.property_type || null, budget: form.budget ? parseFloat(form.budget) : null,
        currency: 'USD', source: form.source, status: form.status, notes: form.notes.trim() || null,
      }).select('id')
      if (error) throw error
      
      // Fire notification for the new lead
      const leadName = form.name.trim()
      const leadId = insertedLead?.[0]?.id
      if (user?.id && leadId) {
        notifyNewLead(user.id, leadName, leadId, agencyId).catch(() => {})
      }
      
      toast.success('Lead created! AI scoring in progress...')
      onSuccess(); onClose()
    } catch (err: any) { toast.error(err.message || 'Failed to create lead') }
    finally { setLoading(false); submittingRef.current = false }
  }

  return (
    <form onSubmit={handleSubmit} className="alm-view-enter">
      <BackButton onBack={onBack} />
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Add Lead Manually</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Fill in the lead details below</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input type="text" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} required autoComplete="off" />
        </div>
        <div className="alm-form-2col">
          <div><label style={labelStyle}>Email Address *</label><input type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} required /></div>
          <div><label style={labelStyle}>Phone Number</label><input type="tel" placeholder="+1 234 567 890" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} /></div>
        </div>
        <div className="alm-form-2col">
          <div><label style={labelStyle}>Location</label><input type="text" placeholder="e.g., Dubai Hills" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>Property Type</label>
            <select value={form.property_type} onChange={e => setForm({ ...form, property_type: e.target.value })} style={selectStyle}>
              <option value="">Select type</option>
              {['apartment','villa','house','condo','commercial','land','townhouse','penthouse'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="alm-form-2col">
          <div><label style={labelStyle}>Budget</label><input type="number" placeholder="e.g., 500000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={selectStyle}>
              {['new','contacted','qualified','warm','hot','cold'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Source</label>
          <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} style={selectStyle}>
            {['manual','website','referral','social_media','property_finder','bayut','facebook','google_ads','email_campaign'].map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Notes</label>
          <textarea placeholder="Any additional notes about this lead..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' as const, fontFamily: 'var(--font-body)', fontSize: 16 }} />
        </div>
        <div className="alm-form-2col alm-form-btns">
          <button type="button" onClick={onClose} className="alm-cancel-btn">Cancel</button>
          <button type="submit" disabled={loading} className="alm-submit-btn" style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? <><Icons.Loader /> Creating...</> : 'Create Lead'}
          </button>
        </div>
      </div>
    </form>
  )
}

// ─── Channel Config ────────────────────────────────────────────────────────────
const CHANNELS = [
  { id: 'manual' as ViewType, title: 'Manual Entry',       desc: 'Add lead details directly',              emoji: '📋', accentColor: 'var(--color-espresso)', accentBg: 'rgba(55,40,30,0.08)',    accentBorder: 'rgba(55,40,30,0.15)' },
  { id: 'share' as ViewType,  title: 'Shareable Link',     desc: 'Leads fill in their own info',           emoji: '🔗', accentColor: 'var(--color-ochre)',    accentBg: 'rgba(180,130,70,0.06)', accentBorder: 'rgba(180,130,70,0.15)' },
  { id: 'embed' as ViewType,  title: 'Embed on Website',   desc: 'Form renders on your own site',          emoji: '🌐', accentColor: 'var(--color-sage)',     accentBg: 'rgba(110,140,100,0.06)',accentBorder: 'rgba(110,140,100,0.15)' },
  { id: 'csv' as ViewType,    title: 'Bulk CSV Import',    desc: 'Upload spreadsheet, import hundreds',    emoji: '📊', accentColor: 'var(--color-ochre)',    accentBg: 'rgba(180,130,70,0.06)', accentBorder: 'rgba(180,130,70,0.15)' },
  { id: 'email' as ViewType,  title: 'Email Capture',      desc: 'Forward emails, auto-created as leads',  emoji: '📧', accentColor: '#4a90d9',               accentBg: 'rgba(74,144,217,0.06)', accentBorder: 'rgba(74,144,217,0.15)' },
  { id: 'api' as ViewType,    title: 'API & Webhooks',     desc: 'Connect Property Finder, Bayut & more',  emoji: '⚡', accentColor: 'var(--color-ochre)',    accentBg: 'rgba(180,130,70,0.06)', accentBorder: 'rgba(180,130,70,0.15)' },
]

// ─── Main AddLeadModal ────────────────────────────────────────────────────────
interface AddLeadModalProps { isOpen: boolean; onClose: () => void; onSuccess: () => void; agencyId?: string }

export const AddLeadModal = ({ isOpen, onClose, onSuccess, agencyId }: AddLeadModalProps) => {
  const [view, setView] = useState<ViewType>('options')

  useEffect(() => { if (isOpen) setView('options') }, [isOpen])
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden' }
    else { document.body.style.overflow = '' }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const isWide = ['csv', 'api', 'embed'].includes(view)

  return (
    <div className="alm-overlay" onClick={onClose}>
      {/* Backdrop */}
      <div className="alm-backdrop" />

      {/* Modal */}
      <div
        className={`alm-modal${isWide ? ' alm-modal-wide' : view === 'options' ? ' alm-modal-narrow' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'flex-end', position: 'sticky', top: 0, zIndex: 2, background: 'var(--bg-secondary)' }}>
          <button onClick={onClose} className="alm-close-btn">
            <Icons.Close />
          </button>
        </div>

        <div className="alm-body">

          {/* ── Options Grid ── */}
          {view === 'options' && (
            <div className="alm-view-enter">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--color-espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-ochre)', animation: 'alm-iconPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Add New Lead</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Choose your lead capture channel</p>
              </div>

              <div className="alm-channels-grid">
                {CHANNELS.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => setView(ch.id)}
                    className="alm-channel-btn"
                    style={{ '--ch-bg': ch.accentBg, '--ch-border': ch.accentBorder, animationDelay: `${idx * 50}ms` } as any}
                  >
                    <div className="alm-channel-emoji" style={{ '--ch-border': ch.accentBorder } as any}>
                      {ch.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' as const }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 3px' }}>{ch.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.4 }}>{ch.desc}</p>
                    </div>
                    <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}><Icons.ChevronRight /></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === 'manual' && agencyId && <ManualLeadForm agencyId={agencyId} onBack={() => setView('options')} onClose={onClose} onSuccess={onSuccess} />}
          {view === 'share'  && agencyId && <ShareFormView  agencyId={agencyId} onBack={() => setView('options')} />}
          {view === 'embed'  && agencyId && <EmbedFormView  agencyId={agencyId} onBack={() => setView('options')} />}
          {view === 'csv'    && agencyId && <CSVImportView  agencyId={agencyId} onBack={() => setView('options')} onSuccess={onSuccess} />}
          {view === 'email'  && agencyId && <EmailCaptureView agencyId={agencyId} onBack={() => setView('options')} />}
          {view === 'api'    && agencyId && <APIWebhookView  agencyId={agencyId} onBack={() => setView('options')} />}
        </div>
      </div>

      <style>{`
        /* ── Keyframes ── */
        @keyframes alm-spin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes alm-fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes alm-slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes alm-fadeUp  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes alm-iconPop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        @keyframes alm-cardIn  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* ── Overlay & Backdrop ── */
        .alm-overlay {
          position: fixed; inset: 0; z-index: 150;
          display: flex; align-items: flex-end; justify-content: center;
          padding: 0;
        }
        @media (min-width: 600px) {
          .alm-overlay { align-items: center; padding: 20px; }
        }

        .alm-backdrop {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.45); backdrop-filter: blur(8px);
          animation: alm-fadeIn 0.2s ease;
        }

        /* ── Modal ── */
        .alm-modal {
          position: relative;
          background: var(--bg-secondary);
          backdrop-filter: blur(24px);
          border: 1px solid var(--border-primary);
          box-shadow: 0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05);
          width: 100%;
          max-width: 520px;
          /* Full-screen bottom sheet on mobile */
          border-radius: 24px 24px 0 0;
          max-height: 92vh;
          overflow-y: auto;
          overflow-x: hidden;
          animation: alm-slideUp 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
          -webkit-overflow-scrolling: touch;
        }
        @media (min-width: 600px) {
          .alm-modal {
            border-radius: 24px;
            max-height: 88vh;
          }
        }
        .alm-modal-wide  { max-width: 600px; }
        .alm-modal-narrow{ max-width: 480px; }

        /* ── Body padding ── */
        .alm-body { padding: 4px 20px 28px; }
        @media (min-width: 600px) { .alm-body { padding: 4px 28px 28px; } }

        /* ── Close button ── */
        .alm-close-btn {
          padding: 8px; border-radius: 10px;
          background: var(--bg-hover); border: none; cursor: pointer;
          color: var(--text-tertiary); display: flex;
          transition: all 0.2s ease;
        }
        .alm-close-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); transform: scale(1.1); }

        /* ── View entrance ── */
        .alm-view-enter { animation: alm-fadeUp 0.25s ease; }

        /* ── Back button ── */
        .alm-back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; font-size: 13px; font-weight: 600;
          color: var(--text-secondary); background: var(--bg-hover);
          border: 1px solid var(--border-secondary); border-radius: 12px;
          cursor: pointer; margin-bottom: 20px; transition: all 0.2s ease;
        }
        .alm-back-btn:hover { background: var(--bg-tertiary); transform: translateX(-2px); }

        /* ── Copy button ── */
        .alm-copy-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 8px 14px; font-size: 12px; font-weight: 600;
          background: var(--bg-primary); color: var(--text-secondary);
          border: 1px solid var(--border-secondary); border-radius: 10px;
          cursor: pointer; transition: all 0.2s ease; white-space: nowrap; flex-shrink: 0;
        }
        .alm-copy-btn:hover { background: var(--bg-hover); }
        .alm-copied { background: var(--color-sage) !important; color: #fff !important; border-color: transparent !important; }

        /* ── Channels grid: 2-col desktop, 1-col mobile ── */
        .alm-channels-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        @media (max-width: 460px) {
          .alm-channels-grid { grid-template-columns: 1fr; gap: 8px; }
        }

        /* ── Channel button ── */
        .alm-channel-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 14px; text-align: left; width: 100%;
          background: var(--ch-bg); border: 1px solid var(--ch-border);
          border-radius: 16px; cursor: pointer;
          transition: all 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
          animation: alm-cardIn 0.3s ease both;
        }
        .alm-channel-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          border-color: var(--ch-border);
          filter: brightness(1.04);
        }
        .alm-channel-btn:active { transform: translateY(0) scale(0.98); }

        .alm-channel-emoji {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          background: var(--bg-primary); border: 1px solid var(--ch-border);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; transition: transform 0.2s ease;
        }
        .alm-channel-btn:hover .alm-channel-emoji { transform: scale(1.1) rotate(-4deg); }

        /* ── Share via buttons ── */
        .alm-share-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
        }
        .alm-share-btn {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 6px; padding: 12px 8px; font-size: 12px; font-weight: 600;
          color: var(--share-color); background: var(--share-bg);
          border: 1px solid var(--share-border); border-radius: 12px;
          cursor: pointer; transition: all 0.2s ease;
          animation: alm-fadeUp 0.3s ease both;
        }
        .alm-share-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

        /* ── Drop zone ── */
        .alm-dropzone {
          border: 2px dashed var(--border-secondary);
          border-radius: 16px; padding: 36px 24px; text-align: center;
          cursor: pointer; transition: all 0.2s ease; margin-bottom: 16px;
          background: var(--bg-tertiary);
        }
        .alm-dragging {
          border-color: var(--color-sage) !important;
          background: rgba(110,140,100,0.04) !important;
          transform: scale(1.01);
        }
        .alm-dropzone:hover { border-color: var(--border-primary); }

        /* ── Column mapping row ── */
        .alm-map-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; align-items: center;
        }
        @media (max-width: 460px) {
          .alm-map-row { grid-template-columns: 1fr; gap: 4px; }
          .alm-map-row p { margin-bottom: 2px !important; }
        }

        /* ── Form 2-col grids ── */
        .alm-form-2col {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        }
        @media (max-width: 460px) {
          .alm-form-2col { grid-template-columns: 1fr; gap: 10px; }
        }

        /* ── Form buttons ── */
        .alm-form-btns { margin-top: 4px; }
        .alm-cancel-btn {
          padding: 13px; font-size: 13px; font-weight: 600;
          color: var(--text-secondary); background: var(--bg-hover);
          border: 1px solid var(--border-secondary); border-radius: 14px;
          cursor: pointer; transition: all 0.2s;
        }
        .alm-cancel-btn:hover { background: var(--bg-tertiary); }

        .alm-submit-btn {
          width: 100%; padding: 13px; font-size: 14px; font-weight: 700;
          color: #fff; background: var(--color-espresso);
          border: none; border-radius: 14px;
          transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .alm-submit-btn:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-1px); }
        .alm-submit-btn:active:not(:disabled) { transform: translateY(0); }

        /* ── Scrollbar styling inside modal ── */
        .alm-modal::-webkit-scrollbar { width: 4px; }
        .alm-modal::-webkit-scrollbar-track { background: transparent; }
        .alm-modal::-webkit-scrollbar-thumb { background: var(--border-secondary); border-radius: 2px; }
      `}</style>
    </div>
  )
}

export default AddLeadModal