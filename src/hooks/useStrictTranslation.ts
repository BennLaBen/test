'use client'

import { useTranslation, UseTranslationOptions } from 'react-i18next'

/**
 * Hook de traduction strict qui détecte les clés manquantes
 * En développement: log les erreurs et affiche un marqueur visuel
 * En production: retourne la clé (comportement standard)
 */
export function useStrictTranslation(ns?: string, options?: UseTranslationOptions<string>) {
  const { t, i18n, ready } = useTranslation(ns, options)

  const strictT = (key: string, opts?: Record<string, unknown>): string => {
    const result = opts ? t(key, opts as any) : t(key)
    const resultStr = String(result)
    
    // Détecter si la clé est manquante (retourne la clé elle-même)
    const isMissing = resultStr === key || resultStr.startsWith('⚠️')
    
    if (process.env.NODE_ENV === 'development' && isMissing) {
      const namespace = ns || 'common'
      console.error(`🚨 [i18n] Missing translation key: "${key}" in namespace "${namespace}"`)
      
      // Reporter la clé manquante à l'API (optionnel)
      if (typeof window !== 'undefined') {
        fetch('/api/i18n/missing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            key: `${namespace}:${key}`, 
            lang: i18n.language,
            timestamp: new Date().toISOString()
          }),
        }).catch(() => {})
      }
      
      // Retourner un marqueur visuel en dev
      return `⚠️ MISSING: ${key}`
    }
    
    return resultStr
  }

  // Version typée pour les clés connues
  const strictTTyped = <K extends string>(key: K, opts?: Record<string, unknown>): string => {
    return strictT(key, opts)
  }

  return { 
    t: strictT, 
    tTyped: strictTTyped,
    i18n, 
    ready,
    // Helper pour vérifier si une clé existe
    hasKey: (key: string): boolean => {
      const result = String(t(key))
      return result !== key && !result.startsWith('⚠️')
    }
  }
}

export default useStrictTranslation
