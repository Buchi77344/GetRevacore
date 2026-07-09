"use client";

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface MatchedProperty {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  property_type: string
  listing_type: string
  primary_photo_url?: string | null
  match_score: number
  currency: string
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Home: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Bed: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v6"/><path d="M22 22v-6"/><path d="M2 14h20"/><path d="M6 8V4h12v4"/>
    </svg>
  ),
  Bath: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1z"/><path d="M6 12V5a2 2 0 012-2h3v2.25"/><path d="M4 21l1-1.5"/><path d="M20 21l-1-1.5"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Loader: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'rc-prop-spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (price: number, currency = 'USD') => {
  if (price >= 1_000_000) return `${currency === 'AED' ? 'AED ' : '$'}${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000) return `${currency === 'AED' ? 'AED ' : '$'}${(price / 1_000).toFixed(0)}K`
  return `${currency === 'AED' ? 'AED ' : '$'}${price}`
}

const scoreColor = (score: number) => {
  if (score >= 80) return { text: '#6B8F71', bg: 'rgba(107,143,113,0.08)', border: 'rgba(107,143,113,0.2)' }
  if (score >= 60) return { text: '#D9AF28', bg: 'rgba(217,175,40,0.08)', border: 'rgba(217,175,40,0.2)' }
  return { text: '#DC2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.15)' }
}

// ─── Component ────────────────────────────────────────────────────────────────
interface MatchPropertiesProps {
  leadId: string
  agencyId: string
  leadBudget?: number | null
  leadPropertyType?: string | null
  leadLocation?: string | null
}

export const MatchPropertiesForLead = ({
  leadId,
  agencyId,
  leadBudget,
  leadPropertyType,
  leadLocation,
}: MatchPropertiesProps) => {
  const [matches, setMatches] = useState<MatchedProperty[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasRun, setHasRun] = useState(false)

  const fetchMatches = useCallback(async () => {
    if (!leadId) return
    setLoading(true)
    setError(null)
    setHasRun(true)

    try {
      // Try the match_properties_for_lead RPC first
      const { data, error: rpcError } = await supabase.rpc('match_properties_for_lead', {
        lead_id: leadId,
        limit_count: 5,
      })

      if (!rpcError && data && Array.isArray(data)) {
        setMatches(data as MatchedProperty[])
        setLoading(false)
        return
      }

      // Fallback to client-side matching
      await fetchMatchesFallback()
    } catch {
      await fetchMatchesFallback()
    } finally {
      setLoading(false)
    }
  }, [leadId])

  const fetchMatchesFallback = useCallback(async () => {
    const allProperties: MatchedProperty[] = []

    try {
      // Query global properties (Bayut data)
      const { data: globalData } = await supabase
        .from('global_properties')
        .select('id, title, price, location, city, area, bedrooms, bathrooms, property_type, type, listing_type, primary_photo_url, image_url, currency')
        .order('price', { ascending: true })
        .limit(15)

      if (globalData) {
        for (const prop of globalData) {
          let score = 50
          const propType = (prop.property_type || prop.type || '').toLowerCase()
          const loc = (prop.location || prop.city || prop.area || '').toLowerCase()
          if (leadPropertyType && propType.includes(leadPropertyType.toLowerCase())) score += 25
          if (leadBudget) {
            const diff = Math.abs(prop.price - leadBudget)
            if (diff <= leadBudget * 0.3) score += 20
            else if (diff <= leadBudget * 0.6) score += 10
          }
          if (leadLocation && loc.includes(leadLocation.toLowerCase())) score += 15
          allProperties.push({
            id: prop.id,
            title: prop.title || `${prop.property_type || prop.type || 'Property'} in ${prop.location || prop.city || ''}`,
            price: prop.price || 0,
            location: prop.location || prop.city || prop.area || '',
            bedrooms: prop.bedrooms || 0,
            bathrooms: prop.bathrooms || 0,
            property_type: prop.property_type || prop.type || 'Property',
            listing_type: prop.listing_type || 'sale',
            primary_photo_url: prop.primary_photo_url || prop.image_url || null,
            match_score: Math.min(100, score),
            currency: prop.currency || 'USD',
          })
        }
      }

      // Query agency's own properties
      if (agencyId) {
        const { data: agencyProps } = await supabase
          .from('properties')
          .select('id, title, price, location, bedrooms, bathrooms, property_type, type, listing_type, primary_photo_url, image_url, currency')
          .eq('agency_id', agencyId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(10)

        if (agencyProps) {
          for (const prop of agencyProps) {
            let score = 55
            const propType = (prop.property_type || prop.type || '').toLowerCase()
            const loc = (prop.location || '').toLowerCase()
            if (leadPropertyType && propType.includes(leadPropertyType.toLowerCase())) score += 25
            if (leadBudget) {
              const diff = Math.abs(prop.price - leadBudget)
              if (diff <= leadBudget * 0.3) score += 20
              else if (diff <= leadBudget * 0.6) score += 10
            }
            if (leadLocation && loc.includes(leadLocation.toLowerCase())) score += 15
            allProperties.push({
              id: prop.id,
              title: prop.title || `${prop.property_type || prop.type || 'Property'} in ${prop.location || ''}`,
              price: prop.price || 0,
              location: prop.location || '',
              bedrooms: prop.bedrooms || 0,
              bathrooms: prop.bathrooms || 0,
              property_type: prop.property_type || prop.type || 'Property',
              listing_type: prop.listing_type || 'sale',
              primary_photo_url: prop.primary_photo_url || prop.image_url || null,
              match_score: Math.min(100, score),
              currency: prop.currency || 'USD',
            })
          }
        }
      }
    } catch (err) {
      console.error('[MatchProperties] Fallback error:', err)
      setError('Could not fetch property matches')
    }

    allProperties.sort((a, b) => b.match_score - a.match_score)
    setMatches(allProperties.slice(0, 5))
  }, [agencyId, leadPropertyType, leadBudget, leadLocation])

  useEffect(() => {
    fetchMatches()
  }, [fetchMatches])

  if (!hasRun && loading) {
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 20,
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-md)',
        padding: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', padding: '20px 0' }}>
          <div style={{ color: 'var(--color-ochre)' }}><Icons.Loader /></div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Matching properties to this lead...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      backdropFilter: 'blur(16px)',
      borderRadius: 20,
      border: '1px solid var(--border-primary)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px 14px',
        borderBottom: '1px solid var(--border-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--color-ochre)', display: 'flex' }}><Icons.Sparkle /></span>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Matching Properties
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {loading && <div style={{ color: 'var(--color-ochre)' }}><Icons.Loader /></div>}
          <button
            onClick={fetchMatches}
            disabled={loading}
            style={{
              padding: '5px 10px', fontSize: 11, fontWeight: 600,
              color: 'var(--text-tertiary)', background: 'var(--bg-hover)',
              border: '1px solid var(--border-secondary)', borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 16px 16px' }}>
        {error && (
          <div style={{
            padding: '12px 14px', borderRadius: 12,
            background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)',
            marginBottom: 12,
          }}>
            <p style={{ fontSize: 12, color: '#DC2626', margin: 0 }}>{error}</p>
          </div>
        )}

        {matches.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'var(--bg-hover)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 10px', color: 'var(--text-tertiary)',
            }}>
              <Icons.Home />
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              No matching properties found
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Update the lead's preferences or add properties to your portfolio
            </p>
          </div>
        )}

        {matches.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {matches.map((property) => {
              const score = scoreColor(property.match_score)
              return (
                <Link
                  key={property.id}
                  href={`/dashboard/properties/${property.id}`}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-hover)'
                    e.currentTarget.style.borderColor = 'var(--color-ochre)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)'
                    e.currentTarget.style.borderColor = 'var(--border-secondary)'
                  }}
                >
                  {/* Property Image */}
                  <div style={{
                    width: 64, height: 64, borderRadius: 10,
                    background: 'var(--bg-hover)', flexShrink: 0,
                    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {property.primary_photo_url ? (
                      <img
                        src={property.primary_photo_url}
                        alt={property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <div style={{ color: 'var(--text-tertiary)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {property.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}><Icons.MapPin /></span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {property.location || 'Location N/A'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ochre)' }}>
                        {formatPrice(property.price, property.currency)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-tertiary)' }}>
                        <Icons.Bed /> {property.bedrooms}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-tertiary)' }}>
                        <Icons.Bath /> {property.bathrooms}
                      </span>
                    </div>
                  </div>

                  {/* Score Badge */}
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: 100,
                    background: score.bg,
                    border: `1px solid ${score.border}`,
                    fontSize: 11,
                    fontWeight: 700,
                    color: score.text,
                    flexShrink: 0,
                  }}>
                    {property.match_score}%
                  </div>

                  <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
                    <Icons.ChevronRight />
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {matches.length > 0 && (
        <Link
          href="/dashboard/properties"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '12px 16px',
            borderTop: '1px solid var(--border-secondary)',
            fontSize: 12, fontWeight: 600, color: 'var(--color-ochre)',
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
        >
          <Icons.Sparkle /> View all properties
          <Icons.ChevronRight />
        </Link>
      )}

      <style>{`
        @keyframes rc-prop-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default MatchPropertiesForLead