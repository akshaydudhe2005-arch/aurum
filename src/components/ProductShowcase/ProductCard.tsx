import type { Product } from '@/types'
import ParallaxProductCard from './ParallaxProductCard'
import GalleryProductCard from './GalleryProductCard'

const PARALLAX_CATEGORIES = ['Rings', 'Necklaces']

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product
  index?: number
}) {
  if (PARALLAX_CATEGORIES.includes(product.category)) {
    return <ParallaxProductCard product={product} />
  }
  return <GalleryProductCard product={product} index={index} />
}