import crypto from 'crypto'
import type { NextRequest } from 'next/server'

const CSRF_COOKIE = 'csrfToken'
const CSRF_HEADER = 'x-csrf-token'

export const generateCsrfToken = () => crypto.randomBytes(32).toString('hex')

export const getCsrfCookieName = () => CSRF_COOKIE

export const getCsrfHeaderName = () => CSRF_HEADER

export const validateCsrfToken = (request: NextRequest) => {
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value
  const headerToken = request.headers.get(CSRF_HEADER)

  if (!cookieToken || !headerToken) {
    return false
  }

  return cookieToken === headerToken
}
