import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { notifications } from '../../lib/notifications'

const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="var(--color-espresso)"/>
    <path d="M9 24l4.5-9L18 21l4.5-9.5L27 24" stroke="var(--color-ochre)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24.5" cy="13.5" r="2.8" fill="var(--color-ochre)" opacity="0.9"/>
    <path d="M8 28h20" stroke="var(--color-cream)" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
  </svg>
)

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSent(true)
      notifications.auth.passwordReset()
    } catch (err: any) {
      notifications.auth.passwordResetError()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      fontFamily: 'var(--font-body)',
      background: 'var(--bg-primary)',
    }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 50% at 50% 0%, rgba(180, 130, 70, 0.04) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 100% 100%, rgba(195, 95, 70, 0.03) 0%, transparent 60%),
          radial-gradient(ellipse 30% 30% at 0% 50%, rgba(110, 140, 100, 0.03) 0%, transparent 60%)
        `,
      }} />
      
      {/* Subtle grid pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.03,
        backgroundImage: `
          linear-gradient(var(--border-primary) 1px, transparent 1px),
          linear-gradient(90deg, var(--border-primary) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Main Container */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', marginBottom: 16 }}>
            <Logo />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 30px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 6px',
            letterSpacing: '-0.02em',
          }}>
            {sent ? 'Check your inbox' : 'Reset password'}
          </h1>
          <p style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            margin: 0,
            fontWeight: 500,
            lineHeight: 1.5,
          }}>
            {sent ? "We've sent you a reset link" : "We'll send you a reset link"}
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          backdropFilter: 'blur(24px)',
          borderRadius: 24,
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-lg)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Card glow */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 150, height: 150, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180, 130, 70, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {sent ? (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, padding: '12px 0' }}>
              {/* Success icon */}
              <div style={{
                width: 56, height: 56,
                borderRadius: '50%',
                background: 'rgba(107,143,113,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                We sent a reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
                Check your inbox and click the link to reset your password.
              </p>

              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  marginTop: 8,
                  fontSize: 13,
                  color: 'var(--color-ochre)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                }}
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: 14,
                    fontWeight: 500,
                    background: 'var(--bg-tertiary)',
                    border: '1.5px solid var(--border-secondary)',
                    borderRadius: 14,
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--color-cream)',
                  background: loading ? 'var(--border-secondary)' : 'var(--color-espresso)',
                  border: 'none',
                  borderRadius: 14,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)',
                  boxShadow: loading ? 'none' : 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>

              <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-secondary)' }}>
                <p style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  margin: 0,
                  fontWeight: 500,
                }}>
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: 'var(--color-ochre)',
                      fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontSize: 11,
          color: 'var(--text-tertiary)',
          fontWeight: 500,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>256-bit encrypted · Your data is secure</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}