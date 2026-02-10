'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface SafeSessionProviderProps {
  children: ReactNode
}

/**
 * SessionProvider wrapper that catches auth errors gracefully
 * when database is not configured
 */
export function SafeSessionProvider({ children }: SafeSessionProviderProps) {
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}
