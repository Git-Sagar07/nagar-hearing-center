import { useEffect, useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clinic } from '../data/clinicInfo'
import { getAppointments, getContacts, updateStatus, deleteRecords, logout, usingMockData } from './adminService'
import { formatSlotLabel } from '../services/slotService'

// How long a completed/cancelled appointment stays in "Completed" before it's
// eligible to move to "Old Records". Adjust freely — this is the only place
// the retention window is defined.
const COMPLETED_RETENTION_MONTHS = 6

const APPOINTMENT_STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-teal-50 text-teal-700 border-teal-200',
  completed: 'bg-navy-50 text-navy-700 border-navy-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}
const APPOINTMENT_STATUS_LABELS = { pending: 'Pending', confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled' }

const CONTACT_STATUS_STYLES = {
  new: 'bg-teal-50 text-teal-700 border-teal-200',
  contacted: 'bg-navy-50 text-navy-700 border-navy-200',
  closed: 'bg-ink/5 text-ink/50 border-ink/10',
}
const CONTACT_STATUS_LABELS = { new: 'New', contacted: 'Contacted', closed: 'Closed' }

function Badge({ status, styles, labels }) {
  const s = status || Object.keys(labels)[0]
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[s] || ''}`}>
      {labels[s] || s}
    </span>
  )
}

function formatWhen(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}

function formatAppointmentSlot(record) {
  if (!record.preferredDate) return 'No date chosen'
  const date = new Date(`${record.preferredDate}T00:00:00`)
  const dateLabel = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
  const timeLabel = record.preferredTime ? formatSlotLabel(record.preferredTime) : ''
  return timeLabel ? `${dateLabel} — ${timeLabel}` : dateLabel
}

function monthsSince(dateStr) {
  if (!dateStr) return 0
  const then = new Date(`${dateStr}T00:00:00`)
  const now = new Date()
  return (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth())
}

const SERVICE_LABELS = {
  'hearing-aid': 'Hearing Aid',
  audiometry: 'Audiometry',
  'speech-therapy': 'Speech Therapy',
}

const APPOINTMENT_DETAIL_FIELDS = [
  ['city', 'City'],
  ['preferredContact', 'Preferred Contact'],
  ['haFor', 'For'],
  ['haCurrentUser', 'Current HA User'],
  ['haCurrentType', 'Current HA Type'],
  ['haConcern', 'Concern'],
  ['haAppointmentType', 'Appointment Type'],
  ['audReason', 'Reason'],
  ['audPreviousTest', 'Previous Test'],
  ['stFor', 'For'],
  ['stConcern', 'Concern'],
  ['stLanguage', 'Preferred Language'],
  ['message', 'Message'],
]

const CONTACT_DETAIL_FIELDS = [
  ['preferredContact', 'Preferred Contact'],
  ['message', 'Message'],
]

/* ---------------- Appointments: Upcoming / Completed / Old Records ---------------- */

function AppointmentRow({ record, section, selected, onToggleSelect, expanded, onToggle, onStatusChange, onDelete }) {
  const filledDetails = APPOINTMENT_DETAIL_FIELDS.filter(([key]) => record[key])

  return (
    <div className="border border-navy-100/70 rounded-2xl overflow-hidden bg-white">
      <div className="w-full flex flex-wrap items-center gap-3 md:gap-5 px-4 py-3.5">
        {section === 'old' && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-navy-300 text-teal-600 focus:ring-teal-500"
          />
        )}
        <button onClick={onToggle} className="flex flex-wrap flex-1 items-center gap-3 md:gap-5 text-left">
          <div className="min-w-[140px] flex-1">
            <p className="font-semibold text-navy-800 text-sm">{record.fullName || 'Unnamed'}</p>
            <p className="text-xs text-ink/50">{record.mobile}</p>
          </div>
          <div className="min-w-[110px] text-xs text-navy-700 font-medium">
            {SERVICE_LABELS[record.service] || record.service}
          </div>
          <div className="min-w-[140px] text-xs font-semibold text-navy-800">{formatAppointmentSlot(record)}</div>
          <Badge status={record.status} styles={APPOINTMENT_STATUS_STYLES} labels={APPOINTMENT_STATUS_LABELS} />
          <svg className={`w-4 h-4 text-ink/40 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-navy-100/70"
          >
            <div className="px-4 py-4 bg-mist/40">
              <p className="text-xs text-ink/50 mb-3">Submitted {formatWhen(record.submittedAt)}</p>
              {filledDetails.length > 0 && (
                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                  {filledDetails.map(([key, label]) => (
                    <div key={key}>
                      <dt className="text-[11px] uppercase tracking-wide text-ink/40 font-semibold">{label}</dt>
                      <dd className="text-sm text-navy-800">{record[key]}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="flex flex-wrap gap-2">
                {section === 'upcoming' && record.status === 'pending' && (
                  <ActionButton onClick={() => onStatusChange(record.id, 'confirmed')}>Confirm</ActionButton>
                )}
                {section === 'upcoming' && record.status === 'confirmed' && (
                  <ActionButton onClick={() => onStatusChange(record.id, 'completed')}>Mark Completed</ActionButton>
                )}
                {section === 'upcoming' && (
                  <ActionButton danger onClick={() => onStatusChange(record.id, 'cancelled')}>Cancel</ActionButton>
                )}
                {section === 'completed' && (
                  <ActionButton danger onClick={() => onDelete(record.id)}>Delete</ActionButton>
                )}
                <a
                  href={`tel:+91${record.mobile}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-teal-200 text-teal-700 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-colors"
                >
                  Call {record.mobile}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ActionButton({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
        danger
          ? 'border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600'
          : 'border-navy-200 hover:bg-navy-800 hover:text-white hover:border-navy-800'
      }`}
    >
      {children}
    </button>
  )
}

function AppointmentSection({ section, records, loading, error, onStatusChange, onDelete, onBulkDelete }) {
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  const filtered = useMemo(() => {
    return records.filter(
      (r) => !query || r.fullName?.toLowerCase().includes(query.toLowerCase()) || r.mobile?.includes(query)
    )
  }, [records, query])

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function handleBulkDelete() {
    if (selectedIds.length === 0) return
    const ok = window.confirm(
      `Permanently delete ${selectedIds.length} record${selectedIds.length > 1 ? 's' : ''}? This cannot be undone.`
    )
    if (!ok) return
    onBulkDelete(selectedIds)
    setSelectedIds([])
  }

  const sectionCopy = {
    upcoming: 'Kept here until confirmed and completed, or cancelled.',
    completed: `Kept for ${COMPLETED_RETENTION_MONTHS} months after the appointment date, then eligible to move to Old Records. You can delete any of these manually at any time.`,
    old: 'Select one or more records and delete them permanently — this cannot be undone.',
  }

  return (
    <div>
      <p className="text-xs text-ink/50 mb-4">{sectionCopy[section]}</p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or mobile…"
          className="flex-1 min-w-[200px] rounded-xl border border-navy-100 px-3.5 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition"
        />
        {section === 'old' && (
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            className="text-sm font-semibold px-3.5 py-2 rounded-xl border border-red-200 text-red-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
          >
            Delete Selected {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-ink/50 py-8 text-center">Loading…</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-ink/50 py-8 text-center">No records here.</p>
      )}

      <div className="space-y-2.5">
        {filtered.map((record) => (
          <AppointmentRow
            key={record.id}
            record={record}
            section={section}
            selected={selectedIds.includes(record.id)}
            onToggleSelect={() => toggleSelect(record.id)}
            expanded={expandedId === record.id}
            onToggle={() => setExpandedId(expandedId === record.id ? null : record.id)}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------------- Contact Requests (unchanged simple new/contacted/closed flow) ---------------- */

function ContactRow({ record, onStatusChange, expanded, onToggle }) {
  const filledDetails = CONTACT_DETAIL_FIELDS.filter(([key]) => record[key])

  return (
    <div className="border border-navy-100/70 rounded-2xl overflow-hidden bg-white">
      <button onClick={onToggle} className="w-full flex flex-wrap items-center gap-3 md:gap-5 px-4 py-3.5 text-left hover:bg-mist/60 transition-colors">
        <div className="min-w-[140px] flex-1">
          <p className="font-semibold text-navy-800 text-sm">{record.fullName || 'Unnamed'}</p>
          <p className="text-xs text-ink/50">{record.mobile}</p>
        </div>
        <div className="min-w-[130px] text-xs text-ink/50">{formatWhen(record.submittedAt)}</div>
        <Badge status={record.status} styles={CONTACT_STATUS_STYLES} labels={CONTACT_STATUS_LABELS} />
        <svg className={`w-4 h-4 text-ink/40 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-navy-100/70"
          >
            <div className="px-4 py-4 bg-mist/40">
              {filledDetails.length > 0 && (
                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                  {filledDetails.map(([key, label]) => (
                    <div key={key}>
                      <dt className="text-[11px] uppercase tracking-wide text-ink/40 font-semibold">{label}</dt>
                      <dd className="text-sm text-navy-800">{record[key]}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="flex flex-wrap gap-2">
                {['new', 'contacted', 'closed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(record.id, s)}
                    disabled={record.status === s}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                      record.status === s
                        ? 'opacity-40 cursor-default border-navy-100'
                        : 'border-navy-200 hover:bg-navy-800 hover:text-white hover:border-navy-800'
                    }`}
                  >
                    Mark as {CONTACT_STATUS_LABELS[s]}
                  </button>
                ))}
                <a
                  href={`tel:+91${record.mobile}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-teal-200 text-teal-700 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-colors"
                >
                  Call {record.mobile}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ContactList({ records, loading, error, onStatusChange }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesQuery = !query || r.fullName?.toLowerCase().includes(query.toLowerCase()) || r.mobile?.includes(query)
      const matchesStatus = statusFilter === 'all' || (r.status || 'new') === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [records, query, statusFilter])

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or mobile…"
          className="flex-1 min-w-[200px] rounded-xl border border-navy-100 px-3.5 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-navy-100 px-3 py-2 text-sm focus:border-teal-500 outline-none"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading && <p className="text-sm text-ink/50 py-8 text-center">Loading…</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      {!loading && !error && filtered.length === 0 && <p className="text-sm text-ink/50 py-8 text-center">No records match.</p>}

      <div className="space-y-2.5">
        {filtered.map((record) => (
          <ContactRow
            key={record.id}
            record={record}
            expanded={expandedId === record.id}
            onToggle={() => setExpandedId(expandedId === record.id ? null : record.id)}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------------- Top-level dashboard ---------------- */

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('appointments')
  const [appointmentSection, setAppointmentSection] = useState('upcoming')
  const [appointments, setAppointments] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [a, c] = await Promise.all([getAppointments(), getContacts()])
      setAppointments(a)
      setContacts(c)
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const { upcoming, completed, old } = useMemo(() => {
    const upcoming = []
    const completed = []
    const old = []
    for (const a of appointments) {
      if (a.status === 'pending' || a.status === 'confirmed') {
        upcoming.push(a)
      } else {
        const age = monthsSince(a.preferredDate || a.submittedAt)
        if (age >= COMPLETED_RETENTION_MONTHS) old.push(a)
        else completed.push(a)
      }
    }
    return { upcoming, completed, old }
  }, [appointments])

  async function handleAppointmentStatusChange(id, status) {
    setAppointments((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    try {
      await updateStatus('appointments', id, status)
    } catch {
      setError('Failed to update status — please refresh and try again.')
    }
  }

  async function handleAppointmentDelete(id) {
    const ok = window.confirm('Permanently delete this appointment? This cannot be undone.')
    if (!ok) return
    setAppointments((prev) => prev.filter((r) => r.id !== id))
    try {
      await deleteRecords('appointments', [id])
    } catch {
      setError('Failed to delete — please refresh and try again.')
    }
  }

  async function handleAppointmentBulkDelete(ids) {
    setAppointments((prev) => prev.filter((r) => !ids.includes(r.id)))
    try {
      await deleteRecords('appointments', ids)
    } catch {
      setError('Failed to delete — please refresh and try again.')
    }
  }

  async function handleContactStatusChange(id, status) {
    setContacts((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    try {
      await updateStatus('contacts', id, status)
    } catch {
      setError('Failed to update status — please refresh and try again.')
    }
  }

  function handleLogout() {
    logout()
    onLogout()
  }

  const pendingCount = appointments.filter((a) => a.status === 'pending').length
  const newContactCount = contacts.filter((c) => (c.status || 'new') === 'new').length

  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-white border-b border-navy-100/70 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-9 w-9 object-contain bg-mist rounded-full p-1" />
            <div>
              <p className="font-display font-bold text-navy-800 leading-tight text-sm">{clinic.name}</p>
              <p className="text-xs text-ink/50">Staff Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadAll} className="text-sm font-medium text-navy-700 hover:text-teal-600 transition-colors">Refresh</button>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold px-3.5 py-1.5 rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-800 hover:text-white hover:border-navy-800 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        {usingMockData() && (
          <div className="mb-6 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3">
            <strong>Demo data mode:</strong> the backend admin API isn't connected yet, so this shows
            enquiries submitted from this browser only (stored locally). Once the backend is updated,
            this will show real submissions from every visitor.
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('appointments')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'appointments' ? 'bg-navy-800 text-white' : 'bg-white text-navy-700 border border-navy-100'}`}
          >
            Appointments
            {pendingCount > 0 && <span className="ml-2 bg-teal-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount} pending</span>}
          </button>
          <button
            onClick={() => setTab('contacts')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'contacts' ? 'bg-navy-800 text-white' : 'bg-white text-navy-700 border border-navy-100'}`}
          >
            Contact Requests
            {newContactCount > 0 && <span className="ml-2 bg-teal-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{newContactCount} new</span>}
          </button>
        </div>

        {tab === 'appointments' && (
          <>
            <div className="flex gap-2 mb-5 border-b border-navy-100">
              {[
                ['upcoming', 'Upcoming', upcoming.length],
                ['completed', 'Completed', completed.length],
                ['old', 'Old Records', old.length],
              ].map(([key, label, count]) => (
                <button
                  key={key}
                  onClick={() => setAppointmentSection(key)}
                  className={`px-3.5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                    appointmentSection === key ? 'border-teal-500 text-navy-800' : 'border-transparent text-navy-700/50 hover:text-navy-700'
                  }`}
                >
                  {label} <span className="text-xs font-normal text-navy-700/40">({count})</span>
                </button>
              ))}
            </div>

            <AppointmentSection
              section={appointmentSection}
              records={appointmentSection === 'upcoming' ? upcoming : appointmentSection === 'completed' ? completed : old}
              loading={loading}
              error={error}
              onStatusChange={handleAppointmentStatusChange}
              onDelete={handleAppointmentDelete}
              onBulkDelete={handleAppointmentBulkDelete}
            />
          </>
        )}

        {tab === 'contacts' && (
          <ContactList records={contacts} loading={loading} error={error} onStatusChange={handleContactStatusChange} />
        )}
      </main>
    </div>
  )
}
