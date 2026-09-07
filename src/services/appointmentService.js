/**
 * Appointment / enquiry service.
 *
 * Today this stores the enquiry locally (mock submission) so the frontend
 * can ship without a backend. When the MERN backend is ready, replace the
 * body of `submitAppointment` with a real fetch call, e.g.:
 *
 *   const res = await fetch(`${API_BASE_URL}/api/appointments`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload),
 *   })
 *   if (!res.ok) throw new Error('Failed to submit appointment')
 *   return res.json()
 *
 * The real backend must re-check slot availability server-side too — the
 * client-side check in slotService.js only prevents accidental double-booking
 * from the same browser session; it can't stop two different visitors from
 * racing for the same slot at the exact same moment.
 *
 * Nothing in the components needs to change — they only call
 * `submitAppointment(payload)` and await the result.
 */

import { isSlotAvailable } from './slotService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function submitAppointment(payload) {
  const enriched = {
    ...payload,
    source: 'website-enquiry-form',
    submittedAt: new Date().toISOString(),
  }

  if (!API_BASE_URL) {
    // --- MOCK MODE: no backend configured yet ---
    // Also feeds the staff dashboard (src/admin) so it has something to show
    // before the real backend endpoints exist.
    if (!isSlotAvailable(payload.preferredDate, payload.preferredTime)) {
      throw new Error('That time slot was just booked by someone else. Please choose another time.')
    }

    const id = `mock-${Date.now()}`
    // Staff must confirm every request — matches the "Pending" state shown on the dashboard.
    const record = { ...enriched, id, status: 'pending' }
    console.info('[mock] Appointment enquiry captured:', record)
    try {
      const existing = JSON.parse(localStorage.getItem('nhsc_appointments') || '[]')
      existing.push(record)
      localStorage.setItem('nhsc_appointments', JSON.stringify(existing))
    } catch (e) {
      // localStorage may be unavailable — safe to ignore for the mock
    }
    await new Promise((resolve) => setTimeout(resolve, 600))
    return { success: true, id }
  }

  // --- REAL MODE: MERN backend connected ---
  const res = await fetch(`${API_BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enriched),
  })
  if (!res.ok) throw new Error('Failed to submit appointment')
  return res.json()
}
