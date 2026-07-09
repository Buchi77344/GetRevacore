"use client";

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 18h6v4H9z"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Bed: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v6"/><path d="M22 22v-6"/><path d="M2 14h20"/><path d="M6 8V4h12v4"/>
    </svg>
  ),
  Bath: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1z"/><path d="M6 12V5a2 2 0 012-2h3v2.25"/><path d="M4 21l1-1.5"/><path d="M20 21l-1-1.5"/>
    </svg>
  ),
  Eye: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Tag: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Grid: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  List: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Loader: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
    </svg>
  ),
}

// ─── Status config ──────────────────────────────────────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string; label: string }> = {
  active:  { bg: 'rgba(110, 140, 100, 0.06)', text: 'var(--color-sage)',      dot: 'var(--color-sage)',      border: 'rgba(110, 140, 100, 0.15)', label: 'Active'  },
  pending: { bg: 'rgba(217, 175, 40, 0.06)',  text: '#D9AF28',                dot: '#D9AF28',                border: 'rgba(217, 175, 40, 0.15)',  label: 'Pending' },
  sold:    { bg: 'rgba(59, 130, 246, 0.06)',  text: '#3B82F6',                dot: '#3B82F6',                border: 'rgba(59, 130, 246, 0.15)',  label: 'Sold'    },
  draft:   { bg: 'var(--bg-hover)',            text: 'var(--text-secondary)',   dot: 'var(--text-tertiary)',   border: 'var(--border-secondary)',   label: 'Draft'   },
}

const formatPrice = (price: number) => {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
  if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
  return `$${price}`
}
const formatNumber = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(1)}K` : String(num)
function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

// ─── Types ──────────────────────────────────────────────────────────────────────
interface Property {
  id: string
  agency_id: string
  agent_id?: string | null
  title: string
  type: string
  price: number
  currency: string
  location: string
  country?: string | null
  bedrooms: number
  bathrooms: number
  description?: string | null
  features?: string[]
  status: string
  listing_type: string
  is_public: boolean
  slug?: string | null
  created_at: string
  agent_name?: string
  agent_initials?: string
  image_url?: string
  views?: number
  inquiries?: number
  days_on_market?: number
}

// ─── Data Hook ──────────────────────────────────────────────────────────────────
function usePropertiesData(agencyId?: string) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    if (!agencyId) return
    setLoading(true)
    setError(null)
    try {
      const { data: listings, error: listingsErr } = await supabase
        .from('agent_listings')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false })
      if (listingsErr) throw listingsErr

      const { data: agents, error: agentsErr } = await supabase
        .from('agent_profiles')
        .select('id, name')
        .eq('agency_id', agencyId)
      if (agentsErr) throw agentsErr
      const agentMap = new Map(agents?.map(a => [a.id, a.name]) || [])

      const enriched: Property[] = (listings || []).map(p => ({
        ...p,
        agent_name: agentMap.get(p.agent_id) || 'Unassigned',
        agent_initials: agentMap.get(p.agent_id) ? getInitials(agentMap.get(p.agent_id)!) : 'NA',
        image_url: p.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
        views: 0,
        inquiries: 0,
        days_on_market: Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      }))
      setProperties(enriched)
    } catch (err: any) {
      console.error('Failed to fetch properties:', err)
      setError(err.message)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }, [agencyId])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  useEffect(() => {
    if (!agencyId) return
    const channel = supabase
      .channel('properties-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_listings', filter: `agency_id=eq.${agencyId}` }, () => fetchProperties())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [agencyId, fetchProperties])

  const createProperty = async (payload: Partial<Property>) => {
    const { error } = await supabase.from('agent_listings').insert({
      agency_id: agencyId, agent_id: payload.agent_id || null,
      title: payload.title, type: payload.type, price: payload.price,
      currency: payload.currency || 'USD', location: payload.location,
      country: payload.country || null, bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms, description: payload.description || null,
      features: payload.features || [], status: payload.status || 'active',
      listing_type: payload.listing_type || 'sale', is_public: payload.is_public ?? false,
      image_url: payload.image_url || null,
    })
    if (error) throw error
    toast.success('Property created')
    fetchProperties()
  }

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    const { error } = await supabase.from('agent_listings').update(updates).eq('id', id)
    if (error) throw error
    toast.success('Property updated')
    fetchProperties()
  }

  const deleteProperty = async (id: string) => {
    const { error } = await supabase.from('agent_listings').delete().eq('id', id)
    if (error) throw error
    toast.success('Property deleted')
    fetchProperties()
  }

  return { properties, loading, error, fetchProperties, createProperty, updateProperty, deleteProperty }
}

// ─── Property Form Modal ────────────────────────────────────────────────────────
const PropertyFormModal = ({ isOpen, onClose, onSave, initialData, agents, onDelete }: any) => {
  const [form, setForm] = useState({
    title: '', type: 'Villa', price: '', location: '', bedrooms: '', bathrooms: '',
    description: '', status: 'active', listing_type: 'sale', agent_id: '', features: [] as string[], image_url: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          title: initialData.title || '', type: initialData.type || 'Villa',
          price: initialData.price?.toString() || '', location: initialData.location || '',
          bedrooms: initialData.bedrooms?.toString() || '', bathrooms: initialData.bathrooms?.toString() || '',
          description: initialData.description || '', status: initialData.status || 'active',
          listing_type: initialData.listing_type || 'sale', agent_id: initialData.agent_id || '',
          features: initialData.features || [], image_url: initialData.image_url || '',
        })
      } else {
        setForm({ title: '', type: 'Villa', price: '', location: '', bedrooms: '', bathrooms: '',
          description: '', status: 'active', listing_type: 'sale', agent_id: '', features: [], image_url: '' })
      }
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.price) { toast.error('Title and price are required'); return }
    setSaving(true)
    try {
      await onSave({ ...form, price: parseFloat(form.price), bedrooms: parseInt(form.bedrooms) || 0, bathrooms: parseInt(form.bathrooms) || 0, agent_id: form.agent_id || null })
      onClose()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-secondary)', borderRadius: 24, border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', padding: 24, animation: 'modalIn 0.25s cubic-bezier(0.22,0.61,0.36,1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{initialData ? 'Edit Property' : 'Add Property'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, borderRadius: 8, display: 'flex' }}><Icons.X /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><label style={labelStyle}>Title *</label><input type="text" placeholder="e.g. Luxury Villa" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><label style={labelStyle}>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={selectStyle}>
                <option>Villa</option><option>Penthouse</option><option>House</option><option>Townhouse</option><option>Apartment</option><option>Commercial</option><option>Industrial</option>
              </select>
            </div>
            <div><label style={labelStyle}>Price *</label><input type="number" placeholder="500000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} required /></div>
          </div>
          <div><label style={labelStyle}>Location</label><input type="text" placeholder="City, Country" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><label style={labelStyle}>Bedrooms</label><input type="number" placeholder="3" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} style={inputStyle} /></div>
            <div><label style={labelStyle}>Bathrooms</label><input type="number" placeholder="2" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={selectStyle}>
                {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Listing Type</label>
              <select value={form.listing_type} onChange={e => setForm({ ...form, listing_type: e.target.value })} style={selectStyle}>
                <option value="sale">For Sale</option><option value="rent">For Rent</option>
              </select>
            </div>
          </div>
          <div><label style={labelStyle}>Agent</label>
            <select value={form.agent_id} onChange={e => setForm({ ...form, agent_id: e.target.value })} style={selectStyle}>
              <option value="">Unassigned</option>
              {agents.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Image URL</label>
            <input type="text" placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={inputStyle} />
            <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4, marginBottom: 0 }}>Enter a direct image URL for the property</p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...submitBtnStyle, opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : 'Save'}</button>
            {initialData && (
              <button type="button" onClick={async () => {
                if (confirm('Delete this property?')) {
                  try { await onDelete(initialData.id); onClose() } catch (e: any) { toast.error(e.message) }
                }
              }} style={{ ...cancelBtnStyle, color: '#DC2626', borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)', flex: 'none', padding: '12px 16px' }}>
                <Icons.Trash />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export const Properties = () => {
  const { agency } = useAuth()
  const agencyId = agency?.id
  const { properties, loading, error, fetchProperties, createProperty, updateProperty, deleteProperty } = usePropertiesData(agencyId)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [agents, setAgents] = useState<any[]>([])
  const [visibleStats, setVisibleStats] = useState<number[]>([])

  useEffect(() => {
    if (agencyId) {
      supabase.from('agent_profiles').select('id, name').eq('agency_id', agencyId).then(({ data }) => setAgents(data || []))
    }
  }, [agencyId])

  // Staggered stat cards entrance — mirrors Dashboard
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setVisibleStats([0, 1, 2, 3, 4, 5]), 100)
      return () => clearTimeout(timer)
    }
  }, [loading])

  const filteredProperties = useMemo(() => {
    let filtered = [...properties]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || (p.agent_name || '').toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') filtered = filtered.filter(p => p.status === statusFilter)
    if (typeFilter !== 'all') filtered = filtered.filter(p => p.type === typeFilter)
    switch (sortBy) {
      case 'price_high': filtered.sort((a, b) => b.price - a.price); break
      case 'price_low': filtered.sort((a, b) => a.price - b.price); break
      case 'oldest': filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break
    }
    return filtered
  }, [properties, searchQuery, statusFilter, typeFilter, sortBy])

  const ITEMS_PER_PAGE = 6
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const stats = useMemo(() => ({
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    totalValue: properties.reduce((sum, p) => sum + p.price, 0),
    totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
    avgDaysOnMarket: properties.length ? Math.round(properties.reduce((sum, p) => sum + (p.days_on_market || 0), 0) / properties.length) : 0,
    totalInquiries: properties.reduce((sum, p) => sum + (p.inquiries || 0), 0),
  }), [properties])

  const handleSave = async (data: any) => {
    if (editingProperty) await updateProperty(editingProperty.id, data)
    else await createProperty(data)
  }

  const openNewModal = () => { setEditingProperty(null); setModalOpen(true) }
  const openEditModal = (property: Property) => { setEditingProperty(property); setModalOpen(true) }
  const handleFilterChange = (setter: (v: string) => void, value: string) => { setter(value); setCurrentPage(1) }

  // ── Stat card definitions — same shape as Dashboard ────────────────────────
  const statCards = [
    { label: 'Total Portfolio',  value: stats.total,                       change: `${stats.total} properties`,      icon: <Icons.Home />,        accent: 'var(--color-ochre)',      accentBg: 'rgba(180,130,70,0.08)' },
    { label: 'Portfolio Value',  value: formatPrice(stats.totalValue),      change: 'total market value',             icon: <Icons.DollarSign />,  accent: 'var(--color-sage)',       accentBg: 'rgba(110,140,100,0.08)' },
    { label: 'Total Views',      value: formatNumber(stats.totalViews),     change: 'across all listings',            icon: <Icons.Eye />,         accent: '#3B82F6',                 accentBg: 'rgba(59,130,246,0.08)' },
    { label: 'Inquiries',        value: stats.totalInquiries,               change: 'active leads',                   icon: <Icons.TrendingUp />,  accent: 'var(--color-terracotta)', accentBg: 'rgba(195,95,70,0.08)' },
    { label: 'Active Listings',  value: stats.active,                       change: 'live now',                       icon: <Icons.Building />,    accent: 'var(--color-sage)',       accentBg: 'rgba(110,140,100,0.08)', isDark: true },
    { label: 'Avg. Days Listed', value: stats.avgDaysOnMarket,              change: 'days on market',                 icon: <Icons.Clock />,       accent: '#B8860B',                 accentBg: 'rgba(184,134,11,0.08)' },
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ochre)', border: '1px solid var(--border-primary)' }}>
          <Icons.Loader />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, margin: 0 }}>Loading properties…</p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>

      {/* Ambient background — matches Dashboard */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 30% -10%, rgba(180,130,70,0.03) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 90% 90%, rgba(195,95,70,0.02) 0%, transparent 60%),
          radial-gradient(ellipse 30% 30% at 10% 60%, rgba(110,140,100,0.02) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto' }}>

        {/* ── Error Banner — same as Dashboard ── */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 14, marginBottom: 20,
            background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: '#DC2626', flexShrink: 0 }}><Icons.AlertCircle /></span>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0, fontWeight: 500, flex: 1 }}>{error}</p>
            <button onClick={fetchProperties} style={{ padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(220,38,38,.2)', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#DC2626', flexShrink: 0 }}>Retry</button>
          </div>
        )}

        {/* ── Header — mirrors Dashboard header ── */}
        <header style={{ marginBottom: 'var(--props-section-gap)' }}>
          <div className="props-header-row">
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
                {agency?.name || 'Agency'}
                <span style={{ color: 'var(--color-ochre)', margin: '0 4px' }}>·</span>
                Property Portfolio
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 600, lineHeight: 1.1, margin: '8px 0 0', letterSpacing: '-0.02em' }}>
                Properties{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--color-ochre)' }}>
                  ({properties.length})
                </em>
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* View toggle — styled like plan badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)',
                borderRadius: 100, padding: 3,
              }}>
                <button onClick={() => setViewMode('grid')} style={{
                  padding: '7px 12px', borderRadius: 100, border: 'none',
                  background: viewMode === 'grid' ? 'var(--bg-secondary)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  cursor: 'pointer', display: 'flex', transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
                }}><Icons.Grid /></button>
                <button onClick={() => setViewMode('list')} style={{
                  padding: '7px 12px', borderRadius: 100, border: 'none',
                  background: viewMode === 'list' ? 'var(--bg-secondary)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  cursor: 'pointer', display: 'flex', transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
                }}><Icons.List /></button>
              </div>
              <button onClick={openNewModal} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', fontSize: 13, fontWeight: 700,
                color: 'var(--color-cream)', background: 'var(--color-espresso)',
                border: 'none', borderRadius: 100, cursor: 'pointer',
                transition: 'all 0.2s ease', boxShadow: 'var(--shadow-md)',
                whiteSpace: 'nowrap',
              }}>
                <Icons.Plus /> Add Property
              </button>
            </div>
          </div>
        </header>

        {/* ── Stat Cards — same pattern as Dashboard stats-grid ── */}
        <div className="props-stats-grid" style={{ marginBottom: 'var(--props-section-gap)' }}>
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="props-stat-card"
              style={{
                background: stat.isDark ? 'var(--color-espresso)' : 'var(--bg-secondary)',
                border: stat.isDark ? 'none' : '1px solid var(--border-primary)',
                color: stat.isDark ? 'var(--color-cream)' : 'inherit',
                opacity: visibleStats.includes(idx) ? 1 : 0,
                transform: visibleStats.includes(idx) ? 'translateY(0)' : 'translateY(12px)',
                transition: `all 0.35s cubic-bezier(0.22,0.61,0.36,1) ${idx * 60}ms`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: stat.isDark ? 'rgba(255,255,255,0.1)' : stat.accentBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.isDark ? 'var(--color-ochre)' : stat.accent,
                }}>{stat.icon}</div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 600,
                  color: stat.isDark ? 'rgba(247,243,236,0.7)' : 'var(--color-sage)',
                  background: stat.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(110,140,100,0.08)',
                  padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap',
                  maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  <Icons.TrendingUp /> {stat.change}
                </span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: stat.isDark ? 'rgba(247,243,236,0.6)' : 'var(--text-secondary)', margin: '0 0 6px' }}>
                {stat.label}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>
                {stat.value}
              </p>
              {/* Decorative corner accent */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 0 0 100%', background: stat.isDark ? 'rgba(255,255,255,0.04)' : stat.accentBg, opacity: 0.6, pointerEvents: 'none' }} />
            </div>
          ))}
        </div>

        {/* ── Filters Bar — matches Dashboard quick-actions-bar ── */}
        <nav className="props-filters-nav" style={{ marginBottom: 'var(--props-section-gap)' }}>
          <span className="props-filters-label">
            <Icons.Filter /> Filter
          </span>

          <div className="props-filters-inner">
            {/* Search */}
            <div style={{ position: 'relative', flex: 2, minWidth: 180 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex', pointerEvents: 'none' }}>
                <Icons.Search />
              </span>
              <input
                type="text"
                placeholder="Search by title, location, agent…"
                value={searchQuery}
                onChange={e => handleFilterChange(setSearchQuery, e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px 10px 36px', fontSize: 13,
                  background: 'var(--bg-primary)', border: '1px solid transparent',
                  borderRadius: 100, color: 'var(--text-primary)', outline: 'none',
                  fontWeight: 500, transition: 'all 0.2s ease', boxSizing: 'border-box',
                }}
              />
            </div>

            <select value={statusFilter} onChange={e => handleFilterChange(setStatusFilter, e.target.value)} style={filterSelectStyle}>
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>

            <select value={typeFilter} onChange={e => handleFilterChange(setTypeFilter, e.target.value)} style={filterSelectStyle}>
              <option value="all">All Types</option>
              {['Villa','Penthouse','House','Townhouse','Apartment','Commercial','Industrial'].map(t => <option key={t}>{t}</option>)}
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={filterSelectStyle}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_high">Price: High → Low</option>
              <option value="price_low">Price: Low → High</option>
            </select>
          </div>
        </nav>

        {/* ── Property Cards ── */}
        {!error && filteredProperties.length === 0 && (
          <div style={{
            padding: '64px 24px', textAlign: 'center',
            background: 'var(--bg-secondary)', borderRadius: 20,
            border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)',
            animation: 'fadeSlideIn 0.4s ease forwards',
          }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-tertiary)' }}>
              <Icons.Home />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>No properties found</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 20px' }}>Try adjusting your filters or add a new listing</p>
            <button onClick={openNewModal} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700,
              color: 'var(--color-cream)', background: 'var(--color-espresso)',
              padding: '10px 20px', borderRadius: 100, border: 'none', cursor: 'pointer',
            }}><Icons.Plus /> Add Property</button>
          </div>
        )}

        {!error && filteredProperties.length > 0 && (
          <>
            {/* Results count */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
                Showing <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{filteredProperties.length}</span> properties
              </p>
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' ? (
                <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); setTypeFilter('all') }} style={{
                  fontSize: 12, fontWeight: 600, color: 'var(--color-ochre)', background: 'none',
                  border: '1px solid rgba(180,130,70,0.3)', borderRadius: 100, padding: '4px 12px',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}>Clear filters</button>
              ) : null}
            </div>

            {viewMode === 'grid' ? (
              <div className="props-cards-grid">
                {paginatedProperties.map((property, cardIdx) => {
                  const status = statusConfig[property.status] || statusConfig.active
                  return (
                    <div
                      key={property.id}
                      className="props-card"
                      style={{
                        animationDelay: `${cardIdx * 50}ms`,
                        border: selectedProperty === property.id ? '1px solid rgba(180,130,70,0.4)' : '1px solid var(--border-primary)',
                        boxShadow: selectedProperty === property.id ? '0 0 0 3px rgba(180,130,70,0.1), var(--shadow-md)' : 'var(--shadow-md)',
                      }}
                      onClick={() => setSelectedProperty(selectedProperty === property.id ? null : property.id)}
                    >
                      {/* Property Image */}
                      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                        <img
                          src={property.image_url}
                          alt={property.title}
                          className="props-card-img"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.72) 100%)' }} />

                        {/* Badges */}
                        <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px',
                            borderRadius: 100, fontSize: 11, fontWeight: 600,
                            background: status.bg, color: status.text, border: `1px solid ${status.border}`,
                            backdropFilter: 'blur(8px)',
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot, animation: property.status === 'active' ? 'pulse-dot 2s ease-in-out infinite' : 'none' }} />
                            {status.label}
                          </span>
                          {property.is_public && (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px',
                              borderRadius: 100, fontSize: 11, fontWeight: 600,
                              background: 'rgba(180,130,70,0.15)', color: 'var(--color-ochre)',
                              border: '1px solid rgba(180,130,70,0.25)', backdropFilter: 'blur(8px)',
                            }}>
                              <Icons.Star /> Featured
                            </span>
                          )}
                        </div>

                        {/* Price overlay */}
                        <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                          <span style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
                            {formatPrice(property.price)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: 'var(--props-card-pad)' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                          {property.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
                          <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}><Icons.MapPin /></span>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{property.location}</span>
                        </div>

                        {/* Stats row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, padding: '12px 0', borderTop: '1px solid var(--border-secondary)', borderBottom: '1px solid var(--border-secondary)', marginBottom: 14 }}>
                          {[
                            { icon: <Icons.Bed />, value: property.bedrooms, label: 'Beds' },
                            { icon: <Icons.Bath />, value: property.bathrooms, label: 'Baths' },
                            { icon: <Icons.Tag />, value: property.type.slice(0, 3), label: 'Type' },
                            { icon: <Icons.Eye />, value: formatNumber(property.views || 0), label: 'Views' },
                          ].map((s, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                              <span style={{ color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'center', marginBottom: 2 }}>{s.icon}</span>
                              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{s.value}</p>
                              <p style={{ fontSize: 10, color: 'var(--text-tertiary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{s.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Tags + agent */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1 }}>
                            {(property.features || []).slice(0, 3).map((tag, i) => (
                              <span key={i} style={{ padding: '3px 8px', fontSize: 10, fontWeight: 600, background: 'var(--bg-hover)', color: 'var(--text-secondary)', borderRadius: 6, border: '1px solid var(--border-secondary)' }}>{tag}</span>
                            ))}
                          </div>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-espresso)', color: 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                            {property.agent_initials}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Detail Panel */}
                      <div style={{
                        maxHeight: selectedProperty === property.id ? 160 : 0,
                        opacity: selectedProperty === property.id ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'all 0.35s cubic-bezier(0.22,0.61,0.36,1)',
                        borderTop: selectedProperty === property.id ? '1px solid var(--border-primary)' : 'none',
                      }}>
                        <div style={{ padding: 'var(--props-card-pad)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                            {property.description || 'No description available.'}
                          </p>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Link href={`/dashboard/properties/${property.id}`} style={{
                              flex: 1, textAlign: 'center', padding: '10px 14px', fontSize: 12, fontWeight: 700,
                              color: 'var(--color-cream)', background: 'var(--color-espresso)',
                              border: 'none', borderRadius: 100, textDecoration: 'none', transition: 'all 0.2s ease',
                            }}>
                              View Details <Icons.ArrowRight />
                            </Link>
                            <button onClick={e => { e.stopPropagation(); openEditModal(property) }} style={{
                              flex: 1, padding: '10px 14px', fontSize: 12, fontWeight: 600,
                              color: 'var(--text-primary)', background: 'var(--bg-hover)',
                              border: '1px solid var(--border-secondary)', borderRadius: 100,
                              cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            }}>
                              <Icons.Edit /> Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* ── List View ── */
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 2fr 1fr 1fr 1fr 1fr', gap: 12, padding: '14px 20px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <div>Photo</div><div>Property</div><div>Price</div><div>Details</div><div>Status</div><div>Agent</div>
                </div>
                {paginatedProperties.map((property, i) => {
                  const status = statusConfig[property.status] || statusConfig.active
                  return (
                    <div key={property.id} className="props-list-row" style={{ animationDelay: `${i * 40}ms` }}>
                      <div style={{ width: 86, height: 62, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={property.image_url} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.title}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                          <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}><Icons.MapPin /></span>
                          <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.location}</span>
                        </div>
                      </div>
                      <div><span style={{ fontSize: 14, fontWeight: 700 }}>{formatPrice(property.price)}</span></div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}><Icons.Bed /> {property.bedrooms}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}><Icons.Bath /> {property.bathrooms}</span>
                      </div>
                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: status.bg, color: status.text, border: `1px solid ${status.border}` }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: status.dot }} />{status.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--color-espresso)', color: 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                          {property.agent_initials}
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.agent_name}</span>
                        <button onClick={() => openEditModal(property)} style={{ marginLeft: 'auto', padding: '6px 8px', background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', flexShrink: 0 }}>
                          <Icons.Edit />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="props-pagination" style={{ background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)', padding: '14px 20px' }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
                  Showing <strong style={{ color: 'var(--text-primary)' }}>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProperties.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{filteredProperties.length}</strong>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{
                    padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: 100,
                    border: '1px solid var(--border-secondary)', background: currentPage === 1 ? 'transparent' : 'var(--bg-tertiary)',
                    color: currentPage === 1 ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, transition: 'all 0.2s',
                  }}>← Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} style={{
                      width: 36, height: 36, fontSize: 13, fontWeight: 600, borderRadius: 100,
                      border: page === currentPage ? 'none' : '1px solid transparent',
                      background: page === currentPage ? 'var(--color-espresso)' : 'transparent',
                      color: page === currentPage ? 'var(--color-cream)' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>{page}</button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{
                    padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: 100,
                    border: '1px solid var(--border-secondary)', background: currentPage === totalPages ? 'transparent' : 'var(--bg-tertiary)',
                    color: currentPage === totalPages ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, transition: 'all 0.2s',
                  }}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Property Form Modal */}
      <PropertyFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={deleteProperty}
        initialData={editingProperty}
        agents={agents}
      />

      <style>{`
        /* ── Responsive design tokens ── */
        :root {
          --props-section-gap: 24px;
          --props-card-pad: 16px;
        }

        /* ── Stat cards — same class pattern as Dashboard ── */
        .props-stat-card {
          border-radius: 20px;
          padding: var(--props-card-pad);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          cursor: default;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .props-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        /* ── Stats grid: 6 cols → 3 → 2 → 2 ── */
        .props-stats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
        }

        /* ── Header row ── */
        .props-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: var(--props-section-gap);
        }

        /* ── Filters nav — mirrors quick-actions-bar ── */
        .props-filters-nav {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: 20px;
          box-shadow: var(--shadow-md);
          flex-wrap: wrap;
        }
        .props-filters-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
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
        .props-filters-inner {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          flex: 1;
          align-items: center;
        }

        /* ── Property cards grid ── */
        .props-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        /* ── Individual card ── */
        .props-card {
          background: var(--bg-secondary);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.22,0.61,0.36,1), box-shadow 0.25s ease, border-color 0.25s ease;
          animation: fadeSlideIn 0.4s ease both;
        }
        .props-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .props-card:hover .props-card-img { transform: scale(1.04); }
        .props-card-img { transition: transform 0.5s cubic-bezier(0.22,0.61,0.36,1) !important; }

        /* ── List row ── */
        .props-list-row {
          display: grid;
          grid-template-columns: 100px 2fr 1fr 1fr 1fr 1fr;
          gap: 12px;
          padding: 12px 20px;
          align-items: center;
          border-bottom: 1px solid var(--border-secondary);
          transition: background 0.15s ease;
          cursor: pointer;
          animation: fadeSlideIn 0.35s ease both;
        }
        .props-list-row:hover { background: var(--bg-hover); }
        .props-list-row:last-child { border-bottom: none; }

        /* ── Pagination row ── */
        .props-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        /* ────────────────────────────────────────────
           TABLET — ≤1200px
        ──────────────────────────────────────────── */
        @media (max-width: 1200px) {
          .props-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .props-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ────────────────────────────────────────────
           TABLET — ≤1024px
        ──────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .props-stats-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 12px; }
          .props-list-row { grid-template-columns: 80px 2fr 1fr 1fr; }
          .props-list-row > div:nth-child(6) { display: none; }
        }

        /* ────────────────────────────────────────────
           MOBILE — ≤768px
        ──────────────────────────────────────────── */
        @media (max-width: 768px) {
          :root {
            --props-section-gap: 16px;
            --props-card-pad: 14px;
          }

          /* Stats: 2-col grid */
          .props-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px;
          }
          .props-stat-card { border-radius: 16px; padding: 16px; }

          /* Header: stack */
          .props-header-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            margin-bottom: 16px;
          }
          .props-header-row > div:last-child {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          /* Filters nav: stack */
          .props-filters-nav {
            flex-direction: column;
            align-items: stretch;
            padding: 14px;
            gap: 12px;
            border-radius: 16px;
          }
          .props-filters-label {
            border-right: none;
            padding-right: 0;
            border-bottom: 1px solid var(--border-primary);
            padding-bottom: 10px;
          }
          .props-filters-inner {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .props-filters-inner > div:first-child {
            grid-column: 1 / -1;
          }

          /* Cards: single column */
          .props-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 12px;
          }

          /* List: compact */
          .props-list-row {
            grid-template-columns: 70px 1fr 1fr;
            gap: 10px;
            padding: 10px 14px;
          }
          .props-list-row > div:nth-child(4),
          .props-list-row > div:nth-child(5),
          .props-list-row > div:nth-child(6) { display: none; }

          /* Pagination: center */
          .props-pagination {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }

        /* ────────────────────────────────────────────
           SMALL MOBILE — ≤480px
        ──────────────────────────────────────────── */
        @media (max-width: 480px) {
          .props-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px; }
          .props-filters-inner { grid-template-columns: 1fr; }
          .props-filters-inner > div:first-child { grid-column: 1; }
        }

        /* ── Animations ── */
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(110,140,100,0.5); }
          50%       { box-shadow: 0 0 0 4px rgba(110,140,100,0); }
        }
      `}</style>
    </div>
  )
}

// ─── Shared Styles ──────────────────────────────────────────────────────────────
const filterSelectStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 13, fontWeight: 500,
  background: 'var(--bg-primary)', border: '1px solid transparent',
  borderRadius: 100, color: 'var(--text-primary)', outline: 'none',
  cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: 4,
  textTransform: 'uppercase', letterSpacing: '0.04em',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', fontSize: 13, fontWeight: 500,
  background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
  borderRadius: 10, color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
}
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }
const cancelBtnStyle: React.CSSProperties = {
  flex: 1, padding: '12px', fontSize: 13, fontWeight: 600,
  color: 'var(--text-secondary)', background: 'var(--bg-hover)',
  border: '1px solid var(--border-secondary)', borderRadius: 14, cursor: 'pointer',
}
const submitBtnStyle: React.CSSProperties = {
  flex: 1, padding: '12px', fontSize: 13, fontWeight: 700,
  color: '#fff', background: 'var(--color-espresso)',
  border: 'none', borderRadius: 14, cursor: 'pointer',
}

export default Properties