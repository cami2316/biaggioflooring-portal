'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import InvoicePrintView from '@/components/InvoicePrintView'

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  partial:   'bg-blue-100 text-blue-800',
  paid:      'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

type Invoice = any

export default function InvoiceDetailPage() {
  const { id }                  = useParams<{ id: string }>()
  const router                  = useRouter()
  const [invoice, setInvoice]   = useState<Invoice | null>(null)
  const [loading, setLoading]   = useState(true)
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('check')
  const [paying,  setPaying]    = useState(false)
  const [payError, setPayError] = useState('')

  const load = () => {
    setLoading(true)
    fetch(`/api/invoices/${id}`)
      .then(r => r.json())
      .then(d => { setInvoice(d.invoice); setLoading(false) })
  }

  useEffect(load, [id])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payAmount || parseFloat(payAmount) <= 0) { setPayError('Enter a valid amount.'); return }
    setPayError(''); setPaying(true)
    const res  = await fetch('/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_id: id, amount: parseFloat(payAmount), method: payMethod }),
    })
    const json = await res.json()
    setPaying(false)
    if (!res.ok) { setPayError(json.error || 'Error.'); return }
    setPayAmount('')
    load()
  }

  const handleCancel = async () => {
    if (!confirm('Cancel this invoice?')) return
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' })
    router.push('/admin/invoices')
  }

  if (loading) return <p className="text-gray-400 p-6">Loading...</p>
  if (!invoice) return <p className="text-red-500 p-6">Invoice not found.</p>

  const balance = Number(invoice.total) - Number(invoice.total_paid)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/admin/invoices" className="text-gray-400 hover:text-gray-600 text-sm">← Invoices</Link>
          <h1 className="text-2xl font-bold text-[#212121]">
            {invoice.invoice_number ? `Invoice #${invoice.invoice_number}` : 'Invoice'}
          </h1>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[invoice.status] || 'bg-gray-100 text-gray-700'}`}>
            {invoice.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()}
            className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Print / PDF
          </button>
          <Link href={`/admin/invoices/${id}/edit`}
            className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Edit
          </Link>
          {invoice.status !== 'cancelled' && (
            <button onClick={handleCancel}
              className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Print view */}
      <InvoicePrintView invoice={invoice} />

      {/* Register payment */}
      {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
        <div className="mt-6 bg-white rounded-xl shadow-sm p-5 print:hidden">
          <h2 className="font-semibold text-gray-700 mb-3">Registrar Pagamento</h2>
          <p className="text-sm text-gray-500 mb-3">Balance: <strong>${balance.toFixed(2)}</strong></p>
          <form onSubmit={handlePayment} className="flex gap-3 items-end">
            <div>
              <label className="text-xs text-gray-500 font-medium uppercase block mb-1">Amount ($)</label>
              <input type="number" min="0.01" step="0.01" value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium uppercase block mb-1">Method</label>
              <select value={payMethod} onChange={e => setPayMethod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#46C038]">
                <option value="check">Check</option>
                <option value="cash">Cash</option>
                <option value="zelle">Zelle</option>
                <option value="ach">ACH</option>
                <option value="card">Card</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit" disabled={paying}
              className="bg-[#46C038] hover:bg-[#3aad2d] disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
              {paying ? 'Saving...' : 'Save Payment'}
            </button>
          </form>
          {payError && <p className="text-red-500 text-sm mt-2">{payError}</p>}
        </div>
      )}

      {/* Payment history */}
      {invoice.payments?.length > 0 && (
        <div className="mt-4 bg-white rounded-xl shadow-sm p-5 print:hidden">
          <h2 className="font-semibold text-gray-700 mb-3">Payments Received</h2>
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase">
              <tr>
                <th className="text-left pb-2">Date</th>
                <th className="text-left pb-2">Method</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.payments.map((p: any) => (
                <tr key={p.id}>
                  <td className="py-2">{p.received_at?.slice(0, 10) || '—'}</td>
                  <td className="py-2 capitalize">{p.method || '—'}</td>
                  <td className="py-2 text-right font-medium">${Number(p.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
