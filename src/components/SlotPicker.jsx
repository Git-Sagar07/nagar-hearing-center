import { useMemo } from 'react'
import { getSlotAvailability, isClinicClosed } from '../services/slotService'

export default function SlotPicker({ date, selectedTime, onSelect }) {
  const slots = useMemo(() => (date ? getSlotAvailability(date) : []), [date])

  if (!date) {
    return <p className="text-sm text-navy-700/50 mt-2">Pick a date to see available times.</p>
  }

  if (isClinicClosed(date)) {
    return (
      <p className="text-sm font-semibold text-red-600 mt-2">
        We're closed on Sundays — please choose a different date.
      </p>
    )
  }

  return (
    <div className="mt-2">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map(({ time, label, available }) => {
          const selected = selectedTime === time
          return (
            <button
              key={time}
              type="button"
              disabled={!available}
              onClick={() => onSelect(time)}
              className={`rounded-xl px-2 py-2.5 text-xs font-semibold border-2 transition-colors ${
                selected
                  ? 'border-teal-500 bg-teal-500 text-white'
                  : available
                  ? 'border-navy-100 bg-white text-navy-700 hover:border-teal-300'
                  : 'border-navy-50 bg-navy-50 text-navy-700/30 cursor-not-allowed line-through'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-navy-700/50 mt-2">Greyed-out times are already booked.</p>
    </div>
  )
}
