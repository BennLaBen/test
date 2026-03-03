'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Filter, Package, ArrowRight, CheckCircle, ShoppingBag, Send, ChevronRight, Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductData {
  id: string
  sku: string
  slug: string
  name: string
  shortDescription: string
  image: string
  compatibility: string[]
  category: { slug: string; label: string }
  usage: string[]
  inStock: boolean
  leadTime: string | null
  priceDisplay: string | null
  certifications: string[]
}

const helicopterFamilies = [
  { id: 'H160', name: 'H160', manufacturer: 'Airbus', type: 'civil', image: '/images/products/barre-h160-01.jpg' },
  { id: 'H175', name: 'H175', manufacturer: 'Airbus', type: 'civil', image: '/images/products/barre-h175-01.jpg' },
  { id: 'H125', name: 'H125 Écureuil', manufacturer: 'Airbus', type: 'civil', image: '/images/products/roller-h125.jpg' },
  { id: 'H130', name: 'H130', manufacturer: 'Airbus', type: 'civil', image: '/images/products/roller-h130.jpg' },
  { id: 'AS332', name: 'AS332 Super Puma', manufacturer: 'Airbus', type: 'civil', image: '/images/products/towbar-puma.svg' },
  { id: 'EC225', name: 'EC225 / H225', manufacturer: 'Airbus', type: 'civil', image: '/images/products/towbar-puma.svg' },
  { id: 'H215', name: 'H215', manufacturer: 'Airbus', type: 'civil', image: '/images/products/towbar-puma.svg' },
  { id: 'SA365', name: 'SA365 Dauphin', manufacturer: 'Airbus', type: 'civil', image: '/images/products/towbar-puma.svg' },
  { id: 'NH90', name: 'NH90', manufacturer: 'NHI', type: 'military', image: '/images/products/towbar-nh90.svg' },
  { id: 'Gazelle', name: 'SA341/342 Gazelle', manufacturer: 'Aérospatiale', type: 'military', image: '/images/products/towbar-gazelle.svg' },
  { id: 'AW139', name: 'AW139', manufacturer: 'Leonardo', type: 'civil', image: '/images/products/towbar-puma.svg' },
  { id: 'Panther', name: 'AS565 Panther', manufacturer: 'Airbus', type: 'military', image: '/images/products/towbar-puma.svg' },
]

export default function ConfiguratorPage() {
  const [allProducts, setAllProducts] = useState<ProductData[]>([])
  const [selectedHeli, setSelectedHeli] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'civil' | 'military'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v2/products?limit=100')
      .then(r => r.json())
      .then(data => {
        if (data.success) setAllProducts(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredHelis = useMemo(() => {
    return helicopterFamilies.filter(h => {
      if (filterType !== 'all' && h.type !== filterType) return false
      if (searchTerm && !h.name.toLowerCase().includes(searchTerm.toLowerCase()) && !h.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
  }, [filterType, searchTerm])

  const compatibleProducts = useMemo(() => {
    if (!selectedHeli) return []
    return allProducts.filter(p =>
      p.compatibility.some(c => c.toLowerCase().includes(selectedHeli.toLowerCase()))
    )
  }, [selectedHeli, allProducts])

  // Count products per helicopter
  const heliProductCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const h of helicopterFamilies) {
      counts[h.id] = allProducts.filter(p =>
        p.compatibility.some(c => c.toLowerCase().includes(h.id.toLowerCase()))
      ).length
    }
    return counts
  }, [allProducts])

  // Group compatible products by category
  const groupedProducts = useMemo(() => {
    const groups: Record<string, ProductData[]> = {}
    for (const p of compatibleProducts) {
      const cat = p.category?.label || 'Autre'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(p)
    }
    return groups
  }, [compatibleProducts])

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Configurateur par hélicoptère</h1>
              <p className="text-sm text-gray-400">Trouvez tous les équipements compatibles avec votre appareil</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/boutique/comparer" className="text-sm text-gray-400 hover:text-white transition-colors">
              Comparer
            </Link>
            <Link href="/boutique/catalogue" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Catalogue
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!selectedHeli ? (
            /* ═══ STEP 1: Select Helicopter ═══ */
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
                  {(['all', 'civil', 'military'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        filterType === type ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {type === 'all' ? 'Tous' : type === 'civil' ? 'Civil' : 'Militaire'}
                    </button>
                  ))}
                </div>
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un hélicoptère..."
                    className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Helicopter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredHelis.map((heli, i) => (
                  <motion.button
                    key={heli.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedHeli(heli.id)}
                    className="bg-gray-900 border border-gray-800 hover:border-cyan-500/40 rounded-xl p-5 text-left group transition-all hover:shadow-lg hover:shadow-cyan-500/5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{heli.name}</h3>
                        <p className="text-xs text-gray-500">{heli.manufacturer}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase ${
                        heli.type === 'military'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {heli.type === 'military' ? 'MIL' : 'CIV'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-400">
                        <span className="text-white font-semibold">{heliProductCounts[heli.id] || 0}</span> équipements
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {filteredHelis.length === 0 && (
                <div className="text-center py-20">
                  <Plane className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Aucun hélicoptère ne correspond à votre recherche</p>
                </div>
              )}
            </motion.div>
          ) : (
            /* ═══ STEP 2: Show Compatible Products ═══ */
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Back button + Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <button
                    onClick={() => setSelectedHeli(null)}
                    className="text-sm text-gray-400 hover:text-white mb-2 flex items-center gap-1 transition-colors"
                  >
                    ← Changer d&apos;hélicoptère
                  </button>
                  <h2 className="text-2xl font-bold text-white">
                    Équipements pour{' '}
                    <span className="text-cyan-400">
                      {helicopterFamilies.find(h => h.id === selectedHeli)?.name || selectedHeli}
                    </span>
                  </h2>
                  <p className="text-gray-400 mt-1">{compatibleProducts.length} produits compatibles trouvés</p>
                </div>
                <Link
                  href="/boutique/devis"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Devis global
                </Link>
              </div>

              {compatibleProducts.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Aucun équipement trouvé</h3>
                  <p className="text-gray-400 mb-6">
                    Nous n&apos;avons pas encore d&apos;équipement référencé pour cet hélicoptère.
                  </p>
                  <Link href="/contact" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    Nous contacter pour une demande spécifique
                  </Link>
                </div>
              ) : (
                Object.entries(groupedProducts).map(([category, products]) => (
                  <div key={category} className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-cyan-400" />
                      {category}
                      <span className="text-sm text-gray-500 font-normal">({products.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            href={`/boutique/${product.slug}`}
                            className="block bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl overflow-hidden group transition-colors"
                          >
                            <div className="aspect-[16/9] bg-gray-800 relative">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-3 group-hover:scale-105 transition-transform"
                              />
                              {product.inStock && (
                                <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-semibold rounded-full border border-green-500/20">
                                  <CheckCircle className="w-3 h-3" /> En stock
                                </span>
                              )}
                            </div>
                            <div className="p-4">
                              <p className="text-[10px] text-gray-500 font-mono">{product.sku}</p>
                              <h4 className="font-semibold text-white text-sm mt-1 group-hover:text-cyan-400 transition-colors">{product.name}</h4>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.shortDescription}</p>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                                <span className="text-xs text-gray-400">{product.leadTime || 'Délai sur demande'}</span>
                                <span className="text-xs text-white font-semibold">{product.priceDisplay || 'SUR DEVIS'}</span>
                              </div>
                              {product.certifications?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {product.certifications.slice(0, 3).map(c => (
                                    <span key={c} className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">{c}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
