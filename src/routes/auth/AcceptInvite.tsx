import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export const AcceptInvite = () => {
  const { user, sessionChecked } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')
  const [invite, setInvite] = useState<any>(null)
  const [error, setError] = useState('')
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    if (!token) { setStatus('invalid'); setError('Invalid invite link'); return }
    if (sessionChecked && !user) { setStatus('invalid'); setError('Please sign in to accept this invite'); return }

    const fetchInvite = async () => {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('token_hash', token)
        .eq('status', 'pending')
        .single()

      if (error || !data) { setStatus('invalid'); setError('Invite not found or expired'); return }
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setStatus('invalid'); setError('This invite has expired'); return }
      setInvite(data)
      setStatus('valid')
    }

    fetchInvite()
  }, [token, user, sessionChecked])

  const acceptInvite = async () => {
    if (!user || !invite) return
    setAccepting(true)
    try {
      const { error } = await supabase.from('agent_profiles').insert({
        user_id: user.id,
        agency_id: invite.agency_id,
        role: invite.role,
        name: (user as any).user_metadata?.name || user.email?.split('@')[0] || 'Team Member',
      })
      if (error) throw error

      await supabase.from('invitations').update({ status: 'accepted', accepted_at: new Date() }).eq('id', invite.id)
      toast.success('Welcome to the team!')
      navigate('/dashboard')
    } catch (err: any) { toast.error(err.message || 'Failed to accept invite') }
    finally { setAccepting(false) }
  }

  if (status === 'loading') return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>Loading invite…</div>

  if (status === 'invalid') {
    return (
      <div style={{ maxWidth: 460, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Invalid invite</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px' }}>{error}</p>
        <Link to="/signup" style={{ color: 'var(--color-ochre)', fontWeight: 600, textDecoration: 'none' }}>Go to signup</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 460, margin: '80px auto', padding: 24 }}>
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)', padding: 24, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Accept Team Invitation</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px' }}>
          You've been invited to join an agency as <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{invite?.role}</strong>.
        </p>
        {user ? (
          <button
            onClick={acceptInvite}
            disabled={accepting}
            style={{
              padding: '12px 24px', fontSize: 14, fontWeight: 700,
              color: 'var(--color-cream)', background: 'var(--color-espresso)',
              border: 'none', borderRadius: 12, cursor: accepting ? 'not-allowed' : 'pointer',
              opacity: accepting ? 0.6 : 1,
            }}
          >
            {accepting ? 'Accepting…' : 'Accept & Join Team'}
          </button>
        ) : (
          <div>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 16px' }}>Please sign in to accept this invitation.</p>
            <Link to="/login" style={{ padding: '12px 24px', fontSize: 14, fontWeight: 700, color: 'var(--color-cream)', background: 'var(--color-espresso)', borderRadius: 12, textDecoration: 'none' }}>Sign In</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default AcceptInvite