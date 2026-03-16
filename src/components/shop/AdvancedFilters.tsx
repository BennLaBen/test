'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, Search, Package, RotateCcw, ChevronDown } from 'lucide-react'
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

// ─── Category icons (inline SVG for zero-dep) ──────────────────────────
const CAT_ICONS: Record<string, string> = {
  towing: '🔗',
  handling: '🛞',
  maintenance: '🔧',
  gse: '⚡',
}

// ─── Chip Toggle ────────────────────────────────────────────────────────
function Chip({ label, active, count, onClick }: { label: string; active: boolean; count?: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
        active
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
          : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-200 border border-gray-700/50'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`text-[10px] ${active ? 'text-blue-200' : 'text-gray-600'}`}>{count}</span>
      )}
    </button>
  )
}

// ─── Collapsible Section ────────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="pb-3 mb-3 border-b border-gray-800/50 last:border-0 last:pb-0 last:mb-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left mb-2.5 group">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">{title}</span>
        <ChevronDown className={`h-3 w-3 text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
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

  // Count active filters for badge
  const activeCount = useMemo(() => {
    let c = 0
    if (active.category !== 'all') c++
    if (active.search) c++
    if (active.compatibility) c++
    c += active.usage.length + active.material.length + active.priceRange.length
    if (active.inStockOnly) c++
    return c
  }, [active])

  // Build active filter tags for easy removal
  const activeTags = useMemo(() => {
    const tags: { label: string; clear: () => void }[] = []
    if (active.category !== 'all') {
      const cat = categories.find(c => c.id === active.category)
      tags.push({ label: cat?.label || active.category, clear: () => onChange({ ...active, category: 'all' }) })
    }
    if (active.compatibility) {
      tags.push({ label: active.compatibility, clear: () => onChange({ ...active, compatibility: '' }) })
    }
    for (const u of active.usage) {
      const opt = filters.usage.find(o => o.id === u)
      tags.push({ label: opt?.label || u, clear: () => onChange({ ...active, usage: active.usage.filter(x => x !== u) }) })
    }
    for (const m of active.material) {
      const opt = filters.material.find(o => o.id === m)
      tags.push({ label: opt?.label || m, clear: () => onChange({ ...active, material: active.material.filter(x => x !== m) }) })
    }
    if (active.inStockOnly) {
      tags.push({ label: 'En stock', clear: () => onChange({ ...active, inStockOnly: false }) })
    }
    return tags
  }, [active, filters, onChange])

  const toggleUsage = (id: string) => {
    onChange({ ...active, usage: active.usage.includes(id) ? active.usage.filter(x => x !== id) : [...active.usage, id] })
  }
  const toggleMaterial = (id: string) => {
    onChange({ ...active, material: active.material.includes(id) ? active.material.filter(x => x !== id) : [...active.material, id] })
  }

  const filterContent = (
    <div className="space-y-0">

      {/* ═══ SEARCH — big & prominent ═══ */}
      <div className="pb-4 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={active.search}
            onChange={e => onChange({ ...active, search: e.target.value })}
            placeholder="Nom, référence, hélicoptère..."
            className="w-full pl-10 pr-9 py-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:bg-gray-800 transition-all"
          />
          {active.search && (
            <button
              onClick={() => onChange({ ...active, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* ═══ ACTIVE FILTER TAGS ═══ */}
      {activeTags.length > 0 && (
        <div className="pb-3 mb-3 border-b border-gray-800/50">
          <div className="flex flex-wrap gap-1.5">
            {activeTags.map((tag, i) => (
              <motion.button
                key={`${tag.label}-${i}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={tag.clear}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/15 border border-blue-500/25 rounded-lg text-[11px] font-medium text-blue-400 hover:bg-red-600/15 hover:border-red-500/25 hover:text-red-400 transition-all group"
              >
                {tag.label}
                <X className="h-2.5 w-2.5 opacity-50 group-hover:opacity-100" />
              </motion.button>
            ))}
            <button
              onClick={() => onChange(defaultFilters)}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-gray-500 hover:text-white transition-colors"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              Tout effacer
            </button>
          </div>
        </div>
      )}

      {/* ═══ HELICOPTER — most important filter for aero clients ═══ */}
      <Section title="Appareil compatible">
        <div className="flex flex-wrap gap-1.5">
          <Chip
            label="Tous"
            active={!active.compatibility}
            onClick={() => onChange({ ...active, compatibility: '' })}
          />
          {filters.helicopters.map(h => (
            <Chip
              key={h}
              label={h}
              active={active.compatibility === h}
              onClick={() => onChange({ ...active, compatibility: active.compatibility === h ? '' : h })}
            />
          ))}
        </div>
      </Section>

      {/* ═══ CATEGORY — visual pills ═══ */}
      <Section title="Type de produit">
        <div className="space-y-1">
          <button
            onClick={() => onChange({ ...active, category: 'all' })}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${
              active.category === 'all'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-semibold'
                : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
            }`}
          >
            <span>Tous les produits</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${active.category === 'all' ? 'bg-blue-600/20 text-blue-300' : 'text-gray-600'}`}>{totalCount}</span>
          </button>
          {categories.map(cat => {
            const count = categoryCounts[cat.id] || 0
            return (
              <button
                key={cat.id}
                onClick={() => onChange({ ...active, category: active.category === cat.id ? 'all' : cat.id })}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${
                  active.category === cat.id
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-semibold'
                    : count === 0 ? 'text-gray-600 cursor-default' : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                }`}
                disabled={count === 0}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{CAT_ICONS[cat.id] || '📦'}</span>
                  {cat.label}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${active.category === cat.id ? 'bg-blue-600/20 text-blue-300' : 'text-gray-600'}`}>{count}</span>
              </button>
            )
          })}
        </div>
      </Section>

      {/* ═══ USAGE — chips ═══ */}
      <Section title="Usage">
        <div className="flex flex-wrap gap-1.5">
          {filters.usage.map(opt => (
            <Chip
              key={opt.id}
              label={opt.label}
              active={active.usage.includes(opt.id)}
              onClick={() => toggleUsage(opt.id)}
            />
          ))}
        </div>
      </Section>

      {/* ═══ MATERIAL — chips ═══ */}
      <Section title="Matériau" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {filters.material.map(opt => (
            <Chip
              key={opt.id}
              label={opt.label}
              active={active.material.includes(opt.id)}
              onClick={() => toggleMaterial(opt.id)}
            />
          ))}
        </div>
      </Section>

      {/* ═══ STOCK TOGGLE ═══ */}
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer group px-1">
          <div className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
            active.inStockOnly ? 'bg-green-600' : 'bg-gray-700'
          }`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
              active.inStockOnly ? 'translate-x-[18px]' : 'translate-x-0.5'
            }`} />
          </div>
          <span className={`text-sm transition-colors ${active.inStockOnly ? 'text-green-400 font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
            En stock uniquement
          </span>
        </label>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-bold shadow-xl shadow-blue-600/30 transition-all"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtrer
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-blue-600 text-[10px] font-black">{activeCount}</span>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-gray-900 border-t border-gray-800 rounded-t-3xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-700" />
              </div>
              <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-bold text-white">Filtres</span>
                  <span className="text-xs text-gray-500">{resultCount} résultat{resultCount > 1 ? 's' : ''}</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-gray-500 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5">
                {filterContent}
              </div>
              <div className="sticky bottom-0 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors"
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
        <div className="sticky top-28 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-5 shadow-xl shadow-black/20">
          {/* Header with result count */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600/15 flex items-center justify-center">
                <SlidersHorizontal className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <span className="text-sm font-bold text-white">Filtres</span>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-800/50 px-2 py-1 rounded-md">
              {resultCount} résultat{resultCount > 1 ? 's' : ''}
            </span>
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  )
}
