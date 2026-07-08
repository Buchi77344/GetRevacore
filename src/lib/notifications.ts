// src/lib/notifications.ts
// Production notification system — connected to Supabase
import toast from 'react-hot-toast'
import { supabase } from './supabase'

export type NotificationType = 'success' | 'error' | 'loading' | 'info'

interface NotificationOptions {
  duration?: number
  id?: string
  addToModal?: boolean // Add to notification modal
}

// ─── In-app sound system ──────────────────────────────────────────────────────
const generateNotificationSound = (frequency: number = 800, duration: number = 200): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration / 1000)

      setTimeout(resolve, duration)
    } catch (error) {
      console.error('Failed to generate notification sound:', error)
      resolve()
    }
  })
}

// ─── Persist to Supabase ──────────────────────────────────────────────────────
export interface SupabaseNotification {
  user_id: string
  type: 'new_lead' | 'lead_update' | 'appointment_reminder' | 'deal_update' | 'system' | 'team' | 'info'
  title: string
  message?: string
  data?: Record<string, any>
  channel?: 'in_app' | 'email' | 'sms'
}

/**
 * Insert a notification into the Supabase `notifications` table.
 * This is the source of truth — all platform notifications go here.
 */
export async function insertNotification(
  userId: string,
  type: SupabaseNotification['type'],
  title: string,
  message?: string,
  data?: Record<string, any>,
): Promise<string | null> {
  if (!userId) return null

  try {
    const { data: inserted, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message: message || null,
        data: data || null,
        channel: 'in_app',
        is_read: false,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[Notifications] Insert error:', error)
      return null
    }

    return inserted?.id || null
  } catch (err) {
    console.error('[Notifications] Insert unexpected error:', err)
    return null
  }
}

/**
 * Insert a notification for all agents of a given agency
 */
export async function insertAgencyNotification(
  agencyId: string,
  type: SupabaseNotification['type'],
  title: string,
  message?: string,
  data?: Record<string, any>,
  excludeUserId?: string,
): Promise<void> {
  try {
    // Get all user IDs for this agency
    const { data: profiles } = await supabase
      .from('agent_profiles')
      .select('user_id')
      .eq('agency_id', agencyId)

    if (!profiles || profiles.length === 0) return

    const notifications = profiles
      .filter(p => p.user_id !== excludeUserId)
      .map(p => ({
        user_id: p.user_id,
        type,
        title,
        message: message || null,
        data: data || null,
        channel: 'in_app',
        is_read: false,
      }))

    if (notifications.length === 0) return

    const { error } = await supabase.from('notifications').insert(notifications)
    if (error) console.error('[Notifications] Agency insert error:', error)
  } catch (err) {
    console.error('[Notifications] Agency insert unexpected error:', err)
  }
}

/**
 * Fetch notifications for a user
 */
export async function fetchNotifications(
  userId: string,
  limit = 20,
  offset = 0,
): Promise<{
  notifications: any[]
  unreadCount: number
  totalCount: number
}> {
  try {
    const { data, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      notifications: data || [],
      unreadCount: (data || []).filter(n => !n.is_read).length,
      totalCount: count || 0,
    }
  } catch (err) {
    console.error('[Notifications] Fetch error:', err)
    return { notifications: [], unreadCount: 0, totalCount: 0 }
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error
    return true
  } catch (err) {
    console.error('[Notifications] Mark read error:', err)
    return false
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsRead(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return true
  } catch (err) {
    console.error('[Notifications] Mark all read error:', err)
    return false
  }
}

/**
 * Fetch unread count for a user
 */
export async function fetchUnreadCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return count || 0
  } catch {
    return 0
  }
}

// ─── Current user ID cache — set by AuthProvider ──────────────────────────────
let currentUserId: string | null = null
export function setCurrentUserId(id: string | null) {
  currentUserId = id
}

// ─── Centralized notification handler ─────────────────────────────────────────
export const notify = {
  // ── Success Notifications ───────────────────────────────────────
  success: (message: string, options?: NotificationOptions) => {
    const id = toast.success(message, {
      duration: options?.duration ?? 3000,
      id: options?.id,
    })
    if (options?.addToModal !== false && currentUserId) {
      insertNotification(currentUserId, 'info', 'Success', message).catch(() => {})
      generateNotificationSound(800, 150)
    }
    return id
  },

  // ── Error Notifications ─────────────────────────────────────────
  error: (message: string, options?: NotificationOptions) => {
    const id = toast.error(message, {
      duration: options?.duration ?? 4000,
      id: options?.id,
    })
    if (options?.addToModal !== false && currentUserId) {
      insertNotification(currentUserId, 'system', 'Error', message).catch(() => {})
      generateNotificationSound(300, 250)
    }
    return id
  },

  // ── Loading Notifications ───────────────────────────────────────
  loading: (message: string, options?: NotificationOptions) => {
    const id = toast.loading(message, {
      id: options?.id,
    })
    return id
  },

  // ── Info/Default Notifications ──────────────────────────────────
  info: (message: string, options?: NotificationOptions) => {
    const id = toast(message, {
      duration: options?.duration ?? 3000,
      id: options?.id,
    })
    if (options?.addToModal !== false && currentUserId) {
      insertNotification(currentUserId, 'info', 'Info', message).catch(() => {})
      generateNotificationSound(600, 150)
    }
    return id
  },

  // ── Promise-based notifications (for async operations) ──────────
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    },
    options?: NotificationOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        id: options?.id,
      }
    )
  },

  // ── Update existing notification ────────────────────────────────
  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.remove(toastId)
    }
  },
}

// ─── Helper: Insert a "new_lead" notification ─────────────────────────────────
export async function notifyNewLead(userId: string, leadName: string, leadId: string, agencyId: string) {
  await insertNotification(
    userId,
    'new_lead',
    `New lead: ${leadName}`,
    `A new lead "${leadName}" has been added to your pipeline.`,
    { lead_id: leadId, agency_id: agencyId },
  )
  // Also notify all agents in the agency
  await insertAgencyNotification(
    agencyId,
    'new_lead',
    `New lead: ${leadName}`,
    `"${leadName}" has been added to the pipeline.`,
    { lead_id: leadId },
    userId, // exclude the creator
  )
  generateNotificationSound(800, 200)
}

// ─── Helper: Insert an "appointment_reminder" notification ────────────────────
export async function notifyAppointment(
  userId: string,
  leadName: string,
  appointmentDate: string,
  appointmentId: string,
  agencyId: string,
) {
  await insertNotification(
    userId,
    'appointment_reminder',
    `Appointment with ${leadName}`,
    `Scheduled for ${appointmentDate}.`,
    { appointment_id: appointmentId, lead_name: leadName, agency_id: agencyId },
  )
  await insertAgencyNotification(
    agencyId,
    'appointment_reminder',
    `Appointment: ${leadName}`,
    `An appointment has been scheduled with ${leadName} on ${appointmentDate}.`,
    { appointment_id: appointmentId, lead_name: leadName },
    userId,
  )
  generateNotificationSound(600, 200)
}

// ─── Helper: Insert a "deal_update" notification ──────────────────────────────
export async function notifyDealUpdate(
  userId: string,
  dealName: string,
  stage: string,
  dealId: string,
  agencyId: string,
) {
  await insertNotification(
    userId,
    'deal_update',
    `Deal update: ${dealName}`,
    `Moved to "${stage}" stage.`,
    { deal_id: dealId, stage, agency_id: agencyId },
  )
  await insertAgencyNotification(
    agencyId,
    'deal_update',
    `Deal update: ${dealName}`,
    `Stage changed to "${stage}".`,
    { deal_id: dealId, stage },
    userId,
  )
  generateNotificationSound(700, 250)
}

// ─── Helper: System notification ──────────────────────────────────────────────
export async function notifySystem(userId: string, title: string, message: string, data?: Record<string, any>) {
  await insertNotification(userId, 'system', title, message, data)
  generateNotificationSound(500, 300)
}

// ============================================================================
// SPECIFIC NOTIFICATION MESSAGES - Organized by Feature
// ============================================================================

export const notifications = {
  // ── AUTH / SIGNUP ───────────────────────────────────────────────
  auth: {
    signupSuccess: () => notify.success('Account created! Welcome to RevaCore 🎉'),
    signupError: (error: string) => notify.error(`Signup failed: ${error}`),
    loginSuccess: () => notify.success('Welcome back!'),
    loginError: () => notify.error('Invalid email or password'),
    logoutSuccess: () => notify.success('Logged out successfully'),
    sessionExpired: () => notify.error('Session expired. Please sign in again.'),
    emailVerification: () => notify.info('Check your email to verify your account'),
    passwordReset: () => notify.success('Password reset email sent'),
    passwordResetError: () => notify.error('Failed to reset password'),
  },

  // ── LEADS ───────────────────────────────────────────────────────
  leads: {
    created: (name: string) => notify.success(`Lead "${name}" added successfully`),
    createError: (error: string) => notify.error(`Failed to add lead: ${error}`),
    updated: (name: string) => notify.success(`Lead "${name}" updated`),
    updateError: () => notify.error('Failed to update lead'),
    deleted: () => notify.success('Lead deleted'),
    deleteError: () => notify.error('Failed to delete lead'),
    imported: (count: number) => notify.success(`${count} lead${count > 1 ? 's' : ''} imported`),
    importError: (error: string) => notify.error(`Import failed: ${error}`),
    assigned: (agent: string) => notify.success(`Assigned to ${agent}`),
    statusChanged: (status: string) => notify.success(`Status changed to ${status}`),
    bulkAction: (action: string, count: number) => notify.success(`${action} ${count} lead${count > 1 ? 's' : ''}`),
  },

  // ── PROPERTIES ──────────────────────────────────────────────────
  properties: {
    created: (title: string) => notify.success(`Property "${title}" listed`),
    createError: () => notify.error('Failed to list property'),
    updated: (title: string) => notify.success(`Property "${title}" updated`),
    updateError: () => notify.error('Failed to update property'),
    deleted: () => notify.success('Property removed'),
    deleteError: () => notify.error('Failed to delete property'),
    published: () => notify.success('Property published'),
    unpublished: () => notify.success('Property unlisted'),
    synced: (count: number) => notify.success(`Synced ${count} properties`),
    syncError: (error: string) => notify.error(`Sync failed: ${error}`),
    imageAdded: () => notify.success('Image added'),
    imageRemoved: () => notify.success('Image removed'),
  },

  // ── APPOINTMENTS ────────────────────────────────────────────────
  appointments: {
    created: (date: string) => notify.success(`Appointment scheduled for ${date}`),
    createError: () => notify.error('Failed to schedule appointment'),
    updated: () => notify.success('Appointment updated'),
    updateError: () => notify.error('Failed to update appointment'),
    deleted: () => notify.success('Appointment cancelled'),
    deleteError: () => notify.error('Failed to cancel appointment'),
    rescheduled: (date: string) => notify.success(`Rescheduled to ${date}`),
    reminderSent: () => notify.info('Reminder sent to attendee'),
    conflict: () => notify.error('Time conflict with another appointment'),
  },

  // ── DEALS ───────────────────────────────────────────────────────
  deals: {
    created: () => notify.success('Deal added to pipeline'),
    createError: () => notify.error('Failed to create deal'),
    updated: () => notify.success('Deal updated'),
    updateError: () => notify.error('Failed to update deal'),
    deleted: () => notify.success('Deal removed'),
    deleteError: () => notify.error('Failed to delete deal'),
    moved: (stage: string) => notify.success(`Moved to ${stage}`),
    moveError: () => notify.error('Failed to move deal'),
    closed: (value: string) => notify.success(`Deal closed: ${value}`),
    reopened: () => notify.success('Deal reopened'),
    analysisDone: () => notify.success('Deal analysis complete'),
    analysisError: () => notify.error('Failed to analyze deal'),
  },

  // ── PIPELINE ────────────────────────────────────────────────────
  pipeline: {
    stageAdded: (name: string) => notify.success(`Stage "${name}" added`),
    stageUpdated: () => notify.success('Stage updated'),
    stageDeleted: () => notify.success('Stage deleted'),
    stageError: () => notify.error('Failed to update pipeline stage'),
    allDealsExported: () => notify.success('Pipeline exported successfully'),
    exportError: () => notify.error('Failed to export pipeline'),
  },

  // ── MARKETING ───────────────────────────────────────────────────
  marketing: {
    contentCreated: () => notify.success('Marketing content created'),
    contentError: () => notify.error('Failed to create content'),
    emailSent: (count: number) => notify.success(`Email sent to ${count} recipient${count > 1 ? 's' : ''}`),
    emailError: (count?: number) => {
      if (count) {
        notify.error(`Failed to send ${count} email${count > 1 ? 's' : ''}`)
      } else {
        notify.error('Failed to send email')
      }
    },
    campaignCreated: (name: string) => notify.success(`Campaign "${name}" created`),
    campaignUpdated: () => notify.success('Campaign updated'),
    campaignLaunched: () => notify.success('Campaign launched'),
    campaignPaused: () => notify.success('Campaign paused'),
    campaignError: () => notify.error('Campaign operation failed'),
  },

  // ── SETTINGS ────────────────────────────────────────────────────
  settings: {
    saved: (setting: string) => notify.success(`${setting} updated`),
    saveError: (setting: string) => notify.error(`Failed to update ${setting}`),
    profileUpdated: () => notify.success('Profile updated successfully'),
    passwordChanged: () => notify.success('Password changed successfully'),
    passwordError: () => notify.error('Failed to change password'),
    themeChanged: (theme: string) => notify.success(`Switched to ${theme} mode`),
    notificationsUpdated: () => notify.success('Notification preferences updated'),
  },

  // ── BILLING ─────────────────────────────────────────────────────
  billing: {
    planUpgraded: (plan: string) => notify.success(`Upgraded to ${plan} plan`),
    planDowngraded: (plan: string) => notify.success(`Downgraded to ${plan} plan`),
    paymentError: () => notify.error('Payment failed. Please try again.'),
    invoiceDownloaded: () => notify.success('Invoice downloaded'),
    invoiceError: () => notify.error('Failed to download invoice'),
    trialEnding: (days: number) => notify.info(`Trial ends in ${days} days`),
    trialEnded: () => notify.error('Trial has ended. Please upgrade.'),
  },

  // ── AI Features ─────────────────────────────────────────────────
  ai: {
    analyzing: () => notify.loading('Analyzing...'),
    analyzeSuccess: () => notify.success('Analysis complete'),
    analyzeError: () => notify.error('Failed to analyze'),
    generatingContent: () => notify.loading('Generating content...'),
    contentGenerated: () => notify.success('Content generated'),
    generateError: () => notify.error('Failed to generate content'),
    scoringLead: () => notify.loading('Scoring lead...'),
    leadScored: (score: string) => notify.success(`Lead scored: ${score}`),
    scoreError: () => notify.error('Failed to score lead'),
    draftCreated: () => notify.success('Draft created'),
    emailSending: () => notify.loading('Sending email...'),
    emailSent: () => notify.success('Email sent'),
  },

  // ── GENERAL ACTIONS ────────────────────────────────────────────
  general: {
    saved: () => notify.success('Saved successfully'),
    saveError: () => notify.error('Failed to save'),
    deleted: () => notify.success('Deleted successfully'),
    deleteError: () => notify.error('Failed to delete'),
    copied: () => notify.success('Copied to clipboard'),
    copyError: () => notify.error('Failed to copy'),
    networkError: () => notify.error('Network error. Please check your connection.'),
    timeout: () => notify.error('Request timed out. Please try again.'),
    unauthorized: () => notify.error('Unauthorized. Please log in again.'),
    notFound: () => notify.error('Item not found'),
    alreadyExists: () => notify.error('This item already exists'),
    requiredField: (field: string) => notify.error(`${field} is required`),
    invalidFormat: (field: string) => notify.error(`${field} format is invalid`),
    validationError: (error: string) => notify.error(`Validation error: ${error}`),
  },
}