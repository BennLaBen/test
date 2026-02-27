'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { filters as filtersData, filterProducts, getCategoryCounts } from '@/lib/shop/data'
import { useProducts } from '@/lib/shop/useProducts'
import type { ActiveFilters } from '@/lib/shop/types'
import { defaultFilters } from '@/lib/shop/types'
import { ProductCard } from '@/components/shop/ProductCard'
import { AdvancedFilters } from '@/components/shop/AdvancedFilters'
import { Breadcrumbs } from '@/components/shop/Breadcrumbs'
import { Search, LayoutGrid, List } from 'lucide-react'

export default function CataloguePage() {
  const { products } = useProducts()
  const [active, setActive] = useState<ActiveFilters>(defaultFilters)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() => filterProducts(products, active), [products, active])
  const counts = useMemo(() => getCategoryCounts(products), [products])

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Catalogue complet' }]} />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-1">
              Catalogue
            </h1>
            <p className="text-sm text-gray-500">
              {filtered.length} produit{filtered.length > 1 ? 's' : ''} — Outillage aéronautique certifié
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'grid' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'list' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile filter toggle + content */}
        <div className="flex gap-8">
          <AdvancedFilters
            filters={filtersData}
            active={active}
            onChange={setActive}
            resultCount={filtered.length}
            categoryCounts={counts}
          />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length > 0 ? (
              <div className={
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'space-y-4'
              }>
                {filtered.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Search className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-lg font-medium mb-2">Aucun produit trouvé</p>
                <p className="text-gray-600 text-sm">Modifiez vos filtres ou votre recherche.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
