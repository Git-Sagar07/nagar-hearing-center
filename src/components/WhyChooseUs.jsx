import { Eyebrow, FadeIn } from './SignatureMotifs'

const REASONS = [
  { icon: '🩺', title: 'Experienced Care', text: 'Focused, specialist attention for every patient.' },
  { icon: '🔬', title: 'Modern Equipment', text: 'Accurate audiometry & hearing evaluation tools.' },
  { icon: '🤝', title: 'Personalised Attention', text: 'Care plans built around your hearing needs.' },
  { icon: '🎧', title: 'Hearing Aid Guidance', text: 'Honest advice on selection, trial and fitting.' },
  { icon: '👂', title: 'Audiometry Services', text: 'Clear hearing tests with results you understand.' },
  { icon: '🗣️', title: 'Speech Therapy', text: 'Communication support for children & adults.' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-24 bg-mist">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <FadeIn className="max-w-xl">
          <Eyebrow tone="navy">Why Choose Us</Eyebrow>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
            Care built around your ears, at every age.
          </h2>
        </FadeIn>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map((reason, i) => (
            <FadeIn key={reason.title} delay={i * 0.06}>
              <div className="h-full flex items-start gap-4 rounded-2xl bg-white p-5 shadow-card border border-navy-50">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-teal-50 flex items-center justify-center text-xl">
                  {reason.icon}
                </div>
                <div>
                  <h3 className="font-bold text-navy-800">{reason.title}</h3>
                  <p className="text-sm text-navy-700/70 mt-1 leading-relaxed">{reason.text}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
