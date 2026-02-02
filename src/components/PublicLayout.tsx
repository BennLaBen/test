'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { SmartNavigator } from '@/components/SmartNavigator'
import { SectionPagination } from '@/components/SectionPagination'
import { TopInfoBar } from '@/components/TopInfoBar'
import { FloatingCTA } from '@/components/FloatingCTA'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  // Don't show public navigation on admin pages
  if (isAdminPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <TopInfoBar />
      <SmartNavigator />
      <SectionPagination />
      <FloatingCTA />
      <main id="main-content" className="flex-1" style={{ paddingTop: 'var(--content-offset)' }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
