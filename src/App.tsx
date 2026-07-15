import { useEffect, useState } from 'react'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import DomeGallery from './components/Gallery/DomeGallery'
import ExploreByOccasion from './components/ExploreByOccasion/ExploreByOccasion'
import ProductShowcase from './components/ProductShowcase/ProductShowcase'
import Shop from './components/Shop/Shop'
import Footer from './components/Footer/Footer'
import IntroOverlay from './components/Intro/IntroOverlay'
import Intro from './components/Intro/Intro'
import CartDrawer from './components/CartDrawer/CartDrawer'
import { CartProvider } from './components/CartDrawer/CartContext'
import { CategoryProvider } from './context/CategoryContext'
import { useLenis } from './hooks/useLenis'

type BootPhase = 'typography' | 'preloader' | 'ready'

// Hash routing: #/ → home landing, #/shop → shop product listing.
function currentRoute() {
  return window.location.hash.replace(/^#\/?/, '') // '' (home) | 'shop'
}

// Single-page AURUM layout:
//   Intro (typography → preloader) gates the site until 'ready', then:
//   Nav + [ home: Hero / DomeGallery / ExploreByOccasion / ProductShowcase
//           #/shop: Shop ] + Footer + CartDrawer (fixed, above everything)
function App() {
  const [bootPhase, setBootPhase] = useState<BootPhase>('typography')
  const [route, setRoute] = useState(currentRoute())
  useLenis(bootPhase === 'ready')

  useEffect(() => {
    const onHash = () => setRoute(currentRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Reset scroll on page change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  return (
    <CartProvider>
      {bootPhase === 'typography' && (
        <IntroOverlay onComplete={() => setBootPhase('preloader')} />
      )}
      {bootPhase === 'preloader' && (
        <Intro onComplete={() => setBootPhase('ready')} />
      )}

      {/* Mount the main site only once the intro has finished */}
      {bootPhase === 'ready' && (
        <CategoryProvider>
          <Nav />
          {route === 'shop' ? (
            <Shop />
          ) : (
            <>
              <Hero ready={bootPhase === 'ready'} />
              <DomeGallery />
              <ExploreByOccasion />
              <ProductShowcase />
            </>
          )}
          <Footer />
          <CartDrawer />
        </CategoryProvider>
      )}
    </CartProvider>
  )
}

export default App
