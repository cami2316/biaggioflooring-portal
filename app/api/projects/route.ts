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

// GET /api/projects?customer_id=...
export async function GET(req: Request) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const customerId = searchParams.get('customer_id')

  let query = supabaseServer
    .from('projects')
    .select('id, project_code, project_name, customer_id, status')
    .order('project_name')

  if (customerId) query = query.eq('customer_id', customerId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ projects: data })
}

// POST /api/projects
export async function POST(req: Request) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (!body.customer_id || !body.project_name) {
    return NextResponse.json({ error: 'customer_id and project_name are required' }, { status: 422 })
  }

  const { data, error } = await supabaseServer
    .from('projects')
    .insert({
      customer_id:  body.customer_id,
      project_name: body.project_name,
      project_code: body.project_code || null,
      status:       body.status || 'active',
      address:      body.address || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ project: data }, { status: 201 })
}
