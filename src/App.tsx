import { useState } from 'react'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import Story from './components/Story/Story'
import Craft from './components/Craft/Craft'
import ClosingCTA from './components/ClosingCTA/ClosingCTA'
import FilmGrain from './components/Ambient/FilmGrain'
import DomeGallery from './components/Gallery/DomeGallery'
import ExploreByOccasion from './components/ExploreByOccasion/ExploreByOccasion'
import ProductShowcase from './components/ProductShowcase/ProductShowcase'
import Footer from './components/Footer/Footer'
import Intro from './components/Intro/Intro'
import CartDrawer from './components/CartDrawer/CartDrawer'
import { CartProvider } from './components/CartDrawer/CartContext'
import { CategoryProvider } from './context/CategoryContext'
import { useLenis } from './hooks/useLenis'

type BootPhase = 'typography' | 'preloader' | 'ready'

function App() {
  // boot goes straight to the editorial preloader (Vero-style reference)
  const [bootPhase, setBootPhase] = useState<BootPhase>('preloader')
  useLenis(bootPhase === 'ready')

  return (
    <CartProvider>
      {bootPhase === 'preloader' && (
        <Intro onComplete={() => setBootPhase('ready')} />
      )}
      
      {/* Strictly mount main site components ONLY when bootPhase is 'ready' */}
      {bootPhase === 'ready' && (
        <CategoryProvider>
          <Nav />
          <Hero ready={bootPhase === 'ready'} />
          <Story />
          <Craft />
          <DomeGallery />
          <ExploreByOccasion />
          <ProductShowcase />
          <ClosingCTA />
          <Footer />
          <CartDrawer />
          <FilmGrain />
        </CategoryProvider>
      )}
    </CartProvider>
  )
}

export default App