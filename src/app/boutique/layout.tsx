'use client'

import { ShopNavigation } from '@/components/shop/ShopNavigation'
import { ShopFooter } from '@/components/shop/ShopFooter'
import { usePathname } from 'next/navigation'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Petite astuce pour ajuster le padding top selon la page si besoin
  // Mais ici on garde une structure simple
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <ShopNavigation />
      
      {/* 
        Le RootLayout met déjà un pt-32 sur le main wrapper.
        Pour la boutique, on veut parfois contrôler ce padding nous-mêmes ou l'utiliser.
        Le ShopNavigation est fixed h-20 (approx 80px).
        Le pt-32 du root layout (128px) laisse 48px de marge sous la nav. C'est correct.
      */}
      <div className="flex-1 w-full">
        {children}
      </div>

      <ShopFooter />
    </div>
  )
}
