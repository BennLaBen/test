'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Phone, FileText, Mail } from 'lucide-react'

/**
 * CTA Sticky en bas sur mobile
 * - "Demander un devis" bien visible
 * - Bouton tel: cliquable automatique
 * - Email: mailto: direct
 */
export function MobileStickyFooter() {
  const { t } = useTranslation('common')
  const pathname = usePathname()

  // Ne pas afficher sur certaines pages
  const hiddenPaths = ['/connexion', '/admin', '/espace-client', '/boutique']
  const shouldHide = hiddenPaths.some(path => pathname?.startsWith(path))
  
  if (shouldHide) return null

  return (
    <div 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-t border-blue-500/30"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
        paddingTop: '8px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="container px-4">
        <div className="flex items-center justify-between gap-2">
          {/* Bouton Téléphone - cliquable automatique */}
          <a
            href="tel:+33442029674"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white font-semibold transition-all duration-200 active:scale-95 touch-manipulation"
            style={{ minHeight: '48px' }}
          >
            <Phone className="h-5 w-5 text-green-400" />
            <span className="text-sm hidden xs:inline">{t('cta.call')}</span>
          </a>

          {/* Bouton Email - mailto: direct */}
          <a
            href="mailto:contact@mpeb13.com"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white font-semibold transition-all duration-200 active:scale-95 touch-manipulation"
            style={{ minHeight: '48px' }}
          >
            <Mail className="h-5 w-5 text-blue-400" />
            <span className="text-sm hidden xs:inline">{t('cta.email')}</span>
          </a>

          {/* CTA Principal - Demander un devis */}
          <Link
            href="/contact?type=devis"
            className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-white font-bold uppercase tracking-wide transition-all duration-200 active:scale-95 touch-manipulation"
            style={{ 
              minHeight: '48px',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
            }}
          >
            <FileText className="h-5 w-5" />
            <span className="text-sm">{t('nav.quote')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
