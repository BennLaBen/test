'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  // Blur placeholder par défaut
  enableBlur?: boolean
  // Couleur du placeholder blur
  blurColor?: string
}

/**
 * Composant Image optimisé avec:
 * - Lazy loading automatique (sauf priority)
 * - Blur placeholder pendant le chargement
 * - Dimensions width/height obligatoires
 * - Formats WebP/AVIF automatiques via Next.js
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  enableBlur = true,
  blurColor = '#1e293b',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Générer un placeholder blur SVG
  const blurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="${blurColor}"/>
    </svg>`
  ).toString('base64')}`

  // Si erreur, afficher un placeholder
  if (hasError) {
    return (
      <div 
        className={`bg-gray-800 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image non disponible</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder blur pendant le chargement */}
      {enableBlur && !isLoaded && !priority && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: blurColor }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        placeholder={enableBlur ? 'blur' : 'empty'}
        blurDataURL={enableBlur ? blurDataURL : undefined}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${priority ? 'opacity-100' : ''}`}
        {...props}
      />
    </div>
  )
}

/**
 * Composant pour images Hero (chargement prioritaire, pas de lazy)
 */
export function HeroImage({
  src,
  alt,
  width,
  height,
  className = '',
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={true}
      enableBlur={false}
      className={className}
      {...props}
    />
  )
}

/**
 * Composant pour images de contenu (lazy loading)
 */
export function ContentImage({
  src,
  alt,
  width,
  height,
  className = '',
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={false}
      enableBlur={true}
      className={className}
      {...props}
    />
  )
}
