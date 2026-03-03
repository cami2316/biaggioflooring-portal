import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { saveEstimateRequest } from '@/lib/firebase'
import {
  calculateLaborBreakdown,
  calculateLaborRange,
  ESTIMATE_DISCLAIMER,
} from '@/lib/pricing'
import { sendClientEstimateEmail, sendInternalEstimateEmail } from '@/lib/email'
import { validateEstimateInput, type EstimateInput } from '@/lib/validations'

const getClientIp = (request: NextRequest) => {
  return (
    request.headers.get('x-forwarded-for')
    || request.headers.get('x-real-ip')
    || 'unknown'
  )
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 5
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const rateLimitCheck = (ip: string) => {
  const now = Date.now()
  const current = rateLimitStore.get(ip)

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { ok: true }
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfterMs: current.resetAt - now }
  }

  rateLimitStore.set(ip, { count: current.count + 1, resetAt: current.resetAt })
  return { ok: true }
}

const getBaseUrl = () => {
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return ''
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as EstimateInput

    const rateLimit = rateLimitCheck(getClientIp(request))
    if (!rateLimit.ok) {
      return NextResponse.json({
        error: 'Too many requests. Please wait and try again.',
        retryAfterMs: rateLimit.retryAfterMs,
        // TODO: Replace in-memory limiter with Redis/Upstash for multi-instance deployments.
      }, { status: 429 })
    }

    const validation = validateEstimateInput(payload)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed.', errors: validation.errors }, { status: 400 })
    }

    const range = calculateLaborRange(payload)
    const breakdown = calculateLaborBreakdown(payload)

    const estimateId = await saveEstimateRequest(payload, range)

    const publicBaseUrl = getBaseUrl()
    const firestoreProjectId = process.env.FIREBASE_PROJECT_ID
    const publicEstimateUrl = publicBaseUrl ? `${publicBaseUrl}/estimate/${estimateId}` : ''
    const firestoreUrl = firestoreProjectId
      ? `https://console.firebase.google.com/project/${firestoreProjectId}/firestore/databases/-default-/data/~2FestimateRequests~2F${estimateId}`
      : ''

    const internalEmailResult = await sendInternalEstimateEmail({
      estimateId,
      input: payload,
      range,
      breakdown,
      publicUrl: publicEstimateUrl,
      firestoreUrl,
    })

    if (!internalEmailResult.ok) {
      console.error('Internal estimate email failed:', internalEmailResult.error)
    }

    const clientEmailResult = await sendClientEstimateEmail({
      to: payload.email,
      name: payload.clientName,
      range,
    })

    if (!clientEmailResult.ok) {
      console.error('Client estimate email failed:', clientEmailResult.error)
    }

    return NextResponse.json({
      id: estimateId,
      range,
      breakdown,
      disclaimer: ESTIMATE_DISCLAIMER,
      emailSent: clientEmailResult.ok,
      emailError: clientEmailResult.ok ? null : clientEmailResult.error,
      internalEmailSent: internalEmailResult.ok,
      internalEmailError: internalEmailResult.ok ? null : internalEmailResult.error,
    })
  } catch (error) {
    console.error('Estimate submission failed:', error)
    return NextResponse.json({ error: 'Estimate submission failed.' }, { status: 500 })
  }
}
