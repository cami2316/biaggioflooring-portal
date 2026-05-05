'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

type Invoice = {
  id: string
  invoice_number: string | null
  status: string
  issue_date: string | null
  total: number
  total_paid: number
  customers: { customer_name: string } | null
  projects: { project_code: string; project_name: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  partial:   'bg-blue-100 text-blue-800',
  paid:      'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [loading, setLoading]   = useState(true)
  const limit = 20

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    const res  = await fetch(`/api/invoices?${params}`)
    const json = await res.json()
    setInvoices(json.invoices || [])
    setTotal(json.total || 0)
    setLoading(false)
  }, [page, search, status])

  useEffect(() => { load() }, [load])

  const pages = Math.max(1, Math.ceil(total / limit))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#212121]">Invoices</h1>
        <Link
          href="/admin/invoices/new"
          className="bg-[#46C038] hover:bg-[#3aad2d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Nova Invoice
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search customer or invoice #..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#46C038]"
        />
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#46C038]"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Invoice #</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Project</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No invoices found.</td></tr>
            ) : invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-medium">{inv.invoice_number || '—'}</td>
                <td className="px-4 py-3">{inv.customers?.customer_name || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{inv.projects?.project_code || inv.projects?.project_name || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{inv.issue_date || '—'}</td>
                <td className="px-4 py-3 text-right font-medium">${Number(inv.total).toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-gray-500">${Number(inv.total_paid).toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[inv.status] || 'bg-gray-100 text-gray-700'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/invoices/${inv.id}`} className="text-[#46C038] hover:underline text-xs font-medium">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">Page {page} of {pages}</span>
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-3 py-1 rounded border text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
