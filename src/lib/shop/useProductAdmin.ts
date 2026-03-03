'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ShopProduct } from './types'
import productsData from '@/data/shop/products.json'

const STORAGE_KEY = 'aerotool-admin-products'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateId(category: string): string {
  const prefixes: Record<string, string> = {
    towing: 'BR', handling: 'RL', maintenance: 'MT', gse: 'GSE',
  }
  const prefix = prefixes[category] || 'PRD'
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${rand}`
}

export const emptyProduct: ShopProduct = {
  id: '',
  slug: '',
  name: '',
  category: 'towing',
  description: '',
  shortDescription: '',
  features: [],
  specs: {},
  image: '',
  gallery: [],
  priceDisplay: 'SUR DEVIS',
  priceRange: 'medium',
  compatibility: [],
  usage: [],
  material: 'steel',
  inStock: true,
  isNew: false,
  isFeatured: false,
  datasheetUrl: null,
  certifications: [],
  standards: [],
  applications: [],
  tolerances: {},
  materials: {},
  leadTime: '4 à 8 semaines',
  minOrder: 1,
  warranty: '24 mois',
  faq: [],
  boughtTogether: [],
}

export interface ValidationErrors {
  [key: string]: string
}

export function validateProduct(p: ShopProduct): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!p.name.trim()) errors.name = 'Nom requis'
  if (!p.slug.trim()) errors.slug = 'Slug requis'
  if (!p.category) errors.category = 'Catégorie requise'
  if (!p.description.trim()) errors.description = 'Description requise'
  if (p.name.length > 120) errors.name = 'Nom trop long (max 120 car.)'
  if (!/^[a-z0-9-]+$/.test(p.slug)) errors.slug = 'Slug invalide (a-z, 0-9, tirets)'
  return errors
}

export function useProductAdmin() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load from API (Vercel Blob = source of truth), fallback to localStorage, then static
  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      // 1) Try API (reads from Vercel Blob in prod)
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled && data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products as ShopProduct[])
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.products))
          console.log(`[admin] ✅ ${data.products.length} produits chargés depuis: ${data.source}`)
          setLoaded(true)
          return
        }
      } catch {
        console.warn('[admin] ⚠️ API indisponible, fallback local')
      }

      // 2) Fallback: localStorage cache
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as ShopProduct[]
          if (!cancelled && parsed.length > 0) {
            setProducts(parsed)
            console.log(`[admin] ✅ ${parsed.length} produits chargés depuis: localStorage`)
            setLoaded(true)
            return
          }
        }
      } catch { /* corrupted localStorage */ }

      // 3) Last fallback: static products.json
      if (!cancelled) {
        setProducts(productsData as ShopProduct[])
        console.log(`[admin] ✅ ${(productsData as ShopProduct[]).length} produits chargés depuis: static`)
        setLoaded(true)
      }
    }

    loadProducts()
    return () => { cancelled = true }
  }, [])

  // Sync products to server (Vercel Blob)
  const syncToServer = useCallback((data: ShopProduct[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    fetch('/api/products', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: data }),
    })
      .then(res => res.json())
      .then(r => {
        if (r.success) console.log(`[sync] ✅ ${r.count} produits synchronisés`)
        else console.warn('[sync] ❌ Échec:', r.error)
      })
      .catch(err => console.warn('[sync] ❌ Erreur réseau:', err))
  }, [])

  const addProduct = useCallback((product: ShopProduct) => {
    const newProduct = {
      ...product,
      id: product.id || generateId(product.category),
      slug: product.slug || generateSlug(product.name),
    }
    setProducts(prev => {
      const next = [...prev, newProduct]
      syncToServer(next)
      return next
    })
    return newProduct
  }, [syncToServer])

  const updateProduct = useCallback((id: string, updates: Partial<ShopProduct>) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p)
      syncToServer(next)
      return next
    })
  }, [syncToServer])

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id)
      syncToServer(next)
      return next
    })
  }, [syncToServer])

  const duplicateProduct = useCallback((id: string) => {
    setProducts(prev => {
      const source = prev.find(p => p.id === id)
      if (!source) return prev
      const copy: ShopProduct = {
        ...source,
        id: generateId(source.category),
        slug: source.slug + '-copie',
        name: source.name + ' (copie)',
      }
      const next = [...prev, copy]
      syncToServer(next)
      return next
    })
  }, [syncToServer])

  const reorderProduct = useCallback((id: string, direction: 'up' | 'down') => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === id)
      if (idx === -1) return prev
      const target = direction === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      syncToServer(next)
      return next
    })
  }, [syncToServer])

  const exportJSON = useCallback(() => {
    const json = JSON.stringify(products, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aerotools-products-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [products])

  const importJSON = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString)
      if (!Array.isArray(parsed)) throw new Error('Format invalide')
      setProducts(parsed as ShopProduct[])
      syncToServer(parsed as ShopProduct[])
      return true
    } catch {
      return false
    }
  }, [syncToServer])

  const resetToDefaults = useCallback(() => {
    const defaults = productsData as ShopProduct[]
    setProducts(defaults)
    syncToServer(defaults)
  }, [syncToServer])

  return {
    products, loaded,
    addProduct, updateProduct, deleteProduct, duplicateProduct, reorderProduct,
    exportJSON, importJSON, resetToDefaults,
  }
}
