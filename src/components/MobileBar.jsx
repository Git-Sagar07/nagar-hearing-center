import { telHref, whatsappHref } from '../data/clinicInfo'

export default function MobileBar() {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-navy-100 shadow-[0_-8px_24px_-8px_rgba(11,61,110,0.18)]">
      <div className="grid grid-cols-3">
        <a href={telHref} className="flex flex-col items-center justify-center gap-0.5 py-3 text-navy-700 active:bg-navy-50">
          <span className="text-lg">📞</span>
          <span className="text-[11px] font-bold">Call</span>
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 py-3 text-teal-600 border-x border-navy-100 active:bg-teal-50"
        >
          <span className="text-lg">💬</span>
          <span className="text-[11px] font-bold">WhatsApp</span>
        </a>
        <a href="#enquiry" className="flex flex-col items-center justify-center gap-0.5 py-3 text-navy-700 active:bg-navy-50">
          <span className="text-lg">📅</span>
          <span className="text-[11px] font-bold">Appointment</span>
        </a>
      </div>
    </div>
  )
}
