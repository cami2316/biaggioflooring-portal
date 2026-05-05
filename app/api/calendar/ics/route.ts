import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

// Shared secret token (set ICS_SECRET in .env.local)
// Google Calendar will call this URL periodically — keep it private
const ICS_SECRET = process.env.ICS_SECRET

function icsDate(dt: string) {
  // Format: 20241231T143000Z
  return new Date(dt).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

// GET /api/calendar/ics?token=<ICS_SECRET>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!ICS_SECRET || token !== ICS_SECRET) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Fetch all events from now + 6 months
  const from = new Date().toISOString()
  const to   = new Date(Date.now() + 180 * 86_400_000).toISOString()

  const { data: events, error } = await supabaseServer
    .from('calendar_events')
    .select(`*, customers(customer_name), projects(project_name)`)
    .gte('start_at', from)
    .lte('start_at', to)
    .order('start_at')

  if (error) return new NextResponse('Internal error', { status: 500 })

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Biaggio Flooring//Admin Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Biaggio Flooring Schedule',
    'X-WR-TIMEZONE:America/New_York',
  ]

  for (const ev of events || []) {
    const startDt = icsDate(ev.start_at)
    const endDt   = ev.end_at ? icsDate(ev.end_at) : icsDate(new Date(new Date(ev.start_at).getTime() + 3_600_000).toISOString())
    const customer = ev.customers?.customer_name ? `\nCustomer: ${ev.customers.customer_name}` : ''
    const project  = ev.projects?.project_name   ? `\nProject: ${ev.projects.project_name}`   : ''
    const notes    = ev.notes ? `\n${ev.notes}` : ''

    lines.push('BEGIN:VEVENT')
    lines.push(`UID:biaggio-${ev.id}@biaggioflooring`)
    lines.push(`DTSTART:${startDt}`)
    lines.push(`DTEND:${endDt}`)
    lines.push(`SUMMARY:${escapeIcs(`[${ev.type.replace(/_/g, ' ').toUpperCase()}] ${ev.title}`)}`)
    lines.push(`DESCRIPTION:${escapeIcs(`${ev.type}${customer}${project}${notes}`)}`)
    lines.push(`DTSTAMP:${icsDate(ev.created_at || new Date().toISOString())}`)
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')

  return new NextResponse(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
