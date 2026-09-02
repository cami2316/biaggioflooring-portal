'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type LineItem = { id?: string; description: string; quantity: string; unit_price: string; unit: string }
const emptyItem = (): LineItem => ({ description: '', quantity: '1', unit_price: '', unit: 'unit' })

export default function EditInvoicePage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()

  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  const [invoiceNum, setInvoiceNum] = useState('')
  const [issueDate,  setIssueDate]  = useState('')
  const [dueDate,    setDueDate]    = useState('')
  const [discount,   setDiscount]   = useState('0')
  const [notes,      setNotes]      = useState('')
  const [status,     setStatus]     = useState('pending')
  const [items,      setItems]      = useState<LineItem[]>([emptyItem()])

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then(r => r.json())
      .then(({ invoice }) => {
        if (!invoice) return
        setInvoiceNum(invoice.invoice_number || '')
        setIssueDate(invoice.issue_date || '')
        setDueDate(invoice.due_date || '')
        setDiscount(String(invoice.discount || '0'))
        setNotes(invoice.notes || '')
        setStatus(invoice.status || 'pending')
        const allItems: LineItem[] = (invoice.invoice_sections || []).flatMap((s: any) =>
          (s.invoice_items || []).map((it: any) => ({
            id:          it.id,
            description: it.description,
            quantity:    String(it.quantity),
            unit_price:  String(it.unit_price),
            unit:        it.unit || 'unit',
          }))
        )
        setItems(allItems.length ? allItems : [emptyItem()])
        setLoading(false)
      })
  }, [id])

  const subtotal = items.reduce((s, i) => s + (parseFloat(i.quantity || '0') * parseFloat(i.unit_price || '0')), 0)
  const total    = Math.max(0, subtotal - parseFloat(discount || '0'))

  const updateItem = (idx: number, field: keyof LineItem, value: string) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSaving(true)

    // Update meta fields
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoice_number: invoiceNum || null,
        issue_date:     issueDate || null,
        due_date:       dueDate   || null,
        discount:       parseFloat(discount || '0'),
        notes:          notes     || null,
        status,
      }),
    })
    setSaving(false)
    if (!res.ok) { const j = await res.json(); setError(j.error || 'Error saving.'); return }
    router.push(`/admin/invoices/${id}`)
  }

  if (loading) return <p className="text-gray-400 p-6">Loading...</p>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/admin/invoices/${id}`} className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
        <h1 className="text-2xl font-bold text-[#212121]">Edit Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice meta */}
        <div className="bg-white rounded-xl shadow-sm p-5 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase">Invoice #</label>
            <input type="text" value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)}
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]">
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase">Issue Date</label>
            <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)}
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase">Discount ($)</label>
            <input type="number" min="0" step="0.01" value={discount} onChange={e => setDiscount(e.target.value)}
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
          </div>
        </div>

        {/* Line items (read-only preview — item editing requires reimporting) */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
          <h2 className="font-semibold text-gray-700">Line Items</h2>
          <p className="text-xs text-gray-400">Item descriptions and prices are shown for reference. To change items, delete and recreate the invoice.</p>
          <div className="divide-y text-sm">
            {items.map((it, idx) => (
              <div key={idx} className="flex justify-between py-2">
                <span className="text-gray-700">{it.description || '—'}</span>
                <span className="text-gray-500">{it.quantity} × ${parseFloat(it.unit_price || '0').toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2 font-semibold text-sm">Total: ${total.toFixed(2)}</div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <label className="text-xs text-gray-500 font-medium uppercase">Notes / Terms</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-[#46C038] hover:bg-[#3aad2d] disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href={`/admin/invoices/${id}`}
            className="px-6 py-2 rounded-lg text-sm border hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
