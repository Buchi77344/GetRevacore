import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Home: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Logo: () => (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="var(--color-espresso)"/>
      <path d="M8 22L12 14L16 19L20 12L24 22" stroke="var(--color-ochre)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="22" cy="12" r="2.5" fill="var(--color-ochre)" opacity="0.9"/>
    </svg>
  ),
}

// ─── Onboarding Steps ──────────────────────────────────────────────────────────
interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: {
    label: string
    onClick: () => void
  }
  completed?: boolean
}

interface OnboardingFlowProps {
  onComplete: () => void
  onDismiss: () => void
}

export const OnboardingFlow = ({ onComplete, onDismiss }: OnboardingFlowProps) => {
  const { agency } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [dismissed] = useState(false)

  const steps: OnboardingStep[] = [
    {
      id: 'add-lead',
      title: 'Add your first lead',
      description: 'Import or manually add your first contact to start building your pipeline. AI will score and prioritise them automatically.',
      icon: <Icons.Plus />,
      action: {
        label: 'Add a lead',
        onClick: () => {
          navigate('/dashboard/leads?action=add')
          markCompleted('add-lead')
        },
      },
    },
    {
      id: 'list-property',
      title: 'List your first property',
      description: 'Showcase a property with photos, pricing, and key details. It will appear in matching results for your leads.',
      icon: <Icons.Home />,
      action: {
        label: 'List a property',
        onClick: () => {
          navigate('/dashboard/properties')
          markCompleted('list-property')
        },
      },
    },
    {
      id: 'ai-setup',
      title: 'Configure AI auto-reply',
      description: 'Set up how your AI responds to new leads. Personalise the tone, response time, and property matching preferences.',
      icon: <Icons.Zap />,
      action: {
        label: 'Configure AI',
        onClick: () => {
          navigate('/dashboard/settings')
          markCompleted('ai-setup')
        },
      },
    },
    {
      id: 'share-form',
      title: 'Share your lead capture form',
      description: 'Your public lead capture form is ready at a unique link. Share it on social media, your website, or Bayut listings.',
      icon: <Icons.Users />,
      action: {
        label: 'Copy form link',
        onClick: () => {
          if (agency?.id) {
            const link = `${window.location.origin}/form/${agency.id}`
            navigator.clipboard.writeText(link)
            toast.success('Lead form link copied to clipboard!')
          }
          markCompleted('share-form')
        },
      },
    },
  ]

  const markCompleted = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      next.add(stepId)
      return next
    })
  }

  const allCompleted = steps.every((s) => completedSteps.has(s.id))
  const progress = Math.round((completedSteps.size / steps.length) * 100)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else if (allCompleted) {
      onComplete()
    }
  }

  const handleSkip = () => {
    toast.success('You can always come back to this later')
    onDismiss()
  }

  if (dismissed) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
          animation: 'rc-onb-fade-in 0.3s ease',
        }}
        onClick={allCompleted ? onComplete : undefined}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 520,
          background: 'var(--bg-secondary)',
          borderRadius: 24,
          border: '1px solid var(--border-primary)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          animation: 'rc-onb-card-in 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '28px 28px 20px',
            borderBottom: '1px solid var(--border-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icons.Logo />
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Welcome to RevaCore
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Let's get you set up in a few quick steps
              </p>
            </div>
          </div>

          <button
            onClick={handleSkip}
            style={{
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Skip
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ height: 3, background: 'var(--bg-tertiary)', width: '100%' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--color-ochre)',
              borderRadius: '0 2px 2px 0',
              transition: 'width 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)',
            }}
          />
        </div>

        {/* Step Indicators */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: '16px 28px 0',
            justifyContent: 'center',
          }}
        >
          {steps.map((step, idx) => {
            const isActive = idx === currentStep
            const isDone = completedSteps.has(step.id)
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: `1px solid ${
                    isActive ? 'var(--color-ochre)' : isDone ? 'rgba(107,143,113,0.2)' : 'var(--border-secondary)'
                  }`,
                  background: isActive
                    ? 'rgba(180,130,70,0.06)'
                    : isDone
                      ? 'rgba(107,143,113,0.08)'
                      : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: isDone
                    ? '#6B8F71'
                    : isActive
                      ? 'var(--color-ochre)'
                      : 'var(--text-tertiary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: 'all 0.2s ease',
                }}
              >
                {isDone ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icons.Check /> Done
                  </span>
                ) : (
                  `Step ${idx + 1}`
                )}
              </button>
            )
          })}
        </div>

        {/* Step Content */}
        <div
          key={currentStep}
          style={{
            padding: '24px 28px 8px',
            animation: 'rc-onb-slide-in 0.35s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: 'rgba(180,130,70,0.08)',
              color: 'var(--color-ochre)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            {steps[currentStep].icon}
          </div>

          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            {steps[currentStep].title}
          </h3>

          <p
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              margin: '0 0 20px',
              lineHeight: 1.6,
            }}
          >
            {steps[currentStep].description}
          </p>

          {completedSteps.has(steps[currentStep].id) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(107,143,113,0.06)',
                border: '1px solid rgba(107,143,113,0.15)',
                marginBottom: 16,
                fontSize: 13,
                fontWeight: 600,
                color: '#6B8F71',
              }}
            >
              <Icons.Check /> Step completed
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 28px 24px',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          {/* Step counter */}
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, flexShrink: 0 }}>
            {completedSteps.size}/{steps.length} done
          </span>

          <div style={{ flex: 1 }} />

          {allCompleted ? (
            <button
              onClick={onComplete}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                background: 'var(--color-sage)',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              <Icons.Sparkle /> Start using RevaCore
              <Icons.ArrowRight />
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              {completedSteps.has(steps[currentStep].id) ? (
                <button
                  onClick={handleNext}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#fff',
                    background: 'var(--color-espresso)',
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                  }}
                >
                  {currentStep < steps.length - 1 ? (
                    <>Next step <Icons.ArrowRight /></>
                  ) : (
                    'Finish setup'
                  )}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <button
                    onClick={steps[currentStep].action.onClick}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '12px 20px',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#fff',
                      background: 'var(--color-espresso)',
                      border: 'none',
                      borderRadius: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {steps[currentStep].action.label} <Icons.ArrowRight />
                  </button>
                  <button
                    onClick={() => {
                      if (currentStep < steps.length - 1) {
                        setCurrentStep((prev) => prev + 1)
                      } else {
                        onComplete()
                      }
                    }}
                    style={{
                      padding: '12px 16px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-hover)',
                      border: '1px solid var(--border-secondary)',
                      borderRadius: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <style>{`
          @keyframes rc-onb-fade-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes rc-onb-card-in {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)    scale(1);    }
          }
          @keyframes rc-onb-slide-in {
            from { opacity: 0; transform: translateX(20px); }
            to   { opacity: 1; transform: translateX(0);    }
          }
        `}</style>
      </div>
    </div>
  )
}

export default OnboardingFlow