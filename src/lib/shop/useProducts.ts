'use client'

import { useState, useEffect } from 'react'
import type { ShopProduct } from './types'
import staticProducts from '@/data/shop/products.json'

/**
 * Hook that fetches products from the API (which reads from Vercel Blob in prod
 * or override file in dev). Falls back to static products.json if API fails.
 */
export function useProducts() {
  const [products, setProducts] = useState<ShopProduct[]>(staticProducts as ShopProduct[])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch('/api/products', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (!cancelled && data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products as ShopProduct[])
        }
      })
      .catch(() => {
        // API failed — keep static data
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })

    return () => { cancelled = true }
  }, [])

  return { products, loaded }
}
