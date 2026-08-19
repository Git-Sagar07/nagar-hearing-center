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
 * Nothing in the components needs to change — they only call
 * `submitAppointment(payload)` and await the result.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function submitAppointment(payload) {
  const enriched = {
    ...payload,
    source: 'website-enquiry-form',
    submittedAt: new Date().toISOString(),
  }

  if (!API_BASE_URL) {
    // --- MOCK MODE: no backend configured yet ---
    console.info('[mock] Appointment enquiry captured:', enriched)
    try {
      const existing = JSON.parse(localStorage.getItem('nhsc_appointments') || '[]')
      existing.push(enriched)
      localStorage.setItem('nhsc_appointments', JSON.stringify(existing))
    } catch (e) {
      // localStorage may be unavailable — safe to ignore for the mock
    }
    await new Promise((resolve) => setTimeout(resolve, 600))
    return { success: true, id: `mock-${Date.now()}` }
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
