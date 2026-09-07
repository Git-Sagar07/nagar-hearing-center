/**
 * Predefined appointment slots + double-booking prevention.
 *
 * Today (mock mode) availability is computed from the same localStorage
 * list the dashboard reads. Once the real backend exists, replace the body
 * of `getSlotAvailability` / `isSlotAvailable` with a call to
 * `GET /api/appointments/availability?date=YYYY-MM-DD` — nothing in the
 * components that use this file needs to change.
 */

// Clinic hours: 10:00–13:00 and 16:00–20:00, 30-minute slots.
// Adjust this list any time — the rest of the booking flow adapts automatically.
export const CLINIC_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
]

export function formatSlotLabel(time24) {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

// The clinic is closed on Sundays — adjust if that's not accurate.
export function isClinicClosed(dateStr) {
  if (!dateStr) return false
  const day = new Date(`${dateStr}T00:00:00`).getDay()
  return day === 0
}

function readAppointments() {
  try {
    return JSON.parse(localStorage.getItem('nhsc_appointments') || '[]')
  } catch {
    return []
  }
}

// A cancelled appointment frees up its slot for someone else to book.
function isActive(appointment) {
  return appointment.status !== 'cancelled'
}

export function getSlotAvailability(dateStr) {
  if (!dateStr) return []
  const appointments = readAppointments()
  const bookedTimes = new Set(
    appointments
      .filter((a) => a.preferredDate === dateStr && isActive(a))
      .map((a) => a.preferredTime)
  )
  return CLINIC_SLOTS.map((time) => ({
    time,
    label: formatSlotLabel(time),
    available: !bookedTimes.has(time),
  }))
}

export function isSlotAvailable(dateStr, time) {
  if (!dateStr || !time) return false
  const appointments = readAppointments()
  return !appointments.some(
    (a) => a.preferredDate === dateStr && a.preferredTime === time && isActive(a)
  )
}

export function todayISODate() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
