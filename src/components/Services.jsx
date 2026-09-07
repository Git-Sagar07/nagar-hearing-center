import { Eyebrow, FadeIn } from './SignatureMotifs'

const SERVICES = [
  {
    id: 'hearing-aids',
    icon: '🎧',
    title: 'Hearing Aids',
    tagline: 'Digital hearing aids, chosen and fitted around you',
    points: [
      'Digital hearing aid options for every budget',
      'Guided hearing aid selection',
      'On-site hearing aid trial',
      'Precise fitting & programming',
      'Ongoing hearing aid service & maintenance',
    ],
    cta: 'Enquire About Hearing Aids',
    accent: 'navy',
  },
  {
    id: 'audiometry',
    icon: '👂',
    title: 'Audiometry / Hearing Test',
    tagline: 'A clear, accurate picture of your hearing',
    points: [
      'Complete hearing evaluation',
      'Modern audiometry equipment',
      'Results explained in plain language',
      'Routine checks & doctor-referred tests',
      'Guidance on the right next step',
    ],
    cta: 'Book Hearing Test',
    accent: 'teal',
  },
  {
    id: 'speech-therapy',
    icon: '🗣️',
    title: 'Speech Therapy',
    tagline: 'Communication support for children &amp; adults',
    points: [
      'Speech & language assessment',
      'Support for speech delay in children',
      'Pronunciation & articulation practice',
      'Communication-building sessions',
      'Sessions in Marathi, Hindi or English',
    ],
    cta: 'Enquire About Speech Therapy',
    accent: 'navy',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <FadeIn className="max-w-2xl">
          <Eyebrow>Our Main Services</Eyebrow>
          <h2 className="mt-4 text-3xl md:text-[2.6rem] font-extrabold text-navy-800 leading-tight">
            Three specialities. One focused clinic.
          </h2>
          <p className="mt-4 text-navy-700/75 text-lg leading-relaxed">
            We keep our care deliberately focused so every patient gets specialist attention —
            not a generic checklist.
          </p>
        </FadeIn>

        <div className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-7">
          {SERVICES.map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.1}>
              <article
                id={service.id}
                className="group h-full flex flex-col rounded-3xl bg-mist border border-navy-50 p-7 lg:p-8 shadow-card hover:shadow-soft transition-shadow scroll-mt-24"
              >
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shadow-card ${
                    service.accent === 'teal' ? 'bg-teal-500' : 'bg-navy-600'
                  }`}
                >
                  <span>{service.icon}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-navy-800">{service.title}</h3>
                <p className="mt-1.5 text-sm font-semibold text-teal-600">{service.tagline}</p>

                <ul className="mt-5 space-y-2.5 flex-1">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-navy-700/80">
                      <CheckIcon accent={service.accent} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#enquiry"
                  className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm px-5 py-3 transition-all group-hover:-translate-y-0.5 ${
                    service.accent === 'teal'
                      ? 'bg-teal-500 hover:bg-teal-600 text-white'
                      : 'bg-navy-600 hover:bg-navy-700 text-white'
                  }`}
                >
                  {service.cta}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function CheckIcon({ accent }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`mt-0.5 shrink-0 ${accent === 'teal' ? 'text-teal-500' : 'text-navy-500'}`}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.14" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
