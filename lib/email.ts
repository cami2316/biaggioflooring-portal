import sgMail from '@sendgrid/mail'

import { ESTIMATE_DISCLAIMER, type LaborBreakdown, type LaborRange } from '@/lib/pricing'
import type { EstimateInput } from '@/lib/validations'

type SendClientEstimateEmailInput = {
  to: string
  name: string
  range: LaborRange
}

type SendInternalEstimateEmailInput = {
  estimateId: string
  input: EstimateInput
  range: LaborRange
  breakdown: LaborBreakdown
  publicUrl?: string
  firestoreUrl?: string
}

type SendEstimateEmailResult = {
  ok: boolean
  error?: string
}

const getEnv = (key: string) => {
  const value = process.env[key]
  return value ?? ''
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.ceil(value))

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const formatBoolean = (value: boolean) => (value ? 'Yes' : 'No')

const renderAreasHtml = (areas: EstimateInput['areas']) => {
  if (!areas.length) {
    return '<p>No areas provided.</p>'
  }

  const items = areas.map((area, index) => {
    const extras = area.extras || {
      demolition: false,
      cementBoard: false,
      bench: false,
      niches: 0,
      window: false,
    }

    return `
      <li style="margin-bottom: 12px;">
        <strong>Area ${index + 1}</strong><br />
        Type: ${escapeHtml(area.type || 'N/A')}<br />
        Surface: ${escapeHtml(area.surface || 'N/A')}<br />
        Sqft: ${Number.isFinite(area.sqft) ? area.sqft : 0}<br />
        Material: ${escapeHtml(area.material || 'N/A')}<br />
        Tile size: ${escapeHtml(area.tileSize || 'N/A')}<br />
        Layout: ${escapeHtml(area.layout || 'N/A')}<br />
        Demolition: ${formatBoolean(Boolean(extras.demolition))}<br />
        Cement board: ${formatBoolean(Boolean(extras.cementBoard))}<br />
        Bench: ${formatBoolean(Boolean(extras.bench))}<br />
        Niches: ${Number.isFinite(extras.niches) ? extras.niches : 0}<br />
        Window: ${formatBoolean(Boolean(extras.window))}
      </li>
    `
  })

  return `<ul style="padding-left: 18px; margin: 0;">${items.join('')}</ul>`
}

export const sendClientEstimateEmail = async (
  input: SendClientEstimateEmailInput
): Promise<SendEstimateEmailResult> => {
  const apiKey = getEnv('SENDGRID_API_KEY')
  const fromEmail = getEnv('SENDGRID_FROM_EMAIL')
  const replyTo = getEnv('SENDGRID_REPLY_TO')

  if (!apiKey || !fromEmail || !replyTo) {
    return { ok: false, error: 'Missing SendGrid environment configuration.' }
  }

  try {
    sgMail.setApiKey(apiKey)

    const subject = 'Your Estimate Request Received'
    const rangeText = `${formatCurrency(input.range.min)} – ${formatCurrency(input.range.max)}`
    const safeName = escapeHtml(input.name)

    const html = `
      <div style="font-family: 'Source Sans 3', Arial, sans-serif; color: #212121;">
        <h2 style="margin: 0 0 12px; font-weight: 600;">Hi ${safeName},</h2>
        <p style="margin: 0 0 16px;">Thanks for reaching out to Biaggio Flooring. We will follow up shortly.</p>
        <p style="margin: 0 0 16px;">Here is your preliminary labor-only range:</p>
        <p style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #212121;">${rangeText}</p>
        <div style="margin: 0 0 16px; padding: 12px 16px; border: 1px solid #e5e5e5; border-radius: 14px; background: #fafafa;">
          <p style="margin: 0; font-size: 14px; color: #333;">${ESTIMATE_DISCLAIMER}</p>
        </div>
      </div>
    `

    await sgMail.send({
      to: input.to,
      from: fromEmail,
      replyTo,
      subject,
      html,
    })

    return { ok: true }
  } catch (error) {
    console.error('SendGrid email failed:', error)
    return { ok: false, error: 'SendGrid send failed.' }
  }
}

export const sendInternalEstimateEmail = async (
  input: SendInternalEstimateEmailInput
): Promise<SendEstimateEmailResult> => {
  const apiKey = getEnv('SENDGRID_API_KEY')
  const fromEmail = getEnv('SENDGRID_FROM_EMAIL')
  const replyTo = getEnv('SENDGRID_REPLY_TO')
  const internalTo = getEnv('BIAGGIO_INTERNAL_EMAIL')

  if (!apiKey || !fromEmail || !replyTo || !internalTo) {
    return { ok: false, error: 'Missing SendGrid environment configuration.' }
  }

  try {
    sgMail.setApiKey(apiKey)

    const rangeText = `${formatCurrency(input.range.min)} – ${formatCurrency(input.range.max)}`
    const safeName = escapeHtml(input.input.clientName)
    const safeEmail = escapeHtml(input.input.email)
    const safePhone = escapeHtml(input.input.phone)
    const safeAddress = escapeHtml(input.input.address)
    const safePublicUrl = escapeHtml(input.publicUrl || 'N/A')
    const safeFirestoreUrl = escapeHtml(input.firestoreUrl || 'N/A')

    const html = `
      <div style="font-family: 'Source Sans 3', Arial, sans-serif; color: #212121;">
        <h2 style="margin: 0 0 12px; font-weight: 600;">New Estimate Request</h2>
        <p style="margin: 0 0 12px;"><strong>Range:</strong> ${rangeText}</p>
        <p style="margin: 0 0 12px;"><strong>Estimate ID:</strong> ${escapeHtml(input.estimateId)}</p>
        <p style="margin: 0 0 12px;"><strong>Public link:</strong> ${safePublicUrl}</p>
        <p style="margin: 0 0 20px;"><strong>Firestore link:</strong> ${safeFirestoreUrl}</p>

        <h3 style="margin: 0 0 8px; font-weight: 600;">Client details</h3>
        <p style="margin: 0 0 4px;">Name: ${safeName}</p>
        <p style="margin: 0 0 4px;">Email: ${safeEmail}</p>
        <p style="margin: 0 0 4px;">Phone: ${safePhone}</p>
        <p style="margin: 0 0 16px;">Address: ${safeAddress}</p>

        <h3 style="margin: 0 0 8px; font-weight: 600;">Project details</h3>
        ${renderAreasHtml(input.input.areas)}

        <h3 style="margin: 16px 0 8px; font-weight: 600;">Breakdown</h3>
        <p style="margin: 0 0 4px;">Total sqft: ${input.breakdown.totalSqft}</p>
        <p style="margin: 0 0 4px;">Base areas: ${formatCurrency(input.breakdown.baseTotal)}</p>
        <p style="margin: 0 0 4px;">Extras: ${formatCurrency(input.breakdown.extrasTotal)}</p>
        <p style="margin: 0 0 16px;">Final range: ${formatCurrency(input.breakdown.min)} – ${formatCurrency(input.breakdown.max)}</p>
      </div>
    `

    const subject = `New Estimate Request — ${safeName} — ${formatCurrency(input.range.min)}-${formatCurrency(input.range.max)} — ID ${escapeHtml(input.estimateId)}`

    await sgMail.send({
      to: internalTo,
      from: fromEmail,
      replyTo,
      subject,
      html,
    })

    return { ok: true }
  } catch (error) {
    console.error('SendGrid internal email failed:', error)
    return { ok: false, error: 'SendGrid send failed.' }
  }
}
