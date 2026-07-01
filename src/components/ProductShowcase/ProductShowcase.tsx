import { useState } from 'react'
import { PRODUCTS } from '@/data/products'
import type { Product } from '@/types'
import ProductCard from './ProductCard'
import styles from './ProductShowcase.module.css'

const FILTERS = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings']

export default function ProductShowcase() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered: Product[] =
    activeFilter === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeFilter)

  return (
    <section className={`section container ${styles.section}`}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Our Pieces</h2>
          <p className={styles.subtitle}>Fine Jewellery</p>
        </div>

        <div className={styles.filters}>
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`${styles.filterTab} ${activeFilter === filter ? styles.active : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.scrollWrapper}>
        <div className={styles.grid}>
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}