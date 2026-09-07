/**
 * Admin dashboard data service.
 *
 * Follows the same mock-now / real-later pattern as appointmentService.js
 * and contactService.js: today (no backend admin endpoints yet) it reads
 * the mock data that the public forms save to localStorage, plus a
 * password check against a demo password. Once the backend adds real
 * admin endpoints, only the bodies of these functions need to change —
 * AdminDashboard.jsx never needs to know which mode it's in.
 *
 * ---- Wiring up the real backend later ----
 * Expected endpoints (to be added to the Express backend):
 *   POST   /api/admin/login              { password }  -> { token }
 *   GET    /api/admin/appointments       (Bearer token) -> { data: Appointment[] }
 *   GET    /api/admin/contacts           (Bearer token) -> { data: Contact[] }
 *   PATCH  /api/admin/appointments/:id   (Bearer token) { status } -> { data }
 *   PATCH  /api/admin/contacts/:id       (Bearer token) { status } -> { data }
 *   DELETE /api/admin/appointments       (Bearer token) { ids: string[] } -> { success }
 *   DELETE /api/admin/contacts           (Bearer token) { ids: string[] } -> { success }
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Demo-only password used while there's no real backend auth.
// Override with VITE_ADMIN_DEMO_PASSWORD in .env for a slightly less-guessable default.
// This is NOT secure and must be replaced by real backend-issued auth before go-live.
const DEMO_PASSWORD = import.meta.env.VITE_ADMIN_DEMO_PASSWORD || 'nagar-admin'

const TOKEN_KEY = 'nhsc_admin_token'

function isRealBackend() {
  return Boolean(API_BASE_URL)
}

function authHeaders() {
  const token = sessionStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function isLoggedIn() {
  return Boolean(sessionStorage.getItem(TOKEN_KEY))
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY)
}

export async function login(password) {
  if (!isRealBackend()) {
    await new Promise((resolve) => setTimeout(resolve, 350))
    if (password !== DEMO_PASSWORD) {
      throw new Error('Incorrect password')
    }
    sessionStorage.setItem(TOKEN_KEY, 'demo-mode-token')
    return { success: true }
  }

  const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) throw new Error('Incorrect password')
  const data = await res.json()
  sessionStorage.setItem(TOKEN_KEY, data.token)
  return data
}

function readMock(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function writeMock(key, records) {
  try {
    localStorage.setItem(key, JSON.stringify(records))
  } catch {
    // ignore
  }
}

export async function getAppointments() {
  if (!isRealBackend()) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return readMock('nhsc_appointments').slice().reverse()
  }

  const res = await fetch(`${API_BASE_URL}/api/admin/appointments`, { headers: authHeaders() })
  if (!res.ok) throw new Error('Failed to load appointments')
  const body = await res.json()
  return body.data
}

export async function getContacts() {
  if (!isRealBackend()) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return readMock('nhsc_contacts').slice().reverse()
  }

  const res = await fetch(`${API_BASE_URL}/api/admin/contacts`, { headers: authHeaders() })
  if (!res.ok) throw new Error('Failed to load contact requests')
  const body = await res.json()
  return body.data
}

export async function updateStatus(kind, id, status) {
  if (!isRealBackend()) {
    const key = kind === 'appointments' ? 'nhsc_appointments' : 'nhsc_contacts'
    const records = readMock(key)
    const updated = records.map((r) => (r.id === id ? { ...r, status } : r))
    writeMock(key, updated)
    await new Promise((resolve) => setTimeout(resolve, 150))
    return { success: true }
  }

  const res = await fetch(`${API_BASE_URL}/api/admin/${kind}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update status')
  return res.json()
}

// Permanently removes one or more records. Used for:
//  - single "Delete" on a completed appointment
//  - bulk "Delete Selected" on old records
export async function deleteRecords(kind, ids) {
  if (!isRealBackend()) {
    const key = kind === 'appointments' ? 'nhsc_appointments' : 'nhsc_contacts'
    const records = readMock(key)
    const idSet = new Set(ids)
    writeMock(key, records.filter((r) => !idSet.has(r.id)))
    await new Promise((resolve) => setTimeout(resolve, 150))
    return { success: true }
  }

  const res = await fetch(`${API_BASE_URL}/api/admin/${kind}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ ids }),
  })
  if (!res.ok) throw new Error('Failed to delete records')
  return res.json()
}

export function usingMockData() {
  return !isRealBackend()
}
