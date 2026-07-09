"use client";

import { useState, useEffect, useRef, type JSX } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Globe: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  CreditCard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Database: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  Zap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Key: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  ),
  Camera: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  ),
  Info: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
    </svg>
  ),
  Loader: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'rc-spin 0.7s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
  ),
}

// ── Types ─────────────────────────────────────────────────────────────────────
type TabId = 'profile' | 'agency' | 'notifications' | 'team' | 'security' | 'integrations' | 'danger'

interface FullProfile {
  id: string
  user_id: string
  agency_id: string
  name: string
  phone: string | null
  photo_url: string | null
  role: string
  created_at: string
}

interface TeamMember extends FullProfile {
  email?: string
}

interface NotifPrefs {
  new_lead: boolean
  appointment_reminder: boolean
  deal_stage_change: boolean
  team_activity: boolean
  weekly_digest: boolean
  marketing_updates: boolean
}

const DEFAULT_NOTIF_PREFS: NotifPrefs = {
  new_lead: true,
  appointment_reminder: true,
  deal_stage_change: true,
  team_activity: false,
  weekly_digest: true,
  marketing_updates: false,
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

// ── Main Component ────────────────────────────────────────────────────────────
export const Settings = () => {
  const { user, agency, profile, signOut } = useAuth()

  const [activeTab, setActiveTab] = useState<TabId>('profile')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  // ── Profile state
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', email: '' })
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoUploading, setPhotoUploading] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  // ── Agency state
  const [agencyForm, setAgencyForm] = useState({ name: '', phone: '', email: '', address: '', country: '', description: '' })
  const [logoUrl, setLogoUrl] = useState('')
  const [logoUploading, setLogoUploading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // ── Notification prefs
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF_PREFS)
  const [notifPrefsLoaded, setNotifPrefsLoaded] = useState(false)

  // ── Team
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamLoading, setTeamLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('agent')
  const [inviteSending, setInviteSending] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)

  // ── Security
  const [passwords, setPasswords] = useState({ current: '', new_pass: '', confirm: '' })
  const [showPasswords, setShowPasswords] = useState({ current: false, new_pass: false, confirm: false })
  const [passwordSaving, setPasswordSaving] = useState(false)

  // ── Danger
  const [dangerLoading, setDangerLoading] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // ── Initialize forms from auth context
  useEffect(() => {
    if (profile) {
      const fp = profile as unknown as FullProfile
      setProfileForm({ name: fp.name || '', phone: fp.phone || '', email: user?.email || '' })
      setPhotoUrl(fp.photo_url || '')
    }
  }, [profile, user])

  useEffect(() => {
    if (agency) {
      const a = agency as any
      setAgencyForm({
        name: a.name || '', phone: a.phone || '', email: a.email || '',
        address: a.address || '', country: a.country || '', description: a.description || '',
      })
      setLogoUrl(a.logo_url || '')
    }
  }, [agency])

  // ── Load notification prefs from DB (fallback localStorage)
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        if (user?.id) {
          const { data, error } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single()
          if (!error && data) {
            const { id, user_id, created_at, updated_at, ...prefs } = data
            setNotifPrefs({ ...DEFAULT_NOTIF_PREFS, ...prefs })
            localStorage.setItem(`rc_notif_prefs_${user.id}`, JSON.stringify(prefs))
            setNotifPrefsLoaded(true)
            return
          }
        }
      } catch {}
      if (user?.id) {
        try {
          const saved = localStorage.getItem(`rc_notif_prefs_${user.id}`)
          if (saved) setNotifPrefs({ ...DEFAULT_NOTIF_PREFS, ...JSON.parse(saved) })
        } catch {}
      }
      setNotifPrefsLoaded(true)
    }
    loadPrefs()
  }, [user])

  // ── Load team when tab active
  useEffect(() => {
    if (activeTab === 'team' && agency?.id) loadTeam()
  }, [activeTab, agency?.id])

  // ─────────────────────────── HANDLERS ─────────────────────────────────────

  const saveProfile = async () => {
    if (!profile?.id) return
    if (!profileForm.name.trim()) return toast.error('Name is required')
    setSaveStatus('saving')
    try {
      await supabase.from('agent_profiles').update({
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim() || null,
      }).eq('id', profile.id)
      if (profileForm.email.trim() && profileForm.email.trim() !== user?.email) {
        await supabase.auth.updateUser({ email: profileForm.email.trim().toLowerCase() })
        toast.success('Profile saved. Check your email for confirmation.')
      } else {
        toast.success('Profile saved')
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
      setSaveStatus('idle')
    }
  }

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile?.id || !user?.id) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return toast.error('JPG, PNG, or WebP only')
    if (file.size > 2 * 1024 * 1024) return toast.error('Max 2MB')
    setPhotoUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadErr } = await supabase.storage.from('agent-photos').upload(path, file, { upsert: true, contentType: file.type })
      if (uploadErr) throw uploadErr
      const { data } = supabase.storage.from('agent-photos').getPublicUrl(path)
      if (!data?.publicUrl) throw new Error('Failed to get URL')
      await supabase.from('agent_profiles').update({ photo_url: data.publicUrl }).eq('id', profile.id)
      setPhotoUrl(data.publicUrl + '?t=' + Date.now())
      toast.success('Photo updated')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setPhotoUploading(false)
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
  }

  const removePhoto = async () => {
    if (!profile?.id) return
    await supabase.from('agent_profiles').update({ photo_url: null }).eq('id', profile.id)
    setPhotoUrl('')
    toast.success('Photo removed')
  }

  const saveAgency = async () => {
    if (!agency?.id) return
    if (!agencyForm.name.trim()) return toast.error('Agency name required')
    setSaveStatus('saving')
    try {
      await supabase.from('agencies').update({
        name: agencyForm.name.trim(),
        phone: agencyForm.phone.trim() || null,
        email: agencyForm.email.trim() || null,
        address: agencyForm.address.trim() || null,
        country: agencyForm.country.trim() || null,
        description: agencyForm.description.trim() || null,
      }).eq('id', agency.id)
      toast.success('Agency saved')
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
      setSaveStatus('idle')
    }
  }

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !agency?.id) return
    if (!['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'].includes(file.type)) return toast.error('JPG, PNG, SVG, or WebP only')
    if (file.size > 2 * 1024 * 1024) return toast.error('Max 2MB')
    setLogoUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${agency.id}/logo.${ext}`
      const { error: uploadErr } = await supabase.storage.from('agency-logos').upload(path, file, { upsert: true, contentType: file.type })
      if (uploadErr) throw uploadErr
      const { data } = supabase.storage.from('agency-logos').getPublicUrl(path)
      if (!data?.publicUrl) throw new Error('Failed to get URL')
      await supabase.from('agencies').update({ logo_url: data.publicUrl }).eq('id', agency.id)
      setLogoUrl(data.publicUrl + '?t=' + Date.now())
      toast.success('Logo updated')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setLogoUploading(false)
      if (logoInputRef.current) logoInputRef.current.value = ''
    }
  }

  const toggleNotifPref = async (key: keyof NotifPrefs) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] }
    setNotifPrefs(updated)
    if (user?.id) {
      localStorage.setItem(`rc_notif_prefs_${user.id}`, JSON.stringify(updated))
      try { await supabase.from('notification_preferences').upsert({ user_id: user.id, ...updated }, { onConflict: 'user_id' }) } catch {}
    }
    toast.success('Preference saved')
  }

  const loadTeam = async () => {
    if (!agency?.id) return
    setTeamLoading(true)
    try {
      const { data, error } = await supabase.from('agent_profiles').select('*').eq('agency_id', agency.id).order('created_at', { ascending: true })
      if (error) throw error
      setTeamMembers((data as TeamMember[]) || [])
    } catch { toast.error('Failed to load team') }
    finally { setTeamLoading(false) }
  }

  const updateMemberRole = async (memberId: string, newRole: string) => {
    await supabase.from('agent_profiles').update({ role: newRole }).eq('id', memberId)
    setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m))
    toast.success('Role updated')
  }

  const removeMember = async (memberId: string, memberName: string) => {
    if (!window.confirm(`Remove ${memberName}?`)) return
    if (memberId === (profile as unknown as FullProfile)?.id) return toast.error("Can't remove yourself")
    await supabase.from('agent_profiles').delete().eq('id', memberId)
    setTeamMembers(prev => prev.filter(m => m.id !== memberId))
    toast.success(`${memberName} removed`)
  }

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return toast.error('Enter an email')
    if (!inviteEmail.includes('@')) return toast.error('Valid email required')
    if (!agency?.id) return toast.error('No agency found')
    setInviteSending(true)
    try {
      const token = crypto.randomUUID()
      const acceptUrl = `${window.location.origin}/accept-invite?token=${token}`

      const { error } = await supabase.from('invitations').insert({
        agency_id: agency.id,
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
        invited_by: (profile as any)?.id,
        token_hash: token,
        status: 'pending',
      })

      if (error) throw error

      await navigator.clipboard.writeText(acceptUrl)
      toast.success('Invite created — link copied to clipboard')
      setInviteEmail('')
      setShowInviteForm(false)
    } catch (err: any) { toast.error(err.message || 'Failed') }
    finally { setInviteSending(false) }
  }

  const changePassword = async () => {
    if (!passwords.new_pass.trim()) return toast.error('Enter a new password')
    if (passwords.new_pass !== passwords.confirm) return toast.error('Passwords do not match')
    if (passwords.new_pass.length < 8) return toast.error('Min 8 characters')
    setPasswordSaving(true)
    try {
      await supabase.auth.updateUser({ password: passwords.new_pass })
      setPasswords({ current: '', new_pass: '', confirm: '' })
      toast.success('Password updated')
    } catch (err: any) { toast.error(err.message || 'Failed') }
    finally { setPasswordSaving(false) }
  }

  const revokeAllSessions = async () => {
    if (!window.confirm('Sign out all other devices?')) return
    try { await supabase.auth.signOut({ scope: 'others' }); toast.success('Sessions revoked') }
    catch (err: any) { toast.error(err.message || 'Failed') }
  }

  const archiveAllLeads = async () => {
    if (!window.confirm('Archive all active leads?')) return
    if (!agency?.id) return
    setDangerLoading('archive')
    try {
      await supabase.from('leads').update({ status: 'archived' }).eq('agency_id', agency.id).neq('status', 'archived')
      toast.success('Leads archived')
    } catch (err: any) { toast.error(err.message || 'Failed') }
    finally { setDangerLoading(null) }
  }

  const exportAllData = async () => {
    if (!agency?.id) return
    setExportLoading(true)
    try {
      const [leads, properties, deals, appointments, team] = await Promise.all([
        supabase.from('leads').select('*').eq('agency_id', agency.id),
        supabase.from('properties').select('*').eq('agency_id', agency.id),
        supabase.from('deals').select('*').eq('agency_id', agency.id),
        supabase.from('appointments').select('*').eq('agency_id', agency.id),
        supabase.from('agent_profiles').select('*').eq('agency_id', agency.id),
      ])
      const payload = { exportedAt: new Date().toISOString(), agency, profile, team: team.data || [], leads: leads.data || [], properties: properties.data || [], deals: deals.data || [], appointments: appointments.data || [] }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `revacore-export-${new Date().toISOString().split('T')[0]}.json`; a.click()
      URL.revokeObjectURL(url)
      toast.success('Exported')
    } catch (err: any) { toast.error(err.message || 'Failed') }
    finally { setExportLoading(false) }
  }

  const deleteAgency = async () => {
    if (confirmText !== agency?.name) return toast.error('Name does not match')
    if (!agency?.id) return
    setDangerLoading('delete')
    try {
      const { data: agencyLeads } = await supabase.from('leads').select('id').eq('agency_id', agency.id)
      const leadIds = agencyLeads?.map(l => l.id) || []
      const { data: agencyProps } = await supabase.from('properties').select('id').eq('agency_id', agency.id)
      const propIds = agencyProps?.map(p => p.id) || []

      // Defensive: delete agency-scoped rows from tables with FK ties BEFORE deleting agencies
      await supabase.from('agent_listings').delete().eq('agency_id', agency.id)
      await supabase.from('agent_properties').delete().eq('agency_id', agency.id)
      if (agency.id) {
        await supabase.from('lead_matched_properties').delete().eq('agency_id', agency.id)
      }

      if (leadIds.length > 0) {
        await supabase.from('follow_ups').delete().in('lead_id', leadIds)
        await supabase.from('appointments').delete().in('lead_id', leadIds)
      }
      await supabase.from('deals').delete().eq('agency_id', agency.id)
      if (propIds.length > 0) {
        await supabase.from('inquiries').delete().in('property_id', propIds)
        await supabase.from('marketing_content').delete().in('property_id', propIds)
      }
      if (leadIds.length > 0) await supabase.from('leads').delete().in('id', leadIds)
      if (propIds.length > 0) {
        await supabase.from('property_images').delete().in('property_id', propIds)
        await supabase.from('properties').delete().in('id', propIds)
      }
      await supabase.from('deal_analyses').delete().eq('agency_id', agency.id)
      await supabase.from('agent_profiles').delete().eq('agency_id', agency.id)
      await supabase.from('subscriptions').delete().eq('agency_id', agency.id)
      await supabase.from('agencies').delete().eq('id', agency.id)
      toast.success('Agency deleted')
      await signOut()
    } catch (err: any) { toast.error(err.message || 'Failed'); setDangerLoading(null) }
  }

  // ── Tabs ────────────────────────────────────────────────────────────────────
  const isOwner = (profile as any)?.role === 'owner'
  const tabs: { id: TabId; label: string; icon: JSX.Element }[] = [
    { id: 'profile', label: 'Profile', icon: <Icons.User /> },
    ...(isOwner ? [{ id: 'agency' as TabId, label: 'Agency', icon: <Icons.Settings /> }] : []),
    { id: 'notifications', label: 'Notifications', icon: <Icons.Bell /> },
    ...(isOwner ? [{ id: 'team' as TabId, label: 'Team', icon: <Icons.Users /> }] : []),
    { id: 'security', label: 'Security', icon: <Icons.Shield /> },
    { id: 'integrations', label: 'Integrations', icon: <Icons.Zap /> },
    ...(isOwner ? [{ id: 'danger' as TabId, label: 'Danger Zone', icon: <Icons.Trash /> }] : []),
  ]

  const fullProfile = profile as unknown as FullProfile

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
      <style>{`
        @keyframes rc-spin { to { transform: rotate(360deg); } }
        @keyframes rc-fadeup { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .rc-input:focus { border-color: var(--color-ochre) !important; outline: none; box-shadow: 0 0 0 3px rgba(180,130,70,0.1); }
        .rc-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .rc-btn { transition: all 0.2s ease; }
        .rc-tab:hover { background: var(--bg-hover) !important; }
        @media (max-width: 768px) { .rc-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 64px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 34px)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Settings</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0', fontWeight: 500 }}>Manage your account, agency, and preferences</p>
        </div>

        <div className="rc-grid" style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: 20, alignItems: 'start' }}>
          <nav style={{ background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)', padding: 8, position: 'sticky', top: 32 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="rc-tab"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', fontSize: 13, fontWeight: 600,
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: activeTab === tab.id ? 'var(--bg-tertiary)' : 'transparent',
                  border: activeTab === tab.id ? '1px solid var(--border-secondary)' : '1px solid transparent',
                  borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                }}
              >
                <span style={{ opacity: activeTab === tab.id ? 1 : 0.45, color: tab.id === 'danger' && activeTab === tab.id ? '#DC2626' : 'inherit' }}>{tab.icon}</span>
                <span style={{ color: tab.id === 'danger' ? (activeTab === tab.id ? '#DC2626' : 'var(--text-secondary)') : 'inherit' }}>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'rc-fadeup 0.25s ease' }} key={activeTab}>
            {/* PROFILE */}
            {activeTab === 'profile' && (
              <>
                <Card>
                  <SectionTitle icon={<Icons.Camera />} title="Profile Photo" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 84, height: 84, borderRadius: 24, background: 'var(--color-espresso)', color: 'var(--color-ochre)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, overflow: 'hidden' }}>
                        {photoUrl ? <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(profileForm.name || user?.email || '?')}
                      </div>
                      <div onClick={() => !photoUploading && photoInputRef.current?.click()} style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: 'var(--color-ochre)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: photoUploading ? 'wait' : 'pointer', border: '3px solid var(--bg-secondary)' }}>
                        {photoUploading ? <Icons.Loader /> : <Icons.Camera />}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 10px' }}>JPG, PNG or WebP · Max 2MB</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Btn label={photoUploading ? 'Uploading…' : 'Upload Photo'} onClick={() => photoInputRef.current?.click()} disabled={photoUploading} primary />
                        {photoUrl && <Btn label="Remove" onClick={removePhoto} />}
                      </div>
                    </div>
                  </div>
                  <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />
                </Card>
                <Card>
                  <SectionTitle icon={<Icons.User />} title="Personal Information" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Full Name" value={profileForm.name} onChange={v => setProfileForm(p => ({ ...p, name: v }))} placeholder="Your full name" required />
                    <Field label="Phone" value={profileForm.phone} onChange={v => setProfileForm(p => ({ ...p, phone: v }))} placeholder="+1 234 567 890" type="tel" />
                    <Field label="Email" value={profileForm.email} onChange={v => setProfileForm(p => ({ ...p, email: v }))} placeholder="you@example.com" type="email" />
                    <Field label="Role" value={fullProfile?.role || ''} onChange={() => {}} disabled />
                  </div>
                  {profileForm.email !== user?.email && profileForm.email && <Banner icon="info" text="A confirmation link will be sent to your new email." />}
                </Card>
                <SaveBar status={saveStatus} onSave={saveProfile} />
              </>
            )}

            {/* AGENCY */}
            {activeTab === 'agency' && (
              <>
                <Card>
                  <SectionTitle icon={<Icons.Settings />} title="Agency Details" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Agency Name" value={agencyForm.name} onChange={v => setAgencyForm(p => ({ ...p, name: v }))} required />
                    <Field label="Phone" value={agencyForm.phone} onChange={v => setAgencyForm(p => ({ ...p, phone: v }))} type="tel" />
                    <Field label="Email" value={agencyForm.email} onChange={v => setAgencyForm(p => ({ ...p, email: v }))} type="email" />
                    <Field label="Country" value={agencyForm.country} onChange={v => setAgencyForm(p => ({ ...p, country: v }))} />
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <Field label="Address" value={agencyForm.address} onChange={v => setAgencyForm(p => ({ ...p, address: v }))} fullWidth />
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <Field label="Description" value={agencyForm.description} onChange={v => setAgencyForm(p => ({ ...p, description: v }))} textarea fullWidth />
                  </div>
                </Card>
                <Card>
                  <SectionTitle icon={<Icons.Globe />} title="Agency Logo" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 16, background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {logoUrl ? <img src={logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} /> : <span style={{ color: 'var(--text-tertiary)', fontSize: 11, fontWeight: 600 }}>No logo</span>}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 10px' }}>PNG, SVG, JPG · Max 2MB</p>
                      <Btn label={logoUploading ? 'Uploading…' : 'Upload Logo'} onClick={() => logoInputRef.current?.click()} disabled={logoUploading} primary />
                    </div>
                  </div>
                  <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoSelect} style={{ display: 'none' }} />
                </Card>
                <Card>
                  <SectionTitle icon={<Icons.CreditCard />} title="Current Plan" />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-tertiary)', borderRadius: 14, border: '1px solid var(--border-secondary)' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: 0, textTransform: 'capitalize' }}>{(agency as any)?.plan || 'Trial'} Plan</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '3px 0 0' }}>
                        Status: <span style={{ fontWeight: 600, color: (agency as any)?.plan_status === 'active' ? 'var(--color-sage)' : 'var(--color-ochre)' }}>{(agency as any)?.plan_status || 'trial'}</span>
                        {(agency as any)?.trial_ends_at && ` · Expires ${new Date((agency as any).trial_ends_at).toLocaleDateString()}`}
                      </p>
                    </div>
                    <a href="/dashboard/billing" style={{ padding: '9px 16px', fontSize: 13, fontWeight: 700, color: 'var(--color-cream)', background: 'var(--color-espresso)', borderRadius: 10, textDecoration: 'none' }}>Upgrade Plan</a>
                  </div>
                </Card>
                <SaveBar status={saveStatus} onSave={saveAgency} />
              </>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <Card>
                <SectionTitle icon={<Icons.Bell />} title="Notification Preferences" />
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 16, marginTop: -8 }}>Preferences synced to your account.</p>
                {!notifPrefsLoaded ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 40, color: 'var(--text-tertiary)' }}><Icons.Loader /> Loading…</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {([
                      { key: 'new_lead' as const, label: 'New lead assigned', desc: 'When a new lead is assigned to you', channels: ['email', 'push'] },
                      { key: 'appointment_reminder' as const, label: 'Appointment reminders', desc: 'Before upcoming viewings', channels: ['email', 'push', 'sms'] },
                      { key: 'deal_stage_change' as const, label: 'Deal stage changes', desc: 'When a deal moves stages', channels: ['email', 'push'] },
                      { key: 'team_activity' as const, label: 'Team activity', desc: 'Teammates update leads/properties', channels: ['email'] },
                      { key: 'weekly_digest' as const, label: 'Weekly digest', desc: 'Weekly performance summary', channels: ['email'] },
                      { key: 'marketing_updates' as const, label: 'Product updates', desc: 'News, tips, features', channels: ['email'] },
                    ]).map(item => (
                      <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: notifPrefs[item.key] ? 'var(--bg-tertiary)' : 'transparent', border: '1px solid var(--border-secondary)', opacity: notifPrefs[item.key] ? 1 : 0.6, transition: 'all 0.2s ease' }}>
                        <Toggle checked={notifPrefs[item.key]} onChange={() => toggleNotifPref(item.key)} color="var(--color-sage)" />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{item.label}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{item.desc}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {['email', 'push', 'sms'].map(ch => {
                            const active = item.channels.includes(ch as any)
                            return <span key={ch} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: active ? 'var(--bg-hover)' : 'transparent', color: active ? 'var(--text-secondary)' : 'var(--text-tertiary)', opacity: active ? 1 : 0.3 }}>{ch}</span>
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* TEAM */}
            {activeTab === 'team' && (
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <SectionTitle icon={<Icons.Users />} title="Team Members" style={{ margin: 0 }} />
                  <Btn label="Invite Member" icon={<Icons.Plus />} onClick={() => setShowInviteForm(v => !v)} primary small />
                </div>
                {showInviteForm && (
                  <div style={{ padding: 16, marginBottom: 16, borderRadius: 14, background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', animation: 'rc-fadeup 0.2s ease' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 12px' }}>Invite a team member</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'end' }}>
                      <Field label="Email Address" value={inviteEmail} onChange={setInviteEmail} placeholder="colleague@example.com" type="email" fullWidth />
                      <div><label style={labelStyle}>Role</label><select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ padding: '11px 14px', fontSize: 13, background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: 14, color: 'var(--text-primary)', cursor: 'pointer' }}><option value="agent">Agent</option><option value="owner">Owner</option></select></div>
                      <Btn label={inviteSending ? 'Sending…' : 'Send Invite'} onClick={sendInvite} disabled={inviteSending} primary />
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>They'll receive a magic link to sign up.</p>
                  </div>
                )}
                {teamLoading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40, color: 'var(--text-tertiary)' }}><Icons.Loader /> Loading…</div>
                : teamMembers.length === 0 ? <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-tertiary)', fontSize: 14 }}>No team members yet.</div>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{teamMembers.map(member => {
                    const isSelf = member.id === fullProfile?.id
                    return (
                      <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: isSelf ? 'var(--color-espresso)' : 'var(--bg-hover)', color: isSelf ? 'var(--color-ochre)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, overflow: 'hidden' }}>
                          {member.photo_url ? <img src={member.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(member.name || '?')}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{member.name} {isSelf && <span style={{ fontSize: 11, color: 'var(--color-sage)', fontWeight: 700 }}>(you)</span>}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0', textTransform: 'capitalize' }}>{member.role} · Joined {new Date(member.created_at).toLocaleDateString()}</p>
                        </div>
                        {!isSelf && <>
                          <select value={member.role} onChange={e => updateMemberRole(member.id, e.target.value)} style={{ padding: '6px 10px', fontSize: 12, fontWeight: 600, background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer' }}><option value="agent">Agent</option><option value="owner">Owner</option></select>
                          <button onClick={() => removeMember(member.id, member.name)} style={{ padding: 8, borderRadius: 8, background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)', cursor: 'pointer', color: '#DC2626', display: 'flex' }}><Icons.X /></button>
                        </>}
                      </div>
                    )
                  })}</div>
                }
              </Card>
            )}

            {/* SECURITY */}
            {activeTab === 'security' && (
              <>
                <Card>
                  <SectionTitle icon={<Icons.Key />} title="Change Password" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <PasswordField label="New Password" value={passwords.new_pass} onChange={v => setPasswords(p => ({ ...p, new_pass: v }))} show={showPasswords.new_pass} onToggle={() => setShowPasswords(p => ({ ...p, new_pass: !p.new_pass }))} placeholder="Min. 8 characters" />
                    <PasswordField label="Confirm Password" value={passwords.confirm} onChange={v => setPasswords(p => ({ ...p, confirm: v }))} show={showPasswords.confirm} onToggle={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))} placeholder="Repeat password" />
                    {passwords.new_pass && passwords.confirm && passwords.new_pass !== passwords.confirm && <Banner icon="warning" text="Passwords do not match." />}
                    {passwords.new_pass.length > 0 && passwords.new_pass.length < 8 && <Banner icon="warning" text="Password must be at least 8 characters." />}
                    <Banner icon="info" text="Supabase handles secure password rotation." />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Btn label={passwordSaving ? 'Updating…' : 'Update Password'} onClick={changePassword} disabled={passwordSaving || passwords.new_pass !== passwords.confirm || passwords.new_pass.length < 8} primary />
                    </div>
                  </div>
                </Card>
                <Card>
                  <SectionTitle icon={<Icons.Shield />} title="Account Info" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-secondary)' }}>
                      <div><p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Email</p><p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{user?.email}</p></div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: 'rgba(110,140,100,0.1)', color: 'var(--color-sage)' }}>Verified</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-secondary)' }}>
                      <div><p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>User ID</p><p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0', fontFamily: 'monospace' }}>{user?.id}</p></div>
                    </div>
                  </div>
                </Card>
                <Card>
                  <SectionTitle icon={<Icons.Shield />} title="Sessions" />
                  <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 14, border: '1px solid var(--border-secondary)', marginBottom: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-sage)', flexShrink: 0, marginRight: 10 }} />
                    <div><p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Current Session <span style={{ fontSize: 11, color: 'var(--color-sage)', fontWeight: 700 }}>Active now</span></p><p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'} · {Intl.DateTimeFormat().resolvedOptions().timeZone}</p></div>
                  </div>
                  <button onClick={revokeAllSessions} style={{ width: '100%', padding: '11px', fontSize: 13, fontWeight: 600, color: '#DC2626', background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 12, cursor: 'pointer' }}>Sign Out All Other Devices</button>
                </Card>
              </>
            )}

            {/* INTEGRATIONS */}
            {activeTab === 'integrations' && (
              <Card>
                <SectionTitle icon={<Icons.Zap />} title="Connected Apps" />
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 16, marginTop: -8 }}>OAuth integrations require backend setup via Supabase Edge Functions.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { name: 'Google Calendar', desc: 'Sync appointments and reminders', connected: false, icon: <Icons.Calendar /> },
                    { name: 'Gmail', desc: 'Send/receive lead emails in-app', connected: false, icon: <Icons.Mail /> },
                    { name: 'WhatsApp Business', desc: 'Message leads via WhatsApp', connected: false, icon: <Icons.Globe /> },
                    { name: 'Stripe', desc: 'Process commission payments', connected: false, icon: <Icons.CreditCard /> },
                    { name: 'Zapier', desc: 'Connect 5000+ apps via webhooks', connected: false, icon: <Icons.Zap /> },
                    { name: 'Salesforce', desc: 'Two-way sync leads/contacts', connected: false, icon: <Icons.Database /> },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: item.connected ? 'rgba(110,140,100,0.08)' : 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.connected ? 'var(--color-sage)' : 'var(--text-tertiary)', flexShrink: 0 }}>{item.icon}</div>
                      <div style={{ flex: 1 }}><p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{item.name}</p><p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{item.desc}</p></div>
                      <button onClick={() => toast('OAuth requires backend setup. See docs.', { icon: 'ℹ️' })} style={{ padding: '8px 14px', fontSize: 12, fontWeight: 600, borderRadius: 10, cursor: 'pointer', color: item.connected ? 'var(--text-secondary)' : 'var(--color-cream)', background: item.connected ? 'var(--bg-hover)' : 'var(--color-espresso)', border: item.connected ? '1px solid var(--border-secondary)' : 'none' }}>{item.connected ? 'Disconnect' : 'Connect'}</button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* DANGER ZONE */}
            {activeTab === 'danger' && (
              <Card>
                <SectionTitle icon={<Icons.Trash />} title="Danger Zone" danger />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <DangerItem title="Archive All Active Leads" desc="Set all leads to 'archived'. Reversible." actionLabel={dangerLoading === 'archive' ? 'Archiving…' : 'Archive Leads'} color="#D9AF28" onAction={archiveAllLeads} disabled={dangerLoading !== null} />
                  <div style={{ padding: 16, borderRadius: 14, background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div><p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Export All Data</p><p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>Download all agency data as JSON.</p></div>
                      <button onClick={exportAllData} disabled={exportLoading} style={{ padding: '9px 14px', fontSize: 12, fontWeight: 700, color: '#fff', background: '#3B82F6', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: exportLoading ? 0.6 : 1, whiteSpace: 'nowrap' }}>{exportLoading ? <Icons.Loader /> : <Icons.Download />}{exportLoading ? 'Exporting…' : 'Export JSON'}</button>
                    </div>
                  </div>
                  <div style={{ padding: 16, borderRadius: 14, background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.2)' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>Delete Agency</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 14px' }}>Permanently delete agency and all data. Irreversible.</p>
                    {!showDeleteConfirm ? (
                      <button onClick={() => setShowDeleteConfirm(true)} style={{ padding: '9px 16px', fontSize: 12, fontWeight: 700, color: '#fff', background: '#DC2626', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Icons.AlertTriangle /> Delete Agency</button>
                    ) : (
                      <div style={{ animation: 'rc-fadeup 0.2s ease' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', margin: '0 0 8px' }}>Type agency name: <code style={{ fontFamily: 'monospace', background: 'rgba(220,38,38,0.08)', padding: '2px 6px', borderRadius: 4 }}>{agency?.name}</code></p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder={agency?.name || 'Agency name'} className="rc-input" style={{ flex: 1, padding: '10px 14px', fontSize: 13, background: 'var(--bg-secondary)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 10, color: 'var(--text-primary)' }} />
                          <button onClick={deleteAgency} disabled={confirmText !== agency?.name || dangerLoading === 'delete'} style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#fff', background: '#DC2626', border: 'none', borderRadius: 10, cursor: 'pointer', opacity: confirmText !== agency?.name ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>{dangerLoading === 'delete' ? <Icons.Loader /> : null}{dangerLoading === 'delete' ? 'Deleting…' : 'Confirm Delete'}</button>
                          <button onClick={() => { setShowDeleteConfirm(false); setConfirmText('') }} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)', borderRadius: 10, cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Reusable Components ───────────────────────────────────────────────────────

const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'var(--bg-secondary)', borderRadius: 24, padding: 24, border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)' }}>{children}</div>
)

const SectionTitle = ({ icon, title, danger, style }: { icon: React.ReactNode; title: string; danger?: boolean; style?: React.CSSProperties }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, ...style }}>
    <div style={{ width: 36, height: 36, borderRadius: 12, background: danger ? 'rgba(220,38,38,0.06)' : 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: danger ? '#DC2626' : 'var(--text-secondary)' }}>{icon}</div>
    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
  </div>
)

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }

const Field = ({ label, value, onChange, placeholder, type = 'text', required, textarea, fullWidth, disabled }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean; textarea?: boolean; fullWidth?: boolean; disabled?: boolean }) => (
  <div style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
    <label style={labelStyle}>{label}{required && <span style={{ color: 'var(--color-terracotta)', marginLeft: 3 }}>*</span>}</label>
    {textarea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} disabled={disabled} className="rc-input" style={{ width: '100%', padding: '11px 14px', fontSize: 13, fontWeight: 500, background: disabled ? 'var(--bg-hover)' : 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: 14, color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className="rc-input" style={{ width: '100%', padding: '11px 14px', fontSize: 13, fontWeight: 500, background: disabled ? 'var(--bg-hover)' : 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: 14, color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)', boxSizing: 'border-box' }} />
    )}
  </div>
)

const PasswordField = ({ label, value, onChange, show, onToggle, placeholder }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder?: string }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div style={{ position: 'relative' }}>
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="rc-input" style={{ width: '100%', padding: '11px 42px 11px 14px', fontSize: 13, fontWeight: 500, background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: 14, color: 'var(--text-primary)', boxSizing: 'border-box' }} />
      <button type="button" onClick={onToggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 4 }}>{show ? <Icons.EyeOff /> : <Icons.Eye />}</button>
    </div>
  </div>
)

const Toggle = ({ checked, onChange, color }: { checked: boolean; onChange: () => void; color: string }) => (
  <div onClick={onChange} style={{ width: 46, height: 26, borderRadius: 100, flexShrink: 0, background: checked ? color : 'var(--border-secondary)', cursor: 'pointer', position: 'relative', transition: 'background 0.25s ease' }}>
    <div style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.18)', transition: 'left 0.25s ease' }} />
  </div>
)

const Btn = ({ label, onClick, primary, disabled, icon, small }: { label: string; onClick: () => void; primary?: boolean; disabled?: boolean; icon?: React.ReactNode; small?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className="rc-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: small ? '8px 14px' : '10px 18px', fontSize: small ? 12 : 13, fontWeight: 700, borderRadius: 11, cursor: 'pointer', color: primary ? 'var(--color-cream)' : 'var(--text-secondary)', background: primary ? 'var(--color-espresso)' : 'var(--bg-hover)', border: primary ? 'none' : '1px solid var(--border-secondary)', opacity: disabled ? 0.5 : 1 }}>{icon}{label}</button>
)

const Banner = ({ icon, text }: { icon: 'info' | 'warning'; text: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', borderRadius: 12, background: icon === 'warning' ? 'rgba(220,38,38,0.04)' : 'rgba(110,140,100,0.05)', border: `1px solid ${icon === 'warning' ? 'rgba(220,38,38,0.15)' : 'rgba(110,140,100,0.15)'}` }}>
    <span style={{ color: icon === 'warning' ? '#DC2626' : 'var(--color-sage)', flexShrink: 0, marginTop: 1 }}>{icon === 'warning' ? <Icons.AlertTriangle /> : <Icons.Info />}</span>
    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>{text}</p>
  </div>
)

const DangerItem = ({ title, desc, actionLabel, color, onAction, disabled }: { title: string; desc: string; actionLabel: string; color: string; onAction: () => void; disabled?: boolean }) => (
  <div style={{ padding: 16, borderRadius: 14, background: `${color}08`, border: `1px solid ${color}20` }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div><p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{title}</p><p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{desc}</p></div>
      <button onClick={onAction} disabled={disabled} style={{ padding: '9px 14px', fontSize: 12, fontWeight: 700, color: '#fff', background: color, border: 'none', borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, opacity: disabled ? 0.5 : 1 }}>{actionLabel}</button>
    </div>
  </div>
)

const SaveBar = ({ status, onSave }: { status: string; onSave: () => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, padding: '14px 18px', background: 'var(--bg-secondary)', borderRadius: 18, border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)' }}>
    {status === 'saved' && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-sage)', fontWeight: 600 }}><Icons.Check /> Saved</span>}
    <Btn label={status === 'saving' ? 'Saving…' : 'Save Changes'} onClick={onSave} disabled={status === 'saving'} primary />
  </div>
)

export default Settings