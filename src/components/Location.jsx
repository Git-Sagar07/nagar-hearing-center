import { clinic, telHref, mapsHref } from '../data/clinicInfo'
import { Eyebrow, FadeIn } from './SignatureMotifs'

export default function Location() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-mist scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <FadeIn className="max-w-xl">
          <Eyebrow tone="navy">Visit Us</Eyebrow>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
            Find us in Savedi, Ahilyanagar
          </h2>
        </FadeIn>

        <div className="mt-10 grid lg:grid-cols-2 gap-6 items-stretch">
          <FadeIn className="rounded-3xl overflow-hidden shadow-card border border-navy-50 min-h-[320px]">
            <iframe
              title="Nagar Hearing And Speech Centre location map"
              src="https://www.google.com/maps?q=Nagar+Hearing+And+Speech+Centre,+Hanuman+Nagar,+Savedi,+Ahilyanagar,+Maharashtra+414003&output=embed"
              className="w-full h-full min-h-[320px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="h-full rounded-3xl bg-white shadow-card border border-navy-50 p-7 md:p-8 flex flex-col justify-center">
              <div className="space-y-5">
                <InfoRow icon="📍" label="Address" value={clinic.address} />
                <InfoRow icon="🏥" label="Landmark" value={clinic.landmark} />
                <InfoRow icon="📞" label="Phone" value={clinic.phoneDisplay} href={telHref} />
                <InfoRow icon="🕒" label="Hours" value={clinic.hours} />
              </div>

              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-navy-600 hover:bg-navy-700 text-white font-semibold px-6 py-3.5 shadow-soft transition-colors"
              >
                Get Directions
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function InfoRow({ icon, label, value, href }) {
  const content = (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-teal-600">{label}</p>
      <p className="text-navy-800 font-semibold mt-0.5">{value}</p>
    </div>
  )
  return (
    <div className="flex items-start gap-3.5">
      <span className="text-xl mt-0.5">{icon}</span>
      {href ? (
        <a href={href} className="hover:text-teal-600 transition-colors">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}
