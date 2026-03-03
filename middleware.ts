import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  if (!session) {
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
