import { clinic, telHref, whatsappHref } from '../data/clinicInfo'
import { FadeIn, RippleRings } from './SignatureMotifs'

export default function QuickConversion() {
  return (
    <section className="relative py-16 md:py-20 bg-navy-700 overflow-hidden">
      <RippleRings
        className="hidden md:block absolute -left-10 -top-10 w-56 h-56"
        ringClassName="border-teal-300/30"
      />
      <div className="max-w-5xl mx-auto px-5 md:px-8 text-center relative">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Having difficulty hearing or communicating?
          </h2>
          <p className="mt-4 text-navy-50/80 text-lg">
            Get professional guidance for{' '}
            <span className="text-teal-300 font-semibold">Hearing Aids &bull; Audiometry &bull; Speech Therapy</span>
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-navy-50 text-navy-800 font-semibold px-6 py-3.5 shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Book Appointment
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3.5 shadow-soft transition-transform hover:-translate-y-0.5"
            >
              WhatsApp
            </a>
            <a
              href={telHref}
              className="inline-flex items-center gap-2 rounded-full ring-2 ring-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3.5 transition-transform hover:-translate-y-0.5"
            >
              Call {clinic.phone}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
