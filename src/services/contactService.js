/**
 * Lightweight contact/callback service, separate from the full
 * appointment enquiry flow (e.g. a future "request a callback" widget).
 * Mirrors appointmentService's mock-now / real-later pattern.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function submitContactRequest(payload) {
  const enriched = {
    ...payload,
    submittedAt: new Date().toISOString(),
  }

  if (!API_BASE_URL) {
    // Also feeds the staff dashboard (src/admin) so it has something to show
    // before the real backend endpoints exist.
    const id = `mock-contact-${Date.now()}`
    const record = { ...enriched, id, status: 'new' }
    console.info('[mock] Contact request captured:', record)
    try {
      const existing = JSON.parse(localStorage.getItem('nhsc_contacts') || '[]')
      existing.push(record)
      localStorage.setItem('nhsc_contacts', JSON.stringify(existing))
    } catch (e) {
      // localStorage may be unavailable — safe to ignore for the mock
    }
    await new Promise((resolve) => setTimeout(resolve, 400))
    return { success: true, id }
  }

  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enriched),
  })
  if (!res.ok) throw new Error('Failed to submit contact request')
  return res.json()
}
