'use client'

import { usePathname, redirect } from 'next/navigation'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Redirect all sub-routes to the main coming soon page
  if (pathname !== '/boutique') {
    redirect('/boutique')
  }

  return <>{children}</>
}
