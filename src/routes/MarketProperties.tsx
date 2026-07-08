import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Bed: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v6"/><path d="M22 22v-6"/><path d="M2 14h20"/><path d="M6 8V4h12v4"/>
    </svg>
  ),
  Bath: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1z"/><path d="M6 12V5a2 2 0 012-2h3v2.25"/><path d="M4 21l1-1.5"/><path d="M20 21l-1-1.5"/>
    </svg>
  ),
  Bookmark: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  ),
  BookmarkFilled: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  ),
  Globe: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Ruler: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"/><path d="m7.5 10.5 3 3"/><path d="m10.5 7.5 3 3"/><path d="m13.5 4.5 3 3"/>
    </svg>
  ),
  Home: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  SlidersHorizontal: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/><line x1="21" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="3" y2="12"/><line x1="21" y1="20" x2="16" y2="20"/><line x1="12" y1="20" x2="3" y2="20"/><line x1="14" y1="2" x2="14" y2="6"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="16" y1="18" x2="16" y2="22"/>
    </svg>
  ),
  Check: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
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
}

// ─── Constants ──────────────────────────────────────────────────────────────────
const PROPERTY_TYPES = ['All', 'Apartment', 'Villa', 'Townhouse', 'Office']
const BEDROOM_OPTIONS = ['Any', '1', '2', '3', '4+']
const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under $500K', min: 0, max: 500000 },
  { label: '$500K – $1M', min: 500000, max: 1000000 },
  { label: '$1M – $2M', min: 1000000, max: 2000000 },
  { label: '$2M+', min: 2000000, max: Infinity },
]
const ITEMS_PER_PAGE = 20

const TYPE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Apartment: { bg: 'rgba(100,130,220,0.15)', color: '#7090dd', border: 'rgba(100,130,220,0.3)' },
  Villa:     { bg: 'rgba(180,130,70,0.15)',  color: 'var(--color-ochre)', border: 'rgba(180,130,70,0.3)' },
  Townhouse: { bg: 'rgba(110,160,130,0.15)', color: '#5da07a', border: 'rgba(110,160,130,0.3)' },
  Office:    { bg: 'rgba(180,100,80,0.15)',  color: '#c8705a', border: 'rgba(180,100,80,0.3)' },
}

const formatPrice = (price: number) => {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`
  return `$${price.toLocaleString()}`
}

// ─── Skeleton Card ──────────────────────────────────────────────────────────────
const PropertySkeleton = () => (
  <div className="mp-card mp-skeleton-card">
    <div className="mp-card-img-wrap mp-skeleton-img" />
    <div className="mp-card-body">
      <div className="mp-skel-line" style={{ width: '55%', height: 20, marginBottom: 8 }} />
      <div className="mp-skel-line" style={{ width: '75%', height: 13, marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div className="mp-skel-line" style={{ flex: 1, height: 44, borderRadius: 10 }} />
        <div className="mp-skel-line" style={{ flex: 1, height: 44, borderRadius: 10 }} />
        <div className="mp-skel-line" style={{ flex: 1, height: 44, borderRadius: 10 }} />
      </div>
      <div className="mp-skel-line" style={{ width: '100%', height: 38, borderRadius: 100 }} />
    </div>
  </div>
)

// ─── Price Dropdown ─────────────────────────────────────────────────────────────
function PriceDropdown({ onSelect, selectedIndex }: { onSelect: (i: number) => void; selectedIndex: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(p => !p)}
        className={`mp-chip ${selectedIndex > 0 ? 'mp-chip-active' : ''}`}
      >
        {PRICE_RANGES[selectedIndex].label}
        <span style={{ opacity: 0.55, display: 'flex', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>
          <Icons.ChevronDown />
        </span>
      </button>
      {open && (
        <div className="mp-dropdown">
          {PRICE_RANGES.map((range, idx) => (
            <button
              key={idx}
              className={`mp-dropdown-item ${selectedIndex === idx ? 'mp-dropdown-item-active' : ''}`}
              onClick={() => { onSelect(idx); setOpen(false) }}
            >
              {selectedIndex === idx && <span style={{ color: 'var(--color-ochre)', display: 'flex' }}><Icons.Check /></span>}
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Location Dropdown ──────────────────────────────────────────────────────────
function LocationDropdown({
  locations,
  value,
  onChange,
}: {
  locations: string[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = search
    ? locations.filter(l => l.toLowerCase().includes(search.toLowerCase())).slice(0, 40)
    : locations.slice(0, 40)

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(p => !p)}
        className={`mp-chip ${value ? 'mp-chip-active' : ''}`}
      >
        {value || 'Location'}
        <span style={{ opacity: 0.55, display: 'flex', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>
          <Icons.ChevronDown />
        </span>
      </button>
      {open && (
        <div className="mp-dropdown" style={{ width: 240 }}>
          {/* Search inside dropdown */}
          <div style={{ padding: '8px 8px 4px' }}>
            <input
              autoFocus
              placeholder="Search location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mp-loc-search"
            />
          </div>
          <button
            className={`mp-dropdown-item ${!value ? 'mp-dropdown-item-active' : ''}`}
            onClick={() => { onChange(''); setOpen(false); setSearch('') }}
          >
            {!value && <span style={{ color: 'var(--color-ochre)', display: 'flex' }}><Icons.Check /></span>}
            All Locations
          </button>
          {filtered.map(loc => (
            <button
              key={loc}
              className={`mp-dropdown-item ${value === loc ? 'mp-dropdown-item-active' : ''}`}
              onClick={() => { onChange(loc); setOpen(false); setSearch('') }}
            >
              {value === loc && <span style={{ color: 'var(--color-ochre)', display: 'flex' }}><Icons.Check /></span>}
              {loc}
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
              No locations found
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Property Card ──────────────────────────────────────────────────────────────
function PropertyCard({
  property,
  isSaved,
  onSave,
  onRemove,
}: {
  property: MarketProperty
  isSaved: boolean
  onSave: (p: MarketProperty) => void
  onRemove: (id: string) => void
}) {
  const [imgError, setImgError] = useState(false)
  const navigate = useNavigate()
  const typeStyle = TYPE_COLORS[property.property_type] || { bg: 'rgba(180,130,70,0.15)', color: 'var(--color-ochre)', border: 'rgba(180,130,70,0.3)' }

  return (
    <div
      className="mp-card mp-card-clickable"
      onClick={() => navigate(`/dashboard/properties/market/${property.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/dashboard/properties/market/${property.id}`) }}
    >
      {/* Image */}
      <div className="mp-card-img-wrap">
        {property.image_url && !imgError ? (
          <img
            src={property.image_url}
            alt={property.title}
            className="mp-card-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="mp-card-img-fallback">
            <Icons.Home />
          </div>
        )}

        {/* Gradient */}
        <div className="mp-card-gradient" />

        {/* Type Badge */}
        <span
          className="mp-badge"
          style={{ background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}` }}
        >
          {property.property_type}
        </span>

        {/* Price */}
        <div className="mp-card-price">
          {formatPrice(property.price)}
        </div>
      </div>

      {/* Body */}
      <div className="mp-card-body">
        {/* Title */}
        <h3 className="mp-card-title">{property.title}</h3>

        {/* Location */}
        <div className="mp-card-location">
          <span style={{ color: 'var(--text-tertiary)', display: 'flex', flexShrink: 0 }}><Icons.MapPin /></span>
          <span className="mp-truncate">{property.location || 'Location not available'}</span>
        </div>

        {/* Stats */}
        <div className="mp-stats">
          <div className="mp-stat">
            <span className="mp-stat-icon"><Icons.Bed /></span>
            <span className="mp-stat-val">{property.bedrooms}</span>
            <span className="mp-stat-label">Beds</span>
          </div>
          <div className="mp-stat-divider" />
          <div className="mp-stat">
            <span className="mp-stat-icon"><Icons.Bath /></span>
            <span className="mp-stat-val">{property.bathrooms}</span>
            <span className="mp-stat-label">Baths</span>
          </div>
          <div className="mp-stat-divider" />
          <div className="mp-stat">
            <span className="mp-stat-icon"><Icons.Ruler /></span>
            <span className="mp-stat-val">{property.size_sqft ? property.size_sqft.toLocaleString() : '—'}</span>
            <span className="mp-stat-label">Sqft</span>
          </div>
        </div>

        {/* Save / Saved Button */}
        {isSaved ? (
          <button
            className="mp-btn mp-btn-saved"
            onClick={(e) => { e.stopPropagation(); onRemove(property.id) }}
            title="Click to remove"
          >
            <Icons.BookmarkFilled />
            Saved
          </button>
        ) : (
          <button
            className="mp-btn mp-btn-save"
            onClick={(e) => { e.stopPropagation(); onSave(property) }}
          >
            <Icons.Bookmark />
            Save to My Listings
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function MarketProperties() {
  const { agency } = useAuth()
  const agencyId = agency?.id

  const [searchTerm, setSearchTerm]       = useState('')
  const [selectedType, setSelectedType]   = useState('All')
  const [selectedBedrooms, setSelectedBedrooms] = useState('Any')
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0)
  const [locationFilter, setLocationFilter] = useState('')

  const [properties, setProperties]         = useState<MarketProperty[]>([])
  const [savedIds, setSavedIds]             = useState<Set<string>>(new Set())
  const [loading, setLoading]               = useState(true)
  const [loadingMore, setLoadingMore]       = useState(false)
  const [page, setPage]                     = useState(0)
  const [totalCount, setTotalCount]         = useState(0)
  const [locations, setLocations]           = useState<string[]>([])

  const hasActiveFilters =
    searchTerm || selectedType !== 'All' || selectedBedrooms !== 'Any' ||
    selectedPriceIndex > 0 || locationFilter

  const displayedCount = properties.length
  const hasMore = totalCount > (page + 1) * ITEMS_PER_PAGE

  const activeFilterCount = [
    selectedType !== 'All',
    selectedBedrooms !== 'Any',
    selectedPriceIndex > 0,
    !!locationFilter,
  ].filter(Boolean).length

  // ── Fetch saved IDs ───────────────────────────────────────────────────────
  const fetchSavedIds = useCallback(async () => {
    if (!agencyId) return
    const { data } = await supabase
      .from('agent_listings')
      .select('property_id')
      .eq('agency_id', agencyId)
      .eq('source', 'bayut')
    if (data) setSavedIds(new Set(data.map(d => d.property_id)))
  }, [agencyId])

  // ── Fetch locations ───────────────────────────────────────────────────────
  const fetchLocations = useCallback(async () => {
    const { data } = await supabase.from('properties').select('location').not('location', 'is', null)
    if (data) {
      const unique = [...new Set(data.map(d => d.location).filter(Boolean))] as string[]
      setLocations(unique.sort())
    }
  }, [])

  // ── Fetch properties ──────────────────────────────────────────────────────
  const fetchProperties = useCallback(async (pageNum: number, append = false) => {
    if (!append) setLoading(true)
    else setLoadingMore(true)
    try {
      let query = supabase.from('properties').select('*', { count: 'exact' })
      if (searchTerm) query = query.ilike('title', `%${searchTerm}%`)
      if (selectedType !== 'All') query = query.eq('property_type', selectedType)
      if (selectedBedrooms !== 'Any') {
        if (selectedBedrooms === '4+') query = query.gte('bedrooms', 4)
        else query = query.eq('bedrooms', parseInt(selectedBedrooms))
      }
      const pr = PRICE_RANGES[selectedPriceIndex]
      if (selectedPriceIndex > 0) {
        if (pr.min > 0) query = query.gte('price', pr.min)
        if (pr.max < Infinity) query = query.lte('price', pr.max)
      }
      if (locationFilter) query = query.ilike('location', `%${locationFilter}%`)

      const from = pageNum * ITEMS_PER_PAGE
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, from + ITEMS_PER_PAGE - 1)

      if (error) throw error
      setProperties(prev => append ? [...prev, ...(data || [])] : (data || []))
      setTotalCount(count || 0)
    } catch {
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [searchTerm, selectedType, selectedBedrooms, selectedPriceIndex, locationFilter])

  // ── Save ──────────────────────────────────────────────────────────────────
  const saveToListings = async (property: MarketProperty) => {
    if (!agencyId) { toast.error('You must be logged in'); return }
    const { error } = await supabase.from('agent_listings').insert({
      agency_id: agencyId, property_id: property.id,
      title: property.title, price: property.price,
      location: property.location, property_type: property.property_type,
      bedrooms: property.bedrooms, bathrooms: property.bathrooms,
      size_sqft: property.size_sqft, image_url: property.image_url,
      source: 'bayut', status: 'active', listing_type: 'sale', is_public: false,
    })
    if (error) { toast.error(error.message); return }
    setSavedIds(prev => new Set(prev).add(property.id))
    toast.success('Saved to My Listings')
  }

  // ── Remove ─────────────────────────────────────────────────────────────────
  const removeFromSaved = async (propertyId: string) => {
    if (!agencyId) return
    const { error } = await supabase.from('agent_listings').delete()
      .eq('agency_id', agencyId).eq('property_id', propertyId).eq('source', 'bayut')
    if (error) { toast.error(error.message); return }
    setSavedIds(prev => { const n = new Set(prev); n.delete(propertyId); return n })
    toast.success('Removed from My Listings')
  }

  // ── Clear ──────────────────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearchTerm(''); setSelectedType('All'); setSelectedBedrooms('Any')
    setSelectedPriceIndex(0); setLocationFilter(''); setPage(0)
  }

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => { fetchLocations() }, [fetchLocations])
  useEffect(() => { fetchSavedIds() }, [fetchSavedIds])
  useEffect(() => {
    setPage(0)
    fetchProperties(0, false)
  }, [searchTerm, selectedType, selectedBedrooms, selectedPriceIndex, locationFilter]) // eslint-disable-line

  return (
    <div className="mp-root">
      {/* ── Header ── */}
      <header className="mp-header">
        <div className="mp-header-left">
          <h1 className="mp-heading">Browse Market</h1>
          <p className="mp-subheading">4,300+ Dubai properties powered by Bayut</p>
        </div>
        <div className="mp-count-pill">
          <span className="mp-count-icon"><Icons.Globe /></span>
          <span className="mp-count-num">{totalCount.toLocaleString()}</span>
          <span className="mp-count-label">properties</span>
        </div>
      </header>

      {/* ── Search ── */}
      <div className="mp-search-wrap">
        <span className="mp-search-icon"><Icons.Search /></span>
        <input
          type="text"
          className="mp-search"
          placeholder="Search by title, area, location..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="mp-search-clear" onClick={() => setSearchTerm('')}>
            <Icons.X />
          </button>
        )}
      </div>

      {/* ── Filter Bar ── */}
      <div className="mp-filter-bar">
        {/* Property Type */}
        <div className="mp-chip-group">
          {PROPERTY_TYPES.map(type => (
            <button
              key={type}
              className={`mp-chip ${selectedType === type ? 'mp-chip-active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mp-filter-sep" />

        {/* Bedrooms */}
        <div className="mp-chip-group">
          {BEDROOM_OPTIONS.map(bed => (
            <button
              key={bed}
              className={`mp-chip ${selectedBedrooms === bed ? 'mp-chip-active' : ''}`}
              onClick={() => setSelectedBedrooms(bed)}
            >
              {bed === 'Any' ? 'Any' : `${bed} BD`}
            </button>
          ))}
        </div>

        <div className="mp-filter-sep" />

        {/* Price */}
        <PriceDropdown
          selectedIndex={selectedPriceIndex}
          onSelect={setSelectedPriceIndex}
        />

        {/* Location */}
        <LocationDropdown
          locations={locations}
          value={locationFilter}
          onChange={setLocationFilter}
        />

        {/* Clear all (only when filters active) */}
        {hasActiveFilters && (
          <>
            <div className="mp-filter-sep" />
            <button className="mp-chip mp-chip-clear" onClick={clearFilters}>
              <Icons.X /> Clear {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
            </button>
          </>
        )}
      </div>

      {/* ── Results Bar ── */}
      {!loading && properties.length > 0 && (
        <div className="mp-results-bar">
          <span className="mp-results-text">
            Showing <strong>{displayedCount}</strong> of <strong>{totalCount.toLocaleString()}</strong> properties
          </span>
          {hasActiveFilters && (
            <button className="mp-results-clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="mp-grid">
          {Array.from({ length: 8 }).map((_, i) => <PropertySkeleton key={i} />)}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && properties.length === 0 && (
        <div className="mp-empty">
          <div className="mp-empty-icon"><Icons.Home /></div>
          <p className="mp-empty-title">No properties found</p>
          <p className="mp-empty-sub">Try adjusting your search or filters</p>
          {hasActiveFilters && (
            <button className="mp-btn mp-btn-outline" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && properties.length > 0 && (
        <>
          <div className="mp-grid">
            {properties.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                isSaved={savedIds.has(p.id)}
                onSave={saveToListings}
                onRemove={removeFromSaved}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mp-load-more">
              <p className="mp-load-more-sub">
                {displayedCount} of {totalCount.toLocaleString()} shown
              </p>
              <button
                className="mp-btn mp-btn-load"
                onClick={() => {
                  const next = page + 1
                  setPage(next)
                  fetchProperties(next, true)
                }}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading…' : 'Load More Properties'}
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Global Styles ── */}
      <style>{`
        /* ─ Layout ─ */
        .mp-root {
          max-width: 1400px;
          margin: 0 auto;
          font-family: var(--font-body);
          color: var(--text-primary);
          padding-bottom: 48px;
        }

        /* ─ Header ─ */
        .mp-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .mp-heading {
          font-family: var(--font-display);
          font-size: clamp(24px, 5vw, 38px);
          font-weight: 700;
          letter-spacing: -0.025em;
          margin: 0 0 2px;
          line-height: 1.1;
        }
        .mp-subheading {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 500;
        }
        .mp-count-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: 100px;
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
        }
        .mp-count-icon { color: var(--color-ochre); display: flex; }
        .mp-count-num  { font-size: 13px; font-weight: 700; }
        .mp-count-label { font-size: 11px; color: var(--text-tertiary); font-weight: 500; }

        /* ─ Search ─ */
        .mp-search-wrap {
          position: relative;
          margin-bottom: 12px;
        }
        .mp-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          display: flex;
          pointer-events: none;
        }
        .mp-search {
          width: 100%;
          padding: 13px 44px 13px 42px;
          font-size: 14px;
          font-family: var(--font-body);
          background: var(--bg-secondary);
          border: 1.5px solid var(--border-primary);
          border-radius: 100px;
          color: var(--text-primary);
          outline: none;
          font-weight: 500;
          box-shadow: var(--shadow-sm);
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .mp-search:focus {
          border-color: rgba(180,130,70,0.4);
          box-shadow: 0 0 0 3px rgba(180,130,70,0.07);
        }
        .mp-search-clear {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-tertiary);
          padding: 4px;
          display: flex;
          border-radius: 50%;
          transition: color 0.15s;
        }
        .mp-search-clear:hover { color: var(--text-primary); }

        /* ─ Filter Bar ─ */
        .mp-filter-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 4px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: var(--border-secondary) transparent;
        }
        .mp-filter-bar::-webkit-scrollbar { height: 3px; }
        .mp-filter-bar::-webkit-scrollbar-thumb { background: var(--border-secondary); border-radius: 4px; }
        .mp-chip-group { display: flex; gap: 4px; flex-shrink: 0; }
        .mp-filter-sep { width: 1px; height: 22px; background: var(--border-secondary); flex-shrink: 0; }

        /* ─ Chips ─ */
        .mp-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 600;
          font-family: var(--font-body);
          border-radius: 100px;
          border: 1.5px solid var(--border-primary);
          cursor: pointer;
          white-space: nowrap;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          box-shadow: var(--shadow-sm);
          transition: all 0.18s ease;
          flex-shrink: 0;
        }
        .mp-chip:hover {
          border-color: rgba(180,130,70,0.3);
          color: var(--text-primary);
        }
        .mp-chip-active {
          background: var(--color-ochre) !important;
          color: #fff !important;
          border-color: var(--color-ochre) !important;
          box-shadow: 0 2px 10px rgba(180,130,70,0.3) !important;
        }
        .mp-chip-clear {
          background: rgba(200,80,60,0.08);
          border-color: rgba(200,80,60,0.2);
          color: #c85040;
        }
        .mp-chip-clear:hover {
          background: rgba(200,80,60,0.14);
          border-color: rgba(200,80,60,0.35);
          color: #b83a2a;
        }

        /* ─ Dropdowns ─ */
        .mp-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          min-width: 180px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: 14px;
          box-shadow: var(--shadow-lg);
          z-index: 200;
          padding: 4px;
          animation: mpDropIn 0.15s ease;
        }
        @keyframes mpDropIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .mp-dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 500;
          font-family: var(--font-body);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          text-align: left;
          border-radius: 8px;
          transition: background 0.12s;
        }
        .mp-dropdown-item:hover { background: var(--bg-hover); color: var(--text-primary); }
        .mp-dropdown-item-active { font-weight: 700; color: var(--color-ochre); }
        .mp-loc-search {
          width: 100%;
          padding: 7px 10px;
          font-size: 12px;
          font-family: var(--font-body);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
          border-radius: 8px;
          color: var(--text-primary);
          outline: none;
          box-sizing: border-box;
        }

        /* ─ Results Bar ─ */
        .mp-results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          gap: 8px;
          flex-wrap: wrap;
        }
        .mp-results-text { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
        .mp-results-text strong { color: var(--text-primary); font-weight: 700; }
        .mp-results-clear {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-ochre);
          background: none;
          border: 1px solid rgba(180,130,70,0.25);
          border-radius: 100px;
          padding: 4px 12px;
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.15s;
        }
        .mp-results-clear:hover {
          background: rgba(180,130,70,0.08);
          border-color: rgba(180,130,70,0.4);
        }

        /* ─ Grid ─ */
        .mp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        @media (max-width: 1200px) { .mp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 860px)  { .mp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
        @media (max-width: 480px)  { .mp-grid { grid-template-columns: 1fr; gap: 10px; } }

        /* ─ Card (clickable) ─ */
        .mp-card {
          background: var(--bg-secondary);
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid var(--border-primary);
          box-shadow: var(--shadow-sm);
          transition: transform 0.22s cubic-bezier(.22,.61,.36,1), box-shadow 0.22s ease;
          animation: mpFade 0.35s ease both;
          display: flex;
          flex-direction: column;
        }
        .mp-card-clickable {
          cursor: pointer;
        }
        .mp-card-clickable:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
        }
        .mp-card-clickable:hover .mp-card-img {
          transform: scale(1.04);
        }
        @keyframes mpFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ─ Card Image ─ */
        .mp-card-img-wrap {
          position: relative;
          height: 190px;
          overflow: hidden;
          background: var(--bg-tertiary);
          flex-shrink: 0;
        }
        .mp-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s cubic-bezier(.22,.61,.36,1);
        }
        .mp-card-img-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          background: var(--bg-tertiary);
        }
        .mp-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%);
          pointer-events: none;
        }
        .mp-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 100px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .mp-card-price {
          position: absolute;
          bottom: 10px;
          left: 12px;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }

        /* ─ Card Body ─ */
        .mp-card-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
        }
        .mp-card-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 5px;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mp-card-location {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
        }
        .mp-truncate {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ─ Stats ─ */
        .mp-stats {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-top: 1px solid var(--border-secondary);
          border-bottom: 1px solid var(--border-secondary);
          margin-bottom: 12px;
          gap: 0;
        }
        .mp-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .mp-stat-icon { color: var(--text-tertiary); display: flex; }
        .mp-stat-val {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }
        .mp-stat-label {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-tertiary);
        }
        .mp-stat-divider {
          width: 1px;
          height: 28px;
          background: var(--border-secondary);
          flex-shrink: 0;
        }

        /* ─ Buttons ─ */
        .mp-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-body);
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.18s ease;
          width: 100%;
          border: 1.5px solid transparent;
          letter-spacing: 0.01em;
        }
        .mp-btn-save {
          background: transparent;
          border-color: rgba(180,130,70,0.3);
          color: var(--color-ochre);
        }
        .mp-btn-save:hover {
          background: rgba(180,130,70,0.08);
          border-color: rgba(180,130,70,0.55);
        }
        .mp-btn-saved {
          background: rgba(80,160,110,0.08);
          border-color: rgba(80,160,110,0.25);
          color: #50a06e;
          cursor: pointer;
        }
        .mp-btn-saved:hover {
          background: rgba(200,70,60,0.07);
          border-color: rgba(200,70,60,0.25);
          color: #c84030;
        }
        .mp-btn-outline {
          background: transparent;
          border-color: rgba(180,130,70,0.3);
          color: var(--color-ochre);
          padding: 10px 24px;
          width: auto;
        }
        .mp-btn-outline:hover {
          background: rgba(180,130,70,0.08);
          border-color: rgba(180,130,70,0.5);
        }
        .mp-btn-load {
          background: transparent;
          border-color: rgba(180,130,70,0.3);
          color: var(--color-ochre);
          padding: 12px 28px;
          font-size: 13px;
          width: auto;
        }
        .mp-btn-load:hover {
          background: rgba(180,130,70,0.08);
          border-color: rgba(180,130,70,0.5);
        }
        .mp-btn-load:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ─ Empty State ─ */
        .mp-empty {
          padding: 64px 24px;
          text-align: center;
          background: var(--bg-secondary);
          border-radius: 20px;
          border: 1px solid var(--border-primary);
          box-shadow: var(--shadow-sm);
        }
        .mp-empty-icon {
          width: 56px; height: 56px;
          border-radius: 16px;
          background: var(--bg-tertiary);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          color: var(--text-tertiary);
        }
        .mp-empty-title { font-size: 15px; font-weight: 700; margin: 0 0 4px; }
        .mp-empty-sub   { font-size: 13px; color: var(--text-secondary); margin: 0 0 20px; }

        /* ─ Load More ─ */
        .mp-load-more {
          text-align: center;
          padding: 20px 0 40px;
        }
        .mp-load-more-sub {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
          margin: 0 0 12px;
        }

        /* ─ Skeleton ─ */
        .mp-skeleton-card { pointer-events: none; }
        .mp-skeleton-img { height: 190px; background: var(--bg-tertiary); }
        .mp-skel-line {
          background: var(--bg-tertiary);
          border-radius: 6px;
          animation: mpPulse 1.5s ease-in-out infinite;
        }
        @keyframes mpPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }

        /* ─ Mobile tweaks ─ */
        @media (max-width: 600px) {
          .mp-header { margin-bottom: 16px; }
          .mp-heading { letter-spacing: -0.02em; }
          .mp-card-img-wrap { height: 170px; }
          .mp-card-price { font-size: 18px; }
        }
      `}</style>
    </div>
  )
}