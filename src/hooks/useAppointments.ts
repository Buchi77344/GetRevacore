import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export const useAppointments = () => {
  const { user, profile } = useAuth()
  const [appointments, setAppointments] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('agent_id', profile?.id || '')

      if (error) throw error
      if (isMounted.current) setAppointments(data || [])
    } catch (err) {
      if (isMounted.current) setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [user, profile?.id])

  useEffect(() => {
    isMounted.current = true
    fetchAppointments()

    if (!profile?.id) return

    // ── Realtime subscription ─────────────────────────────────────────────
    const channel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'appointments', filter: `agent_id=eq.${profile.id}` },
        (payload) => {
          if (isMounted.current) setAppointments(prev => [payload.new, ...prev])
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'appointments', filter: `agent_id=eq.${profile.id}` },
        (payload) => {
          if (isMounted.current) {
            setAppointments(prev => prev.map((a: any) => a.id === payload.new.id ? payload.new : a))
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'appointments', filter: `agent_id=eq.${profile.id}` },
        (payload) => {
          if (isMounted.current) {
            setAppointments(prev => prev.filter((a: any) => a.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      isMounted.current = false
      supabase.removeChannel(channel)
    }
  }, [user, profile?.id, fetchAppointments])

  return { appointments, loading, error }
}

export default useAppointments