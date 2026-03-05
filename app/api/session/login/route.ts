import { NextResponse, type NextRequest } from 'next/server'

import { adminAuth } from '@/lib/firebaseAdmin'
import { generateCsrfToken, getCsrfCookieName } from '@/lib/csrf'

const fiveDaysInSeconds = 60 * 60 * 24 * 5

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'Missing idToken.' }, { status: 400 })
    }

    const decoded = await adminAuth.verifyIdToken(idToken)
    if (decoded.admin !== true) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: fiveDaysInSeconds * 1000,
    })

    const csrfToken = generateCsrfToken()
    const response = NextResponse.json({ ok: true, csrfToken })
    response.cookies.set({
      name: '__session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: fiveDaysInSeconds,
    })
    response.cookies.set({
      name: getCsrfCookieName(),
      value: csrfToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: fiveDaysInSeconds,
    })

    return response
  } catch (error) {
    console.error('Session login failed:', error)
    return NextResponse.json({ error: 'Session login failed.' }, { status: 500 })
  }
}
