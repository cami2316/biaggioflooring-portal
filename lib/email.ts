import sgMail from '@sendgrid/mail'

import { ESTIMATE_DISCLAIMER, type LaborRange } from '@/lib/pricing'

type SendEstimateEmailInput = {
  to: string
  name: string
  range: LaborRange
  projectSummary: string
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

export const sendEstimateEmail = async (
  input: SendEstimateEmailInput
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
    const safeSummary = escapeHtml(input.projectSummary)

    const html = `
      <div style="font-family: 'Source Sans 3', Arial, sans-serif; color: #212121;">
        <h2 style="margin: 0 0 12px; font-weight: 600;">Hi ${safeName},</h2>
        <p style="margin: 0 0 16px;">Thanks for reaching out to Biaggio Flooring. We will follow up shortly.</p>
        <p style="margin: 0 0 16px;">Here is your preliminary labor-only range:</p>
        <p style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #212121;">${rangeText}</p>
        <div style="margin: 0 0 16px; padding: 12px 16px; border: 1px solid #e5e5e5; border-radius: 14px; background: #fafafa;">
          <p style="margin: 0; font-size: 14px; color: #333;">${ESTIMATE_DISCLAIMER}</p>
        </div>
        <p style="margin: 0 0 6px; font-weight: 600;">Project summary</p>
        <p style="margin: 0; font-size: 14px; color: #555;">${safeSummary}</p>
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
