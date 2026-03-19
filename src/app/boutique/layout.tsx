'use client'

import { ShopNavigation } from '@/components/shop/ShopNavigation'
import { ShopFooter } from '@/components/shop/ShopFooter'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Redirect all sub-routes to /boutique (maintenance page)
  useEffect(() => {
    if (pathname !== '/boutique') {
      router.replace('/boutique')
    }
  }, [pathname, router])

  // On the main boutique page, no ShopNav/Footer — full screen maintenance
  if (pathname === '/boutique') {
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
