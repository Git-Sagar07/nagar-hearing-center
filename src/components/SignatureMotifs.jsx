import { motion } from 'framer-motion'

/** Animated equalizer-style soundwave bars — the page's recurring signature. */
export function SoundWave({ className = '', barClassName = 'bg-teal-400', bars = 5 }) {
  const heights = [0.35, 0.7, 1, 0.55, 0.8, 0.4, 0.9]
  return (
    <div className={`flex items-end gap-[3px] h-5 ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${barClassName} animate-wave`}
          style={{
            height: `${heights[i % heights.length] * 100}%`,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  )
}

/** Concentric ripple rings echoing the clinic logo's ear/soundwave mark. */
export function RippleRings({ className = '', ringClassName = 'border-teal-400/50' }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <span className={`absolute inset-0 rounded-full border-2 ${ringClassName} animate-ripple1`} />
      <span className={`absolute inset-0 rounded-full border-2 ${ringClassName} animate-ripple2`} />
      <span className={`absolute inset-0 rounded-full border-2 ${ringClassName} animate-ripple3`} />
    </div>
  )
}

/** Section eyebrow label with a small soundwave mark. */
export function Eyebrow({ children, tone = 'teal' }) {
  const toneClass = tone === 'teal' ? 'text-teal-600 bg-teal-50' : 'text-navy-600 bg-navy-50'
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase ${toneClass}`}>
      <SoundWave bars={4} className="h-3" barClassName={tone === 'teal' ? 'bg-teal-500' : 'bg-navy-500'} />
      {children}
    </span>
  )
}

export function FadeIn({ children, delay = 0, y = 18, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
