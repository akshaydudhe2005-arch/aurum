import { useEffect, useRef } from 'react'
import { PRODUCTS } from '@/data/products'
import { CATEGORY_LABELS, useCategory } from '@/context/CategoryContext'
import ProductCard from './SlideProductCard'
import styles from './ProductShowcase.module.css'

const MAX_ROTATE_Y = 62

export default function ProductShowcase() {
  const { categoryLabel, setCategoryLabel } = useCategory()
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const items = PRODUCTS.filter((p) => p.category === categoryLabel)

  const applyWheelTransforms = () => {
    const wrapper = scrollRef.current
    if (!wrapper) return
    const centerX = wrapper.clientWidth / 2
    const scrollLeft = wrapper.scrollLeft

    cardRefs.current.forEach((el) => {
      if (!el) return
      const cardCenter = el.offsetLeft + el.offsetWidth / 2 - scrollLeft
      const offset = cardCenter - centerX
      const ratio = Math.max(-1.6, Math.min(1.6, offset / centerX))
      const absRatio = Math.min(Math.abs(ratio), 1)
      el.style.transform = `translateY(${absRatio * 0}px) rotateY(${-ratio * MAX_ROTATE_Y}deg)`
    })
  }

  useEffect(() => {
    const wrapper = scrollRef.current
    if (!wrapper) return
    applyWheelTransforms()
    const onScroll = () => applyWheelTransforms()
    wrapper.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      wrapper.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [categoryLabel, items.length])

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0, behavior: 'instant' as ScrollBehavior })
    applyWheelTransforms()
  }, [categoryLabel])

  return (
    <section className={`container ${styles.section}`}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Our Pieces</h2>
          <p className={styles.subtitle}>Fine Jewellery</p>
        </div>

        <div className={styles.filters}>
          {CATEGORY_LABELS.map((filter) => (
            <button
              key={filter}
              className={`${styles.filterTab} ${categoryLabel === filter ? styles.active : ''}`}
              onClick={() => setCategoryLabel(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.scrollWrapper} ref={scrollRef}>
        <div className={styles.grid}>
          {items.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => { cardRefs.current[index] = el }}
              className={styles.wheelCardSlot}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
