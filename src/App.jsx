import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import WhyChooseUs from './components/WhyChooseUs'
import EnquiryForm from './components/EnquiryForm'
import QuickConversion from './components/QuickConversion'
import Location from './components/Location'
import Footer from './components/Footer'
import MobileBar from './components/MobileBar'
import AdminApp from './admin/AdminApp'

// Simple hash-based routing — no router dependency needed for a single
// extra "page". Staff visit yoursite.com/#admin to reach the dashboard.
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash
}

function PublicSite() {
  return (
    <div className="min-h-screen bg-sand">
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <EnquiryForm />
        <QuickConversion />
        <Location />
      </main>
      <Footer />
      <MobileBar />
    </div>
  )
}

export default function App() {
  const hash = useHashRoute()

  if (hash.startsWith('#admin')) {
    return <AdminApp />
  }

  return <PublicSite />
}
