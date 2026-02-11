'use client'

import { motion } from 'framer-motion'
import { Wrench, GitFork, Settings, LayoutGrid, Truck } from 'lucide-react'

const categories = [
  { id: 'all', label: 'Tous', icon: LayoutGrid },
  { id: 'towing', label: 'Remorquage', icon: GitFork },
  { id: 'handling', label: 'Manutention', icon: Wrench },
  { id: 'maintenance', label: 'Maintenance', icon: Settings },
  { id: 'gse', label: 'GSE', icon: Truck },
]

interface CategoryFilterProps {
  active: string
  onChange: (cat: string) => void
  counts?: Record<string, number>
}

export function CategoryFilter({ active, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {categories.map((cat) => {
        const Icon = cat.icon
        const isActive = active === cat.id
        const count = cat.id === 'all' 
          ? counts ? Object.values(counts).reduce((a, b) => a + b, 0) : undefined
          : counts?.[cat.id]

        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(cat.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600 hover:text-gray-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{cat.label}</span>
            {count !== undefined && (
              <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${
                isActive ? 'bg-blue-500/50 text-blue-100' : 'bg-gray-700 text-gray-500'
              }`}>
                {count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-blue-600 rounded-xl -z-10"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
