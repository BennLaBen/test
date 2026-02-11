'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, Search, ChevronDown, Package, RotateCcw } from 'lucide-react'
import type { ActiveFilters, ShopFilters } from '@/lib/shop/types'
import { defaultFilters } from '@/lib/shop/types'
import { categories } from '@/lib/shop/data'

interface AdvancedFiltersProps {
  filters: ShopFilters
  active: ActiveFilters
  onChange: (filters: ActiveFilters) => void
  resultCount: number
  categoryCounts: Record<string, number>
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-800 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: { id: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
}) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  return (
    <div className="space-y-2">
      {options.map(opt => (
        <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group">
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
            selected.includes(opt.id)
              ? 'bg-blue-600 border-blue-500'
              : 'border-gray-600 group-hover:border-gray-500'
          }`}>
            {selected.includes(opt.id) && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

export function AdvancedFilters({ filters, active, onChange, resultCount, categoryCounts }: AdvancedFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const hasActiveFilters = active.category !== 'all' ||
    active.search !== '' ||
    active.usage.length > 0 ||
    active.material.length > 0 ||
    active.priceRange.length > 0 ||
    active.compatibility !== '' ||
    active.inStockOnly

  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  const filterContent = (
    <div className="space-y-0">
      {/* Search */}
      <div className="pb-4 mb-4 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={active.search}
            onChange={e => onChange({ ...active, search: e.target.value })}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
          />
          {active.search && (
            <button
              onClick={() => onChange({ ...active, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <FilterSection title="Catégorie">
        <div className="space-y-1">
          <button
            onClick={() => onChange({ ...active, category: 'all' })}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${
              active.category === 'all'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span>Tous les produits</span>
            <span className="text-xs text-gray-600">{totalCount}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onChange({ ...active, category: cat.id })}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${
                active.category === cat.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-xs text-gray-600">{categoryCounts[cat.id] || 0}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Usage */}
      <FilterSection title="Usage">
        <CheckboxGroup
          options={filters.usage}
          selected={active.usage}
          onChange={usage => onChange({ ...active, usage })}
        />
      </FilterSection>

      {/* Material */}
      <FilterSection title="Matériau" defaultOpen={false}>
        <CheckboxGroup
          options={filters.material}
          selected={active.material}
          onChange={material => onChange({ ...active, material })}
        />
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Budget" defaultOpen={false}>
        <CheckboxGroup
          options={filters.priceRange}
          selected={active.priceRange}
          onChange={priceRange => onChange({ ...active, priceRange })}
        />
      </FilterSection>

      {/* Compatibility */}
      <FilterSection title="Hélicoptère compatible" defaultOpen={false}>
        <select
          value={active.compatibility}
          onChange={e => onChange({ ...active, compatibility: e.target.value })}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Tous les appareils</option>
          {filters.helicopters.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </FilterSection>

      {/* In Stock */}
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`relative w-10 h-5 rounded-full transition-colors ${
            active.inStockOnly ? 'bg-blue-600' : 'bg-gray-700'
          }`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              active.inStockOnly ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-sm text-gray-300">En stock uniquement</span>
          </div>
        </label>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={() => onChange(defaultFilters)}
          className="mt-4 flex items-center gap-2 w-full justify-center px-4 py-2.5 border border-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:border-gray-600 transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser les filtres
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtres
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-blue-500" />
        )}
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-gray-900 border-r border-gray-800 z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-bold uppercase tracking-wider text-white">Filtres</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-gray-500 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                {filterContent}
              </div>
              <div className="sticky bottom-0 p-4 bg-gray-900 border-t border-gray-800">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-bold uppercase tracking-wider"
                >
                  Voir {resultCount} résultat{resultCount > 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-28 bg-gray-800/20 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Filtres</span>
            </div>
            <span className="text-xs text-gray-500">{resultCount} résultat{resultCount > 1 ? 's' : ''}</span>
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  )
}
