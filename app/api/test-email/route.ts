import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export const runtime = 'nodejs'

export async function GET() {
  const apiKey = process.env.SENDGRID_API_KEY
  const to = process.env.BIAGGIO_INTERNAL_EMAIL
  const from = process.env.SENDGRID_FROM_EMAIL

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { error: 'Missing SendGrid environment configuration.' },
      { status: 500 }
    )
  }

  try {
    sgMail.setApiKey(apiKey)

    await sgMail.send({
      to,
      from,
      subject: 'SendGrid Test Email',
      text: 'This is a test email from the Biaggio Flooring portal.',
      html: '<p>This is a test email from the Biaggio Flooring portal.</p>',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('SendGrid test email failed:', error)
    return NextResponse.json(
      { error: 'SendGrid test email failed.' },
      { status: 500 }
    )
  }
}
