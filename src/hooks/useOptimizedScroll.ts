'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Debounce function
 */
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function using requestAnimationFrame
 */
function throttleRAF<T extends (...args: unknown[]) => void>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null
  
  return (...args: Parameters<T>) => {
    if (rafId) return
    
    rafId = requestAnimationFrame(() => {
      func(...args)
      rafId = null
    })
  }
}

/**
 * Hook pour scroll optimisé avec debounce (200ms par défaut)
 */
export function useDebounceScroll(
  callback: (scrollY: number) => void,
  delay = 200
) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const debouncedCallback = debounce(() => {
      callback(window.scrollY)
    }, delay)

    window.addEventListener('scroll', debouncedCallback, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', debouncedCallback)
    }
  }, [callback, delay])
}

/**
 * Hook pour scroll optimisé avec requestAnimationFrame
 */
export function useRAFScroll(callback: (scrollY: number) => void) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const throttledCallback = throttleRAF(() => {
      callback(window.scrollY)
    })

    window.addEventListener('scroll', throttledCallback, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledCallback)
    }
  }, [callback])
}

/**
 * Hook pour Intersection Observer (remplace scroll listeners)
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)

  const setRef = useCallback((element: HTMLElement | null) => {
    elementRef.current = element
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting) {
          setHasIntersected(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(elementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return { ref: setRef, isIntersecting, hasIntersected }
}

/**
 * Hook pour animer un élément quand il entre dans le viewport
 * Utilise Intersection Observer au lieu de scroll listeners
 */
export function useAnimateOnScroll(options?: IntersectionObserverInit) {
  const { ref, isIntersecting, hasIntersected } = useIntersectionObserver(options)
  
  return {
    ref,
    shouldAnimate: hasIntersected,
    isVisible: isIntersecting
  }
}

/**
 * Hook pour scroll position avec debounce
 */
export function useScrollPosition(debounceMs = 200) {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = debounce(() => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up')
      }
      
      lastScrollY.current = currentScrollY
      setScrollY(currentScrollY)
    }, debounceMs)

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [debounceMs])

  return { scrollY, scrollDirection }
}

/**
 * Hook pour détecter si l'utilisateur a scrollé au-delà d'un seuil
 */
export function useScrolled(threshold = 20) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = throttleRAF(() => {
      setIsScrolled(window.scrollY > threshold)
    })

    // Vérification initiale
    setIsScrolled(window.scrollY > threshold)

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return isScrolled
}
