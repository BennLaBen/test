import productsData from '@/data/shop/products.json'
import categoriesData from '@/data/shop/categories.json'
import filtersData from '@/data/shop/filters.json'
import type { ShopProduct, ShopCategory, ShopFilters, ActiveFilters } from './types'

export const products: ShopProduct[] = productsData as ShopProduct[]
export const categories: ShopCategory[] = categoriesData as ShopCategory[]
export const filters: ShopFilters = filtersData as ShopFilters

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return products.find(p => p.slug === slug || p.id === slug)
}

export function getProductsByCategory(categoryId: string): ShopProduct[] {
  if (categoryId === 'all') return products
  return products.filter(p => p.category === categoryId)
}

export function getRelatedProducts(product: ShopProduct, limit = 3): ShopProduct[] {
  return products
    .filter(p => p.id !== product.id && (
      p.category === product.category ||
      p.compatibility.some(c => product.compatibility.includes(c))
    ))
    .slice(0, limit)
}

export function getBoughtTogether(product: ShopProduct): ShopProduct[] {
  if (!product.boughtTogether?.length) return []
  return product.boughtTogether
    .map(id => products.find(p => p.id === id))
    .filter((p): p is ShopProduct => !!p)
}

export function filterProducts(allProducts: ShopProduct[], active: ActiveFilters): ShopProduct[] {
  return allProducts.filter(p => {
    if (active.category !== 'all' && p.category !== active.category) return false

    if (active.search) {
      const q = active.search.toLowerCase()
      const searchable = [
        p.name, p.description, p.shortDescription,
        ...p.compatibility, p.category, p.material,
        ...Object.values(p.specs),
      ].join(' ').toLowerCase()
      if (!searchable.includes(q)) return false
    }

    if (active.usage.length > 0 && !active.usage.some(u => p.usage.includes(u))) return false
    if (active.material.length > 0 && !active.material.includes(p.material)) return false
    if (active.priceRange.length > 0 && !active.priceRange.includes(p.priceRange)) return false

    if (active.compatibility) {
      const q = active.compatibility.toLowerCase()
      if (!p.compatibility.some(c => c.toLowerCase().includes(q))) return false
    }

    if (active.inStockOnly && !p.inStock) return false

    return true
  })
}

export function getCategoryCounts(allProducts: ShopProduct[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const cat of categories) {
    counts[cat.id] = allProducts.filter(p => p.category === cat.id).length
  }
  return counts
}
