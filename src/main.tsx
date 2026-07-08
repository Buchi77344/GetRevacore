// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import App from './App'
import './index.css'

// ── Theme Initialization ────────────────────────────────────────────────────

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme') as Theme | null
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }
  
  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  
  // Set data attribute for CSS selectors
  root.setAttribute('data-theme', theme)
  
  // Also toggle class for Tailwind compatibility
  if (theme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
  }
  
  // Store preference
  localStorage.setItem('theme', theme)
}

// Apply theme immediately to prevent flash
const initialTheme = getInitialTheme()
applyTheme(initialTheme)

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Only auto-switch if user hasn't manually set a preference
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light')
  }
})

// Expose theme toggle function globally for settings page
;(window as any).__toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme') as Theme
  applyTheme(current === 'dark' ? 'light' : 'dark')
}

// Expose theme getter
;(window as any).__getTheme = () => {
  return document.documentElement.getAttribute('data-theme') as Theme
}

// ── Render App ──────────────────────────────────────────────────────────────

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your index.html')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)