'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Check, Zap, Box } from 'lucide-react'
import { useQuote } from '@/contexts/QuoteContext'
import { useState } from 'react'

interface CardProduct {
  id: string
  name: string
  slug?: string
  category: string
  description: string
  shortDescription?: string
  features: string[]
  specs: Record<string, string>
  image: string
  price_display?: string
  priceDisplay?: string
  compatibility: string[]
  inStock?: boolean
  isNew?: boolean
  model3d?: string | null
}

const categoryLabels: Record<string, string> = {
  towing: 'REMORQUAGE',
  handling: 'MANUTENTION',
  maintenance: 'MAINTENANCE',
  gse: 'GSE',
}

const categoryColors: Record<string, string> = {
  towing: 'from-blue-600 to-blue-800',
  handling: 'from-cyan-600 to-cyan-800',
  maintenance: 'from-amber-600 to-amber-800',
  gse: 'from-purple-600 to-purple-800',
}

export function ProductCard({ product, index = 0 }: { product: CardProduct; index?: number }) {
  const { addItem } = useQuote()
  const [added, setAdded] = useState(false)
  const priceLabel = product.priceDisplay || product.price_display || 'SUR DEVIS'
  const linkSlug = product.slug || product.id

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Adapt to legacy QuoteContext which expects Product with price_display
    addItem({ ...product, price_display: priceLabel } as any)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/boutique/${linkSlug}`} className="group block">
        <div className="relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.15)]">
          {/* Image / Visual Zone */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-800/80 to-gray-900/80 overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            
            {/* HUD corners */}
            <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-blue-500/30 group-hover:border-blue-400/60 transition-colors" />
            <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-blue-500/30 group-hover:border-blue-400/60 transition-colors" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2 border-blue-500/30 group-hover:border-blue-400/60 transition-colors" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 border-blue-500/30 group-hover:border-blue-400/60 transition-colors" />

            {/* Category badge */}
            <div className="absolute top-3 left-3 z-10 ml-6">
              {product.isNew && (
                <span className="mr-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white bg-green-600 rounded-md shadow-lg">
                  NEW
                </span>
              )}
              <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${categoryColors[product.category] || 'from-gray-600 to-gray-800'} rounded-md shadow-lg`}>
                {categoryLabels[product.category] || product.category.toUpperCase()}
              </span>
            </div>

            {/* Product image or placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <svg viewBox="0 0 100 80" fill="none" className="h-28 w-28 text-gray-600 group-hover:text-blue-400/80 transition-colors duration-700">
                    <ellipse cx="50" cy="15" rx="40" ry="3" fill="currentColor" opacity="0.4" />
                    <rect x="48" y="15" width="4" height="12" fill="currentColor" opacity="0.6" />
                    <ellipse cx="40" cy="40" rx="22" ry="18" fill="currentColor" opacity="0.5" />
                    <path d="M55 35 L85 38 L85 42 L55 45 Z" fill="currentColor" opacity="0.4" />
                    <rect x="22" y="58" width="36" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
                  </svg>
                  <div className="absolute inset-0 -m-8 border border-dashed border-blue-500/0 group-hover:border-blue-500/20 rounded-full transition-all duration-700" />
                </motion.div>
              )}
            </div>

            {/* 3D badge */}
            {product.model3d && (
              <div className="absolute top-3 right-3 z-10 mr-6 flex items-center gap-1 px-2 py-1 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-md">
                <Box className="h-3 w-3 text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">3D</span>
              </div>
            )}

            {/* Reference tag */}
            <div className="absolute bottom-3 left-3 ml-6 font-mono text-[10px] text-gray-500 group-hover:text-blue-400/60 transition-colors">
              REF: {product.id}
            </div>

            {/* Scan line effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/5 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-[2000ms]" />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <h3 className="text-sm font-black uppercase text-white mb-2 tracking-wide group-hover:text-blue-300 transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Short desc */}
            <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Compatibility chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.compatibility.slice(0, 3).map((c, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-900/20 border border-blue-500/20 text-blue-300/80 text-[10px] font-bold uppercase rounded">
                  {c}
                </span>
              ))}
              {product.compatibility.length > 3 && (
                <span className="px-2 py-0.5 text-[10px] text-gray-500">
                  +{product.compatibility.length - 3}
                </span>
              )}
            </div>

            {/* Bottom row: price + CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  {priceLabel}
                </span>
              </div>

              <button
                onClick={handleAdd}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  added
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/40 hover:border-blue-400/50'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Ajouté</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Devis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
