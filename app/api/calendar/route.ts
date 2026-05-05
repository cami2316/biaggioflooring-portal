import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin'
import { supabaseServer } from '@/lib/supabaseServer'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('__session')?.value
  if (!session) return null
  try { return await adminAuth.verifySessionCookie(session, true) } catch { return null }
}

// GET /api/calendar?days=30  — upcoming events
export async function GET(req: Request) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days = Math.min(365, Math.max(1, Number(searchParams.get('days') || 30)))
  const from = new Date().toISOString()
  const to   = new Date(Date.now() + days * 86_400_000).toISOString()

  const { data, error } = await supabaseServer
    .from('calendar_events')
    .select(`*, customers(customer_name), projects(project_name, project_code)`)
    .gte('start_at', from)
    .lte('start_at', to)
    .order('start_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ events: data })
}

// POST /api/calendar  — create event
export async function POST(req: Request) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (!body.title || !body.start_at) {
    return NextResponse.json({ error: 'title and start_at are required' }, { status: 422 })
  }

  // Get company_id (first company)
  const { data: company } = await supabaseServer
    .from('companies').select('id').limit(1).single()

  const { data, error } = await supabaseServer
    .from('calendar_events')
    .insert({
      company_id:  company?.id || null,
      customer_id: body.customer_id || null,
      project_id:  body.project_id  || null,
      title:       body.title,
      type:        body.type || 'site_visit',
      start_at:    body.start_at,
      end_at:      body.end_at   || null,
      notes:       body.notes    || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ event: data }, { status: 201 })
}
