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

// GET /api/customers?search=...
export async function GET(req: Request) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.trim()

  let query = supabaseServer
    .from('customers')
    .select('id, customer_name, email, phone, address, city_state')
    .order('customer_name')
    .limit(50)

  if (search) query = query.ilike('customer_name', `%${search}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ customers: data })
}

// POST /api/customers
export async function POST(req: Request) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (!body.customer_name) {
    return NextResponse.json({ error: 'customer_name is required' }, { status: 422 })
  }

  const { data, error } = await supabaseServer
    .from('customers')
    .insert({
      customer_name: body.customer_name,
      email:         body.email || null,
      phone:         body.phone || null,
      address:       body.address || null,
      city_state:    body.city_state || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ customer: data }, { status: 201 })
}
