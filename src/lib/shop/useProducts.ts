'use client'

import { useState, useEffect } from 'react'
import type { ShopProduct } from './types'
import staticProducts from '@/data/shop/products.json'

// Map DB category slugs to UI category ids
const CATEGORY_SLUG_TO_ID: Record<string, string> = {
  'barres-remorquage': 'towing',
  'rollers-manutention': 'handling',
  'outillage-maintenance': 'maintenance',
  'ground-support': 'gse',
}

/**
 * Convert a v2 API product to the existing ShopProduct interface
 */
function toShopProduct(p: any): ShopProduct {
  const rawCat = p.category?.slug || p.categoryId || ''
  return {
    id: p.sku || p.id,
    slug: p.slug,
    name: p.name,
    category: CATEGORY_SLUG_TO_ID[rawCat] || rawCat,
    description: p.description || '',
    shortDescription: p.shortDescription || '',
    features: p.features || [],
    specs: p.specs || {},
    image: p.image || '',
    gallery: p.gallery || [],
    priceDisplay: p.priceDisplay || 'SUR DEVIS',
    priceRange: 'high' as const,
    compatibility: p.compatibility || [],
    usage: p.usage || [],
    material: p.material || '',
    inStock: p.inStock ?? true,
    isNew: p.isNew ?? false,
    isFeatured: p.isFeatured ?? false,
    datasheetUrl: p.documents?.find((d: any) => d.type === 'DATASHEET')?.url || null,
    model3d: p.model3d || null,
    turntable: p.turntable || undefined,
    certifications: p.certifications || [],
    standards: p.standards || [],
    applications: p.applications || [],
    tolerances: p.tolerances || undefined,
    materials: p.materialsData || undefined,
    leadTime: p.leadTime || undefined,
    minOrder: p.minOrder || 1,
    warranty: p.warranty || undefined,
    faq: p.faq || undefined,
    boughtTogether: p.boughtTogether || [],
  }
}

/**
 * Hook that fetches products from the v2 API (Railway PostgreSQL).
 * Falls back to static products.json if API fails.
 */
export function useProducts() {
  const [products, setProducts] = useState<ShopProduct[]>(staticProducts as ShopProduct[])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch('/api/v2/products?limit=100', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (!cancelled && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data.map(toShopProduct))
          console.log(`[boutique] ✅ ${data.data.length} produits chargés depuis Railway PostgreSQL`)
        } else {
          console.warn('[boutique] ⚠️ API v2 pas de données, fallback statique')
        }
      })
      .catch((err) => {
        console.warn('[boutique] ❌ API v2 erreur, fallback statique:', err)
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })

    return () => { cancelled = true }
  }, [])

  return { products, loaded }
}
