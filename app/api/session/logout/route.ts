import { NextResponse, type NextRequest } from 'next/server'

import { adminAuth } from '@/lib/firebaseAdmin'
import { getCsrfCookieName, validateCsrfToken } from '@/lib/csrf'

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value
  const csrfValid = validateCsrfToken(request)

  if (!csrfValid) {
    const response = NextResponse.json({ error: 'Invalid CSRF token.' }, { status: 403 })
    response.cookies.set({
      name: '__session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
    response.cookies.set({
      name: getCsrfCookieName(),
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
    return response
  }

  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
      await adminAuth.revokeRefreshTokens(decoded.uid)
    } catch {
      // Ignore invalid or expired sessions; still clear cookies.
    }
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: '__session',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  response.cookies.set({
    name: getCsrfCookieName(),
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
