"use client";

import { useState, useMemo } from 'react'

const Icons = {
  Calculator: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
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
  TrendingDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  Percent: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Home: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  PieChart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Target: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Building: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/>
    </svg>
  ),
}

const sampleDeals = [
  {
    id: 1,
    title: 'Luxury Oceanfront Villa',
    location: 'Palm Jumeirah, Dubai',
    type: 'Villa',
    price: 2450000,
    marketValue: 2680000,
    rentPotential: 180000,
    appreciationRate: 8.5,
    expenses: { maintenance: 12000, tax: 24500, insurance: 8500, management: 14400 },
    comparables: [
      { address: 'Nearby Villa A', price: 2520000, sqft: 5600, date: '2025-03' },
      { address: 'Nearby Villa B', price: 2380000, sqft: 5400, date: '2025-04' },
      { address: 'Nearby Villa C', price: 2710000, sqft: 6000, date: '2025-02' },
    ],
    marketTrend: { yearly: 12.5, quarterly: 3.2, monthly: 0.8 },
    riskScore: 22,
  },
  {
    id: 2,
    title: 'Modern Downtown Penthouse',
    location: 'Downtown, Dubai',
    type: 'Penthouse',
    price: 1890000,
    marketValue: 1950000,
    rentPotential: 150000,
    appreciationRate: 6.2,
    expenses: { maintenance: 15000, tax: 18900, insurance: 7200, management: 12000 },
    comparables: [
      { address: 'Tower A Unit 42', price: 1920000, sqft: 4100, date: '2025-04' },
      { address: 'Tower B Unit 38', price: 1850000, sqft: 4000, date: '2025-03' },
    ],
    marketTrend: { yearly: 8.1, quarterly: 2.1, monthly: 0.5 },
    riskScore: 35,
  },
  {
    id: 3,
    title: 'Eco-Friendly Smart Home',
    location: 'Arabian Ranches, Dubai',
    type: 'House',
    price: 1250000,
    marketValue: 1320000,
    rentPotential: 95000,
    appreciationRate: 5.8,
    expenses: { maintenance: 8000, tax: 12500, insurance: 5200, management: 7600 },
    comparables: [
      { address: 'Green Community H1', price: 1280000, sqft: 3700, date: '2025-05' },
      { address: 'Green Community H2', price: 1190000, sqft: 3500, date: '2025-04' },
    ],
    marketTrend: { yearly: 7.2, quarterly: 1.8, monthly: 0.4 },
    riskScore: 28,
  },
]

const formatPrice = (price: number) => {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
  if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
  return `$${price}`
}

const formatPercent = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`

export const DealAnalyzer = () => {
  const [selectedDeal, setSelectedDeal] = useState(sampleDeals[0])
  const [activeSection, setActiveSection] = useState<'overview' | 'financials' | 'market' | 'risk'>('overview')

  // Financial calculations
  const financials = useMemo(() => {
    const d = selectedDeal
    const totalExpenses = d.expenses.maintenance + d.expenses.tax + d.expenses.insurance + d.expenses.management
    const netIncome = d.rentPotential - totalExpenses
    const capRate = (netIncome / d.price) * 100
    const grossRentMultiplier = d.price / d.rentPotential
    const cashOnCash = (netIncome / (d.price * 0.25)) * 100 // Assuming 25% down
    const equityGain = d.marketValue - d.price
    const totalReturn = ((netIncome + equityGain / 5) / d.price) * 100 // 5-year hold
    
    return {
      totalExpenses,
      netIncome,
      capRate,
      grossRentMultiplier,
      cashOnCash,
      equityGain,
      totalReturn,
      monthlyRent: d.rentPotential / 12,
      monthlyExpenses: totalExpenses / 12,
      monthlyCashFlow: netIncome / 12,
    }
  }, [selectedDeal])

  // Risk assessment
  const riskAssessment = useMemo(() => {
    const score = selectedDeal.riskScore
    const level = score <= 20 ? 'Low' : score <= 40 ? 'Moderate' : score <= 60 ? 'Medium' : 'High'
    const color = score <= 20 ? 'var(--color-sage)' : score <= 40 ? '#D9AF28' : score <= 60 ? '#F97316' : '#DC2626'
    const bg = score <= 20 ? 'rgba(110, 140, 100, 0.06)' : score <= 40 ? 'rgba(217, 175, 40, 0.06)' : score <= 60 ? 'rgba(249, 115, 22, 0.06)' : 'rgba(220, 38, 38, 0.06)'
    return { score, level, color, bg }
  }, [selectedDeal])

  const sections = [
    { id: 'overview' as const, label: 'Overview', icon: <Icons.Target /> },
    { id: 'financials' as const, label: 'Financials', icon: <Icons.DollarSign /> },
    { id: 'market' as const, label: 'Market', icon: <Icons.Activity /> },
    { id: 'risk' as const, label: 'Risk', icon: <Icons.Shield /> },
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 30% -10%, rgba(180, 130, 70, 0.03) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 90% 90%, rgba(195, 95, 70, 0.02) 0%, transparent 60%),
          radial-gradient(ellipse 30% 30% at 10% 60%, rgba(110, 140, 100, 0.02) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              Deal Analyzer
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0', fontWeight: 500 }}>
              Analyze ROI, market trends, and risk for your deals
            </p>
          </div>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 18px', fontSize: 13, fontWeight: 600,
            color: 'var(--text-secondary)', background: 'var(--bg-secondary)',
            backdropFilter: 'blur(12px)', border: '1px solid var(--border-primary)',
            borderRadius: 14, cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
          }}>
            <Icons.Download /> Export Report
          </button>
        </div>

        {/* Deal Selector */}
        <div style={{
          background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
          borderRadius: 20, padding: 16, border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-md)', marginBottom: 20,
          display: 'flex', gap: 12, overflowX: 'auto',
        }}>
          {sampleDeals.map(deal => (
            <button
              key={deal.id}
              onClick={() => setSelectedDeal(deal)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 18px', borderRadius: 14,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0,
                background: selectedDeal.id === deal.id ? 'var(--bg-primary)' : 'transparent',
                color: selectedDeal.id === deal.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: selectedDeal.id === deal.id ? 'var(--shadow-sm)' : 'none',
                border: selectedDeal.id === deal.id ? '1px solid var(--border-primary)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'var(--color-espresso)', color: 'var(--color-ochre)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
              }}>
                {deal.type.substring(0, 2)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 12, fontWeight: 700, margin: 0, color: 'inherit' }}>{deal.title}</p>
                <p style={{ fontSize: 10, fontWeight: 500, margin: '1px 0 0', color: 'var(--text-tertiary)' }}>{deal.location}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Asking Price', value: formatPrice(selectedDeal.price), icon: <Icons.DollarSign />, accent: 'var(--color-ochre)', accentBg: 'rgba(180, 130, 70, 0.08)', sub: `Market: ${formatPrice(selectedDeal.marketValue)}` },
            { label: 'Cap Rate', value: `${financials.capRate.toFixed(2)}%`, icon: <Icons.Percent />, accent: 'var(--color-sage)', accentBg: 'rgba(110, 140, 100, 0.08)', sub: financials.capRate >= 6 ? 'Excellent' : financials.capRate >= 4 ? 'Good' : 'Average' },
            { label: 'Monthly Cash Flow', value: formatPrice(financials.monthlyCashFlow), icon: <Icons.TrendingUp />, accent: '#3B82F6', accentBg: 'rgba(59, 130, 246, 0.08)', sub: financials.monthlyCashFlow > 0 ? 'Positive' : 'Negative' },
            { label: 'Risk Score', value: `${riskAssessment.score}/100`, icon: <Icons.Shield />, accent: riskAssessment.color, accentBg: riskAssessment.bg, sub: riskAssessment.level },
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 20, padding: 16, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 50, height: 50, borderRadius: '0 0 0 100%', background: stat.accentBg, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</span>
                <span style={{ color: stat.accent, display: 'flex' }}>{stat.icon}</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: stat.accent, margin: '0 0 2px', letterSpacing: '-0.02em' }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0, fontWeight: 500 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Section Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', fontSize: 13, fontWeight: 600,
                color: activeSection === section.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                background: activeSection === section.id ? 'var(--bg-secondary)' : 'transparent',
                border: activeSection === section.id ? '1px solid var(--border-primary)' : '1px solid transparent',
                borderRadius: 14, cursor: 'pointer',
                backdropFilter: activeSection === section.id ? 'blur(12px)' : 'none',
                boxShadow: activeSection === section.id ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeSection === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Deal Summary */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Home /> Property Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Property Type', value: selectedDeal.type },
                  { label: 'Location', value: selectedDeal.location, icon: <Icons.MapPin /> },
                  { label: 'Asking Price', value: formatPrice(selectedDeal.price) },
                  { label: 'Market Value', value: formatPrice(selectedDeal.marketValue) },
                  { label: 'Price Difference', value: `${formatPrice(selectedDeal.marketValue - selectedDeal.price)} ${selectedDeal.marketValue >= selectedDeal.price ? 'below market' : 'above market'}`, 
                    color: selectedDeal.marketValue >= selectedDeal.price ? 'var(--color-sage)' : '#DC2626' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {item.icon}
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: item.color || 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Trend Summary */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Activity /> Market Trends
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Yearly Appreciation', value: formatPercent(selectedDeal.marketTrend.yearly), positive: true },
                  { label: 'Quarterly Growth', value: formatPercent(selectedDeal.marketTrend.quarterly), positive: true },
                  { label: 'Monthly Trend', value: formatPercent(selectedDeal.marketTrend.monthly), positive: selectedDeal.marketTrend.monthly >= 0 },
                  { label: 'Projected 5-Year Value', value: formatPrice(selectedDeal.price * Math.pow(1 + selectedDeal.appreciationRate / 100, 5)), positive: true },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-secondary)' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {item.positive ? <Icons.TrendingUp /> : <Icons.TrendingDown />}
                      <span style={{ fontSize: 13, fontWeight: 600, color: item.positive ? 'var(--color-sage)' : '#DC2626' }}>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal Score Card */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)', gridColumn: '1 / -1',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Star /> Deal Score Breakdown
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Price vs Market', score: 92, color: 'var(--color-sage)', bg: 'rgba(110, 140, 100, 0.08)' },
                  { label: 'Cash Flow', score: financials.monthlyCashFlow > 0 ? 85 : 40, color: financials.monthlyCashFlow > 0 ? 'var(--color-sage)' : '#F97316', bg: financials.monthlyCashFlow > 0 ? 'rgba(110, 140, 100, 0.08)' : 'rgba(249, 115, 22, 0.08)' },
                  { label: 'Market Trend', score: 78, color: 'var(--color-ochre)', bg: 'rgba(180, 130, 70, 0.08)' },
                  { label: 'Risk Level', score: 100 - selectedDeal.riskScore, color: riskAssessment.color, bg: riskAssessment.bg },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    padding: 20, borderRadius: 16, textAlign: 'center',
                    background: item.bg, border: `1px solid ${item.color}20`,
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      border: `3px solid ${item.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 10px',
                    }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: item.color }}>{item.score}</span>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>out of 100</p>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 16, padding: '12px 16px',
                borderRadius: 14, background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Icons.Zap />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Overall Deal Rating: <strong style={{ color: 'var(--color-ochre)' }}>Strong Buy</strong> — 
                  This property is priced {formatPercent(((selectedDeal.marketValue - selectedDeal.price) / selectedDeal.price) * 100)} below market with strong appreciation potential.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Financials Tab */}
        {activeSection === 'financials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Income & Expenses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{
                background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
                boxShadow: 'var(--shadow-md)',
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icons.TrendingUp /> Income
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <FinancialRow label="Monthly Rent" value={formatPrice(financials.monthlyRent)} positive />
                  <FinancialRow label="Annual Gross Income" value={formatPrice(selectedDeal.rentPotential)} positive />
                  <div style={{ height: 1, background: 'var(--border-secondary)', margin: '4px 0' }} />
                  <FinancialRow label="Total Annual Income" value={formatPrice(selectedDeal.rentPotential)} positive bold />
                </div>
              </div>

              <div style={{
                background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
                boxShadow: 'var(--shadow-md)',
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icons.TrendingDown /> Expenses
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <FinancialRow label="Maintenance" value={formatPrice(selectedDeal.expenses.maintenance)} />
                  <FinancialRow label="Property Tax" value={formatPrice(selectedDeal.expenses.tax)} />
                  <FinancialRow label="Insurance" value={formatPrice(selectedDeal.expenses.insurance)} />
                  <FinancialRow label="Management Fee" value={formatPrice(selectedDeal.expenses.management)} />
                  <div style={{ height: 1, background: 'var(--border-secondary)', margin: '4px 0' }} />
                  <FinancialRow label="Total Annual Expenses" value={formatPrice(financials.totalExpenses)} negative bold />
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Calculator /> Key Investment Metrics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: 'Cap Rate', value: `${financials.capRate.toFixed(2)}%`, desc: 'Net income / Price', color: financials.capRate >= 6 ? 'var(--color-sage)' : 'var(--color-ochre)' },
                  { label: 'Cash-on-Cash Return', value: `${financials.cashOnCash.toFixed(2)}%`, desc: 'Annual pre-tax cash flow', color: financials.cashOnCash >= 8 ? 'var(--color-sage)' : 'var(--color-ochre)' },
                  { label: 'GRM', value: financials.grossRentMultiplier.toFixed(1), desc: 'Price / Gross rent', color: financials.grossRentMultiplier <= 15 ? 'var(--color-sage)' : '#D9AF28' },
                  { label: 'Total Return (5yr)', value: `${financials.totalReturn.toFixed(2)}%`, desc: 'Including equity gain', color: financials.totalReturn >= 10 ? 'var(--color-sage)' : 'var(--color-ochre)' },
                ].map((metric, idx) => (
                  <div key={idx} style={{
                    padding: 16, borderRadius: 16, textAlign: 'center',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                  }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>{metric.label}</p>
                    <p style={{ fontSize: 26, fontWeight: 700, color: metric.color, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{metric.value}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-tertiary)', margin: 0 }}>{metric.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Calendar /> Monthly Cash Flow Breakdown
              </h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, padding: '20px 0' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: 120, borderRadius: '12px 12px 0 0',
                    background: 'linear-gradient(180deg, var(--color-sage), rgba(110, 140, 100, 0.2))',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    padding: '8px', marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{formatPrice(financials.monthlyRent)}</span>
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Income</p>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: 80, borderRadius: '12px 12px 0 0',
                    background: 'linear-gradient(180deg, #DC2626, rgba(220, 38, 38, 0.2))',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    padding: '8px', marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{formatPrice(financials.monthlyExpenses)}</span>
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Expenses</p>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: 40, borderRadius: '12px 12px 0 0',
                    background: 'linear-gradient(180deg, var(--color-ochre), rgba(180, 130, 70, 0.2))',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    padding: '8px', marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{formatPrice(financials.monthlyCashFlow)}</span>
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Cash Flow</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Tab */}
        {activeSection === 'market' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Comparables */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Building /> Comparable Properties
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedDeal.comparables.map((comp, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 14,
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-tertiary)', flexShrink: 0,
                    }}>
                      <Icons.Home />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{comp.address}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{comp.sqft.toLocaleString()} sqft · Sold {comp.date}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{formatPrice(comp.price)}</p>
                      <p style={{ fontSize: 10, color: comp.price < selectedDeal.price ? 'var(--color-sage)' : '#DC2626', margin: '2px 0 0', fontWeight: 600 }}>
                        {formatPercent(((selectedDeal.price - comp.price) / comp.price) * 100)} vs subject
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Trends */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.BarChart /> Market Trend Analysis
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { label: 'Yearly Growth', value: formatPercent(selectedDeal.marketTrend.yearly), sub: 'Last 12 months', positive: true },
                  { label: 'Quarterly Growth', value: formatPercent(selectedDeal.marketTrend.quarterly), sub: 'Last 3 months', positive: true },
                  { label: 'Monthly Growth', value: formatPercent(selectedDeal.marketTrend.monthly), sub: 'Last 30 days', positive: selectedDeal.marketTrend.monthly >= 0 },
                ].map((trend, idx) => (
                  <div key={idx} style={{
                    padding: 20, borderRadius: 16, textAlign: 'center',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                      {trend.positive ? <Icons.TrendingUp /> : <Icons.TrendingDown />}
                    </div>
                    <p style={{ fontSize: 22, fontWeight: 700, color: trend.positive ? 'var(--color-sage)' : '#DC2626', margin: '0 0 4px', letterSpacing: '-0.02em' }}>{trend.value}</p>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{trend.label}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{trend.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Appreciation Projection */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.TrendingUp /> 5-Year Appreciation Projection
              </h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, padding: '20px 0', height: 200 }}>
                {Array.from({ length: 5 }, (_, i) => {
                  const yearValue = selectedDeal.price * Math.pow(1 + selectedDeal.appreciationRate / 100, i + 1)
                  const maxValue = selectedDeal.price * Math.pow(1 + selectedDeal.appreciationRate / 100, 5)
                  const heightPercent = (yearValue / maxValue) * 100
                  return (
                    <div key={i} style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{formatPrice(yearValue)}</span>
                      <div style={{
                        width: '100%', height: `${heightPercent}%`,
                        borderRadius: '12px 12px 0 0',
                        background: `linear-gradient(180deg, var(--color-ochre), rgba(180, 130, 70, 0.2))`,
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                        paddingTop: 8, minHeight: 40,
                      }} />
                      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', margin: '6px 0 0' }}>Year {i + 1}</p>
                    </div>
                  )
                })}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', margin: '8px 0 0', fontWeight: 500 }}>
                Based on {selectedDeal.appreciationRate}% annual appreciation rate
              </p>
            </div>
          </div>
        )}

        {/* Risk Tab */}
        {activeSection === 'risk' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Risk Score */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 32, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                border: `4px solid ${riskAssessment.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16, position: 'relative',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 36, fontWeight: 700, color: riskAssessment.color, margin: 0, letterSpacing: '-0.02em' }}>
                    {riskAssessment.score}
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', margin: 0 }}>of 100</p>
                </div>
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: riskAssessment.color, margin: '0 0 4px' }}>
                {riskAssessment.level} Risk
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, maxWidth: 300, lineHeight: 1.5 }}>
                Lower scores indicate safer investments with stable returns and market conditions.
              </p>
            </div>

            {/* Risk Factors */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Shield /> Risk Factors
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { factor: 'Market Volatility', level: 'Low', score: 15, color: 'var(--color-sage)', bg: 'rgba(110, 140, 100, 0.06)' },
                  { factor: 'Location Stability', level: 'Very Low', score: 8, color: 'var(--color-sage)', bg: 'rgba(110, 140, 100, 0.06)' },
                  { factor: 'Property Condition', level: 'Moderate', score: 35, color: '#D9AF28', bg: 'rgba(217, 175, 40, 0.06)' },
                  { factor: 'Tenant Demand', level: 'Low', score: 18, color: 'var(--color-sage)', bg: 'rgba(110, 140, 100, 0.06)' },
                  { factor: 'Financing Risk', level: 'Low', score: 20, color: 'var(--color-sage)', bg: 'rgba(110, 140, 100, 0.06)' },
                ].map((factor, idx) => (
                  <div key={idx} style={{
                    padding: '14px 16px', borderRadius: 14,
                    background: factor.bg, border: `1px solid ${factor.color}20`,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{factor.factor}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{factor.level} Risk</p>
                    </div>
                    <div style={{ width: 60, textAlign: 'right' }}>
                      <div style={{ height: 4, borderRadius: 100, background: 'var(--bg-hover)', overflow: 'hidden', marginBottom: 2 }}>
                        <div style={{ height: '100%', borderRadius: 100, width: `${factor.score}%`, background: factor.color }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: factor.color }}>{factor.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mitigation Strategies */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)', gridColumn: '1 / -1',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.CheckCircle /> Risk Mitigation Strategies
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { title: 'Diversify Portfolio', desc: 'Spread investments across different property types and locations to reduce exposure.', icon: <Icons.PieChart /> },
                  { title: 'Thorough Inspections', desc: 'Conduct comprehensive property inspections before purchase to identify issues.', icon: <Icons.Shield /> },
                  { title: 'Conservative Financing', desc: 'Maintain a healthy debt-to-equity ratio with fixed-rate mortgages.', icon: <Icons.DollarSign /> },
                ].map((strategy, idx) => (
                  <div key={idx} style={{
                    padding: 16, borderRadius: 16,
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(180, 130, 70, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ochre)', marginBottom: 10 }}>
                      {strategy.icon}
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>{strategy.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{strategy.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Financial Row Component ──────────────────────────────────────────────────
const FinancialRow = ({ label, value, positive, negative, bold }: {
  label: string
  value: string
  positive?: boolean
  negative?: boolean
  bold?: boolean
}) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px', borderRadius: 12,
    background: bold ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
    border: bold ? '1px solid var(--border-primary)' : '1px solid var(--border-secondary)',
  }}>
    <span style={{ fontSize: 12, fontWeight: bold ? 600 : 500, color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{
      fontSize: 13, fontWeight: bold ? 700 : 600,
      color: positive ? 'var(--color-sage)' : negative ? '#DC2626' : 'var(--text-primary)',
    }}>
      {value}
    </span>
  </div>
)

export default DealAnalyzer