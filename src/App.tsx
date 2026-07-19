import { useEffect, useState } from 'react'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import Story from './components/Story/Story'
import Craft from './components/Craft/Craft'
import ClosingCTA from './components/ClosingCTA/ClosingCTA'
import FilmGrain from './components/Ambient/FilmGrain'
import DomeGallery from './components/Gallery/DomeGallery'
import ExploreByOccasion from './components/ExploreByOccasion/ExploreByOccasion'
import TrendingCollections from './components/TrendingCollections/TrendingCollections'
import ProductShowcase from './components/ProductShowcase/ProductShowcase'
import Shop from './components/Shop/Shop'
import Footer from './components/Footer/Footer'
import Intro from './components/Intro/Intro'
import IntroOverlay from './components/Intro/IntroOverlay'
import CartDrawer from './components/CartDrawer/CartDrawer'
import { CartProvider } from './components/CartDrawer/CartContext'
import { CategoryProvider } from './context/CategoryContext'
import { useLenis } from './hooks/useLenis'

// Merged boot phases from both branches
type BootPhase = 'typography' | 'preloader' | 'unveiling' | 'ready'

// Hash routing: #/ → home landing, #/shop → shop product listing.
function currentRoute() {
  return window.location.hash.replace(/^#\/?/, '') // '' (home) | 'shop'
}

function App() {
  const [bootPhase, setBootPhase] = useState<BootPhase>('typography')
  const [route, setRoute] = useState(currentRoute())

  useLenis(bootPhase === 'ready')

  useEffect(() => {
    const onHash = () => setRoute(currentRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Reset scroll position on page change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  return (
    <CartProvider>
      {/* Phase 1: Typography Intro */}
      {bootPhase === 'typography' && (
        <IntroOverlay onComplete={() => setBootPhase('preloader')} />
      )}

      {/* Phase 2 & 3: Main Intro & Unveiling */}
      {(bootPhase === 'preloader' || bootPhase === 'unveiling') && (
        <Intro
          onReveal={() => setBootPhase('unveiling')}
          onComplete={() => setBootPhase('ready')}
        />
      )}

      {/* 
        Always mount the CategoryProvider and layout configuration.
        This preserves the smooth, cinematic "unveiling" move where the 
        hero asset animates behind the leaving intro screen seamlessly.
      */}
      <CategoryProvider>
        <Nav />
        
        {route === 'shop' ? (
          <Shop />
        ) : (
          <>
            {/* The Hero wakes up as soon as we transition into unveiling or ready */}
            <Hero ready={bootPhase === 'unveiling' || bootPhase === 'ready'} />
            <Story />
            <Craft />
            <DomeGallery />
            <TrendingCollections />
            <ExploreByOccasion />
            <ProductShowcase />
            <ClosingCTA />
          </>
        )}
        
        <Footer />
        <CartDrawer />
        <FilmGrain />
      </CategoryProvider>
    </CartProvider>
  )
}

export default App