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

// POST /api/payments  — register a payment; auto-marks invoice as 'paid' if fully paid
export async function POST(req: Request) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { invoice_id, amount, method, received_at, notes } = body

  if (!invoice_id || !amount) {
    return NextResponse.json({ error: 'invoice_id and amount are required' }, { status: 422 })
  }

  const { data: payment, error: payErr } = await supabaseServer
    .from('payments')
    .insert({
      invoice_id,
      amount:      Math.round(Number(amount) * 100) / 100,
      method:      method || null,
      received_at: received_at || new Date().toISOString(),
      notes:       notes || null,
    })
    .select()
    .single()

  if (payErr) return NextResponse.json({ error: payErr.message }, { status: 500 })

  // Recalculate total_paid for the invoice
  const { data: payments } = await supabaseServer
    .from('payments')
    .select('amount')
    .eq('invoice_id', invoice_id)

  const totalPaid = (payments || []).reduce((s, p) => s + Number(p.amount), 0)

  const { data: invoice } = await supabaseServer
    .from('invoices')
    .select('total')
    .eq('id', invoice_id)
    .single()

  const newStatus = invoice && totalPaid >= invoice.total ? 'paid' : 'partial'

  await supabaseServer
    .from('invoices')
    .update({ total_paid: Math.round(totalPaid * 100) / 100, status: newStatus })
    .eq('id', invoice_id)

  return NextResponse.json({ payment, total_paid: totalPaid, invoice_status: newStatus }, { status: 201 })
}
