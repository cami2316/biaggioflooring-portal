'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  getIdTokenResult,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore'

import { auth, db } from '@/lib/firebase'
import { Alert, Button, Card, Select, Textarea } from '@/components/ui'

type EstimateItem = {
  id: string
  clientName: string
  email: string
  phone: string
  address: string
  estimatedLow: number
  estimatedHigh: number
  status: string
  createdAt: Timestamp | null
  notes: string
  areas?: Array<{
    type?: string
    sqft?: number
    material?: string
    tileSize?: string
    layout?: string
    extras?: {
      demolition?: boolean
      cementBoard?: boolean
      bench?: boolean
      niches?: number
      window?: boolean
    }
  }>
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const formatCurrency = (value: number) => currencyFormatter.format(Math.ceil(value))

const formatDate = (timestamp: Timestamp | null) => {
  if (!timestamp) {
    return 'Pending'
  }
  return timestamp.toDate().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const normalizeEstimate = (id: string, data: DocumentData): EstimateItem => ({
  id,
  clientName: data.clientName ?? 'Unknown',
  email: data.email ?? 'N/A',
  phone: data.phone ?? 'N/A',
  address: data.address ?? 'N/A',
  estimatedLow: data.estimatedLow ?? 0,
  estimatedHigh: data.estimatedHigh ?? 0,
  status: data.status ?? 'new',
  createdAt: (data.createdAt as Timestamp) ?? null,
  notes: data.notes ?? '',
  areas: data.areas ?? [],
})

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'site visit scheduled', label: 'Site Visit Scheduled' },
  { value: 'closed', label: 'Closed' },
]

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [estimates, setEstimates] = useState<EstimateItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [pendingStatus, setPendingStatus] = useState<Record<string, string>>({})
  const [pendingNotes, setPendingNotes] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      setIsLoading(false)
      if (!nextUser) {
        setIsAdmin(false)
        return
      }

      const token = await getIdTokenResult(nextUser)
      setIsAdmin(token.claims.admin === true)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user || !isAdmin) {
      setEstimates([])
      setPage(1)
      return
    }

    const estimatesQuery = query(
      collection(db, 'estimateRequests'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      estimatesQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => normalizeEstimate(doc.id, doc.data()))
        setEstimates(items)
        setPage((prev) => {
          const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
          return Math.min(prev, totalPages)
        })
        setPendingStatus((prev) => {
          const next = { ...prev }
          items.forEach((estimate) => {
            if (!next[estimate.id]) {
              next[estimate.id] = estimate.status
            }
          })
          return next
        })
        setPendingNotes((prev) => {
          const next = { ...prev }
          items.forEach((estimate) => {
            if (next[estimate.id] === undefined) {
              next[estimate.id] = estimate.notes
            }
          })
          return next
        })
        setError(null)
      },
      (snapshotError) => {
        console.error('Estimate subscription failed:', snapshotError)
        setError('Unable to load estimates. Check Firestore permissions.')
      }
    )

    return () => unsubscribe()
  }, [user, isAdmin])

  const summary = useMemo(() => {
    const total = estimates.length
    const newCount = estimates.filter((estimate) => estimate.status === 'new').length
    return { total, newCount }
  }, [estimates])

  const totalPages = Math.max(1, Math.ceil(estimates.length / pageSize))
  const paginatedEstimates = useMemo(() => {
    const start = (page - 1) * pageSize
    return estimates.slice(start, start + pageSize)
  }, [estimates, page])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="h-5 w-40 rounded-full bg-brand-charcoal/10 animate-pulse" />
          <div className="mt-4 flex gap-6">
            <div className="h-10 w-20 rounded-2xl bg-brand-charcoal/10 animate-pulse" />
            <div className="h-10 w-20 rounded-2xl bg-brand-charcoal/10 animate-pulse" />
          </div>
        </Card>
        <div className="grid gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="p-6">
              <div className="h-4 w-48 rounded-full bg-brand-charcoal/10 animate-pulse" />
              <div className="mt-3 h-3 w-32 rounded-full bg-brand-charcoal/10 animate-pulse" />
              <div className="mt-4 h-6 w-40 rounded-full bg-brand-charcoal/10 animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <Card className="p-8">
        <h2 className="text-xl font-semibold text-brand-charcoal mb-3">Admin Access</h2>
        <p className="text-brand-charcoal/70">
          Please sign in to view estimate requests.
        </p>
      </Card>
    )
  }

  if (!isAdmin) {
    return (
      <Card className="p-8">
        <h2 className="text-xl font-semibold text-brand-charcoal mb-3">Admin Access Required</h2>
        <p className="text-brand-charcoal/70">
          Your account does not have admin permissions. Contact the system owner to enable access.
        </p>
      </Card>
    )
  }

  const handleToggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSave = async (estimateId: string) => {
    const status = pendingStatus[estimateId] ?? 'new'
    const notes = pendingNotes[estimateId] ?? ''

    setSavingId(estimateId)
    try {
      await updateDoc(doc(db, 'estimateRequests', estimateId), {
        status,
        notes,
        updatedAt: serverTimestamp(),
      })
    } catch (saveError) {
      console.error('Failed to update estimate:', saveError)
      setError('Failed to update estimate. Please try again.')
    } finally {
      setSavingId(null)
    }
  }

  const handleExportPdf = () => {
    if (!estimates.length) {
      setError('No estimates available to export.')
      return
    }

    const rows = estimates.map((estimate) => {
      const areas = (estimate.areas ?? []).map((area, index) => {
        const extras = [
          area.extras?.demolition ? 'Demolition' : null,
          area.extras?.cementBoard ? 'Cement Board' : null,
          area.extras?.bench ? 'Bench' : null,
          area.extras?.window ? 'Window' : null,
          Number.isFinite(area.extras?.niches) && (area.extras?.niches ?? 0) > 0
            ? `Niches: ${area.extras?.niches}`
            : null,
        ].filter(Boolean)

        return [
          `Area ${index + 1}`,
          `Type: ${area.type ?? 'N/A'}`,
          `Sqft: ${area.sqft ?? 0}`,
          `Material: ${area.material ?? 'N/A'}`,
          `Tile Size: ${area.tileSize ?? 'N/A'}`,
          `Layout: ${area.layout ?? 'N/A'}`,
          `Extras: ${extras.length ? extras.join(', ') : 'None'}`,
        ].join(' | ')
      }).join('<br />')

      return `
        <tr>
          <td>${escapeHtml(estimate.clientName)}</td>
          <td>${escapeHtml(estimate.email)}</td>
          <td>${escapeHtml(estimate.phone)}</td>
          <td>${escapeHtml(estimate.address)}</td>
          <td>${escapeHtml(formatDate(estimate.createdAt))}</td>
          <td>${escapeHtml(estimate.status)}</td>
          <td>${escapeHtml(formatCurrency(estimate.estimatedLow))} - ${escapeHtml(formatCurrency(estimate.estimatedHigh))}</td>
          <td>${areas || 'N/A'}</td>
          <td>${escapeHtml(pendingNotes[estimate.id] ?? estimate.notes ?? '')}</td>
        </tr>
      `
    }).join('')

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Estimate Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #1f2937; padding: 24px; }
            h1 { font-size: 20px; margin: 0 0 6px; }
            p { margin: 0 0 16px; font-size: 12px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; vertical-align: top; }
            th { background: #f9fafb; text-align: left; }
            tr:nth-child(even) { background: #f3f4f6; }
            .meta { margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <div class="meta">
            <h1>Biaggio Flooring - Estimate Report</h1>
            <p>Generated: ${new Date().toLocaleString('en-US')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Created</th>
                <th>Status</th>
                <th>Range</th>
                <th>Areas</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `

    const popup = window.open('', '_blank', 'width=1200,height=800')
    if (!popup) {
      setError('Unable to open report window. Please allow popups and try again.')
      return
    }

    popup.document.open()
    popup.document.write(html)
    popup.document.close()
    popup.focus()
    popup.print()
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-sm uppercase tracking-widest text-brand-charcoal/60 mb-2">Estimate Summary</p>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-2xl font-semibold text-brand-charcoal">{summary.total}</p>
            <p className="text-sm text-brand-charcoal/70">Total Requests</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-brand-charcoal">{summary.newCount}</p>
            <p className="text-sm text-brand-charcoal/70">New Requests</p>
          </div>
          <Button type="button" variant="secondary" onClick={handleExportPdf}>
            Export PDF Report
          </Button>
        </div>
      </Card>

      {error ? (
        <Alert variant="error">{error}</Alert>
      ) : null}

      <div className="grid gap-5">
        {paginatedEstimates.map((estimate) => (
          <Card key={estimate.id} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-brand-charcoal">{estimate.clientName}</p>
                <p className="text-sm text-brand-charcoal/70">ID: {estimate.id}</p>
                <p className="text-sm text-brand-charcoal/70">Created: {formatDate(estimate.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm uppercase tracking-widest text-brand-charcoal/60">Estimate</p>
                <p className="text-lg font-semibold text-brand-charcoal">
                  {formatCurrency(estimate.estimatedLow)} – {formatCurrency(estimate.estimatedHigh)}
                </p>
                <p className="text-xs text-brand-charcoal/60">Status: {estimate.status}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button type="button" variant="secondary" onClick={() => handleToggle(estimate.id)}>
                {expanded[estimate.id] ? 'Hide Details' : 'View Details'}
              </Button>
              <Select
                value={pendingStatus[estimate.id] ?? estimate.status}
                onChange={(event) =>
                  setPendingStatus((prev) => ({ ...prev, [estimate.id]: event.target.value }))
                }
                className="max-w-[240px]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
              <Button
                type="button"
                onClick={() => handleSave(estimate.id)}
                disabled={savingId === estimate.id}
              >
                {savingId === estimate.id ? 'Saving...' : 'Save Updates'}
              </Button>
            </div>

            {expanded[estimate.id] ? (
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-sm uppercase tracking-widest text-brand-charcoal/60 mb-3">Client Details</p>
                  <div className="space-y-2 text-brand-charcoal/80">
                    <p>Name: {estimate.clientName}</p>
                    <p>Email: {estimate.email}</p>
                    <p>Phone: {estimate.phone}</p>
                    <p>Address: {estimate.address}</p>
                  </div>

                  {estimate.areas?.length ? (
                    <div className="mt-6">
                      <p className="text-sm uppercase tracking-widest text-brand-charcoal/60 mb-3">Areas</p>
                      <div className="space-y-3 text-brand-charcoal/80">
                        {estimate.areas.map((area, index) => (
                          <div key={`${estimate.id}-area-${index}`} className="rounded-2xl border border-brand-charcoal/10 p-4">
                            <p className="font-semibold text-brand-charcoal">Area {index + 1}</p>
                            <p>Type: {area.type ?? 'N/A'}</p>
                            <p>Sqft: {area.sqft ?? 0}</p>
                            <p>Material: {area.material ?? 'N/A'}</p>
                            <p>Tile Size: {area.tileSize ?? 'N/A'}</p>
                            <p>Layout: {area.layout ?? 'N/A'}</p>
                            <p>
                              Extras: {area.extras?.demolition ? 'Demolition' : 'No demolition'},
                              {area.extras?.cementBoard ? ' cement board' : ' no cement board'},
                              {area.extras?.bench ? ' bench' : ' no bench'},
                              {area.extras?.window ? ' window' : ' no window'},
                              niches: {area.extras?.niches ?? 0}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div>
                  <p className="text-sm uppercase tracking-widest text-brand-charcoal/60 mb-3">Admin Notes</p>
                  <Textarea
                    rows={6}
                    value={pendingNotes[estimate.id] ?? ''}
                    onChange={(event) =>
                      setPendingNotes((prev) => ({ ...prev, [estimate.id]: event.target.value }))
                    }
                    placeholder="Add internal notes for this estimate."
                  />
                </div>
              </div>
            ) : null}
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-charcoal/70">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
