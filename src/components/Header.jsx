import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clinic, telHref, whatsappHref } from '../data/clinicInfo'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Hearing Aids', href: '#hearing-aids' },
  { label: 'Speech Therapy', href: '#speech-therapy' },
  { label: 'Audiometry', href: '#audiometry' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-soft' : 'bg-white/40 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.png" alt="Nagar Hearing And Speech Centre logo" className="h-9 w-9 md:h-11 md:w-11 object-contain" />
            <span className="font-display font-bold text-navy-700 leading-tight text-sm md:text-base">
              Nagar Hearing
              <span className="block text-teal-600 text-[11px] md:text-xs font-semibold tracking-wide">
                &amp; Speech Centre
              </span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-navy-700/80 hover:text-teal-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={telHref}
              className="text-sm font-semibold text-navy-700 hover:text-teal-600 transition-colors"
            >
              {clinic.phoneDisplay}
            </a>
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2 rounded-full bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold px-5 py-2.5 shadow-soft transition-colors"
            >
              Book Appointment
            </a>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <a
              href={telHref}
              aria-label="Call clinic"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-navy-600 text-white"
            >
              <PhoneIcon />
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp clinic"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-500 text-white"
            >
              <WhatsAppIcon />
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-navy-50 text-navy-700"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-t border-navy-50"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-navy-700 font-semibold text-[15px] border-b border-navy-50 last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#enquiry"
                onClick={() => setMenuOpen(false)}
                className="mt-3 text-center rounded-full bg-navy-600 text-white font-semibold py-3"
              >
                Book Appointment
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.02 2C6.5 2 2 6.5 2 12.02c0 1.85.5 3.65 1.44 5.24L2 22l4.85-1.4A9.96 9.96 0 0 0 12.02 22C17.53 22 22 17.5 22 11.98 22 6.5 17.53 2 12.02 2zm0 18.13c-1.72 0-3.4-.46-4.87-1.34l-.35-.21-3.05.88.9-2.98-.23-.36a8.13 8.13 0 0 1-1.28-4.14c0-4.5 3.65-8.15 8.16-8.15s8.15 3.65 8.15 8.15-3.65 8.15-8.15 8.15z" />
    </svg>
  )
}
function MenuIcon({ open }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
  )
}
