'use client'

import { useEffect, useState } from 'react'
import {
  getIdToken,
  getIdTokenResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'

import { auth } from '@/lib/firebase'

const AuthForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(false)
      if (!user) {
        setUserEmail(null)
        setIsAdmin(false)
        return
      }

      setUserEmail(user.email)
      console.log('Firebase project:', auth.app.options.projectId)
      const token = await getIdTokenResult(user)
      console.log('Firebase claims:', token.claims)
      setIsAdmin(token.claims.admin === true)
    })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus(null)
    setIsSubmitting(true)

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
      const tokenResult = await getIdTokenResult(credential.user, true)
      if (tokenResult.claims.admin !== true) {
        throw new Error('User is not an admin.')
      }
      const idToken = await getIdToken(credential.user, true)

      const response = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        const message = payload?.error || `Sign-in failed (status ${response.status}).`
        setStatus(message)
        return
      }

      const payload = await response.json()
      setCsrfToken(payload?.csrfToken ?? null)
      setStatus('Signed in successfully.')
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Firebase login error:', error)
      const message = error instanceof Error ? error.message : 'Authentication failed.'
      setStatus(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenDashboard = async () => {
    setStatus(null)
    setIsSubmitting(true)

    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        setStatus('Please sign in again to continue.')
        return
      }

      const tokenResult = await getIdTokenResult(currentUser, true)
      if (tokenResult.claims.admin !== true) {
        setStatus('Admin access is not enabled for this account.')
        return
      }

      const idToken = await getIdToken(currentUser, true)
      const response = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        const message = payload?.error || `Sign-in failed (status ${response.status}).`
        setStatus(message)
        return
      }

      const payload = await response.json().catch(() => ({}))
      setCsrfToken(payload?.csrfToken ?? null)
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Admin session login failed:', error)
      const message = error instanceof Error ? error.message : 'Authentication failed.'
      setStatus(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    setStatus(null)
    try {
      await fetch('/api/session/logout', {
        method: 'POST',
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
      })
      await signOut(auth)
      setStatus('Signed out successfully.')
    } catch (error) {
      console.error('Sign out failed:', error)
      setStatus('Sign out failed. Please try again.')
    }
  }

  return (
    <div className="rounded-3xl border border-brand-charcoal/10 bg-white p-8 shadow-premium">
      <h2 className="text-2xl font-semibold text-brand-charcoal mb-2">Admin Sign In</h2>
      <p className="text-brand-charcoal/70 mb-6">
        Access the private admin dashboard to manage estimate requests.
      </p>

      {status ? (
        <div className="mb-6 rounded-2xl border border-brand-charcoal/10 bg-brand-white px-5 py-4 text-sm text-brand-charcoal">
          {status}
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-brand-charcoal/70">Checking authentication...</p>
      ) : userEmail ? (
        <div className="space-y-4">
          <p className="text-brand-charcoal">
            Signed in as <span className="font-semibold">{userEmail}</span>
          </p>
          <p className="text-sm text-brand-charcoal/70">
            Admin access: {isAdmin ? 'Enabled' : 'Not enabled'}
          </p>
          {isAdmin ? (
            <button
              type="button"
              onClick={handleOpenDashboard}
              disabled={isSubmitting}
              className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-accent transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Opening...' : 'Open Dashboard'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-brand-charcoal/20 px-6 py-3 text-sm font-semibold text-brand-charcoal hover:border-brand-primary hover:text-brand-primary transition"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brand-charcoal mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-brand-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              placeholder="admin@biaggioflooring.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-charcoal mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-brand-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-accent transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      )}
    </div>
  )
}

export default AuthForm
