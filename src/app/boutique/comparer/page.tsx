'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, ChevronDown, ArrowRight, CheckCircle, XCircle, Minus, Scale, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { ShopProduct } from '@/lib/shop/types'

export default function ComparePage() {
  const [allProducts, setAllProducts] = useState<ShopProduct[]>([])
  const [selected, setSelected] = useState<ShopProduct[]>([])
  const [showPicker, setShowPicker] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v2/products?limit=100')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const mapped = data.data.map((p: any) => ({
            id: p.sku || p.id,
            slug: p.slug,
            name: p.name,
            category: p.category?.slug || '',
            description: p.description,
            shortDescription: p.shortDescription,
            features: p.features,
            specs: p.specs,
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
            datasheetUrl: null,
            certifications: p.certifications || [],
            standards: p.standards || [],
            applications: p.applications || [],
            tolerances: p.tolerances,
            materials: p.materialsData,
            leadTime: p.leadTime,
            minOrder: p.minOrder,
            warranty: p.warranty,
          })) as ShopProduct[]
          setAllProducts(mapped)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const addProduct = (product: ShopProduct, slot: number) => {
    const updated = [...selected]
    updated[slot] = product
    setSelected(updated)
    setShowPicker(null)
    setSearchTerm('')
  }

  const removeProduct = (index: number) => {
    setSelected(selected.filter((_, i) => i !== index))
  }

  const filteredProducts = allProducts.filter(p =>
    !selected.find(s => s?.id === p.id) &&
    (searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.compatibility.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  // Collect all unique spec keys from selected products
  const allSpecKeys = Array.from(new Set(
    selected.flatMap(p => Object.keys(p?.specs || {}))
  ))

  const maxSlots = 3

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Comparateur de produits</h1>
              <p className="text-sm text-gray-400">{selected.length}/{maxSlots} produits sélectionnés</p>
            </div>
          </div>
          <Link href="/boutique/catalogue" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            ← Retour au catalogue
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Product Slots */}
        <div className={`grid gap-4 mb-8 ${selected.length === 0 ? 'grid-cols-1' : selected.length === 1 ? 'grid-cols-1 md:grid-cols-2' : `grid-cols-1 md:grid-cols-${Math.min(selected.length + 1, maxSlots + 1)}`}`}
          style={{ gridTemplateColumns: `repeat(${Math.min(selected.length + (selected.length < maxSlots ? 1 : 0), maxSlots)}, minmax(0, 1fr))` }}
        >
          {selected.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden relative group"
            >
              <button
                onClick={() => removeProduct(index)}
                className="absolute top-3 right-3 z-10 p-1.5 bg-gray-800/80 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-[4/3] bg-gray-800 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />
                {product.isNew && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded uppercase">New</span>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-500 font-mono mb-1">{product.id}</p>
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-1">{product.shortDescription}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {product.compatibility.slice(0, 3).map(c => (
                    <span key={c} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">{c}</span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs font-medium ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                    {product.inStock ? 'En stock' : 'Sur commande'}
                  </span>
                  <Link
                    href={`/boutique/${product.slug}`}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Fiche <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add product slot */}
          {selected.length < maxSlots && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowPicker(selected.length)}
              className="bg-gray-900/50 border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-xl flex flex-col items-center justify-center min-h-[280px] transition-colors group"
            >
              <div className="w-14 h-14 bg-gray-800 group-hover:bg-blue-500/10 rounded-xl flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-6 h-6 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">Ajouter un produit</p>
            </motion.button>
          )}
        </div>

        {/* Comparison Table */}
        {selected.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-semibold text-white">Comparaison détaillée</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium w-48">Caractéristique</th>
                    {selected.map(p => (
                      <th key={p.id} className="text-left px-4 py-3 text-white font-medium">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* SKU */}
                  <tr className="border-b border-gray-800/50">
                    <td className="px-4 py-2.5 text-gray-400">Référence</td>
                    {selected.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-white font-mono text-xs">{p.id}</td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr className="border-b border-gray-800/50">
                    <td className="px-4 py-2.5 text-gray-400">Catégorie</td>
                    {selected.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-gray-300">{p.category}</td>
                    ))}
                  </tr>

                  {/* Compatibility */}
                  <tr className="border-b border-gray-800/50">
                    <td className="px-4 py-2.5 text-gray-400">Compatibilité</td>
                    {selected.map(p => (
                      <td key={p.id} className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {p.compatibility.map(c => (
                            <span key={c} className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">{c}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Specs */}
                  {allSpecKeys.map(key => (
                    <tr key={key} className="border-b border-gray-800/50">
                      <td className="px-4 py-2.5 text-gray-400">{key}</td>
                      {selected.map(p => (
                        <td key={p.id} className="px-4 py-2.5 text-gray-300">
                          {p.specs[key] || <span className="text-gray-600">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* In Stock */}
                  <tr className="border-b border-gray-800/50">
                    <td className="px-4 py-2.5 text-gray-400">Disponibilité</td>
                    {selected.map(p => (
                      <td key={p.id} className="px-4 py-2.5">
                        {p.inStock ? (
                          <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle className="w-3.5 h-3.5" /> En stock</span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-400 text-xs"><XCircle className="w-3.5 h-3.5" /> Sur commande</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Lead Time */}
                  <tr className="border-b border-gray-800/50">
                    <td className="px-4 py-2.5 text-gray-400">Délai</td>
                    {selected.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-gray-300">{p.leadTime || '—'}</td>
                    ))}
                  </tr>

                  {/* Warranty */}
                  <tr className="border-b border-gray-800/50">
                    <td className="px-4 py-2.5 text-gray-400">Garantie</td>
                    {selected.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-gray-300">{p.warranty || '—'}</td>
                    ))}
                  </tr>

                  {/* Certifications */}
                  <tr className="border-b border-gray-800/50">
                    <td className="px-4 py-2.5 text-gray-400">Certifications</td>
                    {selected.map(p => (
                      <td key={p.id} className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(p.certifications || []).map(c => (
                            <span key={c} className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">{c}</span>
                          ))}
                          {(!p.certifications || p.certifications.length === 0) && <span className="text-gray-600">—</span>}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Features count */}
                  <tr className="border-b border-gray-800/50">
                    <td className="px-4 py-2.5 text-gray-400">Caractéristiques</td>
                    {selected.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-gray-300">{p.features.length} features</td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr>
                    <td className="px-4 py-3 text-gray-400 font-medium">Prix</td>
                    {selected.map(p => (
                      <td key={p.id} className="px-4 py-3">
                        <span className="text-white font-semibold">{p.priceDisplay}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-800 bg-gray-800/30">
              <div className="flex gap-3 justify-end">
                <Link
                  href="/boutique/devis"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Demander un devis pour ces produits
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {selected.length < 2 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">
              Sélectionnez au moins <strong className="text-white">2 produits</strong> pour comparer leurs spécifications
            </p>
          </div>
        )}
      </div>

      {/* Product Picker Modal */}
      <AnimatePresence>
        {showPicker !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => { setShowPicker(null); setSearchTerm('') }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[70vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom, référence, hélicoptère..."
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-500"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <p className="text-center text-gray-500 py-10 text-sm">Aucun produit disponible</p>
                ) : (
                  filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => addProduct(product, showPicker)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-lg relative flex-shrink-0">
                        <Image src={product.image} alt="" fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-500 font-mono">{product.id}</span>
                          <span className="text-[10px] text-gray-600">•</span>
                          <div className="flex gap-1">
                            {product.compatibility.slice(0, 2).map(c => (
                              <span key={c} className="text-[10px] text-blue-400">{c}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-gray-500" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
