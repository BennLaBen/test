'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Building2, Briefcase, Users, FileText, Phone, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'

interface NavItem {
  key: string
  href: string
  icon?: React.ReactNode
}

interface NavSection {
  id: string
  titleKey: string
  icon: React.ReactNode
  items: NavItem[]
  // Si true, c'est un lien direct sans sous-menu
  directLink?: string
}

// Structure de navigation par sections - 100% des liens accessibles
const mobileNavSections: NavSection[] = [
  {
    id: 'home',
    titleKey: 'nav.home',
    icon: <Home className="h-5 w-5" />,
    items: [],
    directLink: '/'
  },
  {
    id: 'entreprise',
    titleKey: 'mobileNav.entreprise',
    icon: <Building2 className="h-5 w-5" />,
    items: [
      { key: 'nav.vision', href: '/notre-vision' },
      { key: 'mobileNav.mpeb', href: '/societes/mpeb' },
      { key: 'mobileNav.egi', href: '/societes/egi' },
      { key: 'mobileNav.frem', href: '/societes/frem' },
      { key: 'mobileNav.mgp', href: '/societes/mgp' },
    ]
  },
  {
    id: 'services',
    titleKey: 'mobileNav.services',
    icon: <Briefcase className="h-5 w-5" />,
    items: [
      { key: 'nav.expertises', href: '/nos-expertises' },
      { key: 'nav.caseStudies', href: '/cas-clients' },
      { key: 'mobileNav.aerotools', href: '/aerotools' },
      { key: 'mobileNav.brochure', href: '/plaquette' },
    ]
  },
  {
    id: 'recrutement',
    titleKey: 'mobileNav.recrutement',
    icon: <Users className="h-5 w-5" />,
    items: [
      { key: 'nav.careers', href: '/carriere' },
      { key: 'mobileNav.offres', href: '/carriere#offres' },
      { key: 'mobileNav.candidature', href: '/carriere#postuler' },
    ]
  },
  {
    id: 'blog',
    titleKey: 'nav.blog',
    icon: <FileText className="h-5 w-5" />,
    items: [],
    directLink: '/blog'
  },
]

interface MobileMenuAccordionProps {
  onClose: () => void
  isActive: (href: string) => boolean
}

export function MobileMenuAccordion({ onClose, isActive }: MobileMenuAccordionProps) {
  const { t } = useTranslation('common')
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const isSectionOpen = (sectionId: string) => openSections.includes(sectionId)

  // Vérifier si une section contient la page active
  const sectionHasActiveItem = (section: NavSection) => {
    if (section.directLink) return isActive(section.directLink)
    return section.items.some(item => isActive(item.href))
  }

  return (
    <nav className="space-y-2" aria-label="Navigation principale">
      {mobileNavSections.map((section, sectionIndex) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 * sectionIndex }}
        >
          {/* Lien direct ou accordéon */}
          {section.directLink ? (
            // Lien direct (Accueil, Blog)
            <Link
              href={section.directLink}
              onClick={onClose}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all active:scale-[0.98] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isActive(section.directLink)
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 border-2 border-blue-400/50'
                  : 'bg-gray-800/30 border-2 border-gray-700/50 active:border-blue-400/50 active:bg-blue-600/10'
              }`}
              style={{
                WebkitTapHighlightColor: 'transparent',
                minHeight: '56px',
                ...(isActive(section.directLink) && {
                  boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)'
                })
              }}
            >
              <span className={isActive(section.directLink) ? 'text-white' : 'text-blue-400'}>
                {section.icon}
              </span>
              <span className={`text-base font-bold uppercase tracking-wide ${
                isActive(section.directLink) ? 'text-white' : 'text-gray-200'
              }`}>
                {t(section.titleKey)}
              </span>
              {isActive(section.directLink) && (
                <span className="ml-auto w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          ) : (
            // Accordéon avec sous-items
            <div className="rounded-xl overflow-hidden border-2 border-gray-700/50 bg-gray-800/20">
              {/* Header de l'accordéon */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 transition-all active:scale-[0.99] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset ${
                  sectionHasActiveItem(section) ? 'bg-blue-600/10' : ''
                }`}
                style={{ WebkitTapHighlightColor: 'transparent', minHeight: '56px' }}
                aria-expanded={isSectionOpen(section.id)}
                aria-controls={`section-${section.id}`}
              >
                <span className={sectionHasActiveItem(section) ? 'text-blue-400' : 'text-blue-400/70'}>
                  {section.icon}
                </span>
                <span className={`text-base font-bold uppercase tracking-wide flex-1 text-left ${
                  sectionHasActiveItem(section) ? 'text-white' : 'text-gray-200'
                }`}>
                  {t(section.titleKey)}
                </span>
                <motion.span
                  animate={{ rotate: isSectionOpen(section.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.span>
              </button>

              {/* Contenu de l'accordéon */}
              <AnimatePresence>
                {isSectionOpen(section.id) && (
                  <motion.div
                    id={`section-${section.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <Link
                          key={item.key}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all active:scale-[0.98] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            isActive(item.href)
                              ? 'bg-blue-600/30 text-white border-l-4 border-blue-400'
                              : 'text-gray-300 hover:bg-gray-700/30 active:bg-blue-600/20 border-l-4 border-transparent'
                          }`}
                          style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                        >
                          <span className={`text-sm font-semibold ${
                            isActive(item.href) ? 'text-white' : 'text-gray-300'
                          }`}>
                            {t(item.key)}
                          </span>
                          {isActive(item.href) && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-blue-400" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      ))}
    </nav>
  )
}
