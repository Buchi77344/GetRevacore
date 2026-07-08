import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

// Notification type definition
export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
  playSound: (type?: 'success' | 'error' | 'info' | 'warning') => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Global reference for setting notification context
// (kept for potential future integrations)

// Audio URLs for different notification types (not used currently, using Web Audio API instead)
// These are kept for reference but notifications use generateNotificationSound

/**
 * Generate a simple notification sound using Web Audio API
 * This creates a tone that plays for the specified duration
 */
const generateNotificationSound = (frequency: number = 800, duration: number = 200): Promise<void> => {
  return new Promise((resolve) => {
    try {
      // Use Web Audio API to generate sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration / 1000)

      setTimeout(resolve, duration)
    } catch (error) {
      console.error('Failed to generate notification sound:', error)
      resolve()
    }
  })
}

/**
 * NotificationProvider component
 * Wraps the application and provides notification context
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const soundEnabledRef = useRef(true)

  // Add a new notification
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string => {
      const id = Date.now().toString()
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: new Date(),
        read: false,
      }

      setNotifications((prev) => [newNotification, ...prev])

      // Auto-remove after 10 seconds (but keep in modal)
      setTimeout(() => {
        // Keep notification visible in modal, don't auto-remove
      }, 10000)

      return id
    },
    []
  )

  // Play notification sound
  const playSound = useCallback((type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    if (!soundEnabledRef.current) return

    // Generate sound based on notification type
    const frequencies = {
      success: 600,
      error: 300,
      info: 800,
      warning: 500,
    }

    generateNotificationSound(frequencies[type], 200).catch((err) =>
      console.error('Error playing notification sound:', err)
    )
  }, [])

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    )
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }, [])

  // Delete a notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }, [])

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    playSound,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <audio ref={audioRef} />
    </NotificationContext.Provider>
  )
}

/**
 * Hook to use notification context
 */
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}
