import { clinic, telHref, whatsappHref } from '../data/clinicInfo'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-navy-800 text-navy-50/80 pt-14 pb-28 md:pb-14">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Nagar Hearing And Speech Centre logo" className="h-9 w-9 object-contain bg-white rounded-full p-1" />
              <span className="font-display font-bold text-white">{clinic.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy-50/60 max-w-xs">
              Specialist hearing aid, audiometry and speech therapy care for children and adults in Ahilyanagar.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-300 mb-3.5">Services</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#hearing-aids" className="hover:text-white transition-colors">Hearing Aids</a></li>
              <li><a href="#audiometry" className="hover:text-white transition-colors">Audiometry</a></li>
              <li><a href="#speech-therapy" className="hover:text-white transition-colors">Speech Therapy</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-300 mb-3.5">Contact</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href={telHref} className="hover:text-white transition-colors">{clinic.phoneDisplay}</a></li>
              <li><a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Us</a></li>
              <li><a href={`mailto:${clinic.email}`} className="hover:text-white transition-colors">{clinic.email}</a></li>
              <li className="text-navy-50/60">{clinic.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-50/50">
          <p>&copy; {year} {clinic.name}. All rights reserved.</p>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}
