'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type LineItem = { description: string; quantity: string; unit_price: string; unit: string }
type Customer = { id: string; customer_name: string }
type Project  = { id: string; project_code: string; project_name: string }

const emptyItem = (): LineItem => ({ description: '', quantity: '1', unit_price: '', unit: 'unit' })

export default function NewInvoicePage() {
  const router = useRouter()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [projects,  setProjects]  = useState<Project[]>([])
  const [customerId,  setCustomerId]  = useState('')
  const [projectId,   setProjectId]   = useState('')
  const [invoiceNum,  setInvoiceNum]  = useState('')
  const [issueDate,   setIssueDate]   = useState(new Date().toISOString().slice(0, 10))
  const [dueDate,     setDueDate]     = useState('')
  const [representative, setRepresentative] = useState('')
  const [terms, setTerms] = useState('')
  const [discount,    setDiscount]    = useState('0')
  const [notes,       setNotes]       = useState('')
  const [items,       setItems]       = useState<LineItem[]>([emptyItem()])
  const [customerSearch, setCustomerSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  // Load customers
  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/customers?search=${encodeURIComponent(customerSearch)}`)
        .then(r => r.json()).then(d => setCustomers(d.customers || []))
    }, 250)
    return () => clearTimeout(t)
  }, [customerSearch])

  // Load projects when customer changes
  useEffect(() => {
    if (!customerId) { setProjects([]); return }
    fetch(`/api/projects?customer_id=${customerId}`)
      .then(r => r.json()).then(d => setProjects(d.projects || []))
  }, [customerId])

  const subtotal = items.reduce((s, i) => s + (parseFloat(i.quantity || '0') * parseFloat(i.unit_price || '0')), 0)
  const total    = Math.max(0, subtotal - parseFloat(discount || '0'))

  const updateItem = (idx: number, field: keyof LineItem, value: string) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it))
  }
  const addItem    = () => setItems(prev => [...prev, emptyItem()])
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!customerId) { setError('Select a customer.'); return }
    if (items.every(i => !i.description)) { setError('Add at least one line item.'); return }

    setSaving(true)
    const res = await fetch('/api/invoices', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id:    customerId,
        project_id:     projectId || null,
        invoice_number: invoiceNum || null,
        issue_date:     issueDate,
        due_date:       dueDate || null,
        representative: representative || null,
        terms:          terms || null,
        discount:       parseFloat(discount || '0'),
        notes:          notes || null,
        items: items.filter(i => i.description).map(i => ({
          description: i.description,
          quantity:    parseFloat(i.quantity || '0'),
          unit_price:  parseFloat(i.unit_price || '0'),
          unit:        i.unit,
        })),
      }),
    })
    setSaving(false)
    const json = await res.json()
    if (!res.ok) { setError(json.error || 'Error saving invoice.'); return }
    router.push(`/admin/invoices/${json.invoice.id}`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#212121] mb-6">Nova Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Official invoice header */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-2">
              <Image src="/logo/logo.svg" alt="Biaggio Flooring" width={80} height={24} className="h-auto w-auto" />
              <div>
                <p className="font-semibold text-[#212121] text-sm">Biaggio Flooring LLC</p>
                <p className="text-xs text-gray-500">1118 N John Young Pkwy #610</p>
                <p className="text-xs text-gray-500">321 4425003</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs uppercase tracking-wide text-gray-400">Document</p>
              <p className="text-xl font-bold text-[#46C038]">INVOICE</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Preencha os campos abaixo. O layout final com logo e dados oficiais estará pronto para impressão/PDF.
          </p>
        </div>

        {/* Customer + Project */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Cliente</h2>
          <div>
            <input
              type="text"
              placeholder="Search customer..."
              value={customerSearch}
              onChange={e => setCustomerSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full mb-2 focus:outline-none focus:ring-2 focus:ring-[#46C038]"
            />
            {customers.length > 0 && !customerId && (
              <ul className="border rounded-lg divide-y text-sm max-h-40 overflow-y-auto">
                {customers.map(c => (
                  <li key={c.id}>
                    <button type="button" onClick={() => { setCustomerId(c.id); setCustomerSearch(c.customer_name) }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50">{c.customer_name}</button>
                  </li>
                ))}
              </ul>
            )}
            {customerId && (
              <button type="button" onClick={() => { setCustomerId(''); setProjectId(''); setCustomerSearch('') }}
                className="text-xs text-red-500 hover:underline">Clear</button>
            )}
          </div>
          {projects.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 font-medium uppercase">Project (optional)</label>
              <select value={projectId} onChange={e => setProjectId(e.target.value)}
                className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]">
                <option value="">— none —</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.project_code || p.project_name}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Invoice meta */}
        <div className="bg-white rounded-xl shadow-sm p-5 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase">Invoice #</label>
            <input type="text" value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)}
              placeholder="e.g. INV-001"
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
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
            <label className="text-xs text-gray-500 font-medium uppercase">Representative</label>
            <input
              type="text"
              value={representative}
              onChange={e => setRepresentative(e.target.value)}
              placeholder="Nome do representante"
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase">Terms</label>
            <input
              type="text"
              value={terms}
              onChange={e => setTerms(e.target.value)}
              placeholder="Ex: Net 15"
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase">Discount ($)</label>
            <input type="number" min="0" step="0.01" value={discount} onChange={e => setDiscount(e.target.value)}
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
          </div>
        </div>

        {/* Line items */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
          <h2 className="font-semibold text-gray-700">Line Items</h2>
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium uppercase px-1">
            <span className="col-span-5">Description</span>
            <span className="col-span-2">Qty</span>
            <span className="col-span-2">Unit Price</span>
            <span className="col-span-2">Unit</span>
            <span className="col-span-1"></span>
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2">
              <input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)}
                placeholder="Description" className="col-span-5 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
              <input type="number" min="0" step="0.01" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)}
                className="col-span-2 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
              <input type="number" min="0" step="0.01" value={item.unit_price} onChange={e => updateItem(idx, 'unit_price', e.target.value)}
                placeholder="0.00" className="col-span-2 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
              <select value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)}
                className="col-span-2 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#46C038]">
                <option value="unit">unit</option>
                <option value="sqft">sqft</option>
                <option value="hr">hr</option>
                <option value="lf">lf</option>
              </select>
              <button type="button" onClick={() => removeItem(idx)} disabled={items.length === 1}
                className="col-span-1 text-red-400 hover:text-red-600 disabled:opacity-20 text-lg leading-none">×</button>
            </div>
          ))}
          <button type="button" onClick={addItem}
            className="text-sm text-[#46C038] hover:underline font-medium">+ Add item</button>
        </div>

        {/* Totals */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-end">
            <div className="space-y-1 text-sm w-48">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Discount</span><span>-${parseFloat(discount || '0').toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 border-t pt-1">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
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
            {saving ? 'Saving...' : 'Create Invoice'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2 rounded-lg text-sm border hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
