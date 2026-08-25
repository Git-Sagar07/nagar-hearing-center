import { motion } from 'framer-motion'
import { clinic, telHref, whatsappHref } from '../data/clinicInfo'
import { SoundWave, RippleRings } from './SignatureMotifs'

export default function Hero() {
  return (
    <section id="home" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-mist">
      {/* Ambient ripple motif, echoing the clinic's ear/soundwave mark */}
      <RippleRings
        className="hidden md:block absolute -right-16 top-24 w-72 h-72"
        ringClassName="border-teal-400/40"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(14,156,150,0.08),_transparent_55%)]" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-white shadow-card px-4 py-2 text-xs font-bold text-navy-700 mb-6"
            >
              <SoundWave bars={4} className="h-3" barClassName="bg-teal-500" />
              Ahilyanagar's Trusted Hearing &amp; Speech Clinic
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-navy-800 leading-[1.08] tracking-tight"
            >
              Better Hearing.
              <br />
              Better Communication.
              <br />
              <span className="text-teal-600">Better Life.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="mt-6 text-lg text-navy-700/80 max-w-xl leading-relaxed"
            >
              Expert care in <strong className="text-navy-800">Hearing Aids</strong>,{' '}
              <strong className="text-navy-800">Audiometry</strong> and{' '}
              <strong className="text-navy-800">Speech Therapy</strong> for children and adults —
              right here in Savedi, Ahilyanagar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#enquiry"
                className="inline-flex items-center gap-2 rounded-full bg-navy-600 hover:bg-navy-700 text-white font-semibold px-6 py-3.5 shadow-soft transition-all hover:-translate-y-0.5"
              >
                Book Appointment
              </a>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3.5 shadow-soft transition-all hover:-translate-y-0.5"
              >
                WhatsApp Us
              </a>
              <a
                href={telHref}
                className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-navy-50 text-navy-700 font-semibold px-6 py-3.5 shadow-card ring-1 ring-navy-100 transition-all hover:-translate-y-0.5"
              >
                Call Now
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-navy-700/70"
            >
              <span className="flex items-center gap-2">🎧 Hearing Aids</span>
              <span className="flex items-center gap-2">👂 Audiometry</span>
              <span className="flex items-center gap-2">🗣️ Speech Therapy</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
             <div className="relative rounded-4xl overflow-hidden shadow-soft bg-navy-700 aspect-[4/5] max-w-md mx-auto">
  <img
    src="/audiologist.jpg"
    alt="Audiologist consulting with a patient about hearing aid options"
    className="absolute inset-0 w-full h-full object-cover"
    loading="eager"
  />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/5 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 backdrop-blur px-4 py-3.5 shadow-card">
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wide">Personalised care</p>
                <p className="text-sm font-semibold text-navy-800 mt-0.5">
                  Free hearing aid consultation for first-time visitors
                </p>
              </div>
            </div>
            <div className="hidden sm:flex absolute -left-6 top-8 items-center gap-3 rounded-2xl bg-white shadow-card px-4 py-3">
              <SoundWave bars={5} className="h-6" barClassName="bg-navy-600" />
              <div className="text-xs">
                <p className="font-bold text-navy-800">5.0 Rating</p>
                <p className="text-navy-700/60">Google Reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
