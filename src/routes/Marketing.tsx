"use client";

import { useState } from 'react'

const Icons = {
  Zap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Bot: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="14" rx="2"/><circle cx="12" cy="16" r="1"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  MousePointer: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Play: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Pause: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Target: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Image: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
}

const campaigns = [
  {
    id: 1,
    name: 'Luxury Property Newsletter',
    type: 'Email Sequence',
    status: 'active',
    audience: 'High-net-worth leads',
    sent: 450,
    opened: 312,
    clicked: 98,
    converted: 12,
    lastSent: '2 hours ago',
    schedule: 'Every Monday & Thursday',
    subject: 'Exclusive Luxury Listings This Week 🏠',
    preview: 'Dear {{firstName}}, discover our handpicked luxury properties in Palm Jumeirah...',
  },
  {
    id: 2,
    name: 'New Lead Welcome Series',
    type: 'Drip Campaign',
    status: 'active',
    audience: 'All new leads',
    sent: 1280,
    opened: 896,
    clicked: 445,
    converted: 67,
    lastSent: '30 minutes ago',
    schedule: 'Triggered on lead creation',
    subject: 'Welcome to RevaCore — Let\'s Find Your Dream Home',
    preview: 'Hi {{firstName}}, thank you for your interest! Our team is ready to help...',
  },
  {
    id: 3,
    name: 'Abandoned Inquiry Follow-up',
    type: 'Automation',
    status: 'active',
    audience: 'Leads with no response',
    sent: 320,
    opened: 256,
    clicked: 142,
    converted: 28,
    lastSent: '1 hour ago',
    schedule: '24h after no response',
    subject: 'Still Interested in {{propertyName}}?',
    preview: 'We noticed you viewed {{propertyName}}. Can we schedule a viewing?...',
  },
  {
    id: 4,
    name: 'Monthly Market Report',
    type: 'Newsletter',
    status: 'draft',
    audience: 'All subscribers',
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    lastSent: 'Never',
    schedule: '1st of every month',
    subject: 'Dubai Real Estate Market Report — June 2025',
    preview: 'Stay informed with the latest market trends, price movements, and opportunities...',
  },
  {
    id: 5,
    name: 'Property Price Drop Alert',
    type: 'Automation',
    status: 'paused',
    audience: 'Saved property leads',
    sent: 85,
    opened: 72,
    clicked: 45,
    converted: 8,
    lastSent: '3 days ago',
    schedule: 'On price change',
    subject: 'Price Drop Alert: {{propertyName}}',
    preview: 'Great news! {{propertyName}} has been reduced by {{discountPercent}}%...',
  },
]

const aiTemplates = [
  {
    id: 1,
    title: 'Property Listing Description',
    description: 'Generate compelling property descriptions with key features highlighted',
    category: 'Content',
    usageCount: 234,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Follow-up Email',
    description: 'Personalized follow-up emails based on lead behavior and interests',
    category: 'Email',
    usageCount: 567,
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Social Media Caption',
    description: 'Engaging captions for Instagram, Facebook, and LinkedIn property posts',
    category: 'Social',
    usageCount: 189,
    rating: 4.6,
  },
  {
    id: 4,
    title: 'Market Analysis Summary',
    description: 'AI-generated market insights tailored to specific neighborhoods',
    category: 'Content',
    usageCount: 156,
    rating: 4.7,
  },
  {
    id: 5,
    title: 'Video Script',
    description: 'Scripts for property walkthrough videos and virtual tours',
    category: 'Content',
    usageCount: 98,
    rating: 4.5,
  },
  {
    id: 6,
    title: 'SMS Campaign',
    description: 'Short, impactful text messages for time-sensitive offers',
    category: 'SMS',
    usageCount: 312,
    rating: 4.4,
  },
]

const performanceMetrics = {
  totalEmailsSent: 2355,
  openRate: 68.4,
  clickRate: 32.1,
  conversionRate: 5.2,
  revenueAttributed: 245000,
  costPerLead: 12.5,
  roi: 320,
  avgResponseTime: '4.2 hours',
}

const aiSuggestions = [
  { id: 1, text: 'Send follow-up email to Sarah Williams — she viewed Beachfront Studio twice this week', priority: 'high', impact: 'Likely to convert' },
  { id: 2, text: 'Create a price drop campaign for properties listed over 60 days', priority: 'medium', impact: 'Could re-engage 12 leads' },
  { id: 3, text: 'Schedule market report newsletter for Friday 9 AM — best open time', priority: 'low', impact: 'Optimal engagement window' },
  { id: 4, text: 'Add luxury property video tour links to the next drip email sequence', priority: 'high', impact: 'Increases click rate by 35%' },
]

type TabId = 'campaigns' | 'templates' | 'analytics' | 'suggestions'

export const AIMarketing = () => {
  const [activeTab, setActiveTab] = useState<TabId>('campaigns')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [promptInput, setPromptInput] = useState('')

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'campaigns', label: 'Campaigns', icon: <Icons.Send /> },
    { id: 'templates', label: 'AI Templates', icon: <Icons.Bot /> },
    { id: 'analytics', label: 'Analytics', icon: <Icons.BarChart /> },
    { id: 'suggestions', label: 'AI Suggestions', icon: <Icons.Zap /> },
  ]

  const handleGenerate = () => {
    setIsGenerating(true)
    setGeneratedContent('')
    setTimeout(() => {
      setGeneratedContent(
        `✨ **Stunning 3-Bedroom Villa with Panoramic Views**\n\n` +
        `Discover luxury living at its finest in this beautifully appointed 3-bedroom villa nestled in the heart of Palm Jumeirah. ` +
        `Floor-to-ceiling windows flood the open-plan living space with natural light, while the gourmet kitchen features premium Miele appliances and quartz countertops.\n\n` +
        `**Key Features:**\n` +
        `• 3 Bedrooms | 4 Bathrooms | 3,200 sqft\n` +
        `• Private infinity pool with ocean views\n` +
        `• Smart home automation throughout\n` +
        `• Covered parking for 2 vehicles\n` +
        `• 24/7 security and concierge service\n\n` +
        `**Location Highlights:**\n` +
        `• 5 minutes to Nakheel Mall\n` +
        `• 10 minutes to Atlantis The Royal\n` +
        `• Easy access to Sheikh Zayed Road\n\n` +
        `Priced at $1,850,000 — exceptional value for this prestigious community. Contact us today to schedule a private viewing.`
      )
      setIsGenerating(false)
    }, 1500)
  }

  const formatNumber = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(1)}K` : String(num)

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
              AI Marketing
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0', fontWeight: 500 }}>
              Automate campaigns, generate content, and nurture leads with AI
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', fontSize: 13, fontWeight: 700,
              color: 'var(--color-cream)', background: 'var(--color-espresso)',
              border: 'none', borderRadius: 14, cursor: 'pointer',
              transition: 'all 0.2s ease', boxShadow: 'var(--shadow-md)',
            }}>
              <Icons.Plus /> Create Campaign
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'active').length, sub: 'running now', icon: <Icons.Send />, accent: 'var(--color-ochre)', accentBg: 'rgba(180, 130, 70, 0.08)' },
            { label: 'Emails Sent', value: formatNumber(performanceMetrics.totalEmailsSent), sub: 'this month', icon: <Icons.Mail />, accent: '#3B82F6', accentBg: 'rgba(59, 130, 246, 0.08)' },
            { label: 'Open Rate', value: `${performanceMetrics.openRate}%`, sub: 'avg across campaigns', icon: <Icons.Eye />, accent: 'var(--color-sage)', accentBg: 'rgba(110, 140, 100, 0.08)' },
            { label: 'Revenue Attributed', value: `$${(performanceMetrics.revenueAttributed / 1000).toFixed(0)}K`, sub: `${performanceMetrics.roi}% ROI`, icon: <Icons.DollarSign />, accent: '#B8860B', accentBg: 'rgba(184, 134, 11, 0.08)' },
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
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', letterSpacing: '-0.02em' }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0, fontWeight: 500 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', fontSize: 13, fontWeight: 600,
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--border-primary)' : '1px solid transparent',
                borderRadius: 14, cursor: 'pointer',
                backdropFilter: activeTab === tab.id ? 'blur(12px)' : 'none',
                boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {campaigns.map(campaign => (
              <div key={campaign.id} style={{
                background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                borderRadius: 20, border: '1px solid var(--border-primary)',
                boxShadow: 'var(--shadow-md)', overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}>
                <div style={{ height: 3, width: '100%', background: campaign.status === 'active' ? 'var(--color-sage)' : campaign.status === 'paused' ? '#D9AF28' : 'var(--text-tertiary)' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 14,
                        background: campaign.status === 'active' ? 'rgba(110, 140, 100, 0.08)' : 'var(--bg-hover)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: campaign.status === 'active' ? 'var(--color-sage)' : 'var(--text-tertiary)',
                      }}>
                        {campaign.type === 'Email Sequence' || campaign.type === 'Newsletter' ? <Icons.Mail /> :
                         campaign.type === 'Drip Campaign' ? <Icons.Send /> : <Icons.Bot />}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', letterSpacing: '-0.01em' }}>
                          {campaign.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '2px 10px', borderRadius: 100,
                            fontSize: 10, fontWeight: 600,
                            background: campaign.status === 'active' ? 'rgba(110, 140, 100, 0.08)' : campaign.status === 'paused' ? 'rgba(217, 175, 40, 0.08)' : 'var(--bg-hover)',
                            color: campaign.status === 'active' ? 'var(--color-sage)' : campaign.status === 'paused' ? '#D9AF28' : 'var(--text-tertiary)',
                            border: `1px solid ${campaign.status === 'active' ? 'rgba(110, 140, 100, 0.15)' : campaign.status === 'paused' ? 'rgba(217, 175, 40, 0.15)' : 'var(--border-secondary)'}`,
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: campaign.status === 'active' ? 'var(--color-sage)' : '#D9AF28' }} />
                            {campaign.status}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{campaign.type}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>·</span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{campaign.audience}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {campaign.status === 'active' ? (
                        <button style={{
                          padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-secondary)',
                          background: 'var(--bg-hover)', cursor: 'pointer', color: 'var(--text-secondary)',
                          display: 'flex', transition: 'all 0.2s ease',
                        }}>
                          <Icons.Pause />
                        </button>
                      ) : campaign.status === 'paused' ? (
                        <button style={{
                          padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-secondary)',
                          background: 'var(--bg-hover)', cursor: 'pointer', color: 'var(--color-sage)',
                          display: 'flex', transition: 'all 0.2s ease',
                        }}>
                          <Icons.Play />
                        </button>
                      ) : null}
                      <button style={{
                        padding: '8px 12px', borderRadius: 10,
                        background: 'var(--color-espresso)', border: 'none', cursor: 'pointer',
                        color: 'var(--color-cream)', display: 'flex', transition: 'all 0.2s ease',
                      }}>
                        <Icons.Send />
                      </button>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12,
                    padding: '14px 16px', borderRadius: 14,
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                    marginBottom: 12,
                  }}>
                    {[
                      { label: 'Sent', value: formatNumber(campaign.sent) },
                      { label: 'Opened', value: `${campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(0) : 0}%` },
                      { label: 'Clicked', value: `${campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(0) : 0}%` },
                      { label: 'Converted', value: campaign.converted },
                      { label: 'Last Sent', value: campaign.lastSent },
                    ].map((metric, idx) => (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 10, color: 'var(--text-tertiary)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>{metric.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Email Preview */}
                  <div style={{
                    padding: '12px 16px', borderRadius: 14,
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subject:</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{campaign.subject}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Schedule:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icons.Clock />
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{campaign.schedule}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0', fontStyle: 'italic' }}>
                      {campaign.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Templates Tab */}
        {activeTab === 'templates' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            {/* Templates Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {aiTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => { setSelectedTemplate(template.id); setGeneratedContent('') }}
                  style={{
                    background: selectedTemplate === template.id ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: 20, padding: 18, cursor: 'pointer',
                    border: selectedTemplate === template.id ? '2px solid var(--color-ochre)' : '1px solid var(--border-primary)',
                    boxShadow: selectedTemplate === template.id ? `0 8px 32px rgba(180, 130, 70, 0.12)` : 'var(--shadow-md)',
                    transition: 'all 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 12,
                      background: 'rgba(180, 130, 70, 0.08)', color: 'var(--color-ochre)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {template.category === 'Content' ? <Icons.FileText /> :
                       template.category === 'Email' ? <Icons.Mail /> :
                       template.category === 'Social' ? <Icons.Globe /> :
                       template.category === 'SMS' ? <Icons.Send /> : <Icons.Image />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icons.Star />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{template.rating}</span>
                    </div>
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{template.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.4 }}>{template.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                      background: 'var(--bg-hover)', color: 'var(--text-secondary)',
                    }}>
                      {template.category}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{template.usageCount} uses</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Generator Panel */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(20px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-lg)', position: 'sticky', top: 32,
              maxHeight: 'calc(100vh - 64px)', overflow: 'auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--color-ochre), var(--color-terracotta))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff',
                }}>
                  <Icons.Zap />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                    AI Content Generator
                  </h3>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                    {selectedTemplate ? aiTemplates.find(t => t.id === selectedTemplate)?.title : 'Select a template'}
                  </p>
                </div>
              </div>

              {selectedTemplate ? (
                <>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Prompt
                  </label>
                  <textarea
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Describe what you want to generate... e.g., 'Write a property description for a 3-bedroom villa in Palm Jumeirah with ocean views'"
                    rows={4}
                    style={{
                      width: '100%', padding: '12px 14px', fontSize: 13, fontWeight: 500,
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                      borderRadius: 14, color: 'var(--text-primary)', outline: 'none',
                      resize: 'vertical', fontFamily: 'inherit',
                      transition: 'border-color 0.2s ease', boxSizing: 'border-box',
                      marginBottom: 12,
                    }}
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !promptInput}
                    style={{
                      width: '100%', padding: '12px', fontSize: 13, fontWeight: 700,
                      color: '#fff', borderRadius: 14, border: 'none', cursor: isGenerating || !promptInput ? 'not-allowed' : 'pointer',
                      background: isGenerating || !promptInput ? 'var(--border-secondary)' : 'linear-gradient(135deg, var(--color-ochre), var(--color-terracotta))',
                      marginBottom: 16, transition: 'all 0.2s ease',
                    }}
                  >
                    {isGenerating ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Icons.Refresh /> Generating...
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Icons.Zap /> Generate Content
                      </span>
                    )}
                  </button>

                  {generatedContent && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Generated Content
                        </span>
                        <button style={{
                          padding: '4px 10px', fontSize: 11, fontWeight: 600,
                          color: 'var(--text-secondary)', background: 'var(--bg-hover)',
                          border: '1px solid var(--border-secondary)', borderRadius: 8,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          <Icons.Copy /> Copy
                        </button>
                      </div>
                      <div style={{
                        padding: '14px', borderRadius: 14,
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)',
                        fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
                        whiteSpace: 'pre-wrap', maxHeight: 300, overflow: 'auto',
                      }}>
                        {generatedContent}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px', color: 'var(--text-tertiary)',
                  }}>
                    <Icons.Bot />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                    Select a Template
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
                    Choose an AI template from the left panel to start generating content
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Performance Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { label: 'Open Rate', value: `${performanceMetrics.openRate}%`, target: '65%', icon: <Icons.Eye />, color: 'var(--color-sage)' },
                { label: 'Click Rate', value: `${performanceMetrics.clickRate}%`, target: '25%', icon: <Icons.MousePointer />, color: 'var(--color-ochre)' },
                { label: 'Conversion Rate', value: `${performanceMetrics.conversionRate}%`, target: '3%', icon: <Icons.Target />, color: '#3B82F6' },
                { label: 'Avg Response Time', value: performanceMetrics.avgResponseTime, target: '< 6h', icon: <Icons.Clock />, color: 'var(--color-terracotta)' },
              ].map((metric, idx) => (
                <div key={idx} style={{
                  background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                  borderRadius: 20, padding: 18, border: '1px solid var(--border-primary)',
                  boxShadow: 'var(--shadow-md)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: `${metric.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: metric.color }}>
                      {metric.icon}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{metric.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 26, fontWeight: 700, color: metric.color, letterSpacing: '-0.02em' }}>{metric.value}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Target: {metric.target}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Campaign Performance Table */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.BarChart /> Campaign Performance
              </h3>
              <div style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                      {['Campaign', 'Sent', 'Opens', 'Clicks', 'Conv.', 'ROI', 'Status'].map((header, i) => (
                        <th key={i} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left' }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{formatNumber(c.sent)}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 500, color: 'var(--color-sage)' }}>
                          {c.sent > 0 ? ((c.opened / c.sent) * 100).toFixed(0) : 0}%
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 500, color: 'var(--color-ochre)' }}>
                          {c.sent > 0 ? ((c.clicked / c.sent) * 100).toFixed(0) : 0}%
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 500, color: '#3B82F6' }}>{c.converted}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {c.sent > 0 ? Math.round((c.converted / c.sent) * 100 * 10) : 0}%
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                            background: c.status === 'active' ? 'rgba(110, 140, 100, 0.08)' : c.status === 'paused' ? 'rgba(217, 175, 40, 0.08)' : 'var(--bg-hover)',
                            color: c.status === 'active' ? 'var(--color-sage)' : c.status === 'paused' ? '#D9AF28' : 'var(--text-tertiary)',
                          }}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROI Summary */}
            <div style={{
              background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: `conic-gradient(var(--color-sage) ${performanceMetrics.roi / 5}%, var(--bg-hover) 0)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <div style={{
                  width: 76, height: 76, borderRadius: '50%',
                  background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-sage)' }}>{performanceMetrics.roi}%</span>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Marketing ROI</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  For every $1 spent on marketing, you're generating ${(performanceMetrics.roi / 100).toFixed(2)} in attributed revenue.
                  This is <strong style={{ color: 'var(--color-sage)' }}>2.4x</strong> the industry average.
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '6px 0 0' }}>
                  Cost per lead: ${performanceMetrics.costPerLead} · Revenue attributed: ${(performanceMetrics.revenueAttributed / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(180, 130, 70, 0.04), rgba(195, 95, 70, 0.02))',
              borderRadius: 20, padding: 20, border: '1px solid rgba(180, 130, 70, 0.1)',
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
            }}>
              <Icons.Zap />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>AI-Powered Recommendations</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  Our AI analyzes your lead behavior and market data to suggest optimization opportunities
                </p>
              </div>
            </div>
            {aiSuggestions.map(suggestion => (
              <div key={suggestion.id} style={{
                background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)',
                borderRadius: 20, padding: 18, border: '1px solid var(--border-primary)',
                boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: suggestion.priority === 'high' ? '#DC2626' : suggestion.priority === 'medium' ? '#D9AF28' : 'var(--text-tertiary)',
                  flexShrink: 0,
                  boxShadow: suggestion.priority === 'high' ? '0 0 8px rgba(220, 38, 38, 0.3)' : 'none',
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>{suggestion.text}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0 }}>{suggestion.impact}</p>
                </div>
                <button style={{
                  padding: '8px 14px', fontSize: 12, fontWeight: 600, borderRadius: 12,
                  color: 'var(--color-cream)', background: 'var(--color-espresso)',
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}>
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AIMarketing