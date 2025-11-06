'use client'

import { Wrench, Zap } from 'lucide-react'

interface ProductImagePlaceholderProps {
  productName: string
  category: 'barre-remorquage' | 'roller'
  className?: string
}

export function ProductImagePlaceholder({ 
  productName, 
  category, 
  className = '' 
}: ProductImagePlaceholderProps) {
  const Icon = category === 'barre-remorquage' ? Wrench : Zap
  const bgGradient = category === 'barre-remorquage' 
    ? 'from-primary-50 via-primary-100 to-primary-200 dark:from-primary-900/30 dark:via-primary-800/30 dark:to-primary-700/30'
    : 'from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-blue-700/30'
  
  const iconColor = category === 'barre-remorquage'
    ? 'text-primary-600 dark:text-primary-400'
    : 'text-blue-600 dark:text-blue-400'

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} ${className}`}>
      {/* Pattern de fond */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Cercles décoratifs */}
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />

      {/* Contenu */}
      <div className="relative flex h-full items-center justify-center p-12">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/40 p-8 backdrop-blur-sm dark:bg-white/10">
            <Icon className={`h-24 w-24 ${iconColor}`} strokeWidth={1.5} />
          </div>
          <h3 className={`text-xl font-bold ${iconColor}`}>
            {productName}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {category === 'barre-remorquage' ? 'Barre de remorquage' : 'Roller hydraulique'}
          </p>
        </div>
      </div>

      {/* Badge LLEDO */}
      <div className="absolute bottom-4 right-4 rounded-lg bg-white/80 px-3 py-1.5 backdrop-blur-sm dark:bg-gray-900/80">
        <span className="text-xs font-bold text-gray-900 dark:text-white">LLEDO</span>
      </div>
    </div>
  )
}

