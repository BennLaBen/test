'use client'

import { useState, useEffect } from 'react'

/**
 * Hook pour détecter la préférence utilisateur pour les animations réduites
 * et adapter les animations en conséquence
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Vérifier si window est disponible (SSR)
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Définir la valeur initiale
    setPrefersReducedMotion(mediaQuery.matches)

    // Écouter les changements
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Hook pour détecter si on est sur mobile (pour désactiver animations lourdes)
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Vérification initiale
    checkMobile()

    // Debounce sur resize (200ms)
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 200)
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return isMobile
}

/**
 * Hook combiné pour savoir si les animations doivent être désactivées
 */
export function useShouldReduceAnimations(): boolean {
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  
  return prefersReducedMotion || isMobile
}

/**
 * Retourne les props d'animation adaptées selon le contexte
 */
export function useAnimationProps(defaultDuration = 0.3) {
  const shouldReduce = useShouldReduceAnimations()
  
  return {
    duration: shouldReduce ? 0.1 : defaultDuration,
    ease: 'easeOut' as const,
    // Désactiver les animations complexes sur mobile
    animate: shouldReduce ? false : true,
  }
}

/**
 * Variantes Framer Motion optimisées pour mobile
 */
export const mobileOptimizedVariants = {
  // Fade simple (performant)
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  },
  
  // Slide up léger (max 10px)
  slideUp: {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  },
  
  // Scale léger (max 0.95)
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.15, ease: 'easeOut' }
    }
  },
  
  // Stagger pour listes (délai réduit)
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Réduit de 0.1 à 0.05
        delayChildren: 0
      }
    }
  },
  
  // Item de liste
  staggerItem: {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.15, ease: 'easeOut' }
    }
  }
}

/**
 * Variantes désactivées (pour prefers-reduced-motion)
 */
export const noMotionVariants = {
  fadeIn: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0 }
  },
  scaleIn: {
    hidden: { opacity: 1, scale: 1 },
    visible: { opacity: 1, scale: 1 }
  },
  staggerContainer: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  },
  staggerItem: {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0 }
  }
}

/**
 * Hook pour obtenir les variantes appropriées
 */
export function useMotionVariants() {
  const shouldReduce = useShouldReduceAnimations()
  
  return shouldReduce ? noMotionVariants : mobileOptimizedVariants
}
