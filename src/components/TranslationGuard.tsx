'use client'

import { useEffect, useState } from 'react'
import { getMissingTranslationKeys } from '@/hooks/useStrictTranslation'

/**
 * Composant de garde qui affiche les clés manquantes en développement
 * À placer dans le layout principal pour un monitoring constant
 */
export function TranslationGuard({ children }: { children: React.ReactNode }) {
  const [missingKeys, setMissingKeys] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const isDev = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (!isDev) return

    // Vérifier les clés manquantes toutes les 2 secondes
    const interval = setInterval(() => {
      const keys = getMissingTranslationKeys()
      if (keys.length > 0) {
        setMissingKeys(keys)
        setIsVisible(true)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isDev])

  if (!isDev || missingKeys.length === 0) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      
      {/* Panneau de debug i18n */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            maxWidth: '400px',
            maxHeight: '300px',
            overflow: 'auto',
            backgroundColor: '#1a1a2e',
            border: '2px solid #e74c3c',
            borderRadius: '8px',
            padding: '16px',
            zIndex: 99999,
            fontFamily: 'monospace',
            fontSize: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '12px',
            borderBottom: '1px solid #e74c3c',
            paddingBottom: '8px'
          }}>
            <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
              🚨 {missingKeys.length} clé(s) i18n manquante(s)
            </span>
            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ×
            </button>
          </div>
          
          <ul style={{ 
            margin: 0, 
            padding: '0 0 0 16px',
            color: '#fff'
          }}>
            {missingKeys.map((key, i) => (
              <li key={i} style={{ marginBottom: '4px', wordBreak: 'break-all' }}>
                <code style={{ color: '#f39c12' }}>{key}</code>
              </li>
            ))}
          </ul>

          <div style={{ 
            marginTop: '12px', 
            paddingTop: '8px',
            borderTop: '1px solid #333',
            color: '#888',
            fontSize: '10px'
          }}>
            Exécutez <code style={{ color: '#3498db' }}>npm run i18n:strict:fix</code> pour un rapport complet
          </div>
        </div>
      )}
    </>
  )
}

export default TranslationGuard
