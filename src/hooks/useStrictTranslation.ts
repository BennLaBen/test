'use client'

import { useTranslation, UseTranslationOptions } from 'react-i18next'
import { useEffect, useRef } from 'react'

// Mode strict: en production, throw une erreur si clé manquante
const STRICT_MODE = process.env.NEXT_PUBLIC_I18N_STRICT === 'true'
const isDev = process.env.NODE_ENV === 'development'

// Stockage des clés manquantes pour le rapport
const missingKeysSet = new Set<string>()

/**
 * Hook de traduction STRICT qui BLOQUE les clés manquantes
 * 
 * COMPORTEMENT:
 * - DEV: Log console + marqueur visuel rouge + rapport API
 * - PROD (STRICT_MODE=true): Throw Error = page ne se charge pas
 * - PROD (STRICT_MODE=false): Log warning + retourne clé
 * 
 * USAGE:
 * const { t } = useStrictTranslation('namespace')
 * t('key') // Retourne traduction ou ERREUR si manquante
 */
export function useStrictTranslation(ns?: string, options?: UseTranslationOptions<string>) {
  const { t, i18n, ready } = useTranslation(ns, options)
  const reportedKeys = useRef<Set<string>>(new Set())

  // Reporter les clés manquantes à l'API en dev
  useEffect(() => {
    if (isDev && missingKeysSet.size > 0 && typeof window !== 'undefined') {
      const keysToReport = Array.from(missingKeysSet).filter(k => !reportedKeys.current.has(k))
      if (keysToReport.length > 0) {
        keysToReport.forEach(k => reportedKeys.current.add(k))
        fetch('/api/i18n/missing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            keys: keysToReport,
            lang: i18n.language,
            timestamp: new Date().toISOString()
          }),
        }).catch(() => {})
      }
    }
  }, [i18n.language])

  const strictT = (key: string, opts?: Record<string, unknown>): string => {
    const namespace = ns || 'common'
    const fullKey = `${namespace}:${key}`
    
    const result = opts ? t(key, opts as any) : t(key)
    const resultStr = String(result)
    
    // Détecter si la clé est manquante
    const isMissing = resultStr === key || 
                      resultStr.startsWith('⚠️') || 
                      resultStr === '' ||
                      resultStr === fullKey
    
    if (isMissing) {
      missingKeysSet.add(fullKey)
      
      // MODE STRICT EN PRODUCTION: BLOQUER
      if (STRICT_MODE && !isDev) {
        throw new Error(
          `🚨 [i18n] FATAL: Missing translation key "${key}" in namespace "${namespace}" for language "${i18n.language}". ` +
          `Build blocked. Run 'npm run i18n:validate' to see all missing keys.`
        )
      }
      
      // DEV: Log détaillé + marqueur visuel
      if (isDev) {
        console.error(
          `%c🚨 [i18n] MISSING KEY%c\n` +
          `   Namespace: ${namespace}\n` +
          `   Key: ${key}\n` +
          `   Language: ${i18n.language}\n` +
          `   Full path: ${fullKey}`,
          'color: red; font-weight: bold; font-size: 14px;',
          'color: red;'
        )
        return `🔴 MISSING: ${key}`
      }
      
      // PROD sans strict: warning + retourne clé
      console.warn(`[i18n] Missing: ${fullKey} (${i18n.language})`)
      return key
    }
    
    return resultStr
  }

  return { 
    t: strictT, 
    i18n, 
    ready,
    // Helper pour vérifier si une clé existe
    hasKey: (key: string): boolean => {
      const result = String(t(key))
      return result !== key && !result.startsWith('⚠️') && result !== ''
    },
    // Obtenir toutes les clés manquantes détectées
    getMissingKeys: () => Array.from(missingKeysSet),
    // Langue actuelle
    language: i18n.language
  }
}

// Export des clés manquantes pour les tests/rapports
export const getMissingTranslationKeys = () => Array.from(missingKeysSet)
export const clearMissingTranslationKeys = () => missingKeysSet.clear()

export default useStrictTranslation
