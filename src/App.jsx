import { useCallback, useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import SpruchDesTages from './components/SpruchDesTages.jsx'
import StatsBar from './components/StatsBar.jsx'
import Features from './components/Features.jsx'
import VideoSection from './components/VideoSection.jsx'
import Trainingsplan from './components/Trainingsplan.jsx'
import Spiel from './components/Spiel.jsx'
import Membership from './components/Membership.jsx'
import Testimonials from './components/Testimonials.jsx'
import Faq from './components/Faq.jsx'
import Footer from './components/Footer.jsx'
import Anmeldung from './components/Anmeldung.jsx'
import { useRevealOnScroll } from './hooks.js'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [tier, setTier] = useState(null)

  useRevealOnScroll()

  const openAnmeldung = useCallback((selectedTier) => {
    setTier(typeof selectedTier === 'string' ? selectedTier : null)
    setModalOpen(true)
  }, [])

  const closeAnmeldung = useCallback(() => setModalOpen(false), [])

  return (
    <>
      <Nav onAnmelden={() => openAnmeldung()} />
      <main>
        <Hero onAnmelden={() => openAnmeldung()} />
        <StatsBar />
        <SpruchDesTages />
        <Features />
        <VideoSection />
        <Trainingsplan />
        <Spiel />
        <Membership onAnmelden={openAnmeldung} />
        <Testimonials />
        <Faq />
      </main>
      <Footer onAnmelden={() => openAnmeldung()} />
      <Anmeldung open={modalOpen} onClose={closeAnmeldung} selectedTier={tier} />
    </>
  )
}
