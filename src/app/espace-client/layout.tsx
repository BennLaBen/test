'use client'

import { AuthProvider } from '@/contexts/AuthContext'

export default function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
