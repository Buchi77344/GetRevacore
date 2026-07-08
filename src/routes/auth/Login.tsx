import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { notifications } from '../../lib/notifications'

const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="var(--color-espresso)"/>
    <path d="M9 24l4.5-9L18 21l4.5-9.5L27 24" stroke="var(--color-ochre)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24.5" cy="13.5" r="2.8" fill="var(--color-ochre)" opacity="0.9"/>
    <path d="M8 28h20" stroke="var(--color-cream)" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
  </svg>
)

const Icons = {
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Lock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
    </svg>
  ),
}

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Rate limiting: prevent multiple rapid submission attempts
  const lastAttemptRef = useRef(0)
  const MIN_ATTEMPT_INTERVAL_MS = 2000

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (loginError) setLoginError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Rate limiting
    const now = Date.now()
    if (now - lastAttemptRef.current < MIN_ATTEMPT_INTERVAL_MS) {
      return
    }
    lastAttemptRef.current = now

    setLoading(true)
    setLoginError(null)
    try {
      await signIn(form.email, form.password)
      notifications.auth.loginSuccess()
      // Brief transition to ensure state settles before navigating
      await new Promise(resolve => setTimeout(resolve, 300))
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const msg = err?.message || 'Failed to sign in. Please try again.'
      setLoginError(msg)
      notifications.auth.loginError()
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
            Welcome back
          </h1>
          <p style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            margin: 0,
            fontWeight: 500,
            lineHeight: 1.5,
          }}>
            Sign in to your RevaCore account
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          style={{
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
          }}
        >
          {/* Card glow */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 150, height: 150, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180, 130, 70, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Error message */}
          {loginError && (
            <div style={{
              padding: '10px 13px',
              borderRadius: 10,
              background: 'rgba(220,38,38,0.06)',
              border: '1px solid rgba(220,38,38,0.15)',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p style={{ fontSize: 12, color: '#DC2626', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{loginError}</p>
            </div>
          )}

          {/* Email Field */}
          <div style={{ position: 'relative' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              <Icons.Mail />
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 14,
                fontWeight: 500,
                background: 'var(--bg-tertiary)',
                border: `1.5px solid ${focusedField === 'email' ? 'var(--color-ochre)' : 'var(--border-secondary)'}`,
                borderRadius: 14,
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(180, 130, 70, 0.08)' : 'none',
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ position: 'relative' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              <Icons.Lock />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  background: 'var(--bg-tertiary)',
                  border: `1.5px solid ${focusedField === 'password' ? 'var(--color-ochre)' : 'var(--border-secondary)'}`,
                  borderRadius: 14,
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(180, 130, 70, 0.08)' : 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                  padding: 4,
                  display: 'flex',
                  transition: 'color 0.2s ease',
                }}
              >
                {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: 12,
                  color: 'var(--text-tertiary)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'color 0.2s ease',
                }}
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Remember Me */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500,
          }}>
            <input type="checkbox" style={{ width: 16, height: 16, borderRadius: 4, accentColor: 'var(--color-ochre)', cursor: 'pointer' }} />
            Remember me for 30 days
          </label>

          {/* Submit Button */}
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
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <Icons.ArrowRight />
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-secondary)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-secondary)' }} />
          </div>

          {/* Social Login Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <button type="button" style={{
              padding: '12px',
              fontSize: 13, fontWeight: 600,
              color: 'var(--text-secondary)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s ease',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button type="button" style={{
              padding: '12px',
              fontSize: 13, fontWeight: 600,
              color: 'var(--text-secondary)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s ease',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-3.22 1.44-.15-1.25.507-2.6 1.27-3.47.824-.93 2.18-1.63 3.127-1.05z"/>
                <path d="M12 6.5c-1.3 0-2.6.5-3.6 1.3-1.5 1.2-2.4 3-2.4 5 0 2 .9 3.8 2.4 5 1 1.4 2.6 2.2 4.2 2.2 1.8 0 3-.6 4-1.3.9-.6 1.5-1.4 2-2.3h-4v-3h7c.1.5.2 1 .2 1.6 0 3.5-1.8 6.5-4.6 8.3-1.5.9-3.3 1.4-5.2 1.4-3.5 0-6.6-1.8-8.5-4.6-.9-1.4-1.4-3-1.4-4.7s.5-3.3 1.4-4.7c1.9-2.8 5-4.6 8.5-4.6 1.4 0 2.7.3 3.9.9l-3 3c-.3-.1-.6-.2-1-.2z"/>
              </svg>
              Microsoft
            </button>
          </div>

          {/* Sign Up Link */}
          <p style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--text-secondary)',
            margin: 0,
            fontWeight: 500,
          }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: 'var(--color-ochre)',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
            >
              Start free trial
              <span style={{ display: 'inline-flex', marginLeft: 4, verticalAlign: 'middle' }}>
                <Icons.Sparkle />
              </span>
            </Link>
          </p>
        </form>

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
          <Icons.Shield />
          <span>256-bit encrypted · Your data is secure</span>
        </div>

        {/* Quick Links */}
        <div style={{
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}>
          {['Privacy', 'Terms', 'Support'].map(link => (
            <Link
              key={link}
              to={`/${link.toLowerCase()}`}
              style={{
                fontSize: 11,
                color: 'var(--text-tertiary)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s ease',
              }}
            >
              {link}
            </Link>
          ))}
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