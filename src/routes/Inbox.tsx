"use client";

import { useState, useMemo, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ─── Types ────────────────────────────────────────────────────────────────────

type ChannelType = 'email' | 'whatsapp' | 'sms'
type ChannelTab = 'all' | 'email' | 'whatsapp'

interface Conversation {
  id: string
  leadId: string
  name: string
  email: string
  phone?: string
  avatarInitials: string
  channel: ChannelType
  lastMessage: string
  lastMessageAt: string
  lastMessageFrom: 'lead' | 'agent' | 'ai'
  unread: number
  aiScore: 'hot' | 'warm' | 'cold' | 'pending' | null
  aiPoints?: number
  status: string
}

interface Message {
  id: string
  from: 'lead' | 'agent' | 'ai'
  channel: ChannelType
  content: string
  timestamp: string
  attachments?: { name: string; size: string }[]
}

interface AiDraft {
  id: string
  subject?: string
  body: string
  created_at: string
}

interface LeadAiData {
  ai_summary?: string
  ai_score?: 'hot' | 'warm' | 'cold' | 'pending' | null
  ai_points?: number
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

const Icons = {
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  WhatsApp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Sms: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  CheckDouble: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 6 9 18 4 13"/><polyline points="20 6 12 18 9 15"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Brain: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 017 4.5v1A2.5 2.5 0 009.5 8h5A2.5 2.5 0 0017 5.5v-1A2.5 2.5 0 0014.5 2h-5z"/><path d="M9 8v8m6-8v8M5.5 12A2.5 2.5 0 003 14.5v1A2.5 2.5 0 005.5 18h.5m12.5-6a2.5 2.5 0 012.5 2.5v1A2.5 2.5 0 0118.5 18H18M9 16h6m-3 0v4"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  ),
  MoreVertical: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
    </svg>
  ),
  Paperclip: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
    </svg>
  ),
  Loader: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'inbox-spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Target: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const now = new Date(), date = new Date(dateString)
  const s = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (s < 60) return 'now'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  if (s < 604800) return `${Math.floor(s / 86400)}d`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ─── Score Config ──────────────────────────────────────────────────────────────

const scoreConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  hot:     { label: 'Hot',  bg: 'rgba(220,38,38,0.08)',   text: '#DC2626', dot: '#DC2626' },
  warm:    { label: 'Warm', bg: 'rgba(217,119,6,0.08)',   text: '#D97706', dot: '#D97706' },
  cold:    { label: 'Cold', bg: 'rgba(59,130,246,0.08)',  text: '#3B82F6', dot: '#3B82F6' },
  pending: { label: '...',  bg: 'rgba(100,100,100,0.06)', text: '#888',    dot: '#888' },
}

const channelColors: Record<ChannelType, { bg: string; text: string; iconBg: string }> = {
  email:    { bg: 'rgba(99,143,179,0.1)',  text: '#638fb3', iconBg: '#638fb3' },
  whatsapp: { bg: 'rgba(37,211,102,0.1)',  text: '#25D366', iconBg: '#25D366' },
  sms:      { bg: 'rgba(124,58,237,0.1)',  text: '#7C3AED', iconBg: '#7C3AED' },
}

// ─── Channel Icon ──────────────────────────────────────────────────────────────

function ChannelIcon({ channel, size = 16 }: { channel: ChannelType; size?: number }) {
  const colors = channelColors[channel]
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, borderRadius: 4,
        background: colors.bg, color: colors.text,
        flexShrink: 0,
      }}
      title={channel.charAt(0).toUpperCase() + channel.slice(1)}
    >
      {channel === 'email' && <Icons.Mail />}
      {channel === 'whatsapp' && <Icons.WhatsApp />}
      {channel === 'sms' && <Icons.Sms />}
    </span>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

const InboxComponent = () => {
  const [activeChannel, setActiveChannel] = useState<ChannelTab>('all')
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  // Data state
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [aiData, setAiData] = useState<LeadAiData | null>(null)
  const [aiDraft, setAiDraft] = useState<AiDraft | null>(null)
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [loadingAi, setLoadingAi] = useState(false)

  // Realtime channels refs for cleanup
  const messagesChannelRef = useRef<RealtimeChannel | null>(null)
  const convListChannelRef = useRef<RealtimeChannel | null>(null)

  // ── Fetch conversations ──────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true

    const fetchConversations = async () => {
      setLoadingConversations(true)
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            id,
            lead_id,
            last_message,
            last_message_at,
            last_message_from,
            unread_count,
            channel,
            status,
            leads (
              id,
              name,
              email,
              phone,
              ai_score,
              ai_points,
              status
            )
          `)
          .order('last_message_at', { ascending: false })

        if (!isMounted) return

        if (error) {
          console.error('Error fetching conversations:', error)
          setConversations([])
          return
        }

        const mapped: Conversation[] = (data || []).map((row: any) => {
          const lead = row.leads || {}
          return {
            id: row.id,
            leadId: row.lead_id,
            name: lead.name || 'Unknown',
            email: lead.email || '',
            phone: lead.phone,
            avatarInitials: getInitials(lead.name || '?'),
            channel: (row.channel || 'email') as ChannelType,
            lastMessage: row.last_message || '',
            lastMessageAt: row.last_message_at || new Date().toISOString(),
            lastMessageFrom: (row.last_message_from as any) || 'lead',
            unread: row.unread_count || 0,
            aiScore: (lead.ai_score as any) || null,
            aiPoints: lead.ai_points || 0,
            status: lead.status || row.status || 'active',
          }
        })

        setConversations(mapped)
      } catch (e) {
        console.error('Failed to fetch conversations:', e)
        if (isMounted) setConversations([])
      } finally {
        if (isMounted) setLoadingConversations(false)
      }
    }

    fetchConversations()

    return () => {
      isMounted = false
    }
  }, [])

  // ── Realtime: refresh conversation list on new messages ──────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('inbox-conv-list-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          // Re-fetch conversations to update last_message / unread counts
          const refresh = async () => {
            const { data, error } = await supabase
              .from('conversations')
              .select(`
                id,
                lead_id,
                last_message,
                last_message_at,
                last_message_from,
                unread_count,
                channel,
                status,
                leads (
                  id,
                  name,
                  email,
                  phone,
                  ai_score,
                  ai_points,
                  status
                )
              `)
              .order('last_message_at', { ascending: false })

            if (!error && data) {
              setConversations(
                (data || []).map((row: any) => {
                  const lead = row.leads || {}
                  return {
                    id: row.id,
                    leadId: row.lead_id,
                    name: lead.name || 'Unknown',
                    email: lead.email || '',
                    phone: lead.phone,
                    avatarInitials: getInitials(lead.name || '?'),
                    channel: (row.channel || 'email') as ChannelType,
                    lastMessage: row.last_message || '',
                    lastMessageAt: row.last_message_at || new Date().toISOString(),
                    lastMessageFrom: (row.last_message_from as any) || 'lead',
                    unread: row.unread_count || 0,
                    aiScore: (lead.ai_score as any) || null,
                    aiPoints: lead.ai_points || 0,
                    status: lead.status || row.status || 'active',
                  }
                })
              )
            }
          }

          refresh()
        }
      )
      .subscribe()

    convListChannelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // ── Fetch messages + AI data when conversation selected ──────────────────────
  useEffect(() => {
    if (!selectedConvId) {
      setMessages([])
      setAiData(null)
      setAiDraft(null)
      return
    }

    let isMounted = true

    const fetchMessagesAndAi = async () => {
      setLoadingMessages(true)
      setLoadingAi(true)

      try {
        // Mark conversation as read via RPC
        await supabase.rpc('mark_conversation_read', {
          p_conversation_id: selectedConvId,
        })

        // Fetch messages with attachments
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select(`
            id,
            conversation_id,
            from,
            channel,
            content,
            timestamp,
            message_attachments (
              id,
              name,
              size
            )
          `)
          .eq('conversation_id', selectedConvId)
          .order('created_at', { ascending: true })

        if (!isMounted) return

        if (msgError) {
          console.error('Error fetching messages:', msgError)
          setMessages([])
        } else {
          const mapped: Message[] = (msgData || []).map((row: any) => ({
            id: row.id,
            from: row.from as Message['from'],
            channel: (row.channel || 'email') as ChannelType,
            content: row.content || '',
            timestamp: row.timestamp || row.created_at,
            attachments: (row.message_attachments || []).map((att: any) => ({
              name: att.name,
              size: att.size,
            })),
          }))
          setMessages(mapped)
        }

        // Fetch lead AI data
        const selectedConv = conversations.find(c => c.id === selectedConvId)
        const leadId = selectedConv?.leadId

        if (leadId) {
          // Fetch lead row for ai_summary
          const { data: leadRow, error: leadErr } = await supabase
            .from('leads')
            .select('ai_summary, ai_score, ai_points')
            .eq('id', leadId)
            .single()

          if (!isMounted) return

          if (leadErr || !leadRow) {
            console.error('Error fetching lead AI data:', leadErr)
            setAiData(null)
          } else {
            setAiData({
              ai_summary: leadRow.ai_summary || undefined,
              ai_score: leadRow.ai_score || undefined,
              ai_points: leadRow.ai_points || undefined,
            })
          }

          // Fetch latest ai_draft
          const { data: draftRow, error: draftErr } = await supabase
            .from('ai_drafts')
            .select('id, subject, body, created_at')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          if (!isMounted) return

          if (draftErr || !draftRow) {
            console.error('Error fetching AI draft:', draftErr)
            setAiDraft(null)
          } else {
            setAiDraft({
              id: draftRow.id,
              subject: draftRow.subject || undefined,
              body: draftRow.body,
              created_at: draftRow.created_at,
            })
          }
        }
      } catch (e) {
        console.error('Failed to fetch messages/AI data:', e)
        if (isMounted) {
          setMessages([])
          setAiData(null)
          setAiDraft(null)
        }
      } finally {
        if (isMounted) {
          setLoadingMessages(false)
          setLoadingAi(false)
        }
      }
    }

    fetchMessagesAndAi()

    return () => {
      isMounted = false
    }
  }, [selectedConvId, conversations])

  // ── Realtime: new messages in open thread ────────────────────────────────────
  useEffect(() => {
    if (!selectedConvId) {
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current)
        messagesChannelRef.current = null
      }
      return
    }

    const channel = supabase
      .channel(`inbox-messages-${selectedConvId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConvId}`,
        },
        async (payload) => {
          const newRow = payload.new as any

          // Fetch attachments for new message
          const { data: atts } = await supabase
            .from('message_attachments')
            .select('name, size')
            .eq('message_id', newRow.id)

          const msg: Message = {
            id: newRow.id,
            from: newRow.from,
            channel: (newRow.channel || 'email') as ChannelType,
            content: newRow.content || '',
            timestamp: newRow.timestamp || newRow.created_at,
            attachments: (atts || []).map((a: any) => ({ name: a.name, size: a.size })),
          }

          setMessages(prev => [...prev, msg])
        }
      )
      .subscribe()

    messagesChannelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConvId])

  // ── Realtime: new AI drafts for open conversation's lead ────────────────────
  useEffect(() => {
    if (!selectedConvId) return

    const selectedConv = conversations.find(c => c.id === selectedConvId)
    const leadId = selectedConv?.leadId
    if (!leadId) return

    const channel = supabase
      .channel(`inbox-ai-drafts-${selectedConvId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_drafts',
          filter: `lead_id=eq.${leadId}`,
        },
        async (payload) => {
          const newRow = payload.new as any

          // If there's an attachment or additional data to fetch, do it here
          // For now, update the draft directly from the payload
          const draft: AiDraft = {
            id: newRow.id,
            subject: newRow.subject || undefined,
            body: newRow.body || '',
            created_at: newRow.created_at,
          }

          setAiDraft(draft)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConvId, conversations])

  // ── Mark conversation read handler ──────────────────────────────────────────
  const handleSelectConversation = async (convId: string) => {
    setSelectedConvId(convId)
    setReplyText('')

    try {
      await supabase.rpc('mark_conversation_read', {
        p_conversation_id: convId,
      })

      // Optimistically clear unread for this conversation
      setConversations(prev =>
        prev.map(c => (c.id === convId ? { ...c, unread: 0 } : c))
      )
    } catch (e) {
      console.error('Error marking conversation read:', e)
    }
  }

  // ── Send message handler ────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!replyText.trim() || !selectedConvId || sending) return

    const selectedConv = conversations.find(c => c.id === selectedConvId)
    if (!selectedConv) return

    setSending(true)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        console.error('No access token available')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            conversation_id: selectedConvId,
            content: replyText.trim(),
          }),
        }
      )

      if (!response.ok) {
        const errText = await response.text()
        console.error('send-message failed:', response.status, errText)
        return
      }

      setReplyText('')
    } catch (e) {
      console.error('Failed to send message:', e)
    } finally {
      setSending(false)
    }
  }

  // ── Filtered conversations ───────────────────────────────────────────────────
  const filteredConversations = useMemo(() => {
    let list = conversations
    if (activeChannel === 'email') list = list.filter(c => c.channel === 'email')
    if (activeChannel === 'whatsapp') list = list.filter(c => c.channel === 'whatsapp')
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      )
    }
    return list
  }, [conversations, activeChannel, searchQuery])

  const selectedConv = useMemo(
    () => conversations.find(c => c.id === selectedConvId) || null,
    [conversations, selectedConvId]
  )

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0)

  // ── Render ──
  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)', height: 'calc(100vh - 88px)', display: 'flex', flexDirection: 'column' }}>
      <style>{inboxStyles}</style>

      {/* ── Page Header ── */}
      <div className="inbox-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,2.5vw,26px)',
            fontWeight: 700, margin: 0, letterSpacing: '-0.02em',
          }}>
            Inbox
          </h1>
          {totalUnread > 0 && (
            <span className="inbox-total-badge">{totalUnread} unread</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="inbox-search">
            <Icons.Search />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="inbox-search-input"
            />
          </div>
        </div>
      </div>

      {/* ── Three-Column Layout ── */}
      <div className="inbox-layout">

        {/* ── LEFT: Conversation List ── */}
        <div className="inbox-conv-list">
          {/* Channel Tabs */}
          <div className="inbox-channel-tabs">
            {([
              { key: 'all' as ChannelTab, label: 'All', count: conversations.length },
              { key: 'email' as ChannelTab, label: 'Email', count: conversations.filter(c => c.channel === 'email').length },
              { key: 'whatsapp' as ChannelTab, label: 'WhatsApp', count: conversations.filter(c => c.channel === 'whatsapp').length },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveChannel(tab.key); setSelectedConvId(null) }}
                className={`inbox-tab ${activeChannel === tab.key ? 'inbox-tab-active' : ''}`}
              >
                <span>{tab.label}</span>
                <span className="inbox-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Conversation Items */}
          <div className="inbox-conv-items">
            {loadingConversations ? (
              <div className="inbox-empty-state">
                <Icons.Loader />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="inbox-empty-state">
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const score = conv.aiScore ? scoreConfig[conv.aiScore] : null
                const isSelected = conv.id === selectedConvId
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`inbox-conv-item ${isSelected ? 'inbox-conv-selected' : ''} ${conv.unread > 0 ? 'inbox-conv-unread' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="inbox-avatar-wrap">
                      <div
                        className={`inbox-avatar ${score ? `inbox-avatar-${conv.aiScore}` : ''}`}
                      >
                        {conv.avatarInitials}
                      </div>
                      {/* Channel badge on avatar */}
                      <span className="inbox-channel-badge">
                        <ChannelIcon channel={conv.channel} size={12} />
                      </span>
                    </div>

                    {/* Content */}
                    <div className="inbox-conv-content">
                      <div className="inbox-conv-top">
                        <span className="inbox-conv-name">{conv.name}</span>
                        <span className="inbox-conv-time">{timeAgo(conv.lastMessageAt)}</span>
                      </div>
                      <div className="inbox-conv-bottom">
                        <span className="inbox-conv-preview">{conv.lastMessage}</span>
                        <div className="inbox-conv-meta">
                          {conv.unread > 0 && (
                            <span className="inbox-unread-badge">{conv.unread}</span>
                          )}
                          {score && (
                            <span className={`inbox-score-dot inbox-score-${conv.aiScore}`} title={score.label}>
                              {score.label === 'Hot' ? '🔥' : score.label === 'Warm' ? '☀️' : score.label === 'Cold' ? '❄️' : '⏳'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── CENTER: Thread View ── */}
        <div className={selectedConvId ? 'inbox-thread inbox-thread-active' : 'inbox-thread'}>
          {!selectedConv ? (
            <div className="inbox-thread-empty">
              <div className="inbox-thread-empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the left panel to view messages</p>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="inbox-thread-header">
                <button className="inbox-mobile-back" onClick={() => setSelectedConvId(null)}>
                  <Icons.ChevronLeft />
                </button>
                <div className="inbox-avatar-wrap" style={{ width: 38, height: 38 }}>
                  <div className="inbox-avatar" style={{ width: 38, height: 38, fontSize: 13 }}>
                    {selectedConv.avatarInitials}
                  </div>
                  <span className="inbox-channel-badge" style={{ width: 14, height: 14, right: -2, bottom: -2 }}>
                    <ChannelIcon channel={selectedConv.channel} size={10} />
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="inbox-thread-name">{selectedConv.name}</span>
                    <ChannelIcon channel={selectedConv.channel} size={14} />
                  </div>
                  <span className="inbox-thread-email">{selectedConv.email}</span>
                </div>
                <button className="inbox-thread-action" title="More options">
                  <Icons.MoreVertical />
                </button>
              </div>

              {/* Messages */}
              <div className="inbox-messages">
                {loadingMessages ? (
                  <div className="inbox-thread-empty" style={{ flex: 1 }}>
                    <Icons.Loader />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="inbox-thread-empty" style={{ flex: 1 }}>
                    <p>No messages in this conversation yet</p>
                  </div>
                ) : (
                  <>
                    {/* Date separator */}
                    <div className="inbox-date-sep">
                      <span>{formatDate(messages[0].timestamp)}</span>
                    </div>

                    {messages.map((msg, idx) => {
                      const isLead = msg.from === 'lead'
                      const isAi = msg.from === 'ai'
                      const prevIsSameSender = idx > 0 && messages[idx - 1].from === msg.from

                      return (
                        <div
                          key={msg.id}
                          className={`inbox-msg ${isLead ? 'inbox-msg-lead' : isAi ? 'inbox-msg-ai' : 'inbox-msg-agent'}`}
                          style={{ marginTop: prevIsSameSender ? 4 : 16 }}
                        >
                          {/* Sender label (only if sender changed) */}
                          {!prevIsSameSender && (
                            <div className="inbox-msg-sender">
                              {isLead ? (
                                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 12 }}>{selectedConv.name}</span>
                              ) : isAi ? (
                                <span style={{ color: '#7C3AED', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Icons.Sparkle /> RevaCore AI
                                </span>
                              ) : (
                                <span style={{ color: 'var(--color-sage)', fontWeight: 600, fontSize: 12 }}>You</span>
                              )}
                            </div>
                          )}

                          {/* Bubble */}
                          <div className={`inbox-msg-bubble ${isAi ? 'inbox-msg-bubble-ai' : ''}`}>
                            <div className="inbox-msg-content">{msg.content}</div>

                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="inbox-attachments">
                                {msg.attachments.map((att, i) => (
                                  <div key={i} className="inbox-attachment">
                                    <Icons.Paperclip />
                                    <span className="inbox-att-name">{att.name}</span>
                                    <span className="inbox-att-size">{att.size}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="inbox-msg-footer">
                              <span className="inbox-msg-time">
                                {formatTime(msg.timestamp)}
                                {!isLead && (
                                  <span className="inbox-msg-status">
                                    <Icons.CheckDouble />
                                  </span>
                                )}
                              </span>
                              <ChannelIcon channel={msg.channel} size={12} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>

              {/* Reply Input */}
              {selectedConv && (
                <div className="inbox-reply-bar">
                  <div className="inbox-reply-inner">
                    <div className="inbox-reply-switch">
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' }}>Reply via:</span>
                      <span className="inbox-reply-channel">
                        <ChannelIcon channel={selectedConv.channel} size={14} />
                        {selectedConv.channel.charAt(0).toUpperCase() + selectedConv.channel.slice(1)}
                      </span>
                    </div>
                    <div className="inbox-reply-input-wrap">
                      <input
                        type="text"
                        placeholder={`Type a message... (will send via ${selectedConv.channel})`}
                        className="inbox-reply-input"
                        style={{ fontSize: 16 }}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                      />
                      <button
                        className="inbox-reply-send"
                        title="Send"
                        onClick={handleSend}
                        disabled={sending}
                      >
                        {sending ? <Icons.Loader /> : <Icons.Send />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── RIGHT: AI Panel ── */}
        <div className="inbox-ai-panel">
          {!selectedConv ? (
            <div className="inbox-ai-empty">
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>
                <Icons.Brain />
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', margin: 0 }}>
                Select a conversation to see AI insights
              </p>
            </div>
          ) : (() => {
            const leadAi = aiData
            const score = leadAi?.ai_score ? scoreConfig[leadAi.ai_score] : null
            return (
              <div className="inbox-ai-content">
                {/* AI Score Card */}
                <div className="inbox-ai-section">
                  <div className="inbox-ai-section-header">
                    <Icons.Brain />
                    <span>AI Lead Score</span>
                    {leadAi?.ai_points && score && (
                      <span className={`inbox-ai-badge inbox-ai-badge-${leadAi.ai_score}`}>
                        {score.label} · {leadAi.ai_points}
                      </span>
                    )}
                  </div>

                  {score && (
                    <div className="inbox-ai-score-ring-wrap">
                      <div className="inbox-ai-score-ring">
                        <svg width="64" height="64" viewBox="0 0 64 64">
                          <circle cx="32" cy="32" r="26" fill="none" stroke="var(--bg-hover)" strokeWidth="5" />
                          <circle cx="32" cy="32" r="26" fill="none" stroke={score.text} strokeWidth="5" strokeLinecap="round"
                            strokeDasharray={`${((leadAi?.ai_points || 0) / 100) * 163.36} 163.36`}
                            transform="rotate(-90 32 32)"
                            style={{ transition: 'stroke-dasharray 0.8s ease' }}
                          />
                        </svg>
                        <div className="inbox-ai-score-value" style={{ color: score.text }}>
                          {leadAi?.ai_points || 0}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Summary */}
                <div className="inbox-ai-section">
                  <div className="inbox-ai-section-header">
                    <Icons.Target />
                    <span>AI Summary</span>
                  </div>
                  {loadingAi ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
                      <Icons.Loader />
                    </div>
                  ) : (
                    <p className="inbox-ai-text">{leadAi?.ai_summary || 'No AI summary available for this lead yet.'}</p>
                  )}
                </div>

                {/* Suggested Reply */}
                <div className="inbox-ai-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div className="inbox-ai-section-header">
                    <Icons.Sparkle />
                    <span>Suggested Reply</span>
                    <span className="inbox-ai-badge inbox-ai-badge-draft">Draft</span>
                  </div>
                  {loadingAi ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
                      <Icons.Loader />
                    </div>
                  ) : aiDraft ? (
                    <>
                      <div className="inbox-ai-draft-subject">
                        <span className="inbox-ai-label">Subject</span>
                        <span className="inbox-ai-subject-text">{aiDraft.subject || '(no subject)'}</span>
                      </div>
                      <div className="inbox-ai-draft-body">
                        <p className="inbox-ai-draft-text">{aiDraft.body}</p>
                      </div>
                      <div className="inbox-ai-actions">
                        <button className="inbox-ai-btn inbox-ai-btn-secondary" onClick={() => navigator.clipboard.writeText(aiDraft.body)}>
                          <Icons.Copy /> Copy
                        </button>
                        <button className="inbox-ai-btn inbox-ai-btn-primary">
                          <Icons.Edit /> Edit & Send
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="inbox-ai-text" style={{ marginTop: 4 }}>No AI draft available yet.</p>
                  )}
                </div>

                {/* Quick Info */}
                <div className="inbox-ai-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <div className="inbox-ai-meta-row">
                    <span className="inbox-ai-label">Channel</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                      <ChannelIcon channel={selectedConv.channel} size={12} />
                      {selectedConv.channel.charAt(0).toUpperCase() + selectedConv.channel.slice(1)}
                    </span>
                  </div>
                  <div className="inbox-ai-meta-row">
                    <span className="inbox-ai-label">Status</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{selectedConv.status}</span>
                  </div>
                  {selectedConv.phone && (
                    <div className="inbox-ai-meta-row">
                      <span className="inbox-ai-label">Phone</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-ochre)' }}>{selectedConv.phone}</span>
                    </div>
                  )}
                  <div className="inbox-ai-meta-row">
                    <span className="inbox-ai-label">Email</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-ochre)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedConv.email}</span>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

export default InboxComponent
export { InboxComponent as Inbox }

// ─── Styles ────────────────────────────────────────────────────────────────────

const inboxStyles = `
  /* ── Spinner ── */
  @keyframes inbox-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* ── Header ── */
  .inbox-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    flex-wrap: wrap;
    gap: 12px;
    border-bottom: 1px solid var(--border-primary);
    flex-shrink: 0;
    background: var(--bg-secondary);
  }

  .inbox-total-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 100px;
    background: rgba(220,38,38,0.08);
    color: #DC2626;
    border: 1px solid rgba(220,38,38,0.15);
  }

  .inbox-search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-secondary);
    border-radius: 12px;
    color: var(--text-tertiary);
    min-width: 220px;
    transition: border-color 0.2s;
  }
  .inbox-search:focus-within {
    border-color: var(--color-ochre);
  }

  .inbox-search-input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    width: 100%;
    font-family: var(--font-body);
  }
  .inbox-search-input::placeholder {
    color: var(--text-tertiary);
  }

  /* ── Three-Column Layout ── */
  .inbox-layout {
    display: grid;
    grid-template-columns: 320px 1fr 300px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* ── Left: Conversation List ── */
  .inbox-conv-list {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-primary);
    background: var(--bg-secondary);
    min-height: 0;
  }

  .inbox-channel-tabs {
    display: flex;
    gap: 4px;
    padding: 12px 14px 8px;
    border-bottom: 1px solid var(--border-primary);
    flex-shrink: 0;
  }

  .inbox-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-tertiary);
    background: transparent;
    border: 1px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: var(--font-body);
    white-space: nowrap;
  }
  .inbox-tab:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  .inbox-tab-active {
    background: var(--bg-tertiary);
    border-color: var(--border-secondary);
    color: var(--text-primary);
  }

  .inbox-tab-count {
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 100px;
    background: var(--bg-hover);
    color: var(--text-tertiary);
  }
  .inbox-tab-active .inbox-tab-count {
    background: var(--color-espresso);
    color: #fff;
  }

  .inbox-conv-items {
    flex: 1;
    overflow-y: auto;
    padding: 6px;
  }

  .inbox-empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: var(--text-tertiary);
    font-size: 13px;
    font-weight: 500;
  }

  .inbox-conv-item {
    display: flex;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    background: transparent;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s;
    font-family: var(--font-body);
    margin-bottom: 2px;
  }
  .inbox-conv-item:hover {
    background: var(--bg-hover);
  }
  .inbox-conv-selected {
    background: var(--bg-tertiary) !important;
    border: 1px solid var(--border-secondary);
    padding: 9px 11px;
  }
  .inbox-conv-unread .inbox-conv-name {
    font-weight: 700;
  }
  .inbox-conv-unread .inbox-conv-preview {
    font-weight: 600;
    color: var(--text-primary);
  }

  .inbox-avatar-wrap {
    position: relative;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
  }

  .inbox-avatar {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: var(--color-cream);
    background: var(--color-espresso);
  }
  .inbox-avatar-hot { background: rgba(220,38,38,0.15); color: #DC2626; border: 1.5px solid rgba(220,38,38,0.25); }
  .inbox-avatar-warm { background: rgba(217,119,6,0.12); color: #D97706; border: 1.5px solid rgba(217,119,6,0.2); }
  .inbox-avatar-cold { background: rgba(59,130,246,0.12); color: #3B82F6; border: 1.5px solid rgba(59,130,246,0.2); }

  .inbox-channel-badge {
    position: absolute;
    right: -4px;
    bottom: -4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 2px solid var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .inbox-conv-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }

  .inbox-conv-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .inbox-conv-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .inbox-conv-time {
    font-size: 10px;
    font-weight: 500;
    color: var(--text-tertiary);
    flex-shrink: 0;
  }

  .inbox-conv-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .inbox-conv-preview {
    font-size: 12px;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
  }

  .inbox-conv-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .inbox-unread-badge {
    min-width: 18px;
    height: 18px;
    border-radius: 100px;
    background: var(--color-espresso);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
  }

  .inbox-score-dot {
    font-size: 12px;
    line-height: 1;
  }

  /* ── Center: Thread ── */
  .inbox-thread {
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: var(--bg-primary);
  }

  .inbox-thread-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    color: var(--text-tertiary);
  }
  .inbox-thread-empty h3 {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 6px;
    color: var(--text-primary);
  }
  .inbox-thread-empty p {
    font-size: 13px;
    margin: 0;
    text-align: center;
  }
  .inbox-thread-empty-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: var(--bg-hover);
    border: 1px solid var(--border-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: var(--text-tertiary);
  }

  .inbox-thread-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-primary);
    background: var(--bg-secondary);
    flex-shrink: 0;
  }

  .inbox-mobile-back {
    display: none;
    padding: 6px;
    background: transparent;
    border: 1px solid var(--border-secondary);
    border-radius: 10px;
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 600;
    font-family: var(--font-body);
  }

  .inbox-thread-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
  }
  .inbox-thread-email {
    display: block;
    font-size: 11px;
    color: var(--text-tertiary);
    font-weight: 500;
    margin-top: 1px;
  }

  .inbox-thread-action {
    padding: 6px;
    background: transparent;
    border: 1px solid var(--border-secondary);
    border-radius: 10px;
    cursor: pointer;
    color: var(--text-tertiary);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }
  .inbox-thread-action:hover {
    color: var(--text-primary);
  }

  /* ── Messages ── */
  .inbox-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
  }

  .inbox-date-sep {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .inbox-date-sep span {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-tertiary);
    background: var(--bg-secondary);
    padding: 4px 14px;
    border-radius: 100px;
    border: 1px solid var(--border-secondary);
  }

  .inbox-msg {
    max-width: 88%;
    align-self: flex-end;
  }
  .inbox-msg-lead {
    align-self: flex-start;
  }
  .inbox-msg-ai {
    align-self: flex-start;
    max-width: 92%;
  }

  .inbox-msg-sender {
    margin-bottom: 4px;
    padding-left: 4px;
  }

  .inbox-msg-bubble {
    padding: 12px 14px;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--color-espresso), #2a221c);
    color: var(--color-cream);
    position: relative;
    border-bottom-right-radius: 4px;
  }
  .inbox-msg-lead .inbox-msg-bubble {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    color: var(--text-primary);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 16px;
  }
  .inbox-msg-ai .inbox-msg-bubble-ai {
    background: linear-gradient(135deg, rgba(124,58,237,0.06), rgba(124,58,237,0.02));
    border: 1px solid rgba(124,58,237,0.15);
    color: var(--text-primary);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 16px;
  }
  .inbox-msg-ai .inbox-msg-bubble-ai .inbox-msg-content {
    white-space: pre-wrap;
  }

  .inbox-msg-content {
    font-size: 13px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .inbox-attachments {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }
  .inbox-msg-lead .inbox-attachments {
    border-top-color: var(--border-secondary);
  }
  .inbox-msg-ai .inbox-attachments {
    border-top-color: rgba(124,58,237,0.12);
  }

  .inbox-attachment {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 8px;
    background: rgba(255,255,255,0.06);
    font-size: 11px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .inbox-attachment:hover {
    background: rgba(255,255,255,0.1);
  }
  .inbox-msg-lead .inbox-attachment {
    background: var(--bg-hover);
  }
  .inbox-msg-lead .inbox-attachment:hover {
    background: var(--bg-tertiary);
  }

  .inbox-att-name {
    font-weight: 500;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .inbox-att-size {
    color: inherit;
    opacity: 0.6;
    flex-shrink: 0;
  }
  .inbox-msg-lead .inbox-att-size { color: var(--text-tertiary); }

  .inbox-msg-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 6px;
    opacity: 0.7;
    font-size: 10px;
  }
  .inbox-msg-lead .inbox-msg-footer {
    justify-content: flex-start;
  }

  .inbox-msg-time {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .inbox-msg-status {
    display: inline-flex;
    align-items: center;
    color: inherit;
  }
  .inbox-msg-ai .inbox-msg-bubble-ai .inbox-msg-footer {
    color: var(--text-tertiary);
  }

  /* ── Reply Bar ── */
  .inbox-reply-bar {
    border-top: 1px solid var(--border-primary);
    padding: 12px 16px;
    background: var(--bg-secondary);
    flex-shrink: 0;
  }

  .inbox-reply-inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .inbox-reply-switch {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .inbox-reply-channel {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 6px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-secondary);
    color: var(--text-secondary);
  }

  .inbox-reply-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-secondary);
    border-radius: 14px;
    padding: 4px 4px 4px 14px;
    transition: border-color 0.2s;
  }
  .inbox-reply-input-wrap:focus-within {
    border-color: var(--color-ochre);
  }

  .inbox-reply-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    font-family: var(--font-body);
    min-width: 0;
  }
  .inbox-reply-input::placeholder {
    color: var(--text-tertiary);
  }

  .inbox-reply-send {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--color-espresso);
    color: var(--color-cream);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }
  .inbox-reply-send:hover {
    opacity: 0.85;
  }
  .inbox-reply-send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ── Right: AI Panel ── */
  .inbox-ai-panel {
    border-left: 1px solid var(--border-primary);
    background: var(--bg-secondary);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .inbox-ai-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: var(--text-tertiary);
  }

  .inbox-ai-content {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-height: 0;
  }

  .inbox-ai-section {
    padding: 16px;
    border-bottom: 1px solid var(--border-primary);
  }

  .inbox-ai-section-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .inbox-ai-section-header svg {
    color: var(--text-tertiary);
  }

  .inbox-ai-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 100px;
    text-transform: none;
    letter-spacing: normal;
    margin-left: auto;
  }
  .inbox-ai-badge-hot { background: rgba(220,38,38,0.1); color: #DC2626; border: 1px solid rgba(220,38,38,0.2); }
  .inbox-ai-badge-warm { background: rgba(217,119,6,0.1); color: #D97706; border: 1px solid rgba(217,119,6,0.2); }
  .inbox-ai-badge-cold { background: rgba(59,130,246,0.1); color: #3B82F6; border: 1px solid rgba(59,130,246,0.2); }
  .inbox-ai-badge-draft { background: rgba(217,119,6,0.08); color: #D97706; border: 1px solid rgba(217,119,6,0.15); margin-left: 6px; }

  .inbox-ai-score-ring-wrap {
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }

  .inbox-ai-score-ring {
    position: relative;
    width: 64px;
    height: 64px;
  }
  .inbox-ai-score-value {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .inbox-ai-text {
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
  }

  .inbox-ai-draft-subject {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 10px;
  }

  .inbox-ai-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .inbox-ai-subject-text {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    padding: 6px 10px;
    background: var(--bg-tertiary);
    border-radius: 8px;
    border: 1px solid var(--border-secondary);
    word-break: break-word;
  }

  .inbox-ai-draft-body {
    flex: 1;
    min-height: 0;
    margin-bottom: 10px;
  }

  .inbox-ai-draft-text {
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
    white-space: pre-wrap;
    padding: 10px 12px;
    background: rgba(124,58,237,0.03);
    border-radius: 10px;
    border: 1px solid rgba(124,58,237,0.08);
    max-height: 200px;
    overflow-y: auto;
  }

  .inbox-ai-actions {
    display: flex;
    gap: 6px;
  }

  .inbox-ai-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 12px;
    font-size: 11px;
    font-weight: 700;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: var(--font-body);
    white-space: nowrap;
  }

  .inbox-ai-btn-primary {
    background: var(--color-espresso);
    color: var(--color-cream);
    border: none;
  }
  .inbox-ai-btn-primary:hover {
    opacity: 0.9;
  }

  .inbox-ai-btn-secondary {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-secondary);
  }
  .inbox-ai-btn-secondary:hover {
    background: var(--bg-hover);
  }

  .inbox-ai-meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    gap: 8px;
  }

  /* ══════════════════════════════════════════════════════════
     RESPONSIVE
   ══════════════════════════════════════════════════════════ */

  @media (max-width: 1200px) {
    .inbox-layout {
      grid-template-columns: 280px 1fr 260px;
    }
  }

  @media (max-width: 960px) {
    .inbox-layout {
      grid-template-columns: 280px 1fr;
    }
    .inbox-ai-panel {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .inbox-layout {
      grid-template-columns: 1fr;
    }
    .inbox-conv-list {
      display: flex;
    }
    .inbox-thread {
      display: none;
    }
    .inbox-thread-active .inbox-conv-list {
      display: none;
    }
    .inbox-thread-active .inbox-thread {
      display: flex;
    }

    .inbox-mobile-back {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }

    .inbox-header {
      padding: 12px 14px;
    }
    .inbox-search {
      min-width: 100%;
    }
    .inbox-messages {
      padding: 12px 14px;
    }
    .inbox-msg {
      max-width: 95%;
    }
    .inbox-reply-bar {
      padding: 8px 12px;
    }
    .inbox-conv-list {
      border-right: none;
    }
  }
`