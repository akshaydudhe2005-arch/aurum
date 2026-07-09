import { useState } from 'react'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import DomeGallery from './components/Gallery/DomeGallery'
import OurPieces from './components/ProductShowcase/OurPieces'
import Footer from './components/Footer/Footer'
import IntroOverlay from './components/Intro/IntroOverlay'
import Intro from './components/Intro/Intro'
import { CategoryProvider } from './context/CategoryContext'
import { useLenis } from './hooks/useLenis'

type BootPhase = 'typography' | 'preloader' | 'ready'

function App() {
  const [bootPhase, setBootPhase] = useState<BootPhase>('typography')
  useLenis(bootPhase === 'ready')

  return (
    <>
      {bootPhase === 'typography' && (
        <IntroOverlay onComplete={() => setBootPhase('preloader')} />
      )}
      {bootPhase === 'preloader' && (
        <Intro onComplete={() => setBootPhase('ready')} />
      )}
      
      {/* CRITICAL FIX: Strictly mount the main site components ONLY when bootPhase is 'ready' */}
      {bootPhase === 'ready' && (
        <CategoryProvider>
          <Nav />
          <Hero ready={bootPhase === 'ready'} />
          <DomeGallery />
          <OurPieces />
          <Footer />
        </CategoryProvider>
      )}
    </>
  )
}

export default App