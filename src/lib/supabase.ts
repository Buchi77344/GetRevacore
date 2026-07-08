import { createClient } from '@supabase/supabase-js'

// Get environment variables with validation
const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error('❌ Missing Supabase configuration')
    console.error('  VITE_SUPABASE_URL:', url ? '✓' : '✗')
    console.error('  VITE_SUPABASE_ANON_KEY:', key ? '✓' : '✗')
    
    // Return dummy client to prevent crashes
    return {
      url: 'https://placeholder.supabase.co',
      key: 'placeholder-key',
      isConfigured: false
    }
  }
  
  return { url, key, isConfigured: true }
}

const config = getSupabaseConfig()
export const supabaseConfigured = config.isConfigured

// Determine the correct site URL for redirects

export const supabase = createClient(config.url, config.key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Ensure redirects go to the correct URL regardless of environment
    ...(import.meta.env.PROD && {
      // In production, explicitly set the site URL to prevent redirects to localhost
      // Note: This should match the Site URL in Supabase dashboard settings
      ...(import.meta.env.VITE_SITE_URL && {
        redirectTo: import.meta.env.VITE_SITE_URL,
      }),
    }),
  },
})

// Health check function
export const checkSupabaseHealth = async (): Promise<boolean> => {
  if (!config.isConfigured) return false
  try {
    const { error } = await supabase.auth.getSession()
    return !error
  } catch {
    return false
  }
}