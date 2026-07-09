"use client";

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getPublicProperty, type PublicProperty } from '../lib/public'

const formatPrice = (price: number) => {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`
  return `$${price.toLocaleString()}`
}

const Icons = {
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Home: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
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
  MapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Share: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  ),
}

export function PublicListingView({ property }: { property: PublicProperty }) {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }
  const hasImage = !!property.image_url

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 14px', borderRadius: 100, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
          <Icons.ArrowLeft /> Back to Home
        </Link>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: 400, background: 'var(--bg-tertiary)' }}>
            {hasImage ? (
              <img src={property.image_url!} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                <Icons.Home />
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                {formatPrice(property.price)}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 8, textTransform: 'uppercase' }}>
                {property.listing_type}
              </span>
            </div>
          </div>

          <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>{property.title}</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icons.MapPin /> {property.location}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '16px 0', borderTop: '1px solid var(--border-secondary)', borderBottom: '1px solid var(--border-secondary)', marginBottom: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'center', marginBottom: 4 }}><Icons.Bed /></span>
                <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{property.bedrooms}</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase' }}>Beds</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'center', marginBottom: 4 }}><Icons.Bath /></span>
                <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{property.bathrooms}</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase' }}>Baths</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'center', marginBottom: 4 }}><Icons.Ruler /></span>
                <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{property.size_sqft ? property.size_sqft.toLocaleString() : '—'}</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase' }}>Sqft</p>
              </div>
            </div>

            {property.description && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Description</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{property.description}</p>
              </div>
            )}

            {(property.features || []).length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Features</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {property.features!.map((f, i) => (
                    <span key={i} style={{ padding: '6px 12px', fontSize: 12, fontWeight: 500, background: 'var(--bg-hover)', color: 'var(--text-secondary)', borderRadius: 100, border: '1px solid var(--border-secondary)' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button onClick={copyLink} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, border: '1px solid var(--border-primary)', background: 'var(--bg-hover)', borderRadius: 100, cursor: 'pointer', transition: 'all 0.2s' }}>
              <Icons.Share /> Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PublicListing() {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<PublicProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getPublicProperty(id)
      if (!data) throw new Error('Property not found')
      setProperty(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load property')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: 'var(--font-body)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-ochre)', animation: 'pulse 1.5s ease-in-out infinite' }}>
            <Icons.Home />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading property...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '20px', fontFamily: 'var(--font-body)' }}>
        <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)', maxWidth: 500 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-tertiary)' }}>
            <Icons.Home />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>Property not found</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px' }}>
            {error || 'This property may have been removed or is not publicly available.'}
          </p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, background: 'var(--color-espresso)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
            <Icons.ArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return <PublicListingView property={property} />
}

export default PublicListing