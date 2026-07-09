"use client";

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Bed: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v6"/><path d="M22 22v-6"/><path d="M2 14h20"/><path d="M6 8V4h12v4"/>
    </svg>
  ),
  Bath: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1z"/><path d="M6 12V5a2 2 0 012-2h3v2.25"/><path d="M4 21l1-1.5"/><path d="M20 21l-1-1.5"/>
    </svg>
  ),
  Ruler: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"/><path d="m7.5 10.5 3 3"/><path d="m10.5 7.5 3 3"/><path d="m13.5 4.5 3 3"/>
    </svg>
  ),
  Home: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Bookmark: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  ),
  BookmarkFilled: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  Loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'mpspin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
  ),
  Check: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
    </svg>
  ),
}

// ─── Types ──────────────────────────────────────────────────────────────────────
interface MarketProperty {
  id: string
  title: string
  price: number
  location: string
  property_type: string
  bedrooms: number
  bathrooms: number
  size_sqft: number | null
  image_url: string | null
  created_at: string
  description?: string | null
  amenities?: string[] | string | null
  furnishing?: string | null
  completion_status?: string | null
  permit_number?: string | null
  agent_name?: string | null
  agent_phone?: string | null
  agent_email?: string | null
  source_url?: string | null
}

// ─── Type Colors ───────────────────────────────────────────────────────────────
const TYPE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Apartment: { bg: 'rgba(100,130,220,0.15)', color: '#7090dd', border: 'rgba(100,130,220,0.3)' },
  Villa:     { bg: 'rgba(180,130,70,0.15)',  color: 'var(--color-ochre)', border: 'rgba(180,130,70,0.3)' },
  Townhouse: { bg: 'rgba(110,160,130,0.15)', color: '#5da07a', border: 'rgba(110,160,130,0.3)' },
  Office:    { bg: 'rgba(180,100,80,0.15)',  color: '#c8705a', border: 'rgba(180,100,80,0.3)' },
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(price: number) {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`
  return `$${price.toLocaleString()}`
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function parseAmenities(raw: string[] | string | null | undefined): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try { return JSON.parse(raw) } catch { return raw.split(',').map(s => s.trim()).filter(Boolean) }
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 48px', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: 140, height: 14, borderRadius: 100, background: 'var(--bg-tertiary)', marginBottom: 20, animation: 'mpPulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 400, borderRadius: 20, background: 'var(--bg-tertiary)', marginBottom: 24, animation: 'mpPulse 1.5s ease-in-out infinite' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div>
          <div style={{ width: '60%', height: 28, borderRadius: 8, background: 'var(--bg-tertiary)', marginBottom: 12, animation: 'mpPulse 1.5s ease-in-out infinite' }} />
          <div style={{ width: '40%', height: 14, borderRadius: 8, background: 'var(--bg-tertiary)', marginBottom: 20, animation: 'mpPulse 1.5s ease-in-out infinite' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 60, borderRadius: 14, background: 'var(--bg-tertiary)', animation: 'mpPulse 1.5s ease-in-out infinite' }} />)}
          </div>
        </div>
        <div style={{ height: 200, borderRadius: 20, background: 'var(--bg-tertiary)', animation: 'mpPulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  )
}

// ─── Similar Property Card ─────────────────────────────────────────────────────
function SimilarCard({ property }: { property: { id: string; title: string; price: number; image_url: string | null; property_type: string; bedrooms: number; bathrooms: number; size_sqft: number | null } }) {
  const router = useRouter()
  const [imgError, setImgError] = useState(false)
  const typeStyle = TYPE_COLORS[property.property_type] || { bg: 'rgba(180,130,70,0.15)', color: 'var(--color-ochre)', border: 'rgba(180,130,70,0.3)' }

  return (
    <div
      className="mp-card mp-card-clickable"
      onClick={() => router.push(`/dashboard/properties/market/${property.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/dashboard/properties/market/${property.id}`) }}
      style={{ cursor: 'pointer', background: 'var(--bg-secondary)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
        {property.image_url && !imgError ? (
          <img src={property.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgError(true)} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}><Icons.Home /></div>
        )}
        <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}`, backdropFilter: 'blur(6px)' }}>
          {property.property_type}
        </span>
        <div style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 16, fontWeight: 800, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
          {formatPrice(property.price)}
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.title}</p>
        <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
          <span>{property.bedrooms} bed</span>
          <span>•</span>
          <span>{property.bathrooms} bath</span>
          {property.size_sqft && <><span>•</span><span>{property.size_sqft.toLocaleString()} sqft</span></>}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function MarketPropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const { agency } = useAuth()
  const agencyId = agency?.id

  const [property, setProperty] = useState<MarketProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [similar, setSimilar] = useState<MarketProperty[]>([])

  // ── Fetch property ──────────────────────────────────────────────────────
  const fetchProperty = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      // Fetch the single property
      const { data, error } = await supabase.from('properties').select('*').eq('id', id).single()
      if (error || !data) { throw new Error('Property not found') }
      setProperty(data as MarketProperty)
      setImgError(false)

      // Check if saved
      if (agencyId) {
        const { data: savedData } = await supabase
          .from('agent_listings')
          .select('id')
          .eq('agency_id', agencyId)
          .eq('property_id', id)
          .eq('source', 'bayut')
          .maybeSingle()
        setSaved(!!savedData)
      }

      // Fetch similar properties (same type, excluding current)
      const { data: similarData } = await supabase
        .from('properties')
        .select('*')
        .eq('property_type', (data as MarketProperty).property_type)
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(4)
      if (similarData) setSimilar(similarData as MarketProperty[])
    } catch (err: any) {
      setProperty(null)
    } finally {
      setLoading(false)
    }
  }, [id, agencyId])

  useEffect(() => { fetchProperty() }, [fetchProperty])

  // ── Save / Remove ───────────────────────────────────────────────────────
  const toggleSave = async () => {
    if (!agencyId || !property) { toast.error('You must be logged in'); return }
    setSaving(true)
    try {
      if (saved) {
        const { error } = await supabase.from('agent_listings').delete()
          .eq('agency_id', agencyId).eq('property_id', property.id).eq('source', 'bayut')
        if (error) throw error
        setSaved(false)
        toast.success('Removed from My Listings')
      } else {
        const { error } = await supabase.from('agent_listings').insert({
          agency_id: agencyId, property_id: property.id,
          title: property.title, price: property.price,
          location: property.location, property_type: property.property_type,
          bedrooms: property.bedrooms, bathrooms: property.bathrooms,
          size_sqft: property.size_sqft, image_url: property.image_url,
          source: 'bayut', status: 'active', listing_type: 'sale', is_public: false,
        })
        if (error) throw error
        setSaved(true)
        toast.success('Saved to My Listings')
      }
    } catch (err: any) {
      toast.error(err.message || 'Action failed')
    } finally {
      setSaving(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!')
  }

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) return <DetailSkeleton />

  // ── Not Found ───────────────────────────────────────────────────────────
  if (!property) {
    return (
      <div className="mp-root" style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
        <div className="mp-empty" style={{ padding: 64, background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)' }}>
          <div className="mp-empty-icon" style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--text-tertiary)' }}>
            <Icons.Home />
          </div>
          <p className="mp-empty-title" style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Property not found</p>
          <p className="mp-empty-sub" style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px' }}>This property may have been removed or the link is invalid.</p>
          <Link href="/dashboard/properties/market" className="mp-btn mp-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', fontSize: 12, fontWeight: 700, borderRadius: 100, border: '1.5px solid rgba(180,130,70,0.3)', color: 'var(--color-ochre)', background: 'transparent', textDecoration: 'none' }}>
            <Icons.ArrowLeft /> Back to Market
          </Link>
        </div>
      </div>
    )
  }

  const typeStyle = TYPE_COLORS[property.property_type] || { bg: 'rgba(180,130,70,0.15)', color: 'var(--color-ochre)', border: 'rgba(180,130,70,0.3)' }
  const amenities = parseAmenities(property.amenities)

  return (
    <div className="mp-root">
      {/* ── Back Link ── */}
      <Link
        href="/dashboard/properties/market"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 14px', borderRadius: 100, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180,130,70,0.3)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
      >
        <Icons.ArrowLeft /> Back to Market
      </Link>

      {/* ── Hero Image ── */}
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 24, background: 'var(--bg-tertiary)' }}>
        <div style={{ height: 420, background: 'var(--bg-tertiary)' }}>
          {property.image_url && !imgError ? (
            <img
              src={property.image_url}
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          )}
        </div>

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />

        {/* Type Badge (top-left) */}
        <span
          style={{
            position: 'absolute', top: 14, left: 14,
            background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}`,
            fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100,
            letterSpacing: '0.03em', textTransform: 'uppercase', backdropFilter: 'blur(6px)',
          }}
        >
          {property.property_type}
        </span>

        {/* Save button (top-right) */}
        <button
          onClick={toggleSave}
          disabled={saving}
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: saved ? '#50a06e' : '#fff',
            transition: 'all 0.15s',
          }}
          title={saved ? 'Remove from My Listings' : 'Save to My Listings'}
        >
          {saved ? <Icons.BookmarkFilled /> : <Icons.Bookmark />}
        </button>

        {/* Price (bottom-left) */}
        <div style={{ position: 'absolute', bottom: 14, left: 16, fontSize: 24, fontWeight: 800, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
          {formatPrice(property.price)}
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="mpd-grid">
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Title Block */}
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {property.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}><Icons.MapPin /></span>
              <span>{property.location || 'Location not available'}</span>
              <span style={{ color: 'var(--text-tertiary)', fontSize: 12, marginLeft: 4 }}>
                • Listed {property.created_at ? timeAgo(property.created_at) : 'recently'}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mpd-stats" style={{ display: 'flex', gap: 0, padding: 16, background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)' }}>
            <div className="mpd-stat" style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-tertiary)', marginBottom: 4, display: 'flex', justifyContent: 'center' }}><Icons.Bed /></div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{property.bedrooms}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Beds</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--border-secondary)', alignSelf: 'center' }} />
            <div className="mpd-stat" style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-tertiary)', marginBottom: 4, display: 'flex', justifyContent: 'center' }}><Icons.Bath /></div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{property.bathrooms}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Baths</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--border-secondary)', alignSelf: 'center' }} />
            <div className="mpd-stat" style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-tertiary)', marginBottom: 4, display: 'flex', justifyContent: 'center' }}><Icons.Ruler /></div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{property.size_sqft ? property.size_sqft.toLocaleString() : '—'}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sqft</div>
            </div>
          </div>

          {/* About this property */}
          {property.description && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>About this property</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{property.description}</p>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>Amenities</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {amenities.map((a, i) => (
                  <span key={i} className="mp-chip" style={{
                    padding: '6px 14px', fontSize: 12, fontWeight: 600,
                    background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                    border: '1px solid var(--border-primary)', borderRadius: 100,
                  }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Property Details Grid */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>Property details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Property type', value: property.property_type },
                { label: 'Bedrooms', value: property.bedrooms },
                { label: 'Bathrooms', value: property.bathrooms },
                { label: 'Size', value: property.size_sqft ? `${property.size_sqft.toLocaleString()} sqft` : '—' },
                { label: 'Listed', value: property.created_at ? new Date(property.created_at).toLocaleDateString() : '—' },
              ].filter(r => r.value !== null && r.value !== undefined && r.value !== '').map((row, i) => (
                <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-primary)' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>{row.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{row.value}</p>
                </div>
              ))}
              {property.furnishing && <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-primary)' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>Furnishing</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{property.furnishing}</p>
              </div>}
              {property.completion_status && <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-primary)' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>Completion</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{property.completion_status}</p>
              </div>}
              {property.permit_number && <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-primary)' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>Permit No.</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{property.permit_number}</p>
              </div>}
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>Similar properties</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {similar.slice(0, 4).map(p => (
                  <SimilarCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN / SIDEBAR ── */}
        <div className="mpd-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Price Card */}
          <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 18, border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Sale Price</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              {formatPrice(property.price)}
            </p>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-secondary)' }}>
              <span>{property.bedrooms} bed</span>
              <span>{property.bathrooms} bath</span>
              {property.size_sqft && <span>{property.size_sqft.toLocaleString()} sqft</span>}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={toggleSave}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '12px 16px', fontSize: 13, fontWeight: 700,
              borderRadius: 100, cursor: 'pointer', width: '100%',
              fontFamily: 'var(--font-body)',
              border: '1.5px solid',
              background: saved ? 'rgba(80,160,110,0.08)' : 'transparent',
              borderColor: saved ? 'rgba(80,160,110,0.25)' : 'rgba(180,130,70,0.3)',
              color: saved ? '#50a06e' : 'var(--color-ochre)',
              transition: 'all 0.15s',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saved ? <Icons.BookmarkFilled /> : <Icons.Bookmark />}
            {saved ? 'Saved to My Listings' : 'Save to My Listings'}
          </button>

          {/* Copy Link Button */}
          <button
            onClick={copyLink}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 16px', fontSize: 12, fontWeight: 600,
              borderRadius: 100, cursor: 'pointer', width: '100%',
              fontFamily: 'var(--font-body)',
              background: 'transparent',
              border: '1.5px solid var(--border-primary)',
              color: 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180,130,70,0.3)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <Icons.Copy /> Copy link
          </button>

          {/* Agent Contact */}
          {property.agent_name && (
            <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 18, border: '1px solid var(--border-primary)' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Listing Agent</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-espresso)', color: 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                  {property.agent_name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{property.agent_name}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {property.agent_phone && (
                  <a href={`tel:${property.agent_phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--color-ochre)', textDecoration: 'none' }}>
                    <Icons.Phone /> {property.agent_phone}
                  </a>
                )}
                {property.agent_email && (
                  <a href={`mailto:${property.agent_email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--color-ochre)', textDecoration: 'none' }}>
                    <Icons.Mail /> Email agent
                  </a>
                )}
              </div>
            </div>
          )}

          {/* View Original */}
          {property.source_url && (
            <a
              href={property.source_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 16px', fontSize: 12, fontWeight: 600,
                borderRadius: 100, width: '100%', textDecoration: 'none',
                background: 'rgba(180,130,70,0.08)', color: 'var(--color-ochre)',
                border: '1px solid rgba(180,130,70,0.2)',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.15s',
              }}
            >
              <Icons.ExternalLink /> View original listing
            </a>
          )}

          {/* Powered by Bayut */}
          <div style={{ padding: 12, textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)' }}>
            Powered by Bayut
          </div>
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        @keyframes mpspin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes mpPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .mpd-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .mpd-grid {
            grid-template-columns: 1fr;
          }
          .mpd-sidebar {
            position: static !important;
          }
        }

        .mp-card-clickable {
          transition: transform 0.22s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.22s ease;
        }
        .mp-card-clickable:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  )
}