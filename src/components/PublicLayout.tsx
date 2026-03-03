'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { SmartNavigator } from '@/components/SmartNavigator'
import { SectionPagination } from '@/components/SectionPagination'
import { TopInfoBar } from '@/components/TopInfoBar'
import { FloatingCTA } from '@/components/FloatingCTA'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { ShopNavigation } from '@/components/shop/ShopNavigation'
import { ShopFooter } from '@/components/shop/ShopFooter'

// All routes that belong to the Aerotools marketplace (use ShopNavigation instead of LLEDO Industries nav)
const SHOP_PREFIXES = [
  '/boutique',
  '/marketplace',
  '/rfq',
  '/certifications',
  '/traceability',
  '/compliance',
  '/documentation',
  '/support',
  '/dashboard/buyer',
]

function isShopRoute(pathname: string | null): boolean {
  if (!pathname) return false
  return SHOP_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'))
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const isShop = isShopRoute(pathname)

  // Admin pages have their own layout
  if (isAdminPage) {
    return <>{children}</>
  }

  // Aerotools marketplace pages: ShopNavigation + ShopFooter
  if (isShop) {
    // /boutique/* already has its own layout.tsx with ShopNavigation
    // For other shop routes, we wrap them here
    if (pathname?.startsWith('/boutique')) {
      return <>{children}</>
    }

    return (
      <div className="flex flex-col min-h-screen bg-gray-900">
        <ShopNavigation />
        <div className="flex-1 w-full">
          {children}
        </div>
        <ShopFooter />
      </div>
    )
  }

  // Default: LLEDO Industries public layout
  return (
    <div className="flex min-h-screen flex-col">
      <AnalyticsTracker />
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
