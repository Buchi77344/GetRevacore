import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { NotificationProvider } from './context/NotificationContext'
import './App.css'

// Layout
import AppLayout from './components/layout/AppLayout'

// Auth Pages
import Login from './routes/auth/Login'
import Signup from './routes/auth/Signup'
import ForgotPassword from './routes/auth/ForgotPassword'
import AcceptInvite from './routes/auth/AcceptInvite'

// Dashboard & Main Pages
import Dashboard from './routes/Dashboard'
import Inbox from './routes/Inbox'
import Leads from './routes/Leads'
import LeadDetail from './routes/LeadDetail'
import Pipeline from './routes/Pipeline'
import { Properties } from './routes/Properties'
import  {PropertyDetail}  from './routes/PropertyDetail'
import Appointments from './routes/Appointments'
import DealAnalyser from './routes/DealAnalyser'
import Marketing from './routes/Marketing'
import Analytics from './routes/Analytics'
import Billing from './routes/Billing'
import Settings from './routes/Settings'
import MarketProperties from './routes/MarketProperties'
import MarketPropertyDetail from './routes/MarketPropertyDetail'

// Public Pages
import Landing from './routes/Landing'
import PublicListing from './routes/PublicListing'
import LeadCaptureForm from './routes/LeadCaptureForm'

// ── Loading Screen ─────────────────────────────────────────────────────────────
function LoadingScreen({ message = 'Loading RevaCore...' }: { message?: string }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary, #F7F3EC)',
        fontFamily: 'var(--font-body, system-ui)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {/* Logo */}
        <div style={{ animation: 'rc-logo-pulse 2s ease-in-out infinite' }}>
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--color-espresso, #373026)" />
            <path
              d="M8 22L12 14L16 19L20 12L24 22"
              stroke="var(--color-ochre, #B48246)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="22" cy="12" r="2.5" fill="var(--color-ochre, #B48246)" opacity="0.9" />
          </svg>
        </div>

        {/* Spinner */}
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid var(--border-secondary, #EAE4DB)',
            borderTopColor: 'var(--color-ochre, #B48246)',
            borderRadius: '50%',
            animation: 'rc-spin 0.75s linear infinite',
          }}
        />

        {/* Message */}
        <p style={{ color: 'var(--text-tertiary, #9c9690)', fontSize: 14, fontWeight: 500, margin: 0 }}>
          {message}
        </p>
      </div>

      <style>{`
        @keyframes rc-spin { to { transform: rotate(360deg); } }
        @keyframes rc-logo-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(0.94); }
        }
      `}</style>
    </div>
  )
}

// ── ProtectedRoute ─────────────────────────────────────────────────────────────
// Rules:
//   • While Supabase hasn't completed its initial session check → show loader
//   • After check, no user → redirect to /login
//   • Authenticated + data loaded (isReady) → render AppLayout
//   • Authenticated but data still loading → show loader
//
// Using `isReady` ensures we wait for profile + agency data to load
// before rendering the dashboard, preventing flash-of-empty states.
function ProtectedRoute() {
  const { user, sessionChecked, isReady } = useAuth()

  // Still running the initial Supabase getSession / INITIAL_SESSION event
  if (!sessionChecked) {
    return <LoadingScreen message="Checking your session..." />
  }

  // Session checked, no user → send to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Authenticated but profile/agency data still loading
  if (!isReady) {
    return <LoadingScreen message="Loading your workspace..." />
  }

  // Authenticated ✓
  return <AppLayout />
}

// ── GuestRoute ─────────────────────────────────────────────────────────────────
// Rules:
//   • While session not yet checked → allow public pages to load (don't block)
//   • Session checked + user exists → redirect into app
//   • No user → render the guest page (login / signup / landing etc.)
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, sessionChecked } = useAuth()

  // Only redirect if session is checked AND user exists
  if (sessionChecked && user) {
    return <Navigate to="/dashboard" replace />
  }

  // Allow public pages to load immediately without waiting for session check
  // This fixes the "Landing page not showing" issue
  return <>{children}</>
}

// ── App ────────────────────────────────────────────────────────────────────────
function AuthenticatedApp() {
  // useAuth hook called here for side effects (session check, auth initialization)
  useAuth()

  return (
    <NotificationProvider>
      <>
        {/*
          Toaster with responsive styling for light/dark mode
        Uses CSS variables to automatically adapt to theme changes
      */}
      <Toaster
        position="top-right"
        containerClassName="toaster-container"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            fontFamily: 'var(--font-body)',
            padding: '12px 16px',
            backdropFilter: 'blur(8px)',
          },
          success: {
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            },
            iconTheme: {
              primary: 'var(--color-sage)',
              secondary: 'var(--bg-secondary)',
            },
            duration: 4000,
          },
          error: {
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            },
            iconTheme: {
              primary: 'var(--color-error)',
              secondary: 'var(--bg-secondary)',
            },
            duration: 5000,
          },
          loading: {
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            },
            iconTheme: {
              primary: 'var(--color-ochre)',
              secondary: 'var(--bg-secondary)',
            },
          },
          duration: 4000,
        }}
      />

      <Routes>
        {/* ── Public / Guest-only ─────────────────────────────────────── */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <Landing />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route path="/accept-invite" element={<AcceptInvite />} />

        {/* ── Public (no auth required) ───────────────────────────────── */}
        <Route path="/property/:id" element={<PublicListing />} />
        <Route path="/form/:agencyId" element={<LeadCaptureForm />} />

        {/* ── Protected dashboard routes ──────────────────────────────── */}
        {/*
          ProtectedRoute renders AppLayout which uses <Outlet> for child routes.
          All children share the same auth guard — no need to repeat it.
        */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/:id" element={<LeadDetail />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/market" element={<MarketProperties />} />
          <Route path="properties/market/:id" element={<MarketPropertyDetail />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="deals" element={<DealAnalyser />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ── Catch-all ───────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </>
    </NotificationProvider>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────────
function App() {
  return <AuthenticatedApp />
}

export default App