'use client'

import { useEffect, useState } from 'react'

type CalEvent = {
  id: string
  title: string
  type: string
  start_at: string
  end_at: string | null
  notes: string | null
  customers: { customer_name: string } | null
  projects: { project_name: string; project_code: string | null } | null
}

type Customer = { id: string; customer_name: string }
type Project  = { id: string; project_name: string; project_code: string | null }

const TYPE_LABELS: Record<string, string> = {
  site_visit:   'Site Visit',
  installation: 'Installation',
  follow_up:    'Follow-up',
  other:        'Other',
}
const TYPE_COLORS: Record<string, string> = {
  site_visit:   'bg-blue-100 text-blue-800',
  installation: 'bg-green-100 text-green-800',
  follow_up:    'bg-yellow-100 text-yellow-800',
  other:        'bg-gray-100 text-gray-700',
}

export default function CalendarPage() {
  const [events,    setEvents]    = useState<CalEvent[]>([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [projects,  setProjects]  = useState<Project[]>([])

  // form state
  const [title,      setTitle]      = useState('')
  const [type,       setType]       = useState('site_visit')
  const [startAt,    setStartAt]    = useState('')
  const [endAt,      setEndAt]      = useState('')
  const [notes,      setNotes]      = useState('')
  const [customerId, setCustomerId] = useState('')
  const [projectId,  setProjectId]  = useState('')
  const [saving,     setSaving]     = useState(false)
  const [formError,  setFormError]  = useState('')

  const loadEvents = () => {
    setLoading(true)
    fetch('/api/calendar?days=60')
      .then(r => r.json())
      .then(d => { setEvents(d.events || []); setLoading(false) })
  }

  useEffect(() => {
    loadEvents()
    fetch('/api/customers').then(r => r.json()).then(d => setCustomers(d.customers || []))
  }, [])

  useEffect(() => {
    if (!customerId) { setProjects([]); return }
    fetch(`/api/projects?customer_id=${customerId}`)
      .then(r => r.json()).then(d => setProjects(d.projects || []))
  }, [customerId])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !startAt) { setFormError('Title and start date are required.'); return }
    setFormError(''); setSaving(true)
    const res = await fetch('/api/calendar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, type, start_at: startAt, end_at: endAt || null,
        notes: notes || null, customer_id: customerId || null, project_id: projectId || null,
      }),
    })
    setSaving(false)
    if (!res.ok) { const j = await res.json(); setFormError(j.error || 'Error.'); return }
    setTitle(''); setType('site_visit'); setStartAt(''); setEndAt(''); setNotes('')
    setCustomerId(''); setProjectId(''); setShowForm(false)
    loadEvents()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    await fetch(`/api/calendar/${id}`, { method: 'DELETE' })
    loadEvents()
  }

  // Group events by date
  const grouped: Record<string, CalEvent[]> = {}
  for (const ev of events) {
    const day = ev.start_at.slice(0, 10)
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(ev)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#212121]">Calendar</h1>
        <div className="flex gap-2">
          <a
            href={`/api/calendar/ics?token=${process.env.NEXT_PUBLIC_ICS_TOKEN || ''}`}
            target="_blank" rel="noreferrer"
            className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            .ics Feed
          </a>
          <button
            onClick={() => setShowForm(v => !v)}
            className="bg-[#46C038] hover:bg-[#3aad2d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Novo Evento
          </button>
        </div>
      </div>

      {/* New event form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Novo Evento</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-gray-500 font-medium uppercase">Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required
                className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium uppercase">Type</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]">
                <option value="site_visit">Site Visit</option>
                <option value="installation">Installation</option>
                <option value="follow_up">Follow-up</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium uppercase">Customer</label>
              <select value={customerId} onChange={e => { setCustomerId(e.target.value); setProjectId('') }}
                className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]">
                <option value="">— none —</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.customer_name}</option>)}
              </select>
            </div>
            {projects.length > 0 && (
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase">Project</label>
                <select value={projectId} onChange={e => setProjectId(e.target.value)}
                  className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]">
                  <option value="">— none —</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.project_code || p.project_name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="text-xs text-gray-500 font-medium uppercase">Start *</label>
              <input type="datetime-local" value={startAt} onChange={e => setStartAt(e.target.value)} required
                className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium uppercase">End</label>
              <input type="datetime-local" value={endAt} onChange={e => setEndAt(e.target.value)}
                className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 font-medium uppercase">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                className="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#46C038]" />
            </div>
            {formError && <p className="col-span-2 text-red-500 text-sm">{formError}</p>}
            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-[#46C038] hover:bg-[#3aad2d] disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                {saving ? 'Saving...' : 'Create Event'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-lg text-sm border hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Event list grouped by day */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p>No upcoming events in the next 60 days.</p>
          <button onClick={() => setShowForm(true)}
            className="mt-4 text-[#46C038] hover:underline text-sm font-medium">
            Create your first event
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, dayEvents]) => (
            <div key={day}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {new Date(day + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h2>
              <div className="space-y-2">
                {dayEvents.map(ev => (
                  <div key={ev.id} className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-4">
                    <div className="text-sm font-mono text-gray-400 w-14 shrink-0 pt-0.5">
                      {new Date(ev.start_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">{ev.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[ev.type] || 'bg-gray-100 text-gray-700'}`}>
                          {TYPE_LABELS[ev.type] || ev.type}
                        </span>
                      </div>
                      {ev.customers && (
                        <p className="text-xs text-gray-500 mt-0.5">{ev.customers.customer_name}</p>
                      )}
                      {ev.projects && (
                        <p className="text-xs text-gray-400">{ev.projects.project_code || ev.projects.project_name}</p>
                      )}
                      {ev.notes && (
                        <p className="text-xs text-gray-400 mt-1">{ev.notes}</p>
                      )}
                    </div>
                    <button onClick={() => handleDelete(ev.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none shrink-0">×</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
