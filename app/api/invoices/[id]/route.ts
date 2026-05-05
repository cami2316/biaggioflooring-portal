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

// GET /api/invoices/[id]  — full invoice with sections, items, payments
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const { data, error } = await supabaseServer
    .from('invoices')
    .select(`
      *,
      customers ( * ),
      projects ( * ),
      invoice_items ( * ),
      invoice_sections (
        *,
        invoice_items ( * )
      ),
      payments ( * )
    `)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: error.code === 'PGRST116' ? 404 : 500 })

  // Legacy imported invoices can have items without a section_id.
  // Build a synthetic section so UI components always receive invoice_sections[].invoice_items.
  const standaloneItems = (data.invoice_items || []).filter((item: any) => !item.section_id)
  if (standaloneItems.length && (!data.invoice_sections || data.invoice_sections.length === 0)) {
    data.invoice_sections = [
      {
        id: 'legacy-import-section',
        title: 'Services',
        sort_order: 0,
        invoice_items: standaloneItems,
      },
    ]
  }

  return NextResponse.json({ invoice: data })
}

// PATCH /api/invoices/[id]  — update fields
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const allowedFields = ['invoice_number', 'issue_date', 'due_date', 'notes', 'discount', 'status']
  const updates: Record<string, any> = {}
  for (const k of allowedFields) {
    if (k in body) updates[k] = body[k]
  }

  // recalculate total if discount changed
  if ('discount' in updates) {
    const { data: current } = await supabaseServer
      .from('invoices').select('subtotal').eq('id', id).single()
    if (current) {
      updates.total = Math.max(0, current.subtotal - (Number(updates.discount) || 0))
    }
  }

  const { data, error } = await supabaseServer
    .from('invoices').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ invoice: data })
}

// DELETE /api/invoices/[id]  — soft delete (status = cancelled)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { error } = await supabaseServer
    .from('invoices').update({ status: 'cancelled' }).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
