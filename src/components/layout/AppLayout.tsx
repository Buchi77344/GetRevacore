import { useState, useEffect, useCallback } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'
import { OnboardingFlow } from '../onboarding/OnboardingFlow'
import toast from 'react-hot-toast'

// ─── Logo ──────────────────────────────────────────────────────────────────────
const Logo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="var(--color-espresso)" />
    <path
      d="M7 20L12 11L17 17L21 13L25 20"
      stroke="var(--color-ochre)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="25" cy="20" r="2.5" fill="var(--color-terracotta)" opacity="0.9" />
    <path d="M6 25h20" stroke="var(--color-ochre)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </svg>
)

// ─── Types ──────────────────────────────────────────────────────────────────────
interface Notification {
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

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getDisplayName(name?: string | null, email?: string | null): string {
  if (name && name.trim()) return name.trim()
  if (email) {
    const local = email.split('@')[0]
    return local
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim()
  }
  return 'Agent'
}

function getInitials(displayName: string): string {
  const parts = displayName.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return displayName.slice(0, 2).toUpperCase()
}

function trialDaysLeft(trialEndsAt?: string | null): number {
  if (!trialEndsAt) return 0
  const diff = new Date(trialEndsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function timeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

// ─── Theme hook ─────────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem('rc-theme') as 'light' | 'dark') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('rc-theme', theme)
  }, [theme])

  const toggle = useCallback(() => setTheme((p) => (p === 'light' ? 'dark' : 'light')), [])
  return { theme, toggle }
}

// ─── Notification Modal (REAL DATA) ────────────────────────────────────────────
function NotificationModal({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  loading,
  markAsRead,
  markAllAsRead,
  refresh,
}: {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refresh: () => Promise<void>
}) {
  useEffect(() => {
    if (isOpen) refresh()
  }, [isOpen, refresh])

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_lead':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-ochre)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        )
      case 'appointment_reminder':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-terracotta)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        )
      case 'deal_update':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
        )
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        )
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="rc-backdrop" onClick={onClose} />
      <div className="rc-notif-panel rc-dropdown-in">
        {/* Header */}
        <div className="rc-notif-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="rc-label-sm rc-text-primary" style={{ fontWeight: 700 }}>Notifications</span>
            {unreadCount > 0 && (
              <span className="rc-badge rc-badge--terracotta" style={{ fontSize: 9 }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {unreadCount > 0 && (
              <button 
                className="rc-icon-btn rc-text-tertiary" 
                style={{ fontSize: 11, fontWeight: 700 }}
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
            <button className="rc-icon-btn" onClick={onClose} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="rc-notif-list rc-scroll">
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <p className="rc-label-sm rc-text-tertiary">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ marginBottom: 8, opacity: 0.3 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-5-5.917V4a1 1 0 10-2 0v1.083C7.47 5.833 6 7.917 6 10v4.159c0 .538-.214 1.055-.595 1.436L4 17h5"/>
                </svg>
              </div>
              <p className="rc-label-sm rc-text-secondary" style={{ fontWeight: 600 }}>No notifications yet</p>
              <p className="rc-label-xs rc-text-tertiary">We'll notify you when something happens</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`rc-notif-item${!n.is_read ? ' rc-notif-item--unread' : ''}`}
                onClick={() => !n.is_read && markAsRead(n.id)}
              >
                <div className="rc-notif-dot-col">
                  {!n.is_read && <div className="rc-notif-dot" />}
                </div>
                <div style={{ width: 28, flexShrink: 0, paddingTop: 2 }}>
                  {getNotificationIcon(n.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="rc-label-sm rc-text-primary" style={{ fontWeight: 600, marginBottom: 2 }}>{n.title}</p>
                  {n.message && (
                    <p className="rc-label-xs rc-text-secondary" style={{ lineHeight: 1.5, marginBottom: 4 }}>{n.message}</p>
                  )}
                  <p className="rc-label-xs rc-text-tertiary">{timeAgo(n.created_at)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

// ─── User Menu Dropdown ────────────────────────────────────────────────────────
interface UserMenuProps {
  isOpen: boolean
  onClose: () => void
  onSignOut: () => void
}

function UserMenuDropdown({ isOpen, onClose, onSignOut }: UserMenuProps) {
  const { user, profile, agency } = useAuth()
  const navigate = useNavigate()
  const { theme, toggle: toggleTheme } = useTheme()

  if (!isOpen) return null

  const displayName = getDisplayName(profile?.name, user?.email)
  const userEmail   = user?.email || ''
  const initials    = getInitials(displayName)

  const isPro = ['pro', 'team', 'enterprise', 'agency'].includes(agency?.plan || '')

  const menuItems = [
    {
      label: 'Your Profile',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      onClick: () => { navigate('/dashboard/settings'); onClose() },
    },
    {
      label: 'Billing & Plan',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
      onClick: () => { navigate('/dashboard/billing'); onClose() },
      badge: (agency?.plan || 'trial').toUpperCase(),
    },
    {
      label: 'Team Members',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      onClick: () => { navigate('/dashboard/settings'); onClose() },
    },
    {
      label: 'Settings',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
      onClick: () => { navigate('/dashboard/settings'); onClose() },
    },
  ]

  return (
    <>
      <div className="rc-backdrop rc-backdrop--transparent" onClick={onClose} />
      <div className="rc-usermenu rc-dropdown-in">
        <div className="rc-usermenu-header">
          <div className="rc-avatar rc-avatar--lg">
            <span className="rc-avatar-initials">{initials}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="rc-text-primary rc-label-sm" style={{ fontWeight: 700, marginBottom: 2 }}>
              {displayName}
            </p>
            <p className="rc-text-tertiary rc-label-xs" style={{ wordBreak: 'break-all' }}>
              {userEmail}
            </p>
          </div>
          {isPro && (
            <span className="rc-badge rc-badge--ochre" style={{ flexShrink: 0 }}>PRO</span>
          )}
        </div>

        <div className="rc-usermenu-section rc-usermenu-theme">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {theme === 'light' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-ochre)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            )}
            <span className="rc-label-xs rc-text-primary" style={{ fontWeight: 600 }}>
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="rc-toggle"
            data-on={theme === 'dark'}
            aria-label="Toggle theme"
          >
            <span className="rc-toggle-thumb" />
          </button>
        </div>

        <div className="rc-usermenu-items">
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.onClick} className="rc-menu-item">
              <span className="rc-menu-item-icon">{item.icon}</span>
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge && (
                <span className="rc-badge rc-badge--muted">{item.badge}</span>
              )}
            </button>
          ))}
        </div>

        <div className="rc-usermenu-footer">
          <button
            onClick={() => { onSignOut(); onClose() }}
            className="rc-menu-item rc-menu-item--danger"
          >
            <span className="rc-menu-item-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </span>
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Nav sections ──────────────────────────────────────────────────────────────
const NAV_SECTIONS: Array<{
  label: string
  items: Array<{
    label: string
    path: string
    icon: React.ReactNode
    exact?: boolean
    badge?: 'new'
    pro?: boolean
  }>
}> = [
  {
    label: 'Core',
    items: [
      {
        label: 'Dashboard', path: '/dashboard', exact: true,
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
      },
      {
        label: 'Inbox', path: '/dashboard/inbox',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>,
      },
      {
        label: 'Leads', path: '/dashboard/leads', badge: 'new' as const,
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      },
      {
        label: 'Pipeline', path: '/dashboard/pipeline',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>,
      },
    ],
  },
  {
    label: 'Properties',
    items: [
      {
        label: 'Browse Market', path: '/dashboard/properties/market',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
      },
      {
        label: 'My Listings', path: '/dashboard/properties', exact: true,
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
      },
      {
        label: 'Appointments', path: '/dashboard/appointments',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      {
        label: 'Deal Analyser', path: '/dashboard/deals', pro: true,
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
      },
      {
        label: 'AI Marketing', path: '/dashboard/marketing', pro: true,
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
      },
      {
        label: 'Analytics', path: '/dashboard/analytics', pro: true,
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        label: 'Billing', path: '/dashboard/billing',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
      },
      {
        label: 'Settings', path: '/dashboard/settings',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
      },
    ],
  },
]

// ─── Sidebar Content ───────────────────────────────────────────────────────────
function SidebarContent({ onClose }: { onClose: () => void }) {
  const { user, profile, agency, signOut } = useAuth()
  const navigate = useNavigate()
  const [showHelp, setShowHelp] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/login')
    } catch {
      toast.error('Error signing out. Please try again.')
    }
  }

  const isPro   = ['pro', 'team', 'enterprise', 'agency'].includes(agency?.plan || '')
  const isTrial = agency?.plan_status === 'trial'
  const daysLeft = trialDaysLeft(agency?.trial_ends_at)

  const displayName = getDisplayName(profile?.name, user?.email)
  const initials    = getInitials(displayName)

  return (
    <div className="rc-sidebar">
      <div className="rc-sidebar-header">
        <Logo size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="rc-sidebar-brand">RevaCore</p>
          <p className="rc-label-xs rc-text-secondary" style={{ marginTop: 2, fontWeight: 500 }}>
            {agency?.name || 'Your Agency'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {isPro ? (
            <span className="rc-badge rc-badge--espresso" style={{ marginLeft: 2 }}>PRO</span>
          ) : (
            <span className="rc-badge rc-badge--muted" style={{ marginLeft: 2 }}>FREE</span>
          )}
        </div>
      </div>

      {isTrial && (
        <div className="rc-trial-banner">
          <div className="rc-trial-banner-inner">
            <div className="rc-trial-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-ochre)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'var(--color-warm-white)', fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>
                {daysLeft > 0 ? `${daysLeft} days left in trial` : 'Trial ends today'}
              </p>
              <p style={{ color: 'rgba(212,165,90,0.65)', fontSize: 11, marginTop: 2 }}>
                Upgrade to keep all AI features
              </p>
            </div>
          </div>
          <div className="rc-trial-bar">
            <div className="rc-trial-bar-fill" style={{ width: `${Math.max(5, ((14 - daysLeft) / 14) * 100)}%` }} />
          </div>
          <button className="rc-trial-cta" onClick={() => { navigate('/dashboard/billing'); onClose() }}>
            Upgrade now →
          </button>
        </div>
      )}

      <nav className="rc-nav rc-scroll">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="rc-nav-section">
            <p className="rc-nav-section-label">{section.label}</p>
            <div className="rc-nav-items">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact ?? false}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `rc-navlink${isActive ? ' rc-navlink--active' : ''}`
                  }
                >
                  <span className="rc-navlink-icon">{item.icon}</span>
                  <span className="rc-navlink-label">{item.label}</span>
                  {item.pro && !isPro && (
                    <span className="rc-badge rc-badge--ochre" style={{ fontSize: 9 }}>PRO</span>
                  )}
                  {item.badge === 'new' && (
                    <span className="rc-badge rc-badge--terracotta" style={{ fontSize: 9 }}>NEW</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {showHelp && (
        <div className="rc-help-card">
          <button className="rc-help-close" onClick={() => setShowHelp(false)} aria-label="Dismiss">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <p className="rc-label-xs rc-text-primary" style={{ fontWeight: 700, marginBottom: 8, paddingRight: 20 }}>
            Help &amp; resources
          </p>
          {[
            {
              label: 'Getting started guide',
              icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
              onClick: () => {},
            },
            {
              label: 'Share lead capture form',
              icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>,
              onClick: () => {
                const link = `${window.location.origin}/form/${agency?.id}`
                navigator.clipboard.writeText(link)
                toast.success('Lead form link copied!')
              },
            },
            {
              label: 'Contact support',
              icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
              onClick: () => window.open('mailto:support@revacore.io'),
            },
          ].map((action, i) => (
            <button key={i} onClick={action.onClick} className="rc-help-action">
              <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="rc-sidebar-footer">
        <button
          className="rc-user-trigger"
          onClick={() => setUserMenuOpen((o) => !o)}
          aria-expanded={userMenuOpen}
          aria-label="Open user menu"
        >
          <div className="rc-avatar rc-avatar--sm">
            <span className="rc-avatar-initials">{initials}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <p className="rc-label-sm rc-text-primary" style={{ fontWeight: 700, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <span className="rc-status-dot" />
              <p className="rc-label-xs rc-text-secondary" style={{ textTransform: 'capitalize' }}>
                {agency?.plan || 'trial'} plan
              </p>
            </div>
          </div>
          <svg
            width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ color: 'var(--text-tertiary)', flexShrink: 0, transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <UserMenuDropdown
          isOpen={userMenuOpen}
          onClose={() => setUserMenuOpen(false)}
          onSignOut={handleSignOut}
        />
      </div>
    </div>
  )
}

function pageTitle(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean).pop() || 'dashboard'
  return seg.charAt(0).toUpperCase() + seg.slice(1)
}

// ─── Main AppLayout ────────────────────────────────────────────────────────────
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const { user, profile, agency, signOut } = useAuth()
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, refresh } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  // ── Show onboarding for new users ───────────────────────────────────────
  // Checks localStorage for onboarding_completed flag.
  // New users (no profile yet) or those who haven't completed onboarding
  // will see the welcome modal after their first login.
  useEffect(() => {
    if (!user || !agency) return
    // Only show if profile exists (user completed signup)
    // and onboarding has not been completed
    const onboardingDone = localStorage.getItem('rc-onboarding-done')
    if (!onboardingDone && profile) {
      // Delay slightly to let the page render first
      const timer = setTimeout(() => setShowOnboarding(true), 500)
      return () => clearTimeout(timer)
    }
  }, [user, agency, profile])

  const handleOnboardingComplete = () => {
    localStorage.setItem('rc-onboarding-done', 'true')
    setShowOnboarding(false)
    toast.success('All set! You can always revisit these from Help & Resources.')
  }

  const handleOnboardingDismiss = () => {
    localStorage.setItem('rc-onboarding-done', 'true')
    setShowOnboarding(false)
  }

  // useNotifications hook provides real-time notifications and unread count

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/login')
    } catch {
      toast.error('Error signing out')
    }
  }

  const displayName = getDisplayName(profile?.name, user?.email)
  const initials = getInitials(displayName)

  return (
    <div className="rc-layout">
      <RCStyles />

      {/* ── Onboarding Flow ──────────────────────────────────────────────── */}
      {showOnboarding && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onDismiss={handleOnboardingDismiss}
        />
      )}

      <aside className="rc-layout-sidebar">
        <SidebarContent onClose={() => {}} />
      </aside>

      {sidebarOpen && (
        <div className="rc-mobile-overlay">
          <div className="rc-mobile-backdrop" onClick={() => setSidebarOpen(false)} />
          <aside className="rc-mobile-sidebar rc-slide-in">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="rc-layout-main">
        <header className="rc-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="rc-icon-btn rc-mobile-only"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div className="rc-breadcrumb rc-desktop-only">
              <span className="rc-label-xs rc-text-secondary">{agency?.name || 'Your Agency'}</span>
              <span className="rc-breadcrumb-sep">/</span>
              <span className="rc-label-xs rc-text-primary" style={{ fontWeight: 600 }}>
                {pageTitle(location.pathname)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="rc-topbar-btn rc-topbar-btn--primary rc-desktop-only"
              onClick={() => navigate('/dashboard/leads?action=add')}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add lead
            </button>

            <button
              className="rc-topbar-btn rc-topbar-btn--ghost rc-desktop-only"
              onClick={() => {
                const link = `${window.location.origin}/form/${agency?.id}`
                navigator.clipboard.writeText(link)
                toast.success('Lead form link copied!')
              }}
              title="Copy lead capture form link"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              Share form
            </button>

            {/* Notifications with real count */}
            <div style={{ position: 'relative', marginRight: 4 }}>
              <button
                className="rc-icon-btn"
                onClick={() => setNotificationsOpen((o) => !o)}
                aria-label="Notifications"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                {unreadCount > 0 && (
                  <span className="rc-notif-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationModal
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                notifications={notifications}
                unreadCount={unreadCount}
                loading={loading}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                refresh={refresh}
              />
            </div>

            <div style={{ position: 'relative' }} className="rc-mobile-only">
              <button
                className="rc-avatar rc-avatar--sm"
                onClick={() => setMobileUserMenuOpen((o) => !o)}
                aria-label="User menu"
              >
                <span className="rc-avatar-initials">{initials}</span>
              </button>
              <UserMenuDropdown
                isOpen={mobileUserMenuOpen}
                onClose={() => setMobileUserMenuOpen(false)}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        </header>

        <main className="rc-main-content rc-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ─── Styles (update the notification badge style) ──────────────────────────────
// ─── All styles in one place ───────────────────────────────────────────────────
function RCStyles() {
  return (
    <style>{`
      /* ── Design tokens ── */
      :root, [data-theme="light"] {
        --color-espresso:    #37281E;
        --color-ochre:       #B48246;
        --color-terracotta:  #C35F46;
        --color-sage:        #6E8C64;
        --color-slate:       #5A555F;
        --color-cream:       #F7F3EC;
        --color-warm-white:  #FDFAF6;
        --color-soft-stone:  #E8E2D9;

        --bg-primary:        #FDFAF6;
        --bg-surface:        #FFFFFF;
        --bg-tertiary:       #F7F3EC;
        --bg-hover:          rgba(55, 40, 30, 0.04);
        --bg-active:         rgba(55, 40, 30, 0.07);

        --text-primary:      #37281E;
        --text-secondary:    #5A555F;
        --text-tertiary:     rgba(90, 85, 95, 0.55);

        --border-default:    rgba(232, 226, 217, 0.7);

        --shadow-sm:  0 1px 2px rgba(55,40,30,.04);
        --shadow-md:  0 4px 16px rgba(55,40,30,.07);
        --shadow-lg:  0 8px 28px rgba(55,40,30,.10);
        --shadow-xl:  0 16px 48px rgba(55,40,30,.13);

        --font-body:    'DM Sans', system-ui, sans-serif;
        --font-display: 'Fraunces', Georgia, serif;

        --sidebar-w: 220px;
        --topbar-h:  52px;
        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 16px;
        --radius-xl: 20px;
      }

      [data-theme="dark"] {
        --color-espresso: #1A1410;
        --color-ochre: #D4A55A;
        --color-terracotta: #E07B60;
        --color-sage: #8BA882;
        --color-slate: #A8A3AD;
        --color-cream: rgb(255, 255, 255);
        --color-warm-white: #ffffff;
        --color-soft-stone: #3D3630;

        --bg-primary:        #1A1612;
        --bg-surface:        #231F1A;
        --bg-tertiary:       #2B2620;
        --bg-hover:          rgba(212, 165, 90, 0.06);
        --bg-active:         rgba(212, 165, 90, 0.10);

        --text-primary:      #EDE8E0;
        --text-secondary:    #A8A3AD;
        --text-tertiary:     rgba(168, 163, 173, 0.5);

        --border-default:    rgba(55, 48, 40, 0.8);

        --shadow-sm:  0 1px 2px rgba(0,0,0,.25);
        --shadow-md:  0 4px 16px rgba(0,0,0,.35);
        --shadow-lg:  0 8px 28px rgba(0,0,0,.45);
        --shadow-xl:  0 16px 48px rgba(0,0,0,.55);
      }

      /* ── Reset ── */
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      /* ── Smooth scrollbar ── */
      .rc-scroll {
        overflow-y: auto;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
      .rc-scroll::-webkit-scrollbar       { width: 4px; }
      .rc-scroll::-webkit-scrollbar-track { background: transparent; }
      .rc-scroll::-webkit-scrollbar-thumb {
        background: var(--border-default);
        border-radius: 4px;
        transition: background .2s;
      }
      .rc-scroll::-webkit-scrollbar-thumb:hover { background: var(--color-ochre); }

      /* ── Animations ── */
      @keyframes rc-dropdown-in {
        from { opacity: 0; transform: translateY(6px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)  scale(1);    }
      }
      @keyframes rc-slide-in {
        from { transform: translateX(-100%); }
        to   { transform: translateX(0);     }
      }
      @keyframes rc-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .rc-dropdown-in { animation: rc-dropdown-in .2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards; }
      .rc-slide-in    { animation: rc-slide-in .25s cubic-bezier(0.22, 0.61, 0.36, 1) forwards; }

      /* ── Layout shell ── */
      .rc-layout {
        display: flex;
        height: 100vh;
        background: var(--bg-primary);
        overflow: hidden;
        font-family: var(--font-body);
        color: var(--text-primary);
      }
      .rc-layout-sidebar {
        display: none;
        flex-direction: column;
        width: var(--sidebar-w);
        flex-shrink: 0;
        border-right: 1px solid var(--border-default);
        background: var(--bg-surface);
      }
      @media (min-width: 768px) {
        .rc-layout-sidebar { display: flex; }
        .rc-mobile-only    { display: none !important; }
      }
      @media (max-width: 767px) {
        .rc-desktop-only { display: none !important; }
      }
      .rc-layout-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-width: 0;
      }

      /* ── Sidebar internals ── */
      .rc-sidebar {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--bg-surface);
        user-select: none;
      }
      .rc-sidebar-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 20px 16px 16px;
        border-bottom: 1px solid var(--border-default);
        flex-shrink: 0;
      }
      .rc-sidebar-brand {
        font-weight: 800;
        font-size: 15px;
        color: var(--text-primary);
        letter-spacing: -.02em;
        line-height: 1;
      }

      /* Trial banner */
      .rc-trial-banner {
        margin: 10px 12px 4px;
        padding: 14px;
        background: var(--color-espresso);
        border-radius: var(--radius-lg);
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
      }
      [data-theme="dark"] .rc-trial-banner {
        background: #2a2218;
        border: 1px solid rgba(212,165,90,0.15);
      }
      .rc-trial-banner::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(180,130,70,.12) 0%, transparent 60%);
        pointer-events: none;
      }
      .rc-trial-banner-inner { display: flex; align-items: flex-start; gap: 10px; position: relative; }
      .rc-trial-icon {
        width: 28px; height: 28px;
        background: rgba(180,130,70,.18);
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .rc-trial-bar {
        height: 3px;
        background: rgba(255,255,255,.08);
        border-radius: 4px;
        margin: 10px 0 10px;
        overflow: hidden;
      }
      .rc-trial-bar-fill {
        height: 100%;
        background: rgba(180,130,70,.55);
        border-radius: 4px;
        transition: width .4s ease;
      }
      .rc-trial-cta {
        width: 100%;
        background: rgba(255,255,255,.92);
        color: var(--color-espresso);
        font-size: 12px;
        font-weight: 800;
        padding: 7px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background .2s, color .2s;
        font-family: var(--font-body);
      }
      [data-theme="dark"] .rc-trial-cta { background: rgba(212,165,90,.15); color: var(--color-ochre); }
      .rc-trial-cta:hover { background: var(--color-ochre); color: #fff; }

      /* Nav */
      .rc-nav { flex: 1; padding: 8px 10px; display: flex; flex-direction: column; gap: 16px; }
      .rc-nav-section { display: flex; flex-direction: column; gap: 2px; }
      .rc-nav-section-label {
        font-size: 9px;
        font-weight: 800;
        color: var(--text-tertiary);
        text-transform: uppercase;
        letter-spacing: .1em;
        padding: 0 10px 4px;
      }
      .rc-nav-items { display: flex; flex-direction: column; gap: 1px; }
      .rc-navlink {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: var(--radius-sm);
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
        text-decoration: none;
        transition: background .15s ease, color .15s ease, transform .15s ease;
        cursor: pointer;
        width: 100%;
      }
      .rc-navlink:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
        transform: translateX(2px);
      }
      .rc-navlink--active {
        background: var(--color-espresso) !important;
        color: var(--color-warm-white) !important;
        font-weight: 700;
        box-shadow: var(--shadow-sm);
        transform: none !important;
      }
      [data-theme="dark"] .rc-navlink--active {
        background: rgba(212,165,90,.12) !important;
        color: var(--color-ochre) !important;
        border: 1px solid rgba(212,165,90,.2);
      }
      .rc-navlink-icon  { flex-shrink: 0; display: flex; }
      .rc-navlink-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

      /* Help card */
      .rc-help-card {
        margin: 6px 10px 8px;
        background: var(--bg-hover);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-md);
        padding: 12px;
        position: relative;
        flex-shrink: 0;
      }
      .rc-help-close {
        position: absolute;
        top: 8px; right: 8px;
        background: none; border: none; cursor: pointer;
        color: var(--text-tertiary);
        padding: 4px;
        border-radius: 6px;
        display: flex;
        transition: background .15s, color .15s;
      }
      .rc-help-close:hover { background: var(--bg-active); color: var(--text-primary); }
      .rc-help-action {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 6px 4px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 11px;
        font-weight: 500;
        color: var(--text-secondary);
        border-radius: 6px;
        transition: background .15s, color .15s;
        font-family: var(--font-body);
        text-align: left;
      }
      .rc-help-action:hover { background: var(--bg-active); color: var(--text-primary); }

      /* Sidebar footer / user trigger */
      .rc-sidebar-footer {
        border-top: 1px solid var(--border-default);
        padding: 10px 10px;
        position: relative;
        flex-shrink: 0;
      }
      .rc-user-trigger {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 8px 10px;
        border-radius: var(--radius-sm);
        background: none;
        border: none;
        cursor: pointer;
        transition: background .15s;
        font-family: var(--font-body);
      }
      .rc-user-trigger:hover { background: var(--bg-hover); }

      /* ── Avatar ── */
      .rc-avatar {
        border-radius: var(--radius-sm);
        background: var(--color-espresso);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: none;
        cursor: pointer;
        transition: box-shadow .2s;
      }
      .rc-avatar:hover { box-shadow: 0 0 0 2px rgba(180,130,70,.35); }
      .rc-avatar--sm   { width: 30px; height: 30px; }
      .rc-avatar--lg   { width: 38px; height: 38px; border-radius: var(--radius-md); }
      .rc-avatar-initials {
        font-size: 11px;
        font-weight: 800;
        color: var(--color-ochre);
        letter-spacing: .02em;
      }
      .rc-avatar--lg .rc-avatar-initials { font-size: 13px; }

      /* Status dot */
      .rc-status-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: var(--color-sage);
        flex-shrink: 0;
        animation: rc-pulse-dot 2s ease-in-out infinite;
      }
      @keyframes rc-pulse-dot {
        0%, 100% { opacity: 1; }
        50%       { opacity: .45; }
      }

      /* ── Badges ── */
      .rc-badge {
        font-size: 9px;
        font-weight: 800;
        padding: 2px 7px;
        border-radius: 100px;
        text-transform: uppercase;
        letter-spacing: .05em;
        white-space: nowrap;
        line-height: 1.6;
      }
      .rc-badge--espresso  { background: var(--color-espresso); color: var(--color-warm-white); }
      .rc-badge--ochre     { background: rgba(180,130,70,.12);  color: var(--color-ochre); }
      .rc-badge--terracotta{ background: rgba(195,95,70,.1);    color: var(--color-terracotta); }
      .rc-badge--muted     { background: var(--bg-hover);       color: var(--text-secondary); }
      [data-theme="dark"] .rc-badge--espresso { background: rgba(212,165,90,.12); color: var(--color-ochre); }

      /* ── User menu dropdown ── */
      .rc-usermenu {
        position: absolute;
        bottom: calc(100% + 6px);
        left: 10px;
        width: 256px;
        background: var(--bg-surface);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        z-index: 60;
        overflow: hidden;
      }
      .rc-usermenu-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 16px 12px;
        border-bottom: 1px solid var(--border-default);
      }
      .rc-usermenu-section { padding: 0 12px; }
      .rc-usermenu-theme {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        border-bottom: 1px solid var(--border-default);
      }
      .rc-usermenu-items { padding: 6px 8px; display: flex; flex-direction: column; gap: 1px; }
      .rc-usermenu-footer {
        padding: 6px 8px 8px;
        border-top: 1px solid var(--border-default);
      }

      .rc-menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 9px 10px;
        border-radius: var(--radius-sm);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
        transition: background .15s, color .15s;
        font-family: var(--font-body);
        text-align: left;
      }
      .rc-menu-item:hover { background: var(--bg-hover); color: var(--text-primary); }
      .rc-menu-item--danger { color: var(--color-terracotta); }
      .rc-menu-item--danger:hover { background: rgba(195,95,70,.06); color: var(--color-terracotta); }
      .rc-menu-item-icon { display: flex; flex-shrink: 0; color: var(--text-tertiary); }
      .rc-menu-item:hover .rc-menu-item-icon { color: var(--color-ochre); }
      .rc-menu-item--danger .rc-menu-item-icon,
      .rc-menu-item--danger:hover .rc-menu-item-icon { color: var(--color-terracotta); }

      /* ── Theme toggle ── */
      .rc-toggle {
        position: relative;
        width: 36px; height: 20px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        background: var(--bg-active);
        transition: background .3s;
        flex-shrink: 0;
      }
      .rc-toggle[data-on="true"] { background: var(--color-espresso); }
      [data-theme="dark"] .rc-toggle[data-on="true"] { background: rgba(212,165,90,.25); }
      .rc-toggle-thumb {
        position: absolute;
        top: 2px; left: 2px;
        width: 16px; height: 16px;
        border-radius: 50%;
        background: #fff;
        box-shadow: var(--shadow-sm);
        transition: transform .25s cubic-bezier(0.22, 0.61, 0.36, 1);
      }
      .rc-toggle[data-on="true"] .rc-toggle-thumb { transform: translateX(16px); }

      /* ── Topbar ── */
      .rc-topbar {
        height: var(--topbar-h);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        background: var(--bg-surface);
        border-bottom: 1px solid var(--border-default);
        flex-shrink: 0;
      }
      .rc-breadcrumb { display: flex; align-items: center; gap: 8px; }
      .rc-breadcrumb-sep { color: rgba(180,130,70,.35); font-size: 14px; }

      .rc-topbar-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: var(--radius-sm);
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        border: none;
        transition: all .15s ease;
        font-family: var(--font-body);
        white-space: nowrap;
      }
      .rc-topbar-btn--primary {
        background: var(--color-espresso);
        color: var(--color-warm-white);
        box-shadow: var(--shadow-sm);
      }
      .rc-topbar-btn--primary:hover { opacity: .88; transform: translateY(-1px); }
      .rc-topbar-btn--ghost {
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-default);
      }
      .rc-topbar-btn--ghost:hover { border-color: rgba(180,130,70,.5); color: var(--text-primary); }

      /* Icon button */
      .rc-icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 7px;
        border-radius: var(--radius-sm);
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
        transition: background .15s, color .15s;
        position: relative;
      }
      .rc-icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

      /* Notification badge on bell */
      .rc-notif-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        min-width: 16px;
        height: 16px;
        background: var(--color-terracotta);
        border-radius: 10px;
        border: 1.5px solid var(--bg-surface);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        font-weight: 800;
        color: #fff;
        padding: 0 4px;
        animation: rc-pulse-dot 1.8s ease-in-out infinite;
        line-height: 1;
      }

      /* ── Notification panel ── */
      .rc-backdrop {
        position: fixed;
        inset: 0;
        z-index: 40;
        background: rgba(55,40,30,.12);
        backdrop-filter: blur(2px);
        animation: rc-fade-in .15s ease;
      }
      .rc-backdrop--transparent { background: transparent; backdrop-filter: none; }
      .rc-notif-panel {
        position: fixed;
        right: 16px;
        top: calc(var(--topbar-h) + 8px);
        z-index: 50;
        width: 360px;
        max-width: calc(100vw - 32px);
        background: var(--bg-surface);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        overflow: hidden;
      }
      .rc-notif-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-bottom: 1px solid var(--border-default);
      }
      .rc-notif-list { max-height: 420px; }
      .rc-notif-item {
        display: flex;
        gap: 10px;
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-default);
        cursor: pointer;
        transition: background .15s;
      }
      .rc-notif-item:last-child { border-bottom: none; }
      .rc-notif-item:hover { background: var(--bg-hover); }
      .rc-notif-item--unread { background: rgba(180,130,70,.04); }
      .rc-notif-dot-col { width: 8px; flex-shrink: 0; display: flex; align-items: flex-start; padding-top: 4px; }
      .rc-notif-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-ochre); }

      /* ── Main content ── */
      .rc-main-content {
        flex: 1;
        padding: 24px;
        overflow-y: auto;
        background: var(--bg-primary);
        transition: background .3s ease;
      }

      /* ── Mobile overlay ── */
      .rc-mobile-overlay { position: fixed; inset: 0; z-index: 50; display: flex; }
      .rc-mobile-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(55,40,30,.28);
        backdrop-filter: blur(3px);
        animation: rc-fade-in .2s ease;
      }
      .rc-mobile-sidebar {
        position: relative;
        width: var(--sidebar-w);
        background: var(--bg-surface);
        border-right: 1px solid var(--border-default);
        box-shadow: var(--shadow-xl);
        z-index: 51;
      }

      /* ── Typography helpers ── */
      .rc-label-xs  { font-size: 11px; font-family: var(--font-body); }
      .rc-label-sm  { font-size: 13px; font-family: var(--font-body); }
      .rc-text-primary   { color: var(--text-primary); }
      .rc-text-secondary { color: var(--text-secondary); }
      .rc-text-tertiary  { color: var(--text-tertiary); }

      /* ── Mobile responsiveness ── */
      @media (max-width: 767px) {
        .rc-topbar {
          padding: 0 12px;
        }
        .rc-main-content {
          padding: 16px;
        }
        .rc-notif-panel {
          right: 4px;
          left: 4px;
          width: auto;
          max-width: none;
        }
        .rc-usermenu {
          position: fixed;
          top: auto;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          border-radius: 16px 16px 0 0;
          max-height: 80vh;
          overflow-y: auto;
        }
        /* Center the mobile avatar trigger */
        .rc-mobile-only .rc-avatar {
          margin: 0;
        }
      }
    `}</style>
  )
} 
