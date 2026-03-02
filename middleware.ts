import { NextResponse, type NextRequest } from 'next/server'

import { adminAuth } from '@/lib/firebaseAdmin'

const getSessionCookie = (request: NextRequest) => {
  return request.cookies.get('__session')?.value || null
}

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

// Admin access test checklist:
// - Login as admin -> access /admin/dashboard
// - Refresh page -> still accessible
// - Logout -> session revoked
// - Access /admin directly -> redirect
// - Try modifying CSRF header -> 403
