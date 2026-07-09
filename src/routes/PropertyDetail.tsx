"use client";

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

// ─── Icons (subset – full list at bottom) ────────────────────────────────────
const Icons = {
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
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
  Square: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
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
  Save: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  ),
  Heart: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
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
  Loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Tag: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPriceAED(price: number): string {
  return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price).replace('AED', 'AED ')
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface PropertyDetail {
  id: string
  agency_id: string
  title: string
  description?: string
  price: number
  currency: string
  price_period?: string
  listing_type: string
  property_type: string
  bedrooms: number
  bathrooms: number
  size_sqft?: number
  size_sqm?: number
  furnished?: string
  amenities?: string[]
  primary_photo_url?: string
  photo_urls?: string[]
  source_agent_name?: string
  source_agent_phone?: string
  source_agency_name?: string
  listing_url?: string
  is_verified: boolean
  is_off_plan?: boolean
  last_synced_at?: string
  city?: string
  area?: string
  community?: string
  building_name?: string
  status?: string
  source_property_id?: string | null
  created_at: string
  // joined fields
  saved_in_agent?: boolean
}

interface MatchedLead {
  id: string
  lead_id: string
  lead_name: string
  lead_email: string
  match_score: number
  position: number
  was_included_in_email: boolean
  lead_reaction?: string
  email_sent_at?: string
}

export const PropertyDetail = () => {
  const { id } = useParams()
  const router = useRouter()
  const { agency } = useAuth()
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [matchedLeads, setMatchedLeads] = useState<MatchedLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  const allPhotos = property
    ? [property.primary_photo_url, ...(property.photo_urls || [])].filter(Boolean) as string[]
    : []

  const fetchProperty = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch agent_listings row by the route id
      const { data: listing, error: listingErr } = await supabase
        .from('agent_listings')
        .select(`
          id,
          source_property_id,
          agency_id,
          title,
          type,
          price,
          currency,
          location,
          bedrooms,
          bathrooms,
          description,
          features,
          status,
          listing_type,
          image_url,
          created_at
        `)
        .eq('id', id)
        .single()
      if (listingErr) throw listingErr
      if (!listing) throw new Error('Property not found')

      let globalProp: any = null
      let sourcePropertyId: string | null = listing.source_property_id

      // 2. If source_property_id exists, fetch the global properties row
      if (sourcePropertyId) {
        const { data: prop, error: propErr } = await supabase
          .from('properties')
          .select('*')
          .eq('id', sourcePropertyId)
          .single()
        if (!propErr && prop) {
          globalProp = prop
        }
      }

      // 3. Merge: agent_listings fields as primary, properties fields for richer data
      const mergedProperty: PropertyDetail = {
        id: listing.id,
        agency_id: listing.agency_id,
        title: listing.title,
        price: listing.price,
        currency: listing.currency,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        description: listing.description || '',
        status: listing.status,
        listing_type: listing.listing_type,
        property_type: listing.type,
        created_at: listing.created_at || new Date().toISOString(),

        // Fields from global properties (if joined)
        source_property_id: sourcePropertyId,
        size_sqft: globalProp?.size_sqft,
        size_sqm: globalProp?.size_sqm,
        furnished: globalProp?.furnished,
        amenities: globalProp?.amenities,
        primary_photo_url: globalProp?.primary_photo_url,
        photo_urls: globalProp?.photo_urls,
        source_agent_name: globalProp?.source_agent_name,
        source_agent_phone: globalProp?.source_agent_phone,
        source_agency_name: globalProp?.source_agency_name,
        listing_url: globalProp?.listing_url,
        is_verified: globalProp?.is_verified ?? false,
        is_off_plan: globalProp?.is_off_plan,
        last_synced_at: globalProp?.last_synced_at,
        city: globalProp?.city,
        area: globalProp?.area,
        community: globalProp?.community,
        building_name: globalProp?.building_name,
        price_period: globalProp?.price_period,
      }

      // 4. Check if saved to agent_properties (using the global source_property_id)
      const checkPropertyId = sourcePropertyId || null
      let isSaved = false
      if (checkPropertyId) {
        const { data: savedData } = await supabase
          .from('agent_properties')
          .select('id')
          .eq('property_id', checkPropertyId)
          .eq('agency_id', agency?.id)
          .maybeSingle()
        isSaved = !!savedData
      }
      setSaved(isSaved)
      mergedProperty.saved_in_agent = isSaved

      setProperty(mergedProperty)

      // 5. Fetch matched leads (using the global source_property_id)
      if (sourcePropertyId) {
        const { data: matches, error: matchErr } = await supabase
          .from('lead_matched_properties')
          .select(`
            id,
            lead_id,
            match_score,
            position,
            was_included_in_email,
            lead_reaction,
            email_sent_at,
            leads:lead_id (name, email)
          `)
          .eq('property_id', sourcePropertyId)
          .order('match_score', { ascending: false })

        if (!matchErr && matches) {
          setMatchedLeads(
            matches.map((m: any) => ({
              id: m.id,
              lead_id: m.lead_id,
              lead_name: m.leads?.name || 'Unknown',
              lead_email: m.leads?.email || '',
              match_score: m.match_score,
              position: m.position,
              was_included_in_email: m.was_included_in_email,
              lead_reaction: m.lead_reaction,
              email_sent_at: m.email_sent_at,
            }))
          )
        }
      } else {
        setMatchedLeads([])
      }
    } catch (err: any) {
      console.error('[PropertyDetail] fetch error:', err)
      setError(err.message || 'Failed to load property')
      toast.error('Failed to load property')
    } finally {
      setLoading(false)
    }
  }, [id, agency?.id])

  useEffect(() => {
    fetchProperty()
  }, [fetchProperty])

  // ── Save / Unsave ─────────────────────────────────────────────────────────
  const handleToggleSave = async () => {
    if (!property || !agency?.id) return
    const globalPropertyId = property.source_property_id
    if (!globalPropertyId) {
      toast.error('Cannot save — no global property record to reference')
      return
    }
    setSaving(true)
    try {
      if (saved) {
        // Remove from agent_properties using the global property id
        await supabase
          .from('agent_properties')
          .delete()
          .eq('property_id', globalPropertyId)
          .eq('agency_id', agency.id)
        toast.success('Removed from My Properties')
        setSaved(false)
        setProperty(prev => prev ? { ...prev, saved_in_agent: false } : null)
      } else {
        // Insert into agent_properties using the global property id
        await supabase
          .from('agent_properties')
          .insert({
            property_id: globalPropertyId,
            agency_id: agency.id,
            agent_id: null, // optionally current profile
            status: 'active',
          })
        toast.success('Saved to My Properties')
        setSaved(true)
        setProperty(prev => prev ? { ...prev, saved_in_agent: true } : null)
      }
    } catch (err: any) {
      toast.error(err.message || 'Action failed')
    } finally {
      setSaving(false)
    }
  }

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Icons.Loader />
          <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Loading property details...</p>
        </div>
      </div>
    )
  }

  // ── Error / Not Found ──────────────────────────────────────────────────────
  if (error || !property) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-tertiary)' }}>
            <Icons.AlertCircle />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>Property not found</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px' }}>
            {error || 'The property you are looking for does not exist or has been removed.'}
          </p>
          <button onClick={() => router.push('/dashboard/properties')} style={{ padding: '10px 20px', borderRadius: 12, background: 'var(--color-espresso)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            Back to Properties
          </button>
        </div>
      </div>
    )
  }

  // ── Main Render ────────────────────────────────────────────────────────────
  const locationPath = [property.city, property.area, property.community, property.building_name]
    .filter(Boolean)
    .join(' › ')

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

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '24px 24px 64px' }}>
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/properties')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', fontSize: 13, fontWeight: 600,
            color: 'var(--text-secondary)', background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)', borderRadius: 12,
            cursor: 'pointer', marginBottom: 20, transition: 'all 0.2s ease',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Icons.ArrowLeft /> Back to Properties
        </button>

        {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
        <div style={{
          background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
          borderRadius: 24, border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-md)', overflow: 'hidden', marginBottom: 24,
          animation: 'fadeSlideIn 0.4s ease',
        }}>
          {/* Photo Gallery */}
          {allPhotos.length > 0 && (
            <>
              <div className="pd-gallery" style={{ position: 'relative', height: 420, background: '#000' }}>
                <img
                  src={allPhotos[activePhotoIndex]}
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Navigation Arrows */}
                {allPhotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhotoIndex(prev => (prev - 1 + allPhotos.length) % allPhotos.length)}
                      style={{
                        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                        border: 'none', cursor: 'pointer', color: '#fff', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Icons.ChevronLeft />
                    </button>
                    <button
                      onClick={() => setActivePhotoIndex(prev => (prev + 1) % allPhotos.length)}
                      style={{
                        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                        border: 'none', cursor: 'pointer', color: '#fff', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Icons.ChevronRight />
                    </button>
                  </>
                )}
                {/* Overlay badges */}
                <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 100,
                    fontSize: 12, fontWeight: 600,
                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                    backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                  }}>
                    {formatPriceAED(property.price)}
                    {property.price_period ? `/${property.price_period}` : ''}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 100,
                    fontSize: 12, fontWeight: 600,
                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                    backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                    textTransform: 'capitalize',
                  }}>
                    {property.listing_type}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 100,
                    fontSize: 12, fontWeight: 600,
                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                    backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                  }}>
                    {property.property_type}
                  </span>
                  {property.is_verified && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '5px 12px', borderRadius: 100,
                      fontSize: 12, fontWeight: 600,
                      background: 'rgba(110, 140, 100, 0.3)', color: '#fff',
                      backdropFilter: 'blur(8px)', border: '1px solid rgba(110,140,100,0.5)',
                    }}>
                      <Icons.CheckCircle /> Verified
                    </span>
                  )}
                </div>
              </div>
              {/* Thumbnail strip */}
              {allPhotos.length > 1 && (
                <div style={{ display: 'flex', gap: 8, padding: 12, overflowX: 'auto', background: 'var(--bg-tertiary)' }}>
                  {allPhotos.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      style={{
                        width: 80, height: 60, borderRadius: 10, overflow: 'hidden',
                        flexShrink: 0, cursor: 'pointer',
                        border: idx === activePhotoIndex ? '2px solid var(--color-ochre)' : '2px solid transparent',
                        opacity: idx === activePhotoIndex ? 1 : 0.6,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {/* Fallback if no photos */}
          {allPhotos.length === 0 && (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
              No photos available
            </div>
          )}
        </div>

        {/* ─── MAIN CONTENT (two columns) ───────────────────────────────────── */}
        <div className="pd-main-grid">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                {property.title}
              </h1>
              {locationPath && (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icons.MapPin /> {locationPath}
                </p>
              )}
            </div>

            {/* Key Stats */}
            <div className="pd-stats-grid" style={{
              background: 'var(--bg-secondary)', borderRadius: 20,
              padding: 20, border: '1px solid var(--border-primary)',
            }}>
              {[
                { icon: <Icons.Bed />, label: 'Bedrooms', value: property.bedrooms },
                { icon: <Icons.Bath />, label: 'Bathrooms', value: property.bathrooms },
                { icon: <Icons.Square />, label: 'Area', value: property.size_sqft ? `${formatNumber(property.size_sqft)} sqft` : '—' },
                { icon: <Icons.CheckCircle />, label: 'Furnished', value: property.furnished ? property.furnished.charAt(0).toUpperCase() + property.furnished.slice(1) : 'N/A' },
              ].map((stat, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <span style={{ color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{stat.icon}</span>
                  <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{stat.value}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Amenities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {property.amenities.map((item, idx) => (
                    <span key={idx} style={{
                      padding: '6px 14px', borderRadius: 100,
                      fontSize: 12, fontWeight: 500,
                      background: 'var(--bg-hover)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border-secondary)',
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Description</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {property.description}
                </p>
              </div>
            )}

            {/* Map placeholder */}
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 20,
              padding: 40, border: '1px solid var(--border-primary)',
              textAlign: 'center', color: 'var(--text-tertiary)',
            }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>📍 Map coming soon</p>
              <p style={{ fontSize: 12, margin: '4px 0 0' }}>{locationPath}</p>
            </div>

            {/* Price History placeholder */}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Price History</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No price changes recorded for this property.</p>
            </div>
          </div>

          {/* Right Column / Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }} className="pd-sidebar">
            {/* Price Card */}
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 20,
              padding: 20, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
                {property.listing_type === 'rent' ? 'Rent' : 'Sale Price'}
              </p>
              <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                {formatPriceAED(property.price)}
                {property.price_period ? <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>/{property.price_period}</span> : ''}
              </p>
              {property.currency !== 'AED' && (
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>
                  ~{new Intl.NumberFormat('en-US', { style: 'currency', currency: property.currency || 'USD' }).format(property.price)}
                </p>
              )}
            </div>

            {/* Source Agent Card */}
            {property.source_agent_name && (
              <div style={{
                background: 'var(--bg-secondary)', borderRadius: 20,
                padding: 20, border: '1px solid var(--border-primary)',
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>Listing Agent</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-espresso)', color: 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                    {property.source_agent_name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{property.source_agent_name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{property.source_agency_name}</p>
                  </div>
                </div>
                {property.source_agent_phone && (
                  <a href={`tel:${property.source_agent_phone}`} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 500, color: 'var(--color-ochre)',
                    textDecoration: 'none',
                  }}>
                    <Icons.Phone /> {property.source_agent_phone}
                  </a>
                )}
              </div>
            )}

            {/* View on Bayut button */}
            {property.listing_url && (
              <a
                href={property.listing_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 16px', fontSize: 13, fontWeight: 600,
                  color: '#fff', background: '#e67e22',
                  border: 'none', borderRadius: 14, textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icons.ExternalLink /> View on Bayut
              </a>
            )}

            {/* Save to My Properties — only shown when there's a global property to reference */}
            {property.source_property_id ? (
              <button
                onClick={handleToggleSave}
                disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 16px', fontSize: 13, fontWeight: 600,
                  color: saved ? 'var(--color-sage)' : 'var(--text-primary)',
                  background: saved ? 'rgba(110,140,100,0.08)' : 'var(--bg-secondary)',
                  border: saved ? '1px solid rgba(110,140,100,0.2)' : '1px solid var(--border-primary)',
                  borderRadius: 14, cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saved ? (
                  <><Icons.CheckCircle /> Saved to My Properties</>
                ) : (
                  <><Icons.Save /> Save to My Properties</>
                )}
              </button>
            ) : (
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 16px', fontSize: 13, fontWeight: 600,
                  color: 'var(--text-tertiary)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 14, cursor: 'not-allowed',
                  opacity: 0.5,
                }}
              >
                <><Icons.Save /> Save to My Properties</>
              </div>
            )}

            {/* Sync Info */}
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 20,
              padding: 16, border: '1px solid var(--border-primary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-sage)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Last synced {property.last_synced_at ? timeAgo(property.last_synced_at) : 'N/A'}
                </span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>Bayut</span>
                {property.is_off_plan && <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: 'rgba(180,130,70,0.1)', color: 'var(--color-ochre)' }}>Off‑Plan</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ─── MATCHED LEADS SECTION ────────────────────────────────────────── */}
        <div style={{
          background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
          borderRadius: 24, border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-md)', padding: 24,
          animation: 'fadeSlideIn 0.4s ease',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Matched Leads</h3>
          {matchedLeads.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No leads matched to this property yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {matchedLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads/${lead.lead_id}`}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: 16, padding: '14px 16px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 14, border: '1px solid var(--border-secondary)',
                    textDecoration: 'none', color: 'inherit',
                    transition: 'all 0.2s ease', alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{lead.lead_name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{lead.lead_email}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 12px', borderRadius: 100,
                      fontSize: 12, fontWeight: 700,
                      background: lead.match_score >= 80 ? 'rgba(110,140,100,0.1)' : lead.match_score >= 60 ? 'rgba(217,175,40,0.1)' : 'rgba(220,38,38,0.1)',
                      color: lead.match_score >= 80 ? 'var(--color-sage)' : lead.match_score >= 60 ? '#D9AF28' : '#DC2626',
                    }}>
                      {lead.match_score}% match
                    </span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {lead.was_included_in_email ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 12, color: 'var(--color-sage)' }}>
                        <Icons.CheckCircle /> Sent
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Not sent</span>
                    )}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {lead.lead_reaction ? (
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                        {lead.lead_reaction}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>—</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ── Two-column layout (main + sidebar) ── */
        .pd-main-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          margin-bottom: 32px;
          align-items: start;
        }

        /* ── Photo gallery height ── */
        .pd-gallery {
          position: relative;
          height: 420px;
          background: #000;
        }

        /* ── Key stats grid ── */
        .pd-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        /* ── Matched leads grid header ── */
        .pd-lead-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 16px;
        }
        .pd-lead-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 14px 16px;
          background: var(--bg-tertiary);
          border-radius: 14px;
          border: 1px solid var(--border-secondary);
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
          align-items: center;
        }

        /* ════════════════════════════════════ TABLET — ≤1024px ════════ */
        @media (max-width: 1024px) {
          .pd-main-grid {
            grid-template-columns: 1fr;
          }
          .pd-main-grid > div:last-child {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            position: static !important;
          }
        }

        /* ════════════════════════════════════ MOBILE — ≤768px ════════ */
        @media (max-width: 768px) {
          .pd-gallery {
            height: 260px;
          }

          .pd-main-grid > div:last-child {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .pd-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            padding: 16px;
          }
          .pd-stats-grid > div:last-child {
            display: none;
          }

          .pd-lead-header {
            display: none;
          }
          .pd-lead-row {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 12px 14px;
          }
          .pd-lead-row > div:not(:first-child) {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .pd-lead-row > div:not(:first-child) > span {
            text-align: right;
          }
        }

        /* ════════════════════════════════════ SMALL — ≤400px ════════ */
        @media (max-width: 400px) {
          .pd-gallery {
            height: 200px;
          }
          .pd-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding: 14px;
          }
        }
      `}</style>
    </div>
  )
}

export default PropertyDetail