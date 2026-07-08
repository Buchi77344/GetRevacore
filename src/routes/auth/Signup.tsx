import React, { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { notifications } from '../../lib/notifications'

// ── Types ─────────────────────────────────────────────────────────────────────
interface SignupForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agencyName: string
  agencyType: string
  market: string
  leadSources: string[]
  propertyFocus: string[]
}

// ── Constants ─────────────────────────────────────────────────────────────────
const TRIAL_PLAN = 'pro'

const markets = [
  { value: 'AE',    label: 'UAE (Dubai / Abu Dhabi)', currency: 'AED' },
  { value: 'CA',    label: 'Canada',                  currency: 'CAD' },
  { value: 'NG',    label: 'Nigeria',                 currency: 'NGN' },
  { value: 'GH',    label: 'Ghana',                   currency: 'GHS' },
  { value: 'ZA',    label: 'South Africa',            currency: 'ZAR' },
  { value: 'KE',    label: 'Kenya',                   currency: 'KES' },
  { value: 'GB',    label: 'United Kingdom',          currency: 'GBP' },
  { value: 'OTHER', label: 'Other',                   currency: 'USD' },
]

const agencyTypes = [
  { value: 'solo',     label: 'Solo Agent',      desc: 'Just me'      },
  { value: 'boutique', label: 'Boutique Agency', desc: '2–10 agents'  },
  { value: 'mid',      label: 'Mid-size Agency', desc: '11–50 agents' },
  { value: 'large',    label: 'Large Brokerage', desc: '50+ agents'   },
]

const leadSourceOptions = [
  { value: 'property_finder', label: 'Property Finder' },
  { value: 'bayut',           label: 'Bayut'           },
  { value: 'website',         label: 'My Website'      },
  { value: 'referrals',       label: 'Referrals'       },
  { value: 'social_media',    label: 'Social Media'    },
  { value: 'walk_ins',        label: 'Walk-ins'        },
  { value: 'email',           label: 'Email Campaigns' },
  { value: 'other',           label: 'Other'           },
]

const propertyTypeOptions = [
  { value: 'residential', label: 'Residential'             },
  { value: 'commercial',  label: 'Commercial'              },
  { value: 'offplan',     label: 'Off-plan / New dev'      },
  { value: 'investment',  label: 'Investment / Buy-to-let' },
]

// ── Pain → Solution cards for Step 3 ─────────────────────────────────────────
const painSolutions = [
  {
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    pain: '"By the time I reply, they\'re already talking to another agent."',
    badge: 'AI Auto-Reply',
    fix: 'RevaCore replies in 60 seconds. Personalised email, matching properties, every lead — around the clock.',
    accent: 'var(--color-ochre)',
  },
  {
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="22" y1="12" x2="19" y2="12"/><line x1="5" y1="12" x2="2" y2="12"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
      </svg>
    ),
    pain: '"I waste hours on tyre-kickers while real buyers go cold waiting."',
    badge: 'Lead Scoring',
    fix: 'Every lead scored Hot, Warm, or Cold the moment it arrives. Know who to call — before you pick up the phone.',
    accent: '#E05252',
  },
  {
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    pain: '"I forgot to follow up. They bought through a competitor."',
    badge: 'Automated Pipeline',
    fix: 'Your pipeline moves itself. Every deal tracked, every follow-up timed. Nothing goes silent.',
    accent: '#6B8F71',
  },
  {
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    pain: '"An investor asked for the cap rate. I said I\'d get back to them."',
    badge: 'Deal Analyzer',
    fix: 'ROI, cap rate, cashflow — on the spot. Answer every investor question in seconds, not hours.',
    accent: 'var(--color-ochre)',
  },
  {
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    pain: '"Writing one property listing takes me 45 minutes."',
    badge: 'AI Marketing Suite',
    fix: 'Listings, email campaigns, social posts — generated in seconds. Tell the AI what you need.',
    accent: '#6B8F71',
  },
  {
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    pain: '"I\'m paying for portals and ads and have no idea what\'s working."',
    badge: 'Analytics',
    fix: 'See exactly which sources, agents, and campaigns close deals. Cut what doesn\'t work.',
    accent: '#E05252',
  },
]

const TOTAL_STEPS = 5

// ── Validation ────────────────────────────────────────────────────────────────
const validateStep1 = (f: SignupForm) => {
  const e: Record<string, string> = {}
  if (!f.firstName.trim() || f.firstName.trim().length < 2)
    e.firstName = 'At least 2 characters required'
  if (!f.lastName.trim() || f.lastName.trim().length < 2)
    e.lastName = 'At least 2 characters required'
  if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = 'Please enter a valid email address'
  if (!f.phone.trim())
    e.phone = 'Phone number is required'
  const pw: string[] = []
  if (f.password.length < 8)                        pw.push('8+ characters')
  if (!/\d/.test(f.password))                       pw.push('1 number')
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(f.password))  pw.push('1 special character')
  if (pw.length) e.password = `Password needs: ${pw.join(', ')}`
  if (!f.confirmPassword)
    e.confirmPassword = 'Please confirm your password'
  else if (f.password !== f.confirmPassword)
    e.confirmPassword = 'Passwords do not match'
  return e
}

const validateStep2 = (f: SignupForm) => {
  const e: Record<string, string> = {}
  if (!f.agencyName.trim() || f.agencyName.trim().length < 2)
    e.agencyName = 'Agency name must be at least 2 characters'
  if (!f.agencyType) e.agencyType = 'Please select your agency size'
  if (!f.market)     e.market     = 'Please select your market'
  return e
}

const validateStep4 = (f: SignupForm) => {
  const e: Record<string, string> = {}
  if (!f.leadSources.length)   e.leadSources   = 'Select at least one lead source'
  if (!f.propertyFocus.length) e.propertyFocus = 'Select at least one property type'
  return e
}

// ── Logo ──────────────────────────────────────────────────────────────────────
const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="var(--color-espresso)" />
    <path d="M9 24l4.5-9L18 21l4.5-9.5L27 24" stroke="var(--color-ochre)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24.5" cy="13.5" r="2.8" fill="var(--color-ochre)" opacity="0.9" />
    <path d="M8 28h20" stroke="var(--color-cream)" strokeWidth="1.8" strokeLinecap="round" opacity="0.3" />
  </svg>
)

// ── Icon set ──────────────────────────────────────────────────────────────────
const I = {
  Mail:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Lock:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Bldg:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>,
  Phone:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  Globe:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  ArrowR:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowL:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Shield:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Eye:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Check:   () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Rocket:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  User:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  MailLg:  () => <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Zap:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
}

// ── Checkbox visual ───────────────────────────────────────────────────────────
const Checkbox = ({ checked }: { checked: boolean }) => (
  <div style={{
    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
    border: `1.5px solid ${checked ? 'var(--color-ochre)' : 'var(--border-secondary)'}`,
    background: checked ? 'var(--color-ochre)' : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.14s ease',
  }}>
    {checked && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
  </div>
)

// ── Radio visual ──────────────────────────────────────────────────────────────
const Radio = ({ checked }: { checked: boolean }) => (
  <div style={{
    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
    border: `1.5px solid ${checked ? 'var(--color-ochre)' : 'var(--border-secondary)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.14s ease',
  }}>
    {checked && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-ochre)' }} />}
  </div>
)

// ── Module-level style constants ──────────────────────────────────────────────
const lbl: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 5,
  fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em',
}
const errStyle: React.CSSProperties  = { fontSize: 11, color: '#DC2626', margin: '4px 0 0', fontWeight: 500 }
const hintStyle: React.CSSProperties = { fontSize: 11, color: 'var(--text-tertiary)', margin: '4px 0 0', fontWeight: 500 }
const eyeBtn: React.CSSProperties    = {
  position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-tertiary)', display: 'flex', padding: 4,
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Signup() {
  const { signUp } = useAuth()

  const [step, setStep]             = useState(1)
  const [direction, setDirection]   = useState<1 | -1>(1)   // 1 = forward, -1 = back
  const [loading, setLoading]       = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [showPw, setShowPw]         = useState(false)
  const [showCPw, setShowCPw]       = useState(false)
  const [focused, setFocused]       = useState<string | null>(null)
  const [agreeToTerms, setAgree]    = useState(false)
  const [termsError, setTermsError] = useState(false)
  const [errors, setErrors]         = useState<Record<string, string>>({})
  const [generalError, setGenErr]   = useState<string | null>(null)
  const animKey = useRef(0)          // increments on every step change to re-trigger animation

  const [form, setForm] = useState<SignupForm>({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    agencyName: '', agencyType: '', market: '',
    leadSources: [], propertyFocus: [],
  })

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
    setGenErr(null)
  }, [])

  const toggleArr = useCallback((
    field: 'leadSources' | 'propertyFocus', val: string,
  ) => {
    setForm(prev => {
      const cur = prev[field]
      return { ...prev, [field]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] }
    })
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }, [])

  const goTo = (nextStep: number) => {
    setDirection(nextStep > step ? 1 : -1)
    animKey.current += 1
    setStep(nextStep)
  }

  const handleNext = useCallback(() => {
    const errs =
      step === 1 ? validateStep1(form) :
      step === 2 ? validateStep2(form) :
      step === 4 ? validateStep4(form) : {}

    if (Object.keys(errs).length) {
      setErrors(errs)
      notifications.general?.validationError?.(Object.values(errs)[0])
      return
    }
    setErrors({})
    goTo(step + 1)
  }, [step, form])

  const handleBack = useCallback(() => {
    setErrors({})
    setGenErr(null)
    goTo(step - 1)
  }, [step])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeToTerms) { setTermsError(true); return }

    const allErrs = { ...validateStep1(form), ...validateStep2(form), ...validateStep4(form) }
    if (Object.keys(allErrs).length) { setErrors(allErrs); return }

    setLoading(true); setGenErr(null)
    try {
      await signUp(
        form.email.trim().toLowerCase(),
        form.password,
        form.firstName.trim(),
        form.lastName.trim(),
        form.agencyName.trim(),
        TRIAL_PLAN,
        form.phone.trim() || undefined,
        {
          agencyType:    form.agencyType,
          market:        form.market,
          leadSources:   form.leadSources,
          propertyFocus: form.propertyFocus,
        },
      )
      setSubmitted(true)
    } catch (err: any) {
      const msg = err.message || 'Failed to create account. Please try again.'
      setGenErr(msg)
      notifications.auth?.signupError?.(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── Input style factory ─────────────────────────────────────────────────────
  const inp = useCallback((name: string): React.CSSProperties => ({
    width: '100%', padding: '11px 14px', fontSize: 14, fontWeight: 500,
    background: 'var(--bg-tertiary)',
    border: `1.5px solid ${errors[name] ? '#DC2626' : focused === name ? 'var(--color-ochre)' : 'var(--border-secondary)'}`,
    borderRadius: 10, color: 'var(--text-primary)', outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box' as const,
    boxShadow: errors[name]
      ? '0 0 0 3px rgba(220,38,38,0.08)'
      : focused === name ? '0 0 0 3px rgba(180,130,70,0.09)' : 'none',
  }), [errors, focused])

  // ── Pill selector (agency size) ─────────────────────────────────────────────
  const pillStyle = (selected: boolean): React.CSSProperties => ({
    padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
    background: selected ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
    border: `1.5px solid ${selected ? 'var(--color-ochre)' : 'var(--border-secondary)'}`,
    boxShadow: selected ? '0 3px 12px rgba(180,130,70,0.1)' : 'none',
    transition: 'all 0.15s ease',
    display: 'flex', alignItems: 'center', gap: 8,
  })

  // ── Chip selector (lead sources / property types) ───────────────────────────
  const chipStyle = (selected: boolean): React.CSSProperties => ({
    padding: '9px 13px', borderRadius: 10, cursor: 'pointer',
    background: selected ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
    border: `1.5px solid ${selected ? 'var(--color-ochre)' : 'var(--border-secondary)'}`,
    boxShadow: selected ? '0 2px 8px rgba(180,130,70,0.09)' : 'none',
    transition: 'all 0.15s ease',
    display: 'flex', alignItems: 'center', gap: 8,
  })

  // ── Submitted screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)', fontFamily: 'var(--font-body)', animation: 'cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div style={{ maxWidth: 460, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(107,143,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', color: '#6B8F71', border: '1px solid rgba(107,143,113,0.2)' }}>
            <I.MailLg />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Check your inbox
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 6px' }}>
            Confirmation link sent to{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong>
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6, margin: '0 0 22px' }}>
            Click it to activate your 14-day Pro trial and open your dashboard.
          </p>

          <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', textAlign: 'left', marginBottom: 14 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 12px' }}>
              Your AI is configured for
            </p>
            {[
              `${markets.find(m => m.value === form.market)?.label ?? 'your market'} — currency & data set`,
              'AI replies to new leads in under 60 seconds',
              'Lead scoring, pipeline & deal analyzer active',
              `${form.propertyFocus.length} property type${form.propertyFocus.length !== 1 ? 's' : ''} — auto lead matching on`,
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: i < 3 ? 8 : 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(107,143,113,0.12)', color: '#6B8F71', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <I.Check />
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
            Didn't receive it? Check your spam folder, or{' '}
            <button onClick={() => setSubmitted(false)}
              style={{ background: 'none', border: 'none', color: 'var(--color-ochre)', fontWeight: 600, cursor: 'pointer', fontSize: 12, padding: 0 }}>
              try again
            </button>.
          </p>
        </div>
      </div>
    )
  }

  // ── Step headings & sub-headings ────────────────────────────────────────────
  const meta: Record<number, { h: string; sub: string }> = {
    1: { h: 'Create your account',          sub: '14-day free trial — no credit card required'              },
    2: { h: 'Tell us about your agency',    sub: 'We configure your CRM around your market'                 },
    3: { h: 'Why agents choose RevaCore',   sub: 'Six problems we eliminate from your workflow, from day one' },
    4: { h: 'Two quick questions',          sub: 'Helps your AI start working immediately'                   },
    5: { h: "You're ready to launch",       sub: 'Review your setup and start your free trial'               },
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'var(--font-body)', background: 'var(--bg-primary)' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(180,130,70,0.05) 0%, transparent 65%)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: step === 3 ? 640 : 480 }}>

        {/* Logo + heading */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Link to="/" style={{ display: 'inline-flex', marginBottom: 14, textDecoration: 'none' }}>
            <Logo />
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3.5vw,25px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 5px', letterSpacing: '-0.02em' }}>
            {meta[step].h}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
            {meta[step].sub}
          </p>
        </div>

        {/* Step dots — minimal, no progress bar */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, marginBottom: 28 }}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(n => (
            <div key={n} style={{
              height: 5, borderRadius: 100,
              width: n === step ? 24 : 5,
              background: n < step
                ? 'var(--color-ochre)'
                : n === step
                  ? 'var(--color-ochre)'
                  : 'var(--border-secondary)',
              transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              opacity: n > step ? 0.4 : 1,
            }} />
          ))}
        </div>

        {/* ── Form — no card container, just a clipping viewport so the
            slide-in animation doesn't spill outside the content column.
            No background / border / shadow here anymore. ────────────── */}
        <form
          onSubmit={step === TOTAL_STEPS ? handleSubmit : e => { e.preventDefault(); handleNext() }}
        >
          {/* General error */}
          {generalError && (
            <div style={{ margin: '0 0 16px', padding: '10px 13px', borderRadius: 10, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }}><I.Alert /></span>
              <p style={{ fontSize: 12, color: '#DC2626', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{generalError}</p>
            </div>
          )}

          {/* ── Animated step content ─────────────────────────────────────
              key changes on every step transition, triggering re-mount
              and replaying the CSS animation. Direction state controls
              whether content enters from left or right.
          ─────────────────────────────────────────────────────────────── */}
          <div
            key={animKey.current}
            className={direction === 1 ? 'step-fwd' : 'step-bck'}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >

            {/* ── STEP 1: Account ──────────────────────────────────────── */}
            {step === 1 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }} className="name-row">
                  <div>
                    <label style={lbl}><I.User /> First Name</label>
                    <input type="text" name="firstName" required value={form.firstName} onChange={handleChange}
                      onFocus={() => setFocused('firstName')} onBlur={() => setFocused(null)}
                      placeholder="John" style={inp('firstName')} autoComplete="given-name" />
                    {errors.firstName && <p style={errStyle}>{errors.firstName}</p>}
                  </div>
                  <div>
                    <label style={lbl}><I.User /> Last Name</label>
                    <input type="text" name="lastName" required value={form.lastName} onChange={handleChange}
                      onFocus={() => setFocused('lastName')} onBlur={() => setFocused(null)}
                      placeholder="Smith" style={inp('lastName')} autoComplete="family-name" />
                    {errors.lastName && <p style={errStyle}>{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label style={lbl}><I.Mail /> Work Email</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    placeholder="you@youragency.com" style={inp('email')} autoComplete="email" />
                  {errors.email && <p style={errStyle}>{errors.email}</p>}
                </div>

                <div>
                  <label style={lbl}>
                    <I.Phone /> Phone Number
                    <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: 'rgba(180,130,70,0.1)', color: 'var(--color-ochre)' }}>CRM Required</span>
                  </label>
                  <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                    onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                    placeholder="+1 234 567 890" style={inp('phone')} autoComplete="tel" />
                  {errors.phone && <p style={errStyle}>{errors.phone}</p>}
                  <p style={hintStyle}>For WhatsApp & SMS follow-up sync</p>
                </div>

                <div>
                  <label style={lbl}><I.Lock /> Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} name="password" required value={form.password}
                      onChange={handleChange} onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                      placeholder="Min. 8 characters" style={{ ...inp('password'), paddingRight: 42 }} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={eyeBtn}>
                      {showPw ? <I.EyeOff /> : <I.Eye />}
                    </button>
                  </div>
                  {errors.password && <p style={errStyle}>{errors.password}</p>}
                  <div style={{ marginTop: 5, display: 'flex', gap: 12 }}>
                    {[
                      { t: '8+ chars', ok: form.password.length >= 8 },
                      { t: '1 number',  ok: /\d/.test(form.password) },
                      { t: '1 symbol',  ok: /[!@#$%^&*(),.?":{}|<>]/.test(form.password) },
                    ].map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: r.ok ? '#6B8F71' : 'var(--border-secondary)', transition: 'background 0.2s' }} />
                        <span style={{ fontSize: 10, color: r.ok ? '#6B8F71' : 'var(--text-tertiary)', fontWeight: 500 }}>{r.t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={lbl}><I.Lock /> Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showCPw ? 'text' : 'password'} name="confirmPassword" required value={form.confirmPassword}
                      onChange={handleChange} onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused(null)}
                      placeholder="Re-enter your password" style={{ ...inp('confirmPassword'), paddingRight: 42 }} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowCPw(!showCPw)} style={eyeBtn}>
                      {showCPw ? <I.EyeOff /> : <I.Eye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p style={errStyle}>{errors.confirmPassword}</p>}
                  {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: '#6B8F71' }}>
                      <I.Check />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>Passwords match</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── STEP 2: Agency ───────────────────────────────────────── */}
            {step === 2 && (
              <>
                <div>
                  <label style={lbl}><I.Bldg /> Agency / Brokerage Name</label>
                  <input type="text" name="agencyName" required value={form.agencyName} onChange={handleChange}
                    onFocus={() => setFocused('agencyName')} onBlur={() => setFocused(null)}
                    placeholder="e.g. Skyline Realty" style={inp('agencyName')} />
                  {errors.agencyName && <p style={errStyle}>{errors.agencyName}</p>}
                </div>

                <div>
                  <label style={lbl}>Agency Size</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                    {agencyTypes.map(t => {
                      const sel = form.agencyType === t.value
                      return (
                        <div key={t.value}
                          onClick={() => { setForm(p => ({ ...p, agencyType: t.value })); setErrors(p => { const n = { ...p }; delete n.agencyType; return n }) }}
                          style={pillStyle(sel)}>
                          <Radio checked={sel} />
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 1px' }}>{t.label}</p>
                            <p style={{ fontSize: 10, color: 'var(--text-tertiary)', margin: 0 }}>{t.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {errors.agencyType && <p style={errStyle}>{errors.agencyType}</p>}
                </div>

                <div>
                  <label style={lbl}><I.Globe /> Primary Market</label>
                  <select name="market" required value={form.market} onChange={handleChange}
                    onFocus={() => setFocused('market')} onBlur={() => setFocused(null)}
                    style={{ ...inp('market'), appearance: 'none', cursor: 'pointer' }}>
                    <option value="">Select market...</option>
                    {markets.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  {errors.market && <p style={errStyle}>{errors.market}</p>}
                  {form.market && (
                    <p style={hintStyle}>
                      Dashboard currency & property data set to {markets.find(m => m.value === form.market)?.currency}
                    </p>
                  )}
                </div>

                <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(180,130,70,0.04)', border: '1px solid rgba(180,130,70,0.1)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-ochre)', flexShrink: 0, marginTop: 1 }}><I.Zap /></span>
                  <span>Your AI will be localised for property types, market norms, and currency. More markets can be added later.</span>
                </div>
              </>
            )}

            {/* ── STEP 3: Value pitch — 6 pain → solution cards ────────────
                This is a CONVERSION screen, not a form.
                Agents read it, recognise their problems, and feel sold.
                No input. Just copy. Then "Set up my AI" to proceed.
            ──────────────────────────────────────────────────────────── */}
            {step === 3 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }} className="pain-grid">
                  {painSolutions.map((ps, i) => (
                    <div key={i} style={{
                      borderRadius: 12, overflow: 'hidden',
                      border: '1px solid var(--border-secondary)',
                      background: 'var(--bg-tertiary)',
                      transition: 'border-color 0.2s',
                    }}>
                      {/* Pain quote */}
                      <div style={{ padding: '11px 13px 9px', borderBottom: '1px solid var(--border-secondary)' }}>
                        <p style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45, fontStyle: 'italic' }}>
                          {ps.pain}
                        </p>
                      </div>
                      {/* Fix */}
                      <div style={{ padding: '9px 13px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ color: ps.accent }}><ps.Icon /></span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: ps.accent, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            {ps.badge}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                          {ps.fix}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Closing statement */}
                <div style={{ padding: '12px 15px', borderRadius: 12, background: 'rgba(180,130,70,0.05)', border: '1px solid rgba(180,130,70,0.14)', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-ochre)', flexShrink: 0 }}><I.Rocket /></span>
                  <p style={{ fontSize: 12, color: 'var(--text-primary)', margin: 0, fontWeight: 600, lineHeight: 1.45 }}>
                    All of this is live the moment you confirm your email — no setup, no integrations required.
                  </p>
                </div>
              </>
            )}

            {/* ── STEP 4: Quick setup — 2 questions ───────────────────── */}
            {step === 4 && (
              <>
                <div>
                  <label style={lbl}>Where do your leads come from?</label>
                  <p style={{ ...hintStyle, margin: '0 0 10px' }}>Select all that apply — your AI tracks performance per source</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                    {leadSourceOptions.map(ls => {
                      const sel = form.leadSources.includes(ls.value)
                      return (
                        <div key={ls.value} onClick={() => toggleArr('leadSources', ls.value)} style={chipStyle(sel)}>
                          <Checkbox checked={sel} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{ls.label}</span>
                        </div>
                      )
                    })}
                  </div>
                  {errors.leadSources && <p style={errStyle}>{errors.leadSources}</p>}
                </div>

                <div>
                  <label style={lbl}>What property types do you work with?</label>
                  <p style={{ ...hintStyle, margin: '0 0 10px' }}>Your AI matches leads to properties automatically</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                    {propertyTypeOptions.map(pt => {
                      const sel = form.propertyFocus.includes(pt.value)
                      return (
                        <div key={pt.value} onClick={() => toggleArr('propertyFocus', pt.value)} style={chipStyle(sel)}>
                          <Checkbox checked={sel} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{pt.label}</span>
                        </div>
                      )
                    })}
                  </div>
                  {errors.propertyFocus && <p style={errStyle}>{errors.propertyFocus}</p>}
                </div>
              </>
            )}

            {/* ── STEP 5: Review & Launch ──────────────────────────────── */}
            {step === 5 && (
              <>
                {/* Summary */}
                <div style={{ borderRadius: 12, border: '1px solid var(--border-secondary)', overflow: 'hidden' }}>
                  {[
                    { label: 'Account',        value: `${form.firstName} ${form.lastName} · ${form.email}` },
                    { label: 'Agency',         value: `${form.agencyName} · ${agencyTypes.find(a => a.value === form.agencyType)?.label ?? '—'}` },
                    { label: 'Market',         value: markets.find(m => m.value === form.market)?.label ?? '—' },
                    { label: 'Lead sources',   value: form.leadSources.map(v => leadSourceOptions.find(x => x.value === v)?.label).filter(Boolean).join(', ') || '—' },
                    { label: 'Property types', value: form.propertyFocus.map(v => propertyTypeOptions.find(x => x.value === v)?.label).filter(Boolean).join(', ') || '—' },
                  ].map((row, i, arr) => (
                    <div key={row.label} style={{ padding: '11px 15px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-secondary)' : 'none', display: 'flex', gap: 14, alignItems: 'flex-start', background: i % 2 === 0 ? 'var(--bg-tertiary)' : 'var(--bg-secondary)' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, paddingTop: 2, minWidth: 80 }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Trial callout */}
                <div style={{ padding: '13px 15px', borderRadius: 12, background: 'rgba(107,143,113,0.05)', border: '1px solid rgba(107,143,113,0.15)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#6B8F71', flexShrink: 0, marginTop: 1 }}><I.Rocket /></span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                      14-day Pro trial — completely free
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      Full access to AI lead scoring, auto-replies, the deal analyzer, and marketing suite. No credit card until you choose to stay.
                    </p>
                  </div>
                </div>

                {/* What happens next */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    'Confirm your email to activate your account',
                    'Connect your first lead source in under 2 minutes',
                    'Your AI scores and replies to your first lead automatically',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-espresso)', color: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Terms */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.5 }}>
                    <input type="checkbox" checked={agreeToTerms}
                      onChange={e => { setAgree(e.target.checked); if (e.target.checked) setTermsError(false) }}
                      style={{ width: 14, height: 14, accentColor: 'var(--color-ochre)', cursor: 'pointer', marginTop: 2, flexShrink: 0 }} />
                    I agree to the{' '}
                    <Link to="/terms" style={{ color: 'var(--color-ochre)', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" style={{ color: 'var(--color-ochre)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
                  </label>
                  {termsError && (
                    <p style={{ ...errStyle, display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
                      <I.Alert /> Please accept the Terms to continue
                    </p>
                  )}
                </div>
              </>
            )}

          </div>{/* end animated content */}

          {/* ── Navigation — static, not animated ───────────────────────── */}
          <div style={{ marginTop: 20, display: 'flex', gap: 9 }} className="nav-buttons">
            {step > 1 && (
              <button type="button" onClick={handleBack}
                style={{ padding: '11px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, transition: 'opacity 0.15s' }}>
                <I.ArrowL /> Back
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button type="button" onClick={handleNext}
                style={{ flex: 1, padding: '12px', fontSize: 14, fontWeight: 700, color: 'var(--color-cream)', background: 'var(--color-espresso)', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'opacity 0.15s' }}>
                {step === 3 ? 'Set up my AI' : 'Continue'} <I.ArrowR />
              </button>
            ) : (
              <button type="submit" disabled={loading}
                style={{ flex: 1, padding: '12px', fontSize: 14, fontWeight: 700, color: 'var(--color-cream)', background: loading ? 'var(--border-secondary)' : 'var(--color-espresso)', border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s' }}>
                {loading
                  ? <>
                      <svg style={{ animation: 'spin 1s linear infinite', width: 15, height: 15 }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Setting up your AI...
                    </>
                  : <><I.Rocket /> Launch my free trial</>
                }
              </button>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', margin: '18px 0 0', fontWeight: 500 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-ochre)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </form>

        {/* Trust footer */}
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
          <I.Shield />
          <span>256-bit encrypted · SOC2 compliant · Your data is never sold</span>
        </div>
      </div>

      <style>{`
        /* ── Step transitions ──────────────────────────────────────────────
            Each field cascades in on its own, staggered — not one flat
            block sliding over. Subtle blur-to-sharp + translate reads as
            a much more modern, "designed" motion than a single slab move.
        ───────────────────────────────────────────────────────────────── */
        @keyframes stepItemFwd {
          from { opacity: 0; transform: translateX(22px); filter: blur(3px); }
          to   { opacity: 1; transform: translateX(0);    filter: blur(0);   }
        }
        @keyframes stepItemBck {
          from { opacity: 0; transform: translateX(-22px); filter: blur(3px); }
          to   { opacity: 1; transform: translateX(0);     filter: blur(0);   }
        }

        .step-fwd > *, .step-bck > * {
          opacity: 0;
          animation-duration: 0.5s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: forwards;
        }
        .step-fwd > * { animation-name: stepItemFwd; }
        .step-bck > * { animation-name: stepItemBck; }

        .step-fwd > *:nth-child(1), .step-bck > *:nth-child(1) { animation-delay: 0.00s; }
        .step-fwd > *:nth-child(2), .step-bck > *:nth-child(2) { animation-delay: 0.045s; }
        .step-fwd > *:nth-child(3), .step-bck > *:nth-child(3) { animation-delay: 0.09s; }
        .step-fwd > *:nth-child(4), .step-bck > *:nth-child(4) { animation-delay: 0.135s; }
        .step-fwd > *:nth-child(5), .step-bck > *:nth-child(5) { animation-delay: 0.18s; }
        .step-fwd > *:nth-child(6), .step-bck > *:nth-child(6) { animation-delay: 0.225s; }
        .step-fwd > *:nth-child(7), .step-bck > *:nth-child(7) { animation-delay: 0.27s; }
        .step-fwd > *:nth-child(8), .step-bck > *:nth-child(8) { animation-delay: 0.315s; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Responsive ────────────────────────────────────────────────── */
        @media (max-width: 520px) {
          .name-row  { grid-template-columns: 1fr !important; }
          .pain-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .nav-buttons { flex-direction: column-reverse !important; }
        }
      `}</style>
    </div>
  )
}