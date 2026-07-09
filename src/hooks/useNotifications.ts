"use client";

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string | null
  data: any
  channel: string
  is_read: boolean
  created_at: string
}

export interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refresh: () => Promise<void>
}

/**
 * Hook that provides real-time Supabase-backed notifications.
 * Subscribes to INSERT/UPDATE events on the notifications table
 * and plays a sound when a new notification arrives.
 */
export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(true)

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      const list = (data as Notification[]) || []
      setNotifications(list)
      setUnreadCount(list.filter(n => !n.is_read).length)
    } catch (err) {
      console.error('[useNotifications] Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Play a modern chime when a new notification arrives
  const playNotificationSound = useCallback(() => {
    try {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext)
      if (!AudioCtx) return
      const ctx = new AudioCtx()

      const now = ctx.currentTime
      // layered tones for a modern chime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'triangle'

      osc1.frequency.setValueAtTime(880, now)
      osc2.frequency.setValueAtTime(1320, now)

      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now + 0.02)

      osc1.stop(now + 1.0)
      osc2.stop(now + 1.0)
    } catch (e) {
      // ignore audio errors
      console.debug('[useNotifications] audio error', e)
    }
  }, [])

  // Initial fetch + real-time subscription
  useEffect(() => {
    isMounted.current = true
    fetchNotifications()

    if (!user?.id) return

    // Subscribe to real-time inserts and updates
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (!isMounted.current) return
          const newNotif = payload.new as Notification
          setNotifications(prev => [newNotif, ...prev])
          setUnreadCount(prev => prev + 1)
          playNotificationSound()
          // Show a toast on the right side with title/message
          try {
            const title = newNotif.title || 'Notification'
            const message = newNotif.message || ''
            toast(`${title}${message ? ` — ${message}` : ''}`, { duration: 5000, position: 'top-right' })
          } catch (e) {
            // ignore toast errors
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (!isMounted.current) return
          const updated = payload.new as Notification
          setNotifications(prev =>
            prev.map(n => (n.id === updated.id ? { ...n, is_read: updated.is_read } : n)),
          )
          setUnreadCount(prev =>
            updated.is_read ? Math.max(0, prev - 1) : prev + 1,
          )
        },
      )
      .subscribe()

    return () => {
      isMounted.current = false
      supabase.removeChannel(channel)
    }
  }, [user?.id, fetchNotifications, playNotificationSound])

  // Mark single notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n)),
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('[useNotifications] Mark read error:', err)
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true })),
      )
      setUnreadCount(0)
    } catch (err) {
      console.error('[useNotifications] Mark all read error:', err)
    }
  }, [user?.id])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  }
}

export default useNotifications