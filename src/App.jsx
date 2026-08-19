import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import WhyChooseUs from './components/WhyChooseUs'
import EnquiryForm from './components/EnquiryForm'
import QuickConversion from './components/QuickConversion'
import Location from './components/Location'
import Footer from './components/Footer'
import MobileBar from './components/MobileBar'

export default function App() {
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
