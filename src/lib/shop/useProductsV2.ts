'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ShopProduct, ShopCategory } from './types'

interface V2Product {
  id: string
  slug: string
  sku: string
  name: string
  categoryId: string
  category: { id: string; slug: string; label: string; description: string; icon: string }
  description: string
  shortDescription: string
  features: string[]
  specs: Record<string, string>
  tolerances: Record<string, string> | null
  materialsData: Record<string, string> | null
  image: string
  gallery: string[]
  priceDisplay: string | null
  priceNet: number | null
  priceTiers: any | null
  compatibility: string[]
  usage: string[]
  material: string
  inStock: boolean
  stockQuantity: number
  minOrder: number
  leadTime: string | null
  warranty: string | null
  weight: number | null
  dimensions: any | null
  isNew: boolean
  isFeatured: boolean
  published: boolean
  model3d: string | null
  turntable: { enabled: boolean; hFrames: number; vLevels: number; format: string } | null
  boughtTogether: string[]
  faq: { q: string; a: string }[] | null
  certifications: string[]
  standards: string[]
  applications: string[]
  documents: { id: string; type: string; title: string; url: string }[]
  _count: { quoteItems: number }
}

/**
 * Convert a V2 API product to the existing ShopProduct interface
 * so all existing components work without changes
 */
function toShopProduct(p: V2Product): ShopProduct {
  return {
    id: p.sku || p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.slug || '',
    description: p.description,
    shortDescription: p.shortDescription,
    features: p.features,
    specs: p.specs as Record<string, string>,
    image: p.image,
    gallery: p.gallery,
    priceDisplay: p.priceDisplay || 'SUR DEVIS',
    priceRange: 'high' as const,
    compatibility: p.compatibility,
    usage: p.usage,
    material: p.material,
    inStock: p.inStock,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    datasheetUrl: p.documents?.find(d => d.type === 'DATASHEET')?.url || null,
    model3d: p.model3d,
    turntable: p.turntable || undefined,
    certifications: p.certifications,
    standards: p.standards,
    applications: p.applications,
    tolerances: (p.tolerances as Record<string, string>) || undefined,
    materials: (p.materialsData as Record<string, string>) || undefined,
    leadTime: p.leadTime || undefined,
    minOrder: p.minOrder,
    warranty: p.warranty || undefined,
    faq: p.faq || undefined,
    boughtTogether: p.boughtTogether,
  }
}

function toShopCategory(c: { id: string; slug: string; label: string; description: string | null; icon: string | null; count: number }): ShopCategory {
  return {
    id: c.slug,
    label: c.label,
    slug: c.slug,
    description: c.description || '',
    icon: c.icon || 'Package',
    count: c.count,
  }
}

/**
 * Hook that fetches products from the v2 API (Railway PostgreSQL).
 * Returns data in ShopProduct format for backward compatibility.
 */
export function useProductsV2(options?: { category?: string; search?: string; helicopter?: string; featured?: boolean }) {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [categories, setCategories] = useState<ShopCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (options?.category && options.category !== 'all') params.set('category', options.category)
      if (options?.search) params.set('search', options.search)
      if (options?.helicopter) params.set('helicopter', options.helicopter)
      if (options?.featured) params.set('featured', 'true')

      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`/api/v2/products?${params}`),
        fetch('/api/v2/products/categories'),
      ])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      if (productsData.success) {
        setProducts(productsData.data.map(toShopProduct))
        setTotal(productsData.pagination.total)
      } else {
        setError('Erreur chargement produits')
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data.map(toShopCategory))
      }
    } catch (e) {
      console.error('[useProductsV2] Fetch error:', e)
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }, [options?.category, options?.search, options?.helicopter, options?.featured])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, categories, loading, error, total, refetch: fetchProducts }
}

/**
 * Hook to fetch a single product by slug from the v2 API.
 */
export function useProductV2(slugOrId: string) {
  const [product, setProduct] = useState<ShopProduct | null>(null)
  const [related, setRelated] = useState<ShopProduct[]>([])
  const [boughtTogether, setBoughtTogether] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slugOrId) return

    setLoading(true)
    fetch(`/api/v2/products/${encodeURIComponent(slugOrId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProduct(toShopProduct(data.data))
          setRelated((data.related || []).map(toShopProduct))
          setBoughtTogether((data.boughtTogether || []).map(toShopProduct))
        } else {
          setError('Produit introuvable')
        }
      })
      .catch(() => setError('Erreur réseau'))
      .finally(() => setLoading(false))
  }, [slugOrId])

  return { product, related, boughtTogether, loading, error }
}
