import { useEffect, useRef, useState } from 'react'
import { useCart } from '../CartDrawer/CartContext'
import styles from './TrendingCollections.module.css'

export interface TrendingPiece {
  id: string
  cat: string
  name: string
  desc: string
  price: number
  img: string
}

// Same 12 pieces as the prototype. Swap image URLs / copy for real product data,
// or pass a `pieces` prop instead if this should be reused with different data.
const DEFAULT_PIECES: TrendingPiece[] = [
  { id: 'solstice-halo-ring', cat: 'rings', name: 'Solstice Halo Ring', desc: 'A cluster of warm-toned stones set in hand-worked gold, cast to catch the light from every angle.', price: 48500, img: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&w=1400&q=80' },
  { id: 'aurelia-statement-ring', cat: 'rings', name: 'Aurelia Statement Ring', desc: 'Diamond-studded gold, built for the hand that likes to be noticed across a room.', price: 62000, img: 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?auto=format&fit=crop&w=1400&q=80' },
  { id: 'trio-stack-rings', cat: 'rings', name: 'Trio Stack Rings', desc: 'Three slender gold bands, each finished differently — worn together or apart.', price: 31200, img: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=1400&q=80' },
  { id: 'meridian-chain-necklace', cat: 'necklaces', name: 'Meridian Chain Necklace', desc: 'A weighted gold chain with an architectural clasp — the kind that becomes a daily habit.', price: 54800, img: 'https://images.unsplash.com/photo-1611107683227-e9060eccd846?auto=format&fit=crop&w=1400&q=80' },
  { id: 'solaire-pendant-necklace', cat: 'necklaces', name: 'Solaire Pendant Necklace', desc: 'A single warm pendant on a fine chain, sized to sit just below the collarbone.', price: 39900, img: 'https://images.unsplash.com/photo-1569397288884-4d43d6738fbd?auto=format&fit=crop&w=1400&q=80' },
  { id: 'crown-jewel-necklace', cat: 'necklaces', name: 'Crown Jewel Necklace', desc: 'An ornate centrepiece necklace for evenings that call for a little ceremony.', price: 71400, img: 'https://images.unsplash.com/photo-1685970731194-e27b477e87ba?auto=format&fit=crop&w=1400&q=80' },
  { id: 'cascade-chain-bracelet', cat: 'bracelets', name: 'Cascade Chain Bracelet', desc: 'Layered gold links that move with the wrist instead of sitting stiff against it.', price: 33600, img: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1400&q=80' },
  { id: 'wrist-wrap-bracelet', cat: 'bracelets', name: 'Wrist Wrap Bracelet', desc: 'A close-fitting gold cuff, brushed to a soft matte finish.', price: 41000, img: 'https://images.unsplash.com/photo-1744472457504-f99a96ecbd3e?auto=format&fit=crop&w=1400&q=80' },
  { id: 'rosette-diamond-bracelet', cat: 'bracelets', name: 'Rosette Diamond Bracelet', desc: 'Small diamond clusters set along a delicate gold line, soft enough for every day.', price: 58300, img: 'https://images.unsplash.com/photo-1689397136362-dce64e557fcc?auto=format&fit=crop&w=1400&q=80' },
  { id: 'velvet-drop-earrings', cat: 'earrings', name: 'Velvet Drop Earrings', desc: 'Long gold drops with quiet movement, built for the walk from day into evening.', price: 27500, img: 'https://images.unsplash.com/photo-1758995115555-766abbd9a491?auto=format&fit=crop&w=1400&q=80' },
  { id: 'golden-orb-studs', cat: 'earrings', name: 'Golden Orb Studs', desc: 'Rounded gold studs with real weight to them — the everyday earring done properly.', price: 18900, img: 'https://images.unsplash.com/photo-1761479267937-4c5c7a903760?auto=format&fit=crop&w=1400&q=80' },
  { id: 'meadow-drop-earrings', cat: 'earrings', name: 'Meadow Drop Earrings', desc: 'Textured gold drops, catching light unevenly the way hammered metal always does.', price: 29700, img: 'https://images.unsplash.com/photo-1638854254875-a2416fe0fec2?auto=format&fit=crop&w=1400&q=80' },
]

function formatPrice(price: number) {
  return `₹ ${price.toLocaleString('en-IN')}`
}

interface TrendingCollectionsProps {
  pieces?: TrendingPiece[]
}

function TrendingCollections({ pieces = DEFAULT_PIECES }: TrendingCollectionsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number((entry.target as HTMLElement).dataset.index))
          }
        })
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' }
    )

    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [pieces])

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleQuickAdd = (piece: TrendingPiece) => {
    addItem({
      id: piece.id,
      name: piece.name,
      price: piece.price,
      image: piece.img,
    })
  }

  return (
    <section className={styles.wrapper}>
      <header className={styles.masthead}>
        <div className={styles.wordmark}>Trending Collections</div>
        <div className={styles.tagline}>Pieces everyone&apos;s reaching for right now</div>
      </header>

      <div className={styles.scene}>
        {/* LEFT: sticky image stage */}
        <div className={styles.imagePanel}>
          <div className={styles.imageStack}>
            {pieces.map((p, i) => (
              <img
                key={p.id}
                className={`${styles.stackImg} ${i === activeIndex ? styles.active : ''}`}
                src={p.img}
                alt={p.name}
              />
            ))}
          </div>
          <div className={styles.dots}>
            {pieces.map((p, i) => (
              <button
                key={p.id}
                className={`${styles.dot} ${i === activeIndex ? styles.active : ''}`}
                aria-label={`Go to ${p.name}`}
                onClick={() => scrollToSection(i)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: scrolling story */}
        <div className={styles.storyPanel}>
          {pieces.map((p, i) => (
            <section
              key={p.id}
              ref={(el) => { sectionRefs.current[i] = el }}
              data-index={i}
              className={styles.storySection}
            >
              <div className={styles.mobileImg}>
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>
              <div className={styles.storyCat}>{p.cat}</div>
              <div className={styles.storyName}>{p.name}</div>
              <div className={styles.storyDesc}>{p.desc}</div>
              <div className={styles.storyBottom}>
                <div className={styles.storyPrice}>{formatPrice(p.price)}</div>
                <button className={styles.storyCta} onClick={() => handleQuickAdd(p)}>
                  Quick Add
                </button>
              </div>
            </section>
          ))}

          <div className={styles.endNote}></div>
        </div>
      </div>
    </section>
  )
}

export default TrendingCollections