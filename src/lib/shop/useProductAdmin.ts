'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ShopProduct } from './types'
import productsData from '@/data/shop/products.json'

const STORAGE_KEY = 'aerotool-admin-products'
const STORAGE_VERSION_KEY = 'aerotool-admin-version'
const CURRENT_VERSION = '2' // bump to force re-merge with source JSON

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

  // Load from localStorage, merging with source JSON to recover missing fields
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY)

      // If version mismatch, force re-merge to pick up new images/gallery from source
      if (storedVersion !== CURRENT_VERSION) {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION)
      }

      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const storedProducts = JSON.parse(stored) as ShopProduct[]
        const sourceMap = new Map((productsData as ShopProduct[]).map(p => [p.id, p]))
        const merged = storedProducts.map(sp => {
          const source = sourceMap.get(sp.id)
          if (!source) return sp
          return {
            ...source,
            ...sp,
            image: sp.image || source.image || '',
            gallery: (sp.gallery && sp.gallery.length > 0) ? sp.gallery : (source.gallery || []),
          }
        })
        setProducts(merged)
      } else {
        setProducts(productsData as ShopProduct[])
      }
    } catch {
      setProducts(productsData as ShopProduct[])
    }
    setLoaded(true)
  }, [])

  // Persist to localStorage + server API on change
  useEffect(() => {
    if (loaded && products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))

      // Debounced server sync (saves to Vercel Blob in prod, file in dev)
      const timer = setTimeout(() => {
        fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products }),
        }).catch(err => console.warn('[useProductAdmin] Server sync failed:', err))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [products, loaded])

  const addProduct = useCallback((product: ShopProduct) => {
    const newProduct = {
      ...product,
      id: product.id || generateId(product.category),
      slug: product.slug || generateSlug(product.name),
    }
    setProducts(prev => [...prev, newProduct])
    return newProduct
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<ShopProduct>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

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
      return [...prev, copy]
    })
  }, [])

  const reorderProduct = useCallback((id: string, direction: 'up' | 'down') => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === id)
      if (idx === -1) return prev
      const target = direction === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }, [])

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
      return true
    } catch {
      return false
    }
  }, [])

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProducts(productsData as ShopProduct[])
  }, [])

  return {
    products, loaded,
    addProduct, updateProduct, deleteProduct, duplicateProduct, reorderProduct,
    exportJSON, importJSON, resetToDefaults,
  }
}
