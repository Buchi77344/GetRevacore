"use client";

import { Toaster } from 'react-hot-toast'
import { NotificationProvider } from './context/NotificationContext'
import './App.css'

// ── App ────────────────────────────────────────────────────────────────────────
function App() {
  return (
    <NotificationProvider>
      <>
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
              duration: 4000,
            },
            duration: 4000,
          }}
        />
        {/*
          Children are provided by Next.js file-based routing.
          The AuthProvider wraps this component via providers.tsx.
        */}
      </>
    </NotificationProvider>
  )
}

export default App