import { useState, useRef, useEffect, useCallback } from 'react'
import { useNotifications } from '../../hooks/useNotifications'

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getNotificationIcon = (type: string) => {
    const iconStyle: React.CSSProperties = {
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      fontSize: '10px',
      fontWeight: 'bold',
      flexShrink: 0,
    }

    // Type-specific icons from Supabase notifications
    switch (type) {
      case 'new_lead':
        return (
          <div style={{ ...iconStyle, background: 'var(--color-ochre)', color: 'white' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
        )
      case 'appointment_reminder':
        return (
          <div style={{ ...iconStyle, background: '#C35F46', color: 'white' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
        )
      case 'deal_update':
        return (
          <div style={{ ...iconStyle, background: '#6E8C64', color: 'white' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
        )
      case 'system':
        return (
          <div style={{ ...iconStyle, background: '#5A555F', color: 'white' }}>!</div>
        )
      case 'success':
        return (
          <div style={{ ...iconStyle, background: 'var(--color-sage)', color: 'white' }}>✓</div>
        )
      case 'error':
        return (
          <div style={{ ...iconStyle, background: '#DC2626', color: 'white' }}>!</div>
        )
      case 'warning':
        return (
          <div style={{ ...iconStyle, background: 'var(--color-ochre)', color: 'white' }}>⚠</div>
        )
      default:
        return (
          <div style={{ ...iconStyle, background: 'var(--color-sage)', color: 'white' }}>ℹ</div>
        )
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
      case 'new_lead':
        return 'var(--color-sage)'
      case 'error':
        return '#DC2626'
      case 'appointment_reminder':
        return '#C35F46'
      case 'warning':
      case 'deal_update':
        return 'var(--color-ochre)'
      default:
        return 'var(--color-sage)'
    }
  }

  const timeAgo = useCallback((dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#DC2626',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              border: '2px solid var(--bg-primary)',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          ref={modalRef}
          style={{
            position: 'absolute',
            top: '40px',
            right: '0px',
            width: '360px',
            maxHeight: '480px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border-secondary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3
              style={{
                margin: '0',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-sage)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-tertiary)'
                    }}
                  >
                    Mark all
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div
            style={{
              flex: '1',
              overflowY: 'auto',
              maxHeight: '400px',
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'var(--text-tertiary)',
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{
                    opacity: 0.5,
                    marginBottom: '8px',
                  }}
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p style={{ margin: '0', fontSize: '13px', fontWeight: '500' }}>No notifications</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.7 }}>
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.is_read) markAsRead(notif.id)
                  }}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-secondary)',
                    background: notif.is_read ? 'transparent' : 'rgba(180, 130, 70, 0.05)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}
                  onMouseEnter={(e) => {
                    if (!notif.is_read) {
                      e.currentTarget.style.background = 'rgba(180, 130, 70, 0.08)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!notif.is_read) {
                      e.currentTarget.style.background = 'rgba(180, 130, 70, 0.05)'
                    }
                  }}
                >
                  {/* Icon */}
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: '13px',
                        fontWeight: notif.is_read ? '500' : '600',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {notif.title}
                    </p>
                    {notif.message && (
                      <p
                        style={{
                          margin: '0 0 4px',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {notif.message}
                      </p>
                    )}
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {timeAgo(notif.created_at)}
                    </span>
                  </div>

                  {/* Unread Indicator */}
                  {!notif.is_read && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: getTypeColor(notif.type),
                        flexShrink: 0,
                        marginTop: '6px',
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell