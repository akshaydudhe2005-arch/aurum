import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import DomeGallery from './components/Gallery/DomeGallery'
import ProductShowcase from './components/ProductShowcase/ProductShowcase'
import Footer from './components/Footer/Footer'
import Intro from './components/Intro/Intro'
import CartDrawer from './components/CartDrawer/CartDrawer'
import { CartProvider } from './components/CartDrawer/CartContext'
import { useLenis } from './hooks/useLenis'

// Single-page AURUM layout, top to bottom:
//   Intro            → splash/counter intro, plays on every load, then
//                       reveals everything below via a circular wipe
//   Nav + Hero       → the fixed nav over the full-screen hero
//   DomeGallery      → the WebGL photo dome (centrepiece, drag to explore)
//   ProductShowcase  → scrollable product showcase section
//   Footer           → closing footer
//   CartDrawer       → slide-in bag drawer, fixed, sits above everything
function App() {
  useLenis()

  return (
    <CartProvider>
      <Intro />
      <Nav />
      <Hero />
      <DomeGallery />
      <ProductShowcase />
      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}

export default App