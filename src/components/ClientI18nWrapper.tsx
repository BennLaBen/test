'use client'

import { useState, useEffect } from 'react'
import { I18nProvider } from '@/components/I18nProvider'

export function ClientI18nWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Éviter les problèmes d'hydratation
  if (!mounted) {
    return null
  }

  // Toujours français par défaut, i18next gère les changements
  return <I18nProvider locale="fr">{children}</I18nProvider>
}

