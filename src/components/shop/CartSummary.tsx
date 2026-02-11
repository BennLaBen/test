'use client'

import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import type { CartItem } from '@/lib/shop/types'

interface CartSummaryProps {
  items: CartItem[]
  sticky?: boolean
}

export function CartSummary({ items, sticky = true }: CartSummaryProps) {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  if (totalItems === 0) return null

  return (
    <div className={`${sticky ? 'sticky top-28' : ''}`}>
      <div className="bg-gray-800/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-700">
          <ShoppingBag className="h-5 w-5 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-white">Récapitulatif</span>
        </div>

        <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {items.map(item => (
            <div key={item.product.id} className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.product.name}</p>
                <p className="text-[10px] font-mono text-gray-500">{item.product.id}</p>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-900/20 px-2 py-1 rounded flex-shrink-0">
                x{item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-700 mb-5">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Total équipements</span>
          <span className="text-lg font-black text-white">{totalItems}</span>
        </div>

        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-900/20 border border-amber-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Tarification sur devis
          </span>
        </div>

        <Link
          href="/boutique/checkout"
          className="group flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all"
        >
          Demander un devis
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
