import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { saveEstimateRequest } from '@/lib/firebase'
import {
  calculateLaborBreakdown,
  calculateLaborRange,
  ESTIMATE_DISCLAIMER,
} from '@/lib/pricing'
import { sendEstimateEmail } from '@/lib/email'
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

const buildProjectSummary = (input: EstimateInput) => {
  const areaSummary = input.areas
    .map((area, index) => {
      const type = area.type
      const sqft = area.sqft
      const material = area.material || 'N/A'
      return `Area ${index + 1}: ${type}, ${sqft} sqft, ${material}`
    })
    .join(' | ')

  return areaSummary || 'Project details provided.'
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

    const emailResult = await sendEstimateEmail({
      to: payload.email,
      name: payload.clientName,
      range,
      projectSummary: buildProjectSummary(payload),
    })

    return NextResponse.json({
      id: estimateId,
      range,
      breakdown,
      disclaimer: ESTIMATE_DISCLAIMER,
      emailSent: emailResult.ok,
      emailError: emailResult.ok ? null : emailResult.error,
    })
  } catch (error) {
    console.error('Estimate submission failed:', error)
    return NextResponse.json({ error: 'Estimate submission failed.' }, { status: 500 })
  }
}
