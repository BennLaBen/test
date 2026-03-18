'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ShopProduct } from './types'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateSku(category: string): string {
  const prefixes: Record<string, string> = {
    'barres-remorquage': 'BR', 'rollers-manutention': 'RL',
    'outillage-maintenance': 'MT', 'ground-support': 'GSE',
    towing: 'BR', handling: 'RL', maintenance: 'MT', gse: 'GSE',
  }
  const prefix = prefixes[category] || 'PRD'
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${rand}-01`
}

/**
 * Convert a v2 API product (PostgreSQL) to the ShopProduct interface used by the admin UI
 */
// Map DB category slugs to admin UI category ids
const CATEGORY_SLUG_TO_ID: Record<string, string> = {
  'barres-remorquage': 'towing',
  'rollers-manutention': 'handling',
  'outillage-maintenance': 'maintenance',
  'ground-support': 'gse',
}

const CATEGORY_ID_TO_SLUG: Record<string, string> = {
  'towing': 'barres-remorquage',
  'handling': 'rollers-manutention',
  'maintenance': 'outillage-maintenance',
  'gse': 'ground-support',
}

function apiToShopProduct(p: any): ShopProduct {
  const rawCat = p.category?.slug || p.categoryId || ''
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: CATEGORY_SLUG_TO_ID[rawCat] || rawCat,
    description: p.description || '',
    shortDescription: p.shortDescription || '',
    features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? p.features.split('\n').filter(Boolean) : []),
    specs: typeof p.specs === 'object' && p.specs !== null ? p.specs : {},
    image: p.image || '',
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    priceDisplay: p.priceDisplay || 'SUR DEVIS',
    priceRange: 'high' as const,
    compatibility: Array.isArray(p.compatibility) ? p.compatibility : (typeof p.compatibility === 'string' ? p.compatibility.split(' ').filter(Boolean) : []),
    usage: Array.isArray(p.usage) ? p.usage : (typeof p.usage === 'string' ? p.usage.split(' ').filter(Boolean) : []),
    material: p.material || '',
    inStock: p.inStock ?? true,
    isNew: p.isNew ?? false,
    isFeatured: p.isFeatured ?? false,
    datasheetUrl: p.documents?.find((d: any) => d.type === 'DATASHEET')?.url || null,
    model3d: p.model3d || null,
    turntable: p.turntable || undefined,
    certifications: Array.isArray(p.certifications) ? p.certifications : (typeof p.certifications === 'string' ? p.certifications.split('\n').filter(Boolean) : []),
    standards: Array.isArray(p.standards) ? p.standards : (typeof p.standards === 'string' ? p.standards.split('\n').filter(Boolean) : []),
    applications: Array.isArray(p.applications) ? p.applications : (typeof p.applications === 'string' ? p.applications.split('\n').filter(Boolean) : []),
    tolerances: typeof p.tolerances === 'object' && p.tolerances !== null ? p.tolerances : undefined,
    materials: typeof p.materialsData === 'object' && p.materialsData !== null ? p.materialsData : undefined,
    leadTime: p.leadTime || undefined,
    minOrder: p.minOrder || 1,
    warranty: p.warranty || undefined,
    faq: Array.isArray(p.faq) ? p.faq : undefined,
    boughtTogether: Array.isArray(p.boughtTogether) ? p.boughtTogether : [],
    // Extra fields for admin (store DB id, categoryId, sku)
    _dbId: p.id,
    _categoryId: p.categoryId,
    _sku: p.sku,
  }
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

/** Categories cache (fetched once from DB) */
let categoriesCache: { id: string; slug: string; label: string }[] = []

export function useProductAdmin() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [categories, setCategories] = useState<{ id: string; slug: string; label: string }[]>([])
  const [loaded, setLoaded] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null) // null = checking, true/false = result

  // Load products from Railway PostgreSQL via API v2
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // Check admin session first
        const sessionRes = await fetch('/api/v2/auth/session', { cache: 'no-store' })
        const sessionData = await sessionRes.json()
        const hasAdminSession = sessionData.authenticated && sessionData.user?.role === 'ADMIN'

        if (!cancelled) setIsAdmin(hasAdminSession)

        const [prodRes, catRes] = await Promise.all([
          fetch('/api/v2/products?limit=100&admin=true', { cache: 'no-store' }),
          fetch('/api/v2/products/categories', { cache: 'no-store' }),
        ])

        const prodData = await prodRes.json()
        const catData = await catRes.json()

        if (!cancelled) {
          if (prodData.success && Array.isArray(prodData.data)) {
            setProducts(prodData.data.map(apiToShopProduct))
            console.log(`[admin] ✅ ${prodData.data.length} produits chargés depuis Railway PostgreSQL`)
          }
          if (catData.success && Array.isArray(catData.data)) {
            setCategories(catData.data)
            categoriesCache = catData.data
          }
          setLoaded(true)
        }
      } catch (err) {
        console.error('[admin] ❌ Erreur chargement:', err)
        if (!cancelled) {
          setIsAdmin(false)
          setLoaded(true)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  // Helper: get categoryId from slug
  const getCategoryId = useCallback((slug: string) => {
    const dbSlug = CATEGORY_ID_TO_SLUG[slug] || slug
    const cat = categoriesCache.find(c => c.slug === dbSlug || c.id === dbSlug || c.slug === slug || c.id === slug)
    return cat?.id || slug
  }, [])

  const addProduct = useCallback(async (product: ShopProduct): Promise<{ success: boolean; error?: string }> => {
    const sku = (product as any)._sku || generateSku(product.category)
    const body = {
      name: product.name,
      slug: product.slug || generateSlug(product.name),
      sku,
      categoryId: getCategoryId(product.category),
      description: product.description,
      shortDescription: product.shortDescription,
      image: product.image,
      gallery: product.gallery,
      features: product.features,
      specs: product.specs,
      tolerances: product.tolerances || undefined,
      materialsData: product.materials || undefined,
      priceDisplay: product.priceDisplay,
      compatibility: product.compatibility,
      usage: product.usage,
      material: product.material,
      inStock: product.inStock,
      minOrder: product.minOrder,
      leadTime: product.leadTime,
      warranty: product.warranty,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      published: true,
      model3d: product.model3d,
      turntable: product.turntable || undefined,
      boughtTogether: product.boughtTogether,
      faq: product.faq,
      certifications: product.certifications,
      standards: product.standards,
      applications: product.applications,
    }

    try {
      const res = await fetch('/api/v2/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        const newProd = apiToShopProduct(data.data)
        setProducts(prev => [...prev, newProd])
        console.log(`[admin] ✅ Produit créé en DB: ${newProd.name}`)
        return { success: true }
      } else {
        console.error('[admin] ❌ Erreur création:', data.error)
        return { success: false, error: data.error || 'Erreur inconnue' }
      }
    } catch (err) {
      console.error('[admin] ❌ Erreur réseau:', err)
      return { success: false, error: 'Erreur réseau — impossible de contacter le serveur' }
    }
  }, [getCategoryId])

  const updateProduct = useCallback(async (id: string, updates: Partial<ShopProduct>): Promise<{ success: boolean; error?: string }> => {
    const dbId = (updates as any)._dbId || id
    const body: any = {}

    if (updates.name !== undefined) body.name = updates.name
    if (updates.slug !== undefined) body.slug = updates.slug
    if (updates.description !== undefined) body.description = updates.description
    if (updates.shortDescription !== undefined) body.shortDescription = updates.shortDescription
    if (updates.image !== undefined) body.image = updates.image
    if (updates.gallery !== undefined) body.gallery = updates.gallery
    if (updates.features !== undefined) body.features = updates.features
    if (updates.specs !== undefined) body.specs = updates.specs
    if (updates.tolerances !== undefined) body.tolerances = updates.tolerances
    if (updates.materials !== undefined) body.materialsData = updates.materials
    if (updates.priceDisplay !== undefined) body.priceDisplay = updates.priceDisplay
    if (updates.compatibility !== undefined) body.compatibility = updates.compatibility
    if (updates.usage !== undefined) body.usage = updates.usage
    if (updates.material !== undefined) body.material = updates.material
    if (updates.inStock !== undefined) body.inStock = updates.inStock
    if (updates.minOrder !== undefined) body.minOrder = updates.minOrder
    if (updates.leadTime !== undefined) body.leadTime = updates.leadTime
    if (updates.warranty !== undefined) body.warranty = updates.warranty
    if (updates.isNew !== undefined) body.isNew = updates.isNew
    if (updates.isFeatured !== undefined) body.isFeatured = updates.isFeatured
    if (updates.model3d !== undefined) body.model3d = updates.model3d
    if ((updates as any).turntable !== undefined) body.turntable = (updates as any).turntable
    if (updates.certifications !== undefined) body.certifications = updates.certifications
    if (updates.standards !== undefined) body.standards = updates.standards
    if (updates.applications !== undefined) body.applications = updates.applications
    if (updates.boughtTogether !== undefined) body.boughtTogether = updates.boughtTogether
    if (updates.faq !== undefined) body.faq = updates.faq
    if (updates.category !== undefined) body.categoryId = getCategoryId(updates.category)

    try {
      const res = await fetch(`/api/v2/products/${dbId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        const updated = apiToShopProduct(data.data)
        setProducts(prev => prev.map(p => p.id === id ? updated : p))
        console.log(`[admin] ✅ Produit mis à jour: ${updated.name}`)
        return { success: true }
      } else {
        console.error('[admin] ❌ Erreur mise à jour:', data.error)
        return { success: false, error: data.error || 'Erreur inconnue' }
      }
    } catch (err) {
      console.error('[admin] ❌ Erreur réseau:', err)
      return { success: false, error: 'Erreur réseau — impossible de contacter le serveur' }
    }
  }, [getCategoryId])

  const deleteProduct = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/v2/products/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id))
        console.log(`[admin] ✅ Produit supprimé: ${id}`)
        return { success: true }
      } else {
        console.error('[admin] ❌ Erreur suppression:', data.error)
        return { success: false, error: data.error || 'Erreur inconnue' }
      }
    } catch (err) {
      console.error('[admin] ❌ Erreur réseau suppression:', err)
      return { success: false, error: 'Erreur réseau — impossible de contacter le serveur' }
    }
  }, [])

  const duplicateProduct = useCallback(async (id: string) => {
    const source = products.find(p => p.id === id)
    if (!source) return
    const copy: ShopProduct = {
      ...source,
      id: '',
      slug: source.slug + '-copie',
      name: source.name + ' (copie)',
      _dbId: undefined,
      _sku: generateSku(source.category),
    } as any
    await addProduct(copy)
  }, [products, addProduct])

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

  const importJSON = useCallback((_jsonString: string) => {
    alert('Import JSON désactivé — utilisez l\'admin pour ajouter des produits directement en base.')
    return false
  }, [])

  const resetToDefaults = useCallback(() => {
    alert('Reset désactivé — les produits sont gérés en base de données PostgreSQL.')
  }, [])

  return {
    products, categories, loaded, isAdmin,
    addProduct, updateProduct, deleteProduct, duplicateProduct, reorderProduct,
    exportJSON, importJSON, resetToDefaults,
  }
}
