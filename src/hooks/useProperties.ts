import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Property {
  id: string
  agency_id: string
  title: string
  description?: string | null
  price: number
  currency: string
  property_type?: string
  listing_type: string
  bedrooms: number
  bathrooms: number
  size_sqft?: number
  location: string
  city?: string
  area?: string
  community?: string
  building_name?: string
  primary_photo_url?: string | null
  is_verified?: boolean
  created_at: string
}

export interface AgentProperty {
  id: string
  agent_id: string
  agency_id: string
  property_id: string
  lead_id?: string | null
  notes?: string | null
  status: string
  added_at: string
  property?: Property // joined property data
}

export interface AgentPropertyWithDetails extends AgentProperty {
  property: Property
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useProperties(agentId?: string, agencyId?: string) {
  const [agentProperties, setAgentProperties] = useState<AgentPropertyWithDetails[]>([])
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all properties in the agency
  const fetchAllProperties = useCallback(async () => {
    if (!agencyId) return
    try {
      const { data, error: err } = await supabase
        .from('properties')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false })

      if (err) throw err
      setAllProperties(data || [])
    } catch (err: any) {
      console.error('Failed to fetch all properties:', err)
      setError(err.message)
    }
  }, [agencyId])

  // Fetch agent's assigned properties (from agent_properties table)
  const fetchAgentProperties = useCallback(async () => {
    if (!agentId || !agencyId) return
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('agent_properties')
        .select(`
          id,
          agent_id,
          agency_id,
          property_id,
          lead_id,
          notes,
          status,
          added_at,
          properties (
            id,
            agency_id,
            title,
            description,
            price,
            currency,
            property_type,
            listing_type,
            bedrooms,
            bathrooms,
            size_sqft,
            location,
            city,
            area,
            community,
            building_name,
            primary_photo_url,
            is_verified,
            created_at
          )
        `)
        .eq('agent_id', agentId)
        .eq('agency_id', agencyId)
        .eq('status', 'active')
        .order('added_at', { ascending: false })

      if (err) throw err

      const properties = (data || []).map((ap: any) => ({
        id: ap.id,
        agent_id: ap.agent_id,
        agency_id: ap.agency_id,
        property_id: ap.property_id,
        lead_id: ap.lead_id,
        notes: ap.notes,
        status: ap.status,
        added_at: ap.added_at,
        property: ap.properties,
      }))

      setAgentProperties(properties)
    } catch (err: any) {
      console.error('Failed to fetch agent properties:', err)
      setError(err.message)
      toast.error('Failed to load your properties')
    } finally {
      setLoading(false)
    }
  }, [agentId, agencyId])

  // Initial fetch on mount
  useEffect(() => {
    fetchAllProperties()
    fetchAgentProperties()
  }, [fetchAllProperties, fetchAgentProperties])

  // Subscribe to realtime changes
  useEffect(() => {
    if (!agencyId) return

    const channel = supabase
      .channel(`agent-properties-${agentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_properties',
          filter: `agent_id=eq.${agentId}`,
        },
        () => fetchAgentProperties()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [agentId, agencyId, fetchAgentProperties])

  // Add property to agent's portfolio
  const addPropertyToAgent = useCallback(
    async (propertyId: string, notes?: string) => {
      if (!agentId || !agencyId) {
        toast.error('Agent information missing')
        return
      }

      try {
        // Check if already assigned
        const { data: existing } = await supabase
          .from('agent_properties')
          .select('id')
          .eq('agent_id', agentId)
          .eq('property_id', propertyId)
          .maybeSingle()

        if (existing) {
          toast.error('This property is already assigned to you')
          return
        }

        // Insert into agent_properties
        const { error } = await supabase.from('agent_properties').insert({
          agent_id: agentId,
          agency_id: agencyId,
          property_id: propertyId,
          status: 'active',
          notes: notes || null,
        })

        if (error) throw error
        toast.success('Property added to your portfolio')
        await fetchAgentProperties()
      } catch (err: any) {
        console.error('Failed to add property:', err)
        toast.error(err.message || 'Failed to add property')
      }
    },
    [agentId, agencyId, fetchAgentProperties]
  )

  // Remove property from agent's portfolio
  const removePropertyFromAgent = useCallback(
    async (propertyId: string) => {
      if (!agentId) {
        toast.error('Agent information missing')
        return
      }

      try {
        const { error } = await supabase
          .from('agent_properties')
          .delete()
          .eq('agent_id', agentId)
          .eq('property_id', propertyId)

        if (error) throw error
        toast.success('Property removed from your portfolio')
        await fetchAgentProperties()
      } catch (err: any) {
        console.error('Failed to remove property:', err)
        toast.error(err.message || 'Failed to remove property')
      }
    },
    [agentId, fetchAgentProperties]
  )

  // Update agent property notes or status
  const updateAgentProperty = useCallback(
    async (propertyId: string, updates: { notes?: string; status?: string }) => {
      if (!agentId) {
        toast.error('Agent information missing')
        return
      }

      try {
        const { error } = await supabase
          .from('agent_properties')
          .update(updates)
          .eq('agent_id', agentId)
          .eq('property_id', propertyId)

        if (error) throw error
        toast.success('Property updated')
        await fetchAgentProperties()
      } catch (err: any) {
        console.error('Failed to update property:', err)
        toast.error(err.message || 'Failed to update property')
      }
    },
    [agentId, fetchAgentProperties]
  )

  // Check if property is assigned to agent
  const isPropertyAssigned = useCallback(
    (propertyId: string): boolean => {
      return agentProperties.some((ap) => ap.property_id === propertyId)
    },
    [agentProperties]
  )

  // Get unassigned properties (for selection)
  const getUnassignedProperties = useCallback((): Property[] => {
    const assignedIds = new Set(agentProperties.map((ap) => ap.property_id))
    return allProperties.filter((p) => !assignedIds.has(p.id))
  }, [allProperties, agentProperties])

  return {
    agentProperties,
    allProperties,
    unassignedProperties: getUnassignedProperties(),
    loading,
    error,
    fetchAgentProperties,
    fetchAllProperties,
    addPropertyToAgent,
    removePropertyFromAgent,
    updateAgentProperty,
    isPropertyAssigned,
  }
}
