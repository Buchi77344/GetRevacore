"use client";

import {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
  useRef,
} from 'react'
import { supabase } from '../lib/supabase'
import { setCurrentUserId } from '../lib/notifications'
import toast from 'react-hot-toast'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  email?: string
}

export interface Agency {
  id: string
  owner_id?: string
  name: string
  logo_url?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  country?: string | null        // also used as primary market code (AE, CA, NG…)
  agency_type?: string | null    // solo | boutique | mid | large
  lead_sources?: string[]        // e.g. ['bayut', 'referrals', 'social_media']
  property_focus?: string[]      // e.g. ['residential', 'offplan']
  description?: string | null
  plan: string
  plan_status: string
  trial_ends_at?: string | null
  created_at?: string
}

export interface AgentProfile {
  id: string
  user_id: string
  agency_id: string
  name: string
  phone?: string | null
  photo_url?: string | null
  role: string
  created_at?: string
}

// Metadata collected during the 5-step signup flow
export interface SignupMetadata {
  agencyType?:    string    // solo | boutique | mid | large
  market?:        string    // country code: AE, CA, NG, ZA, etc.
  leadSources?:   string[]  // where leads come from
  propertyFocus?: string[]  // property types the agency works with
}

export interface AuthContextType {
  user: User | null
  agency: Agency | null
  profile: AgentProfile | null
  loading: boolean
  sessionChecked: boolean
  isReady: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<User>
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    agencyName: string,
    plan: string,
    phone?: string,
    metadata?: SignupMetadata   // ← NEW: onboarding data from steps 2 & 4
  ) => Promise<User>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

// ── Constants ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null)
const AUTH_INIT_TIMEOUT_MS      = 8_000
const SESSION_REFRESH_INTERVAL_MS = 10 * 60 * 1000

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,           setUser]           = useState<User | null>(null)
  const [agency,         setAgency]         = useState<Agency | null>(null)
  const [profile,        setProfile]        = useState<AgentProfile | null>(null)
  const [loading,        setLoading]        = useState(true)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [error,          setError]          = useState<string | null>(null)

  const isMounted          = useRef(true)
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastSignOutAt      = useRef(0)
  const currentUserIdRef   = useRef<string | null>(null)
  const initDoneRef        = useRef(false)

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const clearAllState = useCallback(() => {
    setUser(null)
    setAgency(null)
    setProfile(null)
    setError(null)
    currentUserIdRef.current = null
    setCurrentUserId(null)
    initDoneRef.current = false
  }, [])

  const stopRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }
  }, [])

  // ── fetchUserData ─────────────────────────────────────────────────────────────
  const fetchUserData = useCallback(async (userId: string) => {
    if (!userId) return

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.info('[Auth] No profile found for user', userId)
        } else {
          console.error('[Auth] Profile fetch error:', profileError)
        }
        if (isMounted.current) { setProfile(null); setAgency(null) }
        return
      }

      if (isMounted.current) {
        // Sync the notification system with current user
        setCurrentUserId(userId)
      }

      if (!profileData || !isMounted.current) return

      const fullProfile: AgentProfile = {
        id:        profileData.id,
        user_id:   profileData.user_id,
        agency_id: profileData.agency_id,
        name:      profileData.name || '',
        phone:     profileData.phone     || null,
        photo_url: profileData.photo_url || null,
        role:      profileData.role      || 'agent',
        created_at: profileData.created_at,
      }
      setProfile(fullProfile)

      if (fullProfile.agency_id) {
        const { data: agencyData, error: agencyError } = await supabase
          .from('agencies')
          .select('*')
          .eq('id', fullProfile.agency_id)
          .single()

        if (agencyError) {
          console.error('[Auth] Agency fetch error:', agencyError)
          if (isMounted.current) setAgency(null)
          return
        }

        if (agencyData && isMounted.current) {
          setAgency(mapAgencyRow(agencyData))
        }
      }
    } catch (err) {
      console.error('[Auth] fetchUserData unexpected error:', err)
    }
  }, [])

  const autoSignOut = useCallback(async (reason: string) => {
    const now = Date.now()
    if (now - lastSignOutAt.current < 2000) return
    lastSignOutAt.current = now
    console.warn('[Auth] Auto sign-out:', reason)
    stopRefreshInterval()
    clearAllState()
    try { await supabase.auth.signOut({ scope: 'local' }) } catch { /* ignore */ }
    if (isMounted.current) { setLoading(false); setSessionChecked(true) }
    toast.error(reason, { id: 'auth-expired', duration: 6000 })
  }, [clearAllState, stopRefreshInterval])

  const refreshSession = useCallback(async () => {
    if (!currentUserIdRef.current) return
    try {
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError || !session) {
        await autoSignOut('Your session has expired. Please sign in again.')
        return
      }
      if (isMounted.current && session.user) {
        setUser(session.user)
        await fetchUserData(session.user.id)
      }
    } catch {
      await autoSignOut('Connection lost. Please sign in again.')
    }
  }, [autoSignOut, fetchUserData])

  // ── Main auth effect ──────────────────────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true
    initDoneRef.current = false

    const initTimeoutId = setTimeout(() => {
      if (isMounted.current) {
        console.warn('[Auth] Init timed out — forcing sessionChecked')
        setLoading(false)
        setSessionChecked(true)
      }
    }, AUTH_INIT_TIMEOUT_MS)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted.current) return
      console.log('[Auth] Event:', event)

      switch (event) {
        case 'SIGNED_IN': {
          if (session?.user) {
            if (!initDoneRef.current) break
            currentUserIdRef.current = session.user.id
            setUser(session.user)
            setError(null)
            await fetchUserData(session.user.id)
          }
          setLoading(false)
          setSessionChecked(true)
          break
        }
        case 'TOKEN_REFRESHED': {
          if (session?.user) { currentUserIdRef.current = session.user.id; setUser(session.user) }
          break
        }
        case 'USER_UPDATED': {
          if (session?.user) setUser(session.user)
          break
        }
        case 'SIGNED_OUT': {
          stopRefreshInterval()
          clearAllState()
          setLoading(false)
          setSessionChecked(true)
          break
        }
        default:
          break
      }
    })

    ;(async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (!isMounted.current) return
        if (sessionError) {
          console.error('[Auth] getSession error:', sessionError.message)
          setLoading(false); setSessionChecked(true)
          clearTimeout(initTimeoutId)
          return
        }
        if (session?.user) {
          currentUserIdRef.current = session.user.id
          setUser(session.user)
          await fetchUserData(session.user.id)
        }
      } catch (err) {
        console.error('[Auth] getSession unexpected error:', err)
      } finally {
        initDoneRef.current = true
        if (isMounted.current) {
          setLoading(false); setSessionChecked(true)
          clearTimeout(initTimeoutId)
        }
      }
    })()

    refreshIntervalRef.current = setInterval(() => {
      if (isMounted.current && currentUserIdRef.current) refreshSession()
    }, SESSION_REFRESH_INTERVAL_MS)

    return () => {
      isMounted.current = false
      clearTimeout(initTimeoutId)
      stopRefreshInterval()
      subscription.unsubscribe()
    }
  }, [autoSignOut, clearAllState, fetchUserData, refreshSession, stopRefreshInterval])

  // ── signIn ────────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string): Promise<User> => {
    setError(null)
    setLoading(true)
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (signInError) {
        const msg = signInError.message.toLowerCase()
        if (msg.includes('invalid login credentials') || msg.includes('invalid email or password'))
          throw new Error('Invalid email or password. Please try again.')
        if (msg.includes('email not confirmed'))
          throw new Error('Please verify your email address before signing in.')
        throw new Error(signInError.message)
      }
      if (!data.user) throw new Error('Sign in failed.')
      currentUserIdRef.current = data.user.id
      setCurrentUserId(data.user.id)
      setUser(data.user)
      await fetchUserData(data.user.id)
      setLoading(false); setSessionChecked(true)
      return data.user as User
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.')
      setLoading(false)
      throw err
    }
  }, [fetchUserData])

  // ── signUp ────────────────────────────────────────────────────────────────────
  // Accepts the SignupMetadata collected on Steps 2 & 4 of the signup form.
  // Stored in the agencies table: country (market), agency_type,
  // lead_sources, property_focus.
  //
  // ⚠️  IMPORTANT: These DB inserts run immediately after auth.signUp.
  //     This only works if Supabase email confirmation is DISABLED in your
  //     project (Authentication > Providers > Email > "Confirm email" toggle).
  //     If confirmation is required, the session will be null here and the
  //     inserts will fail due to RLS.
  //     For production with email confirmation, move the agency/profile
  //     creation into a Supabase Edge Function triggered by the
  //     auth.users INSERT event (using service_role key, bypasses RLS).
  // ─────────────────────────────────────────────────────────────────────────────
  const signUp = useCallback(async (
    email:      string,
    password:   string,
    firstName:  string,
    lastName:   string,
    agencyName: string,
    plan:       string,
    phone?:     string,
    metadata?:  SignupMetadata,
  ): Promise<User> => {
    setError(null)
    setLoading(true)

    let createdUserId:  string | null = null
    let createdAgencyId: string | null = null

    try {
      const fullName    = `${firstName} ${lastName}`.trim()
      const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      const renewalDate = trialEndsAt.split('T')[0]

      // ── Step 1: Create auth user ────────────────────────────────────────────
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name:        fullName,
            first_name:  firstName.trim(),
            last_name:   lastName.trim(),
            agency_name: agencyName.trim(),
            plan,
            phone:       phone || '',
            // Onboarding metadata — available in auth.users.raw_user_meta_data
            market:        metadata?.market        || '',
            agency_type:   metadata?.agencyType    || '',
            lead_sources:  metadata?.leadSources   || [],
            property_focus: metadata?.propertyFocus || [],
          },
        },
      })

      if (authError) {
        if (authError.message?.includes('already registered'))
          throw new Error('An account with this email already exists.')
        throw new Error(authError.message)
      }
      if (!authData.user) throw new Error('Failed to create account.')
      createdUserId = authData.user.id

      // Give Supabase a moment to establish the session
      await new Promise(resolve => setTimeout(resolve, 500))

      // ── Step 2: Create agency (with onboarding metadata) ───────────────────
      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          owner_id:       createdUserId,
          name:           agencyName.trim(),
          email:          email.trim().toLowerCase(),
          phone:          phone || null,
          plan,
          plan_status:    'trial',
          trial_ends_at:  trialEndsAt,
          // Onboarding fields — map metadata to DB columns:
          country:        metadata?.market        || null,  // market code → country
          agency_type:    metadata?.agencyType    || null,
          lead_sources:   metadata?.leadSources   || [],
          property_focus: metadata?.propertyFocus || [],
        })
        .select('*')
        .single()

      if (agencyError || !agencyData) {
        console.error('[Auth] Agency creation failed:', agencyError)
        throw new Error('Failed to set up your agency. Please try again.')
      }
      createdAgencyId = agencyData.id

      // ── Step 3: Create agent profile ────────────────────────────────────────
      const { data: profileData, error: profileError } = await supabase
        .from('agent_profiles')
        .insert({
          user_id:   createdUserId,
          agency_id: createdAgencyId,
          name:      fullName,
          phone:     phone || null,
          role:      'owner',
        })
        .select('*')
        .single()

      if (profileError || !profileData) {
        // Roll back agency if profile creation fails
        await supabase.from('agencies').delete().eq('id', createdAgencyId)
        throw new Error('Failed to create your profile.')
      }

      // ── Step 4: Create subscription (non-critical) ──────────────────────────
      await supabase.from('subscriptions').insert({
        agency_id:     createdAgencyId,
        plan,
        billing_cycle: 'monthly',
        status:        'trialing',
        amount:        0,
        currency:      'USD',
        renewal_date:  renewalDate,
      }).then(({ error }) => {
        if (error) console.error('[Auth] Subscription creation error (non-critical):', error)
      })

      // ── Step 5: Create notification preferences (non-critical) ──────────────
      await supabase.from('notification_preferences').insert({
        user_id: createdUserId,
      }).then(({ error }) => {
        if (error) console.error('[Auth] Notification prefs error (non-critical):', error)
      })

      // ── Set local state ─────────────────────────────────────────────────────
      currentUserIdRef.current = createdUserId
      setCurrentUserId(createdUserId)
      initDoneRef.current = true

      setUser({ id: createdUserId, email: email.trim().toLowerCase() })
      setAgency(mapAgencyRow(agencyData))
      setProfile({
        id:        profileData.id,
        user_id:   profileData.user_id,
        agency_id: profileData.agency_id,
        name:      profileData.name,
        phone:     profileData.phone     || null,
        photo_url: profileData.photo_url || null,
        role:      profileData.role,
        created_at: profileData.created_at,
      })

      setLoading(false)
      setSessionChecked(true)
      toast.success('Account created successfully!')

      return authData.user as User

    } catch (err: any) {
      // Roll back DB rows if something went wrong mid-way
      if (createdAgencyId) {
        await supabase.from('agencies').delete().eq('id', createdAgencyId)
      }
      if (createdUserId) {
        await supabase.auth.signOut({ scope: 'local' })
      }
      const message = err.message || 'Failed to create account.'
      setError(message)
      setLoading(false)
      throw err
    }
  }, [])

  // ── signOut ───────────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    setError(null)
    setLoading(true)
    stopRefreshInterval()
    clearAllState()
    try {
      await supabase.auth.signOut({ scope: 'local' })
    } catch (err) {
      console.error('[Auth] signOut error:', err)
    } finally {
      if (isMounted.current) { setLoading(false); setSessionChecked(true) }
    }
  }, [clearAllState, stopRefreshInterval])

  // ── computed: isReady ─────────────────────────────────────────────────────────
  // Returns true when:
  //   1. The initial session check is complete (sessionChecked === true)
  //   2. If authenticated, user data (profile + agency) has been loaded
  //      (i.e. either we have profile data, or we know there's no profile)
  //   3. If not authenticated, we're ready immediately after sessionChecked
  const isReady = sessionChecked && (!user || (user && (!loading || initDoneRef.current)))

  const value: AuthContextType = {
    user, agency, profile, loading, sessionChecked, isReady, error,
    signIn, signUp, signOut, refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an <AuthProvider>.')
  return context
}

export default useAuth

// ── Helpers ───────────────────────────────────────────────────────────────────
// Maps a raw Supabase agency row to the Agency interface.
// Centralised here so fetchUserData and signUp both produce identical shapes.
function mapAgencyRow(row: Record<string, any>): Agency {
  return {
    id:             row.id,
    owner_id:       row.owner_id       || undefined,
    name:           row.name           || '',
    logo_url:       row.logo_url       || null,
    phone:          row.phone          || null,
    email:          row.email          || null,
    address:        row.address        || null,
    country:        row.country        || null,
    agency_type:    row.agency_type    || null,
    lead_sources:   row.lead_sources   || [],
    property_focus: row.property_focus || [],
    description:    row.description    || null,
    plan:           row.plan           || 'trial',
    plan_status:    row.plan_status    || 'trial',
    trial_ends_at:  row.trial_ends_at  || null,
    created_at:     row.created_at,
  }
}