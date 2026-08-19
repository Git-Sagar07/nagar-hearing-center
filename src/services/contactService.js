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
    console.info('[mock] Contact request captured:', enriched)
    await new Promise((resolve) => setTimeout(resolve, 400))
    return { success: true, id: `mock-contact-${Date.now()}` }
  }

  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enriched),
  })
  if (!res.ok) throw new Error('Failed to submit contact request')
  return res.json()
}
