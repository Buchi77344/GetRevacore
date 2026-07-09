"use client";

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

// ─── Icons (keep all your existing icons) ────────────────────────────────────
const Icons = {
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  CreditCard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Database: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  Bot: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="14" rx="2"/><circle cx="12" cy="16" r="1"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  ArrowUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
  ),
}

// ─── Plans (keep your existing plans array) ──────────────────────────────────
const plans = [
  {
    id: 'starter', name: 'Starter', description: 'Everything a solo agent needs to start closing smarter.',
    priceMonthly: 99, priceYearly: 950, popular: false,
    color: 'var(--color-sage)', accentBg: 'rgba(110, 140, 100, 0.06)', borderGlow: 'rgba(110, 140, 100, 0.12)',
    features: [
      { name: 'Up to 100 leads/month', included: true }, { name: '15 active property listings', included: true },
      { name: 'AI-powered lead follow-up sequences', included: true }, { name: 'Visual pipeline CRM (Kanban board)', included: true },
      { name: 'Lead status badges (Hot / Warm / Cold)', included: true }, { name: 'Public shareable listing pages', included: true },
      { name: 'Manual + form-based lead capture', included: true }, { name: 'Basic analytics overview', included: true },
      { name: 'Paddle-secured global payments', included: true }, { name: 'AI lead scoring engine', included: false },
      { name: 'AI marketing & content generator', included: false }, { name: 'Deal analyzer + investment reports', included: false },
      { name: 'Full multi-channel lead capture', included: false }, { name: 'Advanced analytics & forecasting', included: false },
      { name: 'Team seats & agent management', included: false },
    ],
    limits: { leads: 100, properties: 15, users: 1, aiCalls: 200 },
  },
  {
    id: 'professional', name: 'Pro', description: 'The complete AI system built to close more deals, faster.',
    priceMonthly: 199, priceYearly: 1910, popular: true,
    color: 'var(--color-ochre)', accentBg: 'rgba(180, 130, 70, 0.08)', borderGlow: 'rgba(180, 130, 70, 0.15)',
    features: [
      { name: 'Up to 1,000 leads/month', included: true }, { name: '100 active property listings', included: true },
      { name: 'AI lead scoring engine', included: true }, { name: 'Real-time lead score updates', included: true },
      { name: '7-day AI follow-up sequences', included: true }, { name: 'Full pipeline CRM with unlimited stages', included: true },
      { name: 'Deal analyzer', included: true }, { name: '5-year property appreciation projections', included: true },
      { name: 'AI risk assessment per deal', included: true }, { name: 'Branded investment report PDF export', included: true },
      { name: 'AI marketing & content generator', included: true }, { name: 'Property description AI writer', included: true },
      { name: 'Social media post generator', included: true }, { name: 'Email campaign builder with AI copy', included: true },
      { name: 'All 5 lead capture channels', included: true }, { name: 'Bulk CSV lead import', included: true },
      { name: 'Embeddable website lead form', included: true }, { name: 'Advanced analytics & revenue forecasting', included: true },
      { name: 'Campaign performance tracking', included: true }, { name: 'Priority support — 4hr response guarantee', included: true },
    ],
    limits: { leads: 1000, properties: 100, users: 3, aiCalls: 2000 },
  },
  {
    id: 'enterprise', name: 'Agency', description: 'Built for high-performance teams and brokerages.',
    priceMonthly: 399, priceYearly: 3830, popular: false,
    color: 'var(--color-espresso)', accentBg: 'rgba(55, 40, 30, 0.08)', borderGlow: 'rgba(55, 40, 30, 0.15)',
    features: [
      { name: 'Everything in Pro — unlimited', included: true }, { name: 'Unlimited leads & active properties', included: true },
      { name: 'Up to 10 agent seats included', included: true }, { name: 'Smart lead routing', included: true },
      { name: 'Manager performance dashboard', included: true }, { name: 'Team-wide analytics', included: true },
      { name: 'Commission tracking', included: true }, { name: 'Custom AI scoring rules', included: true },
      { name: 'Custom pipeline stages per team', included: true }, { name: 'Role-based access control', included: true },
      { name: 'API access + webhook integrations', included: true }, { name: 'White-label ready', included: true },
      { name: 'Early access to all new features', included: true }, { name: 'Priority support — 1hr response guarantee', included: true },
    ],
    limits: { leads: Infinity, properties: Infinity, users: 10, aiCalls: Infinity },
  },
]

// ─── Types ──────────────────────────────────────────────────────────────────
interface Subscription {
  id: string
  agency_id: string
  plan: string
  billing_cycle: string
  status: string
  amount: number
  currency: string
  renewal_date: string | null
  provider: string | null
  provider_ref: string | null
  created_at: string
}

interface UsageData {
  leads: { used: number; limit: number; percentage: number }
  properties: { used: number; limit: number; percentage: number }
  deals: { used: number; limit: number; percentage: number }
  users: { used: number; limit: number; percentage: number }
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function getPlanLimits(planId: string): { leads: number; properties: number; users: number; aiCalls: number } {
  const plan = plans.find(p => p.id === planId)
  return plan?.limits || { leads: 0, properties: 0, users: 1, aiCalls: 0 }
}

function getPlanName(planId: string): string {
  const plan = plans.find(p => p.id === planId)
  return plan?.name || planId
}

// ─── Main Billing Component ─────────────────────────────────────────────────
export const Billing = () => {
  const { agency } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usageData, setUsageData] = useState<UsageData>({
    leads: { used: 0, limit: 0, percentage: 0 },
    properties: { used: 0, limit: 0, percentage: 0 },
    deals: { used: 0, limit: 0, percentage: 0 },
    users: { used: 0, limit: 0, percentage: 0 },
  })
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [upgradeTarget, setUpgradeTarget] = useState<string>('')
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'plans' | 'usage' | 'invoices' | 'payment'>('plans')

  // ─── Fetch subscription data ──────────────────────────────────────────────
  const fetchSubscription = useCallback(async () => {
    if (!agency?.id) return

    setLoading(true)
    setError(null)

    try {
      // Fetch subscription
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('agency_id', agency.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (subError && subError.code !== 'PGRST116') throw subError
      setSubscription(subData || null)

      const planId = subData?.plan || agency?.plan || 'trial'
      const limits = getPlanLimits(planId)

      // Fetch usage counts
      const [
        { count: leadsCount },
        { count: propsCount },
        { count: dealsCount },
        { count: usersCount },
      ] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id),
        supabase.from('deals').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('status', 'active'),
        supabase.from('agent_profiles').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id),
      ])

      setUsageData({
        leads: {
          used: leadsCount || 0,
          limit: limits.leads,
          percentage: limits.leads === Infinity ? 0 : Math.round(((leadsCount || 0) / limits.leads) * 100),
        },
        properties: {
          used: propsCount || 0,
          limit: limits.properties,
          percentage: limits.properties === Infinity ? 0 : Math.round(((propsCount || 0) / limits.properties) * 100),
        },
        deals: {
          used: dealsCount || 0,
          limit: 50,
          percentage: Math.round(((dealsCount || 0) / 50) * 100),
        },
        users: {
          used: usersCount || 1,
          limit: limits.users,
          percentage: limits.users === Infinity ? 0 : Math.round(((usersCount || 1) / limits.users) * 100),
        },
      })

      // Fetch invoices (from subscriptions table as billing history)
      const { data: invData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('agency_id', agency.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setInvoices(invData || [])
    } catch (err: any) {
      console.error('Failed to fetch billing data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [agency?.id, agency?.plan])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  // ─── Handle upgrade ───────────────────────────────────────────────────────
  const handleUpgrade = async () => {
    if (!upgradeTarget || !agency?.id) return

    setActionLoading(true)
    try {
      // Deactivate current subscription
      if (subscription?.id) {
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', subscription.id)
      }

      // Create new subscription
      const plan = plans.find(p => p.id === upgradeTarget)!
      const renewalDate = new Date()
      renewalDate.setDate(renewalDate.getDate() + 30)

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          agency_id: agency.id,
          plan: upgradeTarget,
          billing_cycle: billingCycle,
          status: 'active',
          amount: billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly,
          currency: 'USD',
          renewal_date: renewalDate.toISOString().split('T')[0],
          provider: null,
          provider_ref: null,
        })

      if (error) throw error

      // Update agency plan
      await supabase
        .from('agencies')
        .update({
          plan: upgradeTarget,
          plan_status: 'active',
        })
        .eq('id', agency.id)

      toast.success(`Upgraded to ${plan.name} plan!`)
      setShowUpgradeModal(false)
      setUpgradeTarget('')
      fetchSubscription()
    } catch (err: any) {
      toast.error(err.message || 'Failed to upgrade plan')
    } finally {
      setActionLoading(false)
    }
  }

  // ─── Handle cancel ────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!subscription?.id) return

    setActionLoading(true)
    try {
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscription.id)

      await supabase
        .from('agencies')
        .update({ plan_status: 'cancelled' })
        .eq('id', agency?.id)

      toast.success('Plan cancelled. You can continue using until the end of your billing period.')
      setShowCancelModal(false)
      fetchSubscription()
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel plan')
    } finally {
      setActionLoading(false)
    }
  }

  const currentPlanId = subscription?.plan || agency?.plan || 'trial'
  const currentPlan = plans.find(p => p.id === currentPlanId) || plans[0]
  const isTrialing = subscription?.status === 'trialing' || agency?.plan_status === 'trial'

  const tabs = [
    { id: 'plans' as const, label: 'Plans', icon: <Icons.Star /> },
    { id: 'usage' as const, label: 'Usage', icon: <Icons.BarChart /> },
    { id: 'invoices' as const, label: 'Invoices', icon: <Icons.DollarSign /> },
    { id: 'payment' as const, label: 'Payment', icon: <Icons.CreditCard /> },
  ]

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 30% -10%, rgba(180, 130, 70, 0.03) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 90% 90%, rgba(195, 95, 70, 0.02) 0%, transparent 60%),
          radial-gradient(ellipse 30% 30% at 10% 60%, rgba(110, 140, 100, 0.02) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Billing & Plans
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0', fontWeight: 500 }}>
            {loading ? 'Loading...' : 'Manage your subscription, view usage, and download invoices'}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ color: 'var(--color-ochre)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Icons.Loader /></div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading billing information...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)' }}>
            <p style={{ fontSize: 14, color: '#DC2626', marginBottom: 16 }}>{error}</p>
            <button onClick={fetchSubscription} style={{ padding: '10px 20px', borderRadius: 12, background: 'var(--color-espresso)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Current Plan Banner */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(20px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)', marginBottom: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 16, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(180, 130, 70, 0.04)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'var(--color-espresso)', color: 'var(--color-ochre)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icons.Star />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                      {currentPlan.name} Plan
                    </h2>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 10px', borderRadius: 100,
                      fontSize: 11, fontWeight: 600,
                      background: isTrialing ? 'rgba(59, 130, 246, 0.08)' : 'rgba(110, 140, 100, 0.08)',
                      color: isTrialing ? '#3B82F6' : 'var(--color-sage)',
                      border: isTrialing ? '1px solid rgba(59, 130, 246, 0.15)' : '1px solid rgba(110, 140, 100, 0.15)',
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: isTrialing ? '#3B82F6' : 'var(--color-sage)',
                        animation: 'pulseGlow 2s ease-in-out infinite',
                      }} />
                      {isTrialing ? 'Trial' : 'Active'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                    {isTrialing ? 'Free trial' : `$${subscription?.amount || currentPlan.priceMonthly}/${subscription?.billing_cycle || 'month'}`}
                  </p>
                  {subscription?.renewal_date && (
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                      Renews {new Date(subscription.renewal_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 1 }}>
                <button
                  onClick={() => setShowCancelModal(true)}
                  style={{
                    padding: '10px 18px', fontSize: 13, fontWeight: 600,
                    color: 'var(--text-secondary)', background: 'var(--bg-hover)',
                    border: '1px solid var(--border-secondary)', borderRadius: 14,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                >
                  Cancel Plan
                </button>
                <button
                  onClick={() => { setShowUpgradeModal(true); setUpgradeTarget(currentPlanId === 'starter' ? 'professional' : 'enterprise') }}
                  style={{
                    padding: '10px 18px', fontSize: 13, fontWeight: 700,
                    color: 'var(--color-cream)', background: 'var(--color-espresso)',
                    border: 'none', borderRadius: 14, cursor: 'pointer',
                    transition: 'all 0.2s ease', boxShadow: 'var(--shadow-md)',
                  }}
                >
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 18px', fontSize: 13, fontWeight: 600,
                    color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                    border: activeTab === tab.id ? '1px solid var(--border-primary)' : '1px solid transparent',
                    borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Plans Tab */}
            {activeTab === 'plans' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    background: 'var(--bg-secondary)', borderRadius: 16,
                    border: '1px solid var(--border-primary)', padding: 4,
                  }}>
                    <button onClick={() => setBillingCycle('monthly')}
                      style={{
                        padding: '10px 24px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 600,
                        background: billingCycle === 'monthly' ? 'var(--color-espresso)' : 'transparent',
                        color: billingCycle === 'monthly' ? 'var(--color-cream)' : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                      }}
                    >Monthly</button>
                    <button onClick={() => setBillingCycle('yearly')}
                      style={{
                        padding: '10px 24px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 600,
                        background: billingCycle === 'yearly' ? 'var(--color-espresso)' : 'transparent',
                        color: billingCycle === 'yearly' ? 'var(--color-cream)' : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                      }}
                    >Yearly</button>
                  </div>
                </div>

                <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {plans.map(plan => {
                    const isCurrent = plan.id === currentPlanId
                    const isTrialPlan = plan.id === 'starter' && isTrialing
                    return (
                      <div key={plan.id} style={{
                        background: isCurrent ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                        backdropFilter: 'blur(16px)', borderRadius: 24,
                        border: `1px solid ${plan.popular ? plan.borderGlow : 'var(--border-primary)'}`,
                        boxShadow: plan.popular ? `0 8px 40px ${plan.borderGlow}` : 'var(--shadow-md)',
                        padding: 28, position: 'relative', overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)',
                      }}>
                        {plan.popular && (
                          <div style={{
                            position: 'absolute', top: 16, right: 16,
                            padding: '4px 12px', borderRadius: 100,
                            fontSize: 11, fontWeight: 700,
                            background: 'var(--color-ochre)', color: 'var(--color-cream)',
                            letterSpacing: '0.02em',
                          }}>Most Popular</div>
                        )}
                        <div style={{ marginBottom: 20 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 14,
                            background: plan.accentBg, color: plan.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                          }}>
                            {plan.id === 'starter' ? <Icons.Zap /> : plan.id === 'professional' ? <Icons.Star /> : <Icons.Shield />}
                          </div>
                          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{plan.name}</h3>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{plan.description}</p>
                        </div>
                        <div style={{ marginBottom: 24 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                            <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                              ${billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                            </span>
                            <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                          </div>
                          {billingCycle === 'yearly' && (
                            <p style={{ fontSize: 11, color: 'var(--color-sage)', margin: '4px 0 0', fontWeight: 600 }}>
                              Save ${plan.priceMonthly * 12 - plan.priceYearly}/yr
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (!isCurrent && !isTrialPlan) {
                              setUpgradeTarget(plan.id)
                              setShowUpgradeModal(true)
                            }
                          }}
                          style={{
                            width: '100%', padding: '12px 16px', fontSize: 14, fontWeight: 700,
                            color: isCurrent || isTrialPlan ? 'var(--text-secondary)' : 'var(--color-cream)',
                            background: isCurrent || isTrialPlan ? 'var(--bg-hover)' : 'var(--color-espresso)',
                            border: isCurrent || isTrialPlan ? '1px solid var(--border-secondary)' : 'none',
                            borderRadius: 14, cursor: isCurrent || isTrialPlan ? 'default' : 'pointer',
                            transition: 'all 0.2s ease', marginBottom: 24,
                          }}
                        >
                          {isCurrent ? 'Current Plan' : isTrialPlan ? 'Trial Plan' : `Upgrade to ${plan.name}`}
                        </button>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {plan.features.map((feature, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {feature.included ? (
                                <span style={{ color: 'var(--color-sage)', display: 'flex' }}><Icons.CheckCircle /></span>
                              ) : (
                                <span style={{ color: 'var(--text-tertiary)', opacity: 0.4, display: 'flex' }}><Icons.X /></span>
                              )}
                              <span style={{
                                fontSize: 12, fontWeight: 500,
                                color: feature.included ? 'var(--text-primary)' : 'var(--text-tertiary)',
                                opacity: feature.included ? 1 : 0.5,
                              }}>{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Usage Tab */}
            {activeTab === 'usage' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Leads', ...usageData.leads, icon: <Icons.Users />, color: 'var(--color-ochre)' },
                  { label: 'Properties', ...usageData.properties, icon: <Icons.MapPin />, color: 'var(--color-terracotta)' },
                  { label: 'Active Deals', ...usageData.deals, icon: <Icons.BarChart />, color: '#3B82F6' },
                  { label: 'Team Members', ...usageData.users, icon: <Icons.Users />, color: 'var(--color-sage)' },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                    borderRadius: 20, padding: 20, border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-md)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 12, background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {item.used} / {item.limit === Infinity ? '∞' : item.limit}
                      </span>
                    </div>
                    <div style={{ height: 8, borderRadius: 100, background: 'var(--bg-hover)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 100,
                        width: `${Math.min(100, item.percentage)}%`,
                        background: item.percentage > 80 ? '#DC2626' : item.percentage > 60 ? '#D9AF28' : item.color,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '6px 0 0', fontWeight: 500 }}>
                      {item.percentage}% used · {item.limit === Infinity ? 'Unlimited' : `${Math.max(0, item.limit - item.used)} remaining`}
                    </p>
                  </div>
                ))}
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 16, padding: 16, border: '1px solid var(--border-secondary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icons.Clock />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Billing period: {subscription?.billing_cycle === 'yearly' ? 'Annual' : 'Monthly'}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                      {subscription?.renewal_date
                        ? `Renews on ${new Date(subscription.renewal_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                        : 'No renewal date set'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }} className="invoice-summary">
                  {[
                    { label: 'Next Payment', value: subscription?.amount ? `$${subscription.amount}` : '$0', sub: subscription?.renewal_date ? new Date(subscription.renewal_date).toLocaleDateString() : 'N/A', icon: <Icons.Calendar />, accent: 'var(--color-ochre)' },
                    { label: 'Total Spent', value: `$${invoices.reduce((s, i) => s + (i.amount || 0), 0)}`, sub: `${invoices.length} invoices`, icon: <Icons.DollarSign />, accent: 'var(--color-sage)' },
                    { label: 'Plan', value: getPlanName(currentPlanId), sub: subscription?.billing_cycle || 'monthly', icon: <Icons.CreditCard />, accent: '#3B82F6' },
                    { label: 'Status', value: subscription?.status || 'N/A', sub: isTrialing ? 'Trial period' : 'Active', icon: <Icons.Shield />, accent: 'var(--color-terracotta)' },
                  ].map((card, idx) => (
                    <div key={idx} style={{
                      background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                      borderRadius: 20, padding: 16, border: '1px solid var(--border-primary)',
                      boxShadow: 'var(--shadow-md)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{card.label}</span>
                        <span style={{ color: card.accent }}>{card.icon}</span>
                      </div>
                      <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', letterSpacing: '-0.02em' }}>{card.value}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0, fontWeight: 500 }}>{card.sub}</p>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                  borderRadius: 20, border: '1px solid var(--border-primary)',
                  boxShadow: 'var(--shadow-md)', overflow: 'hidden',
                }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 80px', gap: 12, padding: '14px 20px',
                    background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)',
                    fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    <div>Invoice</div><div>Date</div><div>Plan</div><div>Amount</div><div></div>
                  </div>
                  {invoices.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>No invoices yet</p>
                    </div>
                  ) : (
                    invoices.map((inv, idx) => (
                      <div key={inv.id || idx} style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 80px', gap: 12, padding: '14px 20px', alignItems: 'center',
                        borderBottom: idx < invoices.length - 1 ? '1px solid var(--border-secondary)' : 'none',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>INV-{inv.id?.toString().slice(0, 8) || 'N/A'}</span>
                          <span style={{
                            padding: '3px 8px', borderRadius: 100, fontSize: 10, fontWeight: 600,
                            background: inv.status === 'active' || inv.status === 'trialing' ? 'rgba(110, 140, 100, 0.08)' : 'rgba(217, 175, 40, 0.08)',
                            color: inv.status === 'active' || inv.status === 'trialing' ? 'var(--color-sage)' : '#D9AF28',
                          }}>{inv.status}</span>
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{getPlanName(inv.plan)} {inv.billing_cycle}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {inv.amount === 0 ? 'Free' : `$${inv.amount}`}
                        </span>
                        <button style={{
                          padding: '8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                          color: 'var(--text-secondary)', background: 'var(--bg-hover)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}><Icons.Download /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>Payment Method</h3>
                    <button style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '8px 14px', fontSize: 12, fontWeight: 600,
                      color: 'var(--color-cream)', background: 'var(--color-espresso)',
                      border: 'none', borderRadius: 12, cursor: 'pointer',
                    }}><Icons.Plus /> Add Card</button>
                  </div>
                  <div style={{
                    background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                    borderRadius: 20, padding: 24, border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-md)', textAlign: 'center',
                  }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--text-tertiary)' }}>
                      <Icons.CreditCard />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>No payment method added</p>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>Add a card to manage your subscription payments</p>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.04)', borderRadius: 16,
                  padding: 16, border: '1px solid rgba(59, 130, 246, 0.1)',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <Icons.Shield />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Secure Payments</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      Payment processing coming soon. Your data is encrypted and stored securely.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }} onClick={() => setShowUpgradeModal(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} />
          <div style={{
            position: 'relative', background: 'var(--bg-secondary)', backdropFilter: 'blur(24px)',
            borderRadius: 24, border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-lg)', padding: 28, maxWidth: 500, width: '100%',
            animation: 'modalIn 0.3s ease',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
              Upgrade to {getPlanName(upgradeTarget)}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.5 }}>
              You'll get access to more features and higher limits immediately.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowUpgradeModal(false)}
                style={{
                  flex: 1, padding: '12px 16px', fontSize: 13, fontWeight: 600,
                  color: 'var(--text-secondary)', background: 'var(--bg-hover)',
                  border: '1px solid var(--border-secondary)', borderRadius: 14,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >Cancel</button>
              <button onClick={handleUpgrade} disabled={actionLoading}
                style={{
                  flex: 1, padding: '12px 16px', fontSize: 13, fontWeight: 700,
                  color: 'var(--color-cream)', background: 'var(--color-espresso)',
                  border: 'none', borderRadius: 14, cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.7 : 1, transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {actionLoading ? <><Icons.Loader /> Processing...</> : 'Confirm Upgrade'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }} onClick={() => setShowCancelModal(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} />
          <div style={{
            position: 'relative', background: 'var(--bg-secondary)', backdropFilter: 'blur(24px)',
            borderRadius: 24, border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-lg)', padding: 28, maxWidth: 480, width: '100%',
            animation: 'modalIn 0.3s ease',
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(220, 38, 38, 0.08)', color: '#DC2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Icons.AlertCircle />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
              Cancel Your Plan?
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.5 }}>
              You'll lose access to premium features at the end of your billing period. Your data will be retained for 30 days.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1, padding: '12px 16px', fontSize: 13, fontWeight: 600,
                  color: 'var(--text-secondary)', background: 'var(--bg-hover)',
                  border: '1px solid var(--border-secondary)', borderRadius: 14,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >Keep Plan</button>
              <button onClick={handleCancel} disabled={actionLoading}
                style={{
                  flex: 1, padding: '12px 16px', fontSize: 13, fontWeight: 700,
                  color: '#fff', background: '#DC2626',
                  border: 'none', borderRadius: 14, cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.7 : 1, transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {actionLoading ? <><Icons.Loader /> Processing...</> : 'Cancel Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(110, 140, 100, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(110, 140, 100, 0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 1024px) { .plans-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) { .plans-grid { grid-template-columns: 1fr !important; } .invoice-summary { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .invoice-summary { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

export default Billing