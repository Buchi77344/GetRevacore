import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

type LeadRecord = Record<string, unknown>

type HookError = string | null

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  return String(err)
}

export const useLeads = () => {
  const { user } = useAuth()
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<HookError>(null)
  const isMounted = useRef(true)

  const fetchLeads = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user?.id || '')

      if (error) throw error
      if (isMounted.current) setLeads((data as LeadRecord[]) || [])
    } catch (err) {
      if (isMounted.current) setError(getErrorMessage(err))
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [user])

  useEffect(() => {
    isMounted.current = true
    fetchLeads()

    // ── Realtime subscription ─────────────────────────────────────────────
    if (!user?.id) return
    const channel = supabase
      .channel('leads-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (isMounted.current) {
            setLeads(prev => [payload.new as LeadRecord, ...prev])
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (isMounted.current) {
            setLeads(prev => prev.map(l => (l.id === payload.new.id ? (payload.new as LeadRecord) : l)))
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'leads', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (isMounted.current) {
            setLeads(prev => prev.filter(l => l.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      isMounted.current = false
      supabase.removeChannel(channel)
    }
  }, [user, fetchLeads])

  const addLead = async (leadData: LeadRecord) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{ ...leadData, user_id: user?.id || '' }])
        .select()

      if (error) throw error
      const inserted = (data as LeadRecord[])[0]
      return inserted
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw new Error(message)
    }
  }

  return { leads, loading, error, addLead }
}

export default useLeads