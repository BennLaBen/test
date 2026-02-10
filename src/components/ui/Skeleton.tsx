'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  lines?: number
}

/**
 * Composant Skeleton pour loading states
 * Évite les blank screens pendant le chargement
 */
export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'skeleton animate-pulse'
  
  const variantClasses = {
    text: 'skeleton-text h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'skeleton-card rounded-xl',
  }

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  // Pour le variant text avec plusieurs lignes
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses.text)}
            style={{
              ...style,
              width: i === lines - 1 ? '80%' : '100%',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  )
}

/**
 * Skeleton pour une carte complète
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('skeleton-card p-6 space-y-4', className)}>
      {/* Image placeholder */}
      <Skeleton variant="rectangular" height={160} className="w-full" />
      
      {/* Title */}
      <Skeleton variant="text" width="70%" height={24} />
      
      {/* Description */}
      <Skeleton variant="text" lines={3} />
      
      {/* Button */}
      <Skeleton variant="rectangular" height={44} className="w-full mt-4" />
    </div>
  )
}

/**
 * Skeleton pour un avatar avec texte
 */
export function SkeletonAvatar({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
  )
}

/**
 * Skeleton pour une liste d'éléments
 */
export function SkeletonList({ 
  count = 3, 
  className 
}: { 
  count?: number
  className?: string 
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="80%" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton pour le hero
 */
export function SkeletonHero({ className }: { className?: string }) {
  return (
    <div className={cn('min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-6', className)}>
      <Skeleton variant="text" width={200} height={20} />
      <Skeleton variant="text" width="80%" height={48} className="max-w-2xl" />
      <Skeleton variant="text" lines={2} className="max-w-xl w-full" />
      <div className="flex gap-4 mt-4">
        <Skeleton variant="rectangular" width={160} height={52} />
        <Skeleton variant="rectangular" width={160} height={52} />
      </div>
    </div>
  )
}
