import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin'
import { supabaseServer } from '@/lib/supabaseServer'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('__session')?.value
  if (!session) return null
  try {
    return await adminAuth.verifySessionCookie(session, true)
  } catch {
    return null
  }
}

// GET /api/invoices?page=1&limit=20&status=pending&search=...
export async function GET(req: Request) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page   = Math.max(1, Number(searchParams.get('page') || 1))
  const limit  = Math.min(100, Math.max(1, Number(searchParams.get('limit') || 20)))
  const status = searchParams.get('status')
  const search = searchParams.get('search')?.trim()
  const from   = (page - 1) * limit

  let query = supabaseServer
    .from('invoices')
    .select(`
      id, invoice_number, status, issue_date, due_date, total, total_paid, notes,
      projects ( project_code, project_name ),
      customers ( customer_name )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (status) query = query.eq('status', status)
  if (search) {
    query = query.or(
      `invoice_number.ilike.%${search}%,customers.customer_name.ilike.%${search}%`
    )
  }

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ invoices: data, total: count, page, limit })
}

// POST /api/invoices  — create invoice with sections + items
export async function POST(req: Request) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const {
    customer_id,
    project_id,
    invoice_number,
    issue_date,
    due_date,
    representative,
    terms,
    notes,
    discount,
    items,
  } = body

  if (!customer_id || !items?.length) {
    return NextResponse.json({ error: 'customer_id and items are required' }, { status: 422 })
  }

  const subtotal = (items as any[]).reduce((s: number, i: any) => s + (Number(i.quantity) * Number(i.unit_price)), 0)
  const total    = Math.max(0, subtotal - (Number(discount) || 0))

  const { data: inv, error: invErr } = await supabaseServer
    .from('invoices')
    .insert({
      customer_id, project_id,
      invoice_number: invoice_number || null,
      issue_date: issue_date || new Date().toISOString().slice(0, 10),
      due_date: due_date || null,
      representative: representative || null,
      terms: terms || null,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round((Number(discount) || 0) * 100) / 100,
      total: Math.round(total * 100) / 100,
      total_paid: 0,
      status: 'pending',
      notes: notes || null,
    })
    .select()
    .single()

  if (invErr) return NextResponse.json({ error: invErr.message }, { status: 500 })

  const { data: section, error: secErr } = await supabaseServer
    .from('invoice_sections')
    .insert({ invoice_id: inv.id, title: 'Services', sort_order: 0 })
    .select()
    .single()

  if (secErr) return NextResponse.json({ error: secErr.message }, { status: 500 })

  const rows = (items as any[]).map((item: any, idx: number) => ({
    invoice_id:  inv.id,
    section_id:  section.id,
    description: item.description,
    quantity:    Number(item.quantity),
    unit_price:  Number(item.unit_price),
    unit:        item.unit || 'unit',
    sort_order:  idx,
  }))

  const { error: itemsErr } = await supabaseServer.from('invoice_items').insert(rows)
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 })

  return NextResponse.json({ invoice: inv }, { status: 201 })
}
